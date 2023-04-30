const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
require('dotenv').config()

// const objectIdCheck = function (req, res, next) {
//   try {
//     if (req.params.quizId && !mongoose.isValidObjectId(req.params.quizId)) return res.status(400).send({ status: false, message: "Invalid quizId" })
//     next()
//   } catch (error) {
//     return res.status(500).send({ status: false, message: error.message })
//   }
// }

const validateToken = function (req, res, next) {
  try {
    let token = req.headers['x-api-key']
    if (!token) return res.status(400).send({ status: false, message: "Token is required" })
    jwt.verify(token, process.env.secret_key, function (err, decode) {
      if (err) return res.status(400).send({ status: false, message: "Authentication Failed" })
      req.decode = decode
      next()
    })
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}


module.exports = {validateToken}