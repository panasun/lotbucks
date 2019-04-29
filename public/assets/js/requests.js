$(document).ready(function() {
  $('#request_transaction').DataTable({
    iDisplayLength: 25,
    order: [
      [0, "desc"]
    ],
    paging: true,
    searching: true
  });

  UpdateDateTimeFormat();

  $(document).on("click", ".paginate_button ", function() {
    UpdateDateTimeFormat();
  });


  $(document).keyup(function() {
    UpdateDateTimeFormat();
  });

  /** Submit Bet Data **/
  $("#submit_deposit").click(function() {

    if ($("#deposit_to_bank_id").val() == "") {
      $.toast({
        text: 'กรุณาเลือกบัญชีธนาคารที่โอนเข้า',
        position: 'bottom-right',
        icon: 'warning',
        stack: true
      });
      return;
    }


    if (!document.getElementById('accept-confirm-deposit').checked) {
      $.toast({
        text: 'กรุณาเช็คเครื่องหมายถูกหน้าช่องตรวจสอบรายการ',
        position: 'bottom-right',
        icon: 'warning',
        stack: true
      });
      return;
    }

    if( parseFloat($("#deposit_value").val()) <= 0 || $("#deposit_value").val() == "") {
      $.toast({
        text: 'ยอดฝากไม่ถูกต้อง',
        position: 'bottom-right',
        icon: 'warning',
        stack: true
      });
      return;
    }


    var request_info = [{
      'type': 'ฝาก',
      'deposit_to_bank_id': $("#deposit_to_bank_id").val(),
      'value': $("#deposit_value").val(),
      'deposit_timestamp': $("#deposit_timestamp").val(),
      "note": $("#deposit_note").val()
    }];


    console.log(request_info);

    request_info = JSON.stringify(request_info);
    console.log(request_info);


    $.ajax({
      type: "POST",
      url: "/requests",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
      },
      data: request_info,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(msg) {
        swal({
          title: "แจ้งฝาก",
          html: "ได้รับรายการแจ้งฝากยอด: " + $("#deposit_value").val() + " บาทเรียบร้อยแล้ว",
          type: 'success',
          showCancelButton: false,
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: 'ตกลง',
        }).then(function(isConfirm) {
          $("#deposit_value").val("");
          $("#deposit_timestamp").val("");
          $("#deposit_note").val("");
          location.reload();
        });
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        $.toast({
          text: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
          position: 'bottom-right',
          icon: 'error',
          stack: true
        });
        console.log(XMLHttpRequest);
      }
    });

  });


  /** Submit Bet Data **/
  $("#submit_withdraw").click(function() {

    if (!document.getElementById('accept-confirm-withdraw').checked) {
      $.toast({
        text: 'กรุณาเช็คเครื่องหมายถูกหน้าช่องตรวจสอบรายการ',
        position: 'bottom-right',
        icon: 'warning',
        stack: true
      });
      return;
    }
    console.log("withdraw: " + parseFloat($("#withdraw_value").val()) + " " + $("#user_money_withdraw").val())
    if( parseFloat($("#withdraw_value").val()) > parseFloat($("#user_money_withdraw").val())) {
      $.toast({
        text: 'ยอดถอนเกินยอดเงินในบัญชี',
        position: 'bottom-right',
        icon: 'warning',
        stack: true
      });
      return;
    }

    if( parseFloat($("#withdraw_value").val()) < 500 ) {
      $.toast({
        text: 'ยอดถอนขั้นต่ำ 500 บาท กรุณาระบุยอดถอนให้ถูกต้อง',
        position: 'bottom-right',
        icon: 'warning',
        stack: true
      });
      return;
    }

    var request_info = [{
      'type': 'ถอน',
      'value': $("#withdraw_value").val()
    }];


    console.log(request_info);

    request_info = JSON.stringify(request_info);
    console.log(request_info);


    $.ajax({
      type: "POST",
      url: "/requests",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
      },
      data: request_info,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(msg) {
        swal({
          title: "แจ้งถอน",
          html: "ได้รับรายการแจ้งถอนยอด: " + $("#withdraw_value").val() + " บาทเรียบร้อยแล้ว",
          type: 'success',
          showCancelButton: false,
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: 'ตกลง',
        }).then(function(isConfirm) {
          location.reload();
        });
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        $.toast({
          text: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
          position: 'bottom-right',
          icon: 'error',
          stack: true
        });
        console.log(XMLHttpRequest);
      }
    });

  });



});


function UpdateDateTimeFormat() {
  for (var i = 0; i < requests.length; i++) {
    var r_created = requests[i]['created_at'];
    $('#request_' + i + '_created_at').text(DateTimeThai(r_created));
  }
}

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

function DateThai($strDate) {
  $d = $strDate.split("-");
  $strMonthCut = Array("", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.");
  $thDate = $d[2] + " " + $strMonthCut[Number($d[1])] + " " + (parseInt($d[0]) + 543);
  return $thDate;
}

function DateTimeThai($strDateTime) {
  $d = new Date($strDateTime);
  $strMonthCut = Array("ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.");
  $thDate = $d.getDate() + " " + $strMonthCut[$d.getMonth()] + " " + ($d.getFullYear() + 543) + " " + zeroPad($d.getHours(), 2) + ":" + zeroPad($d.getMinutes(), 2);
  return $thDate;
}
