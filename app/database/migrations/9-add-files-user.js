'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   return queryInterface.addColumn('users', 'avatar_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'files',
      id: "id" // Nome da tabela de referência
    },
    // Se a foto for apagada, o campo no usuário vira NULL (não quebra o sistema)
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
  });
},

  async down (queryInterface, Sequelize) {
   return queryInterface.removeColumn('users', 'avatar_id');
  }
};
