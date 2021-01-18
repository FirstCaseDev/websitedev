var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CaseSchema = new Schema(
  {
    _id: {
      type: 'objectId',
    },
    bench: {
      type: 'string',
    },
    cases_referred: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    date: {
      type: 'number',
    },
    doc_author: {
      type: 'string',
    },
    judgement: {
      type: 'string',
    },
    judgement_text: {
      type: 'string',
    },
    month: {
      type: 'number',
    },
    petitioner: {
      type: 'string',
    },
    petitioner_counsel: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    provisions_referred: {
      type: 'string',
    },
    respondent: {
      type: 'string',
    },
    respondent_counsel: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    source: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    url: {
      type: 'string',
    },
    year: {
      type: 'number',
    },
  }

  //   {
  //   url: { type: String },
  //   idx: { type: String },
  //   source: { type: String },
  //   petitioner: { type: String },
  //   respondent: { type: String },
  //   date: { type: Number },
  //   month: { type: Number },
  //   year: { type: Number },
  //   doc_author: { type: String },
  //   bench: { type: String },
  //   judgement: { type: String },
  //   judgement_text: { type: String },
  //   title: { type: String },
  //   provisions_referred: { type: String },
  // }
);

module.exports = mongoose.model('Case', CaseSchema);
