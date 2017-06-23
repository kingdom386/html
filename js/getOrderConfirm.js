// create by Roger
//加密方式
var API_KEY = "gVzKTvzJyRTCkdDQ4AcQaCgp5iIpskbq";
var reqtime = Date.parse(new Date()),addrFlag = cartFlag = false;
urlStr = window.location.href;

//解决微信端 默认返回读取缓存数据问题
window.addEventListener('pageshow',function(){
	if(isWeiXin()&&getStorage('cart_info') == null){
		$('#hasOrder').hide();
		$('.default-page-container').show();
		$('#sumPrice').html('0.00');
		$('footer').removeClass('active');
	}
});

//监听页面加载状态
$(document).on('ajaxComplete',function(e,xhr,op){
	Myscroll.refresh();
});

//页面的整体整天js css 加载完成
window.onload = function (){
    addStack();
	load();
	//根据配送方式确定请求的送货方式
	if(getStorage('wginfo').range!= 1){
		//控制配送方式
		$('#getPost').empty();
		var str = '<option value="2" >自提</option>';
		$('#getPost').html(str);
		$('#postMethod').html('自提');
		zt();
	}else{
		//当前位置在配送范围之内
		addAddr();
	}

	$('#getPost').live('change',function(){
		var optionValue = $(this).children("option:checked").val();
		switch (optionValue) {
			case "1":
				//送货上门
				$(".address-select-container").show().siblings(".address-pick-up-container").hide();
				break;
			case "2":
				zt();
				break;
			default:
				break;
		}
	});
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

	setTimeout(function () { Myscroll.refresh(); }, 300);

	Myscroll.on('scrollEnd', function () {
		Myscroll.refresh();
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

//获取用户自提商店
function zt(){
	//用户登录的状态下
	var method = 'GetShopAddr',
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
		success: function (locMsg) {
			if (locMsg.data != null) {
				addrFlag = true;
				btnChange();
				$('.address-pick-up').html('');
				var str ='';
				str+='<p><em>自提点</em>';
				str+='<span id="zt">'+locMsg.data.cityName+locMsg.data.districtName+'</span></p>';
				str+='<p id="ztAddr">'+locMsg.data.addr+'</p>';
				$('.address-pick-up').html(str);
			} else {
				addrFlag = false;
				btnChange();
				$('.address-pick-up').html('获取当前地点数据失败！');
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

		}
	});
	$(".address-select-container").hide().siblings(".address-pick-up-container").show();
}

//选择收货地址
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
			//判断给予的地址选择配送类型
			$(changeLs).each(function(i,t){
				$('#getPost').empty();
				var str = '<option value="1" >送货上门</option><option value="2" >自提</option>';
				$('#getPost').html(str);

				if(t.range == 1){
					$('.address-select-container').html('').removeClass('address-select-empty');
					var str = '<h5 id="uAddr" data-aid = '+t.ad_id+'>'+t.nation+t.province+t.city+t.district+t.addr+'</h5>'+
						'<p><span id="uName">'+t.u_name+'</span><span id="uSj">'+t.u_sj+'</span></p>';
					$('.address-select-container').html(str);
					$('.address-pick-up-container').hide();
					//控制配送方式
					$('#postMethod').html('送货上门');
				}

				if(t.range == 0){
					$(".address-select-container").hide();
					$('.address-pick-up').html('');
					var str ='';
					str+='<p><em>自提点</em>';
					str+='<span id="zt">'+ t.district+'</span></p>';
					str+='<p id="ztAddr">'+ t.addr+'</p>';
					$('.address-pick-up').html(str);
					$('.address-pick-up-container').show();
					//控制配送方式
					$('#getPost').empty();
					var str = '<option value="1" >送货上门</option><option value="2" >自提</option>';
					$('#getPost').html(str);
					$('#postMethod').html('自提');
					zt();
				}
			});
		}else{
			var u_id = getStorage('userid'),
				method = 'GetDefaultAddress',
				param = {
					shopid: getStorage('wginfo').id,
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
$('.active #subOrder').live('touchend', function () {
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
		if (getPost == 1) {
			//送货上门
			var sh_name=$('#uName').html(),
				sh_addr = $('#uAddr').html(),
				sh_sj = $('#uSj').html(),
				ordNote = $('#ordNote').val(),
				ad_id = $('h5').data('aid'),
				param = {
					shopid: getStorage('wginfo').id,
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
		}else if(getPost == 2){
			//自提
			var sh_name=$('#ztName').val(),
				sh_addr = $('#ztAddr').html(),
				sh_sj = $('#ztSj').val(),
				ordNote = $('#ordNote').val(),
				ad_id = '',
				param = {
					shopid: getStorage('wginfo').id,
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
		}else{
			//do nothing just relax @_@
		}

		if(sh_name == ''||sh_addr == ''||sh_sj == ''){
			showTip('请填写收货信息！').showError();
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
				 if(subMsg.status == 1){
					 //订单提交成功后跳转到支付页面 返回订单的相应的ID 和
				     localStorage.removeItem('cart_info');
				     localStorage.removeItem('cartId');
					 setCookie('openId', subMsg.data.openId);
					 setStorage('orderId', subMsg.data.o_id);
					 setStorage('total', subMsg.data.total_pay);
					 window.location.href = 'Settlement.html';//结算页面 getOpentId.html
				 }
				if(subMsg.status == 0){
					showTip(subMsg.msg).showError();
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				 
			}
		});
	}
});
