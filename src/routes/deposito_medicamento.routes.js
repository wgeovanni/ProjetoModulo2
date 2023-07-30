const { createDepMed, updateDepMed } = require('../controllers/deposito_medicamento.controller');
const { auth } = require('../middleware/auth');
const { Router } = require('express');

class Deposito_MedicamentoRouter {

    routesFromDeposito_Medicamento() {

        const deposito_medicamentoRoutes = Router();
        deposito_medicamentoRoutes.post('/depositos_medicamentos', auth, createDepMed);
        deposito_medicamentoRoutes.patch('/depositos_medicamentos/:id', auth, updateDepMed);
        deposito_medicamentoRoutes.get('/depositos_medicamentos/:id', auth,);
        deposito_medicamentoRoutes.delete('/depositos_medicamentos/:id', auth,);

        return deposito_medicamentoRoutes;
    }
}

module.exports = new Deposito_MedicamentoRouter();