const { Deposito } = require('../models/deposito');
const { Op } = require('sequelize');
const { validateEmail, validateOnlyNumbers, validateOnlyLetters, validateStringLenght, validateStatus } = require('../utils');
const { config } = require('dotenv');
const { Usuario } = require('../models/usuario');
const { Deposito_Medicamento } = require('../models/deposito_medicamento');
const { Medicamento } = require('../models/medicamento');
config();

// Classe utilizada para representar a entidade Deposito
class DepositoController {

    // Função para cadastro de novo depósito no sistema
    // Recebe através do body da request os dados: usuarioId, razao, cnpf, nome
    // email, fone, celular, cep, endereco, numero, bairro, cidade, estado,
    // complemento, latitude e longitude.
    // Caso passe nas validações cadastra novo depósito
    async createDeposito(req, res) {

        try {
            const {
                usuarioId,
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
                latitude,
                longitude,
                status
            } = req.body

            // ------------------------------ Verificações de campos ------------------------------//

            // Campo usuarioId
            if (!usuarioId) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo usuarioId é obrigatório."
                })
            }

            if (!validateOnlyNumbers(usuarioId)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo usuarioId deve conter somente números."
                })
            }

            // Verifica a existência do id do usuário no banco de dados
            const usuarioIdExists = await Usuario.findOne({ where: { id: usuarioId } });
            if (!usuarioIdExists) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O usuário é inexistente."
                })
            }

            // Verifica se o usuário está com o status definido como inativo
            if (usuarioIdExists.status === "Inativo") {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O usuário está inativo no sistema."
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

            // Verifica se a razão social já está cadastrada no sistema
            const razaoExist = await Deposito.findOne({ where: { razao } });
            if (razaoExist) {
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

            // Verifica se o cnpj já está cadastrado no sistema
            const cnpjExist = await Deposito.findOne({ where: { cnpj } });
            if (cnpjExist) {
                return res.status(409).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O CNPJ já consta no banco de dados."
                })
            }

            // Campo nome
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
            if (fone && !validateOnlyNumbers(fone)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo telefone deve conter apenas números."
                })
            }

            if (fone && !validateStringLenght(fone, 8, 10)) {
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

            if (!validateOnlyNumbers(celular)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo celular deve conter somente números."
                })
            }

            if (!validateStringLenght(celular, 10, 11)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo celular deve conter entre 10 e 11 números."
                })
            }

            // Campo cep
            if (!cep) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo CEP é obrigatório."
                })
            }

            if (!validateOnlyNumbers(cep)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo CEP deve conter somente números."
                })
            }

            if (!validateStringLenght(cep, 8, 8)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo CEP deve conter 8 números."
                })
            }

            // Campo endereço
            if (!endereco) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo endereço é obrigatório."
                })
            }

            if (!validateStringLenght(endereco, 2, 50)) {
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

            if (!validateOnlyLetters(bairro)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo bairro deve conter somente letras."
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

            if (!validateOnlyLetters(cidade)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo cidade deve conter somente letras."
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

            if (!validateOnlyLetters(estado)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo estado deve conter somente letras."
                })
            }

            if (!validateStringLenght(estado, 2, 20)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo estado deve conter entre 2 e 20 caracteres."
                })
            }

            // Campo complemento
            if (complemento && !validateStringLenght(complemento, 2, 200)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo complemento deve conter entre 2 e 200 caracteres."
                })
            }

            // Campo latitude
            if (latitude && latitude < -90 || latitude > 90) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo latitude deve possuir valores entre -90 e 90."
                })
            }

            // Campo longitude
            if (longitude && longitude < -180 || longitude > 180) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo longitude deve possuir valores entre -180 e 180"
                })
            }

            // Campo status
            if (!status) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo status é obrigatório."
                })
            }

            if (!validateStatus(status)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo status deve possuir os valores Ativo ou Inativo."
                })
            }

            //-----------------------------Fim de verificação de dados-----------------------------//

            // Verifica se o depósito com o cnpj e razão social recebidos
            // passou por soft delete
            const depositoExistBefore = await Deposito.restore({
                where: {
                    cnpj,
                    razao,
                    deletedAt: {
                        [Op.not]: null
                    }
                }
            })

            const data = {
                usuarioId,
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
                latitude,
                longitude,
                status
            }

            // Caso não existam dados exluídos com soft delete, cria novo depósito no
            // banco de dados. Caso ja existiu atualiza os dados
            if (depositoExistBefore === 0) {
                await Deposito.create({
                    usuarioId,
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
                    latitude,
                    longitude,
                    status
                })
            } else {
                await Deposito.update({
                    usuarioId,
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
                    latitude,
                    longitude,
                    status
                }, {
                    where: {
                        cnpj,
                        razao
                    }
                })
            }
            return res.status(201).send(data);
        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível cadastrar depósito.",
                cause: error.message
            })
        }
    }

    // Função utilizada para atualizar os dados do depósito.
    // A definição do depósito a ser modificado é feita através do id passado pelo params da request
    // Os dados que podem ser modificados são: nome, email, fone, celular, cep e endereço
    // Passados através do body da request
    async updateDeposito(req, res) {
        try {

            const { id } = req.params;
            const { nome,
                email,
                fone,
                celular,
                cep,
                endereco
            } = req.body;

            //------------------------------ Verificações de campos ------------------------------//

            // Campo ID de depósito
            if (!id) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar os dados do depósito.",
                    cause: "O id do depósito passado por params é obrigatório."
                })
            }

            if (!validateOnlyNumbers(id)) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar os dados do depósito.",
                    cause: "O id do depósito passado por params deve ser um número."
                })
            }

            // Verifica a existência do depósito no banco de dados
            const depositoIdExist = await Deposito.findOne({ where: { id } });
            if (!depositoIdExist) {
                return res.status(404).send({
                    msg: "Não foi possível atualizar os dados do depósito.",
                    cause: "O id do depósito não existe."
                })
            }

            // Campo nome
            if (!nome) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar os dados do depósito.",
                    cause: "O campo nome fantasia é obrigatório."
                })
            }

            if (!validateStringLenght(nome, 2, 50)) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar os dados do depósito.",
                    cause: "O campo nome fantasia deve conter entre 2 e 50 caracteres."
                })
            }

            // Campo email
            if (!email) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar os dados do depósito.",
                    cause: "O campo email é obrigatório."
                })
            }

            if (!validateEmail(email)) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar os dados do depósito.",
                    cause: "O campo email deve estar no padrão exemplo@email.com"
                })
            }

            // Campo fone
            if (fone && !validateOnlyNumbers(fone)) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar os dados do depósito.",
                    cause: "O campo telefone deve conter apenas números."
                })
            }

            if (fone && !validateStringLenght(fone, 8, 10)) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar os dados do depósito.",
                    cause: "O campo telefone deve conter entre 8 e 10 números."
                })
            }

            // Campo celular
            if (!celular) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar os dados do depósito.",
                    cause: "O campo celular é obrigatório."
                })
            }

            if (!validateOnlyNumbers(celular)) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar os dados do depósito.",
                    cause: "O campo celular deve conter somente números."
                })
            }

            if (!validateStringLenght(celular, 10, 11)) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar os dados do depósito.",
                    cause: "O campo celular deve conter entre 10 e 11 números."
                })
            }

            // Campo cep
            if (!cep) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo CEP é obrigatório."
                })
            }

            if (!validateOnlyNumbers(cep)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo CEP deve conter somente números."
                })
            }

            if (!validateStringLenght(cep, 8, 8)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar novo depósito.",
                    cause: "O campo CEP deve conter 8 números."
                })
            }

            // Campo endereço
            if (!endereco) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar os dados do depósito.",
                    cause: "O campo endereço é obrigatório."
                })
            }

            if (!validateStringLenght(endereco, 2, 50)) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar os dados do depósito.",
                    cause: "O campo endereço deve conter entre 2 e 50 caracteres."
                })
            }

            //-----------------------------Fim de verificação de dados-----------------------------//

            // Faz a atualização dos dados no banco de dados
            await Deposito.update({
                nome,
                email,
                fone,
                celular,
                endereco
            }, {
                where: {
                    id
                }
            })

            return res.status(204).send();
        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível atualizar os dados do depósito.",
                cause: error.message
            })
        }
    }

    // Função utilizada para atualizar o dado de status do depósito.
    // A definição do depósito a ser modificado é feita através id passado pelo params da request
    // Os dados que podem ser modificados são: status
    // Passados através do body da request
    async updateDepositoStatus(req, res) {
        try {

            const { id } = req.params;
            const { status } = req.body;

            // ------------------------------ Verificações de campos ------------------------------//

            // Campo ID de depósito
            if (!id) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar o status do depósito.",
                    cause: "O id do depósito passado por params é obrigatório."
                })
            }

            if (!validateOnlyNumbers(id)) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar o status do depósito.",
                    cause: "O id do depósito passado por params deve ser um número."
                })
            }

            // Verifica a existência do depósito no banco de dados
            const depositoIdExist = await Deposito.findOne({ where: { id } });
            if (!depositoIdExist) {
                return res.status(404).send({
                    msg: "Não foi possível atualizar o status do depósito.",
                    cause: "O id do depósito não existe."
                })
            }

            // Validação de campo status
            if (!status) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar o status do depósito.",
                    cause: "O campo status é obrigatório."
                })
            }

            if (!validateStatus(status)) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar o status do depósito.",
                    cause: "Campo status deve estar com o valor Ativo ou Inativo."
                })
            }

            // ------------------------------ Fim de verificação de campos ------------------------------//

            // Verifica se o medicamento está cadastrado em um depósito
            const depEmUso = await Deposito.findOne({
                where: {
                    razao: depositoIdExist.razao
                },
                include: [{
                    model: Medicamento,
                    through: {
                        attributes: []
                    }
                }]
            })

            console.log(depEmUso)

            // Caso haja medicamento cadastrado em depósito
            if (depEmUso.medicamentos.length !== 0) {
                return res.status(409).send({
                    msg: "Não foi possível excluir o depósito.",
                    cause: "Não pode haver medicamentos cadastrados no depósito."
                })
            }

            // Realiza a atualização no banco de dados
            await Deposito.update({ status }, { where: { id } });

            return res.status(200).send();

        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível atualizar o status do depósito.",
                cause: error.message
            })
        }
    }

    // Função utilizada para listar os depósitos.
    // É possível filtrar os depósitos através de query params da request
    // Envia os dados buscados no banco de dados
    async listDeposito(req, res) {
        try {

            const { status } = req.query;

            // Verifica se a query foi passada. Caso não tenha sido enviada retorna todos
            // os depósitos cadastrados no sistema
            if (!status) {
                const data = await Deposito.findAll();
                return res.status(200).send(data);
            }
            // Verifica se o status passado por query é válido
            if (status && !validateStatus(status)) {
                return res.status(400).send({
                    msg: "Não foi possível listar os depósitos.",
                    cause: "O status enviado deve possuir os valores Ativo ou Inativo."
                })
            }

            // Busca os dados de depósitos no banco de dados pelo status
            const data = await Deposito.findAll({ where: { status } });

            // Verifica se existem depósitos com o status passado
            if (data.length === 0) {
                return res.status(200).send({
                    msg: `Não há depósitos com o status ${status} no banco de dados.`
                })
            }

            return res.status(200).send(data);

        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível listar os depósitos.",
                cause: error.message
            })
        }
    }

    // Função utilizada para listar um depósito.
    // A definição do depósito a ser listado é feita através de seu ID 
    // passado pelo params da request
    // Caso seja validado o id é enviada uma resposta com os dados do depósito
    async listOneDeposito(req, res) {
        try {

            const { id } = req.params;

            // Validação de id
            if (!id) {
                return res.status(400).send({
                    msg: "Não foi possível listar os dados do depósito.",
                    cause: "O id do depósito é obrigatório."
                })
            }

            if (!validateOnlyNumbers(id)) {
                return res.status(400).send({
                    msg: "Não foi possível listar os dados do depósito.",
                    cause: "O id do depósito deve ser um número."
                })
            }

            // Verifica se o id consta no banco de dados
            const data = await Deposito.findByPk(id);
            if (!data) {
                return res.status(404).send({
                    msg: "Não foi possível listar os dados do depósito.",
                    cause: "O id informado não consta no banco de dados."
                })
            }

            return res.status(200).send(data);
        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível listar os dados do depósito.",
                cause: error.message
            })
        }
    }

    // Função utilizada para deletar um medicamento.
    // A definição do medicamento a ser deletado é feita através de seu ID 
    // passado pelo params da request
    // Caso seja validado o id é realizado um soft delete
    async deleteDeposito(req, res) {
        try {

            const { id } = req.params;

            // Validação de id
            if (!id) {
                return res.status(400).send({
                    msg: "Não foi possível excluir o depósito.",
                    cause: "O id do depósito é obrigatório."
                })
            }

            if (!validateOnlyNumbers(id)) {
                return res.status(400).send({
                    msg: "Não foi possível excluir o depósito.",
                    cause: "O id do depósito deve ser um número."
                })
            }

            // Verifica se o id consta no banco de dados
            const data = await Deposito.findByPk(id);
            if (!data) {
                return res.status(404).send({
                    msg: "Não foi possível excluir o depósito.",
                    cause: "O id informado não consta no banco de dados."
                })
            }

            // Verifica se o status do depósito está com Ativo
            if (data.status === "Ativo") {
                return res.status(400).send({
                    msg: "Não foi possível excluir o depósito.",
                    cause: "O status do depósito deve ser Inativo."
                })
            }

            // Efetua a exclusão dos dados, caso a opção paranoid estiver habilitada
            // Cria um timestamp no momento em que foi "deletado"
            await Deposito.destroy({ where: { id } });
            return res.status(204).send();

        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível excluir o depósito.",
                cause: error.message
            })
        }
    }
}

module.exports = new DepositoController();