const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})
adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next();
})

adminSchema.methods.generateAuthToken = async function () {
    try {
        let tokengen = jwt.sign({ _id: this._id }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token: tokengen });
        await this.save();
        return tokengen;
    } catch (err) {
        console.log(`error is ${err}`);
    }
}
const Admin = mongoose.model('admin', adminSchema);
module.exports = Admin;
