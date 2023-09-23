// Importação de módulo para uso de arquivos .env
const { config } = require('dotenv');
config();

const { DIALECT, PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT, SECRET_KEY } = process.env;

module.exports = {

    dialect: DIALECT,       // Recebe o tipo de banco de dados usado
    host: PGHOST,             // Recebe qual servidor está sendo usado
    username: PGUSER,   // Nome do usuário no Postgres
    password: PGPASSWORD,   // Senha do usuário no Postgres
    database: PGDATABASE,     // Nome do banco de dados usado
    port: PGPORT,             // Porta para conexão com banco de dados
    secret: SECRET_KEY,     // Palavra-chave do token

    //Configurações opcionais da aplicação
    define: {

        underscored: true,              // Traduz os campos para snake_case
        underscoredAll: true,           // Traduz todos os campos para snake_case
        paranoid: true                  // Permite o uso da exclusão lógica
    }
}