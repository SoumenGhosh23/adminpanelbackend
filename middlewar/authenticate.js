const jwt = require("jsonwebtoken")
const Admin = require("../model/adminSchema")

const authenticate = async (req, res, next) => {

    try {
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const rootAdmin = await Admin.findOne({ _id: verifyToken._id, "tokens.token": token });
        if (!rootAdmin) { throw new Error("Admin not found") }
        req.token = token;
        req.rootAdmin = rootAdmin;
        next();
    } catch (err) {
        res.status(401).send("No token");
        console.log(err);
    }
}
module.exports = authenticate