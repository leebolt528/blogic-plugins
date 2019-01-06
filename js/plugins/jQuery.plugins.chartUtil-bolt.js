(function( $ ){
    $.fn.chart = function(data,options1) {
        if(data==null||data=="null"||data.length==0){
            data=[{
                "label":{
                    "yAxisUnit":"-",
                    "xAxisUnit":"-",
                    "zAxisUnit":"-",
                    "type":"",
                    "title":""
                },
                "result":[]
            }];
        }
        if (arguments.length == 1) {
            var options1={};
        }
       var options0={
            zoomType:"xy",
            export:false,
            lineWidth:1.7,
            cursor:'pointer',
            gaugeLevel:[50,30,20],
            chart:{
                //marginBottom 额外附加属性，内部没有默认值
                // marginTop
            },
            title: {
                enabled:false,
                align: 'left',
                color: '#55B951',
                fontSize:'14px'
            },
            legend:{
                enabled:true,
                fontWeight:"normal",
                fontSize:"12px",
                color:'#000',
                navEnabled:true,
                navHeight:40,
                y:0
            },
            labels: {
                color: "#666666", 
                fontSize: "12px" ,
                fontWeight:"normal"
            },
            stackLabels: {
                enabled: false,
                color: "contrast",
                fontSize: "11px",
                fontWeight: "bold"
            },
            dataLabels: {
                enabled: true,
                color: "contrast",
                fontSize: "11px",
                fontWeight: "bold",
                distance:30
            },
            marker:{
                enabled:false,
                radius:5
            },
            tooltip: {
                enabled:true,
                shared: true,
                color: "#333333", 
                fontSize: "12px",
                whiteSpace: "nowrap",
                fontWeight:"normal"
            },
            xAxis:{
                enabledTitle:true,
                xTitleUnit:true
            },
            yAxis:{
                enabledTitle:true,
                yTitleUnit:false
            },
            color:["#64bcff","#0dd8d1","#ff7f31", "#d84d4d", "#8085e9",
            "#90ed7d", "#f15c80", "#e4d354","#91e8e1",
            '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
            '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'],
            colorRule:['#38ae33','#ef8f40','#f64a4a',"#e6e6e6","#f4a6c4"],
            size:'100%',
            ring:{
                startAngle:-135,
                endAngle:135,
                center:['50%', '50%']
            },
            pieRing:{
                subEnabled:true,
                subY:-10,
                subfontSize:'15px',
                subunitSize:'20px',
                subfontWeight:700,
                subColor:"#333333",
                innerSize:'65%',
                outerSize:'90%',
            },
            solidgauge:{
                labelY:-22,
                dlfontSize:'30px',
                dlunitSize:'20px',
                dlfontWeight:700,
                dlBottomfontSize:'20px',
                panelOuterRadius:'100%',//100
                dataOuterRadius:'100%',//85
                plotOuterRadius:'100%',//100

                panelInnerRadius:'75%',//65
                dataInnerRadius:'75%',//65
                plotInnerRadius:'75%',//90
                ylabelsEnabled:true,
                ylabelsY:15,
                ylabelsColor:"#666666",
                ylabelsFontSize:"11px",
                tickAmount:0,
                minorTickWidth: 1,
                minorTickLength: 10,
                minorTickColor: '#999999',
                tickWidth: 2,
                tickLength: 15,
                tickColor: '#ffffff',
                titleY:10,
                titleSize:"14px",
                dialBaseLength:"60%",
                dialRearLength:"15%"
            },
            gauge:{
                labelY:-10,
                dialColor:"#0f0f0f",
                dialSize:4
            },
            singleValue:{
                fontSize:'30px',
                unitFontSize:'20px',
                fontWeight:700,
                color:"#333"

            }
       };
       switch(data[0].label.type){
        case "solidgaugechartnumIn":
        case "solidgaugechartpreIn":
            options0["solidgauge"]["panelInnerRadius"]="65%",
            options0["solidgauge"]["dataInnerRadius"]="80%",
            options0["solidgauge"]["plotInnerRadius"]="90%"
            break;
        case "solidgaugechartnumOut":
        case "solidgaugechartpreOut":
            options0["solidgauge"]["dataOuterRadius"]="85%",
            options0["solidgauge"]["panelInnerRadius"]="65%",
            options0["solidgauge"]["dataInnerRadius"]="65%",
            options0["solidgauge"]["plotInnerRadius"]="90%"
            break;
        case "gaugechartpreOut":
        case "gaugechartnumOut":
            options0["solidgauge"]["panelInnerRadius"]="65%",
            options0["solidgauge"]["plotInnerRadius"]="90%"
            break;
       }
       var options=$.extend(true,{},options0,options1);
       var xAxisUnit=data[0].label.xAxisUnit;
       var yAxisUnit=data[0].label.yAxisUnit;
       var zAxisUnit=data[0].label.zAxisUnit;

        //Y轴单位显示在标题后面时yTitleUnit=true;
        function yTitleUnitTrans(){
            if((data[0].label.type.split("chart")[0]=="gauge"||data[0].label.type.split("chart")[0]=="solidgauge")&&options.solidgauge.tickAmount==0){
                return " ";
            }
            if(data[0].label.type=="columnchartpercent"||data[0].label.type=="areachartpercent"||data[0].label.type=="barchartpercent"){
                return "%";
            }else{
                return yAxisUnit.split("-")[1];
            }
        }
        //x轴为时间戳时xAxis属性处理
        function xAxisData(defaultChart){
            var xAxis={
                tickPixelInterval: 170,
                type: 'datetime',
                dateTimeLabelFormats: {
                    millisecond: '%Y-%m-%d %H:%M:%S',
                    second: '%Y-%m-%d %H:%M:%S',
                    minute: '%Y-%m-%d %H:%M',
                    hour: '%Y-%m-%d %H',
                    day: '%Y-%m-%d',
                    week: '%Y-%m',
                    month: '%Y-%m',
                    year: '%Y'
                },
                labels:{
                    align:"right"
                    // style:{
                    //     textOverflow: 'none'
                    // }
                }
            };
            defaultChart["tooltip"]["dateTimeLabelFormats"]={
                millisecond: '%Y-%m-%d %H:%M:%S',
                second: '%Y-%m-%d %H:%M:%S',
                minute: '%Y-%m-%d %H:%M',
                hour: '%Y-%m-%d %H',
                day: '%Y-%m-%d',
                week: '%Y-%m',
                month: '%Y-%m',
                year: '%Y'
            };
            defaultChart["xAxis"]=$.extend(true,{},defaultChart["xAxis"],xAxis);
        }
        //去除饼图和柱状图drillData里值为null||"null"的数据
        function updateDrillData(batchData,drillData){
            if(batchData.label.drillData){
                batchData.label.drillData.map(function(batchDataDrill,index){
                function updateData(){
                    var data=[];
                    batchDataDrill.data.map(function(oneData){
                        if(typeof oneData === 'object' && isNaN(oneData.length) &&oneData.y!=null&&oneData.y!="null"||typeof oneData === 'object' && !isNaN(oneData.length)&&oneData[1]!=null&&oneData[1]!="null"){  
                            data.push(oneData);
                        }
                    });
                    return data;
                }
                batchData.label.drillData[index].data=updateData();
                });
                drillData=drillData.concat(batchData.label.drillData);
            }
            return drillData;
        };
        //饼图下钻处理
        function pieDrilldown(defaultChart){
            data.map(function(batchData){
                if(batchData.label.hasOwnProperty("drillData")){
                    batchData.label.drillData.map(function(elem){
                        elem.tooltip={
                            "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false)
                        }
                    });
                    defaultChart["drilldown"]={
                        series:getPieColorData(data).drillData
                    };
                }
            });
        }
        //柱状图下钻处理
        function columnDrilldown(defaultChart){
            data.map(function(batchData){
                if(batchData.label.hasOwnProperty("drillData")){
                    batchData.label.drillData.map(function(elem){
                        elem.tooltip={
                            "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false)
                        }
                    });
                    defaultChart["drilldown"]={
                        series:getColDrillData(data)
                    };
                }
            });
        }
        //获取柱状图下钻数据drillData
        function getColDrillData(){
            var drillData=[];
            data.map(function(batchData){
                drillData=updateDrillData(batchData,drillData);
            });
            return drillData;
        }
        //获取数据项名称
        function transSeriesName(batchData,oneDataResult){
            var newString;
            if(batchData.label.hasOwnProperty("seriesReg")&&batchData.label.seriesReg!==""){
                var seriesReg=batchData.label.seriesReg;
                newString = seriesReg.replace(/{{[\w\_]*}}/g, replacer);
            }else{
                newString=JSON.stringify(batchData.label);
            }
            function replacer(match) {
                var str = match.match(/{{(\S*)}}/)[1];
                var seriesName=oneDataResult.seriesAttr[str];
                return seriesName;
            }
            return newString;
        }
        //时间转换
        function add0(m){
            return m<10?'0'+m:m
        }
        function dateFormat(times){
            var time = new Date(times);
            var y = time.getFullYear().toString()/* .slice(2) */;
            var m = time.getMonth()+1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
        }
        //替换数组中两个值位置
        function swap(array,index1,index2){
            var t = array[index1];
            array[index1] = array[index2];
            array[index2] = t;
        }
        //获取series
        var parseData=function(data,count,maxValue,maxValueIndex){
            var dataproArr=[];
            switch(data[0].label.type){
                case "areachart":
                case "areasplinechart":
                case "areachartpercent":
                case "areachartnormal":
                case "linechart":
                case "splinechart":
                    data.map(function(batchData){
                        if(batchData.result==null||batchData.result=="null"){return}
                        for(var oneDataResult of batchData.result){
                            if(oneDataResult.values!=null&&oneDataResult.values!="null"&&oneDataResult.values.length!=0){
                                oneDataResult.values.map(function(point){
                                    xAxisTypeFun(data,point);
                                    point[1]=((point[1]=='null'||point[1]==null)?null:Number(point[1]));
                                    if(point[1]>maxValue){
                                        maxValueIndex=count;
                                        maxValue=point[1];
                                    }
                                });
                                var seriesElem={
                                    "data":oneDataResult.values,
                                    "tooltip": {
                                        "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false)
                                    },
                                    "name":transSeriesName(batchData,oneDataResult)
                                };
                                dataproArr.push(seriesElem);
                                count++;
                            }
                        }
                    });
                    swap(dataproArr,0,maxValueIndex);//hightcharts第一组数据最大值较小时会导致丢失此数据
                    break;
                case "piechartringrule":
                case "piechart":
                case "piechartring":
                    if(data[0].label.type=="piechartringrule"||data[0].label.type=="piechartring"){
                        var size=Math.abs(options.ring.startAngle-options.ring.endAngle)==360||270?(Number(options.size.replace("%",""))-10)+"%":options.size;
                    }else{
                        var size=options.size;
                    }
                    var colorData=getPieColorData(data);
                    var innerObj={
                        size:size,
                        innerSize: options.pieRing.innerSize,
                        data:colorData.innerData,
                        colors: colorData.color,
                        tooltip: {
                            "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false)
                        }
                    };
                    var outSiteObj={
                        size:size,
                        innerSize: options.pieRing.outerSize,
                        data: colorData.outerData,
                        colors: options.colorRule,
                        tooltip: {
                            "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false,true)
                        }
                    };
                    if(data[0].label.type=='piechart'){
                        innerObj['innerSize']='0';
                        innerObj['size']='100%';
                    }
                    dataproArr.push(innerObj);
                    if (data[0].label.type=='piechartringrule') {
                        dataproArr.push(outSiteObj);
                    }
                    break;
                case "columnchart":
                case "columnchartpercent":
                case "columnchartnormal":
                case "barchart":
                case "barchartpercent":
                case "barchartnormal":
                    data.map(function(batchData){
                        if(batchData.result==null||batchData.result=="null"){return}
                        for(var oneDataResult of batchData.result){
                            if(oneDataResult.values!=null&&oneDataResult.values!="null"&&oneDataResult.values.length!=0){
                                oneDataResult.values.map(function(point){
                                    point[1]=((point[1]=='null'||point[1]==null)?null:Number(point[1]));
                                });
                                var seriesElem={
                                    "data":oneDataResult.values,
                                    "tooltip": {
                                        "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false)
                                    },
                                    "name":transSeriesName(batchData,oneDataResult)
                                };
                                dataproArr.push(seriesElem);
                            }
                        }
                    });
                    break;
                case "columnchartdrill":
                    var series=[];
                    data.map(function(batchData){
                        if(batchData.result==null||batchData.result=="null"){return}
                        for(var oneDataResult of batchData.result){
                            if(oneDataResult.values!=null&&oneDataResult.values!="null"&&oneDataResult.values.length!=0){
                                oneDataResult.values.map(function(point){
                                    if(point[1]!=null&&point[1]!="null"){
                                        xAxisTypeFun(data,point);
                                        point[1]=((point[1]=='null'||point[1]==null)?null:Number(point[1]));
                                        var seriesElem={
                                            "name":point[0],
                                            "y":point[1],
                                            "drilldown":point[2]
                                        };
                                        series.push(seriesElem);
                                    }
                                });
                            }
                        };
                    });
                    dataproArr.push({
                        "name":transSeriesName(data[0],data[0].result[0]),
                        "tooltip": {
                            "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false)
                        },
                        "colorByPoint": true,
                        "data":series
                    });
                    break;
                case "scatterchart":
                    data.map(function(batchData){
                        if(batchData.result==null||batchData.result=="null"){return}
                        for(var oneDataResult of batchData.result){
                            if(oneDataResult.values!=null&&oneDataResult.values!="null"&&oneDataResult.values.length!=0){
                                oneDataResult.values.map(function(point){
                                    xAxisTypeFun(data,point);
                                    point[1]=((point[1]=='null'||point[1]==null)?null:Number(point[1]));
                                });
                                var seriesElem={
                                    "marker":{enabled: true},
                                    "data":oneDataResult.values,
                                    "tooltip": {
                                        "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false)
                                    },
                                    "name":transSeriesName(batchData,oneDataResult)
                                };
                                dataproArr.push(seriesElem);
                            }
                        }
                    });
                    break;
                case "bubblechart":
                    data.map(function(batchData){
                        if(batchData.result==null||batchData.result=="null"){return}
                        for(var oneDataResult of batchData.result){
                            if(oneDataResult.values!=null&&oneDataResult.values!="null"&&oneDataResult.values.length!=0){
                                oneDataResult.values.map(function(point){
                                    xAxisTypeFun(data,point);
                                    point[1]=((point[1]=='null'||point[1]==null)?null:Number(point[1]));
                                    point[2]=((point[2]=='null'||point[2]==null)?null:Number(point[2]));
                                });
                                var seriesElem={
                                    "marker":{enabled: true},
                                    "data":oneDataResult.values,
                                    "tooltip": {
                                        "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false)
                                    },
                                    "name":transSeriesName(batchData,oneDataResult)
                                };
                                dataproArr.push(seriesElem);
                            }
                        }
                    });
                    break;
                    case "solidgaugechartnum":
                    case "solidgaugechartnumIn":
                    case "solidgaugechartnumOut":

                    case "solidgaugechartpre":
                    case "solidgaugechartpreIn":
                    case "solidgaugechartpreOut":

                    case "gaugechartpre":
                    case "gaugechartpreOut":
                    case "gaugechartnum":
                    case "gaugechartnumOut":
                        var yValue=Number(data[0].result[0].values[0][1]);
                        dataproArr=[{
                            name: transSeriesName(data[0],data[0].result[0]),
                            tooltip: {
                                "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false)
                            },
                            data: [{
                                color:options.color[0],
                                radius: options.solidgauge.dataOuterRadius,
                                innerRadius:options.solidgauge.dataInnerRadius,
                                y: yValue
                            }]
                        }];
                    break;
                case "wordcloudchart":
                    var string="";
                    data.map(function(batchData){
                        if(batchData.result==null||batchData.result=="null"||batchData.result.length==0){return}
                        for(var oneDataResult of batchData.result){
                            if(oneDataResult.values!=null&&oneDataResult.values!="null"){
                                oneDataResult.values.map(function(text){
                                    string+=text;
                                });
                            }
                        }
                    });
                    var wordcloudData=wordcloud(string);
                    if(string==""){
                        dataproArr=[];
                    }else{
                        dataproArr=[{
                            data:wordcloudData,
                            tooltip: {
                                "pointFormatter":formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"tooltip",data[0].label.type,false)
                            },
                        }];
                    }
                    break;
                default:
            }
            return dataproArr;
        }
        //封装series数据时,X轴数据不同类型时的处理
        function xAxisTypeFun(data,point){
            if(data[0].label.xAxisType=="dataTime"){
                point[0]=Number(point[0])*1000;
            }else if(data[0].label.xAxisType=="number"){
                point[0]=Number(point[0]);
            }
        }
        //科学计数法
        function scienceNum(num){
            var p = Math.floor(Math.log(Math.abs(num))/Math.LN10);
            var n = parseFloat((num * Math.pow(10, -p)).toFixed(2));
            return n + 'e' + p;
        }
        //保留两位小数并去除小数点后无用的0
        function decimal(number){
            number=Number(number);
            if((Math.abs(number)>=10000||Math.abs(number)<0.1)&&Math.abs(number)!=0){
                return scienceNum(number);
            }else{
                // if(Math.abs(number)>=100){
                //     return parseInt(number);//整数部分超过两位数时不保留小数
                // }else{
                    return parseFloat(number.toFixed(2));
                //}
            }
        }
        //Y轴刻度是否显示单位判断
        function yTitleUnit(){
            return yAxisUnit.split("-")[1]!=''&&options.yAxis.yTitleUnit&&yAxisUnit.split("-")[1]!="KiB/s"&&yAxisUnit.split("-")[1]!="KiB";
        }
        //X轴刻度是否显示单位判断
        function xTitleUnit(){
            return xAxisUnit.split("-")[1]!=''&&options.xAxis.xTitleUnit&&xAxisUnit.split("-")[1]!="KiB/s"&&xAxisUnit.split("-")[1]!="KiB";
        }
        var formatterOtherY=function(value) {
            if(Math.abs(value)>=10000){
                return Math.abs(value)>=Math.pow(10,8)?decimal(value):decimal(value/10000) + 'w';
            }else if(Math.abs(value)>=1000){
                return decimal(value/1000) + 'k';
            }else{
                return decimal(value);
            }
        };
        var formatterKiBs=function(value,tooltipBoolean,dataLabelsBoolean) {
            var thisValue=dataLabelsBoolean?this.y:this.value;
            if(tooltipBoolean){
                thisValue=value;
            }
            if(Math.abs(thisValue)>=Math.pow(1024,3)){
                return decimal(thisValue/Math.pow(1024,3))+'TiB/s';
            }else if(Math.abs(thisValue)>=Math.pow(1024,2)){
                return decimal(thisValue/Math.pow(1024,2))+'GiB/s';
            }else if(Math.abs(thisValue)>=1024){
                return decimal(thisValue/1024)+'MiB/s';
            }else if(Math.abs(thisValue)<1){
                return decimal(thisValue*1024)+'Byte/s';
            }else{
                //return parseInt(thisValue)+'KiB/s';
                return decimal(thisValue)+'KiB/s';
            }
        };
        var formatterKiB=function(value,tooltipBoolean,dataLabelsBoolean) {
            var thisValue=dataLabelsBoolean?this.y:this.value;
            if(tooltipBoolean){
                thisValue=value;
            }
            if(Math.abs(thisValue)>=Math.pow(1024,3)){
                return decimal(thisValue/Math.pow(1024,3))+ 'TiB';
            }else if(Math.abs(thisValue)>=Math.pow(1024,2)){
                return decimal(thisValue/Math.pow(1024,2))+'GiB';
            }else if(Math.abs(thisValue)>=1024){
                return decimal(thisValue/1024)+'MiB';
            }else if(Math.abs(thisValue)<1){
                return decimal(thisValue*1024)+'Byte';
            }else{
                //return parseInt(thisValue)+'KiB';
                return decimal(thisValue)+'KiB';
            }
        };
        var formatterS=function(value,tooltipBoolean,dataLabelsBoolean) {
            var thisValue=dataLabelsBoolean?this.y:this.value;
            if(tooltipBoolean){
                thisValue=value;
            }
            if(Math.abs(thisValue)>=Math.pow(60,2)){
                return decimal(thisValue/Math.pow(60,2))+ 'h';
            }else if(Math.abs(thisValue)>=60){
                return decimal(thisValue/60)+'min';
            }else if(Math.abs(thisValue)<1){
                return decimal(thisValue*1000)+'ms';
            }else if(Math.abs(thisValue)<0.001){
                return decimal(thisValue*Math.pow(1000,2))+'μs';
            }else{
                //return parseInt(thisValue)+'s';
                return decimal(thisValue)+'s';
            }
        };
        //Y轴和Z轴单位刻度+提示框格式单位处理
        function formatterFun(xUnit,yUnit,zUnit,positionType,chartType,dataLabelsBoolean,outerBoolean){
            var data1=data;
            var pointFormat=function() {
                if(yUnit=="KiB/s"){
                    var pointY=formatterKiBs(this.y,"y",dataLabelsBoolean);
                }else if(yUnit=="KiB"){
                    var pointY=formatterKiB(this.y,"y",dataLabelsBoolean);
                }else if(yUnit=="s"){
                    var pointY=formatterS(this.y,"y",dataLabelsBoolean);
                }else{
                    var pointY=formatterOtherY(this.y)+yUnit;
                }

                if(zUnit=="KiB/s"){
                    var pointZ=formatterKiBs(this.z,"z",dataLabelsBoolean);
                }else if(zUnit=="KiB"){
                    var pointZ=formatterKiB(this.z,"z",dataLabelsBoolean);
                }else if(zUnit=="s"){
                    var pointZ=formatterS(this.z,"z",dataLabelsBoolean);
                }else{
                    var pointZ=formatterOtherY(this.z)+zUnit;
                }
                if(data1[0].label.xAxisType=="dataTime"){
                    var pointX=dateFormat(this.x);
                }else if(data1[0].label.xAxisType=="number"){
                    if(xUnit=="KiB/s"){
                        var pointX=formatterKiBs(this.x,"x",dataLabelsBoolean);
                    }else if(xUnit=="KiB"){
                        var pointX=formatterKiB(this.x,"x",dataLabelsBoolean);
                    }else if(xUnit=="s"){
                        var pointX=formatterS(this.x,"x",dataLabelsBoolean);
                    }else{
                        var pointX=formatterOtherY(this.x)+xUnit;
                    }
                }else{
                    var pointX=this.x;
                }
                
                if((chartType=="piechart"||chartType=="piechartringrule")&&outerBoolean){
                    return '<span style="color: '+ this.color + '">\u25CF占比</span> '+': <b>'+decimal(Number(this.percentage))+'%</b>'
                }else if(chartType=="piechart"||chartType=="piechartringrule"||chartType=="piechartring"){
                    return '<span style="color: '+ this.color + '">\u25CF占比</span> '+': <b>'+decimal(Number(this.percentage))+'%</b><br/><span style="color: '+ this.color + '">\u25CF值</span> '+': <b>'+pointY+'</b>'
                }else if(chartType=="scatterchart"){
                    return '<span style="color: '+ this.series.color + '">'+pointX+"  "+pointY+'</span> ';
                }else if(chartType=="bubblechart"){
                    return '<span style="color: '+ this.series.color + '">('+pointX+","+pointY+")"+"  大小:"+pointZ+'</span> ';
                }else if(chartType=="columnchartpercent"||chartType=="areachartpercent"||chartType=="barchartpercent"){
                    return '<span style="color: '+ this.series.color + '">\u25CF'+this.series.name+'</span> '+': <b>'+ decimal(Number(this.percentage))+'%'+'('+pointY+')</b><br/>'
                }else if(chartType=="columnchartnormal"||chartType=="areachartnormal"||chartType=="barchartnormal"){
                    return '<span style="color: '+ this.series.color + '">\u25CF'+this.series.name+'</span> '+': <b>'+ pointY+'('+decimal(Number(this.percentage))+'%)</b><br/>'
                }else if(chartType=="columnchartdrill"){
                    return '<span style="color: '+ this.series.color + '">\u25CF</span> '+'<b>'+ pointY+'</b><br/>'
                }else if(chartType.split("chart")[0]=="solidgauge"||chartType.split("chart")[0]=="gauge"){
                    return '<span style="color: '+ this.color + '">\u25CF值</span> '+': <b>'+pointY+'</b>'
                }else if(chartType=="wordcloudchart"){
                    return '<span style="color: '+ this.color + '">\u25CF'+this.name+'</span> '+': <b>1:'+this.weight+'</b>'
                }else{
                    return '<span style="color: '+ this.series.color + '">\u25CF'+this.series.name+'</span> '+': <b>'+ pointY+'</b><br/>'
                }
            };
            var formatterOtherV=function(){
                var xyUnit;
                var thisValue=dataLabelsBoolean?this.y:this.value;
                if(positionType=="yAxis"){
                    xyUnit=yUnit;
                }else{
                    xyUnit=xUnit;
                }
                if(dataLabelsBoolean||yTitleUnit()||xTitleUnit()){
                    xyUnit='';
                }
                if(dataLabelsBoolean&&(data1[0].label.type=="columnchartpercent"||data1[0].label.type=="areachartpercent"||data1[0].label.type=="barchartpercent")){
            
                    return decimal(Number(this.percentage))+"%";
                }
                
                if(Math.abs(thisValue)>=10000){
                    return Math.abs(thisValue)>=Math.pow(10,8)?decimal(thisValue)+xyUnit:decimal(thisValue/10000) + 'w'+xyUnit;
                }else if(Math.abs(thisValue)>=1000){
                    return decimal(thisValue/1000)+'k'+xyUnit;
                }else{
                    return decimal(thisValue)+xyUnit;
                }
            };
            if(positionType=="tooltip"){
                return pointFormat;
            }else if(positionType=="yAxis"){//Y轴刻度显示和数据标签都使用yAxis
                if(chartType=="columnchartpercent"||chartType=="areachartpercent"||chartType=="barchartpercent"){
                    yUnit="%";
                }
                if(yUnit=="KiB/s"){
                    return formatterKiBs;
                }else if(yUnit=="KiB"){
                    return formatterKiB;
                }else if(yUnit=="s"){
                    return formatterS;
                }else{
                    return formatterOtherV;
                }
            }else{
                if(xUnit=="KiB/s"){
                    return formatterKiBs;
                }else if(xUnit=="KiB"){
                    return formatterKiB;
                }else if(xUnit=="s"){
                    return formatterS;
                }else{
                    return formatterOtherV;
                }
            }
        }
        //仪表盘单值单位换算
        function singleValue(value,unit,dataLabelsBoolean){
            if(unit=="KiB/s"){
                var pointY=formatterKiBs(value,true,dataLabelsBoolean);
            }else if(unit=="KiB"){
                var pointY=formatterKiB(value,true,dataLabelsBoolean);
            }else if(unit=="s"){
                var pointY=formatterS(value,true,dataLabelsBoolean);
            }else{
                var pointY=formatterOtherY(value)+unit;
            }
            if(Math.abs(pointY.split('.')[0])>=100){
                return parseInt(pointY.match(/^[-+]?\d[\d\.]*/)[0])+pointY.split(/^[-+]?\d[\d\.]*/)[1];//整数部分超过两位数时不保留小数
            }else{
                return pointY;
            }
        }
        //环图和仪表盘百分比计算
        function singlePreValue(){
            //return parseInt(getPieColorData(data).innerData[0].y/(getPieColorData(data).innerData[0].y+getPieColorData(data).innerData[1].y)*100)+"%";
            return decimal(getPieColorData(data).innerData[0].y/(getPieColorData(data).innerData[0].y+getPieColorData(data).innerData[1].y)*100)+"%";
        }
        //得到饼图内环颜色+内外环值
        function getPieColorData(data){
            var innerData=[];
            var drillData=[];
            data.map(function(batchData){
                if(batchData.result==null||batchData.result=="null"){return}
                for(var oneDataResult of batchData.result){
                    if(oneDataResult.values!=null&&oneDataResult.values!="null"&&oneDataResult.values.length!=0&&oneDataResult.values[0][1]!=null&&oneDataResult.values[0][1]!="null"){
                        var elem=oneDataResult.values[0];
                        elem[1]=((elem[1]=='null'||elem[1]==null)?null:Number((Number(elem[1]).toFixed(2))));
                        innerData.push({
                            name:transSeriesName(batchData,oneDataResult),
                            y:elem[1]
                        });
                        if(batchData.label.hasOwnProperty("drillData")){
                            innerData[innerData.length-1]["drilldown"]=elem[2];
                        }
                    }
                };
                drillData=updateDrillData(batchData,drillData);
            });
            var outerData=[];
            var color=options.color;
            if(data[0].label.type=="piechartringrule"){
                var allValue=innerData[0]["y"]+innerData[1]["y"];
                var allPre=0;
                data[0].label.outerData.map(function(elem,index){
                    elem[1]=Number((Number(elem[1]).toFixed(2)));
                    outerData.push({
                        name:elem[0],
                        y:elem[1]
                    });
                    allPre+=elem[1];
                });
                if(innerData[0]["y"]/allValue>outerData[0]["y"]+outerData[1]["y"]/allPre){
                    color=[options.colorRule[2],options.colorRule[3]];
                }else if(innerData[0]["y"]/allValue>outerData[0]["y"]/allPre){
                    color=[options.colorRule[1],options.colorRule[3]];
                }else{
                    color=[options.colorRule[0],options.colorRule[3]];
                }
            }
            return {color:color,innerData:innerData,outerData:outerData,drillData:drillData};
        }
        //获取仪表盘刻度数组
        function tickPositions(amount,max){
            if(amount==1){
                amount=2;
            }
            var step=max/(amount-1);
            var tickArr=[0];
            var tick=0;
            for(var i=1;i<amount;i++){
                if(i!==amount-1){
                    tick+=step;
                }else{
                    tick=max;
                }
                tickArr.push(tick);
            }
            return tickArr;
        }
        //词云图series.data处理
        function wordcloud(string){
            var data=string
            .split(/[,\. ]+/g)
            .reduce(function (arr, word) {
                var obj = arr.find(function (obj) {
                    return obj.name === word;
                });
                if (obj) {
                    obj.weight += 1;
                } else {
                    obj = {
                        name: word,
                        weight: 1
                    };
                    arr.push(obj);
                }
                return arr;
            }, []);
            return data;
        }
        //获取series数据的最小Y值
        function updateData(data){//去除值为null||"null"的数据
            var rsDatas=[];
            data.map(function(oneData){
                if(oneData[1]!=null&&oneData[1]!="null"){  
                    rsDatas.push(oneData);
                }
            });
            return rsDatas;
        }
        function getMinYaxis(defaultChart){
            var resultSeries = defaultChart["series"];
            var minExtreme = 0;
            for(var i = 0; i < resultSeries.length; i++) {
                var rs = resultSeries[i];
                var rsDatas=updateData(rs["data"]);
                for(var j = 0; j < rsDatas.length; j++) {
                    var yval = parseInt(rsDatas[j][1]);
                    if(minExtreme == 0) {
                        minExtreme = yval;
                    } else {
                        if(minExtreme > yval) {
                            minExtreme = yval;
                        }
                    }
                }
            }
            return minExtreme;
        }
        //双环图和仪表盘(两组数据缺一不可)数据不全时返回false
        function booleanNull(data){
            var boolean=true;
            data.map(function(batchData){
                if(batchData.result==null||batchData.result=="null"||batchData.result.length==0){ boolean=false;return}
                for(var oneDataResult of batchData.result){
                    if(oneDataResult.values==null||oneDataResult.values=="null"||oneDataResult.values.length==0){
                        boolean=false;return
                    }else if(!(/^([-+]?\d[\d\.]*)$/).test(oneDataResult.values[0][1])){
                        boolean=false;return
                    }
                }
            });
            return boolean;
        }
        //仪表盘dataLabels展示格式
        function formatGuageFun(data,options,color,titlePre,titleVal){
            var format='';
            var dlBottomDisplay=options.tooltip.enabled?"none":"block";
            if(data[0].label.type.split("chart")[1]=="pre"||data[0].label.type.split("chart")[1]=="preIn"||data[0].label.type.split("chart")[1]=="preOut"){
                format='<div style="display:inline-block;text-align:center;color:' +
                color+ '"><span style="font-size:'+options.solidgauge.dlfontSize+';">'+titlePre.match(/^[-+]?\d[\d\.]*/)[0]+'</span><span style="font-size:'+options.solidgauge.dlunitSize+';">'+titlePre.replace(/^[-+]?\d[\d\.]*/,'')+'</span></div><br/>'
                format+='<div style="display:'+dlBottomDisplay+';text-align:center;color:' +
                'silver;font-size:'+options.solidgauge.dlBottomfontSize+ ';margin-top:-15px"><span>'+titleVal.match(/^[-+]?\d[\d\.]*/)[0]+'</span><span>'+titleVal.replace(/^[-+]?\d[\d\.]*/,'')+'</span></div>';
            }else{
                format='<div style="display:inline-block;text-align:center;color:' +
                color+ '"><span style="font-size:'+options.solidgauge.dlfontSize+';">'+titleVal.match(/^[-+]?\d[\d\.]*/)[0]+'</span><span style="font-size:'+options.solidgauge.dlunitSize+';">'+titleVal.replace(/^[-+]?\d[\d\.]*/,'')+'</span></div><br/>'
                format+='<div style="display:'+dlBottomDisplay+';text-align:center;color:' +
                'silver;font-size:'+options.solidgauge.dlBottomfontSize+ ';margin-top:-15px"><span>'+titlePre.match(/^[-+]?\d[\d\.]*/)[0]+'</span><span>'+titlePre.replace(/^[-+]?\d[\d\.]*/,'')+'</span></div>';
            }
            return format;
        }
        //双环图副标题text展示格式
        function ruleSubText(options){
            var title=singlePreValue();
            return '<div><span style="font-size:'+options.pieRing.subfontSize+';">'+title.match(/^[-+]?\d[\d\.]*/)[0]+'</span><span style="font-size:'+options.pieRing.subunitSize+';">'+title.replace(/^[-+]?\d[\d\.]*/,'')+'</span></div><br/>'
        }


        var defaultChart = function(divId,data,options) {
            Highcharts.setOptions({
                lang : {
                    loading : "加载中...",
                    noData: '无响应数据'
                },
                global : {
                    useUTC : false
                },
                colors: options.color
            });
            var defaultChart = {
                chart: {
                    renderTo : divId,
                    zoomType: options.zoomType
                },
                title: {
                    text: options.title.enabled?data[0].label.title:null,
                    align: options.title.align,
                    style: {
                        color: options.title.color,
                        fontSize:options.title.fontSize
                    }
                },
                xAxis:{
                    labels: {
                        style: { 
                            color: options.labels.color, 
                            fontSize: options.labels.fontSize ,
                            fontWeight:options.labels.fontWeight
                        }
                    },
                    title: {
                        enabled:options.xAxis.enabledTitle,
                        text:xAxisUnit.split("-")[0]+(xTitleUnit()?"("+xAxisUnit.split("-")[1]+")":""),
                        align: 'high',
                        style: { 
                            color: options.labels.color, 
                            fontSize: options.labels.fontSize ,
                            fontWeight:options.labels.fontWeight
                        }
                    }
                },
                yAxis:{
                    title: {
                        enabled:options.yAxis.enabledTitle,
                        text:yAxisUnit.split("-")[0]+(yTitleUnit()?"("+yTitleUnitTrans()+")":"")
                    },
                    labels: {
                        style: { 
                            color: options.labels.color, 
                            fontSize: options.labels.fontSize ,
                            fontWeight:options.labels.fontWeight
                        }
                    },
                    stackLabels: {
                        enabled: options.stackLabels.enabled,
                        style: {
                            color: options.stackLabels.color, 
                            fontSize: options.stackLabels.fontSize ,
                            fontWeight:options.stackLabels.fontWeight
                        }
                    }
                },
                credits:{
                    enabled:false
                },
                exporting: {
                    enabled: options.export,
                    filename:data[0].label.title
                },
                navigation: {
                    menuItemHoverStyle: {
                        background: '#64bcff',
                    },
                    buttonOptions: {
                        symbolStrokeWidth: 1.5
                    }
                },
                legend : {
                    enabled:options.legend.enabled,
                    itemStyle : {
                        fontFamily : '微软雅黑',
                        fontSize : options.legend.fontSize,
                        fontWeight : options.legend.fontWeight
                    },
                    color: options.legend.color,
                    maxHeight:options.legend.navHeight,
                    navigation:{
                        enabled:options.legend.navEnabled
                    },
                    y:options.legend.y
                },
                tooltip: {
                    enabled:options.tooltip.enabled,
                    shared: options.tooltip.shared,
                    style:{ 
                        color: options.tooltip.color, 
                        fontSize: options.tooltip.fontSize,
                        whiteSpace: options.tooltip.whiteSpace ,
                        fontWeight:options.tooltip.fontWeight
                    }
                }
            };
            //额外附加属性，内部没有默认值
            if(options["chart"].hasOwnProperty("marginBottom")){
                defaultChart["chart"]["marginBottom"]=options.chart.marginBottom;
            }
            if(options["chart"].hasOwnProperty("marginTop")){
                defaultChart["chart"]["marginTop"]=options.chart.marginTop;
            }
            switch(data[0].label.type){
                case "areachart":  
                case "areasplinechart":
                case "areachartpercent":
                case "areachartnormal":
                case "linechart":
                case "splinechart":
                    defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                    if(data[0].label.xAxisType=="dataTime"){
                        xAxisData(defaultChart);
                    }else if(data[0].label.xAxisType=="number"){
                        var xAxis={
                            labels:{
                                formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"xAxis",data[0].label.type,false),
                            }
                        };
                        defaultChart["xAxis"]=$.extend(true,{},defaultChart["xAxis"],xAxis);
                    }else{
                        defaultChart["xAxis"]["type"]="category";
                        defaultChart["xAxis"]["tickmarkPlacement"]="on";
                    };
                    var yAxis={
                        labels:{
                            formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"yAxis",data[0].label.type,false)
                        }
                    };
                    defaultChart["yAxis"]=$.extend(true,{},defaultChart["yAxis"],yAxis);
                    defaultChart["series"]=parseData(data,0,Number.MIN_VALUE,0);
                    defaultChart["tooltip"]["headerFormat"]='<span>{point.key}</span><br/>';
                    defaultChart["plotOptions"]={
                        area: {
                            cursor: options.cursor,
                            fillOpacity: 0.3,
                            lineWidth: 1.2,
                            states: {
                                hover: {
                                    lineWidth: 1.2
                                }
                            },
                            marker: {
                                enabled: options.marker.enabled,
                                radius: 5,
                                states: {
                                    hover: {
                                        radius:5
                                    }
                                }
                            },
                            stacking:data[0].label.type.split("chart")[1]
                        },
                        line: {
                            cursor: options.cursor,
                            lineWidth: options.lineWidth,
                            states: {
                                hover: {
                                    lineWidth: options.lineWidth
                                }
                            },
                            marker: {
                                enabled: options.marker.enabled,
                                radius: options.marker.radius,
                                states: {
                                    hover: {
                                        radius: options.marker.radius
                                    }
                                }
                            },
                            shadow: false
                        },
                        spline:{
                            cursor: options.cursor,
                            lineWidth: options.lineWidth,
                            states: {
                                hover: {
                                    lineWidth: options.lineWidth
                                }
                            },
                            marker: {
                                enabled: options.marker.enabled,
                                radius: options.marker.radius,
                                states: {
                                    hover: {
                                        radius: options.marker.radius
                                    }
                                }
                            },
                            shadow: false
                        },
                        areaspline:{
                            cursor: options.cursor,
                            fillOpacity: 0.3,
                            lineWidth: 1.2,
                            states: {
                                hover: {
                                    lineWidth: 1.2
                                }
                            },
                            marker: {
                                enabled: options.marker.enabled,
                                radius: 5,
                                states: {
                                    hover: {
                                        radius: 5
                                    }
                                }
                            },
                            shadow: false
                        }
                    };
                    if(data[0].label.type=="areachart"||data[0].label.type=="areasplinechart") {
                        var minExtreme=getMinYaxis(defaultChart);
                        defaultChart["yAxis"]["min"] = minExtreme;
                    }
                    break;
                case "piechartringrule":
                    var boolean=booleanNull(data);
                    if(boolean){
                        defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                        defaultChart["subtitle"]={
                            text:options.pieRing.subEnabled?ruleSubText(options,color):null,
                            align: 'center',
                            verticalAlign: 'middle',
                            y: options.pieRing.subY,
                            style: {
                                color: getPieColorData(data).color[0],
                                fontSize:options.pieRing.subfontSize,
                                fontWeight:options.pieRing.subfontWeight
                            }
                        };
                        defaultChart["tooltip"]["headerFormat"]='<span>{point.key}</span><br/>';
                        var center=Math.abs(options.ring.startAngle-options.ring.endAngle)==270?[options.ring.center[0],Number(options.ring.center[1].replace("%",""))+7+"%"]:options.ring.center;
                        defaultChart["plotOptions"]={
                            pie: {
                                dataLabels: {
                                    enabled: false,
                                    style: {
                                        color: options.dataLabels.color, 
                                        fontSize: options.dataLabels.fontSize ,
                                        fontWeight:options.dataLabels.fontWeight
                                    },
                                    distance:options.dataLabels.distance
                                },
                                startAngle: options.ring.startAngle, // 圆环的开始角度
                                endAngle: options.ring.endAngle,    // 圆环的结束角度
                                center: center,
                                showInLegend: false,
                                cursor: options.cursor
                            }
                        };
                        defaultChart["series"]=parseData(data);
                    }
                    break;
                case "piechart":
                    defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                    defaultChart["tooltip"]["headerFormat"]='<span>{point.key}</span><br/>';
                    defaultChart["plotOptions"]={
                        pie: {
                            cursor: options.cursor,
                            allowPointSelect: true,
                            dataLabels: {
                                enabled:options.dataLabels.enabled,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: options.dataLabels.color, 
                                    fontSize: options.dataLabels.fontSize ,
                                    fontWeight:options.dataLabels.fontWeight
                                },
                                distance:options.dataLabels.distance
                            },
                            showInLegend: options.legend?true:false
                        }
                    };
                    defaultChart["series"]=parseData(data);
                    pieDrilldown(defaultChart);
                    break;
                case "piechartring":
                    defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                    defaultChart["subtitle"]={
                        text:options.pieRing.subEnabled?data[0].label.title:null,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: options.pieRing.subY,
                        style: {
                            color: options.pieRing.subColor,
                            fontSize:options.pieRing.subfontSize,
                            fontWeight:options.pieRing.subfontWeight
                        }
                    };
                    defaultChart["tooltip"]["headerFormat"]='<span>{point.key}</span><br/>';
                    var center=Math.abs(options.ring.startAngle-options.ring.endAngle)==270?[options.ring.center[0],Number(options.ring.center[1].replace("%",""))+7+"%"]:options.ring.center;
                    defaultChart["plotOptions"]={
                        pie: {
                            cursor: options.cursor,
                            allowPointSelect: true,
                            dataLabels: {
                                enabled:options.dataLabels.enabled,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: options.dataLabels.color, 
                                    fontSize: options.dataLabels.fontSize ,
                                    fontWeight:options.dataLabels.fontWeight
                                },
                                distance:options.dataLabels.distance
                            },
                            startAngle:options.ring.startAngle, // 圆环的开始角度
                            endAngle:options.ring.endAngle,  // 圆环的结束角度
                            center:center,
                            showInLegend: options.legend?true:false,
                        }
                    };
                    defaultChart["series"]=parseData(data);
                break;
                case "columnchartdrill":
                    defaultChart["legend"]["enabled"]=false;
                case "columnchart":
                case "columnchartpercent":
                case "columnchartnormal":
                case "columnchartdrill":
                    defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                    if(data[0].label.xAxisType=="dataTime"){
                        xAxisData(defaultChart);
                    }else if(data[0].label.xAxisType=="number"){
                        var xAxis={
                            labels:{
                                formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"xAxis",data[0].label.type,false),
                            }
                        };
                        defaultChart["xAxis"]=$.extend(true,{},defaultChart["xAxis"],xAxis);
                    }else{
                        defaultChart["xAxis"]["type"]="category";
                    };
                    var yAxis={
                        labels:{
                            formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"yAxis",data[0].label.type,false)
                        }
                    };
                    defaultChart["yAxis"]=$.extend(true,{},defaultChart["yAxis"],yAxis);
                    defaultChart["series"]=parseData(data);
                    defaultChart["tooltip"]["headerFormat"]='<span>{point.key}</span><br/>';
                    defaultChart["plotOptions"]={
                        column: {
                            stacking: data[0].label.type.split("chart")[1],
                            dataLabels: {
                                enabled: options.dataLabels.enabled,
                                formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"yAxis",data[0].label.type,true),
                                style: {
                                    color: options.dataLabels.color, 
                                    fontSize: options.dataLabels.fontSize ,
                                    fontWeight:options.dataLabels.fontWeight
                                }
                            },
                            cursor: options.cursor
                        }
                    }
                    columnDrilldown(defaultChart);
                    break;
                case "barchart":
                case "barchartpercent":
                case "barchartnormal":
                    defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                    if(data[0].label.xAxisType=="dataTime"){
                        xAxisData(defaultChart);
                    }else if(data[0].label.xAxisType=="number"){
                        var xAxis={
                            labels:{
                                formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"xAxis",data[0].label.type,false),
                            }
                        };
                        defaultChart["xAxis"]=$.extend(true,{},defaultChart["xAxis"],xAxis);
                    }else{
                        defaultChart["xAxis"]["type"]="category";
                    };
                    var yAxis={
                        title: {
                            align: 'high'
                        },
                        labels:{
                            formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"yAxis",data[0].label.type)
                        }
                    };
                    defaultChart["yAxis"]=$.extend(true,{},defaultChart["yAxis"],yAxis);
                    defaultChart["xAxis"]["title"]["align"]="middle";
                    defaultChart["series"]=parseData(data);
                    defaultChart["tooltip"]["headerFormat"]='<span>{point.key}</span><br/>';
                    defaultChart["plotOptions"]={
                        bar: {
                            stacking: data[0].label.type.split("chart")[1],
                            dataLabels: {
                                enabled: options.dataLabels.enabled,
                                formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"yAxis",data[0].label.type,true),
                                style: {
                                    color: options.dataLabels.color, 
                                    fontSize: options.dataLabels.fontSize ,
                                    fontWeight:options.dataLabels.fontWeight
                                }
                            },
                            cursor: options.cursor
                        }
                    }
                    break;
                case "scatterchart":
                    defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                    if(data[0].label.xAxisType=="dataTime"){
                        xAxisData(defaultChart);
                    }else if(data[0].label.xAxisType=="number"){
                        var xAxis={
                            labels:{
                                formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"xAxis",data[0].label.type,false),
                            }
                        };
                        defaultChart["xAxis"]=$.extend(true,{},defaultChart["xAxis"],xAxis);
                    }else{
                        defaultChart["xAxis"]["type"]="category";
                        defaultChart["xAxis"]["tickmarkPlacement"]="on";
                    };
                    var yAxis={
                        labels:{
                            formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"yAxis",data[0].label.type,false)
                        }
                    };
                    defaultChart["yAxis"]=$.extend(true,{},defaultChart["yAxis"],yAxis);
                    defaultChart["series"]=parseData(data);
                    defaultChart["plotOptions"]={
                        scatter: {
                            cursor: options.cursor,
                            marker: {
                                radius: options.marker.radius
                            }
                        }
                    }
                    break;
                case "bubblechart":
                    defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                    if(data[0].label.xAxisType=="dataTime"){
                        xAxisData(defaultChart);
                    }else if(data[0].label.xAxisType=="number"){
                        var xAxis={
                            labels:{
                                formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"xAxis",data[0].label.type,false),
                            }
                        };
                        defaultChart["xAxis"]=$.extend(true,{},defaultChart["xAxis"],xAxis);
                    }else{
                        defaultChart["xAxis"]["type"]="category";
                        defaultChart["xAxis"]["tickmarkPlacement"]="on";
                    };
                    var yAxis={
                        labels:{
                            formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"yAxis",data[0].label.type,false)
                        }
                    };
                    defaultChart["yAxis"]=$.extend(true,{},defaultChart["yAxis"],yAxis);
                    defaultChart["series"]=parseData(data);
                    defaultChart["plotOptions"]={
                        bubble: {
                            cursor: options.cursor
                        }
                    }
                    break;
                case "solidgaugechartnum":
                case "solidgaugechartnumIn":
                case "solidgaugechartnumOut":

                case "solidgaugechartpre":
                case "solidgaugechartpreIn":
                case "solidgaugechartpreOut":

                case "gaugechartpre":
                case "gaugechartpreOut":
                case "gaugechartnum":
                case "gaugechartnumOut":
                    var boolean=booleanNull(data);
                    if(boolean){
                        defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                        //if(data[0].label.type.split("chart")[1]=="pre"||data[0].label.type.split("chart")[1]=="preIn"||data[0].label.type.split("chart")[1]=="preOut"){
                            var titlePre=singlePreValue();
                        //}else{
                            var titleVal=singleValue(data[0].result[0].values[0][1],data[0].label.yAxisUnit.split("-")[1],false);
                        //}
                        var preValue=Number(singlePreValue().replace("%",""));
                        defaultChart["tooltip"]["headerFormat"]='<span>{point.key}</span><br/>';
                        var size=Math.abs(options.ring.startAngle-options.ring.endAngle)==360||270?(Number(options.size.replace("%",""))-15)+"%":options.size;
                        var center=Math.abs(options.ring.startAngle-options.ring.endAngle)==270?[options.ring.center[0],Number(options.ring.center[1].replace("%",""))+7+"%"]:options.ring.center;
                        defaultChart["pane"]={
                            size:size,
                            startAngle:options.ring.startAngle, // 圆环的开始角度
                            endAngle:options.ring.endAngle,   // 圆环的结束角度
                            center:center,
                            background: [{
                                outerRadius: options.solidgauge.panelOuterRadius,
                                innerRadius: options.solidgauge.panelInnerRadius,
                                backgroundColor: options.colorRule[3],
                                shape: 'arc'
                            }]
                        };
                        if(data.length==2){
                            var maxV=Number(data[0].result[0].values[0][1])+Number(data[1].result[0].values[0][1]);
                        }else{
                            var maxV=Number(data[0].result[0].values[0][1])+Number(data[0].result[1].values[0][1]);
                        }
                        var agaugeLevelAll=options.gaugeLevel[0]+options.gaugeLevel[1]+options.gaugeLevel[2];
                        var firstL=options.gaugeLevel[0]/agaugeLevelAll;
                        var secondL=(options.gaugeLevel[0]+options.gaugeLevel[1])/agaugeLevelAll;

                        var color=preValue<=firstL*100?options.colorRule[0]:preValue>secondL*100?options.colorRule[2]:options.colorRule[1];
                        var tickAmount=Math.abs(options.ring.startAngle-options.ring.endAngle)<360?options.solidgauge.tickAmount:options.solidgauge.tickAmount-1;
                        var showFirstLabel=Math.abs(options.ring.startAngle-options.ring.endAngle)<360?true:false;
                        var yAxis={
                            title: {
                                text: yTitleUnit()?yTitleUnitTrans():"",
                                y:options.solidgauge.titleY,
                                style:{
                                    fontSize:options.solidgauge.titleSize
                                }
                            },
                            labels:{
                                enabled:options.solidgauge.ylabelsEnabled,
                                formatter:formatterFun(xAxisUnit.split("-")[1],yAxisUnit.split("-")[1],zAxisUnit.split("-")[1],"yAxis",data[0].label.type,false),
                                y:options.solidgauge.ylabelsY,
                                style:{
                                    color:options.solidgauge.ylabelsColor,
                                    fontSize:options.solidgauge.ylabelsFontSize
                                }
                            },
                            min: 0,
                            max: maxV,
                            lineWidth: 0,
                            tickAmount:tickAmount,
                            showFirstLabel:showFirstLabel,
                            showLastLabel:true,
                            minorTickInterval: maxV/(options.solidgauge.tickAmount*3),
                            minorTickWidth: options.solidgauge.minorTickWidth,
                            minorTickLength: options.solidgauge.minorTickLength,
                            minorTickColor: options.solidgauge.minorTickColor,

                            tickWidth: options.solidgauge.tickWidth,
                            tickLength: options.solidgauge.tickLength,
                            tickColor: options.solidgauge.tickColor
                        };
                        if(data[0].label.type.split("chart")[0]=="gauge"){
                            defaultChart["yAxis"]["plotBands"]=[{
                                from: 0,
                                to: maxV*firstL,//gaugeLevel
                                color: options.colorRule[0], // green,
                                outerRadius: options.solidgauge.plotOuterRadius,
                                innerRadius: options.solidgauge.plotInnerRadius
                            }, {
                                from: maxV*firstL,
                                to: maxV*secondL,
                                color: options.colorRule[1], // yellow
                                outerRadius: options.solidgauge.plotOuterRadius,
                                innerRadius: options.solidgauge.plotInnerRadius
                            }, {
                                from: maxV*secondL,
                                to: maxV,
                                color: options.colorRule[2], // red
                                outerRadius: options.solidgauge.plotOuterRadius,
                                innerRadius: options.solidgauge.plotInnerRadius
                            }];
                            defaultChart["plotOptions"]={
                                gauge: {
                                    dial:{
                                        backgroundColor: options.gauge.dialColor,
                                        baseLength: options.gauge.dialBaseLength,
                                        baseWidth: options.gauge.dialSize,
                                        radius: "60%",
                                        rearLength:options.gauge.dialRearLength,
                                        topWidth:1
                                    },
                                    pivot:{
                                        radius: options.gauge.dialSize,
                                        backgroundColor: options.gauge.dialColor
                                    },
                                    cursor: options.cursor,
                                    linecap: 'round',
                                    stickyTracking: false,
                                    showInLegend: false,
                                    dataLabels: {
                                        borderWidth: 0,
                                        y: options.gauge.labelY,
                                        useHTML: true,
                                        format: formatGuageFun(data,options,color,titlePre,titleVal),
                                        style:{
                                            fontWeight: options.solidgauge.dlfontWeight
                                        }
                                    }
                                }
                            };
                        }else{
                            defaultChart["yAxis"]["stops"]= [[1,color]];
                            if(options.solidgauge.panelInnerRadius!=options.solidgauge.plotInnerRadius){
                                yAxis.plotBands= [{
                                    from: 0,
                                    to: maxV,
                                    color: options.colorRule[4], // green,
                                    outerRadius: options.solidgauge.plotOuterRadius,
                                    innerRadius: options.solidgauge.plotInnerRadius
                                }]
                            }
                            if(options.solidgauge.dataOuterRadius!=options.solidgauge.plotOuterRadius){
                                yAxis.plotBands=[{
                                    from: 0,
                                    to: maxV*firstL,
                                    color: options.colorRule[0], // green,
                                    outerRadius: options.solidgauge.plotOuterRadius,
                                    innerRadius: options.solidgauge.plotInnerRadius
                                }, {
                                    from: maxV*firstL,
                                    to: maxV*secondL,
                                    color: options.colorRule[1], // yellow
                                    outerRadius: options.solidgauge.plotOuterRadius,
                                    innerRadius: options.solidgauge.plotInnerRadius
                                }, {
                                    from: maxV*secondL,
                                    to: maxV,
                                    color: options.colorRule[2], // red
                                    outerRadius: options.solidgauge.plotOuterRadius,
                                    innerRadius: options.solidgauge.plotInnerRadius
                                }];
                            }
                            defaultChart["plotOptions"]={
                                solidgauge: {
                                    cursor: options.cursor,
                                    linecap: 'round',
                                    stickyTracking: false,
                                    showInLegend: false,
                                    dataLabels: {
                                        // style: {
                                        //     color:color,
                                        //     fontSize:options.solidgauge.dlfontSize
                                        // },
                                        borderWidth: 0,
                                        y: options.solidgauge.labelY,
                                        useHTML: true,
                                    /*  format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}%</span><br/>' +
                                        '<span style="font-size:12px;color:silver">58M</span></div>' */
                                        format:formatGuageFun(data,options,color,titlePre,titleVal),
                                        style:{
                                            fontWeight: options.solidgauge.dlfontWeight
                                        }
                                    }
                                }
                            };
                        }
                        defaultChart["yAxis"]=$.extend(true,{},defaultChart["yAxis"],yAxis);
                        if(options.solidgauge.tickAmount<=2){
                            defaultChart["yAxis"]["minorTickInterval"]=null,
                            defaultChart["yAxis"]["tickPixelInterval"]=[]
                        }
                        if(options.solidgauge.tickAmount==0){
                            defaultChart["yAxis"]["showFirstLabel"]=false,
                            defaultChart["yAxis"]["showLastLabel"]=false,
                            defaultChart["yAxis"]["tickPositions"]=[]
                        }else{
                            defaultChart["yAxis"]["tickPositions"]=tickPositions(options.solidgauge.tickAmount,maxV)
                        }
                        defaultChart["series"]=parseData(data);
                    }
                    break;
                case "wordcloudchart":
                    defaultChart["chart"]["type"]=data[0].label.type.split("chart")[0];
                    defaultChart["tooltip"]["headerFormat"]=null;
                    defaultChart["series"]=parseData(data);
                    break;
            }
            return defaultChart;
        };
        if(data[0].label.type=="singleValuechart"){
            if(data[0].result==null||data[0].result=="null"||data[0].result.length==0||data[0].result[0].values==null||data[0].result[0].values=="null"||data[0].result[0].values.length==0){
                var html='<div class="singlestat-panel" style="position:relative;display:table;width:100%;height:100%;text-align: center;">';
                    html+='<span style="font-size: 12px;font-weight: bold;color: #666666;fill: #666666;display: inline-block;vertical-align: middle;">无响应数据</span>';
                    html+='<span style="display: inline-block;vertical-align: middle;height: 100%;width: 0px;"></span>';
                    html+='</div>';
                $(this).html(html);
            }else{
                var singleValue=singleValue(data[0].result[0].values[0],data[0].label.yAxisUnit.split("-")[1],false);
                var value=singleValue.match(/^[-+]?\d[e-\d\.]*/)[0];
                var postfix=singleValue.split(/^[-+]?\d[e-\d\.]*/)[1];
                var diaplayBoolean=options.title.enabled?"block":"none";
                var html='<div class="singlestat-panel" style="position:relative;display:table;width:100%;height:100%;">';
                    html+='<div class="title" style="position:absolute;text-align:'+options.title.align+';color:'+options.title.color+';font-size:'+options.title.fontSize+';display:'+diaplayBoolean+';padding:7px 10px 0px;width:100%">词云图</div>';
                    html+='<div style="line-height:1;display:table-cell;vertical-align:middle;text-align:center;position:relative;">';
                    html+='<span class="single-value" style="font-size:'+options.singleValue.fontSize+';font-weight:'+options.singleValue.fontWeight+';color:'+options.singleValue.color+'">'+value+'</span>';
                    html+='<span class="single-postfix" style="font-size:'+options.singleValue.unitFontSize+';font-weight:'+options.singleValue.fontWeight+';color:'+options.singleValue.color+'"> '+postfix+'</span>';
                    html+='</div>';
                    html+='</div>';
                }
                $(this).html(html);
        }else{
            chart=new Highcharts.Chart(defaultChart($(this)[0],data,options));
        }
    }
})( jQuery );