import mongoose from "mongoose";
const messageSubSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        trim: true,
    },
    senderId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: false,
    },
    time: {
        type: Date,
        default: Date.now,
    },
}, { _id: false } // no separate _id for subdocuments
);
const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    messages: {
        type: [messageSubSchema],
        default: [],
    },
}, {
    timestamps: true,
    collection: "rooms",
});
export default mongoose.model("Room", roomSchema);
//# sourceMappingURL=ChatMessageSchema.js.map