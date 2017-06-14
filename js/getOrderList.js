/**
 * Created by Roger on 2017/5/15.
 */

var API_KEY = "gVzKTvzJyRTCkdDQ4AcQaCgp5iIpskbq",
    lazyIndx = loadType=curScrollDirection = y = maxScroll = 0,
    Myscroll = curUrl = keys = '',
    pullUp = true,//开关 启用上拉加载
    page = 1,
    reqtime = Date.parse(new Date());

//订单搜索
document.onkeydown = function(evt){
    var keyCode = evt.keyCode||evt.which,
        sKey = $('.searchOrder').val();
        if(keyCode == 13){
            $(".DOM-loadLayer").removeClass('hide').show();
            page = 1;
            getOrderData(loadType,page,sKey);
            $('input').blur();
            evt.preventDefault();
        }
};

//页面的整体整天js css 加载完成
window.onload = function(){
    //判断链接是从那个页面传递过来的
    var pageUrl = getStorage('hrefMark');
    if(pageUrl != null){
        loadType = parseInt(pageUrl);
        lazyIndx = parseInt(pageUrl);
        $(".order-tab-border").css("left",$(".order-tab-container a").eq(lazyIndx).width()*lazyIndx+'px');
        $('.order-tab-container a').eq(lazyIndx).addClass('active').siblings('a').removeClass('active')
    }
    load();
};

$(document).on('ajaxComplete',function(){
    layerState();
    checkShow($(".order-list-wrapper"));
    Myscroll.refresh();
});

function load() {
    //判断用户是否登录
    if (getCookies('username')) {
        //跳转到登录界面
        setStorage('urlReference', window.location.href);
        window.location.href = './register.html';
    } else {
        //获取所有的订单
        getOrderData(loadType,page,'');
        Myscroll = new IScroll('#scroll-wrapper', {
            click: true,
            touchend: true,
            preventDefaultException: {
                tagName: /^(INPUT|BUTTON|SELECT|A|SPAN)$/
            },
            bindToWrapper: true,
            scrollbars: true,
            fadeScrollbars: true,
            shrinkScrollbars: 'clip'
        });


        Myscroll.on('scrollEnd', function() {
            checkShow($(".order-list-wrapper").eq(lazyIndx)); //懒加载
            //页面上拉加载
            curScrollDirection = Myscroll.directionY,
                maxScroll = Myscroll.maxScrollY + 120,
                y = Myscroll.y;
            if (y <= maxScroll && curScrollDirection == 1) {
                pullUp = true;
                //开始请求后台数据
                if (pullUp) {
                    getOrderData(loadType, ++page, '');
                }
            } else {
                pullUp = false;
            }
            Myscroll.refresh();
            checkShow($(".order-list-wrapper"));
        });

        $(".order-tab-container a").on("touchend", function() {
            $('#allOrder').empty();
            //遍历节点 根据类型显示
            //showType($(this).index());
            $(this).addClass("active").siblings("a").removeClass("active");
            $(this).siblings(".order-tab-border").css("left", $(this).width() * $(this).index());
            Myscroll.scrollTo(0, 0);
            lazyIndx = $(this).index();

            switch (lazyIndx){
                case 0:{ getOrderAll();break;}
                case 1:{ getOrderNeedPay();break;}
                case 2:{ getOrderPay();break;}
                case 3:{ getOrderPosting();break;}
                default:{break;}
            }

        });
    }
}

//所有订单
//1未付款 2已付款  3 配送中 4已配送

function getOrderAll() {
    // type all need post payed posting 所有的订单  need 待付款 post 配送中 pay 已付款
    loadType = 0;
    page = 1;
    getOrderData(loadType,page,'');
}

//订单待付款

function getOrderNeedPay() {
    loadType = 1;
    page = 1;
    getOrderData(loadType, page, '');
}

//待配货
function getOrderPay() {
    loadType = 2;
    page = 1;
    getOrderData(loadType, page, '');
}

//配送中
function getOrderPosting() {
    loadType = 3;
    page = 1;
    getOrderData(loadType, page, '');
}

//获取订单数据
function getOrderData(orderState, pageIdx, orderKeyWord) {
    var method = 'GetOrderList',
        param = {
            shopid: "3",
            device: "3",
            u_id: getCookieVal('userid'),
            o_zt: orderState,
            pageIndex: pageIdx,
            keyword: orderKeyWord
        };
    sign = md5(JSON.stringify(param) + method + reqtime + API_KEY);
    $.ajax({
        url: "../API/WebApi.ashx",
        async: true,
        type: "post",
        dataType: 'json',
        data: {
            param: JSON.stringify(param),
            method: method,
            reqtime: reqtime,
            sign: getSecret(param, method, reqtime)
        },
        success: function(orderMsg) {
            if(orderMsg.status == 1&&orderMsg.data == null){
                //没有订单
                $('.allOrderInfo').hide();
                $('.default-page-container').show();
            }

            if(pageIdx == 1){
                $('#allOrder').empty();
            }

            var str = '';
            $(orderMsg.data).each(function(i, t) {
                var stateNote = '',
                    stateBtn = '',
                    sumPrice = 0;
                //1未付款 2已付款  3 配送中 4已配送
                if (t.o_zt == 1) {
                    var date = (new Date(t.start_date)).getTime(),
                        nowTime = (new Date()).getTime(),
                    //如果未付款订单时间超过4小时 该订单将失效
                        restTime = nowTime - date,
                        validate = 4;
                        stateNote = "待付款";
                    if (restTime > (validate * 60 * 60 * 1000)) {
                        stateBtn = '<a href="javascript:void(0);" class="delOrder order-grey-button">删除订单</a><a href="javascript:void(0);" class="order-grey-button" >订单关闭</a>';
                    } else {
                        stateBtn = '<a href="javascript:void(0);" class="cancleOrder order-grey-button">取消订单</a><a href="javascript:void(0);" class="checkOrder order-grey-button">查看订单</a><a href="javascript:void(0);" class="goPay order-red-button">去付款</a>';
                    }
                    //已付款
                } else if (t.o_zt == 2) {
                    stateNote = '已付款';
                    stateBtn = '<a href="javascript:void(0);" class="delOrder order-grey-button">删除订单</a><a href="javascript:void(0);" class="checkOrder order-grey-button">查看订单</a>';
                } else if (t.o_zt == 3) {
                    stateNote = '配送中';
                    stateBtn = '<a href="javascript:void(0);" class="checkLogistics order-grey-button">查看物流</a><a href="javascript:void(0);" class="receiveConfrm order-red-button">确认收货</a>';
                } else if (t.o_zt == 4) {
                    //其他类的订单
                    stateBtn = '<a href="javascript:void(0);" class="closeOrder order-grey-button">交易关闭</a><a href="javascript:void(0);" class="checkLogistics order-grey-button">查看物流</a>';
                }

                str += '<div data-oid = ' + t.o_id + ' data-state = ' + t.o_zt + ' class="order-list-container bgWhite">' + '<div class="order-number">' + '<span>订单编号：<em>' + t.o_dh + '</em></span>' + '<em>' + stateNote + '</em>' + '</div>';
                for (var i = 0; i < t.l_orderinfo.length; i++) {
                    sumPrice += t.l_orderinfo[i].prod_mxmony;
                    str += '<a href="./detail.html?p_id=' + t.l_orderinfo[i].p_id + '" class="order-list">' + '<div class="production-image">' + '<img data-src="' + t.l_orderinfo[i].prod_pic + '" class="img-responsive wait-load" alt="" />' + '</div>' + ' <div class="production-info">' + ' <h4 class="text-ellipsis-2">' + t.l_orderinfo[i].prod_name + '</h4>' + ' <div class="production-price">' + ' <span>' + t.l_orderinfo[i].prod_numb + '</span>' + ' <em>' + t.l_orderinfo[i].prod_mony + '</em>' + '</div></div></a>'
                }
                str += '<div class="order-time">' + '<span>订单时间：<em>' + t.start_date + '</em></span>' + '<span>应付款：<em class="totalPay">' + sumPrice + '</em></span>' + '</div>' + '<div class="order-button-container txt-right">' + stateBtn + '</div></div>';

            });

            $('#allOrder').append(str);

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}

//订单按钮功能
//去付款
$('.goPay').live('touchend', function() {
    //获取订单ID 和 需要支付的总额
    var oid = $(this).parents('.order-list-container').data('oid'),
        totalPay = $('.totalPay', $(this).parents('.order-list-container')).html();
    setCookie('orderId', oid);
    setCookie('total', totalPay);
    window.location.href = './Settlement.html';
});

//取消订单
$('.cancleOrder').live('touchend', function() {
    var method = 'CancelOrder',
        param = {
            shopid: "3",
            device: "3",
            o_id: $(this).parents('.order-list-container').data('oid')
        };
    sign = md5(JSON.stringify(param) + method + reqtime + API_KEY);
    $.ajax({
        url: "../API/WebApi.ashx",
        async: true,
        type: "post",
        dataType: 'json',
        data: {
            param: JSON.stringify(param),
            method: method,
            reqtime: reqtime,
            sign: getSecret(param, method, reqtime)
        },
        success: function(delMsg) {
            if (delMsg.status == 1) {
                $('#allOrder').empty();
                page = 1;
                getOrderData(loadType, page, '');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    });
});

//删除订单
$('.delOrder').live('touchend', function() {
    var method = 'DeleteOrder',
        param = {
            shopid: "3",
            device: "3",
            o_id: $(this).parents('.order-list-container').data('oid')
        };
    sign = md5(JSON.stringify(param) + method + reqtime + API_KEY);
    $.ajax({
        url: "../API/WebApi.ashx",
        async: true,
        type: "post",
        dataType: 'json',
        data: {
            param: JSON.stringify(param),
            method: method,
            reqtime: reqtime,
            sign: getSecret(param, method, reqtime)
        },
        success: function(delMsg) {
            if (delMsg.status == 1) {
                $('#allOrder').empty();
                page = 1;
                getOrderData(loadType, page, '');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    });

});

//查看订单
$('.checkOrder').live('touchend', function() {
    setStorage('urlReference', window.location.href);
    window.location.href = './orderDetail.html?oid=' + $(this).parents('.order-list-container').data('oid') + '&tp=' + $(this).parents('.order-list-container').data('state');
});