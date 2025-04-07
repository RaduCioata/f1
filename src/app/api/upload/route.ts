import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Set upload size limit (100MB)
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '100mb',
  },
};

export async function POST(request: NextRequest) {
  try {
    // Check if the request is a valid multipart/form-data request
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Content type must be multipart/form-data' },
        { status: 400 }
      );
    }

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Get file details
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = file.name;
    const fileType = file.type;
    const fileSize = buffer.length;

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (fileSize > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds the 100MB limit' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate a unique filename to prevent overwriting
    const uniqueFileName = `${Date.now()}-${fileName}`;
    const filePath = join(uploadDir, uniqueFileName);
    
    // Write the file to disk
    await writeFile(filePath, buffer);
    
    // Return the file details
    return NextResponse.json({
      success: true,
      fileName: uniqueFileName,
      fileSize,
      fileType,
      url: `/uploads/${uniqueFileName}`,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: `File upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}

// Handle GET request to check if upload endpoint is available
export async function GET() {
  return NextResponse.json({
    message: 'Upload endpoint is available',
    maxSize: '100MB',
  });
} 