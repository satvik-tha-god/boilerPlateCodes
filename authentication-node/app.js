//jshint esversion:6
require('dotenv').config(); //requiring our environment variable files
const express = require("express"); //requiring and setting up our modules
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true}); //setting up our connection to database

const userSchema = new mongoose.Schema({ //defining our schema the new hip way
  email: String,
  password: String
};)

// userSchema.plugin(encrypt, {secret: process.env.SECRET, encyptedFields: ["password"] });

const User = new mongoose.model("User", userSchema); //setting up our model

app.get("/", function(req,res){ //get request for root route
  res.render("home");
});

app.get("/login", function(req,res){ //get request for login page
  res.render("login");
});

app.get("/register", function(req,res){ //get request for register page
  res.render("register");
});

app.post("/register", function(req,res){ //post request for register; get data from user
    bcrypt.hash(req.body.password, saltRounds, function(err, hash){ //encrypt password with bcrypt
      const newUser = new User({ //store data in model
        email: req.body.username,
        password:  hash //encrypting password with hash
      });
      newUser.save(function(err){ //save data in model
        if(err){ //error handling
          console.log(err);
        } else {
          res.render("secrets"); //render main page if nothing wrong lmao
        }
      });
    });
});

app.post("/login", function(req,res){  //post request for login; get data from user
  const username = req.body.username; //what we have to take
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){ //check if user is there
    if(err){ //error handling
      console.log(err);
    } else {
      if(foundUser){  //
        bcrypt.compare(password, foundUser.password, function(err, result){
          if(result===true){ //using bcrypt to compare hashed passwords when logged in
            res.render("secrets");
          }
        });
      }
    }
  });
});

app.listen(3000, function(){ //server up and running
  console.log("Server started at port 3000");
});
