// create by Roger
//加密方式
var API_KEY = "gVzKTvzJyRTCkdDQ4AcQaCgp5iIpskbq";
var reqtime = Date.parse(new Date()),addrFlag = cartFlag = false;
urlStr = window.location.href;

window.addEventListener('pageshow',function(){
	if(isWeiXin()&&getStorage('cart_info') == null){
		$('#hasOrder').hide();
		$('.default-page-container').show();
		$('#sumPrice').html('0.00');
		$('footer').removeClass('active');
	}
});

//页面的整体整天js css 加载完成
window.onload = function(){
	//请求默认的收货地址
	addAddr();
	load();
}

//监听页面加载状态
$(document).on('ajaxComplete',function(e,xhr,op){
	Myscroll.refresh();
});

//修改或是添加收货地址
function getAddr(obj){
//跳转到添加收货地址页面
	if (getCookies('username')) {
		//跳转到登录界面
		setStorage('urlReference',window.location.href);
		window.location.href = './register.html';
	} else {
		setStorage('urlReference',window.location.href);
		window.location.href = './addressList.html';
	}
}

function load() {
	Myscroll = new IScroll('#scroll-wrapper', {
		click: true,
		touchend: true,
		preventDefaultException: {
			tagName: /^(INPUT|A|SPAN|SELECT|TEXTAREA)$/
		},
		bindToWrapper: true,
		scrollbars: true,
		fadeScrollbars: true,
		shrinkScrollbars: 'clip'
	});

	//配送方式选择事件
	$(".order-select-handle select").on("change", function() {
		$(this).siblings("span").text($(this).children("option:checked").text());
	})

	//解析localStorage数据并添加到购物车清单列表中
	var orderList = getStorage('cart_info');
	$('.confirm-list').html("");

	if(orderList != null){
		cartFlag = true;
		$('#hasOrder').show();$('.default-page-container').hide();
		btnChange();
	}else{
		cartFlag = false;
		btnChange();
		$('#hasOrder').hide();$('.default-page-container').show();
	}

	var str = '',
		sumPrice = 0;
	$(orderList).each(function(i, t) {
		str += ' <li><p>' + t.prod_name + '</p>' + '<span>' + t.prod_numb + '</span><em>' + t.prod_mony + '</em>' + '</li>';
		sumPrice += parseFloat(t.prod_mxmony);
	});

	$('.confirm-list').append(str);
	$('#sumPrice').html(sumPrice.toFixed(2));
}

//修改提交订单按钮样式
function btnChange(){
	if(cartFlag&&addrFlag){
		$('footer').addClass('active');
	}else{
		$('footer').removeClass('active');
	}
}

//添加收货地址
function addAddr() {
	//检索是否登录
	if (!getCookies('username')) {
		//用户登录状态下 是否有默认的收货地址
		var changeLs = getStorage('changeInfo');
		if(changeLs != null){
			addrFlag = true;
			btnChange();
			$(changeLs).each(function(i,t){
				$('.address-select-container').html('').removeClass('address-select-empty');
				var str = '<h5 id="uAddr" data-aid = '+t.ad_id+'>'+t.nation+t.province+t.city+t.district+t.addr+'</h5>'+
					'<p><span id="uName">'+t.u_name+'</span><span id="uSj">'+t.u_sj+'</span></p>';
				$('.address-select-container').html(str);
			});
		}else{
			var u_id = getCookieVal('userid'),
				method = 'GetDefaultAddress',
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
				success: function(addrMsg) {
					if (addrMsg.data != null) {
						addrFlag = true;
						btnChange();
						$('.address-select-container').html('').removeClass('address-select-empty');
						var str = '<h5 id="uAddr" data-aid = '+addrMsg.data.id+'>'+addrMsg.data.nation+addrMsg.data.province+addrMsg.data.city+addrMsg.data.district+addrMsg.data.addr+'</h5>'+
							'<p><span id="uName">'+addrMsg.data.u_name+'</span><span id="uSj">'+addrMsg.data.u_sj+'</span></p>';
						$('.address-select-container').html(str);
					} else {
						addrFlag = false;
						btnChange();
						$('.address-select-container').html('请先添加收货地址').addClass('address-select-empty');
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {}
			});
		}
	}
}

//提交订单
$('.active #subOrder').live('touchend', function() {
	//检测用户 登录状态
	if (getCookies('username')) {
		    //跳转到登录界面
		    setStorage('urlReference', window.location.href);
			window.location.href = './register.html';
	} else {
		//用户登录的状态下
		var getPost = $('#getPost').val();
		var method = 'PutOrder';
		//1.送货上门 2.自提
		if(getPost == 1){
			var sh_name=$('#uName').html(),
				sh_addr = $('#uAddr').html(),
				sh_sj = $('#uSj').html(),
				ordNote = $('#ordNote').val(),
				ad_id = $('h5').data('aid'),
				param = {
					shopid: "3",
					device: "3",
					l_cart: JSON.parse(localStorage.getItem('cart_info')),
					u_id: getCookieVal('userid'),
					ad_id:ad_id,
					dist_type: getPost,

					sh_name: sh_name,
					sh_addr: sh_addr,
					sh_sj: sh_sj,
					ordNote:ordNote
				};
		}else{
			var sh_name=$('#ztName').val(),
				sh_addr = $('#ztAddr').html(),
				sh_sj = $('#ztSj').val(),
				ordNote = $('#ordNote').val(),
				ad_id = '',
				param = {
					shopid: "3",
					device: "3",
					l_cart: JSON.parse(localStorage.getItem('cart_info')),
					u_id: getCookieVal('userid'),
					ad_id:'',
					dist_type: getPost,

					sh_name: sh_name,
					sh_addr: sh_addr,
					sh_sj: sh_sj,
					ordNote:ordNote
				};
		}


			/*sh_name=$('#uName').html(),
			sh_addr = $('#uAddr').html(),
			sh_sj = $('#uSj').html(),
			ordNote = $('#ordNote').val(),
			ad_id = $('h5').data('aid'),
			param = {
				shopid: "3",
				device: "3",
				l_cart: JSON.parse(localStorage.getItem('cart_info')),
				u_id: getCookieVal('userid'),
				ad_id:ad_id,
				dist_type: getPost,

				sh_name: sh_name,
				sh_addr: sh_addr,
				sh_sj: sh_sj,
				ordNote:ordNote
			};*/
		if(sh_name == null||sh_addr == null||sh_sj == null){
			showTip('您的收货地址有误！').showError();
			return false;
		}

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
			success: function (subMsg) {
				 localStorage.removeItem('cart_info');
				 localStorage.removeItem('cartId');
				 if(subMsg.status){
					 //订单提交成功后跳转到支付页面 返回订单的相应的ID 和
					 //orderId 订单Id  total 需要支付金额
					 setCookie('orderId',subMsg.data.o_id);
					 setCookie('total',subMsg.data.total_pay);
					 window.location.href = 'Settlement.html';//结算页面
				 }
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert(textStatus);
			}
		});
	}
});
