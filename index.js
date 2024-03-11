const express = require("express");
const videoRoute = require('./routes/videos') ;
require('dotenv').config()
const app=express();
const cors = require('cors');

const {PORT , BACKEND_URL } = process.env

app.use(express.static("public"));
app.use(cors());

app.use(express.json());
app.use('/videos', videoRoute);

app.listen(PORT, () =>{
    console.log(`Server is now listening at ${BACKEND_URL}:${PORT}`);
})