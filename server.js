const express = require("express");
const app = express();
let PORT = process.env.PORT || 3020;

const mongoose = require("mongoose");
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mongoHeadlines";
mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
    .then(() => {
        console.log(`Initial connection to db was successful on db: ${MONGODB_URI}`);
    })
    .catch((err) => {
        console.log(`Error on initial conection to db: ${err}`);
    });

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.listen(PORT, (error, response) => {
    if(error) throw error;
    console.log(`Connectione established at http://localhost:${PORT}`);
});