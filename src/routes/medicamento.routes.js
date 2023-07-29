const { Router } = require('express');
const { auth } = require('../middleware/auth');
const { createMedicamento, updateMedicamento, listMedicamentos, listOneMedicamento, deleteMedicamento } = require('../controllers/medicamento.controller');

class MedicamentoRouter {

    routesFromMedicamento() {

        const medicamentoRoutes = Router();
        medicamentoRoutes.post('/medicamentos', auth, createMedicamento);
        medicamentoRoutes.patch('/medicamentos/:id', auth, updateMedicamento);
        medicamentoRoutes.get('/medicamentos', auth, listMedicamentos);
        medicamentoRoutes.get('/medicamentos/:id', auth, listOneMedicamento);
        medicamentoRoutes.delete('/medicamentos/:id', auth, deleteMedicamento)

        return medicamentoRoutes;
    }
}

module.exports = new MedicamentoRouter();