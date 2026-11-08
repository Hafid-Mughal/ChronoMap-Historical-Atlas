import { pathGenerator, projectCoordinates } from './geoService';

export interface HistoricalGeoEntity {
  id: string;
  name: string;
  historicalName: string;
  ruler: string;
  capital: string;
  populationEstimate: string;
  color: string;
  path: string;
  center: [number, number];
  description: string;
  keyEvents: string[];
}

export interface GeopoliticalEra {
  id: string;
  year: number;
  label: string;
  epochName: string;
  timeRange: string;
  period: 'BCE' | 'CE';
  summary: string;
  globalDynamics: string;
  isModernBorders: boolean; // false for past eras where unmarked lands remain open space
  entities: HistoricalGeoEntity[];
}

// Helper to construct and project GeoJSON polygon to SVG path
function createGeoPath(coordinates: [number, number][][]): { path: string; center: [number, number] } {
  const geojson: any = {
    type: 'Polygon',
    coordinates
  };
  const path = pathGenerator(geojson) || '';
  const centroid = pathGenerator.centroid(geojson);
  return {
    path,
    center: [
      isNaN(centroid[0]) ? 500 : centroid[0],
      isNaN(centroid[1]) ? 260 : centroid[1]
    ]
  };
}

// Helper for multi-polygons
function createMultiGeoPath(coordinates: [number, number][][][]): { path: string; center: [number, number] } {
  const geojson: any = {
    type: 'MultiPolygon',
    coordinates
  };
  const path = pathGenerator(geojson) || '';
  const centroid = pathGenerator.centroid(geojson);
  return {
    path,
    center: [
      isNaN(centroid[0]) ? 500 : centroid[0],
      isNaN(centroid[1]) ? 260 : centroid[1]
    ]
  };
}

// ----------------------------------------------------
// 3000 BCE: Only early river valley civilizations have boundaries
// ALL OTHER CONTINENTS (Americas, Europe, Africa, Asia, Australia) ARE OPEN UNMARKED SPACE
// ----------------------------------------------------
const egypt3000 = createGeoPath([[
  [29.5, 31.8], [32.8, 31.8], [32.8, 24.0], [30.5, 24.0], [29.5, 31.8]
]]);
const sumer3000 = createGeoPath([[
  [43.5, 33.5], [47.5, 31.5], [48.5, 30.0], [45.0, 31.0], [43.5, 33.5]
]]);
const indus3000 = createGeoPath([[
  [66.5, 24.5], [71.5, 27.5], [74.5, 32.5], [71.0, 32.0], [67.0, 27.5], [66.5, 24.5]
]]);
const liangzhu3000 = createGeoPath([[
  [118.5, 32.0], [122.0, 31.5], [121.5, 29.5], [119.0, 29.8], [118.5, 32.0]
]]);
const cyclades3000 = createGeoPath([[
  [24.5, 37.8], [26.2, 37.8], [26.0, 36.2], [24.5, 36.2], [24.5, 37.8]
]]);

// ----------------------------------------------------
// 500 BCE: Classical Antiquity (Achaemenid Empire, Greece, Rome, Magadha, Eastern Zhou)
// ----------------------------------------------------
const persia500 = createGeoPath([[
  [26.0, 40.5], [38.0, 41.5], [54.0, 41.0], [68.0, 36.0], [69.0, 25.0],
  [56.0, 26.0], [48.0, 30.0], [32.0, 27.0], [29.0, 31.5], [35.0, 36.5], [26.0, 40.5]
]]);
const greece500 = createGeoPath([[
  [20.5, 39.5], [24.0, 40.0], [24.5, 36.5], [21.5, 36.5], [20.5, 39.5]
]]);
const rome500 = createGeoPath([[
  [11.5, 42.5], [13.5, 42.5], [13.0, 41.0], [11.5, 41.5], [11.5, 42.5]
]]);
const magadha500 = createGeoPath([[
  [80.0, 27.5], [88.0, 26.5], [87.5, 22.5], [82.0, 23.5], [80.0, 27.5]
]]);
const zhou500 = createGeoPath([[
  [108.0, 36.5], [120.0, 38.0], [121.0, 30.5], [112.0, 30.0], [108.0, 36.5]
]]);

// ----------------------------------------------------
// 0 / 1 CE: Pax Romana & Han Dynasty
// ----------------------------------------------------
const romanEmpire0 = createGeoPath([[
  [-9.5, 37.0], [-1.0, 46.0], [2.0, 51.5], [10.0, 48.0], [18.0, 45.0],
  [28.0, 42.0], [36.0, 37.0], [35.5, 31.0], [31.5, 29.0], [15.0, 32.0],
  [-5.0, 35.5], [-9.5, 37.0]
]]);
const hanChina0 = createGeoPath([[
  [98.0, 38.0], [122.0, 40.0], [121.0, 22.0], [105.0, 22.0], [100.0, 30.0], [98.0, 38.0]
]]);
const parthia0 = createGeoPath([[
  [44.0, 37.0], [61.0, 37.0], [62.0, 27.0], [48.0, 29.0], [44.0, 37.0]
]]);
const kushan0 = createGeoPath([[
  [66.0, 36.0], [77.0, 33.0], [76.0, 24.0], [67.0, 26.0], [66.0, 36.0]
]]);

// ----------------------------------------------------
// 800 CE: Charlemagne, Abbasid Caliphate, Tang Dynasty, Byzantium
// ----------------------------------------------------
const abbasid800 = createGeoPath([[
  [-8.0, 31.0], [10.0, 36.0], [30.0, 31.0], [48.0, 34.0], [68.0, 35.0],
  [68.0, 24.0], [50.0, 25.0], [35.0, 22.0], [12.0, 28.0], [-8.0, 31.0]
]]);
const carolingian800 = createGeoPath([[
  [-2.0, 47.0], [4.0, 53.0], [14.0, 52.0], [15.0, 44.0], [11.0, 42.0],
  [3.0, 43.0], [-1.0, 43.5], [-2.0, 47.0]
]]);
const byzantium800 = createGeoPath([[
  [19.0, 39.0], [28.0, 41.5], [38.0, 41.0], [36.0, 37.0], [24.0, 35.5], [19.0, 39.0]
]]);
const tang800 = createGeoPath([[
  [95.0, 40.0], [122.0, 40.0], [121.0, 22.0], [105.0, 22.0], [95.0, 40.0]
]]);

// ----------------------------------------------------
// 1200 CE: High Middle Ages & Mongol Dawn
// ----------------------------------------------------
const mongol1200 = createGeoPath([[
  [88.0, 52.0], [118.0, 52.0], [115.0, 42.0], [92.0, 42.0], [88.0, 52.0]
]]);
const ayyubid1200 = createGeoPath([[
  [28.0, 31.5], [37.0, 36.5], [42.0, 35.0], [38.0, 24.0], [31.0, 24.0], [28.0, 31.5]
]]);
const song1200 = createGeoPath([[
  [104.0, 33.0], [122.0, 32.5], [120.0, 22.0], [106.0, 22.0], [104.0, 33.0]
]]);
const hre1200 = createGeoPath([[
  [5.0, 53.0], [16.0, 53.0], [15.0, 45.0], [8.0, 45.0], [5.0, 53.0]
]]);

// ----------------------------------------------------
// 1500 CE: Renaissance, Ottoman, Ming, Inca, Aztec, Spain
// ----------------------------------------------------
const ottoman1500 = createGeoPath([[
  [18.0, 44.0], [32.0, 46.0], [42.0, 41.0], [36.0, 32.0], [28.0, 31.0],
  [22.0, 37.0], [18.0, 44.0]
]]);
const ming1500 = createGeoPath([[
  [100.0, 40.0], [122.0, 41.0], [121.0, 21.0], [103.0, 22.0], [100.0, 40.0]
]]);
const inca1500 = createGeoPath([[
  [-80.0, -2.0], [-76.0, -14.0], [-70.0, -28.0], [-72.0, -32.0], [-76.0, -18.0], [-81.0, -4.0], [-80.0, -2.0]
]]);
const aztec1500 = createGeoPath([[
  [-100.0, 20.5], [-96.0, 20.0], [-96.5, 16.5], [-100.0, 17.5], [-100.0, 20.5]
]]);
const spain1500 = createGeoPath([[
  [-9.5, 43.5], [-2.0, 43.0], [3.0, 42.0], [-1.0, 36.5], [-7.5, 36.5], [-9.5, 43.5]
]]);

// ----------------------------------------------------
// 1812 CE: Napoleonic Zenith
// ----------------------------------------------------
const napoleon1812 = createGeoPath([[
  [-4.5, 48.5], [6.0, 54.0], [18.0, 54.0], [18.0, 45.0], [14.0, 40.0],
  [8.0, 44.0], [-1.0, 43.0], [-4.5, 48.5]
]]);
const russia1812 = createGeoPath([[
  [22.0, 60.0], [80.0, 68.0], [130.0, 65.0], [130.0, 50.0], [70.0, 52.0],
  [30.0, 50.0], [22.0, 60.0]
]]);
const british1812 = createMultiGeoPath([
  // British Isles
  [[ [-10.0, 51.0], [-2.0, 58.5], [1.5, 52.0], [-5.0, 50.0], [-10.0, 51.0] ]],
  // British India coastal settlements
  [[ [72.0, 19.0], [88.0, 22.5], [83.0, 13.0], [75.0, 12.0], [72.0, 19.0] ]]
]);
const qing1812 = createGeoPath([[
  [75.0, 42.0], [125.0, 50.0], [122.0, 22.0], [98.0, 24.0], [75.0, 42.0]
]]);
const usa1812 = createGeoPath([[
  [-90.0, 45.0], [-68.0, 45.0], [-75.0, 35.0], [-88.0, 30.5], [-90.0, 45.0]
]]);

// ----------------------------------------------------
// 1914 CE: World War I Outbreak
// ----------------------------------------------------
const germanEmpire1914 = createGeoPath([[
  [6.0, 54.5], [22.0, 54.5], [18.5, 50.0], [7.0, 48.5], [6.0, 54.5]
]]);
const austroHungarian1914 = createGeoPath([[
  [9.5, 47.0], [24.0, 48.0], [21.0, 43.0], [14.0, 45.0], [9.5, 47.0]
]]);
const russianEmpire1914 = createGeoPath([[
  [22.0, 68.0], [140.0, 65.0], [135.0, 45.0], [65.0, 40.0], [35.0, 45.0], [22.0, 68.0]
]]);
const frenchRepublic1914 = createMultiGeoPath([
  // Metropolitan France
  [[ [-4.5, 48.5], [7.5, 49.0], [7.0, 43.5], [-1.5, 43.0], [-4.5, 48.5] ]],
  // French North & West Africa
  [[ [-16.0, 22.0], [12.0, 22.0], [10.0, 5.0], [-15.0, 10.0], [-16.0, 22.0] ]]
]);
const ottomanEmpire1914 = createGeoPath([[
  [26.0, 41.5], [44.0, 41.0], [48.0, 30.0], [40.0, 21.0], [35.0, 31.0], [26.0, 41.5]
]]);
const britishEmpire1914 = createMultiGeoPath([
  // UK
  [[ [-10.0, 51.0], [-2.0, 58.5], [1.5, 52.0], [-5.0, 50.0], [-10.0, 51.0] ]],
  // British Raj (India, Pakistan, Bangladesh, Burma)
  [[ [65.0, 35.0], [95.0, 28.0], [98.0, 15.0], [78.0, 8.0], [68.0, 24.0], [65.0, 35.0] ]],
  // Egypt & Sudan
  [[ [25.0, 31.5], [35.0, 31.5], [35.0, 5.0], [22.0, 5.0], [25.0, 31.5] ]],
  // Australia
  [[ [115.0, -20.0], [150.0, -20.0], [145.0, -38.0], [115.0, -35.0], [115.0, -20.0] ]]
]);

// ----------------------------------------------------
// 1939 CE: World War II Outbreak
// ----------------------------------------------------
const naziGermany1939 = createGeoPath([[
  [6.0, 54.5], [21.0, 54.5], [18.5, 47.0], [9.5, 47.5], [6.0, 54.5]
]]);
const ussr1939 = createGeoPath([[
  [28.0, 68.0], [140.0, 65.0], [135.0, 45.0], [65.0, 40.0], [35.0, 45.0], [28.0, 68.0]
]]);
const japanEmpire1939 = createMultiGeoPath([
  // Home Islands
  [[ [130.0, 31.0], [141.0, 45.0], [145.0, 43.0], [130.0, 31.0] ]],
  // Korea & Manchuria
  [[ [120.0, 50.0], [132.0, 48.0], [128.0, 34.0], [124.0, 38.0], [120.0, 50.0] ]],
  // Taiwan
  [[ [120.0, 25.5], [122.0, 25.5], [121.5, 21.5], [120.0, 22.0], [120.0, 25.5] ]]
]);

// ----------------------------------------------------
// 1962 CE: Cold War
// ----------------------------------------------------
const ussr1962 = createGeoPath([[
  [22.0, 68.0], [140.0, 65.0], [135.0, 45.0], [65.0, 40.0], [35.0, 45.0], [22.0, 68.0]
]]);
const usa1962 = createGeoPath([[
  [-125.0, 49.0], [-67.0, 45.0], [-80.0, 25.0], [-117.0, 32.0], [-125.0, 49.0]
]]);
const chinaPRC1962 = createGeoPath([[
  [75.0, 40.0], [130.0, 48.0], [121.0, 21.5], [100.0, 22.0], [75.0, 40.0]
]]);

// Master historical eras collection
export const GEOPOLITICAL_ERAS: GeopoliticalEra[] = [
  {
    id: 'era_3000bce',
    year: -3000,
    label: '3000 BCE',
    epochName: 'The Dawn of Bronze & First Dynasties',
    timeRange: '3300 BCE – 2800 BCE',
    period: 'BCE',
    summary: 'The birth of urban civilization along fertile river basins. Sovereign statehood existed only in the Nile, Mesopotamia, Indus, and Yangtze; all other vast continental lands remained open, uncharted frontier space.',
    globalDynamics: 'City-states in Sumer and the unification of Upper and Lower Egypt under Pharaoh Narmer establish early bureaucracy, while the rest of the world lives in borderless Neolithic and hunter-gatherer harmony.',
    isModernBorders: false,
    entities: [
      {
        id: 'egypt_early_dynastic',
        name: 'Early Dynastic Egypt',
        historicalName: 'Ta-Shemau & Ta-Mehu (The Two Lands)',
        ruler: 'Pharaoh Narmer / Hor-Aha',
        capital: 'Memphis / Thinis',
        populationEstimate: '~1.5 Million',
        color: '#D97706',
        path: egypt3000.path,
        center: egypt3000.center,
        description: 'First unified territorial kingdom under divine monarchy, controlling the fertile Nile Delta and trade corridors to Nubia and the Levant.',
        keyEvents: ['Unification of Upper & Lower Egypt', 'Development of Hieroglyphic Writing', 'Royal Tombs at Abydos']
      },
      {
        id: 'sumer_city_states',
        name: 'Sumerian City-States (Uruk & Ur)',
        historicalName: 'Ki-en-gi (Land of the Noble Lords)',
        ruler: 'Ensi (Priest-Kings)',
        capital: 'Uruk / Ur',
        populationEstimate: '~800,000',
        color: '#2563EB',
        path: sumer3000.path,
        center: sumer3000.center,
        description: 'Network of independent city-states pioneering the wheel, monumental mudbrick ziggurats, irrigation canal networks, and cuneiform accounting.',
        keyEvents: ['Invention of Cuneiform Script', 'Monumental Eanna District at Uruk', 'Canal Irrigation Infrastructure']
      },
      {
        id: 'indus_valley_early',
        name: 'Indus Valley / Harappan Civilization',
        historicalName: 'Meluhha (Harappan Realm)',
        ruler: 'Civic Guilds & Priest Councils',
        capital: 'Harappa / Mohenjo-Daro',
        populationEstimate: '~1.2 Million',
        color: '#059669',
        path: indus3000.path,
        center: indus3000.center,
        description: 'Sophisticated grid-planned brick cities with advanced urban drainage, sanitation systems, standardized weights, and maritime trading with Mesopotamia.',
        keyEvents: ['Grid Urban Planning Systems', 'Standardized Weights & Seals', 'Lothal Dockyard Trade']
      },
      {
        id: 'liangzhu_culture',
        name: 'Liangzhu Hydraulic Civilization',
        historicalName: 'Liangzhu (Lower Yangtze Realm)',
        ruler: 'Jade Chiefdom Elites',
        capital: 'Liangzhu City (Lake Tai)',
        populationEstimate: '~1.0 Million',
        color: '#DC2626',
        path: liangzhu3000.path,
        center: liangzhu3000.center,
        description: 'Advanced hydraulic civilization in the Yangtze River delta renowned for monumental earthworks, reservoirs, and exquisite carved ceremonial jade artifacts.',
        keyEvents: ['Monumental Hydraulic Dams', 'Jade Cong & Bi Craftsmanship', 'Early Urban Stratification']
      },
      {
        id: 'cycladic_aegean',
        name: 'Cycladic Maritime Culture',
        historicalName: 'Keros-Syros Aegean Realm',
        ruler: 'Maritime Island Chieftains',
        capital: 'Naxos / Melos',
        populationEstimate: '~200,000',
        color: '#7C3AED',
        path: cyclades3000.path,
        center: cyclades3000.center,
        description: 'Early maritime bronze-working island networks across the Aegean Sea crafting iconic minimalist marble figurines and dominating obsidian sea trade.',
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
    summary: 'The rise of continental empires and philosophical breakthroughs (Confucius, Buddha, Socrates). Unclaimed territory surrounds the major imperial spheres.',
    globalDynamics: 'The Achaemenid Empire spans three continents, while Greek poleis defend self-governance and Indian Mahajanapadas consolidate into kingdoms.',
    isModernBorders: false,
    entities: [
      {
        id: 'achaemenid_persia',
        name: 'Achaemenid Persian Empire',
        historicalName: 'Xsayacya (Empire of the Aryans)',
        ruler: 'Darius I (The Great)',
        capital: 'Persepolis & Susa',
        populationEstimate: '~35 Million',
        color: '#B45309',
        path: persia500.path,
        center: persia500.center,
        description: 'The largest empire of the ancient world, celebrated for satrapy administration, religious tolerance, the Cyrus Cylinder, and the Royal Road.',
        keyEvents: ['Construction of Persepolis', 'Creation of the Royal Road Network', 'Greco-Persian Wars Clash']
      },
      {
        id: 'greek_poleis',
        name: 'Greek City-States (Athens, Sparta, Thebes)',
        historicalName: 'Hellas (The Hellenic League)',
        ruler: 'Cleisthenes (Athens) / Archidamus (Sparta)',
        capital: 'Athens / Sparta',
        populationEstimate: '~3.0 Million',
        color: '#2563EB',
        path: greece500.path,
        center: greece500.center,
        description: 'Birthplace of direct democracy, philosophical rationalism, tragedy, and heroic hoplite phalanxes resisting Persian eastern expansion.',
        keyEvents: ['Cleisthenes Democratic Reforms', 'Battle of Marathon (490 BCE)', 'Rise of the Delian League']
      },
      {
        id: 'roman_early_republic',
        name: 'Early Roman Republic',
        historicalName: 'Senatus Populusque Romanus (SPQR)',
        ruler: 'Consuls & Roman Senate',
        capital: 'Rome',
        populationEstimate: '~1.5 Million',
        color: '#DC2626',
        path: rome500.path,
        center: rome500.center,
        description: 'Emerging republican city-state in central Latium recovering from Etruscan monarchical rule, instituting the Tribunes of the Plebs and Senate oversight.',
        keyEvents: ['Overthrow of Tarquin Monarchy', 'Secessio Plebis & Tribunate Creation', 'Latin League Treaties']
      },
      {
        id: 'magadha_janapadas',
        name: 'Kingdom of Magadha & Mahajanapadas',
        historicalName: 'Magadha Mahajanapada',
        ruler: 'King Bimbisara',
        capital: 'Rajagriha / Pataliputra',
        populationEstimate: '~18 Million',
        color: '#059669',
        path: magadha500.path,
        center: magadha500.center,
        description: 'Dominant kingdom along the Ganges basin, fostering the flourishing of Buddhism (Siddhartha Gautama) and Jainism (Mahavira).',
        keyEvents: ['Founding of Buddhist & Jain Traditions', 'Iron Mining & Warfare Expansion', 'Subjugation of Anga']
      },
      {
        id: 'eastern_zhou_china',
        name: 'Eastern Zhou (Spring & Autumn Period)',
        historicalName: 'Zhongguo (The Central States)',
        ruler: 'King Jing of Zhou / Hegemon Dukes',
        capital: 'Luoyi (Luoyang)',
        populationEstimate: '~25 Million',
        color: '#9333EA',
        path: zhou500.path,
        center: zhou500.center,
        description: 'Era of intense feudal rivalry between the Hegemon states (Qi, Jin, Chu, Qin), sparking the Hundred Schools of Thought and Sun Tzu Art of War.',
        keyEvents: ['Teachings of Confucius (Kong Fuzi)', 'Sun Tzu Writes The Art of War', 'Rise of Iron Swords & Crossbows']
      }
    ]
  },
  {
    id: 'era_0',
    year: 1,
    label: '1 CE',
    epochName: 'Pax Romana & The Silk Road Dawn',
    timeRange: '27 BCE – 100 CE',
    period: 'CE',
    summary: 'The golden age of transcontinental peace anchored by the Roman Empire in the West and the Han Dynasty in the East, connected by the overland Silk Road.',
    globalDynamics: 'A quarter of the human population lives under Roman administration around the Mediterranean "Mare Nostrum", while Han China stabilizes Central Asian trading oases.',
    isModernBorders: false,
    entities: [
      {
        id: 'roman_empire_augustus',
        name: 'Roman Empire (Principate)',
        historicalName: 'Imperium Romanum',
        ruler: 'Caesar Augustus (First Emperor)',
        capital: 'Rome',
        populationEstimate: '~56 Million',
        color: '#DC2626',
        path: romanEmpire0.path,
        center: romanEmpire0.center,
        description: 'A colossal imperium encompassing the Mediterranean basin, pioneering concrete aqueducts, Roman law, legions, and the Pax Romana peace.',
        keyEvents: ['Pax Romana Established by Augustus', 'Ara Pacis & Forum Construction', 'Teutoburg Forest Clash (9 CE)']
      },
      {
        id: 'han_dynasty_china',
        name: 'Han Dynasty China',
        historicalName: 'Da Han (Great Han Empire)',
        ruler: 'Emperor Ping / Regent Wang Mang',
        capital: "Chang'an (Xi'an)",
        populationEstimate: '~58 Million',
        color: '#B91C1C',
        path: hanChina0.path,
        center: hanChina0.center,
        description: 'The golden zenith of Chinese imperial civilization: Confucian state examinations, paper invention, steel casting, and protectorate over the Tarim Basin.',
        keyEvents: ['Silk Road Caravans Reach Rome', 'Paper Invention by Cai Lun', 'Salt & Iron State Monopolies']
      },
      {
        id: 'parthian_empire',
        name: 'Parthian Empire (Arsacid Dynasty)',
        historicalName: 'Ashkanian (Empire of the Parthians)',
        ruler: 'Phraates V & Queen Musa',
        capital: 'Ctesiphon',
        populationEstimate: '~16 Million',
        color: '#0D9488',
        path: parthia0.path,
        center: parthia0.center,
        description: 'Skilled Iranian horse-archers and middlemen of the Silk Road, holding Rome at bay along the Euphrates river and protecting Persian culture.',
        keyEvents: ['Defeat of Crassus at Carrhae', 'Silk Road Toll Monopolies', 'Armenian Buffer Zone Diplomacy']
      },
      {
        id: 'kushan_empire',
        name: 'Kushan Empire & Indo-Scythians',
        historicalName: 'Kushano-Shahr',
        ruler: 'Kujula Kadphises',
        capital: 'Purushapura (Peshawar)',
        populationEstimate: '~19 Million',
        color: '#D97706',
        path: kushan0.path,
        center: kushan0.center,
        description: 'A syncretic Greco-Buddhist empire fusing Hellenistic art, Persian royal titles, and Mahayana Buddhism along mountain passes of the Hindu Kush.',
        keyEvents: ['Gandhara Greco-Buddhist Statues', 'Fourth Buddhist Council', 'Silk Trade Confluence']
      }
    ]
  },
  {
    id: 'era_800ce',
    year: 800,
    label: '800 CE',
    epochName: 'Charlemagne & Abbasid Golden Age',
    timeRange: '750 CE – 850 CE',
    period: 'CE',
    summary: 'The zenith of the Islamic Golden Age in Baghdad, the coronation of Charlemagne reviving the Western Empire, and the Tang Dynasty cosmopolitan silk empire.',
    globalDynamics: 'The House of Wisdom translates Greek science into Arabic while Viking longships explore Atlantic rivers and Maya city-states build limestone temples.',
    isModernBorders: false,
    entities: [
      {
        id: 'abbasid_caliphate',
        name: 'Abbasid Caliphate',
        historicalName: 'Al-Khilafah al-Abbasiyyah',
        ruler: 'Caliph Harun al-Rashid',
        capital: 'Baghdad (Round City)',
        populationEstimate: '~40 Million',
        color: '#047857',
        path: abbasid800.path,
        center: abbasid800.center,
        description: 'Scientific and literary hub of the medieval world: algebra invented by al-Khwarizmi, medical encyclopedias, paper mills, and global Indian Ocean trade.',
        keyEvents: ['Founding of House of Wisdom (Bayt al-Hikma)', 'Compilation of One Thousand and One Nights', 'Al-Khwarizmi Founds Algebra']
      },
      {
        id: 'carolingian_empire',
        name: 'Carolingian Empire (Frankish Realm)',
        historicalName: 'Imperium Romanum Francorum',
        ruler: 'Charlemagne (Charles the Great)',
        capital: 'Aachen',
        populationEstimate: '~15 Million',
        color: '#2563EB',
        path: carolingian800.path,
        center: carolingian800.center,
        description: 'United Western and Central Europe under Christian imperium, sparking the Carolingian Renaissance in Latin scholarship and cathedral schools.',
        keyEvents: ['Coronation on Christmas Day 800 CE by Pope Leo III', 'Carolingian Minuscule Script Developed', 'Saxon Wars & Treaty Consolidation']
      },
      {
        id: 'byzantine_empire_800',
        name: 'Byzantine Empire (Eastern Rome)',
        historicalName: 'Basileia Romaion',
        ruler: 'Empress Irene of Athens',
        capital: 'Constantinople',
        populationEstimate: '~9 Million',
        color: '#7C3AED',
        path: byzantium800.path,
        center: byzantium800.center,
        description: 'The bastion of Roman state continuity, Orthodox theology, and Greek culture, defended by the colossal Theodosian walls and Greek Fire naval weapons.',
        keyEvents: ['Rule of Empress Irene', 'Iconoclasm Controversies Resolved', 'Theme Military System Defenses']
      },
      {
        id: 'tang_dynasty_late',
        name: 'Tang Dynasty China',
        historicalName: 'Da Tang',
        ruler: 'Emperor Dezong',
        capital: "Chang'an",
        populationEstimate: '~50 Million',
        color: '#B91C1C',
        path: tang800.path,
        center: tang800.center,
        description: 'Golden age of Chinese poetry (Li Bai, Du Fu), woodblock printing, tea culture, porcelain, and cosmopolitan silk trading.',
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
    summary: 'Crusades in the Levant, the Song Dynasty economic explosion in East Asia, and the unification of nomadic steppe tribes under Temüjin (Genghis Khan).',
    globalDynamics: 'Southern Song pioneers paper money and magnetic compass navigation, while Ayyubids hold Jerusalem and French/English monarchies war over Angevin lands.',
    isModernBorders: false,
    entities: [
      {
        id: 'mongol_tribes_unified',
        name: 'Mongol Confederation (Rising Mongol Empire)',
        historicalName: 'Ikh Mongol Uls',
        ruler: 'Genghis Khan (Temüjin)',
        capital: 'Karakorum',
        populationEstimate: '~2.5 Million',
        color: '#D97706',
        path: mongol1200.path,
        center: mongol1200.center,
        description: 'Master horse-archers united under Yassa tribal law, embarking on the swiftest continental conquest in history across Asia and Eastern Europe.',
        keyEvents: ['Kurultai Proclaims Genghis Khan', 'Conquest of Western Xia & Jin', 'Yam Postal Courier Route System']
      },
      {
        id: 'ayyubid_sultanate',
        name: 'Ayyubid Sultanate',
        historicalName: 'Al-Dawlah al-Ayyubiyyah',
        ruler: 'Al-Adil I (Brother of Saladin)',
        capital: 'Cairo & Damascus',
        populationEstimate: '~12 Million',
        color: '#059669',
        path: ayyubid1200.path,
        center: ayyubid1200.center,
        description: 'Founded by Salah ad-Din (Saladin), defending Islamic lands during the Third and Fourth Crusades and patronizing Cairo madrassas.',
        keyEvents: ['Third Crusade Truce with Richard Lionheart', 'Cairo Citadel Reinforcements', 'Trade Treaties with Venice and Genoa']
      },
      {
        id: 'song_dynasty_south',
        name: 'Southern Song Dynasty',
        historicalName: 'Nan Song',
        ruler: 'Emperor Ningzong',
        capital: "Lin'an (Hangzhou)",
        populationEstimate: '~70 Million',
        color: '#DC2626',
        path: song1200.path,
        center: song1200.center,
        description: 'World’s most populated and technologically sophisticated economy: paper currency (Jiaozi), gunpowder warfare, ocean junks, and Neo-Confucian academies.',
        keyEvents: ['World’s First Government Paper Money', 'Magnetic Compass Maritime Navigation', 'Gunpowder Bombs & Fire Lances']
      },
      {
        id: 'holy_roman_empire_1200',
        name: 'Holy Roman Empire',
        historicalName: 'Sacrum Romanum Imperium',
        ruler: 'Emperor Frederick II',
        capital: 'Palermo / Frankfurt',
        populationEstimate: '~14 Million',
        color: '#EAB308',
        path: hre1200.path,
        center: hre1200.center,
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
    summary: 'The transatlantic voyages connecting the Old and New Worlds, the Florentine High Renaissance, and the zenith of Ottoman, Ming, Inca, and Aztec civilizations.',
    globalDynamics: 'Portuguese caravels round Africa to India while Columbus and Cabral reach the Americas; Leonardo and Michelangelo transform European arts.',
    isModernBorders: false,
    entities: [
      {
        id: 'ottoman_empire_1500',
        name: 'Ottoman Empire',
        historicalName: 'Devlet-i Aliyye-i Osmaniyye',
        ruler: 'Sultan Bayezid II / Selim I',
        capital: 'Kostantiniyye (Istanbul)',
        populationEstimate: '~18 Million',
        color: '#047857',
        path: ottoman1500.path,
        center: ottoman1500.center,
        description: 'Premier Islamic gunpowder superpower straddling Europe, Asia, and Africa, equipped with elite Janissary musketeers and massive bronze siege cannons.',
        keyEvents: ['Sheltering of Sephardic Jewish Refugees (1492)', 'Conquest of Mamluk Egypt & Syria (1517)', 'Imperial Trade Dominance in Black Sea']
      },
      {
        id: 'ming_dynasty_1500',
        name: 'Ming Dynasty China',
        historicalName: 'Da Ming',
        ruler: 'Hongzhi Emperor',
        capital: 'Beijing',
        populationEstimate: '~100 Million',
        color: '#B91C1C',
        path: ming1500.path,
        center: ming1500.center,
        description: 'The Middle Kingdom at peak institutional peace: renovation of the Great Wall with stone towers, Forbidden City palaces, and booming porcelain exports.',
        keyEvents: ['Great Wall Stone Rampart Upgrades', 'Silver Monsoon Global Trade Influx', 'Hongzhi Golden Era of Good Governance']
      },
      {
        id: 'inca_empire_1500',
        name: 'Tawantinsuyu (Inca Empire)',
        historicalName: 'Tawantinsuyu (Realm of the Four Parts)',
        ruler: 'Sapa Inca Huayna Capac',
        capital: 'Cusco',
        populationEstimate: '~12 Million',
        color: '#7C3AED',
        path: inca1500.path,
        center: inca1500.center,
        description: 'Monumental Andean empire connected by 40,000 km of stone Qhapaq Ñan highways, terrace farming, suspension bridges, and quipu knot accounting.',
        keyEvents: ['Expansion of Inca Road System (Qhapaq Ñan)', 'Construction of Machu Picchu', 'Consolidation of Northern Territories (Quito)']
      },
      {
        id: 'aztec_empire_1500',
        name: 'Aztec Triple Alliance (Mexica Empire)',
        historicalName: 'Excan Tlahtoloyan',
        ruler: 'Hueyi Tlatoani Ahuitzotl / Moctezuma II',
        capital: 'Tenochtitlan',
        populationEstimate: '~6 Million',
        color: '#EA580C',
        path: aztec1500.path,
        center: aztec1500.center,
        description: 'Mesoamerican empire centered on the island city of Tenochtitlan with towering temples, floating chinampa agriculture, and extensive tribute provinces.',
        keyEvents: ['Dedicating Templo Mayor Tenochtitlan', 'Expansion of Chinampa Floating Gardens', 'Tribute Network from Gulf to Pacific']
      },
      {
        id: 'spanish_monarchy_1500',
        name: 'Crown of Castile & Aragon (Spanish Monarchy)',
        historicalName: 'Monarchia Hispanica',
        ruler: 'Isabella I of Castile & Ferdinand II of Aragon',
        capital: 'Toledo / Valladolid',
        populationEstimate: '~9 Million',
        color: '#CA8A04',
        path: spain1500.path,
        center: spain1500.center,
        description: 'Catholic Monarchs who completed the Reconquista, sponsored Columbus to the New World, signed the Treaty of Tordesillas, and established the Spanish Tercios.',
        keyEvents: ['Reconquista Completion at Granada (1492)', 'Columbus Reaches the Americas', 'Treaty of Tordesillas Dividing Global Hemispheres']
      }
    ]
  },
  {
    id: 'era_1812ce',
    year: 1812,
    label: '1812 CE',
    epochName: 'Napoleonic Zenith & Imperial Coalitions',
    timeRange: '1804 CE – 1815 CE',
    period: 'CE',
    summary: 'Napoleon controls continental Europe from Lisbon to Warsaw, triggering the catastrophic invasion of Russia and sparking the War of 1812.',
    globalDynamics: 'The Industrial Revolution transforms British factories while Simón Bolívar and José de San Martín ignite South American wars of independence.',
    isModernBorders: false,
    entities: [
      {
        id: 'french_empire_napoleon',
        name: 'French Empire & Satellite Realms',
        historicalName: 'Empire Français',
        ruler: 'Napoleon I (Emperor of the French)',
        capital: 'Paris',
        populationEstimate: '~44 Million',
        color: '#1D4ED8',
        path: napoleon1812.path,
        center: napoleon1812.center,
        description: 'Military hegemon of Europe governed by the Napoleonic Code, commanding the 600,000-man Grande Armée and enforcing the Continental System blockade.',
        keyEvents: ['Invasion of Russia & Burning of Moscow', 'Implementation of Napoleonic Civil Code', 'Continental Blockade against Britain']
      },
      {
        id: 'russian_empire_1812',
        name: 'Russian Empire',
        historicalName: 'Rossiyskaya Imperiya',
        ruler: 'Tsar Alexander I',
        capital: 'Saint Petersburg',
        populationEstimate: '~41 Million',
        color: '#15803D',
        path: russia1812.path,
        center: russia1812.center,
        description: 'Defied Napoleon with scorched-earth retreats and the bloody standoff at Borodino, pursuing the retreating French army all the way to Paris.',
        keyEvents: ['Battle of Borodino (September 1812)', 'Scorched-Earth Defense Strategy', 'Liberation of Central Europe (1813)']
      },
      {
        id: 'british_empire_1812',
        name: 'British Empire (Regency Era)',
        historicalName: 'British Empire',
        ruler: 'George, Prince Regent',
        capital: 'London',
        populationEstimate: '~24M (home) / ~100M (Empire)',
        color: '#DC2626',
        path: british1812.path,
        center: british1812.center,
        description: 'Master of global sea lines through the Royal Navy, financing European coalitions and fighting both France in Iberia and the United States in the War of 1812.',
        keyEvents: ['Duke of Wellington Peninsular War victories', 'War of 1812 with United States', 'Industrial Steam-Powered Factory Revolution']
      },
      {
        id: 'qing_dynasty_1812',
        name: 'Great Qing Empire',
        historicalName: 'Da Qing',
        ruler: 'Jiaqing Emperor',
        capital: 'Beijing',
        populationEstimate: '~360 Million',
        color: '#EAB308',
        path: qing1812.path,
        center: qing1812.center,
        description: 'Colossal agrarian empire producing a third of world manufacturing goods, dealing with internal White Lotus rebellions and growing European opium smuggling.',
        keyEvents: ['White Lotus Rebellion Aftermath', 'Canton Trade System Regulations', 'Opium Prohibition Edicts']
      },
      {
        id: 'united_states_1812',
        name: 'United States of America',
        historicalName: 'United States of America',
        ruler: 'President James Madison',
        capital: 'Washington, D.C.',
        populationEstimate: '~7.7 Million',
        color: '#2563EB',
        path: usa1812.path,
        center: usa1812.center,
        description: 'Young democratic republic fighting Great Britain in the War of 1812 to defend maritime rights and westward sovereignty following the Louisiana Purchase.',
        keyEvents: ['Declaration of War of 1812', "Constitution 'Old Ironsides' Frigate Duels", 'Defense of Fort McHenry & Star-Spangled Banner']
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
    summary: 'Assassination of Archduke Franz Ferdinand triggers alliance pacts, launching Europe and world empires into catastrophic industrial trench warfare.',
    globalDynamics: 'Triple Entente (Britain, France, Russia) clashes with Central Powers (Germany, Austria-Hungary, Ottoman Empire).',
    isModernBorders: false,
    entities: [
      {
        id: 'german_empire_1914',
        name: 'German Empire (Deutsches Kaiserreich)',
        historicalName: 'Deutsches Kaiserreich',
        ruler: 'Kaiser Wilhelm II',
        capital: 'Berlin',
        populationEstimate: '~67 Million',
        color: '#475569',
        path: germanEmpire1914.path,
        center: germanEmpire1914.center,
        description: 'Industrial powerhouse with the world’s most potent land army, enacting the Schlieffen Plan through Belgium before bogging down into stalemate.',
        keyEvents: ['Schlieffen Plan Invasion', 'Battle of Tannenberg Defeating Russia', 'Unrestricted Submarine Warfare Launch']
      },
      {
        id: 'austro_hungarian_1914',
        name: 'Austro-Hungarian Empire',
        historicalName: 'Österreichisch-Ungarische Monarchie',
        ruler: 'Emperor Franz Joseph I',
        capital: 'Vienna & Budapest',
        populationEstimate: '~52 Million',
        color: '#D97706',
        path: austroHungarian1914.path,
        center: austroHungarian1914.center,
        description: 'Dual Monarchy fractured by Slavic and nationalist tensions, issuing the July Ultimatum to Serbia and fighting two fronts.',
        keyEvents: ['July Crisis Ultimatum to Serbia', 'Galician Front Losses to Russia', 'Brusilov Offensive Crises']
      },
      {
        id: 'russian_empire_1914',
        name: 'Russian Empire (Tsarist Russia)',
        historicalName: 'Rossiyskaya Imperiya',
        ruler: 'Tsar Nicholas II',
        capital: 'Petrograd',
        populationEstimate: '~175 Million',
        color: '#16A34A',
        path: russianEmpire1914.path,
        center: russianEmpire1914.center,
        description: 'Mobilized the Russian army of millions to protect Serbia, suffering catastrophic battlefield losses that paved the way for the 1917 Bolshevik Revolution.',
        keyEvents: ['Invasion of East Prussia & Tannenberg Defeat', 'Brusilov Offensive (1916)', '1917 February Revolution & Abdication']
      },
      {
        id: 'french_third_republic_1914',
        name: 'French Third Republic & Empire',
        historicalName: 'Troisième République',
        ruler: 'President Raymond Poincaré',
        capital: 'Paris',
        populationEstimate: '~40 Million (Europe)',
        color: '#2563EB',
        path: frenchRepublic1914.path,
        center: frenchRepublic1914.center,
        description: 'Stopped the German advance at the Miracle of the Marne using Paris taxis to reinforce the frontline.',
        keyEvents: ['Miracle of the Marne (September 1914)', 'Verdun Fortress Defense (1916)', 'Trench Warfare Western Front Stalemate']
      },
      {
        id: 'ottoman_empire_1914',
        name: 'Ottoman Empire',
        historicalName: 'Devlet-i Aliyye-i Osmaniyye',
        ruler: 'Sultan Mehmed V / Three Pashas',
        capital: 'Constantinople',
        populationEstimate: '~21 Million',
        color: '#047857',
        path: ottomanEmpire1914.path,
        center: ottomanEmpire1914.center,
        description: 'Joined the Central Powers, closing the Dardanelles straits at Gallipoli and battling British forces in Mesopotamia and the Levant.',
        keyEvents: ['Gallipoli Campaign Defense (1915)', 'Caucasus Campaign vs Russia', 'Arab Revolt Led by Sharif Hussein']
      },
      {
        id: 'british_empire_1914',
        name: 'British Empire & Dominions',
        historicalName: 'British Empire',
        ruler: 'King George V / PM H.H. Asquith',
        capital: 'London',
        populationEstimate: '~440 Million',
        color: '#B91C1C',
        path: britishEmpire1914.path,
        center: britishEmpire1914.center,
        description: 'World’s greatest naval power enforcing North Sea naval blockade of Germany and mobilizing millions from India, Canada, Australia, and New Zealand.',
        keyEvents: ['Royal Navy North Sea Blockade', 'Battle of the Somme (1916)', 'Entry of Commonwealth Divisions at Vimy & Gallipoli']
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
    summary: 'Nazi Germany invades Poland, igniting the deadliest war in history across European, North African, and Asian theaters.',
    globalDynamics: 'The Axis powers pursue aggressive territorial expansion, confronted by the Allies.',
    isModernBorders: false,
    entities: [
      {
        id: 'nazi_germany_1939',
        name: 'Nazi Germany (Third Reich)',
        historicalName: 'Deutsches Reich',
        ruler: 'Adolf Hitler',
        capital: 'Berlin',
        populationEstimate: '~80 Million',
        color: '#1E293B',
        path: naziGermany1939.path,
        center: naziGermany1939.center,
        description: 'Fascist regime fielding Blitzkrieg armored divisions and carrying out war of extermination across Europe.',
        keyEvents: ['Invasion of Poland (Sept 1, 1939)', 'Blitzkrieg Fall of France (1940)', 'Operation Barbarossa Invasion of USSR (1941)']
      },
      {
        id: 'soviet_union_1939',
        name: 'Union of Soviet Socialist Republics (USSR)',
        historicalName: 'Soyuz Sovetskikh Sotsialisticheskikh Respublik',
        ruler: 'Joseph Stalin',
        capital: 'Moscow',
        populationEstimate: '~170 Million',
        color: '#DC2626',
        path: ussr1939.path,
        center: ussr1939.center,
        description: 'Communist superpower that endured the titanic struggle of the Great Patriotic War at Stalingrad, Kursk, and Berlin.',
        keyEvents: ['Molotov-Ribbentrop Non-Aggression Pact', 'Battle of Stalingrad Turning Point (1942-43)', 'Fall of Berlin (1945)']
      },
      {
        id: 'empire_of_japan_1939',
        name: 'Empire of Japan',
        historicalName: 'Dai Nippon Teikoku',
        ruler: 'Emperor Showa (Hirohito)',
        capital: 'Tokyo',
        populationEstimate: '~73 Million (Home) / ~140M Empire',
        color: '#E11D48',
        path: japanEmpire1939.path,
        center: japanEmpire1939.center,
        description: 'Militarist naval empire prosecuting war in mainland China, planning the preemptive strike on Pearl Harbor.',
        keyEvents: ['Second Sino-Japanese War Campaigns', 'Tripartite Pact with Germany & Italy', 'Attack on Pearl Harbor (Dec 7, 1941)']
      }
    ]
  },
  {
    id: 'era_1962ce',
    year: 1962,
    label: '1962 CE',
    epochName: 'Cold War: Cuban Missile Crisis',
    timeRange: '1947 CE – 1989 CE',
    period: 'CE',
    summary: 'Bipolar ideological standoff between NATO and the Warsaw Pact; the world narrowly avoids nuclear holocaust in October 1962.',
    globalDynamics: 'Rapid decolonization across Africa and Asia while the US and USSR race to the Moon.',
    isModernBorders: false,
    entities: [
      {
        id: 'united_states_1962',
        name: 'United States of America (NATO Leader)',
        historicalName: 'United States of America',
        ruler: 'President John F. Kennedy',
        capital: 'Washington, D.C.',
        populationEstimate: '~186 Million',
        color: '#2563EB',
        path: usa1962.path,
        center: usa1962.center,
        description: 'Leader of the Free World possessing nuclear triad dominance, enacting the naval blockade of Cuba.',
        keyEvents: ['Cuban Missile Crisis Naval Quarantine', 'Apollo Moon Program Announced', 'Creation of Peace Corps & Civil Rights Battles']
      },
      {
        id: 'soviet_union_1962',
        name: 'Soviet Union & Warsaw Pact',
        historicalName: 'Soyuz Sovetskikh Sotsialisticheskikh Respublik',
        ruler: 'Premier Nikita Khrushchev',
        capital: 'Moscow',
        populationEstimate: '~220 Million',
        color: '#DC2626',
        path: ussr1962.path,
        center: ussr1962.center,
        description: 'Leader of world communism; erected the Berlin Wall in 1961 and secretly stationed nuclear missiles in Cuba.',
        keyEvents: ['Erection of the Berlin Wall (1961)', 'Yuri Gagarin First Human in Space (1961)', 'Secret Deployment of Nuclear Missiles to Cuba']
      },
      {
        id: 'china_prc_1962',
        name: 'People’s Republic of China',
        historicalName: 'Zhonghua Renmin Gongheguo',
        ruler: 'Chairman Mao Zedong',
        capital: 'Beijing',
        populationEstimate: '~670 Million',
        color: '#B91C1C',
        path: chinaPRC1962.path,
        center: chinaPRC1962.center,
        description: 'Severed ties with Moscow in the Sino-Soviet Split, fought the 1962 Sino-Indian border war in the Himalayas.',
        keyEvents: ['Sino-Indian Border War (October 1962)', 'Sino-Soviet Ideological Split', 'First Atomic Bomb Test Project 596']
      }
    ]
  },
  {
    id: 'era_2026ce',
    year: 2026,
    label: '2026 CE',
    epochName: 'Modern Day & Sovereign Global States',
    timeRange: '2020 CE – Present',
    period: 'CE',
    summary: 'All 177+ sovereign countries with defined international borders covering the entire globe, with highlighted active war zones and disputed territories.',
    globalDynamics: 'Multipolar world defined by active conflicts in Eastern Europe and the Middle East, civil strife in Sudan and Myanmar, and contested maritime corridors.',
    isModernBorders: true,
    entities: []
  }
];

export function getGeopoliticalEra(rawYear: number): GeopoliticalEra {
  const year = Math.round(rawYear);
  const period: 'BCE' | 'CE' = year < 0 ? 'BCE' : 'CE';
  const label = year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;

  // Find closest benchmark entity set for reference
  let closest = GEOPOLITICAL_ERAS[0];
  let minDiff = Math.abs(year - closest.year);
  for (const era of GEOPOLITICAL_ERAS) {
    const diff = Math.abs(year - era.year);
    if (diff < minDiff) {
      minDiff = diff;
      closest = era;
    }
  }

  let epochName = closest.epochName;
  let timeRange = closest.timeRange;
  let summary = closest.summary;
  let globalDynamics = closest.globalDynamics;

  if (year < -2055) {
    epochName = year < -2686 ? 'Early Bronze Age & First River Dynasties' : 'Old Kingdom Egypt, Akkadian Empire & Mature Harappa';
    timeRange = '3000 BCE – 2055 BCE';
    summary = `World Map in ${label}: Monumental urban statehood flourishes in the Nile Valley, Sumer/Akkad, the Indus Basin, and Early China, while unorganized continental interiors remain borderless wilderness.`;
    globalDynamics = year >= -2334 && year <= -2154
      ? 'Sargon of Akkad forges the first Mesopotamian empire while Old Kingdom Pharaohs construct the Giza pyramids.'
      : 'Independent Sumerian city-states, Old Kingdom Egypt, and Harappan port cities pioneer writing, bronze metallurgy, and maritime trade.';
  } else if (year < -1100) {
    epochName = year < -1550 ? 'Middle Bronze Age: Babylon, Middle Kingdom & Xia' : 'Late Bronze Age: New Kingdom Egypt, Hittites, Shang & Mycenae';
    timeRange = '2055 BCE – 1100 BCE';
    summary = `World Map in ${label}: The international Bronze Age club of great powers—New Kingdom Egypt, the Hittite Empire, Kassite Babylon, Mycenaean Greece, and Shang Dynasty China.`;
    globalDynamics = 'Chariot empires exchange royal diplomatic cuneiform tablets (Amarna Letters) and sign the Kadesh Peace Treaty (1274 BCE) before the Late Bronze Age Collapse.';
  } else if (year < -550) {
    epochName = 'Iron Age Ascendancy: Neo-Assyrian Empire, Western Zhou & Archaic Poleis';
    timeRange = '1100 BCE – 550 BCE';
    summary = `World Map in ${label}: Iron metallurgy transforms warfare and agriculture across Afro-Eurasia; the Neo-Assyrian and Neo-Babylonian empires dominate the Near East while Phoenician Carthage and Greek poleis expand across the Mediterranean.`;
    globalDynamics = 'Assyria & Babylon rule the Fertile Crescent, Kushite Pharaohs unite the Nile, and Vedic Mahajanapadas & Zhou states codify foundational philosophies.';
  } else if (year < -336) {
    epochName = 'Classical Antiquity: Achaemenid Persia, Hellenic Poleis & Warring States';
    timeRange = '550 BCE – 336 BCE';
    summary = `World Map in ${label}: The Achaemenid Persian Empire spans from the Indus to the Aegean, confronting Classical Athens and Sparta, while the early Roman Republic consolidates Italy and Warring States China debates statecraft.`;
    globalDynamics = 'Peak of the Axial Age (Confucius, Siddhartha Gautama, Socrates, Plato) alongside continental satrapy governance along the Persian Royal Road.';
  } else if (year <= -312) {
    epochName = 'Conquests of Alexander the Great & Dawn of the Hellenistic World';
    timeRange = '336 BCE – 312 BCE';
    summary = `World Map in ${label}: Alexander III of Macedon unites Greece, Egypt, Persia, and the Indus Valley into a single transcontinental Macedonian Empire, while Chandragupta Maurya founds the Maurya Empire in India.`;
    globalDynamics = 'Rapid Hellenistic cultural synthesis from Alexandria in Egypt to Alexandria Eschate in Central Asia.';
  } else if (year < -27) {
    epochName = year <= -146 ? 'Hellenistic Kingdoms, Maurya Empire, Punic Wars & Qin/Han Unification' : 'Late Roman Republic Expansion, Han Silk Road & Parthian Rise';
    timeRange = '311 BCE – 27 BCE';
    summary = `World Map in ${label}: The Roman Republic expands step-by-step across the Mediterranean Basin, Han China opens the overland Silk Road across the Tarim Basin, and Ashoka's Maurya Empire unites South Asia.`;
    globalDynamics = year <= -206
      ? 'Rome battles Hannibal\'s Carthage in the Punic Wars while Qin Shi Huang unifies China (221 BCE) and Ashoka erects his moral edicts across India.'
      : 'Roman legions annex Greece, Asia Minor, Gaul (under Julius Caesar), and Ptolemaic Egypt, while Emperor Wu of Han secures the Silk Road.';
  } else if (year < 395) {
    epochName = year <= 180 ? 'Pax Romana, Han Dynasty China, Parthia & Kushan Empire' : 'Late Antiquity: Roman Tetrarchy, Sasanian Persia, Three Kingdoms & Gupta Dawn';
    timeRange = '27 BCE – 395 CE';
    summary = `World Map in ${label}: The classical Afro-Eurasian imperial belt—Rome around the Mare Nostrum, Parthian/Sasanian Persia in the Middle East, Kushan/Gupta India, and Han/Jin China—linked by maritime and overland trade.`;
    globalDynamics = year >= 98 && year <= 117
      ? 'The Roman Empire reaches its maximum territorial extent under Emperor Trajan from Scotland to the Persian Gulf.'
      : 'Four great imperial spheres govern over 70% of the world\'s population while Teotihuacan, Classic Maya, and Aksum flourish.';
  } else if (year < 632) {
    epochName = year <= 476 ? 'Division of Rome, Hunnic Incursions, Gupta Golden Age & Sasanian Iran' : 'Early Byzantine Reconquest, Sasanian Zenith & Sui/Tang Reunification';
    timeRange = '395 CE – 632 CE';
    summary = `World Map in ${label}: Following the 395 CE partition and 476 CE fall of Western Rome, Eastern Rome (Byzantium) endures and reconquers the Mediterranean under Justinian I, while Gupta India and Sui-Tang China thrive.`;
    globalDynamics = 'Justinian codifies Roman law and builds Hagia Sophia; the Sui Dynasty completes China\'s Grand Canal and passes the mandate to the cosmopolitan Tang Dynasty.';
  } else if (year < 1000) {
    epochName = year <= 750 ? 'Umayyad Caliphate, Tang Golden Age & Byzantium' : 'Islamic Golden Age (Abbasids), Carolingian Empire, Tang/Song & Viking Age';
    timeRange = '632 CE – 1000 CE';
    summary = `World Map in ${label}: The Rashidun, Umayyad, and Abbasid Caliphates unite lands from Iberia to Central Asia; Charlemagne crowns the Carolingian Empire in the West; Tang China, Angkor, and Kievan Rus' flourish.`;
    globalDynamics = 'Baghdad\'s House of Wisdom, Córdoba\'s libraries, and Chang\'an\'s silk markets anchor medieval science and commerce.';
  } else if (year < 1206) {
    epochName = 'High Middle Ages: Holy Roman Empire, Song China, Seljuks & Crusades';
    timeRange = '1000 CE – 1206 CE';
    summary = `World Map in ${label}: Song Dynasty China pioneers gunpowder, paper money, and the compass; the Holy Roman Empire, Capetian France, Norman/Plantagenet England, and Saladin's Ayyubid Sultanate shape Western Eurasia.`;
    globalDynamics = 'Maritime compass navigation, Gothic cathedral construction, university foundations (Bologna, Paris, Oxford), and Crusader-Ayyubid campaigns.';
  } else if (year < 1368) {
    epochName = 'The Mongol Imperium (Pax Mongolica), Delhi Sultanate & Mali Empire';
    timeRange = '1206 CE – 1368 CE';
    summary = `World Map in ${label}: Genghis Khan and his successors unite the largest contiguous land empire in history across Eurasia (Mongol Empire, Yuan Dynasty, Golden Horde, Ilkhanate), while Mansa Musa's Mali Empire and the Delhi Sultanate prosper.`;
    globalDynamics = 'Unprecedented trans-Eurasian connectivity along the Silk Road under the Pax Mongolica alongside West African gold trade centered at Timbuktu.';
  } else if (year < 1500) {
    epochName = 'Renaissance Dawn, Rise of the Ottomans, Ming China, Aztec & Inca Empires';
    timeRange = '1368 CE – 1500 CE';
    summary = `World Map in ${label}: Ming China dispatches Zheng He's treasure fleets and builds the Forbidden City; Sultan Mehmed II captures Constantinople (1453); Tawantinsuyu (Inca) and the Aztec Triple Alliance reach their zenith in the Americas.`;
    globalDynamics = 'Gutenberg\'s printing press, the Italian Renaissance, and the initial Iberian voyages of Columbus (1492) and Vasco da Gama (1498).';
  } else if (year < 1648) {
    epochName = 'Age of Discovery, Gunpowder Empires (Ottoman, Safavid, Mughal) & Global Trade';
    timeRange = '1500 CE – 1648 CE';
    summary = `World Map in ${label}: Spanish and Portuguese maritime empires link the Americas and Asia; the Ottoman Empire under Suleiman, Safavid Iran under Abbas I, Mughal India under Akbar & Shah Jahan, and Ming/Tokugawa East Asia dominate global output.`;
    globalDynamics = 'First global silver and spice trade networks (Manila Galleons, Dutch VOC) and the Peace of Westphalia (1648) codifying sovereign statehood.';
  } else if (year < 1776) {
    epochName = 'The Enlightenment, High Qing China, Russian Empire & Seven Years\' War';
    timeRange = '1648 CE – 1775 CE';
    summary = `World Map in ${label}: Qing China and Mughal India lead world manufacturing; Peter the Great and Catherine the Great expand the Russian Empire; Britain and France contest North America and India in the Seven Years' War (1756–1763).`;
    globalDynamics = 'Scientific Revolution, Enlightenment constitutionalism, and global maritime competition across the Atlantic and Indian Oceans.';
  } else if (year <= 1815) {
    epochName = year < 1789 ? 'Age of Atlantic Revolutions & Birth of the United States' : 'French Revolution, Napoleonic Wars & Congress of Vienna';
    timeRange = '1776 CE – 1815 CE';
    summary = `World Map in ${label}: The United States declares independence (1776); the French Revolution (1789) and Emperor Napoleon I reshape the borders of continental Europe before the 1812 Russian Campaign and 1815 Congress of Vienna.`;
    globalDynamics = 'Spread of constitutional republicanism, the Napoleonic Civil Code, Haiti\'s 1804 independence, and early industrial steam power.';
  } else if (year < 1871) {
    epochName = 'Industrial Revolution, Latin American Independence & National Unifications';
    timeRange = '1815 CE – 1870 CE';
    summary = `World Map in ${label}: Simón Bolívar and José de San Martín liberate South America; Mexico and Brazil become sovereign states; Italy unifies in 1861; the United States preserves the Union (1861–1865); and Japan launches the 1868 Meiji Restoration.`;
    globalDynamics = 'Transcontinental railways, steamships, telegraph networks, and the rise of modern nation-states in Europe and the Americas.';
  } else if (year <= 1913) {
    epochName = 'High Imperialism, Belle Époque & Pre-WWI Great Power Alliances';
    timeRange = '1871 CE – 1913 CE';
    summary = `World Map in ${label}: Unified German Empire (1871), Austro-Hungarian Dual Monarchy, Russian Empire, British Empire, French Third Republic, Ottoman Empire, Meiji Japan, and the United States shape the global industrial order.`;
    globalDynamics = 'Second Industrial Revolution (electricity, steel, automobiles) and the formation of the Triple Alliance and Triple Entente.';
  } else if (year <= 1918) {
    epochName = 'The First World War (1914–1918)';
    timeRange = '1914 CE – 1918 CE';
    summary = `World Map in ${label}: Global industrial conflict between the Allied & Associated Powers and the Central Powers across Europe, the Middle East, Africa, and the oceans, culminating in the collapse of four continental empires.`;
    globalDynamics = 'Trench warfare on the Western Front, the 1917 Russian Revolutions, US entry in 1917, and the November 11, 1918 Armistice.';
  } else if (year <= 1938) {
    epochName = 'Interwar Period: League of Nations, Formation of the USSR & Republic of Turkey';
    timeRange = '1919 CE – 1938 CE';
    summary = `World Map in ${label}: New sovereign borders across Central and Eastern Europe (Poland, Czechoslovakia, Yugoslavia, Baltic states, Finland, Ireland, Republic of Turkey) alongside the formation of the Soviet Union (1922).`;
    globalDynamics = 'Post-Versailles self-determination, the Roaring Twenties, the 1929 Great Depression, and rising ideological tensions.';
  } else if (year <= 1945) {
    epochName = 'World War II (1939–1945)';
    timeRange = '1939 CE – 1945 CE';
    summary = `World Map in ${label}: The Grand Alliance (United States, Soviet Union, British Commonwealth, China, Free France) confronts Axis occupation across Europe, North Africa, and the Asia-Pacific theater, founding the United Nations in 1945.`;
    globalDynamics = 'Turning points at Midway, El Alamein, Stalingrad (1942–43), Normandy D-Day (1944), and Allied victory in May & August 1945.';
  } else if (year <= 1991) {
    epochName = year < 1960 ? 'Early Cold War & Asian Decolonization (1946–1959)' : year < 1976 ? 'Cold War Zenith, Space Race & African Independence Wave' : 'Late Cold War, Détente & the Fall of the Iron Curtain (1976–1991)';
    timeRange = '1946 CE – 1991 CE';
    summary = `World Map in ${label}: Bipolar competition between the US-led NATO alliance and the Soviet-led Warsaw Pact, accompanied by the historic independence of India & Pakistan (1947), Indonesia (1949), and over 50 sovereign African and Asian nations.`;
    globalDynamics = year === 1991
      ? 'Historic 1991 dissolution of the Soviet Union into 15 independent sovereign republics, ending the Cold War.'
      : 'Nuclear deterrence, the Space Race, decolonization across Asia and Africa, and the 1989–1991 democratic revolutions.';
  } else {
    epochName = 'Contemporary Multipolar World & Sovereign UN Nation-States';
    timeRange = '1992 CE – 2026 CE';
    summary = `World Map in ${label}: Contemporary international borders of sovereign United Nations member states (including post-1991 republics, Timor-Leste 2002, Montenegro 2006, and South Sudan 2011) with active geopolitical flashpoints.`;
    globalDynamics = 'Global digital interconnectedness, rise of multipolar economic centers, and contemporary regional conflicts.';
  }

  return {
    id: `year_${year}`,
    year,
    label,
    epochName,
    timeRange,
    period,
    summary,
    globalDynamics,
    isModernBorders: year >= 1992,
    entities: closest.entities
  };
}

