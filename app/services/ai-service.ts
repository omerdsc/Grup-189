const API_URL = 'http://localhost:3001';

export class AIService {
  async generateResponse(userInput: string): Promise<string> {
    try {
      const response = await fetch(`${API_URL}/api/diagnose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();
