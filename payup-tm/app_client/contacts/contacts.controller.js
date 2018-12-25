// dashboardCtrl: dashboard page controller
(function() {
  function contactsCtrl($scope, contactsData, contactsList, contactManagement, authentication) {
    // Pogled-model se generira ob kreiranju novega primerka krmilnika, zato lahko do njega preprosto dostopamo z this
    var vm = this;
    
    // getData; get contacts of user with ID idUser
    vm.getData = function(idUser) {
      // Make GET request to retrieve contacts data.
      contactsData.contacts(idUser).then(
        function success(response) {  // If response successfuly retrieved...
          vm.message = response.data.length > 0 ? "" : "No contacts found.";      // If respone is empty
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
    
    
    // Editing contact notes //////////////////
    
    // Data needed to edit notes
    vm.contactNotes = {
        idContact: "",
        notes: ""
    };
    
    // sendData: send data to function that makes call to service that makes call to API
    vm.sendNotesData = function() {
        vm.editNotes();
    };
    
    // editNotes: edit contact's notes
    vm.editNotes = function() {
      vm.formError = "";
      // Check if notes are present.
      if (!vm.contactNotes.notes || vm.contactNotes.notes.replace(/^\s+|\s+$/g, '').length == 0) {
        vm.formError = "Notes must not be empty! Please try again.";
        /* global Swal */
        Swal({
            type: 'error',
            title: 'Error',
            text: vm.formError
          }).then(ok => {
            document.getElementById('id11').style.display='none';
          });
      // Check if idContact is present.
      } else if (!vm.contactNotes.idContact || vm.contactNotes.idContact.replace(/^\s+|\s+$/g, '').length == 0) {
        vm.formError = "No contact selected! Please try again.";
        Swal({
            type: 'error',
            title: 'Error',
            text: vm.formError
          }).then(ok => {
            document.getElementById('id11').style.display='none';
        });
      } else {
        // Get current logged in user.
        currentUser = authentication.currentUser();
        // If user logged in
        if(currentUser) {
          // Try to edit notes.
          contactManagement.editNotes(currentUser.username, vm.contactNotes.idContact, {"notes": vm.contactNotes.notes}).then(function success(response) {
              // If successful
              Swal('Done!', 'Contact notes successfully edited!', 'success').then(ok => {
                  document.getElementById('id11').style.display='none';
              });
              // If error
          }, function error(response) {
              Swal({
                type: 'error',
                title: 'Error',
                text: 'Whoops! Something went wrong. Please try again!'
              }).then(ok => {
                document.getElementById('id11').style.display='none';
              });
          });
        // If JWT not found
        } else {
          vm.formError = "Error - please try logging in again.";
          Swal({
              type: 'error',
              title: 'Error',
              text: vm.formError
            }).then(ok => {
              document.getElementById('id11').style.display='none';
            });
        }
      }
    };
    
    ///////////////////////////////////////////
    
    
    // Adding new contact /////////////////////

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
    vm.sendNewContactData = function() {
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
            }).then(ok => {
              document.getElementById('id04').style.display='none';
            });
          return false;
      } else if (!re.test(String(vm.contactData.email).toLowerCase())) {
        vm.formError = "Invalid email format! Please try again.";
        Swal({
            type: 'error',
            title: 'Error',
            text: vm.formError
          }).then(ok => {
            document.getElementById('id04').style.display='none';
          });
        return false;
      } else {
        // Add contact.
        vm.addContact();
        // Close modal window and display confirmation.
      }
    };
    
    // addContact: add contact to currently logged in user's list of contacts.
    vm.addContact = function() {
      vm.formError = "";
      currentUser = authentication.currentUser();  // Get currently logged in user.
      if(currentUser) {   // If logged in
        // Add contact.
        contactManagement.addContact(currentUser.username, vm.contactData).then(function success(response) {
          Swal('Done!', 'Contact successfully added!', 'success').then(ok => {
              document.getElementById('id04').style.display='none';    
          });
        }, function error(response) {
            vm.formError = "No user with specified username found.";
            Swal({
              type: 'error',
              title: 'Error',
              text: vm.formError
            }).then(ok => {
              document.getElementById('id04').style.display='none';
            });
        });
      } else {
        vm.formError("Error - please try logging in again.");
        Swal({
            type: 'error',
            title: 'Error',
            text: vm.formError
          }).then(ok => {
            document.getElementById('id04').style.display='none';
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
      // Check if data needed for deletion is present.
      if(vm.contactDeletionData && vm.contactDeletionData.replace(/^\s+|\s+$/g, '').length > 0) {
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
          }).then((result) => {
            // if user confirmed
            if (result.value) {
              // Try to delete contact
              contactManagement.deleteContact(currentUser.username, vm.contactDeletionData.idContact).then(function success(response) {
                // If successful, show confirmation alter.
                Swal(
                  'Deleted!',
                  'Your contact has been deleted.',
                  'success'
                );
              }, function error(response) {
                // Else show error alert.
                 Swal(
                  'Whoops!',
                  'Something went wrong! Please try again.',
                  'error'
                ) ;
              });
            }
          });
        // If user not logged in
        } else {
          vm.formError("Error - please try logging in again.");
        }
      // If idContact missing
      } else {
        vm.formError("No contact selected!");
      }
    };

    /////////////////////////////////////////
  
    // Call to service function that retrieves the loans to be displayed on the dashboard.
    contactsList.getContacts(             // Pass getData and showError functions
      vm.getData, 
      vm.showError);
  }
  
  contactsCtrl.$inject = ['$scope', 'contactsData', 'contactsList', 'contactManagement', 'authentication'];

  
  // Add controller to the app
  /* global angular */
  angular
    .module('payupApp')
    .controller('contactsCtrl', contactsCtrl);
})();