import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProvider from '../dtos/IFindAllInMonthFromProvider';
import Appointment from '../infra/typeorm/entities/Appointment';

export default interface IAppointmentsRepository {
    findByDate(date: Date): Promise<Appointment | undefined>;
    findAllInMonthFromProvider(
        data: IFindAllInMonthFromProvider,
    ): Promise<Appointment[]>;
    create(data: ICreateAppointmentDTO): Promise<Appointment>;
}
