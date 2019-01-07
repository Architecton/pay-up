// Data used for testing purposes.

var user1 = {
	"name": "Zoran", 
	"surname": "Bosnić",
	"username": "ZorroTheGiant123",
	"password": "tralala",
	"email": "zoran.bosnic@gmail.com",
	"gender": "m",
};

var user2 = {
	"name": "Nikolaj", 
	"surname": "Zimic",
	"username": "minterm723",
	"password": "tralala",
	"email": "nikolaj.zimic@gmail.com",
	"gender": "m",
};

var user3 = {
	"name": "Neža", 
	"surname": "Mramor Kosta",
	"username": "soulIntegrator777",
	"password": "tralala",
	"email": "neza.mramor@gmail.com",
	"gender": "f",
};

var user4 = {
	"name": "Damir", 
	"surname": "Franetič",
	"username": "Muscles&Math122",
	"password": "tralala",
	"email": "damir.franetic@gmail.com",
	"gender": "m",
};

var user5 = {
	"name": "Borut", 
	"surname": "Robič",
	"username": "studentTerminator12",
	"password": "tralala",
	"email": "borut.robic@gmail.com",
	"gender": "m",
};

var user6 = {
	"name": "Dejan", 
	"surname": "Lavbič",
	"username": "dekiTheMaster22",
	"password": "tralala",
	"email": "dejan.lavbic@gmail.com",
	"gender": "m",
};

var user7 = {
	"name": "Mia", 
	"surname": "filić",
	"username": "MiaTheGreat123",
	"password": "tralala",
	"email": "mia.filic@gmail.com",
	"gender": "f",
};

var user8 = {
	"name": "Patricio", 
	"surname": "Bulić",
	"username": "pa3cio",
	"password": "tralala",
	"email": "patricio.bulic@gmail.com",
	"gender": "m",
};

var user9 = {
	"name": "Peter", 
	"surname": "Marijan Kink",
	"username": "mathLover7",
	"password": "tralala",
	"email": "pater.kink@gmail.com",
	"gender": "m",
};

var user10 = {
	"name": "Martin", 
	"surname": "Vuk",
	"username": "MathIsGreat007",
	"password": "tralala",
	"email": "martin.vuk@gmail.com",
	"gender": "m",
};

var user11 = {
	"name": "Aleksandard", 
	"surname": "Jurišić",
	"username": "stats4Life",
	"password": "tralala",
	"email": "aleksandar.jurisic@gmail.com",
	"gender": "m",
};

var user12 = {
	"name" : "Janez",
	"surname" : "Novak",
	"username" : "janezNovak123",
	"password" : "tralala",
	"email" : "janez.novak@gmail.com",
	"gender" : "m"
};

// exposes data as array of users.
module.exports.users = [user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, user11, user12];


// Contacts to add to specified user

var contact1 = {
	"name": "Zoran", 
	"surname": "Bosnić",
	"username": "ZorroTheGiant123",
	"email": "zoran.bosnic@gmail.com",
	"phone" : "+386123456",
	"region" : "Celje"
};

var contact2 = {
	"name": "Nikolaj", 
	"surname": "Zimic",
	"username": "minterm723",
	"email": "nikolaj.zimic@gmail.com",
	"phone" : "+386123456",
	"region" : "Celje"
};

var contact3 = {
	"name": "Neža", 
	"surname": "Mramor Kosta",
	"username": "soulIntegrator777",
	"email": "neza.mramor@gmail.com",
	"phone" : "+386123456",
	"region" : "Celje"
};

var contact4 = {
	"name": "Damir", 
	"surname": "Franetič",
	"username": "Muscles&Math122",
	"email": "damir.franetic@gmail.com",
	"phone" : "+386123456",
	"region" : "Celje"
};

var contact5 = {
	"name": "Borut", 
	"surname": "Robič",
	"username": "studentTerminator12",
	"email": "borut.robic@gmail.com",
	"phone" : "+386123456",
	"region" : "Celje"
};

var contact6 = {
	"name": "Dejan", 
	"surname": "Lavbič",
	"username": "dekiTheMaster22",
	"email": "dejan.lavbic@gmail.com",
	"phone" : "+386123456",
	"region" : "Celje"
};

var contact7 = {
	"name": "Mia", 
	"surname": "filić",
	"username": "MiaTheGreat123",
	"email": "mia.filic@gmail.com",
	"phone" : "+386123456",
	"region" : "Ljubljana"
};

var contact8 = {
	"name": "Patricio", 
	"surname": "Bulić",
	"username": "pa3cio",
	"email": "patricio.bulic@gmail.com",
	"phone" : "+386123456",
	"region" : "Celje"
};

var contact9 = {
	"name": "Peter", 
	"surname": "Marijan Kink",
	"username": "mathLover7",
	"email": "pater.kink@gmail.com",
	"phone" : "+386123456",
	"region" : "Celje"
};

var contact10 = {
	"name": "Martin", 
	"surname": "Vuk",
	"username": "MathIsGreat007",
	"email": "martin.vuk@gmail.com",
	"phone" : "+386123456",
	"region" : "Celje"
};

var contact11 = {
	"name": "Aleksandard", 
	"surname": "Jurišić",
	"username": "stats4Life",
	"email": "aleksandar.jurisic@gmail.com",
	"phone" : "+386123456",
	"region" : "Celje"
};

module.exports.contactsRecipientId = user12.username;
module.exports.contacts = [contact1, contact2, contact3, contact4, contact5, contact6, contact7, contact8, contact9, contact10, contact11];