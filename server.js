
const express = require("express");
const mongoose = require("mongoose");
const articleRouter = require("./routes/articles");
const Article = require("./models/article");
const path = require("path");
const app = express();
const luxon = require("luxon");
const PORT = process.env.PORT || 5000;
const favicon = require('serve-favicon');

mongoose.connect("mongodb://localhost/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use('/styles', express.static(path.join(__dirname, '/styles')));
app.use('/static', express.static(path.join(__dirname, 'node_modules/material-design-lite/')));
app.use('/assets', express.static(path.join(__dirname, '/assets')));
app.use(favicon(path.join(__dirname, '/assets', 'favicon.ico')));

app.get("/", async (req, res) => {
    const articles = await Article.find().sort({ updatedAt: "desc" });
    res.render("articles/index", { articles: articles, luxon: luxon })
})

app.use("/articles", articleRouter);

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});