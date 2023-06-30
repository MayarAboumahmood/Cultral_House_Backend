const db = require("../Models/index");

const responseMessage = require("../middleware/responseHandler");
const RError = require("../middleware/error.js");

const Event = db.events;
const Artist = db.events;
const Artist_Event = db.artists_events

const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            ticket_price,
            available_places,
            band_name,
            begin_date,
            admin_id,
            artist_id
        } = req.body;

        const data = {
            title,
            description,
            ticket_price,
            available_places,
            band_name,
            begin_date,
            admin_id,
        };

        const event = await Event.create(data);


        await db.sequelize.transaction(async (t) => {
            try {
                for (const ar_id of artist_id) {
                    const artist = await Artist.findByPk(1)
                    if (!artist) {
                        throw new Error("artist not found" + ar_id)
                    }
                    const artist_event = await Artist_Event.create({
                        artist_id: ar_id,
                        event_id: event.event_id,
                        cost: 100
                    }, {transaction: t})
                }
            } catch (e) {
                console.log("rolling back")
                console.log(e)
                t.rollback()
            }
        });


        return res.status(201).json({
            msg: "event created successfully",
            data: event
        });


    } catch (error) {
        res.status(400).json({
            req: req.body,
            msg: error.toString()
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

const updateEvent = async (req, res) => {

    const event = await Event.findByPk(req.body.event_id);
    if (event != null) {
        const {title, description, ticket_price, available_places, begin_date, band_name} = req.body
        if (title != null)
            event.title = title
        if (description != null)
            event.description = description
        if (ticket_price != null)
            event.ticket_price = ticket_price
        if (available_places != null)
            event.available_places = available_places
        if (begin_date != null)
            event.begin_date = begin_date
        if (band_name != null)
            event.band_name = band_name

        try {
            await event.save();
            return res.status(202).json({
                msg: "event has been updated successfully",
                data: event
            })
        } catch (e) {
            return res.status(400).json({
                msg: e,
                requestBody: req.body
            })
        }


    } else {
        return res.status(404).json({msg: "event not found"})
    }


}



module.exports = {
    createEvent,
    showAllEvents,
    deleteEvent,
    updateEvent
}