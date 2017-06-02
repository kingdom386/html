
function addressPopover(){
var  jsonUrl =window.location.protocol+'//'+ window.location.host+'/html/js',
	 provinceInput = $("input[name='province']").val(),
	 cityInput = $("input[name='city']").val(),
	 areaInput = $("input[name='area']").val(),
	 provinceIndex, cityIndex, areaIndex = 0,
	 addressDataSource = [];
	console.log(jsonUrl);
	function initAddressDataSource()
	{
	    $.ajax({
	        type: 'get',
	        url: 'http://www.vsnbw.com/tempTest/',
	        dataType: 'jsonp',
			jsonp:"jsonP",
	        success: function (data)
	        {
				console.log(data);
	        },
	        error: function (err)
	        { 
	            console.log(err);
	        }
	    });




	}
	//获取省，upid="", grade = 1;
	//获取市，upid=省areaid, grade = 2;
	//获取区，upid=市areaid, grade = 3;
	function querySubArea(upid,grade){
	  	var list = [];
	  	$.each(addressDataSource,function(n,value) {
			if(grade == 1 && value.upid == "" && value.grade == 1){
				var area ={};
				area.upId = value.upid;
				area.areaId = value.areaid;
				area.areaName = value.areaname;
	            area.grade = value.grade;
				list.push(area);
			}else if(grade == 2 && upid == value.upid && value.grade == 2){
				var area ={};
				area.upId = value.upid;
				area.areaId = value.areaid;
				area.areaName = value.areaname;
	            area.grade = value.grade;
				list.push(area);
			}else if(grade == 3 && upid == value.upid  && value.grade == 3){
				var area ={};
				area.upId = value.upid;
				area.areaId = value.areaid;
				area.areaName = value.areaname;
	            area.grade = value.grade;
				list.push(area);
			} 
		})	
		return list; 
	}  
	 
	//初始化省市区
	function initSubAreaSelect(upid,grade,elementClass,selectedAreaId){
	  var list = querySubArea(upid,grade);
	  var n, i = 0;
	  $("."+elementClass).find(".swiper-wrapper").html("");
	  if(list.length > 0){
		  $.each(list,function(n,record) {
		      $("."+elementClass).find(".swiper-wrapper").append('<div areaid="'+record.areaId+'" upid="'+record.upId+'" class="swiper-slide">'+record.areaName+'</div>');
		      if(selectedAreaId == record.areaId){
		      	i = n;
		      }else{
		      	//i = 0;
		      	n++;
		      }
		  });
	  }else if(list.length == 0 && list.grade != 1){
	  	$("."+elementClass).find(".swiper-wrapper").append('<div areaid="" upid="" class="swiper-slide"></div>');
	  }
	  return i;
	}
	//点击按钮出现弹层
	function areaSelect(){
		$(".address-choose").on("touchend",function(){
			$(".address-popup").removeClass("hide").addClass("on");
			$(".overbg").show();
	        RemoveBodyTouch();
	        return false;
		})
		$(".address-popup").on("touchend","a",function(){
			$(".overbg").hide();
			$(".bottom-popup").removeClass("on").addClass("hide");
			if($(this).hasClass("sure")){
				var a = $(".province").find(".swiper-slide-active");
	            var b = $(".city").find(".swiper-slide-active");
	            var c = $(".area").find(".swiper-slide-active");
	            $(".address-choose").val(a.text() + "  " + b.text() + "  " + c.text());
	            $("input[name='province']").val(a.attr("areaid"));
	            $("input[name='city']").val(b.attr("areaid"));
	            $("input[name='area']").val(c.attr("areaid"));
			}
	        RecoveryBodyTouch();
	        return false;
		})
	}
	
	initAddressDataSource();
	var provinceList, cityList, areaList = 0;
	provinceList = initSubAreaSelect(0,1,"province",provinceInput);
	cityList = initSubAreaSelect(provinceInput,2,"city",cityInput);
	areaList = initSubAreaSelect(cityInput,3,"area",areaInput);
	areaSelect();
	//生成省swiper
	var mySwiperProvince = new Swiper(".province", {
	    direction: 'vertical',
	    touchRatio: 1.6,
	    centeredSlides: true,
	    slidesPerView: 'auto',
	    onInit: function (swiper)
	    {
	        swiper.slideTo(provinceList, 100, false);
	    },
	    onSlideChangeEnd: function (swiper){
	    	//省结束滑动触发市区初始化
			var upid = $(".province").find(".swiper-slide-active").attr("areaid");
			initSubAreaSelect(upid,2,"city",0);
			mySwiperCity.slideTo(0,100,false);
			mySwiperCity.update();
			var upid = $(".city").find(".swiper-slide-active").attr("areaid");
			initSubAreaSelect(upid,3,"area",0);
			mySwiperArea.slideTo(0,100,false);
			mySwiperArea.update();
	    	
	    }	    	
	});
	//生成市swiper
	var mySwiperCity = new Swiper(".city", {
	    direction: 'vertical',
	    touchRatio: 1.6,
	    centeredSlides: true,
	    slidesPerView: 'auto',
	    onInit: function (swiper)
	    {
	        swiper.slideTo(cityList, 100, false);
	    },
	    onSlideChangeEnd: function (swiper){
	    	//市结束滑动触发区初始化
			var upid = $(".city").find(".swiper-slide-active").attr("areaid");
			initSubAreaSelect(upid,3,"area",0);
			mySwiperArea.slideTo(0,100,false);
			mySwiperArea.update();
	    }	    	
	});
	
	//生成区swiper
	var mySwiperArea = new Swiper(".area", {
	    direction: 'vertical',
	    touchRatio: 1.6,
	    centeredSlides: true,
	    slidesPerView: 'auto',
	    onInit: function (swiper)
	    {
	        swiper.slideTo(areaList, 100, false);
	    },    	
	});	
}
