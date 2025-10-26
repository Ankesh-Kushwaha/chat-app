import mongoose from 'mongoose';
export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    bio: string;
    friends: mongoose.Types.ObjectId[];
}
export declare const User: mongoose.Model<{
    name: string;
    email: string;
    password: string;
    bio: string;
    profilePic: string;
    friends: mongoose.Types.ObjectId[];
    createdAt: NativeDate;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    password: string;
    bio: string;
    profilePic: string;
    friends: mongoose.Types.ObjectId[];
    createdAt: NativeDate;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    email: string;
    password: string;
    bio: string;
    profilePic: string;
    friends: mongoose.Types.ObjectId[];
    createdAt: NativeDate;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    email: string;
    password: string;
    bio: string;
    profilePic: string;
    friends: mongoose.Types.ObjectId[];
    createdAt: NativeDate;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    email: string;
    password: string;
    bio: string;
    profilePic: string;
    friends: mongoose.Types.ObjectId[];
    createdAt: NativeDate;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    name: string;
    email: string;
    password: string;
    bio: string;
    profilePic: string;
    friends: mongoose.Types.ObjectId[];
    createdAt: NativeDate;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=user.d.ts.map