const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://127.0.0.1:27017/test')
    .then(
        console.log("connected to DB")
    )
    .catch(error => {
        console.log(error)
    })


app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access_Control_Allow_Origin')
    res.header('Access_Control_Allow_Headers', 'Origin , X-Requested-With , Content-Type , Accept , Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access_Control_Allow_Methods', 'PUT , POST , PATCH , DELETE , GET ')
        return res.status(200).json({})
    }
    next();
})


app.listen(port, () => {
    console.log("you are connected to 127.0.0.1:" + port)
})