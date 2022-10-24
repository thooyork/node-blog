
const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models/article");
const path = require("path");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const favicon = require('serve-favicon');
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set("view engine", "ejs");

// Origins that are allowed to call our site / pull data off of our site!
const corsWhiteList = ["https://www.fumix.de", `http://localhost:${PORT}`, `http://127.0.0.1:${PORT}`];
const corsOptions = {
    origin: (origin, callback) => {
        if (corsWhiteList.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("CORS not allowed"), false);
        }
    },
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

// Have to use both of these because we handle form posts AND ajax posts with json as payload !!!!
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(favicon(path.join(__dirname, '/assets', 'favicon.ico')));

app.use('/styles', express.static(path.join(__dirname, '/styles')));
app.use('/static', express.static(path.join(__dirname, 'node_modules/material-design-lite/')));
app.use('/assets', express.static(path.join(__dirname, '/assets')));

app.use("/login", require("./routes/login"));
app.use("/register", require("./routes/register"));
app.use("/404", require("./routes/404"));
app.use("/logout", require("./routes/logout"));

app.use("/", require("./routes/root"));

// TODO - handle JWT accessToken when generated from login route ...
app.use(verifyJWT);
app.use("/articles", require("./routes/articles"));

app.get("/*", (req, res) => {
    res.redirect("/404");
});

app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});