import { communityCreationVerification } from "../utils/zod/zodVerification.js";
import Community from "../models/community.js";
import logger from "../utils/logger.js";
import { Types } from "mongoose";
export const createCommunity = async (req, res) => {
    try {
        logger.info("create community end point hit....");
        const { name, description } = req.body;
        const verify = communityCreationVerification.parse({ name, description });
        if (!verify)
            return res.status(400).json("zod verification failed");
        //find the existing community with the same name 
        const existingCommunity = await Community.findOne({ name });
        if (existingCommunity)
            return res.status(200).json("community with the name alreday exist");
        //create a new community
        const community = await Community.create({
            name, description
        });
        res.status(200).json({
            success: true,
            message: "community created successfully",
            community,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            logger.error("error while creating community", err.message);
            res.status(500).json({
                success: false,
                message: "something went wrong",
            });
        }
        else {
            logger.error("error while creating community:", String(err));
        }
    }
};
export const DeleteCommunity = async (req, res) => {
    try {
        logger.info("delete community endpoint hit...");
        const { communityId } = req.params;
        if (!communityId)
            return res.status(400).json("community id is required");
        const community = await Community.findById(communityId);
        if (!community)
            return res.status(400).json("community does not exist");
        return res.status(200).json({
            success: true,
            message: "community deleted successfully",
            community
        });
    }
    catch (err) {
        if (err instanceof Error) {
            logger.error("error while deleting community", err.message);
            res.status(500).json({
                success: false,
                message: "something went wrong",
            });
        }
        else {
            logger.error("error while deleting community:", String(err));
        }
    }
};
export const GetALLCommunity = async (req, res) => {
    try {
        const communities = await Community.find();
        return res.status(200).json({
            success: true,
            communities,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            logger.error("error while getting all community", err.message);
            res.status(500).json({
                success: false,
                message: "something went wrong",
            });
        }
        else {
            logger.error("error while getting all community:", String(err));
        }
    }
};
export const GetSingleCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        if (!communityId)
            return res.status(200).json("communityId is required");
        const community = await Community.findById(communityId).populate("members", "-password");
        if (!community)
            return res.status(400).json("no community exist");
        return res.status(200).json({
            success: true,
            community,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            logger.error("error while getting single community", err.message);
            res.status(500).json({
                success: false,
                message: "something went wrong",
            });
        }
        else {
            logger.error("error while getting single community:", String(err));
        }
    }
};
export const LeaveCommunity = async (req, res) => {
    try {
        logger.info("leave community endpoint hit.");
        const { communityId } = req.body;
        const userId = req.userId;
        if (!communityId || !userId)
            return res.status(400).json("community or user id is missing");
        const community = await Community.findById(communityId);
        if (!community)
            return res.status(400).json("community does not exist");
        if (!community.members.includes(new Types.ObjectId(userId)))
            return res.status(400).json("you are not member of this community");
        //remove the particular member from the community;
        community.members = community.members.filter((memberId) => !memberId.equals(new Types.ObjectId(userId)));
        await community.save();
        res.status(200).json({
            success: true,
            message: "you leave the community",
            community,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            logger.error("error while leaving the community:", err.message);
            res.status(500).json({
                success: false,
                message: "something went wrong",
            });
        }
        else {
            logger.error("error while leaving the community:", String(err));
        }
    }
};
export const JoinACommunity = async (req, res) => {
    try {
        logger.info("join community endpoint hit.");
        const { communityId } = req.body;
        const userId = req.userId;
        if (!communityId || !userId)
            return res.status(400).json("community or user id is missing");
        const community = await Community.findById(communityId);
        if (!community)
            return res.status(400).json("community does not exist");
        if (community.members.includes(new Types.ObjectId(userId)))
            return res.status(400).json("already member");
        community.members.push(new Types.ObjectId(userId));
        await community.save();
        res.status(200).json({
            success: true,
            message: "joined the community successfully",
            community,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            logger.error("join community endpoints error", err.message);
            res.status(500).json({
                success: false,
                message: "something went wrong",
            });
        }
        else {
            logger.error("join community endpoint error:", String(err));
        }
    }
};
export const GetALLCommunityUser = async (req, res) => {
    try {
        logger.info("get community users endpoint hit.");
        const { communityId } = req.body;
        if (!communityId)
            return res.status(400).json("community id required");
        const community = await Community.findById(communityId).populate("members", "-password");
        if (!community)
            return res.status(400).json("community does not exist");
        return res.status(200).json({
            success: true,
            members: community.members,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            logger.error("error while getting community users:", err.message);
            res.status(500).json({
                success: false,
                message: "something went wrong",
            });
        }
        else {
            logger.error("error while getting community users:", String(err));
        }
    }
};
//# sourceMappingURL=community.js.map