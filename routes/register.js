const express = require("express");
const router = express.Router();
const User = require("./../models/users");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
    res.render("users/register");
});

router.post("/", async (req, res) => {

    const hashedPwd = await bcrypt.hash(req.body.password, 10);

    let user = new User({
        name: req.body.name,
        password: hashedPwd
    });

    const userExists = await User.findOne({ name: user.name });

    if (!userExists) {
        try {
            user = await user.save();
            // TODO: schönes Successhandling und Message statt send()
            res.send(`New user ${user.name} created !`);
        } catch (e) {
            res.render("users/register");
        }
    } else {
        // TODO: schönes Errorhandling und Fehlerausgabe statt send(
        res.status(409).send("User already exists");
    }

});

module.exports = router;