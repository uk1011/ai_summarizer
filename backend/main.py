# backend/main.py
import os
import requests
from typing import List, Optional
from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

# Load .env file
load_dotenv()

app = FastAPI(title="AI Meeting Summarizer Backend")

# Allow frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ In production, set allowed origins explicitly
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== Config ==========
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
RESEND_FROM = os.getenv("RESEND_FROM", "noreply@example.com")

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT") or 587)
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
SMTP_FROM = os.getenv("SMTP_FROM", RESEND_FROM)

# ========== Helpers ==========
def call_groq(instruction: str, transcript: str):
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY not configured in .env")
    sys = ("You are a meeting minutes assistant. Output in concise Markdown "
           "with sections: TL;DR, Key Decisions, Action Items (owner, due), Risks/Blockers, Next Steps. "
           "Follow the user's instruction exactly.")
    user = f"INSTRUCTION: {instruction}\n\nTRANSCRIPT:\n{transcript}"
    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": sys},
            {"role": "user", "content": user}
        ],
        "temperature": 0.2,
        "max_tokens": 1200,
    }
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
    res = requests.post("https://api.groq.com/openai/v1/chat/completions", json=payload, headers=headers, timeout=60)
    res.raise_for_status()
    return res.json()["choices"][0]["message"]["content"].strip()

def call_openai(instruction: str, transcript: str):
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY not configured in .env")
    sys = ("You are a meeting minutes assistant. Output in concise Markdown "
           "with sections: TL;DR, Key Decisions, Action Items (owner, due), Risks/Blockers, Next Steps. "
           "Follow the user's instruction exactly.")
    user = f"INSTRUCTION: {instruction}\n\nTRANSCRIPT:\n{transcript}"
    payload = {
        "model": "gpt-4o-mini",  # or gpt-3.5-turbo
        "messages": [
            {"role": "system", "content": sys},
            {"role": "user", "content": user}
        ],
        "temperature": 0.2,
        "max_tokens": 1200,
    }
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    res = requests.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers, timeout=60)
    res.raise_for_status()
    return res.json()["choices"][0]["message"]["content"].strip()

def generate_summary(instruction: str, transcript: str):
    """
    Generate a summary using OpenAI or GROQ LLMs.
    Prioritize OpenAI if OPENAI_API_KEY is set.
    """
    try:
        if OPENAI_API_KEY:
            return call_openai(instruction, transcript)
        elif GROQ_API_KEY:
            return call_groq(instruction, transcript)
    except Exception as e:
        print("⚠️ LLM call failed:", e)

    # Fallback summarizer if no keys configured or LLM call fails
    sentences = [s.strip() for s in transcript.split(".") if s.strip()]
    top = sentences[:6]
    return f"TL;DR:\n- {'; '.join(top)}\n\n(Note: LLM not configured or failed.)"

def send_via_resend(subject: str, html: str, recipients: List[str]):
    if not RESEND_API_KEY:
        raise RuntimeError("RESEND_API_KEY not configured in .env")
    url = "https://api.resend.com/emails"
    body = {
        "from": RESEND_FROM,
        "to": recipients,
        "subject": subject,
        "html": html,
    }
    headers = {"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json"}
    res = requests.post(url, json=body, headers=headers, timeout=30)
    res.raise_for_status()
    return res.json()

def send_via_smtp(subject: str, html: str, recipients: List[str]):
    import smtplib
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText

    if not (SMTP_HOST and SMTP_USER and SMTP_PASS):
        raise RuntimeError("SMTP config missing in .env")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SMTP_FROM
    msg["To"] = ", ".join(recipients)
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(SMTP_FROM, recipients, msg.as_string())
    return {"ok": True}

# ========== Request models ==========
class SendEmailRequest(BaseModel):
    subject: str
    html: str
    recipients: List[EmailStr]

# ========== Endpoints ==========
@app.post("/summarize/")
async def summarize_endpoint(
    instruction: Optional[str] = Form(None),
    file: Optional[UploadFile] = None,
    transcript: Optional[str] = Form(None)
):
    if file:
        content = await file.read()
        try:
            transcript_text = content.decode("utf-8")
        except Exception:
            transcript_text = content.decode("latin-1", errors="ignore")
    elif transcript:
        transcript_text = transcript
    else:
        raise HTTPException(status_code=400, detail="Provide a file or transcript text.")

    if not instruction:
        instruction = "Summarize in bullet points focusing on action items, owners and deadlines."

    summary = generate_summary(instruction, transcript_text)
    return {"summary": summary}

@app.post("/send-email/")
async def send_email_endpoint(req: SendEmailRequest):
    if RESEND_API_KEY:
        try:
            r = send_via_resend(req.subject, req.html, req.recipients)
            return {"ok": True, "provider": "resend", "response": r}
        except Exception as e:
            print("⚠️ Resend failed:", e)

    if SMTP_HOST and SMTP_USER and SMTP_PASS:
        send_via_smtp(req.subject, req.html, req.recipients)
        return {"ok": True, "provider": "smtp"}

    raise HTTPException(status_code=500, detail="No email provider configured (set RESEND_API_KEY or SMTP_ vars).")
