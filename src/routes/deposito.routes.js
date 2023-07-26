const { createDeposito, updateDeposito, updateDepositoStatus, listDeposito, listOneDeposito, deleteDeposito } = require('../controllers/deposito.controller');
const { auth } = require('../middleware/auth');
const { Router } = require('express');

// A rota de atualização de status de depósito pode afetar a deleção do depósito.
// Devido a isso seria necessário que somente um usuário autorizado pudesse ter acesso
// a este endpoint
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