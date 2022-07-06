const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController")
const middleware = require("../middlewares/authentication")
const productController = require("../controllers/productController")
const cartController = require("../controllers/cartController")
const orderController = require("../controllers/orderController")



// user's APis
router.post("/userSignUp", userController.userSignUp )

router.post("/login", userController.userLogin)

router.get("/user/:userId/profile", middleware.authentication, userController.getUserData)

router.put("/user/:userId/profile", middleware.authentication, middleware.authorise, userController.updateUserProfile)


//Product APi's

router.post("/products", productController.productProfile )


//cart API's

router.post("/users/:userId/cart", middleware.authentication, middleware.authorise,  cartController.createCart)

// order/payment API's

router.post("/users/:userId/order", middleware.authentication, middleware.authorise, orderController.checkoutOrder)




module.exports=router;