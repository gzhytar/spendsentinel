import { NextRequest, NextResponse } from 'next/server';
import { ifsPartResolution } from '@/ai/flows/ifs-part-resolution';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const result = await ifsPartResolution(data);
  return NextResponse.json(result);
} 