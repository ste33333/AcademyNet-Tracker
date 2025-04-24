# AcademyNet7 StaffTracker

Applicazione Web Full-stack per la gestione delle attività settimanali del personale. Sviluppata come progetto formativo/dimostrativo delle nozioni apprese in un'Academy .NET.

## Descrizione

StaffTracker permette agli utenti (attualmente con login simulato) di visualizzare una lista di dipendenti ("Worker"), vedere i dettagli di ciascun dipendente e gestire le attività lavorative settimanali ("WeekWork") associate.

Il progetto è strutturato come monorepo contenente:
* **Frontend:** Applicazione Single Page Application (SPA) sviluppata con Angular.
* **Backend:** API RESTful sviluppata con ASP.NET Core Web API.
* **Database:** Script con lo schema per la creazione del DB usato su SQL Server.

## Tecnologie Utilizzate

* **Frontend:**
    * Angular (~19)
    * TypeScript
    * Bootstrap 5 & Bootstrap Icons (per UI e stile)
    * RxJS
    * Angular CLI
* **Backend:**
    * .NET 8 
    * C#
    * Entity Framework Core (Database-First) 
    * SQL Server

## Funzionalità Implementate

* Login Utente (Simulato con credenziali mock)
* Protezione delle Rotte tramite AuthGuard
* Visualizzazione Lista Lavoratori (`/workers`) con :
    * Visualizzazione Informazioni Lavoratore (`/workers/:enrollment`) con lista attività associate
    * Modifica dei Dati Anagrafici del Worker (UPDATE) 
* Visualizzazione Lista Generale Attività Settimanali (`/weekworks`)
* CRUD completo per le Attività Settimanali (WeekWork) tramite modale nella sezione `/weekworks`:
    * Aggiunta nuova attività (con selezione Worker)
    * Modifica attività esistente
    * Eliminazione attività (con conferma)

## Setup e Installazione Locale

Per eseguire il progetto localmente, segui questi passaggi:

**Prerequisiti:**
* [.NET SDK](https://dotnet.microsoft.com/download) (Versione 8, corrispondente al backend)
* [Node.js e npm](https://nodejs.org/) (Ultima versione LTS consigliata)
* [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
* [SQL Server](https://www.microsoft.com/sql-server/sql-server-downloads) (Express o Developer edition vanno bene)
* [SQL Server Management Studio (SSMS)](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms) (o altro tool per DB SQL)
* Git

**Passaggi:**

1.  **Clona il Repository:**
    ```bash
    git clone [https://github.com/ste33333/nome-tuo-repo.git](https://github.com/ste33333/nome-tuo-repo.git)
    cd nome-tuo-repo
    ```

2.  **Setup Database:**
    * Apri SSMS (o il tuo tool SQL).
    * Crea un nuovo database (es. chiamato `AcademyNet7_Local`).
    * Esegui lo script SQL fornito nella cartella `/database/schema_e_dati.sql` (se lo hai creato e committato) su questo nuovo database per creare tabelle e inserire dati iniziali.
    * **Configura Connection String:** Apri il file `backend/AcademyApi/appsettings.Development.json`. Modifica la stringa di connessione `DbAcademyNet7` affinché punti al TUO server SQL locale e al database appena creato.
        *Esempio:*
        ```json
        "ConnectionStrings": {
          "DbAcademyNet7": "Server=TUO_NOME_SERVER;Database=AcademyNet7_Local;Integrated Security=True;Encrypt=False;TrustServerCertificate=True;"
        }
        ```
        *Nota: `appsettings.Development.json` di solito non viene committato su Git per motivi di sicurezza. In un progetto reale si userebbero User Secrets o altre configurazioni.*

3.  **Avvia il Backend:**
    * Apri un terminale nella cartella `backend/AcademyApi`.
    * Esegui `dotnet restore` (dovrebbe essere automatico all'apertura in VS o con `dotnet run`).
    * Esegui `dotnet run`. L'API dovrebbe avviarsi (solitamente su `https://localhost:7087` o simile - controlla l'output).

4.  **Avvia il Frontend:**
    * Apri un **secondo** terminale nella cartella `frontend`.
    * Esegui `npm install` per installare le dipendenze.
    * Esegui `ng serve` (o `ng serve -o` per aprire il browser automaticamente).
    * Apri il browser e naviga a `http://localhost:4200`.

## Utilizzo

* Accedi utilizzando le credenziali predefinite:
    * Email: `esempio@libero.it`
    * Password: `123`
* Naviga tra le sezioni "Workers" e "WeekWorks" usando la sidebar.
* Nella sezione "WeekWorks", puoi aggiungere, modificare o eliminare le attività.

## Miglioramenti Futuri ...

* Sostituire l'autenticazione simulata con un sistema reale (es. JWT con endpoint API dedicati).
* Migliorare la gestione degli errori e il feedback utente.
* Aggiungere paginazione o filtri alle liste se diventano lunghe.
