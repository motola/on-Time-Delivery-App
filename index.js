const express = require('express');


const app = express();
const port = 8080;


let parcel = [
    {
    id: 1,
    parcel: 'Brogues',
    deliveryPrice: '$3.55'
    },
    {
    id: 2,
    parcel: 'Oxford Menswear',
    deliveryPrice: '$4.55'
    },
    {
        id: 3,
        parcel: 'Jamaican Wig',
        deliveryPrice: '$4.55'
        },
]



app.get('/', (req, res) => {
    res.status(200).json(parcel )
});


app.listen(port, () => {
    console.log(`Server is listen on port ${port}`)
})