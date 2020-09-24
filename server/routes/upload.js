const express = require('express');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const app = express();
const fs = require('fs');
const path = require('path')

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files || Object.keys(req.files).length == 0) {
        return res.status(400).json({
            Ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        });
    }

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(' ')
            }
        })
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');

    let extension = nombreArchivo[nombreArchivo.length - 1];
    console.log(nombreArchivo);
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];



    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extension no valida' + extensionesValidas.join(' '),
                ext: extension
            }
        });

    }

    let nombreArchivoArm = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`./uploads/${tipo}/${nombreArchivoArm}`, function(err) {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivoArm);
        } else {
            imagenProducto(id, res, nombreArchivoArm);
        }

    });

});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            if (err) {
                borraArchivo(nombreArchivo, 'usuarios');
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no existe'
                    }

                });
            }
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });

    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            if (err) {
                borraArchivo(nombreArchivo, 'productos');
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Productos no existe'
                    }

                });
            }
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });

    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;