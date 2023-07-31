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
config();

// Classe utilizada para representar a entidade usuario
class UsuarioControler {

    // Função utilizada para criação de usuário recebendo respectivamente os campos:
    // nome, sobrenome, genero, data de nascimento, cpf, fone, email, senha e status
    // Caso passe pelas validações cria novo usuário no banco de dados
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

            //------------------------------ Verificações de campos ------------------------------//

            // Campo nome
            if (!nome) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo nome obrigatório."
                })
            }

            if (!validateStringLenght(nome, 2, 20)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo nome deve conter entre 2 e 20 caracteres."
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

            if (!validateStringLenght(sobrenome, 2, 20)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo sobrenome deve conter entre 2 e 20 caracteres."
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

            // Verifica se a data de nascimento do usuário é menor que a atual
            if (birth > atual) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "A data de nascimento deve ser menor que a data atual."
                })
            }

            // Clona a data de nascimento em uma variável e verifica se o usuário é tem mais que 18 anos
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

            // Verifica se o cpf já existe no banco de dados e retorna mensagem de erro caso exista
            const userCpfExist = await Usuario.findOne({ where: { cpf } });
            if (userCpfExist !== null) {
                return res.status(409).send({ msg: "CPF já cadastrado." });
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

            //----------------------------Fim de verificação de dados-----------------------------//

            // Criação de novo usuário no banco de dados
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

    // Função para gerar token do usuário recebendo respectivamente email e senha
    // Caso passe pelas validações devolve um token
    async userLogin(req, res) {

        try {
            const { email, senha } = req.body;

            //------------------------------ Verificações de campos ------------------------------//

            // Validações de campo email
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

            // Verifica se o email existe no banco de dados
            const userEmailExist = await Usuario.findOne({ where: { email } });
            if (!userEmailExist) {
                return res.status(404).send({
                    msg: "Não foi possível efetuar o login!",
                    cause: "Email não consta no sistema."
                })
            }

            if (userEmailExist.dataValues.status === "Inativo") {
                return res.status(404).send({
                    msg: "Não foi possível efetuar o login!",
                    cause: "Usuário está inativo."
                })
            }

            // Validações de campo senha
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

            // Verifica se a senha recebida pela requisição é igual a do banco de dados
            if (senha !== userEmailExist.senha) {
                return res.status(400).send({
                    msg: "Não foi possível efetuar o login!",
                    cause: "Email ou senha incorretos"
                })
            }

            //-----------------------------Fim de verificação de dados-----------------------------//

            // Definição de payload e geração de token
            const payload = { ID: userEmailExist.id, email };
            const token = sign(payload, process.env.SECRET_KEY, { expiresIn: '7d' });

            return res.status(200).send(token);
        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível efetuar o login.",
                cause: error.message
            })
        }
    }

    // Função utilizada para atualizar os dados do usuário.
    // A definição do usuário a ser modificado é feita através do id passado pelo params da request
    // Os dados que podem ser modificados são: nome, sobrenome, genero e telefone
    // Passados através do body da request
    async updateUser(req, res) {

        try {
            const { nome, sobrenome, genero, fone } = req.body;
            const { id } = req.params;

            //------------------------------ Verificações de campos ------------------------------//

            // Validações de parâmetro id
            if (!id) {
                return res.status(400).send({
                    msg: "Não é possível alterar usuário.",
                    cause: "O ID do usuário é obrigatório."
                })
            }

            if (!validateOnlyNumbers(id)) {
                return res.status(400).send({
                    msg: "Não é possível alterar o usuário.",
                    cause: "ID do funcionário deve ser um número."
                })
            }

            // Verifica a existência do id recebido por params no banco de dados
            const usuarioId = await Usuario.findByPk(id);
            if (usuarioId === null) {
                return res.status(404).send({
                    msg: "Não é possível alterar usuário.",
                    cause: "O ID do usuário é inexistente."
                })
            }

            // Campo nome
            if (!nome) {
                return res.status(400).send({
                    msg: "Não foi possível modificar dados do usuário.",
                    cause: "Campo nome obrigatório."
                })
            }

            if (!validateStringLenght(nome, 2, 50)) {
                return res.status(400).send({
                    msg: "Não foi possível modificar dados do usuário.",
                    cause: "Campo nome deve conter entre 2 e 50 caracteres."
                })
            }

            if (!validateOnlyLetters(nome)) {
                return res.status(400).send({
                    msg: "Não foi possível modificar dados do usuário.",
                    cause: "Campo nome deve conter somente letras."
                })
            }

            // Campo sobrenome
            if (!sobrenome) {
                return res.status(400).send({
                    msg: "Não foi possível modificar dados do usuário.",
                    cause: "Campo sobrenome obrigatório."
                })
            }

            if (!validateStringLenght(sobrenome, 2, 50)) {
                return res.status(400).send({
                    msg: "Não foi possível modificar dados do usuário.",
                    cause: "Campo sobrenome deve conter entre 2 e 50 caracteres."
                })
            }

            if (!validateOnlyLetters(sobrenome)) {
                return res.status(400).send({
                    msg: "Não foi possível modificar dados do usuário.",
                    cause: "Campo sobrenome deve conter somente letras."
                })
            }

            // Campo genero
            if (!validateOnlyLetters(genero)) {
                return res.status(400).send({
                    msg: "Não foi possível modificar dados do usuário.",
                    cause: "Campo gênero deve conter apenas letras."
                })
            }

            // Campo fone
            if (fone && !validateOnlyNumbers(fone)) {
                return res.status(400).send({
                    msg: "Não foi possível modificar dados do usuário.",
                    cause: "Campo telefone deve conter somente números."
                })
            }

            if (fone && !validateStringLenght(fone, 10, 11)) {
                return res.status(400).send({
                    msg: "Não foi possível modificar dados do usuário.",
                    cause: "Campo telefone deve conter entre 10 e 11 números."
                })
            }

            //-----------------------------Fim de verificação de dados-----------------------------//

            // Atualiza dados no banco de dados
            await Usuario.update(
                {
                    nome,
                    sobrenome,
                    genero,
                    fone
                },
                {
                    where: {
                        id
                    }
                }
            );

            return res.status(200).send();

        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível alterar dados do usuário.",
                cause: error.message
            })
        }
    }

    // Função utilizada para atualizar o status do usuário
    // A definição do usuário a ser modificado é feita através do id passado pelo params da request
    // Os dados que podem ser modificados são: status
    // Passados através do body da request
    async updateUserStatus(req, res) {

        try {

            const { status } = req.body;
            const { id } = req.params;

            //------------------------------ Verificações de campos ------------------------------//

            // Validações de id recebido no params
            if (!validateOnlyNumbers(id)) {
                return res.status(400).send({
                    msg: "Não é possível alterar o usuário.",
                    cause: "ID do funcionário deve ser um número."
                })
            }

            // Verifica se id recebido em params existe no banco de dados
            const usuarioId = await Usuario.findByPk(id);
            if (!usuarioId) {
                return res.status(404).send({
                    msg: "Não foi possível atualizar os dados.",
                    cause: "ID do usuário inexistente."
                })
            }

            // Validação de campo status
            if (!status) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar status do usuário.",
                    cause: "O campo status é obrigatório."
                })
            }

            if (!validateStatus(status)) {
                return res.status(400).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "Campo status deve estar com o valor Ativo ou Inativo."
                })
            }

            //-----------------------------Fim de verificação de dados-----------------------------//

            // Realiza a atualização no banco de dados
            await Usuario.update({ status }, { where: { id } });

            return res.status(200).send();
        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível atualizar status do usuário.",
                cause: error.message
            })
        }
    }

    // Função utilizada para atualizar a senha do usuário
    // A definição do usuário a ser modificado é feita através do id passado pelo params da request
    // Os dados que podem ser modificados são: senha
    // Passados através do body da request
    async updateUserPassword(req, res) {

        try {
            const { id } = req.params;
            const { senha } = req.body;

            //------------------------------ Verificações de campos ------------------------------//

            if (!validateOnlyNumbers(id)) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar a senha do usuário.",
                    cause: "ID do usário deve ser do tipo numérico."
                })
            }

            // Verifica se ID do usuário existe no banco de dados
            const usuarioId = await Usuario.findByPk(id);
            if (!usuarioId) {
                return res.status(404).send({
                    msg: "Não foi possível cadastrar usuário.",
                    cause: "ID de usuário inexistente."
                })
            }

            // Validações de senha
            if (!senha) {
                return res.status(400).send({
                    msg: "Não foi possível atualizar a senha do usuário.",
                    cause: "Campo senha é obrigatório."
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

            //-----------------------------Fim de verificação de dados-----------------------------//

            //Atualiza dados do usuário no banco de dados
            await Usuario.update({ senha }, { where: { id } });

            return res.status(200).send();
        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível cadastrar usuário.",
                cause: error.message
            })
        }
    }

    // Função utilizada para listar os dados de um usuário específico
    // A definição do usuário cuja informações serão disponibilizadas é feita através
    // do id passado pelo params da request
    async listOneUser(req, res) {

        try {
            const { id } = req.params;

            // Validações de ID
            if (!validateOnlyNumbers(id)) {
                return res.status(400).send({
                    msg: "Não foi possível listar dados do usuário.",
                    cause: "ID do funcionário deve ser um número."
                })
            }

            // Verifica a existência da ID no banco de dados
            const usuarioIdExist = await Usuario.findOne({ where: { id } });
            if (!usuarioIdExist) {
                return res.status(404).send({
                    msg: "Não foi possível listar dados do usuário.",
                    cause: "ID do funcionário não existe."
                })
            }

            // Variável enviada como resposta
            const data = {
                "nome": usuarioIdExist.dataValues.nome,
                "sobrenome": usuarioIdExist.dataValues.sobrenome,
                "genero": usuarioIdExist.dataValues.genero,
                "dataNasc": usuarioIdExist.dataValues.dataNasc,
                "cpf": usuarioIdExist.dataValues.cpf,
                "fone": usuarioIdExist.dataValues.fone,
                "email": usuarioIdExist.dataValues.email,
                "status": usuarioIdExist.dataValues.status,
                "createdAt": usuarioIdExist.dataValues.createdAt,
                "updatedAt": usuarioIdExist.dataValues.updatedAt
            }
            return res.status(200).send(data);

        } catch (error) {
            return res.status(400).send({
                msg: "Não foi possível listar os dados do usuário.",
                cause: error.message
            })
        }
    }
}

module.exports = new UsuarioControler();