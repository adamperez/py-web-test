$(document).ready(function () {
    var $select = $("#max-res-count");
    for (i=1;i<=100;i++){
        $select.append($('<option></option>').val(i).html(i))
    }
});

function submitNewInventory() {
    // submit new inventory window to backend
    invDate = $("#new-inv-form-date .form-date-yyyy")[0].value + '-' +
        $("#new-inv-form-date .form-date-mm")[0].value + '-' +
        $("#new-inv-form-date .form-date-dd")[0].value;
    windows = aggregateInvWindows();

//    console.log({
//        'inv_date': invDate,
//        'windows': windows
//    })

    // call to backend
    return $.ajax({
        type: 'POST',
        url: '/inventory/create',
        dataType: 'json',
        data: JSON.stringify({
            'date': invDate,
            'windows': windows
        }),
        contentType: 'application/json;charset=UTF-8'
    }).then(function (result) {
        location.href = '/';
        return;
    })
}

function dupeWindowForm() {
    // append new inv window to form
    let clone = document.querySelector('.new-inv-win').cloneNode( true );
    document.querySelector('#new-inv-windows').appendChild( clone );
}

function aggregateInvWindows() {
    // aggregate all inventory windows into compact JSON for backend processing
    var windows = [];
    $(".new-inv-win").each(function (index, element) {
        windows.push({
            'start_time': element.getElementsByClassName("form-time-hh")[0].value + ':' + element.getElementsByClassName("form-time-mm")[0].value,
            'end_time': element.getElementsByClassName("form-end-time-hh")[0].value + ':' + element.getElementsByClassName("form-end-time-mm")[0].value,
            'max_res_count': element.getElementsByClassName("form-int-counter")[0].value
        })
    });
    return windows;
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