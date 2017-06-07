/*
* alter Roger 20170527
* */

var navBox=contentBox=popoverWrapper=mySwiper='',
    checkShowItem = $("div.item-box-0"),pullUp= true,
    nav = $(".item-nav ul");

    //请求添加后台数据
    window.onload = function(){
        getListType();
        prodList();
        cartPopover();
        searchPanel();
        changeCart();
        getCartLocalStorage();
    };

    $(document).on('ajaxComplete',function(e,xhr,op){
        layerState();
        navBox.refresh();
        contentBox.refresh();
        popoverWrapper.refresh();
        //checkShow(checkShowItem);
    });

function prodList() {
    var winHeight = $(window).height(),
        headerHeight, footerContainer,
        searchContainer = $(".search-padding-container").height(),
        itemTabContainer = $(".item-tab-container").height();

    if($(".common-head").length <= 0){
    	headerHeight = 0;
    }else{
    	headerHeight = $(".common-head").height();
    }

    if($(".footer-container").length <= 0){
    	footerContainer = 0;
    }else{
    	footerContainer = $(".footer-container").height();
    }

    $(".item-box").css("height", winHeight-searchContainer-headerHeight-itemTabContainer-footerContainer);

    navBox = new IScroll(".item-nav", {
        click: true,
        touchend: true,
        preventDefaultException: { tagName: /^(INPUT|A|SPAN)$/ },
        bindToWrapper: true,
        scrollbars: true,
        fadeScrollbars: true,
        tap: true
    });

    contentBox = new IScroll(".item-content", {
        click: true,
        touchend: true,
        preventDefaultException: { tagName: /^(INPUT|A|SPAN)$/ },
        bindToWrapper: true,
        scrollbars: true,
        fadeScrollbars: true
    });

    popoverWrapper = new IScroll(".cart-popover-wrapper", {
        preventDefaultException: {
            tagName: /^(INPUT|A|SPAN)$/
        },
        bindToWrapper: true,
        scrollbars: true,
        fadeScrollbars: true,
        click: true,
        tap: true
    });

    //轮播图动画
    mySwiper = new Swiper('.swiper-container', {
        loop: true,
        pagination: '.swiper-pagination',
        paginationType: 'fraction'
    });

    $(".item-tab-container").on("touchend","a",function(){
        $(this).addClass("active").siblings("a").removeClass("active");
        $(".item-section-content").eq($(this).index()).show().siblings().hide();
        $(this).siblings(".item-tab-border").css("left",$(this).width()*$(this).index());
        if($(this).index()==1){
            mySwiper.update();
            mySwiper.slideTo(1, 0, false);
        }
    });

    //左侧导航栏添加事件
    //需要传递参数 关键词 分类编号 页码 默认1
    var ci = k = tc = '',p = 1;

    nav.on("tap", "li", function () {
        //添加clickFlag 标志
        $(this).addClass("clickFlag");
        $(this).addClass("active").siblings("li").removeClass("active");

        var a = $(this).children("a").attr("rel"),
            p = 1;

        var itemBoxCuurrent = $(".item-box-" + a);
            checkShowItem = itemBoxCuurrent;

            itemBoxCuurrent.show().siblings().hide();
            contentBox.refresh();
            contentBox.scrollTo(0, 0);
            navBox.scrollToElement(this, 100);

       //请求后台数据
       //需要传递参数 关键词 分类编号 页码 默认1
            ci = $(this).data("ci");
            k = $(this).data("name");
            tc = itemBoxCuurrent.selector;
        //决定是否要请求后台数据
        $("ul li", tc).length == 0 ? getListPage(ci, k, p, tc) : '';
    });

    contentBox.on("scrollEnd", function () {

        $('#typeList li').each(function(i,t){
            if($(t).hasClass('active')){
                k = +$('a',t).html();
                ci = $(t).data("ci");
                tc = '.'+$(t).data('typeclass');
            }
        });

        //页面上拉加载
        var curScrollDirection = contentBox.directionY,
            maxScroll = contentBox.maxScrollY + 80, y = contentBox.y;
        if (y <= maxScroll && curScrollDirection == 1) {
            pullUp = true;
            //开始请求后台数据
            if(pullUp){
                ++p;
                getListPage(ci, k, p, tc);
            }
        } else {
            pullUp = false;
        }
        checkShow(checkShowItem);
    });
}
