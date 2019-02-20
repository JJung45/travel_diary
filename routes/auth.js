var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var db = require('../lib/db');
var bcrypt = require('bcrypt');
var alert =require('alert-node');

module.exports=function (passport){

router.post('/login_process',
passport.authenticate('local', { successRedirect: '/contents/show',
                                   failureRedirect: '/' }));

router.get('/register',function(req,res){ 
  var html = template.HTML('','','',
  `<div id="indeximage">
      <div class="index_wrap">
        <div class="register_content">
        <div class="title">
          <p class="title_main">Join this trip!</p>
        </div>
        <div class="register">
          <form action="/auth/register_process" method="post">
            <p><input type="text" name="userId" placeholder="id"></p>
            <p><input type="password" name="userPw" placeholder="password"></p>
            <p><input type="password" name="userPw2" placeholder="password"></p>
            <p><input type="text" name="userName" placeholder="name"></p>
            <p><input type="email" name="userEmail" placeholder="email"></p>
            <input type="submit" value="Join">
          </form>
        </div>
      </div>
      </div>
   </div>`,'');
res.send(html);
})

router.post(`/register_process`,function(req, res){
    var post = req.body;
    var userId = post.userId;
    var userPw = post.userPw;
    var userPw2 = post.userPw2;
    var userEmail = post.userEmail;
    var userName = post.userName;

    bcrypt.hash(userPw, 10, function(err, hash){
        db.query('select * from user where userEmail=?',[userEmail],function(err,result){
            if(result[0]!==undefined){
                db.query('update user set userPw=?,userName=? where userId=?',[hash,userName,result[0].userId],function(err,result4){
                    return res.redirect('/contents/show/');
                })
            }else{
                var user = {
                    userId: userId,
                    userPw: hash,
                    userEmail: userEmail,
                    userName: userName
                }
                db.query(`select * from user where userId=?`,[userId],function(error2, result, fields){
                    if(result[0]!==undefined){
                        alert('중복된 아이디값입니다.');
                        res.redirect('./register');  
                    } else if(userPw!==userPw2){
                        alert('두 패스워드가 일치하지 않습니다.');
                        res.redirect('./register'); 
                    }else{
                        db.query(`insert into user (userId, userPw, userEmail, userName, googleId) values (?,?,?,?,?)`,[user.userId, user.userPw, user.userEmail, user.userName,null],function(error2, result, fields){
                            if(error2){throw error2;}
                            req.login(user,function(err2){
                                return res.redirect('/contents/show/');
                            })
                        })
                    }
                })
            }
        })

    });
});

router.get('/logout_process',function(req,res){
    req.logout();
    req.session.save(function(err){
        res.redirect('/');
    })
})

return router;
}
