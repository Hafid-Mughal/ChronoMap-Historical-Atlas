import { WORLD_COUNTRIES, projectCoordinates } from './geoService';
import { getCountryEraData } from './historicalAtlasEngine';
import { CONFLICT_ZONES } from './conflictZones';
import { ARCHAEOLOGICAL_SITES } from './archaeologicalSitesData';

export type SearchResultCategory = 'figure' | 'city' | 'empire' | 'country' | 'conflict';

export interface HistoricalSearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: SearchResultCategory;
  year: number;
  yearDisplay: string;
  svgCoords: [number, number]; // [x, y] in 1000x520 SVG space
  zoomScale: number;
  modernCountry: string; // Used to select/highlight the corresponding territory on the map
  summary: string;
  keywords: string[];
  conflictId?: string;
}

function formatYear(y: number): string {
  return y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`;
}

// ============================================================================
// 1. CURATED HISTORICAL FIGURES, RULERS & COMMANDERS
// ============================================================================
const RAW_FIGURES: Array<{
  id: string;
  name: string;
  role: string;
  year: number;
  lonLat: [number, number];
  modernCountry: string;
  summary: string;
  keywords: string[];
}> = [
  {
    id: 'fig_vlad_impaler',
    name: 'Vlad III the Impaler (Vlad Țepeș / Dracula)',
    role: 'Voivode (Prince) of Wallachia',
    year: 1462,
    lonLat: [25.45, 44.92], // Târgoviște, Wallachia
    modernCountry: 'Romania',
    summary:
      'Three-time Voivode of the Principality of Wallachia (1448, 1456–1462, 1476) who fiercely defended Wallachian independence against Ottoman Sultan Mehmed II from his capital at Târgoviște, executing the famous June 17, 1462 Night Attack.',
    keywords: [
      'vlad the impaler',
      'vlad iii',
      'vlad tepes',
      'vlad dracula',
      'dracula',
      'impaler',
      'wallachia',
      'walllachia',
      'walachia',
      'valachia',
      'tara romaneasca',
      'targoviste',
      'poenari',
      'bran castle',
      'voivode',
      'order of the dragon',
      'romania',
      '1462'
    ]
  },
  {
    id: 'fig_stephen_great',
    name: 'Stephen the Great (Ștefan cel Mare)',
    role: 'Voivode (Prince) of Moldavia',
    year: 1475,
    lonLat: [26.25, 47.65], // Suceava
    modernCountry: 'Romania',
    summary:
      'Celebrated Voivode of Moldavia (r. 1457–1504) who won 46 of his 48 battles—most famously routing the Ottoman army at the Battle of Vaslui (1475)—and endowed scores of painted Orthodox monasteries.',
    keywords: [
      'stephen the great',
      'stefan cel mare',
      'moldavia',
      'suceava',
      'vaslui',
      'voivode',
      'romania',
      'moldova'
    ]
  },
  {
    id: 'fig_michael_brave',
    name: 'Michael the Brave (Mihai Viteazul)',
    role: 'Voivode of Wallachia, Transylvania & Moldavia',
    year: 1600,
    lonLat: [25.45, 44.92], // Târgoviște / Alba Iulia
    modernCountry: 'Romania',
    summary:
      'Prince of Wallachia who defeated the Ottomans at Călugăreni (1595) and in 1599–1600 achieved the first political union of the three Romanian principalities: Wallachia, Transylvania, and Moldavia.',
    keywords: [
      'michael the brave',
      'mihai viteazul',
      'wallachia',
      'transylvania',
      'moldavia',
      'alba iulia',
      'calugareni',
      'romania'
    ]
  },
  {
    id: 'fig_mircea_elder',
    name: 'Mircea I the Elder (Mircea cel Bătrân)',
    role: 'Voivode of Wallachia (Grandfather of Vlad the Impaler)',
    year: 1395,
    lonLat: [25.45, 44.92],
    modernCountry: 'Romania',
    summary:
      'Voivode of Wallachia (r. 1386–1418) who expanded Wallachia to its greatest territorial extent from the Southern Carpathians to the Black Sea (Dobruja) and defeated Sultan Bayezid I at the Battle of Rovine (1395).',
    keywords: [
      'mircea the elder',
      'mircea cel batran',
      'wallachia',
      'rovine',
      'cozia',
      'basarab',
      'romania'
    ]
  },
  {
    id: 'fig_alexander',
    name: 'Alexander the Great',
    role: 'King of Macedon & Conqueror of Persia',
    year: -330,
    lonLat: [44.4, 32.5], // Babylon / Macedon campaign center
    modernCountry: 'Greece',
    summary:
      'King of Macedon who overthrew the Achaemenid Persian Empire and forged a Hellenistic empire stretching from Greece and Egypt to the Indus River.',
    keywords: ['alexander', 'alexander the great', 'macedon', 'hellenistic', 'gaugamela', 'bucephalus', 'aristotle', 'pella']
  },
  {
    id: 'fig_caesar',
    name: 'Julius Caesar',
    role: 'Dictator Perpetuo of the Roman Republic',
    year: -48,
    lonLat: [12.49, 41.89], // Rome
    modernCountry: 'Italy',
    summary:
      'Roman general and statesman whose conquest of Gaul and crossing of the Rubicon transformed the Roman Republic into the Roman Empire.',
    keywords: ['julius caesar', 'caesar', 'rome', 'rubicon', 'gaul', 'ides of march', 'roman republic', 'alesia']
  },
  {
    id: 'fig_augustus',
    name: 'Augustus (Octavian)',
    role: 'First Roman Emperor (Principate)',
    year: 14,
    lonLat: [12.49, 41.89],
    modernCountry: 'Italy',
    summary:
      'Founder of the Roman Principate who inaugurated the two-century Pax Romana across the Mediterranean basin.',
    keywords: ['augustus', 'octavian', 'pax romana', 'roman emperor', 'rome', 'actium']
  },
  {
    id: 'fig_marcus_aurelius',
    name: 'Marcus Aurelius',
    role: 'Roman Emperor & Stoic Philosopher',
    year: 170,
    lonLat: [12.49, 41.89],
    modernCountry: 'Italy',
    summary:
      'Last of the Five Good Emperors of Rome and author of the Stoic philosophical work Meditations during the Marcomannic Wars.',
    keywords: ['marcus aurelius', 'stoic', 'meditations', 'roman emperor', 'pax romana', 'rome']
  },
  {
    id: 'fig_constantine',
    name: 'Constantine the Great (Constantine I)',
    role: 'Roman Emperor & Founder of Constantinople',
    year: 330,
    lonLat: [28.97, 41.0],
    modernCountry: 'Turkey',
    summary:
      'First Christian Roman Emperor who issued the Edict of Milan (313 CE), convened the Council of Nicaea (325 CE), and founded Constantinople (New Rome) in 330 CE.',
    keywords: ['constantine', 'constantine the great', 'constantinople', 'byzantium', 'edict of milan', 'nicaea']
  },
  {
    id: 'fig_justinian',
    name: 'Justinian I & Empress Theodora',
    role: 'Byzantine (Eastern Roman) Emperor & Empress',
    year: 550,
    lonLat: [28.97, 41.0],
    modernCountry: 'Turkey',
    summary:
      'Codified Roman law (Corpus Juris Civilis), constructed the Hagia Sophia in Constantinople, and reconquered Italy, North Africa, and southern Spain through General Belisarius.',
    keywords: ['justinian', 'theodora', 'belisarius', 'byzantine', 'hagia sophia', 'roman law', 'constantinople']
  },
  {
    id: 'fig_hannibal',
    name: 'Hannibal Barca',
    role: 'Carthaginian General of the Second Punic War',
    year: -216,
    lonLat: [10.32, 36.85], // Carthage
    modernCountry: 'Tunisia',
    summary:
      'Master military tactician of ancient Carthage who marched war elephants across the Alps into Italy and won the legendary double-envelopment victory at the Battle of Cannae (216 BCE).',
    keywords: ['hannibal', 'hannibal barca', 'carthage', 'punic war', 'cannae', 'alps', 'elephants', 'tunisia']
  },
  {
    id: 'fig_spartacus',
    name: 'Spartacus',
    role: 'Thracian Gladiator & Leader of the Third Servile War',
    year: -72,
    lonLat: [14.25, 41.08], // Capua / Southern Italy
    modernCountry: 'Italy',
    summary:
      'Escaped gladiator from Capua who led a massive slave uprising of over 70,000 people against the Roman Republic during the Third Servile War (73–71 BCE).',
    keywords: ['spartacus', 'gladiator', 'servile war', 'capua', 'vesuvius', 'rome']
  },
  {
    id: 'fig_leonidas',
    name: 'King Leonidas I of Sparta',
    role: 'Agiad King of Sparta',
    year: -480,
    lonLat: [22.43, 37.07], // Sparta / Thermopylae
    modernCountry: 'Greece',
    summary:
      'Warrior-king of Sparta who led the 300 Spartans and Greek allies in the heroic last stand against Xerxes I’s Persian army at the Battle of Thermopylae in 480 BCE.',
    keywords: ['leonidas', 'sparta', '300', 'thermopylae', 'xerxes', 'greece', 'lacedaemon']
  },
  {
    id: 'fig_cleopatra',
    name: 'Cleopatra VII Philopator',
    role: 'Queen of the Ptolemaic Kingdom of Egypt',
    year: -35,
    lonLat: [29.91, 31.2], // Alexandria
    modernCountry: 'Egypt',
    summary:
      'Last active ruler of the Ptolemaic Kingdom of Egypt, diplomat, naval commander, and polyglot stateswoman centered in Alexandria.',
    keywords: ['cleopatra', 'ptolemaic', 'alexandria', 'egypt', 'mark antony', 'pharaoh']
  },
  {
    id: 'fig_ramesses',
    name: 'Ramesses II (Ramesses the Great)',
    role: 'Pharaoh of the Nineteenth Dynasty of Egypt',
    year: -1250,
    lonLat: [32.64, 25.69], // Thebes / Pi-Ramesses
    modernCountry: 'Egypt',
    summary:
      'Celebrated New Kingdom Pharaoh who fought the Battle of Kadesh, signed the world’s first recorded peace treaty with the Hittites, and built Abu Simbel.',
    keywords: ['ramesses', 'ramses', 'pharaoh', 'new kingdom', 'kadesh', 'abu simbel', 'egypt']
  },
  {
    id: 'fig_tutankhamun',
    name: 'Tutankhamun (King Tut)',
    role: 'Pharaoh of the Eighteenth Dynasty of Egypt',
    year: -1325,
    lonLat: [32.6, 25.74], // Valley of the Kings / Thebes
    modernCountry: 'Egypt',
    summary:
      'New Kingdom Pharaoh who restored the traditional worship of Amun after Akhenaten’s Amarna period and whose intact tomb in the Valley of the Kings became an archaeological icon.',
    keywords: ['tutankhamun', 'king tut', 'pharaoh', 'valley of the kings', 'thebes', 'egypt']
  },
  {
    id: 'fig_hammurabi',
    name: 'Hammurabi',
    role: 'King of the Old Babylonian Empire',
    year: -1750,
    lonLat: [44.42, 32.54], // Babylon
    modernCountry: 'Iraq',
    summary:
      'Sixth Amorite king of Babylon who united Mesopotamia and promulgated the famous Code of Hammurabi.',
    keywords: ['hammurabi', 'babylon', 'mesopotamia', 'code of laws', 'euphrates', 'iraq']
  },
  {
    id: 'fig_cyrus',
    name: 'Cyrus the Great (Cyrus II)',
    role: 'Founder of the Achaemenid Persian Empire',
    year: -539,
    lonLat: [52.89, 29.93], // Pasargadae / Persepolis
    modernCountry: 'Iran',
    summary:
      'Founder of the First Persian Empire who united the Medes and Persians, conquered Lydia and Babylon, and authored the Cyrus Cylinder.',
    keywords: ['cyrus', 'cyrus the great', 'persia', 'achaemenid', 'cyrus cylinder', 'pasargadae', 'babylon', 'iran']
  },
  {
    id: 'fig_darius',
    name: 'Darius I the Great',
    role: 'King of Kings of the Achaemenid Persian Empire',
    year: -500,
    lonLat: [52.89, 29.93], // Persepolis
    modernCountry: 'Iran',
    summary:
      'Organized the Achaemenid Empire at its peak into satrapies, built the ceremonial capital of Persepolis and the 2,700 km Royal Road, and minted the gold daric.',
    keywords: ['darius', 'darius the great', 'persepolis', 'persia', 'achaemenid', 'royal road', 'iran']
  },
  {
    id: 'fig_attila',
    name: 'Attila the Hun ("The Scourge of God")',
    role: 'Ruler of the Hunnic Empire (Flagellum Dei)',
    year: 451,
    lonLat: [20.14, 46.25], // Pannonian Plain
    modernCountry: 'Hungary',
    summary:
      'Known to Roman chroniclers as "The Scourge of God" (Flagellum Dei), Attila unified the Hunnic and Germanic tribes across the Eurasian and Pannonian plains and challenged both the Eastern and Western Roman Empires in the 5th century CE.',
    keywords: ['attila', 'attila the hun', 'scourge of god', 'the scourge of god', 'flagellum dei', 'huns', 'hunnic empire', 'pannonia', 'hungary']
  },
  {
    id: 'fig_qin_shi_huang',
    name: 'Qin Shi Huang ("The First Emperor")',
    role: 'First Emperor of Unified China (Qin Dynasty)',
    year: -221,
    lonLat: [108.94, 34.34], // Xianyang / Xi'an
    modernCountry: 'China',
    summary:
      'Conquered the Warring States to become First Emperor of China; standardized script, currency, weights, connected the Great Wall, and commissioned the Terracotta Army.',
    keywords: ['qin shi huang', 'first emperor', 'the first emperor', 'first emperor of china', 'terracotta army', 'great wall', 'china', 'qin dynasty']
  },
  {
    id: 'fig_confucius',
    name: 'Confucius (Kong Fuzi) & Sun Tzu',
    role: 'Chinese Philosophers & Strategists of the Spring & Autumn Era',
    year: -500,
    lonLat: [116.99, 35.59], // Qufu, Shandong
    modernCountry: 'China',
    summary:
      'Foundational thinkers of East Asian ethics, statecraft (The Analects), and military strategy (The Art of War) during the Eastern Zhou period.',
    keywords: ['confucius', 'sun tzu', 'art of war', 'zhou dynasty', 'philosophy', 'china']
  },
  {
    id: 'fig_ashoka',
    name: 'Ashoka the Great',
    role: 'Emperor of the Maurya Dynasty',
    year: -260,
    lonLat: [85.13, 25.59], // Pataliputra (Patna)
    modernCountry: 'India',
    summary:
      'Ruler of almost the entire Indian subcontinent who, after witnessing the Kalinga War, embraced Buddhism and erected the Edicts of Ashoka.',
    keywords: ['ashoka', 'maurya', 'kalinga', 'buddhism', 'pataliputra', 'india']
  },
  {
    id: 'fig_genghis_khan',
    name: 'Genghis Khan (Temüjin)',
    role: 'Founder & Great Khan of the Mongol Empire',
    year: 1220,
    lonLat: [102.84, 47.19], // Karakorum / Mongol heartland
    modernCountry: 'Mongolia',
    summary:
      'Unifier of the nomadic Mongol tribes who launched trans-continental campaigns creating the largest contiguous land empire in human history.',
    keywords: ['genghis khan', 'chinggis khan', 'temujin', 'mongol empire', 'karakorum', 'steppe', 'pax mongolica']
  },
  {
    id: 'fig_kublai_khan',
    name: 'Kublai Khan',
    role: 'Khagan & Founder of the Yuan Dynasty',
    year: 1279,
    lonLat: [116.4, 39.9], // Khanbaliq (Beijing)
    modernCountry: 'China',
    summary:
      'Grandson of Genghis Khan who founded the Yuan Dynasty in China, established his capital at Khanbaliq (Beijing), and hosted Marco Polo.',
    keywords: ['kublai khan', 'yuan dynasty', 'marco polo', 'beijing', 'mongol']
  },
  {
    id: 'fig_timur',
    name: 'Timur (Tamerlane)',
    role: 'Founder of the Timurid Empire',
    year: 1400,
    lonLat: [66.97, 39.65], // Samarkand
    modernCountry: 'Uzbekistan',
    summary:
      'Turco-Mongol conqueror who established the Timurid Empire across Central Asia and Persia and transformed Samarkand into an architectural marvel.',
    keywords: ['timur', 'tamerlane', 'samarkand', 'timurid', 'central asia', 'uzbekistan']
  },
  {
    id: 'fig_mansa_musa',
    name: 'Mansa Musa I',
    role: 'Mansa of the Mali Empire',
    year: 1324,
    lonLat: [-3.0, 16.77], // Timbuktu / Niani
    modernCountry: 'Mali',
    summary:
      'Tenth Mansa of the wealthy West African Mali Empire whose famed 1324 pilgrimage to Mecca distributed vast gold reserves and elevated Timbuktu as a global seat of learning.',
    keywords: ['mansa musa', 'mali empire', 'timbuktu', 'gold', 'west africa', 'sankore']
  },
  {
    id: 'fig_saladin',
    name: 'Saladin (Salah ad-Din)',
    role: 'Sultan of Egypt and Syria (Ayyubid Dynasty)',
    year: 1187,
    lonLat: [35.21, 31.76], // Jerusalem / Cairo / Damascus
    modernCountry: 'Egypt',
    summary:
      'Founder of the Ayyubid Dynasty who united Egypt and Syria, victorious at the Battle of Hattin (1187), and negotiated with Richard the Lionheart during the Third Crusade.',
    keywords: ['saladin', 'salah ad-din', 'ayyubid', 'crusades', 'jerusalem', 'cairo', 'hattin']
  },
  {
    id: 'fig_richard_lionheart',
    name: 'King Richard I ("The Lionheart" / Cœur de Lion)',
    role: 'King of England & Commander of the Third Crusade',
    year: 1191,
    lonLat: [-0.12, 51.5],
    modernCountry: 'United Kingdom',
    summary:
      'Plantagenet King of England and Duke of Normandy famed as "Richard the Lionheart" (Cœur de Lion) for his chivalric military command at Acre and Arsuf during the Third Crusade against Saladin.',
    keywords: ['richard the lionheart', 'the lionheart', 'lionheart', 'coeur de lion', 'richard i', 'plantagenet', 'third crusade', 'england']
  },
  {
    id: 'fig_william_conqueror',
    name: 'William I ("William the Conqueror")',
    role: 'First Norman King of England & Duke of Normandy',
    year: 1066,
    lonLat: [-0.12, 51.5],
    modernCountry: 'United Kingdom',
    summary:
      'Led the Norman Conquest of England in 1066 with victory at the Battle of Hastings, built the Tower of London, and commissioned the Domesday Book.',
    keywords: ['william the conqueror', 'the conqueror', 'norman conquest', 'hastings', '1066', 'normandy', 'england']
  },
  {
    id: 'fig_joan_of_arc',
    name: 'Joan of Arc ("The Maid of Orléans")',
    role: 'Heroine of France in the Hundred Years’ War',
    year: 1429,
    lonLat: [1.9, 47.9], // Orléans
    modernCountry: 'France',
    summary:
      'Known as "The Maid of Orléans" (La Pucelle d’Orléans), the peasant visionary rallied French armies to lift the English Siege of Orléans in 1429 and escorted Charles VII to his coronation at Reims.',
    keywords: ['joan of arc', 'jeanne darc', 'maid of orleans', 'the maid of orleans', 'la pucelle', 'hundred years war', 'france', '1429']
  },
  {
    id: 'fig_charlemagne',
    name: 'Charlemagne ("Father of Europe" / Charles the Great)',
    role: 'King of the Franks & Emperor of the Carolingian Empire',
    year: 800,
    lonLat: [6.08, 50.77], // Aachen
    modernCountry: 'France',
    summary:
      'Known as Pater Europae ("Father of Europe"), Charlemagne united Western and Central Europe for the first time since the fall of Western Rome and sparked the Carolingian Renaissance.',
    keywords: ['charlemagne', 'charles the great', 'father of europe', 'pater europae', 'carolingian', 'franks', 'aachen', 'holy roman emperor']
  },
  {
    id: 'fig_harun_al_rashid',
    name: 'Caliph Harun al-Rashid',
    role: 'Fifth Abbasid Caliph during the Islamic Golden Age',
    year: 800,
    lonLat: [44.36, 33.31], // Baghdad
    modernCountry: 'Iraq',
    summary:
      'Ruled the Abbasid Caliphate from Baghdad at the height of its scientific and cultural splendor, founding the House of Wisdom (Bayt al-Hikma).',
    keywords: ['harun al-rashid', 'abbasid', 'baghdad', 'house of wisdom', 'islamic golden age', 'iraq']
  },
  {
    id: 'fig_ibn_battuta',
    name: 'Ibn Battuta',
    role: 'Moroccan Scholar & Greatest Medieval World Traveler',
    year: 1345,
    lonLat: [-5.81, 35.76], // Tangier
    modernCountry: 'Morocco',
    summary:
      'Traveled over 117,000 km across North and West Africa, the Middle East, the Golden Horde, India, Southeast Asia, and China, chronicled in the Rihla.',
    keywords: ['ibn battuta', 'morocco', 'tangier', 'traveler', 'rihla', 'marinid']
  },
  {
    id: 'fig_skanderbeg',
    name: 'Skanderbeg (Gjergj Kastrioti)',
    role: 'Lord of Albania & Leader of the League of Lezhë',
    year: 1450,
    lonLat: [19.79, 41.51], // Krujë
    modernCountry: 'Albania',
    summary:
      'Albanian nobleman and military commander who united the Albanian principalities in the League of Lezhë (1444) and successfully resisted Ottoman armies for 25 years from Krujë Castle.',
    keywords: ['skanderbeg', 'gjergj kastrioti', 'albania', 'kruje', 'league of lezhe']
  },
  {
    id: 'fig_suleiman',
    name: 'Suleiman the Magnificent',
    role: 'Tenth Sultan of the Ottoman Empire',
    year: 1550,
    lonLat: [28.97, 41.0], // Constantinople / Istanbul
    modernCountry: 'Turkey',
    summary:
      'Longest-reigning Sultan of the Ottoman Empire who presided over its military, legal (Kanuni), and artistic apex across Southeast Europe, the Middle East, and North Africa.',
    keywords: ['suleiman', 'suleiman the magnificent', 'ottoman', 'kanuni', 'istanbul', 'constantinople', 'sultan']
  },
  {
    id: 'fig_mehmed',
    name: 'Mehmed II (Mehmed the Conqueror)',
    role: 'Ottoman Sultan',
    year: 1453,
    lonLat: [28.97, 41.0],
    modernCountry: 'Turkey',
    summary:
      'Conquered Constantinople in 1453 at age 21, ending the 1,100-year Byzantine Empire and establishing Istanbul as the imperial Ottoman capital.',
    keywords: ['mehmed', 'mehmed ii', 'mehmed the conqueror', 'conqueror', '1453', 'constantinople', 'byzantine', 'ottoman']
  },
  {
    id: 'fig_ataturk',
    name: 'Mustafa Kemal Atatürk',
    role: 'Founder & First President of the Republic of Turkey',
    year: 1923,
    lonLat: [32.85, 39.93], // Ankara
    modernCountry: 'Turkey',
    summary:
      'Led the Turkish War of Independence and founded the secular, modern Republic of Turkey in 1923 with its capital at Ankara.',
    keywords: ['ataturk', 'mustafa kemal', 'turkey', 'ankara', 'gallipoli', '1923']
  },
  {
    id: 'fig_babur',
    name: 'Emperor Babur',
    role: 'Founder of the Mughal Empire',
    year: 1526,
    lonLat: [78.04, 27.17], // Agra / Panipat
    modernCountry: 'India',
    summary:
      'Descendant of Timur and Genghis Khan who defeated Ibrahim Lodi at the First Battle of Panipat (1526) using field artillery, founding the Mughal Empire and authoring the Baburnama.',
    keywords: ['babur', 'mughal', 'panipat', 'baburnama', 'fergana', 'kabul', 'agra']
  },
  {
    id: 'fig_akbar',
    name: 'Akbar the Great',
    role: 'Third Emperor of the Mughal Empire',
    year: 1585,
    lonLat: [78.04, 27.17], // Agra / Fatehpur Sikri
    modernCountry: 'India',
    summary:
      'Expanded the Mughal Empire across the Indian subcontinent through administrative reform, religious tolerance (Sulh-i-Kul), and cultural patronage.',
    keywords: ['akbar', 'akbar the great', 'mughal', 'india', 'agra', 'fatehpur sikri', 'lahore']
  },
  {
    id: 'fig_shah_jahan',
    name: 'Shah Jahan & Aurangzeb Alamgir',
    role: 'Fifth & Sixth Mughal Emperors',
    year: 1658,
    lonLat: [78.04, 27.17],
    modernCountry: 'India',
    summary:
      'Shah Jahan commissioned the Taj Mahal in Agra, the Red Fort in Old Delhi, and the Shalimar Gardens in Lahore; his son Aurangzeb expanded the Mughal Empire to its greatest territorial extent.',
    keywords: ['shah jahan', 'aurangzeb', 'taj mahal', 'mughal empire', 'red fort', 'agra', 'delhi']
  },
  {
    id: 'fig_shivaji',
    name: 'Chhatrapati Shivaji Maharaj',
    role: 'Founder of the Maratha Empire',
    year: 1674,
    lonLat: [73.44, 18.23], // Raigad / Pune
    modernCountry: 'India',
    summary:
      'Founded the Hindavi Swarajya (Maratha Empire) in the Western Ghats, pioneering mountain guerrilla warfare, coastal naval fortifications, and an enlightened council of eight ministers (Ashta Pradhan).',
    keywords: ['shivaji', 'chhatrapati shivaji', 'maratha', 'raigad', 'pune', 'maharashtra', 'india']
  },
  {
    id: 'fig_ranjit_singh',
    name: 'Maharaja Ranjit Singh ("The Lion of the Punjab")',
    role: 'Founder of the Sikh Empire (Sher-e-Punjab)',
    year: 1820,
    lonLat: [74.35, 31.52], // Lahore
    modernCountry: 'Pakistan',
    summary:
      'Known as "The Lion of the Punjab" (Sher-e-Punjab), he united the Sikh misls into the sovereign Sikh Empire (1799–1849) centered at Lahore, modernizing the Khalsa Army along European artillery lines and gilding the Golden Temple.',
    keywords: ['ranjit singh', 'lion of the punjab', 'the lion of the punjab', 'sher e punjab', 'sikh empire', 'punjab', 'lahore', 'khalsa', 'pakistan', 'india']
  },
  {
    id: 'fig_jinnah',
    name: 'Muhammad Ali Jinnah ("Quaid-e-Azam" / The Great Leader)',
    role: 'Founder & First Governor-General of Pakistan',
    year: 1947,
    lonLat: [67.0, 24.86], // Karachi
    modernCountry: 'Pakistan',
    summary:
      'Revered in Pakistan as Quaid-e-Azam ("The Great Leader") and Baba-e-Qaum ("Father of the Nation"), the constitutional barrister led the All-India Muslim League to found independent Pakistan on August 14, 1947.',
    keywords: ['muhammad ali jinnah', 'jinnah', 'quaid e azam', 'the great leader', 'baba e qaum', 'pakistan', 'karachi', '1947', 'muslim league']
  },
  {
    id: 'fig_ayub_khan',
    name: 'Field Marshal Muhammad Ayub Khan',
    role: 'Second President of Pakistan',
    year: 1960,
    lonLat: [73.04, 33.68], // Islamabad / Rawalpindi
    modernCountry: 'Pakistan',
    summary:
      'Signed the historic 1960 Indus Waters Treaty, founded the new capital of Islamabad, and launched Pakistan’s rapid industrialization under the Second Five-Year Plan.',
    keywords: ['ayub khan', 'pakistan', '1960', 'indus waters treaty', 'islamabad']
  },
  {
    id: 'fig_pachacuti',
    name: 'Pachacuti Inca Yupanqui',
    role: 'Sapa Inca of Tawantinsuyu (Inca Empire)',
    year: 1465,
    lonLat: [-71.96, -13.53], // Cusco
    modernCountry: 'Peru',
    summary:
      'Transformed the Kingdom of Cusco into the vast Andean Inca Empire (Tawantinsuyu) and commissioned Machu Picchu.',
    keywords: ['pachacuti', 'inca', 'cusco', 'machu picchu', 'andes', 'peru']
  },
  {
    id: 'fig_moctezuma',
    name: 'Moctezuma II',
    role: 'Hueyi Tlatoani of the Aztec Empire',
    year: 1518,
    lonLat: [-99.13, 19.43], // Tenochtitlan
    modernCountry: 'Mexico',
    summary:
      'Ninth Tlatoani of Tenochtitlan under whom the Aztec Triple Alliance reached its maximal territorial extent prior to the arrival of Hernán Cortés in 1519.',
    keywords: ['moctezuma', 'montezuma', 'aztec', 'tenochtitlan', 'mexico', 'cortes']
  },
  {
    id: 'fig_elizabeth',
    name: 'Queen Elizabeth I ("The Virgin Queen" / Gloriana)',
    role: 'Queen of England and Ireland (Tudor Dynasty)',
    year: 1588,
    lonLat: [-0.12, 51.5], // London
    modernCountry: 'United Kingdom',
    summary:
      'Known as "The Virgin Queen", "Gloriana", and "Good Queen Bess", she presided over the Elizabethan Era, the defeat of the Spanish Armada in 1588, Shakespearean theater, and English maritime exploration.',
    keywords: ['elizabeth', 'queen elizabeth', 'virgin queen', 'the virgin queen', 'gloriana', 'good queen bess', 'tudor', 'spanish armada', 'england', 'london']
  },
  {
    id: 'fig_louis_xiv',
    name: 'King Louis XIV ("The Sun King" / Le Roi Soleil)',
    role: 'King of France (House of Bourbon)',
    year: 1685,
    lonLat: [2.12, 48.8], // Versailles / Paris
    modernCountry: 'France',
    summary:
      'Known as "The Sun King" (Le Roi Soleil), the longest-reigning monarch in sovereign European history (72 years) centralized French absolutism and built the Palace of Versailles.',
    keywords: ['louis xiv', 'sun king', 'the sun king', 'le roi soleil', 'versailles', 'bourbon', 'france', 'paris']
  },
  {
    id: 'fig_raffles_singapore',
    name: 'Sir Stamford Raffles ("Founder of Colonial Singapore")',
    role: 'British Statesman & Lieutenant-Governor of Bencoolen',
    year: 1819,
    lonLat: [103.85, 1.29], // Singapore
    modernCountry: 'Singapore',
    summary:
      'Signed the 1819 Treaty of Singapore with Sultan Hussein Shah and Temenggong Abdul Rahman of Johor, establishing a free-trade British East India Company port at the southern tip of the Malay Peninsula.',
    keywords: ['stamford raffles', 'sir stamford raffles', 'raffles', 'singapore', 'singapura', 'straits settlements', '1819']
  },
  {
    id: 'fig_tunku_abdul_rahman',
    name: 'Tunku Abdul Rahman ("Bapa Kemerdekaan" / Father of Independence)',
    role: '1st Prime Minister of Malaya (1957) & Malaysia (1963)',
    year: 1957,
    lonLat: [101.69, 3.14], // Kuala Lumpur
    modernCountry: 'Malaysia',
    summary:
      'Known as "Bapa Kemerdekaan" (Father of Independence) and "Bapa Malaysia", he led the Federation of Malaya to independence on August 31, 1957, and orchestrated the 1963 formation of Malaysia uniting Malaya, Singapore, Sarawak, and Sabah (North Borneo).',
    keywords: ['tunku abdul rahman', 'bapa kemerdekaan', 'father of independence', 'bapa malaysia', 'merdeka', 'malaysia', 'malaya', 'kuala lumpur', 'borneo', 'sarawak', 'sabah']
  },
  {
    id: 'fig_lee_kuan_yew',
    name: 'Lee Kuan Yew ("Founding Father of Modern Singapore" / LKY)',
    role: '1st Prime Minister of the Republic of Singapore (1959–1990)',
    year: 1965,
    lonLat: [103.85, 1.29], // Singapore
    modernCountry: 'Singapore',
    summary:
      'Known as the "Founding Father of Modern Singapore" (LKY), he led Singapore through self-governance (1959), merger with Malaysia (1963), and full independence on August 9, 1965, transforming the island city-state from a third-world port into a first-world global financial hub.',
    keywords: ['lee kuan yew', 'lky', 'founding father of modern singapore', 'father of singapore', 'singapore', '1965', 'pap']
  },
  {
    id: 'fig_peter_great',
    name: 'Peter the Great & Catherine the Great',
    role: 'Emperor & Empress of All Russia',
    year: 1712,
    lonLat: [30.33, 59.93], // Saint Petersburg
    modernCountry: 'Russia',
    summary:
      'Peter the Great modernized Russia, built its Baltic fleet, and founded Saint Petersburg (1703); Catherine the Great expanded Russia to the Black Sea during the Russian Enlightenment.',
    keywords: ['peter the great', 'catherine the great', 'saint petersburg', 'romanov', 'russian empire', 'russia']
  },
  {
    id: 'fig_ivan_terrible',
    name: 'Ivan IV the Terrible (Ivan Grozny)',
    role: 'First Tsar of All Russia',
    year: 1552,
    lonLat: [37.61, 55.75], // Moscow
    modernCountry: 'Russia',
    summary:
      'Crowned the first Tsar of All Russia in 1547, conquered the Khanates of Kazan and Astrakhan, and commissioned Saint Basil’s Cathedral in Moscow.',
    keywords: ['ivan the terrible', 'ivan iv', 'ivan grozny', 'tsar', 'moscow', 'kazan', 'russia']
  },
  {
    id: 'fig_frederick_great',
    name: 'Frederick II the Great',
    role: 'King of Prussia (House of Hohenzollern)',
    year: 1757,
    lonLat: [13.06, 52.4], // Potsdam / Berlin
    modernCountry: 'Germany',
    summary:
      'Enlightened absolutist monarch and military genius who elevated the Kingdom of Prussia to a European Great Power during the Seven Years’ War.',
    keywords: ['frederick the great', 'prussia', 'hohenzollern', 'sanssouci', 'berlin', 'germany']
  },
  {
    id: 'fig_sobieski',
    name: 'King John III Sobieski',
    role: 'King of Poland & Grand Duke of Lithuania',
    year: 1683,
    lonLat: [21.01, 52.22], // Warsaw / Vienna
    modernCountry: 'Poland',
    summary:
      'Led the largest cavalry charge in history with the Polish Winged Hussars to break the Ottoman Siege of Vienna on September 12, 1683.',
    keywords: ['john sobieski', 'jan sobieski', 'winged hussars', 'siege of vienna', '1683', 'poland']
  },
  {
    id: 'fig_zheng_he',
    name: 'Admiral Zheng He',
    role: 'Commander of the Ming Imperial Treasure Fleet',
    year: 1415,
    lonLat: [118.79, 32.06], // Nanjing
    modernCountry: 'China',
    summary:
      'Led seven monumental diplomatic and maritime treasure voyages (1405–1433) across Southeast Asia, India, Arabia, and East Africa under the Yongle Emperor.',
    keywords: ['zheng he', 'treasure fleet', 'ming dynasty', 'yongle', 'nanjing', 'china']
  },
  {
    id: 'fig_oda_nobunaga',
    name: 'Oda Nobunaga & Toyotomi Hideyoshi',
    role: 'Great Unifiers of Sengoku Period Japan',
    year: 1580,
    lonLat: [135.76, 35.01], // Kyoto / Azuchi
    modernCountry: 'Japan',
    summary:
      'Overturned centuries of feudal fragmentation during the Warring States (Sengoku) period through massed matchlock musketry (Battle of Nagashino, 1575) and castle architecture.',
    keywords: ['oda nobunaga', 'toyotomi hideyoshi', 'samurai', 'sengoku', 'kyoto', 'japan']
  },
  {
    id: 'fig_tokugawa',
    name: 'Tokugawa Ieyasu',
    role: 'Founder & First Shogun of the Tokugawa Shogunate',
    year: 1603,
    lonLat: [139.69, 35.68], // Edo (Tokyo)
    modernCountry: 'Japan',
    summary:
      'Unified Japan after the Battle of Sekigahara (1600) and established the Edo Period shogunate that governed Japan in peace for over 250 years.',
    keywords: ['tokugawa', 'ieyasu', 'shogun', 'edo', 'sekigahara', 'japan']
  },
  {
    id: 'fig_yi_sun_sin',
    name: 'Admiral Yi Sun-sin & King Sejong the Great',
    role: 'National Heroes of Joseon Dynasty Korea',
    year: 1592,
    lonLat: [126.97, 37.56], // Seoul
    modernCountry: 'South Korea',
    summary:
      'King Sejong created the Hangul alphabet (1443); Admiral Yi Sun-sin went undefeated in 23 naval battles with his armored Geobukseon (Turtle Ships) during the Imjin War (1592–1598).',
    keywords: ['yi sun-sin', 'sejong the great', 'turtle ship', 'hangul', 'joseon', 'korea']
  },
  {
    id: 'fig_washington',
    name: 'George Washington',
    role: 'Commander-in-Chief of the Continental Army & 1st US President',
    year: 1776,
    lonLat: [-75.16, 39.95], // Philadelphia / Mount Vernon
    modernCountry: 'United States of America',
    summary:
      'Led the American Revolutionary War to victory at Yorktown (1781), presided over the 1787 Constitutional Convention, and served as first President of the United States.',
    keywords: ['george washington', 'american revolution', '1776', 'founding fathers', 'usa', 'united states']
  },
  {
    id: 'fig_napoleon',
    name: 'Napoleon Bonaparte ("The Little Corporal")',
    role: 'Emperor of the French (Le Petit Caporal)',
    year: 1810,
    lonLat: [2.35, 48.85], // Paris
    modernCountry: 'France',
    summary:
      'Known affectionately to his troops as "The Little Corporal" (Le Petit Caporal), Napoleon reshaped European law via the Napoleonic Code and dominated continental Europe during the Napoleonic Wars.',
    keywords: ['napoleon', 'bonaparte', 'little corporal', 'the little corporal', 'le petit caporal', 'france', 'austerlitz', 'waterloo', 'paris']
  },
  {
    id: 'fig_bolivar',
    name: 'Simón Bolívar ("El Libertador" / The Liberator)',
    role: 'President of Gran Colombia & Liberator of South America',
    year: 1821,
    lonLat: [-74.07, 4.71], // Bogotá / Caracas
    modernCountry: 'Colombia',
    summary:
      'Honored across Latin America as "El Libertador" ("The Liberator"), he led the independence revolutions that liberated Venezuela, Colombia, Ecuador, Peru, Panama, and Bolivia from Spanish imperial rule.',
    keywords: ['simon bolivar', 'bolivar', 'el libertador', 'the liberator', 'libertador', 'gran colombia', 'south america', 'independence']
  },
  {
    id: 'fig_shaka_zulu',
    name: 'King Shaka Zulu',
    role: 'Founder of the Zulu Kingdom',
    year: 1824,
    lonLat: [31.4, -28.5], // KwaZulu-Natal
    modernCountry: 'South Africa',
    summary:
      'Transformed the Zulu Kingdom into a dominant Southern African military power through the iklwa short stabbing spear, cowhide shield formations, and the buffalo-horns encirclement tactic.',
    keywords: ['shaka zulu', 'zulu kingdom', 'kwazulu', 'isandlwana', 'south africa']
  },
  {
    id: 'fig_lincoln',
    name: 'Abraham Lincoln ("Honest Abe" / The Great Emancipator)',
    role: '16th President of the United States',
    year: 1863,
    lonLat: [-77.03, 38.9], // Washington, D.C.
    modernCountry: 'United States of America',
    summary:
      'Known as "Honest Abe" and "The Great Emancipator", Lincoln preserved the American Union during the Civil War and issued the Emancipation Proclamation abolishing slavery.',
    keywords: ['abraham lincoln', 'lincoln', 'honest abe', 'great emancipator', 'the great emancipator', 'civil war', 'gettysburg', 'emancipation', 'usa']
  },
  {
    id: 'fig_bismarck',
    name: 'Otto von Bismarck ("The Iron Chancellor")',
    role: 'First Chancellor of the German Empire (Der Eiserne Kanzler)',
    year: 1871,
    lonLat: [13.4, 52.52], // Berlin
    modernCountry: 'Germany',
    summary:
      'Known worldwide as "The Iron Chancellor" (Der Eiserne Kanzler), Bismarck was the architect of German unification (1871) and master of European Realpolitik diplomacy.',
    keywords: ['bismarck', 'otto von bismarck', 'iron chancellor', 'the iron chancellor', 'eiserne kanzler', 'german unification', 'prussia', 'deutsches reich', 'berlin']
  },
  {
    id: 'fig_garibaldi',
    name: 'Giuseppe Garibaldi ("Hero of Two Worlds") & Camillo Cavour',
    role: 'Leaders of Italian Unification (Il Risorgimento)',
    year: 1861,
    lonLat: [12.49, 41.89],
    modernCountry: 'Italy',
    summary:
      'Celebrated as the "Hero of Two Worlds" for his military campaigns in South America and Europe, Garibaldi led the Expedition of the Thousand (Redshirts) that unified Italy in 1861.',
    keywords: ['garibaldi', 'hero of two worlds', 'the hero of two worlds', 'cavour', 'risorgimento', 'italian unification', 'italy']
  },
  {
    id: 'fig_victoria',
    name: 'Queen Victoria ("Grandmother of Europe")',
    role: 'Queen of the United Kingdom & Empress of India',
    year: 1885,
    lonLat: [-0.12, 51.5], // London
    modernCountry: 'United Kingdom',
    summary:
      'Known as the "Grandmother of Europe", she reigned for 63 years during the industrial, scientific, and imperial apex of the global British Empire (Pax Britannica).',
    keywords: ['queen victoria', 'grandmother of europe', 'the grandmother of europe', 'victorian', 'british empire', 'pax britannica', 'london']
  },
  {
    id: 'fig_nicholas_ii',
    name: 'Tsar Nicholas II',
    role: 'Last Emperor of the Russian Empire (Kaiserreich Russland)',
    year: 1910,
    lonLat: [30.33, 59.93], // Saint Petersburg
    modernCountry: 'Russia',
    summary:
      'Last Romanov Tsar ruling the 1910 Russian Empire from Saint Petersburg prior to World War I and the 1917 Russian Revolution.',
    keywords: ['nicholas ii', 'tsar', 'romanov', 'russian empire', '1910', 'saint petersburg']
  },
  {
    id: 'fig_churchill',
    name: 'Winston Churchill ("The British Bulldog")',
    role: 'Prime Minister of the United Kingdom',
    year: 1940,
    lonLat: [-0.12, 51.5],
    modernCountry: 'United Kingdom',
    summary:
      'Nicknamed "The British Bulldog", Churchill led Great Britain through the darkest hours of World War II, the Battle of Britain, and the Allied victory against the Axis powers.',
    keywords: ['churchill', 'winston churchill', 'british bulldog', 'the british bulldog', 'world war ii', 'ww2', 'britain', 'london']
  },
  {
    id: 'fig_fdr',
    name: 'Franklin D. Roosevelt (FDR)',
    role: '32nd President of the United States',
    year: 1944,
    lonLat: [-77.03, 38.9],
    modernCountry: 'United States of America',
    summary:
      'Led the United States through the Great Depression with the New Deal and commanded the Allied war effort during World War II.',
    keywords: ['franklin roosevelt', 'fdr', 'new deal', 'world war ii', 'ww2', 'usa']
  },
  {
    id: 'fig_gandhi',
    name: 'Mahatma Gandhi ("Bapu" / Father of the Nation)',
    role: 'Leader of the Indian Independence Movement',
    year: 1947,
    lonLat: [77.2, 28.61], // New Delhi
    modernCountry: 'India',
    summary:
      'Revered as Mahatma ("Great Soul") and Bapu ("Father of the Nation"), he pioneered nonviolent civil disobedience (Satyagraha) leading India to independence in 1947.',
    keywords: ['gandhi', 'mahatma', 'bapu', 'father of the nation', 'great soul', 'satyagraha', 'india independence', 'salt march']
  },
  {
    id: 'fig_mandela',
    name: 'Nelson Mandela ("Madiba")',
    role: 'First President of Democratic South Africa',
    year: 1994,
    lonLat: [28.04, -26.2], // Johannesburg / Pretoria
    modernCountry: 'South Africa',
    summary:
      'Known affectionately by his Xhosa clan name "Madiba", the anti-apartheid revolutionary dismantled Apartheid and served as South Africa’s first democratically elected President.',
    keywords: ['mandela', 'nelson mandela', 'madiba', 'south africa', 'apartheid', 'reconciliation']
  },
  // ==========================================================================
  // HISTORICAL FIGURES FAMOUSLY KNOWN BY THEIR TITLES, EPITHETS & NICKNAMES
  // ==========================================================================
  {
    id: 'fig_simo_hayha',
    name: 'Simo Häyhä ("The White Death" / Valkoinen Kuolema)',
    role: 'Finnish Marksman & Sniper of the Winter War (WWII)',
    year: 1940,
    lonLat: [29.15, 61.35], // Kollaa River / Karelia, Finland
    modernCountry: 'Finland',
    summary:
      'Nicknamed "The White Death" (Finnish: Valkoinen kuolema; Russian: Belaya Smert) by Soviet Red Army troops during the 1939–1940 Winter War, Finnish corporal Simo Häyhä recorded over 500 confirmed sniper kills in sub-zero snow at the Battle of Kollaa using an iron-sighted M/28-30 rifle.',
    keywords: [
      'white death',
      'the white death',
      'simo hayha',
      'simo hayah',
      'simo häyhä',
      'hayha',
      'hayah',
      'valkoinen kuolema',
      'belaya smert',
      'finnish sniper',
      'winter war',
      'kollaa',
      'finland',
      'ww2',
      'world war ii'
    ]
  },
  {
    id: 'fig_red_baron',
    name: 'Manfred von Richthofen ("The Red Baron")',
    role: 'Imperial German Flying Ace of World War I',
    year: 1917,
    lonLat: [13.4, 52.52], // Berlin / Western Front
    modernCountry: 'Germany',
    summary:
      'World War I fighter pilot immortalized as "The Red Baron" (Der Rote Kampfflieger) for his scarlet Fokker Dr.I triplane; commander of Jagdgeschwader 1 ("The Flying Circus") credited with 80 official air combat victories.',
    keywords: [
      'red baron',
      'the red baron',
      'manfred von richthofen',
      'richthofen',
      'baron von richthofen',
      'der rote kampfflieger',
      'flying circus',
      'fokker triplane',
      'ww1',
      'world war i',
      'germany'
    ]
  },
  {
    id: 'fig_desert_fox',
    name: 'Field Marshal Erwin Rommel ("The Desert Fox")',
    role: 'Commander of the Afrika Korps in World War II (Wüstenfuchs)',
    year: 1942,
    lonLat: [28.95, 30.83], // North African Theater / Germany
    modernCountry: 'Germany',
    summary:
      'Nicknamed "The Desert Fox" (Der Wüstenfuchs) by both Allied and Axis forces for his audacious mobile armored warfare commands at Tobruk, Gazala, and El Alamein during the World War II North African Campaign.',
    keywords: [
      'desert fox',
      'the desert fox',
      'wustenfuchs',
      'erwin rommel',
      'rommel',
      'afrika korps',
      'afrikakorps',
      'tobruk',
      'el alamein',
      'ww2',
      'germany'
    ]
  },
  {
    id: 'fig_lady_death',
    name: 'Lyudmila Pavlichenko ("Lady Death") & Vasily Zaytsev',
    role: 'Legendary Soviet Snipers of the Eastern Front (WWII)',
    year: 1942,
    lonLat: [33.52, 44.61], // Sevastopol / Stalingrad
    modernCountry: 'Ukraine',
    summary:
      'Lyudmila Pavlichenko, dubbed "Lady Death" after recording 309 confirmed kills defending Odessa and Sevastopol, is the most successful female sniper in recorded history; Vasily Zaytsev led Soviet snipers during the Battle of Stalingrad.',
    keywords: [
      'lady death',
      'the lady death',
      'lyudmila pavlichenko',
      'pavlichenko',
      'vasily zaytsev',
      'vasily zaitsev',
      'sevastopol',
      'stalingrad',
      'ww2',
      'soviet sniper'
    ]
  },
  {
    id: 'fig_night_witches',
    name: '588th Night Bomber Regiment ("The Night Witches")',
    role: 'All-Female Soviet WWII Aviators (Nachthexen)',
    year: 1943,
    lonLat: [38.97, 45.03], // Taman / Eastern Front
    modernCountry: 'Russia',
    summary:
      'Nicknamed "The Night Witches" (Nachthexen) by German troops because their wooden Polikarpov Po-2 biplanes glided with engines idled before dropping bombs, sounding like sweeping brooms in the dark; flew over 23,000 combat sorties.',
    keywords: [
      'night witches',
      'the night witches',
      'nachthexen',
      '588th night bomber',
      'marina raskova',
      'yevegeniya rudneva',
      'ww2',
      'eastern front'
    ]
  },
  {
    id: 'fig_lawrence_arabia',
    name: 'T. E. Lawrence ("Lawrence of Arabia")',
    role: 'British Officer & Liaison of the Great Arab Revolt (WWI)',
    year: 1917,
    lonLat: [35.0, 29.53], // Aqaba / Hejaz Railway
    modernCountry: 'Saudi Arabia',
    summary:
      'British archaeologist and military officer Thomas Edward Lawrence—world-famous as "Lawrence of Arabia"—who fought alongside Emir Faisal’s Bedouin forces in the 1916–1918 Arab Revolt, capturing Aqaba and Damascus from the Ottoman Empire.',
    keywords: [
      'lawrence of arabia',
      't e lawrence',
      'thomas edward lawrence',
      'arab revolt',
      'aqaba',
      'seven pillars of wisdom',
      'hejaz',
      'ww1'
    ]
  },
  {
    id: 'fig_patton',
    name: 'General George S. Patton ("Old Blood and Guts")',
    role: 'Commander of the U.S. Third Army in World War II',
    year: 1944,
    lonLat: [6.13, 49.61], // Bastogne / Lorraine / Western Front
    modernCountry: 'United States of America',
    summary:
      'Nicknamed "Old Blood and Guts" for his fierce armored doctrine, General George S. Patton led US forces in North Africa, Sicily, the rapid sweep across France, and the relief of Bastogne during the Battle of the Bulge.',
    keywords: [
      'old blood and guts',
      'blood and guts',
      'george patton',
      'general patton',
      'george s patton',
      'third army',
      'battle of the bulge',
      'bastogne',
      'ww2'
    ]
  },
  {
    id: 'fig_leper_king',
    name: 'King Baldwin IV of Jerusalem ("The Leper King")',
    role: 'King of the Crusader Kingdom of Jerusalem',
    year: 1177,
    lonLat: [35.21, 31.76], // Jerusalem / Montgisard
    modernCountry: 'Israel',
    summary:
      'Known to history as "The Leper King", Baldwin IV ruled the Kingdom of Jerusalem despite debilitating leprosy from boyhood, famously defeating Saladin’s army against overwhelming odds at the Battle of Montgisard (1177) at age 16.',
    keywords: [
      'leper king',
      'the leper king',
      'baldwin iv',
      'king baldwin',
      'baldwin of jerusalem',
      'montgisard',
      'kingdom of jerusalem',
      'crusades'
    ]
  },
  {
    id: 'fig_el_cid',
    name: 'Rodrigo Díaz de Vivar ("El Cid" / El Campeador)',
    role: 'Castilian Knight, Warlord & Ruler of Valencia',
    year: 1094,
    lonLat: [-0.37, 39.46], // Valencia / Burgos
    modernCountry: 'Spain',
    summary:
      'Famous across medieval Spain as "El Cid" (from Arabic al-Sayyid, "The Lord") and "El Campeador" ("The Champion" / "Master of the Battlefield"), Rodrigo Díaz de Vivar conquered and ruled the Taifa of Valencia (1094–1099).',
    keywords: [
      'el cid',
      'the cid',
      'el campeador',
      'the champion',
      'rodrigo diaz de vivar',
      'valencia',
      'burgos',
      'reconquista',
      'spain'
    ]
  },
  {
    id: 'fig_black_prince',
    name: 'Edward of Woodstock ("The Black Prince")',
    role: 'Prince of Wales & English Commander in the Hundred Years’ War',
    year: 1356,
    lonLat: [0.34, 46.58], // Poitiers / Aquitaine
    modernCountry: 'United Kingdom',
    summary:
      'Eldest son of King Edward III of England, renowned as "The Black Prince", who commanded decisive English victories at the Battle of Crécy (1346) and the Battle of Poitiers (1356), where he captured King John II of France.',
    keywords: [
      'black prince',
      'the black prince',
      'edward of woodstock',
      'edward the black prince',
      'crecy',
      'poitiers',
      'hundred years war',
      'england'
    ]
  },
  {
    id: 'fig_braveheart',
    name: 'Sir William Wallace ("Braveheart" / Guardian of Scotland)',
    role: 'Leader of the First War of Scottish Independence',
    year: 1297,
    lonLat: [-3.93, 56.12], // Stirling Bridge, Scotland
    modernCountry: 'United Kingdom',
    summary:
      'Scottish knight celebrated as "Braveheart" and appointed "Guardian of Scotland" after routing the English army of Edward I at the Battle of Stirling Bridge in September 1297.',
    keywords: [
      'braveheart',
      'william wallace',
      'sir william wallace',
      'guardian of scotland',
      'stirling bridge',
      'robert the bruce',
      'scotland'
    ]
  },
  {
    id: 'fig_longshanks',
    name: 'King Edward I ("Edward Longshanks" / Hammer of the Scots)',
    role: 'Plantagenet King of England (Malleus Scotorum)',
    year: 1298,
    lonLat: [-0.12, 51.5], // Westminster / London
    modernCountry: 'United Kingdom',
    summary:
      'Nicknamed "Edward Longshanks" for his 6-foot-2 stature and inscribed on his tomb as "Hammer of the Scots" (Malleus Scotorum); conquered Wales, built the iron ring of Welsh castles, and reformed English common law.',
    keywords: [
      'longshanks',
      'edward longshanks',
      'hammer of the scots',
      'the hammer of the scots',
      'malleus scotorum',
      'edward i',
      'king edward i',
      'england'
    ]
  },
  {
    id: 'fig_kingmaker',
    name: 'Richard Neville, Earl of Warwick ("Warwick the Kingmaker")',
    role: 'English Nobleman & Arbiter of the Wars of the Roses',
    year: 1461,
    lonLat: [-1.58, 52.28], // Warwick, England
    modernCountry: 'United Kingdom',
    summary:
      'Known as "The Kingmaker" for deposing two kings during the Wars of the Roses—helping put Yorkist Edward IV on the English throne in 1461 before restoring Lancastrian Henry VI in 1470.',
    keywords: [
      'kingmaker',
      'the kingmaker',
      'warwick the kingmaker',
      'richard neville',
      'earl of warwick',
      'wars of the roses',
      'england'
    ]
  },
  {
    id: 'fig_bloody_mary',
    name: 'Queen Mary I of England ("Bloody Mary")',
    role: 'Tudor Queen of England and Ireland',
    year: 1555,
    lonLat: [-0.12, 51.5], // London
    modernCountry: 'United Kingdom',
    summary:
      'First Queen Regnant of England (r. 1553–1558), given the epithet "Bloody Mary" by Protestant chroniclers for the Marian persecutions during her attempt to reverse the English Reformation.',
    keywords: [
      'bloody mary',
      'mary i',
      'queen mary i',
      'mary tudor',
      'tudor',
      'england'
    ]
  },
  {
    id: 'fig_iron_duke',
    name: 'Arthur Wellesley, Duke of Wellington ("The Iron Duke")',
    role: 'British Field Marshal & Prime Minister',
    year: 1815,
    lonLat: [-0.12, 51.5], // London / Waterloo
    modernCountry: 'United Kingdom',
    summary:
      'Known across Britain as "The Iron Duke", Arthur Wellesley defeated Napoleon’s marshals in the Peninsular War, triumphed over Napoleon at the Battle of Waterloo (1815), and twice served as British Prime Minister.',
    keywords: [
      'iron duke',
      'the iron duke',
      'duke of wellington',
      'wellington',
      'arthur wellesley',
      'waterloo',
      'britain'
    ]
  },
  {
    id: 'fig_iron_lady',
    name: 'Margaret Thatcher ("The Iron Lady")',
    role: 'Prime Minister of the United Kingdom (1979–1990)',
    year: 1982,
    lonLat: [-0.12, 51.5], // London
    modernCountry: 'United Kingdom',
    summary:
      'Dubbed "The Iron Lady" by a Soviet journalist for her uncompromising Cold War stance, Margaret Thatcher was Britain’s longest-serving 20th-century Prime Minister and led the UK during the 1982 Falklands War.',
    keywords: [
      'iron lady',
      'the iron lady',
      'margaret thatcher',
      'thatcher',
      'united kingdom',
      'falklands war',
      'cold war'
    ]
  },
  {
    id: 'fig_charles_martel',
    name: 'Charles Martel ("Charles the Hammer")',
    role: 'Mayor of the Palace & Ruler of the Franks',
    year: 732,
    lonLat: [0.68, 47.39], // Tours / Poitiers
    modernCountry: 'France',
    summary:
      'Earned the epithet Martel ("The Hammer") after halting the Umayyad advance into Western Europe at the Battle of Tours / Poitiers in 732 CE and laying the foundations of the Carolingian Empire.',
    keywords: [
      'charles the hammer',
      'the hammer',
      'charles martel',
      'martel',
      'battle of tours',
      'poitiers',
      '732',
      'franks',
      'france'
    ]
  },
  {
    id: 'fig_robespierre',
    name: 'Maximilien Robespierre ("The Incorruptible")',
    role: 'Architect of the French Revolution & Committee of Public Safety',
    year: 1794,
    lonLat: [2.35, 48.85], // Paris
    modernCountry: 'France',
    summary:
      'Known to his supporters as "The Incorruptible" (L’Incorruptible) for his austere moral rigidity, Robespierre led the Jacobins and the Committee of Public Safety during the Reign of Terror (1793–1794) before his downfall on 9 Thermidor.',
    keywords: [
      'the incorruptible',
      'incorruptible',
      'l incorruptible',
      'robespierre',
      'maximilien robespierre',
      'reign of terror',
      'jacobins',
      'french revolution',
      'paris'
    ]
  },
  {
    id: 'fig_barbarossa_hre',
    name: 'Emperor Frederick I ("Frederick Barbarossa" / Redbeard)',
    role: 'Holy Roman Emperor (House of Hohenstaufen)',
    year: 1189,
    lonLat: [8.68, 50.11], // Frankfurt / Aachen
    modernCountry: 'Germany',
    summary:
      'Named Barbarossa ("Redbeard") by the northern Italian cities he campaigned against, Frederick I was one of the greatest medieval Holy Roman Emperors and led the German crusader host in the Third Crusade.',
    keywords: [
      'barbarossa',
      'frederick barbarossa',
      'redbeard',
      'frederick i',
      'hohenstaufen',
      'holy roman emperor',
      'third crusade',
      'germany'
    ]
  },
  {
    id: 'fig_hayreddin_barbarossa',
    name: 'Hayreddin Barbarossa ("Redbeard" / Kaptan-ı Derya)',
    role: 'Grand Admiral of the Ottoman Imperial Fleet',
    year: 1538,
    lonLat: [28.97, 41.0], // Constantinople / Preveza / Algiers
    modernCountry: 'Turkey',
    summary:
      'Ottoman corsair and Grand Admiral (Kaptan-ı Derya) known across Europe as "Barbarossa" ("Redbeard"), whose victory over Andrea Doria’s Holy League fleet at the Battle of Preveza (1538) secured Ottoman dominance of the Mediterranean.',
    keywords: [
      'hayreddin barbarossa',
      'khair ad din',
      'barbarossa',
      'redbeard',
      'kaptan i derya',
      'preveza',
      'algiers',
      'ottoman navy',
      'turkey'
    ]
  },
  {
    id: 'fig_lion_of_the_north',
    name: 'King Gustavus Adolphus ("The Lion of the North")',
    role: 'King of Sweden & Military Innovator of the Thirty Years’ War',
    year: 1631,
    lonLat: [18.06, 59.32], // Stockholm / Breitenfeld
    modernCountry: 'Sweden',
    summary:
      'Hailed as "The Lion of the North" (Der Löwe aus Mitternacht) and the "Father of Modern Warfare" for his mobile field artillery and combined-arms tactics at the Battle of Breitenfeld (1631) during the Thirty Years’ War.',
    keywords: [
      'lion of the north',
      'the lion of the north',
      'father of modern warfare',
      'gustavus adolphus',
      'gustav ii adolf',
      'breitenfeld',
      'lutzen',
      'thirty years war',
      'sweden'
    ]
  },
  {
    id: 'fig_sword_of_allah',
    name: 'Khalid ibn al-Walid ("The Sword of Allah")',
    role: 'Supreme Rashidun Military Commander (Sayf Allah al-Maslul)',
    year: 636,
    lonLat: [35.88, 32.81], // Yarmouk / Damascus
    modernCountry: 'Syria',
    summary:
      'Given the title Sayf Allah al-Maslul ("The Drawn Sword of Allah"), Khalid ibn al-Walid went undefeated in over 100 engagements against the Byzantine and Sasanian Persian Empires, culminating in the decisive Battle of the Yarmouk (636 CE).',
    keywords: [
      'sword of allah',
      'the sword of allah',
      'sword of god',
      'sayf allah',
      'khalid ibn al walid',
      'khalid bin walid',
      'yarmouk',
      'walaja',
      'rashidun',
      'syria'
    ]
  },
  {
    id: 'fig_bulgar_slayer',
    name: 'Emperor Basil II ("The Bulgar-Slayer" / Boulgaroktonos)',
    role: 'Byzantine Emperor (Macedonian Dynasty)',
    year: 1014,
    lonLat: [28.97, 41.0], // Constantinople
    modernCountry: 'Turkey',
    summary:
      'Known as "The Bulgar-Slayer" (Boulgaroktonos), Basil II presided over the medieval territorial and military zenith of the Byzantine Empire, reconquering the Balkans up to the Danube and extending rule into Syria and Armenia.',
    keywords: [
      'bulgar slayer',
      'the bulgar slayer',
      'boulgaroktonos',
      'basil ii',
      'emperor basil',
      'byzantine empire',
      'kleidion',
      'constantinople'
    ]
  },
  {
    id: 'fig_thunderbolt',
    name: 'Sultan Bayezid I ("The Thunderbolt" / Yıldırım Bayezid)',
    role: 'Fourth Sultan of the Ottoman Empire',
    year: 1396,
    lonLat: [29.06, 40.18], // Bursa / Nicopolis
    modernCountry: 'Turkey',
    summary:
      'Earned the epithet Yıldırım ("The Thunderbolt") for the astonishing speed with which he marched his armies between Anatolia and the Balkans, crushing the European Crusader coalition at the Battle of Nicopolis (1396).',
    keywords: [
      'the thunderbolt',
      'thunderbolt',
      'bayezid the thunderbolt',
      'yildirim bayezid',
      'bayezid i',
      'nicopolis',
      'ankara 1402',
      'ottoman'
    ]
  },
  {
    id: 'fig_selim_grim',
    name: 'Sultan Selim I ("Selim the Grim" / Yavuz Sultan Selim)',
    role: 'Ninth Ottoman Sultan & First Ottoman Caliph',
    year: 1517,
    lonLat: [28.97, 41.0], // Constantinople / Cairo
    modernCountry: 'Turkey',
    summary:
      'Known in the West as "Selim the Grim" and in Turkish as Yavuz ("The Resolute"), Selim I tripled the size of the Ottoman Empire in just eight years by defeating Safavid Persia at Chaldiran (1514) and conquering the Mamluk Sultanate (1517).',
    keywords: [
      'selim the grim',
      'the grim',
      'yavuz sultan selim',
      'selim i',
      'chaldiran',
      'mamluk',
      'ottoman'
    ]
  },
  {
    id: 'fig_caligula',
    name: 'Emperor Caligula (Gaius Caesar / "Little Boots")',
    role: 'Third Roman Emperor (Julio-Claudian Dynasty)',
    year: 39,
    lonLat: [12.49, 41.89], // Rome
    modernCountry: 'Italy',
    summary:
      'Born Gaius Julius Caesar Germanicus, he acquired the lifelong nickname "Caligula" (meaning "Little Soldier’s Boots") from the miniature military uniform he wore as a boy in his father Germanicus’s Rhine army camps.',
    keywords: [
      'caligula',
      'little boots',
      'gaius caesar',
      'germanicus',
      'roman emperor',
      'rome'
    ]
  },
  {
    id: 'fig_fabius_cunctator',
    name: 'Quintus Fabius Maximus ("The Delayer" / Cunctator)',
    role: 'Roman Dictator & Architect of the Fabian Strategy',
    year: -217,
    lonLat: [12.49, 41.89], // Rome
    modernCountry: 'Italy',
    summary:
      'Given the agnomen Cunctator ("The Delayer") for his war of attrition against Hannibal Barca in Italy—shadowing Carthaginian forces and cutting supply lines while refusing pitched battle until Rome rebuilt its legions.',
    keywords: [
      'the delayer',
      'delayer',
      'cunctator',
      'fabius maximus',
      'fabian strategy',
      'punic war',
      'rome'
    ]
  },
  {
    id: 'fig_rasputin',
    name: 'Grigori Rasputin ("The Mad Monk")',
    role: 'Russian Mystic & Confidant of Tsar Nicholas II & Tsarina Alexandra',
    year: 1916,
    lonLat: [30.33, 59.93], // Saint Petersburg (Petrograd)
    modernCountry: 'Russia',
    summary:
      'Siberian mystic popularly dubbed "The Mad Monk", who gained immense political influence over the imperial court of Tsar Nicholas II and Tsarina Alexandra through his perceived ability to treat Tsarevich Alexei’s hemophilia.',
    keywords: [
      'mad monk',
      'the mad monk',
      'rasputin',
      'grigori rasputin',
      'petrograd',
      'saint petersburg',
      'romanov',
      'russia'
    ]
  },
  {
    id: 'fig_stalin',
    name: 'Joseph Stalin ("Man of Steel" / Koba)',
    role: 'General Secretary of the Soviet Union during World War II',
    year: 1943,
    lonLat: [37.61, 55.75], // Moscow
    modernCountry: 'Russia',
    summary:
      'Born Ioseb Jughashvili, he adopted the revolutionary name "Stalin" meaning "Man of Steel"; ruled the USSR from the late 1920s to 1953, leading the Soviet war effort against Nazi Germany in World War II.',
    keywords: [
      'man of steel',
      'the man of steel',
      'stalin',
      'joseph stalin',
      'koba',
      'ussr',
      'soviet union',
      'stalingrad',
      'moscow',
      'ww2'
    ]
  },
  {
    id: 'fig_blackbeard',
    name: 'Edward Teach ("Blackbeard")',
    role: 'Notorious English Pirate of the Golden Age of Piracy',
    year: 1718,
    lonLat: [-75.9, 35.1], // Ocracoke Island, North Carolina / Nassau
    modernCountry: 'United States of America',
    summary:
      'English pirate captain Edward Teach—universally known by his fearsome moniker "Blackbeard"—who commanded the 40-gun flagship Queen Anne’s Revenge across the Caribbean and blockaded Charleston in 1718.',
    keywords: [
      'blackbeard',
      'edward teach',
      'edward thatch',
      'queen annes revenge',
      'golden age of piracy',
      'ocracoke',
      'nassau',
      'pirate'
    ]
  },
  {
    id: 'fig_swamp_fox',
    name: 'General Francis Marion ("The Swamp Fox")',
    role: 'American Revolutionary War Guerrilla Commander',
    year: 1780,
    lonLat: [-79.93, 32.77], // South Carolina Lowcountry
    modernCountry: 'United States of America',
    summary:
      'Dubbed "The Swamp Fox" by British Colonel Banastre Tarleton after eluding British forces through the South Carolina cypress swamps, Francis Marion pioneered irregular guerrilla warfare during the American Revolution.',
    keywords: [
      'swamp fox',
      'the swamp fox',
      'francis marion',
      'american revolution',
      'south carolina',
      'guerrilla'
    ]
  },
  {
    id: 'fig_stonewall_jackson',
    name: 'General Thomas J. Jackson ("Stonewall Jackson")',
    role: 'Confederate Corps Commander in the American Civil War',
    year: 1862,
    lonLat: [-78.19, 39.18], // Shenandoah Valley / Chancellorsville, Virginia
    modernCountry: 'United States of America',
    summary:
      'Earned his famous nickname "Stonewall Jackson" at the First Battle of Bull Run (1861) when General Bernard Bee shouted "There is Jackson standing like a stone wall!" Renowned for his 1862 Shenandoah Valley Campaign.',
    keywords: [
      'stonewall jackson',
      'stonewall',
      'thomas jackson',
      'bull run',
      'chancellorsville',
      'shenandoah',
      'american civil war'
    ]
  },
  {
    id: 'fig_old_hickory',
    name: 'Andrew Jackson ("Old Hickory")',
    role: '7th President of the United States & General at New Orleans',
    year: 1815,
    lonLat: [-90.07, 29.95], // New Orleans / Washington, D.C.
    modernCountry: 'United States of America',
    summary:
      'Nicknamed "Old Hickory" by his soldiers for being as tough as hickory wood on the march, Jackson defeated the British at the Battle of New Orleans (1815) and later served two terms as 7th US President.',
    keywords: [
      'old hickory',
      'andrew jackson',
      'battle of new orleans',
      '1815',
      'united states'
    ]
  },
  {
    id: 'fig_teddy_roosevelt',
    name: 'Theodore Roosevelt ("Teddy" / The Rough Rider / Trust Buster)',
    role: '26th President of the United States',
    year: 1904,
    lonLat: [-77.03, 38.9], // Washington, D.C.
    modernCountry: 'United States of America',
    summary:
      'Known as "Teddy Roosevelt", the "Rough Rider" of San Juan Hill, and the "Trust Buster", the 26th US President championed the Square Deal, National Parks conservation, and construction of the Panama Canal.',
    keywords: [
      'teddy roosevelt',
      'theodore roosevelt',
      'rough rider',
      'the rough rider',
      'rough riders',
      'trust buster',
      'panama canal',
      'square deal',
      'usa'
    ]
  },
  {
    id: 'fig_harriet_tubman',
    name: 'Harriet Tubman ("Moses of Her People")',
    role: 'Abolitionist, Underground Railroad Conductor & Union Scout',
    year: 1859,
    lonLat: [-76.07, 38.56], // Maryland / South Carolina
    modernCountry: 'United States of America',
    summary:
      'Called "Moses" for her courage in leading 13 rescue missions that freed approximately 70 enslaved people along the Underground Railroad, and later led the Combahee River Raid for the Union Army in 1863.',
    keywords: [
      'moses of her people',
      'harriet tubman',
      'tubman',
      'underground railroad',
      'abolitionist',
      'combahee river',
      'civil war'
    ]
  },
  {
    id: 'fig_one_eyed_dragon',
    name: 'Date Masamune ("The One-Eyed Dragon" / Dokuganryū)',
    role: 'Feudal Daimyo of Northern Japan & Founder of Sendai',
    year: 1600,
    lonLat: [140.86, 38.26], // Sendai, Japan
    modernCountry: 'Japan',
    summary:
      'Legendary Sengoku and early Edo period warlord known as "The One-Eyed Dragon of Oshu" (Dokuganryū) after losing his right eye to smallpox in childhood; famed for his crescent-moon helmet and founding the city of Sendai.',
    keywords: [
      'one eyed dragon',
      'the one eyed dragon',
      'dokuganryu',
      'date masamune',
      'masamune',
      'sendai',
      'samurai',
      'japan'
    ]
  },
  {
    id: 'fig_tiger_of_kai',
    name: 'Takeda Shingen ("The Tiger of Kai") & Uesugi Kenshin ("The Dragon of Echigo")',
    role: 'Arch-Rival Daimyo Warlords of Sengoku Period Japan',
    year: 1561,
    lonLat: [138.19, 36.56], // Kawanakajima, Nagano
    modernCountry: 'Japan',
    summary:
      'Takeda Shingen ("The Tiger of Kai") and Uesugi Kenshin ("The Dragon of Echigo" / God of War) clashed five times at the legendary Battles of Kawanakajima (1553–1564), representing the pinnacle of samurai cavalry and tactical command.',
    keywords: [
      'tiger of kai',
      'the tiger of kai',
      'takeda shingen',
      'dragon of echigo',
      'the dragon of echigo',
      'uesugi kenshin',
      'kawanakajima',
      'fuurinkazan',
      'japan'
    ]
  },
  {
    id: 'fig_sword_saint',
    name: 'Miyamoto Musashi ("The Sword Saint" / Kensei)',
    role: 'Undefeated Japanese Swordsman, Ronin & Author of The Book of Five Rings',
    year: 1612,
    lonLat: [130.93, 33.93], // Ganryū-jima / Kyoto
    modernCountry: 'Japan',
    summary:
      'Revered in Japan as Kensei ("The Sword Saint"), Miyamoto Musashi fought over 60 duels without defeat—most famously defeating Sasaki Kojirō at Ganryū-jima in 1612—and authored the classic strategy treatise The Book of Five Rings (Go Rin No Sho).',
    keywords: [
      'sword saint',
      'the sword saint',
      'kensei',
      'miyamoto musashi',
      'musashi',
      'sasaki kojiro',
      'book of five rings',
      'ronin',
      'japan'
    ]
  },
  {
    id: 'fig_sleeping_dragon',
    name: 'Zhuge Liang ("The Sleeping Dragon") & Guan Yu ("God of War")',
    role: 'Chancellor & Vanguard General of Shu Han (Three Kingdoms China)',
    year: 208,
    lonLat: [104.06, 30.57], // Chengdu / Red Cliffs
    modernCountry: 'China',
    summary:
      'Zhuge Liang (courtesy name Kongming), known as "The Sleeping Dragon" or "Crouching Dragon" (Wolong), masterminded the alliance at the Battle of Red Cliffs (208 CE) alongside Liu Bei and the legendary general Guan Yu.',
    keywords: [
      'sleeping dragon',
      'the sleeping dragon',
      'crouching dragon',
      'wolong',
      'zhuge liang',
      'kongming',
      'guan yu',
      'liu bei',
      'cao cao',
      'red cliffs',
      'three kingdoms',
      'china'
    ]
  },
  {
    id: 'fig_tiger_of_mysore',
    name: 'Tipu Sultan ("The Tiger of Mysore")',
    role: 'Ruler of the Kingdom of Mysore & Pioneer of Rocket Artillery',
    year: 1792,
    lonLat: [76.68, 12.42], // Seringapatam, Karnataka
    modernCountry: 'India',
    summary:
      'Known as "The Tiger of Mysore", Tipu Sultan fiercely resisted the British East India Company across the Anglo-Mysore Wars and deployed iron-cased Mysorean military rockets that later inspired British Congreve rockets.',
    keywords: [
      'tiger of mysore',
      'the tiger of mysore',
      'tipu sultan',
      'mysore',
      'seringapatam',
      'mysorean rockets',
      'india'
    ]
  },
  {
    id: 'fig_iron_man_india',
    name: 'Sardar Vallabhbhai Patel ("The Iron Man of India")',
    role: 'First Deputy Prime Minister of India & Architect of Political Integration',
    year: 1947,
    lonLat: [77.2, 28.61], // New Delhi / Gujarat
    modernCountry: 'India',
    summary:
      'Honored as "The Iron Man of India" (and commemorated by the world’s tallest statue, the Statue of Unity), Sardar Patel peacefully integrated over 560 princely states into the newly independent Union of India in 1947–1949.',
    keywords: [
      'iron man of india',
      'the iron man of india',
      'sardar patel',
      'vallabhbhai patel',
      'statue of unity',
      'india'
    ]
  },
  {
    id: 'fig_lion_of_desert',
    name: 'Omar Mukhtar ("The Lion of the Desert")',
    role: 'Leader of Libyan Anticolonial Resistance in Cyrenaica',
    year: 1929,
    lonLat: [21.75, 32.76], // Jebel Akhdar / Cyrenaica, Libya
    modernCountry: 'Libya',
    summary:
      'Known throughout the Arab world as "The Lion of the Desert" (Asad al-Sahra), the Senussi teacher and commander led a twenty-year guerrilla resistance in Cyrenaica against Italian colonial forces until his capture in 1931.',
    keywords: [
      'lion of the desert',
      'the lion of the desert',
      'asad al sahra',
      'omar mukhtar',
      'cyrenaica',
      'libya'
    ]
  },
  {
    id: 'fig_lion_of_judah',
    name: 'Emperor Haile Selassie I ("Conquering Lion of Judah")',
    role: 'Emperor of Ethiopia (Ras Tafari Makonnen)',
    year: 1936,
    lonLat: [38.75, 9.03], // Addis Ababa
    modernCountry: 'Ethiopia',
    summary:
      'Titled "Conquering Lion of the Tribe of Judah", Emperor Haile Selassie modernized Ethiopia, delivered a historic 1936 appeal for collective security before the League of Nations during the Italian invasion, and co-founded the Organization of African Unity.',
    keywords: [
      'lion of judah',
      'conquering lion of judah',
      'haile selassie',
      'ras tafari',
      'ethiopia',
      'addis ababa'
    ]
  },
  {
    id: 'fig_lady_with_lamp',
    name: 'Florence Nightingale ("The Lady with the Lamp")',
    role: 'Founder of Modern Nursing & Statistician (Crimean War)',
    year: 1854,
    lonLat: [29.01, 41.0], // Scutari (Üsküdar) / London
    modernCountry: 'United Kingdom',
    summary:
      'Immortalized as "The Lady with the Lamp" for her nighttime rounds tending wounded British soldiers at Scutari Barrack Hospital during the Crimean War (1854–1856); revolutionized hospital sanitation and medical statistics.',
    keywords: [
      'lady with the lamp',
      'the lady with the lamp',
      'florence nightingale',
      'nightingale',
      'crimean war',
      'scutari'
    ]
  }
];

// ============================================================================
// 2. CURATED HISTORICAL & MODERN CITIES / CAPITALS
// ============================================================================
const RAW_CITIES: Array<{
  id: string;
  name: string;
  subtitle: string;
  year: number;
  lonLat: [number, number];
  modernCountry: string;
  summary: string;
  keywords: string[];
}> = [
  {
    id: 'city_targoviste',
    name: 'Târgoviște & Bucharest (Wallachia)',
    subtitle: 'Princely Capital of Wallachia (Vlad III) & Modern Capital of Romania',
    year: 1462,
    lonLat: [25.45, 44.92],
    modernCountry: 'Romania',
    summary:
      'Royal seat of the Principality of Wallachia (Curtea Domnească & Chindia Tower) under Mircea the Elder, Vlad III the Impaler (who first fortified Bucharest in 1459), and Michael the Brave.',
    keywords: ['targoviste', 'bucharest', 'bucuresti', 'curtea de arges', 'wallachia', 'walllachia', 'vlad the impaler', 'romania']
  },
  {
    id: 'city_rome',
    name: 'Rome (Eternal City)',
    subtitle: 'Capital of the Roman Republic, Roman Empire & Modern Italy',
    year: 117,
    lonLat: [12.49, 41.89],
    modernCountry: 'Italy',
    summary:
      'Imperial metropolis on the Tiber River that governed upwards of 60 million people at the height of the Roman Empire under Trajan in 117 CE.',
    keywords: ['rome', 'roman empire', 'colosseum', 'italy', 'vatican', 'latium']
  },
  {
    id: 'city_constantinople',
    name: 'Constantinople / Istanbul',
    subtitle: 'Imperial Capital of the Byzantine & Ottoman Empires',
    year: 1453,
    lonLat: [28.97, 41.0],
    modernCountry: 'Turkey',
    summary:
      'Strategic city straddling the Bosporus Strait between Europe and Asia; capital of the Eastern Roman (Byzantine) and Ottoman Empires for 1,600 years.',
    keywords: ['constantinople', 'istanbul', 'byzantium', 'bosporus', 'hagia sophia', 'turkey']
  },
  {
    id: 'city_babylon',
    name: 'Babylon',
    subtitle: 'Ancient Mesopotamian Imperial Capital',
    year: -600,
    lonLat: [44.42, 32.54],
    modernCountry: 'Iraq',
    summary:
      'Seat of Hammurabi and Nebuchadnezzar II along the Euphrates River, famed for the Ishtar Gate and Babylonian astronomy.',
    keywords: ['babylon', 'mesopotamia', 'ishtar gate', 'nebuchadnezzar', 'iraq']
  },
  {
    id: 'city_baghdad',
    name: 'Baghdad (Round City of Peace)',
    subtitle: 'Capital of the Abbasid Caliphate & Modern Iraq',
    year: 800,
    lonLat: [44.36, 33.31],
    modernCountry: 'Iraq',
    summary:
      'Founded in 762 CE along the Tigris River; home to the House of Wisdom (Bayt al-Hikma) during the Islamic Golden Age.',
    keywords: ['baghdad', 'abbasid', 'house of wisdom', 'tigris', 'iraq']
  },
  {
    id: 'city_alexandria',
    name: 'Alexandria',
    subtitle: 'Hellenistic Emporium & Home of the Great Library',
    year: -250,
    lonLat: [29.91, 31.2],
    modernCountry: 'Egypt',
    summary:
      'Founded by Alexander the Great in 331 BCE; renowned for the Pharos Lighthouse and the Great Library of Alexandria.',
    keywords: ['alexandria', 'library of alexandria', 'pharos', 'egypt', 'mediterranean']
  },
  {
    id: 'city_carthage',
    name: 'Carthage',
    subtitle: 'Phoenician Maritime Metropolis & Punic Capital',
    year: -220,
    lonLat: [10.32, 36.85],
    modernCountry: 'Tunisia',
    summary:
      'Great Phoenician naval and commercial superpower of the western Mediterranean, famed for its circular Cothon harbor and rivalry with Rome in the Punic Wars.',
    keywords: ['carthage', 'punic', 'phoenician', 'hannibal', 'tunisia', 'tunis']
  },
  {
    id: 'city_changan',
    name: 'Chang’an / Xi’an',
    subtitle: 'Eastern Terminus of the Silk Road & Tang Imperial Capital',
    year: 700,
    lonLat: [108.94, 34.34],
    modernCountry: 'China',
    summary:
      'Cosmopolitan capital of the Qin, Han, Sui, and Tang dynasties with over one million inhabitants and merchants from across Eurasia.',
    keywords: ['changan', 'xian', 'silk road', 'tang dynasty', 'han dynasty', 'china']
  },
  {
    id: 'city_samarkand',
    name: 'Samarkand',
    subtitle: 'Jewel of the Central Asian Silk Road & Timurid Capital',
    year: 1400,
    lonLat: [66.97, 39.65],
    modernCountry: 'Uzbekistan',
    summary:
      'Crossroads of Eurasian trade in the Zeravshan River valley; famed for the Registan and Ulugh Beg’s astronomical observatory.',
    keywords: ['samarkand', 'silk road', 'registan', 'uzbekistan', 'sogdia']
  },
  {
    id: 'city_timbuktu',
    name: 'Timbuktu',
    subtitle: 'Sahelian Gold Trade Terminus & Center of Islamic Scholarship',
    year: 1350,
    lonLat: [-3.0, 16.77],
    modernCountry: 'Mali',
    summary:
      'Flourished under the Mali and Songhai Empires as the nexus of the Trans-Saharan gold, salt, and manuscript trade.',
    keywords: ['timbuktu', 'mali', 'songhai', 'sahara', 'sankore']
  },
  {
    id: 'city_jerusalem',
    name: 'Jerusalem',
    subtitle: 'Historic Levantine & Sacred City',
    year: 1100,
    lonLat: [35.21, 31.76],
    modernCountry: 'Israel',
    summary:
      'One of the oldest cities in the world, central to Judaism, Christianity, and Islam, and focal point of ancient empires and the Crusades.',
    keywords: ['jerusalem', 'levant', 'holy land', 'crusades']
  },
  {
    id: 'city_mecca_medina',
    name: 'Mecca & Medina (Hejaz)',
    subtitle: 'Cradle of Islam & Spiritual Center of the Muslim World',
    year: 630,
    lonLat: [39.82, 21.42],
    modernCountry: 'Saudi Arabia',
    summary:
      'Birthplace of the Prophet Muhammad and spiritual heart of the Rashidun, Umayyad, Abbasid, and Ottoman Caliphates as well as modern Saudi Arabia.',
    keywords: ['mecca', 'makkah', 'medina', 'madinah', 'hejaz', 'kaaba', 'saudi arabia']
  },
  {
    id: 'city_athens',
    name: 'Athens',
    subtitle: 'Cradle of Classical Democracy & Philosophy',
    year: -440,
    lonLat: [23.72, 37.98],
    modernCountry: 'Greece',
    summary:
      'Leading polis of Classical Greece under Pericles; home of the Parthenon, Socrates, Plato, Aristotle, and the Delian League.',
    keywords: ['athens', 'acropolis', 'parthenon', 'pericles', 'democracy', 'greece']
  },
  {
    id: 'city_sparta',
    name: 'Sparta (Lacedaemon)',
    subtitle: 'Peloponnesian Military Hegemon of Classical Greece',
    year: -480,
    lonLat: [22.43, 37.07],
    modernCountry: 'Greece',
    summary:
      'Renowned warrior city-state of the Peloponnese that led the Greek land defense at Thermopylae and defeated Athens in the Peloponnesian War (404 BCE).',
    keywords: ['sparta', 'lacedaemon', 'peloponnesian war', 'leonidas', 'agoge', 'greece']
  },
  {
    id: 'city_persepolis',
    name: 'Persepolis (Takht-e Jamshid)',
    subtitle: 'Ceremonial Capital of the Achaemenid Persian Empire',
    year: -500,
    lonLat: [52.89, 29.93],
    modernCountry: 'Iran',
    summary:
      'Built by Darius I and Xerxes I as the monumental ceremonial palace complex of the First Persian Empire.',
    keywords: ['persepolis', 'darius', 'xerxes', 'persia', 'iran']
  },
  {
    id: 'city_mohenjo_daro_taxila',
    name: 'Mohenjo-daro, Harappa & Taxila',
    subtitle: 'Ancient Indus Valley & Gandharan Metropolises',
    year: -2400,
    lonLat: [68.13, 27.32],
    modernCountry: 'Pakistan',
    summary:
      'Cradle of urban planning, municipal sanitation, and ancient higher learning along the Indus basin in modern-day Pakistan.',
    keywords: ['mohenjo-daro', 'mohenjodaro', 'harappa', 'taxila', 'indus valley', 'gandhara', 'pakistan']
  },
  {
    id: 'city_lahore_islamabad_karachi',
    name: 'Islamabad, Lahore & Karachi',
    subtitle: 'Federal Capital, Cultural Heart & Maritime Hub of Pakistan',
    year: 1960,
    lonLat: [73.04, 33.68],
    modernCountry: 'Pakistan',
    summary:
      'Islamabad was founded in 1960 as Pakistan’s modern planned capital alongside historic Mughal/Sikh Lahore and the financial port metropolis of Karachi.',
    keywords: ['islamabad', 'lahore', 'karachi', 'rawalpindi', 'peshawar', 'multan', 'pakistan']
  },
  {
    id: 'city_tenochtitlan',
    name: 'Tenochtitlan / Mexico City',
    subtitle: 'Island Capital of the Aztec Empire & Modern Mexico',
    year: 1500,
    lonLat: [-99.13, 19.43],
    modernCountry: 'Mexico',
    summary:
      'Built on an island in Lake Texcoco with causeways, aqueducts, and chinampa floating gardens; one of the largest cities in the world in 1500 CE.',
    keywords: ['tenochtitlan', 'mexico city', 'aztec', 'lake texcoco', 'mexico']
  },
  {
    id: 'city_cusco',
    name: 'Cusco & Machu Picchu',
    subtitle: 'Imperial Capital & Royal Citadel of the Inca Empire (Tawantinsuyu)',
    year: 1480,
    lonLat: [-71.96, -13.53],
    modernCountry: 'Peru',
    summary:
      'High-altitude Andean capital at 3,400m from which the four quarters of the Capac Ñan royal road system radiated.',
    keywords: ['cusco', 'cuzco', 'machu picchu', 'inca', 'tawantinsuyu', 'peru']
  },
  {
    id: 'city_venice',
    name: 'Venice (La Serenissima)',
    subtitle: 'Mediterranean Maritime Republic & Renaissance Hub',
    year: 1450,
    lonLat: [12.31, 45.44],
    modernCountry: 'Italy',
    summary:
      'Sovereign lagoon republic that dominated Mediterranean commerce, naval shipbuilding (the Venetian Arsenal), and spice imports into Europe.',
    keywords: ['venice', 'maritime republic', 'renaissance', 'adriatic', 'italy']
  },
  {
    id: 'city_florence',
    name: 'Florence (Republic of Florence)',
    subtitle: 'Cradle of the Italian Renaissance & Medici Seat',
    year: 1490,
    lonLat: [11.25, 43.77],
    modernCountry: 'Italy',
    summary:
      'Birthplace of the Italian Renaissance under Lorenzo de’ Medici, home to Leonardo da Vinci, Michelangelo, Machiavelli, Brunelleschi, and Galileo.',
    keywords: ['florence', 'firenze', 'medici', 'renaissance', 'leonardo da vinci', 'michelangelo', 'italy']
  },
  {
    id: 'city_paris',
    name: 'Paris',
    subtitle: 'Capital of France & Center of the Enlightenment',
    year: 1789,
    lonLat: [2.35, 48.85],
    modernCountry: 'France',
    summary:
      'Epicenter of the Enlightenment, the French Revolution of 1789, the Napoleonic Empire, and modern European diplomacy.',
    keywords: ['paris', 'france', 'french revolution', 'versailles']
  },
  {
    id: 'city_london',
    name: 'London',
    subtitle: 'Capital of the United Kingdom & Former British Empire',
    year: 1910,
    lonLat: [-0.12, 51.5],
    modernCountry: 'United Kingdom',
    summary:
      'Global financial, maritime, and political capital on the River Thames; world’s largest city in 1910.',
    keywords: ['london', 'britain', 'uk', 'england', 'thames']
  },
  {
    id: 'city_berlin',
    name: 'Berlin',
    subtitle: 'Capital of Germany, Prussia & the 1910 Deutsches Reich',
    year: 1910,
    lonLat: [13.4, 52.52],
    modernCountry: 'Germany',
    summary:
      'Capital of the Kingdom of Prussia, the 1871–1918 German Empire, Cold War division (Berlin Wall), and reunified modern Germany.',
    keywords: ['berlin', 'germany', 'prussia', 'cold war', 'berlin wall']
  },
  {
    id: 'city_vienna',
    name: 'Vienna (Wien)',
    subtitle: 'Imperial Habsburg Capital & Congress of Vienna Seat',
    year: 1910,
    lonLat: [16.37, 48.2],
    modernCountry: 'Austria',
    summary:
      'Seat of the House of Habsburg, the Holy Roman Empire, the 1815 Congress of Vienna, and the Austro-Hungarian Dual Monarchy.',
    keywords: ['vienna', 'wien', 'habsburg', 'austria', 'austro-hungarian']
  },
  {
    id: 'city_prague',
    name: 'Prague (Praha)',
    subtitle: 'Capital of the Kingdom of Bohemia & Modern Czechia',
    year: 1355,
    lonLat: [14.43, 50.07],
    modernCountry: 'Czechia',
    summary:
      'Imperial seat of Holy Roman Emperor Charles IV and Rudolf II, famed for Charles Bridge, Prague Castle, and the oldest university in Central Europe (1348).',
    keywords: ['prague', 'praha', 'bohemia', 'charles iv', 'czechia', 'czech republic']
  },
  {
    id: 'city_st_petersburg',
    name: 'Saint Petersburg (Petrograd)',
    subtitle: 'Imperial Capital of Tsarist Russia (1712–1918)',
    year: 1910,
    lonLat: [30.33, 59.93],
    modernCountry: 'Russia',
    summary:
      'Founded by Peter the Great in 1703 on the Baltic Neva delta as Russia’s imperial "Window to Europe."',
    keywords: ['saint petersburg', 'st petersburg', 'petrograd', 'leningrad', 'winter palace', 'russia']
  },
  {
    id: 'city_beijing',
    name: 'Beijing (Peking)',
    subtitle: 'Capital of Modern China & the Yuan, Ming, and Qing Dynasties',
    year: 1750,
    lonLat: [116.4, 39.9],
    modernCountry: 'China',
    summary:
      'Imperial seat of the Forbidden City and modern capital of the People’s Republic of China.',
    keywords: ['beijing', 'peking', 'forbidden city', 'ming', 'qing', 'china']
  },
  {
    id: 'city_tokyo',
    name: 'Tokyo (Edo)',
    subtitle: 'Capital of Modern Japan & the Tokugawa Shogunate',
    year: 1910,
    lonLat: [139.69, 35.68],
    modernCountry: 'Japan',
    summary:
      'Grew from the shogunal seat of Edo into the imperial capital of Meiji and modern Japan.',
    keywords: ['tokyo', 'edo', 'meiji', 'japan']
  },
  {
    id: 'city_washington',
    name: 'Washington, D.C. & New York',
    subtitle: 'Federal Capital & Financial Hub of the United States',
    year: 2026,
    lonLat: [-77.03, 38.9],
    modernCountry: 'United States of America',
    summary:
      'Political and diplomatic center of the United States of America.',
    keywords: ['washington', 'new york', 'usa', 'united states', 'america']
  }
];

// ============================================================================
// 3. CURATED HISTORICAL EMPIRES, KINGDOMS & PRINCIPALITIES
// ============================================================================
const RAW_EMPIRES: Array<{
  id: string;
  name: string;
  subtitle: string;
  year: number;
  lonLat: [number, number];
  modernCountry: string;
  summary: string;
  keywords: string[];
}> = [
  {
    id: 'emp_wallachia',
    name: 'Principality of Wallachia (Țara Românească)',
    subtitle: 'Sovereign Danubian Principality under Voivode Vlad III (1330–1859 CE)',
    year: 1462,
    lonLat: [25.45, 44.92], // Târgoviște / Bucharest
    modernCountry: 'Romania',
    summary:
      'Founded in 1330 by Voivode Basarab I at the Battle of Posada between the Southern Carpathians and the Danube; defended by Mircea the Elder, Vlad III the Impaler (1456–1462), and Michael the Brave from Târgoviște and Bucharest before uniting with Moldavia in 1859 to form Romania.',
    keywords: [
      'wallachia',
      'walllachia',
      'walachia',
      'valachia',
      'principality of wallachia',
      'tara romaneasca',
      'muntenia',
      'oltenia',
      'targoviste',
      'curtea de arges',
      'bucharest',
      'vlad the impaler',
      'vlad tepes',
      'dracula',
      'basarab',
      'mircea the elder',
      'michael the brave',
      'voivode',
      'romania',
      'danubian principalities'
    ]
  },
  {
    id: 'emp_moldavia',
    name: 'Principality of Moldavia',
    subtitle: 'Carpathian-Danubian Principality under Stephen the Great (1359–1859 CE)',
    year: 1475,
    lonLat: [26.25, 47.65], // Suceava / Iași
    modernCountry: 'Romania',
    summary:
      'Founded in 1359 by Bogdan I between the Eastern Carpathians and the Dniester River; reached its military and cultural zenith under Voivode Stephen the Great (r. 1457–1504) before uniting with Wallachia in 1859.',
    keywords: [
      'moldavia',
      'principality of moldavia',
      'stephen the great',
      'stefan cel mare',
      'suceava',
      'iasi',
      'vaslui',
      'putna',
      'romania',
      'moldova'
    ]
  },
  {
    id: 'emp_transylvania',
    name: 'Principality of Transylvania',
    subtitle: 'Carpathian Realm & Seat of the 1600 and 1918 Romanian Unions',
    year: 1600,
    lonLat: [23.58, 46.07], // Alba Iulia / Brașov
    modernCountry: 'Romania',
    summary:
      'Historic Carpathian principality centered at Alba Iulia, Cluj, Sibiu, and Brașov; united with Wallachia and Moldavia under Michael the Brave in 1600 and permanently joined the Kingdom of Romania on December 1, 1918.',
    keywords: [
      'transylvania',
      'principality of transylvania',
      'ardeal',
      'siebenburgen',
      'alba iulia',
      'brasov',
      'bran castle',
      'sibiu',
      'cluj',
      'michael the brave',
      'john hunyadi',
      'romania'
    ]
  },
  {
    id: 'emp_dacia',
    name: 'Kingdom of Dacia',
    subtitle: 'Ancient Carpathian-Danubian Kingdom of Burebista & Decebalus (82 BCE – 106 CE)',
    year: 100,
    lonLat: [23.3, 45.62], // Sarmizegetusa Regia
    modernCountry: 'Romania',
    summary:
      'Ancient Geto-Dacian kingdom centered at Sarmizegetusa Regia in the Orăștie Mountains that fought two major wars against Roman Emperor Trajan (101–106 CE).',
    keywords: ['dacia', 'dacian kingdom', 'decebalus', 'burebista', 'sarmizegetusa', 'trajan', 'romania']
  },
  {
    id: 'emp_roman',
    name: 'Roman Empire (Imperium Romanum)',
    subtitle: 'Pax Romana at Maximal Territorial Extent (117 CE)',
    year: 117,
    lonLat: [12.49, 41.89],
    modernCountry: 'Italy',
    summary:
      'Encompassed the entire Mediterranean basin (Mare Nostrum), Western Europe, Britain, Anatolia, the Levant, and North Africa.',
    keywords: ['roman empire', 'rome', 'pax romana', 'trajan', 'antiquity', 'imperium romanum']
  },
  {
    id: 'emp_byzantine',
    name: 'Byzantine Empire (Eastern Roman Empire)',
    subtitle: 'Millennium-Long Christian Roman Imperium Centered at Constantinople (330–1453 CE)',
    year: 555,
    lonLat: [28.97, 41.0],
    modernCountry: 'Turkey',
    summary:
      'Continuation of the Roman Empire in the East from Constantinople for over 1,100 years under Constantine, Justinian I, Basil II, and the Komnenian and Palaiologan dynasties.',
    keywords: ['byzantine empire', 'byzantium', 'eastern roman empire', 'constantinople', 'justinian', 'basil ii', 'hagia sophia']
  },
  {
    id: 'emp_ottoman',
    name: 'Ottoman Empire (Sublime Ottoman State)',
    subtitle: 'Tri-Continental Imperial Realm (1550 CE)',
    year: 1550,
    lonLat: [28.97, 41.0],
    modernCountry: 'Turkey',
    summary:
      'Ruled Southeast Europe, Western Asia, and North Africa from Constantinople for over six centuries.',
    keywords: ['ottoman empire', 'osmanisches reich', 'sublime porte', 'turkey', 'sultan', 'suleiman', 'mehmed']
  },
  {
    id: 'emp_mongol',
    name: 'Mongol Empire (Yeke Mongghul Ulus)',
    subtitle: 'Largest Contiguous Land Empire in History (1260 CE)',
    year: 1260,
    lonLat: [102.84, 47.19],
    modernCountry: 'Mongolia',
    summary:
      'Stretched from the Sea of Japan to Central Europe and the Persian Gulf, uniting the Silk Road under the Pax Mongolica.',
    keywords: ['mongol empire', 'golden horde', 'ilkhanate', 'yuan', 'chagatai', 'genghis khan']
  },
  {
    id: 'emp_golden_horde',
    name: 'Golden Horde (Ulus of Jochi)',
    subtitle: 'Northwestern Khanate of the Mongol Empire across the Pontic-Caspian Steppe (1315 CE)',
    year: 1315,
    lonLat: [47.38, 47.18], // Sarai on the Lower Volga
    modernCountry: 'Russia',
    summary:
      'Established by Batu Khan (grandson of Genghis Khan) in the 1240s, ruling the Eurasian steppe and exacting tribute from the Russian principalities for over two centuries from Sarai.',
    keywords: ['golden horde', 'kipchak khanate', 'batu khan', 'ozbeg khan', 'sarai', 'volga', 'tartary', 'mongol']
  },
  {
    id: 'emp_timurid',
    name: 'Timurid Empire',
    subtitle: 'Central Asian & Persian Renaissance Imperium Centered at Samarkand (1400 CE)',
    year: 1400,
    lonLat: [66.97, 39.65],
    modernCountry: 'Uzbekistan',
    summary:
      'Founded by Amir Timur (Tamerlane) with capitals at Samarkand and Herat, fostering the Timurid Renaissance in architecture, miniature painting, and astronomy.',
    keywords: ['timurid empire', 'timur', 'tamerlane', 'samarkand', 'herat', 'ulugh beg', 'uzbekistan']
  },
  {
    id: 'emp_mughal',
    name: 'Mughal Empire (Hindustan)',
    subtitle: 'Early Modern South Asian Gunpowder Superpower (1526–1857 CE)',
    year: 1650,
    lonLat: [78.04, 27.17],
    modernCountry: 'India',
    summary:
      'Founded by Babur in 1526 and ruled by Akbar, Jahangir, Shah Jahan, and Aurangzeb across India, Pakistan, and Bangladesh, generating a quarter of world GDP and building the Taj Mahal and Lahore Fort.',
    keywords: ['mughal empire', 'mogul empire', 'babur', 'akbar', 'shah jahan', 'aurangzeb', 'taj mahal', 'hindustan', 'india', 'pakistan']
  },
  {
    id: 'emp_maratha',
    name: 'Maratha Confederacy (Maratha Empire)',
    subtitle: 'Dominant 18th-Century South Asian Power Founded by Shivaji (1758 CE)',
    year: 1758,
    lonLat: [73.85, 18.52], // Pune
    modernCountry: 'India',
    summary:
      'Founded by Chhatrapati Shivaji Maharaj in 1674 and expanded under the Peshwas from Pune across the Deccan and northern India to Peshawar in the 18th century.',
    keywords: ['maratha empire', 'maratha confederacy', 'shivaji', 'peshwa', 'bajirao', 'pune', 'india']
  },
  {
    id: 'emp_vijayanagara',
    name: 'Vijayanagara Empire & Chola Dynasty',
    subtitle: 'Great Classical & Medieval Empires of Southern India (1520 CE)',
    year: 1520,
    lonLat: [76.46, 15.33], // Hampi
    modernCountry: 'India',
    summary:
      'Centered at the monumental stone metropolis of Hampi under Emperor Krishnadevaraya, succeeding the maritime Chola Empire of southern India.',
    keywords: ['vijayanagara', 'hampi', 'krishnadevaraya', 'chola dynasty', 'rajaraja chola', 'south india', 'india']
  },
  {
    id: 'emp_maurya_gupta',
    name: 'Maurya & Gupta Empires',
    subtitle: 'Classical Pan-Indian Empires of Chandragupta, Ashoka & Samudragupta (260 BCE)',
    year: -260,
    lonLat: [85.13, 25.59], // Pataliputra
    modernCountry: 'India',
    summary:
      'First unified imperial states of the Indian subcontinent centered at Pataliputra, pioneering Buddhist statecraft under Ashoka and Classical Sanskrit science and mathematics under the Guptas.',
    keywords: ['maurya empire', 'gupta empire', 'chandragupta', 'ashoka', 'chanakya', 'aryabhata', 'pataliputra', 'india']
  },
  {
    id: 'emp_indus_gandhara',
    name: 'Indus Valley Civilization & Kingdom of Gandhara',
    subtitle: 'Bronze Age Urban Cradle (Harappa & Mohenjo-daro) & Greco-Buddhist Heartland',
    year: -2400,
    lonLat: [68.13, 27.32],
    modernCountry: 'Pakistan',
    summary:
      'One of the world’s earliest urban civilizations along the Indus River in modern Pakistan, followed in antiquity by the scholarly and artistic realm of Gandhara and Taxila.',
    keywords: ['indus valley civilization', 'harappan', 'mohenjo-daro', 'harappa', 'gandhara', 'taxila', 'kushan', 'pakistan']
  },
  {
    id: 'emp_sikh',
    name: 'Sikh Empire (Sarkar-i-Khalsa)',
    subtitle: 'Sovereign Punjabi Realm of Maharaja Ranjit Singh (1799–1849 CE)',
    year: 1825,
    lonLat: [74.35, 31.52], // Lahore
    modernCountry: 'Pakistan',
    summary:
      'Powerful secular kingdom centered in Lahore under Maharaja Ranjit Singh spanning the Punjab, Kashmir, Multan, and Peshawar.',
    keywords: ['sikh empire', 'ranjit singh', 'lahore', 'punjab', 'khalsa', 'pakistan', 'india']
  },
  {
    id: 'emp_1910_russia',
    name: 'Kaiserreich Russland (Russian Empire 1910)',
    subtitle: 'Imperial Romanov Realm across Eurasia (1910 Map)',
    year: 1910,
    lonLat: [37.61, 55.75],
    modernCountry: 'Russia',
    summary:
      'Spanning Eastern Europe, Finland, Poland, the Caucasus, Central Asia, and Siberia with 160.7 million subjects in 1910.',
    keywords: ['russian empire', 'kaiserreich russland', '1910', 'tsarist russia', 'romanov']
  },
  {
    id: 'emp_kievan_rus',
    name: 'Kievan Rus’ & Grand Duchy of Moscow',
    subtitle: 'Medieval East Slavic Federation Centered at Kyiv & Novgorod (1050 CE)',
    year: 1050,
    lonLat: [30.52, 50.45], // Kyiv
    modernCountry: 'Ukraine',
    summary:
      'Medieval federation ruled by the Rurikid dynasty under Vladimir the Great and Yaroslav the Wise along the Dnieper trade route.',
    keywords: ['kievan rus', 'kyivan rus', 'rurik', 'vladimir the great', 'yaroslav the wise', 'kyiv', 'novgorod', 'ukraine', 'russia']
  },
  {
    id: 'emp_1910_germany',
    name: 'Deutsches Reich (German Empire 1910) & Kingdom of Prussia',
    subtitle: 'Imperial Hohenzollern Realm (1871–1918 CE)',
    year: 1910,
    lonLat: [13.4, 52.52],
    modernCountry: 'Germany',
    summary:
      'Continental industrial and scientific superpower forged by Otto von Bismarck around the Kingdom of Prussia.',
    keywords: ['german empire', 'deutsches reich', 'prussia', 'kingdom of prussia', '1910', 'kaiser', 'hohenzollern']
  },
  {
    id: 'emp_holy_roman',
    name: 'Holy Roman Empire (Sacrum Imperium Romanum)',
    subtitle: 'Central European Imperial Confederation (962–1806 CE)',
    year: 1520,
    lonLat: [11.07, 49.45], // Nuremberg / Frankfurt / Vienna
    modernCountry: 'Germany',
    summary:
      'Multi-ethnic Central European realm of kingdoms, duchies, prince-bishoprics, and Free Imperial Cities founded by Otto I in 962 CE and ruled by the Hohenstaufen, Luxemburg, and Habsburg dynasties.',
    keywords: ['holy roman empire', 'hre', 'otto the great', 'frederick barbarossa', 'charles v', 'habsburg', 'germany', 'austria']
  },
  {
    id: 'emp_1910_austria',
    name: 'Austro-Hungarian Empire (K. u. K. Doppelmonarchie)',
    subtitle: 'Habsburg Dual Monarchy in Central Europe (1910 Map)',
    year: 1910,
    lonLat: [16.37, 48.2],
    modernCountry: 'Austria',
    summary:
      'Multi-ethnic Central European empire uniting Austria, Hungary, Bohemia, Croatia, and Bosnia with 51.3 million citizens in 1910.',
    keywords: ['austria-hungary', 'austro-hungarian', 'doppelmonarchie', 'habsburg', '1910', 'franz joseph']
  },
  {
    id: 'emp_polish_lithuanian',
    name: 'Polish-Lithuanian Commonwealth',
    subtitle: 'Elective Parliamentary Monarchy of Central & Eastern Europe (1600 CE)',
    year: 1600,
    lonLat: [21.01, 52.22], // Warsaw / Kraków
    modernCountry: 'Poland',
    summary:
      'Bi-confederal state of the Kingdom of Poland and Grand Duchy of Lithuania famed for the Sejm parliament, Winged Hussars, and the May 3, 1791 Constitution.',
    keywords: ['polish-lithuanian commonwealth', 'jagiellon', 'grand duchy of lithuania', 'winged hussars', 'poland', 'lithuania']
  },
  {
    id: 'emp_british',
    name: 'British Empire & British Raj',
    subtitle: 'Global Maritime & Colonial Empire (1910 CE)',
    year: 1910,
    lonLat: [-0.12, 51.5],
    modernCountry: 'United Kingdom',
    summary:
      'Largest empire in history, spanning the United Kingdom, Canada, Australia, the Indian Raj, and extensive African and maritime territories.',
    keywords: ['british empire', 'great britain', 'british raj', 'east india company', '1910', 'commonwealth']
  },
  {
    id: 'emp_spanish_portuguese',
    name: 'Spanish Empire & Portuguese Maritime Empire',
    subtitle: 'First Global Iberian Maritime Empires of the Age of Discovery (1580 CE)',
    year: 1580,
    lonLat: [-3.7, 40.41],
    modernCountry: 'Spain',
    summary:
      'Pioneered transoceanic navigation, the Treaty of Tordesillas, viceroyalties across the Americas, and global trade from Lisbon, Seville, and Madrid to Manila and Goa.',
    keywords: ['spanish empire', 'portuguese empire', 'conquistadors', 'new spain', 'castile', 'aragon', 'spain', 'portugal']
  },
  {
    id: 'emp_persian',
    name: 'Achaemenid, Sasanian & Safavid Persian Empires',
    subtitle: 'Imperial Iranian Dynasties of Persepolis, Ctesiphon & Isfahan (500 BCE)',
    year: -500,
    lonLat: [52.89, 29.93],
    modernCountry: 'Iran',
    summary:
      'Stretched from the Balkans and Egypt to the Indus Valley under Cyrus and Darius, later revived under the Parthians, Sasanians, and Safavids (Shah Abbas I).',
    keywords: ['persian empire', 'achaemenid', 'sasanian', 'sassanid', 'parthian', 'safavid', 'persepolis', 'iran', 'royal road']
  },
  {
    id: 'emp_caliphates',
    name: 'Rashidun, Umayyad & Abbasid Caliphates',
    subtitle: 'Classical Islamic Empires of Medina, Damascus, Baghdad & Córdoba (750 CE)',
    year: 750,
    lonLat: [44.36, 33.31],
    modernCountry: 'Iraq',
    summary:
      'Stretched from Al-Andalus (Spain) and Morocco across North Africa and the Middle East to Central Asia and Sindh, fostering the Islamic Golden Age of science, medicine, and algebra.',
    keywords: ['umayyad caliphate', 'abbasid caliphate', 'rashidun caliphate', 'fatimid', 'ayyubid', 'mamluk', 'al-andalus', 'caliphate']
  },
  {
    id: 'emp_ancient_egypt',
    name: 'Ancient Egypt (Old, Middle & New Kingdoms)',
    subtitle: 'Pharaonic Nile Civilization (2500 BCE – 1250 BCE)',
    year: -2500,
    lonLat: [31.23, 30.04],
    modernCountry: 'Egypt',
    summary:
      'Monumental civilization along the Nile Valley that constructed the Great Pyramids of Giza and the temples of Karnak and Luxor.',
    keywords: ['ancient egypt', 'pyramids', 'pharaoh', 'nile', 'old kingdom', 'new kingdom', '3000 bce']
  },
  {
    id: 'emp_mesopotamia',
    name: 'Sumer, Akkadian, Babylonian & Assyrian Empires',
    subtitle: 'Cradle of Civilization in Mesopotamia (Tigris & Euphrates)',
    year: -1750,
    lonLat: [44.42, 32.54],
    modernCountry: 'Iraq',
    summary:
      'Pioneered cuneiform writing, the wheel, ziggurats, codified law (Ur-Nammu and Hammurabi), and astronomy across Ur, Uruk, Akkad, Babylon, and Nineveh.',
    keywords: ['sumer', 'sumerian', 'akkadian', 'babylonian empire', 'assyrian empire', 'mesopotamia', 'ur', 'uruk', 'nineveh', 'iraq']
  },
  {
    id: 'emp_african_kingdoms',
    name: 'Kingdom of Aksum, Ethiopian Empire, Mali & Songhai',
    subtitle: 'Great Sovereign Civilizations of Sub-Saharan & East/West Africa',
    year: 1350,
    lonLat: [38.74, 9.03],
    modernCountry: 'Ethiopia',
    summary:
      'From the obelisks of Aksum and rock-hewn churches of Lalibela in Ethiopia to the gold empires of Ghana, Mali, Songhai, Benin, and Great Zimbabwe.',
    keywords: ['aksum', 'axum', 'abyssinia', 'ethiopian empire', 'mali empire', 'songhai empire', 'great zimbabwe', 'kingdom of kush', 'nubia']
  },
  {
    id: 'emp_aztec_inca_maya',
    name: 'Maya Civilization, Aztec Empire & Inca Empire',
    subtitle: 'Great Pre-Columbian Civilizations of Mesoamerica & the Andes',
    year: 1480,
    lonLat: [-88.56, 20.68], // Chichen Itza / Tenochtitlan
    modernCountry: 'Mexico',
    summary:
      'Monumental pyramid-building, astronomical, and road-engineering civilizations of the Americas centered at Tikal, Chichen Itza, Tenochtitlan, and Cusco.',
    keywords: ['maya', 'mayan civilization', 'aztec empire', 'inca empire', 'tawantinsuyu', 'chichen itza', 'tikal', 'mexico', 'guatemala', 'peru']
  },
  {
    id: 'emp_soviet',
    name: 'Soviet Union (USSR)',
    subtitle: 'Cold War Superpower & Warsaw Pact Leader (1962 CE)',
    year: 1962,
    lonLat: [37.61, 55.75],
    modernCountry: 'Russia',
    summary:
      'Union of 15 Soviet Socialist Republics spanning Eurasia during the Cold War and Space Race.',
    keywords: ['soviet union', 'ussr', 'cold war', 'cccp', 'moscow']
  }
];

// ============================================================================
// BUILD UNIFIED SEARCH INDEX
// ============================================================================
export const HISTORICAL_SEARCH_INDEX: HistoricalSearchItem[] = [
  // 1. Historical Figures
  ...RAW_FIGURES.map((f): HistoricalSearchItem => ({
    id: f.id,
    title: f.name,
    subtitle: `${f.role} · ${formatYear(f.year)}`,
    category: 'figure',
    year: f.year,
    yearDisplay: formatYear(f.year),
    svgCoords: projectCoordinates(f.lonLat[0], f.lonLat[1]),
    zoomScale: 2.6,
    modernCountry: f.modernCountry,
    summary: f.summary,
    keywords: [f.name.toLowerCase(), f.role.toLowerCase(), f.modernCountry.toLowerCase(), ...f.keywords]
  })),

  // 2. Historical & Modern Cities
  ...RAW_CITIES.map((c): HistoricalSearchItem => ({
    id: c.id,
    title: c.name,
    subtitle: `${c.subtitle} (${formatYear(c.year)})`,
    category: 'city',
    year: c.year,
    yearDisplay: formatYear(c.year),
    svgCoords: projectCoordinates(c.lonLat[0], c.lonLat[1]),
    zoomScale: 2.8,
    modernCountry: c.modernCountry,
    summary: c.summary,
    keywords: [c.name.toLowerCase(), c.subtitle.toLowerCase(), c.modernCountry.toLowerCase(), ...c.keywords]
  })),

  // 3. Historical Empires, Kingdoms & Principalities
  ...RAW_EMPIRES.map((e): HistoricalSearchItem => ({
    id: e.id,
    title: e.name,
    subtitle: e.subtitle,
    category: 'empire',
    year: e.year,
    yearDisplay: formatYear(e.year),
    svgCoords: projectCoordinates(e.lonLat[0], e.lonLat[1]),
    zoomScale: 2.2,
    modernCountry: e.modernCountry,
    summary: e.summary,
    keywords: [e.name.toLowerCase(), e.subtitle.toLowerCase(), e.modernCountry.toLowerCase(), ...e.keywords]
  })),

  // 4. All 177 World Territories & Sovereign Countries (Modern 2026 + Historical Era Aliases)
  ...WORLD_COUNTRIES.map((country): HistoricalSearchItem => {
    const profile2026 = getCountryEraData(country.name, 2026);
    const profile1462 = getCountryEraData(country.name, 1462);
    const profile117 = getCountryEraData(country.name, 117);
    const isGreenland = country.name === 'Greenland';
    return {
      id: `country_search_${country.id}`,
      title: isGreenland ? 'Greenland (Kingdom of Denmark)' : country.name,
      subtitle: isGreenland
        ? 'Autonomous Territory of the Kingdom of Denmark · Capital: Nuuk'
        : `Sovereign Country · Capital: ${profile2026.capital || 'National Capital'}`,
      category: 'country',
      year: 2026,
      yearDisplay: '2026 CE',
      svgCoords: country.centroid,
      zoomScale: 2.4,
      modernCountry: country.name,
      summary: profile2026.description,
      keywords: isGreenland
        ? [
            'greenland',
            'kalaallit nunaat',
            'nuuk',
            'denmark',
            'kingdom of denmark',
            'arctic',
            'autonomous territory'
          ]
        : [
            country.name.toLowerCase(),
            (profile2026.capital || '').toLowerCase(),
            (profile2026.ruler || '').toLowerCase(),
            (profile1462.entityName || '').toLowerCase(),
            (profile117.entityName || '').toLowerCase(),
            'country',
            'modern'
          ]
    };
  }),

  // 5. Conflict Zones & Disputed Hotspots
  ...CONFLICT_ZONES.map((cz): HistoricalSearchItem => ({
    id: `conflict_search_${cz.id}`,
    title: cz.name,
    subtitle: `${cz.type === 'active_war' ? 'Active War Zone' : 'Disputed Area'} · ${cz.region}`,
    category: 'conflict',
    year: 2026,
    yearDisplay: '2026 CE',
    svgCoords: cz.center,
    zoomScale: 2.8,
    modernCountry: cz.region,
    summary: cz.summary,
    conflictId: cz.id,
    keywords: [
      cz.name.toLowerCase(),
      cz.region.toLowerCase(),
      ...cz.combatantsOrClaimants.map((c) => c.toLowerCase()),
      'war',
      'conflict',
      'dispute'
    ]
  })),

  // 6. Archaeological Sites & Historical Ruins
  ...ARCHAEOLOGICAL_SITES.map((site): HistoricalSearchItem => ({
    id: `arch_search_${site.id}`,
    title: site.name,
    subtitle: `${site.siteType} · ${site.civilization} (${site.foundedDisplay})`,
    category: 'city',
    year: site.foundedYear,
    yearDisplay: formatYear(site.foundedYear),
    svgCoords: site.svgCoords,
    zoomScale: 2.9,
    modernCountry: site.modernCountry,
    summary: site.generalOverview,
    keywords: [
      site.name.toLowerCase(),
      site.shortLabel.toLowerCase(),
      site.civilization.toLowerCase(),
      site.modernCountry.toLowerCase(),
      site.region.toLowerCase(),
      site.siteType.toLowerCase()
    ]
  }))
];

// ============================================================================
// TYPO-TOLERANT FUZZY SEARCH ENGINE & FICTIONAL/IRRELEVANT FILTER
// ============================================================================
const GENERIC_KEYWORDS = new Set([
  'country',
  'modern',
  'war',
  'wars',
  'conflict',
  'dispute',
  'empire',
  'kingdom',
  'principality',
  'republic',
  'state',
  'city',
  'capital',
  'king',
  'queen',
  'emperor',
  'prince',
  'princess',
  'lord',
  'general',
  'leader',
  'ruler',
  'dynasty',
  'sultan',
  'caliph',
  'ancient',
  'medieval',
  'classical',
  'sovereign',
  'autonomous',
  'territory',
  'island',
  'ocean',
  'sea',
  'river',
  'mountain',
  'north',
  'south',
  'east',
  'west',
  'central',
  'new',
  'old',
  'great',
  'first',
  'second',
  'third',
  'world',
  'national',
  'seat',
  'power',
  'center',
  'hub',
  'zone',
  'area',
  'region',
  'historical',
  'figure',
  'polity',
  'realm',
  'the',
  'and',
  'for',
  'of',
  'in',
  'to'
]);

/**
 * Known fictional characters, fictional/mythological places, pop-culture franchises,
 * everyday objects, foods, games, and non-historical queries that must be rejected.
 */
const FICTIONAL_OR_IRRELEVANT_PHRASES = new Set([
  // Fictional Places & Realms
  'wakanda',
  'gotham',
  'gotham city',
  'metropolis',
  'hogwarts',
  'hogsmeade',
  'diagon alley',
  'azkaban',
  'mordor',
  'gondor',
  'rohan',
  'rivendell',
  'shire',
  'middle earth',
  'middle-earth',
  'isengard',
  'minas tirith',
  'numenor',
  'valinor',
  'westeros',
  'essos',
  'kings landing',
  'king s landing',
  'winterfell',
  'dragonstone',
  'braavos',
  'valyria',
  'narnia',
  'cair paravel',
  'bikini bottom',
  'neverland',
  'wonderland',
  'oz',
  'emerald city',
  'atlantis',
  'el dorado',
  'eldorado',
  'shangri la',
  'shangri-la',
  'shambhala',
  'camelot',
  'avalon',
  'asgard',
  'midgard',
  'jotunheim',
  'krypton',
  'smallville',
  'themyscira',
  'star city',
  'central city',
  'bludhaven',
  'arkham',
  'latveria',
  'genosha',
  'madripoor',
  'sokovia',
  'symkaria',
  'kamar taj',
  'knowhere',
  'xandar',
  'titan',
  'tatooine',
  'coruscant',
  'naboo',
  'alderaan',
  'mandalore',
  'hoth',
  'endor',
  'dagobah',
  'mustafar',
  'jakku',
  'kaminoa',
  'death star',
  'pandora',
  'arrakis',
  'caladan',
  'giedi prime',
  'cybertron',
  'gallifrey',
  'vulcan',
  'romulus planet',
  'hyrule',
  'mushroom kingdom',
  'kanto',
  'johto',
  'hoenn',
  'sinnoh',
  'unova',
  'kalos',
  'alola',
  'galar',
  'paldea',
  'konoha',
  'hidden leaf',
  'hidden leaf village',
  'soul society',
  'grand line',
  'wano',
  'alabasta',
  'dressrosa',
  'marley',
  'paradis',
  'paradis island',
  'gensokyo',
  'teyvat',
  'mondstadt',
  'liyue',
  'inazuma',
  'sumeru',
  'fontaine',
  'natlan',
  'snezhnaya',
  'tamriel',
  'skyrim',
  'cyrodiil',
  'morrowind',
  'azeroth',
  'kalimdor',
  'lordaeron',
  'stormwind',
  'orgrimmar',
  'sanctuary',
  'rapture',
  'columbia bioshock',
  'city 17',
  'black mesa',
  'aperture science',
  'racoon city',
  'raccoon city',
  'silent hill',
  'vice city',
  'los santos',
  'liberty city',
  'san fierro',
  'las venturas',
  'night city',
  'revachol',
  'dunwall',
  'karnaca',
  'yharnam',
  'lordran',
  'lothric',
  'lands between',
  'limgrave',
  'caelid',
  'eyrie',
  'casterly rock',
  'highgarden',
  'dorne',
  'sunspear',
  'oldtown',
  'qarth',
  'meereen',
  'astapor',
  'yunkai',
  'pentos',
  'volantis',
  'asshai',
  'sothoryos',
  'ulthos',
  'panem',
  'district 12',
  'capitol panem',
  'gilead',
  'jurassic park',
  'isla nublar',
  'skull island',
  'gravity falls',
  'quahog',
  'south park',
  'bedrock',
  'toontown',
  'duckburg',
  'hundred acre wood',
  'whoville',
  'halloween town',
  'arendelle',
  'agrabah',
  'motunui',
  'encanto',
  'zootopia',
  'radiator springs',
  'monstropolis',
  'far far away',
  'berk',
  'laputa',

  // Fictional Characters & Superheroes
  'harry potter',
  'hermione granger',
  'ron weasley',
  'albus dumbledore',
  'dumbledore',
  'voldemort',
  'lord voldemort',
  'severus snape',
  'draco malfoy',
  'hagrid',
  'sirius black',
  'frodo',
  'frodo baggins',
  'bilbo baggins',
  'gandalf',
  'aragorn',
  'legolas',
  'gimli',
  'gollum',
  'smeagol',
  'sauron',
  'saruman',
  'galadriel',
  'elrond',
  'boromir',
  'samwise gamgee',
  'jon snow',
  'daenerys',
  'daenerys targaryen',
  'tyrion lannister',
  'cersei lannister',
  'jaime lannister',
  'tywin lannister',
  'arya stark',
  'sansa stark',
  'ned stark',
  'eddard stark',
  'robb stark',
  'bran stark',
  'night king',
  'joffrey',
  'ramsay bolton',
  'petyr baelish',
  'littlefinger',
  'luke skywalker',
  'anakin skywalker',
  'darth vader',
  'obi wan',
  'obi-wan kenobi',
  'princess leia',
  'han solo',
  'chewbacca',
  'yoda',
  'palpatine',
  'emperor palpatine',
  'darth maul',
  'kylo ren',
  'rey skywalker',
  'mandalorian',
  'din djarin',
  'grogu',
  'baby yoda',
  'boba fett',
  'ahsoka tano',
  'thrawn',
  'paul atreides',
  'muad dib',
  'leto atreides',
  'baron harkonnen',
  'chani',
  'spock',
  'captain kirk',
  'james t kirk',
  'jean luc picard',
  'doctor who',
  'dalek',
  'batman',
  'bruce wayne',
  'superman',
  'clark kent',
  'kal el',
  'wonder woman',
  'diana prince',
  'spider man',
  'spider-man',
  'spiderman',
  'peter parker',
  'miles morales',
  'iron man',
  'ironman',
  'tony stark',
  'captain america',
  'steve rogers',
  'thor odinson',
  'loki',
  'hulk',
  'bruce banner',
  'black widow',
  'natasha romanoff',
  'hawkeye',
  'black panther',
  'tchalla',
  't challa',
  'doctor strange',
  'stephen strange',
  'scarlet witch',
  'wanda maximoff',
  'vision',
  'ant man',
  'ant-man',
  'star lord',
  'star-lord',
  'groot',
  'rocket raccoon',
  'thanos',
  'ultron',
  'kang',
  'doctor doom',
  'victor von doom',
  'magneto',
  'wolverine',
  'logan',
  'deadpool',
  'wade wilson',
  'professor x',
  'charles xavier',
  'cyclops',
  'jean grey',
  'storm x men',
  'venom',
  'green goblin',
  'doctor octopus',
  'joker',
  'harley quinn',
  'lex luthor',
  'aquaman',
  'arthur curry',
  'flash',
  'barry allen',
  'green lantern',
  'hal jordan',
  'cyborg',
  'robin',
  'nightwing',
  'batgirl',
  'catwoman',
  'bane',
  'riddler',
  'penguin',
  'two face',
  'scarecrow',
  'darkseid',
  'shazam',
  'black adam',
  'watchmen',
  'rorschach',
  'doctor manhattan',
  'homelander',
  'omni man',
  'omni-man',
  'invincible',
  'hellboy',
  'spawn',
  'optimus prime',
  'megatron',
  'bumblebee',
  'godzilla',
  'king kong',
  'ghidorah',
  'mothra',
  'sherlock holmes',
  'john watson',
  'dr watson',
  'moriarty',
  'hercule poirot',
  'james bond',
  '007',
  'indiana jones',
  'jack sparrow',
  'captain jack sparrow',
  'katniss everdeen',
  'peeta mellark',
  'percy jackson',
  'harry dresden',
  'geralt',
  'geralt of rivia',
  'ciri',
  'yennefer',
  'master chief',
  'kratos',
  'solid snake',
  'big boss',
  'lara croft',
  'nathan drake',
  'arthur morgan',
  'john marston',
  'cj',
  'carl johnson',
  'trevor philips',
  'michael de santa',
  'franklin clinton',
  'niko bellic',
  'ezio auditore',
  'altair',
  'cloud strife',
  'sephiroth',
  'tifa lockhart',
  'aerith',
  'link',
  'princess zelda',
  'zelda',
  'ganondorf',
  'ganon',
  'super mario',
  'mario bros',
  'luigi',
  'princess peach',
  'bowser',
  'yoshi',
  'wario',
  'waluigi',
  'donkey kong',
  'kirby',
  'samus aran',
  'sonic',
  'sonic the hedgehog',
  'tails',
  'knuckles',
  'shadow the hedgehog',
  'eggman',
  'dr eggman',
  'mega man',
  'pac man',
  'pac-man',
  'pikachu',
  'charizard',
  'mewtwo',
  'bulbasaur',
  'squirtle',
  'eevee',
  'ash ketchum',
  'pokemon',
  'pokémon',
  'goku',
  'son goku',
  'vegeta',
  'gohan',
  'piccolo',
  'frieza',
  'cell',
  'majin buu',
  'broly',
  'beerus',
  'naruto',
  'naruto uzumaki',
  'sasuke',
  'sasuke uchiha',
  'sakura haruno',
  'kakashi',
  'itachi',
  'madara',
  'madara uchiha',
  'obito',
  'pain',
  'jiraiya',
  'tsunade',
  'orochimaru',
  'minato',
  'boruto',
  'luffy',
  'monkey d luffy',
  'roronoa zoro',
  'zoro',
  'sanji',
  'nami',
  'usopp',
  'chopper',
  'nico robin',
  'shanks',
  'whitebeard',
  'kaido',
  'ichigo',
  'ichigo kurosaki',
  'rukia',
  'aizen',
  'eren',
  'eren yeager',
  'eren jaeger',
  'mikasa',
  'mikasa ackerman',
  'levi ackerman',
  'armin',
  'light yagami',
  'ryuk',
  'saitama',
  'one punch man',
  'genos',
  'tanjiro',
  'tanjiro kamado',
  'nezuko',
  'muzan',
  'gojo',
  'satoru gojo',
  'sukuna',
  'yuji itadori',
  'megumi',
  'deku',
  'izuku midoriya',
  'all might',
  'bakugo',
  'todoroki',
  'edward elric',
  'alphonse elric',
  'roy mustang',
  'gon freecss',
  'killua',
  'hisoka',
  'kurapika',
  'guts',
  'griffith',
  'jotaro',
  'jotaro kujo',
  'dio brando',
  'giorno giovanna',
  'asta',
  'natsu dragneel',
  'kirito',
  'asuna',
  'rem',
  'subaru natsuki',
  'ainz ooal gown',
  'rimuru',
  'anya forger',
  'loid forger',
  'yor forger',
  'denji',
  'makima',
  'frieren',
  'spongebob',
  'spongebob squarepants',
  'patrick star',
  'squidward',
  'mr krabs',
  'plankton',
  'sandy cheeks',
  'homer simpson',
  'bart simpson',
  'marge simpson',
  'lisa simpson',
  'peter griffin',
  'stewie griffin',
  'brian griffin',
  'glenn quagmire',
  'eric cartman',
  'kenny mccormick',
  'stan marsh',
  'kyle broflovski',
  'rick sanchez',
  'morty smith',
  'rick and morty',
  'bender',
  'philip j fry',
  'bojack horseman',
  'bugs bunny',
  'daffy duck',
  'porky pig',
  'tweety',
  'scooby doo',
  'scooby-doo',
  'shaggy rogers',
  'tom and jerry',
  'popeye',
  'fred flintstone',
  'mickey mouse',
  'minnie mouse',
  'donald duck',
  'goofy',
  'pluto disney',
  'winnie the pooh',
  'tigger',
  'piglet',
  'eeyore',
  'simba',
  'mufasa',
  'scar lion king',
  'aladdin',
  'genie',
  'jafar',
  'ariel',
  'ursula',
  'belle',
  'cinderella',
  'snow white',
  'sleeping beauty',
  'maleficent',
  'rapunzel',
  'elsa',
  'anna frozen',
  'olaf',
  'moana',
  'maui',
  'mulan disney',
  'stitch',
  'lilo',
  'buzz lightyear',
  'woody toy story',
  'lightning mcqueen',
  'mater',
  'sulley',
  'mike wazowski',
  'mr incredible',
  'elastigirl',
  'frozone',
  'wall e',
  'wall-e',
  'remy ratatouille',
  'shrek',
  'fiona',
  'donkey shrek',
  'puss in boots',
  'po kung fu panda',
  'toothless',
  'hiccup',
  'gru',
  'minions',
  'megamind',
  'jack skellington',
  'grinch',
  'lorax',
  'cat in the hat',
  'charlie brown',
  'snoopy',
  'garfield',
  'optimus',
  'cthulhu',
  'slenderman',
  'siren head',
  'freddy fazbear',
  'springtrap',
  'huggy wuggy',
  'skibidi',
  'skibidi toilet',
  'santa claus',
  'tooth fairy',
  'easter bunny',
  'bigfoot',
  'sasquatch',
  'loch ness monster',
  'nessie',
  'chupacabra',
  'yeti',
  'unicorn',
  'mermaid',
  'leprechaun',
  'count dracula',
  'frankenstein',
  'ebenezer scrooge',
  'captain ahab',
  'moby dick',
  'don quixote',
  'hamlet',
  'macbeth',
  'romeo and juliet',
  'odysseus',
  'achilles',
  'hercules',
  'heracles',
  'thor mythology',
  'zeus',
  'poseidon',
  'hades',
  'apollo',
  'athena',
  'ares',
  'aphrodite',
  'hermes',
  'hera',
  'artemis',
  'dionysus',
  'hephaestus',
  'demeter',
  'persephone',
  'odin',
  'freya',
  'anubis',
  'osiris',
  'horus',
  'ra',
  'quetzalcoatl',
  'king arthur',
  'merlin',
  'lancelot',
  'guinevere',
  'robin hood',
  'beowulf',
  'gilgamesh',
  'sun wukong',

  // Non-Relevant Everyday Items, Food, Tech, Games & Sports
  'pizza',
  'burger',
  'hamburger',
  'cheeseburger',
  'sushi',
  'pasta',
  'spaghetti',
  'taco',
  'burrito',
  'ramen',
  'ice cream',
  'chocolate',
  'coffee',
  'coca cola',
  'pepsi',
  'mcdonalds',
  'kfc',
  'starbucks',
  'iphone',
  'ipad',
  'macbook',
  'samsung',
  'playstation',
  'xbox',
  'nintendo',
  'nintendo switch',
  'minecraft',
  'roblox',
  'fortnite',
  'valorant',
  'league of legends',
  'counter strike',
  'call of duty',
  'grand theft auto',
  'gta',
  'among us',
  'genshin impact',
  'elden ring',
  'dark souls',
  'world of warcraft',
  'overwatch',
  'apex legends',
  'pubg',
  'clash royale',
  'clash of clans',
  'brawl stars',
  'tetris',
  'youtube',
  'tiktok',
  'instagram',
  'facebook',
  'twitter',
  'netflix',
  'spotify',
  'google',
  'amazon',
  'apple',
  'microsoft',
  'tesla',
  'bitcoin',
  'ethereum',
  'cryptocurrency',
  'dogecoin',
  'chatgpt',
  'openai',
  'javascript',
  'python',
  'html',
  'css',
  'football',
  'soccer',
  'basketball',
  'baseball',
  'tennis',
  'cricket',
  'fifa',
  'nba',
  'nfl',
  'real madrid',
  'fc barcelona',
  'manchester united',
  'lakers',
  'star wars',
  'star trek',
  'lord of the rings',
  'game of thrones',
  'avengers',
  'justice league',
  'x men',
  'x-men',
  'dragon ball',
  'one piece',
  'attack on titan',
  'demon slayer',
  'jujutsu kaisen',
  'my hero academia',
  'death note',
  'bleach anime',
  'fullmetal alchemist',
  'hunter x hunter',
  'chainsaw man',
  'stranger things',
  'breaking bad',
  'walter white',
  'heisenberg',
  'jesse pinkman',
  'saul goodman',
  'gus fring',
  'tony soprano',
  'michael scott',
  'dwight schrute',
  'sheldon cooper',
  'barney stinson',
  'dexter morgan',
  'hannibal lecter',
  'michael myers',
  'jason voorhees',
  'freddy krueger',
  'ghostface',
  'chucky',
  'pennywise',
  'john wick',
  'neo matrix',
  'morpheus',
  'terminator',
  'robocop',
  'predator',
  'xenomorph',
  'ellen ripley',
  'forrest gump',
  'vito corleone',
  'michael corleone',
  'tony montana',
  'tyler durden',
  'patrick bateman',
  'optimus prime'
]);

const FICTIONAL_KEYWORD_PATTERNS = [
  /\b(fictional|superhero|supervillain|anime|manga|pokemon|pokémon|hogwarts|wakanda|mordor|westeros|narnia|gotham|krypton|tatooine|asgard|bikini bottom|neverland|middle-earth|middle earth|atlantis|el dorado|shangri-la|camelot|hyrule|cybertron|pandora|arrakis|skyrim|azeroth)\b/i,
  /\b(spider-?man|iron\s*man|bat\s*man|super\s*man|wonder\s*woman|captain\s*america|black\s*panther|doctor\s*strange|darth\s*vader|luke\s*skywalker|harry\s*potter|frodo|gandalf|sauron|aragorn|jon\s*snow|daenerys|sherlock\s*holmes|james\s*bond|indiana\s*jones|spongebob|mickey\s*mouse|bugs\s*bunny|homer\s*simpson|peter\s*griffin|eric\s*cartman|rick\s*sanchez|shrek|pikachu|naruto|sasuke|goku|vegeta|luffy|eren\s*yeager|saitama|tanjiro|gojo|walter\s*white|john\s*wick|godzilla|king\s*kong|optimus\s*prime|master\s*chief|kratos|super\s*mario|sonic\s*the\s*hedgehog)\b/i,
  /\b(minecraft|fortnite|roblox|valorant|league\s*of\s*legends|call\s*of\s*duty|grand\s*theft\s*auto|elden\s*ring|genshin\s*impact|skibidi|chatgpt|iphone|macbook|playstation|xbox|nintendo|bitcoin|dogecoin)\b/i
];

/**
 * Strips diacritics/accents (e.g. Țepeș -> tepes, Târgoviște -> targoviste) and lowercases
 */
function normalizeText(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[țţ]/gi, 't')
    .replace(/[șş]/gi, 's')
    .replace(/[ăâ]/gi, 'a')
    .replace(/[î]/gi, 'i')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Collapses repeated adjacent characters so typos like "walllachia" == "wallachia" == "walachia"
 */
function collapseRepeatedChars(str: string): string {
  return str.replace(/(.)\1+/g, '$1');
}

/**
 * Tokenizes normalized text into meaningful search words
 */
function tokenize(str: string): string[] {
  return normalizeText(str)
    .split(/[\s-]+/)
    .filter((w) => w.length >= 2 && !GENERIC_KEYWORDS.has(w));
}

/**
 * Fast bounded Levenshtein edit distance for typo tolerance
 */
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  const lenA = a.length;
  const lenB = b.length;
  if (Math.abs(lenA - lenB) > 2) return 99;

  const dp: number[] = Array.from({ length: lenB + 1 }, (_, j) => j);
  for (let i = 1; i <= lenA; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= lenB; j++) {
      const temp = dp[j];
      if (a[i - 1] === b[j - 1]) {
        dp[j] = prev;
      } else {
        dp[j] = 1 + Math.min(prev, dp[j], dp[j - 1]);
      }
      prev = temp;
    }
  }
  return dp[lenB];
}

/**
 * Detects whether a user query is a fictional character, fictional/mythological place,
 * gibberish keysmash, or non-relevant subject.
 */
export function isFictionalOrNonHistoricalQuery(query: string): boolean {
  const qNorm = normalizeText(query);
  if (!qNorm) return false;

  const qCollapsed = collapseRepeatedChars(qNorm);

  // Allow explicit historical Vlad III / Blackbeard / Iron Man of India / Man of Steel (Stalin) queries
  if (
    qNorm === 'dracula' ||
    qNorm === 'vlad dracula' ||
    qNorm === 'vlad tepes' ||
    qNorm === 'vlad the impaler' ||
    qNorm === 'blackbeard' ||
    qNorm === 'iron man of india' ||
    qNorm === 'the iron man of india' ||
    qNorm === 'man of steel' ||
    qNorm === 'the man of steel'
  ) {
    return false;
  }

  if (
    FICTIONAL_OR_IRRELEVANT_PHRASES.has(qNorm) ||
    FICTIONAL_OR_IRRELEVANT_PHRASES.has(qCollapsed)
  ) {
    return true;
  }

  for (const pattern of FICTIONAL_KEYWORD_PATTERNS) {
    if (pattern.test(qNorm) || pattern.test(qCollapsed)) {
      return true;
    }
  }

  // Check if any multi-word fictional phrase or single-word unique fictional token is closely matched
  for (const phrase of FICTIONAL_OR_IRRELEVANT_PHRASES) {
    if (phrase.length >= 6 && Math.abs(phrase.length - qNorm.length) <= 1) {
      if (editDistance(qNorm, phrase) <= 1 || editDistance(qCollapsed, collapseRepeatedChars(phrase)) <= 1) {
        return true;
      }
    }
  }

  // Detect keyboard smash / gibberish (e.g., "asdfghjkl", "qwertyuiop", strings >= 6 chars with zero vowels or 5+ consecutive consonants not in real names)
  const lettersOnly = qNorm.replace(/[^a-z]/g, '');
  if (lettersOnly.length >= 5) {
    const vowelCount = (lettersOnly.match(/[aeiouy]/g) || []).length;
    if (vowelCount === 0) return true;
    if (/^(asdf|qwer|zxcv|hjkl|yuio|bnm)+/i.test(lettersOnly)) return true;
  }

  return false;
}

export function searchHistoricalAtlas(query: string, limit = 8): HistoricalSearchItem[] {
  const qNorm = normalizeText(query);
  if (!qNorm) return [];

  // Immediately reject known fictional characters, fictional places, or non-relevant queries
  if (isFictionalOrNonHistoricalQuery(query)) {
    return [];
  }

  const qNoThe = qNorm.replace(/^the\s+/, '').trim();
  const qCollapsed = collapseRepeatedChars(qNorm);
  const qNoTheCollapsed = collapseRepeatedChars(qNoThe);
  const qTokens = tokenize(qNorm);
  const qCollapsedTokens = qTokens.map(collapseRepeatedChars);

  const scored = HISTORICAL_SEARCH_INDEX.map((item) => {
    let score = 0;
    const titleNorm = normalizeText(item.title);
    const titleCollapsed = collapseRepeatedChars(titleNorm);
    const titleWords = titleNorm.split(/[\s-]+/).filter(Boolean);
    const titleCollapsedWords = titleWords.map(collapseRepeatedChars);

    // 1. Direct & Prefix Phrase Matches on Title (word-boundary safe)
    if (titleNorm === qNorm || titleCollapsed === qCollapsed) {
      score += 240;
    } else if (titleNorm.startsWith(qNorm) || titleCollapsed.startsWith(qCollapsed)) {
      score += 150;
    } else if (
      titleWords.some((w) => w === qNorm || (qNorm.length >= 3 && w.startsWith(qNorm))) ||
      titleCollapsedWords.some(
        (w) => w === qCollapsed || (qCollapsed.length >= 3 && w.startsWith(qCollapsed))
      )
    ) {
      score += 120;
    } else if (
      (qNorm.includes(' ') && titleNorm.includes(qNorm)) ||
      (qNoThe.length >= 4 && qNoThe.includes(' ') && titleNorm.includes(qNoThe))
    ) {
      score += 145;
    }

    // 2. Keyword & Historical Nickname/Title Phrase Matching
    for (const rawKw of item.keywords) {
      const kw = normalizeText(rawKw);
      if (!kw || (GENERIC_KEYWORDS.has(kw) && qNorm !== kw)) continue;
      const kwNoThe = kw.replace(/^the\s+/, '').trim();
      const kwCollapsed = collapseRepeatedChars(kw);
      const kwNoTheCollapsed = collapseRepeatedChars(kwNoThe);
      const kwWords = kw.split(/[\s-]+/).filter(Boolean);

      if (
        kw === qNorm ||
        kwCollapsed === qCollapsed ||
        (qNoThe.length >= 4 && (kwNoThe === qNoThe || kwNoTheCollapsed === qNoTheCollapsed))
      ) {
        score += 185;
      } else if (
        (qNorm.length >= 3 && kw.startsWith(qNorm)) ||
        (qCollapsed.length >= 3 && kwCollapsed.startsWith(qCollapsed)) ||
        (qNoThe.length >= 4 &&
          (kwNoThe.startsWith(qNoThe) || kwNoTheCollapsed.startsWith(qNoTheCollapsed)))
      ) {
        score += 95;
      } else if (
        qNorm.length >= 4 &&
        kwWords.some((w) => w === qNorm || w.startsWith(qNorm))
      ) {
        score += 75;
      } else if (
        (qNorm.includes(' ') && kw.includes(qNorm)) ||
        (qNoThe.length >= 4 && qNoThe.includes(' ') && kw.includes(qNoThe))
      ) {
        score += 105;
      }
    }

    // 3. Token-Level Fuzzy / Typo-Tolerant Matching (handles "walllachia", "vlad the impailer", etc.)
    if (qTokens.length > 0) {
      const itemTokens = new Set<string>([
        ...tokenize(item.title),
        ...tokenize(item.subtitle),
        ...item.keywords.flatMap((k) => tokenize(k))
      ]);
      const itemTokenList = Array.from(itemTokens);

      let matchedTokenCount = 0;
      let tokenScoreSum = 0;

      for (let i = 0; i < qTokens.length; i++) {
        const qt = qTokens[i];
        const qtCol = qCollapsedTokens[i];
        let bestTokenScore = 0;

        for (const it of itemTokenList) {
          const itCol = collapseRepeatedChars(it);
          if (it === qt || (qtCol.length >= 4 && itCol === qtCol)) {
            bestTokenScore = Math.max(bestTokenScore, 60);
            break;
          }
          if (qt.length >= 4 && (it.startsWith(qt) || itCol.startsWith(qtCol))) {
            bestTokenScore = Math.max(bestTokenScore, 40);
          } else if (qt.length >= 5 && it.length >= 5) {
            const dist = Math.min(editDistance(qt, it), editDistance(qtCol, itCol));
            const maxAllowed = qt.length >= 7 ? 2 : 1;
            if (dist <= maxAllowed) {
              bestTokenScore = Math.max(bestTokenScore, dist === 1 ? 48 : 34);
            }
          }
        }

        if (bestTokenScore > 0) {
          matchedTokenCount++;
          tokenScoreSum += bestTokenScore;
        }
      }

      // If the user typed multiple meaningful tokens (e.g. "Gotham City" or "Vlad the Impaler"),
      // require that ALL meaningful tokens matched unless the full phrase already matched above.
      if (qTokens.length >= 2) {
        if (matchedTokenCount === qTokens.length) {
          score += tokenScoreSum + 95;
        } else if (score < 120) {
          // Discard partial 1-word overlap on multi-word queries so "Captain America" or "Gotham City" don't match real items
          score = 0;
        }
      } else {
        score += tokenScoreSum;
      }
    }

    // Slight boost for historical figures, cities, and empires when matching keywords
    if (
      score >= 70 &&
      (item.category === 'figure' || item.category === 'city' || item.category === 'empire')
    ) {
      score += 10;
    }

    return { item, score };
  });

  return scored
    .filter((s) => s.score >= 70)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item);
}

