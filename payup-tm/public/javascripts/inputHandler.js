/* global jQuery */


(function ($) {
    $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery);

$(document).ready(function($) {
    $('form').submit(function (e) {
        e.preventDefault();
        var data = $(this).serializeFormJSON();
        console.log(data);
    
        /* Object example
            email: "value"
            name: "value"
            password: "value"
         */
    });
});

var currentlySelectedLoadID = "Select a loan from the table to edit."

$(document).ready(function($) {
    $(".loanTableRow").click(function() {
        console.log("click");
        var json = {identifier: $(this).find('td')[0].innerHTML};
        currentlySelectedLoadID = json.identifier
        document.getElementById('loanParagraph').innerHTML = currentlySelectedLoadID;
    });
});

// On selection of a contact from the contacts table, request more information from server and display it
$(document).ready(function($) {
    $(".contactsTableRow").click(function() {
        // SHOULD GET DETAILED USER JSON FROM DATABASE HERE!

        var json = {
            identifier: $(this).find('td')[0].innerHTML, 
            name: $(this).find('td')[1].innerHTML, 
            surname: $(this).find('td')[2].innerHTML, 
            email: $(this).find('td')[3].innerHTML, 
            note: $(this).find('td')[4].innerHTML
        };
        console.log(json);
        
        $(extraContactInfo).empty();
        $("<li>" + json.name + " " + json.surname + "</li>").appendTo(extraContactInfo);
        $("<li>" + json.identifier + "</li>").appendTo(extraContactInfo);
        $("<li>" + json.email + "</li>").appendTo(extraContactInfo);
        $("<li><p>" + json.note + "</p></li>").appendTo(extraContactInfo);
    });
});


$(document).ready(function($) {
    $(select_userType).change(function() {
        var tableArray = $('table.loanTable tbody tr').get().map(function(row) {
          return $(row).find('td').get().map(function(cell) {
            return $(cell).html();
          });
        });
        
        
        var party = 1;
        switch($(this).val()){
            case "Recepient":
                party = 2;
                break;
            case "Source":
                party = 1;
                break;
        }
        if ($(searchLoansUsername).val() != ""){
            $(loansTableBody).empty();
            tableArray = sortLoansByUsername(tableArray, $(searchLoansUsername).val(), party);
            tableArray.forEach(function(entry){
                $(  "<tr class='table-row loanTableRow'>" +
                    "<td style='display:none'>" + entry[0] + "</td>" +
                    "<td>" + entry[1] + "</td>" + 
                    "<td>" + entry[2] + "</td>" +
                    "<td>" + entry[3] + "</td>" +
                    "<td>" + entry[4] + "</td>" +
                    "<td>" + entry[5] + "</td>" +
                    "<td>" + entry[6] + "</td>" +
                    "<td>" + entry[7] + "</td>" +
                    "<td>" + entry[8] + "</td>" +
                    "<td>" + entry[9] + "</td>" + 
                    "</tr>"
                ).appendTo(loansTableBody);
            });
        }
    });
});

function sortLoansByUsername(loans, username, party){
    for (var i = 0; i < loans.length; i++){
        
        if (loans[i][party] == username && i > 0){
            var index = i;
            do {
                var temp = loans[i];
                loans[i] = loans[i-1];
                loans[i-1] = temp;
                i--;
            } while (i > 0 && loans[i-1][party] != username)
            i = index;
        }
        
    }
    return loans;
}


$(document).ready(function($) {
    $(select_loanSort).change(function() {
        var tableArray = $('table.loanTable tbody tr').get().map(function(row) {
          return $(row).find('td').get().map(function(cell) {
            return $(cell).html();
          });
        });
        $(loansTableBody).empty();
        
        var key = 1;
        var direction = 0;
        switch($(this).val()){
            case "Issued/newest":
                key = 3;
                direction = 0
                break;
            case "Issued/oldest":
                key = 3;
                direction = 1
                break;
            case "Deadline/nearest":
                key = 4;
                direction = 1
                break;
            case "Deadline/furthest":
                key = 4;
                direction = 0
                break;
            case "Amount/lowest":
                key = 5;
                direction = 1
                break;
            case "Amount/highest":
                key = 5;
                direction = 0
                break;
        }
        
        tableArray = sortLoansByKey(tableArray, key, direction);
        
        tableArray.forEach(function(entry){
            $(  "<tr class='table-row loanTableRow'>" +
                "<td style='display:none'>" + entry[0] + "</td>" +
                "<td>" + entry[1] + "</td>" + 
                "<td>" + entry[2] + "</td>" +
                "<td>" + entry[3] + "</td>" +
                "<td>" + entry[4] + "</td>" +
                "<td>" + entry[5] + "</td>" +
                "<td>" + entry[6] + "</td>" +
                "<td>" + entry[7] + "</td>" +
                "<td>" + entry[8] + "</td>" +
                "<td>" + entry[9] + "</td>" + 
                "</tr>"
            ).appendTo(loansTableBody);
        });
    });
});


function sortLoansByKey(loans, key, direction){
    var swapped;
    do {
        swapped = false;
        for (var i=0; i < loans.length-1; i++){
            if (direction == 0){
                if (loans[i][key] < loans[i+1][key]){
                    var temp = loans[i];
                    loans[i] = loans[i+1];
                    loans[i+1] = temp;
                    swapped = true;
                }
            }
            else {
                if (loans[i][key] > loans[i+1][key]){
                    var temp = loans[i];
                    loans[i] = loans[i+1];
                    loans[i+1] = temp;
                    swapped = true;
                }
            }
        }
    } while(swapped);
    return loans;
}

function convertLoansTableToJSON() {
    var rows = [];
    $('loansTableBody tr').each(function(i, n){
        var $row = $(n);
        rows.push({
        id: $row.find('td:eq(0)').text(),
        source: $row.find('td:eq(1)').text(),
        recepient: $row.find('td:eq(2)').text(),
        issued: $row.find('td:eq(3)').text(),
        deadline: $row.find('td:eq(4)').text(),
        amount: $row.find('td:eq(5)').text(),
        currency: $row.find('td:eq(6)').text(),
        interest: $row.find('td:eq(7)').text(),
        interest_type: $row.find('td:eq(8)').text(),
        status: $row.find('td:eq(9)').text()
        });
    });
    return JSON.stringify(rows);
};