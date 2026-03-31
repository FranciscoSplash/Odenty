import { Sequelize } from "sequelize";


import config from '../config/config.js';
import Patient from "../models/Patient.js";
import Medic from "../models/Medic.js";
import Especialidade from "../models/Especialidade.js";
import Consultas from "../models/Consultas.js";
import User from "../models/User.js";
import Appointments from "../models/Appointments.js";



const models = [User, Patient, Appointments, Consultas, Medic, Especialidade];



class Database{
    constructor(){
        this.connection= new Sequelize(config);
        
    
        this.init();
        this.associate();
    }

    init(){
        models.forEach(model=>model.init(this.connection))
    }

    associate(){
        models.forEach(model=> {
            if(model.associate){
                model.associate(this.connection.models)
            }
        });
    }
}


export default new Database ();