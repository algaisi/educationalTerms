var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favouriteSchema = new Schema({
    postedBy: {
        required: true
        ,type: mongoose.Schema.Types.ObjectId
        ,ref: 'User'
    },
    terms: [ {required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Terms'}]
},
{
    timestamps : true
});
var Favourites = mongoose.model('Favourites', favouriteSchema);
module.exports = Favourites;
