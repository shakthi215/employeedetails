# Employee Hub - ReactJS Assessment Submission

## Overview
Employee Hub is a React application built for the assessment flow with production-style structure and UX.

Required core flow implemented:
1. Login page (`testuser` / `Test123`)
2. List page with API data
3. Details page on employee click
4. Camera capture and photo result page

Creativity features implemented:
1. Salary bar chart (first 10 employees)
2. Real world map with exact geo markers per city
3. Light/Dark theme toggle (default: dark mode)

## Credentials
1. Username: `testuser`
2. Password: `Test123`

## API
Endpoint:
`https://backend.jotish.in/backend_dev/gettabledata.php`

Request body:
```json
{
  "username": "test",
  "password": "123456"
}
```

## Improvements Implemented
1. Real routing with `react-router-dom`
2. Protected routes (unauthenticated access blocked)
3. Login persistence via `localStorage`
4. Modular architecture (pages/components/contexts/services/utils)
5. API timeout handling + retry + fallback dataset
6. Loading skeletons, empty state, and error state
7. Camera flow fix with safe stream lifecycle
8. Last captured photo saved per employee
9. Real geospatial world map (`react-leaflet`) with exact city markers
10. City click on map filters list view
11. Accessibility improvements (labels, roles, keyboard-focusable controls)
12. Performance improvements (`useMemo` + route-level lazy loading)
13. Unit and integration tests

## Folder Structure
```text
src/
  components/
    common/
    layout/
    map/
    routing/
  constants/
  contexts/
  pages/
  services/
  utils/
  __tests__/
```

## Run Locally
1. Install dependencies:
```bash
npm install
```
2. Start dev server:
```bash
npm start
```
3. Open:
`http://localhost:3000`

## Tests
Run all tests:
```bash
npm test -- --watchAll=false
```

## Production Build
```bash
npm run build
```

## Reviewer Quick Validation
1. Open `/login`
2. Login with `testuser / Test123`
3. Verify employee list renders
4. Open any employee details
5. Start camera, capture photo, verify photo result page
6. Open Salary Chart and World Map pages
7. On map, click a city marker and confirm list opens filtered by city

## Notes
1. Camera requires browser permission.
2. If API is unreachable, app automatically shows fallback demo data with a status banner.
3. Theme defaults to dark mode and can be toggled from the header.

## Design/Engineering Decisions
1. Context providers were used to avoid prop-drilling and keep state predictable.
2. Employee data fetching is centralized in `EmployeeContext` for retry/fallback consistency.
3. Map uses exact lat/lng coordinates for deterministic marker positions.
4. Route-based lazy loading keeps initial load smaller and improves responsiveness.

## Screenshots
Add screenshots before final submission:
1. `screenshots/login.png`
2. `screenshots/list.png`
3. `screenshots/details-camera.png`
4. `screenshots/photo-result.png`
5. `screenshots/salary-chart.png`
6. `screenshots/world-map.png`
