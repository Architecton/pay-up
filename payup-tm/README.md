PayUp™

The application, that we have envisioned, is a tool for personal financial loan management. It does not perform transactions, it merely keeps track of them.
A user can register an account, which allows thim to add users to his own associate list, from which he can create loans.

1. Sites:

index.html - The main web page of the application. It contains a logo, short description of the app and the team, along with development news. The user can access other parts of the application using an always-present navigation bar, which changes dynamically when the user logs on.
https://bitbucket.org/yannick97/payup-tm/src/master/docs/index.html
https://bitbucket.org/yannick97/payup-tm/src/master/docs/comingSoon.html
https://bitbucket.org/yannick97/payup-tm/src/master/docs/patchnotes.html
             
dashboard.html - User's main control panel, which becomes accessible when the user logs on. Here, he can see and his loans and 
access the main functionalities of the app - user and loan management.
https://bitbucket.org/yannick97/payup-tm/src/master/docs/dashboard.html
                 
contacts.html - A control subpanel, where the user can see a list of all his contacts. Contacts can be added manually or from a database of existing users. When a contact is selected, more information about him appears.
https://bitbucket.org/yannick97/payup-tm/src/master/docs/contacts.html
                
loans.html - A control subpanel, which enables the user to create, delete and edit his loans. The list of loans can be sorted and filtered. When a loan is selected from the list, editing options open on the right side of the page. Whenever a loan is edited, it's status is set to "pending" until both parties agree with the change.
https://bitbucket.org/yannick97/payup-tm/src/master/docs/loans.html

signup.html - A webpage, where a usern can register his account. All the input fields are checked client-side with HTML and JavaScript and server-side with mongoose schemas.
https://bitbucket.org/yannick97/payup-tm/src/master/docs/signup.html
              
Difference between browsers:
Microsoft Edge displays borders which are slightly darker in color.

2. List of allowed input for input fields:
Common fields:
Username: Can only consist of letters and numbers and cannot be longer than 50 characters.
Password: Can only consist of letters and numbers and must be between 8 and 50 characters long.
First name: Must start with a capital letter, followed by a maximum of 49 letters of any case. Apostrophes are allowed.
Last name/s: Each last name must start with a capital letter, followed by a maximum of 49 letters of any case. Apostrophes are allowed.
Email: All valid email formats.

Page specific:
Avatar: User's profile picture.
Loan name: Can consist of letters and numbers with a maximum length of 50.
Repayment deadline: A standard date input.
Loan size: A standard number input with a minimum of 0.01 and step of 0.01.
Payment interval: A standard integer input with a minimum of 1.
Night mode: Color pallet swap (not implemented).
Notes: An input field where the user can input characters, numbers, spaces and '.,:;!?&%/. It has a max length of 1000.
Terms and Conditions: A checkbox that has to be checked in order to create an account.

Extrenal integration:
Upon sign-up, the new uses is prompted to tick a re-captcha box.

Modal windows:
The forms for logging in, adding a new loan, and adding a new contact are implemented as modal windows.

User notifications:
We use sweetalert2 to inform the user of succesful or failed requests. For example, upon creating a new contact, the user will revceive a small
pop-up informing them that the contact has been created, or one informing them what went wrong.

API documentation:
https://tranquil-harbor-59737.herokuapp.com/api/doc/

User types:
1. Guest - can only view the application, but has the option to sign up or log in as a registered user
2. Registered user - has access to the dashboard page, which allows him to create and manage contacts and loans
3. Admin - has complete control over the app and database entries. Also has access to the /db page (accessible through the URL)

The Admin:
Upon starting the application, one admin is pre-declared in the .env file. Username: janezNovak123 Password: tralala
Janez can do whatever he wants with the app and can be used to nuke/seed the database at  will.

Page loading times:
On both Firefox and Chrome, the app functions very quickly. After the initial load (which takes some 15-20ms total), accessing any part of the website
takes < 5ms, and most of the time is spent acquiring the background images (which Chrome does not cache, but Firefox does - 
as such, the app runs slightly faster on Firefox). The page that take the longest to load due to the large number of
background images is the Home page (occasionally takes > 5ms depending on connection speed), but due to the amount of data
transfered when accessing the Loans or Contacts page, loading those takes the longest (which is still only around 40ms total for 
the Admin user, far less for conventional users)

Selenium tests: 
Included in the repository and have been carried out successfully.

User tracking:
Included with Google Analytics

Apache JMeter:
Ran and tested with .jmcx files included in repository.
Tested on Aljaž's laptop, handled around 7000 users before becoming too slow for non-frustrating use:
Intel(R) Core(TM) i7-6700HQ CPU @ 3.20GHz
32.0 GB RAM
M.2 SSD
Windows10 Home 64-bit

Compatible devices:
desktop computer, laptop computer, tablet, mobile phone

3. Heroku app: 
Instructions (commands are meant to be run without "):
1. Clone the payup-tm repository.
2. Open a new bash window, navigate to payup-tm/mongodb and run "mongod".
3. Navigate to payup-tm on the original bash window.
4. Run "npm install".
5. Run "npm start".
6. Click on Preview->Preview running application.