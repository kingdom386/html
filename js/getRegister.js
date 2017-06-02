// create by Roger
//提交订单
//加密方式
var API_KEY = "gVzKTvzJyRTCkdDQ4AcQaCgp5iIpskbq";
var reqtime = Date.parse(new Date());

//判别当前输入的手机号码是否合法
function IsMobile(p) {
	var reg = /^(13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7}$/;
	return reg.test(p) ? true : false;
}

function isPwd(w) {
	var reg = /^[a-zA-Z0-9!@#$|%^&*|'><?.,"]{6,18}$/; //密码规则，长度在6~18之间，只能包含字符、数字和下划线
	return reg.test(w) ? true : false;
}

function payPwd(pay){
	var reg = /^[0-9]{6}$/
	return reg.test(pay) ? true : false;
}
