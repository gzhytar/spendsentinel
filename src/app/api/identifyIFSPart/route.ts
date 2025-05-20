import { NextRequest, NextResponse } from 'next/server';
import { identifyIFSPart } from '@/ai/flows/ifs-part-identification';
import { prepareLocalizedInput } from '@/lib/api-utils';

/**
 * API route for identifying IFS parts with localization support
 */
export async function POST(req: NextRequest) {
  // Get localized input data
  const inputWithLocale = await prepareLocalizedInput(req);
  
  // Process the request
  const result = await identifyIFSPart(inputWithLocale);
  
  // Return the response
  return NextResponse.json(result);
} 