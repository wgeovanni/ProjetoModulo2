const { createUser, userLogin, updateUser } = require('../controllers/usuario.controller');
const { Router } = require('express');

class UserRouter {

    routesFromUser() {

        const userRoutes = Router();
        userRoutes.post('/usuarios', createUser);
        userRoutes.post('/usuarios/login', userLogin);
        userRoutes.patch('/usuarios/:id', updateUser);

        return userRoutes;
    }
}

module.exports = new UserRouter();