const { INTEGER } = require("sequelize");

module.exports = {
   up (queryInterface, Sequelize) {
    return queryInterface.createTable('medic',{
      id:{
        type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
      },
      nome:{
            type: Sequelize.STRING,
            allowNull: false,
      },
      cpf:{
            type: Sequelize.STRING,
            allowNull: false,
            unique:true,
      },
        
        created_at:{
            type: Sequelize.DATE,
            allowNull: false,
        },
        updated_at:{
            type: Sequelize.DATE,
            allowNull: false,
        },
        especialidade_id:{
          type:Sequelize.INTEGER,
          allowNull:false,
          references:{model: 'especialidade', key: 'id'},
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
    })
   
  },

   down (queryInterface, Sequelize) {
    return queryInterface.dropTable('medic')
    
  }
};
