const { INTEGER, STRING, DATE, ENUM } = require('sequelize');
const { connection } = require('../database/connection');
const { Usuario } = require('./usuario');

const Deposito = connection.define('deposito', {

    userId: {
        type: INTEGER,
        references: {
            model: 'usuarios',
            key: 'id'
        },
        allowNull: false
    },
    razao: {
        type: STRING,
        validate: {
            len: {
                msg: "A razão social deve ter entre 2 e 50 caracteres.",
                args: [2, 50]
            },
            is: {
                msg: "O nome deve conter somente letras.",
                args: /^[A-Za-záàâãéèêíïóôõöúçÁÀÂÃÉÈÍÏÓÔÕÖÚÇ ]+$/
            }
        },
        allowNull: false,
        unique: {
            string: "A razão social já consta no banco de dados,"
        }
    },
    cnpj: {
        type: STRING,
        validate: {
            len: {
                msg: "O CNPJ deve conter 14 caracteres.",
                args: [14, 14]
            }
        },
        allowNull: false,
        unique: {
            string: "O CNPJ já está cadastrado no banco de dados."
        }
    },
    nome: {
        type: STRING,
        validate: {
            len: {
                msg: "O nome fantasia deve ter entre 2 e 50 caracteres.",
                args: [2, 50]
            },
            is: {
                msg: "O nome deve conter somente letras.",
                args: /^[A-Za-záàâãéèêíïóôõöúçÁÀÂÃÉÈÍÏÓÔÕÖÚÇ ]+$/
            }
        },
        allowNull: false
    },
    email: {
        type: STRING,
        validate: {
            isEmail: {
                string: "O campo email deve possuir o formato exemplo@email.com"
            }
        },
        allowNull: false
    },
    fone: {
        type: STRING,
        validate: {
            len: {
                msg: "O número de telefone deve ter entre 8 ou 10 caracteres.",
                args: [8, 10]
            },
            is: {
                msg: "O campo telefone deve conter apenas números.",
                args: /^[0-9]+$/
            }
        },
        allowNull: true
    },
    celular: {
        type: STRING,
        validate: {
            len: {
                msg: "O número de celular deve ter 10 ou 11 caracteres.",
                args: [10, 11]
            },
            is: {
                msg: "O campo telefone deve conter apenas números.",
                args: /^[0-9]+$/
            }
        },
        allowNull: false
    },
    cep: {
        type: STRING,
        validate: {
            len: {
                string: "O campo CEP deve ter 8 dígitos.",
                args: [8, 8]
            },
            is: {
                msg: "O campo telefone deve conter apenas números.",
                args: /^[0-9]+$/
            }
        },
        allowNull: false
    },
    endereco: {
        type: STRING,
        validate: {
            len: {
                string: "O campo endereço deve conter entre 2 e 50 caracteres.",
                args: [2, 50]
            },
        },
        allowNull: false
    },
    numero: {
        type: INTEGER,
        validate: {
            isAlphanumeric: {
                string: "O campo número deve conter somente números.",
            }
        },
        allowNull: false
    },
    bairro: {
        type: STRING,
        validate: {
            len: {
                string: "O campo bairro deve conter entre 2 e 40 caracteres.",
                args: [2, 40]
            },
        },
        allowNull: false
    },
    cidade: {
        type: STRING,
        validate: {
            len: {
                string: "O campo bairro deve conter entre 2 e 40 caracteres.",
                args: [2, 50]
            }
        },
        allowNull: false
    },
    estado: {
        type: STRING,
        validate: {
            len: {
                string: "O campo estado deve conter entre 2 e 20 caracteres.",
                args: [2, 20]
            }
        },
        allowNull: false
    },
    complemento: {
        type: STRING,
        validate: {
            len: {
                string: "O campo complemento deve conter entre 2 e 50 caracteres.",
                args: [2, 50]
            }
        },
        allowNull: true
    },
    latitude: {
        type: STRING,
        allowNull: true
    },
    longitude: {
        type: STRING,
        allowNull: true
    },
    status: {
        type: ENUM("Ativo", "Inativo"),
        defaultValue: "Ativo",
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

module.exports = { Deposito };