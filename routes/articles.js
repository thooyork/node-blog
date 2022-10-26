const express = require("express");
const router = express.Router();
const Article = require("./../models/article");
const markdownpdf = require("markdown-pdf");
const luxon = require("luxon");


function parseJwt(token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

router.get("/", async (req, res) => {
    var search = req.query.search;
    let articles;
    if (search) {
        // this only works because there was created an index for searching all String type fields like so:
        // db.collection.createIndex({ "$**": "text" },{ name: "TextIndex" })
        articles = await Article.find({ "$text" : { "$search": search } }).sort({ updatedAt: "desc" });
    } else {
        articles = await Article.find().sort({ updatedAt: "desc" });
    }
    res.render("articles/index", { articles: articles, luxon: luxon, search: search })
})

router.get("/new", (req, res) => {
    res.render("articles/new", { article: new Article() })
});

router.get("/edit/:id", async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render("articles/edit", { article: article });
});

router.get("/delete/:id", async (req, res) => {
    const article = await Article.findByIdAndDelete(req.params.id);
    res.redirect("/articles");
});

router.get("/:slug", async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });

    if (article === null) {
        res.redirect("/404");
    } else {
        res.render("articles/show", { article: article });
    }
});


router.get("/pdf/:id", async (req, res) => {
    const article = await Article.findById(req.params.id);
    const md = `# ${article.title}\n ${article.markdown}`;
    const filename = article.slug.length <= 50 ? article.slug : article.slug.substring(0, 50);

    markdownpdf().from.string(md).to.buffer({}, (err, buffer) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            res.set({
                'Content-Disposition': `attachment; filename=${filename}.pdf`,
                'Content-Type': 'application/pdf'
            })
            res.send(buffer);
        }
    });
});

router.post("/:id", async (req, res) => {
    const authHeader = req.headers['cookie'];
    const token = authHeader.split(" ")[1];
    const payload = parseJwt(token);

    let article = await Article.findById(req.params.id);
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    article.updatedAt = Date.now();
    article.updatedBy = payload?.username || "";

    try {
        article = await article.save();
        res.redirect(`/articles/${article.slug}`);
    } catch (e) {
        res.render("articles/edit", { article: article })
    }
});

router.post("/", async (req, res) => {

    const authHeader = req.headers['cookie'];
    const token = authHeader.split(" ")[1];
    const payload = parseJwt(token);

    let article = new Article({
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        createdBy: payload?.username || ""
    });

    try {
        article = await article.save();
        res.redirect(`/articles/${article.slug}`);
    } catch (e) {
        res.render("articles/new", { article: article })
    }
});


module.exports = router;