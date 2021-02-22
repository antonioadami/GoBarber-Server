import { v4 } from 'uuid';
import { getMonth, getYear, isEqual } from 'date-fns';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmetsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProvider from '@modules/appointments/dtos/IFindAllInMonthFromProvider';

class FakeAppointmentsRepository implements IAppointmentsRepository {
    private appointments: Appointment[] = [];

    public async create({
        provider_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        appointment.id = v4();
        appointment.provider_id = provider_id;
        appointment.date = date;
        appointment.created_at = new Date();
        appointment.updated_at = new Date();

        this.appointments.push(appointment);

        return appointment;
    }

    public async findAllInMonthFromProvider({
        provider_id,
        month,
        year,
    }: IFindAllInMonthFromProvider): Promise<Appointment[]> {
        console.log(this.appointments);

        this.appointments.filter(appointment => {
            // console.log(appointment.provider_id === provider_id);
            // console.log(getMonth(appointment.date) + 1 === month);
            // console.log(getYear(appointment.date) === year);

            // console.log('---------------');

            return (
                appointment.provider_id === provider_id &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year
            );
        });

        return this.appointments.filter(
            appointment =>
                appointment.provider_id === provider_id &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year,
        );
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        return this.appointments.find(appointment =>
            isEqual(appointment.date, date),
        );
    }
}

export default FakeAppointmentsRepository;
