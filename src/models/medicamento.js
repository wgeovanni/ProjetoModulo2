const { STRING, DATE, ENUM, DECIMAL, INTEGER } = require('sequelize');
const { connection } = require('../database/connection');
const { Usuario } = require('./usuario');

const Medicamento = connection.define('medicamentos', {
    usuarioId: {
        type: INTEGER,
        validate: {
            isNumeric: {
                string: "O id do usuário deve ser um número."
            }
        },
        references: {
            model: 'usuarios',
            key: 'id'
        },
        allowNull: false
    },
    medicamento: {
        type: STRING,
        validate: {
            len: {
                string: "O nome do medicamento deve conter entre 2 e 80 caracteres",
                args: [2, 80]
            }
        },
        allowNull: false
    },
    laboratorio: {
        type: STRING,
        validate: {
            len: {
                string: "O nome do laboratório deve ter entre 2 e 80 caracteres.",
                args: [2, 80]
            },
        },
        allowNull: false
    },
    descricao: {
        type: STRING,
        allowNull: true
    },
    dosagem: {
        type: DECIMAL,
        validate: {
            isNumeric: true
        },
        allowNull: false
    },
    unDosagem: {
        type: ENUM("mg", "mcg", "g", "ml", "%", "Outro"),
        allowNull: false
    },
    tipo: {
        type: ENUM("Medicamento controlado", "Medicamento não controlado"),
        allowNull: false
    },
    preco: {
        type: DECIMAL,
        validate: {
            isNumeric: {
                string: "O valor deve ser um número."
            }
        },
        allowNull: false
    },
    quantidade: {
        type: DECIMAL,
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
}, { underscored: true, paranoid: true })

Medicamento.belongsTo(Usuario);

module.exports = { Medicamento };