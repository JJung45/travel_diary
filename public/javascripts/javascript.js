$(window).on('load', function() {

        var currentWidth = $(window).outerWidth();
        var currentHeight = $(window).outerHeight();
        var indexWidth= $(".index_wrap").width();
        var indexHeight= $(".index_wrap").height();
        var centerX=(currentWidth/2)-(indexWidth/2);
        var centerY=(currentHeight/2)-(indexHeight/2);
        $('.index_wrap').css({
            'top':centerY,
            'left':centerX
        });

    //index background
    var link = document.location.href;
    var para = link.split("2018");
    console.log(para[1]);
    if(para[1] == '/' || para[1] == '/auth/register'){
        $('.menu_button').hide();
        $('.header').hide();
        $('#indeximage').css('background-image','url("../images/indexback_'+Math.floor(Math.random()*3)+'.jpg")');
    }else{
        $('.menu_button').show();
        $('.header').show();
    }

    //hanburger menu 클릭시 메뉴 보임
    var clickcount = 0;
    $(".menubtn_img").on("click",function(){
        if(clickcount==0){
            $(".gnb").show();
            $(".gnb").animate({
                left:"+=200px"
            },500,function(){});  
            $(".content").animate({
                left: "+=200px",
            },500,function(){});
            clickcount=1;
        }else{
            $(".gnb").animate({
                left:"-=200px"
            },500,function(){});
            $(".content").animate({
                left: "-=200px",
            },500,function(){
                $(".gnb").hide();
            });
            clickcount=0;
        }
    });

    //gnb
    $(".menu>li").hover(
    function(){
        $(this).find('ul').show();
    },function(){
        $(this).find('ul').hide();
    })

    $(".goNation").hover(
        function(){
            $("#goNation").show();
        },function(){
            $("#goNation").hide();
        })

    //file미리보기
    function readURL(input){
        if(input.files && input.files[0]){
            var reader = new FileReader();
            reader.onload=function(e){
                $('#foo').attr('src',e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $('#imgInp').change(function(){
        readURL(this);
    })

    //file 디자인
    var fileTarget = $('.image .upload-hidden');

    fileTarget.on('change',function(){
        if(window.FileReader){
            var filename = $(this)[0].files[0].name;
        }else{
            var filename = $(this).val().split('/').pop().split('\\').pop();
        }

        $(this).siblings('.upload-name').val(filename);
    })

    //나라 업데이트
    var updatebtn0 = $('.updatebtn0');
    var updatebtn1 = $('.updatebtn1');

    updatebtn0.on('click',function(){
        $('.title').hide();
        updatebtn1.show();
    })

})