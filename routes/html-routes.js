const db = require("../models");

module.exports = (app) => {
    app.get("/", (req, res) => {
        db.Article.find({})
            .then((articles) => {
                let articlesObject = {
                    articles: articles
                }
                console.log(articles);
                res.render("index.handlebars", articlesObject);
            })
            .catch((err) => {
                res.json({error: JSON.stringify(err)});
            });
    });

    app.get("/saved-articles", (req, res) => {
        db.Article.find({saved: true})
            .populate("notes")
            .then((articles) => {
                let articlesObject = {
                    articles: articles
                }
                console.log(articles);
                res.render("saved.handlebars", articlesObject);
            })
            .catch((err) => {
                res.json({error: JSON.stringify(err)});
            });
    });
};