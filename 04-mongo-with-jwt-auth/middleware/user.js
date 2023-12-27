const jwt = require("jsonwebtoken")
const jwtPass = "vicky"
async function userMiddleware(req, res, next) {
    const token = req.headers.authorization;
    const bearerToken = token.split(' ')[1];
    try{
    const verified = await jwt.verify(bearerToken,jwtPass)
    if(verified){
        next();
    }else{
        res.status(403).json({
            error: "User is not authenticated"
        })
    }
    }catch(err){
        console.log("error: ",err)
        res.status(403).json({
            error: "User is not authenticated"
        })
    }
    
       
}

module.exports = userMiddleware;