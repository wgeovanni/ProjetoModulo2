const { createUser, userLogin, updateUser } = require('../controllers/usuario.controller');
const { auth } = require('../middleware/auth');
const { Router } = require('express');

class UserRouter {

    routesFromUser() {

        const userRoutes = Router();
        userRoutes.post('/usuarios', createUser);
        userRoutes.post('/usuarios/login', userLogin);
        userRoutes.patch('/usuarios/:id', auth, updateUser);

        return userRoutes;
    }
}

module.exports = new UserRouter();