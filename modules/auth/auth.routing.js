const express = require("express");
const router = express.Router();
const { login, register, logOut, getUserData } = require('./auth.controller')
const {auth} = require('../auth/auth.middleware')

router.post('/users/login', login)
router.post('/users/signup', register)
router.post('users/logout', auth, logOut)
router.get('/users/current', auth, getUserData)

module.exports = router