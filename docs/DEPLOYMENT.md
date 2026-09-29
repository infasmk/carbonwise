# CARBONWISE PRODUCTION DEPLOYMENT GUIDE

## 1. Production Architecture Overview

- **Frontend**: Hosted on **Vercel** or **AWS CloudFront + S3**.
- **Backend**: Hosted on **Render**, **Railway**, or **AWS ECS/Fargate**.
- **Database**: Managed **PostgreSQL 15+** on Neon, Supabase, or AWS RDS.
- **Reverse Proxy**: Cloudflare with SSL/TLS termination and DDoS mitigation.

---

## 2. Environment Variables

### Frontend (`.env.production`)
```env
VITE_API_URL=https://api.carbonwise.industrial/api
VITE_ENVIRONMENT=production
VITE_ENFORCE_DEMO_WATERMARK=true
```

### Backend (`.env.production`)
```env
ENVIRONMENT=production
DATABASE_URL=postgresql://user:password@db.railway.internal:5432/carbonwise
CORS_ORIGINS=["https://carbonwise.industrial", "https://app.carbonwise.industrial"]
SECRET_KEY=generate-a-cryptographically-secure-random-key
ACCESS_TOKEN_EXPIRE_MINUTES=480
```

---

## 3. Build & Deployment Steps

### Frontend Deployment (Vercel)
1. Link GitHub repository to Vercel.
2. Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Configure `VITE_API_URL` environment variable.

### Backend Deployment (Render / Railway / Docker)
Docker container specification (`backend/Dockerfile`):
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 4. Security & CORS Hardening
- Restrict `CORS_ORIGINS` to the exact production frontend domain.
- Enforce HTTPS across all communication channels.
- Run FastAPI behind a reverse proxy (e.g. Nginx or Cloudflare) with rate limiting (100 req/min per IP on upload endpoints).
