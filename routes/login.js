const express = require("express");
const router = express.Router();
const User = require("./../models/users");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
    res.render("users/login");
});

router.post("/", async (req, res) => {

    let user = await User.findOne({ name: req.body.name });
    
    if (user) {
        const correctPassword = await bcrypt.compare(req.body.password, user.password);
        if (correctPassword) {
            // TODO: set sessionvariable user is authorized
            res.send("Alles gut - jetzt angemeldet - redir zum blog, bzw sessionvariable setzen");
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