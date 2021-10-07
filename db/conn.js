const mongoose = require("mongoose");
const DB=process.env.DATABASE;
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connection Suceess");
}).catch((error) => console.log("No connection"));
