const db = require("../models");

module.exports = (app) => {
    app.get("/", (req, res) => {
        db.Article.find({}, (err, articles) => {
            let articlesObject = {
                articles: articles
            }
            if(err) throw err;
            console.log(articles);
            res.render("index.handlebars", articlesObject);
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