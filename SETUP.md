# Edu-Predict Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.9 or higher) - [Download](https://www.python.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/)
- **Git** - [Download](https://git-scm.com/)
- **Docker** (optional, for containerized deployment) - [Download](https://www.docker.com/)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Raghavendrabhatbs/Edu-Predict.git
cd Edu-Predict
```

### 2. Database Setup

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# In PostgreSQL terminal:
CREATE DATABASE edu_predict;
CREATE USER edu_user WITH PASSWORD 'edu_password';
ALTER ROLE edu_user SET client_encoding TO 'utf8';
ALTER ROLE edu_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE edu_user SET default_transaction_deferrable TO on;
ALTER ROLE edu_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE edu_predict TO edu_user;
\q
```

#### Run Database Schema

```bash
psql -U edu_user -d edu_predict -f database/schema.sql
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials
# DATABASE_URL=postgresql://edu_user:edu_password@localhost:5432/edu_predict

# Start development server
npm run dev
```

The backend will run at `http://localhost:5000`

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run at `http://localhost:3000`

### 5. AI Engine Setup

```bash
cd ../ai-engine

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Start the AI service
python app.py
```

The AI engine will run at `http://localhost:5001`

## Docker Setup (Optional)

If you have Docker installed, you can run the entire application with one command:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL at `localhost:5432`
- Backend at `localhost:5000`
- AI Engine at `localhost:5001`
- Frontend at `localhost:3000`

To stop all services:

```bash
docker-compose down
```

## Accessing the Application

Once all services are running:

1. Open your browser and navigate to `http://localhost:3000`
2. Use the demo credentials to login:
   - **Student**: `student@example.com` / `password`
   - **Professor**: `prof@example.com` / `password`
   - **Counselor**: `counselor@example.com` / `password`

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://edu_user:edu_password@localhost:5432/edu_predict
DB_HOST=localhost
DB_PORT=5432
DB_NAME=edu_predict
DB_USER=edu_user
DB_PASSWORD=edu_password

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# AI Engine
AI_ENGINE_URL=http://localhost:5001

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout user

### Student
- `GET /api/students/profile` - Get student profile
- `GET /api/students/marks` - Get marks
- `GET /api/students/attendance` - Get attendance
- `GET /api/students/mental-health` - Get mental health assessment
- `POST /api/students/mental-health` - Submit mental health assessment
- `GET /api/students/career-paths` - Get career paths
- `POST /api/students/career-paths/:id/select` - Select career path
- `GET /api/students/skills` - Get skill recommendations
- `POST /api/students/professor-finder` - Request professor location
- `POST /api/students/appointments` - Request appointment

### Professor
- `GET /api/professors/profile` - Get professor profile
- `GET /api/professors/students` - Get all students
- `POST /api/professors/marks` - Upload marks
- `POST /api/professors/attendance` - Update attendance
- `GET /api/professors/students/:id/performance` - Get student performance
- `GET /api/professors/mental-health-reports` - Get mental health reports
- `POST /api/professors/students/:id/skills` - Suggest skill
- `POST /api/professors/notes` - Upload notes

### Counselor
- `GET /api/counselors/profile` - Get counselor profile
- `GET /api/counselors/dashboard` - Get mental health dashboard
- `GET /api/counselors/at-risk-students` - Get at-risk students
- `GET /api/counselors/appointments/requests` - Get appointment requests
- `PUT /api/counselors/appointments/:id` - Accept appointment
- `POST /api/counselors/appointments/request/:studentId` - Request appointment
- `POST /api/counselors/appointments/:id/follow-up` - Schedule follow-up

## AI Engine Endpoints

- `GET /health` - Health check
- `POST /api/predict/mental-health` - Predict mental health
- `POST /api/predict/performance` - Predict performance
- `POST /api/predict/dropout-risk` - Predict dropout risk
- `POST /api/recommend/career-path` - Recommend career path
- `POST /api/recommend/skills` - Recommend skills

## Troubleshooting

### Port Already in Use

If a port is already in use, you can change it in the respective configuration:

**Backend**: Update `PORT` in `.env`
**Frontend**: Update port in `vite.config.ts`
**AI Engine**: Update port in `app.py` (last line)

### Database Connection Error

Ensure:
1. PostgreSQL is running
2. Database and user are created
3. `DATABASE_URL` in `.env` is correct
4. Database schema has been imported

### Python Dependencies Error

Try updating pip and reinstalling:

```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

### Node Module Issues

Delete and reinstall node modules:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

### Backend Deployment (Heroku)

```bash
# Create Heroku app
heroku create edu-predict-api

# Set environment variables
heroku config:set DATABASE_URL="your-production-db-url"
heroku config:set JWT_SECRET="your-production-secret"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

### AI Engine Deployment (Railway/Heroku)

```bash
# Create Procfile in ai-engine directory
echo "web: gunicorn app:app" > Procfile

# Deploy to Heroku
heroku create edu-predict-ai
git push heroku main
```

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the API documentation
3. Open an issue on GitHub
4. Check the project documentation

## License

MIT License - See LICENSE file for details
