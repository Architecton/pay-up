/* global Swal  */
function comfirmLoan() {
  Swal({
    title: 'Create New Loan?',
    text: "By clicking confirm, the loan recipient will get a loan contract reqest. The loan contract will come into effect once the recipient accepts the contract.",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirm!'
  }).then((result) => {
    if (result.value) {
      Swal(
        'Done!',
        'The loan contract request has been sent. You will be notified when the recipient accepts the loan contract.',
        'success'
      );
    }
  });
}

function confirmLoanMessage() {
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
      Swal(
        'Loan confirmed!',
        'The loan contract is now valid.',
        'success'
      );
    }
  });
}

function resolveLoanMessage() {
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
      Swal(
        'Loan resolved!',
        'The loan has been sucessfully resolved!',
        'success'
      );
    }
  });
}

function deleteLoanMessage() {
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
      Swal(
        'Loan contract deleted!',
        'The loan contract has been deleted.',
        'success'
      );
    }
  });
}

function welcomeSignup() {
  Swal({
    title: 'Thank you for signing up for our service!',
    text: 'Please check your inbox for the confirmation e-mail and follow the instructions there!',
    imageUrl: 'https://unsplash.it/400/200',
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: 'Custom image',
    animation: true
  });
}