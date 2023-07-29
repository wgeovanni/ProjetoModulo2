'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('usuarios_depositos_medicamentos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        allowNull: false,
        onUpdate: 'CASCADE'
      },
      deposito_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'depositos',
          key: 'id'
        },
        allowNull: false,
        onUpdate: 'CASCADE'
      },
      medicamento_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'medicamentos',
          key: 'id'
        },
        allowNull: false,
        onUpdate: 'CASCADE'
      },
      quantidade: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('usuarios_depositos_medicamentos');

  }
};
