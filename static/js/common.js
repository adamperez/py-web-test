$(document).ready(function () {
    var $select = $(".form-int-counter");
    for (i=0;i<=100;i++){
        $select.append($('<option></option>').val(i).html(i))
    }

    var $select = $("#form-date-mm");
    for (i=1;i<=12;i++){
        $select.append($('<option></option>').val(i).html(i))
    }

    var $select = $("#form-date-dd");
    for (i=1;i<=31;i++){
        $select.append($('<option></option>').val(i).html(i))
    }

    var $select = $("#form-date-yyyy");
    for (i=2021;i<=3000;i++){
        $select.append($('<option></option>').val(i).html(i))
    }

    var hours = ['#form-time-hh', '#form-end-time-hh']
    for (i = 0; i < hours.length; i++){
        var $select = $(hours[i]);
        for (j = 0; j <= 24; j++){
            $select.append($('<option></option>').val(j).html(j))
        }
    }

    var minutes = ['#form-time-mm', '#form-end-time-mm']
    var minuteArr = ['00', '15', '30', '45']

    for (i = 0; i < minutes.length; i++){
        var $select = $(minutes[i]);
        for (j=0;j<minuteArr.length;j++) {
            $select.append($('<option></option>').val(minuteArr[j]).html(minuteArr[j]))
        }
    }
});
