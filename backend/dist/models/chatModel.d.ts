import mongoose from 'mongoose';
declare const ChatHistory: mongoose.Model<{
    date: string;
    userId: mongoose.Types.ObjectId;
    messages: mongoose.Types.DocumentArray<{
        message: string;
        sender: "user" | "bot";
        image: string[];
        timestamp: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        message: string;
        sender: "user" | "bot";
        image: string[];
        timestamp: NativeDate;
    }> & {
        message: string;
        sender: "user" | "bot";
        image: string[];
        timestamp: NativeDate;
    }>;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    date: string;
    userId: mongoose.Types.ObjectId;
    messages: mongoose.Types.DocumentArray<{
        message: string;
        sender: "user" | "bot";
        image: string[];
        timestamp: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        message: string;
        sender: "user" | "bot";
        image: string[];
        timestamp: NativeDate;
    }> & {
        message: string;
        sender: "user" | "bot";
        image: string[];
        timestamp: NativeDate;
    }>;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    date: string;
    userId: mongoose.Types.ObjectId;
    messages: mongoose.Types.DocumentArray<{
        message: string;
        sender: "user" | "bot";
        image: string[];
        timestamp: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        message: string;
        sender: "user" | "bot";
        image: string[];
        timestamp: NativeDate;
    }> & {
        message: string;
        sender: "user" | "bot";
        image: string[];
        timestamp: NativeDate;
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
        sender: "user" | "bot";
        image: string[];
        timestamp: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        message: string;
        sender: "user" | "bot";
        image: string[];
        timestamp: NativeDate;
    }> & {
        message: string;
        sender: "user" | "bot";
        image: string[];
        timestamp: NativeDate;
    }>;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    date: string;
    userId: mongoose.Types.ObjectId;
    messages: mongoose.Types.DocumentArray<{
        message: string;
        sender: "user" | "bot";
        image: string[];
        timestamp: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        message: string;
        sender: "user" | "bot";
        image: string[];
        timestamp: NativeDate;
    }> & {
        message: string;
        sender: "user" | "bot";
        image: string[];
        timestamp: NativeDate;
    }>;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    date: string;
    userId: mongoose.Types.ObjectId;
    messages: mongoose.Types.DocumentArray<{
        message: string;
        sender: "user" | "bot";
        image: string[];
        timestamp: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        message: string;
        sender: "user" | "bot";
        image: string[];
        timestamp: NativeDate;
    }> & {
        message: string;
        sender: "user" | "bot";
        image: string[];
        timestamp: NativeDate;
    }>;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default ChatHistory;
//# sourceMappingURL=chatModel.d.ts.map