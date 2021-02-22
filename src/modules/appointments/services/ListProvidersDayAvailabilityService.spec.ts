import 'reflect-metadata';

import ListProviderDayAvailabilityService from './ListProvidersDayAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();

        listProviderDayAvailability = new ListProviderDayAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    it('shoud be able to list the day availability of provider', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2021, 1, 22, 14, 0, 0),
            user_id: '12345',
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            date: new Date(2021, 1, 22, 15, 0, 0),
            user_id: '12345',
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 1, 22, 11).getTime();
        });

        const availability = await listProviderDayAvailability.execute({
            provider_id: 'user',
            year: 2021,
            month: 2,
            day: 22,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                {
                    hour: 8,
                    available: false,
                },
                {
                    hour: 9,
                    available: false,
                },
                {
                    hour: 10,
                    available: false,
                },
                {
                    hour: 13,
                    available: true,
                },
                {
                    hour: 14,
                    available: false,
                },
                {
                    hour: 15,
                    available: false,
                },
                {
                    hour: 16,
                    available: true,
                },
            ]),
        );
    });
});
