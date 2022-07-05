const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const parcelRouter = require('./router/parcel');
const userRouter = require('./router/user');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');




const app = express();
const port = process.env.port || 8080;



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const options = {   
    definition: {
        openapi: "3.0.0",
        info: {
            title: "A parcel delivery Api",
            version: "1.0.0",
            description:"A simple Express Library API"
        },
        servers: [
            {
                url:"http://localhost:8080" 
            }
        ],
    },
    apis: ['./router/*.js']
}
const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))



// Declaring Routes
app.use("/parcels", parcelRouter);
app.use("/users", userRouter);
app.use("/auth", userRouter);









app.listen(port, () => {
    console.log(`Server is listen on port ${port}`)
})