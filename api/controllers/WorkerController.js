const db = require("../Models/index");
const { unlinkSync } = require('fs');

const Worker = db.workers;


const createWorker = async (req, res) => {
    
    try {
        const { first_name, last_name, phone_number, email, password } = req.body;

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


module.exports = {
    createWorker,
    showAllWorkers,
    deleteWorker
}