import 'reflect-metadata';

import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();

        listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('shoud be able to list the month availability of provider', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2021, 1, 22, 8, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2021, 1, 22, 9, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2021, 1, 22, 10, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2021, 1, 22, 11, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2021, 1, 22, 12, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2021, 1, 22, 13, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2021, 1, 22, 14, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2021, 1, 22, 15, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2021, 1, 22, 16, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2021, 1, 22, 17, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2021, 1, 23, 8, 0, 0),
        });

        const availability = await listProviderMonthAvailability.execute({
            provider_id: 'user',
            year: 2021,
            month: 2,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                {
                    day: 19,
                    available: true,
                },
                {
                    day: 20,
                    available: true,
                },
                {
                    day: 21,
                    available: true,
                },
                {
                    day: 22,
                    available: false,
                },
            ]),
        );
    });
});
