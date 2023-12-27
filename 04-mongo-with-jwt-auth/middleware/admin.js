const jwt = require("jsonwebtoken")
const jwtPass = "vicky"
// Middleware for handling auth
async function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const token = req.headers.authorization;
    const bearerToken = token.split(' ')[1];
    try{
    const verified = await jwt.verify(bearerToken,jwtPass)
    if(verified){
        next();
    }else{
        res.status(403).json({
            error: "Admin is not authenticated"
        })
    }
    }catch(err){
        res.status(403).json({
            error: "Admin is not authenticated"
        })
    }
    
    
}

module.exports = adminMiddleware;