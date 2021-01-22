import 'reflect-metadata';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeMailProvider = new FakeMailProvider();

        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeUserTokensRepository,
        );
    });

    it('shoud be able to recover the password using the email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        const user: ICreateUserDTO = {
            name: 'Fulano',
            email: 'fulano@gmail.com',
            password: 'Senha1234',
        };

        await fakeUsersRepository.create(user);

        await sendForgotPasswordEmail.execute({ email: user.email });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover a non-existing user password', async () => {
        await expect(
            sendForgotPasswordEmail.execute({ email: 'fulano@gmail.com' }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('shoud generate a forgot password token', async () => {
        const generatoToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const userData: ICreateUserDTO = {
            name: 'Fulano',
            email: 'fulano@gmail.com',
            password: 'Senha1234',
        };

        const user = await fakeUsersRepository.create(userData);

        await sendForgotPasswordEmail.execute({ email: user.email });

        expect(generatoToken).toHaveBeenCalledWith(user.id);
    });
});
