var bet_type = ["b31", "b32", "b33", "b34", "b21", "b22", "b23", "b11", "b12"];
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

var totalRow = 10;


$(document).on('keyup', 'input', function() {
  validateNumber();
});

$(document).on('change', 'input', function() {
  validateLimitandSumBet();
});

$(document).ready(function() {
  console.log(payout);

  localStorage.clear();
  $("#date").html(DateThai($("#round_date").val()));
  $("#date2").html(DateThai($("#round_date").val()));

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
        res = JSON.parse(msg.msg)
        render = "<table width='100%' class='table-bordered table-sm'><thead><th class='text-center'>สถานะ</th><th class='text-center'>ประเภท</th><th class='text-center'>เลข</th><th class='text-center'>จำนวน</th><th class='text-center'>แทงถูกได้</th><th class='text-center'>ส่วนลด</th></thead><tbody>";

        for (var r = 0; r < res.length; r++) {
          var rowClass = ""
          var spanClass = ""
          if( res[r]['status'] != "รับแทง" ) {
            rowClass = "table-danger";
            spanClass = "span-danger";

          }
          render = render + "<tr class='text-muted small text-right "+rowClass+"'><td><span style='background-color: #FFFFFF'><strong>" + res[r]['status'] + "</strong></span></td><td>" + bet_type_name[res[r]['bet_type']] + "</td><td>" + res[r]['number'] + "</td><td>" + res[r]['bet_value'].toLocaleString() + "</td><td>" + (res[r]['bet_value'] * res[r]['odd']).toLocaleString() + "</td><td>" + ((res[r]['bet_value'] * res[r]['discount'])/100).toLocaleString() + "</td></tr>";
        }

        render = render + "</tbody></table>";

        $("#transactionSummarycontent").html(render);

        $("#transactionSummary").modal({
          backdrop: 'static',
          keyboard: false
        });

        localStorage.clear();
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


  });

  $("#add_row").click(function(){
    addNewRow();
  });

  $("#bet_list_table").floatThead({position: 'fixed'});

});

function validateNumber() {
  console.log("validateNumber: " + totalRow);

  for (var i = 1; i <= totalRow; i++) {
  var number = $("#" + i + "_number").val();
    console.log("row_id: " + i + ", number: " + number + "#");
    //if(number == "") continue;
    number = number.replace(/[^0-9]/g, '');
    $("#" + i + "_number").val(number);

    console.log("i:"+i+":"+number+":"+number.length);

    /** Whitelist Bet Type **/
    if (number.length > 3) {
      $("#" + i + "_number").val(number.substr(0, 3));
    } else if (number.length == 3) {
      $("#" + i + "_bet1").prop('disabled', false);
      $("#" + i + "_bet2").prop('disabled', false);
      $("#" + i + "_bet3").prop('disabled', false);
      $("#" + i + "_bet4").prop('disabled', false);
      $("#" + i + "_bet1").removeClass("btn-disabled");
      $("#" + i + "_bet2").removeClass("btn-disabled");
      $("#" + i + "_bet3").removeClass("btn-disabled");
      $("#" + i + "_bet4").removeClass("btn-disabled");
    } else if (number.length == 2) {
      $("#" + i + "_bet1").prop('disabled', false);
      $("#" + i + "_bet2").prop('disabled', false);
      $("#" + i + "_bet3").prop('disabled', true);
      $("#" + i + "_bet4").prop('disabled', true);
      $("#" + i + "_bet1").removeClass("btn-disabled");
      $("#" + i + "_bet2").removeClass("btn-disabled");
      $("#" + i + "_bet3").addClass("btn-disabled");
      $("#" + i + "_bet4").addClass("btn-disabled");
    } else if (number.length == 1) {
      $("#" + i + "_bet1").prop('disabled', false);
      $("#" + i + "_bet2").prop('disabled', false);
      $("#" + i + "_bet3").prop('disabled', true);
      $("#" + i + "_bet4").prop('disabled', true);
      $("#" + i + "_bet1").removeClass("btn-disabled");
      $("#" + i + "_bet2").removeClass("btn-disabled");
      $("#" + i + "_bet3").addClass("btn-disabled");
      $("#" + i + "_bet4").addClass("btn-disabled");
    } else if (number.length == 0 || number == "") {
      $("#" + i + "_bet1").prop('disabled', true);
      $("#" + i + "_bet2").prop('disabled', true);
      $("#" + i + "_bet3").prop('disabled', true);
      $("#" + i + "_bet4").prop('disabled', true);
      $("#" + i + "_bet1").addClass("btn-disabled");
      $("#" + i + "_bet2").addClass("btn-disabled");
      $("#" + i + "_bet3").addClass("btn-disabled");
      $("#" + i + "_bet4").addClass("btn-disabled");
    }
    /** End Bet Type **/
  }

}

function validateLimitandSumBet() {
  var bet_number = [];
  var sum = 0;

  for (var i = 1; i <= totalRow; i++) {
    var number = $("#" + i + "_number").val();
    /** limit min-max **/
    if (number.length == 3) {
      var b31_value = $("#" + i + "_bet1").val();
      var b32_value = $("#" + i + "_bet3").val();
      var b33_value = $("#" + i + "_bet2").val();
      var b34_value = $("#" + i + "_bet4").val();
      b31_value = b31_value.replace(/[^0-9]/g, '');
      b32_value = b32_value.replace(/[^0-9]/g, '');
      b33_value = b33_value.replace(/[^0-9]/g, '');
      b34_value = b34_value.replace(/[^0-9]/g, '');
      $("#" + i + "_bet1").val(b31_value);
      $("#" + i + "_bet3").val(b32_value);
      $("#" + i + "_bet2").val(b33_value);
      $("#" + i + "_bet4").val(b34_value);

      if (b31_value != '' && b31_value != '0') {
        b31_value = parseInt(b31_value);
        b31_value = Math.max(b31_value, payout['b31']['minbet']);
        b31_value = Math.min(b31_value, payout['b31']['maxbet']);
        $("#" + i + "_bet1").val(b31_value);

        var bArr = {
          "number": number,
          "bet_type": "b31",
          "value": b31_value,
          "round": $("#round_id").val()
        }
        bet_number.push(bArr);
        sum = sum + parseInt(b31_value);

      }
      if (b32_value != '' && b32_value != '0') {
        b32_value = parseInt(b32_value);
        b32_value = Math.max(b32_value, payout['b32']['minbet']);
        b32_value = Math.min(b32_value, payout['b32']['maxbet']);
        $("#" + i + "_bet3").val(b32_value);

        var bArr = {
          "number": number,
          "bet_type": "b32",
          "value": b32_value,
          "round": $("#round_id").val()
        }
        bet_number.push(bArr);
        sum = sum + parseInt(b32_value);

      }
      if (b33_value != '' && b33_value != '0') {
        b33_value = parseInt(b33_value);
        b33_value = Math.max(b33_value, payout['b33']['minbet']);
        b33_value = Math.min(b33_value, payout['b33']['maxbet']);
        $("#" + i + "_bet2").val(b33_value);

        var bArr = {
          "number": number,
          "bet_type": "b33",
          "value": b33_value,
          "round": $("#round_id").val()
        }
        bet_number.push(bArr);
        sum = sum + parseInt(b33_value);

      }
      if (b34_value != '' && b34_value != '0') {
        b34_value = parseInt(b34_value);
        b34_value = Math.max(b34_value, payout['b34']['minbet']);
        b34_value = Math.min(b34_value, payout['b34']['maxbet']);
        $("#" + i + "_bet4").val(b34_value);

        var bArr = {
          "number": number,
          "bet_type": "b34",
          "value": b34_value,
          "round": $("#round_id").val()
        }
        bet_number.push(bArr);
        sum = sum + parseInt(b34_value);
      }

    } else if (number.length == 2) {
      var b21_value = $("#" + i + "_bet1").val();
      var b22_value = $("#" + i + "_bet2").val();
      b21_value = b21_value.replace(/[^0-9]/g, '');
      b22_value = b22_value.replace(/[^0-9]/g, '');
      $("#" + i + "_bet1").val(b21_value);
      $("#" + i + "_bet2").val(b22_value);

      if (b21_value != '' && b21_value != '0') {
        b21_value = parseInt(b21_value);
        b21_value = Math.max(b21_value, payout['b21']['minbet']);
        b21_value = Math.min(b21_value, payout['b21']['maxbet']);
        $("#" + i + "_bet1").val(b21_value);

        var bArr = {
          "number": number,
          "bet_type": "b21",
          "value": b21_value,
          "round": $("#round_id").val()
        }
        bet_number.push(bArr);
        sum = sum + parseInt(b21_value);
      }
      if (b22_value != '' && b22_value != '0') {
        b22_value = parseInt(b22_value);
        b22_value = Math.max(b22_value, payout['b22']['minbet']);
        b22_value = Math.min(b22_value, payout['b22']['maxbet']);
        $("#" + i + "_bet2").val(b22_value);

        var bArr = {
          "number": number,
          "bet_type": "b22",
          "value": b22_value,
          "round": $("#round_id").val()
        }
        bet_number.push(bArr);
        sum = sum + parseInt(b22_value);
      }
    } else if (number.length == 1) {
      var b11_value = $("#" + i + "_bet1").val();
      var b12_value = $("#" + i + "_bet2").val();
      b11_value = b11_value.replace(/[^0-9]/g, '');
      b12_value = b12_value.replace(/[^0-9]/g, '');
      $("#" + i + "_bet11").val(b11_value);
      $("#" + i + "_bet12").val(b12_value);

      if (b11_value != '' && b11_value != '0') {
        b11_value = parseInt(b11_value);
        b11_value = Math.max(b11_value, payout['b11']['minbet']);
        b11_value = Math.min(b11_value, payout['b11']['maxbet']);
        $("#" + i + "_bet1").val(b11_value);

        var bArr = {
          "number": number,
          "bet_type": "b11",
          "value": b11_value,
          "round": $("#round_id").val()
        }
        bet_number.push(bArr);
        sum = sum + parseInt(b11_value);
      }
      if (b12_value != '' && b12_value != '0') {
        b12_value = parseInt(b12_value);
        b12_value = Math.max(b12_value, payout['b12']['minbet']);
        b12_value = Math.min(b12_value, payout['b12']['maxbet']);
        $("#" + i + "_bet2").val(b12_value);

        var bArr = {
          "number": number,
          "bet_type": "b12",
          "value": b12_value,
          "round": $("#round_id").val()
        }
        bet_number.push(bArr);
        sum = sum + parseInt(b12_value);
      }
    }
    /** end limit min-max **/
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

function findOdd(bet_type, number) {
  var odd = payout[bet_type]['odd'];

  for (i = 0; i < limit.length; i++) {
    if (limit[i]['number'] == number && limit[i]['bet_type'] == bet_type) {
      odd = limit[i]['odd'];
      break;
    }
  }
  return odd;
}

function addNewRow() {
  for(var i = totalRow+1; i <= totalRow + 10 && i <= 100; i++) {
    $("#row_"+i+"_number").show();
    /*
    $("#bet_list_table" + " > tbody").append('\
    <tr>\
      <td><input class="form-control" type="text" id="'+i+'_number" value=""></td>\
      <td><input class="form-control btn-disabled" type="text" id="'+i+'_bet1" value="" disabled="true"></td>\
      <td><input class="form-control btn-disabled" type="text" id="'+i+'_bet2" value="" disabled="true"></td>\
      <td><input class="form-control btn-disabled" type="text" id="'+i+'_bet3" value="" disabled="true"></td>\
      <td><input class="form-control btn-disabled" type="text" id="'+i+'_bet4" value="" disabled="true"></td>\
    </tr>');
    */
  }
  totalRow += 10;
  console.log("AddRow: " + totalRow);

  if( totalRow >= 100 ) {
    $("#add_row").hide();
  }
}
