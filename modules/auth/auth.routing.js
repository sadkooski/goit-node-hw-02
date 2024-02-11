const express = require("express");
const router = express.Router();
const { login, register, logOut, getUserData, updateAvatar, verify, resend } = require('./auth.controller')
const {auth} = require('../auth/auth.middleware')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'tmp');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post('/users/login', login)
router.post('/users/signup', register)
router.post('users/logout', auth, logOut)
router.get('/users/current', auth, getUserData)
router.patch('/users/avatars', auth, upload.single('avatar'), updateAvatar)
router.get('/users/verify/:verificationToken', verify)
router.post('/users/verify', resend)

module.exports = router