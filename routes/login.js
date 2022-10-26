const express = require("express");
const router = express.Router();
const User = require("./../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


router.get("/", (req, res) => {
    let user = new User({
        name: "",
        email: "",
        password: ""
    });
    var error = req.query.error;
    res.render("users/login", { user: user, error: error });
});

router.post("/", async (req, res) => {

    let user = await User.findOne({ email: req.body.email });

    if (user) {
        const correctPassword = await bcrypt.compare(req.body.password, user.password);
        if (correctPassword) {
            const accessToken = jwt.sign(
                { "user_email": user.email, "username": user.name },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1d" }
            );

            const refreshToken = jwt.sign(
                { "user_email": user.email, "username": user.name },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "1d" }
            );
            // save refreshToken to currentuser in DB
            user.refreshToken = refreshToken;
            user = await user.save()

            // res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
            res.cookie("access_token", `Bearer ${accessToken}`, { httpOnly: true, expires: 0, secure: true, encode: String });
            res.redirect("/articles");

            // respond accessToken to save by the client.
            // res.json({ accessToken });
        } else {
            const err = "Invalid User or Password";
            res.status(403).redirect("/login?error=" + err);
        }
    } else {
        const err = "Invalid User or Password";
        res.status(401).redirect("/login?error=" + err);
    }

});

module.exports = router;