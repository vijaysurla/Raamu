import { generateObject } from "ai"
import { createDeepInfra } from "@ai-sdk/deepinfra"
import { z } from "zod"
import { NextRequest, NextResponse } from "next/server"

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return new NextResponse(null, { status: 204, headers });
}

const deepinfra = createDeepInfra({
  apiKey: process.env.DEEPINFRA_API_KEY,
})

// Schema for extracted information
const extractionSchema = z.object({
  tasks: z.array(
    z.object({
      task: z.string(),
      priority: z.enum(["low", "medium", "high"]).optional(),
      deadline: z.string().optional(),
      context: z.string(),
    }),
  ),
  appointments: z.array(
    z.object({
      title: z.string(),
      date: z.string(),
      time: z.string().optional(),
      location: z.string().optional(),
      participants: z.array(z.string()).optional(),
    }),
  ),
  locations: z.array(
    z.object({
      name: z.string(),
      context: z.string(),
      actionRequired: z.boolean(),
    }),
  ),
  deadlines: z.array(
    z.object({
      item: z.string(),
      date: z.string(),
      urgency: z.enum(["low", "medium", "high"]).optional(),
    }),
  ),
  summary: z.string(),
})

export async function POST(req: Request) {
  try {
    const { conversationText } = await req.json()

    if (!conversationText) {
      return Response.json({ error: "No conversation text provided" }, { status: 400 })
    }

    const result = await generateObject({
      model: deepinfra("meta-llama/Meta-Llama-3.1-70B-Instruct"),
      schema: extractionSchema,
      prompt: `
        You are Raamu, an AI memory assistant that extracts actionable information from conversations.
        Your tagline is "Just Talk. Raamu Remembers."
        
        Analyze the following conversation and extract:
        1. Tasks that need to be completed
        2. Appointments or meetings mentioned
        3. Important locations mentioned
        4. Deadlines or time-sensitive items
        
        For each item, provide context and assess priority/urgency.
        
        Conversation: "${conversationText}"
        
        Be thorough but only extract items that are clearly actionable or important.
        Focus on helping the user stay organized and never miss anything important.
      `,
    })

    return NextResponse.json(result.object, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error("Extraction error:", error)
    return Response.json({ error: "Failed to extract information" }, { status: 500 })
  }
}
