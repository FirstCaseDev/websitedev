const express = require("express");
const app = express();
var host = process.env.HOST || "0.0.0.0";
var port = process.env.PORT || 3000;
// var cors = require('cors');
var router = express.Router();
var appRoutes = require("./routes/api")(router);

// Load in the mongoose models
// const { mongoose } = require("./db/mongoose");
const bodyParser = require("body-parser");
const elasticsearch = require("elasticsearch");
require("dotenv/config");

//Connect to mongoDB
// mongoose
//     .connect(process.env.DB_CONNECT, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false,
//     })
//     .then(() => console.log("Database connected"))
//     .catch((error) => console.log(error));

app.use(express.json());
app.use(bodyParser.json());

app.listen(port, () => {
  console.log("connected to elasticsearch");
});

// app.use(cors({origin: "*" }));
app.use("/api", appRoutes);

const esClient = elasticsearch.Client({
  host:
    "https://search-firstcasecourtdata-fhx2m5ssjtso7lmalxrhhzrkmy.us-east-2.es.amazonaws.com/",
});

app.get("/api/cases/query=:query", (req, res) => {
  const searchText = req.params.query;
  const court = req.query.court;
  // console.log(String(court));
  var judgements = req.query.judgement.split(",");
  judgements = judgements.join("|");
  var page = req.query.page;
  var limit = req.query.limit;
  var sortBy = req.query.sortBy;
  var y_floor = req.query.y_floor;
  var y_ceil = req.query.y_ceil;
  var startIndex = (page - 1) * limit;
  var endIndex = page * limit;
  var judge = ".*".concat(req.query.bench, ".*");
  var ptnr = ".*".concat(req.query.ptn, ".*");
  var resp = ".*".concat(req.query.rsp, ".*");
  //TODO : sort options
  esClient
    .search({
      index: "indian_court_data.cases",
      body: {
        track_total_hits: true,
        from: startIndex,
        size: 10,
        _source: [
          "title",
          "url",
          "judgement",
          "_id",
          "year",
          "month",
          "day",
          "date",
          "petitioner",
          "respondent",
          "bench",
          "source",
        ],
        query: {
          bool: {
            must: [
              {
                match: {
                  "source.keyword": court,
                },
              },
              {
                multi_match: {
                  query: searchText.trim(),
                  fields: ["judgement_text", "title"],
                },
              },
              // {
              //     regexp: {
              //         "bench": {
              //             value: judge,
              //             flags: "ALL"
              //         }
              //     }
              // },
              // {
              //     regexp: {
              //         "petitioner": {
              //             value: ptnr,
              //             flags: "ALL"
              //         }
              //     }
              // },
              // {
              //     match: {
              //         "respondent": req.query.rsp
              //     }
              // },
              // {
              //     match: {
              //         "judgement.keyword": judgements
              //     }
              // }
            ],
            filter: {
              range: {
                year: { gte: y_floor, lte: y_ceil },
              },
            },
          },
        },
        script_fields: {
          "_id ": {
            script: {
              lang: "painless",
              source: "doc['_id'].value",
            },
          },
        },
        sort: [{ date: "desc" }, "_score"],
      },
    })
    .then((response) => {
      if (response.hits.total.value > 0) {
        return res.json({
          result_count: response.hits.total.value,
          case_list: response.hits.hits.map(function (i) {
            source = i["_source"];
            source._id = i["_id"];
            return source;
          }),
          success: true,
          msg: "Success",
          day: response.hits.hits[0].day,
        });
      } else {
        return res.json({
          success: false,
          msg: "No results found!",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({ message: "Error" });
    });
});

app.get("/api/cases/:object_id", (req, res) => {
  esClient
    .search({
      index: "indian_court_data.cases",
      body: {
        query: {
          match: {
            _id: req.params.object_id,
          },
        },
      },
    })
    .then((response) => {
      res.json({
        case: response.hits.hits[0]._source,
        // case: response.hits.hits.map(function(i) { return i['_source'] }),
        msg: "Success",
      });
    })
    .catch((error) => console.log(error));
});

app.get("/api/cases/charts=:query", (req, res) => {
  var query = req.params.query;
  const court = req.query.court;
  var y_floor = req.query.y_floor;
  var y_ceil = req.query.y_ceil;
  var judgements = req.query.judgement.split(",");
  judgements = judgements.join("|");
  var judge = ".*".concat(req.query.bench, ".*");
  var ptnr = ".*".concat(req.query.ptn, ".*");
  var resp = ".*".concat(req.query.rsp, ".*");
  esClient.search({
    index: "indian_court_data.cases",
    body: {
      aggs: {
        bool: {
          must: [
            {
              match: {
                "source.keyword": court,
              },
            },
            {
              multi_match: {
                query: searchText.trim(),
                fields: ["judgement_text", "title"],
              },
            },
          ],
          filter: {
            range: {
              year: { gte: y_floor, lte: y_ceil },
            },
            term: {
              bench: {
                $regex: judge,
                $options: "i",
              },
              petitioner: {
                $regex: ptnr,
                $options: "i",
              },
              respondent: {
                $regex: resp,
                $options: "i",
              },
              judgement: {
                $regex: judgements,
                $options: "i",
              },
            },
          },
        },
      },
    },
  }).exec((err, result) => {
    if (err) {
      console.log("error \n", err);
      return next(err);
    } else {
      console.log("Data: \n", result);
      res.send(result);
    }
  });
});
