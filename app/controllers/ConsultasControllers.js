import Patient from "../models/Patient.js"
import Consultas from "../models/Consultas.js";
import Medic from "../models/Medic.js";
import{Op} from 'sequelize';
import * as Yup from 'yup'

class ConsultasControllers{

async index(req, res){
    const{
        data,
        hora,
    createdAt,
        updateAt,
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

   
    
    if(data){
         where ={ ...where, data:{[Op.eq]: new Date(data)}
        }     //[Op.eq] // Use eq para data exata
    if(hora){
    
        }
         where ={ ...where, hora:{[Op.eq]: new Date(hora)}}
    }
    if(createdAt){
         where ={ ...where, createdAt:{[Op.lte]: new Date (createdAt)}}
    }

     if(updateAt){
         where ={ ...where, updateAt:{[Op.lte]: new Date(updateAt)}}

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
    order=sort.split(',').map(item=>item.split())
}

    const consultas=await Consultas.findAll({
        where,
        include:[
            {
                model: Patient,
                attributes:['id']
            },
            {
                model: Medic,
                attributes:["id"]
            }
        ],
        order,
        limit,
        offset: limit *page -limit
    })
    return  res.json(consultas)
}
async show(req, res){
    const {id, patientId}=req.params;
    const consultas= await Consultas.findOne({
    where:{    
        id:req.params.id,   // O ID da consulta
        paciente_id:patientId       // Garante que a consulta é DESTE paciente
    },
include:[
    {
    model:Medic,
    attributes:['id','nome']
}
]
});

    if(!consultas){
        return res.status(404).json({error: "ERROR"})
    }
    return res.json(consultas)
}
async create(req, res){
    const corpo= Yup.object().shape({
        data:Yup.string().required(),
        hora:Yup.string().required(),
        medico_id:Yup.number().required(),  // Precisamos saber qual médico vai atender!
        });
        
   

    if(!( await corpo.isValid(req.body))){
        return res.status(400).json({error:"ERROR"})
    }

     //  Pegar o ID do paciente da URL (da rota aninhada)
        const { patientId } = req.params;
        const { data, hora, medico_id } = req.body;

    //Verificar se o paciente realmente existe antes de marcar
        const patientExists = await Patient.findByPk(patientId);
        if (!patientExists) {
            return res.status(404).json({ error: "Paciente não encontrado." });
        }

    const consulta= await Consultas.create({
            data,
            hora,
            medico_id,
            paciente_id: patientId // Aqui fazemos o vínculo real e criamos a consulta
    })
    return res.status(201).json(consulta)

    
}


async update(req, res){
    
        const { id, patientId } = req.params;
        const schemma= Yup.object().shape({
            data: Yup.date(),
            hora: Yup.string(),
            medico_id:Yup.number()
           
        })

        //validar o schemma com req.body
        if(!(await schemma.isValid(req.body))){
            return res.status(400).json({error:'Error'})


    }

    const consulta = await Consultas.findOne({
      
        where:{    
        id:req.params.id,   // O ID da consulta
        paciente_id:patientId       // Garante que a consulta é DESTE paciente
    },

    });
    
  if (!consulta) {
    return res.status(404).json({ error: "Cliente não encontrado" });
  }

   await consulta.update(req.body);
   return res.json(consulta)
   }



async destroy(req, res){
    const { id, patientId } = req.params; // Adicionado patientId 
       const consulta = await Consultas.findOne({
        where:{
            id:req.params.id,   // O ID da consulta
            paciente_id:patientId  
        }
    });

  if (!consulta) {
    return res.status(404).json({ error: "Cliente não encontrado" });
  }
    await consulta.destroy();


    return res.status(204).send(); // Status correto para deleção
}


}

    export default new ConsultasControllers();