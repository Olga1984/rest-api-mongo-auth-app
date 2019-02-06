var express = require('express');
var router = express.Router();
var User = require('../models/user');
var News = require('../models/newsschema');
const CanCan = require('cancan');
const cancan = new CanCan();
const {allow, can} = cancan;

allow(User, ['view', 'edit','delite'], News, (user)=>!!user._id);
//const news = new News();

//http://localhost:3000/api/news
router.get('/news', function (req, res, next) {
    News.find({}).then((news)=> {
        res.send(news);
    }).catch(next);
});

//http://localhost:3000/api/news/5c575767c1f92c1f54e783c2
router.get('/news/:id', function (req, res, next) {
    if (req.params.id === '0') {
        next('route');
    } else {
        next();
    }
}, function (req, res, next) {
    News.findOne({_id: req.params.id}).then(function(news){
        res.send(news).catch(next);
    });
});

//http://localhost:3000/api/news
router.post('/news', function (req, res, next) {
    const news = new News();
    if(can(req.user, 'edit', news)) {
    News.create(req.body).then((news)=> {
        res.send(news);
    }).catch(next);
    }else {
        res.status(403).send("{errors: \"Unauthorized to edit this news\"}").end()
    }
});

//http://localhost:3000/api/news/5c57576fc1f92c1f54e783c3
router.put('/news/:id', function (req, res, next) {
    if (req.params.id === '0') {
        next('route');
    } else {
        next();
    }
}, function (req, res, next) {
    const news = new News();
    if(can(req.user, 'edit', news)) {
        News.findByIdAndUpdate({_id: req.params.id}, req.body).then(function () {
            News.findOne({_id: req.params.id}).then(function (news) {
                res.send(news).catch(next);
            });
        });
    } else {
        res.status(403).send("{errors: \"Unauthorized to edit this news\"}").end()
    }
});

//http://localhost:3000/api/news/5c57576fc1f92c1f54e783c3
router.delete('/news/:id', function (req, res, next) {
    if (req.params.id === '0') {
        next('route');
    } else {
        next();
    }
}, function (req, res, next) {
    const news = new News();
    if(can(req.user, 'delite', news)) {
        News.findByIdAndRemove({_id: req.params.id}).then((news)=> {
            res.send(news);
        }).catch(next);
    } else {
        res.status(403).send("{errors: \"Unauthorized to edit this news\"}").end()
    }
});

module.exports = router;