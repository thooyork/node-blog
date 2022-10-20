const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        reqiured: true
    }
});

module.exports = mongoose.model("User", userSchema);