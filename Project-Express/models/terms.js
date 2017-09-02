var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    arcomment: {
      type: String
    },
    encomment: {
      type: String
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  });

  var termSchema = new Schema({
    artitle: {
       type: String,
       required: true,
       unique: true
    },
    entitle: {
        type: String,
        required: true,
        unique: true
    },
    ardescription: {
        type: String,
        required: true
    },
    endescription: {
        type: String,
        required: true
    },
    approved: {
      type: Boolean,
      default:false
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comments: [commentSchema]
  },
  {
    timestamps: true,
    collection: 'terms'
  });
  var Terms = mongoose.model('Terms', termSchema);
  module.exports = Terms;
