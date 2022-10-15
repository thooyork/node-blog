
const moment = require("moment");
const express = require("express");
const mongoose = require("mongoose");
const articleRouter = require("./routes/articles");
const Article = require("./models/article");
const path = require("path");
const app = express();

mongoose.connect("mongodb://localhost/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
// app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
// app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
// app.use('/icons', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')));

app.use('/styles', express.static(path.join(__dirname, '/styles')));
app.use('/static', express.static(path.join(__dirname, 'node_modules/material-design-lite/')));


app.get("/", async (req, res) => {
    const articles = await Article.find().sort({ createdAt: "desc" });
    res.render("articles/index", { articles: articles })
})

app.use("/articles", articleRouter);

app.listen(process.env.PORT || 5000);