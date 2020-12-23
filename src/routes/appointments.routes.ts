import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import CreateAppointmentService from '../services/CreateAppointmentService';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();

appointmentsRouter.post('/', async (request, response) => {
    try {
        const createAppointmentService = new CreateAppointmentService();

        const { provider_id, date } = request.body;

        const parsedDate = parseISO(date);

        const appointment = await createAppointmentService.execute({
            date: parsedDate,
            provider_id,
        });

        return response.status(200).json(appointment);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

appointmentsRouter.get('/', async (request, response) => {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointments = await appointmentsRepository.find();
    return response.status(200).json(appointments);
});

export default appointmentsRouter;
