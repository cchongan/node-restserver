const jwt = require('jsonwebtoken');
const { modelName } = require("../models/usuario");
//============
//  Verificar Token Imagen
//============


let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}

//============
//  Verificar Token
//============



let verificaToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};
//============
//  Verificar Admin Role
//============
let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;
    console.log("verificaAdmin_Role", usuario);
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            error: {
                message: 'El usuario no es administraador'
            }
        });

    }
}



module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}