require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session')
const passport=require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();

//always use bodyparser before defining routes!!!
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(session({
    secret: "then we need to replace it to .env file",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

const UserRoute = require('./routes/UserRoute')
app.use('/',UserRoute)

const dbConfig = require('./config/database.config.js');
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Database Connected Successfully!!");
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});



app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/submit", function(req, res){
    res.render("submit");
});

app.get("/secrets", function(req, res){
    if(req.isAuthenticated()){
        res.render("secrets")
    }else{
        res.redirect("/login")
    }
});

app.get("/auth/google",
    passport.authenticate('google',{ scope: ["profile"] })
)

app.get('/auth/google/osekter',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/secrets');
    });

app.get("/logout",function (req, res){
    req.logout()
    res.redirect("/")
})

let port = process.env.PORT||3000;

app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`);
});