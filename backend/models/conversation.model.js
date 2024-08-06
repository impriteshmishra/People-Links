import mongoose from "mongoose";
import message from './message.model';

const conversationSchema = new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    message:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message'
    }]
});
export default conversation = mongoose.model('conversation',conversationSchema);
