import { projectCoordinates } from './geoService';

export type MapLayerMode = 'political' | 'physical' | 'culture_trade';

export interface CreditedSource {
  title: string;
  organization: string;
  url: string;
  category: 'History & Encyclopedia' | 'Geopolitics & Conflict' | 'Cartography & Archaeology' | 'Diplomatic Archives';
  description?: string;
}

export interface MountainRangeFeature {
  id: string;
  name: string;
  highestPeak: string;
  elevation: string;
  lengthKm: string;
  region: string;
  geologicalOrigin: string;
  climateAndEcology: string;
  generalOverview: string;
  keyPeaksAndPasses: string[];
  coordinates: [number, number][]; // [lon, lat][]
  projectedPoints: [number, number][];
  svgPath: string;
  labelPos: [number, number];
  historicalSignificance: string;
}

export interface RiverSystemFeature {
  id: string;
  name: string;
  lengthKm: string;
  drainageBasinArea: string;
  source: string;
  outflow: string;
  region: string;
  hydrologyAndEcology: string;
  generalOverview: string;
  keyTributariesAndCities: string[];
  coordinates: [number, number][]; // [lon, lat][]
  projectedPoints: [number, number][];
  svgPath: string;
  labelPos: [number, number];
  civilizationRole: string;
}

export interface PhysiographicFeature {
  id: string;
  name: string;
  type: 'desert' | 'plateau' | 'basin' | 'steppe' | 'tundra';
  region: string;
  areaSqKm: string;
  coordinates: [number, number]; // [lon, lat]
  projectedPos: [number, number];
  elevationOrClimate: string;
  geologyAndTerrain: string;
  ecologyAndFloraFauna: string;
  generalOverview: string;
  keyLandmarksAndOases: string[];
  description: string;
}

export interface TradeRouteFeature {
  id: string;
  name: string;
  type: 'land' | 'maritime';
  activeStartYear: number;
  activeEndYear: number;
  eraLabel: string;
  lengthOrSpan: string;
  color: string;
  commodities: string[];
  keyHubsAndWaypoints: string[];
  transportAndNavigation: string;
  generalOverview: string;
  culturalExchange: string;
  description: string;
  coordinates: [number, number][]; // [lon, lat][]
  projectedPoints: [number, number][];
  svgPath: string;
  labelPos: [number, number];
}

export interface CulturalHubFeature {
  id: string;
  name: string;
  culturalSphere: string;
  sphereColor: string;
  activeStartYear: number;
  activeEndYear: number;
  coordinates: [number, number]; // [lon, lat]
  projectedPos: [number, number];
  role: string;
  traditionsAndExports: string;
  description: string;
}

export interface OceanicFeature {
  id: string;
  name: string;
  shortLabel: string;
  type: 'reef' | 'trench';
  oceanBasin: string;
  maxDepthOrLength: string;
  areaOrSpan: string;
  geologyAndBathymetry: string;
  marineEcologyAndBiodiversity: string;
  generalOverview: string;
  keyFeaturesAndLandmarks: string[];
  humanExplorationAndSignificance: string;
  coordinates: [number, number][]; // [lon, lat][]
  projectedPoints: [number, number][];
  svgPath: string;
  labelPos: [number, number];
}

export interface NaturalBiomePolygon {
  id: string;
  name: string;
  terrainType:
    | 'alpine'
    | 'arid_desert'
    | 'tropical_forest'
    | 'temperate_plains'
    | 'steppe_savanna'
    | 'boreal_tundra'
    | 'polar_ice';
  color: string;
  coordinates: [number, number][]; // [lon, lat][]
  svgPolygonPath: string;
}

export type SelectedPhysicalFeature =
  | { kind: 'mountain'; data: MountainRangeFeature }
  | { kind: 'river'; data: RiverSystemFeature }
  | { kind: 'physiographic'; data: PhysiographicFeature }
  | { kind: 'oceanic'; data: OceanicFeature };

export type SelectedTradeFeature =
  | { kind: 'route'; data: TradeRouteFeature }
  | { kind: 'hub'; data: CulturalHubFeature };

// Helper to convert [lon, lat][] into a smooth SVG polyline path string
function buildProjectedSvgPath(coords: [number, number][]): {
  projectedPoints: [number, number][];
  svgPath: string;
  labelPos: [number, number];
} {
  const projectedPoints = coords.map((c) => projectCoordinates(c[0], c[1]));
  if (projectedPoints.length === 0) {
    return { projectedPoints: [], svgPath: '', labelPos: [500, 260] };
  }
  const svgPath = projectedPoints
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'}${pt[0].toFixed(1)},${pt[1].toFixed(1)}`)
    .join(' ');
  const midIdx = Math.floor(projectedPoints.length / 2);
  return {
    projectedPoints,
    svgPath,
    labelPos: projectedPoints[midIdx] || projectedPoints[0]
  };
}

// ============================================================================
// 1. PHYSICAL GEOGRAPHY LAYER DATA (Topography, Biomes, Mountains & Rivers)
// ============================================================================

export interface CountryPhysicalProfile {
  biomeName: string;
  terrainType:
    | 'alpine'
    | 'arid_desert'
    | 'tropical_forest'
    | 'temperate_plains'
    | 'steppe_savanna'
    | 'boreal_tundra'
    | 'polar_ice'
    | 'mediterranean';
  color: string;
  elevationSummary: string;
}

const POLAR_ICE_WASTELAND_COUNTRIES = new Set([
  'Antarctica',
  'Greenland',
  'Fr. S. Antarctic Lands',
  'Heard I. and McDonald Is.',
  'S. Geo. and the Is.'
]);

const ARID_DESERT_COUNTRIES = new Set([
  'Egypt', 'Libya', 'Algeria', 'Tunisia', 'Morocco', 'Western Sahara', 'Mauritania',
  'Mali', 'Niger', 'Chad', 'Sudan', 'Saudi Arabia', 'Yemen', 'Oman', 'United Arab Emirates',
  'Qatar', 'Kuwait', 'Bahrain', 'Iraq', 'Jordan', 'Syria', 'Israel', 'Palestine',
  'Turkmenistan', 'Uzbekistan', 'Namibia', 'Botswana', 'Somalia', 'Djibouti', 'Eritrea', 'Australia',
  'Cabo Verde'
]);

const ALPINE_HIGHLAND_COUNTRIES = new Set([
  'Nepal', 'Bhutan', 'Tajikistan', 'Kyrgyzstan', 'Afghanistan', 'Iran', 'Armenia',
  'Azerbaijan', 'Georgia', 'Turkey', 'Switzerland', 'Austria', 'Chile', 'Peru',
  'Bolivia', 'Ecuador', 'Colombia', 'Ethiopia', 'Lesotho', 'Rwanda', 'Burundi',
  'Pakistan', 'North Macedonia', 'Albania', 'Montenegro', 'Andorra', 'Liechtenstein'
]);

const TROPICAL_RAINFOREST_COUNTRIES = new Set([
  'Brazil', 'Dem. Rep. Congo', 'Congo', 'Gabon', 'Cameroon', 'Central African Rep.',
  'Equatorial Guinea', 'Indonesia', 'Malaysia', 'Singapore', 'Brunei', 'Papua New Guinea',
  'Philippines', 'Vietnam', 'Laos', 'Cambodia', 'Thailand', 'Myanmar', 'Sri Lanka',
  'Bangladesh', 'Venezuela', 'Guyana', 'Suriname', 'Panama', 'Costa Rica', 'Nicaragua',
  'Honduras', 'Guatemala', 'Belize', 'Cuba', 'Dominican Rep.', 'Haiti', 'Jamaica',
  'Madagascar', 'Ghana', 'Ivory Coast', "Côte d'Ivoire", 'Liberia', 'Sierra Leone', 'Guinea', 'Nigeria',
  'Maldives', 'Grenada', 'Barbados', 'Saint Lucia', 'St. Vin. and Gren.', 'Dominica',
  'Antigua and Barb.', 'St. Kitts and Nevis', 'Mauritius', 'Seychelles', 'Comoros',
  'São Tomé and Príncipe', 'Samoa', 'Tonga', 'Kiribati', 'Micronesia', 'Marshall Is.',
  'Palau', 'Tuvalu', 'Nauru', 'Trinidad and Tobago', 'Fiji', 'Solomon Is.', 'Vanuatu'
]);

const BOREAL_TUNDRA_COUNTRIES = new Set([
  'Russia', 'Canada', 'Norway', 'Sweden', 'Finland', 'Iceland', 'Estonia', 'Latvia', 'Falkland Is.'
]);

const STEPPE_SAVANNA_COUNTRIES = new Set([
  'Mongolia', 'Kazakhstan', 'Argentina', 'Uruguay', 'Paraguay', 'Kenya', 'Tanzania',
  'Uganda', 'Zambia', 'Zimbabwe', 'Mozambique', 'Angola', 'South Africa', 'Senegal',
  'Burkina Faso', 'South Sudan', 'India', 'Mexico'
]);

export function getCountryPhysicalProfile(countryName: string): CountryPhysicalProfile {
  if (POLAR_ICE_WASTELAND_COUNTRIES.has(countryName)) {
    return {
      biomeName: 'Polar Ice Sheet, Glacial Shield & Frozen Tundra',
      terrainType: 'polar_ice',
      color: '#dce8f2', // Glacial frost-white / polar ice blue
      elevationSummary: 'Permanent continental ice caps, glacial plateaus & frozen polar desert (0m – 4,000m)'
    };
  }
  if (ALPINE_HIGHLAND_COUNTRIES.has(countryName)) {
    return {
      biomeName: 'High Cordillera & Alpine Plateau',
      terrainType: 'alpine',
      color: '#a38970', // Warm topographic mountain umber/tan
      elevationSummary: 'High-relief orogenic belts, mountain passes & intermontane plateaus (1,800m – 8,849m)'
    };
  }
  if (ARID_DESERT_COUNTRIES.has(countryName)) {
    return {
      biomeName: 'Arid Erg, Desert Basin & Xeric Plateau',
      terrainType: 'arid_desert',
      color: '#e5cc99', // Topographic desert sand
      elevationSummary: 'Hyper-arid dune seas, rocky hamadas, wadis & alluvial oases (0m – 1,200m)'
    };
  }
  if (TROPICAL_RAINFOREST_COUNTRIES.has(countryName)) {
    return {
      biomeName: 'Equatorial Rainforest & Alluvial Basin',
      terrainType: 'tropical_forest',
      color: '#6da874', // Deep lush basin emerald
      elevationSummary: 'Humid equatorial river basins, dense canopy lowlands & coastal deltas (0m – 600m)'
    };
  }
  if (BOREAL_TUNDRA_COUNTRIES.has(countryName)) {
    return {
      biomeName: 'Boreal Taiga, Glacial Shield & Arctic Tundra',
      terrainType: 'boreal_tundra',
      color: '#b7c9be', // Cool boreal sage-slate
      elevationSummary: 'Glaciated continental shields, permafrost plains & coniferous taiga (50m – 1,500m)'
    };
  }
  if (STEPPE_SAVANNA_COUNTRIES.has(countryName)) {
    return {
      biomeName: 'Continental Steppe, Savanna & Alluvial Plains',
      terrainType: 'steppe_savanna',
      color: '#b7c68b', // Warm steppe olive-ochre
      elevationSummary: 'Semi-arid grasslands, monsoon plains & elevated savanna tablelands (200m – 1,600m)'
    };
  }
  return {
    biomeName: 'Temperate Lowlands & Riverine Valleys',
    terrainType: 'temperate_plains',
    color: '#93bd8b', // Classic physical atlas lowland green
    elevationSummary: 'Fertile temperate plains, rolling uplands & navigable river valleys (0m – 900m)'
  };
}

const RAW_MOUNTAIN_RANGES: Omit<MountainRangeFeature, 'projectedPoints' | 'svgPath' | 'labelPos'>[] = [
  {
    id: 'himalayas',
    name: 'Himalayas & Karakoram',
    highestPeak: 'Mt. Everest / Sagarmatha (8,849 m)',
    elevation: '8,849 m',
    lengthKm: '2,400 km arc',
    region: 'South & Central Asia (India, Nepal, Bhutan, China, Pakistan)',
    geologicalOrigin: 'Cenozoic continental collision of the Indian tectonic plate driving northward into the Eurasian plate (~50 million years ago to present).',
    climateAndEcology: 'Acts as a colossal climatic wall blocking frigid Central Asian katabatic winds from reaching the Indian subcontinent while trapping the Southwest Monsoon; spans subtropical Terai foothills, temperate rhododendron/cedar forests, alpine meadows, and permanent glacial ice caps ("The Third Pole").',
    generalOverview:
      'The **Himalayas and Karakoram** form the highest and most dramatic mountain system on Earth, containing all 14 of the world’s "eight-thousander" peaks (above 8,000 meters), including **Mount Everest (8,849 m)** and **K2 (8,611 m)**. Stretching in a 2,400-kilometer crescent from **Nanga Parbat** above the Indus Gorge in the west to **Namcha Barwa** above the Brahmaputra Gorge in the east, its vast glaciers feed the perennial river systems that sustain nearly two billion people across Asia.',
    keyPeaksAndPasses: [
      'Mount Everest / Sagarmatha / Chomolungma (8,849 m) — Nepal–Tibet border, highest point on Earth',
      'K2 / Godwin-Austen (8,611 m) & Broad Peak (8,051 m) — Karakoram Range, Pakistan–China border',
      'Kangchenjunga (8,586 m), Lhotse (8,516 m), Makalu (8,485 m), and Annapurna I (8,091 m)',
      'Khyber Pass, Karakoram Pass (5,540 m), Nathu La (4,310 m), and Shipki La — historic trans-montane trade and military corridors'
    ],
    coordinates: [
      [73.5, 35.8],
      [76.5, 34.2],
      [79.8, 30.8],
      [84.0, 28.5],
      [86.9, 27.98],
      [90.5, 27.6],
      [95.0, 28.5]
    ],
    historicalSignificance:
      'Formidable topographic barrier separating the Indo-Gangetic plains from the Tibetan Plateau; traversed via high passes by Buddhist pilgrims, Silk Road feeder caravans, and empires, while revered in Hindu, Buddhist, and Bon cosmology as the sacred abode of the gods.'
  },
  {
    id: 'andes',
    name: 'Andes Cordillera',
    highestPeak: 'Mt. Aconcagua (6,961 m)',
    elevation: '6,961 m',
    lengthKm: '7,000 km',
    region: 'Western South America (Venezuela, Colombia, Ecuador, Peru, Bolivia, Chile, Argentina)',
    geologicalOrigin: 'Subduction of the oceanic Nazca and Antarctic plates beneath the South American continental plate along the Peru–Chile Trench (Andean Orogeny).',
    climateAndEcology: 'Divided into the Tropical Andes, Dry Andes, and Wet Andes; creates extreme vertical ecological zonation (*tierra caliente, templada, fría, and helada*), hosting cloud forests, high-altitude *páramo* and *puna* grasslands, the Altiplano endorheic basin, and massive volcanic arcs.',
    generalOverview:
      'Stretching **7,000 kilometers** along the entire western spine of South America, the **Andes Cordillera** is the longest continental mountain range on Earth and the highest outside Asia. Expanding up to 700 km wide across the **Bolivian and Peruvian Altiplano**, the range encompasses active stratovolcanoes, glacial cordilleras, Lake Titicaca (the world’s highest navigable lake at 3,812 m), and immense mineral deposits of silver, gold, copper, and lithium.',
    keyPeaksAndPasses: [
      'Mount Aconcagua (6,961 m) — Mendoza, Argentina; highest peak in the Americas and the Southern & Western Hemispheres',
      'Ojos del Salado (6,893 m, highest active volcano on Earth), Huascarán (6,768 m), and Chimborazo (6,263 m)',
      'The Altiplano & Lake Titicaca Basin — high-altitude plateau shared by Peru and Bolivia',
      'Uspallata / Bermejo Pass (3,830 m) — historic trans-Andean crossing between Argentina and Chile'
    ],
    coordinates: [
      [-74.0, 7.5],
      [-78.5, -1.5],
      [-76.0, -9.5],
      [-71.9, -13.5],
      [-68.0, -17.0],
      [-69.5, -25.0],
      [-70.0, -32.6],
      [-71.5, -41.0],
      [-72.5, -50.0]
    ],
    historicalSignificance:
      'Cradle of Andean civilizations (Chavín, Tiwanaku, Wari, and the Inca Empire / Tawantinsuyu), which mastered vertical archipelago agriculture, freeze-preservation, camelid pastoralism (llamas and alpacas), and the 40,000-km Capac Ñan road network.'
  },
  {
    id: 'rockies',
    name: 'Rocky Mountains',
    highestPeak: 'Mt. Elbert (4,401 m)',
    elevation: '4,401 m',
    lengthKm: '4,800 km',
    region: 'Western North America (Canada & United States)',
    geologicalOrigin: 'Formed primarily during the Laramide Orogeny (80–55 million years ago) via low-angle plate subduction far inland from the Pacific margin, later sculpted by Pleistocene alpine glaciation.',
    climateAndEcology: 'Forms the Continental Divide of North America, separating Pacific and Atlantic/Arctic watersheds; casts a major rain shadow across the Great Plains and supports subalpine coniferous forests (Engelmann spruce, lodgepole pine), alpine tundra, grizzly bears, elk, and bighorn sheep.',
    generalOverview:
      'The **Rocky Mountains** extend over **4,800 kilometers** from northernmost British Columbia in Canada to New Mexico in the southwestern United States. As the easternmost cordillera of the North American Western Cordillera, the Rockies contain the headwaters of the **Colorado, Columbia, Missouri, Rio Grande, Arkansas, and Saskatchewan** river systems.',
    keyPeaksAndPasses: [
      'Mount Elbert (4,401 m), Mount Massive (4,398 m), and Pikes Peak (4,302 m) in the Colorado Rockies',
      'Mount Robson (3,954 m) — highest peak in the Canadian Rockies',
      'South Pass (Wyoming, 2,259 m) — gentle continental divide saddle used by the Oregon, California, and Mormon trails',
      'Kicking Horse Pass & Rogers Pass — dramatic Canadian Pacific Railway crossings'
    ],
    coordinates: [
      [-124.0, 57.5],
      [-118.0, 52.0],
      [-113.5, 47.0],
      [-110.0, 43.5],
      [-106.5, 39.1],
      [-105.5, 35.5]
    ],
    historicalSignificance:
      'Homeland of the Shoshone, Blackfoot, Ute, Arapaho, and Salish nations; shaped 18th–19th century fur-trapping rendezvous trails, gold and silver mining booms, and transcontinental railway engineering.'
  },
  {
    id: 'alps',
    name: 'European Alps',
    highestPeak: 'Mont Blanc (4,808 m)',
    elevation: '4,808 m',
    lengthKm: '1,200 km crescent',
    region: 'Central & Southern Europe (France, Switzerland, Italy, Austria, Germany, Slovenia)',
    geologicalOrigin: 'Alpine Orogeny resulting from the collision of the African and Eurasian tectonic plates closing the ancient Tethys Ocean.',
    climateAndEcology: 'Divides Mediterranean Europe from temperate Central/Northern Europe; features classic glacial U-shaped valleys, glacial lakes (Geneva, Constance, Como), larch and stone pine forests, alpine pastures (*alpage*), and ibex habitats.',
    generalOverview:
      'Stretching **1,200 kilometers** in a sweeping crescent from the Mediterranean coast of France and Monaco through Switzerland and northern Italy into Austria and Slovenia, the **European Alps** are the highest and most densely settled mountain range within Europe. Their glaciers and snowpacks serve as the "Water Tower of Europe," feeding the **Rhine, Rhône, Po, and Danube** river basins.',
    keyPeaksAndPasses: [
      'Mont Blanc / Monte Bianco (4,808 m) — France–Italy border, highest summit in Western Europe',
      'Monte Rosa / Dufourspitze (4,634 m), the Matterhorn (4,478 m), and the Jungfrau (4,158 m)',
      'Brenner Pass (1,370 m), Great St. Bernard Pass (2,469 m), and St. Gotthard Pass (2,106 m) — vital trans-Alpine corridors linking Italy and Northern Europe'
    ],
    coordinates: [
      [6.2, 44.8],
      [7.8, 45.9],
      [10.2, 46.8],
      [12.8, 47.1],
      [15.2, 47.4]
    ],
    historicalSignificance:
      'Strategic northern rampart of the Italian peninsula; famously crossed by Hannibal Barca with war elephants (218 BCE) and Napoleon Bonaparte (1800 CE), while nurturing the fiercely independent Swiss Confederacy around its central passes.'
  },
  {
    id: 'atlas',
    name: 'Atlas Mountains',
    highestPeak: 'Jebel Toubkal (4,167 m)',
    elevation: '4,167 m',
    lengthKm: '2,500 km',
    region: 'Maghreb / Northwest Africa (Morocco, Algeria, Tunisia)',
    geologicalOrigin: 'Formed by the convergence of the African and Eurasian plates along basement rift faults dating back to the breakup of Pangaea.',
    climateAndEcology: 'Traps Atlantic and Mediterranean moisture on its northern slopes (supporting Atlas cedar and cork oak forests) while creating a sharp rain shadow along the northern edge of the Sahara Desert.',
    generalOverview:
      'The **Atlas Mountains** span **2,500 kilometers** across Morocco, Algeria, and Tunisia, subdivided into the **High Atlas, Middle Atlas, Anti-Atlas, Tell Atlas, and Saharan Atlas**. By intercepting humid ocean winds, the range creates the fertile coastal plains and river valleys of the Maghreb ("Island of the West") between the Mediterranean Sea and the Sahara.',
    keyPeaksAndPasses: [
      'Jebel Toubkal (4,167 m) and M’Goun (4,071 m) in the Moroccan High Atlas',
      'Lalla Khedidja (2,308 m) in the Djurdjura Range of the Algerian Tell Atlas',
      'Tizi n’Tichka (2,260 m) & Tizi n’Test — historic caravan passes linking Marrakech with Ouarzazate and the Trans-Saharan trails'
    ],
    coordinates: [
      [-9.0, 30.8],
      [-5.0, 32.5],
      [-1.0, 34.2],
      [4.5, 36.0],
      [9.0, 36.5]
    ],
    historicalSignificance:
      'Historic heartland of the Amazigh (Berber) peoples and cradle of the Almoravid and Almohad empires that ruled North Africa and Al-Andalus.'
  },
  {
    id: 'zagros',
    name: 'Zagros & Alborz Mountains',
    highestPeak: 'Mt. Damavand (5,610 m) / Dena (4,409 m)',
    elevation: '5,610 m',
    lengthKm: '1,600 km',
    region: 'Iranian Plateau, Northern Iraq & Southeastern Anatolia',
    geologicalOrigin: 'Collision of the Arabian tectonic plate with the Eurasian plate, producing Parallel fold-and-thrust belts and salt domes across western Iran.',
    climateAndEcology: 'Semi-arid oak-pistachio steppe forest on western windward slopes receiving Mediterranean winter cyclonic snow, framing the arid interior of the Iranian Plateau.',
    generalOverview:
      'The **Zagros Mountains** form a 1,600-kilometer parallel fold-and-thrust rampart along the western and southwestern flank of the Iranian Plateau, joined in the north by the volcanic **Alborz Range** (crowned by **Mount Damavand, 5,610 m**, the highest volcano in Asia) overlooking the Caspian Sea.',
    keyPeaksAndPasses: [
      'Mount Damavand (5,610 m) — stratovolcano in the Alborz Range northeast of Tehran',
      'Mount Dena (4,409 m) and Zard-Kuh (4,221 m) in the central Zagros',
      'The Persian Gates & Behistun Pass (Kermanshah) — Royal Road corridor linking Babylon and Mesopotamia with Ecbatana and Persepolis'
    ],
    coordinates: [
      [44.5, 37.5],
      [47.0, 34.5],
      [50.2, 32.0],
      [53.0, 29.5],
      [56.2, 27.5]
    ],
    historicalSignificance:
      'Site of some of the world’s earliest Neolithic goat, sheep, and wheat domestication (~8000 BCE) in the "Hilly Flanks" of the Fertile Crescent, and the natural fortress wall defending the Achaemenid, Parthian, Sassanid, and Safavid Persian empires.'
  },
  {
    id: 'urals',
    name: 'Ural Mountains',
    highestPeak: 'Mount Narodnaya (1,895 m)',
    elevation: '1,895 m',
    lengthKm: '2,500 km',
    region: 'North–South Eurasian Boundary (Russia & Northwestern Kazakhstan)',
    geologicalOrigin: 'One of the world’s oldest extant mountain ranges, formed during the Late Paleozoic Uralian Orogeny (300–250 million years ago) when Laurussia collided with Kazakhstania and Siberia.',
    climateAndEcology: 'Transitions from Arctic tundra in the Polar Urals through dense boreal coniferous taiga to continental steppe in the Southern Urals.',
    generalOverview:
      'Running **2,500 kilometers** from the coast of the Arctic Kara Sea south to the Ural River steppe in Kazakhstan, the **Ural Mountains** form the conventional physiographic boundary between **Europe and Asia**. Deeply eroded over hundreds of millions of years, their exposed ancient core contains one of Earth’s richest concentrations of iron ore, copper, gold, platinum, malachite, and emeralds.',
    keyPeaksAndPasses: [
      'Mount Narodnaya (1,895 m) in the Subpolar Urals and Mount Yamantau (1,640 m) in the Southern Urals',
      'Yekaterinburg Lowland Saddle (300–400 m) — gentle topographic gap used by the Siberian Route and Trans-Siberian Railway'
    ],
    coordinates: [
      [65.0, 66.5],
      [60.0, 61.5],
      [59.5, 56.5],
      [58.5, 52.0]
    ],
    historicalSignificance:
      'Geographic threshold of the Russian expansion into Siberia (16th century) and the metallurgical backbone of Russian imperial and Soviet industrial manufacturing.'
  },
  {
    id: 'caucasus',
    name: 'Greater Caucasus Range',
    highestPeak: 'Mt. Elbrus (5,642 m)',
    elevation: '5,642 m',
    lengthKm: '1,200 km',
    region: 'Black Sea to Caspian Sea Isthmus (Russia, Georgia, Azerbaijan, Armenia)',
    geologicalOrigin: 'Alpine tectonic compression between the Arabian and Eurasian plates, uplifting glaciated crystalline ridges and dormant volcanic cones.',
    climateAndEcology: 'Sharp climatic divide between the temperate Pontic–Caspian Steppe to the north and the subtropical Colchis lowlands and Armenian Highland to the south.',
    generalOverview:
      'Spanning **1,200 kilometers** from the Taman Peninsula on the Black Sea to the Absheron Peninsula on the Caspian Sea, the **Greater Caucasus** is a towering wall of glaciated peaks crowned by twin-coned **Mount Elbrus (5,642 m)**, the highest mountain on the European continent.',
    keyPeaksAndPasses: [
      'Mount Elbrus (5,642 m) & Mount Kazbek (5,054 m) — dormant glaciated stratovolcanoes',
      'Darial Gorge ("Alan Gates", 2,379 m) — central mountain pass cutting straight through the Greater Caucasus',
      'Derbent ("Caspian Gates") — narrow 3-km coastal defile between the Caucasus foothills and the Caspian Sea'
    ],
    coordinates: [
      [38.5, 44.2],
      [42.4, 43.3],
      [45.5, 42.2],
      [48.8, 41.0]
    ],
    historicalSignificance:
      'Renowned in antiquity as the "Mountain of Tongues" for preserving dozens of distinct ethnolinguistic groups in its isolated valleys, while its two narrow passes (Darial and Derbent) were fortified by Romans, Persians, and Arabs against nomadic steppe incursions.'
  },
  {
    id: 'ethiopian_highlands',
    name: 'Ethiopian Highlands (Simien & Bale)',
    highestPeak: 'Ras Dashen (4,550 m)',
    elevation: '4,550 m',
    lengthKm: '1,000 km massif',
    region: 'Horn of Africa (Ethiopia & Eritrea)',
    geologicalOrigin: 'Massive Afro-Arabian flood-basalt dome uplifted ~30 million years ago and bisected by the Great East African Rift Valley.',
    climateAndEcology: 'Temperate highland climate (*Dega* and *Woyna Dega*) surrounded by arid lowlands; captures summer Indian Ocean/Atlantic monsoon rains that supply 85% of the Nile’s floodwaters via Lake Tana and the Blue Nile.',
    generalOverview:
      'Often called the **"Roof of Africa,"** the **Ethiopian Highlands** form the largest continuous area of high altitude on the African continent, with flat-topped basaltic plateaus (*ambas*) rising precipitously above 3,000 to 4,550 meters and bisected by the dramatic **Great Rift Valley** and the Blue Nile Gorge.',
    keyPeaksAndPasses: [
      'Ras Dashen (4,550 m) in the Simien Mountains and Tullu Demtu (4,377 m) in the Bale Mountains',
      'Lake Tana (1,788 m) & the Blue Nile (*Abay*) Gorge — over 1,400 meters deep',
      'Flat-topped Amba mountain fortresses (such as Amba Geshen and Magdala)'
    ],
    coordinates: [
      [38.0, 14.5],
      [38.4, 11.5],
      [39.2, 9.0],
      [38.0, 6.5]
    ],
    historicalSignificance:
      'Center of origin for *Coffea arabica* (coffee) and *teff*, headwaters of the Blue Nile, and the natural mountain citadel that preserved Aksumite and Ethiopian independence across millennia.'
  }
];

export const MOUNTAIN_RANGES: MountainRangeFeature[] = RAW_MOUNTAIN_RANGES.map((m) => ({
  ...m,
  ...buildProjectedSvgPath(m.coordinates)
}));

const RAW_MAJOR_RIVERS: Omit<RiverSystemFeature, 'projectedPoints' | 'svgPath' | 'labelPos'>[] = [
  {
    id: 'nile',
    name: 'Nile River (White & Blue Nile)',
    lengthKm: '6,650 km',
    drainageBasinArea: '3,254,555 km²',
    source: 'Lake Victoria / Kagera River (White Nile) & Lake Tana, Ethiopia (Blue Nile)',
    outflow: 'Mediterranean Sea (Nile Delta, Egypt)',
    region: 'Northeast Africa (11 Basin Countries)',
    hydrologyAndEcology: 'Unique exotic river flowing northward for 2,700 km through the hyper-arid Sahara Desert without receiving a single perennial tributary north of the Atbara River; historically driven by the annual summer monsoon flood of the Blue Nile.',
    generalOverview:
      'Stretching **6,650 kilometers** from the equatorial Great Lakes of East Africa and the Ethiopian Highlands to its lush fan-shaped delta on the Mediterranean Sea, the **Nile** is the longest river system on Earth. Its two primary branches—the steady **White Nile** rising in the Lake Victoria basin and the seasonal, silt-laden **Blue Nile** surging down from Lake Tana in Ethiopia—converge at **Khartoum** before traversing the Six Cataracts of Nubia and Upper Egypt.',
    keyTributariesAndCities: [
      'White Nile (via Lake Victoria & the Sudd wetlands), Blue Nile (*Al-Bahr al-Azraq*), and Atbara River',
      'Major Riverine Cities: Jinja, Juba, Khartoum, Omdurman, Aswan, Luxor (Ancient Thebes), Cairo (Memphis), and Alexandria',
      'Six Cataracts of the Nile & the 24,000-km² Nile Delta agricultural heartland'
    ],
    coordinates: [
      [32.9, 0.4],
      [32.2, 4.8],
      [31.6, 9.5],
      [32.5, 15.6],
      [31.8, 19.5],
      [32.9, 24.0],
      [31.2, 30.0],
      [31.0, 31.4]
    ],
    civilizationRole:
      'Called by Herodotus "the gift of the river," the Nile’s predictable annual inundation (*Akhet*) deposited rich black volcanic silt (*Kemet*) across the Sahara corridor, sustaining Pharaonic Egypt, the Kingdom of Kush (Kerma, Napata, Meroë), Hellenistic Alexandria, and modern Egypt and Sudan.'
  },
  {
    id: 'tigris_euphrates',
    name: 'Tigris & Euphrates River System',
    lengthKm: '2,800 km (Euphrates) / 1,850 km (Tigris)',
    drainageBasinArea: '879,790 km²',
    source: 'Armenian Highland & Taurus Mountains (Eastern Anatolia, Turkey)',
    outflow: 'Persian Gulf via the Shatt al-Arab estuary',
    region: 'Mesopotamia & Fertile Crescent (Turkey, Syria, Iraq, Iran)',
    hydrologyAndEcology: 'Fed by spring snowmelt in the Taurus and Zagros mountains; flows southeast across the alluvial Mesopotamian plain and feeds the Mesopotamian Marshes (*Ahwar*) before uniting at the Shatt al-Arab.',
    generalOverview:
      'Rising within 80 kilometers of each other in the eastern Anatolian highlands, the **Euphrates** and **Tigris** flow parallel across Syria and Iraq, defining **Mesopotamia** (literally *"the land between the rivers"* in Greek). Where they approach each other near modern Baghdad, their flat alluvial floodplain allowed early societies to construct intricate gravity-fed canal networks.',
    keyTributariesAndCities: [
      'Greater & Lesser Zab, Diyala, Khabur, and Balikh tributaries; Shatt al-Arab confluence at Al-Qurnah',
      'Historic & Modern Cities: Ur, Uruk, Babylon, Nineveh (Mosul), Seleucia-Ctesiphon, Baghdad, Samarra, and Basra',
      'The Mesopotamian Marshes (*Ahwar* of Southern Iraq) — extensive wetland ecosystem'
    ],
    coordinates: [
      [39.0, 38.5],
      [40.5, 36.0],
      [43.1, 34.5],
      [44.4, 33.3],
      [46.2, 31.5],
      [48.5, 30.0]
    ],
    civilizationRole:
      'Cradle of urban civilization, hydraulic irrigation, wheeled transport, cuneiform writing, and codified law under Sumer, Akkad, Babylonia, Assyria, the Sassanid Empire, and the Abbasid Caliphate.'
  },
  {
    id: 'indus',
    name: 'Indus River (Sindhu)',
    lengthKm: '3,180 km',
    drainageBasinArea: '1,165,000 km²',
    source: 'Tibetan Plateau near Mount Kailash & Lake Manasarovar',
    outflow: 'Arabian Sea (Indus Delta, Sindh, Pakistan)',
    region: 'South Asia & Western Tibet (China, India, Pakistan)',
    hydrologyAndEcology: 'Powered by Karakoram and Himalayan glacial meltwater (the largest glacial mass outside the polar regions) combined with summer monsoon runoff from the five rivers of the Punjab.',
    generalOverview:
      'Originating high on the **Tibetan Plateau** near sacred Mount Kailash, the **Indus River (*Sindhu*)** carves a stupendous gorge between the Himalayas and Karakoram around Nanga Parbat before emerging onto the plains of **Punjab** ("Land of Five Rivers") and **Sindh**, emptying into the Arabian Sea east of Karachi.',
    keyTributariesAndCities: [
      'The Panjnad ("Five Rivers of the Punjab"): Jhelum, Chenab, Ravi, Beas, and Sutlej, plus the Kabul River from the west',
      'Major Basin Cities: Leh, Attock, Multan, Sukkur, Mohenjo-daro, Hyderabad, and Karachi (with Harappa & Lahore on the Ravi)',
      'Supports the Indus Basin Irrigation System — the largest contiguous irrigation network on Earth'
    ],
    coordinates: [
      [81.0, 31.2],
      [75.5, 34.5],
      [72.8, 33.5],
      [70.8, 30.0],
      [68.3, 25.4],
      [67.5, 24.0]
    ],
    civilizationRole:
      'Gave its name to both *Sindh* and *India/Hindustan*; cradle of the Bronze Age Indus Valley (Harappan) Civilization, Vedic geography, Gandharan Buddhism, and the lifeline of modern Pakistan.'
  },
  {
    id: 'ganges',
    name: 'Ganges–Brahmaputra River System',
    lengthKm: '2,525 km (Ganges) / 2,900 km (Brahmaputra)',
    drainageBasinArea: '1,731,334 km²',
    source: 'Gangotri Glacier (Bhagirathi) & Angsi Glacier (Yarlung Tsangpo)',
    outflow: 'Bay of Bengal (Ganges–Brahmaputra Delta & Sundarbans)',
    region: 'Northern & Eastern Indian Subcontinent (India, Nepal, Bangladesh, Tibet)',
    hydrologyAndEcology: 'Combines Himalayan glacial melt with intense Southwest Monsoon rainfall to form the world’s most populous river basin and largest river delta, bordered by the Sundarbans mangrove forest.',
    generalOverview:
      'Descending from the **Western Himalayas** at Devprayag onto the vast **Indo-Gangetic Plain**, the **Ganges (*Ganga*)** flows eastward across northern India before joining the **Yamuna** at Prayagraj and the **Brahmaputra (*Jamuna*)** in Bangladesh to form the **Ganges–Brahmaputra Delta**, the largest deltaic system on the planet.',
    keyTributariesAndCities: [
      'Major Tributaries: Yamuna, Ghaghara, Gandak, Kosi, Son, Hooghly, and Brahmaputra (Padma/Meghna)',
      'Major Basin Cities: Haridwar, Kannauj, Kanpur, Prayagraj (Allahabad), Varanasi, Patna (Ancient Pataliputra), Kolkata, and Dhaka',
      'The Sundarbans — UNESCO tidal halophytic mangrove forest at the mouth of the Bay of Bengal'
    ],
    coordinates: [
      [79.0, 30.1],
      [80.3, 26.5],
      [83.0, 25.3],
      [85.1, 25.6],
      [88.0, 24.5],
      [89.5, 22.2]
    ],
    civilizationRole:
      'Revered as the most sacred river in Hinduism and the demographic, agricultural, and imperial core of the Maurya, Gupta, Pala, Delhi Sultanate, and Mughal empires.'
  },
  {
    id: 'yellow_river',
    name: 'Yellow River (Huang He)',
    lengthKm: '5,464 km',
    drainageBasinArea: '752,546 km²',
    source: 'Bayan Har Mountains (Qinghai–Tibetan Plateau, China)',
    outflow: 'Bohai Sea',
    region: 'Northern China (Ordos Loop, Loess Plateau & North China Plain)',
    hydrologyAndEcology: 'Carries the highest sediment load of any major river on Earth (over 1.6 billion tons of fine wind-blown yellow *loess* silt annually), creating an elevated "suspended river" bed across the North China Plain.',
    generalOverview:
      'The **Yellow River (*Huang He*)** is the second-longest river in China and sixth-longest in the world. Sweeping in a giant northward arc around the **Ordos Desert** before cutting through the **Loess Plateau** and the **Sanmenxia Gorge**, it deposits immense quantities of fertile yellow silt across the North China Plain.',
    keyTributariesAndCities: [
      'Wei River (cradle of the Qin and Han capitals at Xianyang and Chang’an) and Fen River',
      'Historic Capitals & Cities: Lanzhou, Yinchuan, Luoyang, Zhengzhou, Kaifeng, and Jinan',
      'Historic shifts of its lower course between the Bohai Sea and Yellow Sea'
    ],
    coordinates: [
      [97.5, 34.8],
      [103.8, 36.0],
      [108.5, 40.5],
      [110.4, 34.6],
      [114.5, 34.8],
      [118.5, 37.5]
    ],
    civilizationRole:
      'Known as the "Mother River of China" and cradle of the Xia, Shang, Zhou, Qin, Han, and Tang dynasties; mastering its floods inspired early Chinese hydraulic engineering and centralized state administration.'
  },
  {
    id: 'yangtze',
    name: 'Yangtze River (Chang Jiang)',
    lengthKm: '6,300 km',
    drainageBasinArea: '1,808,500 km²',
    source: 'Tanggula Mountains (Geladandong Peak, Qinghai–Tibetan Plateau)',
    outflow: 'East China Sea (at Shanghai)',
    region: 'Central & Eastern China',
    hydrologyAndEcology: 'Longest river in Eurasia and third-longest in the world; drains one-fifth of China’s land area through deep mountain canyons (Tiger Leaping Gorge and the Three Gorges) into the fertile Jiangnan delta.',
    generalOverview:
      'Flowing **6,300 kilometers** from the glaciers of the Tibetan Plateau through the **Sichuan Basin**, the **Three Gorges**, and the central lakes of Hubei, Hunan, and Jiangxi to **Shanghai** on the East China Sea, the **Yangtze (*Chang Jiang*, "Long River")** is the primary east–west commercial and ecological artery of China.',
    keyTributariesAndCities: [
      'Min, Jialing, Han, Xiang, and Gan rivers; Poyang Lake and Dongting Lake flood-retention basins',
      'Major Cities: Yibin, Chongqing, Yichang (Three Gorges), Wuhan, Jiujiang, Nanjing, and Shanghai',
      'Connected to the Yellow River and Beijing via the 1,776-km Grand Canal (first linked under the Sui Dynasty)'
    ],
    coordinates: [
      [94.0, 33.0],
      [100.0, 27.0],
      [106.5, 29.5],
      [111.3, 30.7],
      [114.3, 30.6],
      [118.8, 32.0],
      [121.5, 31.4]
    ],
    civilizationRole:
      'Birthplace of wet-rice domestication (~7000 BCE) and the economic powerhouse of China since the Tang and Song dynasties, supporting nearly a third of China’s population and industrial output.'
  },
  {
    id: 'amazon',
    name: 'Amazon River System',
    lengthKm: '6,400 km',
    drainageBasinArea: '7,050,000 km²',
    source: 'Mantaro / Apurímac & Marañón Headwaters (Peruvian Andes)',
    outflow: 'Equatorial Atlantic Ocean (Brazil)',
    region: 'Northern & Equatorial South America',
    hydrologyAndEcology: 'Largest river on Earth by discharge volume (~209,000 m³/s—greater than the next seven largest rivers combined), supplying 20% of all riverine freshwater entering the world’s oceans and sustaining the Amazon Rainforest.',
    generalOverview:
      'Rising in the glacial cordilleras of the **Peruvian Andes** within 160 km of the Pacific Ocean, the **Amazon River** flows eastward across the entire width of South America to the Atlantic. Fed by over 1,100 tributaries—17 of which are longer than 1,500 kilometers—its seasonal flood pulse (*várzea*) inundates vast stretches of equatorial forest each year.',
    keyTributariesAndCities: [
      'Rio Negro, Madeira, Purus, Japurá, Tapajós, Xingu, Marañón, and Ucayali rivers',
      'Major Riverine Ports: Iquitos (Peru), Leticia, Manaus (at the "Meeting of the Waters"), Santarém, and Belém',
      'Marajó Island at the river’s 330-km-wide Atlantic mouth'
    ],
    coordinates: [
      [-75.5, -10.5],
      [-73.2, -3.7],
      [-66.0, -3.2],
      [-60.0, -3.1],
      [-54.7, -2.4],
      [-50.0, -0.5]
    ],
    civilizationRole:
      'Home to diverse Indigenous Amazonian societies (who engineered *terra preta* dark anthropogenic soils across river bluffs) and the premier biodiversity reservoir of the terrestrial biosphere.'
  },
  {
    id: 'mississippi',
    name: 'Mississippi–Missouri River System',
    lengthKm: '6,275 km',
    drainageBasinArea: '3,220,000 km²',
    source: 'Lake Itasca, Minnesota (Mississippi) & Brower’s Spring, Montana (Missouri)',
    outflow: 'Gulf of Mexico (Mississippi River Delta, Louisiana)',
    region: 'Central North America (31 U.S. States & 2 Canadian Provinces)',
    hydrologyAndEcology: 'Drains the entire interior basin of North America between the Rocky Mountains and the Appalachian Mountains; forms the North American Mississippi Flyway for migratory waterfowl.',
    generalOverview:
      'Together with its longest tributary, the **Missouri River**, and its largest tributary by volume, the **Ohio River**, the **Mississippi River System** forms the fourth-longest river system in the world and the great navigable inland waterway of North America.',
    keyTributariesAndCities: [
      'Missouri, Ohio, Arkansas, Red, Illinois, and Tennessee rivers',
      'Major Cities: Minneapolis–St. Paul, St. Louis (near Ancient Cahokia), Memphis, Baton Rouge, and New Orleans',
      'Mississippi Alluvial Plain ("The Delta") — extraordinarily fertile cotton, soybean, and grain belt'
    ],
    coordinates: [
      [-110.5, 46.5],
      [-101.0, 46.0],
      [-93.2, 44.9],
      [-90.2, 38.6],
      [-90.0, 35.1],
      [-91.2, 30.4],
      [-89.3, 29.2]
    ],
    civilizationRole:
      'Heartland of the pre-Columbian Mississippian mound-building civilization (centered at Cahokia), French exploration corridor, defining axis of the 1803 Louisiana Purchase, and backbone of American agricultural trade.'
  },
  {
    id: 'danube',
    name: 'Danube River',
    lengthKm: '2,850 km',
    drainageBasinArea: '801,463 km²',
    source: 'Black Forest (Schwarzwald, Germany)',
    outflow: 'Black Sea (Danube Delta, Romania & Ukraine)',
    region: 'Central & Southeastern Europe (Flows through 10 countries)',
    hydrologyAndEcology: 'Europe’s second-longest river (after the Volga) and the only major European river flowing west-to-east; cuts through the Carpathian/Balkan mountains at the dramatic Iron Gates gorge.',
    generalOverview:
      'Rising in Germany’s **Black Forest**, the **Danube** flows **2,850 kilometers** southeast through or along the borders of **ten nations**—more than any other river on Earth—linking the Alpine foothills, the Vienna Basin, the Pannonian Plain, the Iron Gates gorge, and the Wallachian Plain to the Black Sea.',
    keyTributariesAndCities: [
      'Four National Capitals on its banks: Vienna (Austria), Bratislava (Slovakia), Budapest (Hungary), and Belgrade (Serbia)',
      'Major Tributaries: Inn, Drava, Tisza, Sava, Morava, Olt, and Prut rivers',
      'The Iron Gates Gorge & the UNESCO Danube Delta biosphere reserve'
    ],
    coordinates: [
      [8.5, 48.0],
      [16.3, 48.2],
      [19.0, 47.5],
      [20.4, 44.8],
      [26.0, 43.8],
      [29.6, 45.2]
    ],
    civilizationRole:
      'Formed the fortified *Limes Danubius* frontier of the Roman Empire, the primary riverine highway of the Habsburg / Austro-Hungarian and Ottoman empires, and today’s Rhine–Main–Danube trans-European shipping artery.'
  },
  {
    id: 'congo_river',
    name: 'Congo River (Lualaba–Congo)',
    lengthKm: '4,700 km',
    drainageBasinArea: '4,014,500 km²',
    source: 'Chambeshi & Lualaba Rivers (East African Rift Highlands, Zambia/DRC)',
    outflow: 'South Atlantic Ocean (at Muanda)',
    region: 'Equatorial Central Africa',
    hydrologyAndEcology: 'Deepest recorded river on Earth (exceeding 220 meters deep in the Lower Congo gorge) and second-largest by discharge volume after the Amazon; crosses the Equator twice, ensuring stable year-round flow.',
    generalOverview:
      'Curving in a vast counter-clockwise arc across the **Congo Basin**, the **Congo River** is Africa’s second-longest river and most powerful hydrological system. Above **Boyoma (Stanley) Falls** it is known as the **Lualaba**; below it forms a 1,700-km navigable highway to **Malebo Pool** ( flanked by Kinshasa and Brazzaville) before plunging through the 350-km **Livingstone Falls** cataracts to the Atlantic.',
    keyTributariesAndCities: [
      'Ubangi, Kasai (Kwa), Sangha, Lomami, and Luvua rivers',
      'Twin Capitals at Malebo Pool: Kinshasa (DR Congo) and Brazzaville (Republic of the Congo), plus Kisangani and Matadi',
      'Cuvette Centrale — the world’s second-largest tropical rainforest and peatland carbon sink'
    ],
    coordinates: [
      [26.5, -8.5],
      [25.2, 0.5],
      [20.5, 2.0],
      [16.5, -2.5],
      [15.3, -4.3],
      [12.4, -6.0]
    ],
    civilizationRole:
      'Central inland trade network of Bantu-speaking civilizations, the Kingdom of Kongo, Luba, and Lunda states, and the ecological heart of Central Africa.'
  },
  {
    id: 'niger_river',
    name: 'Niger River',
    lengthKm: '4,180 km',
    drainageBasinArea: '2,117,700 km²',
    source: 'Guinea Highlands (Fouta Djallon border, Guinea)',
    outflow: 'Gulf of Guinea (Niger Delta, Nigeria)',
    region: 'West Africa (Guinea, Mali, Niger, Benin, Nigeria)',
    hydrologyAndEcology: 'Exhibits a remarkable boomerang course, flowing northeast from the humid Guinea Highlands into the edge of the Sahara Desert to form the fertile **Inner Niger Delta** in Mali before turning sharply southeast to the Atlantic.',
    generalOverview:
      'The **Niger River** is the principal river of West Africa, stretching **4,180 kilometers** in a sweeping northern arc. Its **Inner Niger Delta** between Djenné and Timbuktu transforms each autumn into a lush 30,000-km² wetland oasis inside the semi-arid Sahel before the river flows south to meet its major tributary, the **Benue River**, in Nigeria.',
    keyTributariesAndCities: [
      'Benue River (merging at Lokoja, Nigeria), Bani River, and Sokoto River',
      'Historic & Modern Cities: Bamako, Ségou, Djenné, Timbuktu, Gao, Niamey, Onitsha, and Port Harcourt',
      'The Inner Niger Delta (Macina) & the oil-rich Coastal Niger Delta'
    ],
    coordinates: [
      [-9.5, 9.5],
      [-6.0, 14.0],
      [-3.0, 16.7],
      [0.0, 15.0],
      [4.5, 11.0],
      [6.7, 6.2],
      [6.0, 4.3]
    ],
    civilizationRole:
      'The "Nile of West Africa"—its Great Bend nurtured independent ironworking and rice cultivation at Djenné-Djenno and anchored the golden empires of **Ghana (Wagadou), Mali, and Songhai**.'
  }
];

export const MAJOR_RIVERS: RiverSystemFeature[] = RAW_MAJOR_RIVERS.map((r) => ({
  ...r,
  ...buildProjectedSvgPath(r.coordinates)
}));

export const PHYSIOGRAPHIC_REGIONS: PhysiographicFeature[] = [
  {
    id: 'sahara',
    name: 'SAHARA DESERT',
    type: 'desert',
    region: 'North Africa (Atlantic Ocean to the Red Sea)',
    areaSqKm: '9,200,000 km²',
    coordinates: [12.0, 23.5],
    projectedPos: projectCoordinates(12.0, 23.5),
    elevationOrClimate: 'Hyper-Arid Subtropical Desert (World’s Largest Hot Desert)',
    geologyAndTerrain: 'Composed of ~70% rocky plateaus (*hamadas*) and gravel plains (*regs/serirs*), ~25% shifting sand seas (*ergs* rising up to 180 meters), dry riverbeds (*wadis*), salt flats (*chotts*), and central volcanic massifs (Ahaggar and Tibesti mountains reaching 3,415 m).',
    ecologyAndFloraFauna: 'Extreme diurnal temperature swings and <25 mm annual rainfall; underlain by the Nubian Sandstone Aquifer System supporting date-palm oases, dromedary camels, fennec foxes, addax antelopes, and Saharan cheetahs.',
    generalOverview:
      'Spanning **9.2 million square kilometers** across 11 North African nations—roughly the size of the entire United States or China—the **Sahara** is the largest hot desert on Earth. During the **African Humid Period (c. 9000–3000 BCE)**, orbital monsoon shifts turned the Sahara into a "Green Sahara" of lakes, savannas, and hippopotamus habitats (preserved in Tassili n’Ajjer rock art) before desiccation created the modern desert.',
    keyLandmarksAndOases: [
      'Ahaggar (Hoggar) Mountains in Algeria and Tibesti Massif (Emi Koussi, 3,415 m) in Chad',
      'Grand Erg Oriental, Grand Erg Occidental, Libyan Desert, and the Qattara Depression (-133 m)',
      'Historic Caravan Oases: Siwa, Kufra, Ghadames, Tuat, Taghaza, Bilma, and Agadez'
    ],
    description:
      'Historically functioned not as an impenetrable void, but as an inland "sea of sand" crossed by Tuareg and Amazigh camel caravans trading West African gold and ivory for Saharan salt and Mediterranean goods.'
  },
  {
    id: 'arabian_desert',
    name: 'ARABIAN DESERT (RUB’ AL KHALI)',
    type: 'desert',
    region: 'Arabian Peninsula (Saudi Arabia, Oman, UAE, Yemen, Jordan, Iraq)',
    areaSqKm: '2,330,000 km²',
    coordinates: [46.5, 22.0],
    projectedPos: projectCoordinates(46.5, 22.0),
    elevationOrClimate: 'Hyper-Arid Sand Sea & Limestone Plateau',
    geologyAndTerrain: 'Dominated in the south by the **Rub’ al Khali ("Empty Quarter")**—the largest contiguous sand desert (erg) on Earth (650,000 km²)—linked via the red-sand Ad-Dahna corridor to the An-Nafud desert in the north, bordered by the crystalline Arabian Shield.',
    ecologyAndFloraFauna: 'Linear star and crescent dunes up to 250 m high; habitat of the reintroduced Arabian oryx, sand gazelle, and frankincense/myrrh trees in the monsoon-mist Dhofar and Hadhramaut escarpments.',
    generalOverview:
      'Encompassing almost the entire **Arabian Peninsula**, the **Arabian Desert** stretches 2,100 kilometers from the Syrian Desert in the north to the Indian Ocean escarpments of Yemen and Oman in the south. Beneath its eastern sedimentary basins and the Persian Gulf lies the largest concentration of conventional petroleum and natural gas reserves on Earth.',
    keyLandmarksAndOases: [
      'Rub’ al Khali ("The Empty Quarter") — 650,000 km² of unbroken mega-dunes',
      'An-Nafud Desert, Tuwaiq Escarpment ("Jebel Tuwaiq"), and Wadi Rum',
      'Major Oases: Al-Ahsa (world’s largest natural palm oasis), Al-Ula, Najran, and Liwa Oasis'
    ],
    description:
      'Homeland of Bedouin pastoral nomadism, the ancient Sabaean and Nabataean Frankincense Trail, the rise of Islam in the Hejaz, and modern global energy geopolitics.'
  },
  {
    id: 'gobi_desert',
    name: 'GOBI DESERT & MONGOL STEPPE',
    type: 'desert',
    region: 'East & Central Asia (Southern Mongolia & Northern China)',
    areaSqKm: '1,295,000 km²',
    coordinates: [105.0, 43.5],
    projectedPos: projectCoordinates(105.0, 43.5),
    elevationOrClimate: 'Cold Rain-Shadow Desert & Semi-Arid Steppe (-40°C to +45°C)',
    geologyAndTerrain: 'A rain-shadow desert formed by the Tibetan Plateau and Himalayas blocking Indian Ocean moisture; consists mostly of bare gravel plains (*gobi*) and rocky outcrops rather than sand, interspersed with the Khongoryn Els singing dunes and Flaming Cliffs.',
    ecologyAndFloraFauna: 'Supports wild two-humped Bactrian camels, Gobi bears, snow leopards, Przewalski’s wild horses, and saxaul shrubs; world-famous paleontological site where the first dinosaur eggs and *Velociraptor* fossils were unearthed.',
    generalOverview:
      'The **Gobi Desert** is the sixth-largest desert in the world and the largest in Asia, stretching 1,600 km across southern Mongolia and Inner Mongolia/Gansu in China. To its north lies the vast **Mongolian–Manchurian Grassland Steppe**, while to its southwest lies the **Hexi Corridor** oasis passage.',
    keyLandmarksAndOases: [
      'Hexi (Gansu) Corridor & Dunhuang Crescent Lake Oasis — critical Silk Road bottleneck south of the Gobi',
      'Bayanzag ("Flaming Cliffs") and Nemegt Basin — premier Late Cretaceous fossil beds',
      'Altai Mountains and Khongoryn Els ("Singing Sands") dunes'
    ],
    description:
      'Historic staging ground of nomadic steppe empires—including the Xiongnu, Rouran, Göktürks, Uyghur Khaganate, and Genghis Khan’s Mongol Empire—and the northern flank of the Silk Road.'
  },
  {
    id: 'taklamakan_desert',
    name: 'TAKLAMAKAN DESERT (TARIM BASIN)',
    type: 'desert',
    region: 'Xinjiang, Northwestern China (Central Asia)',
    areaSqKm: '337,000 km²',
    coordinates: [82.5, 38.8],
    projectedPos: projectCoordinates(82.5, 38.8),
    elevationOrClimate: 'Cold Hyper-Arid Endorheic Shifting-Sand Desert',
    geologyAndTerrain: 'Occupies the oval **Tarim Basin**, completely encircled by the Tian Shan mountains to the north, the Pamir Mountains to the west, and the Kunlun Mountains to the south; 85% consists of shifting crescent dunes.',
    ecologyAndFloraFauna: 'Fed by glacial meltwater streams descending from the surrounding peaks into the endorheic Tarim River and ancient Lop Nur salt marsh; rings of fertile oasis towns line its northern and southern rims.',
    generalOverview:
      'One of the world’s largest shifting-sand deserts, the **Taklamakan** sits in the rain-shadowed **Tarim Basin** between the Tian Shan and Kunlun cordilleras. Because its interior dunes were nearly lethal to cross in antiquity, the **Silk Road** split at **Dunhuang** into a Northern Route and a Southern Route skirting its snowmelt-fed perimeter oases before reuniting at **Kashgar**.',
    keyLandmarksAndOases: [
      'Silk Road Perimeter Oases: Kashgar, Khotan (renowned for nephrite jade), Yarkand, Kucha, Turpan, and Loulan',
      'Tarim River (China’s longest inland endorheic river) and the Turpan Depression (-154 m below sea level)'
    ],
    description:
      'Crucible of Silk Road cultural transmission where Chinese, Indian Buddhist, Sogdian, Persian, and Turkic civilizations met across strings of fortified oasis kingdoms.'
  },
  {
    id: 'kalahari_namib',
    name: 'KALAHARI & NAMIB DESERT',
    type: 'desert',
    region: 'Southern Africa (Namibia, Botswana, South Africa)',
    areaSqKm: '981,000 km²',
    coordinates: [20.5, -23.5],
    projectedPos: projectCoordinates(20.5, -23.5),
    elevationOrClimate: 'Coastal Hyper-Arid Desert (Namib) & Semi-Arid Sandy Savanna (Kalahari)',
    geologyAndTerrain: 'The coastal **Namib** (formed by the cold Benguela Atlantic current) is considered the oldest desert on Earth (~55–80 million years), featuring the apricot-red Sossusvlei dunes; inland lies the vast sand-covered **Kalahari Basin**.',
    ecologyAndFloraFauna: 'Contains the unique inland **Okavango Delta** (where the Okavango River empties directly into the Kalahari sands without reaching the ocean), supporting elephants, lions, gemsbok, and ancient *Welwitschia mirabilis* plants.',
    generalOverview:
      'Spanning southwestern Africa, the coastal **Namib Desert** and interior **Kalahari Basin** form a dramatic twin arid system. While the coastal Namib is hyper-arid and watered primarily by Atlantic coastal fog, the Kalahari receives seasonal summer rains and absorbs the entire **Okavango River** into a lush inland wetland.',
    keyLandmarksAndOases: [
      'Okavango Inland Delta & Makgadikgadi Salt Pans in northern Botswana',
      'Sossusvlei & Deadvlei (300-meter-high red iron-oxide sand dunes) and the Skeleton Coast in Namibia',
      'Tsodilo Hills — UNESCO site with over 4,500 San rock paintings spanning tens of thousands of years'
    ],
    description:
      'Ancestral homeland of the San (Bushmen) and Khoikhoi peoples, preserving one of humanity’s oldest continuous hunter-gatherer and rock-art traditions.'
  },
  {
    id: 'atacama_desert',
    name: 'ATACAMA DESERT',
    type: 'desert',
    region: 'Northern Chile & Southern Peru (Pacific Coast of South America)',
    areaSqKm: '105,000 km²',
    coordinates: [-69.2, -23.8],
    projectedPos: projectCoordinates(-69.2, -23.8),
    elevationOrClimate: 'Hyper-Arid Double Rain-Shadow Desert (Driest Non-Polar Desert on Earth)',
    geologyAndTerrain: 'Trapped in a double rain shadow between the high Andes Cordillera to the east and the Pacific Coastal Range / cold Humboldt Current inversion layer to the west; rich in salt flats (*salares*), nitrates, copper, and lithium.',
    ecologyAndFloraFauna: 'Average rainfall in its hyper-arid core is under 1 mm per year; coastal *lomas* fog oases support specialized cacti, while high-altitude salt lagoons host Andean flamingos.',
    generalOverview:
      'Stretching 1,600 kilometers along the Pacific shelf of northern Chile, the **Atacama Desert** is the driest non-polar place on Earth. Its cloudless skies, high altitude, and zero light pollution make it the premier site on the planet for ground-based astronomical observatories (such as ALMA and the Very Large Telescope).',
    keyLandmarksAndOases: [
      'Salar de Atacama & Valle de la Luna (Moon Valley) near San Pedro de Atacama',
      'Chuquicamata & Escondida — the world’s largest copper mining complexes, plus vast lithium brine deposits',
      'Chinchorro Cultural Coast (Arica) — home to the world’s oldest artificial human mummies (~5000 BCE)'
    ],
    description:
      'Site of pre-Columbian oasis caravan routes, the 7,000-year-old Chinchorro mummification tradition, the 19th-century War of the Pacific over nitrate/guano deposits, and modern copper and lithium extraction.'
  },
  {
    id: 'australian_outback',
    name: 'GREAT VICTORIA & AUSTRALIAN OUTBACK',
    type: 'desert',
    region: 'Interior Western & Central Australia',
    areaSqKm: '1,371,000 km² (Combined Arid Zone)',
    coordinates: [131.0, -25.5],
    projectedPos: projectCoordinates(131.0, -25.5),
    elevationOrClimate: 'Subtropical Arid Red-Sand Desert & Spinifex Ecoregion',
    geologyAndTerrain: 'Rests atop the ancient Precambrian Yilgarn and Pilbara cratons (containing some of Earth’s oldest crustal rocks, >3.5 billion years old), featuring parallel longitudinal red sand ridges (*gibber* plains) and monolithic sandstone inselbergs.',
    ecologyAndFloraFauna: 'High biodiversity for an arid biome, supporting spinifex grasslands, eucalyptus mallee, red kangaroos, thorny devils, perentie monitor lizards, and ephemeral salt lakes (such as Lake Eyre / Kati Thanda).',
    generalOverview:
      'Covering the vast interior heart of the Australian continent, the **Australian Deserts**—comprising the **Great Victoria, Great Sandy, Tanami, Simpson, and Gibson** deserts—form the largest arid expanse in the Southern Hemisphere, famed for its iron-oxidized red soils and sacred monoliths.',
    keyLandmarksAndOases: [
      'Uluru (Ayers Rock) & Kata Tjuta (The Olgas) — sacred Pitjantjatjara/Yankunytjatjara sandstone monoliths',
      'Kati Thanda–Lake Eyre Basin — vast endorheic salt sink 15 meters below sea level',
      'Great Artesian Basin — the world’s largest and deepest underground freshwater aquifer'
    ],
    description:
      'Inhabited continuously for over 60,000 years by Indigenous Australian peoples who navigated the arid interior via oral *Songlines* mapping every waterhole and sacred landform.'
  },
  {
    id: 'tibetan_plateau',
    name: 'TIBETAN PLATEAU',
    type: 'plateau',
    region: 'Central & East Asia (Tibet, Qinghai & Northern Ladakh)',
    areaSqKm: '2,500,000 km²',
    coordinates: [88.0, 33.2],
    projectedPos: projectCoordinates(88.0, 33.2),
    elevationOrClimate: 'High Alpine Plateau · Avg. Elevation > 4,500 m ("Roof of the World")',
    geologyAndTerrain: 'Uplifted by the continental collision of the Indian and Eurasian plates; bounded by the Himalayas to the south, the Kunlun Range to the north, and the Karakoram/Pamirs to the west.',
    ecologyAndFloraFauna: 'Alpine tundra, permafrost steppe, and brackish endorheic lakes (Namtso, Qinghai Lake); home to wild yaks, Tibetan antelopes (*chiru*), snow leopards, and black-necked cranes.',
    generalOverview:
      'Known as the **"Roof of the World"** and Earth’s **"Third Pole,"** the **Tibetan Plateau** is the highest and largest plateau on the planet, spanning 2.5 million square kilometers at an average elevation exceeding 4,500 meters. Its glaciers and snowpacks form the **"Water Tower of Asia."**',
    keyLandmarksAndOases: [
      'Headwaters of Asia’s Great Rivers: Indus, Ganges, Brahmaputra (Yarlung Tsangpo), Irrawaddy, Salween, Mekong, Yangtze, and Yellow rivers',
      'Lhasa Valley (3,656 m, site of the Potala Palace & Jokhang Temple) and Sacred Mount Kailash (6,638 m)',
      'Changtang High Steppe & Qaidam Basin'
    ],
    description:
      'Heartland of Tibetan civilization and Vajrayana Buddhism, and the hydrological engine driving the Asian monsoon and river systems that sustain nearly half of humanity.'
  },
  {
    id: 'amazon_basin',
    name: 'AMAZON BASIN',
    type: 'basin',
    region: 'Equatorial South America (9 Nations)',
    areaSqKm: '7,050,000 km²',
    coordinates: [-62.0, -5.5],
    projectedPos: projectCoordinates(-62.0, -5.5),
    elevationOrClimate: 'Humid Equatorial Rainforest Basin',
    geologyAndTerrain: 'Vast sedimentary depression bounded by the Guiana Shield to the north, the Brazilian Shield to the south, and the Andes Cordillera to the west.',
    ecologyAndFloraFauna: 'Contains over half of Earth’s remaining tropical rainforest and an estimated 10% of all known species on the planet, including 16,000 tree species, jaguars, harpy eagles, pink river dolphins, and giant river otters.',
    generalOverview:
      'The **Amazon Basin (*Amazonia*)** is the largest drainage basin in the world, covering roughly 40% of the South American continent. Its dense multi-tiered canopy recycles up to 50–75% of its own rainfall via evapotranspiration, generating "flying rivers" of atmospheric moisture that water much of South America.',
    keyLandmarksAndOases: [
      'Flooded *Várzea* (whitewater) and *Igapó* (blackwater) seasonal floodplain forests',
      'Serra do Divisor, Pico da Neblina, and the Guiana Shield Tepuis on its northern rim',
      'Over 400 Indigenous territories stewarding ancestral forest ecosystems'
    ],
    description:
      'Critical regulator of the global carbon and hydrological cycles, and home to hundreds of Indigenous languages and recently uncovered pre-Columbian geometric earthworks (*geoglyphs*) and garden cities.'
  },
  {
    id: 'eurasian_steppe',
    name: 'PONTIC–CASPIAN & EURASIAN STEPPE',
    type: 'steppe',
    region: 'Central Eurasia (Danube Delta & Ukraine to Kazakhstan & the Altai)',
    areaSqKm: '3,500,000 km²',
    coordinates: [52.0, 49.5],
    projectedPos: projectCoordinates(52.0, 49.5),
    elevationOrClimate: 'Continental Temperate Grassland Corridor',
    geologyAndTerrain: 'Unbroken rolling plains of deep fertile black earth (*chernozem*) and feather-grass prairies stretching across the interior of Eurasia north of the Black, Caspian, and Aral seas.',
    ecologyAndFloraFauna: 'Dominated by drought-resistant steppe grasses, wild horses, saiga antelopes, and steppe eagles; its northern *chernozem* belt is one of the richest grain-producing agricultural zones on Earth.',
    generalOverview:
      'Stretching nearly **8,000 kilometers** from the Pannonian Basin and the **Pontic–Caspian Steppe** (Ukraine and southern Russia) across the **Kazakh Steppe** to the Altai Mountains and Manchuria, the **Eurasian Steppe** functioned for five millennia as a vast grassland superhighway.',
    keyLandmarksAndOases: [
      'Pontic Steppe (north of the Black Sea, crossed by the Dnieper, Don, and Volga rivers)',
      'Kazakh Steppe (*Dala*) and the Southern Ural Gateway',
      'Kurgan burial mounds dotting the horizon from Ukraine to the Altai'
    ],
    description:
      'Site of the earliest domestication of the horse (~3500 BCE), the expansion of Proto-Indo-European languages, and the mobile cavalry confederations of the Scythians, Sarmatians, Huns, Khazars, Kipchaks, and the Mongol Golden Horde.'
  },
  {
    id: 'siberian_taiga',
    name: 'SIBERIAN TAIGA & ARCTIC SHIELD',
    type: 'tundra',
    region: 'Northern Eurasia (Urals to the Pacific Ocean)',
    areaSqKm: '13,100,000 km²',
    coordinates: [105.0, 62.0],
    projectedPos: projectCoordinates(105.0, 62.0),
    elevationOrClimate: 'Subarctic Boreal Coniferous Forest & Permafrost Shield',
    geologyAndTerrain: 'Comprises the flat West Siberian Plain, the ancient volcanic Central Siberian Plateau, and the Verkhoyansk/Chersky mountain ranges; drained northward into the Arctic Ocean by the Ob, Yenisei, and Lena rivers.',
    ecologyAndFloraFauna: 'The largest continuous forest biome on Earth (dominated by Siberian larch, pine, fir, and spruce), harboring Siberian tigers, brown bears, sable, reindeer, and Lake Baikal’s endemic *nerpa* freshwater seal.',
    generalOverview:
      'Covering over **13 million square kilometers** from the Ural Mountains to the Pacific Bering Strait, **Siberia** encompasses the world’s largest boreal forest (*taiga*) and extensive continuous permafrost. In its southern rift valley lies **Lake Baikal**, the oldest (25 million years) and deepest (1,642 m) lake on Earth, holding 22% of the world’s liquid surface freshwater.',
    keyLandmarksAndOases: [
      'Lake Baikal — deepest and most voluminous freshwater lake on Earth',
      'The Three Great Arctic Rivers: Ob–Irtysh, Yenisei–Angara, and Lena',
      'Putorana Plateau & Kamchatka volcanic peninsula'
    ],
    description:
      'Homeland of Indigenous Tungusic, Turkic (Sakha/Yakut), Samoyedic, and Paleo-Siberian peoples; traversed from the 16th century by Russian sable-fur Cossacks and later linked by the 9,289-km Trans-Siberian Railway.'
  },
  {
    id: 'antarctic_polar_ice_sheet',
    name: 'ANTARCTIC ICE SHEET & POLAR WASTELAND',
    type: 'tundra',
    region: 'Antarctica (Southern Polar Continent)',
    areaSqKm: '14,200,000 km²',
    coordinates: [15.0, -77.0],
    projectedPos: projectCoordinates(15.0, -77.0),
    elevationOrClimate: 'Continental Polar Ice Cap & Frozen Polar Desert · Avg. Elevation 2,500 m',
    geologyAndTerrain:
      'Divided by the 3,500-km **Transantarctic Mountains** into the ancient **East Antarctic Craton** (buried beneath an ice sheet up to 4.8 km thick) and the **West Antarctic Rift System**, bordered by the Ross and Filchner–Ronne floating ice shelves.',
    ecologyAndFloraFauna:
      'Earth’s coldest, windiest, and driest continent—technically the world’s largest **polar desert** (<50 mm annual precipitation in the interior). Coastal tundra oases and pack ice support emperor and Adélie penguins, Weddell and leopard seals, Antarctic krill, mosses, and extremophile lichens.',
    generalOverview:
      'Covering **14.2 million square kilometers** around the South Pole, the **Antarctic Polar Ice Sheet** is the largest single mass of ice on Earth, locking up roughly **90% of the world’s glacial ice** and **nearly 70% of all fresh water on the planet**. Beneath the frozen wasteland lie over 400 subglacial lakes (including **Lake Vostok**) and deep subglacial valleys.',
    keyLandmarksAndOases: [
      'East Antarctic Polar Plateau (Dome Argus & Vostok, where temperatures reach -89.2°C / -128.6°F)',
      'Transantarctic Mountains, Vinson Massif (4,892 m) & Mount Erebus (active southernmost volcano)',
      'McMurdo Dry Valleys — hyper-arid ice-free polar tundra valleys with zero snow cover'
    ],
    description:
      'First sighted in 1820 by Bellingshausen, Bransfield, and Palmer; site of the Heroic Age polar expeditions of Roald Amundsen (first to the South Pole, Dec 14, 1911), Robert Falcon Scott, and Ernest Shackleton, and governed since 1959 as an international scientific preserve under the Antarctic Treaty.'
  }
];

// Helper to convert [lon, lat][] into a closed SVG polygon path string
function buildProjectedPolygonPath(coords: [number, number][]): string {
  const projectedPoints = coords.map((c) => projectCoordinates(c[0], c[1]));
  if (projectedPoints.length === 0) return '';
  return (
    projectedPoints
      .map((pt, idx) => `${idx === 0 ? 'M' : 'L'}${pt[0].toFixed(1)},${pt[1].toFixed(1)}`)
      .join(' ') + ' Z'
  );
}

// Legend items for Physical Geography layer
export const PHYSICAL_BIOME_LEGEND_ITEMS = [
  {
    terrainType: 'alpine',
    label: 'Alpine Cordillera & High Plateau',
    color: '#a38970',
    detail: 'Orogenic belts & high plateaus (>1,800m)'
  },
  {
    terrainType: 'arid_desert',
    label: 'Arid Desert & Xeric Basin',
    color: '#e5cc99',
    detail: 'Sand seas (ergs), hamadas & rain-shadow basins'
  },
  {
    terrainType: 'tropical_forest',
    label: 'Equatorial Rainforest Basin',
    color: '#6da874',
    detail: 'Humid tropical canopy & monsoon jungles'
  },
  {
    terrainType: 'steppe_savanna',
    label: 'Continental Steppe & Savanna',
    color: '#b7c68b',
    detail: 'Semi-arid grasslands, prairies & savannas'
  },
  {
    terrainType: 'temperate_plains',
    label: 'Temperate Lowlands & Valleys',
    color: '#93bd8b',
    detail: 'Fertile alluvial plains & temperate forests'
  },
  {
    terrainType: 'boreal_tundra',
    label: 'Boreal Taiga & Subarctic Tundra',
    color: '#b7c9be',
    detail: 'Subarctic coniferous taiga & permafrost plains'
  },
  {
    terrainType: 'polar_ice',
    label: 'Polar Ice Sheet & Frozen Wasteland',
    color: '#dce8f2',
    detail: 'Antarctic & Greenland glacial ice caps & polar tundra'
  }
] as const;

// Actual natural geographic biome extents (independent of modern political borders, clipped to global coastlines)
const RAW_NATURAL_BIOME_POLYGONS: Omit<NaturalBiomePolygon, 'svgPolygonPath'>[] = [
  // ---------------------------------------------------------------------------
  // A. BOREAL TAIGA, SUBARCTIC TUNDRA & POLAR ICE SHEETS (#b7c9be & #dce8f2)
  // ---------------------------------------------------------------------------
  {
    id: 'biome_boreal_north_america',
    name: 'North American Boreal Shield & Arctic Tundra',
    terrainType: 'boreal_tundra',
    color: '#b7c9be',
    coordinates: [
      [-170, 84], [-140, 84], [-100, 84], [-60, 84], [-60, 66], [-52, 51],
      [-66, 47], [-78, 48], [-88, 49], [-97, 50], [-108, 53], [-120, 55],
      [-132, 56], [-145, 60], [-168, 60], [-170, 84]
    ]
  },
  {
    id: 'biome_greenland_iceland',
    name: 'Coastal Greenland & Iceland Subarctic Tundra',
    terrainType: 'boreal_tundra',
    color: '#b7c9be',
    coordinates: [
      [-76, 84], [-10, 84], [-10, 62], [-26, 63], [-45, 59], [-64, 66], [-76, 84]
    ]
  },
  {
    id: 'biome_fennoscandia_siberia_taiga',
    name: 'Fennoscandian & Siberian Boreal Taiga / Arctic Tundra',
    terrainType: 'boreal_tundra',
    color: '#b7c9be',
    coordinates: [
      [4, 60], [10, 59], [18, 60], [28, 59], [38, 58], [50, 57], [60, 56],
      [75, 55], [90, 53], [105, 51], [120, 50], [135, 48], [145, 46],
      [165, 50], [180, 60], [180, 85], [100, 85], [40, 83], [4, 82], [4, 60]
    ]
  },
  {
    id: 'biome_subantarctic_tundra_patagonia_tip',
    name: 'Sub-Antarctic Islands & Tierra del Fuego Subpolar Tundra',
    terrainType: 'boreal_tundra',
    color: '#b7c9be',
    coordinates: [
      [-76, -51], [-55, -50], [80, -48], [80, -60], [-76, -60], [-76, -51]
    ]
  },
  {
    id: 'biome_antarctica_polar_ice_wasteland',
    name: 'Antarctic Continental Ice Sheet & Frozen Polar Wasteland',
    terrainType: 'polar_ice',
    color: '#dce8f2',
    coordinates: [
      [-180, -58], [-120, -58], [-60, -58], [0, -58], [60, -58], [120, -58], [180, -58],
      [180, -90], [120, -90], [60, -90], [0, -90], [-60, -90], [-120, -90], [-180, -90], [-180, -58]
    ]
  },
  {
    id: 'biome_greenland_interior_ice_sheet',
    name: 'Greenland Continental Ice Sheet (Kalaallit Nunaat Ice Cap)',
    terrainType: 'polar_ice',
    color: '#dce8f2',
    coordinates: [
      [-68, 82.5], [-16, 82.5], [-20, 69], [-36, 65], [-46, 61.5], [-52, 68], [-60, 76], [-68, 82.5]
    ]
  },

  // ---------------------------------------------------------------------------
  // B. CONTINENTAL STEPPE, SAVANNA & GRASSLANDS (#b7c68b)
  // ---------------------------------------------------------------------------
  {
    id: 'biome_north_american_great_plains',
    name: 'North American Great Plains & Prairie',
    terrainType: 'steppe_savanna',
    color: '#b7c68b',
    coordinates: [
      [-114, 53], [-96, 50], [-93, 42], [-95, 34], [-98, 26],
      [-105, 28], [-106, 38], [-110, 45], [-114, 53]
    ]
  },
  {
    id: 'biome_eurasian_steppe_belt',
    name: 'Pontic–Caspian, Kazakh & Mongolian Steppe Belt',
    terrainType: 'steppe_savanna',
    color: '#b7c68b',
    coordinates: [
      [27, 46], [35, 50], [48, 53], [62, 55], [78, 54], [95, 52],
      [115, 50], [126, 48], [124, 42], [110, 40], [95, 43], [80, 44],
      [68, 43], [52, 45], [38, 45], [27, 46]
    ]
  },
  {
    id: 'biome_african_sahel_and_savanna',
    name: 'African Sahel, Sudanian & East/Southern Miombo Savanna',
    terrainType: 'steppe_savanna',
    color: '#b7c68b',
    coordinates: [
      [-18, 16], [0, 16], [15, 15], [32, 15], [42, 11], [48, 4],
      [42, -12], [36, -26], [26, -34], [16, -30], [13, -16], [28, -10],
      [29, 4], [15, 7], [-5, 9], [-17, 11], [-18, 16]
    ]
  },
  {
    id: 'biome_south_american_llanos_cerrado_pampas',
    name: 'Orinoco Llanos, Brazilian Cerrado & Argentine Pampas',
    terrainType: 'steppe_savanna',
    color: '#b7c68b',
    coordinates: [
      [-64, -12], [-42, -5], [-35, -10], [-42, -22], [-52, -32],
      [-62, -39], [-66, -35], [-64, -22], [-60, -15], [-64, -12]
    ]
  },
  {
    id: 'biome_indian_deccan_savanna',
    name: 'Deccan Plateau & Central Indian Dry Savanna',
    terrainType: 'steppe_savanna',
    color: '#b7c68b',
    coordinates: [
      [73, 24], [82, 23], [84, 17], [79, 9], [75, 11], [74, 19], [73, 24]
    ]
  },
  {
    id: 'biome_australian_savanna_belt',
    name: 'Northern & Eastern Australian Tropical/Subtropical Savanna',
    terrainType: 'steppe_savanna',
    color: '#b7c68b',
    coordinates: [
      [114, -18], [128, -11], [143, -11], [152, -22], [147, -33],
      [139, -33], [141, -22], [128, -19], [114, -18]
    ]
  },

  // ---------------------------------------------------------------------------
  // C. EQUATORIAL RAINFOREST & ALLUVIAL BASINS (#6da874)
  // ---------------------------------------------------------------------------
  {
    id: 'biome_amazon_orinoco_rainforest',
    name: 'Amazonia, Guiana Shield & Chocó–Mesoamerican Rainforest',
    terrainType: 'tropical_forest',
    color: '#6da874',
    coordinates: [
      [-94, 19], [-82, 16], [-75, 11], [-60, 9], [-48, 1], [-46, -6],
      [-55, -13], [-66, -14], [-76, -11], [-79, -2], [-78, 7], [-85, 11], [-94, 19]
    ]
  },
  {
    id: 'biome_caribbean_atlantic_forest',
    name: 'Caribbean & Brazilian Mata Atlântica Rainforest',
    terrainType: 'tropical_forest',
    color: '#6da874',
    coordinates: [
      [-85, 23], [-60, 18], [-60, 11], [-85, 18], [-85, 23]
    ]
  },
  {
    id: 'biome_congo_guinean_rainforest',
    name: 'Congo Basin & Guinean Equatorial Rainforest',
    terrainType: 'tropical_forest',
    color: '#6da874',
    coordinates: [
      [-14, 9], [-4, 8], [8, 7], [18, 5], [30, 3], [29, -7],
      [18, -8], [11, -5], [8, 3], [-6, 4], [-14, 9]
    ]
  },
  {
    id: 'biome_madagascar_east_forest',
    name: 'Madagascar Lowland Rainforest',
    terrainType: 'tropical_forest',
    color: '#6da874',
    coordinates: [
      [47, -12], [51, -15], [48, -25], [45, -20], [47, -12]
    ]
  },
  {
    id: 'biome_indo_malayan_rainforest',
    name: 'Southeast Asian, Bengal, Western Ghats & Australo-Papuan Rainforest',
    terrainType: 'tropical_forest',
    color: '#6da874',
    coordinates: [
      [88, 26], [98, 27], [108, 23], [124, 19], [130, 5], [152, -5],
      [150, -11], [120, -11], [95, -6], [90, 15], [88, 26]
    ]
  },
  {
    id: 'biome_western_ghats_sri_lanka',
    name: 'Malabar Coast, Western Ghats & Sri Lankan Rainforest',
    terrainType: 'tropical_forest',
    color: '#6da874',
    coordinates: [
      [72.5, 19], [76, 15], [77.5, 8], [82, 6], [82, 10], [75, 11], [72.5, 19]
    ]
  },

  // ---------------------------------------------------------------------------
  // D. ARID ERG, DESERT BASIN & XERIC PLATEAU (#e5cc99)
  // ---------------------------------------------------------------------------
  {
    id: 'biome_sahara_arabian_syrian_desert',
    name: 'Sahara, Somali–Danakil, Sinai, Syrian & Arabian Desert Belt',
    terrainType: 'arid_desert',
    color: '#e5cc99',
    coordinates: [
      [-18, 17], [-17, 28], [-10, 30], [-1, 32], [9, 34], [15, 32],
      [25, 32], [35, 31], [40, 35], [46, 33], [50, 30], [56, 26],
      [60, 22], [54, 15], [51, 11], [47, 5], [40, 12], [32, 16],
      [15, 15.5], [0, 16.5], [-18, 17]
    ]
  },
  {
    id: 'biome_iranian_central_asian_thar_gobi_deserts',
    name: 'Dasht-e Kavir/Lut, Thar, Karakum, Kyzylkum, Taklamakan & Gobi Deserts',
    terrainType: 'arid_desert',
    color: '#e5cc99',
    coordinates: [
      [51, 35], [53, 41], [62, 46], [76, 45], [86, 44], [98, 45],
      [112, 44], [108, 39], [94, 38], [80, 37], [74, 31], [73, 25],
      [68, 24], [61, 25], [54, 28], [51, 35]
    ]
  },
  {
    id: 'biome_namib_kalahari_desert',
    name: 'Namib & Kalahari Arid Basin',
    terrainType: 'arid_desert',
    color: '#e5cc99',
    coordinates: [
      [11.5, -16], [23, -19], [25, -28], [18, -31], [11.5, -16]
    ]
  },
  {
    id: 'biome_north_american_sonoran_mojave_chihuahuan',
    name: 'Great Basin, Mojave, Sonoran & Chihuahuan Deserts',
    terrainType: 'arid_desert',
    color: '#e5cc99',
    coordinates: [
      [-120, 42], [-111, 41], [-103, 32], [-100, 23], [-106, 23],
      [-115, 28], [-118, 35], [-120, 42]
    ]
  },
  {
    id: 'biome_atacama_sechura_patagonian_desert',
    name: 'Atacama, Peruvian Sechura & Patagonian Rain-Shadow Deserts',
    terrainType: 'arid_desert',
    color: '#e5cc99',
    coordinates: [
      [-81, -5], [-74, -15], [-69, -22], [-68, -32], [-67, -40],
      [-65, -51], [-71, -51], [-71, -30], [-76, -15], [-81, -5]
    ]
  },
  {
    id: 'biome_australian_outback_deserts',
    name: 'Great Victoria, Great Sandy, Simpson & Gibson Outback Deserts',
    terrainType: 'arid_desert',
    color: '#e5cc99',
    coordinates: [
      [113, -21], [126, -19], [141, -21], [141, -31], [125, -32], [114, -27], [113, -21]
    ]
  },

  // ---------------------------------------------------------------------------
  // E. FERTILE ALLUVIAL CORRIDORS OVERRIDE (#93bd8b)
  // Restores lush river valleys inside desert/steppe zones (Nile Delta, Mesopotamia, Indus/Ganges)
  // ---------------------------------------------------------------------------
  {
    id: 'biome_nile_delta_levant_corridor',
    name: 'Nile Delta & Mediterranean Levant Fertile Strip',
    terrainType: 'temperate_plains',
    color: '#93bd8b',
    coordinates: [
      [29.5, 30.0], [32.5, 30.0], [35.8, 33.5], [36.5, 36.8], [34.0, 36.5], [29.5, 31.8], [29.5, 30.0]
    ]
  },
  {
    id: 'biome_mesopotamian_alluvial_plain',
    name: 'Tigris–Euphrates Alluvial Floodplain',
    terrainType: 'temperate_plains',
    color: '#93bd8b',
    coordinates: [
      [42.5, 35.5], [45.5, 34.0], [48.8, 30.2], [46.8, 29.8], [43.5, 32.5], [42.5, 35.5]
    ]
  },
  {
    id: 'biome_indo_gangetic_alluvial_plain',
    name: 'Indo-Gangetic & Punjab Alluvial Plains',
    terrainType: 'temperate_plains',
    color: '#93bd8b',
    coordinates: [
      [71.5, 32.5], [77.5, 30.5], [84.0, 27.5], [89.5, 25.5],
      [88.0, 23.0], [81.0, 24.5], [75.0, 28.0], [71.5, 30.0], [71.5, 32.5]
    ]
  },

  // ---------------------------------------------------------------------------
  // F. ALPINE CORDILLERA & HIGH PLATEAU (#a38970)
  // ---------------------------------------------------------------------------
  {
    id: 'biome_north_american_cordillera',
    name: 'Rocky Mountains, Coast Ranges & Sierra Madre Cordillera',
    terrainType: 'alpine',
    color: '#a38970',
    coordinates: [
      [-152, 63], [-136, 62], [-122, 58], [-113, 51], [-105, 40],
      [-104, 30], [-97, 19], [-92, 15], [-100, 17], [-108, 26],
      [-112, 34], [-116, 44], [-125, 52], [-140, 60], [-152, 63]
    ]
  },
  {
    id: 'biome_andes_cordillera_spine',
    name: 'Andes Cordillera & Bolivian–Peruvian Altiplano',
    terrainType: 'alpine',
    color: '#a38970',
    coordinates: [
      [-73, 11], [-75, 5], [-77, -2], [-74, -11], [-66, -16],
      [-66, -24], [-69, -34], [-71, -44], [-73, -54], [-75, -46],
      [-72, -32], [-70, -20], [-77, -12], [-80, -3], [-77, 5], [-73, 11]
    ]
  },
  {
    id: 'biome_atlas_mountains_strip',
    name: 'High, Middle & Tell Atlas Cordillera',
    terrainType: 'alpine',
    color: '#a38970',
    coordinates: [
      [-10, 30.2], [-4, 32.0], [2, 34.5], [9, 36.2], [8, 37.2],
      [0, 35.8], [-6, 33.8], [-10, 31.2], [-10, 30.2]
    ]
  },
  {
    id: 'biome_european_alps_carpathians_balkans',
    name: 'Pyrenees, European Alps, Apennines, Carpathians & Balkans',
    terrainType: 'alpine',
    color: '#a38970',
    coordinates: [
      [5.5, 44.2], [7.5, 46.8], [13.5, 47.8], [19.5, 49.2], [26.0, 47.0],
      [25.5, 42.0], [21.5, 39.5], [19.0, 42.5], [14.5, 45.8], [8.5, 44.5], [5.5, 44.2]
    ]
  },
  {
    id: 'biome_anatolian_caucasus_zagros_plateau',
    name: 'Anatolian, Greater Caucasus, Armenian & Zagros–Alborz Highlands',
    terrainType: 'alpine',
    color: '#a38970',
    coordinates: [
      [29, 37], [36, 41], [42, 43.8], [49, 41], [56, 37.5],
      [51, 34.5], [57, 27.5], [52, 27.5], [46, 33], [40, 37.5], [32, 36.5], [29, 37]
    ]
  },
  {
    id: 'biome_hindu_kush_pamir_himalaya_tibet_tianshan',
    name: 'Hindu Kush, Pamirs, Karakoram, Himalayas, Tibetan Plateau, Tian Shan & Altai',
    terrainType: 'alpine',
    color: '#a38970',
    coordinates: [
      [63, 34], [69, 38], [74, 42], [85, 44], [96, 49], [99, 46],
      [88, 42], [78, 40], [82, 36.5], [96, 36.5], [103, 32], [98, 27],
      [88, 27.2], [79, 30.2], [73, 34], [66, 31], [63, 34]
    ]
  },
  {
    id: 'biome_ethiopian_east_african_highlands',
    name: 'Ethiopian Massif & East African Rift Highlands',
    terrainType: 'alpine',
    color: '#a38970',
    coordinates: [
      [36.5, 14.8], [40.5, 11.5], [41.5, 7.5], [37.5, -3.5], [34.5, -9.5],
      [29.0, -3.5], [34.5, 5.5], [36.0, 10.5], [36.5, 14.8]
    ]
  },
  {
    id: 'biome_ural_cordillera_strip',
    name: 'Ural Mountain Range',
    terrainType: 'alpine',
    color: '#a38970',
    coordinates: [
      [57.5, 51.5], [59.0, 60.0], [64.5, 67.0], [66.5, 66.5], [61.0, 59.5], [59.5, 51.5], [57.5, 51.5]
    ]
  }
];

export const NATURAL_BIOME_POLYGONS: NaturalBiomePolygon[] = RAW_NATURAL_BIOME_POLYGONS.map(
  (poly) => ({
    ...poly,
    svgPolygonPath: buildProjectedPolygonPath(poly.coordinates)
  })
);

// ============================================================================
// 1B. FAMOUS CORAL REEFS & DEEP OCEANIC TRENCHES (Clickable in Physical Layer)
// ============================================================================

const RAW_OCEANIC_FEATURES: Omit<OceanicFeature, 'projectedPoints' | 'svgPath' | 'labelPos'>[] = [
  {
    id: 'ocean_mariana_trench',
    name: 'Mariana Trench & Challenger Deep',
    shortLabel: 'Mariana Trench (-10,984m)',
    type: 'trench',
    oceanBasin: 'Western North Pacific Ocean (East of the Mariana Islands)',
    maxDepthOrLength: '10,984 m (36,037 ft) Max Depth · 2,550 km Length',
    areaOrSpan: 'Crescent subduction scar ~69 km wide',
    geologyAndBathymetry:
      'Formed at a convergent plate boundary where the ancient, dense **Pacific Plate** (~170 million years old) subducts steeply beneath the smaller **Mariana Plate**. At its southern floor lies the **Challenger Deep**, the deepest known point in Earth’s seabed—deeper below sea level than Mount Everest rises above it.',
    marineEcologyAndBiodiversity:
      'Despite crushing hydrostatic pressures exceeding **1,086 bar (15,750 psi)**, pitch darkness, and near-freezing water (1–4°C), the hadal zone supports barophilic microorganisms, giant single-celled **xenophyophores**, amphipods (*Hirondellea gigas*), holothurian sea cucumbers, and the **Mariana snailfish** (*Pseudoliparis swirei*), fed by marine snow and serpentinite hydrothermal vents.',
    generalOverview:
      'Curving for **2,550 kilometers** across the western Pacific Ocean floor east of Guam and the Northern Mariana Islands, the **Mariana Trench** is the deepest oceanic trench on Earth. Its southernmost slot, **Challenger Deep**, plunges nearly **11 kilometers** beneath the ocean surface into the hadalpelagic zone.',
    keyFeaturesAndLandmarks: [
      'Challenger Deep (-10,984 m) — deepest surveyed trough on Earth’s crust',
      'Sirena Deep (-10,714 m) — second-deepest point in the Mariana Trench',
      'Daikoku & Champagne Submarine Mud Volcanoes — venting liquid carbon dioxide and sulfur along the Mariana Arc'
    ],
    humanExplorationAndSignificance:
      'First sounded by the British Royal Navy survey ship *HMS Challenger* in **1875**; first descended by humans on **January 23, 1960**, when **Jacques Piccard and Don Walsh** reached the seafloor aboard the bathyscaphe *Trieste*, followed by **James Cameron** (*Deepsea Challenger*, 2012) and **Victor Vescovo** (*Limiting Factor*, 2019).',
    coordinates: [
      [147.8, 19.5],
      [147.2, 16.5],
      [145.6, 13.5],
      [142.2, 11.35],
      [140.5, 11.1]
    ]
  },
  {
    id: 'ocean_puerto_rico_trench',
    name: 'Puerto Rico Trench & Milwaukee Deep',
    shortLabel: 'Puerto Rico Trench (-8,376m)',
    type: 'trench',
    oceanBasin: 'Boundary of the Atlantic Ocean & Caribbean Sea',
    maxDepthOrLength: '8,376 m (27,480 ft) Max Depth · 800 km Length',
    areaOrSpan: 'Deepest trough in the entire Atlantic Ocean basin',
    geologyAndBathymetry:
      'Located along the complex oblique transform-subduction boundary where the **North American Plate** slides westward and subducts at a highly oblique angle beneath the **Caribbean Plate**, producing the **most negative gravity anomaly on Earth** (-380 milligals).',
    marineEcologyAndBiodiversity:
      'Hosts specialized Atlantic hadal and abyssal benthic communities, including blind cusk-eels (*Abyssobrotula galatheae*, recorded at 8,370 m), glass sponges, and chemosynthetic cold-seep communities along fault scarps.',
    generalOverview:
      'Running **800 kilometers** parallel to the northern coast of Puerto Rico and the Virgin Islands, the **Puerto Rico Trench** marks the oceanographic boundary between the **Caribbean Sea** and the **North Atlantic Ocean**, containing the **Milwaukee Deep (8,376 m)**—the deepest point anywhere in the Atlantic.',
    keyFeaturesAndLandmarks: [
      'Milwaukee Deep / Brownson Deep (-8,376 m) — deepest point in the Atlantic Ocean',
      'Carbonate Platform Escarpment — sheer submarine cliffs dropping over 6,000 meters north of San Juan',
      'Associated with the greatest free-air negative gravitational anomaly on the planet'
    ],
    humanExplorationAndSignificance:
      'Named after the *USS Milwaukee*, which sounded the Milwaukee Deep in **1939**; intensively mapped by NOAA *Okeanos Explorer* multibeam sonar and explored in **2018** by the manned submersible *Limiting Factor* as the first dive of the Five Deeps Expedition.',
    coordinates: [
      [-69.5, 19.8],
      [-66.5, 19.7],
      [-63.5, 19.2],
      [-60.8, 18.0]
    ]
  },
  {
    id: 'ocean_peru_chile_trench',
    name: 'Peru–Chile (Atacama) Trench',
    shortLabel: 'Atacama Trench (-8,065m)',
    type: 'trench',
    oceanBasin: 'Eastern South Pacific Ocean (Off Peru & Chile)',
    maxDepthOrLength: '8,065 m (26,460 ft) Max Depth · 5,900 km Length',
    areaOrSpan: 'Longest continuous oceanic trench on Earth (~590,000 km²)',
    geologyAndBathymetry:
      'Created by the active subduction of the oceanic **Nazca Plate** beneath the continental **South American Plate** at ~7–8 cm per year—the same tectonic engine that uplifts the **Andes Cordillera** and triggers the world’s most powerful megathrust earthquakes (including the 1960 Mw 9.5 Valdivia earthquake).',
    marineEcologyAndBiodiversity:
      'Because the cold, nutrient-rich **Humboldt (Peru) Current** upwells directly above the trench, massive quantities of organic plankton sink into the abyss, making the Atacama Trench one of the most biologically productive hadal trenches on Earth, teeming with three endemic species of translucent hadal snailfish.',
    generalOverview:
      'Stretching **5,900 kilometers** roughly 160 kilometers off the Pacific coast of Peru and Chile, the **Peru–Chile Trench (Atacama Trench)** is the longest oceanic trench in the world. Combined with the adjacent **Andes Mountains (6,961 m)**, it creates a staggering vertical relief of **over 15,000 meters (15 km)** within a horizontal distance of less than 300 kilometers.',
    keyFeaturesAndLandmarks: [
      'Richards Deep (-8,065 m) — deepest point of the trench off Antofagasta, Chile',
      'Nazca Ridge subduction zone & the Humboldt Current upwelling ecosystem above the trench'
    ],
    humanExplorationAndSignificance:
      'Critical geophysical laboratory for studying subduction-zone seismology, tsunami generation, and the coupling between surface coastal upwelling and deep-sea carbon sequestration.',
    coordinates: [
      [-81.8, -6.5],
      [-79.5, -12.5],
      [-73.5, -18.5],
      [-71.8, -24.0],
      [-72.8, -32.0],
      [-74.5, -39.5]
    ]
  },
  {
    id: 'ocean_java_sunda_trench',
    name: 'Java (Sunda) Trench',
    shortLabel: 'Java Trench (-7,290m)',
    type: 'trench',
    oceanBasin: 'Northeastern Indian Ocean (South of Sumatra & Java)',
    maxDepthOrLength: '7,290 m (23,917 ft) Max Depth · 3,200 km Length',
    areaOrSpan: 'Deepest point of the Indian Ocean basin',
    geologyAndBathymetry:
      'Marks the convergent subduction boundary where the **Indo-Australian Plate** plunges beneath the **Sunda Plate** (part of the Eurasian Plate), forming the volcanic **Sunda Arc** (including Krakatoa, Tambora, and Merapi) across Indonesia.',
    marineEcologyAndBiodiversity:
      'Home to recently filmed hadal stalked ascidians, gelatinous ctenophores, Dumbo octopuses (*Grimpoteuthis*), and deep-sea amphipods adapted to the Indian Ocean abyssal floor.',
    generalOverview:
      'Extending **3,200 kilometers** in a sweeping arc from the Andaman Islands past **Sumatra, Java, and the Lesser Sunda Islands**, the **Java (Sunda) Trench** is the deepest feature of the **Indian Ocean**, reaching **7,290 meters** south of Bali and Java.',
    keyFeaturesAndLandmarks: [
      'Sunda Deep (-7,290 m) — deepest point in the Indian Ocean (~305 km off Java)',
      'Sunda Megathrust Fault — geological source of the 2004 Indian Ocean earthquake and volcano chain of Indonesia'
    ],
    humanExplorationAndSignificance:
      'First reached by a crewed submersible in **April 2019** when Victor Vescovo piloted the *DSV Limiting Factor* to the bottom of the Java Trench.',
    coordinates: [
      [94.5, 4.5],
      [98.5, -1.5],
      [104.0, -7.2],
      [111.5, -10.5],
      [118.5, -11.5]
    ]
  },
  {
    id: 'ocean_tonga_kermadec_trench',
    name: 'Tonga–Kermadec Trench & Horizon Deep',
    shortLabel: 'Tonga Trench (-10,882m)',
    type: 'trench',
    oceanBasin: 'Southwestern Pacific Ocean (North of New Zealand to Tonga)',
    maxDepthOrLength: '10,882 m (35,702 ft) Max Depth · 2,500 km Length',
    areaOrSpan: 'Second-deepest trench on Earth & deepest point in the Southern Hemisphere',
    geologyAndBathymetry:
      'Site of the **fastest tectonic plate convergence on Earth** (up to **24 cm / 9.4 inches per year**), as the Pacific Plate subducts westward beneath the Tonga and Kermadec microplates.',
    marineEcologyAndBiodiversity:
      'Supports dense hydrothermal vent ecosystems along the adjacent Lau Basin and Kermadec Arc, hosting Yeti crabs, vent mussels, and supergiant amphipods (*Alicella gigantea* reaching 34 cm long).',
    generalOverview:
      'Stretching **2,500 kilometers** from the Kermadec Islands northeast of New Zealand to Samoa, the **Tonga–Kermadec Trench** contains the **Horizon Deep (10,882 m)**—the **second-deepest point on Earth** (after Challenger Deep) and the deepest point in the Southern Hemisphere.',
    keyFeaturesAndLandmarks: [
      'Horizon Deep (-10,882 m) in the Tonga Trench & Scholl Deep (-10,047 m) in the Kermadec Trench',
      'Apollo 13 RTG site — where the Apollo 13 lunar module’s intact plutonium heat source came to rest in 1970'
    ],
    humanExplorationAndSignificance:
      'Horizon Deep was named after the Scripps Institution of Oceanography research vessel *R/V Horizon*, which discovered the 10,800+ meter depth in **December 1952**.',
    coordinates: [
      [-173.2, -16.0],
      [-174.5, -21.2],
      [-176.2, -26.5],
      [-177.8, -32.5]
    ]
  },
  {
    id: 'ocean_great_barrier_reef',
    name: 'The Great Barrier Reef',
    shortLabel: 'Great Barrier Reef',
    type: 'reef',
    oceanBasin: 'Coral Sea (Off the Coast of Queensland, Australia)',
    maxDepthOrLength: '2,300 km (1,429 mi) Length',
    areaOrSpan: '344,400 km² Marine Park (~2,900 Individual Reefs & 900 Islands)',
    geologyAndBathymetry:
      'Built over the past 500,000 years (with the modern living reef structure growing since the last glacial sea-level rise ~8,000–10,000 years ago) atop the shallow continental shelf of northeastern Australia by billions of calcium-carbonate-secreting coral polyps (*Scleractinia*).',
    marineEcologyAndBiodiversity:
      'The world’s largest living structure—visible from Earth orbit—supporting **over 600 species of hard and soft coral**, **1,625 species of fish**, **3,000 species of mollusks**, six of the world’s seven marine turtle species, dugongs, manta rays, whale sharks, and humpback whale calving grounds.',
    generalOverview:
      'Stretching **2,300 kilometers** along the continental shelf of **Queensland, Australia**, from the Torres Strait in the north to Lady Elliot Island in the south, the **Great Barrier Reef** is the largest coral reef ecosystem on Earth, comprising a vast mosaic of ribbon reefs, lagoonal patch reefs, coral cays, and continental islands.',
    keyFeaturesAndLandmarks: [
      'Ribbon Reefs, Osprey Reef & Raine Island (the world’s largest green sea turtle rookery) in the Far North',
      'Whitsunday Islands, Heart Reef & Hardy Reef in the central Coral Sea lagoon',
      'Heron Island, Lady Musgrave Island & Lady Elliot Island in the Capricorn–Bunker Group'
    ],
    humanExplorationAndSignificance:
      'Stewarded for over 60,000 years by more than 70 **Aboriginal and Torres Strait Islander Traditional Owner clan groups**; navigated by **Captain James Cook** in 1770 (whose ship *HMS Endeavour* ran aground on Endeavour Reef) and inscribed as a **UNESCO World Heritage Site in 1981**.',
    coordinates: [
      [143.5, -11.0],
      [145.6, -14.8],
      [147.8, -18.5],
      [150.5, -21.2],
      [152.2, -23.8]
    ]
  },
  {
    id: 'ocean_mesoamerican_reef',
    name: 'Mesoamerican Barrier Reef (Great Mayan Reef)',
    shortLabel: 'Mesoamerican Reef',
    type: 'reef',
    oceanBasin: 'Western Caribbean Sea (Mexico, Belize, Guatemala, Honduras)',
    maxDepthOrLength: '1,100 km (680 mi) Length',
    areaOrSpan: 'Largest barrier reef in the Western Hemisphere',
    geologyAndBathymetry:
      'Fringes the karst limestone shelf of the **Yucatán Peninsula** and the Belizean/Honduran continental margin, featuring three large offshore coral atolls (Turneffe Atoll, Lighthouse Reef, and Glover’s Reef) and drowned Pleistocene karst sinkholes (*cenotes*).',
    marineEcologyAndBiodiversity:
      'Home to **65 species of stony coral**, **over 500 species of fish**, the world’s largest aggregation of **whale sharks** (at Gladden Spit), West Indian manatees, American saltwater crocodiles, and extensive coastal mangrove nurseries and seagrass beds.',
    generalOverview:
      'Extending **1,100 kilometers** from **Isla Contoy** at the northern tip of Mexico’s Yucatán Peninsula south along the Riviera Maya, **Belize**, Guatemala, and the **Bay Islands of Honduras**, the **Mesoamerican Barrier Reef** is the second-longest barrier reef system in the world.',
    keyFeaturesAndLandmarks: [
      'The Great Blue Hole (Lighthouse Reef, Belize) — a circular submarine karst sinkhole 318 m wide and 124 m deep',
      'Belize Barrier Reef Reserve System (UNESCO World Heritage Site) & Hol Chan Marine Reserve',
      'Cozumel Reefs, Sian Ka’an Biosphere Reserve, and Roatán / Utila in the Bay Islands'
    ],
    humanExplorationAndSignificance:
      'Served for millennia as a vital coastal canoe-trade corridor and marine food source for the **Maya Civilization**; made world-famous in **1971** when **Jacques-Yves Cousteau** sailed the *Calypso* into the Great Blue Hole.',
    coordinates: [
      [-86.8, 21.2],
      [-87.3, 19.2],
      [-87.8, 17.3],
      [-86.5, 16.3]
    ]
  },
  {
    id: 'ocean_red_sea_reef',
    name: 'Red Sea Coral Reef System',
    shortLabel: 'Red Sea Coral Reef',
    type: 'reef',
    oceanBasin: 'Red Sea Basin (Between Northeast Africa & the Arabian Peninsula)',
    maxDepthOrLength: '4,000 km (2,485 mi) of Fringing & Offshore Reefs',
    areaOrSpan: 'Spans the entire eastern and western margins of the Red Sea',
    geologyAndBathymetry:
      'Formed along the steep fault escarpments of the young **Red Sea Rift** (where the African and Arabian plates are actively spreading apart to form a nascent ocean). Because zero perennial rivers flow into the Red Sea, the water has **zero silt runoff** and extraordinary crystal-clear visibility.',
    marineEcologyAndBiodiversity:
      'Supports **over 300 hard coral species** and **1,200 fish species** (nearly 15% of which are endemic and found nowhere else on Earth). Red Sea corals exhibit unique evolutionary **super-resilience to high water temperatures and high salinity** (40–41 PSU).',
    generalOverview:
      'Lining both coasts of the **Red Sea** from the **Gulf of Aqaba and Gulf of Suez** south to the **Bab-el-Mandeb**, the **Red Sea Coral Reef** is the world’s northernmost tropical reef ecosystem and a critical scientific refuge ("Hope Spot") for studying coral adaptation to climate warming.',
    keyFeaturesAndLandmarks: [
      'Ras Mohammed National Park & the Straits of Tiran at the southern tip of the Sinai Peninsula',
      'Daedalus, Brothers, and Elphinstone offshore pinnacle reefs & the Sanganeb Atoll (Sudan)',
      'Al-Wajh Bank, Farasan Islands, and the Gulf of Aqaba "Super-Coral" refugia'
    ],
    humanExplorationAndSignificance:
      'Site of the first scientific marine biological expedition in history (led by **Peter Forsskål** in 1761–1763) and the site of **Jacques Cousteau’s Conshelf II** underwater habitat experiment in 1963.',
    coordinates: [
      [34.5, 27.8],
      [36.5, 24.0],
      [38.5, 20.5],
      [40.8, 16.8]
    ]
  },
  {
    id: 'ocean_coral_triangle_new_caledonia',
    name: 'Coral Triangle & New Caledonia Barrier Reef',
    shortLabel: 'Coral Triangle & Reefs',
    type: 'reef',
    oceanBasin: 'Indo-Pacific & Southwest Pacific (Indonesia, Philippines, Papua New Guinea, Solomon Is. & New Caledonia)',
    maxDepthOrLength: '1,500 km New Caledonia Double-Barrier Reef · 5.7M km² Coral Triangle',
    areaOrSpan: 'Global Epicenter of Marine Biodiversity ("The Amazon of the Seas")',
    geologyAndBathymetry:
      'Encompasses the tectonic crossroads of the Pacific, Indo-Australian, and Eurasian plates—featuring volcanic island arcs, deep inter-island basins (Banda and Sulawesi seas), and the **New Caledonia Barrier Reef**, which encloses a 24,000-km² lagoon.',
    marineEcologyAndBiodiversity:
      'Known as the **"Amazon of the Seas,"** this region hosts **76% of all known coral species on Earth (over 600 species)**, **37% of the world’s coral reef fish species (over 2,200 species)**, chambered nautiluses, pygmy seahorses, and blue whale migration corridors.',
    generalOverview:
      'Spanning the tropical waters of **eastern Indonesia (Raja Ampat, Wakatobi, Komodo), the Philippines (Tubbataha Reef), Papua New Guinea, the Solomon Islands, and the New Caledonia Barrier Reef**, this Indo-Pacific belt holds the highest concentration of marine life on the planet.',
    keyFeaturesAndLandmarks: [
      'Raja Ampat Archipelago (West Papua) — holds the world record for the highest marine species diversity on a single reef',
      'Tubbataha Reefs Natural Park (Sulu Sea, Philippines) & Bunaken / Wakatobi Marine Parks',
      'Lagoons of New Caledonia (UNESCO World Heritage double-barrier reef system)'
    ],
    humanExplorationAndSignificance:
      'Studied by naturalist **Alfred Russel Wallace** during his 1854–1862 Malay Archipelago expedition and protected today by the six-nation Coral Triangle Initiative.',
    coordinates: [
      [120.5, 8.5],
      [127.5, 2.0],
      [131.5, -1.5],
      [148.0, -7.5],
      [164.5, -20.5]
    ]
  }
];

export const OCEANIC_FEATURES: OceanicFeature[] = RAW_OCEANIC_FEATURES.map((of) => ({
  ...of,
  ...buildProjectedSvgPath(of.coordinates)
}));

// ============================================================================
// 2. HISTORICAL CULTURE & TRADE ROUTES LAYER DATA
// ============================================================================

const RAW_TRADE_ROUTES: Omit<TradeRouteFeature, 'projectedPoints' | 'svgPath' | 'labelPos'>[] = [
  {
    id: 'silk_road',
    name: 'The Silk Road (Eurasian Overland Network)',
    type: 'land',
    activeStartYear: -200,
    activeEndYear: 2026,
    eraLabel: '130 BCE – 1453 CE (Belt & Road Legacy to Present)',
    lengthOrSpan: '~6,400 km primary corridor (over 10,000 km of braided oasis trails)',
    color: '#d97706', // Rich Amber Gold
    commodities: [
      'Chinese Raw & Woven Silk',
      'Imperial Porcelain & Celadon',
      'Paper, Printing & Gunpowder',
      'Fergana "Heavenly Horses"',
      'Khotan Jade & Badakhshan Lapis Lazuli',
      'Roman & Islamic Blown Glassware',
      'Rhubarb, Tea, Musk & Spices',
      'Silver Dirhams & Byzantine Gold Solidus Coins'
    ],
    keyHubsAndWaypoints: [
      'Chang’an (Xi’an) — Imperial Chinese eastern terminus (Han, Sui & Tang capital)',
      'Dunhuang & the Jade Gate (Yumen Pass) — oasis fork around the Taklamakan Desert with the Mogao Caves',
      'Kashgar — western Tarim convergence point at the foot of the Pamir Mountains',
      'Samarkand & Bukhara (Transoxiana) — heartland of Sogdian merchant networks and Timurid grandeur',
      'Merv, Nishapur, Rayy, and Baghdad / Ctesiphon — Persian and Mesopotamian emporia',
      'Antioch, Aleppo, Damascus, Trebizond, Constantinople, and Venice — Mediterranean gateways'
    ],
    transportAndNavigation:
      'Operated as a relay network of fortified **caravanserais** spaced one day’s march apart (~30–40 km). Double-humped **Bactrian camels** carried 150–200 kg loads across freezing deserts and high Pamir/Tian Shan passes, guided by Sogdian, Persian, Turkic, and Chinese merchants.',
    generalOverview:
      'Coined as *Seidenstraße* by geographer Ferdinand von Richthofen in 1877, **The Silk Road** was not a single paved highway, but a vast interconnected web of overland oasis routes linking **East Asia, Central Asia, South Asia, Persia, and the Mediterranean world**. Formally opened in **130 BCE** when **Emperor Wu of Han** dispatched envoy **Zhang Qian** to Central Asia and secured the **Hexi Corridor**, the network flourished during the **Han–Roman/Parthian era**, reached a cosmopolitan golden age under the **Tang Dynasty and Abbasid Caliphate**, and was unified under a single imperial passport system (*paiza*) during the 13th–14th century **Pax Mongolica**.',
    culturalExchange:
      'Transmitted Buddhism from India through Gandhara and the Tarim Basin into China, Korea, and Japan; carried Nestorian Christianity, Manichaeism, Zoroastrianism, and Islam across Central Asia; and transferred revolutionary technologies including **papermaking** (after the 751 CE Battle of Talas), **sericulture (silk production)**, **gunpowder**, **astronomy**, and **medical pharmacopeias** between East and West.',
    description:
      'The legendary trans-continental caravan network linking Chang’an (Xi’an) across the Taklamakan oases, Samarkand, and Persia to Antioch, Constantinople, and Venice.',
    coordinates: [
      [108.9, 34.3], // Chang'an (Xi'an)
      [94.7, 40.1],  // Dunhuang
      [76.0, 39.5],  // Kashgar
      [66.9, 39.6],  // Samarkand
      [62.2, 37.6],  // Merv
      [51.4, 35.7],  // Rayy (Tehran)
      [44.4, 33.3],  // Baghdad / Ctesiphon
      [36.2, 36.2],  // Antioch / Aleppo
      [28.9, 41.0],  // Constantinople
      [12.3, 45.4]   // Venice
    ]
  },
  {
    id: 'maritime_spice_route',
    name: 'Indian Ocean Maritime Spice & Monsoon Route',
    type: 'maritime',
    activeStartYear: -1000,
    activeEndYear: 2026,
    eraLabel: '300 BCE – Present (Monsoon & Indo-Pacific Sea Lane)',
    lengthOrSpan: '~12,000 km oceanic network from the South China Sea to the Red Sea & Mediterranean',
    color: '#0284c7', // Deep Maritime Azure
    commodities: [
      'Malabar Black Pepper ("Black Gold")',
      'Moluccan Cloves, Nutmeg & Mace',
      'Ceylon Cinnamon & Cardamom',
      'Indian Painted Cotton Textiles (Chintz & Muslin)',
      'Chinese Blue-and-White Porcelain & Silk',
      'Swahili Coast Gold, Ivory & Mangrove Timber',
      'Persian Gulf Pearls & Arabian Warhorses'
    ],
    keyHubsAndWaypoints: [
      'Quanzhou & Guangzhou (Canton) — premier maritime ports of Song, Yuan, Ming, and Qing China',
      'Strait of Malacca, Palembang (Srivijaya) & the Spice Islands (Maluku / Banda Islands)',
      'Calicut (Kozhikode), Cochin, Quilon (Malabar Coast), and Galle/Colombo (Sri Lanka)',
      'Hormuz & Siraf (Persian Gulf), Muscat (Oman), and Aden (Yemen)',
      'Kilwa Kisiwani, Mombasa & Zanzibar (Swahili Coast) and Berenice / Jeddah / Alexandria (Red Sea–Mediterranean link)'
    ],
    transportAndNavigation:
      'Governed by the predictable semi-annual reversal of the **Indian Ocean Monsoon Winds** (blowing northeast from April to September and southwest from October to March). Mariners sailed sewn-plank **Arab dhows** with lateen sails, **Austronesian outrigger vessels**, and multi-masted **Chinese treasure junks** navigated via the *kamal* star-altitude instrument and magnetic compass.',
    generalOverview:
      'Long before modern oceanic shipping, the **Indian Ocean Maritime Spice Route** was the world’s richest and highest-volume trade network. Because a single ship could carry the cargo equivalent of hundreds of pack camels without paying overland customs tolls at every border, maritime merchants linked **Imperial China, Southeast Asia’s Srivijaya and Majapahit thalassocracies, India’s Chola and Malabar ports, the Persian Gulf, the Swahili Coast, and Red Sea Egypt** into a single monsoon-driven global economy.',
    culturalExchange:
      'Spread **Hinduism and Buddhism** across Southeast Asia (inspiring Angkor Wat and Borobudur); carried **Islam** peacefully via merchant guilds to Indonesia, Malaysia, Malabar, and the Swahili Coast; and inspired the 15th-century voyages of **Admiral Zheng He** and **Vasco da Gama**.',
    description:
      'Harnessing seasonal monsoon winds, maritime merchants linked Guangzhou, the Strait of Malacca, and the Malabar Coast of India with the Persian Gulf, Red Sea, and Alexandria.',
    coordinates: [
      [113.2, 23.1], // Guangzhou / Canton
      [102.2, 2.2],  // Malacca
      [80.0, 6.8],   // Ceylon (Sri Lanka)
      [75.8, 11.2],  // Calicut (Kozhikode)
      [56.3, 27.1],  // Hormuz
      [45.0, 12.8],  // Aden
      [38.5, 21.5],  // Red Sea (Jeddah)
      [29.9, 31.2],  // Alexandria
      [12.3, 45.4]   // Venice
    ]
  },
  {
    id: 'trans_saharan_route',
    name: 'Trans-Saharan Gold & Salt Caravan Trails',
    type: 'land',
    activeStartYear: -500,
    activeEndYear: 1900,
    eraLabel: '400 CE – 1700 CE (Peak under Ghana, Mali & Songhai)',
    lengthOrSpan: '~2,500–3,500 km north–south desert crossings',
    color: '#ea580c', // Desert Terracotta Orange
    commodities: [
      'Bambuk, Bure & Akan Gold Dust and Bullion',
      'Taghaza & Taoudenni Crystalline Rock Salt Slabs',
      'West African Kola Nuts & Shea Butter',
      'North African Barbary Horses, Copper & Brassware',
      'bound Arabic Manuscripts & Paper from Fez and Cairo',
      'Venetian Glass Beads, Cowrie Shells & Textiles'
    ],
    keyHubsAndWaypoints: [
      'Timbuktu, Gao & Djenné — Great Niger Bend emporia of the Mali and Songhai Empires',
      'Koumbi Saleh & Audaghost — capitals and trade hubs of the Empire of Ghana (Wagadou)',
      'Taghaza & Taoudenni — hyper-arid Saharan salt-mining centers where slabs of salt were traded nearly weight-for-weight with gold',
      'Sijilmasa, Marrakech & Fez — northern Moroccan caravan terminals and mints',
      'Ghadames, Ghat, Agadez (Aïr Mountains), Tunis, Tripoli, and Cairo'
    ],
    transportAndNavigation:
      'Revolutionized after 300 CE by the widespread adoption of the single-humped **dromedary camel** and North African camel saddle. Caravans (*qafila*) numbering from 1,000 to 12,000 camels marched for 40 to 60 days between desert wells, guided at night by Amazigh and Tuareg pathfinders using stars and sand-dune wind patterns.',
    generalOverview:
      'For over a millennium, the **Trans-Saharan Caravan Trails** bridged the ecological divide between **Mediterranean North Africa** and the **West African Sahel and Savanna**. Driven by a complementary economic need—the gold-rich empires of West Africa (**Ghana, Mali, Songhai, and Kanem-Bornu**) required dietary **salt** from Saharan mines, while North Africa and medieval Europe depended on **West African gold** (nearly two-thirds of the Old World’s gold supply prior to 1500 CE) to mint their dinars and florins.',
    culturalExchange:
      'Integrated West Africa into the Islamic intellectual world, turning **Timbuktu’s Sankore Madrasah** into a university center housing hundreds of thousands of astronomical, legal, and historical manuscripts, and culminating in **Mansa Musa’s legendary 1324 pilgrimage** to Cairo and Mecca.',
    description:
      'Camel caravans numbering thousands crossed Sahara oases linking the Niger River bend (Timbuktu & Gao) to Morocco, Tunis, and Cairo.',
    coordinates: [
      [-1.5, 11.0], // Akan / Bambuk Goldfields
      [-3.0, 16.8], // Timbuktu
      [-3.5, 22.5], // Taghaza Salt Mines
      [-4.2, 31.3], // Sijilmasa
      [-8.0, 31.6], // Marrakech / Fez
      [10.2, 36.8]  // Tunis
    ]
  },
  {
    id: 'incense_route',
    name: 'Ancient Arabian Frankincense & Myrrh Trail',
    type: 'land',
    activeStartYear: -3000,
    activeEndYear: 600,
    eraLabel: '1800 BCE – 400 CE (Sabaean & Nabataean Era)',
    lengthOrSpan: '~2,400 km desert caravan corridor (65 stages from Dhofar/Yemen to Gaza)',
    color: '#9333ea', // Royal Incense Purple
    commodities: [
      'Dhofari & Hadhrami Frankincense (Boswellia sacra)',
      'Arabian & Horn of Africa Myrrh (Commiphora myrrha)',
      'Balsam, Cassia & Cinnamon re-exported from the Indian Ocean',
      'Gold, Carnelian, Alabaster & Lapis Lazuli',
      'Nabataean Bitumen & Fine Painted Ceramics'
    ],
    keyHubsAndWaypoints: [
      'Khor Rori (Sumhuram) & Shabwa — frankincense harvesting and royal collection ports in Dhofar (Oman) and Hadhramaut',
      'Marib & Timna — irrigated capitals of the Kingdoms of Saba (Sheba) and Qataban in Yemen',
      'Najran, Yathrib (Medina) & Mecca — central Hejaz caravan oases',
      'Hegra (Mada’in Saleh / Al-Ula) & Petra (Raqmu) — monumental rock-cut Nabataean customs capitals',
      'Avdat, Shivta (Negev Desert) & the Mediterranean port of Gaza'
    ],
    transportAndNavigation:
      'Pliny the Elder recorded that the journey from Timna in southern Arabia to Gaza required **65 camel stages** through arid wadis, guarded by royal wells, rock-cut Nabataean flash-flood cisterns, and fortified desert waystations.',
    generalOverview:
      'Throughout antiquity, **frankincense and myrrh**—aromatic tree resins that grew only in the monsoon-misted mountains of southern Arabia (**Dhofar and Yemen**) and the Horn of Africa—were among the most valuable commodities in the ancient world, required daily in massive quantities for temple rituals, embalming, and medicine in **Egypt, Mesopotamia, Greece, Judea, and Rome**.',
    culturalExchange:
      'Generated immense wealth for the South Arabian kingdoms (**Saba, Qataban, Ma’in, and Hadhramaut**) and the **Nabataean Kingdom of Petra**, fostering the development of the South Arabian (*Musnad*) and Nabataean Aramaic scripts (the direct ancestor of the modern Arabic alphabet).',
    description:
      'Ancient desert caravan route carrying prized aromatic resins from southern Arabia (Dhofar and Yemen) north through Mecca and Petra to Gaza.',
    coordinates: [
      [54.1, 17.0], // Dhofar (Oman)
      [45.3, 15.4], // Marib (Yemen / Saba)
      [39.8, 21.4], // Mecca
      [37.9, 26.6], // Hegra (Mada'in Saleh)
      [35.4, 30.3], // Petra
      [34.4, 31.5]  // Gaza / Mediterranean
    ]
  },
  {
    id: 'varangian_amber_route',
    name: 'Varangian-to-Greek & Baltic Amber Route',
    type: 'land',
    activeStartYear: -500,
    activeEndYear: 1450,
    eraLabel: '500 BCE – 1300 CE (Viking, Rus’ & Hanseatic Era)',
    lengthOrSpan: '~3,000 km trans-European riverine & portage highway',
    color: '#0d9488', // Baltic Teal
    commodities: [
      'Baltic Sea Fossilized Amber ("Gold of the North")',
      'Arctic & Boreal Furs (Sable, Ermine, Fox, Beaver)',
      'Forest Beeswax, Honey & Walrus Ivory',
      'Byzantine Woven Silk, Wine & Liturgical Goldware',
      'Abbasid & Samanid Silver Dirham Coin Hoards',
      'Ulfberht Crucible-Steel Frankish Swords'
    ],
    keyHubsAndWaypoints: [
      'Birka & Gotland (Sweden) and Haithabu / Hedeby — Scandinavian Baltic maritime emporia',
      'Staraya Ladoga & Veliky Novgorod — northern riverine gateways of the Rus’',
      'Smolensk & Gnezdovo — strategic overland boat portage between the Lovat/Western Dvina and the Dnieper River',
      'Kyiv — political and commercial metropolis on the middle Dnieper',
      'Chersonesus (Crimea) & Constantinople (Miklagard) — Black Sea and Byzantine imperial terminus'
    ],
    transportAndNavigation:
      'Norse/Varangian merchant-warriors sailed shallow-draft clinker-built **longships (*knarrs*)** up Baltic rivers, hauled their vessels overland on wooden rollers across narrow watershed portages (*voloki*), and navigated the perilous **Dnieper Rapids** down to the Black Sea.',
    generalOverview:
      'Combining the ancient **Amber Road** (which carried Baltic amber south to the Roman Empire) with the medieval **"Route from the Varangians to the Greeks"** (along the Dnieper to Constantinople) and the **Volga Trade Route** (to the Caspian Sea and Abbasid Caliphate), this riverine network connected **Northern Europe and Scandinavia** directly with the **Byzantine and Islamic worlds**.',
    culturalExchange:
      'Catalyzed the founding of **Kievan Rus’**, brought Scandinavian Varangian guardsmen to serve the Byzantine Emperors in Constantinople, and facilitated the **988 CE adoption of Eastern Orthodox Christianity**, Cyrillic literacy, and Byzantine dome architecture across East Slavic lands.',
    description:
      'Riverine portage route following the Volkhov, Dnieper, and Vistula rivers from the Baltic Sea down to the Black Sea and Constantinople.',
    coordinates: [
      [17.5, 59.3], // Birka (Sweden)
      [31.3, 58.5], // Novgorod
      [32.0, 54.8], // Smolensk
      [30.5, 50.4], // Kyiv
      [31.9, 46.6], // Black Sea Estuary
      [28.9, 41.0]  // Constantinople
    ]
  },
  {
    id: 'inca_capac_nan',
    name: 'Capac Ñan (Great Andean Royal Road)',
    type: 'land',
    activeStartYear: -500,
    activeEndYear: 1650,
    eraLabel: '1000 CE – 1533 CE (Wari, Tiwanaku & Inca Empire)',
    lengthOrSpan: '40,000+ km integrated Andean highway network',
    color: '#dc2626', // Andean Crimson
    commodities: [
      'Quipu Knotted-Cord Census & Accounting Records',
      'Fine Vicaría / Alpaca Cumbi Textiles',
      'Freeze-Dried Potato (Chuño) & Quinoa State Rations',
      'Pacific Warm-Water Spondylus (Mullu) Shells',
      'Gold, Silver & Bronze Ceremonial Metallurgy',
      'Coca Leaves, Feathers & Ceramic Aryballos Vessels'
    ],
    keyHubsAndWaypoints: [
      'Cusco — Imperial capital and sacred center ("Navel of the World") where the four radial roads met at the Huacaypata plaza',
      'Quito (Ecuador) & Tomebamba — northern administrative capitals of Chinchaysuyu',
      'Cajamarca, Huánuco Pampa & Pumpu — monumental highland administrative plazas and storehouses (*qullqas*)',
      'Pachacamac & Tambo Colorado — coastal Pacific road junctions',
      'Tiwanaku (Lake Titicaca), Potosí, and Santiago / Maule River (Chile) — southern Collasuyu terminus'
    ],
    transportAndNavigation:
      'Built without wheeled vehicles or iron tools, the **Capac Ñan** featured stone-paved mountain stairways climbing passes over 5,000 m, causeways across marshes, and braided *ichu*-grass suspension bridges (such as **Q’eswachaka**) spanning sheer gorges. Relay runners (**chasquis**) stationed at roadside inns (**tambos**) carried messages 240 km per day alongside llama pack trains.',
    generalOverview:
      'One of the supreme infrastructural achievements of the pre-industrial world, the **Capac Ñan ("Royal Road")** comprised over **40,000 kilometers** of engineered highways organized around two parallel north–south arteries—one along the high **Andean Sierra** and one along the **Pacific Coastal Desert**—linked by dozens of transverse mountain roads.',
    culturalExchange:
      'Unified over 10 million people across four ecological quarters (**Tawantinsuyu**), spreading the **Quechua** language (*Runasimi*), state redistribution storehouses (*qullqas*) that prevented famine, and seismic stone masonry from Colombia to central Chile and Argentina.',
    description:
      'Masterpiece of pre-Columbian engineering running along the spine of the Andes from Quito through Cusco to central Chile.',
    coordinates: [
      [-78.5, -0.2],  // Quito
      [-78.5, -7.1],  // Cajamarca
      [-71.9, -13.5], // Cusco
      [-68.7, -16.5], // Tiwanaku / Lake Titicaca
      [-65.7, -19.5], // Potosí
      [-70.6, -33.4]  // Santiago
    ]
  },
  {
    id: 'atlantic_triangular_route',
    name: 'Trans-Atlantic & Spanish Treasure Fleet Route',
    type: 'maritime',
    activeStartYear: 1492,
    activeEndYear: 2026,
    eraLabel: '1492 CE – Present (Columbian Exchange & Atlantic Economy)',
    lengthOrSpan: '~8,500 km North & South Atlantic Gyre corridors',
    color: '#2563eb', // Atlantic Cobalt
    commodities: [
      'Potosí & Zacatecas Silver Bullion ("Pieces of Eight") & Gold',
      'New World Crops: Maize, Potatoes, Tomatoes, Cacao & Chili Peppers',
      'Plantation Sugar, Molasses, Rum, Tobacco & Indigo',
      'American Raw Cotton, Timber & North Atlantic Cod',
      'European Manufactured Textiles, Ironware, Glass & Firearms'
    ],
    keyHubsAndWaypoints: [
      'Seville & Cádiz (Casa de Contratación) and Lisbon — Iberian imperial home ports',
      'Veracruz (Mexico), Cartagena de Indias (Colombia), and Portobelo (Panama) — Spanish Main silver and trade fairs',
      'Havana (Cuba) & San Juan (Puerto Rico) — fortified convoy assembly ports on the Gulf Stream exit',
      'Salvador da Bahia, Recife & Rio de Janeiro — Portuguese Brazilian sugar and gold ports',
      'London, Liverpool, Amsterdam, Nantes, Boston, New York & Charleston'
    ],
    transportAndNavigation:
      'Utilized the clockwise **North Atlantic Subtropical Gyre**: ships sailed south to the Canary Islands to catch the **Northeast Trade Winds** westward to the Caribbean, then rode the powerful **Gulf Stream** northward past Florida and the **Westerlies** back to Europe in heavily armed convoy systems (*Flota de Indias*).',
    generalOverview:
      'Initiated after **1492**, the **Trans-Atlantic Maritime Network** permanently linked the Western and Eastern Hemispheres for the first time in human history. Over the ensuing centuries, the Atlantic Ocean transformed from an oceanic barrier into the central commercial basin of the modern global economy.',
    culturalExchange:
      'Triggered the **Columbian Exchange**—a biological and agricultural revolution that introduced American potatoes, maize, cassava, and tomatoes to Afro-Eurasia (fueling a global population boom) while bringing wheat, coffee, sugar cane, horses, cattle, and Old World languages to the Americas.',
    description:
      'Oceanic shipping corridors connecting Seville, Lisbon, and London with the Caribbean, Veracruz, Brazil, and North American ports.',
    coordinates: [
      [-96.1, 19.2], // Veracruz
      [-82.3, 23.1], // Havana
      [-66.1, 18.4], // San Juan
      [-9.1, 38.7],  // Lisbon / Seville
      [-3.0, 53.4],  // Liverpool / London
      [-74.0, 40.7]  // New York
    ]
  },
  {
    id: 'manila_galleon',
    name: 'Manila–Acapulco Pacific Galleon Route',
    type: 'maritime',
    activeStartYear: 1565,
    activeEndYear: 2026,
    eraLabel: '1565 CE – Present (Trans-Pacific Trade Corridor)',
    lengthOrSpan: '~14,500 km continuous non-stop Pacific crossing',
    color: '#059669', // Pacific Emerald
    commodities: [
      'Spanish-American Silver Reales de a Ocho ("Pieces of Eight" minted in Mexico & Potosí)',
      'Chinese Raw & Damask Silk from Fujian and Guangdong',
      'Ming & Qing Blue-and-White Jingdezhen Porcelain',
      'Moluccan & Philippine Spices, Ivory & Jade',
      'Japanese & Chinese Lacquerware, Folding Screens & Fans',
      'New World Sweet Potatoes, Maize, Cacao & Cochineal Red Dye'
    ],
    keyHubsAndWaypoints: [
      'Manila (Intramuros & Cavite, Philippines) — Asian entrepôt where Chinese *sangley* junks, Japanese, and Southeast Asian merchants converged',
      'Acapulco (Fort San Diego, Mexico) — Pacific terminus and site of the annual winter galleon trade fair',
      'Mexico City & Puebla — overland *Camino de Asia / China Poblana* link across New Spain',
      'Guam (Mariana Islands) & Cape Mendocino / Baja California — mid-ocean and coastal navigation landmarks'
    ],
    transportAndNavigation:
      'Discovered in **1565** by Basque navigator **Andrés de Urdaneta** (*el Tornaviaje*): westward galleons sailed straight from Acapulco to Manila in ~3 months on the North Equatorial Trade Winds, while eastward galleons ( up to 2,000 tons, the largest ships in the world) climbed north past Japan to 38°–42°N to catch the **Kuroshio Current and North Pacific Westerlies** across to California and down to Acapulco in a grueling 4–6 month non-stop voyage.',
    generalOverview:
      'Operating continuously for **250 years (1565–1815)**, the **Manila–Acapulco Galleon (*Nao de China*)** completed the first true circuit of **planetary globalization**. By exchanging New World silver mined in Mexico and Peru directly for Chinese silk and porcelain in Manila, it made the **Spanish silver peso** the first universal global reserve currency and deeply monetized Ming China’s *Single Whip* tax system.',
    culturalExchange:
      'Introduced the **sweet potato, maize, peanut, and chili pepper** into China and the Philippines—dramatically expanding Asian food security on upland soils—while bringing Asian porcelain, lacquerware, silk aesthetics, and Filipino/Asian artisans into colonial Mexico and Spanish America.',
    description:
      'Spanish treasure galleons sailed from Manila across the North Pacific current to Acapulco, exchanging Asian luxury goods for New World silver.',
    coordinates: [
      [120.9, 14.6],  // Manila
      [142.0, 32.0],  // Kuroshio Current East of Japan
      [178.0, 38.0],  // Mid-Pacific
      [-135.0, 34.0], // California Current
      [-99.9, 16.8]   // Acapulco
    ]
  }
];

export const TRADE_ROUTES: TradeRouteFeature[] = RAW_TRADE_ROUTES.map((tr) => ({
  ...tr,
  ...buildProjectedSvgPath(tr.coordinates)
}));

export function getTradeRoutesForYear(year: number): TradeRouteFeature[] {
  // Always return routes active in that era, or if very ancient, show the foundational ancient routes
  const active = TRADE_ROUTES.filter((r) => year >= r.activeStartYear && year <= r.activeEndYear);
  if (active.length >= 2) return active;
  return TRADE_ROUTES.slice(0, 5);
}

// ============================================================================
// 3. CULTURAL SPHERES & MERCHANT HUBS
// ============================================================================

const RAW_CULTURAL_HUBS: Omit<CulturalHubFeature, 'projectedPos'>[] = [
  {
    id: 'hub_changan',
    name: 'Chang’an / Xi’an',
    culturalSphere: 'Sinosphere (East Asian)',
    sphereColor: '#f59e0b',
    activeStartYear: -2000,
    activeEndYear: 2026,
    coordinates: [108.9, 34.3],
    role: 'Eastern Terminus of the Silk Road & Imperial Capital',
    traditionsAndExports: 'Confucian & Buddhist scholarship, silk weaving, metallurgy, printing & Imperial statecraft',
    description: 'Serving as capital for the Qin, Han, Sui, and Tang dynasties, Chang’an was one of the world’s largest cosmopolitan metropolises.'
  },
  {
    id: 'hub_samarkand',
    name: 'Samarkand',
    culturalSphere: 'Central Asian Oasis & Perso-Turkic',
    sphereColor: '#d97706',
    activeStartYear: -700,
    activeEndYear: 2026,
    coordinates: [66.9, 39.6],
    role: 'Crossroads of the Eurasian Silk Road',
    traditionsAndExports: 'Sogdian commerce, Timurid astronomy (Ulugh Beg Observatory), Samarkand paper, lapis lazuli',
    description: 'Heart of Transoxiana; Sogdian merchants and later Timurid scholars turned Samarkand into the jewel of Central Asian trade and science.'
  },
  {
    id: 'hub_constantinople',
    name: 'Constantinople / Istanbul',
    culturalSphere: 'Mediterranean & Byzantine–Ottoman',
    sphereColor: '#e11d48',
    activeStartYear: -650,
    activeEndYear: 2026,
    coordinates: [28.9, 41.0],
    role: 'Imperial Bridge Between Europe & Asia (Bosporus)',
    traditionsAndExports: 'Roman legal codification, Orthodox & Islamic architecture, spice & silk customs tolls',
    description: 'Controlling the Bosporus Strait between the Black Sea and Mediterranean, it stood for over 1,600 years as capital of the Roman/Byzantine and Ottoman Empires.'
  },
  {
    id: 'hub_baghdad',
    name: 'Baghdad / Babylon',
    culturalSphere: 'Mesopotamian & Perso-Islamic',
    sphereColor: '#10b981',
    activeStartYear: -3000,
    activeEndYear: 2026,
    coordinates: [44.4, 33.3],
    role: 'Mesopotamian Heartland & House of Wisdom (Bayt al-Hikma)',
    traditionsAndExports: 'Algebra, optics, astronomy, translation of Greek/Sanskrit/Persian texts, textiles & glass',
    description: 'Situated where the Tigris and Euphrates converge; ancient Babylon and later Abbasid Baghdad served as the intellectual and commercial hub of the Islamic Golden Age.'
  },
  {
    id: 'hub_alexandria',
    name: 'Alexandria & Cairo',
    culturalSphere: 'Nile Valley & Hellenistic–Mediterranean',
    sphereColor: '#8b5cf6',
    activeStartYear: -3000,
    activeEndYear: 2026,
    coordinates: [30.0, 31.0],
    role: 'Red Sea–Mediterranean Emporium & Great Library',
    traditionsAndExports: 'Papyrus, grain, glass, Indian Ocean spices, geometry & classical scholarship',
    description: 'Gateway linking the Nile Valley and Red Sea monsoon trade with the entire Mediterranean basin.'
  },
  {
    id: 'hub_timbuktu',
    name: 'Timbuktu',
    culturalSphere: 'West African Sahelian',
    sphereColor: '#ea580c',
    activeStartYear: 300,
    activeEndYear: 2026,
    coordinates: [-3.0, 16.8],
    role: 'Southern Terminus of Trans-Saharan Caravans',
    traditionsAndExports: 'Gold bullion, Saharan rock salt, Sankore illuminated manuscripts & astronomy',
    description: 'Thriving along the Niger River bend, Timbuktu became a renowned center of wealth and scholarship under Mansa Musa’s Mali Empire and the Songhai Empire.'
  },
  {
    id: 'hub_calicut',
    name: 'Calicut & Pataliputra (Indic Sphere)',
    culturalSphere: 'Indic / Dharmic Civilization',
    sphereColor: '#06b6d4',
    activeStartYear: -2500,
    activeEndYear: 2026,
    coordinates: [75.8, 11.2],
    role: 'Malabar Spice Entrepôt & Indian Ocean Hub',
    traditionsAndExports: 'Black pepper, cardamom, fine cotton muslin, Hindu-Arabic numerals, Buddhist & Vedic philosophy',
    description: 'The Malabar Coast and Gangetic cities anchored the global maritime spice trade and exported mathematics, metallurgy, and Dharmic traditions across Asia.'
  },
  {
    id: 'hub_venice',
    name: 'Rome & Venice',
    culturalSphere: 'Latin & European Renaissance',
    sphereColor: '#3b82f6',
    activeStartYear: -753,
    activeEndYear: 2026,
    coordinates: [12.4, 43.5],
    role: 'Mediterranean Maritime Republic & Classical Capital',
    traditionsAndExports: 'Maritime banking, printing presses, Renaissance art, Murano glass & naval galleys',
    description: 'Central Mediterranean peninsula that projected Roman law across antiquity and later channeled Eastern silk and spices into Renaissance Europe.'
  },
  {
    id: 'hub_tenochtitlan',
    name: 'Tenochtitlan / Mexico City',
    culturalSphere: 'Mesoamerican Civilization',
    sphereColor: '#14b8a6',
    activeStartYear: -1500,
    activeEndYear: 2026,
    coordinates: [-99.1, 19.4],
    role: 'Mesoamerican Highland Metropolis & Trans-Oceanic Nexus',
    traditionsAndExports: 'Obsidian craft, cacao, maize chinampa agriculture, astronomical calendars & silver',
    description: 'Center of Teotihuacan, Toltec, and Aztec civilizations, and later the hub connecting the Manila Galleon with the Atlantic.'
  },
  {
    id: 'hub_cusco',
    name: 'Cusco',
    culturalSphere: 'Andean Civilization',
    sphereColor: '#ef4444',
    activeStartYear: -1000,
    activeEndYear: 2026,
    coordinates: [-71.9, -13.5],
    role: 'Imperial Navel of Tawantinsuyu (Inca Empire)',
    traditionsAndExports: 'Seismic stone masonry, agricultural terracing, quipu record systems & metallurgy',
    description: 'High-altitude capital in the Peruvian Andes from which the four suyus (quarters) of the Capac Ñan road system radiated.'
  }
];

export const CULTURAL_HUBS: CulturalHubFeature[] = RAW_CULTURAL_HUBS.map((h) => ({
  ...h,
  projectedPos: projectCoordinates(h.coordinates[0], h.coordinates[1])
}));

// ============================================================================
// 4. AUTHENTIC & CREDITED HISTORICAL / GEOPOLITICAL SOURCES REGISTRY
// ============================================================================

export function getCreditedSourcesForRegion(regionName: string, modernCountry: string | undefined, year: number): CreditedSource[] {
  const queryTerm = encodeURIComponent(regionName);
  const countryTerm = encodeURIComponent(modernCountry || regionName);
  const isAncientOrHistorical = year < 1945;

  const sources: CreditedSource[] = [
    {
      title: `Encyclopedia Britannica: ${regionName}`,
      organization: 'Encyclopedia Britannica',
      url: `https://www.britannica.com/search?query=${queryTerm}`,
      category: 'History & Encyclopedia',
      description: 'Peer-reviewed historical chronology, dynastic rulers, treaties, and territorial boundaries.'
    },
    {
      title: `Library of Congress: ${modernCountry || regionName} Historical Archive`,
      organization: 'U.S. Library of Congress',
      url: `https://www.loc.gov/search/?q=${countryTerm}+history`,
      category: 'Diplomatic Archives',
      description: 'Primary historical manuscripts, country studies, and archival cartographic plates.'
    }
  ];

  if (isAncientOrHistorical) {
    sources.push(
      {
        title: `UNESCO Silk Roads & World Heritage: ${regionName}`,
        organization: 'UNESCO World Heritage Centre',
        url: `https://whc.unesco.org/en/list/?search=${queryTerm}`,
        category: 'Cartography & Archaeology',
        description: 'Archaeological monuments, cultural trade corridors, and civilizational heritage records.'
      },
      {
        title: `Oxford Reference: World History (${regionName})`,
        organization: 'Oxford University Press',
        url: `https://www.oxfordreference.com/search?q=${queryTerm}`,
        category: 'History & Encyclopedia',
        description: 'Academic historical dictionaries and historiographical reference entries.'
      }
    );
  } else {
    sources.push(
      {
        title: `Council on Foreign Relations: ${modernCountry || regionName}`,
        organization: 'Council on Foreign Relations (CFR)',
        url: `https://www.cfr.org/search?keyword=${countryTerm}`,
        category: 'Geopolitics & Conflict',
        description: 'Nonpartisan foreign policy analysis, regional alliances, and strategic assessments.'
      },
      {
        title: `BBC Country Profile & Timeline: ${modernCountry || regionName}`,
        organization: 'BBC World Service',
        url: `https://www.bbc.co.uk/search?q=${countryTerm}+country+profile`,
        category: 'History & Encyclopedia',
        description: 'Chronological political history, leadership transitions, and modern geopolitical overview.'
      }
    );
  }

  return sources;
}

export function getCreditedSourcesForConflict(conflictName: string, regionName: string): CreditedSource[] {
  const queryTerm = encodeURIComponent(conflictName);
  const regionTerm = encodeURIComponent(regionName);

  return [
    {
      title: `CFR Global Conflict Tracker: ${conflictName}`,
      organization: 'Council on Foreign Relations (CFR)',
      url: `https://www.cfr.org/global-conflict-tracker`,
      category: 'Geopolitics & Conflict',
      description: 'Verified strategic background, active combatants, and geopolitical impact ratings.'
    },
    {
      title: `CrisisWatch Briefing: ${regionName}`,
      organization: 'International Crisis Group (ICG)',
      url: `https://www.crisisgroup.org/crisiswatch`,
      category: 'Geopolitics & Conflict',
      description: 'Field-based conflict prevention research, diplomatic negotiations, and frontline updates.'
    },
    {
      title: `Uppsala Conflict Data Program (UCDP): ${conflictName}`,
      organization: 'Uppsala University Dept. of Peace & Conflict Research',
      url: `https://ucdp.uu.se/`,
      category: 'Geopolitics & Conflict',
      description: 'Academic empirical database on armed conflicts, territorial disputes, and peace agreements.'
    },
    {
      title: `Encyclopedia Britannica Historical Context: ${conflictName}`,
      organization: 'Encyclopedia Britannica',
      url: `https://www.britannica.com/search?query=${queryTerm}+${regionTerm}`,
      category: 'History & Encyclopedia',
      description: 'Historical treaties, colonial demarcations, and long-term root causes of the dispute.'
    }
  ];
}
