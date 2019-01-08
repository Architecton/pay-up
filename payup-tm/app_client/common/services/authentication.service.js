// authentication service

// authentication:
(function() {
  function authentication($window, $http) {
    
    // Fix errors regarding UTF-8 coding.
    var b64Utf8 = function (str) {
      return decodeURIComponent(Array.prototype.map.call($window.atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    };
    
    // saveToken: save token in local storage.
    var saveToken = function(token) {
      return new Promise(function(result) {
        $window.localStorage['payup-token'] = token;  
        result(true);
      });
    };
  
    // getToken: get JWT token from local storage.
    var getToken = function() {
      return $window.localStorage['payup-token'];
    };
  
    // signup: make a post request to sign up
    var signUp = function(user, recaptchaResponse) {
      return $http.post('/api/users', {user: user, response: recaptchaResponse}).then(  // WARNING!!! API DOES NOT return the JWT token on sign up. Have to log in after signing up
        function success(response) {
          console.log(response.data.token);
        });
    };
  
    // logIn: make a request to log in. If successful, save token in local storage
    var logIn = function(user) {
      return $http.post('/api/users/login', user).then(
        function success(response) {
          saveToken(response.data.token).then(function(result) {
            if (result) {
              document.getElementById("nightmode").checked = currentUser().nightmode;
              if (currentUser().nightmode) {
                // document.getElementsByClassName("globalBackground")[0].style.backgroundColor = 'black';
                // document.getElementsByClassName("globalBackground")[1].style.backgroundColor = 'black';
                // document.documentElement.style.backgroundColor = 'black';
                // document.body.style.backgroundColor = 'black'; 
              } else {
                document.documentElement.style.backgroundColor = 'lightgrey';
                document.body.style.backgroundColor = 'lightgrey';
              } 
            }
          });
        });
    };
  
    // logOut: remove JWT token from local storage
    var logOut = function() {
      $window.localStorage.removeItem('payup-token');
      document.documentElement.style.backgroundColor = 'lightgrey';
      document.body.style.backgroundColor = 'lightgrey';
    };
  
    // isLoggedIn: check if user is logged in
    var isLoggedIn = function() {
      var token = getToken();   // Try to get token.
      if (token) {  // If token exists, get payload.
        var payload = JSON.parse(b64Utf8(token.split('.')[1]));
        return payload.expirationDate > Date.now() / 1000;  // Check whether the token has expired.
      } else {
        return false;     // If no token found, return false.
      }
    };
  
    // currentUser: get user that is currently logged into the application (get info from JWT payload)
    var currentUser = function() {
      if (isLoggedIn()) {       // Check if user is logged in.
        var token = getToken();
        var payload = JSON.parse(b64Utf8(token.split('.')[1]));
        return {  // Return username, email and name as decoded from token.
          username: payload.username,
          name: payload.name,
          surname: payload.surname,
          email: payload.email,
          nightmode: payload.nightmode,
          defaultCurrency: payload.defaultCurrency
        };
      }
    };
    
    // deletAccount: delete account from database.
    var deleteAccount = function(idUser) {
      return $http.delete('/api/users/' + idUser, {
        headers: {
          Authorization: 'Bearer ' + getToken()
        }
      }).then(function success(response) {
        // Remove stored JWT token.
        logOut();
      });
    };
    
    // updateSettings: update user's settings
    var updateSettings = function(idUser, settingsValues) {
      return $http.put('/api/users/' + idUser + '/saveSettings', settingsValues, {
        headers: {
          Authorization: 'Bearer ' + getToken()
        }
      });
    };
  
    // Return object containing the functions offered by this service.
    return {
      saveToken: saveToken,
      getToken: getToken,
      signUp: signUp,
      logIn: logIn,
      logOut: logOut,
      isLoggedIn: isLoggedIn,
      currentUser: currentUser,
      deleteAccount: deleteAccount,
      updateSettings: updateSettings
    };
  }
  
  authentication.$inject = ['$window', '$http'];
  
  // Register service
  /* global angular */
  angular
    .module('payupApp')
    .service('authentication', authentication);
})();