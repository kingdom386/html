function isShow($el){
  	var winH = $(window).height(),
        scrollH = $(window).scrollTop(),
        top = $el.offset().top;
  	if(top < scrollH + winH){
      return true;//在可视范围
    }else{
      return false;//不在可视范围
    }
  }
function checkShow(a){//检查元素是否在可视范围内
    a.find("img.wait-load").each(function(){//遍历每一个元素
        var $cur = $(this);
        if (isShow($cur)) {
        	$cur.attr('src', $cur.attr('data-src')).attr("data-src","").removeClass("wait-load").css("opacity","1");
        };
    });
}