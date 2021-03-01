import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const createAppointmentService = container.resolve(
            CreateAppointmentService,
        );

        const { provider_id, date } = request.body;
        const { id } = request.user;

        const appointment = await createAppointmentService.execute({
            date,
            user_id: id,
            provider_id,
        });

        return response.status(200).json(appointment);
    }
}
