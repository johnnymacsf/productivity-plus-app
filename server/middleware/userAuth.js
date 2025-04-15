import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;

    if(!token) {
        return res.json({success: false, message: 'Not authorized! Please login.'});
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecode.id){
            req.user = {id: tokenDecode.id};
        }else{
            return res.json({success: false, message: "Not authorized! Please login."});
        }

        next();
    }catch(error){
        console.error('Token decode error:', error)
        return res.json({success: false, message: error.message});
    }
}

export default userAuth;