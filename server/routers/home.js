const express = require("express");
const route = express.Router();



/**
* @description home
* @method GET /home
*/
route.get("/", (req, res, next) => {
    res.render("home");
});


module.exports = route;