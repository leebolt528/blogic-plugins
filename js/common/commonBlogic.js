$(function(){
    //头部鼠标移入事件
    $('.blogic-nav .menu-wrap').mouseover(function(){
        $('.blogic-nav .sidebar').addClass('showSidebar');
        $('.blogic-nav .sidebar .blogic-sidebar-mask-wrap').addClass('show');
    });
    //背景点击取消侧边事件
    $('.blogic-nav .sidebar .blogic-sidebar-mask-wrap').click(function(){
        $(this).removeClass('show');
        $(this).parent().removeClass('showSidebar');
    });
    //独立框架一级菜单
    $(".blogic-nav .outer-sidebar li").click(function(){
        $(".blogic-nav .outer-sidebar li").removeClass("active");
        $(this).addClass("active");
    });

});