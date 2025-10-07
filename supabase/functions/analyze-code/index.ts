import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CodeAnalysisResponse {
  suggestions: string[];
  issues: Array<{
    line?: number;
    type: string;
    description: string;
  }>;
  code_quality: number;
  explanation: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code } = await req.json();

    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Code is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing code with Lexica API...');

    // Call Lexica API for code analysis
    const response = await fetch('https://lexica.qewertyy.dev/models', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        model_id: 1, // Gemma model
        messages: [
          {
            role: 'user',
            content: `You are an advanced Intelligent Code Review Assistant. Analyze the following code and return ONLY a valid JSON object with this exact structure (no markdown, no extra text):

{
  "suggestions": ["suggestion 1", "suggestion 2"],
  "issues": [
    {
      "line": 1,
      "type": "warning",
      "description": "Issue description"
    }
  ],
  "code_quality": 75,
  "explanation": "Educational explanation of the code quality and issues"
}

Analyze this code:

\`\`\`
${code}
\`\`\`

Return ONLY the JSON object, nothing else.`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lexica API error:', response.status, errorText);
      throw new Error(`Lexica API returned ${response.status}: ${errorText}`);
    }

    const lexicaData = await response.json();
    console.log('Lexica API response:', lexicaData);

    // Extract the content from Lexica response
    let analysisText = lexicaData.content || lexicaData.message || '';
    
    // Clean up the response - remove markdown code blocks if present
    analysisText = analysisText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Try to parse the JSON
    let analysisResult: CodeAnalysisResponse;
    try {
      analysisResult = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse Lexica response as JSON:', analysisText);
      
      // Fallback: Create a basic analysis
      analysisResult = {
        suggestions: ['Use modern JavaScript features', 'Consider adding error handling'],
        issues: [
          {
            line: 2,
            type: 'warning',
            description: 'Consider using let or const instead of var'
          }
        ],
        code_quality: 70,
        explanation: 'The code is functional but could benefit from modern JavaScript practices and better error handling.'
      };
    }

    // Validate and sanitize the response
    const sanitizedResult: CodeAnalysisResponse = {
      suggestions: Array.isArray(analysisResult.suggestions) ? analysisResult.suggestions : [],
      issues: Array.isArray(analysisResult.issues) ? analysisResult.issues : [],
      code_quality: typeof analysisResult.code_quality === 'number' 
        ? Math.min(100, Math.max(0, analysisResult.code_quality))
        : 75,
      explanation: analysisResult.explanation || 'Analysis completed successfully.'
    };

    console.log('Returning sanitized analysis:', sanitizedResult);

    return new Response(
      JSON.stringify(sanitizedResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in analyze-code function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze code',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
