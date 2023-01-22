const bcryptjs = require('bcryptjs');


function encriptarPassword(password) {
  const salt = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(password, salt);
  return hash
}



module.exports = {
  encriptarPassword
}