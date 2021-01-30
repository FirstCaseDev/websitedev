var Case = require('../db/models/case.js');
var List = require('../db/models/list');
var User = require('../db/models/user');
var jwt = require('jsonwebtoken');
const { json } = require('body-parser');
var secret = 'secret';
var mongoose = require('mongoose');

module.exports = (router) => {

    router.get('/cases/query=:query/', (req, res) => {
        var squery = req.params.query;
        // var judgement = req.params.judgement;
        // const reqyear = req.query.year;
        const page = req.query.page;
        const limit = req.query.limit;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const court = req.query.court;
        var judgements = req.query.judgement.split(',');
        judgements = judgements.join('|');
        var judge = ".*".concat(req.query.bench, ".*");
        var ptnr = ".*".concat(req.query.ptn, ".*");
        var resp = ".*".concat(req.query.rsp, ".*");
        Case.find({
                $text: {
                    $search: squery
                },
                source: court,
                bench: {
                    $regex: judge,
                    $options: 'i'
                },
                petitioner: {
                    $regex: ptnr,
                    $options: 'i'
                },
                respondent: {
                    $regex: resp,
                    $options: 'i'
                },
                judgement: {
                    $regex: judgements,
                    $options: 'i'
                }
            })
            .select({ title: 1, judgement: 1, _id: 1, year: 1, month: 1, date: 1, url: 1, petitioner: 1, respondent: 1, source: 1, bench: 1 })
            .lean()
            .sort()
            .then((case_list) => {
                const resultCases = case_list.slice(startIndex, endIndex);
                res.json({
                    case_list: resultCases,
                    result_count: case_list.length,
                    msg: 'Success',
                });

            })
            .catch((error) => console.log(error));
    });

    router.get('/cases/charts=:query', (req, res) => {
        var query = req.params.query;
        const court = req.query.court;
        var judgements = req.query.judgement.split(',');
        judgements = judgements.join('|');
        var judge = ".*".concat(req.query.bench, ".*");
        var ptnr = ".*".concat(req.query.ptn, ".*");
        var resp = ".*".concat(req.query.rsp, ".*");
        Case.aggregate([{
                    "$match": {
                        "$text": {
                            "$search": query
                        },
                        "source": court,
                        "bench": {
                            "$regex": judge,
                            "$options": 'i'
                        },
                        "petitioner": {
                            "$regex": ptnr,
                            "$options": 'i'
                        },
                        "respondent": {
                            "$regex": resp,
                            "$options": 'i'
                        },
                        "judgement": {
                            "$regex": judgements,
                            "$options": 'i'
                        }
                    }
                },
                {
                    "$addFields": {
                        "__count_by_value": {
                            "k": "judgement",
                            "v": "$judgement"
                        }
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "__alias_0": "$year",
                            "__alias_1": "$__count_by_value.v"
                        },
                        "__alias_2": {
                            "$sum": {
                                "$cond": [{
                                        "$ne": [{
                                                "$type": "$judgement"
                                            },
                                            "missing"
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "__alias_0": "$_id.__alias_0",
                        "__alias_1": "$_id.__alias_1",
                        "__alias_2": 1
                    }
                },
                {
                    "$project": {
                        "x": "$__alias_0",
                        "y": "$__alias_2",
                        "color": "$__alias_1",
                        "_id": 0
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "x": "$x"
                        },
                        "__grouped_docs": {
                            "$push": "$$ROOT"
                        }
                    }
                },
                {
                    "$sort": {
                        "_id.x": 1
                    }
                },
                {
                    "$unwind": "$__grouped_docs"
                },
                {
                    "$replaceRoot": {
                        "newRoot": "$__grouped_docs"
                    }
                },
                {
                    "$limit": 5000
                }
            ])
            .exec((err, result) => {
                if (err) {
                    return next(err);
                } else {
                    res.send(result);
                }
            });
    });

    router.get('/cases/piecharts=:query', (req, res) => {
        var query = req.params.query;
        const court = req.query.court;
        var judgements = req.query.judgement.split(',');
        judgements = judgements.join('|');
        var judge = ".*".concat(req.query.bench, ".*");
        var ptnr = ".*".concat(req.query.ptn, ".*");
        var resp = ".*".concat(req.query.rsp, ".*");
        Case.aggregate([{
                    "$match": {
                        "$text": {
                            "$search": query
                        },
                        "source": court,
                        "bench": {
                            "$regex": judge,
                            "$options": 'i'
                        },
                        "petitioner": {
                            "$regex": ptnr,
                            "$options": 'i'
                        },
                        "respondent": {
                            "$regex": resp,
                            "$options": 'i'
                        },
                        "judgement": {
                            "$regex": judgements,
                            "$options": 'i'
                        }
                    },

                },
                {
                    "$group": {
                        "_id": {
                            "__alias_0": "$judgement"
                        },
                        "__alias_1": {
                            "$sum": {
                                "$cond": [{
                                        "$ne": [{
                                                "$type": "$judgement"
                                            },
                                            "missing"
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "__alias_0": "$_id.__alias_0",
                        "__alias_1": 1
                    }
                },
                {
                    "$project": {
                        "label": "$__alias_0",
                        "value": "$__alias_1",
                        "_id": 0
                    }
                },
                {
                    "$addFields": {
                        "__agg_sum": {
                            "$sum": [
                                "$value"
                            ]
                        }
                    }
                },
                {
                    "$sort": {
                        "__agg_sum": -1
                    }
                },
                {
                    "$project": {
                        "__agg_sum": 0
                    }
                },
                {
                    "$limit": 5000
                }
            ])
            .exec((err, result) => {
                if (err) {
                    return next(err);
                } else {
                    res.send(result);
                }
            });
    });

    router.get('/cases/ptncharts=:query', (req, res) => {
        var query = req.params.query;
        const court = req.query.court;
        var judge = ".*".concat(req.query.bench, ".*");
        var ptnr = ".*".concat(req.query.ptn, ".*");
        var resp = ".*".concat(req.query.rsp, ".*");
        Case.aggregate([{
                    "$match": {
                        "$text": {
                            "$search": query
                        },
                        "source": court,
                        "bench": {
                            "$regex": judge,
                            "$options": 'i'
                        },
                        "petitioner": {
                            "$regex": ptnr,
                            "$options": 'i'
                        },
                        "respondent": {
                            "$regex": resp,
                            "$options": 'i'
                        }
                    }
                },
                {
                    "$unwind": "$petitioner_counsel"
                },
                {
                    "$addFields": {
                        "__count_by_value": {
                            "k": "judgement",
                            "v": "$judgement"
                        }
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "__alias_0": "$petitioner_counsel",
                            "__alias_1": "$__count_by_value.v"
                        },
                        "__alias_2": {
                            "$sum": {
                                "$cond": [{
                                        "$ne": [{
                                                "$type": "$judgement"
                                            },
                                            "missing"
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "__alias_0": "$_id.__alias_0",
                        "__alias_1": "$_id.__alias_1",
                        "__alias_2": 1
                    }
                },
                {
                    "$project": {
                        "group": "$__alias_0",
                        "value": "$__alias_2",
                        "dynamicColumns": "$__alias_1",
                        "_id": 0
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "group": "$group"
                        },
                        "__grouped_docs": {
                            "$push": "$$ROOT"
                        }
                    }
                },
                {
                    "$sort": {
                        "_id.group": 1
                    }
                },
                {
                    "$unwind": {
                        "path": "$__grouped_docs"
                    }
                },
                {
                    "$replaceRoot": {
                        "newRoot": "$__grouped_docs"
                    }
                },
                {
                    "$limit": 50000
                }
            ])
            .exec((err, result) => {
                if (err) {
                    return (err);
                } else {
                    res.send(result);
                }
            });
    });

    router.get('/cases/respcharts=:query', (req, res) => {
        var query = req.params.query;
        const court = req.query.court;
        var judge = ".*".concat(req.query.bench, ".*");
        var ptnr = ".*".concat(req.query.ptn, ".*");
        var resp = ".*".concat(req.query.rsp, ".*");
        Case.aggregate([{
                    "$match": {
                        "$text": {
                            "$search": query
                        },
                        "source": court,
                        "bench": {
                            "$regex": judge,
                            "$options": 'i'
                        },
                        "petitioner": {
                            "$regex": ptnr,
                            "$options": 'i'
                        },
                        "respondent": {
                            "$regex": resp,
                            "$options": 'i'
                        }
                    }
                },
                {
                    "$unwind": "$respondent_counsel"
                },
                {
                    "$addFields": {
                        "__count_by_value": {
                            "k": "judgement",
                            "v": "$judgement"
                        }
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "__alias_0": "$respondent_counsel",
                            "__alias_1": "$__count_by_value.v"
                        },
                        "__alias_2": {
                            "$sum": {
                                "$cond": [{
                                        "$ne": [{
                                                "$type": "$judgement"
                                            },
                                            "missing"
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "__alias_0": "$_id.__alias_0",
                        "__alias_1": "$_id.__alias_1",
                        "__alias_2": 1
                    }
                },
                {
                    "$project": {
                        "group": "$__alias_0",
                        "value": "$__alias_2",
                        "dynamicColumns": "$__alias_1",
                        "_id": 0
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "group": "$group"
                        },
                        "__grouped_docs": {
                            "$push": "$$ROOT"
                        }
                    }
                },
                {
                    "$sort": {
                        "_id.group": 1
                    }
                },
                {
                    "$unwind": {
                        "path": "$__grouped_docs"
                    }
                },
                {
                    "$replaceRoot": {
                        "newRoot": "$__grouped_docs"
                    }
                },
                {
                    "$limit": 50000
                }
            ])
            .exec((err, result) => {
                if (err) {
                    return (err);
                } else {
                    res.send(result);
                }
            });
    });

    router.get('/cases/pvbcharts=:query', (req, res) => {
        var query = req.params.query;
        const court = req.query.court;
        var judge = ".*".concat(req.query.bench, ".*");
        var ptnr = ".*".concat(req.query.ptn, ".*");
        var resp = ".*".concat(req.query.rsp, ".*");
        Case.aggregate([{
                    "$match": {
                        "$text": {
                            "$search": query
                        },
                        "source": court,
                        "bench": {
                            "$regex": judge,
                            "$options": 'i'
                        },
                        "petitioner": {
                            "$regex": ptnr,
                            "$options": 'i'
                        },
                        "respondent": {
                            "$regex": resp,
                            "$options": 'i'
                        }
                    }
                },
                {
                    "$unwind": "$petitioner_counsel"
                },
                {
                    "$group": {
                        "_id": {
                            "__alias_0": "$petitioner_counsel",
                            "__alias_1": "$bench"
                        },
                        "__alias_2": {
                            "$sum": {
                                "$cond": [{
                                        "$ne": [{
                                                "$type": "$judgement"
                                            },
                                            "missing"
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "__alias_0": "$_id.__alias_0",
                        "__alias_1": "$_id.__alias_1",
                        "__alias_2": 1
                    }
                },
                {
                    "$project": {
                        "y": "$__alias_0",
                        "x": "$__alias_1",
                        "color": "$__alias_2",
                        "_id": 0
                    }
                },
                {
                    "$addFields": {
                        "__agg_sum": {
                            "$sum": [
                                "$color"
                            ]
                        }
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "x": "$x"
                        },
                        "__grouped_docs": {
                            "$push": "$$ROOT"
                        },
                        "__agg_sum": {
                            "$sum": "$__agg_sum"
                        }
                    }
                },
                {
                    "$sort": {
                        "__agg_sum": -1
                    }
                },
                {
                    "$unwind": "$__grouped_docs"
                },
                {
                    "$replaceRoot": {
                        "newRoot": "$__grouped_docs"
                    }
                },
                {
                    "$project": {
                        "__agg_sum": 0
                    }
                },
                {
                    "$limit": 20000
                }
            ])
            .exec((err, result) => {
                if (err) {
                    return (err);
                } else {
                    res.send(result);
                }
            });
    });

    router.get('/cases/rvbcharts=:query', (req, res) => {
        var query = req.params.query;
        const court = req.query.court;
        var judge = ".*".concat(req.query.bench, ".*");
        var ptnr = ".*".concat(req.query.ptn, ".*");
        var resp = ".*".concat(req.query.rsp, ".*");
        Case.aggregate([{
                    "$match": {
                        "$text": {
                            "$search": query
                        },
                        "source": court,
                        "bench": {
                            "$regex": judge,
                            "$options": 'i'
                        },
                        "petitioner": {
                            "$regex": ptnr,
                            "$options": 'i'
                        },
                        "respondent": {
                            "$regex": resp,
                            "$options": 'i'
                        }
                    }
                },
                {
                    "$unwind": "$respondent_counsel"
                },
                {
                    "$group": {
                        "_id": {
                            "__alias_0": "$respondent_counsel",
                            "__alias_1": "$bench"
                        },
                        "__alias_2": {
                            "$sum": {
                                "$cond": [{
                                        "$ne": [{
                                                "$type": "$judgement"
                                            },
                                            "missing"
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "__alias_0": "$_id.__alias_0",
                        "__alias_1": "$_id.__alias_1",
                        "__alias_2": 1
                    }
                },
                {
                    "$project": {
                        "y": "$__alias_0",
                        "x": "$__alias_1",
                        "color": "$__alias_2",
                        "_id": 0
                    }
                },
                {
                    "$addFields": {
                        "__agg_sum": {
                            "$sum": [
                                "$color"
                            ]
                        }
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "x": "$x"
                        },
                        "__grouped_docs": {
                            "$push": "$$ROOT"
                        },
                        "__agg_sum": {
                            "$sum": "$__agg_sum"
                        }
                    }
                },
                {
                    "$sort": {
                        "__agg_sum": -1
                    }
                },
                {
                    "$unwind": "$__grouped_docs"
                },
                {
                    "$replaceRoot": {
                        "newRoot": "$__grouped_docs"
                    }
                },
                {
                    "$project": {
                        "__agg_sum": 0
                    }
                },
                {
                    "$limit": 20000
                }
            ])
            .exec((err, result) => {
                if (err) {
                    return (err);
                } else {
                    res.send(result);
                }
            });
    });

    router.get('/cases/cited_cases=:query', (req, res) => {
        var query = req.params.query;
        const court = req.query.court;
        var judgements = req.query.judgement.split(',');
        judgements = judgements.join('|');
        var judge = ".*".concat(req.query.bench, ".*");
        var ptnr = ".*".concat(req.query.ptn, ".*");
        var resp = ".*".concat(req.query.rsp, ".*");
        Case.aggregate([{
                    "$match": {
                        "$text": {
                            "$search": query
                        },
                        "source": court,
                        "bench": {
                            "$regex": judge,
                            "$options": 'i'
                        },
                        "petitioner": {
                            "$regex": ptnr,
                            "$options": 'i'
                        },
                        "respondent": {
                            "$regex": resp,
                            "$options": 'i'
                        },
                        "judgement": {
                            "$regex": judgements,
                            "$options": 'i'
                        }
                    },

                },
                {
                    "$unwind": "$cases_referred"
                },
                {
                    "$group": {
                        "_id": {
                            "__alias_0": "$cases_referred"
                        },
                        "__alias_1": {
                            "$sum": {
                                "$cond": [{
                                        "$ne": [{
                                                "$type": "$cases_referred"
                                            },
                                            "missing"
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "__alias_0": "$_id.__alias_0",
                        "__alias_1": 1
                    }
                },
                {
                    "$project": {
                        "group": "$__alias_0",
                        "value": "$__alias_1",
                        "_id": 0
                    }
                },
                {
                    "$sort": {
                        "value": -1
                    }
                },
                {
                    "$limit": 10
                },
                {
                    "$limit": 50000
                }
            ])
            .exec((err, result) => {
                if (err) {
                    return next(err);
                } else {
                    res.send(result);
                }
            });
    });

    router.get('/cases/cited_laws=:query', (req, res) => {
        var query = req.params.query;
        const court = req.query.court;
        var judgements = req.query.judgement.split(',');
        judgements = judgements.join('|');
        var judge = ".*".concat(req.query.bench, ".*");
        var ptnr = ".*".concat(req.query.ptn, ".*");
        var resp = ".*".concat(req.query.rsp, ".*");
        Case.aggregate([{
                    "$match": {
                        "$text": {
                            "$search": query
                        },
                        "source": court,
                        "bench": {
                            "$regex": judge,
                            "$options": 'i'
                        },
                        "petitioner": {
                            "$regex": ptnr,
                            "$options": 'i'
                        },
                        "respondent": {
                            "$regex": resp,
                            "$options": 'i'
                        },
                    },

                },
                {
                    "$unwind": "$provisions_referred"
                },
                {
                    "$unwind": "$provisions_referred.act_sections"
                },
                {
                    "$group": {
                        "_id": {
                            "__alias_0": "$provisions_referred.act_name",
                            "__alias_1": "$provisions_referred.act_sections"
                        },
                        "__alias_2": {
                            "$sum": {
                                "$cond": [{
                                        "$ne": [{
                                                "$type": "$provisions_referred.act_name"
                                            },
                                            "missing"
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "__alias_0": "$_id.__alias_0",
                        "__alias_1": "$_id.__alias_1",
                        "__alias_2": 1
                    }
                },
                {
                    "$project": {
                        "y": "$__alias_0",
                        "x": "$__alias_2",
                        "color": "$__alias_1",
                        "_id": 0
                    }
                },
                {
                    "$addFields": {
                        "__agg_sum": {
                            "$sum": [
                                "$x"
                            ]
                        }
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "y": "$y"
                        },
                        "__grouped_docs": {
                            "$push": "$$ROOT"
                        },
                        "__agg_sum": {
                            "$sum": "$__agg_sum"
                        }
                    }
                },
                {
                    "$sort": {
                        "__agg_sum": -1
                    }
                },
                {
                    "$limit": 75
                },
                {
                    "$unwind": "$__grouped_docs"
                },
                {
                    "$replaceRoot": {
                        "newRoot": "$__grouped_docs"
                    }
                },
                {
                    "$project": {
                        "__agg_sum": 0
                    }
                },
                {
                    "$limit": 5000
                }
            ])
            .exec((err, result) => {
                if (err) {
                    return next(err);
                } else {
                    res.send(result);
                }
            });
    });

    router.get('/cases/cited_acts=:query', (req, res) => {
        var query = req.params.query;
        const court = req.query.court;
        var judgements = req.query.judgement.split(',');
        judgements = judgements.join('|');
        var judge = ".*".concat(req.query.bench, ".*");
        var ptnr = ".*".concat(req.query.ptn, ".*");
        var resp = ".*".concat(req.query.rsp, ".*");
        Case.aggregate([{
                    "$match": {
                        "$text": {
                            "$search": query
                        },
                        "source": court,
                        "bench": {
                            "$regex": judge,
                            "$options": 'i'
                        },
                        "petitioner": {
                            "$regex": ptnr,
                            "$options": 'i'
                        },
                        "respondent": {
                            "$regex": resp,
                            "$options": 'i'
                        },
                    },

                },
                {
                    "$unwind": "$provisions_referred"
                },
                {
                    "$group": {
                        "_id": {
                            "__alias_0": "$provisions_referred.act_name"
                        },
                        "__alias_1": {
                            "$sum": {
                                "$cond": [{
                                        "$ne": [{
                                                "$type": "$provisions_referred.act_name"
                                            },
                                            "missing"
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "__alias_0": "$_id.__alias_0",
                        "__alias_1": 1
                    }
                },
                {
                    "$project": {
                        "group": "$__alias_0",
                        "value": "$__alias_1",
                        "_id": 0
                    }
                },
                {
                    "$sort": {
                        "value": -1
                    }
                },
                {
                    "$limit": 5
                },
                {
                    "$limit": 50000
                }
            ])
            .exec((err, result) => {
                if (err) {
                    return next(err);
                } else {
                    res.send(result);
                }
            });
    });

    router.get('/cases/_id=:object_id', (req, res) => {
        Case.find({ _id: mongoose.Types.ObjectId(req.params.object_id) })
            .then((case_item) => {
                res.json({
                    case_list: case_item,
                    msg: 'Success',
                });
            })
            .catch((error) => console.log(error));
    });

    router.post('/cases', (req, res) => {
        var case_item = new Case();
        case_item.url = req.body.url;
        case_item.source = req.body.source;
        case_item.petitioner = req.body.petitioner;
        case_item.respondent = req.body.respondent;
        case_item.date = req.body.date;
        case_item.month = req.body.month;
        case_item.year = req.body.year;
        case_item.doc_author = req.body.doc_author;
        case_item.bench = req.body.bench;
        case_item.judgement = req.body.judgement;
        case_item.judgement_text = req.body.judgement_text;
        case_item.title = req.body.title;
        case_item.petitioner_counsel = req.body.petitioner_counsel;
        case_item.respondent_counsel = req.body.respondent_counsel;
        case_item.provisions_referred = req.body.provisions_referred;
        case_item.cases_referred = req.body.cases_referred;
        case_item.save((error) => {
            if (error) {
                res.json({
                    success: false,
                    msg: error,
                });
            } else {
                res.json({
                    success: false,
                    case_item: case_item,
                    msg: 'Case created',
                });
            }
        });
    });

    router.delete('/SCdata01', (req, res) => {
        Case.deleteOne({
                url: req.body.url,
            })
            .then(() => {
                Case.find().then((case_list) => {
                    res.send(case_list);
                });
            })
            .catch((error) => {
                res.send(error);
            });
    });

    router.get('/', (req, res) => {
        res.send('Hello World');
    });

    router.get('/users', (req, res) => {
        User.find()
            .then((users) => {
                res.send(users);
            })
            .catch((error) => {
                res.send(error);
            });
    });

    router.delete('/users', (req, res) => {
        User.deleteOne({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
            })
            .then(() => {
                User.find().then((users) => {
                    res.send(users);
                });
            })
            .catch((error) => {
                res.send(error);
            });
    });

    // User Registration
    router.post('/users', (req, res) => {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        user.name = req.body.name;
        user.organisation = req.body.organisation;
        user.position = req.body.position;
        if (
            req.body.username == null ||
            req.body.username == '' ||
            req.body.email == null ||
            req.body.email == '' ||
            req.body.password == null ||
            req.body.password == '' ||
            req.body.name == null ||
            req.body.name == ''
        ) {
            res.json({
                success: false,
                msg: "Fields required",
            });
        } else {
            user.save((error) => {
                if (error) {
                    res.json({
                        success: false,
                        msg: error,
                    });
                } else {
                    res.json({
                        success: true,
                        msg: "User created",
                    });
                }
            });
        }
    });

    // User Login Complete
    router.post("/authenticate", function(req, res) {
        User.findOne({ username: req.body.username })
            .select("email username password")
            .exec(function(err, user) {
                if (err) {
                    res.json({ success: false, msg: err });
                } else {
                    if (!user) {
                        res.json({
                            success: false,
                            message: "Could not authenticate user",
                        });
                    } else if (user) {
                        if (req.body.password) {
                            var validPassword = user.comparePassword(req.body.password);
                            //res.send(console.log(validPassword));
                            if (!validPassword) {
                                res.json({ success: false, msg: "Wrong credentials" });
                                return;
                            } else {
                                var token = jwt.sign({ username: user.username, email: user.email },
                                    process.env.SECRET, { expiresIn: "60s" }
                                );
                                res.json({
                                    success: true,
                                    msg: "Successfully logged in",
                                    token: token,
                                });
                                return;
                            }
                        } else {
                            res.json({ success: false, msg: "Fields required" });
                            return;
                        }
                    }
                }
            });
    });


    router.use(function(req, res, next) {
        var token =
            req.body.token || req.body.query || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, msg: 'Invalid Token' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res,
            json({ success: false, msg: 'No token provided' });
        }
    });

    router.post('/me', (req, res) => {
        res.send(req.decoded);
    });

    return router;
};