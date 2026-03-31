import Medic from '../models/Medic.js';
import {Op} from 'sequelize';
import * as Yup from "yup";
import Consultas from '../models/Consultas.js';
import Especialidade from '../models/Especialidade.js';



class MedicControllers{

    async index(req, res){

        const{
            nome,
            cpf,
         
            createdBefore,
            updateBefore,
            createdAfter,
            updateAfter,
            sort,
        }=req.query;

        const page =req.query.page || 1;
        const  limit =req.query.limit || 10;


        let where ={};
        let order =[];

        if(nome){
            where ={
                ...where, nome:{[Op.like]: `%${nome}`}
            }
        }
            if(cpf){
            where ={
                ...where, cpf:{[Op.like]: `%${cpf}`}
            }
            }
            if(createdBefore){
                where ={
                    ...where, createdAt:{[Op.lte]: new Date (createdBefore)}
                }
            }
            if(updateBefore){
                where ={
                    ...where, updatedAt:{[Op.lte]: new Date (updateBefore)}
                }
            }
            if(createdAfter){
                where ={
                    ...where, createdAt:{[Op.gte]: new Date (createdAfter)}
                }
            }
            if(updateAfter){
                where ={
                    ...where, updatedAt:{[Op.gte]: new Date (updateAfter)}
                }
            }
            if(sort){
                order=sort.split(',').map((s)=>s.split(':'))
            }

        
        const medics= await Medic.findAll({
            where,
            include:[
                {
                    model: Especialidade,
                    attributes: ['id', 'nome']
                }
            ],

        order,
        limit,
        offset: limit *page -limit
        })

        return res.json(medics);

    }

    async show(req, res){

        const medics= (await Medic.findByPk(req.params.id));

        if(!medics){
            return res.status(404).json({error: "Médico não encontrado"});
        }

        return res.json(medics);
    }



  async create(req, res) {
    console.log("O que chegou no Body:", req.body); // Adicione isso aqui
    const schema = Yup.object().shape({
        nome: Yup.string().required("Nome é obrigatório"),
        cpf: Yup.string().required("CPF é obrigatório"),
        especialidade_id: Yup.number().required("ID da especialidade é obrigatório"),
    });

    try {
        // validate em vez de isValid para pegar a mensagem de erro
        await schema.validate(req.body);
    } catch (err) {
        return res.status(400).json({ 
            error: "Dados Invalidos", 
            message: err.message // Isso vai te dizer qual campo falhou!
        });
    }

    const medic = await Medic.create(req.body);
    return res.status(201).json(medic);
}


    async update(req, res){

        const schema = Yup.object().shape({
            nome:Yup.string(),
            cpf: Yup.string(),
            especialidade_id:Yup.number(),
        })
        
        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error:"Dados Invalidos"})
        }

        const corpo= await Medic.findByPk(req.params.id);
        if(!corpo){
            return res.status(404).json({error: "Médico não encontrado"})
        }
        await corpo.update(req.body);
        return res.status(200).json(corpo)
    }



    async destroy(req, res){
        const medics= await Medic.findByPk(req.params.id);
        if(!medics){
            return res.status(404).json({error: "Médico não encontrado"})
        }
        await medics.destroy();
        return res.status(204).send();
    }
}


export default new MedicControllers();