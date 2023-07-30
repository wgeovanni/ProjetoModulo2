const { Router } = require('express');
const { routesFromUser } = require('./usuario.routes');
const { routesFromDeposito } = require('./deposito.routes');
const { routesFromMedicamento } = require('./medicamento.routes');
const { routesFromDeposito_Medicamento } = require('../routes/deposito_medicamento.routes')

const routes = new Router();

// Criação de rotas
routes.use('/api', [routesFromUser(), routesFromDeposito(), routesFromMedicamento(), routesFromDeposito_Medicamento()]);

module.exports = routes;