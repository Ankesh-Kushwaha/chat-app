import express, { request } from 'express';
import logger from '../utils/logger.js';
import { loginVerification, signupVerification } from '../utils/zod/zodVerification.js';
import { User } from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendMail } from '../utils/config/sendMail.js';
import { FriendRequest } from '../models/friendRequest.js';
import mongoose from 'mongoose';
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
        const createdUser = newUser.toObject();
        delete createdUser.password;
        //generate the token 
        const token = jwt.sign({
            userId: newUser._id,
        }, `${process.env.JWT_SECRET_KEY}`, { expiresIn: '7d' });
        //send email
        //await sendMail(email, name);
        if (newUser) {
            return res.status(200).json({
                success: true,
                token,
                message: "user successfully logged in",
                createdUser
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
    try {
        const { email, password } = req.body;
        const verify = loginVerification.parse({ email, password });
        if (!verify)
            return res.status(400).json("please provide valid data");
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json("user does not exist");
        //verify the password with the user password
        const passwordVerification = await bcrypt.compare(password, user.password);
        if (!passwordVerification)
            return res.status(400).json("password is invalid");
        //generate  token 
        const createdUser = user.toObject();
        delete createdUser.password;
        const token = jwt.sign({
            userId: user._id,
        }, `${process.env.JWT_SECRET_KEY}`, { expiresIn: '7d' });
        return res.status(200).json({
            success: true,
            message: "user logged in successfully",
            token,
            createdUser
        });
    }
    catch (err) {
        if (err instanceof Error) {
            logger.error("error while login:", err.message);
            res.status(500).json({
                success: false,
                message: "something went wrong",
            });
        }
        else {
            logger.error("error while login:", String(err));
        }
    }
};
export const deleteProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user)
            return res.status(400).json("user does not exist");
        //delete the user 
        const userToDelete = await User.findById(id).select('-password');
        return res.status(200).json({
            success: true,
            message: "profile deleted successfully",
            deleteProfile,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            logger.error("error while deleting profile:", err.message);
            res.status(500).json({
                success: false,
                message: "something went wrong",
            });
        }
        else {
            logger.error("error while deleting profile:", String(err));
        }
    }
};
export const updateProfile = async (req, res) => {
};
export const getUserProfile = async (req, res) => {
    try {
        logger.info("getUserProfile endpoint hit");
        const { userId } = req.params;
        if (!userId)
            return res.status(400).json("userId is required");
        const user = await User.findById(userId).select("-password");
        if (!user)
            return res.status(400).json("user does not exist");
        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            user
        });
    }
    catch (err) {
        if (err instanceof Error) {
            logger.error("Error while getting user profile:", err.message);
            res.status(500).json({ success: false, message: "Something went wrong" });
        }
        else {
            logger.error("Unknown error while getting user profile:", String(err));
            res.status(500).json({ success: false, message: "Unknown error" });
        }
    }
};
export const getUserFriends = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(400).json("userId is required");
        const user = await User.findById(userId)
            .populate({
            path: "friends",
            select: "name email profilePicture", // choose which fields to return
        });
        if (!user)
            return res.status(400).json("user does not exist");
        return res.status(200).json({
            success: true,
            message: "user friends data fetched successfully!",
            friends: user.friends,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            logger.error("getting user friends requests:", err.message);
            res.status(500).json({ success: false, message: "Something went wrong" });
        }
        else {
            logger.error("error while getting pending request:", String(err));
            res.status(500).json({ success: false, message: "Unknown error" });
        }
    }
};
export const getAllUser = async (req, res) => {
    try {
        logger.info("get all user endpoints hit");
        const users = await User.find();
        res.status(200).json({
            success: true,
            message: "all user fetched successfully",
            users,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            logger.error("error while getting all user:", err.message);
            res.status(500).json({ success: false, message: "Something went wrong" });
        }
        else {
            logger.error("error while getting all user:", String(err));
            res.status(500).json({ success: false, message: "Unknown error" });
        }
    }
};
export const sendFriendRequest = async (req, res) => {
    try {
        logger.info(" send friend request endpoint hit");
        const { senderId, receiverId } = req.body;
        //check if the both id same 
        if (senderId === receiverId)
            return res.status(400).json("can't add yourself");
        //find the user
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        if (!receiver)
            return res.status(400).json("receiver does not exist");
        //check if user is already friend
        if (sender?.friends.includes(receiverId))
            return res.status(400).json("user is already friends");
        //check if there is any pending request exist
        const pendingRequest = await FriendRequest.findOne({
            sender: senderId,
            receiver: receiverId,
            status: 'pending',
        });
        if (pendingRequest)
            return res.status(400).json("friend request already exist");
        //create a friends request
        const newRequest = await FriendRequest.create({ sender: senderId, receiver: receiverId, status: "pending" });
        return res.status(200).json({
            success: true,
            message: "friend request successfully created",
            newRequest,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            logger.error("error while sending friend Request:", err.message);
            res.status(500).json({
                success: false,
                message: "something went wrong",
            });
        }
        else {
            logger.error("error while sending friend Request:", String(err));
        }
    }
};
export const acceptFriendRequest = async (req, res) => {
    try {
        logger.info("accept friend request hit.");
        const { requestId } = req.body;
        // Populate both sender and receiver
        const pendingRequest = await FriendRequest.findById(requestId)
            .populate("sender")
            .populate("receiver");
        if (!pendingRequest || pendingRequest.status !== "pending") {
            return res.status(400).json({ success: false, message: "Request expired or invalid." });
        }
        // Mark as accepted
        pendingRequest.status = "accepted";
        await pendingRequest.save();
        // Explicitly cast sender & receiver to IUser
        const sender = pendingRequest.sender;
        const receiver = pendingRequest.receiver;
        if (!sender || !receiver) {
            return res.status(400).json({ success: false, message: "Invalid sender or receiver." });
        }
        sender.friends.push(receiver._id);
        receiver.friends.push(sender._id);
        await sender.save();
        await receiver.save();
        res.status(200).json({
            success: true,
            message: "Friend request accepted successfully",
        });
    }
    catch (err) {
        if (err instanceof Error) {
            logger.error("Error while accepting friend request:", err.message);
            res.status(500).json({ success: false, message: "Something went wrong" });
        }
        else {
            logger.error("Error while accepting friend request:", String(err));
            res.status(500).json({ success: false, message: "Unknown error" });
        }
    }
};
export const getAllPendingRequest = async (req, res) => {
    try {
        logger.info("getAllPendingRequest endpoint hit.");
        const userId = req.userId;
        const pending = await FriendRequest.find({ receiver: userId, status: "pending" })
            .populate("sender", "name email");
        const sentRequest = await FriendRequest.find({ sender: userId, status: "pending" }).populate("sender", "name email");
        return res.status(200).json({
            success: true,
            sentRequest,
            pending
        });
    }
    catch (err) {
        if (err instanceof Error) {
            logger.error("getting pending requests:", err.message);
            res.status(500).json({ success: false, message: "Something went wrong" });
        }
        else {
            logger.error("error while getting pending request:", String(err));
            res.status(500).json({ success: false, message: "Unknown error" });
        }
    }
};
export const declineArequest = async (req, res) => {
    try {
        logger.info("decline a request endpoint hit");
        const requestId = req.body;
        if (!requestId)
            return res.status(400).json("requestId is required");
        const request = await FriendRequest.findById(requestId);
        if (!request || request.status !== "pending")
            return res.status(200).json("request got expired");
        request.status = "declined";
        await request.save();
        return res.status(200).json("request declined successfully");
    }
    catch (err) {
        if (err instanceof Error) {
            logger.error("error while decline friend request:", err.message);
            res.status(500).json({ success: false, message: "Something went wrong" });
        }
        else {
            logger.error("error while decline friend request:", String(err));
            res.status(500).json({ success: false, message: "Unknown error" });
        }
    }
};
//# sourceMappingURL=userController.js.map