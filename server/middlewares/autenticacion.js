const jsonwebtoken = require('jsonwebtoken');



// TODO: Verificar Token

let verificarToken = (req, res, next) => {

  let token = req.get('token');

  jsonwebtoken.verify(token, process.env.SECRET_KEY, (err, decoded) => {

    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token inválido!!"
        }
      })
    }

    req.usuario = decoded.usuario

    return next()

  })

}


// TODO: Verifica admin role

let verificarRole = (req, res, next) => {

  let usuario = req.usuario

  if (usuario.role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      ok: false,
      err: {
        message: "El usuario no es administrador!"
      }
    })
  }

  return next()
}

// TODO: verificar token para las imagenes

const verificarTokenImg = (req, res, next) => {

  let token = req.query.token;
  jsonwebtoken.verify(token, process.env.SECRET_KEY, (err, decoded) => {

    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token inválido!!"
        }
      })
    }

    req.usuario = decoded.usuario

    return next()

  })
}


module.exports = {
  verificarToken,
  verificarRole,
  verificarTokenImg
};