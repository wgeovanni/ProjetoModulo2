const { Deposito } = require("../models/deposito");
const { Deposito_Medicamento } = require("../models/deposito_medicamento");
const { Medicamento } = require('../models/medicamento');
const { validateOnlyNumbers, validateStringLenght, validateOnlyLetters } = require("../utils");

class Deposito_MedicamentoController {

    // Função para cadastro de novo medicamento em depósito no sistema.
    // Recebe através do body da request os dados: depositoRazao, medicamentoMedicamento, quantidade.
    // Caso passe nas validações cadastra novo medicamento no depósito.
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

            // Verifica se o deposito está com  o status inativo
            if (depositoRazaoExist.status === "Inativo") {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar medicamento no depósito.",
                    cause: "Este depósito está com o status Inativo."
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

    // Função para atualização da quantidade de medicamento em depósito.
    // Recebe através do body da request os dados: medicamentoMedicamento, quantidade.
    // Caso passe nas validações atualiza a quantidade do medicamento no depósito.
    async updateDepMed(req, res) {
        try {

            const { id } = req.params
            const {
                medicamentoMedicamento,
                quantidade,
                tipo } = req.body

            //------------------------------ Verificações de campos ------------------------------//

            // Campo ID de depósito
            if (!id) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar medicamento no depósito.",
                    cause: "O id passado por params é obrigatório."
                })
            }

            if (!validateOnlyNumbers(id)) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar medicamento no depósito.",
                    cause: "O id passado por params deve ser um número."
                })
            }

            // Verifica a existência do depósito no banco de dados
            const depositoIdExist = await Deposito_Medicamento.findOne({ where: { id } });
            if (!depositoIdExist) {
                return res.status(404).send({
                    msg: "Não foi possível atualizar medicamento no depósito.",
                    cause: "O id não existe."
                })
            }

            // Verifica o campo medicamentoMedicamento
            if (!medicamentoMedicamento) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar medicamento no depósito.",
                    cause: "O campo medicamentoMedicamento é obrigatório."
                })
            }

            if (!validateOnlyLetters(medicamentoMedicamento)) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar medicamento no depósito.",
                    cause: "O campo medicamentoMedicamento deve conter somente letras."
                })
            }

            if (!validateStringLenght(medicamentoMedicamento, 2, 80)) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar medicamento no depósito.",
                    cause: "O campo medicamentoMedicamento deve conter entre 2 e 80 caracteres."
                })
            }

            // Verifica se o nome do medicamento do id recebido 
            // é igual ao do banco de dados
            const medDoId = await Deposito_Medicamento.findOne({ where: { id } })
            if (medicamentoMedicamento !== medDoId.medicamentoMedicamento) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar medicamento no depósito.",
                    cause: `O nome deste medicamento não é igual ao cadastrado no depósito: ${medDoId.medicamentoMedicamento}.`
                })
            }

            // Verifica o campo quantidade
            if (!quantidade) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar medicamento no depósito.",
                    cause: "O campo quantidade é obrigatório."
                })
            }

            if (isNaN(quantidade)) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar medicamento no depósito.",
                    cause: "O campo quantidade deve conter apenas números."
                })
            }

            if (quantidade <= 0) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar medicamento no depósito.",
                    cause: "O campo quantidade deve conter valores maior que zero."
                })
            }

            if (!tipo) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar medicamento no depósito.",
                    cause: "O campo tipo é obrigatório."
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

            switch (tipo) {

                // Caso queira depositar mais remédios do id cadastrado
                case "Depósito":
                    // Verifica se há medicamentos disponíveis para depósito
                    if (quantidadeLimite === 0) {
                        return res.status(400).send({
                            msg: "Não foi possível atualizar medicamento no depósito.",
                            cause: "Não há mais deste medicamento para ser cadastrado."
                        })
                    }

                    // Variável que recebe a quantidade já cadastrada no id recebido
                    const quantId = await Deposito_Medicamento.findOne({ where: { id } });

                    // Calcula o valor atual sem a quantidade de remédios do id recebido
                    const quantAtual = quantidadeCount - quantId.quantidade;

                    // cálcula o restante que pode ser adicionado no depósito
                    const restante = quantidadeTotal.quantidade - quantAtual

                    // Verifica se a quantidade recebida não é maior do que a que está disponível no banco de dados
                    if (quantidade > restante) {
                        return res.status(409).send({
                            msg: "Não foi possível atualizar medicamento no depósito.",
                            cause: `A quantidade deve ser menor ou igual do que ${restante}.`
                        })
                    }

                    // Atualização no banco dados
                    await Deposito_Medicamento.update({ quantidade }, {
                        where: { id }
                    });

                    const dataDeposito = await Deposito_Medicamento.findOne({ where: { id } })

                    return res.status(200).send(dataDeposito);

                // Caso queira retirar remédios do id cadastrado
                case "Retirada":
                    // Recebe a quantidade de medicamentos JÁ CADASTRADOS no id recebido
                    const quantidadeDoMed = await Deposito_Medicamento.sum('quantidade', {
                        where: {
                            id,
                            medicamentoMedicamento
                        }
                    });

                    if (quantidade > quantidadeDoMed) {
                        return res.status(409).send({
                            msg: "Não foi possível atualizar medicamento no depósito.",
                            cause: `A quantidade deve ser menor ou igual do que ${quantidadeDoMed}.`
                        })
                    }

                    const quantidadeAtual = quantidadeDoMed - quantidade

                    await Deposito_Medicamento.update({ quantidade: quantidadeAtual }, {
                        where: { id }
                    });

                    const dataRetirada = await Deposito_Medicamento.findOne({ where: { id } })
                    return res.status(200).send(dataRetirada);

                default:
                    return res.status(400).send({
                        msg: "Não foi possível atualizar medicamento no depósito.",
                        cause: "O campo tipo deve ser Depósito ou Retirada."
                    })
            }

        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível atualizar os medicamentos cadastrados.",
                error: error.message
            })
        }
    }

    // Função utilizada para listar um medicamento no depósito.
    // A definição do medicamento no depósito a ser listado é feita através de seu ID 
    // passado pelo params da request
    async listaOneDepMed(req, res) {
        try {

            const { id } = req.params;

            // Validações de ID
            if (!validateOnlyNumbers(id)) {
                return res.status(400).send({
                    msg: "Não foi possível listar dados do medicamento no depósito.",
                    cause: "Campo id é obrigatório."
                })
            }

            // Verifica a existência da ID no banco de dados
            const depMedIdExist = await Deposito_Medicamento.findOne({ where: { id } });
            if (!depMedIdExist) {
                return res.status(404).send({
                    msg: "Não foi possível listar dados do medicamento no depósito.",
                    cause: "ID não consta o banco de dados."
                })
            }

            return res.status(200).send(depMedIdExist);

        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível listar medicamento no depósito.",
                cause: error.message
            })
        }
    }
}

module.exports = new Deposito_MedicamentoController();
