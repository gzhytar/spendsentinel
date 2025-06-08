// 'use server';
/**
 * @fileOverview An IFS (Internal Family Systems) part identification AI agent.
 *
 * - identifyIFSPart - A function that initiates the IFS part identification process.
 * - IdentifyIFSPartInput - The input type for the identifyIFSPart function.
 * - IdentifyIFSPartOutput - The return type for the identifyIFSPart function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyIFSPartInputSchema = z.object({
  financialSituation: z
    .string()
    .describe("A description of the user's current financial situation."),
  recentFinancialBehavior: z
    .string()
    .describe("A description of the user's recent financial behavior or decisions."),
  locale: z.string().optional().describe('The language locale to respond in (en, cs, uk, ru)'),
});
export type IdentifyIFSPartInput = z.infer<typeof IdentifyIFSPartInputSchema>;

const IFSPartDetailsSchema = z.object({
  partName: z.string().describe('The name of the identified financial part.'),
  role: z.string().describe("The role this part plays in the user's financial life."),
  burden: z.string().describe('The burden or negative belief this part carries.'),
  concern: z.string().describe("The underlying concern or fear driving this part's behavior."),
  description: z.string().describe('A one-paragraph compassionate description with a focus on the positive protective intent of the part, rewritten for clarity, simple language, and brevity.'),
  behaviors: z.array(z.string()).describe('Prominent examples of behavior of the identified part.'),
  triggers: z.array(z.string()).describe('Prominent examples of triggers of the identified part.'),
  emotions: z.array(z.string()).describe('Prominent examples of emotions over time of the identified part.'),
  innerDialogue: z.array(z.string()).describe('Prominent examples of inner dialogue of the identified part.'),
  digitalFootprints: z.array(z.string()).describe('Prominent examples of digital footprints of the identified part.'),
});

const IdentifyIFSPartOutputSchema = z.object({
  identifiedPart: IFSPartDetailsSchema.describe("Details of the identified financial part.")
});
export type IdentifyIFSPartOutput = z.infer<typeof IdentifyIFSPartOutputSchema>;

export async function identifyIFSPart(input: IdentifyIFSPartInput): Promise<IdentifyIFSPartOutput> {
  return identifyIFSPartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyIFSPartPrompt',
  input: {schema: IdentifyIFSPartInputSchema},
  output: {schema: IdentifyIFSPartOutputSchema},
  tools: [],
  prompt: `You are an AI trained in Internal Family Systems (IFS) therapy, specializing in financial behaviors. You respond in language: {{locale}}
	Your goal is to help users understand their internal 'financial parts' to improve their financial decision-making.	

	User's Financial Situation: {{{financialSituation}}}
	Recent Financial Behavior: {{{recentFinancialBehavior}}}
	User's Personality Type: {{{personalityType}}}

	Based on the provided information, identify one prominent financial part, including its role, burden, and concern.

  For the identified part, provide the following structured information:
  - partName: The name of the identified financial part.
  - role: The role this part plays in the user's financial life.
  - burden: The burden or negative belief this part carries.
  - concern: The underlying concern or fear driving this part's behavior.
  - description: Write a one-paragraph, compassionate description with a focus on the positive protective intent of the part. Rewrite it for clarity, use simple language, and make it a bit shorter.
  - behaviors: List 3-5 prominent examples of behavior of the identified part (as an array of short strings).
  - triggers: List 3-5 prominent examples of triggers of the identified part (as an array of short strings).
  - emotions: List 3-5 prominent examples of emotions over time of the identified part (as an array of short strings).
  - innerDialogue: List 3-5 prominent examples of inner dialogue of the identified part (as an array of short strings).
  - digitalFootprints: List 3-5 prominent examples of digital footprints of the identified part (as an array of short strings).

  {{#if locale}}
    IMPORTANT: Respond in language: {{locale}}
  {{/if}}

	Return the part details and the engagement suggestion in the specified JSON format.

	Example:
	{
	  "identifiedPart": {
		  "partName": "The Worrier",
		  "role": "To protect you from financial ruin by constantly worrying about money.",
		  "burden": "Believes you are incapable of managing money and will end up in poverty.",
		  "concern": "Fear of becoming homeless or unable to provide for your family.",
      "description": "The Worrier is always on alert, trying to keep you safe from financial trouble. It means well, even if it sometimes makes you anxious. Its main goal is to help you avoid mistakes and feel secure.",
      "behaviors": ["Double-checking expenses", "Avoiding big purchases", "Constantly reviewing budgets"],
      "triggers": ["Unexpected bills", "Low account balance", "Talking about money"],
      "emotions": ["Anxiety", "Restlessness", "Relief after saving"],
      "innerDialogue": ["What if I run out of money?", "I need to be careful.", "Did I forget a bill?"],
      "digitalFootprints": ["Frequent banking app checks", "Setting up alerts", "Saving financial articles"]
		}
	}

  {{#if locale}}
    IMPORTANT: Respond in language: {{locale}}
  {{/if}}
	`,
});

const identifyIFSPartFlow = ai.defineFlow(
  {
    name: 'identifyIFSPartFlow',
    inputSchema: IdentifyIFSPartInputSchema,
    outputSchema: IdentifyIFSPartOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
