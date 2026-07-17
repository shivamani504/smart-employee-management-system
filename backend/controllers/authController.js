const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerUser = async (req,res)=>{

    try{

        const {name,email,password,role}=req.body;

        const existingUser = await User.findOne({email});

        if(existingUser){

            return res.status(400).json({
                message:"User already exists"
            });

        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = new User({

            name,
            email,
            password:hashedPassword,
            role

        });

        await user.save();
        const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
);

        res.status(201).json({

            message:"User Registered Successfully",token

        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            message:"Server Error"

        });

    }

}
const loginUser = async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid Password"
        });
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.status(200).json({
        message: "Login Successful",
        token,
        role: user.role
    });

};

module.exports = { registerUser, loginUser };