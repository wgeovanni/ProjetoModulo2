const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { createMedicamento, updateMedicamento, listMedicamentos } = require('../controllers/medicamento.controller');

class MedicamentoRouter {

    routesFromMedicamento() {

        const medicamentoRoutes = Router();
        medicamentoRoutes.post('/medicamentos', auth, createMedicamento);
        medicamentoRoutes.patch('/medicamentos/:id', auth, updateMedicamento);
        medicamentoRoutes.get('/medicamentos', auth, listMedicamentos);

        return medicamentoRoutes;
    }
}

module.exports = new MedicamentoRouter();