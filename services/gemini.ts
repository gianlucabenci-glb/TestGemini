import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, ChatMessage } from "../types";

const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy' }); // Fallback to avoid crash on init, but will fail on call if empty

// Schema definition for the structured analysis output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER, description: "Average sentiment score from -1 (negative) to 1 (positive)" },
    reviewCount: { type: Type.INTEGER, description: "Total number of reviews analyzed" },
    sentimentTrend: {
      type: Type.ARRAY,
      description: "Array of data points representing sentiment over time/sequence",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          date: { type: Type.STRING, description: "Extracted date or 'Review N' if not found" },
          sentimentScore: { type: Type.NUMBER, description: "Score between -1 and 1" },
          excerpt: { type: Type.STRING, description: "Short, relevant snippet of the review" }
        }
      }
    },
    wordCloudData: {
      type: Type.ARRAY,
      description: "Frequent keywords categorized by sentiment",
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          value: { type: Type.INTEGER, description: "Frequency count" },
          type: { type: Type.STRING, enum: ["praise", "complaint", "neutral"] }
        }
      }
    },
    executiveSummary: { type: Type.STRING, description: "A concise executive summary of the findings" },
    actionableInsights: {
      type: Type.ARRAY,
      description: "Top 3 actionable areas for improvement",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
        }
      }
    }
  },
  required: ["overallScore", "sentimentTrend", "wordCloudData", "executiveSummary", "actionableInsights"]
};

export const analyzeReviews = async (rawText: string): Promise<AnalysisResult> => {
  try {
    const modelId = "gemini-3-pro-preview"; // Required for Thinking Mode
    
    const prompt = `
      Analyze the following batch of raw customer reviews. 
      
      Your task is to:
      1. Determine the sentiment of each review (-1.0 to 1.0).
      2. Identify trends over time (if dates are present, use them; otherwise, assume sequential order).
      3. Extract key phrases for a word cloud, distinguishing between praises and complaints.
      4. Write a high-level executive summary.
      5. Provide exactly 3 actionable insights for the business.

      Reviews:
      ${rawText}
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        thinkingConfig: {
          thinkingBudget: 32768 // Max budget for detailed analysis
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("No response text received from Gemini");
    }
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const sendChatMessage = async (
  history: ChatMessage[], 
  newMessage: string, 
  contextData?: AnalysisResult | null
): Promise<string> => {
  try {
    const modelId = "gemini-3-pro-preview";
    
    const systemInstruction = `
      You are a helpful data analyst assistant. 
      You are helping a user understand their customer reviews.
      ${contextData ? `Here is the analysis of the current dataset: ${JSON.stringify(contextData.executiveSummary)} \n Top Insights: ${JSON.stringify(contextData.actionableInsights)}` : ''}
      
      Be concise, professional, and insightful.
    `;

    const chat = ai.chats.create({
      model: modelId,
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      config: {
        systemInstruction,
      }
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Chat failed:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};