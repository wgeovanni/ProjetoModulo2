const { createDeposito, updateDeposito, updateDepositoStatus, listDeposito } = require('../controllers/deposito.controller');
const { auth } = require('../middleware/auth');
const { Router } = require('express');

class DepositoRouter {

    routesFromDeposito() {

        const depositoRoutes = Router();
        depositoRoutes.post('/depositos', auth, createDeposito);
        depositoRoutes.patch('/depositos/:id', auth, updateDeposito);
        depositoRoutes.patch('/depositos/:id/status', auth, updateDepositoStatus);
        depositoRoutes.get('/depositos', auth, listDeposito);

        return depositoRoutes;
    }
}

module.exports = new DepositoRouter();