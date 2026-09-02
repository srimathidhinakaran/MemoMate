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

/**
 * Generate AI Patient Insight using Groq Llama-3 LLM
 */
async function generatePatientInsight(userName, profile, weakArea, recommendedActivity) {
  if (!groq) {
    return {
      title: "Today's Gentle Encouragement 🌱",
      insight: `Great work today, ${userName}! Your memory and recall scores remain strong. Taking on the ${recommendedActivity} will gently exercise focus.`,
      model: "Rule Engine (Groq offline)"
    };
  }

  try {
    const prompt = `You are MemoMate's warm, supportive AI Cognitive Assistant for an elderly patient named ${userName} (Age 68).
Current cognitive scores: Memory: ${profile.memoryScore}/100, Attention: ${profile.attentionScore}/100, Recall: ${profile.recallScore}/100, Reaction: ${profile.reactionScore}/100.
Weakest identified area: ${weakArea}. Recommended activity: ${recommendedActivity}.

Rules:
1. Speak in a warm, encouraging, peaceful "Memory Garden" tone.
2. Keep it concise (2 to 3 sentences maximum).
3. Do NOT mention clinical dementia diagnosis, medical claims, or disease predictions.
4. Encourage them on their Memory Garden plant growth.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a warm, gentle AI memory garden guide for elderly users.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.6,
      max_tokens: 150
    });

    const aiText = chatCompletion.choices[0]?.message?.content || `Keep growing your memory garden! Focusing on ${recommendedActivity} will help gently sharpen attention today.`;

    return {
      title: `Groq AI Encouragement for ${userName}`,
      insight: aiText,
      model: "Groq Llama-3.3-70b-versatile"
    };
  } catch (error) {
    console.warn('⚠️ Groq API request failed, using fallback:', error.message);
    return {
      title: "Today's Gentle Encouragement",
      insight: `Great work today, ${userName}! Your memory and recall scores remain strong. Taking on the ${recommendedActivity} will gently exercise focus.`,
      model: "Rule Engine (Fallback)"
    };
  }
}

/**
 * Generate Caregiver AI Observation using Groq Llama-3 LLM
 */
async function generateCaregiverObservation(patientName, profile) {
  if (!groq) {
    return {
      observation: `Attention performance (${profile.attentionScore}/100) has been lower than other measured areas (${profile.memoryScore} memory, ${profile.recallScore} recall) during recent sessions. Focused attention activities are recommended.`,
      model: "Rule Engine (Groq offline)"
    };
  }

  try {
    const prompt = `You are MemoMate's AI Observation Engine for Caregiver Dr. Sharma monitoring elderly patient ${patientName} (Age 68).
Cognitive Profile metrics: Memory: ${profile.memoryScore}/100, Attention: ${profile.attentionScore}/100, Recall: ${profile.recallScore}/100, Reaction: ${profile.reactionScore}/100.

Rules:
1. Provide a professional, concise 2-sentence telemetry summary for the caregiver.
2. Highlight which area needs more practice (e.g. Attention) while noting strengths (e.g. Memory).
3. Do NOT use diagnostic or clinical disease terminology (avoid claiming dementia or medical treatment).`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a concise, professional telemetry summarizer for elderly caregiver dashboards.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 120
    });

    const aiText = chatCompletion.choices[0]?.message?.content || `Attention scores (${profile.attentionScore}/100) show slight variance compared to strong memory recall (${profile.memoryScore}/100). Short attention exercises are advised.`;

    return {
      observation: aiText,
      model: "Groq Llama-3.3-70b-versatile"
    };
  } catch (error) {
    console.warn('⚠️ Groq API caregiver observation failed:', error.message);
    return {
      observation: `Attention performance (${profile.attentionScore}/100) has been lower than other measured areas (${profile.memoryScore} memory, ${profile.recallScore} recall) during recent sessions. Focused attention activities are recommended.`,
      model: "Rule Engine (Fallback)"
    };
  }
}

module.exports = {
  generatePatientInsight,
  generateCaregiverObservation
};
