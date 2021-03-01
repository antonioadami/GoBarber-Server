import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('shoud be able to authenticate', async () => {
        const email = 'teste@teste.com';
        const password = 'Teste1234';

        const user = await fakeUsersRepository.create({
            name: 'Nome teste',
            email,
            password,
        });

        const authenticated = await authenticateUser.execute({
            email,
            password,
        });

        expect(authenticated).toHaveProperty('token');
        expect(authenticated.user).toEqual(user);
    });

    it('shoud not be able to authenticate with wrong email', async () => {
        const email = 'teste@teste.com';
        const wrongEmail = 'teste@teste.com.br';
        const password = 'Teste1234';

        await fakeUsersRepository.create({
            name: 'Nome teste',
            email,
            password,
        });

        await expect(
            authenticateUser.execute({
                email: wrongEmail,
                password,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('shoud not be able to authenticate with wrong password', async () => {
        const email = 'teste@teste.com';
        const password = 'Teste1234';
        const wrongPassword = 'Teste1234567';

        await fakeUsersRepository.create({
            name: 'Nome teste',
            email,
            password,
        });

        await expect(
            authenticateUser.execute({
                email,
                password: wrongPassword,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
