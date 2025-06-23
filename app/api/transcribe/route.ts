import { type NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

export const maxDuration = 30;

// Helper function to convert a file to a Buffer
async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(req: NextRequest) {
  try {
    const formData: any = await req.formData();
    const file = formData.get('audio') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided.' }, { status: 400 });
    }

    const audioBuffer = await fileToBuffer(file);

    // Create a new FormData to forward to DeepInfra
    const deepInfraFormData = new FormData();
    // Re-create the file as a Blob to be appended, which is expected by FormData
    const audioBlob = new Blob([audioBuffer], { type: file.type });
    deepInfraFormData.append('audio', audioBlob, file.name);
    deepInfraFormData.append('model', 'whisper-large-v3');

    const response = await fetch('https://api.deepinfra.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.DEEPINFRA_API_KEY}`,
      },
      body: deepInfraFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepInfra API Error:', errorText);
      return NextResponse.json({ error: 'Failed to transcribe audio.', details: errorText }, { status: response.status });
    }

    const result = await response.json();
    const transcription = result.text;

    return NextResponse.json({ transcription }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('Transcription endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
} 