const express = require('express');


const fs = require('fs');
const path = require('path');

const { verificarTokenImg } = require('../middlewares/autenticacion')


const routerImagenes = express.Router();


routerImagenes.get("/imagen/:tipo/:img", verificarTokenImg, (req, res) => {
  
  const { tipo, img } = req.params;

  let pathImg = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`)

  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg)
  } else {
    const pathNoImage = path.resolve(__dirname, '../assets/acer_ampire5_390.99.jpg')
    res.sendFile(pathNoImage)
  }


})



module.exports = routerImagenes;