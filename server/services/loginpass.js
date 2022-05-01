
const bcrypt = require("bcrypt")
const User = require('../model/user');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;




// passport auth
passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    // setup user model
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new localStrategy((username, password, done) => {

    User.findOne({ username: username }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: "No user with the given username" })
        }

        bcrypt.compare(password, user.password, (err, res) => {
            if (err) {
                return done(err)
            }
            // if password does not match
            if (res === false) {
                return done(null, false, { message: "Incorrect password" });
            }


            return done(null, user, { message: "success" });
        });
    })
}));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : process.env.JWT_SECRET
},
function (jwtPayload, cb) {

    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    return UserModel.findOneById(jwtPayload.id)
        .then(user => {
            return cb(null, user);
        })
        .catch(err => {
            return cb(err);
        });
}
));

function passportAuthentication(req, res, next) {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login?error=true',
        failureflash: true,
        session: false
    }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Username or password are wrong',
                user: user
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            const accessToken = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin
            }, process.env.JWT_SECRET,
                { expiresIn: "5h" })
            return res.json({ user, accessToken });
        });
    })(req, res);
};



module.exports.login = passportAuthentication;

