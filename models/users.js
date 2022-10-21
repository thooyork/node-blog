const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        reqiured: true
    },
    refreshToken: {
        type: String
    }
});

module.exports = mongoose.model("User", userSchema);