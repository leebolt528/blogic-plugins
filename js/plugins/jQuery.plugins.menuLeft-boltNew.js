(function($){
    /* 封装cookie记录options.menuOpen */
    var cookie = {
        set:function(key,val,time){//设置cookie方法
            var date=new Date(); //获取当前时间
            var expiresDays=time;  //将date设置为n天以后的时间
            date.setTime(date.getTime()+expiresDays*24*3600*1000); //格式化为cookie识别的时间
            document.cookie=key + "=" + val +";expires="+date.toGMTString()+";path=/";  //设置cookie
        },
        get:function(key){//获取cookie方法
            /*获取cookie参数*/
            var getCookie = document.cookie.replace(/[ ]/g,"");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
            var arrCookie = getCookie.split(";")  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
            var tips;  //声明变量tips
            for(var i=0;i<arrCookie.length;i++){   //使用for循环查找cookie中的tips变量
                var arr=arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
                if(key==arr[0]){  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
                    tips=arr[1];   //将cookie的值赋给变量tips
                    break;   //终止for循环遍历
                }
            }
            return tips;
        },
        delete:function(key){ //删除cookie方法
                var date = new Date(); //获取当前时间
                date.setTime(date.getTime()-10000); //将date设置为过去的时间
                document.cookie = key + "=v; expires =" +date.toGMTString();//设置cookie
        }
    }
    $.fn.menuLeftBolt=function (options1,getData) {
        if (arguments.length === 1) {
            getData=options1;
            options1={callback:{}};
        }
        var options0={
            menuOpen:true,
            hideFloat:true,
            shrink:0,
            title:{
                enabled:true,
                class:"",
                content:""
            },
            callback:{}
        };
        var options=$.extend(true,{},options0,options1);
        if(cookie.get("menuOpen")!=undefined){
            options.menuOpen = cookie.get("menuOpen");
        }
        var data=$.isFunction(getData) ? getData() : getData;
        var first=true;//初始化时禁止部分操作
        var secondTop,secondHeight;//保存menuOpen=false时，二级菜单初始化的定位和高度
        var menuOpen=options.menuOpen=="false"?false : (options.menuOpen=="true"?true : options.menuOpen);
        /* 绘制菜单数据项Function */
        function drawMenu(item){
            if(item==data){//绘制一级菜单
                var itemChild=item;
                var oneLevel=true;
            }else{
                var itemChild=item.hasOwnProperty("children")?item.children:[];
                var oneLevel=false;
            }
            if(itemChild.length==0&&!oneLevel){
                return '';
            }else{
                var listString='<ul>'+
                    (function(){
                        var listString="";
                        itemChild.map(function(item,index){
                            let param=item.hasOwnProperty("param")&&JSON.stringify(item.param)?JSON.stringify(item.param):'{}';
                            listString+=item.hasOwnProperty("children")&&item.children.length > 0?
                                '<li><a href="'+(item.hasOwnProperty("href")?item.href:"#")+'" param='+param+'><div class="'+(item.hasOwnProperty("class")&&item.class.length>0?'menu-app '+item.class:'')+'"></div><span>'+item.name+'</span></a>'+
                                drawMenu(item)
                                +'</li>'
                                :
                                '<sec:authorize class='+'sec'+' url="'+(item.hasOwnProperty("secUrl")?item.secUrl:"")+'"><li><a href="'+(item.hasOwnProperty("href")?item.href:"#")+'" param='+param+'><div class="'+(item.hasOwnProperty("class")&&item.class.length>0?'menu-app '+item.class:'')+'"></div><span>'+item.name+'</span></a>'+
                                drawMenu(item)
                                +'</li></sec:authorize>';
                        });
                        return listString;
                    })()
                    +
                    '</ul>';
                return listString;
            }
        }
        /*添加标题*/
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
        /*添加收缩按钮*/
        menuLeftDiv+='<nav class="bolt-sidebar" role="navigation">'+drawMenu(data)+
            '<div class="cloud-shrink1-L shrink-moved">'+
            '<img class="collapse-background" src="../img/plugins/menuLeft/leftbar-background.png"/>'+
            '<img class="collapse-arrow" src="../img/plugins/menuLeft/leftbar-arrow.png"/>'+
            '</div>'+
            '</nav>'+
            '<div class="bolt-menu-arrow">'+
            '<img class="fa-indent" src="../img/plugins/menuLeft/indent.png"/>'+
            '</div>';
        /* 生成左侧菜单 */
        $(this).empty().addClass("menuLeftBolt "+(options.shrink==1? "bolt-options-shrink1":"")).html(menuLeftDiv);

        /*  初始化菜单 addClass */
        $(".bolt-sidebar>ul>li,.bolt-sidebar>ul>.sec>li").addClass("level1");
        $(".bolt-sidebar>ul>li>ul>li,.bolt-sidebar>ul>li>ul>.sec>li").addClass("level2");
        $(".bolt-sidebar>ul>li>ul>li>ul>li,.bolt-sidebar>ul>li>ul>li>ul>.sec>li").addClass("level3");
        $(".bolt-sidebar ul").addClass("acc-menu scrollBox");
        $(".bolt-sidebar ul ul ul").addClass("floatRight3");
        var liHasUlChild = $('li').filter(function () {
            return $(this).find('ul.acc-menu').length;
        });
        $(liHasUlChild).addClass('hasChild');

        /* 默认选中项高亮 */
        $(".menuLeftBolt nav a").each(function(){
            var url = window.location.pathname;
            if(menuOpen && url.indexOf($(this).attr("href")) > -1 ){
                $(this).closest("li").addClass("active selectedLi").parents(".bolt-sidebar>ul>li>ul").css("display","block").parent("li").addClass("open");
                $(this).closest("li").closest('li.level1').addClass('selectedFirst');
                if ($(this).closest("li").parents(".floatRight3").length > 0){
                    $(this).closest("li").closest("ul").parent("li").addClass("active");
                }
                if(options.callback.hasOwnProperty("onClick")){
                    options.callback.onClick($(this),JSON.parse($(this).attr("param")));
                }
            }else if(url.indexOf($(this).attr("href")) > -1 ){
                $(this).closest("li").addClass("active selectedLi");
                $(this).closest("li").closest('li.level1').addClass('selectedFirst');
                if(options.callback.hasOwnProperty("onClick")){
                    options.callback.onClick($(this),JSON.parse($(this).attr("param")));
                }
            }
        });

        /*根据shrink模式调整样式*/
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

        /* 点击事件 */
        $('.bolt-sidebar ul.acc-menu a').click(function () {
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
                    $LIs.parents(".hasChild").not(".level2").removeClass('active');
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
                $(this).closest('li.level1').addClass('selectedFirst');
                if($(this).parents(".floatRight2").length > 0){
                    $(this).parents(".hasChild").addClass("active");
                    $(this).parents(".level1").addClass("active");
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
        $('.bolt-sidebar ul.acc-menu li a').mouseenter(function(){
            if(!menuOpen&&$(this).is(".bolt-sidebar>ul.acc-menu li.level1>a")){
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
        $('.bolt-sidebar').mouseleave(function(){
            if(!menuOpen){
                $(".acc-menu .acc-menu").css({"display":"none","height":"auto"});
            }else{
                $(".acc-menu .acc-menu .acc-menu").css("display","none");
            }
        });
        /* 收缩事件 */
        var hasChildArr=[];
        $(document).on("click",".bolt-menu-arrow .fa-indent,.cloud-shrink1-L",function(){
            menuOpen=false;
            cookie.set("menuOpen", menuOpen, 7);
            if(options.shrink==0){
                $(".menuLeftBolt").addClass("menuClose-shrink0");

                $(this).removeClass("fa-indent");
                $(this).addClass("fa-outdent");
            }else{
                $(".menuLeftBolt").addClass("menuClose-shrink1");

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
        first=false;
        $(document).on("click",".bolt-menu-arrow .fa-outdent,.cloud-shrink1-R",function(){
            menuOpen=true;
            cookie.set("menuOpen", menuOpen, 7);
            if(options.shrink==0){
                $(".menuLeftBolt").removeClass("menuClose-shrink0");

                $(this).removeClass("fa-outdent");
                $(this).addClass("fa-indent");
            }else{
                $(".menuLeftBolt").removeClass("menuClose-shrink1");

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
            $LIs.parents(".hasChild").not(".level2").removeClass('active');
            $(".level1.hasChild.selectedFirst").addClass("open").children(".acc-menu").css("display","block");//向右边展开时展开选中二级的父级
            if(options.callback.hasOwnProperty("onExpand")){
                options.callback.onExpand(options.shrink);
            }
        });
        /*初始化菜单是否收起*/
        if(!menuOpen && options.shrink==0){
            $(".bolt-menu-arrow .fa-indent").click();
        }else if(!menuOpen){
            $(".cloud-shrink1-L").click();
        }

        /*合并函数Function*/
        function mergeFunction (functionA, functionB) {
            functionAB = function (aa,bb) {
                typeof functionA == "function"?functionA(aa,bb):"";
                typeof functionB == "function"?functionB(aa,bb):"";
            };
            return functionAB
        }
        //返回对象事件
        var menuLeftTools={
            updateTitle:function(title){
                $(".menuLeftBolt .title .menu-app-img").attr("class","menu-app-img " + title.class);
                $(".menuLeftBolt .title .menu-app-text").text(title.content);
            },
            onClick:function(functionB){
                var functionA = options.callback.onClick;
                options.callback.onClick = mergeFunction(functionA,functionB);
            },
            onExpand:function(functionB){
                var functionA = options.callback.onExpand;
                options.callback.onExpand = mergeFunction(functionA,functionB);
            },
            onCollapse:function(functionB){
                var functionA = options.callback.onCollapse;
                options.callback.onCollapse = mergeFunction(functionA,functionB);
            }
        };
        return menuLeftTools;
    }
})(jQuery);