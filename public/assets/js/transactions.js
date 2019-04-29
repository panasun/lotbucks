var allRounds = new Array();
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
  /*
  $('#transactions_wait').DataTable({
    iDisplayLength: 25,
    order: [
      [0, "desc"]
    ],
    paging: true,
    searching: true
  });
  */
  /*
  var transactions_all = $('#transactions_all').DataTable({
    iDisplayLength: 25,
    order: [
      [0, "desc"]
    ],
    paging: true,
    searching: true

  });
  */

  /** Table Summary **/
  CalculateSummaryTable();


  UpdateDateTimeFormat();

  $(document).on("click", ".paginate_button ", function() {
    UpdateDateTimeFormat();
  });

  $(document).keyup(function() {
    UpdateDateTimeFormat();
  });

  /** Full Screen Modal **/
  function cssn($e, props) {
      var sum = 0;
      props.forEach(function (p) {
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
    $('.modal-fullscreen').on('show.bs.modal', function (e) {
      var $e = $(e.currentTarget).css('visibility', 'hidden');
    });
    $('.modal-fullscreen').on('shown.bs.modal', function (e) {
      calc($(e.currentTarget));
      var $e = $(e.currentTarget).css('visibility', 'visible');
    });
    $(window).resize(function () {
      calc($('.modal.modal-fullscreen.in'));
    });

  /** end fullscreen **/

});


function ShowSummaryTable(id) {

  var rid = allRounds[id];
  console.log(allRounds);

  var render = "";
  render += '<p class="text-center"><h5>'+rounds[rid]['product']+' งวดวันที่ '+DateThai(rounds[rid]['result_date'])+'</h5>';
  render += '<table id="transactions_byround" class="table table-sm table-striped table-resize-data">'+
  '<thead><tr><th>วันที่</th><th>ประเภท</th><th>เลขที่แทง</th><th>แต้มต่อ</th><th>ยอดแทง</th><th>ยอดได้</th><th>ส่วนลด</th>'+
  '<th>สุทธิ</th><th>สถานะ</th><th>ไอดีการแทง</th></tr></thead><tbody>';

  var total_bet_value = 0;
  var total_discount = 0;
  var total_bet_win = 0;
  var total_bet_net = 0;

  for (var i = 0; i < transactions_history.length; i++) {

    if(transactions_history[i]['round']['$oid'] != rid) continue;

    total_bet_value += transactions_history[i]['bet_value'];
    total_discount += transactions_history[i]['discount']*transactions_history[i]['bet_value']/100;
    total_bet_win += transactions_history[i]['paid'];
    total_bet_net += transactions_history[i]['paid'] - transactions_history[i]['bet_value'] + (transactions_history[i]['discount']*transactions_history[i]['bet_value']/100);

    var cWin = transactions_history[i]['status'] == 'ถูก' ? 'table-success' : '';

    render += '<tr class="'+cWin+'">';
    render += '<td>'+DateTimeThai(transactions_history[i]['created_at'])+'</td>';
    render += '<td>'+bet_type_name[transactions_history[i]['bet_type']]+'</td>';
    render += '<td>'+transactions_history[i]['number']+'</td>';
    render += '<td>'+transactions_history[i]['odd']+'</td>';
    render += '<td>'+transactions_history[i]['bet_value'].toLocaleString()+'</td>';
    render += '<td>'+transactions_history[i]['paid'].toLocaleString()+'</td>';
    render += '<td>'+(transactions_history[i]['discount']*transactions_history[i]['bet_value']/100).toLocaleString()+'</td>';
    render += '<td>'+(transactions_history[i]['paid'] - transactions_history[i]['bet_value'] + (transactions_history[i]['discount']*transactions_history[i]['bet_value']/100)).toLocaleString()+'</td>';
    //render += '<td>'+transactions_history[i]['money'].toLocaleString()+'</td>';
    //render += '<td>'+(transactions_history[i]['money']-(1-transactions_history[i]['discount']/100)*transactions_history[i]['bet_value']).toLocaleString()+'</td>';
    render += '<td>'+transactions_history[i]['status']+'</td>';
    var tid = transactions_history[i]['_id']['$oid'].toString();
    render += '<td>'+tid.substr(tid.length-6)+'</td>';
    render += '</tr>';

  }

  render += "<tr><td></td><td></td><td></td><td><strong>รวม</strong></td>";
  render += "<td><strong>"+total_bet_value.toLocaleString()+"</strong></td>";
  render += "<td><strong>"+total_discount.toLocaleString()+"</strong></td>";
  render += "<td><strong>"+total_bet_win.toLocaleString()+"</strong></td>";
  render += "<td><strong>"+total_bet_net.toLocaleString()+"</strong></td>";
  render += "<td></td><td></td>";


  render += "</tbody></table>";

  $("#transactionSummarycontent").html(render);

  $("#transactionSummary").modal({
    backdrop: 'static',
    keyboard: true
  });
}

function CalculateSummaryTable() {
  for (var i = 0; i < transactions_history.length; i++) {
    allRounds.push(transactions_history[i]['round']['$oid']);
  }
  allRounds = allRounds.filter( onlyUnique );
  allRounds.reverse();

  var sumTransaction = new Array();
  for(var i = 0; i < allRounds.length; i++) {
    var rid = allRounds[i];
    sumTransaction[rid] = new Array();
    sumTransaction[rid]['idx'] = i;
    sumTransaction[rid]['rid'] = rid;
    sumTransaction[rid]['bet_value'] = 0;
    sumTransaction[rid]['discount'] = 0;
    sumTransaction[rid]['paid'] = 0;
    sumTransaction[rid]['transaction'] = 0;
    sumTransaction[rid]['result_date'] = DateThai(rounds[allRounds[i]]['result_date']);
    sumTransaction[rid]['result_date2'] = rounds[allRounds[i]]['result_date'];
    sumTransaction[rid]['product'] = rounds[allRounds[i]]['product'];

  }


  for (var i = 0; i < transactions_history.length; i++) {
    var rid = transactions_history[i]['round']['$oid'];
    sumTransaction[rid]['bet_value'] += transactions_history[i]['bet_value'];
    sumTransaction[rid]['paid']      += transactions_history[i]['paid'];
    sumTransaction[rid]['discount']  += (transactions_history[i]['discount'] * transactions_history[i]['bet_value']) / 100;
    sumTransaction[rid]['transaction']++;
  }


  var total_bet_value = 0;
  var total_discount = 0;
  var total_bet_win = 0;
  var total_bet_transaction = 0;

  for (var i = 0; i < allRounds.length; i++) {
    var rid = allRounds[i];
    $('#transaction_byround_' + i + '_product').text(sumTransaction[rid]['product']);
    $('#transaction_byround_' + i + '_result_date').text(sumTransaction[rid]['result_date']);
    $('#transaction_byround_' + i + '_bet_value').text(sumTransaction[rid]['bet_value'].toLocaleString());
    $('#transaction_byround_' + i + '_discount').text(sumTransaction[rid]['discount'].toLocaleString());
    $('#transaction_byround_' + i + '_pnl').text(sumTransaction[rid]['paid'].toLocaleString());
    $('#transaction_byround_' + i + '_transaction').text(sumTransaction[rid]['transaction'].toLocaleString());
    total_bet_value += sumTransaction[rid]['bet_value'];
    total_discount += sumTransaction[rid]['discount'];
    total_bet_win += sumTransaction[rid]['paid'];
    total_bet_transaction += sumTransaction[rid]['transaction'];
  }
  //alert(total_bet_value);

  for (var i = Object.keys(rounds).length; i > allRounds.length; i--) {
    var element = document.getElementById("transactions_byround_tr_"+i).remove();

  }

    $('#total_bet_value_by_round').text(parseFloat(total_bet_value).toLocaleString());
    $('#total_discount_by_round').text(parseFloat(total_discount).toLocaleString());
    $('#total_bet_win_by_round').text(parseFloat(total_bet_win).toLocaleString());
    $('#total_bet_transaction_by_round').text(parseFloat(total_bet_transaction).toLocaleString());

}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function UpdateDateTimeFormat() {
  for (var i = 0; i < transactions_wait.length; i++) {
    var t_resultdate = rounds[transactions_wait[i]['round']['$oid']]['result_date'];
    $('#transaction_wait_' + i + '_result_date').text(DateThai(t_resultdate));
    console.log('#transactions_wait_' + i + '_result_date');
    var t_created = transactions_wait[i]['created_at'];
    $('#transaction_wait_' + i + '_created_at').text(DateTimeThai(t_created));
  }

  for (var i = 0; i < transactions_history.length; i++) {
    var t_resultdate = rounds[transactions_history[i]['round']['$oid']]['result_date'];
    $('#transaction_history_' + i + '_result_date').text(DateThai(t_resultdate));

    var t_created = transactions_history[i]['created_at'];
    $('#transaction_history_' + i + '_created_at').text(DateTimeThai(t_created));
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
