import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppoitmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppoitmentsRepository: FakeAppoitmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createApoointment: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppoitmentsRepository = new FakeAppoitmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();

        createApoointment = new CreateAppointmentService(
            fakeAppoitmentsRepository,
            fakeNotificationsRepository,
        );
    });

    it('shoud be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 1, 1, 12).getTime();
        });

        const appointment = await createApoointment.execute({
            date: new Date(2021, 1, 5, 12),
            provider_id: '23424',
            user_id: '12345',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('23424');
    });

    it('shoud not be able to create two new appointment at the same time', async () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);

        await createApoointment.execute({
            date,
            provider_id: '23424',
            user_id: '12345',
        });

        await expect(
            createApoointment.execute({
                date,
                provider_id: '23424',
                user_id: '12345',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('shoud not be able to create an appointment on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 1, 1, 12).getTime();
        });

        await expect(
            createApoointment.execute({
                date: new Date(2019, 1, 1, 10),
                provider_id: '1324',
                user_id: '1234',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('shoud not be able to create an appointment with user equal to provider', async () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);

        await expect(
            createApoointment.execute({
                date,
                provider_id: '1234',
                user_id: '1234',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('shoud not be able to create an appointment before 8am and after 5pm', async () => {
        const dateBefore = new Date();
        const dateAfter = new Date();
        dateBefore.setDate(dateBefore.getDate() + 1);
        dateAfter.setDate(dateAfter.getDate() + 1);

        dateBefore.setHours(7);
        dateAfter.setDate(20);

        await expect(
            createApoointment.execute({
                date: dateBefore,
                provider_id: 'provider-id',
                user_id: 'user-id',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createApoointment.execute({
                date: dateAfter,
                provider_id: 'provider-id',
                user_id: 'user-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
