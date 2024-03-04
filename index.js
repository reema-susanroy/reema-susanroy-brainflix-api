console.log("hello");
const express = require("express");
const app=express();

app.listen(8080, () =>{
    console.log("Server is now listening at http://localhost:8080 ");
})