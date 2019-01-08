// loansCtrl: loans page controller
(function() {
  function loansCtrl($scope, $uibModal, $uibModalStack, $http, loansData, loansList, loanManagement, authentication) {
    var vm = this;

    // Set default currency.
    vm.defaultCurrency = authentication.currentUser().defaultCurrency;
    
    // Starting current page.
    vm.currentPage = 1;
    
    // Starting filter index.
    vm.filterIndex = 0;
    
    // getData; get selected loans of user with ID idUser
    vm.getData = function(idUser, pageIndex, filterIndex) {
      // Make GET request to retrieve loans data.
      loansData.loans(idUser, pageIndex, filterIndex).then(
        function success(response) {  // If response successfuly retrieved...
          vm.message = response.data.length > 0 ? "" : "Empty response from server";  // If response empty
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
    
    // open modal window for creating a new loan.
    vm.newloanModalShow = function() {
      vm.loginModal = $uibModal.open({
        animation: true,
        templateUrl: 'loans/newloan.html',
        windowClass: 'app-modal-window',
        controller: 'loansModCtrl',
        controllerAs: 'loansmodvm',
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
    
    
    // editData: edit data currently located at the client side.
    function editData(id, prop, newVal, scope) {
      for (var i = 0; i < scope.data.loans.length; i++) {
        if (id == scope.data.loans[i]._id) {
          scope.data.loans[i][prop] = newVal;
        }
      }
    }
    
    
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
    vm.sendNewLoanData = function(scope) {
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
            }).then(function(ok) {
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
        vm.addLoan(scope);
      }
    };
    
    // addContact: add contact to currently logged in user's list of contacts.
    vm.addLoan = function(scope) {
      vm.formError = "";
      currentUser = authentication.currentUser();  // Get currently logged in user.
      if(currentUser) {   // If logged in
        // Promp user to confirm.
        Swal({
          title: 'Send loan contact request?',
          text: "Are you sure you want to send this loan contract request?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Send request'
        }).then(function(result) {
          if (result.value) {
            loanManagement.addLoan(currentUser.username, vm.loanDataProcessed).then(function success(response) {
              // Update list of loans
              Swal(
                'Contract request sent!',
                'The loan contract request has been sent.',
                'success'
              ).then(function(ok) {
                scope.getListLoans(vm.currentPage-1, vm.filterIndex);
                $uibModalStack.dismissAll();
              });
            }, function error(response) {
                vm.formError = "Invalid loan parameters.";
                Swal({
                  type: 'error',
                  title: 'Error',
                  text: vm.formError
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
          }).then(function(ok) {
            $uibModalStack.dismissAll();
          });
      }
    };
    
    // Loan confirmation ///////////////////////////////////////////////////////////////
    vm.selectedLoan = "";
    vm.currency = "";
    
    vm.selectLoan = function(loan) {
      vm.selectedLoan = loan._id;
      vm.currency = loan.currency;
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
        }).then(function(result) {
          if (result.value) {
            loanManagement.confirmLoan(vm.confirmLoanData.idUser, vm.confirmLoanData.idLoan).then(function success(response) {
                // Update list of loans
                editData(vm.confirmLoanData.idLoan, 'status', 'active', vm);
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
                  'Cannot confirm this loan!',
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
        }).then(function(result) {
          if (result.value) {
              loanManagement.deleteLoan(vm.deleteLoanData.idUser, vm.deleteLoanData.idLoan).then(function success(response) {
                // Update loan list
                for (var i = 0; i < vm.data.loans.length; i++) {
                  if (vm.deleteLoanData.idLoan == vm.data.loans[i]._id) {
                    vm.data.loans.splice(i, 1);
                  }
                }
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
        }).then(function(result) {
          if (result.value) {
              loanManagement.resolveLoan(vm.resolveLoanData.idUser, vm.resolveLoanData.idLoan).then(function success(response) {
                // Update list of loans
                editData(vm.resolveLoanData.idLoan, 'status', 'resolved', vm);
                Swal(
                  'Loan resolved!',
                  'The loan has been successfully resolved!',
                  'success'
                );
              }, function error(response) {
                Swal(
                  'Error',
                  'Cannot resolve this loan!',
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
    
    // Loan filtering //////////////////////////////
    
    // filters
    vm.noFilter = function (item) {
      return true;
    };
    
    vm.pendingFilter = function (item) { 
      return item.status == 'pending';
    };
    
    vm.activeFilter = function (item) { 
      return item.status == 'active';
    };
    
    vm.resolvedFilter = function (item) { 
      return item.status == 'resolved';
    };
    
    // Current filter (default - no filter)
    vm.currentFilter = vm.noFilter();
    
    // Value of filter selection drop down field
    vm.filterSel = "";
    
    // applyFilter: apply filtering and update table of loans.
    vm.applyFilter = function(selVal) {
      switch (selVal) {
        case 'Pending':
          vm.currentFilter = vm.pendingFilter;
          vm.filterIndex = 1;
          if (vm.numLoans > 10) {
            vm.getListLoans(vm.currentPage-1, vm.filterIndex); 
          }
          break;
        case 'Active':
          vm.currentFilter = vm.activeFilter;
          vm.filterIndex = 2;
          if (vm.numLoans > 10) {
            vm.getListLoans(vm.currentPage-1, vm.filterIndex); 
          }
          break;
        case 'Resolved':
          vm.currentFilter = vm.resolvedFilter;  
          vm.filterIndex = 3;
          if (vm.numLoans > 10) {
            vm.getListLoans(vm.currentPage-1, vm.filterIndex); 
          }
          break;
        default:
          vm.currentFilter = vm.noFilter;
          vm.filterIndex = 0;
          if (vm.numLoans > 10) {
            vm.getListLoans(vm.currentPage-1, vm.filterIndex); 
          }
      }
    };
    
    ////////////////////////////////////////////////
    
    // Loan sorting ////////////////////////////////
    
    // User ordering selection value
    vm.orderSel = "";
    // Processed user ordering selection value (used as filter - actual property name)
    vm.orderProp = "";
    
    // applyOrder: apply ordering and update table of loans.
    vm.applyOrder = function(selVal) {
      switch (selVal) {
        case 'Amount/highest':
          vm.orderProp = '-amount';
          break;
        case 'Amount/lowest':
          vm.orderProp = 'amount';
          break;
        case 'Issued/newest':
          vm.orderProp = '-dateIssued';
          break;
        case 'Issued/oldest':
          vm.orderProp = 'dateIssued';
          break;
        case 'Deadline/nearest':
          vm.orderProp = 'deadline';
          break;
        case 'Deadline/furthest':
          vm.orderProp = '-deadline';
          break;
        case 'Recipient':
          vm.orderProp = 'recipient';
          break;
        case 'Source':
          vm.orderProp = 'loaner';
          break;
        default:
          vm.orderProp = 'amount';
      }
    };
    ////////////////////////////////////////////////
    
    // Chart Drawing ///////////////////////////////
    vm.loanChartData = {
        x: [],
        y: [],
        z: []
      };
    // Get data for selected loan from server.
    vm.getChartData = function () {
      // API call
      (function getLoanChartData(idUser, idLoan) {
        return $http.get('/api/users/' + idUser + '/loans/' + idLoan + '/chartData', {
          headers: {
            Authorization: 'Bearer ' + authentication.getToken()
          }
        }).then(function success(response) {
          vm.loanChartData.x = response.data.x;
          vm.loanChartData.y = response.data.y;
          vm.loanChartData.z = response.data.z;
          // Set values to hidden input fields on html page. The inline script retrieves the data from
          // these hidden forms.
          document.getElementById('xDataChart').value = vm.loanChartData.x;
          document.getElementById('yDataChart').value = vm.loanChartData.y;
          document.getElementById('zDataChart').value = vm.loanChartData.z;
          document.getElementById('curr').value = vm.currency;
        }, function error(response) {
          console.log("Error retrieving data for chart rendering");
          console.log(response.data);
        });
      })(authentication.currentUser().username, vm.selectedLoan);
    };
    ////////////////////////////////////////////////
    
    
    // NIGHT MODE /////////////////////////////////
    
    angular.element(document).ready(function () {
      if (authentication.currentUser().nightmode) {
        document.getElementsByClassName("globalBackground")[0].style.backgroundColor = 'black';
        document.getElementsByClassName("globalBackground")[1].style.backgroundColor = 'black';
      }
    });
    
    ///////////////////////////////////////////////
    
    
    // PAGINATION ////////////////////////////
    
    // number of user's loans (retrieved from call to api)
    vm.numLoans = 0;
    loansData.numLoans(authentication.currentUser().username).then(function succes(response) {
        vm.numLoans = Number(response.headers('numLoans'));
    });
    vm.itemsPerPage = 10;                     // The number of returned results is hard coded in API (for now).
    vm.pageChange = function(currentPage) {   // Handle page change in view by retrieving the relevant page. 
      vm.getListLoans(Number(currentPage)-1, vm.filterIndex);
    };
    //////////////////////////////////////////
    
    
    
    //////////////////////////////////////////////////////////////////////////////////////
    (vm.getListLoans = function(pageIndex, filterIndex) {
      loansList.getLoans(             // Pass getData and showError functions
        vm.getData,
        vm.showError,
        authentication.currentUser().username,
        pageIndex,
        filterIndex);   // PAGE INDEX
    })(0, 0);
  }
  
  loansCtrl.$inject = ['$scope', '$uibModal', '$uibModalStack', '$http', 'loansData', 'loansList', 'loanManagement', 'authentication'];
  
  // Add controller to the app
  /* global angular */
  angular
    .module('payupApp')
    .controller('loansCtrl', loansCtrl);
})();


// Controller for working with modal windows dealing with loans
angular.module('payupApp').controller('loansModCtrl', ['parent', '$uibModalInstance', '$uibModalStack', function (parent, $uibModalInstance, $uibModalStack) {
  var loansmodvm = this;
  // Get parent scope
  loansmodvm.parentScope = parent;
  
  // cancel: called when pressing cancel or x
  loansmodvm.cancel = function () {
    $uibModalStack.dismissAll();
  };
}]);