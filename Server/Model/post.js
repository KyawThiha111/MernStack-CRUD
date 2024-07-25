const {Schema, model} = require("mongoose");
const postSchema = new Schema({
    title: {
        type:String,
        required:true,
        maxlength:100
    },
    snippet: {
        type:String,
        required:true,
        maxlength:300
    },
    blogtext: {
        type:String,
        required:true,
    },
    userid:{
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
},{timestamps:true})

module.exports = model("Posts",postSchema);