var sum3digits = [];
var sum2digits = [];
var sum1digits = [];


$(document).ready(function() {

  $('#transaction_table').DataTable({
    iDisplayLength: 100,
    order: [
      [0, "desc"]
    ],
    "autoWidth": false,
    paging: true,
    searching: true
  });


  $('#3digits_table').DataTable({
    iDisplayLength: 100,
    paging: true,
    searching: true
  });

  $('#2digits_table').DataTable({
    iDisplayLength: 100,
    paging: true,
    searching: true
  });

  $('#1digits_table').DataTable({
    iDisplayLength: 10,
    paging: true,
    searching: true
  });

  UpdateDateTimeFormat();
  SumBetNumber();
  renderSumTable();

  $(document).on("click", ".paginate_button ", function() {
    UpdateDateTimeFormat();
    renderSumTable();
  });

  $(document).keyup(function() {
    UpdateDateTimeFormat();
    renderSumTable();
  });


});

function SumBetNumber() {


  /** Initialize **/
  for(var i = 0; i <= 999; i++) {
    var n = zeroPad(i, 3);
    sum3digits[n] = [];
    sum3digits[n]['b31'] = 0;
    sum3digits[n]['b32'] = 0;
    sum3digits[n]['b33'] = 0;
    sum3digits[n]['b34'] = 0;
  }

  for(var i = 0; i <= 99; i++) {
    var n = zeroPad(i, 2);
    sum2digits[n] = [];
    sum2digits[n]['b21'] = 0;
    sum2digits[n]['b22'] = 0;
  }

  for(var i = 0; i <= 9; i++) {
    var n = zeroPad(i, 1);
    sum1digits[n] = [];
    sum1digits[n]['b11'] = 0;
    sum1digits[n]['b12'] = 0;
  }

  /** Sum **/
  for (var i = 0; i < transactions.length; i++) {
    if( transactions[i]['number'].length == 3 ) {
      sum3digits[transactions[i]['number']][transactions[i]['bet_type']] += parseFloat(transactions[i]['bet_value']);
    } else if( transactions[i]['number'].length == 2 ) {
      sum2digits[transactions[i]['number']][transactions[i]['bet_type']] += parseFloat(transactions[i]['bet_value']);
    } else if( transactions[i]['number'].length == 1 ) {
      sum1digits[transactions[i]['number']][transactions[i]['bet_type']] += parseFloat(transactions[i]['bet_value']);
    }
  }

}


function renderSumTable() {
  /** Assign **/
  for(var i = 0; i <= 999; i++) {
    var n = zeroPad(i, 3);
    $('#sum_'+n+'_b31').html(sum3digits[n]['b31'].toLocaleString());
    $('#sum_'+n+'_b32').html(sum3digits[n]['b32'].toLocaleString());
    $('#sum_'+n+'_b33').html(sum3digits[n]['b33'].toLocaleString());
    $('#sum_'+n+'_b34').html(sum3digits[n]['b34'].toLocaleString());
  }

  for(var i = 0; i <= 99; i++) {
    var n = zeroPad(i, 2);
    $('#sum_'+n+'_b21').html(sum2digits[n]['b21'].toLocaleString());
    $('#sum_'+n+'_b22').html(sum2digits[n]['b22'].toLocaleString());
  }

  for(var i = 0; i <= 9; i++) {
    var n = zeroPad(i, 1);
    $('#sum_'+n+'_b11').html(sum1digits[n]['b11'].toLocaleString());
    $('#sum_'+n+'_b12').html(sum1digits[n]['b12'].toLocaleString());
  }

}

function UpdateDateTimeFormat() {
  for (var i = 0; i < transactions.length; i++) {
    var t_created = transactions[i]['created_at'];
    $('#transaction_table_' + i + '_created_at').text(DateTimeThai(t_created));
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
