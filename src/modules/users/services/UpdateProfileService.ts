import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
export default class UpdateProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({
        user_id,
        name,
        email,
        password,
        old_password,
    }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not found');
        }

        const emailExists = await this.usersRepository.findByEmail(email);
        if (emailExists && emailExists.id !== user_id) {
            throw new AppError('Provided email already in use');
        }

        user.name = name;
        user.email = email;

        if (password) {
            if (!old_password) {
                throw new AppError('Old password must be provided');
            }

            const checkOldPassword = await this.hashProvider.verify(
                old_password,
                user.password,
            );

            if (!checkOldPassword) {
                throw new AppError(
                    'The provided old password is different than the real one',
                );
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.update(user);
    }
}
