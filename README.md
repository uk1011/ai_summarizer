# AI Meeting Summarizer

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).  
It is a **Full-Stack AI-powered Meeting Notes Summarizer and Sharer** using FastAPI as the backend.

## Getting Started

### Backend

1. Navigate to the backend folder:
```bash
cd backend
Create a virtual environment:

bash
Copy code
python -m venv venv
Activate the environment:

Windows:

bash
Copy code
venv\Scripts\activate
Linux/Mac:

bash
Copy code
source venv/bin/activate
Install dependencies:

bash
Copy code
pip install -r requirements.txt
Create a .env file with your API keys:

ini
Copy code
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM="Meeting Bot <onboarding@resend.dev>"
Run the backend server:

bash
Copy code
uvicorn main:app --reload
Frontend
Navigate to the project root:

bash
Copy code
cd ai_summarizer
Install frontend dependencies:

bash
Copy code
npm install
Run the development server:

bash
Copy code
npm run dev
Open http://localhost:3000 in your browser.

Usage
Upload your meeting transcript or paste it in the text box.

Provide a custom instruction (optional).

Click Generate Summary to get AI-generated meeting notes.

Edit the summary if needed.

Enter recipient emails and click Send Email to share.

Learn More
To learn more about Next.js, FastAPI, or the tools used:

Next.js Documentation - learn about Next.js features and API.

FastAPI Documentation - learn about FastAPI features and API.

OpenAI API Documentation - for GPT models integration.

Groq AI Documentation - for Groq LLM integration.

Deploy on Vercel
The easiest way to deploy your Next.js frontend is to use the Vercel Platform.
Check out the Next.js deployment documentation for more details.

The backend can be deployed on Render, Railway, or any cloud provider that supports FastAPI.

Project Documentation
Check Project_documentation.docx or Project_documentation.pdf for a detailed explanation of the approach, tech stack, and architecture.