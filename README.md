# AI Meeting Summarizer

**Full-Stack AI-Powered Meeting Notes Summarizer and Sharer**  
Built with **Next.js** (frontend) and **FastAPI** (backend).

---

## Table of Contents

- [Overview](#overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Backend Setup](#backend-setup)  
  - [Frontend Setup](#frontend-setup)  
- [Usage](#usage)  
- [API Keys Configuration](#api-keys-configuration)  
- [Deployment](#deployment)  
- [Project Documentation](#project-documentation)  
- [Learn More](#learn-more)  

---

## Overview

This application allows users to:

- Upload meeting transcripts or paste text.  
- Provide custom instructions for summarization (e.g., “Highlight action items”).  
- Generate structured summaries automatically using AI.  
- Edit summaries before sharing.  
- Send summaries via email using Resend or SMTP.  

---

## Features

- **AI-powered summarization** with OpenAI or Groq LLM models.  
- **Editable summary output** for manual adjustments.  
- **Email sharing** functionality.  
- **Frontend**: Basic Next.js app for simplicity and fast interaction.  
- **Backend**: FastAPI with robust LLM and email integrations.  

---

## Tech Stack

| Layer      | Technology           |
|-----------|---------------------|
| Frontend  | Next.js, TailwindCSS |
| Backend   | FastAPI, Python      |
| AI Models | OpenAI GPT-4o-mini, Groq LLaMA |
| Email     | Resend API or SMTP   |
| Deployment| Vercel (frontend), Render/Railway (backend) |

---

## Getting Started

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
Create and activate a virtual environment:

bash
Copy code
python -m venv venv
# Windows
venv\Scripts\activate
# Linux / Mac
source venv/bin/activate
Install dependencies:

bash
Copy code
pip install -r requirements.txt
Run the backend server:

bash
Copy code
uvicorn main:app --reload
Backend will be available at: http://127.0.0.1:8000

Frontend Setup
Install dependencies:

bash
Copy code
npm install
Start the development server:

bash
Copy code
npm run dev
Open http://localhost:3000 in your browser.

Usage
Upload your meeting transcript or paste it directly.

Provide a custom instruction (optional).

Click Generate Summary.

Review or edit the AI-generated summary.

Enter recipient email addresses.

Click Send Email to share.

API Keys Configuration
Create a .env file in the backend folder:

env
Copy code
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant
RESEND_API_KEY=your_resend_api_key
RESEND_FROM="Meeting Bot <onboarding@resend.dev>"
Optional SMTP configuration:

env
Copy code
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
SMTP_FROM="Meeting Bot <onboarding@resend.dev>"
Deployment
Frontend: Deploy via Vercel.

Backend: Deploy via Render, Railway, or any FastAPI-supported cloud provider.

Project Documentation
Project_documentation.docx

Project_documentation.pdf

These files include detailed explanations of the approach, architecture, and tech stack.

Learn More
Next.js Documentation

FastAPI Documentation

OpenAI API Documentation

Groq AI Documentation

License
This project is open-source and available under the MIT License.

pgsql
Copy code

✅ This README will render neatly on GitHub with a **table of contents**, **sections**, **code blocks**, and **links**, giving it a professional and structured look.

---

If you want, I can also **write a ready-to-upload `Project_documentation.docx`** summarizing the project’s architecture, features, tech stack, and usage so your repo is fully deliverable-ready.  

Do you want me to create that next?
