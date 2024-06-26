# HuskSheet-Group7 (Team 1)

HuskSheets is a collaborsative spreadsheet program that allows spreadsheets to be created, saved, and worked on by serveral users simultaneously. 

## To Run the Project

-   `make build`

    -   Builds and runs the project and runs all tests in one step
    -   Note: The tests take a moment to run

-   To change ther base API URL run `make build endpoint={API_BASE_URL}`

## Project status

-   We have implemented all of the MVP and desirables features

## Bonus features

-   New user creation and login
    -   Users can create a new account and login as a subscriber or a publisher
-   Dynamic size of the sheet
    -   The sheet can be expanded by the user
-   Persistent login
    -   Users can stay logged in even after relaoding the page or
        navigating to a different page
-   Private sheets
    -   Users can create private sheets that only they can access by appending
        "-private" to the end of the sheet name
-   Server performance improvements
    -   We have optimized the server to reduce network overhead to the minimum
        level required and we have reduced the number of db queries necessary
        in normal operation
-   Export sheet as CSV
-   Duplicate sheet names
    -   One user may have multiple sheets with the same name
    -   Each occurance will have a number automatically appended to the end of the sheet
