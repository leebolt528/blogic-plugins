(function( $ ){
    $.fn.getDashboard = function(options1,getData){
        if (arguments.length === 1) {
            getData=options1;
            options1={};
        }
        var options0={
            mode: "view",
            grid_options:{
                verticalMargin:15,
                cellHeight:2,
                handle: ".drag-handle",
                float:false,
                levelMargin:15
            },
            callback:{}
        }
        var options=$.extend(true,{},options0,options1);
        var dashboardData=$.isFunction(getData) ? getData() : getData;
        var $this=$(this).addClass("grid-stack dashBoardBolt");
        if(options.mode=="view"){
            options.grid_options.float=true;
        }
        $this.gridstack(options.grid_options);
        var grid = $this.data('gridstack');
        var delArray=[];//记录删除的面板id
        var widgetsArray=[];//获取当前面板的最新属性
        var hightchartsIdArr=[];//保存绘图id,不加入单值图id
        switch(options.mode) {
            case "view":
                dashboardData.map(function(value){
                    var el= '<div class="dashboard-row grid-stack-item" data-gs-no-resize="true">';
                    el+='<div class="grid-stack-item-content" style="width:100%">';
                    el+= '<div class="dashboard-panel view-widget">';
                    el+=     '<div class="panel-title">';
                    el+=         '<span class="title-view" title='+value.title+'>'+value.title+'</span>';
                    el+=     '</div>';
                    el+=    '<div class="panel-body" id='+value.id+' style="padding:0px;"><div class="panel-load"><i class="fa fa-spinner fa-spin fa-2x fa-fw"></i></div></div>';
                    el+= '</div>';
                    el+= '</div>';
                    el+= '</div>;';
                    var position=value.location;
                    grid.addWidget(el,position.dataGsX, position.dataGsY, position.dataGsWidth, position.dataGsHeight);
                    chartViewHeight($(".grid-stack-item").has('#'+value.id));

                    var chartData=[];
                    var defferArr = [];
                    value.widgets.map(function(widget){
                        if(widget.ajax){
                            defferArr.push($.ajax({
                                type : "get",
                                url : widget.data,
                                success : function(data) {
                                    chartData.push(data);
                                }
                            }));
                        }else{
                            chartData.push(widget.data);
                        }
                    });

                    $.when.apply(this, defferArr).done(function() {
                        $this.find("#"+value.id).hightcharts(value.options,chartData);
                        if(chartData[0].label.type!="singleValuechart"){
                            hightchartsIdArr.push("#"+value.id);
                        }
                    }).fail(function() {
                       $this.find("#"+value.id).hightcharts([]);
                    });
                });
                break;
            case "edit":
                dashboardData.map(function(value){
                    var el= '<div class="dashboard-row grid-stack-item">';
                    el+='<div class="grid-stack-item-content" style="width:100%">';
                    el+= '<div class="dashboard-panel edit-widget">';
                    el+=     '<div class="drag-handle">';
                    el+=        '<a  class="delete-panel">x</a>';
                    el+=        '<div class="handle-inner"></div>';
                    el+=     '</div>';
                    el+=     '<div class="panel-title">';
                    el+=         '<input class="title-editor" type="text" placeholder="无标题" value='+value.title+'>';
                    el+=     '</div>';
                    el+=     '<div class="panel-body" id='+value.id+' style="padding:0px;"><div class="panel-load"><i class="fa fa-spinner fa-spin fa-2x fa-fw"></i></div></div>';
                    el+= '</div>';
                    el+= '</div>';
                    el+= '</div>;';
                    var position=value.location;
                    grid.addWidget(el,position.dataGsX, position.dataGsY, position.dataGsWidth, position.dataGsHeight,true);
                    chartEditHeight($(".grid-stack-item").has('#'+value.id));

                    var chartData=[];
                    var defferArr = [];
                    value.widgets.map(function(widget){
                        if(widget.ajax){
                            defferArr.push($.ajax({
                                type : "get",
                                url : widget.data,
                                success : function(data) {
                                    chartData.push(data);
                                }
                            }));
                        }else{
                            chartData.push(widget.data);
                        }
                    });

                    $.when.apply(this, defferArr).done(function() {
                        $this.find("#"+value.id).hightcharts(value.options,chartData);
                        if(chartData[0].label.type!="singleValuechart"){
                            hightchartsIdArr.push("#"+value.id);
                        }
                    }).fail(function() {
                        $this.find("#"+value.id).hightcharts([]);
                     });;
                });
                break;
        }
        $(document).on("click",".delete-panel",function(){
            var grid = $(this).closest(".grid-stack").data('gridstack');
            grid.removeWidget($(this).closest(".grid-stack-item"));
            if(options.callback.hasOwnProperty("onDel")){
                var $this=$(this).closest(".grid-stack-item");
                delArray.push($(this).closest(".dashboard-panel").children(".panel-body").attr("id"));
                options.callback.onDel($this,delArray);
            }
        });
        $this.on('gsresizestop', function(event, elem) {
            var contentH=$(elem).find('.grid-stack-item-content').innerHeight();
            var panelH=Number($(elem).find(".grid-stack-item-content>.dashboard-panel").css("margin-bottom").replace('px',''));
            var handleH=$(elem).find(".drag-handle").outerHeight(true);
            var titleH=$(elem).find(".panel-title").outerHeight(true);
            var descH=$(elem).find(".panel-description").outerHeight(true);
            var chartH=contentH-panelH-handleH-titleH-descH;

            var $chart = $(elem).find('.panel-body');
            $chart.outerHeight(chartH);
            
            if($chart.highcharts()){
                $chart.highcharts().reflow();
                $chart.highcharts().legend.update( {
                    itemWidth:$(elem).find(".panel-body").width()/3,
                    width:$(elem).find(".panel-body").width()/3
                } );
            }

            //拖拽改变图大小时，仪表盘部分自适应大小
            var fontStandard=Math.min.apply(null, [$chart.height(),$chart.width()]);
            var dlfontSize=fontStandard*0.105<=80?fontStandard*0.105+"px":80+"px";//仪表盘中心文字大小
            $chart.find(".highcharts-label span div:first span:first").css("fontSize",dlfontSize);
            var dlBottomfontSize=fontStandard*0.07<=53?fontStandard*0.07+"px":53+"px";//仪表盘中心文字附加行字体大小
            $chart.find(".highcharts-label span div:first span:last").css("fontSize",dlBottomfontSize);
            $chart.find(".highcharts-label span div:last span").css("fontSize",dlBottomfontSize);
            var left=($chart.width()-$chart.find(".highcharts-data-label>span").width()-28.84)/2+"px";//仪表盘中心数据标签定位left
            $chart.find(".highcharts-label").css("left",left);
            var titleSize=fontStandard*0.05<=37?fontStandard*0.05+"px":37+"px";//仪表盘单位显示字体大小
            $(".highcharts-axis.highcharts-yaxis .highcharts-axis-title").css("fontSize",titleSize);
            //拖拽改变图大小时，单值图部分自适应大小
            var valuefontSize=fontStandard*0.15<=80?fontStandard*0.15+"px":80+"px";//单值图中心文字大小
            $chart.find(".singlestat-panel span.single-value").css("fontSize");
            $chart.find(".singlestat-panel span.single-value").css("fontSize",valuefontSize);
            var postfixfontSize=fontStandard*0.15<=53?fontStandard*0.15+"px":53+"px";//单值图中心文字后缀大小
            $chart.find(".singlestat-panel span.single-postfix").css("fontSize",postfixfontSize);
        });
         //返回对象事件
         var dashboardTools={
            getAllWidgets:function(){
                $(".grid-stack-item").each(function(){
                    widgetsArray.push({
                        "id":$(this).find(".panel-body").attr("id"),
                        "title": $(this).find(".title-editor").val(),
                        "location": {
                            "dataGsX": $(this).data("gs-x"),
                            "dataGsY": $(this).data("gs-y"),
                            "dataGsWidth": $(this).data("gs-width"),
                            "dataGsHeight": $(this).data("gs-height")
                        },
                    });
                });
                return widgetsArray;
            },
            getAllHightchartId:function(){
                return hightchartsIdArr;
            }
        }
        return dashboardTools;
    }
})( jQuery );
var chartViewHeight=function($this){
    var contentH=$this.height();
    var titleH=$this.find(".panel-title").outerHeight(true);
    var chartH=contentH-titleH;

    var $chart = $this.find('.panel-body');
    $chart.outerHeight(chartH);
}
var chartEditHeight=function($this){
    var contentH=$this.height();
    var panelH=Number($this.find(".grid-stack-item-content>.dashboard-panel").css("margin-bottom").replace('px',''));
    var handleH=$this.find(".drag-handle").outerHeight(true);
    var titleH=$this.find(".panel-title").outerHeight(true);
    var descH=$this.find(".panel-description").outerHeight(true);
    var chartH=contentH-panelH-handleH-titleH-descH;
    var $chart = $this.find('.panel-body');
    $chart.outerHeight(chartH);
}