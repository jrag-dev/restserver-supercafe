const express = require('express');

const routerUsuario = require('./usuario');
const routerAuth = require('./login');

const app = express();


app.use("/api/usuario", routerUsuario);
app.use('/api/auth', routerAuth);


module.exports = app;