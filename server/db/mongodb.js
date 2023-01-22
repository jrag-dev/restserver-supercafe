const mongoose = require('mongoose');
require('dotenv').config();



const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI_PRODUCTION);
    mongoose.set('strictQuery', true)
    console.log("Conexión a la base de datos fue establecida!!")
  } catch (error) {
    console.log("Ocurrio un error al realizar la conexión a mongodb")
    process.exit(1)
  }
}

module.exports = {
  dbConnect
}