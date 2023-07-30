const { Deposito } = require("../models/deposito");
const { Deposito_Medicamento } = require("../models/deposito_medicamento");
const { Medicamento } = require('../models/medicamento');
const { validateOnlyNumbers, validateStringLenght, validateOnlyLetters } = require("../utils");

class Deposito_MedicamentoController {

    async createDepMed(req, res) {
        try {

            const {
                depositoRazao,
                medicamentoMedicamento,
                quantidade } = req.body

            // ------------------------------ Verificações de campos ------------------------------//

            // Verifica campo depositoRazao
            if (!depositoRazao) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar medicamento no depósito.",
                    cause: "O campo depositoRazao é obrigatório."
                })
            }

            if (!validateStringLenght(depositoRazao, 2, 50)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar medicamento no depósito.",
                    cause: "O campo depositoRazao deve conter entre 2 e 50 caracteres."
                })
            }

            if (!validateOnlyLetters(depositoRazao)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar medicamento no depósito.",
                    cause: "O campo depostioRazao deve conter somente letras."
                })
            }

            // Verifica se a razão social já está cadastrada no sistema
            const depositoRazaoExist = await Deposito.findOne({ where: { razao: depositoRazao } });
            if (depositoRazaoExist === null) {
                return res.status(409).send({
                    msg: "Não foi possível cadastrar medicamento no depósito.",
                    cause: "Esta razão social não esta cadastrada no banco de dados."
                })
            }

            // Verifica o campo medicamentoMedicamento
            if (!medicamentoMedicamento) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar medicamento no depósito.",
                    cause: "O campo medicamentoMedicamento é obrigatório."
                })
            }

            if (!validateOnlyLetters(medicamentoMedicamento)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar medicamento no depósito.",
                    cause: "O campo medicamentoMedicamento deve conter somente letras."
                })
            }

            if (!validateStringLenght(medicamentoMedicamento, 2, 80)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar medicamento no depósito.",
                    cause: "O campo medicamentoMedicamento deve conter entre 2 e 80 caracteres."
                })
            }

            // Verifica se o id do medicamento consta no banco de dados
            const medicamentoMedicamentoExist = await Medicamento.findOne({
                where: {
                    medicamento: medicamentoMedicamento
                }
            });

            if (medicamentoMedicamentoExist === null) {
                return res.status(404).send({
                    msg: "Não foi possível cadastrar medicamento no depósito.",
                    cause: "O medicamentoMedicamento não esta cadastrado no banco de dados."
                })
            }

            // Verifica campo quantidade
            if (!quantidade) {
                console.log("aqui")
                return res.status(400).send({
                    msg: "Não foi possível cadastrar medicamento no depósito.",
                    cause: "O campo quantidade é obrigatório."
                })
            }

            if (isNaN(quantidade)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar medicamento no depósito.",
                    cause: "O campo quantidade é deve conter somente números."
                })
            }

            //-----------------------------Fim de verificação de dados-----------------------------//

            // Recebe a quantidade TOTAL do medicamento
            const quantidadeTotal = await Medicamento.findOne({
                where: {
                    medicamento: medicamentoMedicamento
                }
            })

            // Recebe a quantidade de medicamentos JÁ CADASTRADOS
            const quantidadeCount = await Deposito_Medicamento.sum('quantidade', {
                where: {
                    medicamentoMedicamento
                }
            });

            // Calcula a quantidade que AINDA PODE ser cadastrada em depósito e
            // verifica se esta abaixo do limite de remédios que pode ser cadastrada
            const quantidadeLimite = quantidadeTotal.quantidade - quantidadeCount;

            // Verifica se há medicamentos disponíveis para depósito
            if (quantidadeLimite === 0) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar medicamento no depósito.",
                    cause: "Não há mais deste medicamento para ser cadastrado."
                })
            }

            // Verifica se a quantidade recebida não é maior do que a que está disponível no banco de dados
            if (quantidade > quantidadeLimite || quantidade > quantidadeTotal) {
                return res.status(409).send({
                    msg: "Não foi possível cadastrar medicamento no depósito.",
                    cause: `A quantidade deve ser menor ou igual do que ${quantidadeLimite}.`
                })
            }

            // Criação no banco dados
            const data = await Deposito_Medicamento.create({
                depositoRazao,
                medicamentoMedicamento,
                quantidade
            });

            return res.status(200).send(data);

        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível atualizar medicamento no depósito.",
                cause: error.message
            })
        }
    }
}

module.exports = new Deposito_MedicamentoController();
