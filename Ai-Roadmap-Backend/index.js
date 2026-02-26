console.log('--- BACKEND BOOTING UP ---');
console.log('Time:', new Date().toISOString());
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

process.on('uncaughtException', (err) => {
    console.error('CRITICAL: Uncaught Exception:', err.message);
    console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client for Groq
const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

// --- Roadmap Generation Endpoint ---
app.post('/api/generate-roadmap', async (req, res) => {
    const { goal, difficulty = "Beginner", commitment = "Part-time" } = req.body;

    if (!goal) {
        return res.status(400).json({ error: "Goal is required" });
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const systemPrompt = `You are the World-Class Learning Architect. Your mission is to generate a 100% ACCURATE learning roadmap. 

### THE RESOURCE AUTHORITY MATRIX (STRICT):
Use these ONLY:
- **YouTube**: Use channels ONLY from: 'freeCodeCamp.org', 'Traversy Media', 'Fireship', 'The Net Ninja', 'Academind', 'Programming with Mosh', 'TheNewBoston', 'CS Dojo'.
- **Documentation**: Official domains ONLY: developer.mozilla.org, react.dev, python.org, tailwindcss.com, nextjs.org, nodejs.org, kaggle.com.
- **Courses**: Coursera, edX, Harvard CS50, MIT OpenCourseWare.
- **Verification Rule**: If you do not know a specific video ID for a YouTube URL, use a 'Search Fallback' structure: 'https://www.youtube.com/results?search_query=[TOPIC]+[CHANNEL_NAME]'. This guarantees the link works and leads to the correct content.

### PEDAGOGICAL ARCHITECTURE:
1. **Curriculum**: 8-12 weeks of non-redundant, deep-tech milestones. 
2. **Projects**: Avoid generic 'To-Do' apps. Use 'Industry Simulations' (e.g., 'Real-time Analytics Dashboard' using specific APIs).
3. **Quizzes**: Conceptual 'Scenario' questions. Example: 'In [Specific Scenario], why is [Specific Pattern] better than [Alternative]?'

### OUTPUT PROTOCOL:
Return VALID JSON ONLY. The user depends on this being correct.

### JSON STRUCTURE:
{
  "goal": "the user's goal",
  "difficulty": "${difficulty}",
  "commitment": "${commitment}",
  "duration": "e.g., '12 weeks'",
  "summary": "High-level architectural overview",
  "tech_stack_overview": ["Primary Tech A", "Primary Tech B"],
  "weekly_plan": [
    {
      "week": 1,
      "title": "Clear Week Title",
      "topics": ["Deep Topic 1", "Deep Topic 2"],
      "exercises": ["Practical Exercise 1", "Practical Exercise 2"],
      "mini_challenge": "Logic-heavy technical challenge",
      "key_outcomes": ["Observable skill A", "Observable skill B"]
    }
  ],
  "projects": [
    {
      "month": 1,
      "title": "Professional Portfolio Project",
      "problem_statement": "Real-world problem context",
      "tech_stack": ["Specific Tech 1", "Specific Tech 2"],
      "dataset_links": ["Verified Data Source Links"],
      "steps": ["Step 1", "Step 2", "Step 3"],
      "portfolio_impact": "Senior-level differentiation"
    }
  ],
  "resources": {
    "youtube": [{"title": "Verified Video Title", "url": "URL from Authority Matrix", "description": "Core takeaway"}],
    "courses": [{"title": "Premium Course Title", "url": "Official URL", "free": boolean, "description": "Unique value"}],
    "documentation": [{"title": "Official Doc Name", "url": "Official URL"}],
    "github_repos": [{"title": "Architecture Example Repo", "url": "GitHub URL", "description": "Design patterns to learn"}]
  },
  "quizzes": [
    {
      "week": 1,
      "mcqs": [{"question": "Scenario Question", "options": ["a","b","c","d"], "correct": number}],
      "coding_questions": [{"question": "Practical logic challenge", "hint": "Key logic tip"}],
      "mini_challenge": "Implementation-heavy task"
    }
  ]
}

DO NOT include markdown. Return ONLY the JSON object.`;

    try {
        const stream = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `User Goal: ${goal}` }
            ],
            temperature: 0.7,
            stream: true,
            response_format: { type: "json_object" }
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
            }
        }
        res.write("data: [DONE]\n\n");
        res.end();
    } catch (error) {
        console.error("Roadmap generation error:", error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
});

// --- AI Mentor Chat Endpoint ---
app.post('/api/ai-mentor', async (req, res) => {
    const { messages, roadmapContext } = req.body;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const systemPrompt = `You are an AI Learning Mentor for LearnPath AI. You are encouraging, knowledgeable, and adaptive.
${roadmapContext ? `The learner's current roadmap context: ${roadmapContext}` : ""}
Keep responses concise, friendly, and actionable. Use markdown formatting for code blocks and lists.`;

    try {
        const stream = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages.map(msg => ({
                    role: msg.role === "assistant" ? "assistant" : "user",
                    content: msg.content
                }))
            ],
            temperature: 0.7,
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
                const delta = { choices: [{ delta: { content: content } }] };
                res.write(`data: ${JSON.stringify(delta)}\n\n`);
            }
        }
        res.write("data: [DONE]\n\n");
        res.end();
    } catch (error) {
        console.error("Mentor chat error:", error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
