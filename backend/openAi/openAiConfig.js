import OpenAI from 'openai';

export const test = async (req, res) => {
  try {
    const { number, topic } = req.body;

    const client = new OpenAI({
      apiKey: process.env['OPEN_AI'], // GitHub Marketplace token
      baseURL: "https://models.github.ai/inference", // GitHub proxy endpoint
    });

    const prompt = `You have to create multiple choice questions in JSON format with the following structure:
[
  {
    "Question": "Your question here?",
    "Options": ["Option A", "Option B", "Option C", "Option D"],
    "Answer": "Correct Option"
  }
]
Create exactly ${number} questions on the topic "${topic}". Only return the JSON array. No explanation or extra text.`;

    const response = await client.chat.completions.create({
      model: "openai/gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates JSON MCQs." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const output = response.choices[0].message.content;

    // Extract JSON from the text (if necessary)
    const jsonStart = output.indexOf("[");
    const jsonEnd = output.lastIndexOf("]") + 1;
    const jsonString = output.substring(jsonStart, jsonEnd);
    const arr = JSON.parse(jsonString);

    return res.status(200).json(arr);

  } catch (error) {
    console.error("Error generating questions:", error.message);
    return res.status(500).json({ error: "Failed to generate questions" });
  }
};
