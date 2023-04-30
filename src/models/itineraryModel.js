const mongoose = require('mongoose')

const itinerary = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    travel:[{
        destination:String,
        startDate:Date,
        endDate:Date,
        activities:[{name:String,cost:Number}],
        accommodations:Number
    }],
    totalActivityCost:Number,
    totalAccommodations:Number
},{timestamps:true})

module.exports = mongoose.model('Itinerary',itinerary)