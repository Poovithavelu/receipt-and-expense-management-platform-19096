# Receipt Processing Frontend (React)

Responsive UI for uploading, processing, managing, and searching documents (receipts/invoices) with an admin dashboard. Built with React and minimal dependencies, ready for future Figma-based design integration.

## Pages
- Upload: drag-and-drop or select files, shows upload queue
- Processing: live status view with polling
- Documents: paginated list with basic filters
- Document Details: summary, extracted fields (OCR), versions/history
- Search: advanced filters and quick results
- Admin: statistics, recent activity, system health

## Environment Variables
Do not hardcode backend URLs. Configure via `.env`:
- REACT_APP_API_BASE_URL: Base URL for the backend API (e.g., http://localhost:8080)

Create a `.env.local` for development:
```
REACT_APP_API_BASE_URL=http://localhost:8080
```

## Scripts
- npm start - start dev server
- npm test - run tests
- npm run build - production build

## Notes
- Routing: react-router-dom v6
- Global State: React Context (src/context/DocumentContext.js)
- API Client: src/services/api.js
- Styling: CSS variables with light/dark theme toggle
