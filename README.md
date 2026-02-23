# Employee Hub - ReactJS Assessment

## Overview
This app implements the assessment flow in a single-file React app (`src/App.js`) with:
1. Login page (`testuser` / `Test123`)
2. List page using API data
3. Details page for selected employee
4. Photo result page after camera capture

Extra features:
1. Salary bar chart screen
2. World map screen with exact city markers
3. Light/Dark theme toggle (default is dark mode)

## API
Endpoint:
`https://backend.jotish.in/backend_dev/gettabledata.php`

POST body:
```json
{
  "username": "test",
  "password": "123456"
}
```

The app handles original API response shape:
`TABLE_DATA.data` (array rows), and maps it to UI fields.

## Login Credentials
1. Username: `testuser`
2. Password: `Test123`

## Run Locally
1. Install dependencies:
```bash
npm install
```
2. Start app:
```bash
npm start
```
3. Open:
`http://localhost:3000`

## Build
```bash
npm run build
```

## Assignment Checklist
1. Login validation
2. API-backed list page
3. Details page on row/card click
4. Camera capture button in details
5. Photo result screen after capture
6. Chart visualization (salary)
7. Map visualization (cities)

## Output Screens
Place screenshots in a `screenshots/` folder at project root using these names.

### 1) Login Screen
![Login Screen](/output/Screenshot%202026-02-23%20113340.png)

### 2) Employee List Screen
![Employee List Screen](/output/Screenshot%202026-02-23%20113646.png)

### 3) Details + Camera Screen
![Details Camera Screen](//output/Screenshot%202026-02-23%20113712.png)

### 4) Photo Result Screen
![Photo Result Screen](/output/Screenshot%202026-02-23%20113740.png)

### 5) Salary Chart Screen
![Salary Chart Screen](/output/Screenshot%202026-02-23%20113800.png)

### 6) World Map Screen
![World Map Screen](/output/Screenshot%202026-02-23%20113847.png)

## Notes
1. Camera requires browser permission.
2. If API fails, fallback demo data is used.
3. Light mode visibility was improved for review/demo clarity.
