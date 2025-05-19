import { NextRequest, NextResponse } from 'next/server';
import { identifyIFSPart } from '@/ai/flows/ifs-part-identification';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await identifyIFSPart(data);
  return NextResponse.json(result);
} 