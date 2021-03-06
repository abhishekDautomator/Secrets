//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email : String,
  password : String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User",userSchema);

app.get("/", function(req, res){
    res.render("home")
});

app.get("/login", function(req, res){
    res.render("login")
});

app.get("/register", function(req, res){
    res.render("register")
});

app.get("/logout", function(req, res){
    res.render("home")
});

app.post("/register", function(req, res){
  const newUser = new User({
    email : req.body.username,
    password : req.body.password
  })
  newUser.save(function(err){
    if(!err){
      console.log("User successfully registered");
      res.render("secrets");
    }else{
      console.log(err+" error occured");
    }
  });
});

app.post("/login", function(req, res){
  User.findOne({
    email : req.body.username
  },function(err, foundUser){
    if(foundUser.password === req.body.password){
      console.log("Successfully logged in");
      res.render("secrets");
    }else{
      console.log("Sorry wrong credential");
    }
  })
});

app.listen(3000, function(err){
  if(!err){
    console.log("Server started successfully on port 3000");
  }else{
    console.log(err+" error occured");
  }
});
