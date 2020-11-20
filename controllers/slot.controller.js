const db = require("../models");
const Slot = db.slot;

exports.allSlots = (req, res) => {

    // Returns all Slots
      Slot.find({})
          .exec((err, slots) => res.json(slots))
}

 exports.createSlot = async (req, res) => {
    const requestBody = req.body;

    const newSlot = new Slot ({
      slot_time: requestBody.slot_time,
      slot_date: requestBody.slot_date,
      created_at: Date.now()
    });

    await newSlot.save((err, saved) => {
      //Returns the new slot
      //after a successful save
      Slot
        .findOne({_id: saved._id})
        .exec((err, slot) => res.json(slot));
    })
  },


  exports.findByDate = (req, res) => {
    const slot_date = req.params.slot_date;
    console.log('slot date: ', slot_date);
    //slot_date = '2017-11-09';

    //Returns all slot with present date
    Slot.find({})
        .where('slot_date').equals(slot_date)
        .exec((err, slots) => res.json(slots));
  }