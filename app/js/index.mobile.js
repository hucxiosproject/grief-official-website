var ua = navigator.userAgent.toLowerCase()
    ,isAndroid = ua.indexOf("android") > -1
    ,isIphone = ua.indexOf("iphone") > -1
    ,isIpad = ua.indexOf("ipad") > -1
    ,isWechat = ua.indexOf("micromessenger") > -1
    ,isIos = isIpad || isIphone;

if (isIos) {
  $("#iphone-guide").css("display", "block");
} else {
  $("#android-guide").css("display", "block");
}

$(document).ready(function() {
  initListener();
});

function initListener() {
  $('.download-button').on('click', function() {
    if (isAndroid) {
      if (isWechat) {
        $("#wechat-mask").css("display", "block");
      } else {
        window.open("/assets/jieyou.apk");
      }
    } else {
      window.location.href = "http://fir.im/jyios";
      // alert("I am going to download the iOs version now now now now");
    }
  });

  $("#wechat-mask").on('click', function() {
    $("#wechat-mask").css("display", "none");
  })
}
