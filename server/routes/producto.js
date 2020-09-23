const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken } = require('../middlewares/autenticacion')





let app = express();

let Producto = require('../models/producto');
let Categoria = require('../models/categoria');
const producto = require('../models/producto');

//======================
//   Buscar Producto
//======================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {


    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });

});


//======================
//   Mostrar todas las categorias
//======================
app.get('/producto', verificaToken, (req, res) => {
    let cambiaEstado = { disponible: true };
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto.find(cambiaEstado)
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .skip(desde).limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count(cambiaEstado, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    conteo
                })
            })
        });



});
//======================
//   Mostrar una categoria
//======================
app.get('/producto/:id', verificaToken, (req, res) => {
    let cambiaEstado = { disponible: true };
    let id = req.params.id;
    console.log('id:', id);
    Producto.find({
            _id: id,
            disponible: true
        })
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec((err, productoDB) => {
            console.log('productoDB:', productoDB);
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'No se encontro registro'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });

});

//======================
//   Genera una categoria 
//======================
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;


    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let cambiaEstado = { disponible: false }

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Producto no encontrado'
                }


            });
        }
        res.json({
            ok: true,
            usuario: productoDB
        });
    });
});

app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;


    let desCategoria = {
        descripcion: body.descripcion
    }
    Producto.findById(id, desCategoria, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se encontro registro'
                }
            });
        }
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(201).json({
                ok: true,
                producto: productoGuardado
            });
        });


    });
});

module.exports = app;