const cartModel = require("../models/cartModel")
const mongoose = require("mongoose")

const productModel = require("../models/productModel")
const userModel = require("../models/userModel")





const isValid = function (value) {
    if (typeof value == "undefined" || value == null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValidObjectId = function (productId) {
    return mongoose.Types.ObjectId.isValid(productId)
}


const createCart = async function (req, res) {
    try {

        const userId = req.params.userId // take user id in path Params and extract them
        let data = req.body // extraxt product the user want to add in cart
        let {productId} = data
        


        // check id in params is valid or not
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "user Id in params is not in valid format" })
        }
        

        // check whether user exist or not
        const checkIfUserExist = await userModel.findById(userId)
        if(!checkIfUserExist){
            return res.status(400).send({status:false, msg:"User does not exist in our sysytem"})
        }


        //check cart exist or not
        const usersCartAlreadyExist = await cartModel.findOne({ userId: userId })

        // if cart exist
        if (usersCartAlreadyExist) {

           
            if (!isValid(productId)) {
                return res.status(400).send({ status: false, msg: "product is not valid" })
            }
            if (!isValidObjectId(productId)) {
                return res.status(400).send({ status: false, msg: "product is not a valid object id" })
            }

            var price = await productModel.findOne({ _id: productId})
            if (!price) {
                return res.status(400).send({ status: false, msg: "this product does not exist in our system right now" })
            }
            
            // if product is already added in the cart
            for (let i = 0; i < usersCartAlreadyExist.items.length; i++) {
                if (productId == usersCartAlreadyExist.items[i].productId) {
                    return res.status(400).send({status:false, msg : "You have already added this course in your cart"})

                }
            }
            
            /// add product in the cart
            const updatePrice = await cartModel.findOneAndUpdate(
                { userId: userId },
                {
                    $inc: { totalPrice: price.price, totalItems: 1 },

                    $push: { items: { productId: productId , price : price.price} }
                },

                { new: true }


            )
            return res.status(200).send({ status: true, msg: "cart updated", data: updatePrice })

        } else {

            let obj = {} // used temporary object to store cart details

            //  This is the case where the cart does not exist

            obj.userId = userId


            //items validation

           
            if (!isValid(productId)) {
                return res.status(400).send({ status: false, msg: "product is not valid" })
            }

            if (!isValidObjectId(productId)) {
                return res.status(400).send({ status: false, msg: "user Id is not Valid" })
            }


            var price = await productModel.findOne({ _id: productId})
            if (!price) {
                return res.status(400).send({ status: false, msg: "This course does not exist in our system currently" })
            }

            obj.items = []

            obj.items.push({ productId: productId , price : price.price })

            obj.totalPrice = Number(price.price)

            obj.totalItems = 1


            const cartData = await cartModel.create(obj)

            return res.status(200).send({ status: true, msg: "cart Created", data: cartData })


        }
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}




module.exports.createCart = createCart

