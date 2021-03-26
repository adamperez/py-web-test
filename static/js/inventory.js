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

function refreshInventoryDisplay() {
    // todo

    return $.ajax({
        type: 'GET',
        url: '/inventory/all',
    }).then(function (data) {
        let trHTML = '';
        $.each(data.inventory, function(i, item) {
            trHTML = '<tr><td>' + item.id + '</td><td>' + item.max_reservations + '</td><td>' + item.curr_num_reservations + '</td><td>' + item.inv_time_ceiling + '</td><td>' + item.inv_time_floor + '</td></tr>';
        });
        $('#curr-inv-tbl').append(trHTML);
    })
}