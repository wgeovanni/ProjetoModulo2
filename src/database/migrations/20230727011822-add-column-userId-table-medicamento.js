'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn('medicamentos', 'usuario_id', {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'usuarios',
        },
        key: 'id'
      },
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('user_id')
  }
};
