import { v4 } from 'uuid';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmetsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import { isEqual } from 'date-fns';

class AppointmentsRepository implements IAppointmentsRepository {
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

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        return this.appointments.find(appointment =>
            isEqual(appointment.date, date),
        );
    }
}

export default AppointmentsRepository;
