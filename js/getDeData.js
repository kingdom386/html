// create by Roger
//锟斤拷取页锟芥传锟捷癸拷锟斤拷锟斤拷url锟斤拷锟皆达拷锟捷癸拷锟斤拷锟斤拷URl锟斤拷锟叫斤拷锟斤拷
//锟斤拷锟杰凤拷式
var API_KEY = "gVzKTvzJyRTCkdDQ4AcQaCgp5iIpskbq";
var reqtime = Date.parse(new Date()),
	myDeScroll = mySwiper = popoverWrapper=  cartInfo = '', ary = jry = [];

//锟斤拷取url锟叫的诧拷品ID
var p_id = ((window.location.href).split('?')[1]).split('=')[1];


window.addEventListener('pageshow',function(){
	if(isWeiXin()&&getStorage('cart_info') == null){
		$('#allPrice').html(0.00);
		$('.badge').html(0);
		$('#cart').empty();
		$('footer').removeClass('active');
		$('.publicCart input').val(0);
	}
});


//页锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟絡s css 锟斤拷锟斤拷锟斤拷锟?
window.onload = function () {
    getDeInfo(p_id);
    cartPopover();//锟斤拷锟斤车锟斤拷锟斤拷锟斤拷
    deLoad();
    changeCart();
};

//锟斤拷锟斤拷页锟斤拷锟斤拷锟阶刺?
$(document).on('ajaxComplete',function(e,xhr,op){
	getCartLocalStorage();
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

    //头锟斤拷锟斤拷锟斤拷锟斤拷色锟斤拷锟斤拷锟斤拷锟斤拷锟戒化
	myDeScroll.on('scroll', function () {
	    $(".head-mask").css("opacity", 2.6 * (Math.abs(this.y) / 1000));
	    2.6 * (Math.abs(this.y) / 1000) > 0.3 ? $(".head-container").find("h6").css("color", "#fff") : $(".head-container").find("h6").css("color", "#181818");
	});
}


//tabs锟叫伙拷
$('.de-tabs-switch a').on('touchend', function() {
	$(".tabs-btn").removeClass('active');
	$(this).addClass('active');
	//锟斤拷前锟斤拷tabs锟斤拷锟斤拷
	$('.tabs-items').removeClass("fadeIn");
	$('.tabs-items').eq($(this).index()).addClass('fadeIn');
	myDeScroll.refresh();
});

//锟秸诧拷
$('.de-collection').on('touchend', function() {
	//锟秸藏诧拷品锟斤拷ID
	var rewardId = $('#p_id').val();
	if (getCookies('username')) {
		setStorage('urlReference', window.location.href);
		window.location.href = './register.html';
	} else {
		//锟矫伙拷锟斤拷录状态
		if (!$(this).hasClass('active')) {
			//锟秸诧拷
			$(this).addClass('active');
			$('.de-collection p').html('取消');
		} else {
			//取锟斤拷锟秸诧拷
			$(this).removeClass('active');
			$('.de-collection p').html('收藏');
		}
		change(rewardId);
	}

});

//锟斤拷锟斤拷锟秸诧拷
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

//锟酵伙拷锟斤拷锟街伙拷锟斤拷隙锟?
var winWidth = winHeight = locX = locY = orgX =  0;

$('.fix-drag').bind('touchstart', function(ev) {
	locX = ev.changedTouches[0].pageX,
	locY = ev.changedTouches[0].pageY;
	orgX = locX;
	ev.preventDefault();
	$(this).removeClass('drag');
	winWidth = window.screen.availWidth, winHeight = window.screen.availHeight;
});

$('.fix-drag').bind('touchmove', function(e) {
	var dragBoxWidth = $(this).width() / 2,
		dragBoxHeight = $(this).height() / 2;
	locX = e.touches[0].pageX, locY = e.touches[0].pageY;
	//锟斤拷锟斤拷锟较讹拷锟斤拷围
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

$('.fix-drag').bind('touchend', function(g) {
	var tempX = Math.abs(g.changedTouches[0].pageX-orgX);
	if(tempX>2){
		if (tempX <= (winWidth / 2)) {
			$('.fix-drag').css({
				'left': '0'
			}).addClass('drag');
		} else {
			$('.fix-drag').css({
				'left': (winWidth - $(this).width()) + 'px'
			}).addClass('drag');
		}
	}else{
		window.location.href='tel:10086';
	}
});

//锟斤拷取锟斤拷品锟斤拷锟斤拷
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
			var str = '',
				idFlag = true;
			$(deData.data).each(function(i, t) {
				$('#p_id').val(t.m_prod.id);
				$('#p_name').html(t.m_prod.l_name);
				$('#p_danjia').html(t.m_prod.l_danjia);

				$('.de-price').attr({'data-Id':t.m_prod.id,'data-name':t.m_prod.l_name,'data-mxcontain':t.m_prod.l_storage,'data-price':t.m_prod.l_danjia});

				t.collect == 1 ? ($('.de-collection').addClass('active'),$('.de-collection p').html('取消')  ): ($('.de-collection').removeClass('active'),$('.de-collection p').html('收藏')  );

				//锟斤拷锟斤拷锟斤拷锟斤拷banner图片
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

				//锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟?
				$("#p_xq").html(t.m_prod.l_text);

				//锟斤拷硬锟斤拷锟斤拷锟斤拷锟?
				var cs_node = '<div class="table-row-group">';

				for (var i = 0; i < t.l_attr_value.length; i++) {
					var attrVal = '';
					if(t.l_attr_value[i].value != null){
						attrVal =  t.l_attr_value[i].value;
					}
					cs_node += '<div class="table-row">';
					cs_node += '<div class="table-cell">' + t.l_attr_value[i].attr_name +'</div>';
					cs_node += '<div class="table-cell">' + attrVal +'</div>';
					cs_node += '</div>';
				}
				cs_node += '</div>';
				//锟斤拷品锟斤拷锟斤拷锟斤拷锟斤拷
				$('#p_cs').html(cs_node);
			});

            //锟斤拷锟捷硷拷锟斤拷锟斤拷锟斤拷锟斤拷锟絪wiper
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
