import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
    it('shoud be able to add a avatar to an user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        const avatarFilename = 'avatar.jpg';

        const user = await fakeUsersRepository.create({
            name: 'Nome teste',
            email: 'teste@teste.com',
            password: 'Teste1234',
        });

        const updatedUser = await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename,
        });

        expect(updatedUser.avatar).toBe(avatarFilename);
    });

    it('shoud not be able to add a avatar to a nonexistent user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        const avatarFilename = 'avatar.jpg';

        expect(
            updateUserAvatar.execute({
                user_id: 'nonexisting-user',
                avatarFilename,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('shoud be able replace the avatar of an user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        const firstAvatarFilename = 'first-avatar.jpg';
        const secondAvatarFilename = 'second-avatar.jpg';

        const user = await fakeUsersRepository.create({
            name: 'Nome teste',
            email: 'teste@teste.com',
            password: 'Teste1234',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: firstAvatarFilename,
        });

        const updatedUser = await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: secondAvatarFilename,
        });

        expect(deleteFile).toHaveBeenCalledWith(firstAvatarFilename);
        expect(updatedUser.avatar).toBe(secondAvatarFilename);
    });
});
