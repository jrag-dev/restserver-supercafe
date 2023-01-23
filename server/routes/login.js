const express = require('express');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const routerAuth = express.Router();




routerAuth.post('/login', (req, res) => {

  const body = req.body;

  console.log(body)

  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario o contraseña incorrecto"
        }
      })
    }

    if ( !bcryptjs.compareSync( body.password, usuarioDB.password )) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario o contraseña incorrecto"
        }
      })
    }

    const token = jsonwebtoken.sign(
      {
        usuario: usuarioDB,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.EXPIRES_IN_TOKEN
      }
    )

    res.json({
      ok: true,
      usuario: usuarioDB,
      token: token
    })

  })


})




module.exports = routerAuth;