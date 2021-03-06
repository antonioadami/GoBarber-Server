import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersMonthAvailabilityService from '@modules/appointments/services/ListProvidersMonthAvailabilityService';

export default class ProviderMonthAvailabilityController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const listAvailability = container.resolve(
            ListProvidersMonthAvailabilityService,
        );

        const { month, year } = request.query;
        const { provider_id } = request.params;

        const availability = await listAvailability.execute({
            month: Number(month),
            year: Number(year),
            provider_id,
        });

        return response.status(200).json(availability);
    }
}
