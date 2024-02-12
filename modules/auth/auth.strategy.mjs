import passport from 'passport';
import passportJwt from 'passport-jwt';
import User from '../users/user.schema.mjs';
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

export { strategy };
