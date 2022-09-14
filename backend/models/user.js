const mongoose = require('mongoose');
const { Model, Schema  } = mongoose;
module.exports =
    userSchema= mongoose.model("User",Schema({
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            max: 64,
            min: 6,
        },
        picture: {
            type: String,
            default: "./avatar.png",
        },
        role: {
            type: [String],
            default: ["Subscriber"],
            enum: ["Subscriber", "Instructor", "Admin"],
        },
        stripe_account_id: "",
        stripe_seller: {},
        stripeSession: {},
        passwordResetCode:{
            data: String,
            default: "",
        }
    }, {timestamps: true}))

