var mongoose = require('mongoose');
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var questionSchema = new Schema({
  id: ObjectId,
  name:  String,
  question: String,
  votes:   Number,
});

Questions = mongoose.model('Questions', questionSchema);
// the above is necessary as you might have embedded schemas which you don't export

exports.questionsModel = Questions;