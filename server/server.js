const express = require('express');
const { dbConnect } = require('./db/mongodb')
const path = require('path')



const app = express();


// Habilitar body Parser
app.use(express.json({extended: true }))

// Habilitar la carpeta publica
app.use(express.static(path.join(__dirname, '../public')))

// Conección a la base de datos
dbConnect()

// Rutas de la aplicación
app.use(require('./routes/index'));




const port = process.env.PORT || 4005;

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
})