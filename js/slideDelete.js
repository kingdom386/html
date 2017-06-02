//左滑删除
function  slideDelete(){
    // 设定每一行的宽度
    $(".slide-list-wrapper").width($(".slide-list-container").width() + $(".slide-delete-button").width());
    $(".slide-info-container").width($(".slide-list-container").width());
    var lines = $(".slide-list-wrapper");
    var len = lines.length;
    var lastX, lastXForMobile;
    var pressedObj;  // 当前左滑的对象
    var lastLeftObj; // 上一个左滑的对象
    // 用于记录按下的点
    var start;
    for (var i = 0; i < len; ++i) {
        lines[i].addEventListener('touchstart', function(e){
            lastXForMobile = e.changedTouches[0].pageX;
            pressedObj = this; // 记录被按下的对象
            // 记录开始按下时的点
            var touches = event.touches[0];
            start = {
                x: touches.pageX, // 横坐标
                y: touches.pageY  // 纵坐标
            };
        });
        lines[i].addEventListener('touchmove',function(e){
            // 计算划动过程中x和y的变化量
            var touches = event.touches[0];
            delta = {
                x: touches.pageX - start.x,
                y: touches.pageY - start.y
            };
            // 横向位移大于纵向位移，阻止纵向滚动
            if (Math.abs(delta.x) > Math.abs(delta.y)) {
                event.preventDefault();
            }
        });
        lines[i].addEventListener('touchend', function(e){
            if (lastLeftObj && pressedObj != lastLeftObj) { // 点击除当前左滑对象之外的任意其他位置
                $(lastLeftObj).css({marginLeft:"0"}); // 右滑
                lastLeftObj = null; // 清空上一个左滑的对象
            }
            var diffX = e.changedTouches[0].pageX - lastXForMobile;

            if (diffX < -90) {
                $(pressedObj).css({marginLeft:"-90px"}); // 左滑
                lastLeftObj && lastLeftObj != pressedObj &&
                $(lastLeftObj).css({marginLeft:"0"}); // 已经左滑状态的按钮右滑
                lastLeftObj = pressedObj; // 记录上一个左滑的对象
            } else if (diffX > 90) {
                if (pressedObj == lastLeftObj) {
                    $(pressedObj).css({marginLeft:"0"}); // 右滑
                    lastLeftObj = null; // 清空上一个左滑的对象
                }
            }
        });
    }

}


