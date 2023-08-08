const db = require("../Models/index");


const Event = db.events;
const Artist = db.events;
const Artist_Event = db.artists_events
const Photos = db.photos
const Op = db.Op;


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
            artist_id,
            cost
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
        const value = date.format(now,'YYYY/MM/DD HH:mm:ss');//nedded to format the date

        const event = await Event.create(data);
        const artists = JSON.parse(artist_id)


        await db.sequelize.transaction(async (t) => {
            try {
                for (const ar_id of artists) {
                    const artist = await Artist.findByPk(ar_id)
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

        if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
                Photos.create({
                    event_id: event.event_id,
                    picture: req.files[i].path
                })
            }
        }
        console.log(req.files)

        return res.status(201).json({
            msg: "event created successfully",
            data: event
        });


    } catch (error) {
        res.status(400).json({
            req: [req.body, req.files.length + "number of files"],
            msg: error.toString()
        })
        console.log(error);
    }

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



const showAllEvents = async (req, res) => {

    var events = await Event.findAll();
    const past = [];
    const upComing = [];
    const now = [];

    const eventDurstionInHours = 4;
    const ctDate = new Date().toLocaleString("en", {hour12: false});

    const currentDateArray = ctDate.split(/[,:]/);

       const currentDate = currentDateArray[0];
       const currentHours = currentDateArray[1];
       const currentMinutes = currentDateArray[2];


    //2023-08-07 15:00
    for (let index = 0; index < events.length; index++) {
        var event = events[index].toJSON();
        const dateObject = new Date(event.begin_date);
        const date = dateObject.toLocaleString("en", {hour12: false});
        const dateArray = date.split(/[,:]/);

       const eventDate = dateArray[0];
       const eventHours = dateArray[1];
       const eventMinutes = dateArray[2];     

         event.begin_date = date;


        if (currentDate < eventDate) {

            upComing.push(event);
            
        }
        else if (currentDate > eventDate) {
            
            past.push(event);
        }
        else{
           
            const eventDurationInMinutes = eventDurstionInHours * 60;
      
            const currentTimeInMinutes = currentHours * 60 + Number(currentMinutes);

            const eventTimeInMinutes = eventHours * 60 + Number(eventMinutes);

            const eventEndTimeInMinutes = eventTimeInMinutes + Number(eventDurationInMinutes);

      
            if (currentTimeInMinutes < eventTimeInMinutes) {
              upComing.push(event);
            } else if (currentTimeInMinutes >= eventEndTimeInMinutes) {
              past.push(event);
            } else {
              now.push(event);
            }
          }
        
    }

    events = {past, now, upComing};
    res.status(200).json({
        msg: "events has been sent successfully",
        data: events
    })
}
module.exports = {
    createEvent,
    showAllEvents,
    deleteEvent,
    updateEvent
}