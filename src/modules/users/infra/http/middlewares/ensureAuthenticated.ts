import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

interface ITokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticate(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const auth = request.headers.authorization;

    if (!auth) {
        throw new AppError('JWT token not provided', 401);
    }

    const [, token] = auth.split(' ');

    const { secret } = authConfig.token;

    try {
        const decoded: ITokenPayload = verify(token, secret);

        request.user = { id: decoded.sub };

        return next();
    } catch {
        throw new AppError('Invalid JWT token', 401);
    }
}
