const User = require("../models/userModel");

const verifyEmail = async (req, res) =>{
    try{
        const {token} = req.query;

        if(!token){
            return res.status(400).json({
                 success: false,
                message: "invalid or missing token"
            });
        }

        const user = await User.findOne({where:{verificationToken: token}});

        if(!user){
            return res.status(400).json({
                success: false,
                message: "token didn't match"
            });
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpires = null;

       await user.save();

        return res.status(200).json({
            success: true,
            message: "email verified successfully"
        });

    }catch(error){
        return res.status(500).json({
               success: false,
            message: "server error",
            error: error.message
        });
    }

}

module.exports = verifyEmail;