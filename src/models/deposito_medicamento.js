const { STRING, INTEGER } = require('sequelize');
const { connection } = require('../database/connection');

const Deposito_Medicamento = connection.define('depositos_medicamentos', {

    depositoRazao: {
        type: INTEGER,
        references: {
            model: 'depositos',
            key: 'razao'
        },
        allowNull: false
    },
    medicamentoNome: {
        type: INTEGER,
        references: {
            model: 'medicamentos',
            key: 'nome'
        },
        allowNull: false
    },
    quantidade: {
        type: INTEGER,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
    }
}, { underscored: true, paranoid: true });

module.exports = { Deposito_Medicamento };