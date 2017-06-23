/**
 * create by Roger 20170617
 *主要功能：根据当前经、纬度获取符合范围内的商店
 * 默认第一个商店信息
 * */
var lat = lng = 0,lry = [];
window.addEventListener('message', function(event) {
    lry = [];
    // 接收位置信息
    var loc = event.data;
    lat = loc.lat;
    lng = loc.lng;
    var lc = {
        'lat':lat,
        'lng':lng
    };
    //存储经、纬度
    lry.push(lc);
    if(lry.length >=1){
        geo();
    }

    //当前位置不正确用户自选后 重新加载所在范围内的店铺
    if (loc && loc.module == 'locationPicker') {
        lry = [];
        $('#nowShop').html(loc.poiaddress );
        $('.showMap').hide();
        //获取经、纬度
        lat = loc.latlng.lat;
        lng = loc.latlng.lng;
        var lc = {
            'lat':lat,
            'lng':lng
        };
        //存储经、纬度
        lry.push(lc);
        kw='';
        cur();
    }
}, false);

//获取当前位置商店列表
function geo() {
    var method = 'GetShopList',
        param = {
            shopid: '0',
            device: '3',
            lat: lry[0].lat,
            lng: lry[0].lng
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
        success: function (geoData) {
            var ary = [];
            if (geoData.status == 1) {
                $(geoData.data).each(function (i, t) {
                    if (i == 0) { //默认选中第一个商店为默认的商店
                        $('#nowState').html(t.shop_name);
                        var ls = {
                            'id': t.s_id,
                            'name': t.shop_name,
                            'tel': t.telephone,
                            'addr': t.address,
                            'range': t.d_range
                        };
                        ary.push(ls);
                        removeLocalStorage('wginfo');
                        setStorage('wginfo', ls);
                    }
                });
            }

            if(geoData.status == 0){
                //定位失败
                $('.location-fail').show();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}

