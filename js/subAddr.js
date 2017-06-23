/**
 * Created by Roger on 2017/5/11.
 */
//加密方式
var API_KEY = "gVzKTvzJyRTCkdDQ4AcQaCgp5iIpskbq",
    reqtime = Date.parse(new Date()),
    u_id = '',
    aid = 0,
    urlStr = window.location.href;
    u_id = getCookieVal('userid');

$('.address-choose').on('touchend', function() {
    $('input').blur();
    //开始执行地图API
    var geolocation = new qq.maps.Geolocation("IFLBZ-ZVHRI-XDSGG-5NY25-IITSH-4HFXD", "O2O"),
        options = {timeout: 8000};
    //获取精准位置
    geolocation.getLocation(showPosition, showErr, options);

    function showPosition(position){
        $('input[name="nation"]').val(position.province);
        $('input[name="province"]').val(position.province);
        $('input[name="city"]').val(position.city);
        $('input[name="lat"]').val(position.lat);
        $('input[name="lng"]').val(position.lng);
    };

    function showErr() {};

    setTimeout(function(){
        if (urlStr.indexOf('editId') != -1) {
            $('#mapPage').attr('src','http://apis.map.qq.com/tools/locpicker?type=1&effect=zoom&coord='+$("input[name='lat']").val()+','+$("input[name='lng']").val()+'&search=1&policy=1&mapdraggable=1&type=1&key=IFLBZ-ZVHRI-XDSGG-5NY25-IITSH-4HFXD&referer=O2O');
        }
        $('header').hide();
        $('#mapPage').show();
    },500);
});

window.onload = function() {
    var nodes = '';
    addStack();
    //判断是否修改页面跳转过来
    if (urlStr.indexOf('editId') != -1) {
        //提取需要修改的收货地址信息
        var ls = window.localStorage;
            ary = [];
         ary = getStorage('editInfo');
        $(ary).each(function(i, t) {
            aid = t.editId;
            $("input[name='r_name']").val(t.u_name);
            $("input[name='r_sj']").val(t.u_sj);
            $("input[name='nation']").val(t.nation);
            $("input[name='province']").val(t.province);
            $("input[name='city']").val(t.city);
            $("input[name='district']").val(t.district);
            $("textarea[name='addr']").val(t.addr);
            $("input[name='lat']").val(t.lat);
            $("input[name='lng']").val(t.lng);
        });
        //改变按钮样式
        $('.submitBtn').hide();
        $('.editBtn').show();
        nodes +='<iframe id="mapPage" style = "display: none" width="100%" height="100%" frameborder="0" ';
        nodes += ' src="http://apis.map.qq.com/tools/locpicker?';
        nodes += 'type=1&effect=zoom&coord='+$("input[name='lat']").val()+','+$("input[name='lng']").val()+'&search=1&policy=1&mapdraggable=1&type=1&key=IFLBZ-ZVHRI-XDSGG-5NY25-IITSH-4HFXD&referer=O2O">';
        nodes += '</iframe>';

    }else{
        nodes +='<iframe id="mapPage" style = "display: none" width="100%" height="100%" frameborder="0" ';
        nodes += ' src="http://apis.map.qq.com/tools/locpicker?';
        nodes += 'type=1&effect=zoom&policy=1&mapdraggable=1&radius=3000&key=IFLBZ-ZVHRI-XDSGG-5NY25-IITSH-4HFXD&referer=O2O">';
        nodes += '</iframe>';
    }
    $('body').append(nodes);

};

//修改收货地址表单
$('.editBtn').on('touchend', function() {
    for (var ii = 0; ii < (urlStr.split('?')[1].split('&')).length; ii++) {
        aid = urlStr.split('?')[1].split('&')[ii].split('=')[1]
    }
    removeStack();
    removeLocalStorage('editInfo');
    changeInfoFrm("EditAddress", aid);
});

//提交收货地址表单
$('.submitBtn').on('touchend', function() {
    removeStack()
    changeInfoFrm("PutAddress", 0);
});

function changeInfoFrm(mtd, aid) {
    if (checkRname()) {
        if (checkRsj()) {
            //开始提交填写收货地址表单
            var u_name = $("input[name='r_name']").val(),
                u_sj = $("input[name='r_sj']").val(),
                nation = $("input[name='nation']").val(),
                province = $("input[name='province']").val(),
                city = $("input[name='city']").val(),
                district = $("input[name='district']").val(),
                addr = $("textarea[name='addr']").val(),
                lat = $("input[name='lat']").val(),
                lng = $("input[name='lng']").val(),
                method = mtd,
                param = {
                    shopid: "3",
                    device: "3",
                    u_id: u_id,
                    ad_id: aid,
                    u_name: u_name,
                    u_sj: u_sj,
                    nation: nation,
                    province: province,
                    city: city,
                    district: district,
                    addr: addr,
                    lat: lat,
                    lng: lng
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
                success: function(addrData) {
                    if (addrData.status == 1) {
                        window.location.href = './addressList.html?u_id=' + u_id;
                    }  else {
                        showTip(addrData.msg).showError();
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(textStatus);
                }
            });
        }
    } else {
        showTip('请核查表单的信息是否有误!').showError();
    }

}

function checkRname() {
    if ($("input[name='r_name']").val().trim() != "") {
        return true;
    } else {
        return false;
    }
}

function checkRsj() {
    if (IsMobile($("input[name='r_sj']").val())) {
        return true
    } else {
        return false
    }
}


function IsMobile(p) {
    var reg = /^(13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7}$/;
    return reg.test(p) ? true : false;
}