/**
 * Curated Counterfactual Scenarios for AI What-If Simulator
 */

export interface PresetScenario {
  id: string;
  title: string;
  tagline: string;
  year: number;
  region: string;
  divergencePrompt: string;
  historicalContext: string;
}

export const PRESET_WHAT_IF_SCENARIOS: PresetScenario[] = [
  {
    id: 'alexandria_library',
    title: 'The Unburned Library of Alexandria',
    tagline: 'What if humanity’s ancient knowledge repository had survived intact?',
    year: -48,
    region: 'Hellenistic Egypt & Mediterranean',
    divergencePrompt: 'What if the Great Library of Alexandria was never burned or dispersed, and ancient Greek, Babylonian, and Egyptian scientific treatises remained continuously preserved into the medieval era?',
    historicalContext: 'Julius Caesar’s fleet fire in 48 BCE and subsequent sectarian purges devastated hundreds of thousands of scrolls containing lost astronomy, mathematics, and medicine.'
  },
  {
    id: 'spanish_armada_1588',
    title: 'Triumph of the Spanish Armada',
    tagline: 'What if Philip II’s naval invasion had conquered Elizabethan England?',
    year: 1588,
    region: 'British Isles & Western Europe',
    divergencePrompt: 'What if the Spanish Armada had avoided the Protestant Wind storms in 1588, successfully ferried the Duke of Parma’s veteran Spanish Tercios across the English Channel, and overthrown Queen Elizabeth I?',
    historicalContext: 'A storm-battered Armada failed to land troops, preserving English naval autonomy, Protestant independence, and Anglo-American colonial trajectories.'
  },
  {
    id: 'napoleon_moscow_retreat',
    title: 'Napoleon Abandons Moscow Early',
    tagline: 'What if the Grande Armée had preserved its 400,000 veterans in 1812?',
    year: 1812,
    region: 'Eastern Europe & France',
    divergencePrompt: 'What if Napoleon had declined to wait five fateful weeks in burned Moscow, instead retiring in September 1812 to establish secure winter headquarters in Smolensk and Poland with his 400,000-man army intact?',
    historicalContext: 'Waiting too long exposed the French army to the catastrophic Russian winter, losing nearly the entire army and paving the way for the Sixth Coalition.'
  },
  {
    id: 'archduke_sarajevo_1914',
    title: 'Archduke Ferdinand Survives Sarajevo',
    tagline: 'What if the motorcade took the correct turn on June 28, 1914?',
    year: 1914,
    region: 'Balkans & Central Europe',
    divergencePrompt: 'What if Archduke Franz Ferdinand’s car had not turned down Franz Josef Street in Sarajevo, preventing Gavrilo Princip from firing, and allowing the reform-minded Archduke to ascend the Habsburg throne?',
    historicalContext: 'Franz Ferdinand advocated for "United States of Greater Austria" tri-monarchy federalism that would have granted Slavic peoples equal rights, potentially averting the July Crisis.'
  },
  {
    id: 'cuban_missile_crisis_escalation',
    title: 'Cuban Missile Crisis: The Hot War',
    tagline: 'What if the Soviet submarine B-59 launched its nuclear torpedo?',
    year: 1962,
    region: 'Caribbean & North Atlantic',
    divergencePrompt: 'What if Captain Savitsky of Soviet submarine B-59 had launched his 10-kiloton nuclear torpedo during US depth charge signaling on October 27, 1962, triggering full conventional and tactical naval conflict?',
    historicalContext: 'Soviet brigade chief of staff Vasili Arkhipov famously cast the single dissenting vote against two other officers on board, preventing an immediate nuclear launch.'
  },
  {
    id: 'zheng_he_atlantic',
    title: 'Ming Treasure Fleets Enter the Atlantic',
    tagline: 'What if China’s maritime expeditions had rounded Africa before Europe?',
    year: 1421,
    region: 'Indian Ocean & Atlantic Basin',
    divergencePrompt: 'What if the Ming Dynasty had not decommissioned Admiral Zheng He’s colossal 400-foot treasure fleets in 1433, instead rounding the Cape of Good Hope into the South Atlantic sixty years before Columbus?',
    historicalContext: 'Ming court Confucian scholars halted all outward maritime expeditions in 1433, burning naval blueprints to focus treasury resources on the northern Mongol land borders.'
  }
];
