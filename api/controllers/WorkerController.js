const db = require("../Models/index");
const {unlinkSync} = require('fs');

const Worker = db.workers;
const workers_events = db.workers_events;
const Event = db.events;
const Actions = db.actions;
const Op = db.Op;


const createWorker = async (req, res) => {
    console.log("admin id is ", req.admin_id)
    try {

        const {first_name, last_name, phone_number, email, password} = req.body;

        const data = {
            first_name,
            last_name,
            phone_number,
            email,
            password,
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

module.exports = {
    createWorker,
    showAllWorkers,
    deleteWorker,
    showWorkerDetails
}