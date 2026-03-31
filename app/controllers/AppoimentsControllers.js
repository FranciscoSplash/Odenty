import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format , subHours} from 'date-fns';
import Appointment from '../models/Appointments.js';
import User from '../models/User.js';

class AppointmentsController {
  async store(req, res) {

    // 1. Validação dos dados de entrada
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const { provider_id, date } = req.body;

    /**
     * 2. Checar se o provider_id é realmente um médico (provider)
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res.status(401).json({ 
        error: 'Você só pode criar agendamentos com médicos (providers)' 
      });
    }

    /**
     * 3. Checagem de Datas com date-fns
     */
    // startOfHour: Transforma "14:30" em "14:00" (arredonda para a hora cheia)
    const hourStart = startOfHour(parseISO(date));

    // isBefore: Verifica se a data escolhida é ANTES da data/hora atual
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Datas passadas não são permitidas' });
    }

    /**
     * 4. Checar se o médico já tem agendamento nesse mesmo horário
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({ error: 'Horário não disponível para este médico' });
    }

    // 5. Criar o agendamento
    const appointment = await Appointment.create({
      user_id: req.userId, // Pegamos do Token JWT (Middleware de Auth)
      provider_id,
      date: hourStart,
    });

    return res.json(appointment);
  }
  async index(req, res){
    const appointments= await Appointment.findAll({
        where:{
            user_id:req.userId,
             canceled_at: null
            },
            attributes:['id', 'date','createdAt'],
            order:['date'],
            include:{
                model: User,
                attributes:['id', 'nome'],
            }
    });
    
    return res.json(appointments);
  }
  async delete(req, res){
    const appointment = await Appointment.findByPk(req.params.id);
    //verificar se o agendamento pertence ao usuário logado

    if (!appointment) {
    return res.status(404).json({ error: "Agendamento não encontrado." });
  }

    if (appointment.canceled_at !== null) {
    return res.status(400).json({ 
      error: "Este agendamento já está cancelado." 
    });
  }

    if(appointment.user_id!==req.userId){
        return res.status(401).json({error: 'Você só pode cancelar seus próprios agendamento'})
    }

    // Subtraímos 2 horas da data da consulta
    const dateWithSub = subHours(appointment.date, 2);

    
    // Verificamos se a data atual é depois da data da consulta menos 2 horas
    if(isBefore(dateWithSub, new Date())){
        return res.status(401).json({
      error: 'Você só pode cancelar agendamentos com 2 horas de antecedência.',
    });
}
    appointment.canceled_at= new Date();
    await appointment.save();


    return res.json(appointment);

  }
}

export default new AppointmentsController();