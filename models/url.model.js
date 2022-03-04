var mongoose = require("mongoose");


var urlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    shorturl: {
        type: String,
        required: true
    }
})



module.exports = mongoose.model("url", urlSchema)