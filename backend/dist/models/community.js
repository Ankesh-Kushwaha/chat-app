import mongoose from 'mongoose';
const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: {
        type: Date,
        default: Date.now(),
    }
}, { timestamps: true });
const Community = mongoose.model("Community", communitySchema);
export default Community;
//# sourceMappingURL=community.js.map