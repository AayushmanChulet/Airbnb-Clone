const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { initialize } = require("passport");

main().then(()=>{
    console.log("Connected to database succesfully!");
    }).catch((error)=>{
        console.log(error);
    })

async function main(){
    mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj, owner : "66aa702571bd2bc2dcb12498"}));
    Listing.insertMany(initData.data);
    console.log("Data iniitialized successfully!");
}

initDB();
