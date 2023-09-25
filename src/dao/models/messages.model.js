import mongoose from 'mongoose';

const messageCollection = 'messages';

const messageSchema = new mongoose.Schema({
    user_email: {
        type: String,
        required : true
    },
    message:{
        type:String,
        required:true
    }
});

export default messagesModel = mongoose.model(messageCollection, messageSchema);