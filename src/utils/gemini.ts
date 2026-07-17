import type { Resume } from '../types/resume';
import type { KeywordSuggestion } from './keywordSuggestions';

// Client makes requests directly to the background proxy endpoint
const API_URL = '/api/gemini/generateContent';

export const getGeminiApiKey = (): string => {
  return 'configured-on-backend';
};

export const hasGeminiApiKey = (): boolean => {
  // Always true, backend proxy server has the key securely configured
  return true;
};

export const saveGeminiApiKey = (_key: string) => {
  // No-op: API key is stored securely on the backend
};

export const clearGeminiApiKey = () => {
  // No-op: API key is managed securely on the backend
};

/**
 * Call secure backend proxy with a prompt
 */
async function callGemini(prompt: string, jsonMode = false): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      ...(jsonMode ? {
        generationConfig: {
          responseMimeType: 'application/json'
        }
      } : {})
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || `HTTP ${response.status} ${response.statusText}`;
    throw new Error(`Gemini API Error: ${errorMessage}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('No response content received from Gemini.');
  }

  return text;
}

/**
 * Generate dynamic keyword suggestions for a job profile
 */
export async function generateKeywords(jobProfile: string): Promise<KeywordSuggestion[]> {
  const prompt = `You are an expert ATS (Applicant Tracking System) optimization tool.
Generate resume keyword suggestions for the job profile/title: "${jobProfile}".

Analyze the role and return key terms that recruiters look for, grouped into relevant categories (like "Technical Skills", "Tools & Platforms", "Experience Keywords", or "Soft Skills" as appropriate).
Each category should have 5-15 high-quality, relevant terms.

Respond ONLY with a JSON array matching this typescript type:
Array<{ category: string, keywords: Array<string> }>

Ensure the JSON is valid and return no markdown wrapping or additional text.`;

  try {
    const jsonText = await callGemini(prompt, true);
    const result = JSON.parse(jsonText);
    if (Array.isArray(result)) {
      return result;
    }
    throw new Error('Invalid JSON format returned from Gemini');
  } catch (error) {
    console.error('Error generating keywords with Gemini:', error);
    throw error;
  }
}

/**
 * Optimize a resume bullet point or summary
 */
export async function optimizeText(
  role: string,
  company: string,
  currentText: string,
  type: 'experience' | 'summary' | 'project'
): Promise<string> {
  let contextPrompt = '';
  if (type === 'experience') {
    contextPrompt = `Rewrite the following draft bullet points or description for the role "${role}" at "${company}" into a clean, professional, action-oriented resume description.
Use active power verbs (e.g., "Led", "Designed", "Optimized", "Architected"), focus on achievements and results, and quantify impacts where possible.
Format the output as a professional description (either a paragraph or bullet points starting with '*'). Keep it concise and suitable for a premium resume.`;
  } else if (type === 'project') {
    contextPrompt = `Optimize the following project description for "${role}".
Highlight the technical challenges, technologies used, and outcomes. Format the output as a high-impact description.`;
  } else {
    contextPrompt = `Optimize the following professional bio/summary for a candidate aiming to be a "${role}". Make it compelling, professional, and highlight key value propositions in 2-3 sentences.`;
  }

  const prompt = `${contextPrompt}

Draft content:
"${currentText}"

Optimized output:`;

  try {
    const responseText = await callGemini(prompt, false);
    return responseText.trim();
  } catch (error) {
    console.error('Error optimizing text with Gemini:', error);
    throw error;
  }
}

/**
 * Parse a raw text resume or LinkedIn profile into a structured resume object
 */
export async function parseResumeText(rawText: string): Promise<Partial<Resume>> {
  const prompt = `You are a state-of-the-art resume parser. 
Extract all information from the following raw text (which may be a copied LinkedIn profile, CV, or bio) and organize it into a structured JSON format.

Text to parse:
"""
${rawText}
"""

The output MUST be a valid JSON object matching the following structure:
{
  "personalInfo": {
    "fullName": "Name",
    "email": "email@example.com",
    "phone": "phone number",
    "location": "City, State/Country",
    "title": "Professional Title / Current Role",
    "summary": "Brief professional summary or bio"
  },
  "education": [
    {
      "institution": "University / School Name",
      "degree": "Degree (e.g., Bachelor of Science)",
      "field": "Field of Study (e.g., Computer Science)",
      "startDate": "Start date",
      "endDate": "End date or 'Present'",
      "gpa": "GPA if mentioned",
      "description": "Any honors, coursework, or achievements"
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title / Position",
      "location": "Location",
      "startDate": "Start date",
      "endDate": "End date or 'Present'",
      "current": true/false (true if currently working there),
      "description": [
        "bullet point accomplishment 1",
        "bullet point accomplishment 2"
      ]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "What the project does and your contribution",
      "technologies": ["React", "Node.js"] (List of technologies used),
      "startDate": "Start date",
      "endDate": "End date"
    }
  ],
  "skills": [
    {
      "category": "e.g., Programming Languages",
      "skills": ["JavaScript", "Python"]
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "Date of achievement"
    }
  ],
  "achievements": [
    {
      "title": "Award/Achievement Title",
      "description": "Details about the achievement",
      "date": "Date of achievement"
    }
  ],
  "links": [
    {
      "type": "linkedin", (must be one of: 'github', 'linkedin', 'portfolio', 'other')
      "url": "https://linkedin.com/...",
      "label": "LinkedIn"
    }
  ]
}

Rules:
1. Extract and format dates cleanly (e.g. YYYY-MM or Month YYYY).
2. If some fields or sections are missing, omit them or return empty arrays/objects.
3. Respond ONLY with valid JSON. Do not include markdown code block wrappers (like \`\`\`json) or any conversational text.`;

  try {
    const jsonText = await callGemini(prompt, true);
    const result = JSON.parse(jsonText);
    return result;
  } catch (error) {
    console.error('Error parsing resume text with Gemini:', error);
    throw error;
  }
}
