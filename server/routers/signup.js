const express = require("express");
const route = express.Router();

const SignupService = require('../services/signup');




/**
 * @description signup Form
 * @method GET /signup
 */
route.get("/signup", LoggedOut, (req, res) => {

    res.render("signup")

    // axios.get(process.env.LINK + '/api/users/get')
    //     .then(function (response) {
    //         res.render("signup", {
    //             user: response.data,
    //             error: req.query.error
    //         });
    //     })
    //     .catch(err => {
    //         res.send(err);
    //     })

});
route.post("/signup", SignupService.signup);




function LoggedOut(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }

    res.redirect('/')
}


module.exports = route;