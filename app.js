//importando o express

import express from 'express';
import routes from './router.js';
import './app/database/index.js';
import cors from  'cors'



class App {
    constructor(){
        this.server=express();
        this.middlewares();
        this.server.use(cors())
        this.routes();
        
    }


    middlewares(){
    this.server.use(express.json());
    }

    routes(){
        this.server.use(routes)
    }
}



export default  new App().server;