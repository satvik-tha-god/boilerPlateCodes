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

mongoose.connect("mongodb://localhost:27017/" /* Add your database name after the / symbol */ , {
  useNewUrlParser: true
});

const /*schemaName*/ = { //create the schema your database is based upon, I have added some sample code
  /*parameter1*/: /*datatype*/,
  /*parameter2*/: /*datatype*/
};

const /*modelName*/ = mongoose.model(/*modelName*/, /*schemaName*/); //create your model and add the created schema to it

/////////////////////////////////Parent route///////////////////////
app.route( /*route*/ )

  .get(function(req, res) { //for reading our data
    /*Model Name*/
    .find( /*condition,*/ function(err, /*results*/ ) {
      if (!err) { //if we get an error then it sends
        res.send( /*results*/ );
      } else {
        res.send(err);
      }

    });
  })

  .post(function(req, res) {
    /*post request for adding data*/
    const /*object to save model*/ = new /*model*/ ({
      /*paramter1*/: req.body./*parameter1*/,
      /*parameter2*/: req.body./*parameter2*/
    });
    /*object of model*/
    .save(function(err) {
      if (err!) { //send status if it's saved or not
        res.send("Succesfully added data!");
      } else {
        res.send(err);
      }
    }); //to save sent data
  })

  .delete(function(req, res) { //for deleting data
    /*Model Name*/
    .deleteMany(
      /*condition*/
      ,
      function(err) { //error handling
        if (!err) {
          res.send("Succesfully deleted items");
        } else {
          res.send(err);
        }
      }
    );
  });

  /////////////////////////////////Child route///////////////////////

  app.route(/*route/:parameter*/)

  .get(function(req, res){ //get for child route

  /*modelName*/.findOne({/*condition*/}, function(err, /*data*/){ //send specific
      if(/*data*/){ // sending data and error handling
        res.send(/*data*/);
      } else {
        res.send("No articles were found");
      }
    });
  })
  .put(function(req,res){ //update a specific part
    /*modelName*/.update(
    /*conditions*/,
    /*updates*/,
    {overwrite: true}, //enabling overwrite
      function(err){ //error handling
      if(!err){
        res.send("Succesfully updated");
      } else{
        res.send(err);
      }
    }
  );
  })
  .patch(function(req,res){ //patch method
    /*modelName*/.update(
    {/*conditions*/},
    {$set: /*updates*/},
    function(err, results){ //error handling and shit lmao
      if(!err){
        res.send("Sucessfully updated!");
      } else {
        res.send(err);
      }
    }
  );
  })
  .delete(function(req, res) { //delete specific
    /*modelName*/.deleteOne(
      {/*parameter*/: req.params./*parameter*/},
      function(err) { //error handling
        if (!err) {
          res.send("Successfully deleted");
        } else {
          res.send(err);
        }
      }
    );
  });


app.listen(3000, function() { //server is up and running
  console.log("Server started on port 3000");
});
