import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import CreateAppointmentService from '../services/CreateAppointmentService';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const appointmentsRouter = Router();
appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/', async (request, response) => {
    const createAppointmentService = new CreateAppointmentService();

    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);

    const appointment = await createAppointmentService.execute({
        date: parsedDate,
        provider_id,
    });

    return response.status(200).json(appointment);
});

appointmentsRouter.get('/', async (request, response) => {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointments = await appointmentsRepository.find();
    return response.status(200).json(appointments);
});

export default appointmentsRouter;
