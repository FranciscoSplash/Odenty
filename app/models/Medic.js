import Sequelize, {Model} from 'sequelize';



class Medic extends Model{
    static init(sequelize){
        super.init (
            {
            nome: Sequelize.STRING,
            cpf:Sequelize.STRING,
            especialidade_id: Sequelize.INTEGER, 
    
        },
         {
        sequelize,
        tableName: 'medic'
        }
        );
    }
    static associate(models){
        // Um médico tem muitas consultas (hasMany)
        this.hasMany(models.Consultas, {foreignKey: "medico_id"});
       
        // Um médico pertence a uma especialidade (belongsTo)
        this.belongsTo(models.Especialidade, {foreignKey: "especialidade_id"})
    }
}



export default Medic;