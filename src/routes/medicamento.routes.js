const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { createMedicamento } = require('../controllers/medicamento.controller');

class MedicamentoRouter {

    routesFromMedicamento() {

        const medicamentoRoutes = Router();
        medicamentoRoutes.post('/medicamentos', auth, createMedicamento);

        return medicamentoRoutes;
    }
}

module.exports = new MedicamentoRouter();