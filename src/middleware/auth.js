const { verify } = require('jsonwebtoken');
const { config } = require('dotenv');
config();

// Verifica a autenticidade do token
async function auth(req, res, next) {

    try {

        const { authorization } = req.headers;
        req["payload"] = verify(authorization, process.env.SECRET_KEY);
        next();
    } catch (error) {
        return res.status(400).send({
            msg: "Falha na autenticação",
            cause: error.message
        })
    }
}

module.exports = { auth };