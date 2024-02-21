import mongoose from "mongoose";
import bcryptjs from "bcryptjs"

// const {Schema, model} = mongoose; 

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        index: { unique: true },
    },
    passwork: {
        type: String,
        required: true,   
    },
})

userSchema.pre("save", async function(next) {  
    const user = this;

    if(!user.isModified('passwork')) return next();

    try {

        const salt = await bcryptjs.genSalt(10)
        user.passwork = await bcryptjs.hash(user.passwork, salt)
        next()
        
    } catch (error) {
        console.log(error)
        throw new Error('fallo al hashar la contraseña...')
    };
});

userSchema.methods.comparePasswork = async function(canditatePasswork) {
    return await bcryptjs.compare(canditatePasswork, this.passwork)
};

export const User = mongoose.model('User', userSchema);