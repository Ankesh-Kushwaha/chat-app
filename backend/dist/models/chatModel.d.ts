import mongoose from 'mongoose';
declare const ChatHistory: mongoose.Model<{
    date: string;
    userId: mongoose.Types.ObjectId;
    messages: mongoose.Types.DocumentArray<{
        message: string;
        timestamp: NativeDate;
        sender: "user" | "bot";
        image: string[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        message: string;
        timestamp: NativeDate;
        sender: "user" | "bot";
        image: string[];
    }> & {
        message: string;
        timestamp: NativeDate;
        sender: "user" | "bot";
        image: string[];
    }>;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    date: string;
    userId: mongoose.Types.ObjectId;
    messages: mongoose.Types.DocumentArray<{
        message: string;
        timestamp: NativeDate;
        sender: "user" | "bot";
        image: string[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        message: string;
        timestamp: NativeDate;
        sender: "user" | "bot";
        image: string[];
    }> & {
        message: string;
        timestamp: NativeDate;
        sender: "user" | "bot";
        image: string[];
    }>;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    date: string;
    userId: mongoose.Types.ObjectId;
    messages: mongoose.Types.DocumentArray<{
        message: string;
        timestamp: NativeDate;
        sender: "user" | "bot";
        image: string[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        message: string;
        timestamp: NativeDate;
        sender: "user" | "bot";
        image: string[];
    }> & {
        message: string;
        timestamp: NativeDate;
        sender: "user" | "bot";
        image: string[];
    }>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    date: string;
    userId: mongoose.Types.ObjectId;
    messages: mongoose.Types.DocumentArray<{
        message: string;
        timestamp: NativeDate;
        sender: "user" | "bot";
        image: string[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        message: string;
        timestamp: NativeDate;
        sender: "user" | "bot";
        image: string[];
    }> & {
        message: string;
        timestamp: NativeDate;
        sender: "user" | "bot";
        image: string[];
    }>;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    date: string;
    userId: mongoose.Types.ObjectId;
    messages: mongoose.Types.DocumentArray<{
        message: string;
        timestamp: NativeDate;
        sender: "user" | "bot";
        image: string[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        message: string;
        timestamp: NativeDate;
        sender: "user" | "bot";
        image: string[];
    }> & {
        message: string;
        timestamp: NativeDate;
        sender: "user" | "bot";
        image: string[];
    }>;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    date: string;
    userId: mongoose.Types.ObjectId;
    messages: mongoose.Types.DocumentArray<{
        message: string;
        timestamp: NativeDate;
        sender: "user" | "bot";
        image: string[];
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        message: string;
        timestamp: NativeDate;
        sender: "user" | "bot";
        image: string[];
    }> & {
        message: string;
        timestamp: NativeDate;
        sender: "user" | "bot";
        image: string[];
    }>;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default ChatHistory;
//# sourceMappingURL=chatModel.d.ts.map