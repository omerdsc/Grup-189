import { GoogleGenAI } from '@google/genai';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post('/api/diagnose', async (req, res) => {
  try {
    const { message } = req.body;
    
    const tools = [
      {
        googleSearch: {}
      },
    ];
    
    const config = {
      thinkingConfig: {
        thinkingBudget: -1,
      },
      tools,
      responseMimeType: 'text/plain',
       systemInstruction: [
        {
          text: `You are a multilingual medical assistant AI. The user will enter symptoms in any language. You must detect the input language and reply in that exact language. Your task is to analyze the symptoms and suggest possible related diseases or conditions. Always warn the user that this is not a medical diagnosis and they should consult a healthcare professional.

Example Input (English): "I have a sore throat and runny nose"
Example Output (English): "Based on your symptoms, possible conditions include the common cold, flu, or allergic rhinitis. Please note: This is not a medical diagnosis. For accurate results, consult a healthcare professional."

Example Input (Türkçe): "Boğazım ağrıyor ve burnum akıyor"
Example Output (Türkçe): "Belirttiğiniz semptomlara göre olası durumlar soğuk algınlığı, grip veya alerjik rinit olabilir. Bu bir tıbbi teşhis değildir. Kesin bilgi için lütfen bir sağlık uzmanına başvurun."

Now, analyze the following symptoms and respond in the same language:


`,
        }
    ],
    };

    const model = 'gemini-2.5-flash';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: message,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let fullResponse = '';
    for await (const chunk of response) {
      fullResponse += chunk.text;
    }

    res.json({ response: fullResponse });
  } catch (error) {
    console.error('Error processing diagnosis:', error);
    res.status(500).json({ error: 'Failed to process diagnosis request' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
