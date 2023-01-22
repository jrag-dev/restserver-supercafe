const express = require('express');
const { dbConnect } = require('./db/mongodb');
const router = require('./routes/usuario');

// require('./config/config')




const app = express();


// Habilitar body Parser
app.use(express.json({extended: true }))

// conección a la base de datos
dbConnect()


// Rutas de la aplicación
app.use("/api/usuario", router)




const port = process.env.PORT || 4005;

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
})