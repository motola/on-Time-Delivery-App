const express = require('express');
const user = require('./model/user.js');
const parcel = require('./model/parcel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

const bodyParser = require('body-parser')

const app = express();
const port = 8080;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const saltRounds = 10;
const secret = 'secret'





// Fetch all Parcel delivery orders
app.get('/parcels', (req, res) => {
    res.status(200).json(user)
});

// Fetch a specific parcel delivery order
app.get('/parcels/:id', (req, res) => {
    console.log("fetch request params ", req.params.id)
    let parcelId = parcel.parcel.find( parcel => parcel.userId === parseInt(req.params.id))
    res.status(200).json(parcelId)
});

// Fetch all parcel delivery orders by a specific user  
app.get('/users/:id/parcels', (req, res) => {
    console.log("fetch request params ", req.params.id)
    let userId = user.user.find( user => user.id === parseInt(req.params.id))
    let parcelId = parcel.parcel.find( parcel => parcel.userId === parseInt(req.params.id))
    console.log("user", userId, "parcel", parcelId)
   if (userId.id === parcelId.userId) {
       res.status(200).json(parcelId);
   }
});

// Register a User
app.post('/auth/signup',  async (req, res) => {
    const { id, firstName, lastName, email, password }  = req.body
    const encryptedPassword = await bcrypt.hash(password, saltRounds)
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

// Login a user
app.post('/auth/login', async (req, res) => {
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

// Cancel a specific delivery order



app.listen(port, () => {
    console.log(`Server is listen on port ${port}`)
})