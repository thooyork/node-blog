const express = require("express");
const router = express.Router();
const User = require("./../models/users");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
    let user = new User({
        name: "",
        password: ""
    });
    res.render("users/register", { user: user });
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
            // res.send(`New user ${user.name} created !`);

            res.render("users/login", { user: user, error: null });

        } catch (e) {
            res.render("users/register", { user: user, error: e });
        }
    } else {
        res.render("users/register", { user: user, error: "User existiert bereits" });
    }

});

module.exports = router;