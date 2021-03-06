import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInDayFromProvider from '../dtos/IFindAllInDayFromProvider';
import IFindAllInMonthFromProvider from '../dtos/IFindAllInMonthFromProvider';
import Appointment from '../infra/typeorm/entities/Appointment';

export default interface IAppointmentsRepository {
    findByDate(
        date: Date,
        provider_id: string,
    ): Promise<Appointment | undefined>;
    findAllInMonthFromProvider(
        data: IFindAllInMonthFromProvider,
    ): Promise<Appointment[]>;
    findAllInDayFromProvider(
        data: IFindAllInDayFromProvider,
    ): Promise<Appointment[]>;
    create(data: ICreateAppointmentDTO): Promise<Appointment>;
}
