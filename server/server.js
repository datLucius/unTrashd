var path = require('path');
var express = require('express');
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var bodyParser = require('body-parser');
var request = require('superagent');
var Promise = require('bluebird');
var badges = require('./badges');

var MONGO_URL = 'mongodb://localhost:27017/untrashd';
var GIS_URL = "http://tela.roktech.net/arcgis/rest/services/Demos/fishackathonGhostGearBusters/FeatureServer/0/applyEdits";

function addFeature(gear) {
    console.log(gear);
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

MongoClient.connect(MONGO_URL, function(err, db) {
    assert.equal(null, err);
    console.log("Connected to mongoDb");

    var users = db.collection('users'),
        gear = db.collection('gear'),
        tags = db.collection('tags');

    var app = express();

    var updateBadges = function(gear) {
        return gear;
    }

    var getUserStats = function (user) {
        return {};
    }

    app.use(bodyParser.json());

    app.get('/users/:user_name', function(req, res) {
        var p_user = users.findOne({_id: req.params.user_name});
        p_user.then(function(user) {
            if (user) {
                getUserStats(user);
                Object.assign(user, stats);
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

    app.get('/gear/users/:id', function(req, res) {
        gear.find({tagged_by: req.params.id}).toArray()
            .then(function(gear) {
                if (gear) {
                    res.send(gear);
                }
                else {
                    res.sendStatus(404);
                }
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
            image_name: req.body.image_name,
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

    var server = app.listen(3000, function(err) {
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
