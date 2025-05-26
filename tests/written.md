# Testy pro GHBnav (po aktualizaci)

## Development environment

### /
- Data
    - Načetly se názvy místností z databáze
    - Načetly se přednastavené cesty
    - načetly se časté cesty (pokud jsou povolené)
- Funkcionalita
    - Lze vybrat počátek a konec?
    - Funguje kliknutí na "Navigovat"?
    - Funguje kliknutí na "Navigovat" u přednastavených cest?
    - Funguje kliknutí na "Navigovat" u častých cest?
    - Zablokuje se navigovat, když:
        - Nic nevyberu?
        - Vyberu stejné věci?
        - Vyberu jen konec?
- Vzhled
    - Výběr barviček?
    - "GHBnav"
    - "Mapa"
    - "Správce"
    - ANO cookies banner?

### /map
- Data
    - Načetly se názvy místností z databáze
    - Načetly se data pro mapu?
- Funkcionalita
    - Lze vybrat počátek a konec?
    - Funguje kliknutí na "Navigovat"?
    - Funguje kliknutí na "Vymazat navigaci"?
    - Zablokuje se navigovat, když:
        - Nic nevyberu?
        - Vyberu stejné věci?
        - Vyberu jen konec?
    - Funguje výběr "Zde stojím" a "Navigovat" a "Změnit cíl navigace"?
        - Alert když vyberu stejné body z mapy
    - Zoom, pohyb, změna patra v navigaci
- Vzhled
    - Výběr barviček?
    - "GHBnav"
    - "Mapa"
    - "Správce"
    - NE cookies banner?
- Navigace
    - Dva body na stejném patře
    - Cíl výš než start
    - Start výš než cíl
    - Body na stejném patře, ale musí přes jiné patro

### /loading
- Vzhled
    - Výběr barviček?
    - "GHBnav"
    - "Mapa"
    - "Správce"
    - NE cookies banner?
- Funkcionalita
    - Vrácení na main page po 10 sekundách?

### /auth
- Vzhled
    - Výběr barviček?
    - "GHBnav"
    - "Mapa"
    - "Správce"
    - ANO cookies banner?
- Funkcionalita
    - Funguje login?

### /sec
- Vzhled
    - Výběr barviček?
    - "GHBnav"
    - "Mapa"
    - "Zabezpečená část"
    - "Odhlásit se"
    - NE cookies banner?
- Funkcionalita
    - Fungují odkazy na další stránky?
    - Funguje odhlášení?

### /sec/markers
- Vzhled
    - Výběr barviček?
    - "GHBnav"
    - "Mapa"
    - "Zabezpečená část"
    - "Odhlásit se"
    - NE cookies banner?
    - "Zpět"
- Funkcionalita
    - Zobrazení ikon?
    - "Vytisknout všechny QR kódy"?
    - Jde změnit (s uložením)
        - Budova
        - Název
        - Ikona
        - Naviogvatelný
        - Vytištění QR kódu?
    - "Uložit změny"?
    - "Zrušit změny"?
- Data
    - Načetla se všechna data o markerech? 

### /sec/markers/print
- Vzhled
    - Výběr barviček?
    - "GHBnav"
    - "Mapa"
    - "Zabezpečená část"
    - "Odhlásit se"
    - NE cookies banner?
    - "Zpět"
- Funkcionalita
    - Jsou QR kódy funkční?
    - Mají GHBnav logo?
    - Funguje tlačítko tisk?
        - Bílé pozadí
        - Správné rozložení QR kódů?
- Data
    - Jsou QR kódy?
    - Jsou funkční? 

### /sec/paths
- Vzhled
    - Výběr barviček?
    - "GHBnav"
    - "Mapa"
    - "Zabezpečená část"
    - "Odhlásit se"
    - NE cookies banner?
    - "Zpět"
- Funkcionalita
    - Upozornění před přechodem na "Zobrazit všechny cesty"?
- Data

### /sec/paths/all
- Vzhled
    - Výběr barviček?
    - "GHBnav"
    - "Mapa"
    - "Zabezpečená část"
    - "Odhlásit se"
    - NE cookies banner?
    - "Zpět"
- Funkcionalita
- Data

### /sec/groups
- Vzhled
    - Výběr barviček?
    - "GHBnav"
    - "Mapa"
    - "Zabezpečená část"
    - "Odhlásit se"
    - NE cookies banner?
    - "Zpět"
- Funkcionalita
    - Jde změnit:
        - Název
        - Ikona
        - Pozice v seznamu
    - "Uložit změny"?
    - "Zrušit změny"? 
- Data
    - Načetly se skupiny?
