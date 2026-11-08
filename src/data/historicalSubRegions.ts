import { projectCoordinates } from './geoService';

/**
 * Historical Sub-Regions Engine
 * Splits large modern countries (such as the USA, Saudi Arabia, Canada, Russia, China,
 * India, Brazil, Argentina/Chile, Algeria, Libya, Egypt, South Africa, and Australia)
 * into authentic sub-national historical territories clipped to exact natural coastlines.
 */

export interface HistoricalSubRegionRule {
  id: string;
  targetCountry: string;
  startYear: number;
  endYear: number;
  entityId: string;
  entityName: string | ((year: number) => string);
  historicalName: string | ((year: number) => string);
  ruler: string | ((year: number) => string);
  capital: string | ((year: number) => string);
  populationEstimate: string;
  color: string | ((year: number) => string);
  isOpenSpace: boolean;
  description: string;
  keyEvents: string[];
  polygonLonLat: [number, number][];
  frontierLinesLonLat?: [number, number][][];
  labelLonLat?: [number, number];
}

export interface HistoricalSubRegionResolved {
  id: string;
  targetCountry: string;
  entityId: string;
  entityName: string;
  historicalName: string;
  ruler: string;
  capital: string;
  populationEstimate: string;
  color: string;
  isOpenSpace: boolean;
  description: string;
  keyEvents: string[];
  svgPolygonPath: string;
  svgFrontierPath: string;
  labelPos: [number, number];
}

function polygonToSvgPath(coords: [number, number][]): string {
  if (!coords || coords.length === 0) return '';
  return (
    coords
      .map(([lon, lat], idx) => {
        const [x, y] = projectCoordinates(lon, lat);
        return `${idx === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ') + ' Z'
  );
}

function linesToSvgPath(lines?: [number, number][][]): string {
  if (!lines || lines.length === 0) return '';
  return lines
    .map((line) =>
      line
        .map(([lon, lat], idx) => {
          const [x, y] = projectCoordinates(lon, lat);
          return `${idx === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
        })
        .join(' ')
    )
    .join(' ');
}

export const SUB_REGION_CLIPPED_COUNTRIES = new Set<string>([
  'United States of America',
  'Canada',
  'Saudi Arabia',
  'Russia',
  'China',
  'India',
  'Brazil',
  'Argentina',
  'Chile',
  'Algeria',
  'Libya',
  'Egypt',
  'South Africa',
  'Australia',
  'Angola',
  'Mozambique',
  'Malaysia'
]);

const SUB_REGION_RULES: HistoricalSubRegionRule[] = [
  // ============================================================================
  // 1. NORTH AMERICA: UNITED STATES & CANADA (1513 – 1867 CE)
  // Splits modern USA/Canada into British, French, Spanish, Mexican, Russian & Indigenous zones
  // ============================================================================

  // A. Early Spanish Florida & Nuevo México (1513 – 1606)
  {
    id: 'usa_spanish_florida_sw_1513_1606',
    targetCountry: 'United States of America',
    startYear: 1513,
    endYear: 1606,
    entityId: 'spanish_global_empire',
    entityName: 'Spanish Empire (La Florida & Nuevo México)',
    historicalName: 'Virreinato de la Nueva España',
    ruler: (y) => (y < 1556 ? 'Emperor Charles V' : 'King Philip II of Spain'),
    capital: 'St. Augustine (Founded 1565) & Santa Fe',
    populationEstimate: 'Spanish Garrisons & Mission Settlements',
    color: '#bd9e42',
    isOpenSpace: false,
    description: 'Early Spanish colonial footholds in La Florida (Ponce de León 1513, St. Augustine 1565) and the Rio Grande valley of Nuevo México (Juan de Oñate 1598), while the rest of North America remained sovereign Indigenous nations.',
    keyEvents: [
      'Juan Ponce de León lands in La Florida (1513)',
      'Founding of St. Augustine (1565), oldest continuously inhabited European-founded city in the US',
      'Spanish expeditions of Coronado (1540) and De Soto (1539–1542)'
    ],
    polygonLonLat: [
      [-118, 33.5], [-103, 36.5], [-97, 29.5], [-88, 30.8], [-80, 31.5],
      [-79, 24.5], [-98, 24.5], [-118, 31.0]
    ],
    frontierLinesLonLat: [
      [[-118, 33.5], [-103, 36.5], [-97, 29.5], [-88, 30.8], [-80, 31.5]]
    ],
    labelLonLat: [-102, 31.5]
  },

  // B. 1607 – 1762: THREE-WAY COLONIAL SPLIT OF USA (British 13 Colonies, French Louisiana, Spanish Southwest & Florida)
  {
    id: 'usa_british_13_colonies_1607_1762',
    targetCountry: 'United States of America',
    startYear: 1607,
    endYear: 1762,
    entityId: 'british_13_colonies',
    entityName: 'British Thirteen Colonies (British North America)',
    historicalName: 'British Atlantic Colonies',
    ruler: (y) => (y < 1689 ? 'Stuart Monarchs & Colonial Charters' : y < 1714 ? 'William & Mary / Queen Anne' : 'House of Hanover (George I – George III)'),
    capital: 'Boston, Philadelphia, Williamsburg & New York',
    populationEstimate: '1.6 Million (1760)',
    color: '#c46c6c',
    isOpenSpace: false,
    description: 'The British Atlantic seaboard colonies stretching from Maine/Massachusetts to Georgia between the Atlantic Ocean and the Appalachian Mountains.',
    keyEvents: [
      'Founding of Jamestown, Virginia (1607) and Plymouth Colony (1620)',
      'British takeover of Dutch New Netherland (New York) in 1664',
      'French and Indian War (1754–1763) along the Appalachian frontier'
    ],
    polygonLonLat: [
      [-66.5, 47.5], [-71.0, 45.0], [-75.5, 43.0], [-79.5, 40.5], [-81.5, 37.5],
      [-83.5, 34.0], [-81.5, 30.8], [-74.0, 30.8], [-66.0, 44.0]
    ],
    frontierLinesLonLat: [
      [[-71.0, 45.0], [-75.5, 43.0], [-79.5, 40.5], [-81.5, 37.5], [-83.5, 34.0], [-81.5, 30.8]]
    ],
    labelLonLat: [-76.5, 38.0]
  },
  {
    id: 'usa_french_louisiana_1682_1762',
    targetCountry: 'United States of America',
    startYear: 1682,
    endYear: 1762,
    entityId: 'kingdom_of_france',
    entityName: 'French Louisiana (La Louisiane — New France)',
    historicalName: 'La Louisiane Française (Royaume de France)',
    ruler: (y) => (y <= 1715 ? 'King Louis XIV (The Sun King)' : 'King Louis XV of France'),
    capital: 'New Orleans (La Nouvelle-Orléans) & Mobile',
    populationEstimate: 'French Voyageurs, Forts & Choctaw/Illiniwek Allies',
    color: '#2563eb',
    isOpenSpace: false,
    description: 'Vast French colonial territory claimed by La Salle in 1682, stretching across the entire Mississippi, Ohio, and Missouri River drainage basins from the Great Lakes to New Orleans.',
    keyEvents: [
      'René-Robert Cavelier, Sieur de La Salle claims the Mississippi Basin for France (1682)',
      'Founding of New Orleans (1718) and Fort Chartres / Fort Duquesne',
      'Ceded to Britain (east of Mississippi) and Spain (west of Mississippi) in 1762–1763'
    ],
    polygonLonLat: [
      [-104.0, 49.0], [-84.0, 49.0], [-75.5, 43.0], [-79.5, 40.5], [-81.5, 37.5],
      [-83.5, 34.0], [-85.0, 30.2], [-94.5, 29.0], [-97.5, 35.5], [-104.0, 42.0]
    ],
    frontierLinesLonLat: [
      [[-104.0, 49.0], [-104.0, 42.0], [-97.5, 35.5], [-94.5, 29.0]],
      [[-75.5, 43.0], [-79.5, 40.5], [-81.5, 37.5], [-83.5, 34.0], [-85.0, 30.2]]
    ],
    labelLonLat: [-91.0, 38.5]
  },
  {
    id: 'usa_spanish_new_spain_florida_1607_1762',
    targetCountry: 'United States of America',
    startYear: 1607,
    endYear: 1762,
    entityId: 'spanish_global_empire',
    entityName: 'Spanish Empire (Spanish Texas, Nuevo México & La Florida)',
    historicalName: 'Virreinato de la Nueva España',
    ruler: 'Spanish Habsburg & Bourbon Monarchs (Viceroy in Mexico City)',
    capital: 'Santa Fe, San Antonio & St. Augustine',
    populationEstimate: 'Spanish Presidios, Missions & Indigenous Pueblos',
    color: '#bd9e42',
    isOpenSpace: false,
    description: 'Northern frontier provinces of the Spanish Viceroyalty of New Spain encompassing Texas, New Mexico, Arizona, and Spanish Florida.',
    keyEvents: [
      'Founding of Santa Fe as capital of Nuevo México (1610) and Pueblo Revolt (1680)',
      'Founding of the Alamo Mission (San Antonio de Valero) in Spanish Texas (1718)',
      'Defense of St. Augustine and Spanish Florida against British raids'
    ],
    polygonLonLat: [
      [-120.0, 35.5], [-105.0, 37.5], [-97.5, 35.5], [-94.5, 29.0], [-85.0, 30.2],
      [-81.5, 30.8], [-79.0, 24.5], [-98.0, 24.5], [-120.0, 31.0]
    ],
    frontierLinesLonLat: [
      [[-120.0, 35.5], [-105.0, 37.5], [-97.5, 35.5], [-94.5, 29.0]],
      [[-85.0, 30.2], [-81.5, 30.8]]
    ],
    labelLonLat: [-104.5, 32.5]
  },

  // C. 1763 – 1775: POST-SEVEN YEARS' WAR SPLIT AT THE MISSISSIPPI RIVER (British East vs. Spanish West)
  {
    id: 'usa_british_east_mississippi_1763_1775',
    targetCountry: 'United States of America',
    startYear: 1763,
    endYear: 1775,
    entityId: 'british_kingdom_and_empire',
    entityName: 'British North America (13 Colonies & Indian Reserve East of Mississippi)',
    historicalName: 'British North America',
    ruler: 'King George III of Great Britain',
    capital: 'Philadelphia, Boston, New York & Charleston',
    populationEstimate: '2.5 Million',
    color: '#c46c6c',
    isOpenSpace: false,
    description: 'Following the 1763 Treaty of Paris, Great Britain controlled all of North America east of the Mississippi River (including East & West Florida and the Proclamation of 1763 Indian Reserve).',
    keyEvents: [
      '1763 Treaty of Paris ends French colonial rule on the North American mainland',
      'Royal Proclamation of 1763 establishing the Appalachian boundary line',
      'Boston Tea Party (1773) and First Continental Congress (1774)'
    ],
    polygonLonLat: [
      [-95.0, 49.0], [-66.0, 49.0], [-66.0, 24.5], [-89.5, 29.0],
      [-91.2, 33.0], [-89.5, 37.0], [-91.5, 43.0], [-95.0, 49.0]
    ],
    frontierLinesLonLat: [
      [[-95.0, 49.0], [-91.5, 43.0], [-89.5, 37.0], [-91.2, 33.0], [-89.5, 29.0]]
    ],
    labelLonLat: [-81.0, 37.5]
  },
  {
    id: 'usa_spanish_louisiana_southwest_1763_1800',
    targetCountry: 'United States of America',
    startYear: 1763,
    endYear: 1800,
    entityId: 'spanish_global_empire',
    entityName: 'Spanish Louisiana, Texas, Nuevo México & Alta California (New Spain)',
    historicalName: 'Luisiana Española y Provincias Internas (Nueva España)',
    ruler: 'King Charles III & King Charles IV of Spain',
    capital: 'New Orleans, Santa Fe, Monterey & San Antonio',
    populationEstimate: 'Spanish Colonial & Indigenous Populations',
    color: '#bd9e42',
    isOpenSpace: false,
    description: 'From 1763 to 1800, the Spanish Empire controlled all of North America west of the Mississippi River (Spanish Louisiana) as well as Texas, New Mexico, Alta California, and (after 1783) East & West Florida.',
    keyEvents: [
      'Spain acquires Western Louisiana from France in the Treaty of Fontainebleau (1762)',
      'Founding of Spanish missions across Alta California (San Diego 1769, San Francisco 1776)',
      'Bernardo de Gálvez defeats British forces along the Gulf Coast (1779–1781)'
    ],
    polygonLonLat: [
      [-125.0, 42.0], [-105.0, 49.0], [-95.0, 49.0], [-91.5, 43.0], [-89.5, 37.0],
      [-91.2, 33.0], [-89.5, 29.0], [-79.5, 24.5], [-125.0, 31.0]
    ],
    frontierLinesLonLat: [
      [[-95.0, 49.0], [-91.5, 43.0], [-89.5, 37.0], [-91.2, 33.0], [-89.5, 29.0]],
      [[-125.0, 42.0], [-105.0, 49.0]]
    ],
    labelLonLat: [-103.0, 36.5]
  },

  // D. 1776 – 1802: EARLY UNITED STATES (East of Mississippi) vs. FRENCH/SPANISH LOUISIANA & SPANISH FLORIDA/SOUTHWEST
  {
    id: 'usa_early_republic_east_mississippi_1776_1802',
    targetCountry: 'United States of America',
    startYear: 1776,
    endYear: 1802,
    entityId: 'sovereign_United States of America',
    entityName: 'United States of America (Early Republic East of the Mississippi)',
    historicalName: 'United States of America (13–16 States & Northwest Territory)',
    ruler: (y) => (y < 1789 ? 'Continental Congress & Gen. George Washington' : y < 1797 ? 'President George Washington' : 'President John Adams / Thomas Jefferson'),
    capital: (y) => (y < 1790 ? 'Philadelphia & New York' : y < 1800 ? 'Philadelphia' : 'Washington, D.C.'),
    populationEstimate: '3.9 – 5.3 Million',
    color: '#3b82f6',
    isOpenSpace: false,
    description: 'Following the 1776 Declaration of Independence and 1783 Treaty of Paris, the young United States stretched from the Atlantic coast to the Mississippi River, bordered by British Canada to the north and Spanish Florida & Louisiana to the south and west.',
    keyEvents: [
      'Declaration of Independence (1776) and Treaty of Paris recognizing borders to the Mississippi (1783)',
      'Northwest Ordinance of 1787 and ratification of the US Constitution (1788)'
    ],
    polygonLonLat: [
      [-95.0, 49.0], [-66.0, 49.0], [-66.0, 30.8], [-88.0, 31.0],
      [-91.2, 31.0], [-89.5, 37.0], [-91.5, 43.0], [-95.0, 49.0]
    ],
    frontierLinesLonLat: [
      [[-95.0, 49.0], [-91.5, 43.0], [-89.5, 37.0], [-91.2, 31.0], [-80.5, 30.8]]
    ],
    labelLonLat: [-81.0, 38.0]
  },
  {
    id: 'usa_french_louisiana_retrocession_1801_1802',
    targetCountry: 'United States of America',
    startYear: 1801,
    endYear: 1802,
    entityId: 'french_republic_and_napoleonic_empire',
    entityName: 'French Louisiana (First French Republic — Napoleon Bonaparte)',
    historicalName: 'Louisiane Française (1800 Treaty of San Ildefonso)',
    ruler: 'First Consul Napoleon Bonaparte',
    capital: 'New Orleans',
    populationEstimate: 'French, Spanish & Native Inhabitants',
    color: '#2563eb',
    isOpenSpace: false,
    description: 'Returned by Spain to Napoleon’s France under the secret 1800 Treaty of San Ildefonso before Napoleon sold the entire 2.1-million-sq-km territory to the United States in the 1803 Louisiana Purchase.',
    keyEvents: [
      'Third Treaty of San Ildefonso transfers Louisiana from Spain back to France (1800)',
      'Sold to Thomas Jefferson’s administration in the April 1803 Louisiana Purchase'
    ],
    polygonLonLat: [
      [-114.0, 49.0], [-95.0, 49.0], [-91.5, 43.0], [-89.5, 37.0],
      [-91.2, 31.0], [-94.0, 29.5], [-100.0, 36.5], [-106.0, 42.0], [-114.0, 49.0]
    ],
    frontierLinesLonLat: [
      [[-114.0, 49.0], [-106.0, 42.0], [-100.0, 36.5], [-94.0, 29.5]],
      [[-95.0, 49.0], [-91.5, 43.0], [-89.5, 37.0], [-91.2, 31.0]]
    ],
    labelLonLat: [-100.0, 41.5]
  },
  {
    id: 'usa_spanish_southwest_florida_1801_1820',
    targetCountry: 'United States of America',
    startYear: 1801,
    endYear: 1820,
    entityId: 'spanish_global_empire',
    entityName: 'Spanish Empire (Alta California, Nuevo México, Texas & Florida)',
    historicalName: 'Virreinato de la Nueva España (Boundary of 1819 Adams-Onís Treaty)',
    ruler: 'King Charles IV & King Ferdinand VII of Spain',
    capital: 'Mexico City, Santa Fe, Monterey & St. Augustine',
    populationEstimate: 'Northern Provinces of New Spain',
    color: '#bd9e42',
    isOpenSpace: false,
    description: 'Spanish territories south and west of the Louisiana Purchase (California, Nevada, Utah, Arizona, New Mexico, Texas, and Florida prior to the 1819–1821 Adams-Onís Treaty).',
    keyEvents: [
      '1819 Adams-Onís Treaty defines the 42nd parallel, Arkansas, Red, and Sabine River border and cedes Florida to the US'
    ],
    polygonLonLat: [
      [-125.0, 42.0], [-106.0, 42.0], [-100.0, 36.5], [-94.0, 29.5],
      [-80.0, 30.8], [-79.5, 24.5], [-98.0, 24.5], [-125.0, 31.0]
    ],
    frontierLinesLonLat: [
      [[-125.0, 42.0], [-106.0, 42.0], [-100.0, 36.5], [-94.0, 29.5]]
    ],
    labelLonLat: [-112.0, 35.5]
  },

  // E. 1803 – 1847: UNITED STATES (East + Louisiana Purchase) vs. MEXICAN SOUTHWEST / CALIFORNIA & TEXAS
  {
    id: 'usa_louisiana_purchase_era_1803_1847',
    targetCountry: 'United States of America',
    startYear: 1803,
    endYear: 1847,
    entityId: 'sovereign_United States of America',
    entityName: 'United States of America (Eastern States & Louisiana Purchase Territory)',
    historicalName: 'United States of America',
    ruler: (y) => (y < 1809 ? 'President Thomas Jefferson' : y < 1829 ? 'President James Madison / James Monroe' : y < 1837 ? 'President Andrew Jackson' : 'President James K. Polk'),
    capital: 'Washington, D.C.',
    populationEstimate: '7.2 – 21.0 Million',
    color: '#3b82f6',
    isOpenSpace: false,
    description: 'Following the 1803 Louisiana Purchase, the United States doubled in size to the Rocky Mountains, while California, the Southwest, and Texas belonged to Spain (until 1821) and Mexico (1821–1848).',
    keyEvents: [
      'Louisiana Purchase (1803) and Lewis & Clark Expedition (1804–1806)',
      'Adams-Onís Treaty (1819) adding Florida and setting the 42nd parallel boundary'
    ],
    polygonLonLat: [
      [-114.0, 49.0], [-66.0, 49.0], [-66.0, 24.5], [-94.0, 29.5],
      [-94.5, 33.5], [-100.0, 36.5], [-106.0, 42.0], [-114.0, 49.0]
    ],
    frontierLinesLonLat: [
      [[-114.0, 49.0], [-106.0, 42.0], [-100.0, 36.5], [-94.5, 33.5], [-94.0, 29.5]]
    ],
    labelLonLat: [-88.0, 39.0]
  },
  {
    id: 'usa_mexican_southwest_california_1821_1847',
    targetCountry: 'United States of America',
    startYear: 1821,
    endYear: 1847,
    entityId: 'sovereign_Mexico',
    entityName: 'First Mexican Empire / Mexican Republic (Alta California, Nuevo México & Tejas)',
    historicalName: 'Territorios de Alta California y Santa Fe de Nuevo México (México)',
    ruler: 'Agustín de Iturbide / Guadalupe Victoria / Antonio López de Santa Anna',
    capital: 'Mexico City (Provincial seats in Monterey & Santa Fe)',
    populationEstimate: 'Northern Mexican Provinces & Indigenous Nations',
    color: '#c5e1a5',
    isOpenSpace: false,
    description: 'From Mexican independence in 1821 until the 1848 Treaty of Guadalupe Hidalgo, California, Nevada, Utah, Arizona, New Mexico, western Colorado, and Texas (until 1836) were sovereign territory of Mexico.',
    keyEvents: [
      'Mexican Independence from Spain (1821) incorporates Alta California, Nuevo México, and Tejas',
      'Opening of the Santa Fe Trail and secularization of California missions (1833)',
      'Mexican-American War (1846–1848) and Treaty of Guadalupe Hidalgo'
    ],
    polygonLonLat: [
      [-125.0, 42.0], [-106.0, 42.0], [-100.0, 36.5], [-94.5, 33.5],
      [-94.0, 29.5], [-97.5, 25.5], [-125.0, 31.5]
    ],
    frontierLinesLonLat: [
      [[-125.0, 42.0], [-106.0, 42.0], [-100.0, 36.5], [-94.5, 33.5], [-94.0, 29.5]]
    ],
    labelLonLat: [-114.0, 36.5]
  },
  {
    id: 'usa_republic_of_texas_1836_1845',
    targetCountry: 'United States of America',
    startYear: 1836,
    endYear: 1845,
    entityId: 'republic_of_texas',
    entityName: 'Republic of Texas (Lone Star Republic)',
    historicalName: 'Republic of Texas',
    ruler: 'President Sam Houston / Mirabeau B. Lamar / Anson Jones',
    capital: 'Austin / Houston',
    populationEstimate: '140,000',
    color: '#d97706',
    isOpenSpace: false,
    description: 'Independent sovereign republic in North America between 1836 and 1845 following the Texas Revolution (Battle of the Alamo & San Jacinto) prior to US annexation.',
    keyEvents: [
      'Texas Declaration of Independence and Battle of San Jacinto (1836)',
      'Annexation as the 28th US State (December 1845)'
    ],
    polygonLonLat: [
      [-103.0, 36.5], [-94.5, 33.5], [-94.0, 29.5], [-97.5, 25.8], [-103.0, 30.0]
    ],
    frontierLinesLonLat: [
      [[-103.0, 36.5], [-94.5, 33.5], [-94.0, 29.5]],
      [[-103.0, 36.5], [-103.0, 30.0], [-97.5, 25.8]]
    ],
    labelLonLat: [-98.5, 31.5]
  },
  {
    id: 'usa_oregon_country_disputed_1818_1845',
    targetCountry: 'United States of America',
    startYear: 1818,
    endYear: 1845,
    entityId: 'oregon_country_joint',
    entityName: 'Oregon Country / Columbia District (Anglo-American Joint Occupation)',
    historicalName: 'Oregon Country / Hudson\'s Bay Company Columbia District',
    ruler: 'Joint US & British (Hudson\'s Bay Company at Fort Vancouver) Administration',
    capital: 'Fort Vancouver & Oregon City',
    populationEstimate: 'Indigenous Pacific Northwest Nations, Fur Trappers & Pioneers',
    color: '#a855f7',
    isOpenSpace: false,
    description: 'Pacific Northwest region between the 42nd parallel and 54°40\'N jointly occupied by Great Britain and the United States under the Treaty of 1818 until the 1846 Oregon Treaty set the 49th parallel border.',
    keyEvents: [
      'Anglo-American Convention of 1818 establishes joint occupancy of the Pacific Northwest',
      'Oregon Trail migrations (1840s) and 1846 Oregon Treaty dividing the territory at the 49th parallel'
    ],
    polygonLonLat: [
      [-125.0, 49.0], [-114.0, 49.0], [-106.0, 42.0], [-125.0, 42.0]
    ],
    frontierLinesLonLat: [
      [[-114.0, 49.0], [-106.0, 42.0], [-125.0, 42.0]]
    ],
    labelLonLat: [-118.5, 45.5]
  },

  // F. 1799 – 1867: RUSSIAN AMERICA (ALASKA)
  {
    id: 'usa_russian_alaska_1799_1867',
    targetCountry: 'United States of America',
    startYear: 1799,
    endYear: 1867,
    entityId: 'tsardom_and_russian_empire',
    entityName: 'Russian America (Alaska — Russian Empire)',
    historicalName: 'Russkaya Amerika (Russian-American Company)',
    ruler: 'Tsars Paul I, Alexander I, Nicholas I & Alexander II (Gov. Alexander Baranov)',
    capital: 'New Archangel (Sitka)',
    populationEstimate: '50,000 Indigenous Tlingit, Aleut, Yupik & Russian Settlers',
    color: '#4a6646',
    isOpenSpace: false,
    description: 'Colonial possession of the Russian Empire in North America administered by the Russian-American Company from New Archangel (Sitka) until the 1867 Alaska Purchase ($7.2 million).',
    keyEvents: [
      'Chartering of the Russian-American Company by Tsar Paul I (1799)',
      'Founding of New Archangel (Sitka) and Fort Ross',
      'Sold to the United States in the 1867 Treaty of Cession (Alaska Purchase)'
    ],
    polygonLonLat: [
      [-172.0, 72.0], [-141.0, 72.0], [-130.0, 54.5], [-172.0, 51.0]
    ],
    frontierLinesLonLat: [
      [[-141.0, 70.0], [-141.0, 60.0], [-130.0, 54.5]]
    ],
    labelLonLat: [-152.0, 63.5]
  },

  // G. 1861 – 1865: AMERICAN CIVIL WAR (CONFEDERATE STATES OF AMERICA vs. UNION)
  {
    id: 'usa_confederate_states_1861_1865',
    targetCountry: 'United States of America',
    startYear: 1861,
    endYear: 1865,
    entityId: 'confederate_states_of_america',
    entityName: 'Confederate States of America (The Confederacy)',
    historicalName: 'Confederate States of America (11 Seceded States)',
    ruler: 'President Jefferson Davis & Gen. Robert E. Lee',
    capital: 'Richmond, Virginia (Montgomery 1861)',
    populationEstimate: '9.1 Million (including 3.5 Million enslaved people)',
    color: '#b91c1c',
    isOpenSpace: false,
    description: 'Coalition of eleven Southern states that seceded from the United States between 1860 and 1861, fighting the four-year American Civil War against the Union until surrender at Appomattox in April 1865.',
    keyEvents: [
      'Secession of South Carolina (Dec 1860) and Battle of Fort Sumter (April 1861)',
      'Battles of Antietam (1862), Gettysburg & Vicksburg (1863), and Surrender at Appomattox (1865)'
    ],
    polygonLonLat: [
      [-106.5, 32.0], [-103.0, 36.5], [-94.5, 36.5], [-89.0, 36.5], [-82.0, 36.6],
      [-77.0, 38.8], [-75.0, 36.5], [-80.0, 24.5], [-97.5, 25.5], [-106.5, 31.8]
    ],
    frontierLinesLonLat: [
      [[-103.0, 36.5], [-94.5, 36.5], [-89.0, 36.5], [-82.0, 36.6], [-77.0, 38.8]]
    ],
    labelLonLat: [-88.5, 32.5]
  },

  // H. CANADA: NEW FRANCE (QUEBEC/ACADIA) & BRITISH RUPERT'S LAND (1608 – 1866)
  {
    id: 'canada_new_france_1608_1762',
    targetCountry: 'Canada',
    startYear: 1608,
    endYear: 1762,
    entityId: 'kingdom_of_france',
    entityName: 'New France (Canada & Acadia — Kingdom of France)',
    historicalName: 'Nouvelle-France (Vallée du Saint-Laurent & Pays d\'en Haut)',
    ruler: 'King Louis XIII, Louis XIV & Louis XV (Samuel de Champlain / Frontenac)',
    capital: 'Quebec City (Québec) & Montreal',
    populationEstimate: '70,000 French Canadiens & Algonquin/Huron Allies',
    color: '#2563eb',
    isOpenSpace: false,
    description: 'French vice-royalty established by Samuel de Champlain at Quebec in 1608, spanning the St. Lawrence River, Acadia, and the Great Lakes (Pays d\'en Haut) until the 1763 Treaty of Paris.',
    keyEvents: [
      'Samuel de Champlain founds Quebec City (1608)',
      'Great Peace of Montreal (1701) with 39 First Nations',
      'Battle of the Plains of Abraham (1759) and Treaty of Paris (1763)'
    ],
    polygonLonLat: [
      [-92.0, 49.0], [-74.0, 50.5], [-59.0, 51.0], [-59.0, 43.5],
      [-75.0, 43.0], [-85.0, 45.0], [-92.0, 49.0]
    ],
    frontierLinesLonLat: [
      [[-92.0, 49.0], [-74.0, 50.5], [-59.0, 51.0]]
    ],
    labelLonLat: [-73.5, 47.5]
  },
  {
    id: 'canada_ruperts_land_british_1670_1866',
    targetCountry: 'Canada',
    startYear: 1670,
    endYear: 1866,
    entityId: 'british_kingdom_and_empire',
    entityName: (y) => (y < 1763 ? 'Rupert\'s Land (British Hudson\'s Bay Company)' : 'British North America (Upper & Lower Canada & Rupert\'s Land)'),
    historicalName: 'British North America & Hudson\'s Bay Company Charter',
    ruler: 'British Crown & Hudson\'s Bay Company Governors',
    capital: (y) => (y < 1763 ? 'York Factory & St. John\'s' : 'Quebec City, Kingston, Toronto & Ottawa'),
    populationEstimate: '3.2 Million (1861)',
    color: '#c46c6c',
    isOpenSpace: false,
    description: 'From the 1670 Royal Charter granting the Hudson Bay drainage basin (Rupert\'s Land) to the Hudson\'s Bay Company, expanding after 1763 to encompass Upper and Lower Canada and the Maritimes prior to 1867 Confederation.',
    keyEvents: [
      'King Charles II grants the Hudson\'s Bay Company charter for Rupert\'s Land (1670)',
      'Constitutional Act of 1791 creating Upper and Lower Canada and 1867 Canadian Confederation'
    ],
    polygonLonLat: [
      [-105.0, 62.0], [-62.0, 62.0], [-52.0, 46.0], [-75.0, 43.0],
      [-95.0, 49.0], [-105.0, 49.0]
    ],
    frontierLinesLonLat: [
      [[-105.0, 62.0], [-105.0, 49.0]]
    ],
    labelLonLat: [-82.0, 53.5]
  },

  // ============================================================================
  // 2. ARABIAN PENINSULA: SAUDI ARABIA (106 BCE – 1931 CE)
  // Only the Hejaz (Red Sea coast) and Al-Hasa (Gulf coast) were under foreign empires;
  // the vast interior (Najd & Rub' al Khali) was free indigenous Arabian land / Najd Emirates!
  // ============================================================================

  // A. Nabataean / Roman Arabia Petraea in Northwest Hejaz (-150 BCE – 395 CE)
  {
    id: 'saudi_nabataea_roman_arabia_nw',
    targetCountry: 'Saudi Arabia',
    startYear: -150,
    endYear: 395,
    entityId: 'nabataea_arabia_petraea',
    entityName: (y) => (y < 106 ? 'Nabataean Kingdom (Hegra / Mada\'in Salih)' : 'Roman Province of Arabia Petraea (Northwest Hejaz)'),
    historicalName: 'Nabatu / Provincia Arabia Petraea',
    ruler: (y) => (y < 106 ? 'King Aretas IV Philopatris' : 'Roman Imperial Legate (Annexed by Trajan 106 CE)'),
    capital: 'Petra & Hegra (Al-Ula / Mada\'in Salih)',
    populationEstimate: 'Caravan Oasis Cities of Northwest Arabia',
    color: '#dc2626',
    isOpenSpace: false,
    description: 'Only the northwestern incense-route oases of Arabia (around Hegra/Al-Ula and Midian) were part of the Nabataean Kingdom and Roman Arabia Petraea; the rest of the Arabian Peninsula remained free indigenous Bedouin tribes.',
    keyEvents: [
      'Carving of the monumental rock-cut tombs at Hegra (Al-Ula / Mada\'in Salih)',
      'Emperor Trajan annexes Nabataea as Arabia Petraea (106 CE)'
    ],
    polygonLonLat: [
      [34.5, 29.5], [39.0, 29.5], [38.5, 26.0], [36.0, 26.0]
    ],
    frontierLinesLonLat: [
      [[39.0, 29.5], [38.5, 26.0], [36.0, 26.0]]
    ],
    labelLonLat: [37.0, 27.8]
  },

  // B. Fatimid, Ayyubid & Mamluk Hejaz (Mecca & Medina Red Sea Strip, 969 – 1516 CE)
  {
    id: 'saudi_hejaz_mamluk_fatimid_969_1516',
    targetCountry: 'Saudi Arabia',
    startYear: 969,
    endYear: 1516,
    entityId: 'fatimid_ayyubid_mamluk_egypt',
    entityName: (y) => (y < 1171 ? 'Sharifate of Mecca (Fatimid Suzerainty — Hejaz)' : y < 1250 ? 'Sharifate of Mecca (Ayyubid Hejaz)' : 'Sharifate of Mecca & Medina (Mamluk Hejaz)'),
    historicalName: 'Al-Hijaz (Sharifate of Mecca & Medina)',
    ruler: 'Hashemite Sharifs of Mecca under Cairo Suzerainty',
    capital: 'Mecca & Medina',
    populationEstimate: 'Red Sea Holy Cities & Hajj Ports',
    color: '#059669',
    isOpenSpace: false,
    description: 'While the vast central and eastern interior of Arabia (Najd) remained autonomous indigenous Bedouin territory, the western Red Sea region of the Hejaz (Mecca, Medina, and Jeddah) was governed by the Hashemite Sharifs under Fatimid, Ayyubid, and Mamluk patronage.',
    keyEvents: [
      'Establishment of the Hashemite Sharifate of Mecca (c. 968 CE)',
      'Protection of the Red Sea Hajj pilgrimage routes from Cairo and Damascus'
    ],
    polygonLonLat: [
      [34.5, 29.5], [38.2, 28.5], [40.2, 24.5], [41.5, 21.0],
      [43.0, 17.5], [41.0, 16.5], [34.5, 28.0]
    ],
    frontierLinesLonLat: [
      [[38.2, 28.5], [40.2, 24.5], [41.5, 21.0], [43.0, 17.5]]
    ],
    labelLonLat: [39.2, 23.0]
  },

  // C. Ottoman Hejaz Vilayet along the Red Sea (1517 – 1918 CE)
  {
    id: 'saudi_ottoman_hejaz_1517_1918',
    targetCountry: 'Saudi Arabia',
    startYear: 1517,
    endYear: 1918,
    entityId: 'ottoman_empire_dynamic',
    entityName: 'Ottoman Hejaz (Sharifate of Mecca & Medina — Ottoman Empire)',
    historicalName: 'Hicaz Vilayeti (Ottoman Red Sea Province)',
    ruler: 'Ottoman Sultan (Custodian of the Two Holy Mosques) & Hashemite Emir of Mecca',
    capital: 'Mecca, Medina & Jeddah',
    populationEstimate: '1.2 Million (Hejaz Coastal Strip & Holy Cities)',
    color: '#d9534f',
    isOpenSpace: false,
    description: 'From 1517 to 1918, Ottoman sovereignty in western Arabia was strictly confined to the Hejaz mountain and Red Sea coastal strip containing Mecca, Medina, and Jeddah, while the central Arabian interior (Najd and the Rub\' al Khali) remained free indigenous Arabian territory outside Ottoman control.',
    keyEvents: [
      'Sharif Barakat II of Mecca sends the keys of the Holy Cities to Ottoman Sultan Selim I (1517)',
      'Construction of the Hejaz Railway from Damascus to Medina under Sultan Abdulhamid II (1900–1908)',
      '1916 Arab Revolt launched by Sharif Hussein bin Ali in Mecca'
    ],
    polygonLonLat: [
      [34.5, 29.5], [38.2, 28.5], [40.2, 24.5], [41.5, 21.0],
      [43.0, 17.5], [41.0, 16.5], [34.5, 28.0]
    ],
    frontierLinesLonLat: [
      [[38.2, 28.5], [40.2, 24.5], [41.5, 21.0], [43.0, 17.5]]
    ],
    labelLonLat: [39.2, 23.0]
  },

  // D. Ottoman Al-Hasa Coastal Strip on the Persian Gulf (1550–1670 & 1871–1913)
  {
    id: 'saudi_ottoman_al_hasa_1550_1670',
    targetCountry: 'Saudi Arabia',
    startYear: 1550,
    endYear: 1670,
    entityId: 'ottoman_empire_dynamic',
    entityName: 'Ottoman Lahsa Eyalet (Al-Hasa Persian Gulf Coast)',
    historicalName: 'Eyālet-i Lahsā',
    ruler: 'Ottoman Governor of Al-Hasa (until Bani Khalid expulsion in 1670)',
    capital: 'Al-Hofuf & Qatif',
    populationEstimate: 'Persian Gulf Oasis & Pearl Ports',
    color: '#d9534f',
    isOpenSpace: false,
    description: 'Coastal Persian Gulf strip around Qatif and Al-Hofuf held by the Ottomans from 1550 until the Arab Bani Khalid tribe expelled the Ottoman garrison in 1670.',
    keyEvents: [
      'Ottoman establishment of Lahsa Eyalet along the Persian Gulf coast (1550)',
      'Bani Khalid Emirate under Barrak ibn Ghurayr expels the Ottomans (1670)'
    ],
    polygonLonLat: [
      [47.5, 28.8], [51.0, 28.8], [51.5, 24.5], [48.8, 24.8]
    ],
    frontierLinesLonLat: [
      [[47.5, 28.8], [48.8, 24.8], [51.5, 24.5]]
    ],
    labelLonLat: [49.4, 26.5]
  },
  {
    id: 'saudi_ottoman_al_hasa_1871_1913',
    targetCountry: 'Saudi Arabia',
    startYear: 1871,
    endYear: 1913,
    entityId: 'ottoman_empire_dynamic',
    entityName: 'Ottoman Najd Sanjak (Al-Hasa Coastal District)',
    historicalName: 'Hasa Sanjak (Basra Vilayet)',
    ruler: 'Ottoman Mutasarrıf of Hasa (Reconquered by Ibn Saud in 1913)',
    capital: 'Al-Hofuf',
    populationEstimate: '150,000',
    color: '#d9534f',
    isOpenSpace: false,
    description: 'Eastern coastal strip of Al-Hasa re-occupied by Ottoman governor Midhat Pasha in 1871 until Abdulaziz Ibn Saud captured Al-Hofuf in 1913.',
    keyEvents: [
      'Midhat Pasha’s 1871 expedition establishes Ottoman garrisons in Qatif and Al-Hofuf',
      'Ibn Saud captures Al-Hasa in May 1913, ending Ottoman presence on the Gulf'
    ],
    polygonLonLat: [
      [47.5, 28.8], [51.0, 28.8], [51.5, 24.5], [48.8, 24.8]
    ],
    frontierLinesLonLat: [
      [[47.5, 28.8], [48.8, 24.8], [51.5, 24.5]]
    ],
    labelLonLat: [49.4, 26.5]
  },

  // E. Indigenous Central Arabian Interior: Emirate of Diriyah & Emirate/Sultanate of Nejd (1744 – 1931)
  {
    id: 'saudi_najd_diriyah_emirate_1744_1931',
    targetCountry: 'Saudi Arabia',
    startYear: 1744,
    endYear: 1931,
    entityId: 'emirate_of_nejd_saudi',
    entityName: (y) =>
      y <= 1818
        ? 'Emirate of Diriyah (First Saudi State — Najd)'
        : y <= 1891
        ? 'Emirate of Nejd (Second Saudi State) & Jabal Shammar'
        : 'Emirate / Sultanate of Nejd (Ibn Saud)',
    historicalName: 'Imarat ad-Dir\'iyyah / Saltanat Najd',
    ruler: (y) =>
      y <= 1818
        ? 'Imam Muhammad bin Saud / Abdulaziz bin Muhammad'
        : y <= 1891
        ? 'Imam Turki bin Abdullah / Faisal bin Turki & Al-Rashid of Ha\'il'
        : 'King Abdulaziz Ibn Saud',
    capital: (y) => (y <= 1818 ? 'Diriyah' : 'Riyadh & Ha\'il'),
    populationEstimate: '1.5 Million (Central Najd Oases & Bedouin Confederations)',
    color: '#15803d',
    isOpenSpace: false,
    description: 'Sovereign indigenous Arabian state centered on the Najd plateau (Diriyah and Riyadh), completely independent of the Ottoman Empire and unified with the Hejaz into the Kingdom of Saudi Arabia in 1932.',
    keyEvents: [
      '1744 Diriyah Pact establishing the First Saudi State in central Najd',
      'Ibn Saud recaptures Riyadh in 1902 and unifies Najd and Hejaz into Saudi Arabia (1932)'
    ],
    polygonLonLat: [
      [41.5, 28.0], [47.5, 28.0], [48.5, 23.0], [45.0, 20.5], [41.8, 21.5]
    ],
    frontierLinesLonLat: [
      [[41.5, 28.0], [47.5, 28.0], [48.5, 23.0], [45.0, 20.5], [41.8, 21.5], [41.5, 28.0]]
    ],
    labelLonLat: [45.2, 24.5]
  },

  // F. Hashemite Kingdom of Hejaz (1916 – 1925)
  {
    id: 'saudi_hashemite_kingdom_hejaz_1916_1925',
    targetCountry: 'Saudi Arabia',
    startYear: 1916,
    endYear: 1925,
    entityId: 'kingdom_of_hejaz',
    entityName: 'Hashemite Kingdom of Hejaz',
    historicalName: 'Al-Mamlakah al-Hijaziyyah al-Hashimiyyah',
    ruler: 'King Hussein bin Ali & King Ali bin Hussein',
    capital: 'Mecca',
    populationEstimate: '850,000',
    color: '#0d9488',
    isOpenSpace: false,
    description: 'Independent Hashemite kingdom along the Red Sea coast established during the 1916 Arab Revolt against the Ottoman Empire before its unification with Nejd in 1925.',
    keyEvents: [
      'Proclamation of the Kingdom of Hejaz in 1916',
      'Unification with the Sultanate of Nejd under Ibn Saud (1925–1932)'
    ],
    polygonLonLat: [
      [34.5, 29.5], [38.2, 28.5], [40.2, 24.5], [41.5, 21.0],
      [43.0, 17.5], [41.0, 16.5], [34.5, 28.0]
    ],
    frontierLinesLonLat: [
      [[38.2, 28.5], [40.2, 24.5], [41.5, 21.0], [43.0, 17.5]]
    ],
    labelLonLat: [39.2, 23.0]
  },

  // ============================================================================
  // 3. NORTH AFRICA: COASTAL MAGHREB & NILE VALLEY vs. SAHARA DESERT INTERIOR
  // In Antiquity & Ottoman eras, only the Mediterranean coast and Nile Valley were
  // under imperial rule; the deep Saharan interior was free Berber/Tuareg land!
  // ============================================================================
  {
    id: 'algeria_coastal_roman_ottoman_minus200_1870',
    targetCountry: 'Algeria',
    startYear: -200,
    endYear: 1870,
    entityId: 'coastal_algeria_historical',
    entityName: (y) =>
      y < -46
        ? 'Kingdom of Numidia (Coastal Tell Atlas)'
        : y <= 430
        ? 'Roman Mauretania Caesariensis & Numidia'
        : y < 698
        ? 'Vandal / Byzantine & Berber Mauro-Roman Kingdoms'
        : y < 1516
        ? 'Rustamid, Zirid, Almohad & Zayyanid Kingdom of Tlemcen'
        : y < 1830
        ? 'Ottoman Regency of Algiers (Coastal Maghreb)'
        : 'French Coastal Algeria (Early Conquest)',
    historicalName: 'Tell Atlas & Mediterranean Coast of Algeria',
    ruler: (y) =>
      y < -46
        ? 'King Massinissa / Jugurtha of Numidia'
        : y <= 430
        ? 'Roman Imperial Governors'
        : y < 1516
        ? 'Berber & Islamic Dynasties of Tlemcen & Béjaïa'
        : y < 1830
        ? 'Dey of Algiers & Barbarossa Corsair Regency (Ottoman Suzerainty)'
        : 'French Governor-General vs. Emir Abdelkader',
    capital: 'Cirta (Constantine), Tlemcen & Algiers',
    populationEstimate: '2.5 – 3.5 Million (Mediterranean Tell)',
    color: (y) => (y >= -46 && y <= 430 ? '#dc2626' : y >= 1516 && y < 1830 ? '#d9534f' : y >= 1830 ? '#2563eb' : '#10b981'),
    isOpenSpace: false,
    description: 'Throughout antiquity, the medieval era, and the Ottoman Regency of Algiers (1516–1830), state rule was concentrated north of the Saharan Atlas mountains along the Mediterranean coast, while the vast Sahara Desert to the south remained free indigenous Tuareg and Berber territory.',
    keyEvents: [
      'Numidian kingdom under Massinissa and Roman urbanization at Timgad and Tipasa',
      'Ottoman Regency of Algiers established by Hayreddin Barbarossa (1516–1830)',
      'Emir Abdelkader leads resistance against the 1830 French invasion'
    ],
    polygonLonLat: [
      [-2.5, 37.5], [9.0, 37.5], [8.5, 32.8], [-2.5, 32.2]
    ],
    frontierLinesLonLat: [
      [[-2.5, 32.2], [8.5, 32.8]]
    ],
    labelLonLat: [3.2, 35.5]
  },
  {
    id: 'libya_coastal_tripolitania_cyrenaica_minus600_1911',
    targetCountry: 'Libya',
    startYear: -600,
    endYear: 1911,
    entityId: 'coastal_libya_historical',
    entityName: (y) =>
      y < -74
        ? 'Carthaginian Tripolitania & Greek Cyrenaica'
        : y <= 395
        ? 'Roman Tripolitania & Cyrenaica'
        : y <= 642
        ? 'Byzantine Exarchate of Africa (Coastal Libya)'
        : y < 1551
        ? 'Islamic Ifriqiya, Fatimid & Hafsid Coastal Tripolitania'
        : 'Ottoman Tripolitania (Trablusgarp Vilayet & Karamanli Dynasty)',
    historicalName: 'Tripolitania & Cyrenaica (Mediterranean Coast)',
    ruler: (y) => (y <= 395 ? 'Roman Proconsuls (Emperor Septimius Severus of Leptis Magna)' : y >= 1551 ? 'Ottoman Pashas & Karamanli Beys of Tripoli' : 'Regional Emirs'),
    capital: 'Tripoli (Oea), Leptis Magna & Cyrene (Benghazi)',
    populationEstimate: '600,000 – 1.0 Million',
    color: (y) => (y >= -74 && y <= 395 ? '#dc2626' : y > 395 && y <= 642 ? '#7c3aed' : y >= 1551 ? '#d9534f' : '#059669'),
    isOpenSpace: false,
    description: 'Imperial rule in Libya (under Carthage, Rome, Byzantium, and the Ottoman Empire from 1551 to 1911) was concentrated along the fertile Mediterranean coastal strips of Tripolitania and Cyrenaica, while the deep Fezzan and Saharan interior was autonomous Tuareg, Toubou, and Senussi territory.',
    keyEvents: [
      'Roman Emperor Septimius Severus monumentalizes his hometown of Leptis Magna',
      'Turgut Reis captures Tripoli for the Ottoman Empire (1551)',
      'Italo-Turkish War (1911–1912) and Omar Mukhtar’s desert resistance'
    ],
    polygonLonLat: [
      [9.5, 34.0], [25.5, 33.0], [25.2, 29.8], [19.0, 29.2], [9.5, 30.0]
    ],
    frontierLinesLonLat: [
      [[9.5, 30.0], [19.0, 29.2], [25.2, 29.8]]
    ],
    labelLonLat: [16.5, 31.4]
  },

  // ============================================================================
  // 4. EURASIA: RUSSIA WEST OF THE URALS vs. INDIGENOUS SIBERIA (882 – 1640 CE)
  // ============================================================================
  {
    id: 'russia_european_west_of_urals_882_1581',
    targetCountry: 'Russia',
    startYear: 882,
    endYear: 1581,
    entityId: 'kievan_rus_muscovy',
    entityName: (y) =>
      y < 1240
        ? 'Kievan Rus\' & Novgorod Republic (West of the Urals)'
        : y < 1480
        ? 'Grand Duchy of Moscow, Novgorod & Golden Horde Steppe'
        : 'Tsardom of Russia / Muscovy (European Russia)',
    historicalName: 'Rus\' / Moskovskoye Gosudarstvo',
    ruler: (y) => (y < 1240 ? 'Vladimir the Great / Yaroslav the Wise' : y < 1480 ? 'Dmitry Donskoy / Ivan III' : 'Ivan III the Great / Tsar Ivan IV'),
    capital: (y) => (y < 1240 ? 'Kyiv & Veliky Novgorod' : 'Moscow'),
    populationEstimate: '6 – 11 Million',
    color: '#15803d',
    isOpenSpace: false,
    description: 'Prior to Yermak’s 1582 expedition across the Ural Mountains, Russian principalities (Kievan Rus\', Novgorod, and Muscovy) were located west of the Urals, while all of Siberia to the Pacific was inhabited by the Khanate of Sibir and autonomous indigenous Siberian peoples.',
    keyEvents: [
      'Rise of Veliky Novgorod and Grand Duchy of Moscow west of the Ural Mountains',
      'Ivan III ends Golden Horde suzerainty at the Stand on the Ugra River (1480)',
      'Conquest of Kazan (1552) and Astrakhan (1556) along the Volga'
    ],
    polygonLonLat: [
      [27.0, 70.0], [60.0, 70.0], [59.5, 50.0], [48.0, 44.0], [27.0, 44.0]
    ],
    frontierLinesLonLat: [
      [[60.0, 70.0], [59.5, 50.0], [48.0, 44.0]]
    ],
    labelLonLat: [42.0, 57.5]
  },

  // ============================================================================
  // 5. INDIA: HARAPPAN NORTHWEST, VIJAYANAGARA SOUTH, MARATHAS & SIKH EMPIRE
  // ============================================================================
  {
    id: 'india_indus_valley_northwest_minus3000_minus1500',
    targetCountry: 'India',
    startYear: -3000,
    endYear: -1500,
    entityId: 'indus_vedic_india',
    entityName: 'Indus Valley (Harappan) Civilization — Gujarat, Punjab & Haryana',
    historicalName: 'Meluhha / Harappan Urban Basin',
    ruler: 'Harappan Civic Councils & Merchant Guilds',
    capital: 'Dholavira, Lothal & Rakhigarhi',
    populationEstimate: '3 – 5 Million',
    color: '#059669',
    isOpenSpace: false,
    description: 'During the Bronze Age (3000–1500 BCE), the urban Indus-Sarasvati civilization occupied northwestern India (Gujarat, Rajasthan, Punjab, Haryana) and Pakistan, while central and southern peninsular India remained inhabited by autonomous Neolithic and Megalithic communities.',
    keyEvents: [
      'Construction of the tidal dockyard at Lothal and reservoirs of Dholavira',
      'Maritime trade between Gujarat/Indus ports and Sumerian Mesopotamia'
    ],
    polygonLonLat: [
      [68.0, 35.5], [78.5, 31.5], [76.5, 25.0], [73.0, 20.5], [68.0, 21.0]
    ],
    frontierLinesLonLat: [
      [[78.5, 31.5], [76.5, 25.0], [73.0, 20.5]]
    ],
    labelLonLat: [72.5, 25.5]
  },
  {
    id: 'india_chola_vijayanagara_south_850_1646',
    targetCountry: 'India',
    startYear: 850,
    endYear: 1646,
    entityId: 'chola_vijayanagara_south_india',
    entityName: (y) => (y < 1336 ? 'Imperial Chola, Pandya & Hoysala Empires (South India)' : 'Vijayanagara Empire (Karnata Samrajya — South India)'),
    historicalName: 'Chola Mandalam / Vijayanagara Samrajya',
    ruler: (y) => (y < 1336 ? 'Rajaraja Chola I & Rajendra Chola I' : 'Harihara I, Bukka Raya & Emperor Krishnadevaraya'),
    capital: (y) => (y < 1336 ? 'Thanjavur & Gangaikonda Cholapuram' : 'Vijayanagara (Hampi)'),
    populationEstimate: '18 – 25 Million',
    color: '#d97706',
    isOpenSpace: false,
    description: 'While the Delhi Sultanate and Mughal Empire ruled Northern India, Peninsular South India was governed by the maritime Chola Empire (850–1279) and the Vijayanagara Empire (1336–1646) centered at Hampi.',
    keyEvents: [
      'Construction of the Brihadisvara Temple at Thanjavur under Rajaraja Chola I (1010 CE)',
      'Golden Age of Vijayanagara under Emperor Krishnadevaraya (1509–1529)'
    ],
    polygonLonLat: [
      [73.0, 16.5], [84.5, 18.5], [82.0, 8.0], [74.0, 8.0]
    ],
    frontierLinesLonLat: [
      [[73.0, 16.5], [78.5, 16.8], [84.5, 18.5]]
    ],
    labelLonLat: [77.8, 13.2]
  },
  {
    id: 'india_maratha_confederacy_1674_1818',
    targetCountry: 'India',
    startYear: 1674,
    endYear: 1818,
    entityId: 'maratha_empire_india',
    entityName: 'Maratha Empire (Hindavi Swarajya / Maratha Confederacy)',
    historicalName: 'Maratha Samrajya',
    ruler: (y) => (y <= 1680 ? 'Chhatrapati Shivaji Maharaj' : y < 1740 ? 'Chhatrapati Shahu & Peshwa Baji Rao I' : 'Peshwa Balaji Baji Rao & Mahadji Shinde'),
    capital: 'Raigad, Satara & Pune',
    populationEstimate: '60 – 85 Million',
    color: '#ea580c',
    isOpenSpace: false,
    description: 'Founded by Chhatrapati Shivaji in 1674, the Maratha Empire expanded under Peshwa Baji Rao I to control most of central and western India in the 18th century before the Anglo-Maratha Wars (1775–1818).',
    keyEvents: [
      'Coronation of Chhatrapati Shivaji Maharaj at Raigad Fort (1674)',
      'Unbeaten cavalry campaigns of Peshwa Baji Rao I (1720–1740) across the Deccan and Malwa'
    ],
    polygonLonLat: [
      [68.5, 24.5], [82.5, 24.0], [83.5, 17.5], [73.0, 15.0], [68.5, 20.0]
    ],
    frontierLinesLonLat: [
      [[68.5, 24.5], [76.5, 25.5], [82.5, 24.0]],
      [[73.0, 15.0], [83.5, 17.5]]
    ],
    labelLonLat: [76.5, 20.2]
  },
  {
    id: 'india_british_eic_bengal_madras_1757_1818',
    targetCountry: 'India',
    startYear: 1757,
    endYear: 1818,
    entityId: 'british_kingdom_and_empire',
    entityName: 'British East India Company (Bengal, Bihar & Madras Presidencies)',
    historicalName: 'Honourable East India Company Rule',
    ruler: 'Governor-General in Calcutta (Warren Hastings / Lord Wellesley)',
    capital: 'Calcutta (Kolkata) & Madras (Chennai)',
    populationEstimate: '45 Million',
    color: '#c46c6c',
    isOpenSpace: false,
    description: 'Following the Battle of Plassey (1757) and Battle of Buxar (1764), the British East India Company controlled Bengal, Bihar, the Northern Circars, and Madras along the eastern and gangetic corridors while the Marathas held the interior.',
    keyEvents: [
      'Battle of Plassey (1757) and Treaty of Allahabad (1765) granting Diwani revenue rights in Bengal',
      'Anglo-Mysore and Anglo-Maratha Wars expanding Company control'
    ],
    polygonLonLat: [
      [81.5, 27.5], [92.0, 27.5], [90.0, 20.0], [80.0, 8.0],
      [77.5, 8.0], [79.5, 16.0], [83.5, 21.5], [81.5, 27.5]
    ],
    frontierLinesLonLat: [
      [[81.5, 27.5], [83.5, 21.5], [79.5, 16.0], [77.5, 8.0]]
    ],
    labelLonLat: [86.0, 23.5]
  },

  // ============================================================================
  // 6. CHINA: SONG vs. LIAO / JIN / WESTERN XIA / TIBET (907 – 1643 CE)
  // ============================================================================
  {
    id: 'china_liao_jin_north_907_1234',
    targetCountry: 'China',
    startYear: 907,
    endYear: 1234,
    entityId: 'liao_jin_northern_china',
    entityName: (y) => (y < 1115 ? 'Khitan Liao Dynasty (Northern China & Manchuria)' : 'Jurchen Jin Dynasty (North China Plain & Manchuria)'),
    historicalName: 'Da Liao / Da Jin (Northern Empire)',
    ruler: (y) => (y < 1115 ? 'Emperor Taizu (Abaoji) & Empress萧 (Xiao)' : 'Emperor Taizu (Aguda) & Emperor Shizong of Jin'),
    capital: 'Shangjing / Zhongdu (Beijing) & Kaifeng (after 1127)',
    populationEstimate: '40 – 53 Million (Jin Census 1207)',
    color: '#9333ea',
    isOpenSpace: false,
    description: 'During the Song era, Northern China and Manchuria were ruled first by the Khitan Liao Dynasty (907–1125) and then by the Jurchen Jin Dynasty (1115–1234), separated from the Southern Song along the Huai River–Qinling line.',
    keyEvents: [
      'Treaty of Chanyuan (1005) between Northern Song and Khitan Liao',
      'Jurchen Jin captures Kaifeng in 1127, establishing the Huai River border with Southern Song'
    ],
    polygonLonLat: [
      [110.0, 45.0], [135.0, 53.0], [135.0, 33.5], [107.0, 33.8]
    ],
    frontierLinesLonLat: [
      [[107.0, 33.8], [121.0, 33.5]],
      [[110.0, 45.0], [107.0, 33.8]]
    ],
    labelLonLat: [119.0, 39.5]
  },
  {
    id: 'china_tibetan_plateau_618_1720',
    targetCountry: 'China',
    startYear: 618,
    endYear: 1720,
    entityId: 'tibetan_empire_realms',
    entityName: (y) => (y <= 842 ? 'Tibetan Empire (Tubo — Songtsen Gampo & Trisong Detsen)' : 'Tibetan Kingdoms (Guge, Sakya, Phagmodrupa & Ganden Phodrang)'),
    historicalName: 'Bod Chen Po (Tibetan Plateau)',
    ruler: (y) => (y <= 842 ? 'Emperor Songtsen Gampo & Trisong Detsen' : 'Sakya Pandita / 5th Dalai Lama Ngawang Lobsang Gyatso'),
    capital: 'Lhasa (Potala Palace)',
    populationEstimate: '2.5 – 4.0 Million',
    color: '#9e8e52',
    isOpenSpace: false,
    description: 'High-altitude civilization on the Tibetan Plateau that rivaled Tang China as a military empire (618–842 CE) and remained politically distinct from Song and Ming China prior to Qing integration in 1720.',
    keyEvents: [
      'Unification of the Tibetan Plateau under Songtsen Gampo (7th century)',
      'Construction of the Potala Palace in Lhasa by the 5th Dalai Lama (1645)'
    ],
    polygonLonLat: [
      [78.0, 36.5], [102.0, 36.0], [100.0, 27.5], [78.0, 27.5]
    ],
    frontierLinesLonLat: [
      [[78.0, 36.5], [102.0, 36.0], [100.0, 27.5]]
    ],
    labelLonLat: [89.5, 31.8]
  },

  // ============================================================================
  // 7. SOUTH AMERICA: PORTUGUESE COASTAL BRAZIL vs. AMAZONIA & MAPUCHE PATAGONIA
  // ============================================================================
  {
    id: 'brazil_portuguese_tordesillas_coast_1500_1750',
    targetCountry: 'Brazil',
    startYear: 1500,
    endYear: 1750,
    entityId: 'portuguese_empire',
    entityName: 'Portuguese Colonial Brazil (East of the Tordesillas Line)',
    historicalName: 'Estado do Brasil (Império Português)',
    ruler: 'Portuguese Crown & Governor-General in Salvador da Bahia',
    capital: 'Salvador da Bahia (Rio de Janeiro after 1763)',
    populationEstimate: '1.5 Million (Atlantic Captaincies)',
    color: '#589868',
    isOpenSpace: false,
    description: 'Under the 1494 Treaty of Tordesillas (until the 1750 Treaty of Madrid), Portuguese Brazil was confined to the eastern Atlantic captaincies (Bahia, Pernambuco, Rio de Janeiro, São Paulo), while the vast Amazon Basin interior remained uncolonized indigenous territory.',
    keyEvents: [
      'Pedro Álvares Cabral lands in Bahia (1500) under the Treaty of Tordesillas meridian',
      'Sugar cane captaincies of Pernambuco and Bahia and Bandeirantes expeditions'
    ],
    polygonLonLat: [
      [-48.5, 0.0], [-34.0, -5.0], [-38.0, -18.0], [-48.5, -29.0], [-51.5, -20.0]
    ],
    frontierLinesLonLat: [
      [[-48.5, 0.0], [-51.5, -20.0], [-48.5, -29.0]]
    ],
    labelLonLat: [-42.0, -13.5]
  },
  {
    id: 'argentina_spanish_early_north_1536_1879',
    targetCountry: 'Argentina',
    startYear: 1536,
    endYear: 1879,
    entityId: 'argentina_northern_settled',
    entityName: (y) => (y < 1810 ? 'Spanish Governorate / Viceroyalty of the Río de la Plata' : 'United Provinces of the Río de la Plata / Argentine Confederation'),
    historicalName: 'Río de la Plata (North of the Patagonia Frontier)',
    ruler: (y) => (y < 1810 ? 'Spanish Viceroy in Buenos Aires' : 'José de San Martín / Juan Manuel de Rosas / Bartolomé Mitre'),
    capital: 'Buenos Aires & Córdoba',
    populationEstimate: '1.8 Million (1869)',
    color: (y) => (y < 1810 ? '#bd9e42' : '#f4a582'),
    isOpenSpace: false,
    description: 'Until the 1879–1880 "Conquest of the Desert," Spanish and Argentine control extended only down to the Río Salado / Río Negro (~38°S), while all of Southern Patagonia remained sovereign indigenous Mapuche and Tehuelche territory.',
    keyEvents: [
      'Founding of Buenos Aires, Córdoba, and Tucumán',
      'May Revolution of 1810 and 1816 Declaration of Independence at Tucumán'
    ],
    polygonLonLat: [
      [-70.0, -21.5], [-53.0, -21.5], [-56.0, -38.5], [-71.5, -38.5]
    ],
    frontierLinesLonLat: [
      [[-71.5, -38.5], [-56.0, -38.5]]
    ],
    labelLonLat: [-63.5, -32.0]
  },

  // ============================================================================
  // 8. SOUTHERN AFRICA & AUSTRALIA: CAPE COLONY, BOER REPUBLICS & NSW
  // ============================================================================
  {
    id: 'south_africa_cape_colony_1652_1902',
    targetCountry: 'South Africa',
    startYear: 1652,
    endYear: 1902,
    entityId: 'cape_colony_south_africa',
    entityName: (y) => (y < 1795 ? 'Dutch Cape Colony (VOC Kaapkolonie)' : 'British Cape Colony & Colony of Natal'),
    historicalName: 'Kaap de Goede Hoop / Cape of Good Hope Colony',
    ruler: (y) => (y < 1795 ? 'Jan van Riebeeck & Dutch East India Company (VOC)' : 'British High Commissioner in Cape Town'),
    capital: 'Cape Town',
    populationEstimate: '1.5 Million (late 19th century)',
    color: (y) => (y < 1795 ? '#c2783f' : '#c46c6c'),
    isOpenSpace: false,
    description: 'Established by the Dutch East India Company at Table Bay in 1652 and seized by Britain in 1795/1806, occupying the southern and coastal belt while the northern interior was held by the Zulu Kingdom and the independent Boer Republics.',
    keyEvents: [
      'Jan van Riebeeck establishes the Dutch VOC supply station at Cape Town (1652)',
      'British annexation of the Cape (1806) triggering the Boer Great Trek (1836)'
    ],
    polygonLonLat: [
      [16.0, -28.5], [25.0, -30.0], [31.5, -29.0], [32.5, -35.0], [16.0, -35.0]
    ],
    frontierLinesLonLat: [
      [[16.0, -28.5], [25.0, -30.0], [31.5, -29.0]]
    ],
    labelLonLat: [21.5, -32.5]
  },
  {
    id: 'south_africa_boer_republics_1852_1902',
    targetCountry: 'South Africa',
    startYear: 1852,
    endYear: 1902,
    entityId: 'boer_republics_transvaal_ofs',
    entityName: 'Boer Republics (South African Republic / Transvaal & Orange Free State)',
    historicalName: 'Zuid-Afrikaansche Republiek (ZAR) & Oranje-Vrijstaat',
    ruler: 'President Paul Kruger & President Martinus Theunis Steyn',
    capital: 'Pretoria & Bloemfontein',
    populationEstimate: '1.1 Million',
    color: '#d97706',
    isOpenSpace: false,
    description: 'Independent Dutch-speaking Boer republics recognized in the 1852 Sand River and 1854 Bloemfontein Conventions between the Vaal, Orange, and Limpopo rivers prior to the 1899–1902 Second Anglo-Boer War.',
    keyEvents: [
      'Recognition of the Transvaal (1852) and Orange Free State (1854)',
      'Discovery of the Witwatersrand gold reef (1886) and Anglo-Boer Wars (1880–1881, 1899–1902)'
    ],
    polygonLonLat: [
      [24.5, -22.0], [32.0, -22.0], [31.0, -29.0], [24.5, -30.0]
    ],
    frontierLinesLonLat: [
      [[24.5, -30.0], [24.5, -22.0]],
      [[24.5, -30.0], [31.0, -29.0]]
    ],
    labelLonLat: [28.0, -26.2]
  },
  {
    id: 'australia_british_nsw_east_1788_1828',
    targetCountry: 'Australia',
    startYear: 1788,
    endYear: 1828,
    entityId: 'british_kingdom_and_empire',
    entityName: 'British Colony of New South Wales (Eastern Australia)',
    historicalName: 'Colony of New South Wales (East of 135°E Meridian)',
    ruler: 'Governor Arthur Phillip & Governor Lachlan Macquarie (British Crown)',
    capital: 'Sydney (Port Jackson)',
    populationEstimate: 'Early British Settlements & Indigenous Nations',
    color: '#c46c6c',
    isOpenSpace: false,
    description: 'From the arrival of the First Fleet at Sydney Cove in 1788 until 1829, British colonial claims in Australia were limited to the eastern portion (New South Wales east of 135°E), while Western and Central Australia remained uncolonized Aboriginal lands.',
    keyEvents: [
      'Arrival of the First Fleet under Arthur Phillip at Sydney Cove (January 1788)',
      'Crossing of the Blue Mountains (1813) before the 1829 Swan River Colony in Western Australia'
    ],
    polygonLonLat: [
      [135.0, -10.0], [155.0, -10.0], [155.0, -44.0], [135.0, -44.0]
    ],
    frontierLinesLonLat: [
      [[135.0, -11.5], [135.0, -35.0]]
    ],
    labelLonLat: [145.5, -28.0]
  },

  // ============================================================================
  // 9. SOUTHEAST ASIA: MALAYSIAN BORNEO (SARAWAK & NORTH BORNEO / SABAH)
  // While Peninsular Malaya gained independence in 1957 (Federation of Malaya),
  // Sarawak and North Borneo (Sabah) on Borneo Island remained under British
  // colonial rule until September 16, 1963 when they united to form Malaysia.
  // ============================================================================
  {
    id: 'malaysia_borneo_brunei_sultanate_1368_1840',
    targetCountry: 'Malaysia',
    startYear: 1368,
    endYear: 1840,
    entityId: 'sultanate_of_brunei',
    entityName: 'Sultanate of Brunei — Northern Borneo (Sarawak & Sabah)',
    historicalName: 'Kesultanan Brunei (Borneo Utara & Sarawak)',
    ruler: (y) => (y < 1485 ? 'Sultan Muhammad Shah / Sultan Sharif Ali' : y <= 1524 ? 'Sultan Bolkiah (Golden Age of Brunei)' : 'Sultans of Brunei (House of Bolkiah)'),
    capital: 'Kota Batu / Brunei Town',
    populationEstimate: '400,000 – 750,000 (Coastal Malay, Dayak, Iban & Kadazan-Dusun Peoples)',
    color: '#0d9488',
    isOpenSpace: false,
    description: 'Prior to 1841, the northern Borneo territories of Sarawak and Sabah were governed under the maritime Sultanate of Brunei (Bruneian Empire), while Peninsular Malaya was ruled by the Malacca and Johor-Riau Sultanates.',
    keyEvents: [
      'Expansion of the Bruneian Empire across northern Borneo under Sultan Bolkiah (1485–1524)',
      'Maritime trade in camphor, spices, and pearls across the South China Sea'
    ],
    polygonLonLat: [
      [109.0, 7.5], [120.0, 7.5], [120.0, 0.5], [109.0, 0.5]
    ],
    labelLonLat: [114.6, 3.2]
  },
  {
    id: 'malaysia_borneo_british_protectorate_1841_1941',
    targetCountry: 'Malaysia',
    startYear: 1841,
    endYear: 1941,
    entityId: 'british_kingdom_and_empire',
    entityName: (y) =>
      y < 1881
        ? 'Raj of Sarawak (White Rajahs) & Northern Borneo'
        : 'British Borneo (Raj of Sarawak & British North Borneo / Sabah)',
    historicalName: 'British Protectorates of Sarawak & North Borneo',
    ruler: (y) =>
      y < 1868
        ? 'Rajah Sir James Brooke (White Rajah of Sarawak)'
        : y < 1917
        ? 'Rajah Sir Charles Brooke & British North Borneo Chartered Company (under British Crown Protection)'
        : 'Rajah Sir Charles Vyner Brooke & British North Borneo Chartered Company (British Empire)',
    capital: 'Kuching (Sarawak) & Sandakan / Jesselton (North Borneo)',
    populationEstimate: '800,000 – 1.2 Million',
    color: '#c46c6c',
    isOpenSpace: false,
    description: 'From 1841 (when Sultan Omar Ali Saifuddien II granted Sarawak to James Brooke) and 1881/1888 (when the British North Borneo Chartered Company and British Protectorate treaties were established), Sarawak and North Borneo (Sabah) were administered as British Borneo protectorates distinct from Peninsular British Malaya.',
    keyEvents: [
      '1841: James Brooke becomes the first White Rajah of Sarawak, founding the Brooke Dynasty in Kuching',
      '1881: Royal Charter granted to the British North Borneo Company administering Sabah',
      '1888: Sarawak, North Borneo, and Brunei formally become British Protectorates'
    ],
    polygonLonLat: [
      [109.0, 7.5], [120.0, 7.5], [120.0, 0.5], [109.0, 0.5]
    ],
    labelLonLat: [114.6, 3.2]
  },
  {
    id: 'malaysia_borneo_british_crown_colonies_1945_1962',
    targetCountry: 'Malaysia',
    startYear: 1945,
    endYear: 1962,
    entityId: 'british_kingdom_and_empire',
    entityName: 'British Borneo — Crown Colonies of Sarawak & North Borneo (Sabah)',
    historicalName: 'Crown Colony of Sarawak & Crown Colony of North Borneo (United Kingdom)',
    ruler: (y) =>
      y < 1952
        ? 'King George VI / British Colonial Governors of Sarawak & North Borneo'
        : 'Queen Elizabeth II / British Colonial Governors of Sarawak & North Borneo',
    capital: 'Kuching & Jesselton (Kota Kinabalu)',
    populationEstimate: '1.25 Million (Sarawak & North Borneo)',
    color: '#c46c6c',
    isOpenSpace: false,
    description: 'While Peninsular Malaya achieved independence on August 31, 1957 as the Federation of Malaya, the Borneo territories of Sarawak and North Borneo (Sabah) remained under direct British control as British Crown Colonies until September 16, 1963, when they united with Malaya and Singapore under the Malaysia Agreement to form Malaysia.',
    keyEvents: [
      '1946: Sarawak and North Borneo become direct British Crown Colonies after World War II',
      '1957–1963: Remain under British colonial administration after Peninsular Malaya’s 1957 independence',
      '1962–1963: Cobbold Commission & Malaysia Agreement (July 9, 1963) leading to unification with Malaya on September 16, 1963'
    ],
    polygonLonLat: [
      [109.0, 7.5], [120.0, 7.5], [120.0, 0.5], [109.0, 0.5]
    ],
    labelLonLat: [114.6, 3.2]
  }
];

const SUB_REGION_CACHE = new Map<string, HistoricalSubRegionResolved[]>();

/**
 * Returns all active historical sub-regions for a given modern country and integer year.
 */
export function getSubRegionsForCountry(
  countryName: string,
  rawYear: number
): HistoricalSubRegionResolved[] {
  const year = Math.round(rawYear);
  if (!SUB_REGION_CLIPPED_COUNTRIES.has(countryName)) return [];

  const cacheKey = `${countryName}_${year}`;
  if (SUB_REGION_CACHE.has(cacheKey)) {
    return SUB_REGION_CACHE.get(cacheKey)!;
  }

  const resolved: HistoricalSubRegionResolved[] = [];

  for (const rule of SUB_REGION_RULES) {
    if (
      rule.targetCountry === countryName &&
      year >= rule.startYear &&
      year <= rule.endYear
    ) {
      const entityName =
        typeof rule.entityName === 'function' ? rule.entityName(year) : rule.entityName;
      const historicalName =
        typeof rule.historicalName === 'function'
          ? rule.historicalName(year)
          : rule.historicalName;
      const ruler = typeof rule.ruler === 'function' ? rule.ruler(year) : rule.ruler;
      const capital =
        typeof rule.capital === 'function' ? rule.capital(year) : rule.capital;
      const color = typeof rule.color === 'function' ? rule.color(year) : rule.color;
      const labelPos = rule.labelLonLat
        ? projectCoordinates(rule.labelLonLat[0], rule.labelLonLat[1])
        : projectCoordinates(rule.polygonLonLat[0][0], rule.polygonLonLat[0][1]);

      resolved.push({
        id: rule.id,
        targetCountry: rule.targetCountry,
        entityId: rule.entityId,
        entityName,
        historicalName,
        ruler,
        capital,
        populationEstimate: rule.populationEstimate,
        color,
        isOpenSpace: rule.isOpenSpace,
        description: rule.description,
        keyEvents: rule.keyEvents,
        svgPolygonPath: polygonToSvgPath(rule.polygonLonLat),
        svgFrontierPath: linesToSvgPath(rule.frontierLinesLonLat),
        labelPos
      });
    }
  }

  if (SUB_REGION_CACHE.size > 15000) {
    SUB_REGION_CACHE.clear();
  }
  SUB_REGION_CACHE.set(cacheKey, resolved);
  return resolved;
}
