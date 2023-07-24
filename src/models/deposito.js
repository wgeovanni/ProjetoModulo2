const { INTEGER, STRING, DATE, ENUM } = require('sequelize');
const { connection } = require('../database/connection');

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
        type: Sequelize.STRING,
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
        allowNull: false
    },
    cnpj: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
        validate: {
            isEmail: {
                string: "O campo email deve possuir o formato exemplo@email.com"
            }
        },
        allowNull: false
    },
    fone: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
        validate: {
            len: {
                string: "O campo endereço deve conter entre 2 e 50 caracteres.",
                args: [2, 50]
            },
        },
        allowNull: false
    },
    numero: {
        type: Sequelize.INTEGER,
        validate: {
            isAlphanumeric: {
                string: "O campo número deve conter somente números.",
            }
        },
        allowNull: false
    },
    bairro: {
        type: Sequelize.STRING,
        validate: {
            len: {
                string: "O campo bairro deve conter entre 2 e 40 caracteres.",
                args: [2, 50]
            },
        },
        allowNull: false
    },
    cidade: {
        type: Sequelize.STRING,
        validate: {
            len: {
                string: "O campo bairro deve conter entre 2 e 40 caracteres.",
                args: [2, 50]
            },
            isAlpha: {
                string: "O campo cidade deve conter somente letras.",
                args: /^[A-Za-záàâãéèêíïóôõöúçÁÀÂÃÉÈÍÏÓÔÕÖÚÇ ]+$/
            }
        },
        allowNull: false
    },
    estado: {
        type: Sequelize.STRING,
        validate: {
            len: {
                string: "O campo estado deve conter entre 2 e 20 caracteres.",
                args: [2, 20]
            },
            isAlpha: {
                string: "O campo estado deve conter somente letras.",
                args: /^[A-Za-záàâãéèêíïóôõöúçÁÀÂÃÉÈÍÏÓÔÕÖÚÇ ]+$/
            }
        },
        allowNull: false
    },
    complemento: {
        type: Sequelize.STRING,
        allowNull: true
    },
    latitude: {
        type: Sequelize.STRING,
        allowNull: true
    },
    longitude: {
        type: Sequelize.STRING,
        allowNull: true
    },
    status: {
        type: Sequelize.ENUM("Ativo", "Inativo"),
        defaultValue: "Ativo",
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
}, { underscored: true, paranoid: true });

module.exports = { Deposito };