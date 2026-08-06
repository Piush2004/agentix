import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data');
const profileFile = path.join(dataPath, 'profile.json');

// Ensure directory exists
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
}

// Ensure file exists with default values
if (!fs.existsSync(profileFile)) {
  fs.writeFileSync(profileFile, JSON.stringify({
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 'sarah@company.com',
    aiPersona: 'Executive Analyst (Recommended)',
  }, null, 2));
}

export async function GET() {
  try {
    const data = fs.readFileSync(profileFile, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read profile' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    fs.writeFileSync(profileFile, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true, profile: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
