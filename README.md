# ApplyMate

AI-powered resume analyzer and cover letter generator for job seekers.  
Built to help applicants tailor their resumes to job descriptions with real-time feedback, insights, and personalized cover letters.

---

## ✨ Features

- Upload your resume and job description
- AI-powered match score and skill gap analysis
- Instant improvement suggestions and upskilling resources
- Auto-generated cover letter tailored to each job
- Parallel job processing using BullMQ and Redis
- Scalable queue worker architecture
- Clean UI with Tailwind CSS and Next.js

---

## 🛠️ Tech Stack

**Frontend:**  
- Next.js  
- Tailwind CSS  


**Backend:**  
- Node.js + Express  
- MongoDB (Mongoose)  
- BullMQ + Redis (Upstash)  
- OpenRouter / Gemini API (AI engine)  

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/applymate.git
cd applymate
```

### 2. Install dependencies

Install both frontend and backend packages:

```bash
cd frontend
npm install

cd ../backend
npm install
```

### 3. Configure environment variables

Create `.env` files in both `frontend/` and `backend/` directories.  
Refer to `.env.example` files in each folder.

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Fill in the required secrets.

### 4. Run the app locally

```bash
# Start frontend
cd frontend
npm run dev

# Start backend
cd ../backend
npm run dev
```

---

## 📁 Project Structure

```
applymate/
├── frontend/       # Next.js frontend
├── backend/        # Express.js + MongoDB backend
├── shared/         # Shared constants/types (optional)
├── .gitignore
├── README.md
```

---

## 🧪 To Run the Worker (for processing jobs)

```bash
cd backend
npx ts-node src/workers/application.worker.ts
```

---

## 🌐 Deployment

- Frontend: Vercel  
- Backend: Render or Railway  
- Redis: Upstash (serverless)  


---


## 🙌 Feedback

Have suggestions or want to collaborate?  
Open an issue or connect with me on [LinkedIn](https://www.linkedin.com/in/sharukh-shaik-srk12/)
