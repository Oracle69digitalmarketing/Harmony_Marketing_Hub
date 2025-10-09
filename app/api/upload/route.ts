import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  // In the next steps, we'll add the logic to upload the file to S3.
  // For now, we'll just return a success message.

  return NextResponse.json({ success: true });
}