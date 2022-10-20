const express = require("express");
const router = express.Router();
const Article = require("./../models/article");
const luxon = require("luxon");

router.get("/", async (req, res) => {
    const articles = await Article.find().sort({ updatedAt: "desc" });
    res.render("articles/index", { articles: articles, luxon: luxon })
})

module.exports = router;