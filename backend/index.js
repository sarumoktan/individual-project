const express = require("express")
const app =express();
app.get("/",(req,res)=>{
    res.json({message:"welcome to the home page"});
});
app.listen(300,()=>{
    console.log("server running on https://localhost.3000");
});
