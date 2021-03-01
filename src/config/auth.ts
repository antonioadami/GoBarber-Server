interface ITokenConfig {
    token: {
        secret: string;
        expiresIn: string;
    };
}

export default {
    token: {
        secret: process.env.TOKEN_SECRET || 'default',
        expiresIn: '1d',
    },
} as ITokenConfig;
