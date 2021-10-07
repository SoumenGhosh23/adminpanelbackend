const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    name: {
        type: String
    },
    text: {
        type: String
    },
})
const Contents = mongoose.model('content', adminSchema);
module.exports = Contents;