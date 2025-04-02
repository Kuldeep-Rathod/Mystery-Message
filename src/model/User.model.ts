import mongoose, { Document, Schema } from 'mongoose';

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MesageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is Required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email is Required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is Required'],
    },
    verifyCode: {
        type: String,
        required: [true, 'Verify code is Required'],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify code expiry is Required'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessages: {
        type: Boolean,
        default: false,
    },
    messages: [MesageSchema],
});

const UserModel =
    (mongoose.models.User as mongoose.Model<User>) ||
    mongoose.model<User>('User', UserSchema);

export default UserModel;
