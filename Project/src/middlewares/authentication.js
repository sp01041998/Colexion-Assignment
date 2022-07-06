const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const isValid = function (value) {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValidObjectId = function (collegeId) {
    return mongoose.Types.ObjectId.isValid(collegeId)
}


/// authenticate user's identity
const authentication = async function (req, res, next) {
    try {
        let token = req.headers['authorization']
        if(!token){
            return res.status(403).send({status:false, msg:"Missing authentication token in req headers"})
        }
        token = token.split(" ")

        if (token.length !== 2 || token[0] !== "Bearer"  ||   !token[1]) {
            return res.status(403).send({ status: false, msg: "Invalid token format" })
        }

        let decodeToken = jwt.verify(token[1], "Ronaldo-007")     // decoding token to check whether token is tampered or not
        
        let exp = decodeToken.exp
       
        if (exp < Date.now().valueOf / 1000) {
            return res.status(401).send({ error: "JWT token has expired, please login to obtain a new one" });
        }
        
        req.decodeToken = decodeToken
        next()

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.messge })
    }
}



/// authorise user to limit his access(used to make api's restriced)
const authorise = async function (req, res, next) {
    try {

        userId = req.params.userId

        if (!isValid(userId)) {
            return res.status(400).send({ status: false, msg: "userid in path parms is not valid" })
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "userid in path params is not a valid object id" })
        }

        
        // mathching userId from token and userId from path Parameter
        if (userId !== req.decodeToken.userId) {
            return res.status(403).send({ status: false, msg: "you are trying to access someOne else profile" })

        }
        next()


    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}







module.exports.authentication = authentication
module.exports.authorise = authorise
