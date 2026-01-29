import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file content
    const text = await file.text();

    // Simple parsing logic (you can enhance this with AI)
    const lines = text.split('\n');
    const data = {
      fileName: file.name,
      fileType: file.type,
      lineCount: lines.length,
      preview: lines.slice(0, 10).join('\n'),
      extractedData: {
        contracts: [],
        payors: [],
        rates: [],
      },
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Parse error:', error);
    return NextResponse.json(
      { error: 'Failed to parse document' },
      { status: 500 }
    );
  }
}
