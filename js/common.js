//发送验证码公共函数方法
function sendCode(phone, pType, obj) {
    //ajax 发送验证码
    settime(obj);
    var method = 'SendCode',
        param = {
            shopid: "3",
            device: "3",
            phone: phone,
            //1注册新用户 2忘记密码 3修改手机号（校验旧手机）4登录验证码 5修改手机号(新手机)
            p_type: pType, //1注册 2忘记密码
            u_id:getCookieVal('userid')
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
            sign: sign
        },
        success: function(iMessage) {

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}

//去除body Touch事件
function RemoveBodyTouch() {
    $("body").on("touchstart, touchmove", function(e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    });
}

//恢复body Touch事件
function RecoveryBodyTouch() {
    $("body").off("touchstart, touchmove");
}

//搜索页面出现事件
function searchPanel() {
    var Myscroll = new IScroll('.fuzzy-search', {
        click: true,
        touchend: true,
        preventDefaultException: {
            tagName: /^(INPUT|A|SPAN)$/
        },
        bindToWrapper: true,
        scrollbars: true,
        fadeScrollbars: true,
        shrinkScrollbars: 'clip'
    });

    //点击出现搜索
    $(".search-container").on("touchend", function() {
        if ($(this).find("span").text().trim() != "搜索你喜欢的商品") {
            $("aside.search-panel").find("input").val($(this).find("span").text().trim());
        }
        $("aside.search-panel").addClass("active").find("input").focus();
        RemoveBodyTouch();
        //开始执行 搜索历史
        startSearchHistory();
        //开始执行 热门搜索
        startSearchHot();
        return false;
    })

    //点击关闭搜索
    $(".close-panel").on("touchend", function() {
        $("aside.search-panel").removeClass("active").find("input").blur();
        RecoveryBodyTouch();
        return false;
    })

    //输入框实时监测显示删除按钮、模糊搜索刷新
    $(".search-panel input").on('input propertychange', function() {
        var inputVal = $(this).val().trim();
        if (inputVal.length > 0) {
            $(this).siblings(".clear-button").addClass("active");
            $(".fuzzy-search").addClass("active");
            //开始搜索输入相关的关键词
            searchLikeKey(inputVal);

            Myscroll.refresh();
        } else {
            $(this).siblings(".clear-button").removeClass("active");
            $(".fuzzy-search").removeClass("active");
        }

    })

    //点击删除按钮清除文本框事件
    $(".clear-button").on("touchend", function() {
        $(this).removeClass("active").prev("input").val("");
        $(".fuzzy-search").removeClass("active");
    })

    //点击回车事件
    document.onkeydown = function(e) {
        var enterCode = e.which || e.keyCode;
        if (enterCode == 13) {
            searchByKeyword();
            return false;
        }

    }
}

/*加入购物车动画*/
function addItem() {
    // 元素以及其他一些变量
    var eleFlyElement = document.querySelector(".fly-item"), eleShopCart = document.querySelector(".item-footer-cart");
    // 抛物线运动
    var myParabola = funParabola(eleFlyElement, eleShopCart, {
        speed: 600,
        curvature: 0.004,
        complete: function () {
            eleFlyElement.style.visibility = "hidden";
        }
    });
    // 绑定点击事件
    if (eleFlyElement && eleShopCart) {
        [].slice.call(document.getElementsByClassName("fly-add")).forEach(function (button) {
            button.addEventListener("click", function () {
                //console.log("event.clientX:"+ event.clientX+"event.clientY:"+event.clientY+"event.offsetX:"+event.offsetX+"event.offsetY:"+event.offsetY)
                // 滚动大小
                var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft || 0,
	                scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
                eleFlyElement.style.left = -event.offsetX + scrollLeft + "px";
                eleFlyElement.style.top = -event.offsetY + scrollTop + "px";
                eleFlyElement.style.visibility = "visible";
                // 需要重定位
                myParabola.position().move();
            });
        });
    }
}

//点击搜索按钮开始搜索
$('.search-button').on('touchend', function() {
    //获取用户输入的搜索关键词
    searchByKeyword();
});

function searchByKeyword(){
    var keyword = $(".search-panel").find("input").val(),
        pageIndex = 1;
    window.location.href = './searchResult.html?keyword=' + encodeURI(keyword) + '&pageIndex=1';
}

//购物车弹出层事件
function cartPopover() {
    $(".item-footer.active").live("click", function(e) {
        if ($(".over-bg").hasClass("active")) {
            $(".over-bg, .cart-popover-content").removeClass("active");
            RecoveryBodyTouch();
        } else {
            $(".over-bg, .cart-popover-content").addClass("active");
            popoverWrapper.refresh();
            RemoveBodyTouch();
        }
        e.stopPropagation();
        //return false;
    });

    $(".over-bg").on("touchend", function(e) {
        $(".over-bg, .cart-popover-content").removeClass("active");
        RecoveryBodyTouch();
        e.stopPropagation();
    });
}

//提示
function showTip(con) {
    var obj = new Object();
    obj.con = con;
    //错误提示
    obj.showError = function() {
        $("body").append("<div class='popover-alert'><div class='alert-content error-content'><em></em>" + this.con + "</div></div>");
    }
    //正确提示
    obj.showSuccess = function() {
        $("body").append("<div class='popover-alert'><div class='alert-content'><em></em>" + this.con + "</div></div>")
    }
    setTimeout(function() {
        $(".popover-alert").addClass("active");
    }, 40);
    setTimeout(function() {
        $(".popover-alert").removeClass("active");
    }, 2000);
    setTimeout(function() {
        $(".popover-alert").remove();
    }, 1900);
    return obj;
}

//confirm确认框
function confirmPanel(message, callback) {
    var obj = new Object();
    obj.message = message;
    $("body").append("<div class='confirm-popover-container'><div class='confirm-content'><h5>" + message + "</h5><div class='confirm-button'><a href='javascript:;' class='cancel-button'>取消</a><a href='javascript:;' class='sure-button'>确认</a></div></div></div>");
    setTimeout(function () {
        $(".confirm-popover-container").addClass("active");
    }, 40);

    $(".confirm-button").on("click", "a", function () {
        if ($(this).hasClass("sure-button")) {
            if (callback) callback(true);
        }
        $(".confirm-popover-container").removeClass("active");
        setTimeout(function () {
            $(".confirm-popover-container").remove();
        }, 500)
        return false;
    })
    return obj;
}

//充值、结算单选事件
function recharge() {
    $(".order-payment-method-items").on('touchend', function() {
        $('.order-payment-method-items').removeClass('sel-active');
        $(".payment-sel-radio input[type^='radio']").removeAttr('checked');
        $("input[type^='radio']", this).attr('checked', 'checked');
        $(this).addClass('sel-active');
    });
}

var API_KEY = "gVzKTvzJyRTCkdDQ4AcQaCgp5iIpskbq";
var reqtime = Date.parse(new Date());

//历史搜索  公共搜索方法
function startSearchHistory() {
    var u_id = getCookieVal('userid');
    u_id = (u_id == undefined ? 0 : u_id);
    var method = 'GetSearchLog',
        param = {
            shopid: "3",
            device: "3",
            u_id: u_id
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
        success: function(searchHidstory) {
            $(".searchHistory").empty();
            var str = '';
            //如果搜索历史为空 这不显示搜索历史
            if (searchHidstory.data == "") {
                $(".searchHistoryBox").hide();
            } else {
                $(searchHidstory.data).each(function(i, t) {
                    str += "<a href=''>" + t.keyword + "</a>";
                });
                $(".searchHistory").append(str);
            }
        },
        error: function(msg) {

        }

    });
}

//热门搜索
function startSearchHot() {
    var method = 'GetHotKeyWord',
        param = {
            shopid: "3",
            device: "3"
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
        success: function(searchHot) {
            $(".searchHot").empty();
            var str = '';
            if (searchHot.data == "") {
                $(".searchHotBox").hide();
            } else {
                $(searchHot.data).each(function(i, t) {
                    //id 编号  paraml 名称
                    //'<a href="./searchResult.html?keyword=' + encodeURI(t.l_key) + '&pageIndex=1" >' + t.l_key + '</a>';
                    str += "<a href='./searchResult.html?keyword="+ encodeURI(t.param1) + "&pageIndex=1' data-id='" + t.id + "'>" + t.param1 + "</a>";
                });
                $(".searchHot").append(str);
            }
        },
        error: function() {

        }

    });

}

//搜索相进的关键词
function searchLikeKey(vals) {
    //获取用户输入的搜索关键词
    var method = 'GetLikeProdKey',
        param = {
            shopid: "3",
            device: "3",
            keyword: vals
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
        success: function(likeData) {
            $('.fuzzy-wrapper').empty();
            var str = '';
            $(likeData.data).each(function(i, t) {
                str += '<a href="./searchResult.html?keyword=' + encodeURI(t.l_key) + '&pageIndex=1" >' + t.l_key + '</a>';
            });
            //将搜索到的相近的关键词添加到节点上面
            $('.fuzzy-wrapper').append(str);
        },
        error: function() {

        }

    });

}

//产品搜索
function searResult(keyWord, pageIndex) {
    //$('.search-list').empty();
    //解析传递过来的url 获取搜索关键词
    var method = 'GetSearchResult',
        param = {
            shopid: "3",
            device: "3",
            keyword: keyWord,
            pageIndex: pageIndex
        };
    $('.keyWord').html(keyWord);
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
        success: function(searchResult) {
            var str = '';
            if(searchResult.data == ""||searchResult.data.length == 0){
                 $('.search-list-container').hide();
                 $('.default-page-container').show();
                 //没有搜索结果
                 return false;
            }
            $(searchResult.data).each(function(i, t) {
                str += '<li class="generalCart publicCart" data-mxcontain = ' + t.l_storage +
                    ' data-id =' + t.id + ' data-price=' + t.l_danjia +
                    ' data-name = "' + t.l_name +
                    '"><a href="detail.html?p_id=' + t.id + '" data-href="detail.html?p_id=' + t.id + '">' +
                    '<div class="production-image">' +
                    '<img data-src="' + t.l_pic1 +
                    '" class="img-responsive wait-load" alt="" />' +
                    '</div>' + '<p class="text-ellipsis-2">' + t.l_name +
                    '</p>' + '<em class="production-price">' + t.l_danjia +
                    '</em>' + '<div class="search-buy-icon plus-button"></div><input type="hidden" value="0">' +
                    '</a></li>';
            });
            $('.search-list').append(str);
            Myscroll.refresh();
        },
        error: function() {

        }

    });

}

//cookie判断用户状态 true 用户没有登录
function getCookies(name) {
    var cookieStr = document.cookie;
    if (cookieStr.indexOf(name) == -1) {
        return true;
    } else {
        var cookieSplit = cookieStr.split(';');
        for (var i = 0; i < cookieSplit.length; i++) {
            if (name == cookieSplit[i].split('=')[0]) {
                return false;
            }
        }
    }
}

//获取cookie值
function getCookieVal(uname) {
    var cookieStr = document.cookie;
    var cookieSplit = cookieStr.split(';');
    for (var j = 0; j < cookieSplit.length; j++) {
        var splitName = cookieSplit[j].split('=')[0];
        if (uname == splitName.trim()) {
            var cookieVal = (cookieSplit[j].split('='))[1];
            return cookieVal;
        }
    }
}

///設置cookie
function setCookie(name, value) {
    var day = 1,
        exp = new Date();
    exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + decodeURI(value) + ';expires=' + exp.toUTCString() + ';path=/';
}

//删除cookie
function removeCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    document.cookie = name + '=' + decodeURI(name) + ';expires=' + exp.toUTCString() + ';path=/';

}

//设置localStorage 值
function setStorage(name, value) {
    try{
        var ls = window.localStorage;
        ls.setItem(name, JSON.stringify(value));
        return true;
    }catch (error){
        alert(error);
        return false;
    }
}

//获取 localStorage 值
function getStorage(name) {
    var ls = window.localStorage;
    return JSON.parse(ls.getItem(name));
}

//删除localStorage
function removeLocalStorage(name) {
    window.localStorage.removeItem(name);
}

//加载状态
function layerState() {
    setTimeout(function() {
        $(".DOM-loadLayer").addClass('hide');
        setTimeout(function(){$(".DOM-loadLayer").hide();},900);
    }, 400);
}

//判断是否是微信端
function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}

//判断网络问题
function isOnline(){
    if(navigator.onLine){
        return true;
    }else{
        return false;
    }
}

//判断广告过滤
function  isAds(){
    var timer = setInterval(function(){
        //匹配广告id
        $('span[id*="ads"],div[id*="ads"]').hide();
    },120);
    setTimeout(function(){
        clearInterval(timer);
    },60000);
}

document.ready = function(){
    isAds();
}
