const express = require('express');
const mongoose = require('mongoose');


const app = express();
const port = process.env.PORT || 3000;
mongoose.connect('mongodb://127.0.0.1:27017/test')
    .then(
        console.log("connected to DB")
    )
    .catch(error => {
        console.log(error)
    })


app.listen(port, () => {
    console.log("you are connected to 127.0.0.1:" + port)
})