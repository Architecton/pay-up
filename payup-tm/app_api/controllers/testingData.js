// Data used for testing purposes.


var user1 = {"name": "Jozef", 
	"surname": "Novak",
	"_id": "gozdnijoza97",
	"password": "jozef123",
	"email": "joze.novak@gmail.com",
	"gender": "m",
	"date": "2018-11-15",
	"status": 1,
	"defaultCurrency": "EUR",
	"nightmode": false,
	"loans": [{
			 "loaner": "gozdnijoza97",
			 "recipient": "manca123",
			 "dateIssued": "2018-12-05",
			 "deadline": "2018-12-15",
			 "amount": "100", 
			 "currency": "EUR", 
			 "interest": "0.05", 
			 "payment_interval": 10, 
			 "payment_amount": 10, 
			 "compoundInterest": false, 
			 "interest_on_debt": false, 
			 "status": 1}],

	 "contacts": [ {"name": "Manca",
	 "surname": "Oblak",
	 "username": "manca123",
	 "email": "manca.oblak@gmail.com"}]
};

var user2 = {"name": "Manca", 
	"surname": "Oblak",
	"_id": "manca123",
	"password": "tralalahopsasa",
	"email": "manca.oblak@gmail.com",
	"gender": "f",
	"date": "2018-12-15",
	"status": 1,
	"defaultCurrency": "EUR",
	"nightmode": false,
	"loans": [{
			 "loaner": "manca123",
			 "recipient": "gozdnijoza97",
			 "dateIssued": "2018-10-05",
			 "deadline": "2019-12-15",
			 "amount": "1000", 
			 "currency": "EUR", 
			 "interest": "0.01", 
			 "payment_interval": 10, 
			 "payment_amount": 100, 
			 "compoundInterest": true, 
			 "interest_on_debt": false, 
			 "status": 1}],

	 "contacts": [ {"name": "Jozef",
	 "surname": "Novak",
	 "username": "gozdnijoza97",
	 "email": "jozef.novak@gmail.com"}]
};

// exposes data as array of users.
module.exports.users = [user1, user2];