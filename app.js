//importando o express

import express from 'express';
import routes from './router.js';
import './app/database/index.js';




class App {
    constructor(){
        this.server=express();
        this.middlewares();
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