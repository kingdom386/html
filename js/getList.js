//create by Roger 
//产品分类 后台请求  GetProdTypeList

var API_KEY = "gVzKTvzJyRTCkdDQ4AcQaCgp5iIpskbq";
var reqtime = Date.parse(new Date());
var cartInfo = '', ary = jry = [];

//获取产品类型
function getListType() {
    var method = "GetProdTypeList",
		param = {
		    shopid: getStorage('wginfo').id,
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
        success: function (data) {
            var str = '', boxStr = '';
            $(data.data).each(function (i, t) {
                boxStr += '<div class="item-box-' + i + '"><ul></ul><p class="bottom-loading">正在拼命加载中</p></div>'
                if (i == 0) {
                    //默认请求第一个分类下的产品
                    typeClass = ".item-box-" + i;
                    //获取当前类型下对应的产品
                    getListPage(t.id, t.name,1,typeClass);
                    //获取当前店铺的详情
                    getShopInfo(t.shopID);
                    //获取购物车信息
                    getCartLocalStorage();
                }
                str += ' <li data-typeClass= "item-box-'+i+'"  data-ci=' + t.id + ' data-name=' + t.name + ' class="' + (i == 0 ? "active" : "") + '"><a name="item-box-' + i + '" rel="' + i + '">' + t.name + '</a></li>'
            });
            $("#typeListContentPanel").append(boxStr);
            $('#typeList').append(str);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}
//获取商店信息
function getShopInfo(sid){
    var method = "GetShopInfo",
        param = {
            shopid: getStorage('wginfo').id,
            device: "3",
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
        success: function (shopinfodata) {
            var str='';
               str+= '<div class="swiper-slide">';
               str+= '<img class="img-responsive" src="'+shopinfodata.data.shop_logo+'" alt="" />';
               str+= '</div>';
            $('#shopImg').append(str);
            $("#shopName").html(shopinfodata.data.shop_name);
            $('.shop-info').html(shopinfodata.data.introduction);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}
//产品列表 列表 GetProdByType
function getListPage(ci, k, p,tc) {
    var method = "GetProdByType",
        keyword =k ,//关键词
        cateID= ci,//分类编号
        pageIndex= p,//页码 默认1
		param = {
		    shopid: getStorage('wginfo').id,
		    device: "3",
		    keyword:keyword,
            cateID:cateID,
            pageIndex:pageIndex
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
        success: function (data) {
            if (data.status == 1 && data.data.length == 0) {
                $('.bottom-loading').html('没有更多的产品可以加载了');
            }

            if(pageIndex == 1){
                $('ul',$(tc)).empty();
            }
            //添加节点数据
			var str ='';
            $(data.data).each(function (i, t) {
                //获取数据
                str += ' <li class="publicCart generalCart" data-mxcontain = '+ t.l_storage+' data-id ='+ t.id+' data-price='+ t.l_danjia+' data-name = "'+ t.l_name+'"><a href="detail.html?p_Id='+t.id+'" ><div class="item-image">'+
                            '<img data-src="' + t.l_pic1 + '" class="img-responsive wait-load" alt="" />' +
                            '</div> <div class="item-info-container">'+
                            '<h4 class="text-ellipsis-2">' + t.l_name + '</h4>' +
                             '<p class="text-ellipsis-2">' + t.l_name + '</p>' +
                              '<div class="item-price-container">'+
                                '<p class="item-price">' + t.l_danjia + '</p>' +
                                   '<div class="number-handle-container">'+
                                      '<em class="reduce-button"></em>'+
                                      '<input type="tel" readonly="readonly" disabled="disabled" value="0" />'+
                                      '<em class="plus-button fly-add"></em>'+
                                  ' </div> </div> </div></a> </li>';
            });
            $('ul',$(tc)).append(str);
            checkShow($(tc));
            $('.bottom-loading', tc).show();
            
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        },
        complete: function () {
            //判断如果是点我下单页面，执行飞入动画
            if ($(".fly-item").length > 0) {
                addItem();//加入购物车动画
            }
        }
    })
}

