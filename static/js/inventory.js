$(document).ready(function () {
    var $select = $("#max-res-count");
    for (i=1;i<=100;i++){
        $select.append($('<option></option>').val(i).html(i))
    }
});

function submitNewInventory() {
    // submit new inventory window to backend
    var invDate = $("#new-inv-form-date .form-date-yyyy")[0].value + '-' +
        $("#new-inv-form-date .form-date-mm")[0].value + '-' +
        $("#new-inv-form-date .form-date-dd")[0].value;
    var windows = aggregateInvWindows();

    var payload = {
        'date': invDate,
        'windows': windows
    };

    // call to backend
    return $.ajax({
        type: 'POST',
        url: '/inventory/create',
        dataType: 'json',
        data: JSON.stringify(payload),
        contentType: 'application/json;charset=UTF-8'
    }).then(function (result) {
        location.href = '/';
        return;
    })
}

function dupeWindowForm() {
    // append new inv window to form
    var clone = document.querySelector('.new-inv-win').cloneNode(true);
    document.querySelector('#new-inv-windows').appendChild(clone);
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
    // refresh inventory display

    return $.ajax({
        type: 'GET',
        url: '/inventory/all',
    }).then(function (data) {
        if (data.error) {
            location.href = '/';
            return;
        }
        // capture inventory object from resp for table display
        var inventory = data.inventory[0];

        // process inventory / window models into HTML table
        let trHTML = '';
        $.each(data.inventory[0].windows, function(i, window) {
            trHTML += '<tr><td>' + inventory.id + '</td><td>' + inventory.date + '</td><td>' + window.start_time + '</td><td>' + window.end_time + '</td><td>' + window.current_res_count + '</td><td>' + window.max_res_count + '</td></tr>';
        });
        $('#curr-inv-tbl').append(trHTML);
    })
}