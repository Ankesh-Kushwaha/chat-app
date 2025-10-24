import express from 'express';
import logger from '../utils/logger.js';
import { signupVerification } from '../utils/zod/zodVerification.js';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendMail } from '../utils/config/sendMail.js';
export const userSignup = async (req, res) => {
    try {
        logger.info("signup endpoint got hit.");
        const { name, email, password } = req.body;
        //validate the data;
        const verify = signupVerification.parse({ name, email, password });
        if (!verify) {
            return res.status(400).json("invalid data");
        }
        //check if user is already exist or not 
        const user = await User.findOne({ email });
        if (user)
            return res.status(400).json("user already exist");
        //hashed the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //create a new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        //generate the token 
        const token = jwt.sign({
            userId: newUser._id,
        }, `${process.env.JWT_SECRET_KEY}`, { expiresIn: '7d' });
        //send email
        await sendMail(email, name);
        if (newUser) {
            return res.status(200).json({
                success: true,
                token,
                message: "user successfully logged in"
            });
        }
    }
    catch (err) {
        if (err instanceof Error) {
            logger.error("error while signup:", err.message);
            res.status(500).json({
                success: false,
                message: "something went wrong",
            });
        }
        else {
            logger.error("error while signup:", String(err));
        }
    }
};
export const userLogin = async (req, res) => {
};
export const deleteProfile = async (req, res) => {
};
export const getUserProfile = async (req, res) => {
};
export const getUserFriends = async (req, res) => {
};
//# sourceMappingURL=userController.js.map