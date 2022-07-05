
const express = require('express');
const parcel = require('../model/parcel.js');
const user = require('../model/user'); 


const router = express.Router()


/**
 * @swagger
 * components:
 *   schemas:
 *     Parcel:
 *         type: object
 *         required:
 *            - userId
 *            - parcelItem
 *            - deliveryPrice
 *            - location
 *         properties:
 *           userId:
 *             type: number
 *             description: The parcel Id that links to the user Id
 *           parcelItem:
 *             type: string
 *             description: The Parcel Item the user has ordered
 *           deliveryPrice:
 *             type: string
 *             description: The price of the parcel Item
 *           location:
 *              type: string
 *              description: The parcel destination
 *         example:
 *             userId:  1
 *             parcelItem: Microwave
 *             deliveryPrice: 25,000
 *             location: 4, Fola Osibo, lekki, lagos
 *
 * 
 */

/**
 * @swagger
 * tags:
 *   name: Parcel
 *   description: The Parcel managing API
 */


/**
 * @swagger
 * /parcels:
 *   get:
 *     summary: Returns a list of all parcels
 *     tags: [Parcel]
 *     responses:
 *         200:
 *           description: The list of all parcels
 *           content: 
 *               application/json:
 *                   schema:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/Parcel'
 */ 
// Fetch all Parcel delivery orders
router.get('/', (req, res) => {
    res.status(200).json(parcel)
});

/**
 * @swagger
 * /parcels/{id}:
 *      get:
 *         summary: Returns a list of all parcels with the stated Id
 *         tags: [Parcel]
 *         parameters: 
 *            - in: path
 *              name: id
 *              schema:
 *                 type: string
 *              required: true
 *              description: The parcel Id
 *         responses:
 *           200:
 *              description: The parcel description by id
 *              contents:
 *                 applications/json:
 *                     schema:
 *                        $ref: '#/components/schemas/Parcel'
 *           404: 
 *              description: The Parcel not found
 */

// Fetch a specific parcel delivery order
router.get('/:id', (req, res) => {
    console.log("fetch request params ", req.params.id)
    let parcelId = parcel.parcel.find( parcel => parcel.userId === parseInt(req.params.id))
    if(parcelId) {
        res.status(200).json(parcelId)
    }
    else {
        res.status(404).json('Id not found');
    }
});


/**
 * @swagger
 * /parcels/{id}/cancel:
 *    delete:
 *     summary: Delete a parcel delivery order
 *     tags: [Parcel]
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *             type: string
 *          required: true
 *          description: The Parcel Id  
 *     responses:
 *          200:
 *            description: Parcel was updated
 *            content:
 *                application/json:
 *                   schema:
 *                      $ref: '#/components/schemas/Parcel'
 *          404:
 *            description: Parcel not found
 *   
 */


// Cancel a specific delivery order
router.delete('/:id/cancel', (req, res) => {
    const { id } = req.params  
    console.log("id:", id)
    let deleteParcel =  parcel.parcel.findIndex(parcel => parcel.userId === parseInt(id))
    console.log(deleteParcel);
    parcel.parcel.splice(deleteParcel, 1)
    res.status(201).json(parcel); 

});

// Create a parcel delivery order
/**
 * @swagger
 * /parcels:
 *    post:
*        summary: create a new parcel
*        tags: [Parcel]
*        requestBody:
*           required: true
*           content:
*              application/json:
*                schema:
*                  $ref: '#/components/schemas/Parcel'
*        responses:
*            200:
*               description: Parcel succesfully created
*               content:
*                 application/json:
*                     schema:
*                        $ref: '#/components/schemas/Parcel'
*            500: 
*              description: server error
*            
*/

router.post('/', (req, res) => {
     const { userId, deliveryPrice, location, parcelItem } = req.body
     let isUser = user.user.find( user => user.id === userId)
     console.log(isUser);
     const parcelData = {
         userId:userId,
         deliveryPrice: deliveryPrice,
         ParcelItem: parcelItem,
         location: location
         
     }
     if (isUser) {
         res.status(200).json(parcelData)
         parcel.parcel.push(parcelData);
         console.log(req.body)
     }
        else { 
            res.status(403).send('not registered, quickly sign up');
        }
     }); 
/**
 * @swagger
 * /parcels/{id}/edit:
 *    put:
 *     summary: change a parcel delivery order
 *     tags: [Parcel]
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *          type: string
 *     required: true   
 *     description: The parcel id
 *     requestBody:
 *         required: true
 *         content: 
 *            application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Parcel'
 *     responses:
 *          200:
 *            description: Parcel was deleted
 *            content:
 *                application/json:
 *                   schema:
 *                      $ref: '#/components/schemas/Parcel'
 *          404:
 *            description: Parcel not found
 *          500:
 *            description: server error
 *          
 *    
 * 
 */
// change a parcel delivery order

router.put('/:id/edit', (req, res) => {
    const { id } = req.params; 
    const {userId} = req.body

    console.log("params", id);
    console.log("bodyId", userId);
    if (parseInt(id) === parseInt(userId)){
    let editParcel =  parcel.parcel.findIndex(parcel => parcel.userId === parseInt(id));
    console.log('editparcel: ', editParcel);
    if(editParcel === -1){
        res.status(404).send('not authorized to change parcel');
    }
    else {    
    parcel.parcel.splice(editParcel, 1, req.body)
    res.status(200).send(parcel);
    }
}
 else {
    res.status(404).json('parameter and req.body.id must be same')

 }
});
 

module.exports = router