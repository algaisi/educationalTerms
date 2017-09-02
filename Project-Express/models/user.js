var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
    username: String,
    emails: String,
    password: String,
    roles:   {
        type: Number,
        min: 1,
        max: 3,
        required: true,
        default: 1
    }
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);