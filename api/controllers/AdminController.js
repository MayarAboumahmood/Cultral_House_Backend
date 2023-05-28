//importing modules
const bcrypt = require("bcrypt");
const db = require("../Models/index");
const jwt = require("jsonwebtoken");

const Admin = db.admins;
const Worker = db.workers;
const Event = db.events;

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

        admin.destroy()

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

const createWorker = async (req, res) => {
    try {
        const {first_name, last_name, phone_number, email, password} = req.body;

        const data = {
            first_name,
            last_name,
            phone_number,
            email,
            password
        };

        //saving the user
        const worker = await Worker.create(data);

        return res.status(201).json({
            msg: "worker created successfully",
            data: worker
        });

    } catch (error) {
        res.status(500).json({
            req: req.body,
            msg: error.name
        })
        console.log(error);
    }
};

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

const showAllWorkers = async (req, res) => {
    const workers = await Worker.findAll()
    res.status(200).json({
        msg: "workers has been sent successfully",
        data: workers
    })
}

const createEvent = async (req, res) => {
    try {
        const {title, description, ticket_price, available_places, band_name, begin_date, admin_id} = req.body;
        const data = {
            title,
            description,
            ticket_price,
            available_places,
            band_name,
            begin_date,
            admin_id
        };

        const event = await Event.create(data);
        return res.status(201).json({
            msg: "event created successfully",
            data: event
        });
    } catch (error) {
        res.status(500).json({
            req: req.body,
            msg: error.name
        })
        console.log(error);
    }

}

const showAllEvents = async (req, res) => {
    const events = await Event.findAll()
    res.status(200).json({
        msg: "events has been sent successfully",
        data: events
    })
}

const deleteEvent = async (req, res) => {
    const event_id = req.body.event_id;

    if (!event_id) {
        res.status(400).json({
            msg: "no event_id is given"
        })
    }
    const event = await Event.findOne({
        where: {
            event_id: event_id
        }
    })
    if (event) {

        event.destroy()

        return res.status(202).json({
            msg: "Event has been deleted successfully",
            data: event
        })
    } else {
        res.status(404).json({
            msg: "Event not found"
        })
    }

}


module.exports = {
    createAdmin,
    login,
    deleteAdmin,
    showAllAdmins,
    createWorker,
    deleteWorker,
    showAllWorkers,
    createEvent,
    showAllEvents,
    deleteEvent

};