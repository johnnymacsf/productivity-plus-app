import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE} from '../config/emailTemplates.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.json({success: false, message: "Missing user details!"});
    }
    try {
        const existingUser = await userModel.findOne({email});
        if(existingUser) {
            return res.json({success: false, message: "Account already exists with this email!"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({name, email, password: hashedPassword});
        await user.save();
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        //sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to DailyBest Productivity!",
            text: `Welcome to DailyBest Productivity! Your account has been created with email id: ${email}, we hope to help you have a productive day, every day!`
        }

        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: "User successfully registered!"});
    }catch(error) {
        res.json({success: false, message: error.message});
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.json({success: false, message: "Email and password are required for login!"});
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: "Account with this email does not exist!"});
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.json({success: false, message: "Invalid password, please try again."});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({success: true, message:"User successfully logged in!"});
    }catch(error){
        return res.json({success: false, message: error.message});
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.json({success: true, message: "Successfully logged out!"});
    }catch(error){
        return res.json({success: false, message: error.message});
    }
}

//Send verification otp to user email
export const sendVerifyOtp = async (req, res) => {
    try {
        //const { userId } = req.body;

        const user = await userModel.findById(req.user.id);
        
        if(user.isAccountVerified) {
            return res.json({success:false, message: "Account is already verified!"});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt =  Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            //text: `Your OTP is ${otp}. Verify your account using this OTP.`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }
        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: "Verification OTP sent to email"});
    }catch(error) {
        res.json({success: false, message: error.message})
    }
}

//verify the email using otp
export const verifyEmail = async (req, res) => {
    const { otp} = req.body;
    const user = await userModel.findById(req.user.id);
    
    if(!user || !otp) {
        return res.json({success: false, message: "Missing verify email details!"});
    }

    try {
        if(!user) {
            return res.json({success: false, message: "User not found!"});
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({success: false, message: 'Invalid OTP'});
        }

        if(user.verifyOtpExpireAt < Date.now()) {
            return res.json({success: false, message: 'OTP expired!'});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({success: true, message: 'Account verified!'});
    }catch(error){
        return res.json({success: false, message: error.message});
    }
}

//check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({success:true});
    }catch(error){
        return res.json({success: false, message: error.message});
    }
}

//send password reset otp
export const sendResetOtp = async (req, res) => {
    const {email} = req.body;
    if(!email) {
        return res.json({success: false, message: "Email not provided, please provide an email"});
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: "Account with that email not found"});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt =  Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            //text: `Your OTP is ${otp}. Reset your password using this OTP.`,
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }
        await transporter.sendMail(mailOptions);

        return res.json({success: true, message: "OTP sent to your email for password reset."});
    }catch(error){
        return res.json({success: false, message: error.message});
    }
}

//reset user password
export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;
    if(!email || !otp || !newPassword) {
        return res.json({success: false, message: "Email, OTP, and new password are all required."});
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: "User not found with that email."});
        }

        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({success: false, message: "Invalid OTP!"});
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP expired!"});
        }

        //first encrypt new password and update user password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();

        return res.json({success: true, message: "Password has been successfully reset!"});
    }catch(error){
        return res.json({success: false, message: error.message});
    }
}