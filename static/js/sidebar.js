

// $(".menu-btn").click(function () {
//   $(".sidebar").toggleClass("active");
// });


$(document).ready(function () {
    $(".menu-btn").click(function () {
      $(".sidebar").toggleClass("active");
      $("body").toggleClass("sidebar-active");  /* Toggle a classe no body */
    });
  
    $(".lista").click(function () {
      $(this).addClass("active").siblings().removeClass("active");
    });
  });
  