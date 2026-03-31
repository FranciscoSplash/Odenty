'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   up (queryInterface, Sequelize) {
    return queryInterface.createTable('users',{
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
        email:{
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        provider:{
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        password_hash:{
            type: Sequelize.STRING,
            allowNull: false,
        },

        createdAt:{
            type: Sequelize.DATE,
            allowNull: false,
        },
        updatedAt:{
            type: Sequelize.DATE,
            allowNull: false,
        }
    })


  
  },

  down (queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
