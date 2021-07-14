//jshint esversion:6
require('dotenv').config(); //requiring our environment variable files
const express = require("express"); //requiring and setting up our modules
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.use(express.static("public")); //static files in public
app.set('view engine', 'ejs'); //view engine set to ejs
app.use(bodyParser.urlencoded({ //set up body parser
  extended: true
}));

app.use(session({ //setting up express sessions
  secret: /*Secret phrase*/,
  resave: false,
  saveUnintialized: false
}));

app.use(passport.initialize()); //initialize passport
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true}); //setting up our connection to database
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({ //defining our schema the new hip way
  email: String,
  password: String,
  googleId: String
};)

userSchema.plugin(passportLocalMongoose); //enabling passport local
userSchema.plugin(findOrCreate);

// userSchema.plugin(encrypt, {secret: process.env.SECRET, encyptedFields: ["password"] });

const User = new mongoose.model("User", userSchema); //setting up our model

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.use(new GoogleStrategy({ //setting up google oauth20 and calling env variables
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL:"http://googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) { //access users data using token
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function(req,res){ //get request for root route
  res.render("home");
});

app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile"]})
);

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });

app.get("/login", function(req,res){ //get request for login page
  res.render("login");
});

app.get("/register", function(req,res){ //get request for register page
  res.render("register");
});

app.get("/secrets", function(req,res){//get request for register page
  if(req.isAuthenticated()){ //check if authenticated properly otherwise send to login
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", function(req,res){ //logout functionality
  req.logout();
  res.redirect("/");
});

app.post("/register", function(req,res){ //post request for register; get data from user
  User.register({username: req.body.username}, req.body.password, function(err, user){ //register of passport
  if(err){ //error handling
    console.log(err);
    res.redirect("/register");
  } else {
    passport.authenticate("local")(req, res, function(){ //authenticate
      res.redirect("/secrets");
    });
  }
});
///////////////////////////////////// bcrypt start ////////////////////////
    // bcrypt.hash(req.body.password, saltRounds, function(err, hash){ //encrypt password with bcrypt
    //   const newUser = new User({ //store data in model
    //     email: req.body.username,
    //     password:  hash //encrypting password with hash
    //   });
    //   newUser.save(function(err){ //save data in model
    //     if(err){ //error handling
    //       console.log(err);
    //     } else {
    //       res.render("secrets"); //render main page if nothing wrong lmao
    //     }
    //   });
    // });
/////////////////////////////////////// bcrypt end ////////////////////////////
});

app.post("/login", function(req,res){  //post request for login; get data from user
  const user= new User({ //passing user entry to model
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err){ //login
    //error handling
    if(err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){ //authenticate
        res.redirect("/secrets");
      });
    }
  });

///////////////////////////// bcrpyt start //////////////////
  // const username = req.body.username; //what we have to take
  // const password = req.body.password;
  //
  // User.findOne({email: username}, function(err, foundUser){ //check if user is there
  //   if(err){ //error handling
  //     console.log(err);
  //   } else {
  //     if(foundUser){  //
  //       bcrypt.compare(password, foundUser.password, function(err, result){
  //         if(result===true){ //using bcrypt to compare hashed passwords when logged in
  //           res.render("secrets");
  //         }
  //       });
  //     }
  //   }
  // });
  ///////////////////////////// bcrypt end //////////////////////////
});


app.listen(3000, function(){ //server up and running
  console.log("Server started at port 3000");
});
