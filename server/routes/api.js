const express = require('express');
const router = express.Router();

const User = require('../models/user')

const mongoose = require('mongoose');
mongoose.connect('mongodb://admin001:password123@ds247061.mlab.com:47061/ap-mongo-proj', (err) => {
    if (err) {
        console.log('error occurred');
    } else {
        console.log('MongoDB Connection Successful!');
    }
})

router.get('/', (req, res) => {
    res.send('API Endpoint works');
});

router.post('/register', (req, res) => {
    let userData = req.body;
    let user = new User(userData);

    user.save(
        (err, user) => {
            if (err) console.log('error occurred');
            else {
                res.status(200).send(user);
            }
        }
    );
});

router.post('/login', (req, res) => {
    let userData = req.body;
    console.log(userData);
    
    User.findOne({email: userData.email}, (err, user) => {
        if (err) console.log(err);
        else {
            console.log(user);
            if (!user) {
                res.status(401).send('Invalid email');
            } else {
                if (user.password != userData.password) {
                    res.status(401).send('Invalid password');
                } else {
                    res.status(200).send(user);
                }
            }
        }
    })
});

module.exports = router;