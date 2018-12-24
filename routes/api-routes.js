const db = require("../models");

module.exports = (app) => {
    // get all the scraped article stored in the db
    app.get("/articles", (req, res) => {
        db.Article.find({})
            .then((articles) => {
                console.log(JSON.stringify(articles));
            })
            .catch((err) => {
                return handleError(err);
            });
    });

    // scrape article and post them to the db
    app.post("/articles", (_, res) => {
        const axios = require("axios");
        const cheerio = require("cheerio");

        axios.get("https://www.newyorker.com/culture")
            .then((response) => {
                const $ = cheerio.load(response.data);
                $("div.Card__content___10ZW7").each((_, card) => {
                    const link = `https://www.newyorker.com${$(card)
                        .children("a")
                        .attr("href")}`;
                    const title = $(card)
                        .children("a")
                        .children("h3")
                        .text();
                    const summary = $(card)
                        .children("div.Card__dekImageContainer___3CRKY")
                        .children("p")
                        .text();
                    const image = $(card)
                        .children("div.Card__dekImageContainer___3CRKY")
                        .children("a")
                        .children("div.Card__image___3i3np")
                        .children("picture")
                        .children("img")
                        .attr("src");
                    db.Article.create({
                        title: title,
                        link: link,
                        summary: summary,
                        image: image
                    }).then((articleData) => {
                        console.log(`Article successfully scraped with following data: ${JSON.stringify(articleData)}`);
                    }).catch((err) => {
                        return handleError(err);
                    });
                });
                res.json({success: "Articles successfully scraped."});
            })
            .catch((error) => {
                res.json({error: `An error occured with scraping: ${JSON.stringify(error)}`});
            });
    });
    
    // find an article by its id and update value of saved to true or false based on user action
    app.put("/articles", (req, res) => {
        db.Article.findByIdAndUpdate(req.body.id, {saved: req.body.saved})
            .then((article) => {
               console.log(`Article successfully updated with data: ${JSON.stringify(article)}`);
            })
            .catch((err) => {
                return handleError(err);
            });;
    });
    
    // find articles with value of saved equal to false and delete them from the db
    app.delete("/articles", (req, res) => {
        db.Article.deleteMany({saved: false})
        .then((articles) => {
            console.log(`The following articles have been deleted: ${JSON.stringify(articles)}`);
        })
        .catch((err) => {
            return handleError(err);
        });
    });

    // find the an article by its id and return the notes associated with it
    app.get("/articles/:id", (req, res) => {
        db.Article.findById(req.params.id, "notes")
            .populate("notes")
            .then((articleNotes) => {
                res.json(articleNotes);
            })
            .catch((err) => {
                return handleError(err);
            });
    });

    // create a note and add it to the related article based on article id param
    app.post("/articles/:id", (req, res) => {
        db.Note.create(req.body)
            .then((note) => { 
                console.log(`The following note was successfully added: ${JSON.stringify(note)}`);
                db.Article.findById(req.params.id)
                    .then((article) => {
                        console.log(article);
                        article.notes.push(note._id);
                    })
                    .catch((err) => {
                        return handleError(err);
                    });
            })
            .then((article) => {
                res.json(article);
            })
            .catch((err) => {
                return handleError(err);
            });
    });

    app.delete("/articles/:id", (req, res) => {
        db.Note.findByIdAndDelete(req.body.id)
            .then((note) => { 
                console.log(`The followin note was deleted: ${JSON.stringify(note)}`);
            })
            .catch((err) => {
                return handleError(err);
            });
    });
};