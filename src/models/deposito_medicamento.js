const { STRING, INTEGER } = require('sequelize');
const { connection } = require('../database/connection');

const Usuarios_Depositos_Medicamentos = connection.define('usuarios_depositos_medicamentos', {

    depositoId: {
        type: INTEGER,
        references: {
            model: 'depositos',
            key: 'key'
        },
        allowNull: false
    },
    medicamentoID: {
        type: INTEGER,
        references: {
            model: 'medicamentos',
            key: 'id'
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

module.exports = { Usuarios_Depositos_Medicamentos };