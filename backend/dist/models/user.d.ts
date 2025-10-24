import mongoose from 'mongoose';
declare const User: mongoose.Model<{
    name: string;
    createdAt: NativeDate;
    email: string;
    password: string;
    profilePic: string;
    friends: string[];
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    createdAt: NativeDate;
    email: string;
    password: string;
    profilePic: string;
    friends: string[];
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    createdAt: NativeDate;
    email: string;
    password: string;
    profilePic: string;
    friends: string[];
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    createdAt: NativeDate;
    email: string;
    password: string;
    profilePic: string;
    friends: string[];
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    createdAt: NativeDate;
    email: string;
    password: string;
    profilePic: string;
    friends: string[];
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    name: string;
    createdAt: NativeDate;
    email: string;
    password: string;
    profilePic: string;
    friends: string[];
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default User;
//# sourceMappingURL=user.d.ts.map