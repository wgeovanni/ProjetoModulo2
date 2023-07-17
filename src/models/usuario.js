const { STRING, DATE, ENUM } = require('sequelize');
const { connection } = require('../database/connection');

const Usuario = connection.define('usuario', {

    nome: {
        type: STRING,
        validate: {
            len: {
                msg: "O nome precisa ter entre 2 e 20 caracteres.",
                args: [2, 20]
            },
            is: {
                msg: "O nome deve conter somente letras.",
                args: /^[A-Za-záàâãéèêíïóôõöúçÁÀÂÃÉÈÍÏÓÔÕÖÚÇ ]+$/
            }
        },
        allowNull: false
    },
    sobrenome: {
        type: STRING,
        validate: {
            len: {
                msg: "O sobrenome precisa ter entre 2 e 20 caracteres.",
                args: [2, 20]
            },
            is: {
                msg: "O sobrenome deve conter somente letras.",
                args: /^[A-Za-záàâãéèêíïóôõöúçÁÀÂÃÉÈÍÏÓÔÕÖÚÇ ]+$/
            }
        },
        allowNull: false
    },
    genero: {
        type: STRING,
        validate: {
            is: {
                msg: "O campo gênero deve conter somente letras.",
                args: /^[A-Za-záàâãéèêíïóôõöúçÁÀÂÃÉÈÍÏÓÔÕÖÚ ]+$/
            }
        },
        allowNull: true
    },
    dataNasc: {
        type: DATE,
        validate: {
            isDate: {
                msg: "Data de Nascimento deve estar no formato YYYY/MM/DD"
            },
            validaData(dataNasc) {
                if (dataNasc > new Date) {
                    throw Error("A data de nascimento deve ser menor que a data atual");
                }
            }
        },
        allowNull: false
    },
    cpf: {
        type: STRING,
        validate: {
            len: {
                msg: "O CPF deve conter 11 caracteres.",
                args: [11, 11]
            },
            is: {
                msg: "O CPF deve conter apenas números.",
                args: /^[0-9]+$/
            }
        },
        allowNull: false,
        unique: {
            msg: "O CPF já está cadastrado no sistema"
        }
    },
    fone: {
        type: STRING,
        validate: {
            len: {
                msg: "O número de telefone deve ter 10 caracteres.",
                args: [10, 10]
            },
            is: {
                msg: "O campo telefone deve conter apenas números.",
                args: /^[0-9]+$/
            }
        },
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
            len: {
                msg: "A senha deve conter entre 8 e 12 caracteres",
                args: [8, 12]
            },
            is: {
                msg: "A senha deve conter 1 letra Maiúscula, 1 número e 1 caractere especial.",
                args: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])(?!.*\s).{8,12}$/
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