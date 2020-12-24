import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';

import AppError from '../errors/AppError';

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

export default class AuthenticateUserService {
    public async execute({ email, password }: Request): Promise<Response> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne({
            where: { email },
        });

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
