const { Groq } = require('groq-sdk');

const apiKey = process.env.GROQ_API_KEY;
let groq = null;

try {
  if (apiKey) {
    groq = new Groq({ apiKey });
  }
} catch (err) {
  console.warn('⚠️ Groq client initialization warning:', err.message);
}

const GROQ_CANDIDATE_MODELS = [
  'llama-3.1-8b-instant',
  'llama3-70b-8192',
  'llama3-8b-8192',
  'llama-3.3-70b-versatile',
  'mixtral-8x7b-32768'
];

let workingGroqModel = null;

async function callGroqCompletion(messages, temperature = 0.6, max_tokens = 150) {
  if (!groq) return null;

  const modelsToTry = workingGroqModel
    ? [workingGroqModel, ...GROQ_CANDIDATE_MODELS.filter(m => m !== workingGroqModel)]
    : GROQ_CANDIDATE_MODELS;

  for (const modelCandidate of modelsToTry) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages,
        model: modelCandidate,
        temperature,
        max_tokens
      });
      const text = chatCompletion.choices[0]?.message?.content;
      if (text) {
        workingGroqModel = modelCandidate;
        return { text, model: `Groq (${modelCandidate})` };
      }
    } catch (err) {
      continue;
    }
  }
  return null;
}

/**
 * Generate AI Patient Insight using Groq Llama-3 LLM
 */
async function generatePatientInsight(userName, profile, weakArea, recommendedActivity) {
  const prompt = `You are MemoMate's warm, supportive AI Cognitive Assistant for an elderly patient named ${userName} (Age 68).
Current cognitive scores: Memory: ${profile.memoryScore}/100, Attention: ${profile.attentionScore}/100, Recall: ${profile.recallScore}/100, Reaction: ${profile.reactionScore}/100.
Weakest identified area: ${weakArea}. Recommended activity: ${recommendedActivity}.

Rules:
1. Speak in a warm, encouraging, peaceful "Memory Garden" tone.
2. Keep it concise (2 to 3 sentences maximum).
3. Do NOT mention clinical dementia diagnosis, medical claims, or disease predictions.
4. Encourage them on their Memory Garden plant growth.`;

  const messages = [
    { role: 'system', content: 'You are a warm, gentle AI memory garden guide for elderly users.' },
    { role: 'user', content: prompt }
  ];

  const result = await callGroqCompletion(messages, 0.6, 150);

  if (result) {
    return {
      title: `Groq AI Encouragement for ${userName}`,
      insight: result.text,
      model: result.model
    };
  }

  return {
    title: "Today's Gentle Encouragement 🌱",
    insight: `Great work today, ${userName}! Your memory and recall scores remain strong. Taking on the ${recommendedActivity} will gently exercise focus.`,
    model: "Rule Engine (Groq offline)"
  };
}

/**
 * Generate Caregiver AI Observation using Groq Llama-3 LLM
 */
async function generateCaregiverObservation(patientName, profile) {
  const prompt = `You are MemoMate's AI Observation Engine for Caregiver Dr. Sharma monitoring elderly patient ${patientName} (Age 68).
Cognitive Profile metrics: Memory: ${profile.memoryScore}/100, Attention: ${profile.attentionScore}/100, Recall: ${profile.recallScore}/100, Reaction: ${profile.reactionScore}/100.

Rules:
1. Provide a professional, concise 2-sentence telemetry summary for the caregiver.
2. Highlight which area needs more practice (e.g. Attention) while noting strengths (e.g. Memory).
3. Do NOT use diagnostic or clinical disease terminology (avoid claiming dementia or medical treatment).`;

  const messages = [
    { role: 'system', content: 'You are a concise, professional telemetry summarizer for elderly caregiver dashboards.' },
    { role: 'user', content: prompt }
  ];

  const result = await callGroqCompletion(messages, 0.5, 120);

  if (result) {
    return {
      observation: result.text,
      model: result.model
    };
  }

  return {
    observation: `Attention performance (${profile.attentionScore}/100) has been lower than other measured areas (${profile.memoryScore} memory, ${profile.recallScore} recall) during recent sessions. Focused attention activities are recommended.`,
    model: "Rule Engine (Fallback)"
  };
}

module.exports = {
  generatePatientInsight,
  generateCaregiverObservation
};
