const express = require("express");
const app = express();
var request = require("request");
var host = process.env.HOST || "0.0.0.0";
var port = process.env.PORT || 3000;
var router = express.Router();
var lineChartArr = [];
var ptnChartArr = [];
var respChartArr = [];
const bodyParser = require("body-parser");
const elasticsearch = require("elasticsearch");
require("dotenv/config");

app.use(express.json());
app.use(bodyParser.json());

app.listen(port, () => {
    console.log("connected to elasticsearch");
});

const esClient = elasticsearch.Client({
    host: "https://search-firstcasecourtdata-fhx2m5ssjtso7lmalxrhhzrkmy.us-east-2.es.amazonaws.com/",
});

var options = {
    'method': 'POST',
    'url': 'https://analyticsdata.googleapis.com/v1beta/properties/259877184:runReport',
    'headers': {
        'Authorization': 'Bearer ya29.a0AfH6SMA0F22j45-SanKsfn1Lr7jypdmPWy_4DhhLvLve__G0IrBSLxnsnsCNHMAZoqM922io-8-B4oDUWmicNdOwNchLF6w2Qu287Xi5nV6R84WEUHA3In2I7Z0del8VXeWULjjudM0SSv_Tuxx5V8QDcTCL',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "metrics": [{
            "name": "views",
            "expression": "screenPageViews"
        }],
        "dateRanges": [{
            "startDate": "1000daysAgo",
            "endDate": "today"
        }]
    })

};

app.get("/api/ga_views", (req, res) => {
    request(options, function(error, response) {
        if (error) throw new Error(error);
        // console.log((JSON.parse(response.body).rows[0]).metricValues[0].value);
        res.json({
            total: (JSON.parse(response.body).rows[0]).metricValues[0].value
        });
    });

});

app.get("/api/cases/query=:query", (req, res) => {
    const searchText = req.params.query;
    var courts = req.query.courts.split(",");
    var judgements = req.query.judgement.split(",");
    for (i = 0; i < judgements.length; i++) judgements[i] = String(judgements[i]);
    for (i = 0; i < courts.length; i++) courts[i] = String(courts[i]);
    var page = req.query.page;
    var limit = req.query.limit;
    var sortBy = req.query.sortBy;
    var y_floor = req.query.y_floor;
    var y_ceil = req.query.y_ceil;
    var startIndex = (page - 1) * limit;
    var endIndex = page * limit;
    var judge = req.query.bench;
    if (judge.length == 0) judge = "@";
    var ptnr = req.query.ptn;
    if (ptnr.length == 0) ptnr = "@";
    var resp = req.query.rsp;
    if (resp.length == 0) resp = "@";
    var sort_options = ["_score"];
    if (sortBy === "year") {
        sort_options = [{ date: "desc" }, "_score"];
    }
    // console.log(searchText.trim());
    esClient
        .search({
            index: "indian_court_data.cases",
            body: {
                track_total_hits: true,
                from: startIndex,
                explain: true,
                size: limit,
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
                    "query_terms",
                    "case_id",
                ],
                query: {
                    bool: {
                        must: [{
                                terms: {
                                    "source.keyword": courts,
                                },
                            },
                            {
                                simple_query_string: {
                                    query: searchText.trim(),
                                    fields: ["title^5", "judgement_text^3"],
                                    default_operator: "and",
                                },
                            },
                        ],
                        should: [{
                                regexp: {
                                    bench: judge,
                                },
                            },
                            {
                                regexp: {
                                    petitioner: ptnr,
                                },
                            },
                            {
                                regexp: {
                                    respondent: resp,
                                },
                            },
                        ],
                        filter: [{
                                range: {
                                    year: { gte: y_floor, lte: y_ceil },
                                },
                            },
                            {
                                terms: {
                                    "judgement.keyword": judgements,
                                },
                            },
                        ],
                    },
                },
                highlight: {
                    fields: {
                        judgement_text: {},
                    },
                },
                collapse: {
                    field: "title.keyword",
                },
                script_fields: {
                    "_id ": {
                        script: {
                            lang: "painless",
                            source: "doc['_id'].value",
                        },
                    },
                },
                sort: sort_options,
            },
        })
        .then((response) => {
            if (response.hits.total.value > 0) {
                // return res.json(response);
                return res.json({
                    result_count: response.hits.total.value,
                    result_time: response.took / 1000,
                    case_list: response.hits.hits.map(function(i) {
                        source = i["_source"];
                        source._id = i["_id"];
                        try {
                            // console.log(i["_explanation"].details[1].details[0].details[0].details[0].details[2].details[0].value);
                            source.match_count = i["_explanation"].details[1].details[0].details[0].details[2].details[0].value;

                        } catch (err) {
                            source.match_count = i["_explanation"].details[1].details[0].details[0].details[0].details[2].details[0].value;
                        }
                        var highlight = "";
                        if (i["highlight"] !== undefined) {
                            try {
                                for (var j = 0; j < i["highlight"]["judgement_text"].length; j++) {
                                    highlight = highlight
                                        .concat(i["highlight"]["judgement_text"][j])
                                        .replace(/<em>/g, "<b>")
                                        .replace(/<\/em>/g, "</b>")
                                        .replace(/<br>/g, "")
                                        .replace(/<\/br>/g, "")
                                        .replace(/>>>>/g, "")
                                        .replace(/\n/g, "");
                                    // .substring(0, 100);
                                    highlight = highlight.concat(" ... ");
                                }
                            } catch (err) {
                                console.log(err);
                            }
                        }
                        source.highlight = highlight;
                        return source;
                    }),
                    success: true,
                    msg: "Success",
                    day: response.hits.hits[0].day,
                    // response
                });
            } else {
                return res.json({
                    success: false,
                    msg: "No results found!",
                });
            }
        })
        .catch((err) => {
            return res.status(500).json({ message: "Error", error: err });
        });
});

app.get("/api/cases/_id=:object_id", (req, res) => {
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
            // var case_date = new Date();
            // console.log(case_date);
            var case_date = new Date(response.hits.hits[0]._source.date);
            // console.log(case_date);
            var day = case_date.getUTCDate();
            // console.log(day);
            var month = case_date.getUTCMonth() + 1;
            var year = case_date.getUTCFullYear();
            // console.log(day, month, year);
            date = response.hits.hits[0]._source.date;
            res.json({
                case: response.hits.hits[0]._source,
                date: day,
                month: month,
                year: year,
                msg: "Success",
            });
        })
        .catch((error) => console.log(error));
});

app.get("/api/cases/cited_cases=:query", (req, res) => {
    const searchText = req.params.query;
    var courts = req.query.courts.split(",");
    var judgements = req.query.judgement.split(",");
    for (i = 0; i < judgements.length; i++) judgements[i] = String(judgements[i]);
    for (i = 0; i < courts.length; i++) courts[i] = String(courts[i]);
    // var page = req.query.page;
    // var limit = req.query.limit;
    // var sortBy = req.query.sortBy;
    var y_floor = req.query.y_floor;
    var y_ceil = req.query.y_ceil;
    // var startIndex = (page - 1) * limit;
    // var endIndex = page * limit;
    var judge = req.query.bench;
    if (judge.length == 0) judge = "@";
    var ptnr = req.query.ptn;
    if (ptnr.length == 0) ptnr = "@";
    var resp = req.query.rsp;
    if (resp.length == 0) resp = "@";
    // var sort_options = ["_score"];
    // if (sortBy === "year") {
    //     sort_options = [{ "date": "desc" }, "_score"];
    // }
    esClient
        .search({
            index: "indian_court_data.cases",
            body: {
                track_total_hits: true,
                size: 0,
                query: {
                    bool: {
                        must: [{
                                terms: {
                                    "source.keyword": courts,
                                },
                            },
                            {
                                simple_query_string: {
                                    query: searchText.trim(),
                                    fields: ["title^5", "judgement_text^3"],
                                    default_operator: "and",
                                },
                            },
                        ],
                        should: [{
                                regexp: {
                                    bench: judge,
                                },
                            },
                            {
                                regexp: {
                                    petitioner: ptnr,
                                },
                            },
                            {
                                regexp: {
                                    respondent: resp,
                                },
                            },
                        ],
                        filter: [{
                                range: {
                                    year: { gte: y_floor, lte: y_ceil },
                                },
                            },
                            {
                                terms: {
                                    "judgement.keyword": judgements,
                                },
                            },
                        ],
                    },
                },
                collapse: {
                    field: "url.keyword",
                },
                aggs: {
                    frequent_tag: {
                        terms: {
                            field: "cases_referred.keyword",
                        },
                    },
                },
            },
        })
        .then((response) => {
            res.send(
                response.aggregations.frequent_tag.buckets.map(function(i) {
                    group = i["key"];
                    value = i["doc_count"];
                    return { group: group, value: value };
                })
            );
        })
        .catch((err) => {
            return res.status(500).json({ message: "Error" });
        });
});

app.get("/api/cases/cited_provisions=:query", (req, res) => {
    const searchText = req.params.query;
    var courts = req.query.courts.split(",");
    var judgements = req.query.judgement.split(",");
    for (i = 0; i < judgements.length; i++) judgements[i] = String(judgements[i]);
    for (i = 0; i < courts.length; i++) courts[i] = String(courts[i]);
    // var page = req.query.page;
    // var limit = req.query.limit;
    // var sortBy = req.query.sortBy;
    var y_floor = req.query.y_floor;
    var y_ceil = req.query.y_ceil;
    // var startIndex = (page - 1) * limit;
    // var endIndex = page * limit;
    var judge = req.query.bench;
    if (judge.length == 0) judge = "@";
    var ptnr = req.query.ptn;
    if (ptnr.length == 0) ptnr = "@";
    var resp = req.query.rsp;
    if (resp.length == 0) resp = "@";
    // var sort_options = ["_score"];
    // if (sortBy === "year") {
    //     sort_options = [{ "date": "desc" }, "_score"];
    // }
    esClient
        .search({
            index: "indian_court_data.cases",
            body: {
                track_total_hits: true,
                size: 0,
                query: {
                    bool: {
                        must: [{
                                terms: {
                                    "source.keyword": courts,
                                },
                            },
                            {
                                simple_query_string: {
                                    query: searchText.trim(),
                                    fields: ["title^5", "judgement_text^3"],
                                    default_operator: "and",
                                },
                            },
                        ],
                        should: [{
                                regexp: {
                                    bench: judge,
                                },
                            },
                            {
                                regexp: {
                                    petitioner: ptnr,
                                },
                            },
                            {
                                regexp: {
                                    respondent: resp,
                                },
                            },
                        ],
                        filter: [{
                                range: {
                                    year: { gte: y_floor, lte: y_ceil },
                                },
                            },
                            {
                                terms: {
                                    "judgement.keyword": judgements,
                                },
                            },
                        ],
                    },
                },
                collapse: {
                    field: "url.keyword",
                },
                aggs: {
                    act_names: {
                        terms: { field: "provisions_referred.act_name.keyword", size: 10 },
                        aggs: {
                            act_sections: {
                                terms: {
                                    field: "provisions_referred.act_sections.keyword",
                                    size: 5,
                                },
                            },
                        },
                    },
                },
            },
        })
        .then((response) => {
            res.send(
                response.aggregations.act_names.buckets.map(function(i) {
                    act_name = i["key"];
                    act_sums = i["doc_count"];
                    sections = i["act_sections"].buckets.map(function(j) {
                        names = j["key"];
                        return names;
                    });
                    section_sums = i["act_sections"].buckets.map(function(j) {
                        values = j["doc_count"];
                        return values;
                    });
                    return {
                        act_name: act_name,
                        act_sums: act_sums,
                        sections: sections,
                        section_sums: section_sums,
                    };
                })
            );
        })
        .catch((err) => {
            return res.status(500).json({ message: "Error" });
        });
});

app.get("/api/cases/piecharts=:query", (req, res) => {
    const searchText = req.params.query;
    var courts = req.query.courts.split(",");
    var judgements = req.query.judgement.split(",");
    for (i = 0; i < judgements.length; i++) judgements[i] = String(judgements[i]);
    for (i = 0; i < courts.length; i++) courts[i] = String(courts[i]);
    // var page = req.query.page;
    // var limit = req.query.limit;
    // var sortBy = req.query.sortBy;
    var y_floor = req.query.y_floor;
    var y_ceil = req.query.y_ceil;
    // var startIndex = (page - 1) * limit;
    // var endIndex = page * limit;
    var judge = req.query.bench;
    if (judge.length == 0) judge = "@";
    var ptnr = req.query.ptn;
    if (ptnr.length == 0) ptnr = "@";
    var resp = req.query.rsp;
    if (resp.length == 0) resp = "@";
    // var sort_options = ["_score"];
    // if (sortBy === "year") {
    //     sort_options = [{ "date": "desc" }, "_score"];
    // }
    esClient
        .search({
            index: "indian_court_data.cases",
            body: {
                track_total_hits: true,
                size: 0,
                query: {
                    bool: {
                        must: [{
                                terms: {
                                    "source.keyword": courts,
                                },
                            },
                            {
                                simple_query_string: {
                                    query: searchText.trim(),
                                    fields: ["title^5", "judgement_text^3"],
                                    default_operator: "and",
                                },
                            },
                        ],
                        should: [{
                                regexp: {
                                    bench: judge,
                                },
                            },
                            {
                                regexp: {
                                    petitioner: ptnr,
                                },
                            },
                            {
                                regexp: {
                                    respondent: resp,
                                },
                            },
                        ],
                        filter: [{
                                range: {
                                    year: { gte: y_floor, lte: y_ceil },
                                },
                            },
                            {
                                terms: {
                                    "judgement.keyword": judgements,
                                },
                            },
                        ],
                    },
                },
                collapse: {
                    field: "url.keyword",
                },
                aggs: {
                    judgements: {
                        terms: {
                            field: "judgement.keyword",
                            size: 20,
                        },
                    },
                },
            },
        })
        .then((response) => {
            res.send(
                response.aggregations.judgements.buckets.map(function(i) {
                    label = i["key"];
                    value = i["doc_count"];
                    return {
                        label: label,
                        value: value,
                    };
                })
            );
        })
        .catch((err) => {
            return res.status(500).json({ message: "Error" });
        });
});

app.get("/api/cases/charts=:query", (req, res) => {
    const searchText = req.params.query;
    var courts = req.query.courts.split(",");
    var judgements = req.query.judgement.split(",");
    for (i = 0; i < judgements.length; i++) judgements[i] = String(judgements[i]);
    for (i = 0; i < courts.length; i++) courts[i] = String(courts[i]);
    // var page = req.query.page;
    // var limit = req.query.limit;
    // var sortBy = req.query.sortBy;
    var y_floor = req.query.y_floor;
    var y_ceil = req.query.y_ceil;
    // var startIndex = (page - 1) * limit;
    // var endIndex = page * limit;
    var judge = req.query.bench;
    if (judge.length == 0) judge = "@";
    var ptnr = req.query.ptn;
    if (ptnr.length == 0) ptnr = "@";
    var resp = req.query.rsp;
    if (resp.length == 0) resp = "@";
    // var sort_options = ["_score"];
    // if (sortBy === "year") {
    //     sort_options = [{ "date": "desc" }, "_score"];
    // }
    esClient
        .search({
            index: "indian_court_data.cases",
            body: {
                track_total_hits: true,
                size: 0,
                query: {
                    bool: {
                        must: [{
                                terms: {
                                    "source.keyword": courts,
                                },
                            },
                            {
                                simple_query_string: {
                                    query: searchText.trim(),
                                    fields: ["title^5", "judgement_text^3"],
                                    default_operator: "and",
                                },
                            },
                        ],
                        should: [{
                                regexp: {
                                    bench: judge,
                                },
                            },
                            {
                                regexp: {
                                    petitioner: ptnr,
                                },
                            },
                            {
                                regexp: {
                                    respondent: resp,
                                },
                            },
                        ],
                        filter: [{
                                range: {
                                    year: { gte: y_floor, lte: y_ceil },
                                },
                            },
                            {
                                terms: {
                                    "judgement.keyword": judgements,
                                },
                            },
                        ],
                    },
                },
                collapse: {
                    field: "url.keyword",
                },
                aggs: {
                    judgements: {
                        terms: {
                            field: "judgement.keyword",
                            size: 5,
                        },
                        aggs: {
                            years: {
                                terms: {
                                    field: "year.keyword",
                                    size: 1000,
                                    order: { _term: "asc" },
                                },
                            },
                        },
                    },
                },
            },
        })
        .then((response) => {
            lineChartArr = [];
            response.aggregations.judgements.buckets.map(function(i) {
                i.years.buckets.map(function(j) {
                    lineChartArr.push({
                        color: i["key"],
                        x: j["key"],
                        y: j["doc_count"],
                    });
                });
            });
            res.send(lineChartArr.sort((a, b) => a.x - b.x));
        })
        // .then(response => {
        //     res.send(response.aggregations.judgements.buckets.years.buckets.map(function(i) {
        //         lineChartArr.push({
        //             'color': i['key'],
        //             'x': j['key'],
        //             'y': j['doc_count']
        //         })
        //         return lineChartArr;
        //     }));
        // })
        .catch((err) => {
            return res.status(500).json({ message: "Error" });
        });
});

app.get("/api/cases/ptncharts=:query", (req, res) => {
    const searchText = req.params.query;
    var courts = req.query.courts.split(",");
    var judgements = req.query.judgement.split(",");
    for (i = 0; i < judgements.length; i++) judgements[i] = String(judgements[i]);
    for (i = 0; i < courts.length; i++) courts[i] = String(courts[i]);
    // var page = req.query.page;
    // var limit = req.query.limit;
    // var sortBy = req.query.sortBy;
    var y_floor = req.query.y_floor;
    var y_ceil = req.query.y_ceil;
    // var startIndex = (page - 1) * limit;
    // var endIndex = page * limit;
    var judge = req.query.bench;
    if (judge.length == 0) judge = "@";
    var ptnr = req.query.ptn;
    if (ptnr.length == 0) ptnr = "@";
    var resp = req.query.rsp;
    if (resp.length == 0) resp = "@";
    // var sort_options = ["_score"];
    // if (sortBy === "year") {
    //     sort_options = [{ "date": "desc" }, "_score"];
    // }
    esClient
        .search({
            index: "indian_court_data.cases",
            body: {
                track_total_hits: true,
                size: 0,
                query: {
                    bool: {
                        must: [{
                                terms: {
                                    "source.keyword": courts,
                                },
                            },
                            {
                                simple_query_string: {
                                    query: searchText.trim(),
                                    fields: ["title^5", "judgement_text^3"],
                                    default_operator: "and",
                                },
                            },
                        ],
                        should: [{
                                regexp: {
                                    bench: judge,
                                },
                            },
                            {
                                regexp: {
                                    petitioner: ptnr,
                                },
                            },
                            {
                                regexp: {
                                    respondent: resp,
                                },
                            },
                        ],
                        filter: [{
                                range: {
                                    year: { gte: y_floor, lte: y_ceil },
                                },
                            },
                            {
                                terms: {
                                    "judgement.keyword": judgements,
                                },
                            },
                        ],
                    },
                },
                collapse: {
                    field: "url.keyword",
                },
                aggs: {
                    petitioner_counsels: {
                        terms: {
                            field: "petitioner_counsel.keyword",
                            size: 20,
                        },
                        aggs: {
                            judgements: {
                                terms: {
                                    field: "judgement.keyword",
                                    size: 5,
                                    order: { _term: "desc" },
                                },
                            },
                        },
                    },
                },
            },
        })
        .then((response) => {
            ptnChartArr = [];
            response.aggregations.petitioner_counsels.buckets.map(function(i) {
                i.judgements.buckets.map(function(j) {
                    ptnChartArr.push({
                        group: i["key"],
                        dynamicColumns: j["key"],
                        value: j["doc_count"],
                    });
                });
            });
            res.send(ptnChartArr);
            // res.send(ptnChartArr.sort((a, b) => a.x - b.x));
        })
        // .then(response => {
        //     res.send(response);
        // })
        .catch((err) => {
            return res.status(500).json({ message: "Error" });
        });
});

app.get("/api/cases/respcharts=:query", (req, res) => {
    const searchText = req.params.query;
    var courts = req.query.courts.split(",");
    var judgements = req.query.judgement.split(",");
    for (i = 0; i < judgements.length; i++) judgements[i] = String(judgements[i]);
    for (i = 0; i < courts.length; i++) courts[i] = String(courts[i]);
    // var page = req.query.page;
    // var limit = req.query.limit;
    // var sortBy = req.query.sortBy;
    var y_floor = req.query.y_floor;
    var y_ceil = req.query.y_ceil;
    // var startIndex = (page - 1) * limit;
    // var endIndex = page * limit;
    var judge = req.query.bench;
    if (judge.length == 0) judge = "@";
    var ptnr = req.query.ptn;
    if (ptnr.length == 0) ptnr = "@";
    var resp = req.query.rsp;
    if (resp.length == 0) resp = "@";
    // var sort_options = ["_score"];
    // if (sortBy === "year") {
    //     sort_options = [{ "date": "desc" }, "_score"];
    // }
    esClient
        .search({
            index: "indian_court_data.cases",
            body: {
                track_total_hits: true,
                size: 0,
                query: {
                    bool: {
                        must: [{
                                terms: {
                                    "source.keyword": courts,
                                },
                            },
                            {
                                simple_query_string: {
                                    query: searchText.trim(),
                                    fields: ["title^5", "judgement_text^3"],
                                    default_operator: "and",
                                },
                            },
                        ],
                        should: [{
                                regexp: {
                                    bench: judge,
                                },
                            },
                            {
                                regexp: {
                                    petitioner: ptnr,
                                },
                            },
                            {
                                regexp: {
                                    respondent: resp,
                                },
                            },
                        ],
                        filter: [{
                                range: {
                                    year: { gte: y_floor, lte: y_ceil },
                                },
                            },
                            {
                                terms: {
                                    "judgement.keyword": judgements,
                                },
                            },
                        ],
                    },
                },
                collapse: {
                    field: "url.keyword",
                },
                aggs: {
                    petitioner_counsels: {
                        terms: {
                            field: "respondent_counsel.keyword",
                            size: 20,
                        },
                        aggs: {
                            judgements: {
                                terms: {
                                    field: "judgement.keyword",
                                    size: 5,
                                    order: { _term: "desc" },
                                },
                            },
                        },
                    },
                },
            },
        })
        .then((response) => {
            respChartArr = [];
            response.aggregations.petitioner_counsels.buckets.map(function(i) {
                i.judgements.buckets.map(function(j) {
                    respChartArr.push({
                        group: i["key"],
                        dynamicColumns: j["key"],
                        value: j["doc_count"],
                    });
                });
            });
            res.send(respChartArr);
            // res.send(ptnChartArr.sort((a, b) => a.x - b.x));
        })
        // .then(response => {
        //     res.send(response);
        // })
        .catch((err) => {
            return res.status(500).json({ message: "Error" });
        });
});

app.get("/api/cases/case_table_item=:title_text", (req, res) => {
    var query = req.params.title_text;
    var index = req.query.index;
    esClient
        .search({
            index: "indian_court_data.cases",
            _source: "_id",
            track_total_hits: true,
            // min_score: a,
            size: 1,
            body: {
                query: {
                    match: {
                        title: query,
                    },
                },
            },
        })
        .then((response) => {
            res.send({ url: response.hits.hits[0]._id, index: index });
        })
        .catch((error) => {
            res.send({ url: null });
            console.log(null);
        });
});

app.get("/api/total_count", (req, res) => {
    esClient
        .search({
            index: "indian_court_data.cases",
            body: {
                size: 0,
                track_total_hits: true,
                query: {
                    match_all: {}
                }
            },
        })
        .then((response) => {
            res.json({
                total: response.hits.total.value,
            });
        })
        .catch((error) => console.log(error));
});

app.get("/api/court_count", (req, res) => {
    esClient
        .search({
            index: "indian_court_data.cases",
            body: {
                size: 0,
                aggs: {
                    court_count: {
                        cardinality: {
                            field: "source.keyword",
                            precision_threshold: 10000,
                        }
                    }
                }
            },
        })
        .then((response) => {
            res.json({
                total: response.aggregations.court_count.value,
            });
        })
        .catch((error) => console.log(error));
});

app.get("/api/ind_supreme_court_count", (req, res) => {
    esClient
        .search({
            index: "indian_court_data.cases",
            body: {
                size: 0,
                track_total_hits: true,
                query: {
                    terms: {
                        "source.keyword": ["Supreme Court of India"]
                    }
                }
            },
        })
        .then((response) => {
            res.json({
                total: response.hits.total.value,
            });
        })
        .catch((error) => console.log(error));
});

app.get("/api/high_court_count", (req, res) => {
    esClient
        .search({
            index: "indian_court_data.cases",
            body: {
                size: 0,
                track_total_hits: true,
                query: {
                    match: {
                        source: "High Court"
                    }
                }
            },
        })
        .then((response) => {
            res.json({
                total: response.hits.total.value,
            });
        })
        .catch((error) => console.log(error));
});

app.get("/api/ind_tribunal_count", (req, res) => {
    esClient
        .search({
            index: "indian_court_data.cases",
            body: {
                size: 0,
                track_total_hits: true,
                query: {
                    match: {
                        source: "Tribunal"
                    }
                }
            },
        })
        .then((response) => {
            res.json({
                total: response.hits.total.value,
            });
        })
        .catch((error) => console.log(error));
});

app.get("/api/singapore_court_count", (req, res) => {
    esClient
        .search({
            index: "indian_court_data.cases",
            body: {
                size: 0,
                track_total_hits: true,
                query: {
                    match: {
                        source: "Singapore"
                    }
                }
            },
        })
        .then((response) => {
            res.json({
                total: response.hits.total.value,
            });
        })
        .catch((error) => console.log(error));
});

app.get("/api/cases/autocomplete=:text", (req, res) => {
    esClient
        .search({
            index: "indian_court_data.cases",
            body: {
                _source: "suggest",
                suggest: {
                    autocomplete: {
                        prefix: req.params.text,
                        completion: {
                            field: "suggest",
                            size: 5,
                            fuzzy: {
                                fuzziness: 1
                            },
                            skip_duplicates: true
                        }
                    }
                }
            },
        })
        .then((response) => {
            console.log(response);
            res.json({
                result: response.suggest.autocomplete[0].options
            })

        })
        .catch((error) => console.log(error));
});