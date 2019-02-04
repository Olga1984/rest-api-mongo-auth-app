var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var News = require('../models/newsschema');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Register User

//http://localhost:3000/register
router.post('/register', function(req, res){
    var password = req.body.password;
    var password2 = req.body.password2;

    if (password == password2){
        var newUser = new User({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });

        User.createUser(newUser, function(err, user){
            if(err) throw err;
            res.send(user).end()
        });
    } else{
        res.status(500).send("{erros: \"Passwords don't match\"}").end()
    }
});


// Using LocalStrategy with passport
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});


// Endpoint to login
router.post('/login',
    passport.authenticate('local'),
    function(req, res) {
   // console.log(req.user);
        res.send(req.user);
    }
);

// Endpoint to get current user
router.get('/user', function(req, res){
    res.send(req.user);
})


// Endpoint to logout
router.get('/logout', function(req, res){
    req.logout();
    res.send(null)
});

var FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
        clientID: "145658462755484",
        clientSecret: "ed6555b4e3c8b42764659a2b9c861825",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile)
        User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
            if (err) return done(err);
            if (user) return done(null, user);
            else {
                // if there is no user found with that facebook id, create them
                var newUser = new User();

                // set all of the facebook information in our user model
                newUser.facebook.id = profile.id;
                newUser.facebook.token = accessToken;
                newUser.facebook.name  = profile.displayName;
                if (typeof profile.emails != 'undefined' && profile.emails.length > 0)
                    newUser.facebook.email = profile.emails[0].value;

                // save our user to the database
                newUser.save(function(err) {
                    if (err) throw err;
                    return done(null, newUser);
                });
            }
        });
    }
));

router.get('/auth/facebook',
    passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        //console.log(req.user)
        res.redirect('/');
    }
);

const CanCan = require('cancan');
const cancan = new CanCan();
const {allow, can} = cancan;

allow(User, ['view', 'edit'], News, (user)=>!!user._id);
const news = new News();

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
    News.create(req.body).then((news)=> {
        res.send(news);
    }).catch(next);
});

//http://localhost:3000/api/news/5c57576fc1f92c1f54e783c3
router.put('/news/:id', function (req, res, next) {
    if (req.params.id === '0') {
        next('route');
    } else {
        next();
    }
}, function (req, res, next) {
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
    if(can(req.user, 'edit', news)) {
    News.findByIdAndRemove({_id: req.params.id}).then((news)=> {
        res.send(news);
    }).catch(next);
} else {
        res.status(403).send("{errors: \"Unauthorized to edit this news\"}").end()
    }
});

module.exports = router;
