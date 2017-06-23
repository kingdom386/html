
    /**
     * 1. 获取经纬度坐标
     * 2. 根据经纬度坐标获取详细地址
     * 3. 根据经纬度坐标调用ajax查询附近的门店
     */
    var Position = {
        timer: null,
        timeout: 0,
        config_id: 1,
        send_type: 0,
        sub:1,
        pageID: 1,
        longitude :'',    //经度
        latitude : '',     //纬度
        rp: 10,
        page: 1,
        nearTotalPages :0,
        /**
         * 获取经纬度坐标
         */
        getPosition: function () {
            Position.timeout += 1000;
            if ( Position.timeout> 6000 ) {
                clearInterval(Position.timer);
            }
            var options = {timeout: 8000};
            var geolocation = new qq.maps.Geolocation("IFLBZ-ZVHRI-XDSGG-5NY25-IITSH-4HFXD", "O2O");
            geolocation.getLocation(function (position) {   //定位成功回调函数
                Position.longitude = position.lng;
                Position.latitude = position.lat;
                clearInterval(Position.timer);
                $(".location-fail, .in-the-location").hide();
                if ( position.city == position.province ) {
                    $('#address-box em','').html( position.city + position.addr );
                } else {
                    $('#address-box em').html( position.province + position.city + position.addr );
                }

            }, function () {    //定位失败回调函数
                //alert("定位失败，请打开手机定位功能");
                $(".location-fail").show();
                $(".in-the-location").hide();
                //$('#address-box em').html("请选择当前位置");
                clearInterval(Position.timer);
            }, options)

        },

        /**
         * 打开腾讯地图精准定位
         */
        openPositionMap: function () {
            window.addEventListener('message', function(event) {
                var loc = event.data;
                if (loc && loc.module == 'locationPicker'){
                    Position.latitude = loc.latlng.lat;
                    Position.longitude = loc.latlng.lng;
                    $('#iframe-box').hide();
                    $('#address-box em').html(loc.poiname+' '+loc.poiaddress);
                }
            },false);
        },
        //getCommonMall: function () {
        //    E.ajax_get({
        //        url: '/ajax-shop/mall/lbsMall.ajax?operFlg=2',
        //        data: {
        //            longitude: Position.longitude,
        //            latitude: Position.latitude,
        //            wx_location: 1,
        //            config_id: Position.config_id
        //        },
        //    });
        //}
    };

    Position.timer = setInterval(function () {
        Position.getPosition();
    }, 2000);
