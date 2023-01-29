const express = require('express');
const _ = require('underscore');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const fileUpload = require('express-fileupload');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto.models');

const routerUpload = express.Router();

// default options
routerUpload.use(fileUpload());


routerUpload.put("/:tipo/:id", function (req, res) {

  const { tipo, id } = req.params;

  if (!req.files || Object.keys(req.files).length === 0)  {
    return res.status(400).json({
      ok: false,
      error: {
        message: "No se ha seleccionado ningún archivo"
      }
    })
  }

  // validar tipos
  let tiposValidos = ['productos', 'usuarios'];

  if (tiposValidos.indexOf( tipo ) < 0) {
    return res.status(400).json({
      ok: false,
      error: {
        message: 'Las tipos permitidos son ' + tiposValidos.join(', ')
      }
    })
  }

  let archivo = req.files.archivo;

  // Extensiones permitidas
  let extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

  // let extension = _.last(archivo.name.split("."))
  let itemsNombreArchivo = archivo.name.split(".");
  let extension = itemsNombreArchivo[itemsNombreArchivo.length - 1];

  if (extensionesValidas.indexOf( extension ) < 0) {
    return res.status(400).json({
      ok: false,
      error: {
        extension: extension,
        message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ')
      }
    })
  }

  // cambiar nombre del archivo
  let nombreArchivo = `${ uuidv4() }.${ extension }`;

  uploadPath = `uploads/${ tipo }/${ nombreArchivo}`;


  // Usamos el método mv() para colocar el archivo en nuestro servidor
  archivo.mv(uploadPath, function(err) {

    if (err)
      return res.status(500).json({
        ok: false,
        error: err
      });

    // Aquí, la imagen se cargo
    
    if (tipo === 'usuarios') {
      imagenUsuario(id, res, nombreArchivo);
    } else if (tipo === 'productos') {
      imagenProducto(id, res, nombreArchivo);
    } else {
      return res.status(500).json({
        ok: false,
        error: {
          message: "Tipo no válido"
        }
      })
    }

  });
})


function imagenUsuario(id, res, nombreArchivo) {

  Usuario.findById(id, ( err, usuarioDB) => {

    
    if (err) {
      borrarArchivo(nombreArchivo, 'usuarios')
      return res.status(500).json({
        ok: false,
        error: err
      })
    }

    if (!usuarioDB) {
      borrarArchivo(nombreArchivo, 'usuarios')
      return res.status(400).json({
        ok: false,
        error: {
          message: "El usuario no existe"
        }
      })
    }

    // Borrar al archivo anteior
    borrarArchivo(usuarioDB.img, 'usuarios')

    usuarioDB.img = nombreArchivo;

    usuarioDB.save( (err, usuarioGuardado) => {
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo
      })
    })
  })
}

function imagenProducto(id, res, nombreArchivo) {

  Producto.findById(id, ( err, productoDB) => {

    
    if (err) {
      borrarArchivo(nombreArchivo, 'productos')
      return res.status(500).json({
        ok: false,
        error: err
      })
    }

    if (!productoDB) {
      borrarArchivo(nombreArchivo, 'productos')
      return res.status(400).json({
        ok: false,
        error: {
          message: "El producto no existe"
        }
      })
    }

    // Borrar al archivo anteior
    borrarArchivo(productoDB.img, 'productos')

    productoDB.img = nombreArchivo;

    productoDB.save( (err, productoGuardado) => {
      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo
      })
    })
  })
}

function borrarArchivo(nombreArchivo, tipo) {
  // verificar la ruta del archivo para poder borrarlo
  let pathArchivo = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreArchivo }`);
  if ( fs.existsSync(pathArchivo) ) {
    fs.unlinkSync(pathArchivo);
  }
}


module.exports = routerUpload;