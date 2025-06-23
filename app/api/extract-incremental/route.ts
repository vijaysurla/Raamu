import { generateObject } from "ai"
import { createDeepInfra } from "@ai-sdk/deepinfra"
import { z } from "zod"

const deepinfra = createDeepInfra({
  apiKey: process.env.DEEPINFRA_API_KEY,
})

// Schema for incremental updates
const incrementalUpdateSchema = z.object({
  newTasks: z.array(
    z.object({
      task: z.string(),
      priority: z.enum(["low", "medium", "high"]),
      deadline: z.string().optional(),
      context: z.string(),
    }),
  ),
  newAppointments: z.array(
    z.object({
      title: z.string(),
      date: z.string(),
      time: z.string().optional(),
      location: z.string().optional(),
      participants: z.array(z.string()).optional(),
    }),
  ),
  newLocations: z.array(
    z.object({
      name: z.string(),
      context: z.string(),
      actionRequired: z.boolean(),
    }),
  ),
  newDeadlines: z.array(
    z.object({
      item: z.string(),
      date: z.string(),
      urgency: z.enum(["low", "medium", "high"]),
    }),
  ),
  completedTasks: z.array(z.string()), // Task descriptions that were completed
  cancelledAppointments: z.array(z.string()), // Appointment titles that were cancelled
  purchasedItems: z.array(z.string()), // Items that were bought/acquired
  resolvedDeadlines: z.array(z.string()), // Deadlines that were met/resolved
  updates: z.array(
    z.object({
      type: z.enum(["task", "appointment", "location", "deadline"]),
      originalItem: z.string(),
      updatedItem: z.string(),
      changeDescription: z.string(),
    }),
  ),
  summary: z.string(),
})

export async function POST(req: Request) {
  try {
    const { newText, existingData } = await req.json()

    if (!newText) {
      return Response.json({ error: "No new text provided" }, { status: 400 })
    }

    // Create context about existing items for the AI
    const existingContext = existingData
      ? `
    EXISTING ITEMS THAT RAAMU REMEMBERS:
    
    Current Tasks:
    ${existingData.tasks?.map((t: any) => `- ${t.task} (${t.priority} priority)`).join("\n") || "None"}
    
    Current Appointments:
    ${existingData.appointments?.map((a: any) => `- ${a.title} on ${a.date}`).join("\n") || "None"}
    
    Current Locations:
    ${existingData.locations?.map((l: any) => `- ${l.name}: ${l.context}`).join("\n") || "None"}
    
    Current Deadlines:
    ${existingData.deadlines?.map((d: any) => `- ${d.item} due ${d.date}`).join("\n") || "None"}
    `
      : ""

    const result = await generateObject({
      model: deepinfra("meta-llama/Meta-Llama-3.1-70B-Instruct"),
      schema: incrementalUpdateSchema,
      prompt: `
        You are Raamu, an AI memory assistant analyzing NEW conversation text for updates.
        Your tagline is "Just Talk. Raamu Remembers."
        
        ${existingContext}
        
        NEW CONVERSATION TEXT: "${newText}"
        
        Analyze this new text and identify:
        
        1. NEW items to add:
           - New tasks, appointments, locations, deadlines
        
        2. COMPLETED/RESOLVED items:
           - Tasks mentioned as done/finished/completed
           - Items mentioned as bought/purchased/acquired
           - Appointments mentioned as cancelled/done
           - Deadlines mentioned as met/finished
        
        3. UPDATES to existing items:
           - Changes to dates, times, locations, priorities
           - Modifications to existing tasks or appointments
        
        Be very specific about matching existing items. For example:
        - If someone says "I bought the milk", add "milk" to purchasedItems
        - If someone says "I finished the essay", add "history essay" or similar to completedTasks
        - If someone says "the meeting moved to 3pm", create an update
        
        Only extract information that is clearly mentioned in the NEW text.
        Help the user stay organized by accurately tracking what's new, completed, or changed.
      `,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Incremental extraction error:", error)
    return Response.json({ error: "Failed to process incremental update" }, { status: 500 })
  }
}
