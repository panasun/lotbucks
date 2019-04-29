var bet_type_name = {
  "b31": "3ตัวบน",
  "b32": "3ตัวโต๊ด",
  "b33": "3ตัวล่าง",
  "b34": "3ตัวหน้า",
  "b21": "2ตัวบน",
  "b22": "2ตัวล่าง",
  "b23": "2ตัวโต๊ด",
  "b11": "วิ่งบน",
  "b12": "วิ่งล่าง"
};

$(document).ready(function() {
  //localStorage.clear();
  /** Load Bet List **/

  $('.datepicker').datepicker({
    format: 'yyyy-mm-dd',
  });
  $('.clockpicker').clockpicker({
    autoclose: true,
    'default': 'now'
  });

  /** Submit Bet Data **/
  $("#submit_bet").click(function() {
    if (!document.getElementById('accept-confirm').checked) {
      $.toast({
        text: 'กรุณาเช็คเครื่องหมายถูกหน้าช่องตรวจสอบรายการ',
        position: 'bottom-right',
        icon: 'warning',
        stack: true
      });
      return;
    }


    var limit = [];
    for (var i = 1; i <= 40; i++) {
      if ($("#limit_number_" + i).val() == "") continue;
      limit.push({
        "bet_type": $("#limit_bet_type_" + i).val(),
        "number": $("#limit_number_" + i).val(),
        "odd": $("#limit_odd_" + i).val()
      });
    }

    var result_number = {};

    if ($("#round_id").val() != "new" && $("#product").val() == 'หวยไทย') {
      result_number = {
        "6digits": $("#result_number_6digits").val(),
        "2digits": $("#result_number_2digits").val(),
        "3digits_1": $("#result_number_3digits_1").val(),
        "3digits_2": $("#result_number_3digits_2").val(),
        "3digits_3": $("#result_number_3digits_3").val(),
        "3digits_4": $("#result_number_3digits_4").val(),
        "3digits_5": $("#result_number_3digits_5").val(),
        "3digits_6": $("#result_number_3digits_6").val(),
      }
    } else if ($("#round_id").val() != "new" && $("#product").val() == 'หวยลาว') {
      result_number = {
        "4digits": $("#result_number_4digits").val(),
        "3digits": $("#result_number_3digits").val(),
        "2digits": $("#result_number_2digits").val(),
      }
    }

    console.log(result_number);

    var round_info = [{
      'product': $("#product").val(),
      'status': $("#status").val(),
      'result_date': $("#result_date").val(),
      'result_time': $("#result_time").val(),
      "limit": limit,
      "result_number": result_number

    }];

    var submit_type, url_path;
    if ($("#round_id").val() == "new") {
      submit_type = "POST";
      url_path = "/rounds";
    } else {
      submit_type = "PUT";
      url_path = "/rounds/" + $("#round_id").val();
      round_info['_id'] = $("#round_id").val();
    }

    console.log(round_info);

    round_info = JSON.stringify(round_info);
    console.log(round_info);


    $.ajax({
      type: submit_type,
      url: url_path,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
      },
      data: round_info,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(msg) {
        swal({
          title: $("#product").val() + ' ประจำงวด ' + $("#result_date").val(),
          html: msg.msg,
          type: 'success',
          showCancelButton: false,
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: 'ตกลง',
        }).then( function() {
         if( $("#round_id").val() != "new" ) {
           location.reload();
         } else {
           window.location.href = '/rounds';
         }
        });
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        $.toast({
          text: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล ประเภทหวยที่คุณบันทึก อาจมีรอบที่เปิดอยู่แล้ว',
          position: 'bottom-right',
          icon: 'error',
          stack: true
        });
        console.log(XMLHttpRequest);
      }
    });


  });

  /** End Submit Bet Data **/

  /** Calculate Result **/
  $("#calculate_result").click(function() {
    if (!document.getElementById('accept-confirm').checked) {
      $.toast({
        text: 'กรุณาเช็คเครื่องหมายถูกหน้าช่องตรวจสอบรายการ',
        position: 'bottom-right',
        icon: 'warning',
        stack: true
      });
      return;
    }

    var round_info = [{
      'round_id': $("#round_id").val()
    }];
    round_info = JSON.stringify(round_info);
    console.log("round_info" + round_info);

    $.ajax({
      type: 'POST',
      url: '/rounds/calculate',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
      },
      data: round_info,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(msg) {
        var res = JSON.parse(msg.msg)
        console.log(res);
        render = "<table width='100%' class='table-bordered table-sm'><thead><th class='text-center'>ประเภท</th><th class='text-center'>เลข</th></thead><tbody>";

        for (var k in res[0]) {
          if (res[0].hasOwnProperty(k)) {
            render = render + "<tr class='text-muted small text-right'><td>" + bet_type_name[k] + "<td>" + res[0][k].toString() + "</td></tr>";
          }
        }

        render = render + "</tbody></table>";

        swal({
          title: 'ผลรางวัล',
          html: render,
          type: 'success',
          showCancelButton: false,
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: 'ตกลง'
        }).then( function() {
          location.reload();

        });
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        $.toast({
          text: 'เกิดข้อผิดพลาดในการคำนวน คุณอาจไม่ได้กรอกเลขรางวัลที่ออก',
          position: 'bottom-right',
          icon: 'error',
          stack: true
        });
        console.log(XMLHttpRequest);
      }
    });

  });
  /** End Calculate Result **/

  /** Calculate Bet **/
  $("#calculate_bet").click(function() {
    if (!document.getElementById('accept-confirm').checked) {
      $.toast({
        text: 'กรุณาเช็คเครื่องหมายถูกหน้าช่องตรวจสอบรายการ',
        position: 'bottom-right',
        icon: 'warning',
        stack: true
      });
      return;
    }

    var round_info = [{
      'round_id': $("#round_id").val()
    }];
    round_info = JSON.stringify(round_info);
    console.log("round_info" + round_info);

    $.ajax({
      type: 'POST',
      url: '/rounds/process1688',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
      },
      data: round_info,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(msg) {
        swal({
          title: 'ประมวลผลรายการแทงสำเร็จ',
          html: msg.msg,
          type: 'success',
          showCancelButton: false,
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: 'ตกลง',
        }).then( function() {
          location.reload();
        });
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        $.toast({
          text: 'เกิดข้อผิดพลาดในการประมวลผล',
          position: 'bottom-right',
          icon: 'error',
          stack: true
        });
        console.log(XMLHttpRequest);
      }
    });

  });
  /** End Calculate Bet **/




});
