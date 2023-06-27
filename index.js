const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const morgan = require('morgan');
const admins = require("./api/routes/admin");
const db = require('./api/models/index');
const customers = require("./api/routes/customer");
const drinks = require("./api/routes/drink");
const events = require("./api/routes/event")
const artists = require("./api/routes/artist")
const workers = require("./api/routes/worker")
const cors = require('cors')

dotenv.config();

const app = express();
const port = process.env.PORT;

app.listen(port, () => {
    console.log("you are connected to 127.0.0.1:" + port)

})
app.use(cors());
app.use('/images',express.static('images'))
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/admins', admins);
app.use('/customers', customers);
app.use('/drinks', drinks);
app.use('/events', events);
app.use('/artist', artists);
app.use("/worker",workers)

app.use(express.json())


db.sequelize.sync({alter: true}).then(() => {

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


