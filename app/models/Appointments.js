import Sequelize,  {Model} from "sequelize";




class Appointments extends Model{
    static init(sequelize){
        super.init({
            
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
        tableName: 'appointments', 
        underscored: true,
      },
        );
           return this;
    }
    static associate(models){
        // Um agendamento pertence a um paciente (User)
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    
    // Um agendamento pertence a um médico (Provider)
    this.belongsTo(models.User, { foreignKey: 'provider_id' });
    }
}


export default Appointments;
 