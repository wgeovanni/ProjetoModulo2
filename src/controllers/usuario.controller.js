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



            // Campo sobrenome
            if (!sobrenome) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo sobrenome obrigatório."
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




            // Campo email
            if (!email) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo email obrigatório."
                })
            }



            // Campo senha
            if (!senha) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo senha obrigatório."
                })
            }



            // Campo status
            if (!status) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo status obrigatório."
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
};

module.exports = new UsuarioControler();