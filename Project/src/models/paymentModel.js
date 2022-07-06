const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId

const paymentSchema = new mongoose.Schema({

    userId:{
        type:objectId,
        ref:"user",
        required:true
    },

    paymentDate:{
        type : Date,
        default : new Date()

    },
    
    paymentMethod:{
        type : String,
        default : "UPI"
    },

    bankDetails:{
        type : String,
        default : "SBI"

    }



   

}, {timestamps:true})


module.exports= mongoose.model('payment', paymentSchema)