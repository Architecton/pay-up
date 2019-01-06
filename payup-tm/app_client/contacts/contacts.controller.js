// dashboardCtrl: dashboard page controller
(function() {
  function contactsCtrl($scope, $uibModal, $uibModalStack, contactsData, contactsList, contactManagement, authentication) {
    // Pogled-model se generira ob kreiranju novega primerka krmilnika, zato lahko do njega preprosto dostopamo z this
    var vm = this;
    
    // getData; get contacts of user with ID idUser
    vm.getData = function(idUser, pageIndex) {
      // Make GET request to retrieve contacts data.
      contactsData.contacts(idUser, pageIndex).then(
        function success(response) {  // If response successfully retrieved...
          vm.message = response.data.length > 0 ? "" : "Empty response from server";      // If respone is empty
          // Data to be exposed
          vm.data = {                                                             // selectedLoans are the loans in the HTTP response to the GET request.
            // Return user's contacts.
            contacts: response.data
          };
        }, function error(response) {  // else if error...
          vm.message = "Error";
          console.log(response.e);
        }
      );
    };
    
    vm.contactDetails = {
      _id: "",
      name: "",
      surname: "",
      email: "",
      phone: "",
      region: "",
      username: "",
      notes: ""
    };
    
    vm.showContactDetails = function(contact) {
      vm.contactDetails._id = contact._id;
      vm.contactDetails.name = contact.name;
      vm.contactDetails.surname = contact.surname;
      vm.contactDetails.email = contact.email;
      vm.contactDetails.phone = contact.phone;
      vm.contactDetails.region = contact.region;
      vm.contactDetails.username = contact.username;
      vm.contactDetails.notes = contact.notes;
      vm.contactDetails.id = contact.id;
    };
    
    
    // Editing contact notes //////////////////
    
    // Data needed to edit notes
    vm.contactNotes = {
        idContact: "",
        notes: ""
    };
    
    vm.editnotesModalShow = function() {
      vm.loginModal = $uibModal.open({
        animation: true,
        templateUrl: 'contacts/editnotes.html',
        windowClass: 'app-modal-window',
        controller: 'notesModCtrl',
        controllerAs: 'notesvm',
        resolve: {
          parent: function () {
              return vm;
          }
        }
      });
      vm.loginModal.result.then(function(){
         
       }, function(){
         
       });
    };
    
    // sendData: send data to function that makes call to service that makes call to API
    vm.sendNotesData = function(idContact, scope) {
      vm.editNotes(idContact, scope);
    };
    
    // editNotes: edit contact's notes
    vm.editNotes = function(idContact, scope) {
      vm.contactNotes.idContact = idContact;
      vm.formError = "";
      // Check if notes are present.
      if (!vm.contactNotes.notes || vm.contactNotes.notes.replace(/^\s+|\s+$/g, '').length == 0) {
        vm.formError = "Notes must not be empty! Please try again.";
        /* global Swal */
        Swal({
            type: 'error',
            title: 'Error',
            text: vm.formError
          });
      // Check if idContact is present.
      } else if (!vm.contactNotes.idContact || vm.contactNotes.idContact.replace(/^\s+|\s+$/g, '').length == 0) {
        vm.formError = "No contact selected! Please try again.";
        Swal({
            type: 'error',
            title: 'Error',
            text: vm.formError
          }).then(function(ok) {
            $uibModalStack.dismissAll();
        });
      } else {
        // Get current logged in user.
        currentUser = authentication.currentUser();
        // If user logged in
        if(currentUser) {
          // Try to edit notes.
          contactManagement.editNotes(currentUser.username, vm.contactNotes.idContact, {"notes": vm.contactNotes.notes}).then(function success(response) {
              // If successful
              // Clear display.
              Swal('Done!', 'Contact notes successfully edited!', 'success').then(function(ok) {
                $uibModalStack.dismissAll();
                Object.keys(scope.contactDetails).forEach(function(v) { scope.contactDetails[v] = "" });
                scope.getListContacts();
                
              });
              // If error
          }, function error(response) {
              Swal({
                type: 'error',
                title: 'Error',
                text: 'Whoops! Something went wrong. Please try again!'
              }).then(function(ok) {
                $uibModalStack.dismissAll();
              });
          });
        // If JWT not found
        } else {
          vm.formError = "Error - please try logging in again.";
          Swal({
              type: 'error',
              title: 'Error',
              text: vm.formError
            }).then(function(ok) {
              $uibModalStack.dismissAll();
            });
        }
      }
    };
    
    ///////////////////////////////////////////
    
    
    // Adding new contact /////////////////////

    vm.newcontactModalShow = function() {
      vm.loginModal = $uibModal.open({
        animation: true,
        templateUrl: 'contacts/newcontact.html',
        windowClass: 'app-modal-window',
        controller: 'notesModCtrl',
        controllerAs: 'notesvm',
        resolve: {
          parent: function () {
              return vm;
          }
        }
      });
      vm.loginModal.result.then(function(){
         
       }, function(){
         
       });
    };
    

    // Data needed for creating a new contact
    vm.contactData = {
        name: "",
        surname: "",
        email: "",
        phone: "",
        region: "",
        username: ""
    };
    
    // Regular expression for testing email validity
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    // sendNewContactData: send new contact data
    vm.sendNewContactData = function(scope) {
      // Get data from fields (Reason for not using ng-model - strange "bug" when filling fields with js.)
      vm.contactData.name = document.getElementById("contactName").value;
      vm.contactData.surname = document.getElementById("contactSurname").value;
      vm.contactData.email = document.getElementById("contactEmail").value;
      vm.contactData.phone = document.getElementById("contactPhone").value;
      vm.contactData.region = document.getElementById("contactRegion").value;
      vm.contactData.username = document.getElementById("contactUsername").value;
      
      // Handle form errors
      vm.formError = "";
      // If any form data is missing
      if (!vm.contactData.name || !vm.contactData.surname || !vm.contactData.email || !vm.contactData.region || !vm.contactData.username) {
        vm.formError = "Please fill out all the forms!";
        return false;
      // If any form data is empty
      } else if (vm.contactData.name.replace(/^\s+|\s+$/g, '').length == 0 || 
                  vm.contactData.surname.replace(/^\s+|\s+$/g, '').length == 0 || 
                  vm.contactData.username.replace(/^\s+|\s+$/g, '').length == 0 ||
                  vm.contactData.region.replace(/^\s+|\s+$/g, '').length == 0 ||
                  vm.contactData.email.replace(/^\s+|\s+$/g, '').length == 0) {
          vm.formError = "Please fill out all the forms!";
          Swal({
              type: 'error',
              title: 'Error',
              text: vm.formError
            });
          return false;
      } else if (!re.test(String(vm.contactData.email).toLowerCase())) {
        vm.formError = "Invalid email format! Please try again.";
        Swal({
            type: 'error',
            title: 'Error',
            text: vm.formError
          });
        return false;
      } else {
        // Add contact.
        vm.addContact(scope);
        // Close modal window and display confirmation.
      }
    };
    
    // addContact: add contact to currently logged in user's list of contacts.
    vm.addContact = function(scope) {
      vm.formError = "";
      currentUser = authentication.currentUser();  // Get currently logged in user.
      if(currentUser) {   // If logged in
        // Add contact.
        contactManagement.addContact(currentUser.username, vm.contactData).then(function success(response) {
          // Clear contact details.
          Object.keys(scope.contactDetails).forEach(function(v) { scope.contactDetails[v] = "" });
          Swal('Done!', 'Contact successfully added!', 'success').then(function(ok) {
              scope.getListContacts(); // Get updated list of contacts.
              $uibModalStack.dismissAll();
          });
        }, function error(response) {
            vm.formError = "No user with specified username found.";
            Swal({
              type: 'error',
              title: 'Error',
              text: vm.formError
            });
        });
      } else {
        vm.formError("Error - please try logging in again.");
        Swal({
            type: 'error',
            title: 'Error',
            text: vm.formError
          }).then(function(ok) {
            $uibModalStack.dismissAll();
          });
      }
    };

    /////////////////////////////////////////
    
    // Contact Deletion /////////////////////
    
    // Data needed for contact deletion
    vm.contactDeletionData = {
      idContact: ""
    };
    
    // Delete contact: delete logged in user's contact with specified contact id
    vm.deleteContact = function() {
      vm.formError = "";
      vm.contactDeletionData.idContact = vm.contactDetails._id;
      // Check if data needed for deletion is present.
      if(vm.contactDeletionData.idContact && vm.contactDeletionData.idContact.replace(/^\s+|\s+$/g, '').length > 0) {
        // Get currently logged in user.
        currentUser = authentication.currentUser();
        // If user logged in
        if(currentUser) {
          /* Prompt user for confirmation */
          Swal({
            title: 'Delete this contact?',
            text: "Are you sure you want to delete this contact? You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete the contact!'
          }).then(function (result) {
            // if user confirmed
            if (result.value) {
              // Try to delete contact
              contactManagement.deleteContact(currentUser.username, vm.contactDeletionData.idContact).then(function success(response) {
                // If successful, show confirmation alter.
                Swal(
                  'Deleted!',
                  'Your contact has been deleted.',
                  'success'
                ).then(function(ok) {
                  // Clear display.
                  Object.keys(vm.contactDetails).forEach(function(v) { vm.contactDetails[v] = "" });
                  vm.getListContacts();
                });
              }, function error(response) {
                // Else show error alert.
                 Swal(
                  'Whoops!',
                  'Something went wrong! Please try again.',
                  'error'
                );
              });
            }
          });
        // If user not logged in
        } else {
          vm.formError = "Error - please try logging in again.";
          Swal(
              'Whoops!',
              vm.formError,
              'error'
            );
        }
      // If idContact missing
      } else {
        vm.formError = "No contact selected!";
        Swal(
          'Whoops!',
          vm.formError,
          'error'
        );
      }
    };

    /////////////////////////////////////////
    
    // Contact Sorting //////////////////////
  
    // User ordering selection value
    vm.orderSel = "";
    // Processed user ordering selection value (used as filter - actual property name)
    vm.orderProp = "";
    
    // applyOrder: apply ordering and update table of contacts.
    vm.applyOrder = function(selVal) {
      switch (selVal) {
        case 'Username':
          vm.orderProp = 'username';
          vm.getListContacts();
          break;
        case 'First name':
          vm.orderProp = 'name';
          vm.getListContacts();
          break;
        case 'Last name':
          vm.orderProp = 'surname';
          vm.getListContacts();
          break;
        default:
          vm.orderProp = 'amount';
      }
    };
  
    /////////////////////////////////////////
    
    
    // User search //////////////////////////
    // List of users to search in
    
    vm.expression = "";
    
    
    // Get list of users to display in search.
    (vm.getUsersList = function() {
      contactManagement.getSearchList().then(function success(response) {
        vm.usersList = {
          listAll: response.data.filter(function(res) { return res._id != authentication.currentUser().username })
        };
      }, function error(response) {
        vm.usersList.users = "Error Retrieving data from server.";
      });
    })();
    
    vm.selectedContact = "";
    
    vm.fillFields = function() {
      var fieldValues = {
        name : vm.selectedContact.substring(0, vm.selectedContact.indexOf(' ')),
        surname: vm.selectedContact.substring(vm.selectedContact.indexOf(' ')+1, vm.selectedContact.indexOf(',')),
        username: vm.selectedContact.substring(vm.selectedContact.indexOf(',')+2)
      };
      // Fill out the forms.
      document.getElementById("contactUsername").value = fieldValues.username;
      document.getElementById("contactName").value= fieldValues.name;
      document.getElementById("contactSurname").value= fieldValues.surname;
    };
    
    
    /////////////////////////////////////////
   
   
    // PAGINATION ////////////////////////////
    
    // number of user's contacs (retrieved from call to api)
    vm.numContacts = 0;
    contactsData.numContacts(authentication.currentUser().username).then(function succes(response) {
        vm.numContacts = Number(response.headers('numContacts'));
    });
    vm.currentPage = 1;                       // Start on page 1.
    vm.itemsPerPage = 10;                     // The number of returned results is hard coded in API (for now).
    vm.pageChange = function(currentPage) {   // Handle page change in view by retrieving the relevant page. 
      vm.getListContacts(Number(currentPage)-1);
    };
    //////////////////////////////////////////
  
    // Call to service function that retrieves the loans to be displayed on the dashboard.
    (vm.getListContacts = function (pageIndex) {
      contactsList.getContacts(             // Pass getData, showError functions and additional data
        vm.getData, 
        vm.showError,
        authentication.currentUser().username,
        pageIndex);
    })(0);
  }
  
  contactsCtrl.$inject = ['$scope', '$uibModal', '$uibModalStack', 'contactsData', 'contactsList', 'contactManagement', 'authentication'];

  
  // Add controller to the app
  /* global angular */
  angular
    .module('payupApp')
    .controller('contactsCtrl', contactsCtrl);
})();


// Controller for working with modal windows dealing with contacts
angular.module('payupApp').controller('notesModCtrl', function (parent, $uibModalInstance, $uibModalStack) {
  var notesvm = this;
  // Get parent scope
  notesvm.parentScope = parent;
  
  // cancel: called when pressing cancel or x
  notesvm.cancel = function () {
    $uibModalStack.dismissAll();
  };
  
  // Get needed data from parent scope.
  notesvm.neededData = parent.contactDetails._id;
  
});