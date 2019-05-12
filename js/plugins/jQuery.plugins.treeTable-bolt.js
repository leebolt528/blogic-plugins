(function($){
    $.fn.treeTableBolt=function(options1,getData){
        /* if (arguments.length === 1) {
            getData=options1;
            options1={};
        } */
        var options0={
            displayW:1,
            startUrl:"",
            async:false,
            class:"",
            columns:[],
            callback:{}
        }
        var options=$.extend(true,{},options0,options1);
        var treeTData=$.isFunction(getData) ? getData() : getData;
        var temvar=0;//模拟异步请求需要的临时变量
        var ajaxArr=[];//存储正在执行的AJAX
        var abortBoolean=false;//是否停止一个AJAX
        var persistData=[];//缓存AJAX请求返回数据
        //表格添加数据行tr
        function addTr(options,treeTData,firstRankBool,node){
            var tbody = $(".treeTBolt>tbody");
            if(treeTData.length > 0){
                for(var i = 0; i < treeTData.length; i++) {
                    var event = treeTData[i];
                    var tr = $("<tr class='"+($(".treeTBolt").hasClass("table-click")&&event.selected?'selected':'')+"' data-tt-id='" + event.id + "' data-tt-parent-id='" + event.idP + "' data-parameterName='" + event["parameterName"] + "' data-dataName='" + event["data"]["name"] + "' data-ajax='" + event["ajax"] +"' data-param='" + JSON.stringify(event) + "'></tr>");
                    options.columns.map(function(item,index){
                        if(index==0){
                            if(event.last||event["subResourceCount"]==0||event["subResourceCount"]==null) {
                                tr.append("<td class='textOverflow' title='"+event["data"][item.field]+"' style='width:"+item.width+";text-align:"+item.align+";position:relative;'><a>"+(event.img?"<img src="+event.img+" width='20px' height='13px' /></a>&nbsp;":"") + event["data"][item.field] + "</td>");
                            }else{
                                tr.attr("data-tt-branch","true");
                                tr.append("<td class='textOverflow' title='"+event["data"][item.field]+"' style='width:"+item.width+";text-align:"+item.align+";position:relative;'><a>"+(event.img?"<img src="+event.img+" width='20px' height='13px' /></a>&nbsp;":"") + event["data"][item.field]+"</td>");
                            }
                        }else{
                            tr.append( "<td class='textOverflow' title='"+event["data"][item.field]+ "' style='width:"+item.width+";text-align:"+item.align+"'>" + (event["data"][item.field]==null||event["data"][item.field].length==0?'&nbsp;':event["data"][item.field])+ "</td>");
                        }
                    })
                    if(firstRankBool){
                        tbody.append(tr);
                    }else{
                        $(".treeTBolt").treetable("loadBranch",node, tr);// 插入子节点 
                    }
                }
            }
        }
        //获取ajax请求的data参数父级id对象
        function getParaAll($tr,persistData){
            var para={};
            getParaOne($tr);
            function getParaOne($tr){
                var name=$tr.data("parametername");
                para[name]=$tr.data("dataname");
                var elemArr= persistData.filter(function(item){
                        return item.id == $tr.data("tt-parent-id");
                    }) ;
                if(elemArr.length!=0){
                    $tr=$(".treeTBolt").find("[data-tt-id='" + elemArr[0].id + "']");
                    getParaOne($tr);
                }
            }
            return para;
        }
        //分支展开后的回调函数
        function onNodeExpandFun(node,persistData,options){
            var $tr = $(".treeTBolt").find("[data-tt-id='" + node.id + "']");
            //相同ajax只请求一次
            var ajaxBool=true;//是否使用ajax请求
            var ajaxPara=getParaAll($tr,persistData);//获取ajax请求的data参数父级id对象
            var elemArr= persistData.filter(function(item){
                return item.idP == $tr.data("tt-id");
            }) ;
            if(elemArr.length!=0){
                ajaxBool=false;
            }
            if(!ajaxBool){ return;}
            if($tr.data("ajax")){
                //异步请求数据等待ajax显示loading动画
                var loading = $("<tr data-tt-id='" +node.id+"childLoad" + "' data-tt-parent-id='" + node.id + "'></tr>");
                loading.append("<td>" + '<i class="fa fa-spinner fa-spin fa-2x fa-fw" style="color:#777171"></i>' + "</td>");
                $(".treeTBolt").treetable("loadBranch",node, loading);
                setTimeout(function(){ 
                    /* var ajax=$.ajax({
                        url : $tr.data("ajax"),
                        data: ajaxPara,
                        success:function(treeData) { */
                            if(temvar==0){
                                var treeTData=threeData;
                            }else{
                                var treeTData=lastData;
                            }
                            temvar++;
                            //移除异步请求load动画
                            if($(".treeTBolt").find("[data-tt-id='" + node.id+"childLoad" + "']")[0]) {
                                $(".treeTBolt").treetable("removeNode", node.id+"childLoad");
                            }
                            //缓存数据
                            if(0 !=treeTData.length){
                                persistData.push.apply(persistData,treeTData);
                                addTr(options,treeTData,false,node);
                            }else{
                                persistData.push({id:node.id+"childNull",idP:node.id});
                                var tr = $("<tr data-tt-id='" + node.id+"childNull" + "' data-tt-parent-id='" + node.id + "'></tr>");
                                tr.append("<td>" + "无数据" + "</td>");
                                $(".treeTBolt").treetable("loadBranch",node, tr);// 插入子节点
                            }

                            if(options.callback.hasOwnProperty("onExpand")){
                                var param=$tr.data("param");
                                options.callback.onExpand($tr,param);
                            }
                    /*  },
                        error:function(){
                            if(!abortBoolean){
                                if($(".treeTBolt").find("[data-tt-id='" + node.id+"childLoad" + "']")[0]) {
                                    $(".treeTBolt").treetable("removeNode", node.id+"childLoad");
                                }
                                persistData.push({id:node.id+"childNull",idP:node.id});
                                var tr = $("<tr data-tt-id='" + node.id+"childNull" + "' data-tt-parent-id='" + node.id + "' class='has-exception'></tr>");
                                tr.append("<td>" + "请求数据失败" + "</td>");
                                $(".treeTBolt").treetable("loadBranch",node, tr);// 插入子节点
                                abortBoolean=false;
                            }
                        },
                        complete:function(){
                            if(options.callback.hasOwnProperty("onExpand")){
                                var param=$tr.data("param");
                                options.callback.onExpand($tr,param);
                            }
                        }
                    });
                    ajaxArr.push(ajax); */
                },1000)
            }else{
                persistData.push({id:node.id+"childNull",idP:node.id});
                var tr = $("<tr data-tt-id='" + node.id+"childNull" + "' data-tt-parent-id='" + node.id + "' class='has-exception'></tr>");
                tr.append("<td>" + "ajax为空,请求数据失败" + "</td>");
                $(".treeTBolt").treetable("loadBranch",node, tr);// 插入子节点
            }
        }
        //分支折叠后的回调函数
        function onNodeCollapseFun(node,options){
            if($(".treeTBolt").find("[data-tt-id='" + node.id+"childLoad" + "']")[0]) {
                $(".treeTBolt").treetable("removeNode", node.id+"childLoad");
            }
            if(options.callback.hasOwnProperty("onCollapse")){
                var $tr = $(".treeTBolt").find("[data-tt-id='" + node.id + "']");
                var param=$tr.data("param");
                options.callback.onCollapse($tr,param);
            }
        }
        //初始化table表格
        function initTable(options,treeTData){
            $(".treeTBolt>tbody").html('');//移除初始化请求load动画
            if(0 !=treeTData.length){
                persistData.push.apply(persistData,treeTData);
                addTr(options,treeTData,true)
            }else{
                var tbody = $(".treeTBolt>tbody");
                tbody.append("<tr class='noDataAlert'><td style='border-top:0px;text-align:center'>无数据</td></tr>");
            }
        }
        //初始化treetable表格
        function initTreeTable(options,treeTData){
            var optionsTree={
                expandable: true,// 展示
                //initialState :"expanded",//默认打开所有节点 stringCollapse:'关闭',
                stringExpand:'展开',
                stringCollapse:'折叠',
                onNodeExpand: function(){
                    onNodeExpandFun(this,persistData,options)
                },
                onNodeCollapse:function(){
                    onNodeCollapseFun(this,options)
                }
            };
            $(".treeTBolt").treetable(optionsTree,true);
            treeTData.map(function(elem){
                if(elem.synChild){
                    $(".treeTBolt").treetable("expandNode", elem.id);
                }
            });
        }
        function treeTableAsync(options,treeTData){
            //ajax请求局部刷新时初始化全局参数
            abortBoolean=false;//是否停止一个AJAX
            persistData=[];//缓存AJAX请求返回数据
            ajaxArr.map(function(elem){
                abortBoolean=true;
                elem.abort();
            });
            ajaxArr=[];
            $(".treeTBolt").treetable();//初始化表格样式
            var loading='<div class="panel-load"><i class="fa fa-spinner fa-spin fa-2x fa-fw"></i></div>';
            $(".treeTBolt>tbody").html(loading);//初始化数据等待ajax状态显示load动画
            $(".panel-load").css("left",options.displayW*100/2+"%");
            if(options.async){
                setTimeout(function(){ 
                    /* var ajax=$.ajax({
                        type: 'GET',
                        url: options.startUrl,
                        data: {
                        },
                        success: function (treeTData){ */
                            initTable(options,treeTData);
                            initTreeTable(options,treeTData);
                    /*  },
                        error:function(){
                            if(!abortBoolean){
                                $(".treeTBolt>tbody").html('');
                                var tbody = $(".treeTBolt>tbody");
                                tbody.append("<tr class='has-exception noDataAlert'><td style='border-top:0px;text-align:center'>请求数据失败</td></tr>");
                                abortBoolean=false;
                            }
                        }
                    });
                    ajaxArr.push(ajax); */
                }, 1000);
            }else{
                initTable(options,treeTData)
                initTreeTable(options,treeTData);
            }
        }
        //点击节点回调函数
        function onClickFun($this){
            if($this.hasClass("table-click")){
                $(document).on("click", ".treeTBolt tbody tr", function() {
                    $(".treeTBolt tbody tr").removeClass("selected");
                    $(this).addClass("selected");
                    if(options.callback.hasOwnProperty("onClick")){
                        var $tr = $(this);
                        var param=$tr.data("param");
                        options.callback.onClick($tr,param);
                    }
                });
                $(document).on("click", "span.indenter", function(event) {
                    event.stopPropagation();
                });
            }
        }
        /* 表格宽度自适应可视窗口大小 */
        var treeTWidth=function(){
            var tableW=$(".treeTBolt").parent().width()/options.displayW;
            $(".treeTBolt").css("width",tableW);

            var tbodyH=$(".treeTBoltPa").height()-$(".treeTBolt>thead").outerHeight();
            $(".treeTBolt>tbody").css("height",tbodyH);
        }
        $(window).resize(function(){
            treeTWidth();
            if($(".treeTBolt>tbody").prop('scrollHeight')>$(".treeTBolt>tbody").height()){
                $(".treeTBolt>tbody>tr").addClass("tbodyOut");
            }else{
                $(".treeTBolt>tbody>tr").removeClass("tbodyOut");
            }
        });
        
        /* 初始化组件 */
        $(this).empty().addClass("treeTBolt tableOut "+options.class);
        onClickFun($(this));
        //添加表头
        var headData=options.columns;
        var tableIn=' <thead><tr>'+
                        (function(){
                            headString="";
                            headData.map(function(item,index){
                                headString+='<th style="width:'+item.width+';text-align:'+item.align+'"><strong>'+item.title+'</strong></th>'
                            })
                            return headString;
                        })()
                        +
                    '</tr></thead>'+
                    '<tbody style="font-size: 12px;position:relative;background-color: #f9f9f9" class="layout scrollBox"></tbody>';
       $(".treeTBolt").html(tableIn);
        $(".treeTBolt").wrap('<div class="treeTBoltPa tableOutPa" style="height:100%"> ');
        treeTableAsync(options,treeTData);
        $(window).resize();
        
        //返回对象事件
        var treeTableTools={
            getSelectedParam:function(){
                var param=$(".treeTBolt tbody tr.selected").data("param");
                return param;
            },
            getSelectedElem:function(){
                var $this=$(".treeTBolt tbody tr.selected");
                return $this;
            }
        }
        return treeTableTools;
    }
})(jQuery)