'use server';

/**
 * @fileOverview This file defines a Genkit flow for resolving IFS parts, specifically financial "firefighter" parts.
 *
 * It uses the 6F framework (Find, Focus, Flesh out, Feel toward, Befriend, Fears) to understand the part's role, burden, and concern.
 *
 * @interface IFSPartResolutionInput - Input for the ifsPartResolution function, including the part's name and a description of its behavior.
 * @interface IFSPartResolutionOutput - Output of the ifsPartResolution function, containing the surfaced role, burden, and concern of the part.
 * @function ifsPartResolution - Main function to resolve an IFS part.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IFSPartResolutionInputSchema = z.object({
  partName: z.string().describe('The name of the financial firefighter part.'),
  partBehavior: z
    .string()
    .describe('A description of the behavior of the financial firefighter part.'),
  locale: z.string().optional().describe('The language locale to respond in (en, cs, ru)')
});
export type IFSPartResolutionInput = z.infer<typeof IFSPartResolutionInputSchema>;

const IFSPartResolutionOutputSchema = z.object({
  role: z.string().describe('The role of the part within the financial system.'),
  burden: z.string().describe('The burden the part carries.'),
  concern: z.string().describe('The underlying concern driving the part.'),
  engagementStrategy: z.enum(['direct', 'gentle', 'validation']).describe(
    'A proposed strategy to engage with the part, depending on the user personality and the part itself. "direct" should be used for direct/action oriented people that want to tackle the issue head on. "gentle" is for people that get easily overwhelmed and need a more compassionate approach. "validation" is for those who need to have their concerns acknowledged.'
  ),
});
export type IFSPartResolutionOutput = z.infer<typeof IFSPartResolutionOutputSchema>;

export async function ifsPartResolution(input: IFSPartResolutionInput): Promise<IFSPartResolutionOutput> {
  // The locale is now passed directly from the API route
  return ifsPartResolutionFlow(input);
}

const engagementStrategyTool = ai.defineTool({
  name: 'determineEngagementStrategy',
  description: 'Determine the engagement strategy based on user personality.',
  inputSchema: z.object({
    partName: z.string().describe('The name of the financial firefighter part.'),
    partBehavior: z
      .string()
      .describe('A description of the behavior of the financial firefighter part.'),
  }),
  outputSchema: z.enum(['direct', 'gentle', 'validation']).describe(
    'A proposed strategy to engage with the part, depending on the user personality and the part itself. "direct" should be used for direct/action oriented people that want to tackle the issue head on. "gentle" is for people that get easily overwhelmed and need a more compassionate approach. "validation" is for those who need to have their concerns acknowledged.'
  ),
},
async (input) => {
  // Simple logic to determine engagement strategy - can be expanded.
  if (input.partBehavior.includes('avoidance')) {
    return 'gentle';
  } else if (input.partBehavior.includes('control')) {
    return 'validation';
  } else {
    return 'direct';
  }
});

const ifsPartResolutionPrompt = ai.definePrompt({
  name: 'ifsPartResolutionPrompt',
  input: {schema: IFSPartResolutionInputSchema},
  output: {schema: IFSPartResolutionOutputSchema},
  tools: [engagementStrategyTool],
  prompt: `You are an AI trained in Internal Family Systems (IFS) therapy, adept at helping users understand their internal "parts," especially financial "firefighter" parts.
    A user has identified a part named "{{partName}}" that exhibits the following behavior: "{{partBehavior}}".
    Your goal is to help the user surface the role, burden, and concern of this part using the 6F framework (Find, Focus, Flesh out, Feel toward, Befriend, Fears).

    First, determine the engagement strategy using the determineEngagementStrategy tool.

    Then, based on the part's behavior, use your knowledge of IFS to determine:
    - role: What positive role does this part play in the user's financial system?
    - burden: What burden is this part carrying? What negative emotions or beliefs does it hold?
    - concern: What is the underlying concern driving this part's behavior? What is it trying to protect the user from?

    {{#if locale}}
    IMPORTANT: Respond in the user's preferred language: {{locale}}
    - If locale is "en": Respond in English
    - If locale is "cs": Respond in Czech (Český jazyk)
    - If locale is "ru": Respond in Russian (Русский язык)
    {{/if}}

    Provide your response in the following JSON format:
    {
      "role": "...",
      "burden": "...",
      "concern": "...",
      "engagementStrategy": "..."
    }`,
});

const ifsPartResolutionFlow = ai.defineFlow(
  {
    name: 'ifsPartResolutionFlow',
    inputSchema: IFSPartResolutionInputSchema,
    outputSchema: IFSPartResolutionOutputSchema,
  },
  async input => {
    const {output} = await ifsPartResolutionPrompt(input);
    return output!;
  }
);
