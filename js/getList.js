//create by Roger 
//��Ʒ���� ��̨����  GetProdTypeList

var API_KEY = "gVzKTvzJyRTCkdDQ4AcQaCgp5iIpskbq";
var reqtime = Date.parse(new Date());
var cartInfo = '', ary = jry = [];

//��ȡ��Ʒ����
function getListType() {
    var method = "GetProdTypeList",
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
        success: function (data) {
            var str = '', boxStr = '';
            $(data.data).each(function (i, t) {
                boxStr += '<div class="item-box-'+i+'"><ul></ul></div>'
                if (i == 0) {
                    //Ĭ�������һ�������µĲ�Ʒ
                    typeClass = ".item-box-" + i;
                    //��ȡ��ǰ�����¶�Ӧ�Ĳ�Ʒ
                    getListPage(t.id, t.name,1,typeClass);
                    //��ȡ��ǰ���̵�����
                    getShopInfo(t.shopID);
                    //��ȡ���ﳵ��Ϣ
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
//��ȡ�̵���Ϣ
function getShopInfo(sid){
    var method = "GetShopInfo",
        param = {
            shopid: "3",
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
//��Ʒ�б� �б� GetProdByType
function getListPage(ci, k, p,tc) {
    var method = "GetProdByType",
        keyword =k ,//�ؼ���
        cateID= ci,//������
        pageIndex= p,//ҳ�� Ĭ��1
		param = {
		    shopid: "3",
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

            //��ӽڵ�����
			var str ='';
            $(data.data).each(function (i, t) {
                //��ȡ����
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
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        },
        complete: function () {
            //�ж�����ǵ����µ�ҳ�棬ִ�з��붯��
            if ($(".fly-item").length > 0) {
                addItem();//���빺�ﳵ����
            }
        }
    })
}

