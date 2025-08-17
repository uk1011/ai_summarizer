import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const instruction = formData.get("instruction");

    if (!file || !instruction) {
      return NextResponse.json({ error: "Missing file or instruction" }, { status: 400 });
    }

    // Prepare data for backend
    const backendForm = new FormData();
    backendForm.append("file", file);
    backendForm.append("instruction", instruction);

    // Call FastAPI backend
    const response = await fetch("http://127.0.0.1:8000/summarize/text/", {
      method: "POST",
      body: backendForm,
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
