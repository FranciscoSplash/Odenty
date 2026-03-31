import jwt from "jsonwebtoken";
import {promisify} from 'util';
import authConfig from "../config/auth.js";





export default async(req, res, next) =>{
    const authHeader = req.headers.authorization;

    // Verifica se o header de autorização foi enviado
    if(!authHeader){
        return res.status(401).json({error: 'Token não fornecido'})

    }
//  Divide a string "Bearer TOKEN" e pega apenas a segunda parte (o token)
    // O espaço dentro do split(' ') é fundamental!
    const [, token]=authHeader.split(' ');

    try{
        //  Verifica se o token é válido usando a nossa chave secreta
        // promisify transforma o jwt.verify (que é callback) em uma Promise para usar await
        const decoded= await promisify(jwt.verify)(token, authConfig.secret);
        
        // ESSENCIAL: Inclui o ID do usuário que estava dentro do token na requisição
        // Agora, qualquer rota que use este middleware terá acesso ao req.userId
        req.userId=decoded.id;
        return next();
    }
    catch(err){
        //Se o token expirou ou a chave secreta não bate
        return res.status(401).json({error: 'Token inválido'})
    }
    return next();
}