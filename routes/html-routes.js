const db = require("../models");

module.exports = (app) => {
    app.get("/", (req, res) => {
        db.Article.find({}, (err, articles) => {
            if(err) throw err;
            console.log(articles);
            res.render("index.handlebars", articles)
        });
    });

    app.get("/saved-articles", (req, res) => {
        db.Article.find({saved: true}, (err, articles) => {
            if(err) throw err;
            console.log(articles);
            res.render("saved.handlebars", articles)
        });
    });
};