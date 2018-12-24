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
      console.log(vm.loanData.compoundInterest != 'Yes' || vm.loanData.compoundInterest != 'No' || 
                 vm.loanData.interest_on_debt != 'Yes' || vm.loanData.interest_on_debt != 'No');
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

        // Add loan
        console.log(vm.loanDataProcessed);
        //vm.addLoan();
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
            // Add loan
            loanManagement.addLoan(currentUser.username, vm.loanData).then(function success(response) {
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