var uDate = [];

$(document).ready(function() {


  $('#users_all').DataTable({
    iDisplayLength: 100,
    order: [
      [0, "desc"]
    ],
    paging: true,
    searching: true
  });



  UpdateDateTimeFormat();
  SummaryByDay();
  $(document).on("click", ".paginate_button ", function() {
    UpdateDateTimeFormat();
  });

  $(document).keyup(function() {
    UpdateDateTimeFormat();
  });

  /** Full Screen Modal **/
  function cssn($e, props) {
    var sum = 0;
    props.forEach(function(p) {
      sum += parseInt($e.css(p).match(/\d+/)[0]);
    });
    return sum;
  }

  function g($e) {
    return {
      width: cssn($e, ['margin-left', 'margin-right', 'padding-left', 'padding-right', 'border-left-width', 'border-right-width']),
      height: cssn($e, ['margin-top', 'margin-bottom', 'padding-top', 'padding-bottom', 'border-top-width', 'border-bottom-width'])
    };
  }

  function calc($e) {
    var wh = $(window).height();
    var ww = $(window).width();
    var $d = $e.find('.modal-dialog');
    $d.css('width', 'initial');
    $d.css('height', 'initial');
    $d.css('max-width', 'initial');
    $d.css('margin', '5px');
    var d = g($d);
    var $h = $e.find('.modal-header');
    var $f = $e.find('.modal-footer');
    var $b = $e.find('.modal-body');
    $b.css('overflow-y', 'scroll');
    var bh = wh - $h.outerHeight() - $f.outerHeight() - ($b.outerHeight() - $b.height()) - d.height;
    $b.height(bh);
  }
  $('.modal-fullscreen').on('show.bs.modal', function(e) {
    var $e = $(e.currentTarget).css('visibility', 'hidden');
  });
  $('.modal-fullscreen').on('shown.bs.modal', function(e) {
    calc($(e.currentTarget));
    var $e = $(e.currentTarget).css('visibility', 'visible');
  });
  $(window).resize(function() {
    calc($('.modal.modal-fullscreen.in'));
  });

  /** end fullscreen **/




});


function resetpwd(uid) {
  
  $.ajax({
    type: "GET",
    url: "/admin/resetpwd?u=" + uid,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(msg) {

      swal({
        title: 'รีเซ็ทรหัสผ่านเรียบร้อยแล้ว',
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


}

function UpdateDateTimeFormat() {
  for (var i = 0; i < requests.length; i++) {
    var r_created = requests[i]['created_at'];
    $('#request_' + i + '_created_at').text(DateTimeThai(r_created));
  }
  for (var i = 0; i < deposit.length; i++) {
    var d_created = deposit[i]['created_at'];
    $('#deposit_' + i + '_created_at').text(DateTimeThai(d_created));
  }

  for (var i = 0; i < withdraw.length; i++) {
    var w_created = withdraw[i]['created_at'];
    $('#withdraw_' + i + '_created_at').text(DateTimeThai(w_created));
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

function DateTimeThaiOnlyDate($strDateTime) {
  $d = new Date($strDateTime);
  $strMonthCut = Array("ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.");
  $thDate = $d.getDate() + " " + $strMonthCut[$d.getMonth()] + " " + ($d.getFullYear() + 543);
  return $thDate;
}
