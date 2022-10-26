const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    // req.session.destroy();
    res.clearCookie("access_token");
    // res.redirect("/");
    delete req.session;
        res.redirect('/') // will always fire after session is destroyed
    
});

module.exports = router;