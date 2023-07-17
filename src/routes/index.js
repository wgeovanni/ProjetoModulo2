const { Router } = require('express');
const { routesFromUser } = require('./usuario.routes');

const routes = new Router();

// Criação de rotas
routes.use('/api', [routesFromUser()]);

module.exports = routes;