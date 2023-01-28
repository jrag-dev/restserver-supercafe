const express = require('express');

const routerUsuario = require('./usuario');
const routerAuth = require('./login');
const routerCategoria = require('./categoria.routes');
const routerProducto = require('./producto.routes');

const app = express();


app.use("/api/usuario", routerUsuario);
app.use('/api/auth', routerAuth);
app.use('/api/categoria', routerCategoria);
app.use('/api/productos', routerProducto);

module.exports = app;