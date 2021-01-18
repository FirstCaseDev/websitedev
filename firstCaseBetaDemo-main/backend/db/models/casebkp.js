var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CaseSchema = new Schema({
  url: { type: String },
  idx: { type: String },
  source: { type: String },
  petitioner: { type: String },
  respondent: { type: String },
  date: { type: Number },
  month: { type: Number },
  year: { type: Number },
  doc_author: { type: String },
  bench: { type: String },
  judgement: { type: String },
  judgement_text: { type: String },
  title: { type: String },
  provisions_referred: { type: String },
});

module.exports = mongoose.model('Case', CaseSchema);
