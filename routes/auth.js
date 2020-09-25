const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {registerValidation, loginValidation} = require('../validation');

router.post('/register', async (req, res)=>{

    //validate before sending
    const {error} = registerValidation(req.body)
    if(error) 
        return res.status(400).send(error.details[0].message)
    //checking if old user
    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) 
        return res.status(400).send('email exists');
    //hash passwords
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    //create new user    
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    })
    try{
        const savedUser = await user.save();
        res.send(savedUser);
    } catch(err){
        res.status(200).send(err);
    }

});

router.post('/login', async (req, res)=>{

    //validate before sending
    const {error} = loginValidation(req.body)
    if(error) 
        return res.status(400).send(error.details[0].message)
    //checking if user exists
    const user = await User.findOne({email: req.body.email});
    if(!user) 
        return res.status(400).send('email does not exist');
    //password is correct?
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword)
        return res.status(400).send('Not a valid password');
    //jwt
    const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET);
    res.header('auth-token', token).send(token);

});

module.exports = router;    