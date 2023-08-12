const bcrypt = require("bcrypt");
const db = require("../Models/index");
const Actions = db.actions;
const jwt = require("jsonwebtoken");

const responseMessage = require("../middleware/responseHandler");
const RError = require("../middleware/error.js");
const adminAuth = require("../middleware/adminAuth");


const Reservation = db.reservations;
const Event = db.events;
const ValidationError = db.ValidationError;
const sequelize = db.sequelize;

const Admin = db.admins;

const createAdmin = async (req, res) => {
    try {
        const {admin_name, email, password, is_super} = req.body;
        const data = {
            admin_name,
            email,
            password: await bcrypt.hash(password, 10),
            is_super
        };
        //saving the user
        const admin = await Admin.create(data);

        return res.status(201).json({
            msg: "admin created successfully",
            data: admin
        });

    } catch (error) {
        console.log(error);
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            res.status(400).json({msg: "validation error"})
        }

        //find an admin by their email
        const admin = await Admin.findOne({
            where: {
                email: email
            }

        });

        //if admin email is found, compare password with bcrypt
        if (admin) {
            const isSame = await bcrypt.compare(password, admin.password);

            //if password is the same
            //generate token with the admin's id and the secretKey in the env file

            if (isSame) {
                let token = jwt.sign({admin: admin}, process.env.SECRET, null, {
                    expiresIn: 24 * 60 * 60 * 1000,
                });

                //if password matches wit the one in the database
                //send admin data
                return res.status(200).json({
                    msg: "Logged in Successfully",
                    data: admin,
                    token: token
                });
            } else {
                return res.status(401).json({msg: "Authentication failed"});
            }
        } else {
            return res.status(401).json({msg: "Authentication failed"});
        }
    } catch (error) {
        console.log(error);
    }
};

const deleteAdmin = async (req, res) => {
    const admin_id = req.body.admin_id;

    if (!admin_id) {
        res.status(400).json({
            msg: "no admin_id is given"
        })
    }
    const admin = await Admin.findOne({
        where: {
            admin_id: admin_id
        }
    })
    if (admin) {

        await admin.destroy()

        return res.status(202).json({
            msg: "admin has been deleted successfully",
            data: admin
        })
    } else {
        res.status(404).json({
            msg: "Admin not found"
        })
    }

}

const showAllAdmins = async (req, res) => {
    const admins = await Admin.findAll()
    res.status(200).json({
        msg: "admin has been sent successfully",
        data: admins
    })
}

const makeReservationByAdmin = async (req, res) => {

    const token = req.headers["x-access-token"];


    try {

        const event_id = req.body.event_id;
        const customer_name = req.body.customer_name;


        if (!event_id) {
            throw new RError(400, "choose the event");
        }


        const number_of_places = req.body.number_of_places;

        if (!number_of_places) {

            throw new RError(400, "enter the number of the attendees");

        }

        const admin = await adminAuth(token);

        const admin_id = admin.admin_id;

        const event = await Event.findByPk(event_id);


        if (event == null) {

            throw new RError(404, "event not found");

        }

        if (number_of_places < 1) {
            throw new RError(400, "enter a valid number");

        }

        if (number_of_places > event.available_places) {
            throw new RError(400, "no enough spots in the events");

        }

        event.available_places -= number_of_places;

        const reservation = await Reservation.create({
            event_id,
            number_of_places,
            customer_id: null,
            customer_name

        });


        await event.save();

        await Actions.create({
            admin_id: admin_id,
            action: "Adding New Reservation",
            time: Date.now(),
            details: reservation
        })

        res.status(201).send(responseMessage(true, "reservation has been added", reservation));


    } catch (errors) {

        var statusCode = errors.statusCode || 500;
        if (errors instanceof ValidationError) {

            statusCode = 400;

        }

        return res.status(statusCode).send(responseMessage(false, errors.message));

    }

}

const deleteReservationByAdmin = async (req, res) => {

    const token = req.headers["x-access-token"];


    let transaction;
    try {

        transaction = await sequelize.transaction();

        const reservation_id = req.body.reservation_id;

        if (!reservation_id) {
            throw new RError(400, "choose the reservation");
        }


        const reservation = await Reservation.findByPk(reservation_id);

        if (reservation === null) {

            throw new RError(404, "reservation not found");

        }


        const admin = await adminAuth(token);

        const admin_id = admin.admin_id;


        const event_id = reservation.event_id;

        const number_of_places = reservation.number_of_places;
        const event = await Event.findByPk(event_id);

        event.available_places += number_of_places;

        await reservation.destroy({transaction});
        await event.save({transaction});

        await transaction.commit();

        await Actions.create({
            admin_id: admin_id,
            action: "Deleting Reservation",
            time: Date.now(),
            details: reservation
        })

        res.status(200).send(responseMessage(true, "reservation has been deleted successfully"));


    } catch (error) {


        await transaction.rollback();

        const statusCode = error.statusCode || 500;
        return res.status(statusCode).send(responseMessage(false, error.message));


    }


}
const showReservationsForAdmin = async (req, res) => {


    const token = req.headers["x-access-token"];

    try {
        await adminAuth(token);


        const reservations = await Reservation.findAll();

        if (reservations.length === 0) {
            throw new RError(404, "no reservations found");


        }

        res.status(200).send(responseMessage(true, "reservations have been updated successfully", reservations));

    } catch (error) {

        const statusCode = error.statusCode || 500;
        return res.status(statusCode).send(responseMessage(false, error.message));


    }
}
module.exports = {
    createAdmin,
    login,
    deleteAdmin,
    showAllAdmins,
    makeReservationByAdmin,
    deleteReservationByAdmin,
    showReservationsForAdmin

};

                                                                                                                                        