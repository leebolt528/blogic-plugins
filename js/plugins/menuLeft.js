 (function($){
    $.fn.menuLeft=function (options1,getData) {
        if (arguments.length === 1) {
            getData=options1;
            options1={callback:{}};
        }
        var options0={
            menuOpen:true,
            hideFloat:true,
            callback:{}
        }
        var options=$.extend(true,{},options0,options1);
        var data=getData();
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
                        listString+='<li data='+item.id+'><a href="'+item.href+'"><i class="fa '+item.fa+'"></i><span>'+item.name+'</span></a>'+
                        drawMenu(item);
                        +'</li>'
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
        $(document).on("click",".iot-menu-arrow .fa-indent",function(){
            menuOpen=false;
            $(".iot-sidebar>ul>li>a>span").css("display","none");
            $(".iot-sidebar").css("width","50px");
            $(".iot-menu-arrow").css("width","50px");
            $(this).removeClass("fa-indent");
            $(this).addClass("fa-outdent");
            //$(".iot-content").css("margin-left","50px");
    
            $(".iot-sidebar>.acc-menu>li").each(function(){
                if($(this).hasClass("hasChild")){
                    $(this).removeClass("hasChild open");
    
                    $(this).children(".acc-menu").addClass("floatRight2");
                    $(this).children(".acc-menu").css("display","none");
                    hasChildArr.push($(this));
                }
            });
            $(".iot-sidebar>ul.acc-menu ul.acc-menu li").each(function(){
                $(this).children(".acc-menu").removeClass("floatRight3");
            });
            if(!first){
                options.callback.onCollapse();
            }
        });
        $(document).on("click",".iot-menu-arrow .fa-outdent",function(){
            menuOpen=true;
            $(".iot-sidebar ul li span").css("display","inline");
            $(".iot-sidebar").css("width","200px");
            $(".iot-menu-arrow").css("width","200px");
            $(this).removeClass("fa-outdent");
            $(this).addClass("fa-indent");
            //$(".iot-content").css("margin-left","200px");
    
            $(".iot-sidebar>.acc-menu>li").each(function(){
                $(this).children(".acc-menu").removeClass("floatRight2");
            });
            $(".iot-sidebar>ul.acc-menu ul.acc-menu li").each(function(){
                if($(this).hasClass("hasChild")){
                    $(this).children(".acc-menu").addClass("floatRight3");
                    $(this).removeClass("open");
                }
            });
    
            hasChildArr.map(function($this){
                $this.addClass("hasChild");
            });
            hasChildArr=[];
            $(".treeview.active.hasChild").addClass("open").children(".acc-menu").css("display","block");//向右边展开时展开选中二级的父级
            options.callback.onExpand();
        });
        var menuLeftDiv='<nav class="iot-sidebar" role="navigation">'+drawMenu(data)+'</nav>'+
                        '<div class="iot-menu-arrow">'+
                            '<i class="fa fa-indent fa-lg"></i>'+
                        '</div>';
        /* 初始化组件 */
        $(this).empty();
        $(this).append(menuLeftDiv);
        /*  左侧菜单 */
        $(".iot-sidebar ul").addClass("acc-menu scrollBox");
        $(".iot-sidebar>ul>li").addClass("treeview");
        $(".iot-sidebar ul ul ul").addClass("floatRight3");
        var liHasUlChild = $('li').filter(function () {
            return $(this).find('ul.acc-menu').length;
        });
        $(liHasUlChild).addClass('hasChild');
        /* 默认选中项高亮 */
        if(menuOpen){
            $('[data='+options.selected+']').addClass("active").parents(".iot-sidebar li").addClass("active").end().parents(".iot-sidebar>ul>li>ul").css("display","block");
        }else{
            $('[data='+options.selected+']').addClass("active").parents(".iot-sidebar li").addClass("active");
            $(".iot-menu-arrow .fa-indent").click();
        }
        first=false;
         /* 点击事件 */
         $('body').on('click', 'ul.acc-menu a', function () {
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
             }else if($(this).closest('li').hasClass("hasChild")){//点击展开
                 $(this).closest('li').addClass('open');
             }else{//单击叶子菜单
                 var LIs = $(this).closest('.iot-sidebar').find('li');
                 $.each(LIs, function (i) {
                     $(LIs[i]).removeClass('active');
                 });
                 $(this).closest('li').addClass('active');
                 $(this).parents(".hasChild").addClass("active");
                 $(this).parents(".treeview").addClass("active");
                 if(options.hideFloat){
                    $(this).closest(".floatRight3").css("display","none");
                    $(this).closest(".floatRight2").css("display","none");
                 }
             }
             var $this=$(this);
             if ((menuOpen&&$(this).is(".iot-sidebar>ul.acc-menu>li>a")||!menuOpen&&$(this).is(".iot-sidebar>ul.acc-menu>li>ul>li>a"))&&$(this).next('.acc-menu').children().length > 0) {
                $(this).siblings('ul.acc-menu').slideToggle({
                    duration: 200,
                    progress: function () {
                        if ($(this).closest('li').is(":last-child")) { //only scroll down if last-child
                            //$(".iot-sidebar>ul").animate({scrollTop: $(".iot-sidebar>ul").height()}, 0);
                        }
                    },
                    complete: function () {
                        /* $(".iot-sidebar>ul").getNiceScroll().resize(); */
                        if(!menuOpen&&$this.is(".iot-sidebar>ul.acc-menu>li>ul>li>a")){
                            var navH=$(".iot-sidebar").height();
                            if($this.next(".acc-menu").length>0){
                                var liTop=$this.closest(".acc-menu").prev("a").offset();
                                var liH=50;
                                var headerH=$(".navbar-inverse").height();
                                var arrowH=$(".iot-menu-arrow").height();
                                if($this.next(".acc-menu").css("display")=="block"){
                                    var ulH=$this.closest(".acc-menu").height();
                                }else{
                                    var ulH=$this.closest(".acc-menu").children().length*liH;
                                }
                                if(ulH>=navH-liH){
                                    $this.closest(".acc-menu").css({"top":liH+headerH,"height":navH-liH});
                                }else if(liTop.top+ulH>navH+arrowH){
                                    var count=Math.floor((liTop.top+ulH-navH-arrowH)/liH);
                                    $this.closest(".acc-menu").css({"top":liTop.top-liH*count,"height":"auto"});
                                }else{
                                    $this.closest(".acc-menu").css({"top":liTop.top,"height":"auto"});
                                }
                            }
                        }
                    }
                });
             }else if(!menuOpen&&$(this).is(".iot-sidebar>ul.acc-menu>li>ul>li>a")){
                $this.closest(".acc-menu").css({"top":secondTop,"height":secondHeight});//菜单收缩时,三级菜单收缩后重绘父级(二级)ul的top和height
             }
         });
         /* 移入移出事件 */
         $('body').on('mouseenter','.iot-sidebar ul.acc-menu li a',function(){ 
             if(!menuOpen&&$(this).is(".iot-sidebar>ul.acc-menu>li>a")){
                 var navH=$(".iot-sidebar").height();
                 if($(this).next(".acc-menu").length>0&&$(this).next(".acc-menu").css("display")=="none"){
                     var liTop=$(this).offset();
                     var liH=$(this).parent().height();
                     var headerH=$(".navbar-inverse").height();
                     var arrowH=$(".iot-menu-arrow").height();
                     var ulH=$(this).next(".acc-menu").children().length*liH;
                     if(ulH>=navH-liH){
                         $(this).next(".acc-menu").css({"top":liH+headerH,"height":navH-liH});
                     }else if(liTop.top+ulH>navH+arrowH){
                         var count=Math.floor((liTop.top+ulH-navH-arrowH)/liH);
                         $(this).next(".acc-menu").css({"top":liTop.top-liH*count,"height":"auto"});
                     }else{
                         $(this).next(".acc-menu").css({"top":liTop.top,"height":"auto"});
                     }
                     secondTop=$(this).next(".acc-menu").css("top");
                     secondHeight=$(this).next(".acc-menu").css("height");
                 }
     
                 if($(this).next(".acc-menu").css("display")=="none"){//三级菜单隐藏
                     $(".iot-sidebar>ul.acc-menu ul.acc-menu .acc-menu").css("display","none");
                     $(".iot-sidebar>ul.acc-menu ul.acc-menu li").removeClass("open");
                 }
     
                 $(this).closest(".acc-menu").children("li").children(".acc-menu").css("display","none");//二级菜单隐藏
                 $(this).next(".acc-menu").css("display","block");
             }else if(menuOpen&&$(this).is(".iot-sidebar>ul.acc-menu>li>a")){
                 $(".iot-sidebar>ul.acc-menu ul.acc-menu .acc-menu").css("display","none");//三级菜单隐藏
             }else if(menuOpen&&$(this).is(".iot-sidebar>ul.acc-menu ul.acc-menu a")){
                 var navH=$(".iot-sidebar").height();
                 if($(this).next(".acc-menu").length>0){
                     var liTop=$(this).offset();
                     var liH=$(this).parent().height();
                     var headerH=$(".navbar-inverse").height();
                     var arrowH=$(".iot-menu-arrow").height();
                     var ulH=$(this).next(".acc-menu").height();
                     if(ulH>=navH-liH){
                         $(this).next(".acc-menu").css({"top":liH+headerH,"height":navH-liH});
                     }else if(liTop.top+ulH>navH+arrowH){
                         var count=Math.floor((liTop.top+ulH-navH-arrowH)/liH);
                         $(this).next(".acc-menu").css({"top":liTop.top-liH*count,"height":"auto"});
                     }else{
                         $(this).next(".acc-menu").css({"top":liTop.top,"height":"auto"});
                     }
                 }
     
                 $(this).closest(".acc-menu").find(".acc-menu").css("display","none");
                 $(this).next(".acc-menu").css("display","block");
             }
         });
         $('body').on('mouseleave','.iot-sidebar',function(){ 
             if(!menuOpen){
                 $(".acc-menu .acc-menu").css({"display":"none","height":"auto"});
             }else{
                 $(".acc-menu .acc-menu .acc-menu").css("display","none");
             }
         });
     }
 })(jQuery)