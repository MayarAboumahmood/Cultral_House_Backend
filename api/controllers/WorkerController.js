const db = require("../Models/index");
const {unlinkSync} = require('fs');
const workerAuth = require("../middleware/workerAuth");
const responseMessage = require("../middleware/responseHandler");
const RError = require("../middleware/error.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const eventEmitter = require("./eventEmitter");


const Worker = db.workers;
const workers_events = db.workers_events;
const Event = db.events;
const Actions = db.actions;
const Op = db.Op;
const Reservation = db.reservations;

const Order = db.orders;
const Orders_drinks = db.orders_drinks;

const Drink = db.drinks;
const sequelize = db.sequelize;

const ValidationError = db.ValidationError;


const createWorker = async (req, res) => {
    try {

        const {first_name, last_name, phone_number, email, password} = req.body;

        const data = {
            first_name,
            last_name,
            phone_number,
            email,
            password: await bcrypt.hash(password, 10),
        };

        if (req.file) {
            data.image = req.file.path
        }

        //saving the user
        const worker = await Worker.create(data);
        const newData = data;
        delete newData.password

        await Actions.create({
            admin_id: req.admin_id,
            action: "Creating Worker",
            time: Date.now(),
            details: newData
        })

        return res.status(201).json({
            msg: "worker created successfully",
            data: worker
        });

    } catch (error) {

        res.status(400).json({
            req: req.body,
            msg: error.name
        })
        console.log(error);
    }
};

const login = async (req, res) => {

    const {email, phone_number, password} = req.body;


    try {

        let worker = null;

        if (email) {
            worker = await Worker.findOne({where: {email}});

        } else {
            worker = await Worker.findOne({where: {phone_number}});

        }

        if (worker == null) {


            throw new RError(401, "wrong credentials");

        } else {

            const check = await bcrypt.compare(password, worker.password);
            if (!check) {

                throw new RError(401, "wrong credentials");
            } else {
                const {worker_id, first_name} = worker;

                const token = jwt.sign({worker_id, first_name}, process.env.SECRET, {expiresIn: '3d'});
                res.status(200).send(responseMessage(true, "token is generated", token, "token"));


            }


        }

    } catch (error) {


        const statusCode = error.statusCode || 500;
        return res.status(statusCode).send(responseMessage(false, error.message));

    }

}

const showAllWorkers = async (req, res) => {
    const workers = await Worker.findAll()
    res.status(200).json({
        msg: "workers has been sent successfully",
        data: workers
    })
}

const deleteWorker = async (req, res) => {
    const worker_id = req.body.worker_id;

    if (!worker_id) {
        res.status(400).json({
            msg: "no admin_id is given"
        })
    }
    const worker = await Worker.findOne({
        where: {
            worker_id: worker_id
        }
    })

    if (worker) {
        if (worker.image) {
            unlinkSync(worker.image);

        }

        await Actions.create({
            admin_id: req.admin_id,
            action: "Deleting Worker",
            time: Date.now(),
            details: worker
        })

        worker.destroy()

        return res.status(202).json({
            msg: "Worker has been deleted successfully",
            data: worker
        })
    } else {
        res.status(404).json({
            msg: "Worker not found"
        })
    }

}
const showWorkerDetails = async (req, res) => {
    const worker_id = req.params.worker_id;

    const worker = await Worker.findOne({
        where: {worker_id}
    })

    const we = await workers_events.findAll({
        where: {
            worker_id
        }
    });

    if (we != null) {

        const event_id = we.map(v => v.event_id);

        const events = await Event.findAll({
            where: {
                [Op.or]: {event_id},
            },
        });

        const data = {worker, events};
        res.status(200).json({
            msg: "worker has been sent successfully",
            data: data
        })
    }
}


const showReservationsForWorker = async (req, res) => {


    const token = req.headers["x-access-token"];
    const event_id = req.body.event_id;

    try {
        await workerAuth(token);


        const reservations = await Reservation.findAll({where: {event_id}});

        if (reservations.length === 0) {
            throw new RError(404, "no reservations found");
        }

        let hasCome = [];
        let notCome = [];

        for (const reservation of reservations) {

            if (reservation.attendance == true) {
                hasCome.push(reservation);
            } else {
                notCome.push(reservation);

            }
        }
        const ress = {notCome, hasCome};

        res.status(200).send(responseMessage(true, "reservations have been retrieved successfully", ress));

    } catch (error) {

        const statusCode = error.statusCode || 500;
        return res.status(statusCode).send(responseMessage(false, error.message));


    }
}

const confirmArrival = async (req, res) => {

    const token = req.headers["x-access-token"];

    const reservation_id = req.body.reservation_id;
    const attendance_number = req.body.attendance_number;


    try {

        const worker = await workerAuth(token);

        const worker_id = worker.worker_id;

        const reservation = await Reservation.findOne({where: {reservation_id}});

        reservation.attendance = true;
        reservation.attendance_number = attendance_number;
        reservation.worker_id = worker_id;

        if (attendance_number != reservation.number_of_places) {

            const diff = reservation.number_of_places - attendance_number;


            const event = await Event.findOne({where: {event_id: reservation.event_id}});

            event.available_places += diff;

            event.save();

        }

        reservation.save();


        const customer_id = reservation.customer_id;

        eventEmitter.emit('sendID', customer_id, reservation_id);
        res.status(200).send(responseMessage(true, "reservations have been approved successfully", reservation));

    } catch (error) {

        const statusCode = error.statusCode || 500;
        return res.status(statusCode).send(responseMessage(false, error.message));


    }

}


const retractConfirmation = async (req, res) => {

    const token = req.headers["x-access-token"];

    const reservation_id = req.body.reservation_id;


    try {

        const worker = await workerAuth(token);


        const reservation = await Reservation.findOne({where: {reservation_id}});

        if (reservation.attendance_number != reservation.number_of_places) {

            const diff = reservation.number_of_places - attendance_number;


            const event = await Event.findOne({where: {event_id: reservation.event_id}});

            event.available_places -= diff;

            event.save();

        }

        reservation.attendance = false;
        reservation.attendance_number = null;
        reservation.worker_id = null;


        reservation.save();

        res.status(200).send(responseMessage(true, "reservations have been approved successfully", reservation));

    } catch (error) {

        const statusCode = error.statusCode || 500;
        return res.status(statusCode).send(responseMessage(false, error.message));


    }

}


const approveOrder = async (req, res) => {

    const token = req.headers["x-access-token"];

    const order_id = req.body.order_id;

    try {


        const worker = await workerAuth(token);

        const worker_id = worker.worker_id;

        const order = await Order.findByPk(order_id)


        if (order == null) {

            throw new RError(404, "order not found");


        }


        const reservation = await Reservation.findByPk(order.reservation_id);

        const wo = await workers_events.findOne({
            where: {
                worker_id,
                event_id: reservation.event_id

            }
        })

        order.worker_event_id = wo.worker_event_id;
        order.save();

        res.status(200).send(responseMessage(true, "order has been approved", order));
    } catch (error) {

        const statusCode = error.statusCode || 500;
        return res.status(statusCode).send(responseMessage(false, error.message));

    }

}

const retractOrder = async (req, res) => {

    const token = req.headers["x-access-token"];

    const order_id = req.body.order_id;

    try {


        await workerAuth(token);


        const order = await Order.findByPk(order_id)


        if (order == null) {

            throw new RError(404, "order not found");


        }


        order.worker_event_id = null;
        order.save();

        res.status(200).send(responseMessage(true, "order has been retracted", order));
    } catch (error) {

        const statusCode = error.statusCode || 500;
        return res.status(statusCode).send(responseMessage(false, error.message));

    }

}




const makeOrderByWorker = async (req, res) => {

    const token = req.headers["x-access-token"];

    let drinks = req.body.drinks;
    const description = req.body.description;


    if (!drinks) {
        return res.status(400).send(responseMessage(false, "insert drinks"));
    }


    let transaction;

    let ord;
    try {

        transaction = await sequelize.transaction();


        await workerAuth(token);

        const order = await Order.create({

            order_date: Date(),
            reservation_id: null,
            description

        }, {transaction});


        const ODS = [];

        let cost = 0;

         drinks = drinks.split(/[,]/);

        for (let drink of drinks) {

            drink = drink.split(/[:]/);
            const drink_id = drink[0];
            const quantity = drink[1];

            const od = await Orders_drinks.create({
                order_id: order.order_id,
                drink_id,
                quantity
            }, {transaction});


            const d = await Drink.findByPk(drink_id);

            cost += (quantity * d.price);

            ODS.push(od);

        }

        await transaction.commit();


        ord = {order, ODS, cost};

        eventEmitter.emit('create_new_order');

        res.status(201).send(responseMessage(true, "order is added", ord));


    } catch (errors) {


        await transaction.rollback();

        let statusCode = errors.statusCode || 500;
        if (errors instanceof ValidationError) {
            statusCode = 400;
        }
        return res.status(statusCode).send(responseMessage(false, errors.message));
    }

}

const deleteOrderByWorker = async (req, res) => {


    const token = req.headers["x-access-token"];

    const order_id = req.body.order_id;


    if (!order_id) {
        return res.status(400).send(responseMessage(false, "choose order"));


    }


    try {


        await workerAuth(token);


        const order = await Order.findByPk(order_id);


        await order.destroy();


        res.status(201).send(responseMessage(true, "order is deleted", order));


    } catch (errors) {


        await transaction.rollback();

        var statusCode = errors.statusCode || 500;
        if (errors instanceof ValidationError) {

            statusCode = 400;

        }

        return res.status(statusCode).send(responseMessage(false, errors.message));


    }

}

module.exports = {
    createWorker,
    login,
    showAllWorkers,
    deleteWorker,
    showWorkerDetails,
    showReservationsForWorker,
    confirmArrival,
    approveOrder,
    retractOrder,
    makeOrderByWorker,
    retractConfirmation,
    deleteOrderByWorker
}