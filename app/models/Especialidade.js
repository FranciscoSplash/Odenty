

import Sequelize, {Model} from 'sequelize';



class Especialidade extends Model{
    static init(sequelize){
        super.init (
            {
            nome: Sequelize.STRING,
          
    
        }, {
        sequelize,
        tableName: 'especialidade'
        }
        );
    }
    static associate(models){

        // Uma especialidade tem muitos médicos
        this.hasMany(models.Medic, {foreignKey: "especialidade_id"})
        
         }
}



export default Especialidade;