import User from '../models/User.js';
import{Op} from 'sequelize';
import * as Yup from 'yup';



class UserControllers{

    async index(req, res){
        const{
            nome,
            email,
        createdAt,
        updatedAt,
        createdBefore,
        updateBefore,
        createdAfter,
        updateAfter,
        sort,
            }=req.query;



            const page=req.query.page || 1;
            const limit=req.query.limit || 10;


            let where={};
            let order=[];

    
if (nome) {
    where = { ...where, nome: { [Op.like]: `%${nome}%` } };
}

if (email) {
    where = { ...where, email: { [Op.like]: `%${email}%` } };
}
if (createdBefore) {
    where = { ...where, createdAt: { [Op.lte]: new Date(createdBefore) } };
}
// Filtros de Data
if (updateBefore) {
    where = { ...where, updatedAt: { [Op.lte]: new Date(updateBefore) } };
}
if(createdAfter){
    where={...where, createdAt: {[Op.gte]: new Date(createdAfter)}}
}
if(updateAfter){
    where={...where, updatedAt: {[Op.gte]: new Date(updateAfter)}}
}

if(sort){
    order=sort.split(',').map(item=>item.split(','));
}

const user=await User.findAll({
    // Segurança: Nunca enviar o hash no JSON de resposta
    attributes: {exclude: ['senha', 'password_hash']},
           where,
            order,
            limit,
            offset: limit * page - limit  
});
return res.json(user);

}
    async show(req, res){

        const user =await User.findByPk(req.params.id, {
             // Segurança: Não retorna o hash da senha no detalhe do usuário
            attributes: {exclude: ['senha', 'password_hash']
        },
    });
            if(!user){
                return res.status(404).json({error: 'Usuário não encontrado'})
            }
           
            return res.json(user);
}
    async create(req, res){
        const schema=Yup.object().shape({
            nome:Yup.string().required(),
            email:Yup.string().email().required(),
            senha:Yup.string().required().min(8),
            provider:Yup.boolean(),
            confirmacaoSenha:Yup.string().when('senha', (senha, field)=>
                senha ? field.required().oneOf([Yup.ref('senha')]): field)
            
        });

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: 'Validação falhou'})
        }

        // Verificação de e-mail duplicado
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
        return res.status(400).json({ error: 'Usuário já existe.' });
    }
            const {id, nome, email, provider, createdAt, updatedAt}= await User.create(req.body);
            return res.status(201).json({id, nome, email, provider, createdAt, updatedAt})

    }
    async update(req, res) {
        //Definição do Schema de Validação com Yup
        const schema = Yup.object().shape({
            nome: Yup.string(),
            email: Yup.string().email(),
            provider: Yup.boolean(),
            senhaAntiga: Yup.string().min(8),

            // Se enviou senhaAntiga, a 'senha' (nova) é obrigatória
            senha: Yup.string().min(8).when('senhaAntiga', (senhaAntiga, field) =>
                senhaAntiga ? field.required() : field),
            confirmacaoSenha: Yup.string().min(8).when('senha', (senha, field) =>
                senha ? field.required().oneOf([Yup.ref('senha')]) : field)
        });


        //Executa a validação dos dados que vieram no corpo da requisição (req.body)
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validação falhou' })
        }

        //Busca o usuário no banco de dados pelo ID enviado na URL (params)
        const user = await User.findByPk(req.params.id);


        // Verifica se o usuário de fato existe antes de continuar
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const { email, senhaAntiga } = req.body;
        // 4. Verificação de Segurança: Se tentar mudar a senha, checa se a antiga bate com o banco
        if (senhaAntiga && !(await user.checkPassword(senhaAntiga))) {
            return res.status(401).json({ error: 'Senha antiga incorreta.' });
        }

        // Verificação de E-mail: Se o usuário quiser mudar o e-mail, checa se o novo já não está em uso
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ where: { email } });
            if (emailExists) {
                return res.status(400).json({ error: 'E-mail já em uso por outro usuário.' });
            }
        } 

        // O hook 'beforeSave' no Model cuidará de gerar o novo password_hash se a 'senha' estiver presente
        // Agora o update está fora do IF de email, permitindo atualizar outros campos
        await user.update(req.body);

        // Retorna os dados atualizados (sem a senha, claro)
        const { id, nome, provider, createdAt, updatedAt } = user;
        
        return res.json({
            id,
            nome,
            email: user.email,     // pegando o e-mail atualizado do objeto user
            provider,
            createdAt,
            updatedAt
        });
    } 


    async destroy(req, res){
        const user = await User.findByPk(req.params.id);


        if(!user){
            return res.status(404).json({error: "ERROR"})
    }
   await user.destroy()
   return res.status(204).send();
    }
}








export default new UserControllers();