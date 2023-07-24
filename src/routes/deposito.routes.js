const { createDeposito } = require('../controllers/deposito.controller');
const { Router } = require('express');
const { auth } = require('../middleware/auth');

class DepositoRouter {

    routesFormDeposito() {

        const depositoRoutes = Router();
        depositoRoutes.post('/depositos', auth, createDeposito);

        return depositoRoutes;
    }
}

module.exports = new DepositoRouter();