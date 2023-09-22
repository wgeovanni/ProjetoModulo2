// Importação de módulo para uso de arquivos .env
const { config } = require('dotenv');
config();

const { DIALECT, HOSTDB, USERNAMEDB, PASSWORDDB, DATABASE, PORTDB, SECRET_KEY } = process.env;

module.exports = {

    dialect: DIALECT,       // Recebe o tipo de banco de dados usado
    host: HOSTDB,             // Recebe qual servidor está sendo usado
    username: USERNAMEDB,   // Nome do usuário no Postgres
    password: PASSWORDDB,   // Senha do usuário no Postgres
    database: DATABASE,     // Nome do banco de dados usado
    port: PORTDB,             // Porta para conexão com banco de dados
    secret: SECRET_KEY,     // Palavra-chave do token

    //Configurações opcionais da aplicação
    define: {

        underscored: true,              // Traduz os campos para snake_case
        underscoredAll: true,           // Traduz todos os campos para snake_case
        paranoid: true                  // Permite o uso da exclusão lógica
    }
}