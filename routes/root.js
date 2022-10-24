const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    const tokenCookie = req.headers['cookie']?.includes("Bearer ");
    if (tokenCookie) {
        res.redirect("/articles");
    } else {
        res.redirect("/login");
    }
});

module.exports = router;