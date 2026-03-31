import Patient from "../models/Patient.js"
import Consultas from "../models/Consultas.js"
import{Op} from 'sequelize';
import * as Yup from 'yup'

class PatientsControllers{
    

    async index(req, res){
       const{
        nome,
        email,
        cpf,
        telefone, 
        rg,
    createdAt,
        updatedAt,
    createdBefore,
    updateBefore,
    createdAfter,
    updateAfter,
    sort,
    } = req.query;
        
    

    const page= req.query.page || 1;
    const limit =req.query.limit || 10;

    
    //filtros de ordenação
    let where ={};
    let order=[];

    if(nome){
        where ={ ...where, nome:{[Op.like]: `%${nome}%`}}
    }
    
    if(email){
        where ={ ...where, email:{[Op.like]: `%${email}%`}}
    }
    if(cpf){
         where ={ ...where, cpf:{[Op.like]: `%${cpf}%`}}
    }
    if(telefone){
         where ={ ...where, telefone:{[Op.like]: `%${telefone}%`}}
    }
    if(rg){
         where ={ ...where, rg:{[Op.like]: `%${rg}%`}}
    }
    if(createdAt){
         where ={ ...where, createdAt:{[Op.lte]: new Date (createdAt)}}
    }

     if(updatedAt){
         where ={ ...where, updatedAt:{[Op.lte]: new Date(updatedAt)}}

     }
     
     
     if(createdBefore){
         where ={ ...where, createdAt:{[Op.lte]: new Date(createdBefore)}}

     }
      if(updateBefore){
         where ={ ...where, updateAt:{[Op.lte]: new Date(updateBefore)}}

     }
if(createdAfter){
    where={...where, createdAt: {[Op.gte]: new Date(createdAfter)}}
}
if(updateAfter){
    where={...where, updatedAt: {[Op.gte]: new Date(updateAfter)}}
};
if(sort){
    order=sort.split(',').map(item=>item.split(':'))
}

    const data=await Patient.findAll({
        where,
        include:[
            {
                model: Consultas,
                attributes:['id', 'hora', 'data']
            },
        ],
        order,
        limit,
        offset: limit *page -limit
    })
    return  res.json(data)
}
async show(req, res){
    const patient= (await Patient.findByPk(req.params.id));

    if(!patient){
        return res.status(404).json({error: "ERROR"})
    }
    return res.json(patient)
}
async create(req, res){
    const corpo= Yup.object().shape({
        nome:Yup.string().required(),
        email:Yup.string().required(),
        cpf:Yup.string().required(),
        rg:Yup.string().required(),
        telefone:Yup.string().required(),
    })

    if(!( await corpo.isValid(req.body))){
        return res.status(400).json({error:"ERROR"})
    }
    const patient= await Patient.create(req.body);
    return res.status(200).json(patient)
}
async update(req, res){

    const corpo = Yup.object().shape({
         nome:Yup.string(),
        email:Yup.string(),
        telefone:Yup.string(),
    })

    if(!(await corpo.isValid(req.body))){
        return res.status(400).json({error: "ERROR"})
    }
     const patient= await Patient.findByPk(req.params.id);

    if(!patient){
        return res.status(404).json({error: "ERROR"})
    }

    await patient.update(req.body)
    return res.json(patient)
}

async destroy(req, res){
    const patient =await Patient.findByPk(req.params.id);
if(!patient){
    return res.status(404).json({error: "ERROR"})
}
await patient.destroy()
returnres.status(204).send();

}
}


export default new PatientsControllers();