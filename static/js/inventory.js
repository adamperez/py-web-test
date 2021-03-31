$(document).ready(function () {
    // hide inventory if empty
    $.ajax({
        type: 'GET',
        url: '/inventory/all',
        success: function() {
            refreshInventoryDisplay();
        },
        error: function() {
            $('#curr-inv-tbl').hide();
        }
    })
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
        // show inv table clear it for fresh data
        $('#curr-inv-tbl').show();
        $('#curr-inv-tbl').find("tr:gt(0)").remove();

        var flatInv = flattenInventory(data);

        // capture inventory object from resp for table display
        var inventory = data.inventory[0];

        // process inventory / window models into HTML table
        let trHTML = '';
        $.each(flatInv, function(i, res) {
            trHTML += '<tr><td>' + res.id + '</td><td>' + res.date + '</td><td>' + res.start_time + '</td><td>' + res.end_time + '</td><td>' + res.current_res_count + '</td><td>' + res.max_res_count + '</td><td>' + res.window_status + '</td></tr>';
        });
        $('#curr-inv-tbl').append(trHTML);
    })
}

function flattenInventory(data) {
    // flatten json structure for inventory from backend to easily parse/display on front end
    var allInv = [];
    for (i = 0; i < data.inventory.length; i++) {
        var currInv = data.inventory[i];
        for (j = 0; j < currInv.windows.length; j++) {
            var flatInv = {};
            flatInv['id'] = currInv.id;
            flatInv['date'] = currInv.date;
            flatInv['start_time'] = currInv.windows[j].start_time;
            flatInv['start_time'] = currInv.windows[j].start_time;
            flatInv['end_time'] = currInv.windows[j].end_time;
            flatInv['current_res_count'] = currInv.windows[j].current_res_count;
            flatInv['max_res_count'] = currInv.windows[j].max_res_count;
            flatInv['window_status'] = flatInv['current_res_count'] == flatInv['max_res_count'] ? 'Filled' : 'Available'
            allInv.push(flatInv);
        }
    }
    return allInv;
}