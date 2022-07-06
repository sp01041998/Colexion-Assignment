const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema({

    userId:{
        type:objectId,
        ref:"user",
        required:true
        
    },

    items:{
        type:[{productId : {
            type:objectId,
            ref:"product",
            required:true},

            price : {
                type: Number,
            }
        }]
    },

    totalPrice : {
        type:Number,
        required:true
    },

    totalItems:{
        type:Number,
        required:true
    },

    status:{
        type : String,
        required : true,
        enum : ["Paid", "Pending", "Cancelled"],
    }

}, {timestamps:true})


module.exports= mongoose.model('order', orderSchema)