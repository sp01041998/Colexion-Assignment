const cartModel = require("../models/cartModel")
const mongoose = require("mongoose")

const productModel = require("../models/productModel")

const userModel = require("../models/userModel")
const orderModel = require("../models/orderModel")
const paymentModel = require("../models/paymentModel")



const isValid = function (value) {
    if (typeof value == "undefined" || value == null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValidObjectId = function (collegeId) {
    return mongoose.Types.ObjectId.isValid(collegeId)
}



const checkoutOrder = async function (req, res) {
    try {

        userId = req.params.userId // we take only userId from user as a input nd check whether cart exist or not

        if(!isValidObjectId(userId)){
            return res.status(400).send({ status: false, msg: "title is not valid" });
        }

        const checkCartExist  = await cartModel.findOne({userId : userId}).lean()
        if(!checkCartExist){
            return res.status(400).send({status:false, msg:"Please first put item in your cart"})
        }
        // return res.send({data : checkCartExist})

        delete(checkCartExist._id);
        delete(checkCartExist.createdAt);
        delete(checkCartExist.updatedAt);

        // console.log(checkCartExist)

        /// now user will make payments and if payment is successful then order will be placed

        checkCartExist.status="Paid"

        console.log(checkCartExist)

        const createOrderCollection = await  orderModel.create(checkCartExist)  /// saving order details in order Collection



        let paymentHistory = {userId : userId}

        // creating a payment record in payment collection

        if(createOrderCollection.status == "Paid"){
            const createPaymentCollection = await paymentModel.create(paymentHistory)
        }

        // if order is placed then we need to make our cart empty

        const makeCartEmpty = await cartModel.deleteOne({userId : userId})


        // return order reciept to user 
        return res.status(200).send({status : true, msg: "Order Placed", Data : createOrderCollection})

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}




module.exports.checkoutOrder = checkoutOrder
