const passport = require('passport')
const express = require("express");
const {strategy} = require('./auth.strategy')

const auth = (req, res, next) => {
    passport.authenticate(strategy, (err, user) => {
        console.log('Middleware')
        if (err || !user) {
            return res.status(401).json({
                message: "Not authorized"
            })
        }   
        req.user = user
        next()     
    })(req, res, next)
}

module.exports = {
    auth,
}