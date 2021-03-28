$(document).ready(function () {
    var $select = $("#res-party-size");
    for (i=1;i<=100;i++){
        $select.append($('<option></option>').val(i).html(i))
    }
});

function submitNewReservation(resName, resEmail, resPartySize, resMonth, resDay, resYear, resHour, resMinute) {
    // TODO
    let rName = null
    if (resName) {
        rName = resName;
    } else {
        rName = document.getElementById("res-name").value;
    }
    let rEmail = null
    if (resEmail) {
        rName = resEmail;
    } else {
        rEmail  = document.getElementById("res-email").value;
    }

    let rSize = null
    if (resPartySize) {
        rSize = resPartySize;
    } else {
        e = document.getElementById("res-party-size");
        rSize = e.options[e.selectedIndex].value;
    }

    let rMon = null
    if (resMonth) {
        rMon = resMonth;
    } else {
        e = document.getElementById("res-date-mm");
        rMon = e.options[e.selectedIndex].value;
    }
    let rDay = null
    if (resDay) {
        rDay = resDay;
    } else {
        e = document.getElementById("res-date-dd");
        rDay = e.options[e.selectedIndex].value;
    }
    let rYear = null
    if (resYear) {
        rYear = resYear;
    } else {
        e = document.getElementById("res-date-yyyy");
        rYear = e.options[e.selectedIndex].value;
    }

    let rHH = null
    if (resHour) {
        rHH = resHour;
    } else {
        e = document.getElementById("res-time-hh");
        rHH = e.options[e.selectedIndex].value;
    }

    let rMM = null
    if (resMinute) {
        rMM = resMinute;
    } else {
        e = document.getElementById("res-time-mm");
        rMM = e.options[e.selectedIndex].value;
    }

    return $.ajax({
        type: 'POST',
        url: '/reservation/create',
        dataType: 'json',
        data: JSON.stringify({
                'name': rName,
                'email': rEmail,
                'party_size': rSize,
                'date': rYear + '-' + rMon + '-' + rDay,
                'time': rHH + ':' + rMM
            }),
        contentType: 'application/json;charset=UTF-8'
    }).then(function (result) {
        console.log(result);
        location.href = '/reservation';
    })
}