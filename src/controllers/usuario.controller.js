const { Usuario } = require('../models/usuario');

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

            // Verifica se o campo CPF foi está vazio
            if (!cpf) {
                return res.status(400).send({ msg: "Campo CPF obrigatório" });
            };

            // Verifica se o cpf já existe no banco de dados e retorna mensagem de erro caso exista
            const cpfDbExist = await Usuario.findOne({ where: { cpf } });
            if (cpfDbExist !== null) {
                return res.status(409).send({ msg: "CPF já cadastrado." });
            };

            // Verifica se o campo status foi preenchido
            if (!status) {
                return res.status(400).send({ msg: "O campo status é obrigatório." });
            }

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

            const id = Usuario.findOne({ where: { cpf } });
            return res.status(201).send({ data, id });

        } catch (error) {
            return res.status(400).send({ message: "Não foi possível criar novo usuário.", cause: error.message });
        }
    }
};

module.exports = new UsuarioControler();