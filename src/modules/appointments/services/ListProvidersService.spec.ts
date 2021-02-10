import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        listProviders = new ListProvidersService(fakeUsersRepository);
    });

    it('shoud be able to list the providers', async () => {
        const fulano = await fakeUsersRepository.create({
            name: 'Fulano',
            email: 'fulano@teste.com',
            password: 'Teste1234',
        });

        const ciclano = await fakeUsersRepository.create({
            name: 'Ciclano',
            email: 'ciclano@teste.com',
            password: 'Teste1234',
        });

        const loggedUser = await fakeUsersRepository.create({
            name: 'Logado',
            email: 'logado@teste.com',
            password: 'Teste1234',
        });

        const providers = await listProviders.execute(loggedUser.id);

        expect(providers).toEqual([fulano, ciclano]);
    });
});
