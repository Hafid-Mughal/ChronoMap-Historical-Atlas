import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  generateLocalHistorianReply,
  generateLocalYearSnapshot,
  resolveWikipediaDeepSearch
} from '../../src/data/localHistorianFallback';
import { isFictionalOrNonHistoricalQuery } from '../../src/data/historicalSearchIndex';

function resolveApiKey(): string {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    ''
  );
}

let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  const key = resolveApiKey();
  if (!aiClient && key) {
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

const HISTORIAN_SYSTEM_INSTRUCTION = `You are the ChronoMap Chief AI Historian, Military Strategist & Geopolitical Analyst.
Your mission is to answer any world history, military history, geopolitical, or counterfactual ("What-If") question with graduate-level depth, precision, and clarity.
Core Rules:
1. Always answer the user's exact question directly and comprehensively first. Never deflect into a generic summary of the map's currently selected country or year unless the user explicitly asks about it.
2. Provide specific historical dates, rulers/commanders, key battles, treaties, structural economic/logistical causes, and long-term geopolitical consequences.
3. For "Why did X lose/win against Y?" or "Why did X empire collapse?" questions, break the explanation into numbered causal pillars (e.g., Internal Political/Fiscal Dynamics, Military & Technological Asymmetry, Alliances & Diplomacy, Decisive Battles/Turning Points).
4. For "What-If" / counterfactual questions, anchor the Point of Divergence in real historical facts, then project Immediate Fallout (1-10 yrs), Medium-Term Shifts (10-50 yrs), and Long-Term Global Map Impact.
5. Format responses cleanly using bold headings/terms (**bold**) and bullet points. Do NOT wrap your response in JSON or code fences.`;

function safeParseJson<T = any>(rawText: string | undefined, fallback: T): T {
  if (!rawText) return fallback;
  try {
    const cleaned = rawText
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return fallback;
  }
}

async function generateChatReplyText(prompt: string, timeoutMs = 24000): Promise<string | null> {
  const ai = getAI();
  if (!ai) return null;

  const attempts: Array<{ model: string; useThinking: boolean }> = [
    { model: 'gemini-3-flash-preview', useThinking: true },
    { model: 'gemini-3-flash-preview', useThinking: false },
    { model: 'gemini-3.1-flash-lite-preview', useThinking: false }
  ];

  for (const attempt of attempts) {
    try {
      const response = await Promise.race([
        ai.models.generateContent({
          model: attempt.model,
          contents: prompt,
          config: attempt.useThinking
            ? {
                systemInstruction: HISTORIAN_SYSTEM_INSTRUCTION,
                thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
                maxOutputTokens: 2048
              }
            : {
                systemInstruction: HISTORIAN_SYSTEM_INSTRUCTION,
                temperature: 0.4,
                maxOutputTokens: 2048
              }
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
        )
      ]);

      const text = response.text?.trim();
      if (text && text.length > 10) {
        return text;
      }
    } catch {
      // Continue to next attempt
    }
  }

  return null;
}

async function generateJsonWithFallback<T = any>(
  prompt: string,
  fallbackData: T,
  timeoutMs = 15000
): Promise<T> {
  const ai = getAI();
  if (!ai) return fallbackData;

  const modelsToTry = ['gemini-3-flash-preview', 'gemini-3.1-flash-lite-preview'];

  for (const modelName of modelsToTry) {
    try {
      const response = await Promise.race([
        ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
        )
      ]);

      const parsed = safeParseJson<T | null>(response.text, null);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch {
      // Continue to next model
    }
  }

  return fallbackData;
}

function jsonResponse(body: unknown, statusCode = 200) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
    body: JSON.stringify(body)
  };
}

export const handler = async (event: {
  path?: string;
  rawUrl?: string;
  httpMethod?: string;
  body?: string | null;
}) => {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse({ ok: true }, 200);
  }

  const routePath = (event.path || event.rawUrl || '').toLowerCase();
  let body: Record<string, any> = {};
  if (event.body) {
    try {
      body = JSON.parse(event.body);
    } catch {
      body = {};
    }
  }

  // 1. /api/history/chat
  if (routePath.includes('chat')) {
    const { message = '', year = 2026, activeContext = null, conversationHistory = [] } = body;
    const safeMessage = typeof message === 'string' && message.trim() ? message.trim() : 'World history overview';
    const numYear = typeof year === 'number' ? year : 2026;
    const yearString = numYear < 0 ? `${Math.abs(numYear)} BCE` : `${numYear} CE`;

    const localFallback = generateLocalHistorianReply({
      message: safeMessage,
      year: numYear,
      activeContext: activeContext as any,
      conversationHistory: Array.isArray(conversationHistory) ? conversationHistory : []
    });

    let contextDescription = `Active Map Timeline Year: ${yearString}.`;
    if (activeContext?.type === 'country' && activeContext.data) {
      const c = activeContext.data;
      contextDescription += `\nCurrently Selected Country/Empire on Map: "${c.name}" (Modern area: ${c.modernCountry || c.name}). Ruler: ${c.ruler || 'N/A'}, Capital: ${c.capital || 'N/A'}.`;
    } else if (activeContext?.type === 'conflict' && activeContext.data) {
      const z = activeContext.data;
      contextDescription += `\nCurrently Selected War Zone / Disputed Territory: "${z.name}" in ${z.region} (${z.status}).`;
    }

    const formattedHistory = Array.isArray(conversationHistory)
      ? conversationHistory
          .slice(-20)
          .map((m: any) => `${m.role === 'user' ? 'User' : 'ChronoMap Historian'}: ${m.content}`)
          .join('\n\n')
      : '';

    const prompt = `Answer the user's historical, military, geopolitical, or counterfactual question in comprehensive detail.

Optional Map Context (only use if directly relevant to the user's question):
${contextDescription}

Recent Conversation History (up to 20 turns):
${formattedHistory}

User's Question: "${safeMessage}"`;

    const aiReplyText = await generateChatReplyText(prompt);
    const isWhatIf = /what if|alternate|would have happened|counterfactual|suppose/i.test(safeMessage);

    return jsonResponse({
      reply: aiReplyText || localFallback.reply,
      isWhatIf: isWhatIf || localFallback.isWhatIf,
      sources: localFallback.sources
    });
  }

  // 2. /api/history/year-snapshot
  if (routePath.includes('year-snapshot')) {
    const numYear = typeof body.year === 'number' ? body.year : 2026;
    const yearString = numYear < 0 ? `${Math.abs(numYear)} BCE` : `${numYear} CE`;
    const fallbackSnapshot = generateLocalYearSnapshot(numYear);

    const prompt = `You are an expert academic cartographer and world historian. Generate an objective, rigorous geopolitical and historical summary for the world in the year ${yearString}.
Return ONLY valid JSON with this exact schema:
{
  "yearDisplay": "${yearString}",
  "eraName": "Concise historical era title",
  "summary": "2-3 sentences capturing global geopolitical dynamics, shifts in power, and major trade/frontier movements in ${yearString}.",
  "dominantEmpires": [
    {
      "name": "Exact Name of Empire/Kingdom/State",
      "region": "Continent or Geographic Basin",
      "ruler": "Name and title of ruler in this exact year",
      "capital": "Seat of government",
      "description": "1-2 sentences on territorial reach and status"
    }
  ],
  "activeConflicts": [
    {
      "name": "Historical War or Disputed Zone Name",
      "region": "Geographic area",
      "severity": "high" | "medium" | "low",
      "isDisputed": true,
      "description": "Brief summary of combatants and territorial friction"
    }
  ],
  "keyDevelopments": [
    "Key historical event or turning point occurring around ${yearString}"
  ]
}`;

    const result = await generateJsonWithFallback(prompt, fallbackSnapshot);
    return jsonResponse({
      ...fallbackSnapshot,
      ...result,
      year: numYear,
      yearDisplay: result.yearDisplay || yearString,
      dominantEmpires: Array.isArray(result.dominantEmpires)
        ? result.dominantEmpires
        : fallbackSnapshot.dominantEmpires,
      activeConflicts: Array.isArray(result.activeConflicts)
        ? result.activeConflicts
        : fallbackSnapshot.activeConflicts,
      keyDevelopments: Array.isArray(result.keyDevelopments)
        ? result.keyDevelopments
        : fallbackSnapshot.keyDevelopments
    });
  }

  // 3. /api/history/search
  if (routePath.includes('search')) {
    const query = typeof body.query === 'string' && body.query.trim() ? body.query.trim() : '';
    if (!query || isFictionalOrNonHistoricalQuery(query)) {
      return jsonResponse({
        notFound: true,
        message: `We could not find "${query}" anywhere. Please search for a real historical person, place, empire, or conflict.`
      });
    }

    const fallbackSearch = await resolveWikipediaDeepSearch(query);

    const prompt = `You are a strict historical cartographer and encyclopedist. The user searched for: "${query}".
First, determine whether "${query}" is a REAL-WORLD historical figure/leader, a REAL city/place on Earth, a REAL historical empire/civilization/kingdom, a REAL historical battle/war/event, or a REAL modern country.
CRITICAL RULE: If "${query}" is a fictional character (e.g., Harry Potter, Batman, Naruto, Goku, Sherlock Holmes, King Arthur), a fictional or mythical place (e.g., Wakanda, Hogwarts, Mordor, Gotham, Atlantis, Westeros, Narnia), a pop-culture franchise, video game, food, everyday object, tech product, gibberish, or anything non-relevant to real world history and geography, you MUST set "notFound": true.

Return ONLY valid JSON with this exact schema:
{
  "notFound": false,
  "message": "",
  "title": "Canonical Name",
  "subtitle": "Concise role or designation and era",
  "category": "figure" | "city" | "empire" | "country",
  "year": -218,
  "longitude": 10.32,
  "latitude": 36.85,
  "modernCountry": "Tunisia",
  "summary": "2 concise sentences explaining the historical significance and location."
}`;

    const parsed = await generateJsonWithFallback(prompt, fallbackSearch, 9000);
    if (parsed?.notFound) {
      return jsonResponse({
        notFound: true,
        message:
          parsed.message ||
          `We could not find "${query}" anywhere. Please search for a real historical person, place, empire, or conflict.`
      });
    }

    return jsonResponse({
      notFound: false,
      title: parsed.title || fallbackSearch.title,
      subtitle: parsed.subtitle || fallbackSearch.subtitle,
      category: parsed.category || fallbackSearch.category,
      year:
        typeof parsed.year === 'number'
          ? Math.max(-3000, Math.min(2026, parsed.year))
          : fallbackSearch.year,
      longitude: typeof parsed.longitude === 'number' ? parsed.longitude : fallbackSearch.longitude,
      latitude: typeof parsed.latitude === 'number' ? parsed.latitude : fallbackSearch.latitude,
      modernCountry: parsed.modernCountry || fallbackSearch.modernCountry,
      summary: parsed.summary || fallbackSearch.summary
    });
  }

  // 4. /api/history/deepdive
  if (routePath.includes('deepdive')) {
    const {
      countryName = 'Selected Territory',
      modernCountry = '',
      entityType = 'country',
      year = 2026
    } = body;
    const numYear = typeof year === 'number' ? year : 2026;
    const yearString = numYear < 0 ? `${Math.abs(numYear)} BCE` : `${numYear} CE`;
    const targetLabel =
      modernCountry && modernCountry !== countryName
        ? `${countryName} (modern territory: ${modernCountry})`
        : countryName;

    const fallbackDossier = {
      name: countryName,
      year: yearString,
      yearHeadline: `What Happened in ${countryName} in ${yearString}`,
      yearRuler: '',
      yearCapital: '',
      generalOverview: '',
      yearDetailedNarrative: '',
      yearMajorEvents: [] as string[],
      yearPoliticalAndDiplomaticState: '',
      yearEconomicAndSocialDevelopments: ''
    };

    const prompt = `You are a master world historian and geopolitical archivist.
Provide a comprehensive, highly detailed two-part historical dossier for "${targetLabel}" (${entityType}) specifically anchored to the exact year ${yearString}:
Part 1: General information about "${targetLabel}" across history (geography, origins, civilizational identity, long-term trajectory).
Part 2: Full, granular detail of everything major that happened in "${targetLabel}" specifically during the year ${yearString} (exact political events, leadership, wars/battles, treaties, economic/infrastructure developments, and societal milestones in ${yearString}).

Return ONLY valid JSON matching this exact schema:
{
  "name": "${String(countryName).replace(/"/g, '\\"')}",
  "year": "${yearString}",
  "yearHeadline": "Specific headline summarizing the major historical developments in ${String(countryName).replace(/"/g, '\\"')} during ${yearString}",
  "yearRuler": "Exact ruler, monarch, president, and/or prime minister governing in ${yearString}",
  "yearCapital": "Exact capital city or seat of power in ${yearString}",
  "generalOverview": "2 detailed paragraphs explaining ${String(countryName).replace(/"/g, '\\"')} in general—its geography, historical foundations, strategic importance, and long-term historical arc.",
  "yearDetailedNarrative": "2-3 detailed paragraphs telling the full story of what happened in ${String(countryName).replace(/"/g, '\\"')} specifically in the year ${yearString}.",
  "yearMajorEvents": [
    "Specific major event #1 in ${yearString} (include month/date, key figures, and outcome where applicable)",
    "Specific major event #2 in ${yearString}",
    "Specific major event #3 in ${yearString}",
    "Specific major event #4 in ${yearString}",
    "Specific major event #5 in ${yearString}"
  ],
  "yearPoliticalAndDiplomaticState": "2-3 sentences on domestic governance, laws/constitutions, and foreign diplomacy specifically in ${yearString}.",
  "yearEconomicAndSocialDevelopments": "2-3 sentences on economy, trade, infrastructure projects, and society specifically in ${yearString}."
}`;

    const result = await generateJsonWithFallback(prompt, fallbackDossier, 16000);
    return jsonResponse({
      ...fallbackDossier,
      ...result,
      yearMajorEvents: Array.isArray(result.yearMajorEvents) ? result.yearMajorEvents : []
    });
  }

  return jsonResponse({ status: 'ok', service: 'ChronoMap History API' });
};
