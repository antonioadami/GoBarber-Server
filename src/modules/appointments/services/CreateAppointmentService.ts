import { inject, injectable } from 'tsyringe';
import { format, isBefore, startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmetsRepository';

interface IRequest {
    date: Date;
    provider_id: string;
    user_id: string;
}
@injectable()
export default class CreateAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,
        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({
        date,
        provider_id,
        user_id,
    }: IRequest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        if (isBefore(appointmentDate, Date.now())) {
            throw new AppError(
                'You cannot create an appointment on a past date',
            );
        }

        if (appointmentDate.getHours() < 8 || appointmentDate.getHours() > 17) {
            throw new AppError(
                'You should create an appointment between 8am and 5pm',
            );
        }

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked');
        }

        if (provider_id === user_id) {
            throw new AppError('The user cannot be the same as provider');
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            user_id,
            date: appointmentDate,
        });

        const dateFormatted = format(
            appointmentDate,
            "dd/MM/yyyy 'às' HH:mm'h'",
        );

        await this.notificationsRepository.create({
            content: `Novo agendamento para o dia ${dateFormatted}`,
            recipient_id: provider_id,
        });
        const cacheKey = `provider-appointments:${provider_id}:${format(
            appointmentDate,
            'yyyy-M-d',
        )}`;

        await this.cacheProvider.invalidate(cacheKey);

        return appointment;
    }
}
