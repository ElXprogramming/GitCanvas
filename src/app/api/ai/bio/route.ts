import { NextRequest, NextResponse } from 'next/server';
import { BioTone, ArchetypeId } from '@/types';

interface GenerateBioRequest {
  username: string;
  name: string;
  archetypeId: ArchetypeId;
  archetypeLabel: string;
  dominantLanguages: string[];
  tone: BioTone;
  company?: string;
  location?: string;
  existingBio?: string;
  topRepoNames?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateBioRequest = await req.json();
    const {
      username,
      name,
      archetypeId,
      archetypeLabel,
      dominantLanguages = [],
      tone = 'professional',
      company,
      location,
      existingBio,
      topRepoNames = [],
    } = body;

    const langsStr = dominantLanguages.join(', ') || 'modern technologies';
    const topProject = topRepoNames[0] || 'innovative developer tools';

    // Check if GEMINI_API_KEY is available for direct LLM generation
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const prompt = `You are an elite developer branding expert. Generate tailored GitHub Profile README bio content for a developer with the following profile:
- Name: ${name || username} (@${username})
- Developer Archetype: ${archetypeLabel} (${archetypeId})
- Dominant Languages/Tech: ${langsStr}
- Current Bio: ${existingBio || 'None'}
- Company/Org: ${company || 'Independent'}
- Location: ${location || 'Global'}
- Top Repositories: ${topRepoNames.slice(0, 3).join(', ') || 'Various'}
- Selected Tone: ${tone} (Options: professional, minimalist, playful, storyteller)

Respond ONLY with valid JSON matching this schema:
{
  "tagline": "A punchy 1-sentence developer tagline reflecting the archetype and tone",
  "workingOn": "Concise text for '🔭 Working on...'",
  "learning": "Concise text for '🌱 Currently learning...'",
  "askMeAbout": "Concise text for '💬 Ask me about...'",
  "reachMe": "Concise text for '📫 How to reach me...'",
  "openFor": "Concise text for '💼 Open for...'",
  "funFact": "Concise text for '⚡ Fun fact...'"
}`;

        const aiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.7,
              },
            }),
          }
        );

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const rawText = aiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return NextResponse.json(parsed);
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to intelligent archetype synthesis:', geminiError);
      }
    }

    // Contextual intelligent synthesis engine
    const synthesis = generateContextualBio({
      archetypeId,
      dominantLanguages,
      tone,
      company,
      topProject,
    });

    return NextResponse.json(synthesis);
  } catch (error: any) {
    console.error('AI Bio Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate bio. Using defaults.' },
      { status: 500 }
    );
  }
}

function generateContextualBio({
  archetypeId,
  dominantLanguages,
  tone,
  company,
  topProject,
}: {
  archetypeId: ArchetypeId;
  dominantLanguages: string[];
  tone: BioTone;
  company?: string;
  topProject: string;
}) {
  const primaryLang = dominantLanguages[0] || 'TypeScript';
  const secondaryLang = dominantLanguages[1] || 'modern tech';

  if (tone === 'minimalist') {
    return {
      tagline: `Building with ${dominantLanguages.slice(0, 3).join(', ')}.`,
      workingOn: `${topProject}`,
      learning: `Advanced patterns in ${primaryLang}`,
      askMeAbout: dominantLanguages.slice(0, 3).join(', '),
      reachMe: `Email or GitHub discussions`,
      openFor: `Interesting challenges`,
      funFact: `Tabs over spaces. Clean diffs over long threads.`,
    };
  }

  if (tone === 'playful') {
    return {
      tagline: `Converting caffeine, curiosity, and code into working systems ⚡`,
      workingOn: `${topProject} (and probably 5 other half-finished side quests) 🚀`,
      learning: `How to break things faster in ${primaryLang} and fix them with ${secondaryLang} 🪄`,
      askMeAbout: `${dominantLanguages.slice(0, 3).join(', ')}, debugging nightmares, and favorite terminal themes 👾`,
      reachMe: `Ping me before my third espresso ☕`,
      openFor: `Chaotic good open source collaborations & wild ideas 💡`,
      funFact: `My code works on the first try... in another universe 🌌`,
    };
  }

  if (tone === 'storyteller') {
    return {
      tagline: `Architecting software journeys where elegant design meets battle-tested resilience.`,
      workingOn: `Breathing life into ${topProject} to solve real-world workflows`,
      learning: `Deeper concurrency models and expressive patterns across ${primaryLang}`,
      askMeAbout: `The craft of software design, domain-driven architecture, and ${secondaryLang}`,
      reachMe: `Let's connect over thoughtful technical discourse or digital coffee`,
      openFor: `Meaningful open-source impact and mentorship opportunities`,
      funFact: `I treat commit histories like narrative arcs — clean, intentional, and readable.`,
    };
  }

  // Professional / Executive (Default)
  const archetypeTaglines: Record<ArchetypeId, string> = {
    frontend: `Frontend Architect specializing in scalable design systems, responsive performance, and modern web applications.`,
    backend: `Systems & Backend Engineer designing high-throughput APIs, distributed datastores, and resilient services.`,
    ai_data: `AI & Machine Learning Engineer crafting intelligent models, data pipelines, and agentic systems.`,
    devops: `Platform & DevOps Specialist automating cloud infrastructure, CI/CD pipelines, and high-reliability systems.`,
    fullstack: `Full-Stack Software Engineer delivering end-to-end digital products from responsive UI to resilient cloud architecture.`,
  };

  return {
    tagline: archetypeTaglines[archetypeId] || `Senior Engineer building resilient, scalable software systems.`,
    workingOn: `Production-ready architecture for ${topProject}${company ? ` at ${company}` : ''}`,
    learning: `Distributed systems design, performance profiling, and ecosystem innovations in ${primaryLang}`,
    askMeAbout: `${dominantLanguages.slice(0, 3).join(', ')}, system scalability, and software engineering best practices`,
    reachMe: `LinkedIn, professional email, or GitHub issues`,
    openFor: `Consulting, technical advisory, and high-impact open source contributions`,
    funFact: `Believer in automated testing: if it's not tested, it's already broken 🧪`,
  };
}
