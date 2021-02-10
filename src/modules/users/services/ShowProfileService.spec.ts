import AppError from '@shared/errors/AppError';
import 'reflect-metadata';
import { v4 } from 'uuid';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        showProfile = new ShowProfileService(fakeUsersRepository);
    });

    it('shoud be able to show the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Nome teste',
            email: 'teste@teste.com',
            password: 'Teste1234',
        });

        const getUser = await showProfile.execute(user.id);

        expect(getUser.id).toBe(user.id);
    });

    it('shoud be able to show the profile of non-existing user', async () => {
        await expect(showProfile.execute(v4())).rejects.toBeInstanceOf(
            AppError,
        );
    });
});
