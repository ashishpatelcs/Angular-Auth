const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user')

const mongoose = require('mongoose');
mongoose.connect('mongodb://admin001:password123@ds247061.mlab.com:47061/ap-mongo-proj', (err) => {
    if (err) {
        console.log('error occurred');
    } else {
        console.log('MongoDB Connection Successful!');
    }
})

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(401).send('Unauthorized request');
    } else {
        let token = req.headers.authorization.split(' ')[1];
        if (token === null) {
            return res.status(401).send('Unauthorized request');
        } else {
            let payload = jwt.verify(token, 'secretkey');
            if (!payload) {
                return res.status(401).send('Unauthorized request');
            }
            req.userId = payload.subject;
            next();
        }
    }
}

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
                let payload = { subject: user._id }
                let token = jwt.sign(payload, 'secretkey')
                res.status(200).send({ token });
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
                    let payload = { subject: user._id };
                    let token = jwt.sign(payload, 'secretkey');
                    res.status(200).send({ token });
                }
            }
        }
    })
});

module.exports = router;
