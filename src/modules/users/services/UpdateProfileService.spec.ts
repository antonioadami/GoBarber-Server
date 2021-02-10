import 'reflect-metadata';
import { v4 } from 'uuid';

import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let updateProfile: UpdateProfileService;

describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfile = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('shoud be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Nome teste',
            email: 'teste@teste.com',
            password: 'Teste1234',
        });

        const newName = 'Mudando nome';
        const newEmail = 'mudando@teste.com';

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: newName,
            email: newEmail,
        });

        expect(updatedUser.name).toBe(newName);
        expect(updatedUser.email).toBe(newEmail);
    });

    it('shoud not be able to update non-existing user', async () => {
        await expect(
            updateProfile.execute({
                user_id: v4(),
                name: 'Um Nome',
                email: 'teste@teste.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('shoud not be able to change to another user email', async () => {
        const firstUser = await fakeUsersRepository.create({
            name: 'Primeiro usuário',
            email: 'primeiro@teste.com',
            password: 'Teste1234',
        });

        const secondUser = await fakeUsersRepository.create({
            name: 'Segundo usuário',
            email: 'segundo@teste.com',
            password: 'Teste1234',
        });

        await expect(
            updateProfile.execute({
                user_id: firstUser.id,
                name: 'Outro nome',
                email: secondUser.email,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('shoud be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Nome teste',
            email: 'teste@teste.com',
            password: 'Teste1234',
        });

        const newName = 'Mudando nome';
        const newEmail = 'mudando@teste.com';
        const newPassword = '1234Teste';
        const oldPassword = 'Teste1234';

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: newName,
            email: newEmail,
            password: newPassword,
            old_password: oldPassword,
        });

        expect(updatedUser.password).toBe(newPassword);
    });

    it('shoud not be able to update the password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Nome teste',
            email: 'teste@teste.com',
            password: 'Teste1234',
        });

        const newName = 'Mudando nome';
        const newEmail = 'mudando@teste.com';
        const newPassword = '1234Teste';

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: newName,
                email: newEmail,
                password: newPassword,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('shoud not be able to update the password if old password is wrong', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Nome teste',
            email: 'teste@teste.com',
            password: 'Teste1234',
        });

        const newName = 'Mudando nome';
        const newEmail = 'mudando@teste.com';
        const newPassword = '1234Teste';
        const wrongOldPassword = 'SenhaErrada';

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: newName,
                email: newEmail,
                password: newPassword,
                old_password: wrongOldPassword,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
