const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')





let app = express();

let Categoria = require('../models/categoria');


//======================
//   Mostrar todas las categorias
//======================
app.get('/categoria', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde).limit(limite)
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    conteo
                })
            })
        });



});
//======================
//   Mostrar una categoria
//======================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    console.log('id:', id);
    Categoria.findById(id, (err, categoriaDB) => {
        console.log('categoriaDB:', categoriaDB);
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se encontro registro'
                }
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });

    });

});


//======================
//   Genera una categoria 
//======================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    console.log('id:', id);
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        console.log('categoriaDB:', categoriaDB);
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se encontro registro'
                }
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });

    });
});

app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = req.body;


    let desCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, desCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se encontro registro'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

module.exports = app;