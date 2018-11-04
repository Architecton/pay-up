PayUp™

Aplikacija,ki smo si jo zamislili,je orodje za upravljanje z zasebnimi finančnimi posojili. Aplikacije ne služi izvajanju transakcij, temveč le hranjenju dokumentacije le-teh.
Uporabnik se v aplikacijo registrira in s tem pridobi uporabniški račun, kar mu omogoča dodajanje ostalih uporabnikov na svoj seznam znancev in izvajanje posojim med seboj in njimi.

Zaslonske maske:

index.html - glavna naslovna stran aplikacije. Vsebuje logotip, kratek opis aplikacije in ekipe razvijalcev, ter povezave na novice o razvoju (patchnotes, upcoming features). Uporabnik se lahko premika
             po ostalih straneh aplikacije preko vedno prisotne navigacijske vrstice, ki se dinamično spreminja ob prijavi uporabnika.
             https://bitbucket.org/yannick97/payup-tm/src/master/docs/index.html
             https://bitbucket.org/yannick97/payup-tm/src/master/docs/comingSoon.html
             https://bitbucket.org/yannick97/payup-tm/src/master/docs/patchnotes.html
             
dashboard.html - glavna nadzorna plošča uporabnika. Ob prijavi lahko uporabnik dostopa do svoje nadzorne plošče, na kateri vidi nekaj svojih priljubljenih posojil (ki jih lahko izbere glede na željene parametre)
                 in dostopa do glavnih funkcionalnosti aplikacije - upravljanje znancev in posojil.
                 https://bitbucket.org/yannick97/payup-tm/src/master/docs/dashboard.html
                 
contacts.html - podokno nadzorne plošče, na katerem uporabnik vidi seznam vseh svojih znancev. Ob izboru znanca s seznama se uporabniku izpišejo njegovi podatki in odpre opcija za novo posojilo. Uporabnik lahko znance
                znance dodaja ročno ali pa preko iskanje v bazi podatkov. Z izborom znanca v tabeli se prikažejo natančnejši podatki o uporabniku (master-detail).
                https://bitbucket.org/yannick97/payup-tm/src/master/docs/contacts.html
                
loans.html - podokno nadzorne plošče, ki omogoča uporabniku kreiranje, brisanje, in urejanje posojil. Uporabnik lahko tabelo posojil sortira po želji ali pa išče posojila, ki vključijejo določeno osebo. Ob izboru posojila
             s seznama se v stranskem oknu odprejo možnoti urejanja, pri čemer vsaka sprememba aktivnega posojila status nastavi na "pending" dokler obe osebi ne potrdita spememebe. Pri tem se uporablja tudi zunanji API, ki
             uporabniku avtomatsko pretvoril denarni znesek v željeno valuto.
             https://bitbucket.org/yannick97/payup-tm/src/master/docs/loans.html

signup.html - Okno, kjer se bodoči uporabnik lahko registrira za uporabo aplikacije. Obrazec zahteva podatke, katerih ustreznost se nato preverja preko JavaScripta.
              https://bitbucket.org/yannick97/payup-tm/src/master/docs/signup.html
              
Razlike med izgledi na različnih brskalnikih:
Microsoft Edge prikazuje obrobo rahlo temnejše barve