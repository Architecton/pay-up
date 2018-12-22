// includeHTML: include HTML from an external document on a page
// THIS FUNCTION IS CALLED AFTER "LOAD" EVENT TO FACILITATE THE CURRENCY SELECTOR
// IMPLEMENTATION.
function includeHTML() {
  // Define variables.
  var z, i, elmnt, file, xhttp;
  // loop through a collection of all HTML elements on external document.
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    // Take i-th element.
    elmnt = z[i];
    // search for elements with attribute that defines the location for the include.
    file = elmnt.getAttribute("include-external");
    // If element exists.
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          // Remove attribute and make recursive call.
          elmnt.removeAttribute("include-external");
          includeHTML();
        }
      };
      // open and send.
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
}

// includeHTML2: include HTML from an external document on a page
function includeHTML2() {
  // Define variables.
  var z, i, elmnt, file, xhttp;
  // loop through a collection of all HTML elements on external document.
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    // Take i-th element.
    elmnt = z[i];
    // search for elements with attribute that defines the location for the include.
    file = elmnt.getAttribute("include-external2");
    // If element exists.
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          // Remove attribute and make recursive call.
          elmnt.removeAttribute("include-external2");
          includeHTML();
        }
      };
      // open and send.
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
}
