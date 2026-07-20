import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
// PDF parsing requires CJS require in Next.js Turbopack
// Polyfill DOMMatrix for pdf-parse inside Next.js node environment
if (typeof global !== 'undefined' && !(global as any).DOMMatrix) {
  (global as any).DOMMatrix = class DOMMatrix {};
}
const pdfParse = require('pdf-parse-new');

// Common tech skills for keyword matching
const SKILL_KEYWORDS = [
  'react', 'angular', 'vue', 'node.js', 'nodejs', 'python', 'java', 'c++', 'c#', 'javascript', 'typescript',
  'html', 'css', 'sql', 'mysql', 'postgresql', 'mongodb', 'aws', 'azure', 'docker', 'kubernetes', 'git',
  'linux', 'spring boot', 'django', 'flask', 'express', 'ruby', 'php', 'laravel', 'go', 'golang', 'rust',
  'swift', 'kotlin', 'machine learning', 'data science', 'ai', 'devops', 'ci/cd', 'agile', 'scrum',
  'figma', 'ui/ux', 'tailwind', 'sass', 'redux', 'next.js', 'nextjs', 'graphql', 'rest api', 'flutter', 'react native'
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Only PDF, DOC, DOCX files allowed' }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const candidateId = formData.get('candidateId') as string | null;
    
    // Convert to base64 data URI for serverless environments (Vercel)
    const base64Str = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64Str}`;

    if (candidateId) {
      const { prisma } = require('@/lib/db');
      await (prisma as any).candidateAccount.update({
        where: { id: candidateId },
        data: { resumeUrl: dataUri }
      });
      const acc = await (prisma as any).candidateAccount.findUnique({ where: { id: candidateId } });
      if (acc?.email) {
        await prisma.candidate.updateMany({
          where: { email: acc.email },
          data: { resumeUrl: dataUri }
        });
      }
    }

    let extractedData: any = { skillsArr: [], email: '', phone: '' };

    // Try to extract text if it's a PDF
    if (file.type === 'application/pdf') {
      try {
        // pdf.js is very noisy about malformed fonts. Silence console.info/warn temporarily.
        const originalInfo = console.info;
        const originalWarn = console.warn;
        console.info = () => {};
        console.warn = () => {};

        const data = await pdfParse(buffer);

        // Restore console
        console.info = originalInfo;
        console.warn = originalWarn;
        
        const text = data.text;
        
        // 1. Extract Email
        const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
        if (emailMatch) extractedData.email = emailMatch[1];
        
        // 2. Extract Phone (basic regex for Indian/International formats)
        const phoneMatch = text.match(/(?:(?:\+?91|0)[\s-]*)?(?:\d{5}[\s-]*\d{5}|\d{10}|\d{3}[\s-]*\d{3}[\s-]*\d{4})/);
        if (phoneMatch) extractedData.phone = phoneMatch[0].replace(/[\s-]/g, '');

        // 3. Extract Skills (Keyword matching)
        const lowerText = text.toLowerCase();
        const foundSkills = new Set<string>();
        SKILL_KEYWORDS.forEach(skill => {
          // Escape special regex characters in the skill name (like + in C++)
          const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          // Use word boundary to avoid partial matches (e.g., 'go' matching 'good')
          const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
          if (regex.test(lowerText)) {
            // Capitalize for better display
            foundSkills.add(skill === 'ui/ux' ? 'UI/UX' : skill.charAt(0).toUpperCase() + skill.slice(1));
          }
        });
        extractedData.skillsArr = Array.from(foundSkills);

      } catch (parseError) {
        console.error('PDF parsing error:', parseError);
        // We still return success but without extracted data
      }
    }

    return NextResponse.json({ 
      url: dataUri, 
      name: file.name,
      extractedData
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
