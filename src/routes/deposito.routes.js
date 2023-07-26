const { createDeposito, updateDeposito, updateDepositoStatus, listDeposito, listOneDeposito } = require('../controllers/deposito.controller');
const { auth } = require('../middleware/auth');
const { Router } = require('express');

class DepositoRouter {

    routesFromDeposito() {

        const depositoRoutes = Router();
        depositoRoutes.post('/depositos', auth, createDeposito);
        depositoRoutes.patch('/depositos/:id', auth, updateDeposito);
        depositoRoutes.patch('/depositos/:id/status', auth, updateDepositoStatus);
        depositoRoutes.get('/depositos', auth, listDeposito);
        depositoRoutes.get('/depositos/:id', auth, listOneDeposito);

        return depositoRoutes;
    }
}

module.exports = new DepositoRouter();