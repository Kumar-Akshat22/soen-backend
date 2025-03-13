import mongoose from "mongoose";

function dbConnect(){

    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("DB CONNECTED SUCCESSFULLY");
    })
    .catch((err)=>{
        console.log(err);
    })
}

export default dbConnect;