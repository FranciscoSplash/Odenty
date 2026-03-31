import User from "../models/User.js";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth.js";




class SessionsControllers{
    async create(req, res){
        const {email, senha}=req.body;

            //Busca o usuário pelo e-mail enviado no login
        const user =await User.findOne({where:{email}})
    

            //Se o usuário não existir, retorna erro 401 (Não autorizado)
        if(!user){
            return res.status(401).json({error: 'Usuário não encontrado'})
        }

        //Usa o método do Model para comparar a senha enviada com o hash do banco
        if(!(await user.checkPassword(senha))){
            return res.status(401).json({error: 'Senha incorreta'})
        }

        //Se chegou aqui, os dados estão certos. Vamos pegar o ID e Nome
        const {id, nome}=user;


        // Gerando o Token JWT
            // O primeiro parâmetro é o "Payload" (dados que queremos esconder no token)
            // O segundo é a nossa chave secreta que está no authConfig
            // O terceiro são as configurações (como o tempo de expiração)

        return res.json({
            user:{
                id,
                nome,
                email
            },
            token: jwt.sign({id}, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            })
        });
    }
}



export default new SessionsControllers ();