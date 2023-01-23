const bcryptjs = require('bcryptjs');


function encriptarPassword(password) {
  const salt = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(password, salt);
  return hash
}

function parseJwt(token) {
  let base64Url = token.split(',')[1];
  let base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}


module.exports = {
  encriptarPassword,
  parseJwt
}