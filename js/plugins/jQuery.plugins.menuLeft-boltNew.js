(function($){
    $.fn.menuLeftBolt=function (options1,getData) {
        if (arguments.length === 1) {
            getData=options1;
            options1={callback:{}};
        }
        var options0={
            selected:null,
            menuOpen:true,
            hideFloat:true,
            shrink:0,
            title:{
                enabled:false,
                class:"",
                content:""
            },
            callback:{}
        }
        var options=$.extend(true,{},options0,options1);
        var data=$.isFunction(getData) ? getData() : getData;
        var first=true;//初始化时禁止部分操作
        var secondTop,secondHeight;//保存menuOpen=false时，二级菜单初始化的定位和高度
        var menuOpen=options.menuOpen;
        /* 绘制菜单数据项 */
        function drawMenu(item){
            if(item==data){//绘制一级菜单
                var itemChild=item;
                var oneLevel=true;
            }else{
                var itemChild=item.children;
                var oneLevel=false;
            }
            if(itemChild.length==0&&!oneLevel){
                return '';
            }else{
                var listString='<ul>'+ 
                (function(){
                    var listString="";
                    itemChild.map(function(item,index){
                        let param=JSON.stringify(item.param)?JSON.stringify(item.param):'{}';
                        listString+=item.children.length > 0? 
                        '<li data='+item.id+' class='+'notSec'+'><a href="'+item.href+'" param='+param+'><div class="'+(item.hasOwnProperty("class")&&item.class.length>0?'menu-app '+item.class:'')+'"></div><span>'+item.name+'</span></a>'+
                        drawMenu(item)
                        +'</li>'
                        :
                        '<sec:authorize class='+'sec'+' url="'+(item.hasOwnProperty("secUrl")?item.secUrl:'')+'"><li data='+item.id+'><a href="'+item.href+'" param='+param+'><div class="'+(item.hasOwnProperty("class")&&item.class.length>0?'menu-app '+item.class:'')+'"></div><span>'+item.name+'</span></a>'+
                        drawMenu(item)
                        +'</li></sec:authorize>';
                    })
                    return listString;
                })()
                +
                '</ul>';
                return listString;
            }
        }
        /* 收缩事件 */
        var hasChildArr=[];
        $(document).on("click",".bolt-menu-arrow .fa-indent,.cloud-shrink1-L",function(){
            menuOpen=false;
            $(".menuLeftBolt .title>div>span").css("display","none");
            $(".bolt-sidebar>ul>li>a>span,.bolt-sidebar>ul>.sec>li>a>span").css("display","none");
            if(options.shrink==0){
                $(".menuLeftBolt .title").css("width","64px");
                $(".menuLeftBolt").css("width","64px");
                $(".bolt-menu-arrow").css("width","64px");

                $(this).removeClass("fa-indent");
                $(this).addClass("fa-outdent");
            }else{
                $(".menuLeftBolt .title").css("width","0px");
                $(".menu-app-img").hide();
                $(".menuLeftBolt").css("width","0px");
                $(".bolt-menu-arrow").css("width","0px");

                $(this).removeClass("cloud-shrink1-L");
                $(this).addClass("cloud-shrink1-R");
            }
           
            var $LIs = $('.bolt-sidebar').find('.selectedLi');
                $LIs.parents(".hasChild").addClass('active');
            $(".bolt-sidebar>.acc-menu>li").each(function(){
                if($(this).hasClass("hasChild")){
                    $(this).removeClass("hasChild open");
    
                    $(this).children(".acc-menu").addClass("floatRight2");
                    $(this).children(".acc-menu").css("display","none");
                    hasChildArr.push($(this));
                }
            });

            $(".bolt-sidebar>ul.acc-menu ul.acc-menu li").each(function(){
                $(this).children(".acc-menu").removeClass("floatRight3");
            });
            if(!first&&options.callback.hasOwnProperty("onCollapse")){
                options.callback.onCollapse(options.shrink);
            }
        });
        $(document).on("click",".bolt-menu-arrow .fa-outdent,.cloud-shrink1-R",function(){
            menuOpen=true;
            $(".menuLeftBolt .title>div>span").css("display","inline");
            $(".bolt-sidebar ul li span").css("display","inline");
            if(options.shrink==0){
                $(".menuLeftBolt .title").css("width","215px");
                $(".menuLeftBolt").css("width","215px");
                $(".bolt-menu-arrow").css("width","215px");
   
                $(this).removeClass("fa-outdent");
                $(this).addClass("fa-indent");             
            }else{
                $(".menuLeftBolt .title").css("width","186px");
                $(".menu-app-img").show();
                $(".menuLeftBolt").css("width","186px");
                $(".bolt-menu-arrow").css("width","186px");

                $(this).removeClass("cloud-shrink1-R");
                $(this).addClass("cloud-shrink1-L");
            }
    
            $(".bolt-sidebar>.acc-menu>li").each(function(){
                $(this).children(".acc-menu").removeClass("floatRight2");
            });
            $(".bolt-sidebar>ul.acc-menu ul.acc-menu li").each(function(){
                if($(this).hasClass("hasChild")){
                    $(this).children(".acc-menu").addClass("floatRight3");
                    $(this).removeClass("open");
                }
            });
    
            hasChildArr.map(function($this){
                $this.addClass("hasChild");
            });
            hasChildArr=[];
            var $LIs = $('.bolt-sidebar').find('.selectedLi');
                $LIs.parents(".hasChild").not(".second").removeClass('active');
            $(".treeview.hasChild.selectedFirst").addClass("open").children(".acc-menu").css("display","block");//向右边展开时展开选中二级的父级
            if(options.callback.hasOwnProperty("onExpand")){
                options.callback.onExpand(options.shrink);
             }
        });
        if(options.title.enabled){
            var menuLeftDiv=' <div class="title">'+
                                '<div>'+
                                    '<div class="menu-app-img ' + options.title.class + '"></div>'+
                                    '<span class="menu-app-text">'+options.title.content+'</span>'+
                                '</div>'+
                            '</div>';
        }else{
            var menuLeftDiv="";
        }
        menuLeftDiv+='<nav class="bolt-sidebar" role="navigation">'+drawMenu(data)+
                        '<div class="cloud-shrink1-L shrink-moved">'+
                            '<img class="collapse-background" src="../img/plugins/menuLeft/leftbar-background.png"/>'+
                            '<img class="collapse-arrow" src="../img/plugins/menuLeft/leftbar-arrow.png"/>'+
                        '</div>'+
                    '</nav>'+
                    '<div class="bolt-menu-arrow">'+
                        '<img class="fa-indent" src="../img/plugins/menuLeft/indent.png"/>'+
                    '</div>';
        /* 初始化组件 */
        $(this).empty().addClass("menuLeftBolt").append(menuLeftDiv);
        $(".bolt-sidebar>ul>li,.bolt-sidebar>ul>.sec>li").addClass("first");
        $(".bolt-sidebar>ul>li>ul>li,.bolt-sidebar>ul>li>ul>.sec>li").addClass("second");
        $(".bolt-sidebar>ul>li>ul>li>ul>li,.bolt-sidebar>ul>li>ul>li>ul>.sec>li").addClass("three");
        
        if(options.shrink==1){
            $(".bolt-menu-arrow").hide();

            $(".shrink-moved").show();

        }else if(options.shrink==2){
            $(".bolt-menu-arrow").hide();
        }
        /* 确定导航滚动部分的高度 */
        if(options.title.enabled && options.shrink==0){
            $(".bolt-sidebar").addClass("bolt-sidebar-three");
        }else if(!options.title.enabled&&options.shrink==0){
            $(".bolt-sidebar").addClass("bolt-sidebar-twoDown");
        }else if(options.title.enabled&&options.shrink!=0){
            $(".bolt-sidebar").addClass("bolt-sidebar-twoTop");
        }else{
            $(".bolt-sidebar").addClass("bolt-sidebar-one");
        }
        if(options.shrink==1){
            $(".menuLeftBolt").addClass("bolt-options-shrink1");
        }
        /*  左侧菜单 */
        $(".bolt-sidebar ul").addClass("acc-menu scrollBox");
        $(".bolt-sidebar>ul>li").addClass("treeview");
        $(".bolt-sidebar>ul>.sec>li").addClass("treeview");
        $(".bolt-sidebar ul ul ul").addClass("floatRight3");
        var liHasUlChild = $('li').filter(function () {
            return $(this).find('ul.acc-menu').length;
        });
        $(liHasUlChild).addClass('hasChild');
        /* 默认选中项高亮 */
        if(menuOpen){
            $('[data='+options.selected+']').addClass("active selectedLi")/* .parents(".bolt-sidebar li").addClass("active selectedLi").end() */.parents(".bolt-sidebar>ul>li>ul").css("display","block");
            $('[data='+options.selected+']').closest('li.treeview').addClass('selectedFirst');
            if ($('[data='+options.selected+']').parents(".floatRight3").length > 0){
                $('[data='+options.selected+']').closest("ul").parent("li").addClass("active");
            }
        }else{
            $('[data='+options.selected+']').addClass("active selectedLi")/* .parents(".bolt-sidebar li").addClass("active selectedLi") */;
            $('[data='+options.selected+']').closest('li.treeview').addClass('selectedFirst');
            if(options.shrink==0){
                $(".bolt-menu-arrow .fa-indent").click();
            }else{
                $(".cloud-shrink1-L").click();
            }
        }
        if(options.callback.hasOwnProperty("onClick")){
            options.callback.onClick($('[data='+options.selected+']').children("a"),JSON.parse($('[data='+options.selected+']').children("a").attr("param")));
         }
        first=false;
         /* 点击事件 */
         $('body').on('click', '.bolt-sidebar ul.acc-menu a', function () {
             $(this).closest('li').addClass('clicked');
             var LIs = $(this).closest('ul.acc-menu').find('li');
             $.each(LIs, function (i) {
                 if ($(LIs[i]).hasClass('clicked')) {
                     $(LIs[i]).removeClass('clicked');
                     return true;
                 }
                 if ($(this).children('.acc-menu').children().length > 0) $(LIs[i]).find('ul.acc-menu:visible').slideToggle(200);
                 $(LIs[i]).removeClass('open');
             });
             if ($(this).siblings('ul.acc-menu:visible').length > 0){//点击收缩
                    $(this).closest('li').removeClass('open');
                    var $LIs = $('.bolt-sidebar').find('.selectedLi');
                    $LIs.parents(".hasChild").addClass('active');

             }else if($(this).closest('li').hasClass("hasChild")){//点击展开
                 $(this).closest('li').addClass('open');
                if($(this).next().find('.selectedLi').length>0){
                    var $LIs = $('.bolt-sidebar').find('.selectedLi');
                    $LIs.parents(".hasChild").not(".second").removeClass('active');
                }else{
                    var $LIs = $('.bolt-sidebar').find('.selectedLi');
                    $LIs.parents(".hasChild").addClass('active');
                }
             }else{//单击叶子菜单
                 var LIs = $(this).closest('.bolt-sidebar').find('li');
                 $.each(LIs, function (i) {
                     $(LIs[i]).removeClass('active');
                     $(LIs[i]).removeClass('selectedLi');
                     $(LIs[i]).removeClass('selectedFirst');
                 });
                 $(this).closest('li').addClass('active');

                $(this).closest('li').addClass('selectedLi');
                $(this).closest('li.treeview').addClass('selectedFirst');
                if($(this).parents(".floatRight2").length > 0){
                    $(this).parents(".hasChild").addClass("active");
                    $(this).parents(".treeview").addClass("active"); 
                }
                if($(this).parents(".floatRight3").length > 0){
                    $(this).closest("ul").parent("li").addClass("active");
                }
               
                 if(options.hideFloat){
                    $(this).closest(".floatRight3").css("display","none");
                    $(this).closest(".floatRight2").css("display","none");
                 }
                 if(options.callback.hasOwnProperty("onClick")){
                    options.callback.onClick($(this),JSON.parse($(this).attr("param")));
                 }
             }
             var $this=$(this);
             if ((menuOpen&&$(this).is(".bolt-sidebar>ul.acc-menu>li>a")||!menuOpen&&$(this).is(".bolt-sidebar>ul.acc-menu>li>ul>li>a"))&&$(this).next('.acc-menu').children().length > 0) {
                $(this).siblings('ul.acc-menu').slideToggle({
                    duration: 200,
                    progress: function () {
                        if ($(this).closest('li').is(":last-child")) { //only scroll down if last-child
                            //$(".bolt-sidebar>ul").animate({scrollTop: $(".bolt-sidebar>ul").height()}, 0);
                        }
                    },
                    complete: function () {
                        if(!menuOpen&&$this.is(".bolt-sidebar>ul.acc-menu>li>ul>li>a")){
                            var navH=$(".bolt-sidebar").height() + $(".menuLeftBolt .title").height();
                            if($this.next(".acc-menu").length>0){
                                var liTop=$this.closest(".acc-menu").prev("a").position();
                                var liH=44;
                                if($this.next(".acc-menu").css("display")=="block"){
                                    var ulH=$this.closest(".acc-menu").height();
                                }else{
                                    var ulH=$this.closest(".acc-menu").children().length*liH;
                                }
                                if(ulH>=navH-liH){
                                    $this.closest(".acc-menu").css({"top":liH,"height":navH-liH});
                                }else if(liTop.top+ulH>navH){
                                    var count=Math.floor((liTop.top+ulH-navH)/liH);
                                    $this.closest(".acc-menu").css({"top":liTop.top-liH*count,"height":"auto"});
                                }else{
                                    $this.closest(".acc-menu").css({"top":liTop.top,"height":"auto"});
                                }
                            }
                        }
                    }
                });
             }else if(!menuOpen&&$(this).is(".bolt-sidebar>ul.acc-menu>li>ul>li>a")){
                $this.closest(".acc-menu").css({"top":secondTop,"height":secondHeight});//菜单收缩时,三级菜单收缩后重绘父级(二级)ul的top和height
             }
         });
         /* 移入移出事件 */
         $('body').on('mouseenter','.bolt-sidebar ul.acc-menu li a',function(){ 
             if(!menuOpen&&($(this).is(".bolt-sidebar>ul.acc-menu>li>a")||$(this).is(".bolt-sidebar>ul.acc-menu>.sec>li>a"))){
                 var navH=$(".bolt-sidebar").height() + $(".menuLeftBolt .title").height();
                 if($(this).next(".acc-menu").length>0&&$(this).next(".acc-menu").css("display")=="none"){
                     var liTop=$(this).position();
                     var liH=$(this).parent().height();
                     var ulH=$(this).next(".acc-menu").children().length*liH;
                     if(ulH>=navH-liH){
                         $(this).next(".acc-menu").css({"top":liH,"height":navH-liH});
                     }else if(liTop.top+ulH>navH){
                         var count=Math.floor((liTop.top+ulH-navH)/liH);
                         $(this).next(".acc-menu").css({"top":liTop.top-liH*count,"height":"auto"});
                     }else{
                         $(this).next(".acc-menu").css({"top":liTop.top,"height":"auto"});
                     }
                     secondTop=$(this).next(".acc-menu").css("top");
                     secondHeight=$(this).next(".acc-menu").css("height");
                 }
     
                 if($(this).next(".acc-menu").css("display")=="none"){//三级菜单隐藏
                     $(".bolt-sidebar>ul.acc-menu ul.acc-menu .acc-menu").css("display","none");
                     $(".bolt-sidebar>ul.acc-menu ul.acc-menu li").removeClass("open");
                 }

                 $(this).closest(".acc-menu").children("li").children(".acc-menu").css("display","none");//二级菜单隐藏
                 $(this).next(".acc-menu").css("display","block");
             }else if(menuOpen&&$(this).is(".bolt-sidebar>ul.acc-menu>li>a")){
                 $(".bolt-sidebar>ul.acc-menu ul.acc-menu .acc-menu").css("display","none");//三级菜单隐藏
             }else if(menuOpen&&$(this).is(".bolt-sidebar>ul.acc-menu ul.acc-menu a")){
                 var navH=$(".bolt-sidebar").height() + $(".menuLeftBolt .title").height();
                 if($(this).next(".acc-menu").length>0){
                     var liTop=$(this).position();
                     var liH=$(this).parent().height();
                     var ulH=$(this).next(".acc-menu").height();
                     if(ulH>=navH-liH){
                         $(this).next(".acc-menu").css({"top":liH,"height":navH-liH});
                     }else if(liTop.top+ulH>navH){
                         var count=Math.floor((liTop.top+ulH-navH)/liH);
                         $(this).next(".acc-menu").css({"top":liTop.top-liH*count,"height":"auto"});
                     }else{
                         $(this).next(".acc-menu").css({"top":liTop.top,"height":"auto"});
                     }
                 }
     
                 $(this).closest(".acc-menu").find(".acc-menu").css("display","none");
                 $(this).next(".acc-menu").css("display","block");
             }
         });
         $('body').on('mouseleave','.bolt-sidebar',function(){ 
             if(!menuOpen){
                 $(".acc-menu .acc-menu").css({"display":"none","height":"auto"});
             }else{
                 $(".acc-menu .acc-menu .acc-menu").css("display","none");
             }
         });
         //返回对象事件
        var menuLeftTools={
            updateTitle:function(title){
                $(".menuLeftBolt .title .menu-app-img").attr("class","menu-app-img " + title.class);
                $(".menuLeftBolt .title .menu-app-text").text(title.content);
            }
        }
        return menuLeftTools;
     }
 })(jQuery)