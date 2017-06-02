//定时发送验证码
var countdown = 60;
function settime(obj) {
    if (countdown == 0) {
        obj.removeClass("disabled").text("重新获取");
        countdown = 60;
        return;
    } else {
        setTimeout(function () {
            countdown--;
            obj.addClass("disabled").text(countdown + "s后重新发送");
            settime(obj);
        }, 1000);

    }

}

//密码可见切换
$(".form-invisible-icon").on("touchend", function () {
    if ($(this).hasClass("visible")) {
        $(this).removeClass("visible").siblings("input").attr("type", "password");
    } else {
        $(this).addClass("visible").siblings("input").attr("type", "text")
    }
})

//登录切换
$(".login-tab-container").on("touchend", "a", function () {
    $(this).addClass("active").siblings("a").removeClass("active");
    $(".login-container").eq($(this).index()).show().siblings(".login-container").hide();
    $(this).siblings(".login-tab-border").css("left", $(this).width() * $(this).index());
    loginType($(this).index() + 1);
})

//登录弹出
$(".login-way-button").on("touchend", function () {
    $(".login-aside").show();
    return false;
})

//登录消失
$(".register-way-button, .close-button").on("touchend", function () {
    $(".login-aside").hide();
    return false;
})

