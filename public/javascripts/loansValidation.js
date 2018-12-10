document.addEventListener('DOMContentLoaded', function () {

    var submitLoan = document.getElementById("submitLoan");
    var loanNameInput = document.getElementById("search_loanByName");

    // for loan filtering
    loanNameInput.addEventListener("keypress", function () {
        var key = e.which || e.keyCode;
        if (key === 13) {
            var regextest = new RegExp("[a-zA-ZčćžšđČĆŽŠĐ0-9]{1,50}$").test(loanNameInput);
            if (!regextest || loanNameInput.length < 1 || loanNameInput.length > 50) {
                alert("Loan name can only consist of letters and numbers and cannot be longer than 50 characters.")
            }
        }
    });

    submitLoan.addEventListener('click', function () {
        //check imput fields.
        var usernameInput = document.getElementById('recipientUsername').value;
        var dateInput = document.getElementById("loanCreateDate").value;
        var amountInput = document.getElementById("loanCreateAmount").value;
        var interestInput = document.getElementById("loanCreateInterest").value;
        var intervalInput = document.getElementById("loanCreatePaymentInterval").value;
        var alertText = "";

        var regextest = new RegExp("[a-zA-ZčćžšđČĆŽŠĐ0-9]{1,50}$").test(usernameInput);
        if (!regextest || usernameInput.length < 1 || usernameInput.length > 50) {
            alertText += "Username can only consist of letters and numbers and cannot be longer than 50 characters.";
        }
        if (!(Object.prototype.toString.call(new Date(dateInput)) === "[object Date]")) {
            //console.log(Object.prototype.toString.call(Date.parse(dateInput)));
            alertText += "\r\nDate is not valid.";
        }
        if (isNaN(amountInput)) {
            alertText += "\r\nAmount is not valid.";
        }
        if (isNaN(interestInput)) {
            alertText += "\r\nInterest is not valid.";
        }
        if (isNaN(intervalInput)) {
            alertText += "\r\nInterval is not valid."
        }
        if (alertText.length > 1) {
            alert(alertText);
        }
    });
});