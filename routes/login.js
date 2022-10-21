const express = require("express");
const router = express.Router();
const User = require("./../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


router.get("/", (req, res) => {
    res.render("users/login");
});

router.post("/", async (req, res) => {

    let user = await User.findOne({ name: req.body.name });

    if (user) {
        const correctPassword = await bcrypt.compare(req.body.password, user.password);
        if (correctPassword) {

            const accessToken = jwt.sign(
                { "username": user.name },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "10m" }
            );

            const refreshToken = jwt.sign(
                { "username": user.name },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "1d" }
            );
            // save refreshToken to currentuser in DB
            user.refreshToken = refreshToken;
            user = await user.save()

            // send refreshToken to user in an httpOnly (not available to Javascript) cookie !
            res.set({ "Authorization": `Bearer ${accessToken}` });

            res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

            // res.redirect("/");
            res.json({ accessToken });
        } else {
            // TODO: schönes Errorhandling und Fehlerausgabe statt send()
            res.status(403).send("wrong password");
        }
    } else {
        // TODO: schönes Errorhandling und Fehlerausgabe statt send()
        res.status(401).send("User doesn't exist!");
    }

});

module.exports = router;