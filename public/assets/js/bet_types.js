var bet_type = ["b31", "b32", "b33", "b34", "b21", "b22", "b23", "b11", "b12"];

$(document).ready(function() {

  $("#submit").click(function() {

    var bet_types_info = {};
    bet_types_info['product'] = $('#product').val();
    bet_types_info['bet_type'] = {};

    for (var i = 0; i < bet_type.length; i++) {
      var level = {};
      for (var j = 1; j <= 4; j++) {
        var l = 'level' + j;
        level[l] = {
          'minbet': $('#' + bet_type[i] + '_minbet_level' + j).val(),
          'maxbet': $('#' + bet_type[i] + '_maxbet_level' + j).val(),
          'discount': $('#' + bet_type[i] + '_discount_level' + j).val()
        };
      }
      bet_types_info['bet_type'][bet_type[i]] = {
        'name': $('#' + bet_type[i] + '_name').val(),
        'odd': $('#' + bet_type[i] + '_odd').val(),
        'maxrisk': $('#' + bet_type[i] + '_maxrisk').val(),
        'level': level
      };
      //a = JSON.stringify(bet_types_info);
      //console.log(a);
    }
    console.log(bet_types_info);
    bet_types_info = JSON.stringify([bet_types_info]);
    console.log(bet_types_info);

    var submit_type, url_path;
    if ($("#bet_type_id").val() == "new") {
      submit_type = "POST";
      url_path = "/bet_types";
    } else {
      submit_type = "PUT";
      url_path = "/bet_types/" + $("#bet_type_id").val();
      bet_types_info['_id'] = $("#bet_type_id").val();
    }

    $.ajax({
      type: submit_type,
      url: url_path,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
      },
      data: bet_types_info,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(msg) {
        swal({
          title: 'บันทึกข้อมูลสำเร็จ',
          html: msg.msg,
          type: 'success',
          showCancelButton: false,
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: 'ตกลง',
        });
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        $.toast({
          text: 'เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาตรวจสอบความถูกต้องและลองใหม่อีกครั้ง',
          position: 'bottom-right',
          icon: 'error',
          stack: true
        });
      }
    });

  });
});
