$(document).ready(function () {
    var $select = $("#max-res-count");
    for (i=1;i<=100;i++){
        $select.append($('<option></option>').val(i).html(i))
    }
});

function submitNewInventory(resCount, startDate, startTime, endDate, endTime) {
    // submit new inventory window to backend
    let maxCount = null
    if (resCount) {
        maxCount = resCount;
    } else {
        e = document.getElementById("max-res-count");
        maxCount = e.options[e.selectedIndex].value;
    }

    let maxStartDate = null
    if (startDate) {
        maxStartDate = startDate;
    } else {
        let d = $('#start-inv-date').val();
        maxStartDate = d;
    }
    let maxStartTime = null
    if (startTime) {
        maxStartTime = startTime;
    } else {
        let d = $('#start-inv-time').val();
        maxStartTime = d;
    }

    let maxEndDate = null
    if (endDate) {
        maxEndDate = endDate;
    } else {
        let d = $('#end-inv-date').val();
        maxEndDate = d;
    }
    let maxEndTime = null
    if (endTime) {
        maxEndTime = endTime;
    } else {
        let d = $('#end-inv-time').val();
        maxEndTime = d;
    }

    // call to backend
    return $.ajax({
        type: 'POST',
        url: '/inventory/create',
        dataType: 'json',
        data: JSON.stringify({
                'max_reservations': maxCount,
                'inv_time_ceiling': maxStartDate + ' ' + maxStartTime,
                'inv_time_floor': maxEndDate + ' ' + maxEndTime
            }),
        contentType: 'application/json;charset=UTF-8'
    }).then(function (result) {
        console.log(result)
    })
}

function dupeWindowForm() {
    // append new inv window to form
    let clone = document.querySelector('.new-inv-win').cloneNode( true );
    document.querySelector('#new-inv-windows').appendChild( clone );
}

function aggregateInvWindows() {
    //
    var windows = {'inv_windows': []};
    $(".new-inv-win").each(function (index, element) {
        var currWin = {}
        currWin['start_time'] = element.getElementsByClassName("form-time-hh")[0].value + ':' + element.getElementsByClassName("form-time-mm")[0].value;
        currWin['end_time'] = element.getElementsByClassName("form-end-time-hh")[0].value + ':' + element.getElementsByClassName("form-end-time-mm")[0].value;
        currWin['max_res_count'] = element.getElementsByClassName("form-int-counter")[0].value;
        windows['inv_windows'].push(currWin)
    });
    console.log(windows);
}

function refreshInventoryDisplay() {
    // todo

    return $.ajax({
        type: 'GET',
        url: '/inventory/all',
    }).then(function (data) {
        // if no data present, short-circuit and flash message
        if (data.error) {
            location.href = '/';
            return;
        }

        // process inventory model into html table
        let trHTML = '';
        $.each(data.inventory, function(i, item) {
            trHTML = '<tr><td>' + item.id + '</td><td>' + item.max_reservations + '</td><td>' + item.curr_num_reservations + '</td><td>' + item.inv_time_ceiling + '</td><td>' + item.inv_time_floor + '</td></tr>';
        });
        $('#curr-inv-tbl').append(trHTML);
    })
}