import 'reflect-metadata';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';
import FakeAppoitmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppoitmentsRepository: FakeAppoitmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
    beforeEach(() => {
        fakeAppoitmentsRepository = new FakeAppoitmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProviderAppointmentsService = new ListProviderAppointmentsService(
            fakeAppoitmentsRepository,
            fakeCacheProvider,
        );
    });

    it('shoud be able to list the appointments of provider in a specific day', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 1, 1, 12).getTime();
        });

        const appointment1 = await fakeAppoitmentsRepository.create({
            date: new Date(2021, 1, 5, 12),
            provider_id: 'provider_id',
            user_id: 'user_id',
        });

        const appointment2 = await fakeAppoitmentsRepository.create({
            date: new Date(2021, 1, 5, 13),
            provider_id: 'provider_id',
            user_id: 'user_id',
        });

        const appointments = await listProviderAppointmentsService.execute({
            day: 5,
            month: 2,
            year: 2021,
            provider_id: 'provider_id',
        });

        expect(appointments).toEqual(
            expect.arrayContaining([appointment1, appointment2]),
        );
    });
});
