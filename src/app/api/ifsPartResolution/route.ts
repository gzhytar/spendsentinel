import { NextRequest, NextResponse } from 'next/server';
import { ifsPartResolution } from '@/ai/flows/ifs-part-resolution';
import { prepareLocalizedInput } from '@/lib/api-utils';

/**
 * API route for resolving IFS parts with localization support
 */
export async function POST(req: NextRequest) {
  // Get localized input data
  const inputWithLocale = await prepareLocalizedInput(req);
  
  // Process the request
  const result = await ifsPartResolution(inputWithLocale);
  
  // Return the response
  return NextResponse.json(result);
} 