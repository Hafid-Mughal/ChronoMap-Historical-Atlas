import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import fs from 'fs';
import {
  generateLocalHistorianReply,
  resolveWikipediaDeepSearch
} from './src/data/localHistorianFallback';
import { isFictionalOrNonHistoricalQuery } from './src/data/historicalSearchIndex';

dotenv.config({ quiet: true } as any);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI client supporting standard environment variable names
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
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });
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

// Safely parse JSON from model output (stripping markdown fences if present)
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

// Resilient Gemini helper that tries gemini-3-flash-preview and falls back cleanly
async function generateJsonWithFallback<T = any>(
  prompt: string,
  fallbackData: T,
  timeoutMs = 20000
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
      // Try next model in fallback chain silently
    }
  }

  return fallbackData;
}

// High-capacity markdown text generator for the AI Historian Chat with High Thinking & resilient fallback
async function generateChatReplyText(
  prompt: string,
  timeoutMs = 35000
): Promise<string | null> {
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
      // Try next attempt in fallback chain silently
    }
  }

  return null;
}

// 1. Year Snapshot API (Synthesizes historical state for any continuous year)
app.post('/api/history/year-snapshot', async (req: Request, res: Response) => {
  const rawYear = req.body?.year;
  const year = typeof rawYear === 'number' ? rawYear : 2026;
  const yearString = year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;

  const fallbackSnapshot = {
    year,
    yearDisplay: yearString,
    eraName:
      year < -500
        ? `Age of Ancient Civilizations (${yearString})`
        : year < 500
        ? `Classical Antiquity & Imperial Frontiers (${yearString})`
        : year < 1500
        ? `Medieval Realms & Silk Road Networks (${yearString})`
        : year < 1914
        ? `Age of Global Empires & Industrialization (${yearString})`
        : `Modern Geopolitical Order (${yearString})`,
    summary: `In ${yearString}, global geopolitics was defined by shifting territorial sovereignty, overland and maritime trade corridors, and strategic competition across Afro-Eurasia and the Americas.`,
    dominantEmpires: [
      {
        name:
          year >= 1890 && year <= 1918
            ? 'British, Russian, German & Austro-Hungarian Empires'
            : year < 500
            ? 'Classical Mediterranean, Persian, Mauryan & Han Realms'
            : 'Major Sovereign Powers & Regional Empires',
        region: 'Global',
        ruler: 'Contemporary Heads of State & Dynasties',
        capital: 'Imperial & National Capitals',
        description: `Held primary territorial, military, and economic influence across major continental basins in ${yearString}.`
      },
      {
        name: 'Maritime & Overland Mercantile Powers',
        region: 'Eurasia & Indo-Pacific',
        ruler: 'Merchant Guilds & Royal Courts',
        capital: 'Key Entrepôt Cities',
        description: `Controlled strategic straits, river valleys, and Silk Road / Spice Route trade networks in ${yearString}.`
      }
    ],
    activeConflicts: [
      {
        name: `Frontier & Sovereignty Disputes of ${yearString}`,
        region: 'Contested Marchlands',
        severity: 'medium',
        isDisputed: true,
        description: 'Territorial competition over trade hubs, fertile river basins, and strategic mountain passes.'
      }
    ],
    keyDevelopments: [
      `Consolidation of territorial boundaries and diplomatic treaties around ${yearString}`,
      'Expansion of long-distance overland caravan and maritime monsoon trade routes',
      'Advances in military fortification, metallurgy, navigation, and state administration'
    ]
  };

  try {
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
}
Ensure high factual accuracy for ${yearString}. Provide 3 to 4 dominant empires and 2 to 3 major wars/disputes of that time.`;

    const result = await generateJsonWithFallback(prompt, fallbackSnapshot);
    return res.json({
      ...fallbackSnapshot,
      ...result,
      year,
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
    } catch {
    return res.json(fallbackSnapshot);
  }
});

// 2. What-If Counterfactual Alternate History Simulator API
app.post('/api/history/what-if', async (req: Request, res: Response) => {
  const { scenario = 'Historical Divergence', year = 2026, contextEntity = 'Global' } = req.body || {};
  const fallbackWhatIf = {
    scenario,
    year,
    plausibility: 'Academic Counterfactual Assessment',
    immediateDivergence: `If ${scenario} occurred around ${year}, immediate military logistics, balance of power, and alliance treaties would deviate significantly from documented historical canon.`,
    tenYearRepercussions:
      'A decade later, revised border treaties, shifting dynastic successions, and altered trade routes redefine neighboring states.',
    fiftyYearAftermath:
      'Half a century on, the ideological, technological, and colonial balance of world power has branched into an alternate historical reality.',
    territorialShifts: [
      {
        entity: contextEntity || 'Primary State',
        shift: 'Borders expand or contract depending on naval and land control',
        rationale: 'Treaty renegotiation'
      }
    ],
    butterflyEffects: [
      'Altered diplomatic alignments among neighboring powers',
      'Shift in maritime trading dominance and economic capital flows',
      'Different intellectual and institutional developments in the affected region'
    ],
    modernEcho:
      'In the contemporary era, language distribution, national borders, and cultural spheres reflect this alternate timeline.'
  };

  try {
    const prompt = `You are a distinguished counterfactual historian and geopolitical simulation expert.
Analyze the following historical 'What-If' scenario:
Scenario: "${scenario}"
Anchor Year: ${year}
Focal Entity/Region: "${contextEntity || 'Global'}"

Return ONLY valid JSON matching this schema:
{
  "scenario": "${String(scenario).replace(/"/g, '\\"')}",
  "plausibility": "High / Plausible / Speculative with explanation",
  "immediateDivergence": "2-3 sentences explaining the immediate tactical and political fallout within months to 1 year.",
  "tenYearRepercussions": "2-3 sentences on the 10-year geopolitical realignment, altered treaties, and border shifts.",
  "fiftyYearAftermath": "2-3 sentences explaining the world 50 years later.",
  "territorialShifts": [
    {
      "entity": "Name of empire or country",
      "shift": "Territory gained, preserved, or lost",
      "rationale": "Causal strategic reason"
    }
  ],
  "butterflyEffects": [
    "Concrete cultural, scientific, or demographic consequence"
  ],
  "modernEcho": "How this single historical divergence would fundamentally alter the world map in the 21st century."
}`;

    const result = await generateJsonWithFallback(prompt, fallbackWhatIf);
    return res.json({ ...fallbackWhatIf, ...result });
  } catch {
    return res.json(fallbackWhatIf);
  }
});

// 3. Deep-dive Historical & Year-Specific Chronicle Dossier API for any selected country, empire, or conflict zone
app.post('/api/history/deepdive', async (req: Request, res: Response) => {
  const {
    countryName = 'Selected Territory',
    modernCountry = '',
    entityType = 'country',
    year = 2026
  } = req.body || {};
  const numYear = typeof year === 'number' ? year : 2026;
  const yearString = numYear < 0 ? `${Math.abs(numYear)} BCE` : `${numYear} CE`;
  const targetLabel = modernCountry && modernCountry !== countryName
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

  try {
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

    const result = await generateJsonWithFallback(prompt, fallbackDossier, 18000);
    return res.json({
      ...fallbackDossier,
      ...result,
      yearMajorEvents: Array.isArray(result.yearMajorEvents) ? result.yearMajorEvents : []
    });
  } catch {
    return res.json(fallbackDossier);
  }
});

// 4. Unified AI Historian, Geopolitics & What-If Counterfactual Chat API
app.post('/api/history/chat', async (req: Request, res: Response) => {
  const { message = '', year = 2026, activeContext, conversationHistory } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const numYear = typeof year === 'number' ? year : 2026;
  const yearString = numYear < 0 ? `${Math.abs(numYear)} BCE` : `${numYear} CE`;

  let contextDescription = `Active Map Timeline Year: ${yearString}.`;
  let focusTopic = message.slice(0, 60);
  if (activeContext?.type === 'country' && activeContext.data) {
    const c = activeContext.data;
    focusTopic = c.name || focusTopic;
    contextDescription += `\nCurrently Selected Country/Empire on Map: "${c.name}" (Modern area: ${c.modernCountry || c.name}). Ruler: ${c.ruler || 'N/A'}, Capital: ${c.capital || 'N/A'}, Population: ${c.populationEstimate || 'N/A'}. Summary: ${c.description || ''}`;
  } else if (activeContext?.type === 'conflict' && activeContext.data) {
    const z = activeContext.data;
    focusTopic = z.name || focusTopic;
    contextDescription += `\nCurrently Selected War Zone / Disputed Territory: "${z.name}" in ${z.region} (${z.status}, Severity: ${z.severity}). Combatants/Claimants: ${(z.combatantsOrClaimants || []).join(', ')}. Summary: ${z.summary || ''} Root Cause: ${z.historicalRoot || ''}`;
  }

  const encodedFocus = encodeURIComponent(focusTopic);
  const defaultCreditedSources = [
    {
      title: `Encyclopedia Britannica — ${focusTopic}`,
      organization: 'Encyclopedia Britannica',
      url: `https://www.britannica.com/search?query=${encodedFocus}`,
      category: 'History & Encyclopedia'
    },
    {
      title:
        activeContext?.type === 'conflict'
          ? 'CFR Global Conflict Tracker'
          : `Council on Foreign Relations — ${focusTopic}`,
      organization: 'Council on Foreign Relations (CFR)',
      url:
        activeContext?.type === 'conflict'
          ? 'https://www.cfr.org/global-conflict-tracker'
          : `https://www.cfr.org/search?keyword=${encodedFocus}`,
      category: 'Geopolitics & Conflict'
    },
    {
      title:
        numYear < 1900
          ? 'UNESCO Silk Roads & World Heritage Archives'
          : 'International Crisis Group — CrisisWatch',
      organization: numYear < 1900 ? 'UNESCO' : 'International Crisis Group (ICG)',
      url:
        numYear < 1900
          ? 'https://en.unesco.org/silkroad/'
          : 'https://www.crisisgroup.org/crisiswatch',
      category: numYear < 1900 ? 'Cartography & Archaeology' : 'Geopolitics & Conflict'
    },
    {
      title: 'Library of Congress Historical Collections',
      organization: 'U.S. Library of Congress',
      url: `https://www.loc.gov/search/?q=${encodedFocus}`,
      category: 'Diplomatic Archives'
    }
  ];

  const isWhatIf = /what if|alternate|would have happened|counterfactual|suppose/i.test(message);

  const localFallback = generateLocalHistorianReply({
    message,
    year: numYear,
    activeContext: activeContext as any,
    conversationHistory: Array.isArray(conversationHistory) ? conversationHistory : []
  });

  try {
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

User's Question: "${message}"`;

    const aiReplyText = await generateChatReplyText(prompt);

    return res.json({
      reply: aiReplyText || localFallback.reply,
      isWhatIf: isWhatIf || localFallback.isWhatIf,
      sources: localFallback.sources.length > 0 ? localFallback.sources : defaultCreditedSources
    });
  } catch {
    return res.json({
      reply: localFallback.reply,
      isWhatIf: localFallback.isWhatIf,
      sources: localFallback.sources.length > 0 ? localFallback.sources : defaultCreditedSources
    });
  }
});

// 5. AI Historical & Geographic Search Resolver (for any figure, city, battle, empire, or country)
app.post('/api/history/search', async (req: Request, res: Response) => {
  const { query = '' } = req.body || {};
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const cleanQuery = query.trim();
  if (isFictionalOrNonHistoricalQuery(cleanQuery)) {
    return res.json({
      notFound: true,
      message: `We could not find "${cleanQuery}" anywhere. Please search for a real historical person, place, empire, or conflict.`
    });
  }

  const fallbackSearch = await resolveWikipediaDeepSearch(cleanQuery);

  try {
    const prompt = `You are a strict historical cartographer and encyclopedist. The user searched for: "${cleanQuery}".
First, determine whether "${cleanQuery}" is a REAL-WORLD historical figure/leader (including their famous historical nickname, epithet, title, or nom de guerre—for example "The White Death" -> Simo Häyhä, "The Red Baron" -> Manfred von Richthofen, "The Desert Fox" -> Erwin Rommel, "The Sun King" -> Louis XIV, "The Iron Chancellor" -> Otto von Bismarck, "The Scourge of God" -> Attila the Hun, "El Cid" -> Rodrigo Díaz de Vivar, "The Leper King" -> Baldwin IV of Jerusalem), a REAL city/place on Earth, a REAL historical empire/civilization/kingdom, a REAL historical battle/war/event, or a REAL modern country.
CRITICAL RULE: If "${cleanQuery}" is a fictional character (e.g., Harry Potter, Batman, Naruto, Goku, Sherlock Holmes, King Arthur), a fictional or mythical place (e.g., Wakanda, Hogwarts, Mordor, Gotham, Atlantis, Westeros, Narnia), a pop-culture franchise, video game, food, everyday object, tech product, gibberish, or anything non-relevant to real world history and geography, you MUST set "notFound": true.

Return ONLY valid JSON with this exact schema:
{
  "notFound": false,
  "message": "",
  "title": "Canonical Real Name (with Famous Title/Nickname)",
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
      return res.json({
        notFound: true,
        message:
          parsed.message ||
          `We could not find "${cleanQuery}" anywhere. Please search for a real historical person, place, empire, or conflict.`
      });
    }

    return res.json({
      notFound: false,
      title: parsed.title || fallbackSearch.title,
      subtitle: parsed.subtitle || fallbackSearch.subtitle,
      category: parsed.category || fallbackSearch.category || 'figure',
      year:
        typeof parsed.year === 'number'
          ? Math.max(-3000, Math.min(2026, parsed.year))
          : fallbackSearch.year,
      longitude: typeof parsed.longitude === 'number' ? parsed.longitude : fallbackSearch.longitude,
      latitude: typeof parsed.latitude === 'number' ? parsed.latitude : fallbackSearch.latitude,
      modernCountry: parsed.modernCountry || fallbackSearch.modernCountry,
      summary: parsed.summary || fallbackSearch.summary
    });
  } catch {
    return res.json(fallbackSearch);
  }
});

// Set up Vite in development or static serve in production
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const hasBuiltDist = fs.existsSync(path.resolve(distPath, 'index.html'));
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else if (hasBuiltDist) {
    app.use(express.static(distPath));
    // Express 5 compatible SPA catch-all middleware
    app.use((_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ChronoMap Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
