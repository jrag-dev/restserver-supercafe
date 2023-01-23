const express = require('express');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { encriptarPassword } = require('../helpers');

const { verificarToken, verificarRole } = require('../middlewares/autenticacion');

const routerUsuario = express.Router();




routerUsuario.get('/', verificarToken, (req, res) => {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Usuario.find({ estado: true }, 'nombre email role estado google img')
    .skip(desde)
    .limit(limite)
    .exec( (err, usuarios) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          error: err
        })
      }

      Usuario.count({ estado: true }, (err, conteo) => {

        res.json({
          ok: true,
          cuantos: conteo,
          usuarios: usuarios
        })
      })

    })


})


routerUsuario.post('/', [ verificarToken, verificarRole ] , async (req, res) => {

  const body = req.body;

  try {

    // encriptar password
    const passwordSeguro = encriptarPassword( body.password)

    body.password = passwordSeguro

    const usuario = new Usuario(body)

    const usuarioDB =  await usuario.save()

    res.status(201).json({
      ok: true,
      usuario: usuarioDB
    })

  } catch (error) {
    console.log(error)
    res.status(400).json({
      ok: false,
      mensaje: error.errors
    })
  }
})


routerUsuario.put('/:id',  [ verificarToken, verificarRole ], (req, res) => {
  const { id } = req.params;
  const body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true},  (err, usuarioDb) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          error: err
        })
      }

      res.json({
        ok: true,
        usuario: usuarioDb
      })
    })
})


routerUsuario.delete('/:id', [ verificarToken, verificarRole ], (req, res) => {

  const { id } = req.params;

  Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        error: err
      })
    }

    if ( !usuarioEliminado ) {
      return res.status(400).json({
        ok: false,
        err: {
          mensaje: "Usuario no encontrado",
        }
      })
    }

    res.json({
      ok: true,
      usuario: usuarioEliminado
    })
  })

})


routerUsuario.delete('/soft/:id', [ verificarToken, verificarRole ], (req, res) => {

  const { id } = req.params;

  Usuario.findById(id, (err, usuario) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        error: {
          mensaje: "Usuario no encontrado"
        }
      })
    }

    let cambiaEstado = {
      estado: false
    }

    Usuario.updateOne({ _id: id }, cambiaEstado, (err, usuarioEliminado) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          error: err
        })
      }

      res.json({
        ok: true,
        usuario: usuarioEliminado
      })
      
    })
  })

})


module.exports = routerUsuario;