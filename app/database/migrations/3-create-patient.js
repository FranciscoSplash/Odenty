
module.exports = {
   up (queryInterface, Sequelize) {
    return queryInterface.createTable("patient", {
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
        rg:{
            type: Sequelize.STRING,
            allowNull: false,
            unique:true,
      },
      email:{
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        telefone:{
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        
        created_at:{
            type: Sequelize.DATE,
            allowNull: false,
        },
        updated_at:{
            type: Sequelize.DATE,
            allowNull: false,
        },

    })
  
  },

  down (queryInterface, Sequelize) {
   return queryInterface.dropTable('patient')
  }
};
