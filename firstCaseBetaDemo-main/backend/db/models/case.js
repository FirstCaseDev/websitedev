var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CaseSchema = new Schema(
  {
    _id: {
      type: "objectId",
    },
    bench: {
      type: "array",
    },
    cases_referred: {
      type: "array",
      items: {
        type: "string",
      },
    },
    date: {
      type: Date,
    },
    doc_author: {
      type: "string",
    },
    judgement: {
      type: "string",
    },
    judgement_text: {
      type: "string",
    },
    // judgement_text_paragraphs: {
    //   type: "array",
    //   items: {
    //     type: "string",
    //   },
    // },
    day: {
      type: "number",
    },
    month: {
      type: "string",
    },
    year: {
      type: "number",
    },
    petitioner: {
      type: "string",
    },
    petitioner_counsel: {
      type: "array",
      items: {
        type: "string",
      },
    },
    provisions_referred: {
      type: "array",
    },
    respondent: {
      type: "string",
    },
    respondent_counsel: {
      type: "array",
      items: {
        type: "string",
      },
    },
    source: {
      type: "string",
    },
    title: {
      type: "string",
    },
    url: {
      type: "string",
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

CaseSchema.index({
  url: "text",
  source: "text",
  petitioner: "text",
  respondent: "text",
  date: "number",
  day: "number",
  month: "text",
  year: "number",
  doc_author: "text",
  bench: "text",
  judgement: "text",
  judgement_text: "text",
  title: "text",
  provisions_referred: "text",
});

module.exports = mongoose.model("Case", CaseSchema);
