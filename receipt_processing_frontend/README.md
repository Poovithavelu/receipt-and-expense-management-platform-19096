# Receipt Processing Frontend (React)

A lightweight React frontend for uploading receipts/documents, tracking OCR processing, searching/managing documents, viewing expense overviews, and accessing admin stats.

## Features
- Upload images/PDFs with metadata
- Monitor processing status
- Search and manage documents (view, edit category/notes, delete)
- Expenses overview with category/time aggregations
- Admin dashboard for platform stats
- Responsive, themeable UI without heavy frameworks

## Environment Variables
Create a `.env` file at the project root (same folder as package.json) and set:
```
REACT_APP_BACKEND_BASE_URL=http://localhost:8080
```
See `.env.example` for reference. Do not include a trailing slash.

## Scripts
- `npm start` - Start dev server
- `npm test` - Run tests
- `npm run build` - Production build

## API Integration
All calls are centralized in `src/services/api.js`. Adjust `REACT_APP_BACKEND_BASE_URL` to point to your SpringBoot backend. Endpoints expected:
- POST `/documents` - upload
- GET `/documents` - list/search (supports q,page,pageSize,status,category)
- GET `/documents/{id}` - details
- PUT `/documents/{id}` - update metadata
- DELETE `/documents/{id}` - delete
- GET `/documents/{id}/status` - processing status
- GET `/analytics/expenses-overview` - expense aggregates
- GET `/admin/stats` - admin stats

If your backend differs, update `api.js` accordingly.

## Pages and Routes
- `/` Home
- `/upload` Upload
- `/status` Processing status
- `/documents` Search and manage documents
- `/overview` Expenses overview
- `/admin` Admin & stats

## Styling
Theme variables defined in `src/App.css`. Navbar and components use minimal CSS for fast performance.

