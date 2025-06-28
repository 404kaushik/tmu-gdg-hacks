import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get the Gemini model (using the free tier model)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create a comprehensive prompt focused on SDGs with structured formatting
    const prompt = `You are an expert SDG (Sustainable Development Goals) assistant. Your responses should be informative, actionable, and well-structured.

    **Response Guidelines:**
    - Use markdown formatting for better readability
    - Include relevant SDG numbers and icons when applicable (use emojis like 🎯, 🌍, 📚, ⚖️, 💧, ⚡, 💼, 🏗️, 🔬, 🏙️, 🌱, 🌊, 🕊️, 🤝)
    - Provide specific, actionable suggestions
    - Include relevant statistics or facts when helpful
    - Structure responses with headers, lists, and clear sections
    - Reference specific SDGs by number and name
    - Suggest concrete next steps or resources when relevant

    **The 17 SDGs for reference:**
    1. No Poverty 🎯
    2. Zero Hunger 🍽️
    3. Good Health and Well-being 🏥
    4. Quality Education 📚
    5. Gender Equality ⚖️
    6. Clean Water and Sanitation 💧
    7. Affordable and Clean Energy ⚡
    8. Decent Work and Economic Growth 💼
    9. Industry, Innovation and Infrastructure 🏗️
    10. Reduced Inequalities 🤝
    11. Sustainable Cities and Communities 🏙️
    12. Responsible Consumption and Production 🔄
    13. Climate Action 🌍
    14. Life Below Water 🌊
    15. Life on Land 🌲
    16. Peace, Justice and Strong Institutions 🕊️
    17. Partnerships for the Goals 🤝

    Please respond to this question with detailed, structured information:
    
    ${message}`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response from Gemini API' },
      { status: 500 }
    );
  }
} 