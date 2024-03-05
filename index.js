const express = require("express");
const videoRoute = require('./routes/videos') ;
const app=express();

app.use(express.static("public"));
app.use(express.json());

// app.use((req, res, next) => {
//     console.log(`Incoming request: ${req.method} ${req.url}`);

//     next();
// })

app.use('/videos', videoRoute);

app.listen(8080, () =>{
    console.log("Server is now listening at http://localhost:8080 ");
})