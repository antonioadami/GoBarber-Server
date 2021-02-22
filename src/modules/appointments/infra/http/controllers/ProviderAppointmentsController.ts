import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

export default class ProviderAppointmentsController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const listAppointments = container.resolve(
            ListProviderAppointmentsService,
        );

        const { day, month, year } = request.body;
        const provider_id = request.user.id;

        const availability = await listAppointments.execute({
            month,
            year,
            day,
            provider_id,
        });

        return response.status(200).json(availability);
    }
}
