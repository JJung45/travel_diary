var db = require('../lib/db');
var alert =require('alert-node');
var bcrypt = require('bcrypt');
var shorid = require('shortid');

module.exports = function (app){

    var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        console.log('serialize',user);
        done(null, user.userId);
    });

    passport.deserializeUser(function(id, done) {
        console.log('deserialize',id);
        db.query(`select * from user where userId=?`,id,function(err,result){
            done(null, result[0])
        })
    });

    passport.use(new LocalStrategy({
        usernameField: 'userId',
        passwordField: 'userPw'
    },
    function(userId, userPw, done) {
        console.log('LocalStrategy',userId, userPw);
        db.query(`select * from user where userId=?`,[userId],function(err,result){
            if(result[0]!==undefined){
                bcrypt.compare(userPw,result[0].userPw,function(err, result2){
                    if(result2){
                        console.log('성공',result[0]);
                        return done(null, result[0]);
                    }else{
                        alert('비밀번호를 다시 확인하세요.');
                        return done(null, false);
                    }
                })
            }else{
                alert('아이디를 다시 확인하세요.');
                return done(null, false);
            }
        })
    }
    ));

    var googleInfo = require('../config/google.json');
    passport.use(new GoogleStrategy({
        clientID: googleInfo.web.client_id,
        clientSecret: googleInfo.web.client_secret,
        callbackURL: googleInfo.web.redirect_uris[0]
      },
      function(accessToken, refreshToken, profile, done) {
        var email= profile.emails[0].value;
        db.query('select * from user where userEmail=?',[email],function(err,result3){
            if(result3[0]!==undefined){
                db.query('update user set googleId=? where userId=?',[profile.id,result3[0].userId],function(err,result4){
                    done(null, result3[0]);
                })
            }else{
                db.query(`insert into user (userId, userPw, userEmail, userName, googleId) values (?,?,?,?,?)`,[shorid.generate(),'//',email,'//',profile.id],function(err,result5){
                    done(null, result3[0]);
                });
            }
        })
      }
    ));

    app.get('/auth/google',
    passport.authenticate('google', { 
        scope: ['https://www.googleapis.com/auth/plus.login','email'] 
    }));

    app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/contents/show/');
  });

    return passport;
}