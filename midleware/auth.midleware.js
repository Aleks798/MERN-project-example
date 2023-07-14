const jwt = require ("jsonwebtoken")
const config = require('config')


module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }

  try {

    const token = req.headers.authorization.split(' ')[1] //"Bearer TOKEN"

    //console.log('token:', token)
    //console.log('midleware/auth.midleware.js - ok')

    if (!token){
      return res.status(401).json({message: 'Нет авторизации'})
      //console.log('midleware/auth.midleware.js - Нет авторизации')
    }

    const jwtSecret = config.get('jwtSecret')
    const decoded = jwt.verify(token, jwtSecret)
    res.user = decoded
    //console.log('midleware/auth.midleware.js - res.user:', res.user)

    //return next()
    next()

  } catch(e) {
    return res.status(401).json({message: 'Нет авторизации'})

  }

}