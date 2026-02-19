const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const sendEmail = require('../utils/sendEmail');

const addUser = async(req,res)=>{
   try{
    const {username,email,password}=req.body;
    if(!username || !email || !password){
        return res.status(400).json({
            success: false,
            message:"All fields are required"
    });
   }
   const isUser = await User.findOne({ username: username });
if (isUser) {
    return res.status(400).json({
        success: false,
        message: "User with this username already exists"
    });
}

const isEmail = await User.findOne({ email: email });
if (isEmail) {
    return res.status(400).json({
        success: false,
        message: "User with this email already exists"
    });
}

    //hashed password
   const hassed= await bcrypt.hash(password,10);

   //generate verification token
   const verificationToken = crypto.randomBytes(32).toString("hex");

   //generate verificationTOkenExpiresd
   const verificationTokenExpired = new Date(Date.now() + 1 * 60 * 60 * 1000); 

const newUser = await User.create({
    username,
    email,
    password:hassed,
    verificationToken,
    verificationTokenExpired
});

res.status(201).json({
    message:"User added successfully",email
});

const verifyLink = `http://localhost:3000/api/verify-email?token=${verificationToken}`;

await sendEmail(
    email,
    "verify your email",
    `<h1>Hi ${username}, welcome to Verdura!</h1>
    <p>Thank you for registering with us. We're excited to have you on board.</p>
    <a ahref=${verifyLink}>verify Yourself</a>`
)
    }catch(error){
        res.status(500).json({
            success: false,
            message:"Error adding user",
            error:error.message
        });
    }
};

const getActiveUsers = async (req, res) => {
  res.json({
     success: true,
    msg: "this is the get active users request"
  });
};
 
const getAllUsers= async(req,res)=>{
    try{
        const users= await User.findAll({exclude:["pa"]});

        return res.json({users,
        success: true,  
        message:"Users fetched successfully"});
    }catch(error){
        res.status(500).json({
            success: false,
            message:"Error fetching users",
            error:error.message
        })
        
    }
}; 


const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const users = await User.findByPk(id)
    return res.json({users:{id: users.id, name: users.username},
        success: true,
        message:"Users fetched successfully"});

  } catch (error) {
   return res.status(500).json({
     success: false,
      msg: "Error fetching users",
      error: error.message
    });
  }
};



const updateUser = async (req, res) => {
    try {
        const {id} = req.params;
        const {username, email, password} = req.body;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
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
            success: true,
            message: "User updated successfully",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: true,
            message: "Error updating user",
            error: error.message,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        await user.destroy();
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: error.message,
        });
    }
};


//lOGIN

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isvalidUser = await bcrypt.compare(password, user.password);
        if (!isvalidUser) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
        const token = jwt.sign(
            { id: user.id, role: user.role, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        return res.status(200).json({ success: true, message: "user logged in successfully", token })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}


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
  addUser,
  getAllUsers,
  getActiveUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  getMe,
};
 
  