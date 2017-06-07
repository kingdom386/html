// create by Roger
//获取页面传递过来的url并对传递过来的URl进行解析
//加密方式
var API_KEY = "gVzKTvzJyRTCkdDQ4AcQaCgp5iIpskbq";
var reqtime = Date.parse(new Date()),
	myDeScroll = mySwiper = popoverWrapper=  cartInfo = '', ary = jry = [];

//获取url中的产品ID
var p_id = ((window.location.href).split('?')[1]).split('=')[1];

//页面的整体整天js css 加载完成
document.addEventListener('DOMContentLoaded',function(){
	getDeInfo(p_id);
	getCartLocalStorage();
	cartPopover();//购物车弹出层
	deLoad();
	changeCart();
},false);

//监听页面加载状态
$(document).on('ajaxComplete',function(e,xhr,op){
	layerState();
	myDeScroll.refresh();
	popoverWrapper.refresh();
});

function deLoad() {
	 	popoverWrapper = new IScroll(".cart-popover-wrapper", {
		preventDefaultException: {
			tagName: /^(INPUT|A|SPAN)$/
		},
		bindToWrapper: true,
		scrollbars: true,
		fadeScrollbars: true,
		click: true,
		tap: true
	});

	myDeScroll = new IScroll('#scroll-wrapper', {
		click: true,
		touchend: true,
		probeType: 3,
		bindToWrapper: true,
		scrollbars: true,
		fadeScrollbars: true,
		shrinkScrollbars: 'scale'
	});

	myDeScroll.on('scrollEnd', function () {
	    myDeScroll.refresh();
	});

    //头部背景颜色随滚动距离变化
	myDeScroll.on('scroll', function () {
	    $(".head-mask").css("opacity", 2.6 * (Math.abs(this.y) / 1000));
	    2.6 * (Math.abs(this.y) / 1000) > 0.3 ? $(".head-container").find("h6").css("color", "#fff") : $(".head-container").find("h6").css("color", "#181818");
	});
}


//tabs切换
$('.de-tabs-switch a').on('touchend', function() {
	$(".tabs-btn").removeClass('active');
	$(this).addClass('active');
	//当前的tabs索引
	$('.tabs-items').removeClass("fadeIn");
	$('.tabs-items').eq($(this).index()).addClass('fadeIn');
	myDeScroll.refresh();
});

//收藏
$('.de-collection').on('touchend', function() {
	//收藏产品的ID
	var rewardId = $('#p_id').val();
	if (getCookies('username')) {
		setStorage('urlReference', window.location.href);
		window.location.href = './register.html';
	} else {
		//用户登录状态
		if (!$(this).hasClass('active')) {
			//收藏
			$(this).addClass('active');
		} else {
			//取消收藏
			$(this).removeClass('active');
		}
		change(rewardId);
	}

});

//个人收藏
function change(pid) {
	var method = 'PutCollection',
		param = {
			shopid: "3",
			device: "3",
			u_id: getCookieVal('userid'),
			p_id: pid
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
		success: function(reData) {

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

		}
	});
}

//客户面板只有拖动
var winWidth = winHeight = locX = locY = 0;
$('.fix-drag').on('touchstart', function(ev) {
	locX = ev.changedTouches[0].pageX,
	locY = ev.changedTouches[0].pageY;
	ev.preventDefault();
	$(this).removeClass('drag');
	winWidth = window.screen.availWidth, winHeight = window.screen.availHeight;
});

$('.fix-drag').on('touchmove', function(e) {
	var dragBoxWidth = $(this).width() / 2,
		dragBoxHeight = $(this).height() / 2;
	locX = e.changedTouches[0].pageX, locY = e.changedTouches[0].pageY;
	//允许拖动范围
	if (locX >= dragBoxWidth && locX <= (winWidth - dragBoxWidth)) {
		locX < 0 ? (locX = 0) : (locX);
		locX > (winWidth - dragBoxWidth) ? (locX = (winWidth - dragBoxWidth)) : (locX);
		if (locY >= (dragBoxHeight + $('header').height()) && locY <= (winHeight - $('footer').height() - dragBoxHeight)) {
			locY < (dragBoxHeight + $('header').height()) ? (locY = (dragBoxHeight + $('header').height())) : (locY);
			locY > (winHeight - $('footer').height() - dragBoxHeight) ? (locY = (winHeight - $('footer').height() - dragBoxHeight)) : (locY);
			$('.fix-drag').css({
				'left': (locX - dragBoxWidth) + 'px',
				'top': (locY - dragBoxHeight) + 'px'
			});
		}
	}
});

$('.fix-drag').on('touchend', function(ff) {
	var tempX = ff.changedTouches[0].pageX-locX;
	if(tempX>20){
		if (tempX <= (winWidth / 2)) {
			$('.fix-drag').css({
				'left': '0'
			}).addClass('drag');
		} else {
			$('.fix-drag').css({
				'left': (winWidth - $(this).width()) + 'px'
			}).addClass('drag');
		}
	}
});

//获取产品详情
function getDeInfo(pid) {
	var method = 'GetProdDetail',
		param = {
			shopid: "3",
			device: "3",
			p_id: pid,
			u_id: getCookieVal('userid')
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
		success: function(deData) {
			console.log(deData);
			var str = '',
				idFlag = true;
			$(deData.data).each(function(i, t) {
				$('#p_id').val(t.m_prod.id);
				$('#p_name').html(t.m_prod.l_name);
				$('#p_danjia').html(t.m_prod.l_danjia);

				$('.de-price').attr({'data-Id':t.m_prod.id,'data-name':t.m_prod.l_name,'data-mxcontain':t.m_prod.l_storage,'data-price':t.m_prod.l_danjia});

				t.collect == 1 ? $('.de-collection').addClass('active') : $('.de-collection').removeClass('active')

				//添加详情的banner图片
				if (!t.m_prod.l_pic2 == "") {
					str += '<div class="swiper-slide"> <img src="' + t.m_prod.l_pic2 + '" class="my-img-responsive" alt=""></div>'
				}

				if (!t.m_prod.l_pic3 == "") {
					str += '<div class="swiper-slide"> <img src="' + t.m_prod.l_pic3 + '" class="my-img-responsive" alt=""></div>'
				}
				if (!t.m_prod.l_pic4 == "") {
					str += '<div class="swiper-slide"> <img src="' + t.m_prod.l_pic4 + '" class="my-img-responsive" alt=""></div>'
				}

				$("#p_main_pic").html(str);

				//添加详情数据
				$("#p_xq").html(t.m_prod.l_text);

				//添加参数数据
				var cs_node = '<div class="table-row-group">';

				for (var i = 0; i < t.l_attr_value.length; i++) {
					cs_node += '<div class="table-row">' ;
					cs_node += '<div class="table-cell">' + (t.l_attr_value[i].attr_name ==null)?'暂无参数':t.l_attr_value[i].attr_name ;
					cs_node += '</div><div class="table-cell">' + (t.l_attr_value[i].value == null)?'暂无参数':t.l_attr_value[i].value ;
					cs_node += '</div></div>';
				}
				cs_node += '</div>';
				//商品参数详情
				$('#p_cs').html(cs_node);
			});

            //数据加载完后生成swiper
			mySwiper = new Swiper('.swiper-container', {
			    autoplay: 5000,
			    loop: true,
			    pagination: '.swiper-pagination'
			});
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {

		}
	});
}
