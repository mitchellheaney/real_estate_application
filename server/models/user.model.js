import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://firebasestorage.googleapis.com/v0/b/real-estate-app-mern.appspot.com/o/blank-profile-picture-973460_960_720.webp?alt=media&token=fcfcc630-e9cb-4a37-b1c3-759ac887451b",
    },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;
