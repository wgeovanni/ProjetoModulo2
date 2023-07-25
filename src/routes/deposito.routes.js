const { createDeposito, updateDeposito } = require('../controllers/deposito.controller');
const { auth } = require('../middleware/auth');
const { Router } = require('express');

class DepositoRouter {

    routesFromDeposito() {

        const depositoRoutes = Router();
        depositoRoutes.post('/depositos', auth, createDeposito);
        depositoRoutes.patch('/depositos/:id', auth, updateDeposito);

        return depositoRoutes;
    }
}

module.exports = new DepositoRouter();