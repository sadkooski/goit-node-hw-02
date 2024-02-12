import passport from 'passport';
import express from 'express';
import { strategy } from './auth.strategy.mjs';

const auth = (req, res, next) => {
    passport.authenticate(strategy, (err, user) => {
        console.log('Middleware')
        if (err || !user) {
            console.log(user)
            return res.status(401).json({
                message: "Not authorized" 
            })
        }   
        req.user = user
        next()     
    })(req, res, next)
}

export default auth;
