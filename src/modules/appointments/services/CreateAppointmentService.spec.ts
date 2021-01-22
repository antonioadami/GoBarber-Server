import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppoitmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

describe('CreateAppointment', () => {
    it('shoud be able to create a new appointment', async () => {
        const fakeAppoitmentsRepository = new FakeAppoitmentsRepository();
        const createApoointment = new CreateAppointmentService(
            fakeAppoitmentsRepository,
        );

        const appointment = await createApoointment.execute({
            date: new Date(),
            provider_id: '23424',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('23424');
    });

    it('shoud not be able to create two new appointment at the same time', async () => {
        const fakeAppoitmentsRepository = new FakeAppoitmentsRepository();
        const createApoointment = new CreateAppointmentService(
            fakeAppoitmentsRepository,
        );

        const date = new Date(2021, 1, 18, 19);

        await createApoointment.execute({
            date,
            provider_id: '23424',
        });

        await expect(
            createApoointment.execute({
                date,
                provider_id: '23424',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
