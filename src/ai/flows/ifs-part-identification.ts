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
});

const IdentifyIFSPartOutputSchema = z.object({
  identifiedPart: IFSPartDetailsSchema.describe("Details of the identified financial part."),
  suggestedEngagement: z
    .string()
    .describe("A suggestion on how to engage with the part following the 6F framework (Find, Focus, Flesh out, Feel toward, Befriend, Fears) to help understand the user's financial parts."),
});
export type IdentifyIFSPartOutput = z.infer<typeof IdentifyIFSPartOutputSchema>;

const decideEngagementTool = ai.defineTool({
  name: 'decideEngagement',
  description: "Decides how to best engage with the user's part following the 6F framework (Find, Focus, Flesh out, Feel toward, Befriend, Fears) to help understand the user's financial parts.",
  inputSchema: z.object({
    partName: z.string().describe("The name of the identified financial part."),
    role: z.string().describe("The role this part plays in the user's financial life."),
    burden: z.string().describe("The burden or negative belief this part carries."),
    concern: z.string().describe("The underlying concern or fear driving this part's behavior."),
  }),
  outputSchema: z.string(),
},
async input => {
  // Placeholder implementation for deciding engagement strategy
  // In a real application, this would contain logic to tailor the engagement
  // based on the user's personality type and the identified part's details.
  return `Describe in details how to engage with the part following the 6F framework (Find, Focus, Flesh out, Feel toward, Befriend, Fears) to help understand the user's ${input.partName} financial parts.`;
});

export async function identifyIFSPart(input: IdentifyIFSPartInput): Promise<IdentifyIFSPartOutput> {
  return identifyIFSPartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyIFSPartPrompt',
  input: {schema: IdentifyIFSPartInputSchema},
  output: {schema: IdentifyIFSPartOutputSchema},
  tools: [decideEngagementTool],
  prompt: `You are an AI trained in Internal Family Systems (IFS) therapy, specializing in financial behaviors. You respond in language: {{locale}}
	Your goal is to help users understand their internal 'financial parts' to improve their financial decision-making.	

	User's Financial Situation: {{{financialSituation}}}
	Recent Financial Behavior: {{{recentFinancialBehavior}}}
	User's Personality Type: {{{personalityType}}}

	Based on the provided information, identify one prominent financial part, including its role, burden, and concern.
	Then, use the decideEngagement tool to determine the best way to communicate with the user about this part, considering their personality.

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
		  "concern": "Fear of becoming homeless or unable to provide for your family."
		},
		"suggestedEngagement": "Engage with The Worrier by acknowledging their concerns and reassuring them that you are taking steps to ensure financial stability."
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
