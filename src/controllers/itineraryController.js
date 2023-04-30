const itineraryModel = require('../models/itineraryModel')

const itinerary = async (req, res) => {
    let data = req.body
    let create = await itineraryModel.create(data)
    return res.send({ data: create })
}

const getAllTravels = async (req, res) => {
    let userId = req.decode.userId
    let data = await itineraryModel.find({ userId: userId })
    return res.status(200).send({ status: true, data: data })
}

const editItinerary = async (req, res) => {
    let userId = req.decode.userId;
    let itineraryId = req.params.itineraryId;
    let destinationId = req.params.destinationId;
    let data = req.body;

    let updateObj = {};
    Object.keys(data).forEach(key => {
        updateObj[`travel.$.${key}`] = data[key];
    });

    let editDes = await itineraryModel.findOneAndUpdate(
        { _id: itineraryId, userId: userId, "travel._id": destinationId },
        { $set: updateObj },
        { new: true }
    );

    console.log(editDes);
    return res.status(200).send({ status: true, data: editDes });
};

const editActivity = async (req, res) => {
    let userId = req.decode.userId;
    let itineraryId = req.params.itineraryId;
    let destinationId = req.params.destinationId;
    let activityId = req.params.activityId
    let data = req.body;
    
    let updateObj = {};
    Object.keys(data).forEach(key => {
        updateObj[`travel.$[destination].activities.$[activity].${key}`] = data[key];
    });

    let editDes = await itineraryModel.findOneAndUpdate(
        { 
            _id: itineraryId, 
            userId: userId
        },
        { 
            $set: updateObj 
        },
        { 
            new: true,
            arrayFilters: [
                { "destination._id": destinationId },
                { "activity._id": activityId }
            ]
        }
    );

    return res.status(200).send({ status: true, data: editDes });
};


const addDestination = async (req, res) => {
    let userId = req.decode.userId
    let data = req.body
    let itineraryId = req.params.itineraryId
    let addDes = await itineraryModel.findOneAndUpdate({ _id: itineraryId, userId: userId }, { $push: { travel: data } }, { new: true })
    return res.status(200).send({ status: true, data: addDes })
}

module.exports = { itinerary, getAllTravels, addDestination, editItinerary, editActivity }