// create by Roger
//加密方式
var API_KEY = "gVzKTvzJyRTCkdDQ4AcQaCgp5iIpskbq";
var reqtime = Date.parse(new Date())

//微信 授权
function weiLog() {
    alert("weiLog");
    var method = 'WeChatRightApply',
            param = {
                shopid: 3,//getStorage('wginfo').id,
                device: "3",
                pageName: 'Settlement.html',
                keyword: ''
            };
    sign = md5(JSON.stringify(param) + method + reqtime + API_KEY);
    alert("sing:" + sign);
    $.ajax({
        url: "/API/WebApi.ashx",
        async: true,
        type: "post",
        dataType: 'json',
        data: {
            param: JSON.stringify(param),
            method: method,
            reqtime: reqtime,
            sign: getSecret(param, method, reqtime)
        },
        success: function (logState) {
            alert(11);
            window.location.href = logState.data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}