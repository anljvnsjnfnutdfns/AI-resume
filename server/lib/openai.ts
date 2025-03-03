import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function improveSummary(summary: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a professional resume writer. Improve the given summary while maintaining its core message. Make it more impactful and professional."
      },
      {
        role: "user",
        content: summary
      }
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content || summary;
}

export async function improveExperience(description: string[]): Promise<string[]> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Improve these job experience bullet points. Make them more impactful using strong action verbs and quantifiable achievements. Return as a JSON array of strings."
      },
      {
        role: "user",
        content: JSON.stringify(description)
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const improved = JSON.parse(response.choices[0].message.content);
  return improved.points || description;
}
