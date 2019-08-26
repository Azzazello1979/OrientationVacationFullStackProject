'use strict';

const cors = require('cors');
const express = require('express');
const app = express();
const PORT = 5000;

// require routes...
const carsRoute = require('./routes/cars');
const customersRoute = require('./routes/customers');
const deleteRoute = require('./routes/delete');
const partsRoute = require('./routes/parts');
const updateRoute = require('./routes/update');
const postRoute = require('./routes/post');



//require('./startup/prod')(app); // preparing for heroku

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//use routes...
app.use('/cars', carsRoute);
app.use('/customers', customersRoute);
app.use('/delete', deleteRoute);
app.use('/parts', partsRoute);
app.use('/update', updateRoute);
app.use('/post', postRoute);


// TEST SERVER
app.get('/test', (req, res) => {
  res.send('OK...backend connected to frontend')
});

// modules & middlewares & db connection
// write BELOW this line







// write ABOVE this line
// EXPRESS connection check

app.listen(PORT, () => {
  console.log(`OK...Express listening on ${PORT}`);
});

