/* global jQuery */

var currentlySelectedLoadID = "Select a loan from the table to edit."

$(document).ready(function($) {
    $(".loanTableRow").click(function() {
        console.log("click");
        var json = {identifier: $(this).find('td')[0].innerHTML};
        currentlySelectedLoadID = json.identifier
        document.getElementById('loanParagraph').innerHTML = currentlySelectedLoadID;
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

