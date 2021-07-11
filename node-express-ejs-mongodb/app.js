//jshint esversion:6

const express = require("express"); //requiring our modulles installed ie express, body-parser, ejs, mongoose
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs'); //setting view engine to ejs

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public")); //html, css and other static files to public

mongoose.connect("mongodb://localhost:27017/"/* Add your database name after the / symbol */, {useNewUrlParser: true});

const articleSchema = { //create the schema your database is based upon, I have added some sample code
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema); //create your model and add the created schema to it

//TODO

app.listen(3000, function() { //server is up and running
  console.log("Server started on port 3000");
});
