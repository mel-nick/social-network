const express = require('express');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;
const app = express();


app.get('/', (req, res)=>res.send('API running'))

// Mongoose connection
const db = mongoose.connection;

// Check connection
db.once('open', function () {
    console.log('Connected to MongoDB');
});

// Check for db errors
db.on('error', function (err) {
    console.error(err);
});
//listen
app.listen(PORT, (req, res) => {
  console.log(`Server is listening on port: ${PORT}`)
})