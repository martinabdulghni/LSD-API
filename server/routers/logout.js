const express = require("express");
const route = express.Router();


/**
 * @description logout
 * @method GET /logout
 */
route.get("/logout", LoggedIn, (req, res) => {
  req.logout();
  res.redirect("/");

});



// check if user is logged in
function LoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/')
}



module.exports = route;