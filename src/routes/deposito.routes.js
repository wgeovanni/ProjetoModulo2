const { createDeposito, updateDeposito, updateDepositoStatus, listDeposito, listOneDeposito, deleteDeposito } = require('../controllers/deposito.controller');
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
        depositoRoutes.delete('/depositos/:id', auth, deleteDeposito);

        return depositoRoutes;
    }
}

module.exports = new DepositoRouter();