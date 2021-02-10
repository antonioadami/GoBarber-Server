import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class ProvidersController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const listProvidersService = container.resolve(ListProvidersService);

        const { id } = request.user;

        const providers = await listProvidersService.execute(id);

        return response.status(200).json(providers);
    }
}
