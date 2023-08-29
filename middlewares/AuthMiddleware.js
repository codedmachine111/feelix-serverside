const {verify} = require('jsonwebtoken')

const validateToken = (req,res,next) =>{

    // The signed accessToken
    const accessToken = req.header("accessToken");

    if(!accessToken){
        return res.json("User not logged in!")
    }

    try{
        const validToken = verify(accessToken, "important")
        req.user = validToken;
        if(validToken){
            return next();
        }

    }catch(err){
        return res.json({message : err})
    }
}

module.exports = {validateToken}