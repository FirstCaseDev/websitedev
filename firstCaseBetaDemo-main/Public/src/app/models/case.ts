import provisions_referred_object from '../models/provisions_referred_object';

export default class Case {
  _id!: String;
  judgement!: String;
  url!: String;
  source!: String;
  petitioner!: String;
  petitioner_counsel!: Array<string>;
  citing_cases!: Array<any>;
  respondent!: String;
  respondent_counsel!: Array<string>;
  cases_referred!: Array<string>;
  date!: String;
  day!: String;
  month!: String;
  year!: String;
  highlight!: String;
  query_terms!: Array<string>;
  match_count!: Number;
  doc_author!: String;
  bench!: String;
  judgement_text!: String;
  title!: String;
  case_id!: String;
  judgement_html!: String;
  provisions_referred!: Array<provisions_referred_object>;
}
