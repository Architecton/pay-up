document.addEventListener('DOMContentLoaded', function () {

    var submitButton = document.getElementById("submitContact");
    var searchButton = document.getElementById("searchButton");

    submitButton.addEventListener('click', function () {
        //check imput fields.
        var firstNameInput = document.getElementById('firstName').value;
        var lastNameInput = document.getElementById("lastName").value;
        var telephoneNumber = document.getElementById("tel").value;
        var regionInput = document.getElementById("region").value;
        var notesInput = document.getElementById("modalNotes").value;
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
        regextest = new RegExp("[a-zA-ZčćžšđČĆŽŠĐ '.,:;!?&%/0-9]{0,1000}$").test(notesInput);
        if (!regextest || notesInput.length > 1000) {
            alertText += "\r\nNotes contain illegal characters.";
        }
        if (alertText.length > 1) {
            alert(alertText);
        }
    });
});