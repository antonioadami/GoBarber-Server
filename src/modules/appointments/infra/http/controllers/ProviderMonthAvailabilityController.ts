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

        const { month, year } = request.body;
        const { provider_id } = request.params;

        const availability = await listAvailability.execute({
            month,
            year,
            provider_id,
        });

        return response.status(200).json(availability);
    }
}
