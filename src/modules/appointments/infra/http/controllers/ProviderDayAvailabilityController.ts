import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersDayAvailabilityService from '@modules/appointments/services/ListProvidersDayAvailabilityService';

export default class ProviderDayAvailabilityController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const listAvailability = container.resolve(
            ListProvidersDayAvailabilityService,
        );

        const { day, month, year } = request.query;
        const { provider_id } = request.params;

        const availability = await listAvailability.execute({
            month: Number(month),
            year: Number(year),
            day: Number(day),
            provider_id,
        });

        return response.status(200).json(availability);
    }
}
