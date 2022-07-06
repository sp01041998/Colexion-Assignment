
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

const userModel = require("../models/userModel");

const bcrypt = require("bcrypt");






const isValid = function (value) {
    if (typeof value == "undefined" || value == null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValidObjectId = function (collegeId) {
    return mongoose.Types.ObjectId.isValid(collegeId)
}






/// user SignUp API

const userSignUp = async function (req, res) {
    try {

        let userData = req.body  // extracting user info 

        if (Object.keys(userData).length == 0) {
            return res.status(400).send({ status: false, msg: "User information is missing" })
        }

        let userInfo = {}

        let { fname, lname, email, phone, password} = userData

       



        // userName validation

        if (!isValid(fname)) {
            return res.status(400).send({ status: false, msg: "first name is not valid" })
        }

        userInfo.fname = fname


        if (!isValid(lname)) {
            return res.status(400).send({ status: false, msg: "last name is not valid" })
        }

        userInfo.lname = lname

        //email validtion -------------------------------------------------------  

        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "email is not valid" })
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, msg: "Email should be valid email address" })
        }

        const isEmailalredyUsed = await userModel.findOne({ email })   //{email :email} userInfoect shorthand property
        if (isEmailalredyUsed) {
            return res.status(400).send({ status: false, msg: "email already in use" })
        }

        userInfo.email = email


        // phone number validaation ------------------------------------------------


        if (!isValid(phone)) {
            return res.status(400).send({ status: false, msg: "phone is not valid/phone is missing" })
        }

        if (phone.toString().length != 10) {
            return res.status(400).send({ status: false, msg: "phone length needs to be of 10 digit" })
        }

        if (!/^[6-9]{1}[0-9]{9}$/.test(phone)) {
            return res.status(400).send({ status: false, msg: "phone should be valid phone number" })
        }

        let isphonealreadyused = await userModel.findOne({ phone })
        if (isphonealreadyused) {
            return res.status(400).send({ status: false, msg: "phone number is already in use" })
        }

        userInfo.phone = phone


        //password validation  and encryption----------------------------------------------------

        if (!isValid(password)) {
            return res.status(400).send({ status: false, msg: "password is not valid/password is missing" })
        }

        if (password.length < 8) {
            return res.status(400).send({ status: false, msg: "passowrd minimum length should be 8" })
        }

        const securePassword = await bcrypt.hash(password, 10);

        userInfo.password = securePassword


       // saving users details in database

        let userCreated = await userModel.create(userInfo)

        userCreated = userCreated.toObject()


        //removes the password 
        delete (userCreated.password)

        return res.status(201).send({ status: true, msg: "user Created successfully", data: userCreated})

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}



/********************************************************************************************************************** */

/// userLogin API

const userLogin = async function (req, res) {
    try {
        let userData = req.body  // extracting user information

        if (Object.keys(userData).length == 0) {
            return res.status(400).send({ status: false, msg: "user information is missing" })
        }
        const { email, password } =userData


        // Email validation

        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "email id is not valid" })
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, msg: "Email should be valid email address" })
        }

        /// Password validation

        if (!isValid(password)) {
            return res.status(400).send({ status: false, msg: "password is missing" })
        }

        if (password.length < 8) {
            return res.status(400).send({ status: false, msg: "password length should be greater than 8" })
        }

        /// check wheather user's email exist in our system or not

        const checkEmailExist = await userModel.findOne({ email })
        if (!checkEmailExist) {
            return res.status(401).send({ status: false, msg: "Please provide valid email id" })
        }


        /// Password decodind and mathcing with in our system

        let encodedPassword = checkEmailExist.password

        const checkPassWord = await bcrypt.compare(password, encodedPassword)
        
        if (!checkPassWord) {
            return res.status(401).send({ status: false, msg: "password is not correct" })
        }

        // Generating JWT TOken for further session of user(used user's default MongoDB object id to generate token)
        let token = jwt.sign(
            { userId: checkEmailExist._id },
            "Ronaldo-007",
            { expiresIn: "1d" }
        )

        res.setHeader("x-api-token", token)
        res.status(200).send({ status: true, msg: "User login successful", data: { userId: checkEmailExist._id, token: token } })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


/************************************************************** */


// A user can access his own profile

const getUserData = async function (req, res) {
    try {

        const userId = req.params.userId  // extracting user's id from path params

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "user id is not in valid format" })
        }

        const userData = await userModel.findById({ _id: userId })
        if (!userId) {
            return res.status(404).send({ status: true, msg: "no user found with this id" })
        }

        return res.status(200).send({ status: false, msg: "User profile details", data: userData })



    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}




const updateUserProfile = async function (req, res) {
    try {

        const userId = req.params.userId  /// userid to find the document 
        const userData = req.body   /// user's data (he want to update )
        
        if (Object.keys(userData).length === 0) {
            return res.status(200).send({ status: true, msg: "Nothing to update" })
        }


        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "user Id is not Valid" })
        }
        

        // checking wheather a profile exist for this user or not
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).send({ status: true, msg: "user not found" })
        }




        let { fname, lname, email, phone, password} = userData

  
         
        /// user name validation
        if (fname) {
            if (!isValid(fname)) {
                return res.status(400).send({ status: false, msg: " first Nme is not valid" })
            }

            user.fname = fname


        }

        if (lname) {
            if (!isValid(lname)) {
                return res.status(400).send({ status: false, msg: " last Name is not valid" })
            }
            user.lname = lname
        }


        // email validation

        if (email) {

            if (!isValid(email)) {
                return res.status(400).send({ status: false, msg: "first name is not valid" })
            }

            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                return res.status(400).send({ status: false, msg: "Email should be valid email address" })
            }

            const isEmailalredyUsed = await userModel.findOne({ email: email, _id: { $ne: userId } })
            if (isEmailalredyUsed) {
                return res.status(400).send({ status: false, msg: `${email} email already in use` })

            }

            user.email = email

        }


        // phone validation
        if (phone) {
            if (!/^[6-9]{1}[0-9]{9}$/.test(phone)) {
                return res.status(400).send({ status: false, msg: "phone should be valid phone number" })
            }

            let isphonealreadyused = await userModel.findOne({ phone: phone, _id: { $ne: userId } })
            if (isphonealreadyused) {
                return res.status(400).send({ status: false, msg: `${phone} phone number is already in use` })
            }

            user.phone = phone

        }
        
        // password validation
        if (password) {
            if (!isValid(password)) {
                return res.status(400).send({ status: false, msg: "password is not valid/password is missing" })
            }

            if (password.length < 8 || password.length > 15) {
                return res.status(400).send({ status: false, msg: "passowrd min length is 8 and max len is 15" })
            }

            const securePassword = await bcrypt.hash(password, 10);
            user.password = securePassword

        }

        // saving updated user info in our Database
        let updatedUser = await user.save()

        //converting mongoose object to js object literals
        updatedUser = updatedUser.toObject()


        delete (updatedUser.password)

        return res.status(200).send({ status: true, msg: "User profile Updated", data: updatedUser })

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports.userSignUp = userSignUp
module.exports.userLogin = userLogin
module.exports.getUserData = getUserData
module.exports.updateUserProfile = updateUserProfile