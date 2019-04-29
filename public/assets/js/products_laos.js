var bet_type = ["b31", "b32", "b33", "b34", "b21", "b22", "b11", "b12"];
var bet_type_name = {"b31":"3ตัวบน", "b32":"3ตัวโต๊ด", "b33":"3ตัวล่าง", "b34":"3ตัวหน้า",
"b21":"2ตัวบน", "b22":"2ตัวล่าง", "b11":"วิ่งบน", "b12":"วิ่งล่าง"};


$(document).on('change', 'input', function() {
  sumBet();
});
$(document).ready(function() {

  loadBetList();
  $("#date_laos").html(DateThai($("#round_laos_date").val()));
  $("#tab-rule").click(function() {
    $("#panel-rule").show();
    $("#panel-3digits").hide();
    $("#panel-2digits").hide();
    $("#panel-rundigits").hide();
    $("#3digits").hide();
    $("#2digits").hide();
  });
  $("#tab-3digits").click(function() {
    localStorage.setItem("laos_bet_type", JSON.stringify(""));
    $("#panel-3digits").load(location.href + " #panel-3digits");
    $("#panel-rule").hide();
    $("#panel-3digits").show();
    $("#panel-2digits").hide();
    $("#panel-rundigits").hide();
    $("#2digits").hide();
  });
  $("#tab-2digits").click(function() {
    localStorage.setItem("laos_bet_type", JSON.stringify(""));
    $("#panel-2digits").load(location.href + " #panel-2digits");
    $("#panel-rule").hide();
    $("#panel-3digits").hide();
    $("#panel-2digits").show();
    $("#panel-rundigits").hide();
    $("#3digits").hide();
  });
  $("#tab-rundigits").click(function() {
    $("#panel-rule").hide();
    $("#panel-3digits").hide();
    $("#panel-2digits").hide();
    $("#panel-rundigits").show();
    $("#3digits").hide();
    $("#2digits").hide();
  });


  $("#submit_bet").click(function() {
    if (!document.getElementById('accept-confirm').checked) {
      $.toast({
        text: 'กรุณาเช็คเครื่องหมายถูกหน้าช่องตรวจสอบรายการและยอมรับเงื่อนไข',
        position: 'bottom-right',
        icon: 'warning',
        stack: true
      });
      return;
    }
    $('#accept-confirm').prop('checked', false);
    sumBet();
    var bet_number = JSON.parse(localStorage.getItem("laos_bet_number")) || [];
    if (bet_number.length == 0) {
      $.toast({
        text: 'กรุณาเลือกเลขแทง',
        position: 'bottom-right',
        icon: 'warning',
        stack: true
      });
      return;
    }
    if (bet_number.length == 0) {
      $.toast({
        text: 'กรุณาเลือกเลขแทง',
        position: 'bottom-right',
        icon: 'warning',
        stack: true
      });
      return;
    }
    console.log("total_bet:" + localStorage.getItem("total_bet") + "user_money:" + $("#user_money").val());
    if (localStorage.getItem("total_bet") > parseFloat($("#user_money").val())) {
      $.toast({
        text: 'เงินในบัญชีไม่เพียงพอ กรุณาเติมเงินเพิ่ม',
        position: 'bottom-right',
        icon: 'warning',
        stack: true
      });
      return;
    }
    $.ajax({
      type: "POST",
      url: "/transactions",
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
      },
      data: localStorage.getItem("laos_bet_number"),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(msg) {
        console.log("MSG: " + JSON.stringify(msg));
        clearBetList();
        res = JSON.parse(msg.msg)
        render = "<table width='100%' class='table-bordered table-sm'><thead><th class='text-center'>ประเภท</th><th class='text-center'>เลข</th><th class='text-center'>จำนวน</th><th class='text-center'>แทงถูกได้</th><th class='text-center'>หมายเหตุ</th></thead><tbody>";

        for(var r = 0; r < res.length; r++) {
          render = render + "<tr class='text-muted small text-right'><td>"+bet_type_name[res[r]['bet_type']]+"</td><td>"+res[r]['number']+"</td><td>"+res[r]['bet_value'].toLocaleString()+"</td><td>"+(res[r]['bet_value']*res[r]['odd']).toLocaleString()+"</td><td>"+res[r]['status']+"</td></tr>";
        }

        render = render + "</tbody></table>";

        $("#transactionSummarycontent").html(render);

        $("#transactionSummary").modal({
          backdrop: 'static',
          keyboard: false
        });

        /*
        swal({
          title: 'ได้รับรายการแทงเรียบร้อยแล้ว',
          html: msg.msg,
          type: 'success',
          showCancelButton: false,
          confirmButtonClass: 'btn btn-success',
          confirmButtonText: 'ตกลง',
          cancelButtonText: 'ดูประวัติการแทง'
        });
        */
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        $.toast({
          text: 'เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาตรวจสอบความถูกต้องและลองใหม่อีกครั้ง',
          position: 'bottom-right',
          icon: 'error',
          stack: true
        });
        console.log(textStatus);
      }
    });
    console.log(bet_number);
  });

  /** Validate Bet Value Input **/

  $("input").keydown(function (event) {
      if (event.shiftKey == true || event.keyCode == 46) {
          event.preventDefault();
      }
      if ((event.keyCode >= 48 && event.keyCode <= 57) ||
          (event.keyCode >= 96 && event.keyCode <= 105) ||
          event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 ||
          event.keyCode == 39) {

      } else {
          event.preventDefault();
      }

      this.value = this.value.replace(/[^0-9]/g,'');

  });





});

function addBetType(type) {
  localStorage.setItem("laos_bet_type", JSON.stringify(type));
  for (var i = 0; i < bet_type.length; i++) {
    if (type == bet_type[i]) {
      $("#" + bet_type[i]).addClass('btn-primary');
    } else {
      $("#" + bet_type[i]).removeClass('btn-primary');
    }
  }

  for (var i = 0; i < limit.length; i++) {
    if(limit[i]['bet_type'] == type) {
      //$("#" + limit[i]['number']).prop('disabled', true);
      $("#" + limit[i]['number']).addClass('btn-disabled');
    } else {
      //$("#" + limit[i]['number']).prop('disabled', false);
      $("#" + limit[i]['number']).removeClass('btn-disabled');
    }
  }

  var bet_number = JSON.parse(localStorage.getItem("laos_bet_number")) || [];
  if (type == "b31" || type == "b32" || type == "b33" || type == "b34") {
    for (var i = 0; i < bet_number.length; i++) {
      if (bet_number[i]['digit'] == 3) {
        var number = zeroPad(bet_number[i]['number'], 3);
        if (type != bet_number[i]['bet_type']) {
          $("#" + number).removeClass('btn-primary');
        }
      }
    }
    for (var i = 0; i < bet_number.length; i++) {
      if (bet_number[i]['digit'] == 3) {
        var number = zeroPad(bet_number[i]['number'], 3);
        if (type == bet_number[i]['bet_type']) {
          $("#" + number).addClass('btn-primary');
        }
      }
    }
    $("#3digits").show();
  } else if (type == "b21" || type == "b22") {
    for (var i = 0; i < bet_number.length; i++) {
      if (bet_number[i]['digit'] == 2) {
        var number = zeroPad(bet_number[i]['number'], 2);
        if (type != bet_number[i]['bet_type']) {
          $("#" + number).removeClass('btn-primary');
        }
      }
    }
    for (var i = 0; i < bet_number.length; i++) {
      if (bet_number[i]['digit'] == 2) {
        var number = zeroPad(bet_number[i]['number'], 2);
        if (type == bet_number[i]['bet_type']) {
          $("#" + number).addClass('btn-primary');
        }
      }
    }
    $("#2digits").show();
  }
}

function addNumber(number, digit) {

  var bet_number = JSON.parse(localStorage.getItem("laos_bet_number")) || [];
  var bet_type = JSON.parse(localStorage.getItem("laos_bet_type")) || "";
  if (bet_type == "") {
    alert("กรุณาเลือกประเภทการแทง");
    return;
  }
  var tmp = [];
  var dup = 0;
  for (var i = 0; i < bet_number.length; i++) {
    if (bet_number[i]['number'] == number && bet_number[i]['bet_type'] == bet_type) {
      $('#' + bet_type + '_' + number).remove();
      $("#" + number).removeClass('btn-primary');
      dup = 1;
    } else {
      tmp.push(bet_number[i]);


    }
  }
  if (dup == 0) {
    /** Limit Odd **/
    var isClose = 0;
    for(var j = 0; j < limit.length; j++) {
      if( number == limit[j]['number'] && bet_type == limit[j]['bet_type'] ) {
        if( limit[j]['odd'] > 0 ) {
          var str = bet_type_name[bet_type]+" เลข "+number+" ถูกอั้น ถ้าทายถูกจะได้ "+limit[j]['odd']+" เท่า";
          $.toast({
            text: str,
            position: 'bottom-right',
            icon: 'warning',
            stack: true
          });
        } else {
          var str = bet_type_name[bet_type]+" เลข "+number+" ถูกอั้น ไม่รับแทง";
          $.toast({
            text: str,
            position: 'bottom-right',
            icon: 'error',
            stack: true
          });
          isClose = 1;
        }

      }
    }


    if( isClose == 0 ) {
      tmp.push({
        'number': number,
        'digit': digit,
        'bet_type': bet_type
      });
      $("#bet_list_table_" + bet_type + " > tbody:last-child").append("\
      <tr id='" + bet_type + "_" + number + "'><td ><span>" + number + "</span></td>\
      <td><input class='form-control bet_value_"+bet_type+"' onkeyup=\"validateNumber('"+bet_type+"', '"+number+"')\" \
      type='number' id='" + bet_type + "_" + number + "_value' value='1'></td>\
      <td id='" + bet_type + "_" + number + "_win'></td>\
      <td><button class='btn btn-xs btn-outline-default' onclick=\"removeNumber('" + number + "', '" + bet_type + "');\"><i class='material-icons'>delete</i></button></td>\
      </tr>");
      $("#" + number).addClass('btn-primary');
    }

  }
  console.log(tmp);
  localStorage.setItem("laos_bet_number", JSON.stringify(tmp));
  displayBetTypeList();
}

function removeNumber(number, bet_type) {
  $('#' + bet_type + '_' + number).remove();
  if (bet_type == JSON.parse(localStorage.getItem("laos_bet_type"))) {
    $("#" + number).removeClass('btn-primary');
  }
  var bet_number = JSON.parse(localStorage.getItem("laos_bet_number")) || [];
  var tmp = [];
  for (var i = 0; i < bet_number.length; i++) {
    if (bet_number[i]['number'] == number && bet_number[i]['bet_type'] == bet_type) {} else {
      tmp.push(bet_number[i])
    }
  }
  localStorage.setItem("laos_bet_number", JSON.stringify(tmp));
  sumBet();
}

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

function clearBetList() {
  var bet_number = JSON.parse(localStorage.getItem("laos_bet_number")) || [];
  var bet_type_array = ["b31", "b32", "b33", "b34", "b21", "b22", "b11", "b12"];
  var sum = 0;
  for (var i = 0; i < bet_number.length; i++) {
    var bet_type = bet_number[i]["bet_type"];
    var number = bet_number[i]["number"];
    $('#' + bet_type + '_' + number).remove();
    if (bet_type == JSON.parse(localStorage.getItem("laos_bet_type"))) {
      $("#" + number).removeClass('btn-primary');
    }
  }
  localStorage.clear();
  loadBetList();
}

function loadBetList() {
  var bet_number = JSON.parse(localStorage.getItem("laos_bet_number")) || [];
  for (var i = 0; i < bet_number.length; i++) {
    var number = bet_number[i]['number'];
    var bet_type = bet_number[i]['bet_type'];
    var value = bet_number[i]['value'];
    console.log(number);
    $("#bet_list_table_" + bet_type + " > tbody:last-child").append("\
    <tr id='" + bet_type + "_" + number + "'><td ><span>" + number + "</span></td>\
    <td><input class='form-control bet_value_"+bet_type+"' onkeyup=\"validateNumber('"+bet_type+"', '"+number+"')\" \
    type='number' id='" + bet_type + "_" + number + "_value' value='"+value+"'></td>\
    <td id='" + bet_type + "_" + number + "_win'></td>\
    <td><button class='btn btn-xs btn-outline-default' onclick=\"removeNumber('" + number + "', '" + bet_type + "');\"><i class='material-icons'>delete</i></button></td>\
    </tr>");
  }
  displayBetTypeList();
}

function displayBetTypeList() {
  var bet_number = JSON.parse(localStorage.getItem("laos_bet_number")) || [];
  var bet_type_array = ["b31", "b32", "b33", "b34", "b21", "b22", "b11", "b12"];
  var count_bet_type = [];
  for (var i = 0; i < bet_type_array.length; i++) {
    count_bet_type[bet_type_array[i]] = 0;
  }
  for (var i = 0; i < bet_number.length; i++) {
    count_bet_type[bet_number[i]['bet_type']]++;
  }
  for (var i = 0; i < bet_type_array.length; i++) {
    if (count_bet_type[bet_type_array[i]] > 0) {
      $("#bet_list_" + bet_type_array[i]).show();
    } else {
      $("#bet_list_" + bet_type_array[i]).hide();
    }
  }
  sumBet();
}

function sumBet() {
  var bet_number = JSON.parse(localStorage.getItem("laos_bet_number")) || [];
  var sum = 0;
  for (var i = 0; i < bet_number.length; i++) {
    /*
    rn = $("#"+bet_number[i]["bet_type"]+"_"+bet_number[i]["number"]+"_value").val()
    rn = rn.replace(/[^0-9]/g,'');
    $("#"+bet_number[i]["bet_type"]+"_"+bet_number[i]["number"]+"_value").val(rn)
    console.log("sumbet"+rn);
    */
    validateNumber(bet_number[i]["bet_type"], bet_number[i]["number"])

    bet_number[i]["value"] = $("#" + bet_number[i]["bet_type"] + "_" + bet_number[i]["number"] + "_value").val();
    bet_number[i]["round"] = $("#round_id").val();
    var win = bet_number[i]["value"] * findOdd(bet_number[i]["bet_type"], bet_number[i]["number"]);
    $("#" + bet_number[i]["bet_type"] + "_" + bet_number[i]["number"] + "_win").html(win.toLocaleString());
    sum = sum + parseInt(bet_number[i]["value"]);
  }
  $("#bet_sum").html("<h5>ยอดรวม: " + sum.toLocaleString() + " บาท</h5>");
  localStorage.setItem("laos_bet_number", JSON.stringify(bet_number));
  console.log(bet_number);
  localStorage.setItem("total_bet", sum);
}

function DateThai($strDate) {
  $d = $strDate.split("-");
  $strMonthCut = Array("", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.");
  $thDate = $d[2] + " " + $strMonthCut[Number($d[1])] + " " + (parseInt($d[0]) + 543);
  return $thDate;
}

function validateNumber(bet_type, number) {

  rn = $("#"+bet_type+"_"+number+"_value").val()
  rn = parseInt(rn.replace(/[^0-9]/g,''));

  minbet = payout[bet_type]['minbet'];
  maxbet = payout[bet_type]['maxbet'];

  if( rn > maxbet ) rn = maxbet;
  if( rn < minbet ) rn = minbet;


  $("#"+bet_type+"_"+number+"_value").val(rn)

}

function findOdd(bet_type, number) {
  var odd = payout[bet_type]['odd'];

  for(i = 0; i < limit.length; i++) {
    if(limit[i]['number'] == number && limit[i]['bet_type'] == bet_type) {
      odd = limit[i]['odd'];
      break;
    }
  }
  console.log("findOdd");
  return odd;

}
