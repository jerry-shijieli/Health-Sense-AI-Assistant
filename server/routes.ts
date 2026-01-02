import type { Express } from "express";
import { createServer, type Server } from "node:http";
import OpenAI from "openai";

interface HealthData {
  date: string;
  steps: number;
  heartRate: { avg: number; min: number; max: number };
  sleepHours: number;
  activeMinutes: number;
  calories: number;
  distance: number;
}

interface AnalyzeRequest {
  provider: "openai" | "gemini";
  healthData: HealthData[];
  dataScope: "today" | "week" | "month";
}

function buildHealthSummary(data: HealthData[]): string {
  if (data.length === 0) {
    return "No health data available.";
  }

  const avgSteps = Math.round(
    data.reduce((sum, d) => sum + d.steps, 0) / data.length
  );
  const avgActiveMinutes = Math.round(
    data.reduce((sum, d) => sum + d.activeMinutes, 0) / data.length
  );
  const avgSleep =
    Math.round(
      (data.reduce((sum, d) => sum + d.sleepHours, 0) / data.length) * 10
    ) / 10;
  const avgHeartRate = Math.round(
    data.reduce((sum, d) => sum + d.heartRate.avg, 0) / data.length
  );
  const avgCalories = Math.round(
    data.reduce((sum, d) => sum + d.calories, 0) / data.length
  );
  const avgDistance =
    Math.round(
      (data.reduce((sum, d) => sum + d.distance, 0) / data.length) * 10
    ) / 10;

  return `
Health Data Summary (${data.length} day${data.length > 1 ? "s" : ""}):
- Average Daily Steps: ${avgSteps.toLocaleString()} steps
- Average Active Minutes: ${avgActiveMinutes} minutes
- Average Sleep Duration: ${avgSleep} hours
- Average Heart Rate: ${avgHeartRate} BPM
- Average Calories Burned: ${avgCalories.toLocaleString()} kcal
- Average Distance: ${avgDistance} km

Daily Breakdown:
${data
  .map(
    (d) =>
      `- ${d.date}: ${d.steps.toLocaleString()} steps, ${d.activeMinutes} active min, ${d.sleepHours}h sleep, ${d.heartRate.avg} avg BPM`
  )
  .join("\n")}
  `.trim();
}

const ANALYSIS_PROMPT = `You are a health and fitness AI assistant. Analyze the user's health data and provide:

1. A brief summary (2-3 sentences) of their overall health status based on the data.
2. 3-4 specific, actionable recommendations for improving their health.

For each recommendation, provide:
- category: one of "sleep", "exercise", "nutrition", or "general"
- title: a short title (3-5 words)
- description: a helpful explanation (1-2 sentences)
- priority: "high", "medium", or "low" based on importance

Also calculate a health score from 0-100 based on:
- Step count (goal: 10,000/day)
- Active minutes (goal: 30 min/day)
- Sleep (goal: 7-9 hours)
- Heart rate variability (60-100 BPM is healthy)

Respond in JSON format:
{
  "summary": "string",
  "score": number,
  "recommendations": [
    {
      "category": "exercise|sleep|nutrition|general",
      "title": "string",
      "description": "string",
      "priority": "high|medium|low"
    }
  ]
}`;

async function analyzeWithOpenAI(healthSummary: string): Promise<any> {
  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: ANALYSIS_PROMPT },
      {
        role: "user",
        content: `Please analyze this health data and provide recommendations:\n\n${healthSummary}`,
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(content);
}

async function analyzeWithGemini(healthSummary: string): Promise<any> {
  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  });

  const prompt = `${ANALYSIS_PROMPT}\n\nUser's health data:\n${healthSummary}`;

  const response = await openai.chat.completions.create({
    model: "gemini-2.5-flash",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from Gemini");
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in Gemini response");
  }

  return JSON.parse(jsonMatch[0]);
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/analyze", async (req, res) => {
    try {
      const { provider, healthData, dataScope } = req.body as AnalyzeRequest;

      if (!healthData || !Array.isArray(healthData)) {
        return res.status(400).json({ error: "Invalid health data" });
      }

      const healthSummary = buildHealthSummary(healthData);

      let result;
      if (provider === "gemini") {
        result = await analyzeWithGemini(healthSummary);
      } else {
        result = await analyzeWithOpenAI(healthSummary);
      }

      const recommendations = Array.isArray(result.recommendations)
        ? result.recommendations.slice(0, 4)
        : [];

      res.json({
        summary: result.summary || "Analysis complete.",
        score: Math.min(100, Math.max(0, result.score || 75)),
        recommendations: recommendations.map((rec: any) => ({
          category: ["sleep", "exercise", "nutrition", "general"].includes(
            rec.category
          )
            ? rec.category
            : "general",
          title: rec.title || "Health Tip",
          description: rec.description || "Maintain healthy habits.",
          priority: ["high", "medium", "low"].includes(rec.priority)
            ? rec.priority
            : "medium",
        })),
        provider,
        analyzedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({
        error: "Analysis failed",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
