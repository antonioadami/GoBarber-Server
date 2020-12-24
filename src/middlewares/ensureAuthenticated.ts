import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '../errors/AppError';

interface TokenPayload {
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

    try {
        const decoded: TokenPayload = verify(token, process.env.TOKEN_SECRET);

        request.user = { id: decoded.sub };

        return next();
    } catch {
        throw new AppError('Invalid JWT token', 401);
    }
}
