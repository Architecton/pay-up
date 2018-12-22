// authentication service

// authentication:
function authentication($window, $http) {
  var saveToken = function(token) {
    $window.localStorage['payup-token'] = token;
  };

  // getToken: get JWT token from local storage.
  var getToken = function() {
    $window.localStorage['payup-token'];
  };

  // signup: make a post request to sign up
  var signUp = function(user) {
    return $http.post('/api/signUp', user).then(  // WARNING!!! API DOES NOT return the JWT token on sign up. Have to log in after signing up
      function success(response) {
        saveToken(response.data.token);
      });
  };

  // logIn: make a request to log in. If successful, save token in local storage
  var logIn = function(user) {
    return $http.post('/api/logIn', user).then(
      function success(response) {
        saveToken(response.data.token);
      });
  };

  // logOut: remove JWT token from local storage
  var logOut = function() {
    $window.localStorage.removeItem('payup-token');
  };

  // isLoggedIn: check if user is logged in
  var isLoggedIn = function() {
    var token = getToken();   // Try to get token.
    if (token) {  // If token exists, get payload.
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.expirationDate > Date.now() / 1000;  // Check whether the token has expired.
    } else {
      return false;     // If no token found, return false.
    }
  };

  // currentUser: get user that is currently logged into the application (get info from JWT payload)
  var currentUser = function() {
    if (isLoggedIn()) {       // Check if user is logged in.
      var token = getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return {  // Return username, email and name as decoded from token.
        username: payload.username,
        name: payload.name,
        email: payload.email
      };
    }
  };

  // Return object containing the functions offered by this service.
  return {
    saveToken: saveToken,
    getToken: getToken,
    signUp: signUp,
    logIn: logIn,
    logOut: logOut,
    isLoggedIn: isLoggedIn,
    currentUser: currentUser
  };
}