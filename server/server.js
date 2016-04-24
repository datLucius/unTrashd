var path = require('path');
var express = require('express');
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var bodyParser = require('body-parser');
var request = require('superagent');
var Promise = require('bluebird');
var badges = require('./badges');
var _ = require('lodash');
var cors = require('cors');

// var MONGO_URL = 'mongodb://localhost:27017/untrashd';
var MONGO_URL = 'mongodb://untrashd:test123@ds015508.mlab.com:15508/untrashd'
var GIS_URL = "http://tela.roktech.net/arcgis/rest/services/Demos/fishackathonGhostGearBusters/FeatureServer/0/applyEdits";

function addFeature(gear) {
    var adds = [{
        geometry: {
            x: gear.location[0],
            y: gear.location[1],
            spatialReference: {
                wkid: 102100,
                latestWkid: 3857
            }
        },
        attributes: {
            GearID: gear._id,
            UserID: gear.tagged_by
        }
    }];
    adds = JSON.stringify(adds);
    return new Promise(function (resolve, reject) {
        request
            .post(GIS_URL)
            .query({f: 'json'})
            .query({adds: adds})
            .end(function(err, res) {
                if (err) reject(err);
                else resolve(gear);
            });
    });
}

function days_between(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms)

    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY)

}

function getLevel(points) {
    if (points > -1) { return "SCRUB" };
}

function getPoints(gear) {
    var points = 0;
    if (gear.image) points += 5;
    points += gear.tags.length;
    return points;
}

MongoClient.connect(MONGO_URL, function(err, db) {
    assert.equal(null, err);
    console.log("Connected to mongoDb");

    var users = db.collection('users'),
        gear = db.collection('gear'),
        tags = db.collection('tags');

    var app = express();
    app.use(cors());

    var updateBadges = function(gear) {
        return new Promise(function(resolve, reject) {
            users.findOne({_id: gear.tagged_by}).then(function(user) {
                var newBadges = _.unionBy([user.badges, badges], function(badge) {
                    return badge.id;
                });
                var points = getPoints(gear);
                users.updateOne({_id: gear.tagged_by}, {
                    $set: {
                        badges: newBadges,
                        points: user.points + points
                    }
                })
                .then(function() {resolve(gear);})
                .catch(function(err) {
                    console.log(err);
                    res.sendStatus(500);
                    reject(err);
                });
            }).catch(function(err) {
                console.log(err);
                res.sendStatus(500);
                reject(err);
            });

        });
    }

    //count, days since last tag, number of days with items, most common tag, level, rank
    //

    var getGearStats = function(user) {
        if (!user) return;
        return new Promise(function(resolve, reject) {
            gear.find({tagged_by: user._id}).toArray(function(err, items) {
                if (err) reject(err);
                else {
                    var tags = {};
                    var dates = {};
                    var highestTag = undefined;
                    var most = 0;
                    var last_tag = user.joined;
                    items.forEach(function(item) {
                        console.log(item);
                        item.tags.forEach(function(tag) {
                            tags[tag] = (tags[tag] || 0) + 1;
                            if (tags[tag] > most) {
                                most = tags[tag];
                                highestTag = tag;
                            }
                        });
                        if (item.tagged_on > last_tag) last_tag = item.tagged_on;
                        dates[new Date(item.tagged_on).toDateString()] = true;
                    });
                    resolve(Object.assign({}, user,
                        {
                            count: items && items.length,
                            most_tagged: highestTag,
                            days_since: days_between(new Date(), new Date(last_tag)),
                            days_tagging: Object.keys(dates).length,
                            level: getLevel(user.points)
                        }
                    ));
                }
            });
        });
    }

    var getRank = function(user) {
        if (!user) return;
        return new Promise(function(resolve, reject) {
            gear.aggregate(
                [
                    { $group: { _id: "$tagged_by", number: { $sum: 1 } } },
                    { $sort: { number: -1 } }
                ]
            ).toArray().then(function(items) {
                resolve(Object.assign({}, user, {
                    rank: _.findIndex(items, {_id: user._id})+1
                }));
            });
        });
    }

    app.use(bodyParser.json());

    app.get('/leaderboard', function(req, res) {
        gear.aggregate(
            [
                { $group: { _id: "$tagged_by", count: { $sum: 1 } } },
                { $sort: { number: -1 } },
                { $limit: 10 }
            ]
        ).toArray().then(function(items) {
            res.send(items);
        });
    });

    app.get('/users/:user_name', function(req, res) {
        users.findOne({_id: req.params.user_name})
            .then(getGearStats)
            .then(getRank)
            .then(function(user) {
                if (user) {
                    res.send(user);
                }
                else {
                    res.sendStatus(404);
                }
            });
    });

    app.post('/users', function(req, res) {
        users.findOne({_id: req.body._id})
            .then(function(user) {
                if (user) {
                    res.sendStatus(409);
                }
                if (!req.body._id) {
                    res.sendStatus(400);
                }
                var user = {
                    _id: req.body._id,
                    joined: new Date().getTime(),
                    points: 0,
                    badges: [badges.JOINED]
                };
                return users.insert(user);
            }).then(function(user) {
                res.status(201).json(user.ops[0]);
            }).catch(function(err) {
                console.log(err);
                res.sendStatus(500);
            });
    });

    app.get('/gear/:id', function(req, res) {
        gear.findOne({_id: req.params.id})
            .then(function(gear) {
                if (gear) {
                    res.send(gear);
                }
                else {
                    res.sendStatus(404);
                }
            });
    });

    app.get('/recent', function(req, res) {
        var query = {};
        if (req.query.user_name) {
            query = {
                tagged_by: req.query.user_name
            }
        }
        gear.find(query).sort({tagged_on: -1}).limit(10).toArray()
            .then(function(gear) {
                if (gear) {
                    res.send(gear);
                }
                else {
                    res.sendStatus(404);
                }
            }).catch(function(err) {
                console.log(err);
                res.sendStatus(500);
            });
    });

    app.get('/gear', function(req, res) {
        var query = {"$and": []};
        var and = query["$and"];
        if (req.query.tag) {
            var tags = [].concat(req.query.tag);
            and.push({
                tags: {"$in": tags}
            });
        }
        if (req.query.hasTag) {
            var hasTags = [].concat(req.query.hasTag);
            hasTags.forEach(function(tag) {
                and.push({
                    tags: {"$in": [tag]}
                });
            });
        }
        if (req.query.tagged_by) {
            and.push({
                tagged_by: req.query.tagged_by
            });
        }
        if (!query["$and"].length) query = {};
        console.log(JSON.stringify(query,null,4));
        gear.find(query).toArray()
            .then(function(gear) {
                if (gear) {
                    res.send(gear);
                }
                else {
                    res.sendStatus(404);
                }
            }).catch(function(err) {
                console.log(err);
                res.sendStatus(500);
            });
    });

    app.post('/gear', function(req, res) {
        var new_gear = {
            tagged_on: new Date().getTime(),
            tagged_by: req.body.tagged_by,
            tags: req.body.tags,
            image: req.body.image,
            location: req.body.location
        };
        gear.insert(new_gear)
            .then(function(gear) {
                return gear.ops[0];
            })
            .then(addFeature)
            .then(updateBadges)
            .then(function(gear) {
                res.status(201).json(gear);
            }).catch(function(err) {
                console.log(err);
                res.sendStatus(500);
            });
    });

    app.get('/tags', function (req, res) {
        tags.find().toArray()
            .then(function(tags) {
                res.json(tags);
            })
            .catch(function(err) {
                console.log(err);
                res.sendStatus(500);
            });
    });

    app.post('/tags', function (req, res) {
        var new_tag = {
            _id: req.body._id,
            approved: req.body.approved
        };
        tags.insert(new_tag)
            .then(function(tag) {
                res.status(201).json(tag.ops[0]);
            }).catch(function(err) {
                console.log(err);
                res.sendStatus(500);
            });
    });

    var server = app.listen(3001, function(err) {
        assert.equal(null, err);
        console.log('Listening at http://localhost:3000');
    });

    process.on('SIGINT', function() {
        console.log('Exiting...');
        server.close();
        console.log('Shutdown Express.')
        db.close();
        console.log('Shutdown MongoDB connection.')
        process.exit();
    });

});
