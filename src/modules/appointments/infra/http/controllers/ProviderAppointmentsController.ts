import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import { classToClass } from 'class-transformer';

export default class ProviderAppointmentsController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const listAppointments = container.resolve(
            ListProviderAppointmentsService,
        );

        const { day, month, year } = request.query;
        const provider_id = request.user.id;

        const availability = await listAppointments.execute({
            month: Number(month),
            year: Number(year),
            day: Number(day),
            provider_id,
        });

        return response.status(200).json(classToClass(availability));
    }
}
