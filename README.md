# Mahim Builders — Real Estate Platform

## Stack
- **Backend**: Django 6 + Django REST Framework + JWT auth
- **Frontend**: React 19 + Vite + React Router

## Quick Start

### Backend
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser       # create your admin account
python seed_data.py                    # load demo projects & apartments
python manage.py runserver             # runs on http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                            # runs on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## Demo Accounts (after running seed_data.py)
| Role     | Email                        | Password   |
|----------|------------------------------|------------|
| Admin    | admin@mahimbuilders.com      | admin123   |
| Agent    | agent@mahimbuilders.com      | agent123   |
| Customer | customer@realstate.com       | pass123    |

## API Base
All API endpoints are under `/api/` — e.g. `http://localhost:8000/api/projects/`

## Django Admin Panel
`http://localhost:8000/admin/` — log in with your superuser credentials.
