import type { Response ,Request} from "express";
import Room from "./ChatMessageSchema.js";

export const getRoomMessageHistory = async (req:Request, res:Response) => {
  try {
   const roomId = req.params.roomId; 
    //search the room 
    const room = await Room.findOne({roomId});
    if (!room) {
       return res.json("no room find with the id");
    }

    return res.status(200).json({
      success: true,
      message: room?.messages
    });

  }
  catch (err :any) {
    console.log("error while getting chat messages", err?.message);
    res.status(500).json({
      success: false,
      message:"something went wrong"
     })
  }
}