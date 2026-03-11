# EasyXpense - Quick Start Guide

## Run the Application

### Terminal 1 - Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```
✓ Backend running on http://localhost:5000

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```
✓ Frontend running on http://localhost:3000

### Open Browser
Navigate to: http://localhost:3000

You should see:
- Title: "EasyXpense"
- Card showing: "Backend Status: EasyXpense API running"

## Troubleshooting

### MongoDB Connection Error
Make sure MongoDB is running:
```bash
# Check if MongoDB is running
mongosh
```

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: Change port in `vite.config.js`

### CORS Error
Make sure backend is running before starting frontend.
