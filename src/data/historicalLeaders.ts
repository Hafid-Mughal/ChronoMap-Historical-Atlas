/**
 * Historical Leaders Catalog for Leader Perspectives Dialogue
 */

export interface HistoricalLeader {
  id: string;
  name: string;
  title: string;
  realm: string;
  year: number;
  eraLabel: string;
  avatarSeed: string;
  quote: string;
  strategicMindset: string;
  suggestedQuestions: string[];
}

export const HISTORICAL_LEADERS: HistoricalLeader[] = [
  {
    id: 'leader_augustus',
    name: 'Caesar Augustus',
    title: 'First Roman Emperor & Princeps',
    realm: 'Roman Empire',
    year: 1,
    eraLabel: '1 CE (Pax Romana)',
    avatarSeed: 'augustus',
    quote: 'I found Rome a city of bricks and left it a city of marble.',
    strategicMindset: 'Preserving republican façade while consolidating autocratic imperium, securing defensible river frontiers along the Rhine and Danube, and promoting Roman civic religion.',
    suggestedQuestions: [
      'Why did you choose to halt Roman expansion at the Rhine after the disaster of Varus?',
      'How did you convince the Roman Senate to yield absolute power without declaring yourself king?',
      'What was your strategy for stabilizing the Mediterranean grain supply from Egypt?'
    ]
  },
  {
    id: 'leader_napoleon',
    name: 'Napoleon Bonaparte',
    title: 'Emperor of the French',
    realm: 'French Empire',
    year: 1812,
    eraLabel: '1812 CE (Napoleonic Wars)',
    avatarSeed: 'napoleon',
    quote: 'War is the business of barbarians, but victory belongs to the persevering.',
    strategicMindset: 'Mastery of rapid operational maneuver (manoeuvre sur les derrières), meritocratic corps command, unified civil legal code, and continental economic warfare against Britain.',
    suggestedQuestions: [
      'What led you to invade Russia with 600,000 men rather than consolidating Central Europe?',
      'How did the Napoleonic Code transform European law permanently, regardless of military defeat?',
      'Why did the Continental System fail to bring Great Britain to its knees?'
    ]
  },
  {
    id: 'leader_saladin',
    name: 'Salah ad-Din (Saladin)',
    title: 'Sultan of Egypt & Syria',
    realm: 'Ayyubid Sultanate',
    year: 1200,
    eraLabel: '1200 CE (High Middle Ages)',
    avatarSeed: 'saladin',
    quote: 'I warn you against shedding blood, for blood never sleeps.',
    strategicMindset: 'Unifying Muslim factions under righteous leadership, showing chivalric magnanimity toward captured enemies, and controlling vital trade intersections between the Nile and Euphrates.',
    suggestedQuestions: [
      'How were you able to unite Egypt, Syria, and upper Mesopotamia into a unified front?',
      'Why did you choose chivalrous clemency rather than vengeance when recapturing Jerusalem in 1187?',
      'What was your impression of King Richard the Lionheart during the Third Crusade negotiations?'
    ]
  },
  {
    id: 'leader_genghis_khan',
    name: 'Genghis Khan (Temüjin)',
    title: 'Universal Ruler of the Steppes',
    realm: 'Mongol Empire',
    year: 1200,
    eraLabel: '1200 CE (Mongol Expansion)',
    avatarSeed: 'genghis',
    quote: 'I am the punishment of God. If you had not committed great sins, God would not have sent a punishment like me.',
    strategicMindset: 'Abolishing hereditary aristocracy in favor of strict meritocracy, weaponizing psychological terror, psychological reconnaissance, and deploying lightning horse-archer mobility.',
    suggestedQuestions: [
      'How did you forge a unified nation from nomadic rival tribes that had feuded for generations?',
      'Why did your empire guarantee complete religious freedom and diplomatic immunity across conquered lands?',
      'What was your military calculus in subordinating the Jurchen Jin Empire and Khwarazm?'
    ]
  },
  {
    id: 'leader_churchill',
    name: 'Winston Churchill',
    title: 'Prime Minister of the United Kingdom',
    realm: 'British Empire',
    year: 1939,
    eraLabel: '1939 CE (World War II)',
    avatarSeed: 'churchill',
    quote: 'We shall defend our island, whatever the cost may be. We shall never surrender.',
    strategicMindset: 'Unshakable moral resolve against fascist tyranny, harnessing the English language as an instrument of war, and prioritizing the Anglo-American alliance and naval perimeter defense.',
    suggestedQuestions: [
      'How did you maintain British resolve during 1940 when standing entirely alone against Nazi-dominated Europe?',
      'What was your calculus in coordinating with Joseph Stalin despite your long-standing anti-communist beliefs?',
      'How did the Royal Air Force win the Battle of Britain against superior German numbers?'
    ]
  },
  {
    id: 'leader_jfk',
    name: 'John F. Kennedy',
    title: '35th President of the United States',
    realm: 'United States of America',
    year: 1962,
    eraLabel: '1962 CE (Cuban Missile Crisis)',
    avatarSeed: 'jfk',
    quote: 'Mankind must put an end to war before war puts an end to mankind.',
    strategicMindset: 'Resisting military joint chiefs demanding immediate airstrikes, opting for a calibrated naval quarantine to provide off-ramps and avert thermonuclear holocaust.',
    suggestedQuestions: [
      'What went through your mind in the Oval Office when U-2 spy photos revealed nuclear launch pads in Cuba?',
      'Why did you choose a naval quarantine rather than the preemptive airstrikes your generals urged?',
      'What secret compromise with Premier Khrushchev ultimately defused the standoff?'
    ]
  },
  {
    id: 'leader_darius',
    name: 'Darius I (The Great)',
    title: 'King of Kings (Shahanshah)',
    realm: 'Achaemenid Persian Empire',
    year: -500,
    eraLabel: '500 BCE (Classical Persia)',
    avatarSeed: 'darius',
    quote: 'By the favor of Ahuramazda I am of such a sort that I am a friend to what is right.',
    strategicMindset: 'Decentralized satrapy governance with local cultural autonomy, unified imperial coinage (Daric), monumental architecture at Persepolis, and the Royal Road communication artery.',
    suggestedQuestions: [
      'How did you govern an empire of over twenty distinct nations and languages peacefully?',
      'What was the purpose and engineering behind the Royal Road connecting Susa to Sardis?',
      'Why did the Ionian Revolt draw Persian forces into conflict across the Aegean with Athens?'
    ]
  },
  {
    id: 'leader_narmer',
    name: 'Pharaoh Narmer',
    title: 'Unifer of the Two Lands',
    realm: 'Early Dynastic Egypt',
    year: -3000,
    eraLabel: '3000 BCE (Bronze Age Dawn)',
    avatarSeed: 'narmer',
    quote: 'Under the double crown of Upper and Lower Egypt, the Nile flows as one sacred realm.',
    strategicMindset: 'Ritualistic and military unification of northern delta marshlands with southern valley chiefdoms, establishing divine kingship as the guarantor of cosmic order (Ma’at).',
    suggestedQuestions: [
      'What symbolism is captured on the Narmer Palette regarding the unification of Egypt?',
      'How did control over the Nile floodwaters enable the world’s first territorial state?',
      'What early administrative systems did you establish at the first capital of Memphis?'
    ]
  }
];

export function getLeaderForEra(year: number): HistoricalLeader {
  let closest = HISTORICAL_LEADERS[0];
  let minDiff = Math.abs(year - closest.year);

  for (const leader of HISTORICAL_LEADERS) {
    const diff = Math.abs(year - leader.year);
    if (diff < minDiff) {
      minDiff = diff;
      closest = leader;
    }
  }

  return closest;
}
