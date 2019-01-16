(function($){
    var keyName;//记录第一列显示的值（对应ztree默认的name）
    var headData;//列名称
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
    $.fn.ztreeTable=function(options1,getData){
        if (arguments.length === 1) {
            getData=options1;
            options1={};
        }
        var options0={
            displayW:1
        }
        var options=$.extend(true,{},options0,options1);
        var ztreeData=getData();
        ztreeData.data.map(function(item,index){
            item["name"]=item["parameter"][keyName];
        })
        keyName=ztreeData.columns[0].field;
        headData=ztreeData.columns;
        //初始化参数
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
            }
        };
        /* 初始化组件 */
        $(this).empty().addClass("ztreeTBolt");
        $(".ztreeTBolt").html('<ul id="dataTree" class="ztree scrollBox"></ul>');
        //初始化树
        $.fn.zTree.init($("#dataTree"), setting, ztreeData.data);
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
        var rows = $("#dataTree").find('li');
        $("#dataTree").before(li_head);
        if (rows.length == 0) {
            $("#dataTree").append('<li ><div class="noDataAlert" >无符合条件数据</div></li>')
        }
        /* 表格宽度自适应可视窗口大小 */
        var ztreeWidth=function(){
            var tableW=$(".ztreeTBolt").parent().width()/options.displayW;
            $(".ztreeTBolt").css("width",tableW);
        }
        $(window).resize(function(){
            ztreeWidth();
            if($("#dataTree").prop('scrollHeight')>$("#dataTree").height()){
                $("#dataTree>li").addClass("tbodyOut");
            }else{
                $("#dataTree>li").removeClass("tbodyOut");
            }
        });
        $(window).resize();
    }
})(jQuery)