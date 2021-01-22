import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import { v4 } from 'uuid';

import IUserTokensRepository from '../IUserTokensRepository';

export default class FakeUserTokensRepository implements IUserTokensRepository {
    private userTokens: UserToken[] = [];

    public async generate(user_id: string): Promise<UserToken> {
        const userToken = new UserToken();

        Object.assign(userToken, {
            id: v4(),
            user_id,
            token: v4(),
        });

        this.userTokens.push(userToken);

        return userToken;
    }
}
