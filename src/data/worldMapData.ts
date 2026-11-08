/**
 * World Cartography Data for ChronoAtlas
 * Scaled for a 1000 x 520 Equirectangular Projection Canvas
 */

export interface MapRegion {
  id: string;
  name: string;
  modernCountry?: string;
  capital?: string;
  ruler?: string;
  populationEstimate?: string;
  color: string;
  path: string;
  center: [number, number]; // [x, y] in canvas coordinates
  description: string;
  keyEvents: string[];
  disputeStatus?: string;
  isOpenSpace?: boolean;
}

export interface HistoricalEra {
  id: string;
  year: number;
  label: string;
  epochName: string;
  timeRange: string;
  period: 'BCE' | 'CE';
  summary: string;
  globalDynamics: string;
  keyTurningPoint: string;
  majorEntities: MapRegion[];
}

// 12 Curated Landmark Historical Eras across 5,000 Years
export const HISTORICAL_ERAS: HistoricalEra[] = [
  {
    id: 'era_3000bce',
    year: -3000,
    label: '3000 BCE',
    epochName: 'The Dawn of Bronze & First Dynasties',
    timeRange: '3300 BCE – 2800 BCE',
    period: 'BCE',
    summary: 'The emergence of early urban civilization, bronze metallurgy, and written cuneiform and hieroglyphic scripts along fertile river basins.',
    globalDynamics: 'City-states in Mesopotamia (Uruk, Ur) and the unification of Upper and Lower Egypt under the Early Dynastic kings establish the earliest bureaucratic states.',
    keyTurningPoint: 'Narmer Unification of Egypt & Uruk urban expansion',
    majorEntities: [
      {
        id: 'egypt_early_dynastic',
        name: 'Early Dynastic Egypt',
        modernCountry: 'Egypt',
        capital: 'Memphis / Thinis',
        ruler: 'Pharaoh Narmer / Hor-Aha',
        populationEstimate: '~1.5 Million',
        color: '#D97706',
        center: [580, 240],
        path: 'M 565,225 C 572,228 582,230 588,235 C 592,244 588,260 584,275 C 578,280 570,270 568,255 Z',
        description: 'First unified territorial kingdom under divine monarchy, controlling the fertile Nile Delta and trade corridors to Nubia and the Levant.',
        keyEvents: ['Unification of Upper & Lower Egypt', 'Development of Hieroglyphic Writing', 'Royal Tombs at Abydos']
      },
      {
        id: 'sumer_city_states',
        name: 'Sumerian City-States (Uruk & Ur)',
        modernCountry: 'Iraq',
        capital: 'Uruk / Ur',
        ruler: 'Ensi (Priest-Kings)',
        populationEstimate: '~800,000',
        color: '#2563EB',
        center: [615, 235],
        path: 'M 605,228 C 612,230 622,235 628,242 C 625,248 615,250 608,244 Z',
        description: 'Network of independent city-states pioneering the wheel, monumental mudbrick ziggurats, irrigation canal networks, and cuneiform accounting.',
        keyEvents: ['Invention of Cuneiform Script', 'Monumental Eanna District at Uruk', 'Canal Irrigation Infrastructure']
      },
      {
        id: 'indus_valley_early',
        name: 'Early Indus Valley / Harappan Civilization',
        modernCountry: 'Pakistan / India',
        capital: 'Harappa / Mohenjo-Daro',
        ruler: 'Civic Guilds & Priest Councils',
        populationEstimate: '~1.2 Million',
        color: '#059669',
        center: [685, 250],
        path: 'M 670,235 C 685,238 698,245 700,260 C 692,270 678,268 672,252 Z',
        description: 'Sophisticated grid-planned brick cities with advanced urban drainage, sanitation systems, standardized weights, and maritime trading with Mesopotamia.',
        keyEvents: ['Grid Urban Planning Systems', 'Standardized Weights & Seals', 'Lothal Dockyard Trade']
      },
      {
        id: 'liangzhu_culture',
        name: 'Liangzhu Culture & Yellow River Chiefdoms',
        modernCountry: 'China',
        capital: 'Liangzhu City (Lake Tai)',
        ruler: 'Jade Chiefdom Elites',
        populationEstimate: '~1.0 Million',
        color: '#DC2626',
        center: [790, 240],
        path: 'M 775,230 C 795,232 815,240 820,255 C 805,268 785,260 772,245 Z',
        description: 'Advanced hydraulic civilization in the Yangtze River delta renowned for monumental earthworks, reservoirs, and exquisite carved ceremonial jade artifacts.',
        keyEvents: ['Monumental Hydraulic Dams', 'Jade Cong & Bi Craftsmanship', 'Early Urban Stratification']
      },
      {
        id: 'cycladic_aegean',
        name: 'Cycladic & Early Minoan Aegean',
        modernCountry: 'Greece',
        capital: 'Naxos / Knossos',
        ruler: 'Maritime Chieftains',
        populationEstimate: '~200,000',
        color: '#7C3AED',
        center: [555, 225],
        path: 'M 548,220 C 555,221 562,226 560,232 C 552,234 546,228 548,220 Z',
        description: 'Early maritime bronze-working island networks across the Aegean Sea crafting iconic minimalist marble figurines and dominating regional obsidian sea trade.',
        keyEvents: ['Maritime Obsidian Trade', 'Marble Figurine Artistry', 'Early Bronze Metallurgy']
      }
    ]
  },
  {
    id: 'era_500bce',
    year: -500,
    label: '500 BCE',
    epochName: 'Classical Antiquity & The Axial Age',
    timeRange: '550 BCE – 450 BCE',
    period: 'BCE',
    summary: 'The rise of monumental continental empires, democratic experiments in Greece, and the intellectual foundation of world philosophies (Confucius, Buddha, Socrates).',
    globalDynamics: 'The Achaemenid Empire spans from Thrace to the Indus, while Greek poleis defend self-governance and Indian Mahajanapadas consolidate into empires.',
    keyTurningPoint: 'Ionian Revolt & Darius I Royal Road postal network',
    majorEntities: [
      {
        id: 'achaemenid_persia',
        name: 'Achaemenid Persian Empire',
        modernCountry: 'Iran, Turkey, Egypt, Iraq',
        capital: 'Persepolis & Susa',
        ruler: 'Darius I (The Great)',
        populationEstimate: '~35 Million (40% of humanity)',
        color: '#B45309',
        center: [625, 230],
        path: 'M 570,215 C 610,205 670,215 690,255 C 670,270 600,265 570,245 Z',
        description: 'The largest empire the ancient world had ever seen, celebrated for satrapy administration, religious tolerance, the Cyrus Cylinder, and the Royal Road.',
        keyEvents: ['Construction of Persepolis', 'Creation of the Royal Road Network', 'Greco-Persian Wars Clash']
      },
      {
        id: 'greek_poleis',
        name: 'Greek City-States (Athens, Sparta, Thebes)',
        modernCountry: 'Greece',
        capital: 'Athens / Sparta',
        ruler: 'Cleisthenes (Athens) / Archidamus (Sparta)',
        populationEstimate: '~3.0 Million',
        color: '#2563EB',
        center: [550, 222],
        path: 'M 542,216 C 552,218 558,224 555,230 C 546,231 540,224 542,216 Z',
        description: 'Birthplace of direct democracy, philosophical rationalism, tragedy, and heroic hoplite phalanxes resisting Persian eastern expansion.',
        keyEvents: ['Cleisthenes Democratic Reforms', 'Battle of Marathon (490 BCE)', 'Rise of the Delian League']
      },
      {
        id: 'roman_early_republic',
        name: 'Early Roman Republic',
        modernCountry: 'Italy',
        capital: 'Rome',
        ruler: 'Consuls & Roman Senate',
        populationEstimate: '~1.5 Million',
        color: '#DC2626',
        center: [525, 215],
        path: 'M 518,208 C 525,210 532,218 530,226 C 522,228 516,218 518,208 Z',
        description: 'Emerging republican city-state in central Latium recovering from Etruscan monarchical rule, instituting the Tribunes of the Plebs and Senate oversight.',
        keyEvents: ['Overthrow of Tarquin Monarchy', 'Secessio Plebis & Tribunate Creation', 'Latin League Treaties']
      },
      {
        id: 'magadha_janapadas',
        name: 'Kingdom of Magadha & Mahajanapadas',
        modernCountry: 'India / Ganges Basin',
        capital: 'Rajagriha / Pataliputra',
        ruler: 'King Bimbisara (Haryanka Dynasty)',
        populationEstimate: '~18 Million',
        color: '#059669',
        center: [710, 255],
        path: 'M 690,240 C 720,242 745,255 740,275 C 715,285 690,270 690,240 Z',
        description: 'Dominant kingdom along the Ganges basin, fostering the flourishing of Buddhism (Siddhartha Gautama) and Jainism (Mahavira) amidst iron metallurgy.',
        keyEvents: ['Founding of Buddhist & Jain Traditions', 'Iron Mining & Warfare Expansion', 'Subjugation of Anga']
      },
      {
        id: 'eastern_zhou_china',
        name: 'Eastern Zhou (Spring & Autumn / Pre-Warring States)',
        modernCountry: 'China',
        capital: 'Luoyi (Luoyang)',
        ruler: 'King Jing of Zhou / Duke Huan of Qi',
        populationEstimate: '~25 Million',
        color: '#9333EA',
        center: [800, 235],
        path: 'M 770,215 C 815,215 845,235 835,265 C 800,275 770,255 770,215 Z',
        description: 'Era of intense feudal rivalry between the Hegemon states (Qi, Jin, Chu, Qin), sparking the Hundred Schools of Thought and Sun Tzu Art of War.',
        keyEvents: ['Teachings of Confucius (Kong Fuzi)', 'Sun Tzu Writes The Art of War', 'Rise of Iron Swords & Crossbows']
      }
    ]
  },
  {
    id: 'era_0',
    year: 1,
    label: '1 CE / 0 CE',
    epochName: 'Pax Romana & The Silk Road Dawn',
    timeRange: '27 BCE – 100 CE',
    period: 'CE',
    summary: 'The golden age of transcontinental peace anchored by the Roman Empire in the West and the Han Dynasty in the East, connected by the overland Silk Road.',
    globalDynamics: 'A quarter of the human population lives under Roman administration around the Mediterranean "Mare Nostrum", while Han China stabilizes Central Asian trading oases.',
    keyTurningPoint: 'Augustan Principate & Silk Road trans-continental trade',
    majorEntities: [
      {
        id: 'roman_empire_augustus',
        name: 'Roman Empire (Principate)',
        modernCountry: 'Mediterranean Basin / Europe',
        capital: 'Rome',
        ruler: 'Caesar Augustus (First Emperor)',
        populationEstimate: '~56 Million',
        color: '#DC2626',
        center: [520, 215],
        path: 'M 470,205 C 510,195 565,200 585,240 C 570,255 510,250 470,235 Z',
        description: 'A colossal imperium encompassing the Mediterranean basin, pioneering concrete aqueducts, Roman law, legions, and the Pax Romana peace.',
        keyEvents: ['Pax Romana Established by Augustus', 'Ara Pacis & Forum Construction', 'Teutoburg Forest Clash (9 CE)']
      },
      {
        id: 'han_dynasty_china',
        name: 'Han Dynasty (Western Han / Xin Interregnum)',
        modernCountry: 'China & Central Asia',
        capital: "Chang'an (Xi'an)",
        ruler: 'Emperor Ping / Regent Wang Mang',
        populationEstimate: '~58 Million',
        color: '#B91C1C',
        center: [810, 230],
        path: 'M 760,205 C 810,200 850,225 845,265 C 810,275 765,255 760,205 Z',
        description: 'The golden zenith of Chinese imperial civilization: Confucian state examinations, paper invention, steel casting, and protectorate over the Tarim Basin.',
        keyEvents: ['Silk Road Caravans Reach Rome', 'Paper Invention by Cai Lun', 'Salt & Iron State Monopolies']
      },
      {
        id: 'parthian_empire',
        name: 'Parthian Empire (Arsacid Dynasty)',
        modernCountry: 'Iran, Iraq, Armenia',
        capital: 'Ctesiphon & Hecatompylos',
        ruler: 'Phraates V & Queen Musa',
        populationEstimate: '~16 Million',
        color: '#0D9488',
        center: [640, 230],
        path: 'M 605,215 C 640,210 675,225 670,255 C 635,265 605,250 605,215 Z',
        description: 'Skilled Iranian horse-archers and middlemen of the Silk Road, holding Rome at bay along the Euphrates river and protecting Persian Zoroastrian culture.',
        keyEvents: ['Defeat of Crassus at Carrhae', 'Silk Road Toll Monopolies', 'Armenian Buffer Zone Diplomacy']
      },
      {
        id: 'kushan_empire',
        name: 'Kushan Empire & Indo-Scythians',
        modernCountry: 'Afghanistan, Pakistan, North India',
        capital: 'Purushapura (Peshawar) / Mathura',
        ruler: 'Kujula Kadphises',
        populationEstimate: '~19 Million',
        color: '#D97706',
        center: [690, 240],
        path: 'M 670,225 C 700,220 725,235 720,265 C 695,270 670,255 670,225 Z',
        description: 'A syncretic Greco-Buddhist empire fusing Hellenistic art, Persian royal titles, and Mahayana Buddhism along mountain passes of the Hindu Kush.',
        keyEvents: ['Gandhara Greco-Buddhist Statues', 'Fourth Buddhist Council', 'Silk Trade Confluence']
      }
    ]
  },
  {
    id: 'era_800ce',
    year: 800,
    label: '800 CE',
    epochName: 'Charlemagne, Abbasid Caliphate & Tang Splendor',
    timeRange: '750 CE – 850 CE',
    period: 'CE',
    summary: 'The zenith of the Islamic Golden Age in Baghdad, the coronation of Charlemagne reviving the Western Empire, and the Tang Dynasty cosmopolitan silk empire.',
    globalDynamics: 'The House of Wisdom translates Greek science into Arabic while Viking longships explore Atlantic rivers and Maya city-states build limestone temples in the Americas.',
    keyTurningPoint: 'Coronation of Charlemagne & Baghdad House of Wisdom',
    majorEntities: [
      {
        id: 'abbasid_caliphate',
        name: 'Abbasid Caliphate',
        modernCountry: 'Middle East, North Africa, Central Asia',
        capital: 'Baghdad (Round City)',
        ruler: 'Caliph Harun al-Rashid',
        populationEstimate: '~40 Million',
        color: '#047857',
        center: [610, 240],
        path: 'M 540,230 C 580,220 650,225 675,260 C 625,275 550,265 540,230 Z',
        description: 'Scientific and literary hub of the medieval world: algebra invented by al-Khwarizmi, medical encyclopedias, paper mills, and global Indian Ocean maritime trade.',
        keyEvents: ['Founding of House of Wisdom (Bayt al-Hikma)', 'Compilation of One Thousand and One Nights', 'Al-Khwarizmi Founds Algebra']
      },
      {
        id: 'carolingian_empire',
        name: 'Carolingian Empire (Frankish Empire)',
        modernCountry: 'France, Germany, Italy',
        capital: 'Aachen (Aix-la-Chapelle)',
        ruler: 'Charlemagne (Charles the Great)',
        populationEstimate: '~15 Million',
        color: '#2563EB',
        center: [515, 190],
        path: 'M 490,175 C 525,170 545,185 540,210 C 510,220 485,205 490,175 Z',
        description: 'United Western and Central Europe under Christian imperium, sparking the Carolingian Renaissance in Latin scholarship, script standardization, and cathedral schools.',
        keyEvents: ['Coronation on Christmas Day 800 CE by Pope Leo III', 'Carolingian Minuscule Script Developed', 'Saxon Wars & Treaty Consolidation']
      },
      {
        id: 'byzantine_empire_800',
        name: 'Byzantine Empire (Eastern Rome)',
        modernCountry: 'Greece, Anatolia, Southern Balkans',
        capital: 'Constantinople',
        ruler: 'Empress Irene of Athens',
        populationEstimate: '~9 Million',
        color: '#7C3AED',
        center: [565, 215],
        path: 'M 545,205 C 570,205 585,215 580,230 C 560,235 545,225 545,205 Z',
        description: 'The bastion of Roman state continuity, Orthodox theology, and Greek culture, defended by the colossal Theodosian walls and Greek Fire naval weapons.',
        keyEvents: ['Rule of Empress Irene (First Female Sole Ruler)', 'Iconoclasm Controversies Resolved', 'Theme Military System Defenses']
      },
      {
        id: 'tang_dynasty_late',
        name: 'Tang Dynasty China',
        modernCountry: 'China',
        capital: "Chang'an & Luoyang",
        ruler: 'Emperor Dezong',
        populationEstimate: '~50 Million',
        color: '#B91C1C',
        center: [815, 235],
        path: 'M 765,205 C 820,205 855,230 845,270 C 805,280 765,255 765,205 Z',
        description: 'Golden age of Chinese poetry (Li Bai, Du Fu), woodblock printing, tea culture, porcelain, and cosmopolitan silk trading with Sogdian and Persian merchants.',
        keyEvents: ['Woodblock Printing of the Diamond Sutra', 'Golden Age of Classical Poetry', 'Grand Canal Grain Fleet Operations']
      }
    ]
  },
  {
    id: 'era_1200ce',
    year: 1200,
    label: '1200 CE',
    epochName: 'High Middle Ages & The Steppe Storm',
    timeRange: '1190 CE – 1250 CE',
    period: 'CE',
    summary: 'The era of Crusades in the Levant, the Song Dynasty economic explosion in East Asia, and the unification of nomadic steppe tribes under Temüjin (Genghis Khan).',
    globalDynamics: 'Southern Song pioneers paper money and magnetic compass navigation, while Ayyubids hold Jerusalem and French/English monarchies war over Angevin lands.',
    keyTurningPoint: 'Temüjin crowned Genghis Khan (1206) & Fourth Crusade sack (1204)',
    majorEntities: [
      {
        id: 'mongol_tribes_unified',
        name: 'Mongol Confederation (Rising Mongol Empire)',
        modernCountry: 'Mongolia, Siberia, North China',
        capital: 'Karakorum / Burkhan Khaldun',
        ruler: 'Genghis Khan (Temüjin)',
        populationEstimate: '~2.5 Million (army ~100k cavalry)',
        color: '#D97706',
        center: [800, 190],
        path: 'M 740,165 C 810,160 860,185 850,215 C 800,225 745,210 740,165 Z',
        description: 'Master horse-archers united under Yassa tribal law, embarking on the swiftest continental conquest in history across Asia and Eastern Europe.',
        keyEvents: ['Kurultai Proclaims Genghis Khan', 'Conquest of Western Xia & Jin', 'Yam Postal Courier Route System']
      },
      {
        id: 'ayyubid_sultanate',
        name: 'Ayyubid Sultanate',
        modernCountry: 'Egypt, Syria, Hejaz, Yemen',
        capital: 'Cairo & Damascus',
        ruler: 'Al-Adil I (Brother of Saladin)',
        populationEstimate: '~12 Million',
        color: '#059669',
        center: [590, 245],
        path: 'M 565,230 C 600,225 615,245 610,270 C 585,275 565,260 565,230 Z',
        description: 'Founded by Salah ad-Din (Saladin), defending Islamic lands during the Third and Fourth Crusades and patronizing Cairo madrassas and naval shipyards.',
        keyEvents: ['Third Crusade Truce with Richard Lionheart', 'Cairo Citadel Reinforcements', 'Trade Treaties with Venice and Genoa']
      },
      {
        id: 'song_dynasty_south',
        name: 'Southern Song Dynasty',
        modernCountry: 'Southern China',
        capital: 'Lin’an (Hangzhou)',
        ruler: 'Emperor Ningzong',
        populationEstimate: '~70 Million',
        color: '#DC2626',
        center: [815, 255],
        path: 'M 780,240 C 825,238 850,255 845,285 C 810,295 780,275 780,240 Z',
        description: 'World’s most populated and technologically sophisticated economy: paper currency (Jiaozi), gunpowder warfare, ocean junks, and Neo-Confucian academies.',
        keyEvents: ['World’s First Government Paper Money', 'Magnetic Compass Maritime Navigation', 'Gunpowder Bombs & Fire Lances']
      },
      {
        id: 'holy_roman_empire_1200',
        name: 'Holy Roman Empire & Hohenstaufens',
        modernCountry: 'Germany, Northern Italy, Austria, Bohemia',
        capital: 'Palermo / Frankfurt (Imperial Diets)',
        ruler: 'Emperor Frederick II (Stupor Mundi)',
        populationEstimate: '~14 Million',
        color: '#EAB308',
        center: [525, 195],
        path: 'M 505,180 C 535,175 550,195 545,220 C 520,225 505,210 505,180 Z',
        description: 'Elective monarchy locked in titanic political struggles with the Roman Papacy over imperial sovereignty, Italian city-state leagues, and Crusader vows.',
        keyEvents: ['Frederick II Constitutions of Melfi', 'Sixth Crusade Bloodless Recovery of Jerusalem', 'Rise of Hanseatic Trading League']
      }
    ]
  },
  {
    id: 'era_1500ce',
    year: 1500,
    label: '1500 CE',
    epochName: 'Renaissance, New Worlds & Gunpowder Empires',
    timeRange: '1490 CE – 1530 CE',
    period: 'CE',
    summary: 'The transatlantic voyages connecting the Old and New Worlds, the Florentine High Renaissance, and the zenith of Ottoman, Ming, and Mughal statecraft.',
    globalDynamics: 'Portuguese caravels round Africa to India while Columbus and Cabral reach the Americas; Leonardo and Michelangelo transform European arts.',
    keyTurningPoint: 'Columbus transatlantic landing (1492) & Treaty of Tordesillas (1494)',
    majorEntities: [
      {
        id: 'ottoman_empire_1500',
        name: 'Ottoman Empire (Pax Ottomanica)',
        modernCountry: 'Turkey, Balkans, Levant, Egypt',
        capital: 'Kostantiniyye (Istanbul)',
        ruler: 'Sultan Bayezid II / Selim I',
        populationEstimate: '~18 Million',
        color: '#047857',
        center: [575, 220],
        path: 'M 540,205 C 585,195 620,210 615,250 C 570,260 540,240 540,205 Z',
        description: 'Premier Islamic gunpowder superpower straddling Europe, Asia, and Africa, equipped with elite Janissary musketeers and massive bronze siege cannons.',
        keyEvents: ['Sheltering of Sephardic Jewish Refugees (1492)', 'Conquest of Mamluk Egypt & Syria (1517)', 'Imperial Trade Dominance in Black Sea']
      },
      {
        id: 'ming_dynasty_1500',
        name: 'Ming Dynasty China',
        modernCountry: 'China',
        capital: 'Beijing (Forbidden City)',
        ruler: 'Hongzhi Emperor (Zhu Youtang)',
        populationEstimate: '~100 Million',
        color: '#B91C1C',
        center: [820, 235],
        path: 'M 770,200 C 830,195 865,225 855,270 C 810,280 770,255 770,200 Z',
        description: 'The Middle Kingdom at peak institutional peace: renovation of the Great Wall with stone towers, Forbidden City palaces, and booming porcelain and silk exports.',
        keyEvents: ['Great Wall Stone Rampart Upgrades', 'Silver Monsoon Global Trade Influx', 'Hongzhi Golden Era of Good Governance']
      },
      {
        id: 'spanish_monarchy_1500',
        name: 'Crown of Castile & Aragon (Spanish Empire)',
        modernCountry: 'Spain, Americas, Low Countries',
        capital: 'Toledo / Valladolid',
        ruler: 'Isabella I of Castile & Ferdinand II of Aragon',
        populationEstimate: '~9 Million (plus New World colonies)',
        color: '#CA8A04',
        center: [480, 225],
        path: 'M 465,215 C 495,212 505,225 498,240 C 475,245 460,235 465,215 Z',
        description: 'Catholic Monarchs who completed the Reconquista, sponsored Columbus to the New World, signed the Treaty of Tordesillas, and established the Spanish Tercios.',
        keyEvents: ['Reconquista Completion at Granada (1492)', 'Columbus Reaches the Americas', 'Treaty of Tordesillas Dividing Global Hemispheres']
      },
      {
        id: 'inca_empire_1500',
        name: 'Tawantinsuyu (Inca Empire)',
        modernCountry: 'Peru, Ecuador, Bolivia, Chile',
        capital: 'Cusco',
        ruler: 'Sapa Inca Huayna Capac',
        populationEstimate: '~12 Million',
        color: '#7C3AED',
        center: [290, 340],
        path: 'M 275,305 C 288,310 300,340 305,380 C 290,385 278,350 275,305 Z',
        description: 'Monumental Andean empire connected by 40,000 km of stone Qhapaq Ñan highways, terrace farming, suspension bridges, and quipu knot accounting.',
        keyEvents: ['Expansion of Inca Road System (Qhapaq Ñan)', 'Construction of Machu Picchu', 'Consolidation of Northern Territories (Quito)']
      }
    ]
  },
  {
    id: 'era_1812ce',
    year: 1812,
    label: '1812 CE',
    epochName: 'Napoleonic Zenith & Global Revolutions',
    timeRange: '1804 CE – 1815 CE',
    period: 'CE',
    summary: 'Napoleon Bonaparte controls continental Europe from Lisbon to Warsaw, triggering the catastrophic invasion of Russia and sparking the War of 1812.',
    globalDynamics: 'The Industrial Revolution transforms British factories while Simón Bolívar and José de San Martín ignite South American wars of independence.',
    keyTurningPoint: 'Napoleon French Invasion of Russia & Battle of Borodino',
    majorEntities: [
      {
        id: 'french_empire_napoleon',
        name: 'French Empire & Satellite Realms',
        modernCountry: 'France, Germany, Italy, Netherlands',
        capital: 'Paris',
        ruler: 'Napoleon I (Emperor of the French)',
        populationEstimate: '~44 Million',
        color: '#1D4ED8',
        center: [505, 200],
        path: 'M 480,185 C 530,175 555,190 545,225 C 505,230 475,215 480,185 Z',
        description: 'Military hegemon of Europe governed by the Napoleonic Code, commanding the 600,000-man Grande Armée and enforcing the Continental System blockade.',
        keyEvents: ['Invasion of Russia & Burning of Moscow', 'Implementation of Napoleonic Civil Code', 'Continental Blockade against Britain']
      },
      {
        id: 'russian_empire_1812',
        name: 'Russian Empire',
        modernCountry: 'Russia, Ukraine, Poland, Finland, Alaska',
        capital: 'Saint Petersburg',
        ruler: 'Tsar Alexander I',
        populationEstimate: '~41 Million',
        color: '#15803D',
        center: [620, 170],
        path: 'M 560,140 C 670,125 760,150 740,200 C 630,210 560,190 560,140 Z',
        description: 'Defied Napoleon with scorched-earth retreats and the bloody standoff at Borodino, pursuing the retreating French army all the way to Paris.',
        keyEvents: ['Battle of Borodino (September 1812)', 'Scorched-Earth Defense Strategy', 'Liberation of Central Europe (1813)']
      },
      {
        id: 'british_empire_1812',
        name: 'British Empire (Regency Era)',
        modernCountry: 'United Kingdom, Canada, India, Australia',
        capital: 'London',
        ruler: 'George, Prince Regent (later George IV)',
        populationEstimate: '~24 Million (home) / ~100M total',
        color: '#DC2626',
        center: [490, 180],
        path: 'M 480,168 C 495,166 502,176 498,188 C 484,190 478,180 480,168 Z',
        description: 'Master of global sea lines through the Royal Navy, financing European coalitions and fighting both France in Iberia and the United States in the War of 1812.',
        keyEvents: ['Duke of Wellington Peninsular War victories', 'War of 1812 with United States', 'Industrial Steam-Powered Factory Revolution']
      },
      {
        id: 'united_states_1812',
        name: 'United States of America',
        modernCountry: 'USA (18 States + Territories)',
        capital: 'Washington, D.C.',
        ruler: 'President James Madison',
        populationEstimate: '~7.7 Million',
        color: '#2563EB',
        center: [230, 215],
        path: 'M 195,195 C 245,190 265,215 255,245 C 220,250 190,230 195,195 Z',
        description: 'Young democratic republic fighting Great Britain in the War of 1812 to defend maritime rights and westward sovereignty following the Louisiana Purchase.',
        keyEvents: ['Declaration of War of 1812', "Constitution 'Old Ironsides' Frigate Duels", 'Defense of Fort McHenry & Star-Spangled Banner']
      },
      {
        id: 'qing_dynasty_1812',
        name: 'Great Qing Empire',
        modernCountry: 'China, Mongolia, Xinjiang, Tibet',
        capital: 'Beijing',
        ruler: 'Jiaqing Emperor',
        populationEstimate: '~360 Million (35% of world)',
        color: '#EAB308',
        center: [810, 225],
        path: 'M 740,185 C 825,180 870,210 860,265 C 800,275 745,245 740,185 Z',
        description: 'Colossal agrarian empire producing a third of world manufacturing goods, dealing with internal White Lotus rebellions and growing European opium smuggling.',
        keyEvents: ['White Lotus Rebellion Aftermath', 'Canton Trade System Regulations', 'Opium Prohibition Edicts']
      }
    ]
  },
  {
    id: 'era_1914ce',
    year: 1914,
    label: '1914 CE',
    epochName: 'Outbreak of the First World War',
    timeRange: '1914 CE – 1918 CE',
    period: 'CE',
    summary: 'The assassination of Archduke Franz Ferdinand triggers interconnected alliance pacts, launching Europe and world colonies into catastrophic industrial trench warfare.',
    globalDynamics: 'The Triple Entente (Britain, France, Russia) clashes with the Central Powers (Germany, Austria-Hungary, Ottoman Empire) using dreadnoughts, machine guns, and poison gas.',
    keyTurningPoint: 'Assassination in Sarajevo (June 28) & Battle of the Marne',
    majorEntities: [
      {
        id: 'german_empire_1914',
        name: 'German Empire (Deutsches Kaiserreich)',
        modernCountry: 'Germany, Poland, Alsace-Lorraine, African colonies',
        capital: 'Berlin',
        ruler: 'Kaiser Wilhelm II',
        populationEstimate: '~67 Million',
        color: '#475569',
        center: [525, 185],
        path: 'M 508,172 C 540,170 555,185 548,205 C 520,210 505,198 508,172 Z',
        description: 'Industrial powerhouse with the world’s most potent land army, enacting the Schlieffen Plan through Belgium before bogging down into stalemate on the Western Front.',
        keyEvents: ['Schlieffen Plan Invasion', 'Battle of Tannenberg Defeating Russia', 'Unrestricted Submarine Warfare Launch']
      },
      {
        id: 'austro_hungarian_1914',
        name: 'Austro-Hungarian Empire (Dual Monarchy)',
        modernCountry: 'Austria, Hungary, Czechia, Slovakia, Croatia, Bosnia',
        capital: 'Vienna & Budapest',
        ruler: 'Emperor Franz Joseph I',
        populationEstimate: '~52 Million',
        color: '#D97706',
        center: [540, 200],
        path: 'M 525,190 C 555,188 565,202 558,218 C 535,220 522,210 525,190 Z',
        description: 'Polyglot empire fractured by Slavic and nationalist tensions, issuing the July Ultimatum to Serbia and fighting two fronts in the Carpathians and Isonzo.',
        keyEvents: ['July Crisis Ultimatum to Serbia', 'Galician Front Losses to Russia', 'Brusilov Offensive Crises']
      },
      {
        id: 'french_third_republic_1914',
        name: 'French Third Republic',
        modernCountry: 'France & Colonial Empire',
        capital: 'Paris',
        ruler: 'President Raymond Poincaré',
        populationEstimate: '~40 Million (Europe)',
        color: '#2563EB',
        center: [500, 200],
        path: 'M 482,188 C 510,186 520,202 512,222 C 488,225 478,212 482,188 Z',
        description: 'Determined to reclaim Alsace-Lorraine lost in 1871; stopped the German advance at the Miracle of the Marne using Paris taxis to reinforce the frontline.',
        keyEvents: ['Miracle of the Marne (September 1914)', 'Verdun Fortress Defense (1916)', 'Trench Warfare Western Front Stalemate']
      },
      {
        id: 'russian_empire_1914',
        name: 'Russian Empire (Tsarist Russia)',
        modernCountry: 'Russia, Ukraine, Belarus, Baltic States, Poland, Finland',
        capital: 'Petrograd (Saint Petersburg)',
        ruler: 'Tsar Nicholas II (House of Romanov)',
        populationEstimate: '~175 Million',
        color: '#16A34A',
        center: [640, 165],
        path: 'M 560,135 C 680,120 780,145 760,200 C 640,210 560,190 560,135 Z',
        description: 'Mobilized the Russian steamroller army of millions to protect Serbia, suffering catastrophic battlefield losses that paved the way for the 1917 Bolshevik Revolution.',
        keyEvents: ['Invasion of East Prussia & Tannenberg Defeat', 'Brusilov Offensive (1916)', '1917 February Revolution & Abdication']
      }
    ]
  },
  {
    id: 'era_1939ce',
    year: 1939,
    label: '1939 CE',
    epochName: 'Outbreak of World War II',
    timeRange: '1939 CE – 1945 CE',
    period: 'CE',
    summary: 'Nazi Germany invades Poland on September 1, 1939, igniting the deadliest conflict in human history across European, Atlantic, North African, and Pacific theaters.',
    globalDynamics: 'The Axis powers (Germany, Japan, Italy) pursue totalitarian territorial expansion, confronted by the Allies (Britain, USSR, United States, China).',
    keyTurningPoint: 'Invasion of Poland & Molotov-Ribbentrop Secret Protocols',
    majorEntities: [
      {
        id: 'nazi_germany_1939',
        name: 'Nazi Germany (Third Reich)',
        modernCountry: 'Germany, Austria, Czechia, Western Poland',
        capital: 'Berlin',
        ruler: 'Adolf Hitler',
        populationEstimate: '~80 Million',
        color: '#1E293B',
        center: [525, 185],
        path: 'M 508,170 C 545,168 560,185 550,210 C 518,215 504,198 508,170 Z',
        description: 'Aggressive fascist regime fielding Blitzkrieg armored divisions and the Luftwaffe, carrying out industrial genocide and war of extermination across Europe.',
        keyEvents: ['Invasion of Poland (Sept 1, 1939)', 'Blitzkrieg Fall of France (1940)', 'Operation Barbarossa Invasion of USSR (1941)']
      },
      {
        id: 'soviet_union_1939',
        name: 'Union of Soviet Socialist Republics (USSR)',
        modernCountry: 'Russia, Ukraine, Belarus, Central Asian Republics',
        capital: 'Moscow',
        ruler: 'Joseph Stalin (General Secretary)',
        populationEstimate: '~170 Million',
        color: '#DC2626',
        center: [650, 160],
        path: 'M 560,130 C 700,115 800,140 775,200 C 640,210 560,185 560,130 Z',
        description: 'Communist superpower that signed the cynical Non-Aggression Pact with Hitler in 1939 before enduring the titanic struggle of the Great Patriotic War at Stalingrad and Kursk.',
        keyEvents: ['Molotov-Ribbentrop Non-Aggression Pact', 'Winter War against Finland', 'Battle of Stalingrad Turning Point (1942-43)']
      },
      {
        id: 'empire_of_japan_1939',
        name: 'Empire of Japan (Greater East Asia)',
        modernCountry: 'Japan, Korea, Manchuria, Coastal China',
        capital: 'Tokyo',
        ruler: 'Emperor Showa (Hirohito) / Gen. Tojo',
        populationEstimate: '~73 Million (Home) / ~140M Empire',
        color: '#E11D48',
        center: [875, 230],
        path: 'M 865,215 C 885,212 895,228 890,250 C 872,252 860,235 865,215 Z',
        description: 'Militarist naval empire prosecuting brutal war in mainland China, planning the preemptive strike on Pearl Harbor to secure oilfields in Southeast Asia.',
        keyEvents: ['Second Sino-Japanese War Campaigns', 'Tripartite Pact with Germany & Italy', 'Attack on Pearl Harbor (Dec 7, 1941)']
      },
      {
        id: 'british_empire_1939',
        name: 'British Empire & Commonwealth',
        modernCountry: 'United Kingdom, Canada, Australia, India, Africa',
        capital: 'London',
        ruler: 'Winston Churchill (Prime Minister) / George VI',
        populationEstimate: '~480 Million (1 in 4 humans)',
        color: '#B91C1C',
        center: [490, 180],
        path: 'M 480,166 C 496,165 504,175 498,188 C 484,190 476,180 480,166 Z',
        description: 'Stood alone against Axis dominance in Europe during 1940-1941; RAF fighter command triumphed in the Battle of Britain while Royal Navy protected Atlantic convoys.',
        keyEvents: ['Dunkirk Evacuation (1940)', 'Battle of Britain RAF Defense', 'El Alamein Victory in North Africa (1942)']
      }
    ]
  },
  {
    id: 'era_1962ce',
    year: 1962,
    label: '1962 CE',
    epochName: 'Cold War: Cuban Missile Crisis & Space Race',
    timeRange: '1947 CE – 1989 CE',
    period: 'CE',
    summary: 'The world stands at the absolute brink of thermonuclear war during the 13-day Cuban Missile Crisis standoff between Kennedy and Khrushchev.',
    globalDynamics: 'Bipolar ideological divide between NATO and the Warsaw Pact; rapid decolonization across Africa and Asia while the US and USSR race to the Moon.',
    keyTurningPoint: 'Cuban Missile Crisis naval quarantine (October 1962)',
    majorEntities: [
      {
        id: 'united_states_1962',
        name: 'United States of America (NATO Leader)',
        modernCountry: 'United States',
        capital: 'Washington, D.C.',
        ruler: 'President John F. Kennedy',
        populationEstimate: '~186 Million',
        color: '#2563EB',
        center: [230, 215],
        path: 'M 160,185 C 255,180 275,210 260,250 C 200,260 160,230 160,185 Z',
        description: 'Leader of the Free World possessing nuclear triad dominance, enacting the naval blockade of Cuba and pioneering Project Apollo to put a man on the Moon.',
        keyEvents: ['Cuban Missile Crisis Naval Quarantine', 'Apollo Moon Program Announced', 'Creation of Peace Corps & Civil Rights Battles']
      },
      {
        id: 'soviet_union_1962',
        name: 'Soviet Union & Warsaw Pact',
        modernCountry: 'USSR, East Germany, Poland, Hungary, Romania',
        capital: 'Moscow',
        ruler: 'Premier Nikita Khrushchev',
        populationEstimate: '~220 Million',
        color: '#DC2626',
        center: [650, 160],
        path: 'M 540,140 C 700,120 810,140 780,200 C 630,210 540,185 540,140 Z',
        description: 'Leader of world communism; erected the Berlin Wall in 1961 and launched Yuri Gagarin as the first human into space, secretly stationing R-12 missiles in Cuba.',
        keyEvents: ['Erection of the Berlin Wall (1961)', 'Yuri Gagarin First Human in Space (1961)', 'Secret Deployment of Nuclear Missiles to Cuba']
      },
      {
        id: 'china_prc_1962',
        name: 'People’s Republic of China',
        modernCountry: 'China',
        capital: 'Beijing',
        ruler: 'Chairman Mao Zedong',
        populationEstimate: '~670 Million',
        color: '#B91C1C',
        center: [810, 230],
        path: 'M 750,195 C 830,190 870,220 855,270 C 800,280 750,250 750,195 Z',
        description: 'Severed ties with Moscow in the Sino-Soviet Split, fought the 1962 Sino-Indian border war in the Himalayas, and pursued independent nuclear weapons.',
        keyEvents: ['Sino-Indian Border War (October 1962)', 'Sino-Soviet Ideological Split', 'First Atomic Bomb Test Project 596']
      }
    ]
  },
  {
    id: 'era_1991ce',
    year: 1991,
    label: '1991 CE',
    epochName: 'Collapse of the USSR & The New World Order',
    timeRange: '1989 CE – 1995 CE',
    period: 'CE',
    summary: 'The fall of the Berlin Wall and the dissolution of the Soviet Union on December 25, 1991, ending the Cold War and ushering in an era of globalization.',
    globalDynamics: 'Operation Desert Storm liberates Kuwait; the European Union is created via Maastricht; Yugoslavia dissolves into bitter ethnic civil wars.',
    keyTurningPoint: 'Soviet flag lowered over the Kremlin (Dec 25, 1991) & Gulf War',
    majorEntities: [
      {
        id: 'russian_federation_1991',
        name: 'Russian Federation / CIS Transition',
        modernCountry: 'Russia (post-Soviet space)',
        capital: 'Moscow',
        ruler: 'President Boris Yeltsin',
        populationEstimate: '~148 Million',
        color: '#15803D',
        center: [650, 160],
        path: 'M 560,135 C 700,120 810,140 780,200 C 640,210 560,190 560,135 Z',
        description: 'Emerged from the dissolved USSR amid hyperinflation, voucher privatization, and the emergence of 14 new independent former Soviet republics.',
        keyEvents: ['Belovezha Accords Dissolving the USSR', 'Transition to Market Capitalism (Shock Therapy)', 'START I Nuclear Reduction Treaties']
      },
      {
        id: 'united_states_1991',
        name: 'United States (Sole Superpower)',
        modernCountry: 'United States',
        capital: 'Washington, D.C.',
        ruler: 'President George H.W. Bush',
        populationEstimate: '~253 Million',
        color: '#2563EB',
        center: [230, 215],
        path: 'M 160,185 C 255,180 275,210 260,250 C 200,260 160,230 160,185 Z',
        description: "Unchallenged global hegemon orchestrating a 35-nation coalition in Operation Desert Storm, heralding the 'New World Order' and digital internet revolution.",
        keyEvents: ['Operation Desert Storm Coalition Victory', 'End of the Cold War Formalized', 'Invention and Public Rise of the World Wide Web']
      },
      {
        id: 'european_community_1991',
        name: 'European Community / Early EU',
        modernCountry: 'Western & Central Europe',
        capital: 'Brussels',
        ruler: 'Jacques Delors (Commission President)',
        populationEstimate: '~345 Million',
        color: '#4338CA',
        center: [515, 195],
        path: 'M 490,180 C 535,175 550,195 540,215 C 510,225 490,210 490,180 Z',
        description: 'Drafted the historic Maastricht Treaty creating the European Union, single European citizenship, and the roadmap for the Euro common currency.',
        keyEvents: ['Negotiation of Maastricht Treaty', 'Reunification of East & West Germany', 'Schengen Borderless Travel Agreements']
      }
    ]
  },
  {
    id: 'era_2026ce',
    year: 2026,
    label: '2026 CE',
    epochName: 'Modern Day & Multipolar Frontlines',
    timeRange: '2020 CE – Present',
    period: 'CE',
    summary: 'A multipolar world defined by high-intensity territorial wars, disputed maritime chokepoints, rapid technological shifts, and geopolitical realignment.',
    globalDynamics: 'Active conflicts in Eastern Europe and the Middle East, civil strife in Sudan and Myanmar, and heightened strategic deterrence across the Taiwan Strait.',
    keyTurningPoint: 'Invasion of Ukraine & Regional Escalate in the Levant',
    majorEntities: [
      {
        id: 'united_states_modern',
        name: 'United States of America',
        modernCountry: 'United States',
        capital: 'Washington, D.C.',
        ruler: 'President of the United States',
        populationEstimate: '~340 Million',
        color: '#1D4ED8',
        center: [225, 215],
        path: 'M 160,185 C 255,180 275,210 260,250 C 200,260 160,230 160,185 Z',
        description: 'Global economic, military, and technological leader anchored by NATO alliances, Indo-Pacific partnerships (AUKUS, Quad), and dollar reserve dominance.',
        keyEvents: ['NATO Northern Expansion (Finland & Sweden)', 'CHIPS & Science Tech Sovereignty', 'Indo-Pacific Strategic Deterrence']
      },
      {
        id: 'china_prc_modern',
        name: 'People’s Republic of China',
        modernCountry: 'China',
        capital: 'Beijing',
        ruler: 'President Xi Jinping',
        populationEstimate: '~1.41 Billion',
        color: '#DC2626',
        center: [810, 230],
        path: 'M 750,195 C 830,190 870,220 855,270 C 800,280 750,250 750,195 Z',
        description: 'World’s second-largest economy, manufacturing superpower, Belt and Road infrastructure hub, and expanding naval power across the South China Sea.',
        keyEvents: ['Belt & Road Initiative Global Ports', 'Naval Fleet Expansion & Modernization', 'Cross-Strait Taiwan Tensions']
      },
      {
        id: 'russia_modern',
        name: 'Russian Federation',
        modernCountry: 'Russia',
        capital: 'Moscow',
        ruler: 'President Vladimir Putin',
        populationEstimate: '~144 Million',
        color: '#B91C1C',
        center: [650, 155],
        path: 'M 560,130 C 710,115 820,135 790,200 C 640,210 560,190 560,130 Z',
        description: 'Nuclear superpower engaged in active territorial war in Ukraine, pivoting economic trade and energy exports toward China, India, and the Global South.',
        keyEvents: ['Full-Scale War with Ukraine', 'Pivot to Asian Energy Markets', 'BRICS+ Expansion Leadership']
      },
      {
        id: 'european_union_modern',
        name: 'European Union',
        modernCountry: '27 Member States',
        capital: 'Brussels',
        ruler: 'European Commission & Council',
        populationEstimate: '~450 Million',
        color: '#2563EB',
        center: [515, 195],
        path: 'M 490,175 C 535,170 550,190 540,215 C 510,225 490,205 490,175 Z',
        description: 'World’s largest unified single market and regulatory leader, prioritizing green energy transition, collective defense investments, and support for Ukraine.',
        keyEvents: ['Green Deal Industrial Transition', 'European Defense Fund Mobilization', 'Integration of Western Balkan Candidates']
      },
      {
        id: 'india_modern',
        name: 'Republic of India (Bharat)',
        modernCountry: 'India',
        capital: 'New Delhi',
        ruler: 'Prime Minister of India',
        populationEstimate: '~1.43 Billion (Most Populous)',
        color: '#D97706',
        center: [710, 255],
        path: 'M 690,235 C 730,235 745,260 735,290 C 705,300 685,270 690,235 Z',
        description: 'Fastest-growing major economy, space power (Chandrayaan-3 Moon landing), leading voice of the Global South, and strategic member of the Quad.',
        keyEvents: ['World’s Most Populous Nation', 'Chandrayaan-3 South Pole Lunar Landing', 'Strategic Infrastructure & Tech Manufacturing Boom']
      }
    ]
  }
];

// Helper to find the nearest curated era for any arbitrary year
export function getClosestEra(targetYear: number): HistoricalEra {
  let closest = HISTORICAL_ERAS[0];
  let minDiff = Math.abs(targetYear - closest.year);

  for (const era of HISTORICAL_ERAS) {
    const diff = Math.abs(targetYear - era.year);
    if (diff < minDiff) {
      minDiff = diff;
      closest = era;
    }
  }

  return closest;
}
