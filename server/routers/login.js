const express = require("express");
const route = express.Router();
const loginService = require('../services/loginpass');

/**
 * @description Login Form
 * @method GET /login
 */
route.get("/login", LoggedOut, (req, res) => {

    // get error response from link
    const response = {
        error: req.query.error
    }

    res.render("login", response);


});
route.post("/login", loginService.login);


function LoggedOut(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }

    res.redirect('/')
}

module.exports = route;