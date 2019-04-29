var uDate = [];

$(document).ready(function() {


  $('#transactions_all').DataTable({
    iDisplayLength: 100,
    order: [
      [0, "desc"]
    ],
    paging: true,
    searching: true
  });

  $('#transactions_withdraw').DataTable({
    iDisplayLength: 100,
    order: [
      [0, "desc"]
    ],
    paging: true,
    searching: true
  });

  $('#transactions_deposit').DataTable({
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


function SummaryByDay() {

  for (var i = 0; i < requests.length; i++) {
    uDate.push(DateTimeThaiOnlyDate(requests[i]['created_at']));
  }

  uDate = uDate.filter(onlyUnique);
  uDate.reverse();

  var sumTransaction = new Array();
  var mDate = [];
  for (var i = 0; i < uDate.length; i++) {
    var did = uDate[i];
    sumTransaction[i] = new Array();
    sumTransaction[i]['date'] = did;
    sumTransaction[i]['deposit_0'] = 0;
    sumTransaction[i]['deposit_1'] = 0;
    sumTransaction[i]['withdraw_0'] = 0;
    sumTransaction[i]['withdraw_1'] = 0;
    mDate[did] = i;
  }


  for (var i = 0; i < requests.length; i++) {
    var did = mDate[DateTimeThaiOnlyDate(requests[i]['created_at'])];

    if (requests[i]['type'] == 'ฝาก') {
      if (requests[i]['status'] == 'สำเร็จ') {
        sumTransaction[did]['deposit_1'] += requests[i]['value'];
      } else if (requests[i]['status'] == 'รอ') {
        sumTransaction[did]['deposit_0'] += requests[i]['value'];
      }
    } else if (requests[i]['type'] == 'ถอน') {
      if (requests[i]['status'] == 'สำเร็จ') {
        sumTransaction[did]['withdraw_1'] += requests[i]['value'];
      } else if (requests[i]['status'] == 'รอ') {
        sumTransaction[did]['withdraw_0'] += requests[i]['value'];
      }
    }

  }

  var render = "";


  for (var i = 0; i < sumTransaction.length; i++) {
    render += "<tr onclick=SummaryByDayDetail('" + i + "')>";
    render += "<td>" + (sumTransaction.length - i) + "</td>";
    render += "<td>" + sumTransaction[i]['date'] + "</td>";
    render += "<td>" + sumTransaction[i]['deposit_0'].toLocaleString() + "</td>";
    render += "<td>" + sumTransaction[i]['deposit_1'].toLocaleString() + "</td>";
    render += "<td>" + sumTransaction[i]['withdraw_0'].toLocaleString() + "</td>";
    render += "<td>" + sumTransaction[i]['withdraw_1'].toLocaleString() + "</td>";
    render += "<td>" + (sumTransaction[i]['deposit_1'] - sumTransaction[i]['withdraw_1']).toLocaleString() + "</td>";


    render += "</tr>";
  }

  $("#transactions_summary_tbody").html(render);
  console.log(sumTransaction);
}

function SummaryByDayDetail(did) {
  var render = "";
  render += '<table id="transactions_all" class="table table-sm table-striped table-responsive"><thead><tr>';
  render += '<th>ลำดับ</th><th>วันที่เวลา</th><th>สมาชิก</th><th>ประเภท</th><th>จำนวนเงิน</th>';
  render += '<th>ธนาคารที่โอน</th><th>เวลาที่โอน</th><th>ชื่อบัญชี</th><th>ธนาคาร</th><th>เลขที่บัญชี</th><th>สถานะ</th>';
  render += '<th>ไอดี</th></tr></thead><tbody>';

  for (var i = 0; i < requests.length; i++) {
    if (uDate[did] != DateTimeThaiOnlyDate(requests[i]['created_at'])) continue;

    render += "<tr>";
    render += "<td>" + (i + 1) + "</td>";
    render += "<td>" + DateTimeThai(requests[i]['created_at']) + "</td>";
    render += "<td>" + requests[i]['username'] + "</td>";
    render += "<td>" + requests[i]['type'] + "</td>";
    render += "<td>" + requests[i]['value'] + "</td>";
    render += "<td>" + requests[i]['deposit_to_bank_id'] + "</td>";
    render += "<td>" + requests[i]['deposit_timestamp'] + "</td>";
    render += "<td>" + requests[i]['name'] + "</td>";
    render += "<td>" + requests[i]['bank_id'] + "</td>";
    render += "<td>" + requests[i]['bank_name'] + "</td>";
    render += "<td>" + requests[i]['status'] + "</td>";
    var rid = requests[i]['_id']['$oid'].toString();
    render += '<td>' + rid.substr(rid.length - 6) + '</td>';

    render += "</tr>";
  }

  render += '</tbody></table>';


  $("#RequestSummaryContent").html(render);

  $("#transactionSummary").modal({
    backdrop: 'static',
    keyboard: true
  });
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
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
