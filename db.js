const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://Gab:1981abcd.@tableusers.2aqijpr.mongodb.net/")
.then(( )=>console.log('mongoDb Connected'))
.catch((error)=>console.log(error));

const UserSchema = mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        isAdm: Boolean,
        isProfissional: Boolean,
        Skills: String,
        aprove: Boolean,
        photo: String,
        number: Number,
        vip: Boolean,
        list: [String],
    }
)

module.exports = {
    User: mongoose.model('User', UserSchema)
}
