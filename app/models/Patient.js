import Sequelize, {Model} from "sequelize";

class Patient extends Model{
    static init(sequelize){
        super.init(
            {
                nome:Sequelize.STRING,
                cpf:Sequelize.STRING,
                rg:Sequelize.STRING,
                email:Sequelize.STRING,
                telefone:Sequelize.STRING,

            },
        
        {
        sequelize,
        tableName: "patient"
    }
);
}
static associate(models){
    this.hasMany(models.Consultas, {foreignKey :'patient_id'})
}
    
}


export default Patient;