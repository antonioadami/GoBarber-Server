import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

export default class AuthenticateUserService {
    constructor(private usersRepository: IUsersRepository) {}

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        if (!(await compare(password, user.password))) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        const secret = process.env.TOKEN_SECRET;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn: process.env.TOKEN_EXPIRES_IN,
        });

        return { user, token };
    }
}
