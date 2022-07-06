const mongoose = require("mongoose")


const productSchema = new mongoose.Schema({
    title : {
        type:String,
        required:true,
        unique : true
    },

    code:{
        type:String,
        required : true,
        unique: true
    },

    category:{
        type : [String],
        required : true
    },

    price : {
        type : Number,
        required : true,
    }
   

},  {timestamps :true})


module.exports= mongoose.model('product', productSchema)
