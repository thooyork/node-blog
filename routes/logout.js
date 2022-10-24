const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.clearCookie("access_token");
    res.redirect("/");
});

module.exports = router;