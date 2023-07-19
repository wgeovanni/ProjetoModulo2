const moment = require('moment');
const { Usuario } = require('../models/usuario');
const { validateOnlyLetters,
    validateOnlyNumbers,
    validateStringLenght,
    validateOneUpperLetter,
    validateOneNumber,
    validateOneSpecialChar,
    validateNoSpaces,
    validateDate,
    validateEmail,
    validateStatus } = require('../utils');
const { config } = require('dotenv');
const { sign } = require('jsonwebtoken');

class UsuarioControler {

    async createUser(req, res) {

        try {

            // Variáveis que recebem os dados enviados pelo body da requisição
            const { nome,
                sobrenome,
                genero,
                dataNasc,
                cpf,
                fone,
                email,
                senha,
                status } = req.body;

            // ------------------------------ Verificações de campos ------------------------------//

            // Campo nome
            if (!nome) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo nome obrigatório."
                })
            }

            if (!validateStringLenght(nome, 2, 50)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo nome deve conter entre 2 e 50 caracteres."
                })
            }

            if (!validateOnlyLetters(nome)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo nome deve conter somente letras."
                })
            }

            // Campo sobrenome
            if (!sobrenome) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo sobrenome obrigatório."
                })
            }

            if (!validateStringLenght(sobrenome, 2, 50)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo sobrenome deve conter entre 2 e 50 caracteres."
                })
            }

            if (!validateOnlyLetters(sobrenome)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo sobrenome deve conter somente letras."
                })
            }

            // Campo genero
            if (!validateOnlyLetters(genero)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo gênero deve conter apenas letras."
                })
            }

            // Campo data de Nascimento
            if (!dataNasc) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo data de nascimento é obrigatório."
                });
            };

            if (!validateDate(dataNasc)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo data de nascimento deve ser no formato YYYY/MM/DD."
                })
            }

            const birth = moment(dataNasc, "YYYY/MM/DD");
            const atual = moment();

            if (birth > atual) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "A data de nascimento deve ser menor que a data atual."
                })
            }

            const data18Years = birth.clone().add(18, 'y');
            if (data18Years > atual) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "O usuário deve ser maior que 18 anos."
                })
            }

            // Campo CPF
            if (!cpf) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo CPF obrigatório."
                })
            }

            if (!validateOnlyNumbers(cpf)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo CPF deve conter somente números."
                })
            }

            if (!validateStringLenght(cpf, 11, 11)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo CPF deve conter 11 caracteres."
                })
            }

            // Campo fone
            if (fone && !validateOnlyNumbers(fone)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo telefone deve conter somente números."
                })
            }

            if (!validateStringLenght(fone, 10, 11)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo telefone deve conter entre 10 e 11 números."
                })
            }

            // Campo email
            if (!email) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo email obrigatório."
                })
            }

            if (!validateEmail(email)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo email deve estar no formato exemplo@email.com"
                })
            }

            // Campo senha
            if (!senha) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo senha obrigatório."
                })
            }

            if (!validateStringLenght(senha, 8, 10)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo senha deve conter entre 8 e 10 caracteres."
                })
            }

            if (!validateOneUpperLetter(senha)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo senha deve conter pelo menos 1 letra maiúscula."
                })
            }

            if (!validateOneNumber(senha)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo senha deve ter pelo menos 1 caractere numérico."
                })
            }

            if (!validateOneSpecialChar(senha)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo senha deve conter pelo menos 1 caractere especial."
                })
            }

            if (validateNoSpaces(senha)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo senha não deve conter espaços."
                })
            }

            // Campo status
            if (!status) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo status obrigatório."
                })
            }

            if (!validateStatus(status)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo status deve estar com o valor Ativo ou Inativo."
                })
            }

            // Verifica se o cpf já existe no banco de dados e retorna mensagem de erro caso exista
            const cpfDbExist = await Usuario.findOne({ where: { cpf } });
            if (cpfDbExist !== null) {
                return res.status(409).send({ msg: "CPF já cadastrado." });
            };

            // Insere os dados na tabela
            const data = await Usuario.create({
                nome,
                sobrenome,
                genero,
                dataNasc,
                cpf,
                fone,
                email,
                senha,
                status
            });

            return res.status(201).send({
                "UserId": data.id,
                "Nome": data.nome,
                "Sobrenome": data.sobrenome,
                "Gênero": data.genero,
                "Data de Nascimento": dataNasc,
                "CPF": data.cpf,
                "Telefone": data.fone,
                "Email": data.email,
                "Status": data.status
            });

        } catch (error) {
            return res.status(400).send({ message: "Não foi possível criar novo usuário.", cause: error.message });
        }
    }

    async userLogin(req, res) {

        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).send({
                msg: "Não foi possível efetuar o login!",
                cause: "Campos email e senha são obrigatórios."
            })
        }

        if (!validateEmail(email)) {
            return res.status(400).send({
                msg: "Não foi possível logar.",
                cause: "Campo email deve estar no formato exemplo@email.com"
            })
        }

        const existEmail = Usuario.findOne({ where: { email } });
        if (!existEmail) {
            return res.status(404).send({
                msg: "Não foi possível efetuar o login!",
                cause: "Email não consta no sistema."
            })
        }

        if (!validateStringLenght(senha, 8, 10)) {
            return res.status(400).send({
                msg: "Não foi possível cadastrar usuário.",
                cause: "Campo senha deve conter entre 8 e 10 caracteres."
            })
        }

        if (!validateOneUpperLetter(senha)) {
            return res.status(400).send({
                msg: "Não foi possível cadastrar usuário.",
                cause: "Campo senha deve conter pelo menos 1 letra maiúscula."
            })
        }

        if (!validateOneNumber(senha)) {
            return res.status(400).send({
                msg: "Não foi possível cadastrar usuário.",
                cause: "Campo senha deve ter pelo menos 1 caractere numérico."
            })
        }

        if (!validateOneSpecialChar(senha)) {
            return res.status(400).send({
                msg: "Não foi possível cadastrar usuário.",
                cause: "Campo senha deve conter pelo menos 1 caractere especial."
            })
        }

        if (validateNoSpaces(senha)) {
            return res.status(400).send({
                msg: "Não foi possível cadastrar usuário.",
                cause: "Campo senha não deve conter espaços."
            })
        }

        if (senha !== existEmail.senha) {
            return res.status(400).send({
                msg: "Não foi possível efetuar o login!",
                cause: "Email ou senha incorretos"
            })
        }

        const payload = { ID: existEmail.id, email };
        const token = sign(payload, process.env.SECRET_KEY, { expiresIn: '7d' });

        return res.status(200).send(token);
    }
};

module.exports = new UsuarioControler();