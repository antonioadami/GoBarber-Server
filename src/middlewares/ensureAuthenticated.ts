import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

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
        throw new Error('JWT token not provided');
    }

    const [, token] = auth.split(' ');

    try {
        const decoded: TokenPayload = verify(token, process.env.TOKEN_SECRET);

        request.user = { id: decoded.sub };

        return next();
    } catch {
        throw new Error('Invalid JWT token');
    }
}
