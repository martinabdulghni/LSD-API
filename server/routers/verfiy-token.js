const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token
    if (!authHeader) {
        return res.status(401).json("you are not verified");
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json("token is not valid");
        }
        req.user = user;
        next();
    })
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {

        //update user only if admin or if id matches.
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("Not Allowed")
        }
    })
}
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {

        //update user only if admin
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("Not Allowed")
        }
    })
}

module.exports = { verifyTokenAndAdmin, verifyTokenAndAuthorization }