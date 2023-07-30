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
          model: {
            tableName: 'usuarios'
          },
          key: 'id'
        },
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      deposito_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'depositos'
          },
          key: 'id'
        },
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      medicamento_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'medicamentos'
          },
          key: 'id'
        },
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
