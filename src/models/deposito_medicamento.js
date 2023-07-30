const { STRING, INTEGER, DATE } = require('sequelize');
const { connection } = require('../database/connection');

const Deposito_Medicamento = connection.define('depositos_medicamentos', {

    depositoRazao: {
        type: STRING,
        references: {
            model: 'depositos',
            key: 'razao'
        },
        allowNull: false
    },
    medicamentoMedicamento: {
        type: STRING,
        references: {
            model: 'medicamentos',
            key: 'medicamento'
        },
        allowNull: false
    },
    quantidade: {
        type: INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DATE,
        allowNull: false
    },
    updatedAt: {
        type: DATE,
        allowNull: false
    },
    deletedAt: {
        type: DATE,
        allowNull: true
    }
}, { underscored: true, paranoid: true });

module.exports = { Deposito_Medicamento };