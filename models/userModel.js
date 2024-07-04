const mongoose = require('mongoose');

//Creating Schema using mongoose
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        minLength:[4,'Nom doit avoir minimum 4 caracteres']
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minLength:[8,'le MDP doit avoir minimum 6 caracteres']
    },
    token:{
        type:String
    }
})

//Creating models
const userModel = mongoose.model('user',userSchema);
module.exports = userModel;