module.exports = {
    HTML: function(subtitle,gopost,list,contents,owner){
        return `
        <!doctype html>
        <html>
        <head>
            <title>trvaelDiary</title>
            <meta charset="utf-8">
            <link rel="stylesheet" href="/stylesheets/style.css">
            <script src="http://code.jquery.com/jquery.min.js"></script>
            <script type="text/javascript" src="/javascripts/javascript.js"></script>
        </head>
        <body>
        <div id="wrap">
            <div class="gnb">
                <ul class="menu">
                    <div>
                        <div class="goNation" style="line-height:40px;"><span><img src="../../images/plus.png" style="width:20px;"></span>New Nation
                            <form action="/contents/goNation" method="post" id="goNation">
                                <p><input type="text" name="nation_name" placeholder="나라이름" style="padding:10px 10px;"></p>
                                <p><input type="submit" style="width:85%" value="추가"></p>
                            </form>
                        </div>
                    </div>
                    ${list}
                    <a href="/auth/logout_process" class="logout">Logout</a>
                </ul>
            </div>
            <div class="content">
                <div class="header">
                    <h1>Travel Diary</h1>
                    ${subtitle}
                    <a href="#" class="owner">hello, ${owner} ! <img src="../../images/smile.png" style="width: 20px;"> </a>
                    <div class="menu_button">
                        <span class="menubtn_img">메뉴열기</span>
                    </div>
                </div>
                <div class="main">
                    ${gopost}
                    <ul>
                    ${contents}
                    </ul>
                </div>
            </div>
        </div>
        </body>
        </html>
        `;
    },list: function(nationlist,nationIdlist){
        var list = `<li><a href="/">= 모아보기 =</a></li>`;
        var i=0;
        while(i<nationIdlist.length){
            list=list+`<li><a href="/contents/show/${nationIdlist[i]}">${nationlist[i]}</a></li>`;
            i++;
        }
        return list;
    },CONTNETS: function(post, date, id, filepath){
        var i =0;
        var body = ``;
        while(i<post.length){
        body=body+`
        <li class="mainContent col-6">
            <div class="image col-12">
                <img src="./${filepath[i]}" style="width:100%;">
            </div>
            <div class="post col-12">
                ${post[i]}
            </div>
            <div class="sidemenu col-4" style="padding: 0 0 0 10px;">
                <a href="/contents/update/${id[i]}" style="margin-right: 10px;">update</a>
                <form action="/contents/delete_process" method="post">
                    <input type="hidden" name="id" value="${id[i]}">
                    <input type="submit" value="delete" class="delete">
                </form>
            </div>
            <p class="col-8 date" style="padding-right: 10px;">written in ${date[i]}</p>
        </li>`;
        i++;
        }

        return body;
    }
}