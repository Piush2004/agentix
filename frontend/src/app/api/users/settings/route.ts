import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data');
const settingsFile = path.join(dataPath, 'settings.json');

// Ensure directory exists
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
}

// Ensure file exists with default values
if (!fs.existsSync(settingsFile)) {
  fs.writeFileSync(settingsFile, JSON.stringify({
    llmProvider: 'OpenAI (GPT-4o)',
    apiKey: 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx',
    engineUrl: 'http://localhost:8000',
    webhookEndpoint: '',
    theme: 'Light Mode'
  }, null, 2));
}

export async function GET() {
  try {
    const data = fs.readFileSync(settingsFile, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    fs.writeFileSync(settingsFile, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true, settings: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
