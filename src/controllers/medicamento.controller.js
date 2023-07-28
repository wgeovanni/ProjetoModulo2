const { Usuario } = require("../models/usuario");
const { Medicamento } = require('../models/medicamento');
const { validateOnlyNumbers, validateStringLenght, validateUnDosagem, validateTipo, formatNumber } = require("../utils");

class MedicamentoController {

    async createMedicamento(req, res) {
        try {

            const { userId,
                medicamento,
                laboratorio,
                descricao,
                dosagem,
                unDosagem,
                tipo,
                preco,
                quantidade } = req.body;

            // ------------------------------ Verificações de campos ------------------------------//

            // Campo userID
            if (!userId) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O id do usuário é obrigatório."
                })
            }

            if (!validateOnlyNumbers(userId)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O id do usuário deve conter somente números."
                })
            }

            // Verifica se o id do usuário consta no banco de dados
            const userIdExist = await Usuario.findByPk(userId);
            if (!userIdExist) {
                return res.status(404).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O id do usuário não existe."
                })
            }

            // Campo medicamento
            if (!medicamento) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O campo nome do medicamento é obrigatório."
                })
            }

            if (!validateStringLenght(medicamento, 2, 80)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O campo nome do medicamento deve conter entre 2 e 80 caracteres."
                })
            }

            // Verifica se o medicamento já existe no banco de dados
            const medicamentoExist = await Medicamento.findOne({ where: { medicamento } });
            if (medicamentoExist) {
                return res.status(409).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O medicamento já está cadastrado no banco de dados."
                })
            }

            // Campo laboratório
            if (!laboratorio) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O campo nome do laboratório é obrigatório."
                })
            }

            if (!validateStringLenght(laboratorio, 2, 80)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O campo nome do laboratório deve conter entre 2 e 80 caracteres."
                })
            }

            // Campo descrição
            if (descricao && !validateStringLenght(descricao, 5, 500)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O campo descrição deve conter entre 5 e 500 caracteres."
                })
            }

            // Campo dosagem
            if (!dosagem) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O campo dosagem obrigatório."
                })
            }

            // Campo unidade de dosagem
            if (isNaN(dosagem)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O campo dosagem deve ser um número."
                })
            }

            if (dosagem <= 0) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O campo dosagem deve ser um número maior que zero."
                })
            }

            // Campo unidade de dosagem
            if (!unDosagem) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O campo unidade de dosagem é obrigatório."
                })
            }

            if (!validateUnDosagem(unDosagem)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O campo unidade de dosagem deve ter um dos seguintes valores: mg, mcg, g, mL, % ou Outro."
                })
            }

            // Campo tipo de medicamento
            if (!tipo) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O campo tipo de medicamento é obrigatório."
                })
            }

            if (!validateTipo(tipo)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O campo tipo deve conter os valores Medicamento controlado ou Medicamento não controlado."
                })
            }

            // Campo preço unitário
            if (!preco) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O campo preço é obrigatório."
                })
            }

            if (isNaN(preco)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O campo preço deve ser um número."
                })
            }

            if (preco <= 0) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O campo preço deve ser maior que zero."
                })
            }

            // Campo quantidade de medicamento
            if (!quantidade) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O campo quantidade é obrigatório."
                })
            }

            if (isNaN(quantidade)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O campo dosagem deve ser um número."
                })
            }

            if (quantidade <= 0) {
                if (!isNaN(dosagem)) {
                    return res.status(400).send({
                        msg: "Não foi possível cadastrar o medicamento.",
                        cause: "O campo dosagem deve ser maior que zero."
                    })
                }
            }

            // Deixa o valor recebido no formato de duas casas decimais após a vírgula
            const formatedDosagem = formatNumber(dosagem);
            const formatedPreco = formatNumber(preco);
            const formatedQuantidade = formatNumber(quantidade);

            const data = await Medicamento.create({
                userId,
                medicamento,
                laboratorio,
                descricao,
                dosagem: formatedDosagem,
                unDosagem,
                tipo,
                preco: formatedPreco,
                quantidade: formatedQuantidade
            })

            console.log(unDosagem)
            return res.status(201).send(data);

            // ------------------------------ Fim de verificação de campos ------------------------//
        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível cadastrar medicamento.",
                cause: error.message
            })
        }
    }
}

module.exports = new MedicamentoController();