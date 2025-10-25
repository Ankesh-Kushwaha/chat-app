import mongoose from "mongoose";
export declare const FriendRequest: mongoose.Model<{
    status: "pending" | "accepted" | "declined";
    createdAt: NativeDate;
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    status: "pending" | "accepted" | "declined";
    createdAt: NativeDate;
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    status: "pending" | "accepted" | "declined";
    createdAt: NativeDate;
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    status: "pending" | "accepted" | "declined";
    createdAt: NativeDate;
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    status: "pending" | "accepted" | "declined";
    createdAt: NativeDate;
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    status: "pending" | "accepted" | "declined";
    createdAt: NativeDate;
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=friendRequest.d.ts.map