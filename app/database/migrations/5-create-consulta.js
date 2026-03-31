
module.exports = {
   up (queryInterface, Sequelize) {
   return queryInterface.createTable('consulta', {
    id:{
        type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
      },data: {
        type: Sequelize.DATEONLY, //  removido o .NEW e usado DATEONLY para apenas a data
        allowNull: false,
      },
      hora: {
        type: Sequelize.TIME, // removido o .NEW e usado TIME para apenas o horário
        allowNull: false,
      },

        created_at:{
            type: Sequelize.DATE,
            allowNull: false,
        },
        updated_at:{
            type: Sequelize.DATE,
            allowNull: false,
        },
        paciente_id:{
          type:Sequelize.INTEGER,
           allowNull: false,
           references:{model: 'patient', key:'id'},
           onUpdate: 'CASCADE',
           onDelete:'CASCADE',
        },
        medico_id:{
           type:Sequelize.INTEGER,
           allowNull: false,
           references:{model: 'medic', key:'id'},
           onUpdate: 'CASCADE',
           onDelete:'CASCADE',
        }
   })
  },

  down (queryInterface, Sequelize) {
    return queryInterface.dropTable('consulta')
    
  }
};
