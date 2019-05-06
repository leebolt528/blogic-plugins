var object2={
    style:{
        lineColorNor:"#A9A9A9",
        lineColorSlow:"#CC0000",
        lineColorFast:"#228B22",
        highLColor:"#0099CC",
        textColor:"#696969",
        fillColor:"#ccc",
        faultColor:"#CC0000",
        strokeW:0,
    },
    zoom:false,
    blankClear:true,
    modalSwitch:false,
    mode:"line",
    freedom:false,
    callback:{}
};
$.extend({
    //把注释的代码放开即可实现缩放
    relativeD3: function(id, data,object1) {
        var root=replaceId(data);
        if(root.edges.length==1){
            root.edges.push(root.edges[0]);
        }
        if(!object1){
            object1={};
        }
        var object=$.extend({},object2,object1);
        if(object.mode=="node"){
            object.style.lineColorSlow=object2.style.lineColorNor;
            object.style.lineColorFast=object2.style.lineColorNor;
        }
        $("#canvas").empty();
        //定义一个画布

        $("#canvas").append(`<div class="drill drillDiv" style="min-height:150px;max-height:400px;width:700px;position:absolute;display:none;border-radius: 5px;background-color:#FFFFFF;box-shadow: 0px 0px 5px #888888;padding:0 8px 8px 8px;"></div>`);

        var downX = 0;
        var downY = 0;
        var width = $(id).width();
        var height = $(id).height();
        var img_w = 40;
        var img_h = 40;
        var circleR=50
        var nodeClick = null;
        var lineClick=null;
        if(object.zoom){
            var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 10])
            .on("zoom", zoomed);

            function zoomed() {
                container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }
        }
        var svg = d3.select(id).append("svg")
            .attr("width", width)
            .attr("height", height)
            .on(
                "click",
                function(image, i) {
                    $(".drill").css("display", "none");
                    if(object.blankClear){
                        nodeClick = null;
                        lineClick=null;
                        edges_path.style("", function(d) {
                            if (d.source.key !== d.target.key) {
                                if (d.status == "fast") {
                                    d3.select(this).attr("marker-end", "url(#resolved6)");
                                    d3.select(this).style("stroke", object.style.lineColorFast);
                                } else if (d.status == "slow") {
                                    d3.select(this).attr("marker-end", "url(#resolved2)");
                                    d3.select(this).style("stroke", object.style.lineColorSlow);
                                } else {
                                    d3.select(this).attr("marker-end", "url(#resolved)");
                                    d3.select(this).style("stroke", object.style.lineColorNor);
                                }
                            } else {
                                if (d.status == "fast") {
                                    d3.select(this).attr("marker-end", "url(#resolved7)");
                                    d3.select(this).style("stroke", object.style.lineColorFast);
                                } else if (d.status == "slow") {
                                    d3.select(this).attr("marker-end", "url(#resolved5)");
                                    d3.select(this).style("stroke", object.style.lineColorSlow);
                                } else {
                                    d3.select(this).attr("marker-end", "url(#resolved3)");
                                    d3.select(this).style("stroke", object.style.lineColorNor);
                                }
                            }
                        });
                        edges_text.style("", function(d, i) {
                            if (d.status == "fast") {
                                d3.select(this).style("fill", object.style.lineColorFast);
                            } else if (d.status == "slow") {
                                d3.select(this).style("fill", object.style.lineColorSlow);
                            } else {
                                d3.select(this).style("fill", object.style.lineColorNor);
                            }
                        });
                        nodes_rect.style("", function(d, i) {
                            d3.select(this).style("stroke", object.style.textColor);
                            if(object.mode=="line"){
                                d3.select(this).style("stroke", object.style.textColor);
                              }else{
                                  if(d.status==0){
                                      d3.select(this).style("stroke", object.style.textColor);
                                  }else{
                                      d3.select(this).style("stroke", object.style.faultColor);
                                  }
                              }
                        });
                        nodes_text.style("",function(d,i){  
                            d3.select(this).style("fill", object.style.textColor);
                        });
                    }
                }
            );
            object.zoom?(function(){svg.call(zoom)})():"";
        var container = svg.append("g");
        var drillX;
        var drillY;
        //箭头
        var defs = svg.append("defs");
        var marker = //直+灰
            defs.append("marker")
            .attr("id", "resolved")
            .attr("markerUnits", "userSpaceOnUse")
            .attr("viewBox", "0 -5 10 10") //坐标系的区域
            .attr("refX", 32) //箭头坐标
            .attr("refY", 0)
            .attr("markerWidth", 12) //标识的大小
            .attr("markerHeight", 12)
            .attr("orient", "auto") //绘制方向，可设定为：auto（自动确认方向）和 角度值
            .attr("stroke-width", 1.5) //箭头宽度
            .append("path")
            .attr("d", "M0,-5L10,0L0,5") //箭头的路径
            .attr('stroke', object.style.lineColorNor)
            .attr("fill", "none"); //箭头颜色       
        var marker1 = //直+蓝
            defs.append("marker")
            .attr("id", "resolved1")
            .attr("markerUnits", "userSpaceOnUse")
            .attr("viewBox", "0 -5 10 10") //坐标系的区域
            .attr("refX", 32) //箭头坐标
            .attr("refY", 0)
            .attr("markerWidth", 12) //标识的大小
            .attr("markerHeight", 12)
            .attr("orient", "auto") //绘制方向，可设定为：auto（自动确认方向）和 角度值
            .attr("stroke-width", 1.5) //箭头宽度
            .append("path")
            .attr("d", "M0,-5L10,0L0,5") //箭头的路径
            .attr('stroke', object.style.highLColor)
            .attr("fill", "none"); //箭头颜色
        var marker2 = //直+红
            defs.append("marker")
            .attr("id", "resolved2")
            .attr("markerUnits", "userSpaceOnUse")
            .attr("viewBox", "0 -5 10 10") //坐标系的区域
            .attr("refX", 32) //箭头坐标
            .attr("refY", 0)
            .attr("markerWidth", 12) //标识的大小
            .attr("markerHeight", 12)
            .attr("orient", "auto") //绘制方向，可设定为：auto（自动确认方向）和 角度值
            .attr("stroke-width", 1.5) //箭头宽度
            .append("path")
            .attr("d", "M0,-5L10,0L0,5") //箭头的路径
            .attr('stroke', object.style.lineColorSlow)
            .attr("fill", "none"); //箭头颜色
        var marker2node = //直+红
            defs.append("marker")
            .attr("id", "resolved2node")
            .attr("markerUnits", "userSpaceOnUse")
            .attr("viewBox", "0 -5 10 10") //坐标系的区域
            .attr("refX", 32) //箭头坐标
            .attr("refY", 0)
            .attr("markerWidth", 12) //标识的大小
            .attr("markerHeight", 12)
            .attr("orient", "auto") //绘制方向，可设定为：auto（自动确认方向）和 角度值
            .attr("stroke-width", 1.5) //箭头宽度
            .append("path")
            .attr("d", "M0,-5L10,0L0,5") //箭头的路径
            .attr('stroke', object.style.faultColor)
            .attr("fill", "none"); //箭头颜色
        var marker3 = //环+灰
            defs.append("marker")
            .attr("id", "resolved3")
            .attr("markerUnits", "userSpaceOnUse")
            .attr("viewBox", "0 -5 10 10") //坐标系的区域
            .attr("refX", 20) //箭头坐标
            .attr("refY", -43)
            .attr("markerWidth", 12) //标识的大小
            .attr("markerHeight", 12)
            .attr("orient", "auto") //绘制方向，可设定为：auto（自动确认方向）和 角度值
            .attr("stroke-width", 1.5) //箭头宽度
            .append("path")
            .attr("d", "M0,-5L10,0L0,5") //箭头的路径
            .attr('stroke', object.style.lineColorNor)
            .attr("fill", "none") //箭头颜色
            .attr("transform", "rotate(30)");
        var marker4 = //环+蓝
            defs.append("marker")
            .attr("id", "resolved4")
            .attr("markerUnits", "userSpaceOnUse")
            .attr("viewBox", "0 -5 10 10") //坐标系的区域
            .attr("refX", 20) //箭头坐标
            .attr("refY", -43)
            .attr("markerWidth", 12) //标识的大小
            .attr("markerHeight", 12)
            .attr("orient", "auto") //绘制方向，可设定为：auto（自动确认方向）和 角度值
            .attr("stroke-width", 1.5) //箭头宽度
            .append("path")
            .attr("d", "M0,-5L10,0L0,5") //箭头的路径
            .attr('stroke', object.style.highLColor)
            .attr("fill", "none") //箭头颜色
            .attr("transform", "rotate(30)");
        var marker5 = //环+红
            defs.append("marker")
            .attr("id", "resolved5")
            .attr("markerUnits", "userSpaceOnUse")
            .attr("viewBox", "0 -5 10 10") //坐标系的区域
            .attr("refX", 20) //箭头坐标
            .attr("refY", -43)
            .attr("markerWidth", 12) //标识的大小
            .attr("markerHeight", 12)
            .attr("orient", "auto") //绘制方向，可设定为：auto（自动确认方向）和 角度值
            .attr("stroke-width", 1.5) //箭头宽度
            .append("path")
            .attr("d", "M0,-5L10,0L0,5") //箭头的路径
            .attr('stroke', object.style.lineColorSlow)
            .attr("fill", "none") //箭头颜色
            .attr("transform", "rotate(30)");
        var marker5node = //环+红
            defs.append("marker")
            .attr("id", "resolved5node")
            .attr("markerUnits", "userSpaceOnUse")
            .attr("viewBox", "0 -5 10 10") //坐标系的区域
            .attr("refX", 20) //箭头坐标
            .attr("refY", -43)
            .attr("markerWidth", 12) //标识的大小
            .attr("markerHeight", 12)
            .attr("orient", "auto") //绘制方向，可设定为：auto（自动确认方向）和 角度值
            .attr("stroke-width", 1.5) //箭头宽度
            .append("path")
            .attr("d", "M0,-5L10,0L0,5") //箭头的路径
            .attr('stroke', object.style.lineColorSlow)
            .attr("fill", "none") //箭头颜色
            .attr("transform", "rotate(30)");
        var marker6 = //直+绿
            defs.append("marker")
            .attr("id", "resolved6")
            .attr("markerUnits", "userSpaceOnUse")
            .attr("viewBox", "0 -5 10 10") //坐标系的区域
            .attr("refX", 32) //箭头坐标
            .attr("refY", 0)
            .attr("markerWidth", 12) //标识的大小
            .attr("markerHeight", 12)
            .attr("orient", "auto") //绘制方向，可设定为：auto（自动确认方向）和 角度值
            .attr("stroke-width", 1.5) //箭头宽度
            .append("path")
            .attr("d", "M0,-5L10,0L0,5") //箭头的路径
            .attr('stroke', object.style.lineColorFast)
            .attr("fill", "none"); //箭头颜色
        var marker7 = //环+绿
            defs.append("marker")
            .attr("id", "resolved7")
            .attr("markerUnits", "userSpaceOnUse")
            .attr("viewBox", "0 -5 10 10") //坐标系的区域
            .attr("refX", 20) //箭头坐标
            .attr("refY", -43)
            .attr("markerWidth", 12) //标识的大小
            .attr("markerHeight", 12)
            .attr("orient", "auto") //绘制方向，可设定为：auto（自动确认方向）和 角度值
            .attr("stroke-width", 1.5) //箭头宽度
            .append("path")
            .attr("d", "M0,-5L10,0L0,5") //箭头的路径
            .attr('stroke', object.style.lineColorFast)
            .attr("fill", "none") //箭头颜色
            .attr("transform", "rotate(30)");
        //使用力导向图布局获取数据
        var force = d3.layout.force()
            .nodes(root.nodes)
            .links(root.edges)
            .size([width, height])
            .linkDistance(170)
            .charge(-7000)
            .on("tick", forceTick)
            .start();
        var edgeInfo = function(edge) {
            if(object.callback.hasOwnProperty("onClickEdge")){
                var html=object.callback.onClickEdge(edge);
            }
            return `<div>
                    <div class="moveDrill" ></div>
                    `
                    +html+
                    `
                </div>
                `;
            }
            //设置连接线
        var edges_path1 = [];
        var edges_path = container.append("g").selectAll(".edgepath")
            .data(force.links())
            .enter()
            .append("path")
            .attr({
                "class": "edgepath",
                "id": function(d, i) { return "edgepath" + i; },
                "stroke": function(d, i) {
                    if (d.status == "fast") {
                        return object.style.lineColorFast;
                    } else if (d.status == "slow") {
                        return object.style.lineColorSlow;
                    } else {
                        return object.style.lineColorNor;
                    }
                },
                "stroke-width": 1.5,
                "fill": "none",
                "marker-end": function(d) {
                    if (d.source.key !== d.target.key) {
                        if (d.status == "fast") {
                            return "url(#resolved6)";
                        } else if (d.status == "slow") {
                            return "url(#resolved2)";
                        } else {
                            return "url(#resolved)";
                        }
                    } else {
                        if (d.status == "fast") {
                            return "url(#resolved7)";
                        } else if (d.status == "slow") {
                            return "url(#resolved5)";
                        } else {
                            return "url(#resolved3)";
                        }
                    }
                },
                "": function(d, i) {
                    edges_path1.push(d);
                },
                "cursor": "pointer"
            })
            .on({
                "mouseover": function(line, i) {
                    edgeMouseover(line);
                },
                "mouseout": function(line, i) {
                    edgeMouseout(line);
                },
                "click": function(line, d) {
                    $(".drill").css("display", "none");
                    edgeClick(line);
                    event.stopPropagation();
                    var innerY = event.clientY - ($("#canvas").offset().top - $(document).scrollTop());
                    drillY = innerY >= $(".drill").innerHeight() ? innerY - $(".drill").innerHeight() + $("#canvas").offset().top : innerY + $("#canvas").offset().top;
                    var innerX = event.clientX - ($("#canvas").offset().left - $(document).scrollLeft());
                    drillX = innerX >= $(".drill").innerWidth() ? innerX - $(".drill").innerWidth() + $("#canvas").offset().left : $("#canvas").width() - innerX < $(".drill").innerWidth() ? $("#canvas").width() - $(".drill").innerWidth() : innerX + $("#canvas").offset().left;

                    $(".drill").empty().html(edgeInfo(line));
                    $(".drill").css({ "top": drillY, "left": drillX, "display": object.modalSwitch?'block':'none' });
                }
            });
        //设置相互依赖曲线
        curve();
        //设置连接线上的文字
        var edges_text = container.append("g").selectAll(".edgetext")
            .data(force.links())
            .enter()
            .append("text")
            .attr({
                "xml:space": "preserve",
                "class": "edgetext",
                "id": function(d, i) { return "edgepath" + i; },
                "fill": function(d, i) {
                    if (d.status == "fast") {
                        return object.style.lineColorFast;
                    } else if (d.status == "slow") {
                        return object.style.lineColorSlow;
                    } else {
                        return object.style.lineColorNor;
                    }
                },
                "font-weight": 700
            });
        edges_text.append("textPath")
            .attr({
                "xlink:href": function(d, i) { return "#edgepath" + i },
                "method": "stretch",
                "cursor": "pointer"
            })
            .text(function(d, i) { return d.relation + "" })
            .on({
                "mouseover": function(line, i) {
                    edgeMouseover(line);
                },
                "mouseout": function(line, i) {
                    edgeMouseout(line);
                },
                "click": function(text, d) {
                    $(".drill").css("display", "none");
                    edgeClick(text);
                    event.stopPropagation();
                    var innerY = event.clientY - ($("#canvas").offset().top - $(document).scrollTop());
                    drillY = innerY >= $(".drill").innerHeight() ? innerY - $(".drill").innerHeight() + $("#canvas").offset().top : innerY + $("#canvas").offset().top;
                    var innerX = event.clientX - ($("#canvas").offset().left - $(document).scrollLeft());
                    drillX = innerX >= $(".drill").innerWidth() ? innerX - $(".drill").innerWidth() + $("#canvas").offset().left : $("#canvas").width() - innerX < $(".drill").innerWidth() ? $("#canvas").width() - $(".drill").innerWidth() : innerX + $("#canvas").offset().left;

                    $(".drill").empty().html(edgeInfo(text));
                    $(".drill").css({ "top": drillY, "left": drillX, "display": object.modalSwitch?'block':'none' });
                }
            });
        //设置图片外边框
        var nodes_rect = container.append("g").selectAll(".nodesrect")
            .data(force.nodes())
            .enter()
            .append("circle")
            .attr({
                "class": "nodesrect",
                "r": 25,
                "fill":object.style.fillColor,
                "stroke-width": object.style.strokeW,
                "stroke": function(d, i) {
                    if (object.mode=="node" && d.status == 1) {
                        return object.style.faultColor;
                    } else {
                        return object.style.textColor;
                    }
                }
            });
        //拖拽定点固定
        var drag = force.drag()
            .on("dragstart", function(d, i) {
                d.fixed = true;
            });

        //节点钻取拖动
        $(document).on('mousedown', '.moveDrill', function(e) {
            $(".drill").addClass("drillDiv");
            var pageY = e.pageY;
            var pageX = e.pageX;
            var gapX = pageX - $(".drill").offset().left;
            var gapY = pageY - $(".drill").offset().top;
            $(document).bind("mousemove", function(e) {
                if ($(".drill").hasClass("drillDiv")) {
                    var movingX = e.pageX <= 10 + gapX ? 10 : e.pageX >= $(window).width() - $(".drill").width() - 20 + gapX ? $(window).width() - $(".drill").width() - 20 : drillX + e.pageX - pageX;
                    var movingY = e.pageY <= $(document).scrollTop() + 20 + gapY ? $(document).scrollTop() + 20 : e.pageY >= $(window).height() + $(document).scrollTop() - $(".drill").height() - 20 + gapY ? $(window).height() + $(document).scrollTop() - $(".drill").height() - 20 : drillY + e.pageY - pageY;
                    $(".drill").css("top", movingY);
                    $(".drill").css("left", movingX);
                }
            });
        })
        $(document).bind("mousedown", function(event) {
            event.preventDefault();
        });
        $(document).on("mouseup", function(e) {
            drillY = $('.drill').offset().top;
            drillX = $('.drill').offset().left;
            $(".drill").removeClass("drillDiv");
        });
        var nodeInfo = function(node) {
            if(object.callback.hasOwnProperty("onClickNode")){
                var html=object.callback.onClickNode(node);
            }
            return `<div>
                    <div class="moveDrill"></div>
                    `
                    +html+
                    `
                </div>
                `;
            }
        //设置图片节点
        var nodes_img = container.append("g").selectAll("image")
            .data(force.nodes())
            .enter()
            .append("image")
            .attr({
                "width": img_w,
                "height": img_h,
                "xlink:href": function(d, i) { return d.image; },
                "cursor": "pointer"
            })
            .on({
                "dblclick": function(d, i) { return d.fixed = false; },
                "mouseover": function(image, i) {
                    imageMouseover(image);
                },
                "mouseout": function(image, i) {
                    imageMouseout(image);
                },
                "click": function(image, i) {
                    if(d3.event.defaultPrevented) {
                		return;
                	}
                    event.stopPropagation();
                    nodeClick = image.key;
                    lineClick=null;
                    imageClick(image);
                    drillY = image.py - circleR / 2 >= $(".drill").innerHeight() ? image.py - circleR / 2 - $(".drill").innerHeight() - 4 + $("#canvas").offset().top : image.py + circleR / 2 + 4 + $("#canvas").offset().top;
                    drillX = image.px < $(".drill").innerWidth() / 2 ? 4 + $("#canvas").offset().left : $("#canvas").width() - image.px < 350 ? $("#canvas").width() - $(".drill").innerWidth() - 4 + $("#canvas").offset().left : image.px - $(".drill").innerWidth() / 2 + $("#canvas").offset().left;
                    $(".drill").empty().html(nodeInfo(image));
                    $(".drill").css({ "top": drillY, "left": drillX });
                },
                "mousedown": function(e) {
                    $(".drill").css("display", "none");
                    downY = event.clientY;
                    downX = event.clientX;
                },
                "mouseup": function(e) {
                    $(".drill").css("display", `${downY==event.clientY&&downX==event.clientX&&object.modalSwitch?'block':'none'}`);
                }
            })
            .call(drag);

        //设置节点文字
        var nodes_text = container.append("g").selectAll(".nodetext")
            .data(force.nodes())
            .enter()
            .append("text")
            .attr({
                "class": "nodetext",
                "font-size": "14px",
                "fill": object.style.textColor
            })
            .attr(
                " ",
                function(d) {
                    var re_en = /[a-zA-Z]+/g;
                    //如果是全英文，不换行
                    var overtop=(8-d.name.length)*50/8;
                    if(/[A-Z]+/.test(d.name)){
                        overtop=(5-d.name.length)*50/5;
                    }
                    if(d.name.match(re_en)){
                        d3.select(this).append('tspan')
                            .attr('dx',-circleR/2+overtop/2)
                            .attr('dy',(circleR-img_h)/2+12)
                            .text(function(){return d.name;});
                    }
                    //如果小于四个字符，不换行
                    else if (d.name.length <= 4) {
                        d3.select(this).append('tspan')
                            .attr('dx', -circleR / 2)
                            .attr('dy', img_h / 2)
                            .text(function() { return d.name; });
                    } else {
                        var top = d.name.substring(0, 4);
                        var bot = d.name.substring(4, d.name.length);

                        d3.select(this).append('tspan')
                            .attr('dx', -circleR / 2)
                            .attr('dy', img_h / 2)
                            .text(function() { return top; });

                        d3.select(this).append('tspan')
                            .attr('dx', -circleR - 8)
                            .attr('dy', 15)
                            .text(function() { return bot; });
                    }
                }
            );
        //设置相互依赖曲线
        function curve() {
            var curve = [];
            for (var i = 0; i < edges_path1.length; i++) {
                if (curve.indexOf(i) !== -1) {
                    continue;
                }
                for (var j = i; j < edges_path1.length; j++) {
                    if (j == i) {
                        continue;
                    }
                    if (curve.indexOf(j) !== -1) {
                        continue;
                    }
                    if ((edges_path1[i].source.index == edges_path1[j].target.index) && (edges_path1[i].target.index == edges_path1[j].source.index)) {
                        edges_path1[i].curve = 100;
                        edges_path1[j].curve = -100;
                        curve.push(j);
                        break;
                    } else {
                        edges_path1[i].curve = 0;
                        edges_path1[j].curve = 0;
                    }
                }
            }
        }
        //计算力学图布局位置
        function forceTick() {
            //限制结点的边界
            if (object.freedom) {
            root.nodes.forEach(function(d, i) {
                d.x = d.x - circleR / 2 - 2 < 0 ? circleR / 2 + 2 : d.x;
                d.x = d.x + circleR / 2 + 50 > width ? width - circleR / 2 - 50 : d.x;
                d.y = d.y - circleR / 2 - 7 < 0 ? circleR / 2 + 7 : d.y;
                d.y = d.y + circleR / 2 + img_h > height ? height - circleR / 2 - img_h : d.y;
            });
            }
            //跟新连接线的位置
            edges_path.attr({
                "d": function(d, i) {
                    var d = edges_path1[i];
                    if (d.source.key !== d.target.key) {
                        return "M" + d.source.x + " " + d.source.y + "Q" + (d.target.x + d.source.x + d.curve) / 2 + " " + (d.target.y + d.source.y + d.curve) / 2 + " " + d.target.x + " " + d.target.y;
                    } else {
                        return "M" + d.source.x + "," + d.source.y + "C" + d.source.x + "," + (d.source.y - 40) + " " + (d.source.x + 60) + "," + (d.source.y - 40) + " " + (d.source.x + 60) + "," + d.source.y + "S" + d.source.x + "," + (d.source.y + 40) + " " + d.source.x + "," + d.source.y;
                    }
                },
                "stroke-dasharray": function(d) {
                    if (d.source.key !== d.target.key) {
                        var numLength=d.relation.toString().length;
                        return Math.sqrt(Math.pow(Math.abs(d.source.x - d.target.x), 2) + Math.pow(Math.abs(d.source.y - d.target.y), 2)) / 2 + " " + numLength*8 + " " + 1000;
                    } else {
                        return "90 20";
                    }
                }
            });
            //跟新节点图片和文字的位置
            nodes_img.attr({
                "x": function(d) {
                    return d.x - img_w / 2;
                },
                "y": function(d) {
                    return d.y - img_h / 2;
                }
            });
            nodes_text.attr({
                "x": function(d) {
                    return d.x;
                },
                "y": function(d) {
                    return d.y + img_h / 2;
                }
            });
            nodes_rect.attr({
                "cx": function(d) {
                    return d.x;
                },
                "cy": function(d) {
                    return d.y;
                }
            });
            edges_text.attr({
                "dx": function(d, i) {
                    if (d.source.key !== d.target.key) {
                        return Math.sqrt(Math.pow(Math.abs(d.source.x - d.target.x), 2) + Math.pow(Math.abs(d.source.y - d.target.y), 2)) / 2;
                    } else {
                        return 90;
                    }
                },
                "dy": 5,
                "transform": function(d, i) {
                    if (d.source.key !== d.target.key) {
                        if (d.target.x < d.source.x) {
                            bbox = this.getBBox();
                            rx = bbox.x + bbox.width / 2;
                            ry = bbox.y + bbox.height / 2;
                            return 'rotate(180 ' + rx + ' ' + ry + ')';
                        } else {
                            return 'rotate(0)';
                        }
                    } else {
                        bbox = this.getBBox();
                        rx = bbox.x + bbox.width - 14;
                        ry = bbox.y + bbox.height / 2 - 2;
                        return 'rotate(-90 ' + rx + ' ' + ry + ')';
                    }
                }
            });
        }
        //节点图片鼠标点击事件
        function imageClick(image) {
            pathStyle(image);
            textPStyle();
            nodeStyle(image);
            textNStyle(image);
        }
        //节点图片鼠标划入事件
        function imageMouseover(image) {
            pathStyle(image);
            edges_text.style("", function(d, i) {
                if (d.source.key != nodeClick && d.target.key != nodeClick) {
                    if (image.key == d.source.key || image.key == d.target.key) {
                        if(object.mode=="line"){
                            d3.select(this).style("fill", object.style.highLColor);
                        }else{
                            if ((image.key == d.source.key || image.key == d.target.key)&&d.target.status==1) {
                                d3.select(this).style("fill", object.style.faultColor);
                            }else{
                                d3.select(this).style("fill", object.style.highLColor);
                            }
                        }
                    }
                }
            });
            nodeStyle(image);
            textNStyle(image);
        }
        //节点图片鼠标划出事件
        function imageMouseout(image) {
            edges_path.style("", function(d) {
                if (d.source.key != nodeClick && d.target.key != nodeClick&&d!=lineClick) {
                    if (d.source.key !== d.target.key) {
                        if (d.status == "fast") {
                            d3.select(this).attr("marker-end", "url(#resolved6)");
                            d3.select(this).style("stroke", object.style.lineColorFast);
                        } else if (d.status == "slow") {
                            d3.select(this).attr("marker-end", "url(#resolved2)");
                            d3.select(this).style("stroke", object.style.lineColorSlow);
                        } else {
                            d3.select(this).attr("marker-end", "url(#resolved)");
                            d3.select(this).style("stroke", object.style.lineColorNor);
                        }
                    } else {
                        if (d.status == "fast") {
                            d3.select(this).attr("marker-end", "url(#resolved7)");
                            d3.select(this).style("stroke", object.style.lineColorFast);
                        } else if (d.status == "slow") {
                            d3.select(this).attr("marker-end", "url(#resolved5)");
                            d3.select(this).style("stroke", object.style.lineColorSlow);
                        } else {
                            d3.select(this).attr("marker-end", "url(#resolved3)");
                            d3.select(this).style("stroke", object.style.lineColorNor);
                        }
                    }
                }
            });
            textPStyle();
            nodes_rect.style("", function(d, i) {
                if(object.mode=="line"){
                    if (d.key == image.key&&d.key != nodeClick){
                        d3.select(this).style("stroke", object.style.textColor);
                    }
                }else{
                    if(d.key == image.key&&d.status==0&&d.key == nodeClick){
                        d3.select(this).style("stroke", object.style.highLColor);
                    }else if(d.key == image.key&&d.status==0){
                        d3.select(this).style("stroke", object.style.textColor);
                    }else if(d.key == image.key&&d.status==1){
                        d3.select(this).style("stroke", object.style.faultColor);
                    }
                } 
            });
            nodes_text.style("",function(d,i){ 
                if(object.mode=="line"){
                    if (d.key == image.key&&d.key != nodeClick){
                        d3.select(this).style("fill", object.style.textColor);
                    }
                }else{
                    if(d.key == image.key&&d.status==0&&d.key == nodeClick){
                        d3.select(this).style("fill", object.style.highLColor);
                    }else if(d.key == image.key&&d.status==1&&d.key == nodeClick){
                        d3.select(this).style("fill", object.style.faultColor);
                    }else if(d.key == image.key){
                        d3.select(this).style("fill", object.style.textColor);
                    }
                } 
            });
        };
        var pathStyle = function(image) {
            edges_path.style("", function(d, i) {
                if (d.source.key != nodeClick && d.target.key != nodeClick&&d!=lineClick) {
                    if(object.mode=="line"){
                        if (d.source.key !== d.target.key) {
                            if (d.status == "fast") {
                                d3.select(this).attr("marker-end", "url(#resolved6)");
                                d3.select(this).style("stroke", object.style.lineColorFast);
                            } else if (d.status == "slow") {
                                d3.select(this).attr("marker-end", "url(#resolved2)");
                                d3.select(this).style("stroke", object.style.lineColorSlow);
                            } else {
                                d3.select(this).attr("marker-end", "url(#resolved)");
                                d3.select(this).style("stroke", object.style.lineColorNor);
                            }
                        } else {
                            if (d.status == "fast") {
                                d3.select(this).attr("marker-end", "url(#resolved7)");
                                d3.select(this).style("stroke", object.style.lineColorFast);
                            } else if (d.status == "slow") {
                                d3.select(this).attr("marker-end", "url(#resolved5)");
                                d3.select(this).style("stroke", object.style.lineColorSlow);
                            } else {
                                d3.select(this).attr("marker-end", "url(#resolved3)");
                                d3.select(this).style("stroke", object.style.lineColorNor);
                            }
                        }
                        if (image.key == d.source.key || image.key == d.target.key) {
                            if (d.source.key !== d.target.key) {
                                d3.select(this).attr("marker-end", "url(#resolved1)");
                            } else {
                                d3.select(this).attr("marker-end", "url(#resolved4)");
                            }
                            d3.select(this).style("stroke", object.style.highLColor);
                        }
                    }else{
                        if (d.source.key !== d.target.key) {
                            d3.select(this).attr("marker-end", "url(#resolved)");
                            d3.select(this).style("stroke", object.style.lineColorNor);
                        } else {
                            d3.select(this).attr("marker-end", "url(#resolved3)");
                            d3.select(this).style("stroke", object.style.lineColorNor);
                        }
                        if ((image.key == d.source.key || image.key == d.target.key)&&d.target.status==1) {
                            if (d.source.key !== d.target.key) {
                                d3.select(this).attr("marker-end", "url(#resolved2node)");
                            } else {
                                d3.select(this).attr("marker-end", "url(#resolved5node)");
                            }
                            d3.select(this).style("stroke", object.style.faultColor);
                        }else if (image.key == d.source.key || image.key == d.target.key) {
                            if (d.source.key !== d.target.key) {
                                d3.select(this).attr("marker-end", "url(#resolved1)");
                            } else {
                                d3.select(this).attr("marker-end", "url(#resolved4)");
                            }
                            d3.select(this).style("stroke", object.style.highLColor);
                        }
                    }
                }
            });
        }
        var textPStyle = function() {
            edges_text.style("", function(d, i) {
                if (d.source.key != nodeClick && d.target.key != nodeClick&&d!=lineClick) {
                    if(object.mode=="line"){
                        if (d.status == "fast") {
                            d3.select(this).style("fill", object.style.lineColorFast);
                        } else if (d.status == "slow") {
                            d3.select(this).style("fill", object.style.lineColorSlow);
                        } else {
                            d3.select(this).style("fill", object.style.lineColorNor);
                        }
                    }else{
                        d3.select(this).style("fill", object.style.lineColorNor);
                    }
                }
            });
        }
        var nodeStyle=function(image){
            nodes_rect.style("", function(d, i) {
                if(object.mode=="line"){
                    if (d.key != nodeClick) {
                        d3.select(this).style("stroke", object.style.textColor);
                    }
                    if(d.key == image.key){
                        d3.select(this).style("stroke", object.style.highLColor);
                    }
                }else{
                    if (d.key != nodeClick&&d.status==0) {
                        d3.select(this).style("stroke", object.style.textColor);
                    }else if(d.key != nodeClick&&d.status==1){
                        d3.select(this).style("stroke", object.style.faultColor);
                    }
                    if(d.key == image.key&&d.status==0){
                        d3.select(this).style("stroke", object.style.highLColor);
                    }else if(d.key == image.key&&d.status==1){
                        d3.select(this).style("stroke", object.style.faultColor);
                    }
                }
            });
        }
        var textNStyle=function(image){
            nodes_text.style("",function(d,i){
                if(object.mode=="line"){
                    if (d.key != nodeClick) {
                        d3.select(this).style("fill", object.style.textColor);
                    }
                    if(d.key == image.key){
                        d3.select(this).style("fill", object.style.highLColor);
                    }
                  }else{
                    if (d.key != nodeClick) {
                        d3.select(this).style("fill", object.style.textColor);
                    }
                    if(d.key == image.key&&d.status==0){
                        d3.select(this).style("fill", object.style.highLColor);
                    }else if(d.key == image.key&&d.status==1){
                        d3.select(this).style("fill", object.style.faultColor);
                    }
                  }
            });
        }
        //关系线点击事件
        function edgeClick(line){
            nodeClick = null;
            lineClick=line;
            edges_path.style("", function(d, i) {
                if(object.mode=="line"){
                    if (d.source.key !== d.target.key) {
                        if (d.status == "fast") {
                            d3.select(this).attr("marker-end", "url(#resolved6)");
                            d3.select(this).style("stroke", object.style.lineColorFast);
                        } else if (d.status == "slow") {
                            d3.select(this).attr("marker-end", "url(#resolved2)");
                            d3.select(this).style("stroke", object.style.lineColorSlow);
                        } else {
                            d3.select(this).attr("marker-end", "url(#resolved)");
                            d3.select(this).style("stroke", object.style.lineColorNor);
                        }
                    } else {
                        if (d.status == "fast") {
                            d3.select(this).attr("marker-end", "url(#resolved7)");
                            d3.select(this).style("stroke", object.style.lineColorFast);
                        } else if (d.status == "slow") {
                            d3.select(this).attr("marker-end", "url(#resolved5)");
                            d3.select(this).style("stroke", object.style.lineColorSlow);
                        } else {
                            d3.select(this).attr("marker-end", "url(#resolved3)");
                            d3.select(this).style("stroke", object.style.lineColorNor);
                        }
                    }
                    if(d==line){
                        if (d.source.key !== d.target.key) {
                            d3.select(this).attr("marker-end", "url(#resolved1)");
                        } else {
                            d3.select(this).attr("marker-end", "url(#resolved4)");
                        }
                        d3.select(this).style("stroke", object.style.highLColor);
                    }
                }else{
                    if (d.source.key !== d.target.key) {
                        d3.select(this).attr("marker-end", "url(#resolved)");
                        d3.select(this).style("stroke", object.style.lineColorNor);
                    } else {
                        d3.select(this).attr("marker-end", "url(#resolved3)");
                        d3.select(this).style("stroke", object.style.lineColorNor);
                    }
                    if (d==line&&d.target.status==1) {
                        if (d.source.key !== d.target.key) {
                            d3.select(this).attr("marker-end", "url(#resolved2node)");
                        } else {
                            d3.select(this).attr("marker-end", "url(#resolved5node)");
                        }
                        d3.select(this).style("stroke", object.style.faultColor);
                    }else if (d==line) {
                        if (d.source.key !== d.target.key) {
                            d3.select(this).attr("marker-end", "url(#resolved1)");
                        } else {
                            d3.select(this).attr("marker-end", "url(#resolved4)");
                        }
                        d3.select(this).style("stroke", object.style.highLColor);
                    }
                }
            });
            edges_text.style("", function(d, i) {
                if(object.mode=="line"){
                    if (d.status == "fast") {
                        d3.select(this).style("fill", object.style.lineColorFast);
                    } else if (d.status == "slow") {
                        d3.select(this).style("fill", object.style.lineColorSlow);
                    } else {
                        d3.select(this).style("fill", object.style.lineColorNor);
                    }
                    if(d==line){
                        d3.select(this).style("fill", object.style.highLColor);
                    }
                }else{
                    if(d==line&&d.target.status==0){
                        d3.select(this).style("fill", object.style.highLColor);
                    }else if(d==line&&d.target.status==1){
                        d3.select(this).style("fill", object.style.faultColor);
                    }else{
                        d3.select(this).style("fill", object.style.lineColorNor);
                    }
                }
            });
            nodes_rect.style("", function(d, i) {
                if(object.mode=="line"){
                    d3.select(this).style("stroke", object.style.textColor);
                }else{
                    if(d.status==0){
                        d3.select(this).style("stroke", object.style.textColor);
                    }else{
                        d3.select(this).style("stroke", object.style.faultColor);
                    }
                }
            });
            nodes_text.style("",function(d,i){  
                d3.select(this).style("fill", object.style.textColor);
            });
        };
        /* edges鼠标滑入事件 */
        function edgeMouseover(line){
            edges_path.style("", function(d, i) {
                if(object.mode=="line"){
                    if(d==line){
                        if (d.source.key !== d.target.key) {
                            d3.select(this).attr("marker-end", "url(#resolved1)");
                        } else {
                            d3.select(this).attr("marker-end", "url(#resolved4)");
                        }
                        d3.select(this).style("stroke", object.style.highLColor);
                    }
                }else{
                    if (d==line&&d.target.status==1) {
                        if (d.source.key !== d.target.key) {
                            d3.select(this).attr("marker-end", "url(#resolved2node)");
                        } else {
                            d3.select(this).attr("marker-end", "url(#resolved5node)");
                        }
                        d3.select(this).style("stroke", object.style.faultColor);
                    }else if (d==line) {
                        if (d.source.key !== d.target.key) {
                            d3.select(this).attr("marker-end", "url(#resolved1)");
                        } else {
                            d3.select(this).attr("marker-end", "url(#resolved4)");
                        }
                        d3.select(this).style("stroke", object.style.highLColor);
                    }
                }
            });
            edges_text.style("", function(d, i) {
                if(object.mode=="line"){
                    if (d==line){
                        d3.select(this).style("fill", object.style.highLColor);
                    }
                }else{
                    if (d==line&&d.target.status==1) {
                        d3.select(this).style("fill", object.style.faultColor);
                    }else if (d==line) {
                        d3.select(this).style("fill", object.style.highLColor);
                    }
                }
            });
        }
        /* edges鼠标滑出事件 */
        function edgeMouseout(line){
            edges_path.style("", function(d) {
                if (d.source.key != nodeClick && d.target.key != nodeClick&&d!=lineClick) {
                    if (d.source.key !== d.target.key) {
                        if (d.status == "fast") {
                            d3.select(this).attr("marker-end", "url(#resolved6)");
                            d3.select(this).style("stroke", object.style.lineColorFast);
                        } else if (d.status == "slow") {
                            d3.select(this).attr("marker-end", "url(#resolved2)");
                            d3.select(this).style("stroke", object.style.lineColorSlow);
                        } else {
                            d3.select(this).attr("marker-end", "url(#resolved)");
                            d3.select(this).style("stroke", object.style.lineColorNor);
                        }
                    } else {
                        if (d.status == "fast") {
                            d3.select(this).attr("marker-end", "url(#resolved7)");
                            d3.select(this).style("stroke", object.style.lineColorFast);
                        } else if (d.status == "slow") {
                            d3.select(this).attr("marker-end", "url(#resolved5)");
                            d3.select(this).style("stroke", object.style.lineColorSlow);
                        } else {
                            d3.select(this).attr("marker-end", "url(#resolved3)");
                            d3.select(this).style("stroke", object.style.lineColorNor);
                        }
                    }
                }
            });
            textPStyle();
        }
        //数据转化
        function replaceId(data){
            var i=0;
            var map=new Map();
            if(data){
            	data.nodes.map(function(value){
                    map.set(value.key,i++);
                });
                data.edges.map(function(value){
                    value.source=map.get(value.source);
                    value.target=map.get(value.target);

                });
            }
            return data;
        }
    }
});