const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const categoriaSchema = new Schema({
  description: {
    type: String,
    unique: true,
    required: [true, 'La categoria es necesaria']
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }
})

module.exports = mongoose.model('Categoria', categoriaSchema);