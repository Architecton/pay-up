document.addEventListener('DOMContentLoaded', function () {

    var loginButton = document.getElementById("loginButton");

    loginButton.addEventListener('click', function () {
        //check imput fields.
        var usernameInput = document.getElementById('username').value;
        var passwordInput = document.getElementById("password").value;
        var alertText = "";

        var regextest = new RegExp("[a-zA-ZčćžšđČĆŽŠĐ0-9]{1,50}$").test(usernameInput);
        if (!regextest || usernameInput.length < 1 || usernameInput.length > 50) {
            alertText += "Username can only consist of letters and numbers and cannot be longer than 50 characters.";
        }
        regextest = new RegExp("[a-zA-ZčćžšđČĆŽŠĐ0-9]{8,50}$").test(passwordInput);
        if (!regextest || passwordInput < 8 || passwordInput > 50) {
            alertText += "\r\nPassword can only consist of letters and numbers and must be between 8 and 50 characters long."
        }

        if (alertText.length > 1) {
            alert(alertText);
        }
    });
});