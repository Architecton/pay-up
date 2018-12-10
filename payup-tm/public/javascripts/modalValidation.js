document.addEventListener('DOMContentLoaded', function () {

    var loginButton = document.getElementById("modalLogin");
    var submitContact=document.getElementById("modalSubmitContact");

    loginButton.addEventListener('click', function () {
        //check imput fields.
        var usernameInput = document.getElementById('modalUsername').value;
        var passwordInput = document.getElementById("modalPassword").value;
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

    submitContact.addEventListener("click",function () {
        var firstNameInput = document.getElementById('modalFirstName').value;
        var lastNameInput = document.getElementById("modalLastName").value;
        var telephoneNumber = document.getElementById("modalTel").value;
        var regionInput = document.getElementById("modalRegion").value;
        var alertText = "";

        var regextest = new RegExp("[A-ZČĆŽŠĐ][a-zčćžšđA-ZČĆŽŠĐ']{1,50}$").test(firstNameInput);
        if (!regextest || firstNameInput.length < 1 || firstNameInput.length > 50) {
            alertText += "First name must start with a capital letter, followed by a maximum of 49 letters of any case. Apostrophes are allowed.";
        }
        regextest = new RegExp("(?=.{1,50}$)(([A-ZČĆŽŠĐ][a-zčćžšđA-ZČĆŽŠĐ']{1,50})+ *)+").test(lastNameInput);
        if (!regextest || lastNameInput < 1 || lastNameInput > 50) {
            alertText += "\r\nEach last name must start with a capital letter, followed by a maximum of 49 letters of any case. Apostrophes are allowed."
        }
        regextest = new RegExp("(\\+(\\d\\s?){11})|((\\d\\s?){7}((\\d\\s?){2})?)").test(telephoneNumber);
        if (!regextest || telephoneNumber.length < 7 || telephoneNumber > 11) {
            alertText += "\r\nPhone number must include at least 9 digits.";
        }
        regextest = new RegExp("[a-zA-ZčćžšđČĆŽŠĐ '0-9]{1,70}$").test(regionInput);
        if (!regextest || regionInput < 1 || regionInput > 70) {
            alertText += "\r\nCity/region name must be between 1 and 70 characters long.";
        }
        if (alertText.length > 1) {
            alert(alertText);
        }
    });
});