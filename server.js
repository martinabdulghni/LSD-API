//imports

// create HTTP server.
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");




const connectDB = require("./server/database/connection")


const app = express();

dotenv.config({ path: ".env" });
const PORT = process.env.PORT || 8080;

// log requests
app.use(morgan("tiny"));

// mongoDB connection
connectDB();

// parse request to bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// set View engine
app.set("view engine", "ejs");

// auth
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());







app.set('view engine', 'ejs');
 
app.use(function(req, res, next){
    res.locals.message = req.flash();
    next();
});


// load assets
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/img", express.static(path.resolve(__dirname, "assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));

// load routers
app.use('/',require('./server/routers/home'))
app.use('/',require('./server/routers/signup'))
app.use('/',require('./server/routers/login'))
app.use('/',require('./server/routers/logout'))
app.use('/',require('./server/routers/dashboard'))

app.use('/api',require('./server/routers/user'))
app.use('/api',require('./server/routers/product'))
app.use('/api',require('./server/routers/cart'))
app.use('/api',require('./server/routers/order'))

app.listen(PORT, () => {
  console.log(PORT);
});
