const express = require('express');
const router = express.Router();

//mongodb user model
const User = require('./../models/User');

//Password handler
const bcrypt = require('bcrypt');

//Signup
router.post('/signup', (req, res) => {
    let {name, email, password, dateofBirth} = req.body;
    name = name;
    email = email;
    password = password;
    dateofBirth = dateofBirth;

    if(name == "" || email == "" || password == "" || dateofBirth == "") {
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        });
    } else {
        //check if user already exists
        User.find({email}).then(result => {
            if(result.length) {
                //a user already exits
                res.json({
                    status: "FAILED",
                    message: "User with the provided email already exists"
                })
            } else {
                //try to create a new user
                
                //password handling
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword,
                        dateofBirth
                    });

                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "Signup successful",
                            data: result,
                        })
                        })
                    }).catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occured while saving user account !"
                        })
                })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while hashing password!"
                    })
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: 'FAILED',
                message: "An error occured while checking for existing user"
            })
        })
    }

    //ADD REMAINING CHECKS for name, email, pass & date of birth


})

//Signin
router.post('/signin', (req, res) => {
    let {email, password} = req.body;
    email = email;
    password = password;

    if(email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty credentials supplied"
        })
    } else {
        //check if user exists
        User.find({email})
        .then(data => {
            if(data.length) {
                //user exists

                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if(result) {
                        //passwords match
                        res.json({
                            status: "SUCCESS",
                            message: "Signin successful",
                            data: data
                        })
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Invalid Password entered!"
                        })
                    }
                })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while comparing passwords"
                    })
                })
            } else {
                res.json({
                    status: "FAILED",
                    message: "Invalid credentials entered!"
                })
            }
        })
        .catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing user"
            })
        })
    }
})

module.exports = router;