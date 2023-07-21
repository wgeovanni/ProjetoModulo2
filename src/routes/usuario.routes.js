const { createUser, userLogin, updateUser, updateUserStatus, updateUserPassword } = require('../controllers/usuario.controller');
const { auth } = require('../middleware/auth');
const { Router } = require('express');

class UserRouter {

    routesFromUser() {

        const userRoutes = Router();
        userRoutes.post('/usuarios', createUser);
        userRoutes.post('/usuarios/login', userLogin);
        userRoutes.patch('/usuarios/:id', auth, updateUser);
        userRoutes.patch('/usuarios/:id/status', auth, updateUserStatus);
        userRoutes.patch('/usuarios/:id/senha', auth, updateUserPassword);

        return userRoutes;
    }
}

module.exports = new UserRouter();