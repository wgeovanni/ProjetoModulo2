const { STRING, DATE, ENUM } = require('sequelize');
const { connection } = require('../database/connection');

const Usuario = connection.define('usuario', {

    nome: {
        type: STRING,
        validate: {
            len: {
                msg: "O nome precisa ter entre 2 e 20 caracteres.",
                args: [2, 20]
            }
        },
        allowNull: false
    },
    sobrenome: {
        type: STRING,
        validate: {
            len: {
                msg: "O nome precisa ter entre 2 e 20 caracteres.",
                args: [2, 20]
            }
        },
        allowNull: false
    },
    genero: {
        type: STRING,
        allowNull: true
    },
    dataNasc: {
        type: DATE,
        validate: {
            isDate: true,
            isAfter: {
                msg: "A data deve ser maior que a atual.",
                args: new Date
            }
        },
        allowNull: false
    },
    cpf: {
        type: STRING,
        validate: {
            validarCpf(cpf) {
                if (cpf.lenght !== 11) {
                    throw new Error("O CPF deve conter 11 caracteres.")
                }
            }
        },
        allowNull: false,
        unique: true
    },
    fone: {
        type: STRING,
        allowNull: true
    },
    email: {
        type: STRING,
        validate: {
            isEmail: {
                msg: "O campo deve estar em formato de email"
            }
        },
        allowNull: false
    },
    senha: {
        type: STRING,
        validate: {
            is: {
                msg: "A senha deve conter no mínimo 8 e no máximo 12 caracteres, contendo 1 letra Maiúscula, 1 número e 1 caractere especial.",
                args: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])(?!.*\s).{8,10}$/
            }
        },
        allowNull: false
    },
    status: {
        type: ENUM("Ativo", "Inativo"),
        defaultValue: "Ativo",
        validate: {
            isIn: {
                msg: "Os valores possíveis são Ativo ou Inativo",
                args: [["Ativo", "Inativo"]]
            }
        },
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
},
    { underscored: true, paranoid: true });

module.exports = { Usuario };