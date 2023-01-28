const express = require('express');

const { verificarToken, verificarRole } = require('../middlewares/autenticacion');
const Producto = require("../models/producto.models");

const routerProducto = express.Router();


// TODO: Obtener todos los productos, populando los usuarios y categorias. Hacer paginación

routerProducto.get("/", verificarToken, (req, res) => {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Producto.find({ disponible: true})
    .skip(desde)
    .limit(limite)
    .populate('usuario', 'nombre email')
    .populate("categoria", "description")
    .exec( (err, productos) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          error: err
        })
      }

      Producto.count( (err, conteo) => {

        if (err) {
          return res.status(400).json({
            ok: false,
            error: err
          })
        }

        res.json({
          ok: true,
          cuantos: conteo,
          productos: productos
        })

      })
    })
})


// TODO: Buscar productos desde la base de datos

routerProducto.get("/buscar/:termino", verificarToken, (req, res) => {

  const termino = req.params.termino;

  Producto.find({ nombre: new RegExp(termino, 'i')})
    .populate("categoria", "nombre")
    .populate("usuario", "nombre email")
    .exec( (err, productos) => {

      if (err) {
        return res.status(500).json({
          ok: false,
          error: err
        })
      }

      res.status(200).json({
        ok: true,
        productos: productos
      })
    })
})


// TODO: Crear un producto, indicar el usuario y categoria

routerProducto.post("/", verificarToken, (req, res) => {

  const body = req.body;

  const producto = new Producto({
    usuario: req.usuario._id,
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria
  });

  producto.save( (err, productoDB) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        error: err
      })
    }

    res.status(201).json({
      ok: true,
      producto: productoDB
    })

  })

})


// TODO: Obtener un producto por su id, populando el usuario y categoria.

routerProducto.get("/:id", verificarToken, (req, res) => {

  const { id } = req.params;

  Producto.findById(id)
    .populate('usuario')
    .populate('categoria')
    .exec( (err, productoDB) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          error: err
        })
      }

      if (!productoDB) {
        return res.status(404).json({
          ok: false,
          error: {
            message: "No existe un porducto con ese ID"
          }
        })
      }


      res.status(200).json({
        ok: true,
        producto: productoDB
      })
    })
})


// TODO: Actualizar un producto por su id, retornar el nuevo producto.

routerProducto.put("/:id", verificarToken, (req, res) => {

  const { id } = req.params;
  const body = req.body;
  body.usuario = req.usuario._id

  Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true}, (err, productoDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        error: err
      })
    }

    res.status(200).json({
      ok: true,
      producto: productoDB
    })

  })
})


// TODO: Eliminar un producto por su id, retornar el producto eliminado.

routerProducto.delete("/:id", verificarToken, (req, res) => {

  const { id } = req.params;

  Producto.findByIdAndRemove(id, (err, productoBorrado) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        error: err
      })
    }


    if (!producto) {
      return res.status(404).json({
        ok: false,
        error: {
          message: "No existe un producto con ese ID."
        }
      })
    }


    res.status(200).json({
      ok: true,
      producto: productoBorrado,
      message: "Producto eliminado correctamente"
    })

  })
})


// TODO: Aplicar soft delete parq que el producto no sea borrado sino que su estado sea que no esta disponible

routerProducto.delete("/soft/:id", verificarToken, (req, res) => {

  const { id } = req.params;

  Producto.findById(id, (err, producto) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        error: {
          message: "Producto no encontrado."
        }
      })
    }

    if (!producto) {
      return res.status(404).json({
        ok: false,
        error: {
          message: "No existe un producto con ese ID."
        }
      })
    }

    let cambiaDisponible = {
      disponible: false
    }

    Producto.updateOne({ _id: id }, cambiaDisponible, (err, productoBorrado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          error: err
        })
      }

      res.status(200).json({
        ok: true,
        producto: productoBorrado,
        message: "Producto eliminado correctamente"
      })
    })
  })
})


module.exports = routerProducto;