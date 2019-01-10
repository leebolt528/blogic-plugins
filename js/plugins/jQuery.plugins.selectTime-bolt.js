(function($){
    $.fn.selectTime=function(options1){
        if (arguments.length === 0) {
            options1={};
        }
        var options0={
            deTime:"5m",
            interval:2,
            listArr:["5m","20m","1h","3h","6h","12h","1d","2d"],
            switch:true,
            serverTime:"null",
            callback:{}
        }
        var options=$.extend(true,{},options0,options1);
        var selectTimeDiv=`<div class="btn-group calendarPa">
						<button type="button" class="btn btn-default btn-xs calendar"><i class="fa fa-calendar" aria-hidden="true"></i></button>
						<input class="laydate-icon btn-input-time" name="begin_time" value="" placeholder="请选择日期" id="start" type="text">
						<span class="timeTo float-left"> - </span>
                        <input class="laydate-icon btn-input-time" name="end_time" value="" placeholder="请选择日期" id="end" type="text">
                        <div class="alert alert-info alert-laydate" role="alert">
                            <button type="button" class="close"><span aria-hidden="true"><i class="fa fa-close"></i></span></button>
                            <span>请选择起止时间</span>
                        </div>
						<button type="button" class="btn btn-default btn-xs clear"><i class="fa fa-times" aria-hidden="true"></i></button>
                        <button type="button" class="btn btn-default btn-xs search"><i class="fa fa-search" aria-hidden="true"></i></button>
					</div>
					<div class="btn-group listPa">
						<button type="button" class="btn btn-default btn-xs list"><i class="fa fa-th-list" aria-hidden="true"></i></button>`+
                        (function(){
                            var listString="";
                            options.listArr.map(function(item,index){
                                listString+='<button type="button" class="btn btn-default btn-xs timeTag" data-tag="'+item+'">'+(index==0?'Last'+item:item)+'</button>';
                            });
                            return listString;
                        })()
                        +
                    `</div>`;
        /*时间选择插件*/
        var start = {
            elem: '#start', //id为star的输入框
            format: 'YYYY/MM/DD hh:mm:ss',
            max: laydate.now(), //最大日期
            istime: true,
            istoday: false,
            isclear: false,
            festival: true,
            choose: function(datas){
                console.log(laydate.v);//1.1
                var interval=Number(options.interval)-1;
                if(interval>-1){
                    var selected=new Date(datas); //选择的日期
                    var selectedAdd= new Date(selected.getTime() + interval*24*60*60*1000); //在选择的日期+1天(实际两天)
                    if(Date.parse(new Date())<Date.parse(selectedAdd)){ //如果当前日期小于选择日期+
                        end.max = laydate.now();  //结束日的最大日期为当前日期
                    }else {
                        selectedAdd=selectedAdd.getFullYear() + "/" + (selectedAdd.getMonth() + 1) + "/"+ selectedAdd.getDate();//转换日期格式
                        end.max = selectedAdd;//结束日的最大日期为选择的日期+1天
                    }
                }
                end.min = datas;//开始日选好后，重置结束日的最小日期
            }
        };
        var end = {
            elem: '#end',
            format: 'YYYY/MM/DD hh:mm:ss',
            max: laydate.now(),
            istime: true,
            istoday: false,
            fixed: false,
            isclear: false,
            festival: true,
            choose: function(datas){
                var interval=Number(options.interval)-1;
                if(interval>-1){
                    var selected=new Date(datas);
                    var selectedCut= new Date(selected.getTime() - interval*24*60*60*1000); //在日期-1天。
                    selectedCut=selectedCut.getFullYear() + "/" + (selectedCut.getMonth() + 1) + "/"+ selectedCut.getDate();
                    start.min = selectedCut;
                }
                start.max = datas; //结束日选好后，重置开始日的最大日期
            }
        };
        //清空时间选择插件输入框
        function clearTime(){
            start.max=laydate.now();
            end.max=laydate.now();
            start.min='1900-01-01 00:00:00';
            end.min='1900-01-01 00:00:00';
            $('#start').val('');
            $('#end').val('');
        }
        //时间戳转换日期格式
        function formatDate(fmt,timeStamp) { 
            var date=new Date(parseInt(timeStamp));  
            var o = {   
            "M+" : date.getMonth()+1,                 //月份   
            "d+" : date.getDate(),                    //日   
            "h+" : date.getHours(),                   //小时   
            "m+" : date.getMinutes(),                 //分   
            "s+" : date.getSeconds(),                 //秒   
            "q+" : Math.floor((date.getMonth()+3)/3), //季度   
            "S"  : date.getMilliseconds()             //毫秒   
            };   
            if(/(y+)/.test(fmt))   
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
            for(var k in o)   
            if(new RegExp("("+ k +")").test(fmt))   
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
            return fmt;   
        }
        //Last时间转换时间戳
        function formatStamp(dateTag){
            var unit=dateTag.split('')[dateTag.length-1];
            var now=new Date().getTime();
            if(options.serverTime!=="null"){
                $.ajax({
                    url:options.serverTime,
                    async:false,
                    success:function(data){
                        if(data.hasOwnProperty("serverTime")&&data.serverTime.length>0){
                            now=data.serverTime;
                        }
                    }
                });
            }
            switch(unit)
            {
                case "m":
                    var gap=Number(dateTag.replace(/[^0-9]+/g, ''))*60*1000;
                    break;
                case "h":
                    var gap=Number(dateTag.replace(/[^0-9]+/g, ''))*60*60*1000;
                    break;
                case "d":
                    var gap=Number(dateTag.replace(/[^0-9]+/g, ''))*24*60*60*1000;
                    break;
            }
            return now-gap+"-"+now;
        }
        //初始化组件
        $(this).empty().addClass("selectTimeBolt").append(selectTimeDiv);
        if(!options.switch){
            $(".calendarPa .calendar").css("pointer-events","none");
            $(".listPa .list").css("pointer-events","none");
        }
        var keep=false;
        var keepValue="";
        if(options.deTime.indexOf("-")==-1){
            $(".listPa").css("display","inline-block");
            $(".calendarPa").css("display","none");

            $(".listPa button").each(function(){
                if($(this).attr('data-tag')==options.deTime){
                    $(this).addClass("active");
                }
            });
        }else{
            var startTime=formatDate("yyyy/MM/dd hh:mm:ss", options.deTime.split("-")[0]);
            var endTime=formatDate("yyyy/MM/dd hh:mm:ss", options.deTime.split("-")[1]);
            var keep=true;
            var keepValue=startTime+"-"+endTime;
            $(".listPa").css("display","none");
            $(".calendarPa").css("display","inline-block");

            $('#start').val(startTime);
            start.choose(startTime);
            $('#end').val(endTime);
            end.choose(endTime);
        }
        laydate(start);
        laydate(end);
        //日期时间范围
        $(".list").on("click",function(){
            $(".listPa").css("display","none");
            $(".calendarPa").css("display","inline-block");
            if(keep){
                $('#start').val(keepValue.split("-")[0]);
                start.choose(keepValue.split("-")[0]);
                $('#end').val(keepValue.split("-")[1]);
                end.choose(keepValue.split("-")[1]);
            }
        });
        $(".calendar").on("click",function(){
            $(".listPa").css("display","inline-block");
            $(".calendarPa").css("display","none");
            if($(".btn-group.listPa>button").hasClass("active")){
                clearTime();
            }
        });
        $(".listPa button:not(.list)").click(function(){
            keep=false;
            $(this).addClass("active").siblings().removeClass("active");
            clearTime();
            var time=formatStamp($(this).data("tag"));
            if(options.callback.hasOwnProperty("onClickTimeTag")){
                options.callback.onClickTimeTag(time);
            }
        });
        $(".calendarPa .clear").on("click",function(){
            clearTime();
            if(options.callback.hasOwnProperty("onClickClear")){
                options.callback.onClickClear();
            }
        });
        $(".calendarPa .search").click(function(){
            if($("#start").val().length!=0&&$("#end").val().length!=0){
                keep=true;
                keepValue=$("#start").val()+"-"+$("#end").val();
                $(".listPa button").removeClass("active");
                var time=new Date($("#start").val()).getTime()+"-"+new Date($("#end").val()).getTime();
                if(options.callback.hasOwnProperty("onClickSearch")){
                    options.callback.onClickSearch(time);
                }
            }else{
                if($("#start").val().length==0||$("#end").val().length==0){
                    $(".alert-laydate").show();
                    return;
                }
            }
        });
        $(document).on("click",".calendarPa .close",function(){
            $(".alert-laydate").hide();
        })
        var selectTimeTools={
            getSelectedTime:function(){
                var time;
                if(keep){
                    var startTime=new Date(keepValue.split("-")[0]).getTime();
                    var endTime=new Date(keepValue.split("-")[1]).getTime();
                    time=startTime+"-"+endTime;
                }else{
                    $(".listPa .timeTag").each(function(){
                        if($(this).hasClass("active")){
                            time=formatStamp($(this).data("tag"));
                        }
                    })
                }
                return time;
            },
            getSelectedTag:function(){
                var $this;
                if(keep){
                    $this=null;
                }else{
                    $(".listPa .timeTag").each(function(){
                        if($(this).hasClass("active")){
                            $this=$(this);
                        }
                    })
                }
                return $this;
            }
        }
        return selectTimeTools;
    }
})(jQuery)