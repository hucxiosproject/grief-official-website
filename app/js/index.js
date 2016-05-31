$(document).ready(function() {
  console.log("HELLO");
  initListener();
});

function initListener() {
  $('.android').on('click', function() {
    window.open("/assets/jieyou.apk");
  });

  $('.iPhone').on('click', function() {
    window.location.href = "http://fir.im/jyios";
  });
}
