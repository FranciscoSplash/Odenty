import Especialidade from "../models/Especialidade.js";
import {Op} from 'sequelize';
import * as Yup from "yup";

class EspecialidadesControllers{
    async index(req, res){
        const{
            nome,
            createdAt,
            updatedAt,
            createdBefore,
            updateBefore,
            createdAfter,
            updateAfter,
            sort,
        }=req.query;

    
        const page= req.query.page || 1;
        const limit= req.query.limit || 10;


        let where={};
        let order=[]

        if(nome){
            where={
                nome: {
                    [Op.like]: `%${nome}%`
                }
            };
        }

        if(createdBefore){
            where={...where, createdAt:{[Op.lte]: new Date (createdBefore)}}
        }
        if(updateBefore){
            where={...where, updatedAt:{[Op.lte]: new Date (updateBefore)}}
        }
        if(createdAfter){
            where={...where, createdAt:{[Op.gte]: new Date (createdAfter)}}
        }
        if(updateAfter){
            where={...where, updatedAt:{[Op.gte]: new Date (updateAfter)}}
        }

        if(sort){
           order=sort.split(',').map((s)=>s.split(":"));
        }

        const especialidade = await Especialidade.findAndCountAll({
            where,
            order,
            limit,
            offset: limit * page - limit,
        });
        return res.json(especialidade);
    }

async show(req, res){
    const especialidade = await Especialidade.findByPk(req.params.id);

    if(!especialidade){
        return res.status(404).json({error: "Especialidade não encontrada"});
    }

    return res.json(especialidade);
}
async create(req, res){
    const schema = Yup.object().shape({
        nome: Yup.string().required(),
    });

    if(!(await schema.isValid(req.body))){
        return res.status(400).json({error: "Validation fails"});
    }

    const corpo=await Especialidade.create(req.body);


    return res.status(201).json(corpo);
}
async update(req, res){
    const schema = Yup.object().shape({
        nome:Yup.string(),
    });

    if(!(await schema.isValid(req.body))){

        return res.status(400).json({error: "Validation fails"});
    }

    const especialidae = await Especialidade.findByPk(req.params.id);
    if(!especialidae){
        return res.status(404).json({error: "Especialidade não encontrada"});
    }

     await especialidae.update(req.body);
     return res.json(especialidae);
}
async destroy(req, res){
    const especialidade = await Especialidade.findByPk(req.params.id);

    if(!especialidade){
        return res.status(404).json({error: "Especialidade não encontrada"});
    }

    await especialidade.destroy();
    return res.json({message: "Especialidade deletada com sucesso"});
}
}


export default new EspecialidadesControllers();