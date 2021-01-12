import { EntityRepository, Repository } from 'typeorm';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
    public async findByDate(date: Date): Promise<Appointment | undefined> {
        return this.findOne({
            where: { date },
        });
    }
}

export default AppointmentsRepository;
