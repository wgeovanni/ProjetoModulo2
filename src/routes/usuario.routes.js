const { createUser } = require('../controllers/usuario.controller');
const { Router } = require('express');

class UserRouter {

    routesFromUser() {

        const userRoutes = Router();
        userRoutes.post('/usuarios', createUser);

        return userRoutes;
    }
}

module.exports = new UserRouter();