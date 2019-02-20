var express = require('express');
var router = express.Router();
var path = require('path');
var template = require('../lib/template.js');
var db = require('../lib/db');
var auth = require('../lib/auth');
var shortid = require('shortid');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        console.log('destination');
        cb(null, 'uploads/');
    },
    filename: function(req,file,cb){
        console.log('filename');
        cb(null, file.originalname);
    }
})
var upload = multer({storage: storage});
require('date-utils');

router.post(`/goNation`,function(req, res){
    if(!auth.isOwner(req,res)){
        res.redirect('/');
        return false;
    }

    var nationId = shortid.generate();
    var userId=req.user.userId;
    var nation_name = req.body.nation_name;
    db.query(`insert into nation (nation_id,nation_name,userId) values (?,?,?)`,[nationId,nation_name,userId],function(error2, result, fields){
        if(error2){throw error2;}
        res.redirect(`/contents/show/${nationId}`);
    })
});

router.post(`/updatenation`,function(req,res){
    if(!auth.isOwner(req,res)){
        res.redirect('/');
        return false;
    }

    var post = req.body;
    var nationId = post.nationId;
    var nationName = post.nationName;
    db.query(`update nation set nation_name=? where nation_id=?`,[nationName,nationId],function(error, result, fields){
        if(error){throw error;}
        res.redirect(`/contents/show/${nationId}`);
    })
})

router.post(`/deletenation`,function(req,res){
    if(!auth.isOwner(req,res)){
        res.redirect('/');
        return false;
    }

    var post = req.body;
    var nationId = post.nationId;
    db.query(`delete from postings where nationId=?`,[nationId], function (error0, result0) {
        if(error0){throw error0;}
        db.query(`delete from nation where nation_id=?`,[nationId], function (error1, result1) {
            if(error1){throw error1;}
            res.redirect(`/contents/show/`);
        })
    })
})


router.get(`/create`,function(req, res){
    if(!auth.isOwner(req,res)){
        res.redirect('/');
        return false;
    }
    var title = 'CREATE';
    var date = new Date();
    var d = date.toFormat('YYYY/MM/DD HH24:MI:SS');
    db.query(`select * from nation where userId=?`,[req.user.userId],function(err,result){
        if(err) {throw err;}

        var nationlist = [];
        var nationIdlist = [];
        for(var i=0; i<result.length; i++){
            nationlist.push(result[i].nation_name);
            nationIdlist.push(result[i].nation_id);
        }
        var list = template.list(nationlist,nationIdlist);

        var htmls = `
        <form action="/contents/create_process" method="post" enctype="multipart/form-data" id="goposting" class="mainContent clearfix">
            <input type="hidden" name="date" value="${d}">
            <div class="image col-12">
                <input type="text" class="upload-name" value="파일선택" disabled="disabled">
                <label for="imgInp">업로드</label>
                <input type="file" name="file" id="imgInp" class="upload-hidden">
                <img src="" id="foo" style="width:100%; margin-top:10px;">
            </div>
            <p class="post col-12">
                <textarea style="width:100%;" name="posting" placeholder="posting"></textarea>
            </p>
            <p class="submit">
                <select name="nationId" form="goposting">`;
                    var i=0;
                    while(i<result.length){
                        htmls=htmls+`<option value="${result[i].nation_id}">${result[i].nation_name}</option>`;
                        i++;
                    }
                htmls=htmls+`</select>
                <input type="submit">
            </p>
        </form>
        `;
        var html = template.HTML(`<h2>${title}</h2>`,' ',list,htmls,auth.statusUI(req,res));
        res.send(html);
    })
})

router.post(`/create_process`,upload.single('file'),function(req, res){
    console.log('process');
    if(!auth.isOwner(req,res)){
        res.redirect('/');
        return false;
    }

    var post = req.body;
    var id = shortid.generate();
    var userId = req.user.userId;
    var posting = post.posting;
    var date = post.date;
    var nationId = post.nationId;
    var fileName = req.file.originalname;
    db.query(`insert into postings (id, posting, date, filepath, nationId, userId) values (?,?,?,?,?,?)`,[id, posting, date, fileName, nationId, userId],function(error2, result, fields){
        if(error2){throw error2;}
        res.redirect(`/contents/show/${nationId}`);
    })
});

router.get(`/update/:id`,function(req, res){
    if(!auth.isOwner(req,res)){
        res.redirect('/');
        return false;
    }
    var title = 'UPDATE';
    var id = path.parse(req.params.id).base;
    var userId= req.user.userId;
    db.query(`select * from nation where userId=?`,[userId],function(error0,result0){
        if(error0){throw error0;}

        var nationlist = [];
        var nationIdlist =[];
        for(var i=0; i<result0.length; i++){
            nationlist.push(result0[i].nation_name);
            nationIdlist.push(result0[i].nation_id);
        }
        var list = template.list(nationlist,nationIdlist);
        db.query(`select * from postings where id=?`,[id],function(error1, result1, fields){
            if(error1){throw error1}
            var htmls = `<form action="/contents/update_process" method="post" enctype="multipart/form-data" id="goposting" class="mainContent clearfix">
                <input type="hidden" name="id" value="${id}">
                <input type="hidden" name="date" value="${result1[0].date}">
                <div class="image col-12">
                    <input type="text" class="upload-name" value="파일선택" disabled="disabled">
                    <label for="imgInp">업로드</label>
                    <input type="file" name="file" id="imgInp" class="upload-hidden">
                    <img src="${result1[0].filepath}" id="foo" style="width:100%; margin-top:10px;">
                </div>
                <p class="post col-12">
                    <textarea style="width:100%;" name="posting" placeholder="posting">${result1[0].posting}</textarea>
                </p>
                <p class="submit">
                    <select name="nationId" form="goposting">`;
                    var i=0;
                    while(i<result0.length){
                        htmls=htmls+`<option value="${result0[i].nation_id}" ${result1[0].nationId==result0[i].nation_id ? "selected":''}>${result0[i].nation_name}</option>`;
                        i++;
                    }
                    htmls=htmls+`
                    </select>
                    <input type="submit">
                </p>
            </form>`;
            var html=template.HTML(`<h2>${title}</h2>`,' ',list,htmls,auth.statusUI(req,res));
            res.send(html);
        })
    })
})

router.post(`/update_process`,upload.single('file'),function(req, res){
    if(!auth.isOwner(req,res)){
        res.redirect('/');
        return false;
    }

    var post = req.body;
    var id = post.id;
    var posting = post.posting;
    var date = post.date;
    var nationId = post.nationId;
    var fileName = req.file.originalname;

    db.query(`update postings set posting=?, date=?, filepath=?, nationId=? where id=?`,[posting, date, fileName, nationId, id],function(error, result, fields){
            if(error){throw error;}
            res.redirect(`/contents/show/${nationId}`);
    })
});

router.post(`/delete_process`,function(req, res){
    if(!auth.isOwner(req,res)){
        res.redirect('/');
        return false;
    }
    var post = req.body;
    var id = post.id;

    db.query(`select * from postings where id=?`,[id],function(error, result,fields){
        if(error){throw error;}
        var nationId = result[0].nationId;
        db.query(`delete from postings where id=?`,[id], function (error2, result2, fields) {
            if(error2){throw error2;}
            res.redirect(`/contents/show/${nationId}`);
        })
    })
});

router.get(`/show`,function(req, res){
    if(!auth.isOwner(req,res)){
        res.redirect('/');
        return false;
    }
    var title="All";
    var userId = req.user.userId;
    db.query(`select * from nation where userId=?`,[userId],function(err,result){
        if(err){throw err;}

        var nationlist = [];
        var nationIdlist =[];
        for(var i=0; i<result.length; i++){
            nationlist.push(result[i].nation_name);
            nationIdlist.push(result[i].nation_id);
        }
        var list = template.list(nationlist,nationIdlist);
        
        db.query(`select * from postings where userId=?`,[userId],function(err2, result2){
            var postingArray = [];
            var dateArray = [];
            var id = [];
            var fileArray = [];
            for(var i=0; i<result2.length; i++){
                id.push(result2[i].id);
                postingArray.push(result2[i].posting);
                dateArray.push(result2[i].date);
                fileArray.push(result2[i].filepath);
            }
            var contents = template.CONTNETS(postingArray, dateArray,id,fileArray);
            var html =  template.HTML(`<h2 style="color:#753434;">${title}</h2>`,`
                <a class="goPost" href="/contents/create" style="margin-bottom:0; height:40px; line-height: 40px; display: block; text-align: center;">
                    <span><img src="../../images/plus.png" style="width:20px;"></span>
                    추가글 작성하기
                </a>`,list,contents,auth.statusUI(req,res));
            res.send(html);
        })

    })
})

router.get(`/show/:nationId`,function(req, res){
    if(!auth.isOwner(req,res)){
        res.redirect('/');
        return false;
    }
    var nationId = path.parse(req.params.nationId).base;
    var userId = req.user.userId;
    var id = [];
    var postingArray = [];
    var dateArray = [];
    var fileArray = [];
    db.query(`select * from nation where userId=?`,[userId],function(error0,result0){
        if(error0){throw error0;}
        db.query(`select * from nation where nation_id=?`,[nationId], function (error1, result1) {
            if(error1){throw error1;}
            db.query(`select * from postings where nationId=? and userId=?`,[nationId,userId],function(error2,result2){
                if(error2){throw error2;}
                //메뉴
                var nationlist = [];
                var nationIdlist=[];
                for(var i=0; i<result0.length; i++){
                    nationlist.push(result0[i].nation_name);
                    nationIdlist.push(result0[i].nation_id);
                }
                var list = template.list(nationlist,nationIdlist);
                //타이틀
                var title = result1[0].nation_name;
                //내용
                for(var i=0; i<result2.length; i++){
                    id.push(result2[i].id);
                    postingArray.push(result2[i].posting);
                    dateArray.push(result2[i].date);
                    fileArray.push(result2[i].filepath);
                }
                var contents = template.CONTNETS(postingArray, dateArray,id,fileArray);
                var html =  template.HTML(
                    `<div  class="updatebtn1" style="display: none;">
                    <form action="/contents/updatenation" method="post" >
                        <input type="hidden" name="nationId" value="${nationId}">
                        <input type="text" name="nationName" value="${title}">
                        <input type="submit" value="변경" class="submit">
                    </form>
                    <form action="/contents/deletenation" method="post">
                        <input type="hidden" name="nationId" value="${nationId}">
                        <input type="submit" value="삭제" class="submit">
                    </form>
                    </div>
                        <h2 style="color:#753434;" class="title">${title}<img src="../../images/gear.png" class="updatebtn0" style="width:15px;cursor:pointer;"></h2>`,`
                    <a class="goPost" href="/contents/create" style="margin-bottom:0; height:40px; line-height: 40px; display: block; text-align: center;">
                        <span><img src="../../images/plus.png" style="width:20px;"></span>
                        추가글 작성하기
                    </a>`,list,contents,auth.statusUI(req,res));
                res.send(html);
            })
        })
    })
})


module.exports = router;
