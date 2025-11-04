import mongoose from "mongoose";
declare const Room: mongoose.Model<{
    roomId: string;
    messages: mongoose.Types.DocumentArray<{
        message: string;
        senderId: string;
        userName: string;
        time: NativeDate;
        avatar?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        message: string;
        senderId: string;
        userName: string;
        time: NativeDate;
        avatar?: string | null;
    }> & {
        message: string;
        senderId: string;
        userName: string;
        time: NativeDate;
        avatar?: string | null;
    }>;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    roomId: string;
    messages: mongoose.Types.DocumentArray<{
        message: string;
        senderId: string;
        userName: string;
        time: NativeDate;
        avatar?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        message: string;
        senderId: string;
        userName: string;
        time: NativeDate;
        avatar?: string | null;
    }> & {
        message: string;
        senderId: string;
        userName: string;
        time: NativeDate;
        avatar?: string | null;
    }>;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
    collection: string;
}> & {
    roomId: string;
    messages: mongoose.Types.DocumentArray<{
        message: string;
        senderId: string;
        userName: string;
        time: NativeDate;
        avatar?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        message: string;
        senderId: string;
        userName: string;
        time: NativeDate;
        avatar?: string | null;
    }> & {
        message: string;
        senderId: string;
        userName: string;
        time: NativeDate;
        avatar?: string | null;
    }>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    collection: string;
}, {
    roomId: string;
    messages: mongoose.Types.DocumentArray<{
        message: string;
        senderId: string;
        userName: string;
        time: NativeDate;
        avatar?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        message: string;
        senderId: string;
        userName: string;
        time: NativeDate;
        avatar?: string | null;
    }> & {
        message: string;
        senderId: string;
        userName: string;
        time: NativeDate;
        avatar?: string | null;
    }>;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    roomId: string;
    messages: mongoose.Types.DocumentArray<{
        message: string;
        senderId: string;
        userName: string;
        time: NativeDate;
        avatar?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        message: string;
        senderId: string;
        userName: string;
        time: NativeDate;
        avatar?: string | null;
    }> & {
        message: string;
        senderId: string;
        userName: string;
        time: NativeDate;
        avatar?: string | null;
    }>;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
    collection: string;
}>> & mongoose.FlatRecord<{
    roomId: string;
    messages: mongoose.Types.DocumentArray<{
        message: string;
        senderId: string;
        userName: string;
        time: NativeDate;
        avatar?: string | null;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        message: string;
        senderId: string;
        userName: string;
        time: NativeDate;
        avatar?: string | null;
    }> & {
        message: string;
        senderId: string;
        userName: string;
        time: NativeDate;
        avatar?: string | null;
    }>;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Room;
//# sourceMappingURL=ChatMessageSchema.d.ts.map