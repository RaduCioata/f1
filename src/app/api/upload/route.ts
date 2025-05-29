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
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const buffer = Buffer.from(await file.arrayBuffer());
  
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const uniqueFileName = `${Date.now()}-${file.name}`;
  await writeFile(join(uploadDir, uniqueFileName), buffer);
  
  return NextResponse.json({
    fileName: uniqueFileName,
    url: `/uploads/${uniqueFileName}`
  });
}

// Handle GET request to check if upload endpoint is available
export async function GET() {
  return NextResponse.json({ status: 'ready' });
} 