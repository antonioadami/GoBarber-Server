import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUser', () => {
    it('shoud be able to create a new user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const user = await createUser.execute({
            name: 'Nome teste',
            email: 'teste@teste.com',
            password: 'Teste1234',
        });

        expect(user).toHaveProperty('id');
    });

    it('shoud not be able to create two users with same email', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await createUser.execute({
            name: 'Nome teste',
            email: 'teste@teste.com',
            password: 'Teste1234',
        });

        expect(
            createUser.execute({
                name: 'Nome teste',
                email: 'teste@teste.com',
                password: 'Teste1234',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
