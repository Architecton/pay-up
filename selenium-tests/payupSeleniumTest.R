#' NAVODILA ZA ZAGANJANJE:
#' 
#' (1) $ sudo docker run -d -p 4444:4444 -v /dev/shm:/dev/shm selenium/standalone-chrome:3.141.59-dubnium
#' (2) $ sudo R
#' (3) > source('payupSeleniumTest.R')
#' 
#' 
#' Start Docker container
#' 
#' @param dockerContainer
#' @param waitTime
#'
dockerStart <- function(dockerContainer = "selenium/standalone-chrome", waitTime = 10) {
  status <- tryCatch({
    system(paste0("docker ps | grep ", dockerContainer), intern = TRUE)
  }, warning = function(war) {
    return(NA)
  }, error = function(err) {
    cat(paste0("error : ", err, "\n"))
    return(NA)
  }, finally = {})
  
  if (is.na(status)) {
    cat(paste0(date(), " :: ",
               "RUN Selenium Chrome server in Docker container '", dockerContainer, "'.\n"));
    system(paste0("docker start ", dockerContainer), ignore.stdout = TRUE)
    Sys.sleep(waitTime)
  } else {
    cat(paste0(date(), " :: ",
               "Selenium Chrome server in Docker container '", dockerContainer, "' is already running.\n"));
  }
}


#'
#' Stop Docker container
#' 
#' @param dockerContainer
#' @param waitTime
#'
dockerStop <- function(dockerContainer = "selenium/standalone-chrome", waitTime = 3) {
  status <- tryCatch({
    system(paste0("docker ps | grep ", dockerContainer), intern = TRUE)
  }, warning = function(war) {
    return(NA)
  }, error = function(err) {
    cat(paste0("Error : ", err, "\n"))
    return(NA)
  }, finally = {})
  
  if (!is.na(status)) {
    cat(paste0(date(), " :: ",
               "STOP Selenium Chrome server in Docker container '", dockerContainer, "'.\n"));
    system(paste0("docker stop ", dockerContainer), ignore.stdout = TRUE)
    Sys.sleep(waitTime)
  } else {
    cat(paste0(date(), " :: ",
               "Selenium Chrome server in Docker container '", dockerContainer, "' is already stopped.\n"));
  }
}

# Library for coloring terminal output
library(crayon)

#'
#' Inicialization of the interface to the Selenium server.
#' Accessing the starting location of the application.
#' 
prepareEnvironmentAndTest <- function() {
  libraries <- c("RSelenium", "stringr")
  invisible(sapply(libraries, function(library) {
    if (library %in% rownames(installed.packages()) == FALSE) { 
      install.packages(library) 
    }
  }))
  suppressPackageStartupMessages(suppressWarnings({
    invisible(lapply(libraries, require, character.only = TRUE))
  }))
  
  cat("Selenium initialization ... \n")
  rd <- remoteDriver(port = 4444L, browserName = "chrome")
  rd$open(silent = TRUE)
  
  cat("Accessing the root of the application... \n")
  rd$navigate(urlAddress)  # Open the starting page
  
  # CLOUD9 PREVIEW BUTTON CLICK --- REMOVE WHEN ON HEROKU
  Sys.sleep(3)
  rd$findElement("xpath", "//a[contains(@class, 'solid fat info button')]")$clickElement()

  # Website title ################################################################################################
  cat('Checking website title: ')
  Sys.sleep(3)
  if (rd$getTitle() == "PayUp") {
    cat(green("[OK]\n"))
    rd
  } else {
    cat(red("[error]"))
    NULL
  }

  # Log in modal window and log in functionality #################################################################

  cat('Checking if the log in button exists and if so, clicking it and checking the contents of the modal window: ')
  if (length(rd$findElements("xpath", "//a[contains(text(), 'Log In')]")) != 0) {
  	rd$findElement("xpath", "//a[contains(text(), 'Log In')]")$clickElement()
  	Sys.sleep(3)
	  if (unlist(rd$findElement("xpath", "//h1[@id='welcomeBackTitle']")$getElementText()) == "Welcome Back!" &&
	  	  unlist(rd$findElement("xpath", "//label[@id='usernameLabel']")$getElementText()) == "Username" &&
	  	  unlist(rd$findElement("xpath", "//label[@id='passwordLabel']")$getElementText()) == "Password") {
	    cat(green("[OK]\n"))
	    rd
	  } else {
	    cat(red("[error]\n"))
	    NULL
	  }
  } else {
  	cat(red("[error]\n"))
  	NULL
  }

  cat('Entering log in information and trying to log in: ')
  rd$findElement("xpath", "//input[@id='usernameInput']")$sendKeysToElement(list("jerry123"))
  rd$findElement("xpath", "//input[@id='passwordInput']")$sendKeysToElement(list("geselce"))
  rd$findElement("xpath", "//button[@type='submit']")$clickElement()
  Sys.sleep(3)
  if (unlist(rd$findElement("xpath", "//h2[@id='swal2-title']")$getElementText()) == "Welcome Back!") {
  	cat(green("[OK]\n"))
  } else {
  	cat(red("[error]\n"))
  	NULL
  }
  # Click on the OK button.
  rd$findElement("xpath", "//button[contains(text(), 'OK')]")$clickElement()

  # Navigation bar check ###############################################################################################

  cat("Inspecting the text of the navigation bar logged in user's drop down button: ")
  Sys.sleep(2)
  # Inspect text of drop down button.
  if (unlist(rd$findElement("xpath", "//a[@id='dropdownButton']")$getElementText()) == "Logged in as jerry123") {
	cat(green("[OK]\n"))
  } else {
  	cat(red("[error]\n"))
  	NULL
  }

  # Automatic routing to dashboard check ###############################################################################

  cat("Checking if located on /dashboard and if so, clicking the 'Contacts' button: ")
  Sys.sleep(2)
  if (length(rd$findElements("xpath", "//div[@id='dashboardMain']")) != 0 && length(rd$findElement("xpath", "//a[contains(text(), 'Contacts')]")) != 0 ) {
  	cat(green("[OK]\n"))
  } else {
  	cat(red("[error]\n"))
  	NULL
  }
  rd$findElement("xpath", "//a[contains(text(), 'Contacts')]")$clickElement()

  # Location check ######################################################################################################

  cat('Checking if located on /contacts: ')
  Sys.sleep(3)
  # Check if located on Contacts page
  if (length(rd$findElements("xpath", "//h1[contains(text(), 'Your Contacts')]")) != 0 ) {
  	cat(green("[OK]\n"))
  } else {
  	cat(red("[error]\n"))
  	NULL
  }

	# Checking contents of contacts master table ###########################################################################

  cat('Checking if contacts master table is empty: ')
  Sys.sleep(1)
  if (length(rd$findElements("xpath", "//tbody[contains(@class, 'selectableRow ng-scope')]")) == 0 ) {
  	cat(green("[OK]\n"))
  } else {
  	cat(red("[error]\n"))
  	NULL	
  }

  # Clicking the New Contact Button ######################################################################################

  cat('Checking if New Contact button exists and if so, clicking on it: ')
  Sys.sleep(1);
  if (length(rd$findElements("xpath", "//button[contains(text(), 'New Contact')]")) != 0) {
  	cat(green("[OK]\n"))
  } else {
  	cat(red("[error]\n"))
  	NULL	
  }
  rd$findElement("xpath", "//button[contains(text(), 'New Contact')]")$clickElement()

  # Inspecting the modal window contents #################################################################################

  cat('Checking contents of modal window: ')
  Sys.sleep(3)
  if (length(rd$findElements("xpath", "//b[contains(text(), 'Add New Contact')]")) != 0 &&
  	  length(rd$findElements("xpath", "//h2[contains(text(), 'Search Database for Users')]")) != 0 &&
  	  length(rd$findElements("xpath", "//b[contains(text(), 'Found users:')]")) != 0 &&
  	  length(rd$findElements("xpath", "//h2[contains(text(), 'Manually Add New Contact')]")) != 0 &&
  	  length(rd$findElements("xpath", "//b[contains(text(), 'First Name')]")) != 0 &&
  	  length(rd$findElements("xpath", "//b[contains(text(), 'Last Name')]")) != 0 &&
  	  length(rd$findElements("xpath", "//b[contains(text(), 'E-mail')]")) != 0 &&
  	  length(rd$findElements("xpath", "//b[contains(text(), 'Telephone number')]")) != 0 &&
  	  length(rd$findElements("xpath", "//b[contains(text(), 'City/Region')]")) != 0 &&
  	  length(rd$findElements("xpath", "//b[contains(text(), 'Username')]")) != 0)
  {
  	cat(green("[OK]\n"))
  } else {
  	cat(red("[error]\n"))
  	NULL
  }

  # Testing the Search and contact adding Functionality #####################################################################

  contactName <- "Mia"
  contactSurname <- "Filić"
  contactUsername <- "MiaTheGreat123"
  contactFullSearchData <- "Mia Filić, MiaTheGreat123"
  cat(sprintf("Checking if search input exists and if so, entering '%s' into it: ", contactName))
  Sys.sleep(1)
  if (length(rd$findElements("xpath", "//input[@id='databaseUserSearchField']")) != 0) {
		rd$findElement("xpath", "//input[@id='databaseUserSearchField']")$sendKeysToElement(list(contactName))
  	cat(green("[OK]\n"))
  } else {
  	cat(red("[error]\n"))
  	NULL
  }

  cat(sprintf("Checking found items in the search dropdown menu - looking for '%s'. If found, selecting it: ", contactFullSearchData))
  Sys.sleep(1)
	if (length(rd$findElements("xpath", sprintf("//option[contains(text(), '%s')]", contactFullSearchData))) != 0) {
		rd$findElement(using = 'xpath', "//select[@id = 'foundContacts']")$clickElement()
		Sys.sleep(1)
		rd$findElement(using = 'xpath', sprintf("//option[@value = '%s']", contactFullSearchData))$clickElement()
  	cat(green("[OK]\n"))
  } else {
  	cat(red("[error]\n"))
  	NULL
  }


   cat(sprintf("Checking for 'select' button and if exists, clicking it: ", contactFullSearchData))
   Sys.sleep(1)
	 if (length(rd$findElements("xpath", "//button[contains(text(), 'Select')]")) != 0) {
		rd$findElement("xpath", "//button[contains(text(), 'Select')]")$clickElement()
   	cat(green("[OK]\n"))
   } else {
   	cat(red("[error]\n"))
   	NULL
   }  

  cat("Checking if necessary input fields exist and if so, adding rest of data: ")
  Sys.sleep(1)
	if (length(rd$findElements("xpath", "//input[@id='contactName']")) != 0 && 
			length(rd$findElements("xpath", "//input[@id='contactSurname']")) != 0 &&
			length(rd$findElements("xpath", "//input[@id='contactEmail']")) != 0 &&
			length(rd$findElements("xpath", "//input[@id='contactPhone']")) != 0 &&
			length(rd$findElements("xpath", "//input[@id='contactRegion']")) != 0 &&
			length(rd$findElements("xpath", "//input[@id='contactUsername']"))) {

		contactEmail <- "mia.filic@gmail.com"
		contactPhone <- "070123456"
		contactRegion <- "Zagreb"
		rd$findElement("xpath", "//input[@id='contactEmail']")$sendKeysToElement(list("mia.filic@gmail.com"))
		rd$findElement("xpath", "//input[@id='contactPhone']")$sendKeysToElement(list("070123456"))
		rd$findElement("xpath", "//input[@id='contactRegion']")$sendKeysToElement(list("Zagreb"))
		cat(green("[OK]\n"))
	} else {
		cat(red("[error]\n"))
  	NULL	
	}

	cat("Checking if 'Add Contact' button exists and if so, clicking it: ")
	Sys.sleep(1)
	if (length(rd$findElements("xpath", "//button[contains(text(), 'Add Contact')]")) != 0) {
		rd$findElement("xpath", "//button[@type='submit']")$clickElement()
		cat(green("[OK]\n"))
	} else {
		cat(red("[error]\n"))
  	NULL	
	}

	cat("Checking if contact accepted (is a valid contact) and if so, clicking 'OK': ")
	Sys.sleep(3)
	if (length(rd$findElements("xpath", "//h2[contains(text(), 'Done!')]")) != 0) {
		rd$findElement("xpath", "//button[contains(text(), 'OK')]")$clickElement()
		cat(green("[OK]\n"))
	} else {
		cat(red("[error]\n"))
  	NULL	
	}	
	
	contactName <- "Mia"
  contactSurname <- "Filić"
  contactUsername <- "MiaTheGreat123"

	cat("Checking if added contact exists in contacts master table and if the values are correct: ")
	Sys.sleep(3)
	if (length(rd$findElements("xpath", "//tbody[contains(@class, 'selectableRow ng-scope')]")) != 0 &&
			length(rd$findElements("xpath", sprintf("//td[contains(text(), ' %s ')]", contactName))) != 0 &&
			length(rd$findElements("xpath", sprintf("//td[contains(text(), ' %s ')]", contactSurname))) != 0 &&
			length(rd$findElements("xpath", sprintf("//td[contains(text(), ' %s ')]", contactUsername))) != 0) {
		cat(green("[OK]\n"))
	} else {
		cat(red("[error]\n"))
  	NULL	
	}

  #########################################################################################################################

}

# urlAddress = "https://sp-projekt2-excogitator.c9users.io"
urlAddress = "https://sp-projekt2-excogitator.c9users.io/"

dockerStart()

rd <- prepareEnvironmentAndTest()

# testirajZOOLjubljana()
# testirajInformacijeOAplikaciji()
# testirajRegistracijoInDodajanjeKomentarja()

dockerStop()