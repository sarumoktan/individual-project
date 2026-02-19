const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const jwt = require('jsonwebtoken')

const registerUser = async(req, res) =>{

    try{
         
    const{email, password, role, username} = req.body;  
    if(!email || !password || !role){
        return res.status(400).json({
            message: "please fill all the fields"
        })
    }

    const user = await User.findOne({where:{email: email}});

    if(user){
        return res.status(400).json({
            message:`${email} already exists`
        });
    }

    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create verificationToken
    const verificationToken = crypto.randomBytes(32).toString("hex");

    //set expiry date for 1 hour
    const verificationTokenExpires = new Date(Date.now()+ 1 * 60 * 60 * 1000);



    const createUser = await User.create({
        email,
        username,
        password : hashedPassword,
        role,
        verificationToken,
        verificationTokenExpires
    });
            
    const verificationLink = `http://localhost:3000/api/verify-email?token=${verificationToken}`

    console.log("reached before sendEmail")

    await sendEmail(
        email, 
        "verify your email", 
        `
            <p>verify your email by clicking thee button below</p>
            <a href="${verificationLink}">click here to verify</a>
        `
    )
    console.log("reached after sendEmail")

    return res.status(200).json({
        success : true,
        message: "user registered woah", 
    });

}catch(error){
    return res.status(400).json({
      
        message:"something went wrong",
        error: error.message
    })
}
}





//login

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({success: false,  message: "email and password are required" });

    //Find the user in the database
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "user not found" });

    if (!user.isVerified)
      return res.status(401).json({success: false , message: "please verify your email " });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(401).json({success: false , message: "invalid email or password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.jwt_secret,
      { expiresIn: "2d" }
    );

    return res.status(200).json({  success: true, message: "login successful", token });
  } catch (error) {
    return res.status(500).json({ message: "login failed", error: error.message });
  }
};

const getActiveUsers = async (req, res) => {
    res.json({
        msg: "this is the get active users request"
    });
};
 


const getAllUser = async (req, res) => {
    try {
        const users = await User.findAll({ exclude: ["pa"] });
        return res.json({ success: true, users, message: "Users fetched successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching users",
            error: error.message
        })

    }
};
const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const users = await User.findByPk(id)
        return res.json({
            users: { email: users.email, username: users.username },
            success:true,
            message: "Users fetched successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            msg: "Error fetching users",
            error: error.message
        });
    }
};

const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success:false,
                message: "User not found",
            });
        }

        const isexistingemail = await User.findOne({ where: { email } })
        if (isexistingemail && isexistingemail.email !== email.id) {
            return res.status(400).json({ message: "User with this email already exists!!" })
        }


        const isexistingusername = await User.findOne({ where: { username } })
        if (isexistingusername && isexistingusername.id !== user.id) {
            return res.status(400).json({ message: "User with this name already exists!!" })
        }

        let hashedPassword = user.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        await user.update({
            username: username || user.username,
            email: email || user.email,
            password: hashedPassword,
        });
        return res.status(200).json({
            success:true,
            message: "User updated successfully",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "Error updating user",
            error: error.message,
        });
    }
};

const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success:false,
                message: "User not found",
            });
        }
        await user.destroy();
        return res.status(200).json({
            success:true,
            message: "User deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "Error deleting user",
            error: error.message,
        });
    }
};


const getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      
      },
      message: "User fetched successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
    
  }
  
};


module.exports = {
    registerUser,
    getAllUser,
    getActiveUsers, 
    getUserById, 
    updateUserById, 
    deleteUserById, 
    loginUser,
     getMe,
};


