// loansCtrl: loans page controller
(function() {
  function loansCtrl($scope, loansData, loansList, loanManagement, authentication) {
    var vm = this;
    
    // getData; get selected loans of user with ID idUser
    vm.getData = function(idUser) {
      // Make GET request to retrieve loans data.
      loansData.loans(idUser).then(
        function success(response) {  // If response successfuly retrieved...
          vm.message = response.data.length > 0 ? "" : "No active loans found.";  // If response empty
          // Data to be exposed
          vm.data = {
            // Return user's loans
            loans: response.data
          };
        }, function error(response) {  // else if error...
          vm.message = "Error";
          console.log(response.e);
        }
      );
    };
    
    // Data needed for creating a new loan
    vm.loanData = {
        loaner: authentication.currentUser().username,
        recipient: "",
        deadline: "",
        amount: "",
        currency: "",
        interest: "",
        payment_interval: "",
        payment_amount: "",
        compoundInterest: "",
        interest_on_debt: ""
    };
    
    // sendNewLoanData: send new loan data
    vm.sendNewLoanData = function() {
      // Get currency.
      vm.loanData.currency= document.getElementById("currencySel").value;
      // Extract recipient id
      vm.loanData.recipient = vm.loanData.recipient.substring(0, vm.loanData.recipient.indexOf('(') - 1).trim();   // vm.loanData.recipient.substring(vm.loanData.recipient.indexOf(',')+2, vm.loanData.recipient.length - 1);
      // Handle form errors
      vm.formError = "";
      // If any form data is missing
      if (!vm.loanData.loaner || !vm.loanData.recipient || 
        !vm.loanData.deadline || !vm.loanData.amount || !vm.loanData.currency || !vm.loanData.interest ||
        !vm.loanData.payment_interval || !vm.loanData.payment_amount || !vm.loanData.compoundInterest || 
        !vm.loanData.interest_on_debt) {
        vm.formError = "Please fill out all the forms!";
        return false;
      // If date invalid
      } else if (vm.loanData.deadline <= new Date()) {
        vm.formError = "Invalid deadline value!";
        return false;
      // If any form data is empty
      } else if (vm.loanData.loaner.replace(/^\s+|\s+$/g, '').length == 0 || 
                 vm.loanData.recipient.replace(/^\s+|\s+$/g, '').length == 0 ||
                 vm.loanData.amount <= 0 || 
                 vm.loanData.currency.replace(/^\s+|\s+$/g, '').length == 0 || 
                 vm.loanData.interest < 0 ||
                 vm.loanData.payment_interval <= 0 || 
                 vm.loanData.payment_amount <= 0 || 
                 vm.loanData.compoundInterest != 'Yes' && vm.loanData.compoundInterest != 'No' || 
                 vm.loanData.interest_on_debt != 'Yes' && vm.loanData.interest_on_debt != 'No'
                 ) {
          vm.formError = "Please fill out all the forms!";
          /* global Swal */
          Swal({
              type: 'error',
              title: 'Error',
              text: vm.formError
            }).then(ok => {
              document.getElementById('id07').style.display='none';
            });
          return false;
      } else {
        var deadlineISO = new Date(vm.loanData.deadline);
        
        vm.loanDataProcessed = {
          loaner: vm.loanData.loaner,
          recipient: vm.loanData.recipient,
          deadline: deadlineISO.toISOString().substring(0, 10),
          amount: vm.loanData.amount,
          currency: vm.loanData.currency,
          interest: vm.loanData.interest,
          payment_interval: vm.loanData.payment_interval,
          payment_amount: vm.loanData.payment_amount,
          compoundInterest: vm.loanData.compoundInterest == 'Yes' ? true : false,
          interest_on_debt: vm.loanData.interest_on_debt == 'Yes' ? true : false
        };

        // Add loan.
        vm.addLoan();
      }
    };
    
    // addContact: add contact to currently logged in user's list of contacts.
    vm.addLoan = function() {
      vm.formError = "";
      currentUser = authentication.currentUser();  // Get currently logged in user.
      if(currentUser) {   // If logged in
        // Promp user to confirm.
        Swal({
          title: 'Confirm this loan?',
          text: "Are you sure you want to confirm this loan?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirm Loan'
        }).then((result) => {
          if (result.value) {
            loanManagement.addLoan(currentUser.username, vm.loanDataProcessed).then(function success(response) {
              Swal(
                'Loan confirmed!',
                'The loan contract is now valid.',
                'success'
              );
            }, function error(response) {
                vm.formError = "Invalid loan parameters.";
                Swal({
                  type: 'error',
                  title: 'Error',
                  text: vm.formError
                }).then(ok => {
                  document.getElementById('id07').style.display='none';
                });
            });
          }
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
    
    // Loan confirmation ///////////////////////////////////////////////////////////////
    vm.selectedLoan = {
      id: ""
    };
    
    vm.selectLoan = function(loan) {
      vm.selectedLoan = loan._id;
    };
    
    
    // Data required for loan confirmation
    vm.confirmLoanData = {
      idUser: authentication.currentUser().username,
      idLoan: ""
    };
  
    // confirmLoan: check data and make call to service that confirms loan
    vm.confirmLoan = function() {
      vm.confirmLoanData.idLoan = vm.selectedLoan;
      if (vm.confirmLoanData.idUser && vm.confirmLoanData.idLoan) {
        Swal({
          title: 'Confirm this loan?',
          text: "Are you sure you want to confirm this loan?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirm Loan'
        }).then((result) => {
          if (result.value) {
            loanManagement.confirmLoan(vm.confirmLoanData.idUser, vm.confirmLoanData.idLoan).then(function success(response) {
                // Swal success
                Swal(
                  'Loan confirmed!',
                  'The loan contract is now valid.',
                  'success'
                );
            }, function error(response) {
              // Swal error
                Swal(
                  'Error',
                  'Something went wrong. Please try again.',
                  'error'
                );
            });
          }
        });
      } else {
        // Swal error
        Swal(
          'Error',
          'Something went wrong. Please try again.',
          'error'
        );
      }
    };


    /////////////////////////////////////////////////////////////////////////////////////


    // Loan deletion ////////////////////////////////////////////////////////////////////
    
    // Data required for loan deletion
    vm.deleteLoanData = {
      idUser: authentication.currentUser().username,
      idLoan: ""
    };
    
    
    // deleteLoan: check data and make call to service that deletes loan
    vm.deleteLoan = function() {
      vm.deleteLoanData.idLoan = vm.selectedLoan;
      if (vm.deleteLoanData.idUser && vm.deleteLoanData.idLoan) {
        // Ask user to confirm
        Swal({
          title: 'Delete this loan?',
          text: "Are you sure you want to delete this loan? This action cannot be undone.",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Delete Loan Contract'
        }).then((result) => {
          if (result.value) {
              loanManagement.deleteLoan(vm.deleteLoanData.idUser, vm.deleteLoanData.idLoan).then(function success(response) {
                // Swal success
                Swal(
                  'Loan contract deleted!',
                  'The loan contract has been deleted.',
                  'success'
                );
              }, function error(response) {
                // Swal error
                Swal(
                  'Error',
                  'Something went wrong. Please try again.',
                  'error'
                );
              });    
          }
        });
      } else {
        // Swal error
        Swal(
          'Error',
          'Something went wrong. Please try again.',
          'error'
        );
      }
    };
    
    /////////////////////////////////////////////////////////////////////////////////////
    
    // Loan resolution //////////////////////////////////////////////////////////////////
    
    // Data needed for loan resolution
    vm.resolveLoanData = {
      idUser: authentication.currentUser().username,
      idLoan: "",
    };
    
    // resolveLoan: check data and make call to service that resolves loan
    vm.resolveLoan = function() {
      vm.resolveLoanData.idLoan = vm.selectedLoan;
      if (vm.resolveLoanData.idUser && vm.resolveLoanData.idLoan) {
        // Ask user to confirm
        Swal({
          title: 'Resolve this loan?',
          text: "Are you sure you want to resolve this loan? This action cannot be undone.",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Resolve Loan'
        }).then((result) => {
          if (result.value) {
              loanManagement.resolveLoan(vm.resolveLoanData.idUser, vm.resolveLoanData.idLoan).then(function success(response) {
                Swal(
                  'Loan resolved!',
                  'The loan has been sucessfully resolved!',
                  'success'
                );
              }, function error(response) {
                Swal(
                  'Error',
                  'Something went wrong. Please try again.',
                  'error'
                );
              });    
          }
        });
      } else {
        // Swal error
        Swal(
          'Error',
          'Something went wrong. Please try again.',
          'error'
        );
      }
    };
    //////////////////////////////////////////////////////////////////////////////////////
    
    loansList.getLoans(             // Pass getData and showError functions
      vm.getData, 
      vm.showError);
  }
  
  // Add controller to the app
  /* global angular */
  angular
    .module('payupApp')
    .controller('loansCtrl', loansCtrl);
})();