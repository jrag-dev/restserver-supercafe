const express = require('express');

const { verificarToken, verificarRole } = require('../middlewares/autenticacion');
const Categoria = require('../models/categoria.models');

const routerCategoria = express.Router();



routerCategoria.get('/', verificarToken, (req, res) => {
  
  Categoria.find({})
    .populate('usuario')
    .exec( (err, categorias) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          error: err
        })
      }

      Categoria.count( (err, conteo) => {

        if (err) {
          return res.status(400).json({
            ok: false,
            error: err
          })
        }

        res.json({
          ok: true,
          cuantos: conteo,
          categorias: categorias
        })
      })
    })
})


routerCategoria.get('/:id', verificarToken, (req, res) => {

  const { id } = req.params;

  Categoria.findById(id)
    .populate('usuario')
    .exec( (err, categoria) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        error: err
      })
    }

    res.status(200).json({
      ok: true,
      categoria: categoria
    })
  })
})


routerCategoria.post('/', [verificarToken, verificarRole], async (req, res) => {

  const { description } = req.body;
  const usuario = req.usuario._id;

  try {
    let categoria = {
      description: description,
      usuario: usuario
    }
    categoria = new Categoria(categoria);

    const categoriaDB = await categoria.save();

    res.status(201).json({
      ok: true,
      categoria: categoriaDB
    })
    
  } catch (err) {
    console.log(err);
    res.status(400).json({
      ok: false,
      message: err
    })
  }

})


routerCategoria.put('/:id', [verificarToken, verificarRole], (req, res) => {
  
  const { id } = req.params;
  const body = req.body;

  body.usuario = req.usuario._id;

  Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true}, (err, categoriaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        error: err
      })
    }


    res.json({
      ok: true,
      categoria: categoriaDB
    })

  })

})


routerCategoria.delete('/:id', [verificarToken, verificarRole], (req, res) => {

  const { id } = req.params;

  Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        error: err
      })
    }

    res.json({
      ok: true,
      categoria: categoriaBorrada
    })
  })

})


module.exports = routerCategoria;