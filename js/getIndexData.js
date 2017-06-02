var API_KEY = "gVzKTvzJyRTCkdDQ4AcQaCgp5iIpskbq";
var reqtime = Date.parse(new Date());
//获取banner图片
$('.index-banner').ready(function () {
    var method = "GetIndexBar",
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
            sign: getSecret(param,method,reqtime)
        },
        success: function (data) {
            var str = '';
            $(data.data).each(function (i, t) {
                str += "<a href='' class='swiper-slide'><img src='" + t.ad_pic + "' alt='" + t.ad_name + "' /></a>"
            });
            $('.swiper-wrapper').append(str);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
           //alert(textStatus)
        }
    })
});

//精选店铺后台请求  上拉加载更多 需要执行的函数
function getProduct(defaultPage) {
    var method = 'GetIndexSelected',
		param = {
		    shopid: "3",
		    device: "3",
		    pageIndex: defaultPage
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
            sign: getSecret(param, method,reqtime)
        },
        success: function (msg) {
            var str = '';
            $(msg.data).each(function (i, t) {
                str += "<li><a href='detail.html?p_Id="+t.id+"'><div class='production-image'><img data-src='" + t.l_pic1 + "' class='img-responsive wait-load' alt='" + t.l_name + "' /></div><p class='text-ellipsis-1'>" + t.l_name + "</p><em class='production-price'>" + t.l_danjia + "</em></a></li>"
            });
            $('.production-list').append(str);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}
