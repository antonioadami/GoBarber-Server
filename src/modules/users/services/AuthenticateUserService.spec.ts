import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('shoud be able to authenticate', async () => {
        const email = 'teste@teste.com';
        const password = 'Teste1234';

        const user = await createUser.execute({
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

        await createUser.execute({
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

        await createUser.execute({
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
