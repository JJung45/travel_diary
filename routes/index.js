var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var auth = require('../lib/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(auth.isOwner(req,res)){
    res.redirect('./contents/show');
  }
  var html = template.HTML('','','',
    `<div id="indeximage">
        <div class="index_wrap">
          <div class="index_content">
          <div class="title">
            <p class="title_main">Travel Diary</p>
            <p class="title_sub">Start your travel footsteps!</p>
          </div>
          <div class="login">
            <form action="/auth/login_process" method="post">
              <p><input type="text" name="userId" placeholder="id"></p>
              <p><input type="password" name="userPw" placeholder="password"></p>
              <input type="submit" value="Login" style="margin-bottom: 0;">
            </form>
          </div>
          <div class="join">
            <a href="/auth/register">join member</a>
          </div>
        </div>
        <div class="otherLogin">
            <div class="col-12" style="background: #fbbc05; margin-bottom:10px;"><a href="/auth/google">Google Login</a></div>
        </div>
        </div>
     </div>`,'');
  res.send(html);
});

module.exports = router;
