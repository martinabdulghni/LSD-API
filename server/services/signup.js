const bcrypt = require("bcrypt")
const User = require('../model/user');
const session = require('express-session');



// signup form unique user
exports.signup = async (req, res) => {

    const existingUsername = await User.exists({ username: req.body.username });
    const existingEmail = await User.exists({ email: req.body.email });

    if (!existingUsername || !existingEmail) { // user doesnt exist

        const pass = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: pass
        });

        try {
            newUser.save(newUser).then(() => {
                res.redirect("/login");
            }).catch(err => {
                res.status(500).send({ message: err.message || "Something went wrong" });
            })

        } catch (err) {
            return res.json({ status: 'error', message: err.message });
        }
    }
    else {
        res.redirect("/signup?error=true")
    }


}



