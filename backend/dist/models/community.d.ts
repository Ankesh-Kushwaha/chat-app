import mongoose from 'mongoose';
declare const Community: mongoose.Model<{
    name: string;
    description: string;
    createdAt: NativeDate;
    members: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    description: string;
    createdAt: NativeDate;
    members: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    description: string;
    createdAt: NativeDate;
    members: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    description: string;
    createdAt: NativeDate;
    members: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    description: string;
    createdAt: NativeDate;
    members: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    name: string;
    description: string;
    createdAt: NativeDate;
    members: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Community;
//# sourceMappingURL=community.d.ts.map