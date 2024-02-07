const passport = require('passport')
const passportJwt = require('passport-jwt')
const User = require('../users/user.schema')


  const strategy = new passportJwt.Strategy(
        {
secretOrKey: process.env.JWT_SECRET,
jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
}, 
(payload, done) => {
    console.log('Strategy')
    User.findOne({ _id: payload.id })
    .then((user) => {
        if(user) {
            return done(null, user)
        }
        return done(new Error('Token is invalid'))
    })
    .catch((err) => {
        return done(err)
    })
}
)

passport.use(strategy)

module.exports = {
    strategy,
}