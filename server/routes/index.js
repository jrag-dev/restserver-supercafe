const express = require('express');

const routerUsuario = require('./usuario');
const routerAuth = require('./login');
const routerCategoria = require('./categoria.routes');
const routerProducto = require('./producto.routes');
const routerUpload = require('./upload.routes');
const routerImagenes = require('./imagenes.routes');

const app = express();


app.use("/api/usuario", routerUsuario);
app.use('/api/auth', routerAuth);
app.use('/api/categoria', routerCategoria);
app.use('/api/productos', routerProducto);
app.use('/api/upload', routerUpload);
app.use('/api/imagenes', routerImagenes);

module.exports = app;