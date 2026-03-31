import  Sequelize , {Model}from  "sequelize";

class Consultas extends Model{
    static init(sequelize){
        super.init(
            {
                data:Sequelize.DATE,
                hora:Sequelize.DATE,
                
            },
        
        {
            sequelize,
            tableName: "consultas"
        }
    );

    }
    static associate(models){
        this.belongsTo(models.Patient, {foreignKey: 'paciente_id'}),
         this.belongsTo(models.Medic, {foreignKey: 'medico_id'})
    }
}


export default Consultas;