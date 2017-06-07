// create by Roger
//��ȡҳ�洫�ݹ�����url���Դ��ݹ�����URl���н���
//���ܷ�ʽ
var API_KEY = "gVzKTvzJyRTCkdDQ4AcQaCgp5iIpskbq";
var reqtime = Date.parse(new Date()),
	myDeScroll = mySwiper = popoverWrapper=  cartInfo = '', ary = jry = [];

//��ȡurl�еĲ�ƷID
var p_id = ((window.location.href).split('?')[1]).split('=')[1];

//ҳ�����������js css �������
document.addEventListener('DOMContentLoaded',function(){
	getDeInfo(p_id);
	getCartLocalStorage();
	cartPopover();//���ﳵ������
	deLoad();
	changeCart();
},false);

//����ҳ�����״̬
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

    //ͷ��������ɫ���������仯
	myDeScroll.on('scroll', function () {
	    $(".head-mask").css("opacity", 2.6 * (Math.abs(this.y) / 1000));
	    2.6 * (Math.abs(this.y) / 1000) > 0.3 ? $(".head-container").find("h6").css("color", "#fff") : $(".head-container").find("h6").css("color", "#181818");
	});
}


//tabs�л�
$('.de-tabs-switch a').on('touchend', function() {
	$(".tabs-btn").removeClass('active');
	$(this).addClass('active');
	//��ǰ��tabs����
	$('.tabs-items').removeClass("fadeIn");
	$('.tabs-items').eq($(this).index()).addClass('fadeIn');
	myDeScroll.refresh();
});

//�ղ�
$('.de-collection').on('touchend', function() {
	//�ղز�Ʒ��ID
	var rewardId = $('#p_id').val();
	if (getCookies('username')) {
		setStorage('urlReference', window.location.href);
		window.location.href = './register.html';
	} else {
		//�û���¼״̬
		if (!$(this).hasClass('active')) {
			//�ղ�
			$(this).addClass('active');
		} else {
			//ȡ���ղ�
			$(this).removeClass('active');
		}
		change(rewardId);
	}

});

//�����ղ�
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

//�ͻ����ֻ���϶�
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
	//�����϶���Χ
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

//��ȡ��Ʒ����
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

				//��������bannerͼƬ
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

				//�����������
				$("#p_xq").html(t.m_prod.l_text);

				//��Ӳ�������
				var cs_node = '<div class="table-row-group">';

				for (var i = 0; i < t.l_attr_value.length; i++) {
					cs_node += '<div class="table-row">' ;
					cs_node += '<div class="table-cell">' + (t.l_attr_value[i].attr_name ==null)?'���޲���':t.l_attr_value[i].attr_name ;
					cs_node += '</div><div class="table-cell">' + (t.l_attr_value[i].value == null)?'���޲���':t.l_attr_value[i].value ;
					cs_node += '</div></div>';
				}
				cs_node += '</div>';
				//��Ʒ��������
				$('#p_cs').html(cs_node);
			});

            //���ݼ����������swiper
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
