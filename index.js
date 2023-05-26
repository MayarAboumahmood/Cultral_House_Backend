const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const morgan = require('morgan');
const admins = require("./api/routes/admin");
const db = require('./api/models/index');
const customers = require("./api/routes/customer");
//   var multer = require("multer");
//    var upload = multer();
dotenv.config();


const app = express();
const port = process.env.PORT;

app.listen(port, () => {
    console.log("you are connected to 127.0.0.1:" + port)

})

//app.use(upload.any());
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/admins', admins);
app.use('/customers', customers);
app.use(express.json())


db.sequelize.sync().then(() => {

    console.log("db has been re sync")
})


app.use((req, res, next) => {
    res.header('Access_Control_Allow_Origin')
    res.header('Access_Control_Allow_Headers', 'Origin , X-Requested-With , Content-Type , Accept , Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access_Control_Allow_Methods', 'PUT , POST , PATCH , DELETE , GET ')
        return res.status(200).json({})
    }
    next();
})


