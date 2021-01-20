import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('AuthenticateUser', () => {
    it('shoud be able to authenticate', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

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
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const email = 'teste@teste.com';
        const wrongEmail = 'teste@teste.com.br';
        const password = 'Teste1234';

        await createUser.execute({
            name: 'Nome teste',
            email,
            password,
        });

        expect(
            authenticateUser.execute({
                email: wrongEmail,
                password,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('shoud not be able to authenticate with wrong password', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        const authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const email = 'teste@teste.com';
        const password = 'Teste1234';
        const wrongPassword = 'Teste1234567';

        await createUser.execute({
            name: 'Nome teste',
            email,
            password,
        });

        expect(
            authenticateUser.execute({
                email,
                password: wrongPassword,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
