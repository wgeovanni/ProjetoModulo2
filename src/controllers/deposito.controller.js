const { Deposito } = require('../models/deposito');
const { validateEmail, validateOnlyNumbers, validateOnlyLetters, validateStringLenght } = require('../utils');
const { sign } = require('jsonwebtoken');
const { config } = require('dotenv');
const { Usuario } = require('../models/usuario');
config();

// Classe utilizada para representar a entidade Deposito
class DepositoController {

    async createDeposito(req, res) {

        try {
            const {
                userId,
                razao,
                cnpj,
                nome,
                email,
                fone,
                celular,
                cep,
                endereco,
                numero,
                bairro,
                cidade,
                estado,
                complemento,
                lat,
                long
            } = req.body

            // ------------------------------ Verificações de campos ------------------------------//

            // Campo userId
            if (!userId) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo userId é obrigatório."
                })
            }

            if (!validateOnlyNumbers(userId)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo userId deve conter somente números."
                })
            }

            const userIdExists = Usuario.findByPk(userId);
            if (!userIdExists) {
                res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O usuário é inexistente."
                })
            }

            // Campo Razão Social
            if (!razao) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo razão social é obrigatório."
                })
            }

            if (!validateStringLenght(razao, 2, 50)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo razão social deve conter entre 2 e 50 caracteres."
                })
            }

            if (!validateOnlyLetters(razao)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo razão social deve conter somente letras."
                })
            }

            const razaoExist = Deposito.findOne({ where: { razao } });
            if (!razaoExist) {
                return res.status(409).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "Esta razão social já está cadastrada no sistema."
                })
            }

            // Campo CNPJ
            if (!cnpj) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo CNPJ é obrigatório."
                })
            }

            if (!validateOnlyNumbers(cnpj)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo CNPJ deve conter somente números."
                })
            }

            if (!validateStringLenght(cnpj, 14, 14)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo CNPJ deve conter 14 caracteres."
                })
            }

            const cnpjExist = Deposito.findOne({ where: { cnpj } });
            if (!cnpjExist) {
                return res.status(409).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O CNPJ já consta no banco de dados."
                })
            }

            if (!nome) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo nome fantasia é obrigatório."
                })
            }

            if (!validateStringLenght(nome, 2, 50)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo nome fantasia deve conter entre 2 e 50 caracteres."
                })
            }

            // Campo Email
            if (!email) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo email é obrigatório."
                })
            }

            if (!validateEmail(email)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo email deve estar no padrão exemplo@email.com"
                })
            }

            // Campo fone
            if (!validateOnlyNumbers(fone)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo telefone deve conter apenas números."
                })
            }

            if (!validateStringLenght(fone, 8, 10)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo telefone deve conter entre 8 e 10 números."
                })
            }

            // Campo celular
            if (!celular) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo celular é obrigatório."
                })
            }

            if (!validateStringLenght(celular, 10, 11)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo celular deve conter entre 10 e 11 números."
                })
            }

            if (!validateOnlyNumbers(celular)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo celular deve conter somente números."
                })
            }

            // Campo cep
            if (!cep) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo CEP é obrigatório."
                })
            }

            if (!validateStringLenght(cep, 8, 8)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo CEP deve conter 8 números."
                })
            }

            if (!validateOnlyNumbers(cep)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo CEP deve conter somente números."
                })
            }

            // Campo endereço
            if (!endereco) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo endereço é obrigatório."
                })
            }

            if (validateStringLenght(endereco, 2, 50)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo endereço deve conter entre 2 e 50 caracteres."
                })
            }

            // Campo número
            if (!numero) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo número é obrigatório."
                })
            }

            if (!validateOnlyNumbers(numero)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo número deve conter somente números."
                })
            }

            // Campo bairro
            if (!bairro) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo bairro é obrigatório."
                })
            }

            if (!validateStringLenght(bairro, 2, 40)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo bairro deve conter entre 2 e 40 caracteres."
                })
            }

            // Campo cidade
            if (!cidade) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo cidade é obrigatório."
                })
            }

            if (!validateStringLenght(cidade, 2, 40)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo cidade deve conter entre 2 e 40 caracteres."
                })
            }

            // Campo estado
            if (!estado) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo estado é obrigatório."
                })
            }

            if (!validateStringLenght(estado, 2, 20)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo estado deve conter entre 2 e 20 caracteres."
                })
            }

            if (!validateStringLenght(complemento)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo complemento deve conter entre 2 e 50 caracteres."
                })
            }

            if (lat < -90 || lat > 90) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo latitude deve possuir valores entre -90 e 90."
                })
            }

            if (long < -180 || long > 180) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo longitude deve possuir valores entre -180 e 180"
                })
            }

            //--------------------Fim de verificação de dados--------------------//

            const data = await Deposito.create({
                userId,
                razao,
                cnpj,
                nome,
                email,
                fone,
                celular,
                cep,
                endereco,
                numero,
                bairro,
                cidade,
                estado,
                complemento,
                lat,
                long
            })

            return res.status(201).send(data.id, data);
        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível cadastrar depósito.",
                cause: error.message
            })
        }
    }
}

module.exports = new DepositoController();