const express = require('express');
//const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const morgan = require('morgan');
const database = require('./api/db/connection.js');
const admins = require("./api/routes/admin");
dotenv.config();


const sql = fs.readFileSync('./api/scripts/ddl.sql').toString();


const app = express();
const port = process.env.PORT;






database.connectToDatabase().then(({ client, release }) => {
    console.log('Connected to PostgreSQL');
    database.createTables(client, release, sql);
    app.listen(port, () => {
        console.log("you are connected to 127.0.0.1:" + port)
    });

  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL', err);
  });




app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/admins', admins);


app.use((req, res, next) => {
    res.header('Access_Control_Allow_Origin')
    res.header('Access_Control_Allow_Headers', 'Origin , X-Requested-With , Content-Type , Accept , Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access_Control_Allow_Methods', 'PUT , POST , PATCH , DELETE , GET ')
        return res.status(200).json({})
    }
    next();
})


