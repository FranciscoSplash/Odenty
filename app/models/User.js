import Sequelize, {Model}  from 'sequelize';
import bcrypt from 'bcryptjs';


class User extends Model{
    static init(sequelize){
        super.init({
            nome: Sequelize.STRING,
            email: Sequelize.STRING,
            // Campo que o usuário envia (não vai para o banco)
            senha: Sequelize.VIRTUAL,
            // Campo que REALMENTE salva no banco
            password_hash: Sequelize.STRING,

            provider: Sequelize.BOOLEAN
        }, {
            sequelize,
            tableName: 'users',
            underscored: false, // Se na migration está 'createdAt', aqui deve ser false
            // ADICIONE OS HOOKS AQUI DENTRO DAS OPÇÕES
            hooks: {
                beforeSave: async (user) => {
                    if (user.senha) {
                        user.password_hash = await bcrypt.hash(user.senha, 8);
                    }
                },
            },
        });

        return this; 
    }
        checkPassword(senha){
            return bcrypt.compare(senha, this.password_hash);
        }

 }


export default User;