import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;

let createUser: CreateUserService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
    });

    it('shoud be able to create a new user', async () => {
        const user = await createUser.execute({
            name: 'Nome teste',
            email: 'teste@teste.com',
            password: 'Teste1234',
        });

        expect(user).toHaveProperty('id');
    });

    it('shoud not be able to create two users with same email', async () => {
        await createUser.execute({
            name: 'Nome teste',
            email: 'teste@teste.com',
            password: 'Teste1234',
        });

        await expect(
            createUser.execute({
                name: 'Nome teste',
                email: 'teste@teste.com',
                password: 'Teste1234',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
