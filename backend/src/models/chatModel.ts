import mongoose from 'mongoose';


const messageSchema = new mongoose.Schema({
  sender: {
    type: String, 
    enum: ["user", "bot"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  image: {
    type: [String],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true, 
  }
);

chatHistorySchema.index({ userId: 1, date: 1 }, { unique: true });

const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);

export default ChatHistory;
