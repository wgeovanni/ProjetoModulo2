'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('depositos_medicamentos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true
      },
      deposito_razao: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'depositos'
          },
          key: 'razao'
        },
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      medicamento_medicamento: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'medicamentos'
          },
          key: 'medicamento'
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

    await queryInterface.dropTable('depositos_medicamentos');

  }
};
