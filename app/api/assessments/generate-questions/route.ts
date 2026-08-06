import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { role, difficulty, count, candidateContext } = await req.json();

    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 });
    }

    // Determine domain category based on role (IT vs Non-IT)
    const normRole = role.toLowerCase();
    const itKeywords = ['frontend', 'backend', 'full stack', 'developer', 'engineer', 'data', 'qa', 'tester', 'devops', 'mobile', 'software', 'cloud', 'system', 'react', 'node', 'java', 'python', 'sql', 'database'];
    const isITRole = itKeywords.some(keyword => normRole.includes(keyword));

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    
    let prompt = '';
    
    // We will ask Gemini to generate JSON array of questions
    if (difficulty === 'Easy') {
      prompt = `Generate exactly ${count || 50} unique Easy-level Multiple Choice Questions (MCQs) for a mock interview for the role of "${role}".
The candidate's experience level is ${candidateContext?.experienceLevel || 'Fresher'}.
${candidateContext?.skills && candidateContext.skills.length > 0 ? `The candidate has the following skills on their resume: ${candidateContext.skills.join(', ')}. Include 5-6 questions specifically testing these skills.` : ''}

CRITICAL RULES:
1. ONLY Output a valid JSON array of objects. Do NOT include markdown code blocks (like \`\`\`json) or any other text before or after the JSON array.
2. The JSON array must contain exactly ${count || 50} objects.
3. Each object must strictly match this format:
{
  "id": number (e.g. 1001),
  "category": string (e.g. "General Aptitude", "Role Specific Knowledge", etc.),
  "question": string (the actual question text),
  "options": [string, string, string, string] (exactly 4 string options),
  "correctAnswer": number (index of correct option, 0 to 3),
  "explanation": string (short explanation of why it is correct)
}`;
    } else {
      // Medium or Hard (Descriptive Scenario-based questions)
      prompt = `Generate exactly ${count || 25} unique ${difficulty}-level Descriptive Scenario-based Questions for a mock interview for the role of "${role}".
The candidate's experience level is ${candidateContext?.experienceLevel || 'Fresher'}.
${candidateContext?.skills && candidateContext.skills.length > 0 ? `The candidate has the following skills on their resume: ${candidateContext.skills.join(', ')}. Include a few questions testing real-world application of these skills.` : ''}

CRITICAL RULES:
1. ONLY Output a valid JSON array of objects. Do NOT include markdown code blocks (like \`\`\`json) or any other text before or after the JSON array.
2. The JSON array must contain exactly ${count || 25} objects.
3. Each object must strictly match this format:
{
  "id": number (e.g. 2001),
  "category": string (e.g. "Scenario Based", "Technical Architecture", etc.),
  "question": string (the actual detailed descriptive question text),
  "keyPoints": [string, string, string] (array of 3-5 keywords expected in the answer),
  "sampleAnswer": string (a concise professional ideal answer)
}`;
    }

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    
    // Clean up response text in case it contains markdown formatting
    let cleanedJsonText = responseText.trim();
    if (cleanedJsonText.startsWith('\`\`\`json')) {
      cleanedJsonText = cleanedJsonText.replace(/^\`\`\`json\s*/, '');
      cleanedJsonText = cleanedJsonText.replace(/\`\`\`$/, '');
    } else if (cleanedJsonText.startsWith('\`\`\`')) {
      cleanedJsonText = cleanedJsonText.replace(/^\`\`\`\s*/, '');
      cleanedJsonText = cleanedJsonText.replace(/\`\`\`$/, '');
    }
    
    let generatedQuestions = [];
    try {
      generatedQuestions = JSON.parse(cleanedJsonText);
    } catch (parseError) {
      console.error('Failed to parse Gemini output:', cleanedJsonText);
      return NextResponse.json({ error: 'Failed to generate valid questions format from AI.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      questions: generatedQuestions,
      isITRole: isITRole
    });
  } catch (error: any) {
    console.error('Error generating mock interview questions:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate questions' }, { status: 500 });
  }
}
