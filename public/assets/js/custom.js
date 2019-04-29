$(document).ready(function() {
  /** Recieve notification **/
  setInterval(function() {
    $.ajax({
      type: "GET",
      url: "/admin/notification",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(msg) {
        var res = JSON.parse(msg.msg);
        res = res[0];
        $("#wait_deposit").html(res['wait_deposit']);
        $("#wait_withdraw").html(res['wait_withdraw']);
        console.log(res);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {

      }
    });
  }, 3000);
  /** End recieve notification **/


});



function hideFooterLogin() {
  $("#footer_login").fadeOut("fast");
}
