'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('medicamentos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
      },
      medicamento: {
        type: Sequelize.STRING,
        allowNull: false
      },
      laboratorio: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dosagem: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      un_dosagem: {
        type: Sequelize.ENUM("mg", "mcg", "g", "ml", "%", "Outro"),
        allowNull: false
      },
      tipo: {
        type: Sequelize.ENUM("Medicamento controlado", "Medicamento não controlado"),
        allowNull: false
      },
      preco: {
        type: Sequelize.DECIMAL,
        allowNull: false
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

    await queryInterface.dropTable('users');

  }
};
