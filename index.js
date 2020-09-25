var express = require('express');
var app = express();
var mongoose = require('mongoose');
var dotenv = require('dotenv');

dotenv.config();

//connecting to DB
mongoose.connect(process.env.SECRET, {useNewUrlParser: true, useUnifiedTopology: true}, (err)=>{
    if(err){
        console.log(err);
    } else{
        console.log('connected to db')
    }
})

//importroutes
var authRoute = require('./routes/auth');
var postRoute = require('./routes/posts');

//middlewares
app.use(express.json());

//route middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000);   