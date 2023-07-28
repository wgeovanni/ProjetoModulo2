const { Router } = require('express');
const { routesFromUser } = require('./usuario.routes');
const { routesFromDeposito } = require('./deposito.routes');
const { routesFromMedicamento } = require('./medicamento.routes');

const routes = new Router();

// Criação de rotas
routes.use('/api', [routesFromUser(), routesFromDeposito(), routesFromMedicamento()]);

module.exports = routes;