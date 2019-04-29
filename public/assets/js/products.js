$(document).ready(function() {

    $("#date_laos").html(DateThai($("#round_laos_date").val()));
    $("#date_thai").html(DateThai($("#round_thai_date").val()));


    $("#close_date_laos").html(DateThai($("#round_laos_date").val()));
    $("#close_date_thai").html(DateThai($("#round_thai_date").val()));


    var y = setInterval(function() {

        var k1 = calTimeLeft($("#round_laos_date").val(), $("#round_laos_time").val());

        $("#round_laos_countdown").html(convertToTimeFormat(k1));
        if (k1 <= 0.99/* || convertToTimeFormat(k1) == "00 : 00 : 00"*/) {
            $("#round_laos_countdown").attr('class', 'text-muted');
            $("#goto_laos_button").html('<button class="btn btn-block btn-rounded btn-default" disabled="disabled">ปิดรับแทง</button>');
        }

        var k2 = calTimeLeft($("#round_thai_date").val(), $("#round_thai_time").val());
        $("#round_thai_countdown").html(convertToTimeFormat(k2));
        if (k2 <= 0.99/* || convertToTimeFormat(k2) == "00 : 00 : 00"*/) {
            $("#round_thai_countdown").attr('class', 'text-muted');
            $("#goto_thai_button").html('<button class="btn btn-block btn-rounded btn-default" disabled="disabled">ปิดรับแทง</button>');
        }


        //$("#round_laos_countdown").fadeOut();
        //$("#round_laos_countdown").fadeIn(200);

    }, 1000);

});

function DateThai($strDate) {
    $d = $strDate.split("-");

    $strMonthCut = Array("", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.");
    $thDate = $d[2] + " " + $strMonthCut[Number($d[1])] + " " + (parseInt($d[0]) + 543);

    return $thDate;
}

function calTimeLeft($strDate, $strTime) {
    $d = $strDate.split("-");
    //$st = $strDate + " " + $strTime + " +0700";
    //var $targetTime = new Date(Date.parse($st));
    $st = $strDate + "T" + $strTime;
    var $targetTime = dateFromString($st);
    var $currentTime = new Date();

    var $leftTime = $targetTime - $currentTime;
    //alert($st+" "+$targetTime);

    return $leftTime;

}


function dateFromString(str) {
  var a = $.map(str.split(/[^0-9]/), function(s) { return parseInt(s, 10) });
  return new Date(a[0], a[1]-1 || 0, a[2] || 1, a[3] || 0, a[4] || 0, a[5] || 0, a[6] || 0);
}

function convertToTimeFormat($leftTime) {
    $leftTime = Math.floor($leftTime / 1000);
    var $h = Math.floor($leftTime / (60 * 60));
    var $m = Math.floor(($leftTime % 3600) / 60);
    var $s = $leftTime % 60;

    if ($leftTime > 0) {
        return addLeadingZeros($h, 2) + " : " + addLeadingZeros($m, 2) + " : " + addLeadingZeros($s, 2);
    } else {
        return "00 : 00 : 00";
    }
}

function addLeadingZeros(n, length) {
    var str = (n > 0 ? n : -n) + "";
    var zeros = "";
    for (var i = length - str.length; i > 0; i--)
        zeros += "0";
    zeros += str;
    return n >= 0 ? zeros : "-" + zeros;
}
