(function($){
    $.fn.ztreeTableBolt=function(options1,getData){
        if (arguments.length === 1) {
            getData=options1;
            options1={};
        }
        var options0={
            displayW:1,
            class:"",
            columns:[],
            callback:{}
        }
        var options=$.extend(true,{},options0,options1);
        var ztreeData=$.isFunction(getData) ? getData() : getData;
        var keyName;//记录第一列显示的值（对应ztree默认的name）
        var headData=options.columns;//列名称
        keyName=headData[0].field;
        ztreeData.map(function(item,index){
            item["name"]=item["parameter"][keyName];
        })
        /*自定义DOM节点 */
        function addDiyDom(treeId, treeNode) {
            var spaceWidth = 15;
            var liObj = $("#" + treeNode.tId);
            var aObj = $("#" + treeNode.tId + "_a");
            var switchObj = $("#" + treeNode.tId + "_switch");
            var icoObj = $("#" + treeNode.tId + "_ico");
            var spanObj = $("#" + treeNode.tId + "_span");
            var nameW;
            var nameA;
            headData.map(function(item,index){
                if(item.field==keyName){
                    nameW=item.width;
                    nameA=item.align;
                }
            })
            if($(".ztreeTBolt").hasClass("table-click")&&treeNode.selected){
                aObj.addClass("curSelectedNode");
            }
            aObj.append("<div class='diy swich textOverflow' title='"+treeNode["parameter"][keyName]+"' style='width:"+nameW+";text-align:"+nameA+"'></div>");
            var div = $(liObj).find('div').eq(0);
            switchObj.remove();
            spanObj.remove();
            icoObj.remove();
            div.append(switchObj);
            div.append(spanObj);
            spanObj.html((treeNode["parameter"].icon?"<i class='fa "+treeNode["parameter"].icon +"'></i>":"")+treeNode["parameter"][keyName]);
            var spaceStr = "<span style='height:1px;display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
            switchObj.before(spaceStr);
            headData.map(function(item,index){
                if(item.field!=keyName){
                    aObj.append( '<div class="diy textOverflow" style="width:'+item.width+';text-align:'+item.align+'" title="'+treeNode["parameter"][item.field]+'">' + (treeNode["parameter"][item.field].length==0?'&nbsp;':treeNode["parameter"][item.field])+ '</div>');
                }
            })
        }
         /* 表格宽度自适应可视窗口大小 */
         var ztreeWidth=function(){
            var tableW=$(".ztreeTBolt").parent().width()/options.displayW;
            $(".ztreeTBolt").css("width",tableW);

            var tbodyH=$(".ztreeTBolt").height()-$(".ztreeTBolt>.head").outerHeight();
            $(".ztreeTBolt>ul").css("height",tbodyH);
        }
        $(window).resize(function(){
            ztreeWidth();
            if($("#dataTreeBolt").prop('scrollHeight')>$("#dataTreeBolt").height()){
                $("#dataTreeBolt>li").addClass("tbodyOut");
            }else{
                $("#dataTreeBolt>li").removeClass("tbodyOut");
            }
        });
         /* 初始化组件 */
        var setting = {
            view: {
                showLine: false,
                showIcon: true,
                addDiyDom: addDiyDom,
                dblClickExpand:false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback:{
                onClick:function(event,treeId,treeNode,clickFlag){
                    if(options.callback.hasOwnProperty("onClick")){
                        $(document).on("click", ".ztreeTBolt li a", function() {
                            $(".ztreeTBolt li a").removeClass("curSelectedNode");
                            $(this).addClass("curSelectedNode");
                            if(options.callback.hasOwnProperty("onClick")){
                                var $tr = $("#dataTreeBolt_"+treeNode.id+"_a");
                                var param=treeNode;
                                options.callback.onClick($tr,param);
                            }
                        });
                        $(document).on("click", "span.switch", function(event) {
                            event.stopPropagation();
                        });
                    }
                },
                onExpand:function(event,treeId,treeNode){
                    if(options.callback.hasOwnProperty("onExpand")){
                        var $tr = $("#dataTreeBolt_"+treeNode.id+"_a");
                        var param=treeNode;
                        options.callback.onExpand($tr,param);
                    }
                },
                onCollapse:function(event,treeId,treeNode){
                    if(options.callback.hasOwnProperty("onCollapse")){
                        var $tr = $("#dataTreeBolt_"+treeNode.id+"_a");
                        var param=treeNode;
                        options.callback.onCollapse($tr,param);
                    }
                }
            }
        };
        $(this).empty().addClass("ztreeTBolt "+options.class);
        $(".ztreeTBolt").html('<ul id="dataTreeBolt" class="ztree scrollBox"></ul>');
        //初始化树
        $.fn.zTree.init($("#dataTreeBolt"), setting, ztreeData);
        //添加表头
        var li_head='<li class="head"><a>'+
                        (function(){
                            headString="";
                            headData.map(function(item,index){
                                headString+='<div class="diy" style="width:'+item.width+';text-align:'+item.align+'"><strong>'+item.title+'</strong></div>'
                            })
                            return headString;
                        })()
                        +
                    '</a></li>';
        var rows = $("#dataTreeBolt").find('li');
        $("#dataTreeBolt").before(li_head);
        if (rows.length == 0) {
            $("#dataTreeBolt").append('<li ><div class="noDataAlert" >无符合条件数据</div></li>')
        }
        $(window).resize();
        //返回对象事件
        var zTreeTableTools={
            getSelectedParam:function(){
                var treeObj = $.fn.zTree.getZTreeObj("dataTreeBolt");
                var $this=$(".ztreeTBolt li a.curSelectedNode");
                var id=$this.attr("id").substring(0,$this.attr("id").length-2);
                var node = treeObj.getNodeByTId(id);
                return node;
            },
            getSelectedElem:function(){
                var $this=$(".ztreeTBolt li a.curSelectedNode");
                return $this;
            }
        }
        return zTreeTableTools;
    }
})(jQuery)