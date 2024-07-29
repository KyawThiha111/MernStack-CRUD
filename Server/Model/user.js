const {Schema,model} = require("mongoose");

const userSchema = new Schema({
    username:{
        type:String,
        unique:true,
        required: true,
        maxlength: 50
    },
    email:{
        type:String,
        unique:true,
        required: true,
        maxlength: 100
    },
    password:{
        type: String,
        minlength: 4,
        required: true,
    }
})

module.exports = model("users",userSchema);