# Wanderlust Planner - Proiect TIC Ducu Daria Mihaela

Aceasta este o aplicație destinată gestionării itinerariilor de călătorie. 
Utilizatorii pot crea, vizualiza, edita și șterge vacanțe, pot calcula costuri automat și pot exporta planurile în format PDF.

## Tehnologii Utilizate

* **Frontend:** Vue.js 3, Pinia (State Management).
* **Backend:** Node.js, Express.js.
* **Bază de date:** Google Firebase Firestore (NoSQL).
* **Autentificare:** Firebase Authentication.

## Structura Proiectului

* /client - Codul sursă pentru interfața utilizator (Vue.js).
* /src - API-ul și logica de backend (Express.js).
* `generareDate.js` - Script pentru generarea datelor de test.

## Instrucțiuni de Instalare și Rulare

Urmați pașii de mai jos pentru a rula aplicația local:

### 1. Configurare Backend (Server)

Deschideți un terminal în folderul src:

cd src
npm install

Pentru a popula baza de date cu date de test:

node generareDate.js


Porniți serverul:

npm start

Serverul va rula pe portul 3000.

2. Configurare Frontend (Client)

Deschideți un al doilea terminal în folderul client:

cd client
npm install


Porniți aplicația:


npm run dev

Accesați aplicația în browser la adresa: http://localhost:5173

Funcționalități Implementate

Operații CRUD: Gestionare completă a vacanțelor (Create, Read, Update, Delete).

Validare date: Verificări stricte atât pe frontend, cât și pe backend (prețuri pozitive, formate orare corecte, câmpuri obligatorii).

Filtrare și sortare: Căutare după țară și sortare după preț sau dată.

Generare PDF: Exportul itinerariului detaliat direct din browser.

Securitate: Rute protejate și validarea token-ului de autentificare.

Autor

Ducu Daria