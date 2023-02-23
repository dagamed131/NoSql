const UserModel = require('../models/UserModel')
const passport = require("passport");

exports.register = async (req, res) => {
    UserModel.register({username: req.body.username}, req.body.password, function (err, user) {
        if (err){
            console.log(err)
            res.redirect("/register")
        }else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets")
            });
        }
    })
};

exports.login = async (req, res) => {
        let user =new UserModel({
            username:req.body.username,
            password:req.body.password
        })

        req.login(user, function (err){
            if (err){
                console.log(err)
            }else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/secrets")
                });
            }
        })
};
