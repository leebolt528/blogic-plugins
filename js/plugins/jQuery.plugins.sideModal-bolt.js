$.extend({
    sideModalFun:function(options1){
        if(!options1){
            options1={};
        }
        let options0={
            headText:"",
            btnSwitch:true,
            classList:"",
            imgPath:"",
            callback:{
                clickConfirm:function($this){},
                clickCancel:function($this){},
                clickMask:function($this){}
            }
        };
        if(!options1.hasOwnProperty("callback")){
            options1.callback= options0.callback;
        }
        let callback=$.extend({},options0.callback,options1.callback);
        let options=$.extend({},options0,options1);
        options.callback=callback;
        //向页面添加阴影背景
        let body=document.getElementsByTagName("body")[0];
        if($(".designer-mask").length==0){
            $(body).append(`<div class="designer-mask" style="position:fixed;top:0;bottom:0;left:0;right:0;display:none;background:rgba(0,0,0,0.35);z-index:999"><div>`);
            //向父页面添加右侧模态框
            let rightModel=`<div class="designer_detail">`+
                `<div class="detail_head"><span class="headTitle"></span><a class="headClose"><img src=`+options.imgPath+`/img/plugins/sideModal/close.png></a></div>`+
                `<div class="detail_context"><img style="width:50px;margin:100px auto;display: block;" src=`+options.imgPath+`/img/plugins/sideModal/loading.gif></div>`+
                `</div>`;
            $(body).append(rightModel);
        }
        $(".designer_detail .headClose").mouseenter(function(){
            $(this).children("img").attr("src",options.imgPath+'/img/plugins/sideModal/closeH.png');
        }).mouseleave(function(){
            $(this).children("img").attr("src",options.imgPath+'/img/plugins/sideModal/close.png')
        });
        $(".designer_detail .headTitle").text(options.headText);
        //获取阴影背景元素
        let $mask=$(document.getElementsByClassName("designer-mask")[0]);
        //获取右侧模态框
        let $rightModel=$(document.getElementsByClassName("designer_detail")[0]);
        $rightModel.addClass(options.classList).css({
            "position":"fixed",
            "width":"480px",
            "top":"0px",
            "right":"0px",
            "bottom":"0px",
            "background-color":"#ffffff",
            "box-shadow":" 0px 2px 8px 0px rgba(130, 130, 130, 0.16)",
            "display":"block",
            "transform":"translate(100%, 0px)",
            "transition":"all 0.4s ease-out 0s",
            "z-index":"999",
        }).find(".detail_head").css({
            "padding":"33px 32px 29px 32px"
        }).find(".headTitle").css({
            "font-family":" MicrosoftYaHei-Bold",
            "font-size":"16px",
            "font-weight": "bold",
            "font-stretch":"normal",
            "line-height": "18px",
            "letter-spacing": "0px",
            "color": "#333333"
        }).end().end().find(".headClose").css({
            "float": "right",
            "cursor": "pointer"
        }).end().find(".detail_context").css({
            "padding":"0px 32px",
            "overflow":"auto"
        });
        //按钮Html
        let operateDiv=`<div class="detail-footer" style="padding:30px 32px;position:absolute;bottom:0px;left:0;right:0"><button type="button" class="btn btn-bcloud-blue active btn-lg btn-confirm" style="float:left;width: 100px;">保存</button>`+
            `<button type="button" class="btn btn-bcloud-white btn-cancel btn-lg" style="float:left;margin:0px 20px 0px 15px;width: 100px;">取消</button></div>`;

        $mask.on('click',function () {
            rightHide();
            options.callback.clickMask($rightModel);
        });
        /*右侧信息取消按钮事件*/
        $rightModel.find(".headClose").on('click',function () {
            rightHide();
            options.callback.clickCancel($rightModel);
        });
        let bodyAuto=true;
        //右侧模态框滑出
        function rightShow(){
            if($(body).css("overflow-y")=="hidden"){
                bodyAuto=false;
            }
            $(body).css("overflow-y","hidden");
            $rightModel.css("transform","translate(0px, 0px)");
            $mask.show();
        }
        //右侧模态框收缩
        function rightHide(){
            if(bodyAuto==true){
                $(body).css("overflow-y","auto");
            }
            $rightModel.css("transform","translate(100%, 0px)");
            $mask.hide();
            setTimeout(function(){
                $rightModel.find(".detail_context").html(`<img style="width:50px;margin:100px auto;display: block;" src=`+options.imgPath+`/img/plugins/sideModal/loading.gif>`);
            },200);
        }
        //添加内容文本
        function addContextHtml(htmlDiv){
            if($rightModel.children(".detail-footer").length > 0){
                $rightModel.children(".detail-footer").remove();
            }
            if(options.btnSwitch){
                $rightModel.append(operateDiv);

                $rightModel.find(".btn-confirm").on('click',function () {
                    options.callback.clickConfirm($rightModel);
                });
                $rightModel.find(".btn-cancel").on('click',function () {
                    rightHide();
                    options.callback.clickCancel($rightModel);
                });
            }
            let gapHeight;
            if(options.btnSwitch){
                gapHeight=$(".detail_head").outerHeight(true)+$(".detail-footer").outerHeight(true);
            }else{
                gapHeight=$(".detail_head").outerHeight(true);
            }
            $rightModel.find(".detail_context").css({
                "height":"-webkit-calc(100% - "+gapHeight+"px)",
                "height":"-moz-calc(100% - "+gapHeight+"px)",
                "height":"calc(100% - "+gapHeight+"px)"
            });
            $rightModel.find(".detail_context").html(htmlDiv);
        }
        //得到操作右侧元素的父级
        function getParentDom(){
            return $rightModel;
        }

        //返回对象事件
        let sideModalTools={
            showSideModal: rightShow,
            hideSideModal: rightHide,
            addHtml:addContextHtml,
            getPaDom:getParentDom
        };
        return sideModalTools;
    }
});