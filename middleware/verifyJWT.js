const jwt = require("jsonwebtoken");
require("dotenv").config();


const verifyJWT = (req, res, next) => {
    console.log("VERIFY JWT")
    console.log("REQ HEADERS", req.headers);
    const authHeader = req.headers['authorization'];
    console.log("AUTH HEADER 1", authHeader);
    if (!authHeader) return res.status(401).send("Not authorized");
    console.log("AUTH_HEADER", authHeader);
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).send("INVALID TOKEN");
        req.user = decoded.username; // Why this ?
        console.log(req.user);
        next();
    })
}

module.exports = verifyJWT;

