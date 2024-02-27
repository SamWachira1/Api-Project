const express = require('express')
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Image, Review, Booking} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleValidationErrorsUsers, handleValidationErrorsSpots, checkBookingConflictsbookings } = require('../../utils/validation');


const router = express.Router();

const validateBooking = [
    check('startDate')
    .notEmpty()
    .custom((value, ) => {
        if (new Date(value) < new Date()) {
          throw new Error('startDate cannot be in the past');
        }
        return true;
      }),
    check('endDate')
      .notEmpty()
      .custom((value, { req }) => {
        // Add your custom validation logic for endDate
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(value);
  
        if (endDate <= startDate) {
          throw new Error('endDate cannot be on or before startDate');
        }
        return true;
      }),

      handleValidationErrors,
      checkBookingConflictsbookings
  ]


router.get('/current', requireAuth, async (req, res) => {

    let user = req.user 

     const bookings = await Booking.findAll({
        where: {userId: user.id}
    })

    for (let booking of bookings) {
        
        let spots = await Spot.findAll({
            where: {id: booking.spotId}
        })

        for (let spot of spots ){

    //  console.log("\n\n\n", spot[0].id, "\n\n\n")


        let spotImage = await Image.findAll({
            where: {imageableType: 'Spot'},
            attributes: ['url']
        })

        //  console.log("\n\n\n", spotImage[0].url , "\n\n\n")


        let createdAtDate = new Date(booking.createdAt);
        let upadatedAtDate = new Date(booking.updatedAt)

        createdAtDate = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
        upadatedAtDate = upadatedAtDate.toISOString().replace('T', ' ').split('.')[0];
        
        let bookingStartDate = booking.startDate.toISOString().split('T')[0];
        let bookingEndDate = booking.endDate.toISOString().split('T')[0];

        
    
          const formattedSpot = {
                id: booking.id,
                spotId: booking.spotId,
                Spot: {
                id: spot.id,
                ownerId: spot.id,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                country: spot.country,
                lat: spot.lat,
                lng: spot.lng,
                name: spot.name,
                description: spot.description,
                price: spot.price,
                previewImage: spotImage[0].url 
                },
                userId: booking.userId,
                startDate: bookingStartDate ,
                endDate: bookingEndDate,
                createdAt:createdAtDate,
                updatedAt: upadatedAtDate

            }


             return res.status(200).json({Bookings: [formattedSpot]})


        }


    }

})


router.put('/:bookingId', requireAuth, validateBooking, async (req, res)=> {
    let currUser = req.user 
    let {bookingId} = req.params 
    let {startDate, endDate} = req.body 

    let booking = await Booking.findByPk(Number(bookingId))

    
    if (booking.userId === currUser.id){

        booking.startDate = startDate
        booking.endDate = endDate
    
        await booking.save()

        let createdAtDate = new Date(booking.createdAt);
        let upadatedAtDate = new Date(booking.updatedAt)

        createdAtDate = createdAtDate.toISOString().replace('T', ' ').split('.')[0];
        upadatedAtDate = upadatedAtDate.toISOString().replace('T', ' ').split('.')[0];

        let bookingStartDate = booking.startDate.toISOString().split('T')[0];
        let bookingEndDate = booking.endDate.toISOString().split('T')[0];

        let formattedResponse = {
            id: booking.id,
            spotId: booking.spotId,
            userId: booking.userId,
            startDate: bookingStartDate,
            endDate: bookingEndDate,
            createdAt: createdAtDate,
            updatedAt: upadatedAtDate

        }


       return res.status(200).json(formattedResponse)
    }


})





module.exports = router;
