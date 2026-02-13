import mongoose, { Schema } from "mongoose";

interface Ioauth {
    googleId: string,
    displayName: string,
    profileUrl: string
}

const oauth_schema = new Schema({
    googleId: {
        type: String,
        require: true
    },
    displayName: {
        type: String,
        require: true
    },
    profileUrl: {
        type: String,
        require: true
    }
})


const oauth_module = mongoose.model<Ioauth>("oauth_users", oauth_schema);

export default oauth_module