const express = require('express');
const router = express.Router();
const user = require('../model/user');
const parcel = require('../model/parcel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

const saltRounds = 10;
const secret = 'secret';


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *         type: object
 *         required:
 *            - id
 *            - firstName
 *            - lastName
 *            - email
 *            - password
 *         properties:
 *           id:
 *             type: number
 *             description: The user Id
 *           firstName:
 *             type: string
 *             description: The user firstName
 *           lastName:
 *             type: string
 *             description: The user lastName
 *           email:
 *             type: string
 *             description: The user email, also goes for username
 *           password:
 *             type: number
 *             description: The user password
 *         example:
 *             id:  1
 *             firstName: tobi
 *             lastName: mide
 *             email: midetobi@gmail.com
 *             password: 1234
 *
 * 
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The User managing API
 */


/**
 * @swagger
 * /users/{id}/parcels:
 *   get:
 *     summary: Returns a list of all parcels by a specific user
 *     tags: [User]
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: string
 *           required: true
 *           description: User Id
 *     responses:
 *        200:
 *           description: The list of all parcels by a user
 *           content: 
 *               application/json:
 *                   schema:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/User'
 *        404:
 *            description: user not found
 *        500:
 *            description: server error
 *          
 *    
 *
 */



// Fetch all parcel delivery orders by a specific user  
router.get('/:id/parcels', (req, res) => {
    console.log("fetch request params ", req.params.id)
    let userId = user.user.find( user => user.id === parseInt(req.params.id))
    let parcelId = parcel.parcel.find( parcel => parcel.userId === parseInt(req.params.id))
    console.log("user", userId, "parcel", parcelId)
   if (userId.id === parcelId.userId) {
       res.status(200).json(parcelId);
   }
});


/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Registers a user
 *     tags: [User]
 *     requestBody:
*           required: true
*           content:
*              application/json:
*                schema:
*                  $ref: '#/components/schemas/User'
 *     responses:
 *         200:
 *            description: User successfully registered
 *            content: 
 *               application/json:
 *                   schema:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/User'
 *         404:  
 *            description: signup not successfully
 *         
 */

// Register a User
router.post('/signup',  async (req, res) => {
    const { id, firstName, lastName, email, password }  = req.body
    const encryptedPassword = await bcrypt.hash(password.toString(), saltRounds)
    const data = {
        id: id,
        email: email,
        password: encryptedPassword,
        lastName: lastName,
        firstName:firstName
    };
    user.user.push(data);
    res.status(200).json(user.user);
});

/**
 * /**
 * @swagger
 * components:
 *   schemas:
*      authLogin:
*           type: object
*           required:
*               - email
*               - password
*           properties:
*                email:
*                   type: string
*                   description: The Parcel Item the user has ordered
*                password:
*                   type: string
*                   description: The price of the parcel Item
*           example:
*                   email: mide123@gmail.com
*                   password: "12345"
*/
 

/**
* @swagger
* /auth/login:
*   post:
*     summary: login a user
*     tags: [User]
*     requestBody:
*         required: true
*         content:
*            application/json:
*                schema:
*                  $ref: '#/components/schemas/authLogin'       
*     responses:
*         200: 
*             description: login successful
*             content:
*                application/json:
*                    schema:
*                       $ref: '#/components/schemas/authLogin'
*         500: 
*            description: server error
* 
*/
// Login a user
router.post('/login', async (req, res) => {
    const {id, email, password } = req.body
     console.log(req.body);
     if (!(email && password)) {
         res.status(500).send('Email and Password Required');
     }
     userIndex = user.user.findIndex(user => user.email === email);
     console.log('userIndex', userIndex);
     if (userIndex === -1 ){
         res.status(404).send('User not found');
     }

     const loggedIn = user.user[userIndex];
     console.log(loggedIn)
     if (await bcrypt.compare(password, loggedIn.password)){
         const token = jwt.sign({login_id: loggedIn.id, loggedIn_email: loggedIn.email}, secret, { expiresIn: '2h' });
         res.status(200).json(token);
     }
     else { 
         res.status(403).send('password mismatch');
     }
});


module.exports = router