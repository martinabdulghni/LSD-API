const express = require("express");
const route = express.Router();

route.get("/dashboard",LoggedIn, (req, res) => {

    response = {
        title: "COS Dashboard",
        name: req.user.username,
        error: req.query.error,
    }
    res.render("dashboard", response);
});


function LoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/')
}


module.exports = route;