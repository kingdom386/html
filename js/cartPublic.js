/**
 * Created by Roger on 2017/5/25.
 * 主要功能：购物车
 *
 */

//公共函数监听购物车数量的变化
var cartAry = bry = jry = [];

//操作购物车对应的产品数
function changeCart(){
    $(".number-handle-container em,.de-price a,.search-list .search-buy-icon,.slide-list-container .search-buy-icon").live("click", function(e) {
        var inputVal = parseInt($(this).siblings("input").val()),
            id = $(this).parents('.generalCart').data('id'),
            maxVal = $(this).parents('.generalCart').data('mxcontain');
        if ($(this).hasClass("reduce-button")) {
            if (inputVal<=1&&inputVal>0) {
                inputVal -= 1;
                console.log(inputVal);
                $(this).siblings("input").val(inputVal);
                $('.cartItems[data-id="'+id+'"]').remove();
                if(cartAry.length>0){
                    for(var i = 0;i<cartAry.length;i++){
                        if(cartAry[i] == id){
                            cartAry.splice(i,1);
                            changeCartItemsId();
                            cartBadge();
                            $('.publicCart[data-id="' + id + '"] input').val(inputVal);
                        }
                    }
                }
            } else if(inputVal>1) {
                inputVal -= 1;
                publicAddCart($(this),inputVal);
            }
        } else if ($(this).hasClass("plus-button") && inputVal < maxVal) {
            inputVal += 1;
            publicAddCart($(this),inputVal);
        }else{
            if (maxVal == 0 || inputVal >= maxVal) {
                showTip('库存不足或超出库存上限！').showError();
                return false;
            }
        }
        e.stopPropagation();
        return false;
    })
}

//加入购物车
function publicAddCart(obj, inputVals) {
    //存储当前店铺的id
    setStorage('curSid', getStorage('wginfo').id);
    //全局变量 cartId
    var str='',
        contain = parseInt(obj.parents('.generalCart').data('mxcontain')),
        pid = obj.parents('.generalCart').data('id'),
        pname = obj.parents('.generalCart').data('name'),
        pnumb = parseInt(obj.siblings('input').val()),
        price = obj.parents('.publicCart').data('price');

    if(cartAry.indexOf(pid) == -1){
        //数量 count
        cartAry.push(pid);
        changeCartItemsId();
        var count = 0,
            str='<li class="cartItems generalCart" data-mxcontain='+contain+' data-id='+pid+'>'+
                '<h5 class="text-ellipsis-2">'+pname+'</h5>'+
                '<p class="item-price">'+price+'</p>'+
                '<div class="number-handle-container">'+
                '<em class="reduce-button"></em>'+
                '<input type="tel" readonly="readonly" disabled="disabled" value="'+inputVals+'" />'+
                '<em class="plus-button"></em>'+
                '</div></li>';
            $('#cart').append(str);
    }

    $('.cartItems[data-id="'+pid+'"] input').val(inputVals);
    $('.publicCart[data-id="'+pid+'"] input').val(inputVals);
    //存储购物车信息
    storageCartInfo();
    cartBadge();
}


//存储购物车信息
function storageCartInfo(){
    jry = [];
    $('.cartItems').each(function(i,t){
        var pid = $(t).data('id'),
            prod_name = $('h5',$(t)).html(),
            prod_mony = $('.item-price',$(t)).html(),
            prod_numb = $('input[type="tel"]',$(t)).val(),
            prod_maxStorage = $(t).data('mxcontain'),
            prod_mxmony =(parseInt($('input[type="tel"]',$(t)).val())*parseFloat( $('.item-price',$(t)).html().trim())).toFixed(2);

        var ls = {
           
            'p_id': pid,
            'prod_name': prod_name,
            'prod_mony': prod_mony,
            'prod_numb': prod_numb,
            'prod_maxStorage':prod_maxStorage,
            'prod_mxmony': prod_mxmony
        };
        jry.push(ls);
    });
    removeLocalStorage('cart_info');
    setStorage('cart_info', jry);

}

//修改购物车信息
function changeCartItemsId(){
    removeLocalStorage('cartId');
    setStorage('cartId',cartAry);
    storageCartInfo();
}

//购物车徽标
function cartBadge() {
    var sum = allPrice = 0;
    $('.cartItems').each(function(i,t){
        var temp = $('input[type="tel"]',$(t)).val()*$('.item-price',$(t)).html();
        allPrice += temp;
        sum+=parseInt($('input[type="tel"]',$(t)).val());
    });

    if(allPrice<=0){
      cartClear();
      setTimeout(function(){$(".over-bg, .cart-popover-content").removeClass("active");},500);
    }else{
        $('footer').addClass('active');
    }

    //购物车总价格
    $('#allPrice').html(allPrice.toFixed(2));
    //购物车徽标
    $('.badge').html(sum);

}

//清空购物车
$('.clearBtn').on('touchend',function(){
    var cartNum = parseFloat($('#allPrice').html());
    if(cartNum>0){
        confirmPanel("亲，真的要清空购物车么！", function () {
            cartClear();
            setTimeout(function(){$(".over-bg, .cart-popover-content").removeClass("active");},500);
        });
    }
});

function cartClear(){
    $('#allPrice').html(0.00);
    $('.badge').html(0);
    cartAry.length = 0;
    $('#cart').empty();
    $('.item-footer').removeClass('active');
    $('.publicCart input').val(0);
    removeLocalStorage('cart_info');
    removeLocalStorage('cartId');
}

//去结算
$('.get-btn').on('touchend', function () {
    $(".over-bg, .cart-popover-content").removeClass("active");
    //设置购物车返回起点aimAtcart 购物车可以返回到进入的起点页面
    setTimeout(function () { window.location.href = 'orderConfirm.html'; }, 280);
});


//获取购物车信息
function getCartLocalStorage(){
    cartInfo = getStorage('cart_info');
    if(cartInfo == null){
        cartClear();
    }else{
        //读取购物车所有数据
        $('#cart').empty();
        var str='';
        $(cartInfo).each(function(i,t){
            cartAry.push(t.p_id);
            $('.publicCart[data-id="'+t.p_id+'"] input').val(t.prod_numb);
            //添加数据到购物车节点上
            str+='<li class="cartItems generalCart" data-mxcontain='+ t.prod_maxStorage+' data-id='+ t.p_id+'>'+
                '<h5 class="text-ellipsis-2">'+ t.prod_name+'</h5>'+
                '<p class="item-price">'+ t.prod_mony+'</p>'+
                '<div class="number-handle-container">'+
                '<em class="reduce-button"></em>'+
                '<input type="tel" readonly="readonly" value='+ t.prod_numb+' />'+
                '<em class="plus-button"></em>'+
                '</div></li>';
        });

        $('#cart').append(str);
        $('footer').addClass('active');
        cartBadge();
    }
}
