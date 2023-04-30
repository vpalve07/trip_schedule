const express = require('express')
const { user, login, forgotPass, resetPass } = require('../controllers/userController')
const { itinerary, getAllTravels, addDestination, editItinerary, editActivity } = require('../controllers/itineraryController')
const { validateToken } = require('../middleware/middleware')
const router = express.Router()

router.get("/health-check", function (req, res) {
    return res.send({message:"API working"})
})

router.post("/signUp",user)

router.post("/login",login)

router.post("/forgotPass",forgotPass)

router.post("/resetPassword",resetPass)

router.post("/itinerary",itinerary)

router.get("/getTravel", validateToken, getAllTravels)

router.put("/addDestination/:itineraryId", validateToken, addDestination)

router.put("/editDes/:itineraryId/:destinationId", validateToken, editItinerary)

router.put("/editDes/:itineraryId/:destinationId/:activityId", validateToken, editActivity )

router.all("/*",function(req,res){res.status(404).send({status:false,message:"Invalid HTTP request"})})

module.exports = router