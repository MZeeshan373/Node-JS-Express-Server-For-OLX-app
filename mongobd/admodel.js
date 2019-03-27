var mongoose = require('mongoose')
const adSchema = {
     catagory: String,
     condition: String,
     brand: String,
     title: String,
     price: Number,
     description:String,
     date:String,
     image:String,
     userID:String,
     location:String
    }
const Ads = mongoose.model('ads', adSchema);
module.exports = Ads