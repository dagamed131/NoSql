const mongoose = require("mongoose");
const passportLocalMongoose=require('passport-local-mongoose')
const passport=require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate')

let userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String
});

userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)

let userModel = new mongoose.model("User", userSchema);

passport.use(userModel.createStrategy())
passport.serializeUser(function (user, done) {
    done(null, user.id)
})
passport.deserializeUser(function (id, done) {
    userModel.findById(id, function (err, user) {
        done(err,user)
    })
})

passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/node-blog/users"
    },
    function(accessToken, refreshToken, profile, cb) {
        userModel.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

module.exports = userModel;