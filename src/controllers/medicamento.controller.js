const { Usuario } = require("../models/usuario");
const { Medicamento } = require('../models/medicamento');
const { Op } = require('sequelize');
const { validateOnlyNumbers, validateStringLenght, validateUnDosagem, validateTipo, formatNumber } = require("../utils");

class MedicamentoController {

    // Função para cadastro de novo medicamento no sistema
    // Recebe através do body da request os dados: usuarioId, medicamento,laboratorio,
    // descricao, dosagem, unDosagem, tipo, preco, quantidade
    // Caso passe nas validações cadastra novo medicamento
    async createMedicamento(req, res) {
        try {

            const { usuarioId,
                medicamento,
                laboratorio,
                descricao,
                dosagem,
                unDosagem,
                tipo,
                preco,
                quantidade } = req.body;

            // ------------------------------ Verificações de campos ------------------------------//

            // Campo usuarioId
            if (!usuarioId) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O id do usuário é obrigatório."
                })
            }

            if (!validateOnlyNumbers(usuarioId)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O id do usuário deve conter somente números."
                })
            }

            // Verifica se o id do usuário consta no banco de dados
            const usuarioIdExist = await Usuario.findOne({ where: { id: usuarioId } });
            if (!usuarioIdExist) {
                return res.status(404).send({
                    msg: "Não foi possível cadastrar o medicamento.",
                    cause: "O id do usuário não existe."
                })
            }

            // Verifica se o usuário está com o status definido como inativo
            if (usuarioIdExist.status === "Inativo") {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O usuário está inativo no sistema."
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

            // ------------------------------ Fim de verificação de campos ------------------------//

            // Deixa o valor recebido no formato de duas casas decimais após a vírgula
            const formatedDosagem = formatNumber(dosagem);
            const formatedPreco = formatNumber(preco);
            const formatedQuantidade = formatNumber(quantidade);

            // Verifica se o medicamento com o nome recebido
            // passou por soft delete
            const medicamentoExistBefore = await Medicamento.restore({
                where: {
                    medicamento,
                    deletedAt: {
                        [Op.not]: null
                    }
                }
            })

            // Caso não existam dados exluídos com soft delete, cria novo medicamento no
            // banco de dados. Caso ja existiu atualiza os dados. Retorna os dados.
            if (medicamentoExistBefore === 0) {
                const data = await Medicamento.create({
                    usuarioId,
                    medicamento,
                    laboratorio,
                    descricao,
                    dosagem: formatedDosagem,
                    unDosagem,
                    tipo,
                    preco: formatedPreco,
                    quantidade: formatedQuantidade
                })
                return res.status(201).send(data);
            } else {
                await Medicamento.update({
                    usuarioId,
                    medicamento,
                    laboratorio,
                    descricao,
                    dosagem: formatedDosagem,
                    unDosagem,
                    tipo,
                    preco: formatedPreco,
                    quantidade: formatedQuantidade
                }, {
                    where: {
                        medicamento
                    }
                })
            }

            // Dados a serem enviados
            const data = {
                usuarioId,
                medicamento,
                laboratorio,
                descricao,
                dosagem: formatedDosagem,
                unDosagem,
                tipo,
                preco: formatedPreco,
                quantidade: formatedQuantidade
            }
            return res.status(201).send(data);

        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível cadastrar medicamento.",
                cause: error.message
            })
        }
    }

    // Função para atualização de dados de medicamento no sistema
    // Recebe através de params o id do medicamento a ser alterado.
    // Recebe pelo body da request os dados: descrição, preço, e quantidade
    // Caso passe nas validações altera os dados do medicamento
    async updateMedicamento(req, res) {
        try {
            const { id } = req.params;
            const { descricao, preco, quantidade } = req.body;

            // ------------------------------ Verificações de campos ------------------------------//

            // Verifica o id
            if (!id) {
                return res.status(400).send({
                    msg: "Não foi possível alterar os dados do medicamento.",
                    cause: "O id do medicamento é obrigatório no params."
                })
            }

            if (!validateOnlyNumbers(id)) {
                return res.status(400).send({
                    msg: "Não foi possível alterar os dados do medicamento.",
                    cause: "O id do medicamento deve conter apenas números."
                })
            }

            // Verifica se o id consta no banco de dados
            const idExist = await Medicamento.findByPk(id);
            if (idExist === null) {
                return res.status(404).send({
                    msg: "Não foi possível alterar os dados do medicamento.",
                    cause: "O id não esta cadastrado no banco de dados."
                })
            }

            // Verifica campo descricao
            if (descricao && !validateStringLenght(descricao, 5, 500)) {
                return res.status(400).send({
                    msg: "Não foi possível alterar os dados do medicamento.",
                    cause: "O campo descricao deve conter entre 5 e 500 caracteres."
                })
            }

            // Verifica campo preço
            if (!preco) {
                return res.status(400).send({
                    msg: "Não foi possível alterar os dados do medicamento.",
                    cause: "O campo preco é obrigatório."
                })
            }

            if (isNaN(preco)) {
                return res.status(400).send({
                    msg: "Não foi possível alterar os dados do medicamento.",
                    cause: "O campo preco deve conter apenas números."
                })
            }

            if (preco <= 0) {
                return res.status(400).send({
                    msg: "Não foi possível alterar os dados do medicamento.",
                    cause: "O campo preco deve conter valores maior que zero."
                })
            }

            // Verifica o campo quantidade
            if (!quantidade) {
                return res.status(400).send({
                    msg: "Não foi possível alterar os dados do medicamento.",
                    cause: "O campo quantidade é obrigatório."
                })
            }

            if (isNaN(quantidade)) {
                return res.status(400).send({
                    msg: "Não foi possível alterar os dados do medicamento.",
                    cause: "O campo quantidade deve conter apenas números."
                })
            }

            if (quantidade <= 0) {
                return res.status(400).send({
                    msg: "Não foi possível alterar os dados do medicamento.",
                    cause: "O campo quantidade deve conter valores maior que zero."
                })
            }

            // ------------------------------ Fim de verificação de campos ------------------------//

            // Formatação de campos numericos
            const formatedPreco = formatNumber(preco);
            const formatedQuantidade = formatNumber(quantidade);

            // Atualização dos dados no banco de dados
            await Medicamento.update({
                descricao,
                preco,
                quantidade
            }, {
                where: { id }
            })

            // Dados a serem retornados
            const data = await Medicamento.findOne({ where: { id } });

            return res.status(200).send({
                "id": data.id,
                "descricao": data.descricao,
                "preco": data.preco,
                "quantidade": data.quantidade
            })

        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível alterar os dados do medicamento.",
                cause: error.message
            })
        }
    }

    // Função que serve para listar os medicamentos cadastrados no banco de dados
    // Recebe através de query params a opção de filtrar por tipo de medicamento:
    // CONTROLADO ou NAOCONTROLADO, caso nada seja passado, devolve uma lista com todos
    // os medicamentos
    async listMedicamentos(req, res) {
        try {
            const { tipo } = req.query;

            // Verifica os tipos de medicamentos e retorna uma lista com o respectivo tipo
            switch (tipo) {
                case "CONTROLADO":
                    const dataControl = await Medicamento.findAll({ where: { tipo: "Medicamento controlado" } });
                    if (dataControl.length === 0) {
                        return res.status(200).send({
                            msg: "Não existem medicamentos do tipo controlado no banco de dados"
                        });
                    }
                    return res.status(200).send(dataControl);

                case "NAOCONTROLADO":
                    const dataNotControl = await Medicamento.findAll({ where: { tipo: "Medicamento não controlado" } });
                    if (dataNotControl.length === 0) {
                        return res.status(200).send({
                            msg: "Não existem medicamentos do tipo não controlado no banco de dados"
                        });
                    }
                    return res.status(200).send(dataNotControl);

                // Caso a query params tipo não seja informada envia uma lista de
                // todos os medicamentos
                case undefined:
                    const data = await Medicamento.findAll();
                    return res.status(200).send(data);

                // Por padrão envia mensagem com os valores aceitos na query params
                default:
                    return res.status(400).send({
                        msg: "Não foi possível listar os medicamentos.",
                        cause: "A query deve receber o valor CONTROLADO ou NAOCONTROLADO"
                    });
            }

        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível listar medicamentos.",
                cause: error.message
            })
        }
    }

    // Função utilizada para listar um medicamento.
    // A definição do medicamento a ser listado é feita através de seu ID 
    // passado pelo params da request
    // Caso seja validado o id é enviada uma resposta com os dados do medicamento
    async listOneMedicamento(req, res) {
        try {

            const { id } = req.params;

            // Validação de id
            if (!id) {
                return res.status(400).send({
                    msg: "Não foi possível listar os dados do medicamento.",
                    cause: "O id do medicamento é obrigatório."
                })
            }

            if (!validateOnlyNumbers(id)) {
                return res.status(400).send({
                    msg: "Não foi possível listar os dados do medicamento.",
                    cause: "O id do medicamento deve ser um número."
                })
            }

            // Verifica se o id consta no banco de dados
            const data = await Medicamento.findByPk(id);
            if (!data) {
                return res.status(404).send({
                    msg: "Não foi possível listar os dados do medicamento.",
                    cause: "O id informado não consta no banco de dados."
                })
            }

            return res.status(200).send(data);
        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível listar os dados do medicamento.",
                cause: error.message
            })
        }
    }

    // Função para deleção de medicamento no banco de dados
    // Recebe no params a id do medicamento e caso exista no banco de dados, exclui
    async deleteMedicamento(req, res) {
        try {

            const { id } = req.params;

            // Verificações do params id
            if (!id) {
                return res.status(400).send({
                    msg: "Não foi possível deletar o medicamento.",
                    cause: "O params id é obrigatório."
                })
            }

            if (!validateOnlyNumbers(id)) {
                return res.status(400).send({
                    msg: "Não foi possível deletar o medicamento.",
                    cause: "O id deve ser um numeral."
                })
            }

            // Verifica se o id consta no banco de dados
            const idExist = await Medicamento.findByPk(id);
            if (idExist === null) {
                return res.status(400).send({
                    msg: "Não foi possível deletar o medicamento.",
                    cause: "Id do medicamento não consta no banco de dados."
                })
            }

            // Efetua a exclusão dos dados, caso a opção paranoid estiver habilitada
            // Cria um timestamp no momento em que foi "deletado"
            await Medicamento.destroy({ where: { id } });

            return res.status(204).send();
        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível deletar o medicamento.",
                cause: error.message
            })
        }
    }
}

module.exports = new MedicamentoController();