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
const reports = require("./api/routes/report");
const orders = require("./api/routes/order");
const reservations = require("./api/routes/reservation");
const cors = require('cors');
dotenv.config();

const eventEmitter = require("./api/controllers/eventEmitter");



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
app.use('/reports', reports);
app.use('/orders', orders);
app.use('/reservations', reservations);

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

const SSEConfig  = (res)=>{
    res.set("Content-Type", "text/event-stream");
    res.set("Connection", "keep-alive");
    res.set("Cache-Control", "no-cache");
    res.set("Access-Control-Allow-Origin", "*");

    res.status(200).write(`data: init\n\n`);

}

 app.use("/notifications",(_, res)=>{

       
        SSEConfig(res);

        eventEmitter.on('create_new_event', () => {

        res.status(200).write(`data: new Event\n\n`);
            
        
    });

   
 });
      


