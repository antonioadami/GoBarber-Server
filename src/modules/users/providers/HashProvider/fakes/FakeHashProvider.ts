import IHashProvider from '../models/IHashProvider';

export default class FakeHashProvider implements IHashProvider {
    public async generateHash(payload: string): Promise<string> {
        return payload;
    }

    public async verify(payload: string, hashed: string): Promise<boolean> {
        return payload === hashed;
    }
}
