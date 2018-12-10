document.addEventListener('DOMContentLoaded', function (event) {

    var submitButton = document.getElementById("signupConfirmButton");

    submitButton.addEventListener('click', function () {
        //check imput fields.
        var firstNameInput = document.getElementById('signup_name').value;
        var lastNameInput = document.getElementById("signup_surname").value;
        var username = document.getElementById("signup_username").value;
        var password = document.getElementById("signup_password").value;
        var confirmPassword = document.getElementById("signup_confirmPassword").value;
        var TOS = document.getElementById("signupId_termsAndConditions").checked;
        var alertText = "";

        var regextest = new RegExp("[A-ZČĆŽŠĐ][a-zčćžšđA-ZČĆŽŠĐ']{1,50}$").test(firstNameInput);
        if (!regextest || firstNameInput.length < 1 || firstNameInput.length > 50) {
            alertText += "First name must start with a capital letter, followed by a maximum of 49 letters of any case. Apostrophes are allowed.";
        }
        regextest = new RegExp("(?=.{1,50}$)(([A-ZČĆŽŠĐ][a-zčćžšđA-ZČĆŽŠĐ']{1,50})+ *)+").test(lastNameInput);
        if (!regextest || lastNameInput < 1 || lastNameInput > 50) {
            alertText += "\r\nEach last name must start with a capital letter, followed by a maximum of 49 letters of any case. Apostrophes are allowed."
        }
        regextest = new RegExp("[a-zA-ZčćžšđČĆŽŠĐ0-9]{1,50}$").test(username);
        if (!regextest || username.length < 1 || username.length > username) {
            alertText += "\r\nUsername can only consist of letters and numbers and cannot be longer than 50 characters.";
        }
        regextest = new RegExp("[a-zA-ZčćžšđČĆŽŠĐ0-9]{8,50}$").test(password);
        if (!regextest || password < 8 || password > 50 || confirmPassword !== password) {
            alertText += "\r\nPassword can only consist of letters and numbers and must be between 8 and 50 characters long and must match the 'Confirm password' field.";
        }
        if (!TOS) {
            alertText += "\r\nIn order to use our services, you must agree with the Terms of Service.";
        }

        if (alertText.length > 1) {
            alert(alertText);
        }
    });
});