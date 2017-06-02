/**
 * Created by Roger on 2017/5/15.
 */

var API_KEY = "gVzKTvzJyRTCkdDQ4AcQaCgp5iIpskbq",
    i = 0,
    Myscroll = curUrl = '',
    reqtime = Date.parse(new Date());

document.onreadystatechange = function() {
    if (document.readyState == 'complete') {
        load();
    }
}

function load() {
    //判断用户是否登录
    if (getCookies('username')) {
        //跳转到登录界面
        setStorage('urlReference', window.location.href);
        window.location.href = './register.html';
    } else {
        //获取所有的订单
        getOrderAll();
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

        if (document.readyState == 'complete') {
            layerState();
            setTimeout(function() {
                Myscroll.refresh();
                checkShow($(".order-list-wrapper").eq(i));
                $(".DOM-loadLayer").hide();
            }, 600);
        }

        Myscroll.on('scrollEnd', function() {
            checkShow($(".order-list-wrapper").eq(i)); //懒加载
            Myscroll.refresh();
        });

        $(".order-tab-container a").on("touchend", function() {
            //遍历节点 根据类型显示
            showType($(this).index());
            $(this).addClass("active").siblings("a").removeClass("active");
            $(this).siblings(".order-tab-border").css("left", $(this).width() * $(this).index());
            Myscroll.scrollTo(0, 0);
            i = $(this).index();
            checkShow($(".order-list-wrapper").eq(i)); //懒加载
        })
    }

    $('.back-button').bind('touchend',function(){
        window.location.href = getStorage('urlReference');
    });

}

function showType(showIdx) {
    $('.order-list-container').each(function(i, t) {
        if (showIdx == 0 || $(t).data('state') == showIdx) {
            $(t).show();
        } else {
            $(t).hide();
        }

    });
    Myscroll.refresh();
}


//所有订单

function getOrderAll() {
    // type all need post pay all 所有的订单  need 待付款 post 配送中 pay 已付款
    getOrderData('all', 0, 1, '');
}

//订单待付款

function getOrderNeedPay() {
    //TODO
}
//待配送

function getOrderPay() {
    //TODO
}
//配送中

function getOrderPosting() {
    //TODO
}
//获取订单数据

function getOrderData(getType, orderState, pageIdx, orderKeyWord) {
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
            $('#allOrder').empty();
            var str = '';
            $(orderMsg.data).each(function(i, t) {
                var stateNote = '',
                    stateBtn = '',
                    sumPrice = 0;
                //1未付款 2已付款  3 配送中 4已配送
                if (t.o_zt == 1) {
                    stateNote = "待付款";
                } else if (t.o_zt == 2) {
                    stateNote = '已付款';
                } else {
                    stateNote = '配送中';
                }
                if (t.o_zt == 1) {
                    var date = (new Date(t.start_date)).getTime(),
                        nowTime = (new Date()).getTime(),
                    //如果未付款订单时间超过4小时 该订单将失效
                        restTime = nowTime - date,
                        validate = 1;
                    if (restTime > (validate * 60 * 60 * 1000)) {
                        stateBtn = '<a href="javascript:void(0);" class="delOrder order-grey-button">删除订单</a><a href="javascript:void(0);" class="order-grey-button" >订单失效</a>';
                    } else {
                        stateBtn = '<a href="javascript:void(0);" class="cancleOrder order-grey-button">取消订单</a><a href="javascript:void(0);" class="goPay order-red-button">去付款</a><a href="javascript:void(0);" class="checkOrder order-grey-button">查看订单</a>';
                    }
                    //已付款
                } else if (t.o_zt == 2) {
                    stateBtn = '<a href="javascript:void(0);" class="delOrder order-grey-button">删除订单</a><a href="javascript:void(0);" class="againOrder order-red-button">再来一单</a><a href="javascript:void(0);" class="checkOrder order-grey-button">查看订单</a>';
                } else if (t.o_zt == 3) {
                    stateBtn = '<a href="javascript:void(0);" class="checkLogistics order-grey-button">查看物流</a><a href="javascript:void(0);" class="receiveConfrm order-red-button">确认收货</a><a href="javascript:void(0);" class="checkOrder order-grey-button">查看订单</a>';
                } else if (t.o_zt == 4) {
                    //其他类的订单
                    stateBtn = '<a href="javascript:void(0);" class="closeOrder order-grey-button">交易关闭</a><a href="javascript:void(0);" class="checkLogistics order-grey-button">查看物流</a>';
                }

                if (getType == 'all') {
                    str += '<div data-oid = ' + t.o_id + ' data-state = ' + t.o_zt + ' class="order-list-container bgWhite">' + '<div class="order-number">' + '<span>订单编号：<em>' + t.o_dh + '</em></span>' + '<em>' + stateNote + '</em>' + '</div>';
                    for (var i = 0; i < t.l_orderinfo.length; i++) {
                        sumPrice += t.l_orderinfo[i].prod_mxmony;
                        str += '<a href="./detail.html?p_id=' + t.l_orderinfo[i].p_id + '" class="order-list">' + '<div class="production-image">' + '<img data-src="' + t.l_orderinfo[i].prod_pic + '" class="img-responsive wait-load" alt="" />' + '</div>' + ' <div class="production-info">' + ' <h4 class="text-ellipsis-2">' + t.l_orderinfo[i].prod_name + '</h4>' + ' <div class="production-price">' + ' <span>' + t.l_orderinfo[i].prod_numb + '</span>' + ' <em>' + t.l_orderinfo[i].prod_mony + '</em>' + '</div></div></a>'
                    }
                    str += '<div class="order-time">' + '<span>订单时间：<em>' + t.start_date + '</em></span>' + '<span>应付款：<em class="totalPay">' + sumPrice + '</em></span>' + '</div>' + '<div class="order-button-container txt-right">' + stateBtn + '</div></div>';
                }

            });
            $('#allOrder').append(str);
            curUrl = parseInt(window.location.href.split('#')[1]);
            //1未付款 2已付款  3 配送中 4已配送
            if (!isNaN(curUrl)) {
                showType(curUrl);
                var navIndex = 0;
                switch (curUrl) {
                    case 0:
                    {
                        navIndex = 0;
                        break;
                    }
                    case 1:
                    {
                        navIndex = 1;
                        break;
                    }
                    case 2:
                    {
                        navIndex = 2;
                        break;
                    }
                    case 3:
                    {
                        navIndex = 3;
                        break;
                    }
                    default:
                    {
                        navIndex = 0;
                        break;
                    }
                }
                $(".order-tab-container a").eq(navIndex).addClass('active').siblings('a').removeClass('active');
                $('.order-tab-border').css('left', $(".order-tab-container a").width() * curUrl + 'px');
            } else {
                showType(0);
            }

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    });

}

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
                getOrderData('all', 0, 1, '');
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
                getOrderData('all', 0, 1, '');
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