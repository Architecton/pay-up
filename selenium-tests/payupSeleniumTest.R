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
dockerStop <- function(dockerContainer = "standalone-chrome-debug", waitTime = 3) {
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

#'
#' Inicialization of the interface to the Selenium server.
#' Accessing the starting location of the application.
#' 
prepareEnvironment <- function() {
  libraries <- c("RSelenium", "stringr")
  invisible(sapply(libraries, function(library) {
    if (library %in% rownames(installed.packages()) == FALSE) { 
      install.packages(library) 
    }
  }))
  suppressPackageStartupMessages(suppressWarnings({
    invisible(lapply(libraries, require, character.only = TRUE))
  }))
  
  cat("Selenium initialization ... ")
  rd <- remoteDriver(port = 4444L, browserName = "chrome")
  rd$open(silent = TRUE)
  
  cat("Accessing the root of the application... ")
  rd$navigate(urlAddress)  # Open the starting page
  
  # CLOUD9 PREVIEW BUTTON CLICK --- REMOVE WHEN ON HEROKU
  Sys.sleep(3)
  rd$findElement("xpath", "//a[contains(@class, 'solid fat info button')]")$clickElement()
  Sys.sleep(3)


  print(rd$getTitle())
  if (rd$getTitle() == "PayUp") {
    cat("[OK]")
    rd
  } else {
    cat("[error]")
    NULL
  }
}

#'
#' Funkcionalni test filtriranje lokacij na začetni strani in 
#' prikaz podrobnosti lokacije "ZOO Ljubljana".
#'
testirajZOOLjubljana <- function() {
  # Pojdi na začetno stran
  rd$navigate(urlAddress)
  cat("[OK] Odpri začetno stran in počakaj na GPS lokacijo.\n")
  
  # Počakaj 7 s
  Sys.sleep(7)
  
  # Preštej število lokacij
  stLokacij <- length(rd$findElements("xpath", "//div[contains(@class, 'list-group')]/div"))
  cat(ifelse(stLokacij == 2, "[OK] Našel 2 zanimivi lokaciji.\n", paste0("[NAPAKA] Našel ", stLokacija, " zanimivih lokacij.\n")));
  
  # Filtriraj lokacije na Ljubljano
  rd$findElement("xpath", "//input[@id='filter']")$sendKeysToElement(list(key = "control", "a"))
  rd$findElement("xpath", "//input[@id='filter']")$sendKeysToElement(list(key = "delete"))
  rd$findElement("xpath", "//input[@id='filter']")$sendKeysToElement(list("Ljubljana"))
  stLokacij <- length(rd$findElements("xpath", "//div[contains(@class, 'list-group')]/div"))
  cat(ifelse(stLokacij == 1, "[OK] Filtriranje uspešno.\n", paste0("[NAPAKA] Filtriranje neuspešno.\n")));
  Sys.sleep(3)
  
  # Izberi prikaz podrobnosti
  rd$findElement("xpath", "//a[contains(text(), 'ZOO Ljubljana')]")$clickElement()
  cat("[OK] Prikaži podrobnosti.\n")
  
  # Preveri podatke na strani
  Sys.sleep(3)
  naziv <- unlist(rd$findElement("xpath", "//h1")$getElementText());
  cat(ifelse(naziv == "ZOO Ljubljana", "[OK] Pravilen naslov.\n", "[NAPAKA] Napačen naslov.\n"));
  tretja_lastnost <- unlist(rd$findElement("xpath", "//h2[contains(text(), 'Lastnosti')]/../../div[@class='panel-body']/span[3]")$getElementText())
  cat(ifelse(tretja_lastnost == "parkirišče je na voljo", "[OK] 3. lastnost je pravilna.\n", "[NAPAKA] 3. lastnost je napačna.\n"));
}


#'
#' Funkcionalni test strani z informacijami o aplikaciji.
#'
testirajInformacijeOAplikaciji <- function() {
  # Pojdi na začetno stran
  rd$navigate(urlAddress)
  cat("[OK] Odpri začetno stran in počakaj na GPS lokacijo.\n")
  
  # Počakaj 7 s
  Sys.sleep(7)
  
  # Izberi informacije o aplikaciji
  rd$findElement("xpath", "//a[contains(text(), 'Informacije o aplikaciji')]")$clickElement()
  
  # Preveri vsebino strani
  Sys.sleep(3)
  naziv <- unlist(rd$findElement("xpath", "//h1")$getElementText());
  cat(ifelse(naziv == "Informacije o aplikaciji EduGeoCache", "[OK] Pravilen naslov.\n", "[NAPAKA] Napačen naslov.\n"));
  suppressMessages(tryCatch({
    rd$findElement("xpath", "//p[contains(text(), 'EduGeoCache se uporablja za iskanje zanimivih lokacij v bli\u017eini, kjer lahko odpravite dolg\u010das.')]")
    cat("[OK] Pravilno besedilo.\n")
  }, error = function(e) {
    cat("[NAPAKA] Napačno besedilo.\n")
  }))
}



testirajRegistracijoInDodajanjeKomentarja <- function() {
  # Pojdi na začetno stran
  rd$navigate(urlAddress)
  cat("[OK] Odpri začetno stran in počakaj na GPS lokacijo.\n")
  
  # Počakaj 7 s
  Sys.sleep(7)
  
  # Izberi prijavo
  rd$findElement("xpath", "//a[contains(text(), 'Prijava')]")$clickElement()
  naziv <- unlist(rd$findElement("xpath", "//h1")$getElementText())
  cat(ifelse(naziv == "Prijava v EduGeoCache", "[OK] Pravilen naslov prijavne strani.\n", "[NAPAKA] Napačen naslov prijavne strani.\n"));
  
  # Izberi registracijo
  rd$findElement("xpath", "//a[contains(text(), 'registrirajte')]")$clickElement()
  naziv <- unlist(rd$findElement("xpath", "//h1")$getElementText())
  cat(ifelse(naziv == "Kreiranje novega EduGeoCache uporabniškega računa", "[OK] Pravilen naslov registracijske strani.\n", "[NAPAKA] Napačen naslov registracijske strani.\n"));
  
  # Vnesi prijavne podatke
  rd$findElement("xpath", "//input[@id='ime']")$sendKeysToElement(list("Pia Lavbič"))
  rd$findElement("xpath", "//input[@id='elektronskiNaslov']")$sendKeysToElement(list("pia@lavbic.net"))
  rd$findElement("xpath", "//input[@id='geslo']")$sendKeysToElement(list("test"))
  cat("[OK] Prijavni podatki vnešeni.\n");
  
  # Pritisni gumb za registracijo
  rd$findElement("xpath", "//button[@type='submit']")$clickElement()
  
  # Preveri prijavljenega uporabnika
  Sys.sleep(7)
  prijavljeniUporabnik <- unlist(rd$findElement("xpath", "//li[@class='dropdown']/a")$getElementText())
  cat(ifelse(prijavljeniUporabnik == "Pia Lavbič", "[OK] Uporabnik je prijavljen.\n", "[NAPAKA] Uporabnik ni prijavljen.\n"));
  
  # Izberi podrobnosti ZOO Ljubljana
  rd$findElement("xpath", "//a[contains(text(), 'ZOO Ljubljana')]")$clickElement()
  cat("[OK] Prikaži podrobnosti.\n")
  
  # Zahtevaj dodajanje komentarja
  Sys.sleep(3)
  nazivGumba <- unlist(rd$findElement("xpath", "//a[@ng-click='vm.prikaziPojavnoOknoObrazca()']")$getElementText())
  cat(ifelse(nazivGumba == "Dodaj komentar", "[OK] Komentiranje je omogočeno.\n", "[NAPAKA] Komentiranje je onemogočeno.\n"));
  rd$findElement("xpath", "//a[@ng-click='vm.prikaziPojavnoOknoObrazca()']")$clickElement()
  
  # Vnesi komentar
  Sys.sleep(3)
  naziv <- unlist(rd$findElement("xpath", "//h4")$getElementText())
  cat(ifelse(naziv == "Dodaj komentar za ZOO Ljubljana", "[OK] Modalno okno je prikazano.\n", "[NAPAKA] Modalno okno ni prikazano.\n"));
  rd$findElement("xpath", "//option[@value='3']")$clickElement()
  rd$findElement("xpath", "//textarea[@id='komentar']")$sendKeysToElement(list("Najbolj so mi všeč igrala."))
  rd$findElement("xpath", "//button[@type='submit']")$clickElement()
  
  # Preveri vnos komentarja
  Sys.sleep(3)
  zadnjiKomentar <- rd$findElement("xpath", "(//div[contains(@class, 'komentar-vsebnik')]//div[contains(@class, 'komentar')])[1]")
  avtorKomentarja <- unlist(zadnjiKomentar$findChildElement("xpath", ".//span[contains(@class, 'komentarAvtor')]")$getElementText())
  cat(ifelse(avtorKomentarja == "Pia Lavbič", "[OK] Avtor komentarja je ustrezen.\n", "[NAPAKA] Avtor komentarja ni ustrezen.\n"));
  vsebinaKomentarja <- unlist(zadnjiKomentar$findChildElement("xpath", ".//p")$getElementText())
  cat(ifelse(vsebinaKomentarja == "Najbolj so mi všeč igrala.", "[OK] Vsebina komentarja je ustrezna.\n", "[NAPAKA] Vsebina komentarja ni ustrezna.\n"));
  
  # Odjava uporabnika
  rd$findElement("xpath", "//a[contains(text(), 'Pia Lavbič')]")$clickElement()
  rd$findElement("xpath", "//a[contains(text(), 'Odjava')]")$clickElement()
  Sys.sleep(7)
  suppressMessages(tryCatch({
    rd$findElement("xpath", "//a[contains(text(), 'Prijava')]")
    cat("[OK] Odjava uspešna.\n")
  }, error = function(e) {
    cat("[NAPAKA] Odjava neuspešna.\n")
  }))
}


# urlAddress = "https://sp-projekt2-excogitator.c9users.io"
urlAddress = "https://sp-projekt2-excogitator.c9users.io/"

dockerStart()

rd <- prepareEnvironment()

# testirajZOOLjubljana()
# testirajInformacijeOAplikaciji()
# testirajRegistracijoInDodajanjeKomentarja()

dockerStop()