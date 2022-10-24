const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['cookie'];
    if (!authHeader) return res.status(401).send("Not authorized");
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).send("INVALID TOKEN");
        req.user = decoded.username; // Why this ?
        // console.log(req.user);
        next();
    })
}


module.exports = verifyJWT;

