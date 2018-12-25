const db = require("../models");

module.exports = (app) => {
    // get all the scraped article stored in the db
    app.get("/articles", (req, res) => {
        db.Article.find({})
            .catch((err) => {
                res.json({error: `Error finding articles in db: ${JSON.stringify(err)}`});
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
                        .html();
                    db.Article.find({title: title})
                        .then((articleResult) => {
                            if(articleResult.length === 0) {
                                return db.Article.create({
                                    title: title,
                                    link: link,
                                    summary: summary,
                                    image: image
                                }).then((articleData) => {
                                    console.log(`Article successfully scraped with following data: ${JSON.stringify(articleData)}\n`);
                                }).catch((err) => {
                                    console.log(`Error creating article: ${JSON.stringify(err)}\n`);
                                });
                            } else {
                                console.log("Article already exists in db.\n");
                            }
                        })
                        .catch((err) => {
                            console.log(`Error finding article: ${JSON.stringify(err)}`);
                        });
                });
                res.json({success: "Articles successfully scraped."});
            })
            .catch((err) => {
                res.json({error: `An error occured with scraping: ${JSON.stringify(err)}`});
            });
    });
    
    // find an article by its id and update value of saved to true or false based on user action
    app.put("/articles", (req, res) => {
        db.Article.findByIdAndUpdate(req.body.id, {saved: req.body.saved})
            .then((article) => {
                res.json({success: `Article successfully updated with data: ${JSON.stringify(article)}`});
            })
            .catch((err) => {
                res.json({error: `Error updating article saved value: ${JSON.stringify(err)}`});
            });;
    });
    
    // find articles with value of saved equal to false and delete them from the db
    app.delete("/articles", (req, res) => {
        db.Article.deleteMany({saved: false})
        .then((articles) => {
            res.json({success: `The following articles have been deleted: ${JSON.stringify(articles)}`});
        })
        .catch((err) => {
            res.json({error: `Error deleting articles: ${JSON.stringify(err)}`});
        });
    });

    // create a note and add it to the related article based on article id param
    app.post("/articles/:id", (req, res) => {
        console.log("creating note");
        db.Note.create(req.body)
            .then((note) => { 
                console.log(`The following note was successfully added: ${JSON.stringify(note)}`);
                return db.Article.findByIdAndUpdate(req.params.id,
                    {
                        $push: {
                            notes: note._id
                        }
                    },{
                        new: true
                    });
            })
            .then((article) => {
                res.json(article);
            })
            .catch((err) => {
                res.json({error: `Error creating note: ${JSON.stringify(err)}`});
            });
    });

    app.delete("/notes/:id", (req, res) => {
        db.Note.findByIdAndDelete(req.params.id)
            .then((note) => { 
                res.json({success: `The followin note was deleted: ${JSON.stringify(note)}`});
            })
            .catch((err) => {
                res.json({error: `Error deleting note: ${JSON.stringify(err)}`});
            });
    });
};