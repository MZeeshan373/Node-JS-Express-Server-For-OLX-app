var mongoose = require('mongoose')
const userSchema = { 
    f_name: String,
    l_name: String,
    email: String,
    password: String,
    phone:String,
    s_address: String,
    country: String,
    city: String,
    z_code: Number,
    date:String,
    image:String  }
const Users = mongoose.model('User', userSchema);
module.exports = Users