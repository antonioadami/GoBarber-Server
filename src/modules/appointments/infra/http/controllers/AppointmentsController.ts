import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { parseISO } from 'date-fns';

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

        const parsedDate = parseISO(date);

        const appointment = await createAppointmentService.execute({
            date: parsedDate,
            provider_id,
        });

        return response.status(200).json(appointment);
    }
}