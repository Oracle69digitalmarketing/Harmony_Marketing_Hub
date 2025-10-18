// This is a mock API endpoint to simulate a file upload.
// In a real application, this would upload the file to a service like Amazon S3.
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ message: "No file found in request" }, { status: 400 });
    }

    // Simulate a successful upload by generating a fake file ID.
    const fileId = uuidv4();

    console.log(`Simulated upload of file: ${(file as File).name}, assigned ID: ${fileId}`);

    // Return a success response with the fake file ID.
    return NextResponse.json({ success: true, fileId: fileId });

  } catch (error) {
    console.error("Error in mock upload:", error);
    return NextResponse.json(
      { message: "Error processing upload" },
      { status: 500 }
    );
  }
}
