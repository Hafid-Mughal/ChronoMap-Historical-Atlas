import * as topojson from 'topojson-client';
import worldAtlasData from 'world-atlas/countries-110m.json';
import { generateCleanMeshPath, WORLD_COASTLINES_PATH as CLEAN_COASTLINES_PATH } from './geoService';

export interface CountryEraProfile {
  entityId: string;
  entityName: string;
  historicalName: string;
  ruler: string;
  capital: string;
  populationEstimate: string;
  description: string;
  keyEvents: string[];
  color: string;
  isOpenSpace: boolean; // true when no formal state borders existed in this region for the year
}

const atlas = worldAtlasData as any;

// Outer continental and island coastlines (always crisp and unbroken at Chukotka/Bering Strait)
export const WORLD_COASTLINES_PATH: string = CLEAN_COASTLINES_PATH;

// ----------------------------------------------------
// COLOR PALETTE MATCHING "world-map.jpg" (2026 Modern Era)
// Soft pastel political map colors where adjacent nations contrast cleanly
// ----------------------------------------------------
const MODERN_PASTEL_PALETTE = [
  '#f4a582', // Soft coral
  '#a6dba0', // Pastel mint green
  '#ffe082', // Warm pastel yellow
  '#92c5de', // Sky pastel blue
  '#d1c4e9', // Soft lavender
  '#f6c992', // Peach apricot
  '#b2dfdb', // Pastel teal
  '#f8bbd0', // Soft rose pink
  '#c5e1a5', // Light sage
  '#bcaaa4', // Warm sand
  '#fff59d', // Lemon cream
  '#b39ddb'  // Muted violet
];

const SPECIFIC_MODERN_COLORS: Record<string, string> = {
  'United States of America': '#a6dba0',
  'Canada': '#f8bbd0',
  'Mexico': '#c5e1a5',
  'Brazil': '#ffe082',
  'Argentina': '#f4a582',
  'Chile': '#b39ddb',
  'Peru': '#f6c992',
  'Colombia': '#92c5de',
  'Venezuela': '#a6dba0',
  'Bolivia': '#d1c4e9',
  'Russia': '#f6c992',
  'China': '#ffe082',
  'India': '#f4a582',
  'Kazakhstan': '#a6dba0',
  'Mongolia': '#d1c4e9',
  'Australia': '#f4a582',
  'Indonesia': '#a6dba0',
  'France': '#a6dba0',
  'Germany': '#f6c992',
  'United Kingdom': '#d1c4e9',
  'Spain': '#ffe082',
  'Italy': '#c5e1a5',
  'Poland': '#f8bbd0',
  'Ukraine': '#92c5de',
  'Turkey': '#f8bbd0',
  'Iran': '#a6dba0',
  'Saudi Arabia': '#ffe082',
  'Egypt': '#f6c992',
  'Algeria': '#c5e1a5',
  'Libya': '#d1c4e9',
  'Morocco': '#f4a582',
  'Sudan': '#92c5de',
  'South Sudan': '#f6c992',
  'Ethiopia': '#ffe082',
  'Nigeria': '#a6dba0',
  'Dem. Rep. Congo': '#f8bbd0',
  'South Africa': '#c5e1a5',
  'Tanzania': '#92c5de',
  'Kenya': '#f4a582',
  'Angola': '#a6dba0',
  'Mali': '#ffe082',
  'Niger': '#f6c992',
  'Chad': '#b39ddb',
  'Greenland': '#92c5de',
  'Denmark': '#92c5de',
  'Japan': '#f8bbd0',
  'South Korea': '#a6dba0',
  'North Korea': '#d1c4e9',
  'Pakistan': '#c5e1a5',
  'Afghanistan': '#bcaaa4',
  'Iraq': '#92c5de',
  'Syria': '#c5e1a5',
  'Norway': '#f8bbd0',
  'Sweden': '#ffe082',
  'Finland': '#a6dba0',
  'Malaysia': '#f6c992',
  'Singapore': '#f4a582',
  'Brunei': '#b39ddb',
  'Maldives': '#92c5de',
  'Bahrain': '#f8bbd0',
  'Grenada': '#f4a582',
  'Barbados': '#ffe082',
  'Saint Lucia': '#92c5de',
  'St. Vin. and Gren.': '#a6dba0',
  'Dominica': '#c5e1a5',
  'Antigua and Barb.': '#f6c992',
  'St. Kitts and Nevis': '#d1c4e9',
  'Malta': '#f4a582',
  'Mauritius': '#a6dba0',
  'Seychelles': '#92c5de',
  'Comoros': '#ffe082',
  'Cabo Verde': '#b2dfdb',
  'São Tomé and Príncipe': '#c5e1a5',
  'Samoa': '#92c5de',
  'Tonga': '#f4a582',
  'Kiribati': '#ffe082',
  'Micronesia': '#92c5de',
  'Marshall Is.': '#f6c992',
  'Palau': '#b2dfdb',
  'Tuvalu': '#d1c4e9',
  'Nauru': '#f8bbd0',
  'Andorra': '#f6c992',
  'Monaco': '#f8bbd0',
  'Liechtenstein': '#d1c4e9',
  'San Marino': '#92c5de',
  'Vatican': '#ffe082'
};

function getModernCountryColor(name: string, id: string): string {
  if (SPECIFIC_MODERN_COLORS[name]) return SPECIFIC_MODERN_COLORS[name];
  let hash = 0;
  const str = name + id;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % MODERN_PASTEL_PALETTE.length;
  }
  return MODERN_PASTEL_PALETTE[Math.abs(hash)];
}

// ----------------------------------------------------
// MODERN NATION METADATA (Capitals, Contemporary Leaders & Independence Years)
// Used for accurate post-WWII decolonization & modern year-by-year profiles
// ----------------------------------------------------
interface ModernCountryMeta {
  capital: string;
  independenceYear: number; // Year sovereign modern borders apply (if post-1776)
  modernRuler2026: string;
  modernPop2026: number; // in millions
}

const MODERN_COUNTRY_META: Record<string, ModernCountryMeta> = {
  'United States of America': { capital: 'Washington, D.C.', independenceYear: 1848, modernRuler2026: 'Federal Executive / US Congress', modernPop2026: 336 },
  'Canada': { capital: 'Ottawa', independenceYear: 1867, modernRuler2026: 'Parliamentary Constitutional Monarchy', modernPop2026: 41 },
  'Mexico': { capital: 'Mexico City', independenceYear: 1821, modernRuler2026: 'Federal Presidential Republic', modernPop2026: 130 },
  'Brazil': { capital: 'Brasília (Rio de Janeiro pre-1960)', independenceYear: 1822, modernRuler2026: 'Federal Presidential Republic', modernPop2026: 216 },
  'Argentina': { capital: 'Buenos Aires', independenceYear: 1880, modernRuler2026: 'Federal Presidential Republic', modernPop2026: 46.5 },
  'Chile': { capital: 'Santiago', independenceYear: 1818, modernRuler2026: 'Presidential Republic', modernPop2026: 19.6 },
  'Peru': { capital: 'Lima', independenceYear: 1821, modernRuler2026: 'Presidential Republic', modernPop2026: 34.4 },
  'Colombia': { capital: 'Bogotá', independenceYear: 1819, modernRuler2026: 'Presidential Republic', modernPop2026: 52.2 },
  'Venezuela': { capital: 'Caracas', independenceYear: 1830, modernRuler2026: 'Federal Republic', modernPop2026: 29.0 },
  'Ecuador': { capital: 'Quito', independenceYear: 1830, modernRuler2026: 'Presidential Republic', modernPop2026: 18.2 },
  'Bolivia': { capital: 'Sucre / La Paz', independenceYear: 1825, modernRuler2026: 'Plurinational Constitutional State', modernPop2026: 12.4 },
  'Paraguay': { capital: 'Asunción', independenceYear: 1811, modernRuler2026: 'Presidential Republic', modernPop2026: 6.9 },
  'Uruguay': { capital: 'Montevideo', independenceYear: 1828, modernRuler2026: 'Presidential Republic', modernPop2026: 3.4 },
  'Cuba': { capital: 'Havana', independenceYear: 1902, modernRuler2026: 'Unitary Socialist Republic', modernPop2026: 11.1 },
  'Haiti': { capital: 'Port-au-Prince', independenceYear: 1804, modernRuler2026: 'Republic of Haiti', modernPop2026: 11.7 },
  'Dominican Rep.': { capital: 'Santo Domingo', independenceYear: 1844, modernRuler2026: 'Presidential Republic', modernPop2026: 11.3 },
  'Guatemala': { capital: 'Guatemala City', independenceYear: 1821, modernRuler2026: 'Presidential Republic', modernPop2026: 18.1 },
  'Honduras': { capital: 'Tegucigalpa', independenceYear: 1821, modernRuler2026: 'Presidential Republic', modernPop2026: 10.6 },
  'El Salvador': { capital: 'San Salvador', independenceYear: 1821, modernRuler2026: 'Presidential Republic', modernPop2026: 6.4 },
  'Nicaragua': { capital: 'Managua', independenceYear: 1821, modernRuler2026: 'Presidential Republic', modernPop2026: 7.0 },
  'Costa Rica': { capital: 'San José', independenceYear: 1821, modernRuler2026: 'Democratic Republic', modernPop2026: 5.2 },
  'Panama': { capital: 'Panama City', independenceYear: 1903, modernRuler2026: 'Presidential Republic', modernPop2026: 4.5 },
  'United Kingdom': { capital: 'London', independenceYear: 1066, modernRuler2026: 'King Charles III / UK Parliament', modernPop2026: 68.3 },
  'Ireland': { capital: 'Dublin', independenceYear: 1922, modernRuler2026: 'Parliamentary Republic (Oireachtas)', modernPop2026: 5.3 },
  'France': { capital: 'Paris', independenceYear: 843, modernRuler2026: 'French Fifth Republic', modernPop2026: 68.2 },
  'Germany': { capital: 'Berlin (Bonn 1949–1990)', independenceYear: 1871, modernRuler2026: 'Federal Parliamentary Republic', modernPop2026: 84.5 },
  'Italy': { capital: 'Rome', independenceYear: 1861, modernRuler2026: 'Italian Parliamentary Republic', modernPop2026: 58.9 },
  'Spain': { capital: 'Madrid', independenceYear: 1479, modernRuler2026: 'King Felipe VI / Cortes Generales', modernPop2026: 48.6 },
  'Portugal': { capital: 'Lisbon', independenceYear: 1139, modernRuler2026: 'Portuguese Republic', modernPop2026: 10.6 },
  'Netherlands': { capital: 'Amsterdam / The Hague', independenceYear: 1581, modernRuler2026: 'King Willem-Alexander / States General', modernPop2026: 17.9 },
  'Belgium': { capital: 'Brussels', independenceYear: 1830, modernRuler2026: 'King Philippe / Federal Parliament', modernPop2026: 11.8 },
  'Switzerland': { capital: 'Bern', independenceYear: 1291, modernRuler2026: 'Swiss Federal Council', modernPop2026: 8.9 },
  'Austria': { capital: 'Vienna', independenceYear: 1918, modernRuler2026: 'Federal Parliamentary Republic', modernPop2026: 9.1 },
  'Poland': { capital: 'Warsaw', independenceYear: 1918, modernRuler2026: 'Republic of Poland', modernPop2026: 37.6 },
  'Czechia': { capital: 'Prague', independenceYear: 1993, modernRuler2026: 'Czech Parliamentary Republic', modernPop2026: 10.9 },
  'Slovakia': { capital: 'Bratislava', independenceYear: 1993, modernRuler2026: 'Slovak Parliamentary Republic', modernPop2026: 5.4 },
  'Hungary': { capital: 'Budapest', independenceYear: 1918, modernRuler2026: 'Parliamentary Republic', modernPop2026: 9.6 },
  'Romania': { capital: 'Bucharest', independenceYear: 1878, modernRuler2026: 'Semi-Presidential Republic', modernPop2026: 19.1 },
  'Bulgaria': { capital: 'Sofia', independenceYear: 1878, modernRuler2026: 'Parliamentary Republic', modernPop2026: 6.5 },
  'Greece': { capital: 'Athens', independenceYear: 1830, modernRuler2026: 'Hellenic Parliamentary Republic', modernPop2026: 10.4 },
  'Serbia': { capital: 'Belgrade', independenceYear: 1878, modernRuler2026: 'Republic of Serbia', modernPop2026: 6.6 },
  'Croatia': { capital: 'Zagreb', independenceYear: 1991, modernRuler2026: 'Parliamentary Republic', modernPop2026: 3.9 },
  'Slovenia': { capital: 'Ljubljana', independenceYear: 1991, modernRuler2026: 'Parliamentary Republic', modernPop2026: 2.1 },
  'Bosnia and Herz.': { capital: 'Sarajevo', independenceYear: 1992, modernRuler2026: 'Parliamentary Republic', modernPop2026: 3.2 },
  'Montenegro': { capital: 'Podgorica', independenceYear: 1852, modernRuler2026: 'Parliamentary Republic', modernPop2026: 0.63 },
  'North Macedonia': { capital: 'Skopje', independenceYear: 1991, modernRuler2026: 'Parliamentary Republic', modernPop2026: 1.8 },
  'Albania': { capital: 'Tirana', independenceYear: 1912, modernRuler2026: 'Parliamentary Republic', modernPop2026: 2.8 },
  'Norway': { capital: 'Oslo', independenceYear: 1905, modernRuler2026: 'King Harald V / Storting', modernPop2026: 5.5 },
  'Sweden': { capital: 'Stockholm', independenceYear: 1523, modernRuler2026: 'King Carl XVI Gustaf / Riksdag', modernPop2026: 10.6 },
  'Denmark': { capital: 'Copenhagen', independenceYear: 965, modernRuler2026: 'King Frederik X / Folketing', modernPop2026: 6.0 },
  'Finland': { capital: 'Helsinki', independenceYear: 1917, modernRuler2026: 'Republic of Finland', modernPop2026: 5.6 },
  'Iceland': { capital: 'Reykjavík', independenceYear: 1944, modernRuler2026: 'Parliamentary Republic (Althing)', modernPop2026: 0.39 },
  'Estonia': { capital: 'Tallinn', independenceYear: 1918, modernRuler2026: 'Parliamentary Republic', modernPop2026: 1.37 },
  'Latvia': { capital: 'Riga', independenceYear: 1918, modernRuler2026: 'Parliamentary Republic', modernPop2026: 1.88 },
  'Lithuania': { capital: 'Vilnius', independenceYear: 1918, modernRuler2026: 'Semi-Presidential Republic', modernPop2026: 2.86 },
  'Russia': { capital: 'Moscow', independenceYear: 1991, modernRuler2026: 'Russian Federation', modernPop2026: 144 },
  'Ukraine': { capital: 'Kyiv', independenceYear: 1991, modernRuler2026: 'President Volodymyr Zelenskyy / Verkhovna Rada', modernPop2026: 38.0 },
  'Belarus': { capital: 'Minsk', independenceYear: 1991, modernRuler2026: 'Presidential Republic', modernPop2026: 9.2 },
  'Moldova': { capital: 'Chișinău', independenceYear: 1991, modernRuler2026: 'Parliamentary Republic', modernPop2026: 2.5 },
  'Georgia': { capital: 'Tbilisi', independenceYear: 1991, modernRuler2026: 'Parliamentary Republic', modernPop2026: 3.7 },
  'Armenia': { capital: 'Yerevan', independenceYear: 1991, modernRuler2026: 'Parliamentary Republic', modernPop2026: 3.0 },
  'Azerbaijan': { capital: 'Baku', independenceYear: 1991, modernRuler2026: 'Presidential Republic', modernPop2026: 10.2 },
  'Kazakhstan': { capital: 'Astana (Almaty pre-1997)', independenceYear: 1991, modernRuler2026: 'Presidential Republic', modernPop2026: 20.0 },
  'Uzbekistan': { capital: 'Tashkent', independenceYear: 1991, modernRuler2026: 'Presidential Republic', modernPop2026: 36.8 },
  'Turkmenistan': { capital: 'Ashgabat', independenceYear: 1991, modernRuler2026: 'Presidential Republic', modernPop2026: 6.5 },
  'Kyrgyzstan': { capital: 'Bishkek', independenceYear: 1991, modernRuler2026: 'Presidential Republic', modernPop2026: 7.1 },
  'Tajikistan': { capital: 'Dushanbe', independenceYear: 1991, modernRuler2026: 'Presidential Republic', modernPop2026: 10.1 },
  'Turkey': { capital: 'Ankara', independenceYear: 1923, modernRuler2026: 'Republic of Türkiye', modernPop2026: 85.8 },
  'Syria': { capital: 'Damascus', independenceYear: 1946, modernRuler2026: 'Syrian Transitional Administration', modernPop2026: 23.2 },
  'Lebanon': { capital: 'Beirut', independenceYear: 1943, modernRuler2026: 'Parliamentary Confessional Republic', modernPop2026: 5.5 },
  'Israel': { capital: 'Jerusalem', independenceYear: 1948, modernRuler2026: 'Parliamentary Democracy (Knesset)', modernPop2026: 9.8 },
  'Palestine': { capital: 'Ramallah / East Jerusalem', independenceYear: 1948, modernRuler2026: 'Palestinian National Authority', modernPop2026: 5.4 },
  'Jordan': { capital: 'Amman', independenceYear: 1946, modernRuler2026: 'King Abdullah II (Hashemite Kingdom)', modernPop2026: 11.3 },
  'Iraq': { capital: 'Baghdad', independenceYear: 1932, modernRuler2026: 'Federal Parliamentary Republic', modernPop2026: 45.5 },
  'Iran': { capital: 'Tehran', independenceYear: 1501, modernRuler2026: 'Islamic Republic of Iran', modernPop2026: 89.2 },
  'Saudi Arabia': { capital: 'Riyadh', independenceYear: 1932, modernRuler2026: 'House of Saud Monarchy', modernPop2026: 36.9 },
  'Yemen': { capital: 'Sana\'a', independenceYear: 1918, modernRuler2026: 'Republic of Yemen / Divided Administration', modernPop2026: 34.4 },
  'Oman': { capital: 'Muscat', independenceYear: 1650, modernRuler2026: 'Sultan Haitham bin Tariq', modernPop2026: 5.1 },
  'United Arab Emirates': { capital: 'Abu Dhabi', independenceYear: 1971, modernRuler2026: 'Federal Supreme Council', modernPop2026: 10.2 },
  'Kuwait': { capital: 'Kuwait City', independenceYear: 1961, modernRuler2026: 'House of Sabah Constitutional Emirate', modernPop2026: 4.3 },
  'Qatar': { capital: 'Doha', independenceYear: 1971, modernRuler2026: 'House of Thani Emirate', modernPop2026: 2.7 },
  'Afghanistan': { capital: 'Kabul', independenceYear: 1747, modernRuler2026: 'Kabul Administration', modernPop2026: 42.2 },
  'Pakistan': { capital: 'Islamabad (Karachi pre-1960)', independenceYear: 1947, modernRuler2026: 'Federal Parliamentary Republic', modernPop2026: 241 },
  'India': { capital: 'New Delhi', independenceYear: 1947, modernRuler2026: 'Federal Parliamentary Republic', modernPop2026: 1438 },
  'Bangladesh': { capital: 'Dhaka', independenceYear: 1971, modernRuler2026: 'Unitary Parliamentary Republic', modernPop2026: 173 },
  'Sri Lanka': { capital: 'Colombo / Sri Jayawardenepura Kotte', independenceYear: 1948, modernRuler2026: 'Semi-Presidential Republic', modernPop2026: 22.0 },
  'Nepal': { capital: 'Kathmandu', independenceYear: 1768, modernRuler2026: 'Federal Democratic Republic', modernPop2026: 30.9 },
  'Bhutan': { capital: 'Thimphu', independenceYear: 1907, modernRuler2026: 'King Jigme Khesar Namgyel Wangchuck', modernPop2026: 0.79 },
  'Myanmar': { capital: 'Naypyidaw (Yangon pre-2005)', independenceYear: 1948, modernRuler2026: 'Contested Military Council / NUG', modernPop2026: 54.6 },
  'Thailand': { capital: 'Bangkok', independenceYear: 1238, modernRuler2026: 'King Maha Vajiralongkorn (Rama X)', modernPop2026: 71.8 },
  'Vietnam': { capital: 'Hanoi', independenceYear: 1945, modernRuler2026: 'Socialist Republic of Vietnam', modernPop2026: 99.5 },
  'Cambodia': { capital: 'Phnom Penh', independenceYear: 1953, modernRuler2026: 'Constitutional Monarchy', modernPop2026: 17.0 },
  'Laos': { capital: 'Vientiane', independenceYear: 1953, modernRuler2026: 'Lao People\'s Democratic Republic', modernPop2026: 7.6 },
  'Malaysia': { capital: 'Kuala Lumpur', independenceYear: 1957, modernRuler2026: 'Federal Constitutional Elective Monarchy', modernPop2026: 34.3 },
  'Singapore': { capital: 'Singapore', independenceYear: 1965, modernRuler2026: 'Prime Minister Lawrence Wong / Parliamentary Republic', modernPop2026: 5.9 },
  'Indonesia': { capital: 'Jakarta', independenceYear: 1949, modernRuler2026: 'Unitary Presidential Republic', modernPop2026: 279 },
  'Philippines': { capital: 'Manila', independenceYear: 1946, modernRuler2026: 'Unitary Presidential Republic', modernPop2026: 117 },
  'China': { capital: 'Beijing', independenceYear: 1949, modernRuler2026: 'People\'s Republic of China', modernPop2026: 1410 },
  'Taiwan': { capital: 'Taipei', independenceYear: 1949, modernRuler2026: 'Republic of China (Taiwan)', modernPop2026: 23.4 },
  'Mongolia': { capital: 'Ulaanbaatar', independenceYear: 1911, modernRuler2026: 'Semi-Presidential Republic', modernPop2026: 3.5 },
  'North Korea': { capital: 'Pyongyang', independenceYear: 1948, modernRuler2026: 'Democratic People\'s Republic of Korea', modernPop2026: 26.2 },
  'South Korea': { capital: 'Seoul', independenceYear: 1948, modernRuler2026: 'Republic of Korea', modernPop2026: 51.7 },
  'Japan': { capital: 'Tokyo', independenceYear: 660, modernRuler2026: 'Emperor Naruhito / National Diet', modernPop2026: 124 },
  'Australia': { capital: 'Canberra (Melbourne 1901–1927)', independenceYear: 1901, modernRuler2026: 'Federal Parliamentary Commonwealth', modernPop2026: 26.8 },
  'New Zealand': { capital: 'Wellington', independenceYear: 1907, modernRuler2026: 'Parliamentary Constitutional Monarchy', modernPop2026: 5.2 },
  'Papua New Guinea': { capital: 'Port Moresby', independenceYear: 1975, modernRuler2026: 'Parliamentary Democracy', modernPop2026: 10.3 },
  'Egypt': { capital: 'Cairo', independenceYear: 1922, modernRuler2026: 'Arab Republic of Egypt', modernPop2026: 112 },
  'Libya': { capital: 'Tripoli', independenceYear: 1951, modernRuler2026: 'State of Libya', modernPop2026: 6.9 },
  'Tunisia': { capital: 'Tunis', independenceYear: 1956, modernRuler2026: 'Republic of Tunisia', modernPop2026: 12.5 },
  'Algeria': { capital: 'Algiers', independenceYear: 1962, modernRuler2026: 'People\'s Democratic Republic of Algeria', modernPop2026: 46.2 },
  'Morocco': { capital: 'Rabat', independenceYear: 1956, modernRuler2026: 'King Mohammed VI (Alaouite Dynasty)', modernPop2026: 37.8 },
  'Sudan': { capital: 'Khartoum', independenceYear: 1956, modernRuler2026: 'Transitional Sovereignty Council', modernPop2026: 48.1 },
  'South Sudan': { capital: 'Juba', independenceYear: 2011, modernRuler2026: 'Republic of South Sudan', modernPop2026: 11.1 },
  'Ethiopia': { capital: 'Addis Ababa', independenceYear: 1137, modernRuler2026: 'Federal Democratic Republic of Ethiopia', modernPop2026: 126 },
  'Eritrea': { capital: 'Asmara', independenceYear: 1993, modernRuler2026: 'State of Eritrea', modernPop2026: 3.7 },
  'Somalia': { capital: 'Mogadishu', independenceYear: 1960, modernRuler2026: 'Federal Republic of Somalia', modernPop2026: 18.1 },
  'Kenya': { capital: 'Nairobi', independenceYear: 1963, modernRuler2026: 'Republic of Kenya', modernPop2026: 55.1 },
  'Uganda': { capital: 'Kampala', independenceYear: 1962, modernRuler2026: 'Republic of Uganda', modernPop2026: 48.6 },
  'Tanzania': { capital: 'Dodoma (Dar es Salaam pre-1996)', independenceYear: 1961, modernRuler2026: 'United Republic of Tanzania', modernPop2026: 67.4 },
  'Rwanda': { capital: 'Kigali', independenceYear: 1962, modernRuler2026: 'Republic of Rwanda', modernPop2026: 14.1 },
  'Burundi': { capital: 'Gitega / Bujumbura', independenceYear: 1962, modernRuler2026: 'Republic of Burundi', modernPop2026: 13.2 },
  'Dem. Rep. Congo': { capital: 'Kinshasa', independenceYear: 1960, modernRuler2026: 'Democratic Republic of the Congo', modernPop2026: 102 },
  'Congo': { capital: 'Brazzaville', independenceYear: 1960, modernRuler2026: 'Republic of the Congo', modernPop2026: 6.1 },
  'Gabon': { capital: 'Libreville', independenceYear: 1960, modernRuler2026: 'Gabonese Republic', modernPop2026: 2.4 },
  'Cameroon': { capital: 'Yaoundé', independenceYear: 1960, modernRuler2026: 'Republic of Cameroon', modernPop2026: 28.6 },
  'Central African Rep.': { capital: 'Bangui', independenceYear: 1960, modernRuler2026: 'Central African Republic', modernPop2026: 5.7 },
  'Chad': { capital: 'N\'Djamena', independenceYear: 1960, modernRuler2026: 'Republic of Chad', modernPop2026: 18.3 },
  'Niger': { capital: 'Niamey', independenceYear: 1960, modernRuler2026: 'Republic of the Niger', modernPop2026: 27.2 },
  'Mali': { capital: 'Bamako', independenceYear: 1960, modernRuler2026: 'Republic of Mali', modernPop2026: 23.3 },
  'Mauritania': { capital: 'Nouakchott', independenceYear: 1960, modernRuler2026: 'Islamic Republic of Mauritania', modernPop2026: 4.9 },
  'Senegal': { capital: 'Dakar', independenceYear: 1960, modernRuler2026: 'Republic of Senegal', modernPop2026: 17.8 },
  'Guinea': { capital: 'Conakry', independenceYear: 1958, modernRuler2026: 'Republic of Guinea', modernPop2026: 14.2 },
  'Sierra Leone': { capital: 'Freetown', independenceYear: 1961, modernRuler2026: 'Republic of Sierra Leone', modernPop2026: 8.8 },
  'Liberia': { capital: 'Monrovia', independenceYear: 1847, modernRuler2026: 'Republic of Liberia', modernPop2026: 5.4 },
  'Côte d\'Ivoire': { capital: 'Yamoussoukro / Abidjan', independenceYear: 1960, modernRuler2026: 'Republic of Côte d\'Ivoire', modernPop2026: 28.9 },
  'Ghana': { capital: 'Accra', independenceYear: 1957, modernRuler2026: 'Republic of Ghana', modernPop2026: 34.1 },
  'Nigeria': { capital: 'Abuja (Lagos pre-1991)', independenceYear: 1960, modernRuler2026: 'Federal Republic of Nigeria', modernPop2026: 224 },
  'Angola': { capital: 'Luanda', independenceYear: 1975, modernRuler2026: 'Republic of Angola', modernPop2026: 36.7 },
  'Zambia': { capital: 'Lusaka', independenceYear: 1964, modernRuler2026: 'Republic of Zambia', modernPop2026: 20.6 },
  'Zimbabwe': { capital: 'Harare', independenceYear: 1980, modernRuler2026: 'Republic of Zimbabwe', modernPop2026: 16.7 },
  'Mozambique': { capital: 'Maputo', independenceYear: 1975, modernRuler2026: 'Republic of Mozambique', modernPop2026: 33.9 },
  'Madagascar': { capital: 'Antananarivo', independenceYear: 1960, modernRuler2026: 'Republic of Madagascar', modernPop2026: 30.3 },
  'Botswana': { capital: 'Gaborone', independenceYear: 1966, modernRuler2026: 'Republic of Botswana', modernPop2026: 2.7 },
  'Namibia': { capital: 'Windhoek', independenceYear: 1990, modernRuler2026: 'Republic of Namibia', modernPop2026: 2.6 },
  'South Africa': { capital: 'Pretoria / Cape Town / Bloemfontein', independenceYear: 1910, modernRuler2026: 'Republic of South Africa', modernPop2026: 60.4 },
  'Bahamas': { capital: 'Nassau', independenceYear: 1973, modernRuler2026: 'Commonwealth of The Bahamas', modernPop2026: 0.41 },
  'Belize': { capital: 'Belmopan', independenceYear: 1981, modernRuler2026: 'Parliamentary Constitutional Monarchy', modernPop2026: 0.41 },
  'Benin': { capital: 'Porto-Novo', independenceYear: 1960, modernRuler2026: 'Republic of Benin', modernPop2026: 13.7 },
  'Brunei': { capital: 'Bandar Seri Begawan', independenceYear: 1984, modernRuler2026: 'Sultan Hassanal Bolkiah', modernPop2026: 0.45 },
  'Burkina Faso': { capital: 'Ouagadougou', independenceYear: 1960, modernRuler2026: 'Burkina Faso Administration', modernPop2026: 23.3 },
  'Cyprus': { capital: 'Nicosia', independenceYear: 1960, modernRuler2026: 'Republic of Cyprus', modernPop2026: 1.26 },
  'Djibouti': { capital: 'Djibouti', independenceYear: 1977, modernRuler2026: 'Republic of Djibouti', modernPop2026: 1.15 },
  'Eq. Guinea': { capital: 'Malabo', independenceYear: 1968, modernRuler2026: 'Republic of Equatorial Guinea', modernPop2026: 1.71 },
  'Falkland Is.': { capital: 'Stanley', independenceYear: 1833, modernRuler2026: 'British Overseas Territory Administration', modernPop2026: 0.004 },
  'Fiji': { capital: 'Suva', independenceYear: 1970, modernRuler2026: 'Republic of Fiji', modernPop2026: 0.94 },
  'Fr. S. Antarctic Lands': { capital: 'Port-aux-Français', independenceYear: 1955, modernRuler2026: 'French Overseas Territory Administration', modernPop2026: 0.001 },
  'Gambia': { capital: 'Banjul', independenceYear: 1965, modernRuler2026: 'Republic of The Gambia', modernPop2026: 2.77 },
  'Greenland': { capital: 'Nuuk', independenceYear: 1979, modernRuler2026: 'Naalakkersuisut (Kingdom of Denmark)', modernPop2026: 0.057 },
  'Guinea-Bissau': { capital: 'Bissau', independenceYear: 1973, modernRuler2026: 'Republic of Guinea-Bissau', modernPop2026: 2.15 },
  'Guyana': { capital: 'Georgetown', independenceYear: 1966, modernRuler2026: 'Co-operative Republic of Guyana', modernPop2026: 0.81 },
  'Jamaica': { capital: 'Kingston', independenceYear: 1962, modernRuler2026: 'Parliamentary Constitutional Monarchy', modernPop2026: 2.83 },
  'Kosovo': { capital: 'Pristina', independenceYear: 2008, modernRuler2026: 'Republic of Kosovo', modernPop2026: 1.76 },
  'Lesotho': { capital: 'Maseru', independenceYear: 1966, modernRuler2026: 'Kingdom of Lesotho', modernPop2026: 2.33 },
  'Luxembourg': { capital: 'Luxembourg', independenceYear: 1815, modernRuler2026: 'Grand Duchy of Luxembourg', modernPop2026: 0.67 },
  'Macedonia': { capital: 'Skopje', independenceYear: 1991, modernRuler2026: 'Republic of North Macedonia', modernPop2026: 1.83 },
  'Malawi': { capital: 'Lilongwe', independenceYear: 1964, modernRuler2026: 'Republic of Malawi', modernPop2026: 20.9 },
  'N. Cyprus': { capital: 'North Nicosia', independenceYear: 1974, modernRuler2026: 'Northern Cyprus Administration', modernPop2026: 0.38 },
  'New Caledonia': { capital: 'Nouméa', independenceYear: 1853, modernRuler2026: 'French Sui Generis Collectivity', modernPop2026: 0.29 },
  'Puerto Rico': { capital: 'San Juan', independenceYear: 1952, modernRuler2026: 'Commonwealth of Puerto Rico (US)', modernPop2026: 3.21 },
  'S. Sudan': { capital: 'Juba', independenceYear: 2011, modernRuler2026: 'Republic of South Sudan', modernPop2026: 11.1 },
  'Solomon Is.': { capital: 'Honiara', independenceYear: 1978, modernRuler2026: 'Solomon Islands Parliamentary Monarchy', modernPop2026: 0.74 },
  'Somaliland': { capital: 'Hargeisa', independenceYear: 1991, modernRuler2026: 'Hargeisa Administration', modernPop2026: 5.7 },
  'Suriname': { capital: 'Paramaribo', independenceYear: 1975, modernRuler2026: 'Republic of Suriname', modernPop2026: 0.62 },
  'Timor-Leste': { capital: 'Dili', independenceYear: 2002, modernRuler2026: 'Democratic Republic of Timor-Leste', modernPop2026: 1.36 },
  'Togo': { capital: 'Lomé', independenceYear: 1960, modernRuler2026: 'Togolese Republic', modernPop2026: 9.05 },
  'Trinidad and Tobago': { capital: 'Port of Spain', independenceYear: 1962, modernRuler2026: 'Republic of Trinidad and Tobago', modernPop2026: 1.53 },
  'Vanuatu': { capital: 'Port Vila', independenceYear: 1980, modernRuler2026: 'Republic of Vanuatu', modernPop2026: 0.33 },
  'W. Sahara': { capital: 'Laayoune', independenceYear: 1976, modernRuler2026: 'Disputed Territory Administration', modernPop2026: 0.60 },
  'eSwatini': { capital: 'Mbabane', independenceYear: 1968, modernRuler2026: 'Kingdom of Eswatini', modernPop2026: 1.21 },
  'Maldives': { capital: 'Malé', independenceYear: 1965, modernRuler2026: 'Presidential Republic of Maldives', modernPop2026: 0.52 },
  'Bahrain': { capital: 'Manama', independenceYear: 1971, modernRuler2026: 'King Hamad bin Isa Al Khalifa', modernPop2026: 1.58 },
  'Grenada': { capital: "St. George's", independenceYear: 1974, modernRuler2026: 'Parliamentary Constitutional Monarchy', modernPop2026: 0.125 },
  'Barbados': { capital: 'Bridgetown', independenceYear: 1966, modernRuler2026: 'Parliamentary Republic of Barbados', modernPop2026: 0.282 },
  'Saint Lucia': { capital: 'Castries', independenceYear: 1979, modernRuler2026: 'Parliamentary Constitutional Monarchy', modernPop2026: 0.180 },
  'St. Vin. and Gren.': { capital: 'Kingstown', independenceYear: 1979, modernRuler2026: 'Parliamentary Constitutional Monarchy', modernPop2026: 0.104 },
  'Dominica': { capital: 'Roseau', independenceYear: 1978, modernRuler2026: 'Commonwealth of Dominica', modernPop2026: 0.073 },
  'Antigua and Barb.': { capital: "St. John's", independenceYear: 1981, modernRuler2026: 'Parliamentary Constitutional Monarchy', modernPop2026: 0.094 },
  'St. Kitts and Nevis': { capital: 'Basseterre', independenceYear: 1983, modernRuler2026: 'Federal Parliamentary Monarchy', modernPop2026: 0.048 },
  'Malta': { capital: 'Valletta', independenceYear: 1964, modernRuler2026: 'Parliamentary Republic of Malta', modernPop2026: 0.54 },
  'Mauritius': { capital: 'Port Louis', independenceYear: 1968, modernRuler2026: 'Parliamentary Republic of Mauritius', modernPop2026: 1.30 },
  'Seychelles': { capital: 'Victoria', independenceYear: 1976, modernRuler2026: 'Presidential Republic of Seychelles', modernPop2026: 0.108 },
  'Comoros': { capital: 'Moroni', independenceYear: 1975, modernRuler2026: 'Federal Presidential Republic (Union of the Comoros)', modernPop2026: 0.85 },
  'Cabo Verde': { capital: 'Praia', independenceYear: 1975, modernRuler2026: 'Semi-Presidential Republic of Cabo Verde', modernPop2026: 0.59 },
  'São Tomé and Príncipe': { capital: 'São Tomé', independenceYear: 1975, modernRuler2026: 'Semi-Presidential Republic', modernPop2026: 0.23 },
  'Samoa': { capital: 'Apia', independenceYear: 1962, modernRuler2026: 'Independent State of Samoa (Fono)', modernPop2026: 0.225 },
  'Tonga': { capital: "Nuku'alofa", independenceYear: 1970, modernRuler2026: 'King Tupou VI / Kingdom of Tonga', modernPop2026: 0.107 },
  'Kiribati': { capital: 'South Tarawa', independenceYear: 1979, modernRuler2026: 'Republic of Kiribati', modernPop2026: 0.133 },
  'Micronesia': { capital: 'Palikir', independenceYear: 1986, modernRuler2026: 'Federated States of Micronesia', modernPop2026: 0.115 },
  'Marshall Is.': { capital: 'Majuro', independenceYear: 1986, modernRuler2026: 'Republic of the Marshall Islands', modernPop2026: 0.042 },
  'Palau': { capital: 'Ngerulmud', independenceYear: 1994, modernRuler2026: 'Republic of Palau', modernPop2026: 0.018 },
  'Tuvalu': { capital: 'Funafuti', independenceYear: 1978, modernRuler2026: 'Parliamentary Constitutional Monarchy', modernPop2026: 0.011 },
  'Nauru': { capital: 'Yaren', independenceYear: 1968, modernRuler2026: 'Republic of Nauru', modernPop2026: 0.013 },
  'Andorra': { capital: 'Andorra la Vella', independenceYear: 1278, modernRuler2026: 'Parliamentary Co-Principality of Andorra', modernPop2026: 0.080 },
  'Monaco': { capital: 'Monaco', independenceYear: 1297, modernRuler2026: 'Prince Albert II (House of Grimaldi)', modernPop2026: 0.039 },
  'Liechtenstein': { capital: 'Vaduz', independenceYear: 1719, modernRuler2026: 'Prince Hans-Adam II / Regency of Alois', modernPop2026: 0.040 },
  'San Marino': { capital: 'San Marino', independenceYear: 301, modernRuler2026: 'Captains Regent & Grand and General Council', modernPop2026: 0.034 },
  'Vatican': { capital: 'Vatican City', independenceYear: 754, modernRuler2026: 'Holy See (Sovereign State of Vatican City)', modernPop2026: 0.001 }
};

/**
 * Resolves the exact capital city of a country in a given historical or modern year.
 * Handles capital relocations (e.g., Karachi -> Islamabad in 1967, Rio de Janeiro -> Brasília in 1960,
 * Bonn -> Berlin in 1990, Almaty -> Astana in 1997, Lagos -> Abuja in 1991, Dar es Salaam -> Dodoma in 1996,
 * Yangon -> Naypyidaw in 2006, Melbourne -> Canberra in 1927, etc.).
 */
export function resolveCountryCapitalByYear(countryName: string, year: number): string {
  switch (countryName) {
    case 'Pakistan':
      return year < 1967 ? 'Karachi' : 'Islamabad';
    case 'Brazil':
      return year < 1763 ? 'Salvador' : year < 1960 ? 'Rio de Janeiro' : 'Brasília';
    case 'United States of America':
      return year < 1785 ? 'Philadelphia' : year < 1790 ? 'New York' : year < 1800 ? 'Philadelphia' : 'Washington, D.C.';
    case 'Canada':
      return year < 1841 ? 'Quebec City' : year < 1866 ? 'Montreal' : 'Ottawa';
    case 'Germany':
      return year >= 1949 && year < 1990 ? 'Bonn' : 'Berlin';
    case 'Russia':
      return year < 1240 ? 'Kyiv' : year < 1712 ? 'Moscow' : year <= 1917 ? 'Saint Petersburg' : 'Moscow';
    case 'Turkey':
      return year < 1363 ? 'Bursa' : year < 1453 ? 'Edirne' : year < 1923 ? 'Constantinople (Istanbul)' : 'Ankara';
    case 'China':
      if (year < -1600) return 'Erlitou';
      if (year < -1046) return 'Yin (Anyang)';
      if (year < -770) return "Haojing (Xi'an)";
      if (year <= -222) return 'Luoyang';
      if (year <= -206) return 'Xianyang';
      if (year <= 24) return "Chang'an";
      if (year <= 316) return 'Luoyang';
      if (year <= 580) return 'Nanjing';
      if (year <= 907) return "Chang'an";
      if (year < 1127) return 'Kaifeng';
      if (year <= 1278) return 'Hangzhou';
      if (year < 1368) return 'Beijing';
      if (year < 1420) return 'Nanjing';
      if (year < 1928) return 'Beijing';
      if (year < 1937) return 'Nanjing';
      if (year <= 1945) return 'Chongqing';
      if (year < 1949) return 'Nanjing';
      return 'Beijing';
    case 'Japan':
      return year < 794 ? 'Nara' : year < 1868 ? 'Kyoto' : 'Tokyo';
    case 'India':
      if (year < 1206) return 'Pataliputra';
      if (year < 1526) return 'Delhi';
      if (year < 1648) return 'Agra';
      if (year < 1772) return 'Delhi';
      if (year < 1911) return 'Calcutta';
      return 'New Delhi';
    case 'Iran':
      if (year <= -330) return 'Persepolis';
      if (year <= 651) return 'Ctesiphon';
      if (year < 1555) return 'Tabriz';
      if (year < 1598) return 'Qazvin';
      if (year < 1736) return 'Isfahan';
      if (year < 1750) return 'Mashhad';
      if (year < 1795) return 'Shiraz';
      return 'Tehran';
    case 'Nigeria':
      return year < 1991 ? 'Lagos' : 'Abuja';
    case 'Tanzania':
      return year < 1996 ? 'Dar es Salaam' : 'Dodoma';
    case 'Myanmar':
      return year < 1300 ? 'Bagan' : year < 1886 ? 'Mandalay' : year <= 2005 ? 'Yangon' : 'Naypyidaw';
    case 'Kazakhstan':
      return year < 1997 ? 'Almaty' : 'Astana';
    case 'Australia':
      return year < 1927 ? 'Melbourne' : 'Canberra';
    case "Côte d'Ivoire":
      return year < 1983 ? 'Abidjan' : 'Yamoussoukro';
    case 'Belize':
      return year < 1970 ? 'Belize City' : 'Belmopan';
    case 'Burundi':
      return year < 2019 ? 'Bujumbura' : 'Gitega';
    case 'Malawi':
      return year < 1975 ? 'Zomba' : 'Lilongwe';
    case 'New Zealand':
      return year < 1865 ? 'Auckland' : 'Wellington';
    case 'Poland':
      return year < 1596 ? 'Kraków' : 'Warsaw';
    case 'Spain':
      return year >= 711 && year <= 1031 ? 'Córdoba' : year < 1561 ? 'Toledo' : 'Madrid';
    case 'Italy':
      if (year >= 286 && year <= 401) return 'Milan';
      if (year >= 402 && year <= 751) return 'Ravenna';
      if (year >= 1861 && year <= 1864) return 'Turin';
      if (year >= 1865 && year <= 1870) return 'Florence';
      return 'Rome';
    case 'Thailand':
      return year <= 1350 ? 'Sukhothai' : year <= 1767 ? 'Ayutthaya' : 'Bangkok';
    case 'Vietnam':
      return year >= 1802 && year <= 1945 ? 'Huế' : 'Hanoi';
    case 'Sri Lanka':
      return year < 1017 ? 'Anuradhapura' : year < 1469 ? 'Polonnaruwa' : year < 1815 ? 'Kandy' : 'Colombo';
    case 'Egypt':
      if (year < -2055) return 'Memphis';
      if (year < -1069) return 'Thebes';
      if (year < -332) return 'Memphis';
      if (year <= 640) return 'Alexandria';
      if (year < 969) return 'Fustat';
      return 'Cairo';
    case 'Ethiopia':
      return year < 940 ? 'Aksum' : year < 1270 ? 'Lalibela' : year < 1886 ? 'Gondar' : 'Addis Ababa';
    case 'Saudi Arabia':
      return year <= 1818 ? 'Diriyah' : 'Riyadh';
    case 'Romania':
      return year < 1386 ? 'Curtea de Argeș' : year < 1659 ? 'Târgoviște' : 'Bucharest';
    case 'Georgia':
      return year < 1122 ? 'Kutaisi' : 'Tbilisi';
    case 'Cambodia':
      return year < 1431 ? 'Angkor' : year < 1865 ? 'Oudong' : 'Phnom Penh';
    case 'Laos':
      return year < 1560 ? 'Luang Prabang' : 'Vientiane';
    case 'Morocco':
      return year < 1062 ? 'Fes' : year < 1244 ? 'Marrakech' : year < 1554 ? 'Fes' : year < 1659 ? 'Marrakech' : year < 1912 ? 'Fes' : 'Rabat';
    case 'Lithuania':
      return year >= 1919 && year <= 1939 ? 'Kaunas' : 'Vilnius';
    case 'Finland':
      return year < 1812 ? 'Turku' : 'Helsinki';
    case 'Norway':
      return year < 1217 ? 'Trondheim' : year < 1299 ? 'Bergen' : 'Oslo';
    case 'South Africa':
      return 'Pretoria';
    case 'Bolivia':
      return year < 1899 ? 'Sucre' : 'La Paz';
    case 'Netherlands':
      return 'Amsterdam';
    case 'Malaysia':
      return year <= 1511 ? 'Malacca' : 'Kuala Lumpur';
    case 'Singapore':
      return 'Singapore';
    case 'Brunei':
      return 'Bandar Seri Begawan';
    case 'Malta':
      return year < 1571 ? 'Mdina' : 'Valletta';
    case 'Palau':
      return year < 2006 ? 'Koror' : 'Ngerulmud';
    case 'Cabo Verde':
      return year < 1770 ? 'Ribeira Grande (Cidade Velha)' : 'Praia';
    default: {
      const raw = MODERN_COUNTRY_META[countryName]?.capital || 'National Capital';
      return raw.split(' / ')[0].split(' (')[0];
    }
  }
}

// Interpolate historical population of a modern state based on year
function estimateModernStatePop(countryName: string, year: number): string {
  const meta = MODERN_COUNTRY_META[countryName];
  if (!meta) return `National Population (${year} CE)`;
  const pop2026 = meta.modernPop2026;
  let ratio = 1;
  if (year >= 2020) ratio = 1;
  else if (year >= 2000) ratio = 0.78 + ((year - 2000) / 26) * 0.22;
  else if (year >= 1970) ratio = 0.48 + ((year - 1970) / 30) * 0.3;
  else if (year >= 1945) ratio = 0.30 + ((year - 1945) / 25) * 0.18;
  else if (year >= 1900) ratio = 0.18 + ((year - 1900) / 45) * 0.12;
  else ratio = 0.10 + Math.max(0, (year - 1800) / 100) * 0.08;

  const est = pop2026 * ratio;
  if (est >= 10) return `${est.toFixed(1)} Million (${year} CE est.)`;
  if (est >= 1) return `${est.toFixed(2)} Million (${year} CE est.)`;
  return `${Math.round(est * 1000).toLocaleString()},000 (${year} CE est.)`;
}

// ----------------------------------------------------
// EXACT YEAR-BY-YEAR RULER & DYNASTY RESOLVERS FOR MAJOR POWERS
// Ensures that scrubbing year-by-year updates rulers and administrations accurately!
// ----------------------------------------------------
function getUSPresidentByYear(year: number): string {
  if (year < 1789) return 'Continental Congress (Revolutionary & Confederation Era)';
  if (year < 1797) return 'President George Washington';
  if (year < 1801) return 'President John Adams';
  if (year < 1809) return 'President Thomas Jefferson';
  if (year < 1817) return 'President James Madison';
  if (year < 1825) return 'President James Monroe';
  if (year < 1829) return 'President John Quincy Adams';
  if (year < 1837) return 'President Andrew Jackson';
  if (year < 1841) return 'President Martin Van Buren';
  if (year < 1845) return 'President John Tyler';
  if (year < 1849) return 'President James K. Polk';
  if (year < 1853) return 'President Zachary Taylor / Millard Fillmore';
  if (year < 1857) return 'President Franklin Pierce';
  if (year < 1861) return 'President James Buchanan';
  if (year <= 1865) return 'President Abraham Lincoln (Civil War Union)';
  if (year < 1869) return 'President Andrew Johnson';
  if (year < 1877) return 'President Ulysses S. Grant';
  if (year < 1881) return 'President Rutherford B. Hayes';
  if (year < 1885) return 'President Chester A. Arthur';
  if (year < 1889) return 'President Grover Cleveland';
  if (year < 1893) return 'President Benjamin Harrison';
  if (year < 1897) return 'President Grover Cleveland';
  if (year < 1901) return 'President William McKinley';
  if (year < 1909) return 'President Theodore Roosevelt';
  if (year < 1913) return 'President William Howard Taft';
  if (year < 1921) return 'President Woodrow Wilson';
  if (year < 1923) return 'President Warren G. Harding';
  if (year < 1929) return 'President Calvin Coolidge';
  if (year < 1933) return 'President Herbert Hoover';
  if (year < 1945) return 'President Franklin D. Roosevelt';
  if (year < 1953) return 'President Harry S. Truman';
  if (year < 1961) return 'President Dwight D. Eisenhower';
  if (year <= 1963) return 'President John F. Kennedy';
  if (year < 1969) return 'President Lyndon B. Johnson';
  if (year < 1974) return 'President Richard Nixon';
  if (year < 1977) return 'President Gerald Ford';
  if (year < 1981) return 'President Jimmy Carter';
  if (year < 1989) return 'President Ronald Reagan';
  if (year < 1993) return 'President George H. W. Bush';
  if (year < 2001) return 'President Bill Clinton';
  if (year < 2009) return 'President George W. Bush';
  if (year < 2017) return 'President Barack Obama';
  if (year < 2021) return 'President Donald Trump';
  if (year < 2025) return 'President Joe Biden';
  return 'President of the United States';
}

function getBritishMonarchByYear(year: number): string {
  if (year < 1087) return 'King William I (the Conqueror)';
  if (year < 1135) return 'King Henry I (Norman Dynasty)';
  if (year < 1154) return 'King Stephen';
  if (year < 1189) return 'King Henry II (Plantagenet / Angevin)';
  if (year < 1199) return 'King Richard I (the Lionheart)';
  if (year < 1216) return 'King John (Magna Carta Era)';
  if (year < 1272) return 'King Henry III';
  if (year < 1307) return 'King Edward I (Longshanks)';
  if (year < 1327) return 'King Edward II';
  if (year < 1377) return 'King Edward III (Hundred Years\' War)';
  if (year < 1399) return 'King Richard II';
  if (year < 1413) return 'King Henry IV (House of Lancaster)';
  if (year < 1422) return 'King Henry V (Victor of Agincourt)';
  if (year < 1461) return 'King Henry VI';
  if (year < 1485) return 'King Edward IV / Richard III (House of York)';
  if (year < 1509) return 'King Henry VII (House of Tudor)';
  if (year < 1547) return 'King Henry VIII';
  if (year < 1558) return 'King Edward VI / Queen Mary I';
  if (year < 1603) return 'Queen Elizabeth I (Elizabethan Golden Age)';
  if (year < 1625) return 'King James I & VI (House of Stuart)';
  if (year < 1649) return 'King Charles I (English Civil War)';
  if (year < 1660) return 'Oliver Cromwell (Lord Protector of the Commonwealth)';
  if (year < 1685) return 'King Charles II (Restoration)';
  if (year < 1689) return 'King James II';
  if (year < 1702) return 'King William III & Queen Mary II';
  if (year < 1714) return 'Queen Anne (Acts of Union 1707)';
  if (year < 1727) return 'King George I (House of Hanover)';
  if (year < 1760) return 'King George II';
  if (year < 1820) return 'King George III / PM William Pitt';
  if (year < 1837) return 'King George IV / King William IV';
  if (year < 1901) return 'Queen Victoria (Victorian Imperial Peak)';
  if (year < 1910) return 'King Edward VII';
  if (year < 1936) return 'King George V';
  if (year < 1952) return 'King George VI / PM Winston Churchill & Clement Attlee';
  if (year <= 2022) return 'Queen Elizabeth II';
  return 'King Charles III';
}

function getRomanRulerByYear(year: number): string {
  if (year < -509) return 'Roman Kings (Romulus to Tarquinius Superbus)';
  if (year < -100) return 'Roman Senate & Consuls (Scipio Africanus / Cato)';
  if (year < -49) return 'Late Roman Senate (Sulla / Pompey / Cicero)';
  if (year < -44) return 'Gaius Julius Caesar (Dictator Perpetuo)';
  if (year < -27) return 'Second Triumvirate (Octavian & Mark Antony)';
  if (year <= 14) return 'Emperor Caesar Augustus (First Roman Emperor)';
  if (year <= 37) return 'Emperor Tiberius';
  if (year <= 54) return 'Emperor Claudius';
  if (year <= 68) return 'Emperor Nero';
  if (year <= 96) return 'Flavian Dynasty (Vespasian, Titus, Domitian)';
  if (year <= 117) return 'Emperor Trajan (Optimus Princeps - Peak Extent)';
  if (year <= 138) return 'Emperor Hadrian';
  if (year <= 161) return 'Emperor Antoninus Pius';
  if (year <= 180) return 'Emperor Marcus Aurelius (Philosopher Emperor)';
  if (year <= 235) return 'Severan Dynasty (Septimius Severus, Caracalla)';
  if (year <= 284) return 'Crisis of the Third Century Emperors (Aurelian)';
  if (year <= 305) return 'Emperor Diocletian (Tetrarchy)';
  if (year <= 337) return 'Emperor Constantine the Great';
  if (year <= 363) return 'Constantinian Dynasty (Constantius II, Julian)';
  if (year <= 395) return 'Emperor Theodosius I';
  return 'Western / Eastern Roman Emperors';
}

function getRussianRulerByYear(year: number): string {
  if (year < 1584) return 'Tsar Ivan IV (Ivan the Terrible)';
  if (year < 1613) return 'Boris Godunov / Time of Troubles';
  if (year < 1645) return 'Tsar Michael I (Founder of Romanov Dynasty)';
  if (year < 1682) return 'Tsar Alexis I';
  if (year <= 1725) return 'Emperor Peter the Great';
  if (year < 1741) return 'Empress Anna Ioannovna';
  if (year < 1762) return 'Empress Elizabeth Petrovna';
  if (year <= 1796) return 'Empress Catherine II (the Great)';
  if (year <= 1801) return 'Emperor Paul I';
  if (year <= 1825) return 'Emperor Alexander I';
  if (year <= 1855) return 'Emperor Nicholas I';
  if (year <= 1881) return 'Emperor Alexander II (The Liberator)';
  if (year <= 1894) return 'Emperor Alexander III';
  if (year <= 1917) return 'Emperor Nicholas II (Last Tsar)';
  if (year <= 1924) return 'Vladimir Lenin (Council of People\'s Commissars)';
  if (year <= 1953) return 'Joseph Stalin (General Secretary of CPSU)';
  if (year <= 1964) return 'Nikita Khrushchev (First Secretary of CPSU)';
  if (year <= 1982) return 'Leonid Brezhnev (General Secretary of CPSU)';
  if (year <= 1985) return 'Yuri Andropov / Konstantin Chernenko';
  if (year <= 1991) return 'Mikhail Gorbachev (Perestroika & Glasnost)';
  if (year < 2000) return 'President Boris Yeltsin';
  return 'President of the Russian Federation';
}

function getOttomanRulerByYear(year: number): string {
  if (year < 1326) return 'Osman I (Founder of the Ottoman Beylik)';
  if (year < 1389) return 'Orhan Gazi / Sultan Murad I';
  if (year < 1451) return 'Sultan Bayezid I / Sultan Murad II';
  if (year <= 1481) return 'Sultan Mehmed II (The Conqueror)';
  if (year <= 1512) return 'Sultan Bayezid II';
  if (year <= 1520) return 'Sultan Selim I (The Grim)';
  if (year <= 1566) return 'Sultan Suleiman I (The Magnificent)';
  if (year < 1603) return 'Sultan Selim II / Murad III';
  if (year < 1648) return 'Sultan Ahmed I / Murad IV';
  if (year < 1703) return 'Sultan Mehmed IV & Köprülü Grand Viziers';
  if (year < 1789) return 'Sultan Ahmed III (Tulip Era) / Abdul Hamid I';
  if (year <= 1808) return 'Sultan Selim III (Nizam-i Cedid Reforms)';
  if (year <= 1839) return 'Sultan Mahmud II';
  if (year <= 1876) return 'Sultan Abdulmejid I & Abdulaziz (Tanzimat Era)';
  if (year <= 1909) return 'Sultan Abdul Hamid II';
  if (year <= 1918) return 'Sultan Mehmed V / Three Pashas';
  return 'Sultan Mehmed VI (Last Ottoman Sultan)';
}

// ----------------------------------------------------
// MASTER HISTORICAL POLITIES & DYNASTIC INTERVAL ENGINE
// Covers -3000 BCE to 2026 CE so EVERY year resolves dynamically!
// When multiple rules match a country for a given year, the entry with
// the highest `priority` (or narrowest specific time window) wins.
// ----------------------------------------------------
interface HistoricalPolityRule {
  id: string;
  startYear: number;
  endYear: number;
  priority: number;
  name: string | ((year: number) => string);
  historicalName: string | ((year: number) => string);
  ruler: string | ((year: number) => string);
  capital: string | ((year: number) => string);
  populationEstimate: string | ((year: number) => string);
  color: string | ((year: number) => string);
  description: string;
  keyEvents: string[];
  countries: string[] | ((year: number) => string[]);
}

const HISTORICAL_POLITIES: HistoricalPolityRule[] = [
  // =========================================================================
  // I. BRONZE AGE & RIVER VALLEY CIVILIZATIONS (-3000 to -1000)
  // =========================================================================
  {
    id: 'egypt_early_old_kingdom',
    startYear: -3000,
    endYear: -2056,
    priority: 50,
    name: (y) => (y < -2686 ? 'Early Dynastic Egypt' : 'Old Kingdom of Egypt (Age of Pyramids)'),
    historicalName: 'Kemet (The Two Lands of Upper & Lower Egypt)',
    ruler: (y) => (y < -2686 ? 'Pharaoh Narmer / Menes' : y < -2550 ? 'Pharaoh Djoser / Sneferu' : y < -2450 ? 'Pharaoh Khufu / Khafre' : 'Pharaoh Pepi II'),
    capital: 'Memphis (Ineb-Hedj)',
    populationEstimate: '1.5 – 2.0 Million',
    color: '#c2410c',
    description: 'The first unified territorial state in world history along the Nile valley, erecting the Step Pyramid at Saqqara and the Great Pyramids of Giza.',
    keyEvents: [
      'Unification of Upper and Lower Egypt under Pharaoh Narmer (c. 3100 BCE)',
      'Construction of the Great Pyramid of Giza under Pharaoh Khufu (c. 2560 BCE)',
      'Development of sacred hieroglyphic writing and papyrus administration'
    ],
    countries: ['Egypt']
  },
  {
    id: 'egypt_middle_kingdom',
    startYear: -2055,
    endYear: -1551,
    priority: 50,
    name: (y) => (y > -1650 ? 'Second Intermediate Egypt (Hyksos & Thebes)' : 'Middle Kingdom of Egypt'),
    historicalName: 'Kemet (11th–12th Dynasties)',
    ruler: (y) => (y < -1950 ? 'Pharaoh Mentuhotep II' : y < -1800 ? 'Pharaoh Senusret III / Amenemhat III' : 'Theban & Hyksos Rulers'),
    capital: 'Thebes (Waset) / Itjtawy',
    populationEstimate: '2.5 Million',
    color: '#b45309',
    description: 'Classical literary and engineering golden age of Egypt, expanding south into Nubia and reclaiming the Faiyum oasis before the Hyksos chariot incursion.',
    keyEvents: [
      'Reunification of Egypt under Mentuhotep II of Thebes (2055 BCE)',
      'Fortification of the southern Nubian frontier under Senusret III',
      'Introduction of the composite bow and horse-drawn war chariot'
    ],
    countries: ['Egypt']
  },
  {
    id: 'egypt_new_kingdom',
    startYear: -1550,
    endYear: -1069,
    priority: 55,
    name: 'New Kingdom of Egypt (Imperial Age)',
    historicalName: 'Kemet (18th–20th Dynasties)',
    ruler: (y) =>
      y < -1458
        ? 'Pharaoh Ahmose I / Queen Hatshepsut'
        : y < -1353
        ? 'Pharaoh Thutmose III / Amenhotep III'
        : y < -1323
        ? 'Pharaoh Akhenaten / Tutankhamun'
        : y < -1213
        ? 'Pharaoh Ramesses II (the Great)'
        : 'Pharaoh Ramesses III',
    capital: (y) => (y >= -1350 && y <= -1332 ? 'Akhetaten (Amarna)' : 'Thebes (Luxor) & Pi-Ramesses'),
    populationEstimate: '3.5 – 4.5 Million',
    color: '#d97706',
    description: 'The imperial zenith of pharaonic Egypt, stretching from the Fourth Cataract of the Nile in Sudan to the Euphrates frontier in Syria.',
    keyEvents: [
      'Campaigns of Thutmose III at Megiddo establishing the Egyptian Empire',
      'Battle of Kadesh (1274 BCE) and the world\'s first recorded peace treaty with the Hittites',
      'Repulsion of the Bronze Age Sea Peoples by Ramesses III (1178 BCE)'
    ],
    countries: (y) =>
      y >= -1500 && y <= -1180
        ? ['Egypt', 'Sudan', 'Israel', 'Palestine', 'Lebanon', 'Jordan']
        : ['Egypt', 'Sudan']
  },
  {
    id: 'egypt_late_period',
    startYear: -1068,
    endYear: -526,
    priority: 45,
    name: (y) => (y >= -744 && y <= -656 ? 'Kushite Empire (25th Dynasty of Egypt & Nubia)' : 'Late Period Kingdom of Egypt (Saite Dynasty)'),
    historicalName: 'Kemet & Kingdom of Kush',
    ruler: (y) => (y >= -744 && y <= -656 ? 'Pharaoh Piye / Taharqa' : 'Pharaoh Psamtik I / Amasis II'),
    capital: 'Sais / Napata / Memphis',
    populationEstimate: '3.5 Million',
    color: '#ca8a04',
    description: 'Era of Nubian Kushite unification of the entire Nile Valley followed by the Saite Renaissance reviving Old Kingdom art and Greek trade at Naukratis.',
    keyEvents: [
      'Unification of Sudan and Egypt under Kushite Pharaoh Piye (c. 744 BCE)',
      'Saite Renaissance and canal construction linking the Nile to the Red Sea under Necho II'
    ],
    countries: ['Egypt', 'Sudan']
  },
  {
    id: 'sumer_akkad_babylon',
    startYear: -3000,
    endYear: -912,
    priority: 52,
    name: (y) =>
      y < -2334
        ? 'Sumerian City-States (Uruk, Ur, Lagash)'
        : y <= -2154
        ? 'Akkadian Empire (First World Empire)'
        : y <= -2004
        ? 'Neo-Sumerian Empire (Third Dynasty of Ur)'
        : y <= -1595
        ? 'Old Babylonian Empire (Hammurabi\'s Realm)'
        : 'Kassite Babylonia & Middle Assyrian Empire',
    historicalName: 'Ki-en-gi & Mat Akkadi (Mesopotamia)',
    ruler: (y) =>
      y < -2334
        ? 'Gilgamesh of Uruk / Eannatum of Lagash'
        : y <= -2154
        ? 'Sargon of Akkad / Naram-Sin'
        : y <= -2004
        ? 'King Ur-Nammu / Shulgi of Ur'
        : y <= -1595
        ? 'King Hammurabi of Babylon'
        : 'Assur-uballit I / Nebuchadnezzar I',
    capital: (y) => (y < -2334 ? 'Uruk / Ur' : y <= -2154 ? 'Akkad' : y <= -2004 ? 'Ur' : 'Babylon / Assur'),
    populationEstimate: '1.2 – 2.5 Million',
    color: '#2563eb',
    description: 'The Mesopotamian cradle of civilization between the Tigris and Euphrates, pioneering cuneiform script, the wheel, ziggurats, and Hammurabi\'s Code of Laws.',
    keyEvents: [
      'Invention of Cuneiform writing and the Epic of Gilgamesh in Uruk',
      'Unification of Mesopotamia under Sargon of Akkad (2334 BCE)',
      'Promulgation of the Code of Hammurabi on basalt steles in Babylon (c. 1750 BCE)'
    ],
    countries: (y) => (y >= -2334 && y <= -2154 ? ['Iraq', 'Syria', 'Kuwait', 'Bahrain'] : ['Iraq', 'Kuwait', 'Bahrain'])
  },
  {
    id: 'hittite_empire',
    startYear: -1650,
    endYear: -1178,
    priority: 56,
    name: 'Hittite Empire (Kingdom of Hatti)',
    historicalName: 'Land of Hatti',
    ruler: (y) => (y < -1380 ? 'Hattusili I / Mursili I' : y < -1295 ? 'Suppiluliuma I' : 'Muwatalli II / Hattusili III'),
    capital: 'Hattusa (Boğazkale)',
    populationEstimate: '2.2 Million',
    color: '#9333ea',
    description: 'Anatolian Indo-European superpower commanding three-man war chariots and early iron smelting, rivaling New Kingdom Egypt for mastery of the Levant.',
    keyEvents: [
      'Sack of Babylon by Mursili I (1595 BCE)',
      'Chariot clash with Ramesses II at the Battle of Kadesh (1274 BCE)',
      'Collapse during the Late Bronze Age upheaval (c. 1178 BCE)'
    ],
    countries: (y) => (y >= -1350 ? ['Turkey', 'Syria'] : ['Turkey'])
  },
  {
    id: 'minoan_mycenaean_greece',
    startYear: -2700,
    endYear: -1100,
    priority: 50,
    name: (y) => (y < -1600 ? 'Minoan Maritime Civilization' : 'Mycenaean Greece (Achaean Kingdoms)'),
    historicalName: 'Keftiu / Ahhiyawa (Bronze Age Aegean)',
    ruler: (y) => (y < -1600 ? 'Minos Palace Thalassocracy (Knossos)' : 'Wanax of Mycenae, Pylos & Tiryns'),
    capital: (y) => (y < -1600 ? 'Knossos (Crete)' : 'Mycenae'),
    populationEstimate: '600,000',
    color: '#7c3aed',
    description: 'Bronze Age Aegean civilization of multi-story frescoed palaces, Linear A & Linear B tablets, Cyclopean citadels, and the Homeric Trojan War.',
    keyEvents: [
      'Construction of the Palace of Knossos on Crete',
      'Lion Gate fortification at Mycenae and Linear B syllabic script',
      'Expedition against Troy (c. 1184 BCE)'
    ],
    countries: ['Greece']
  },
  {
    id: 'indus_vedic_india',
    startYear: -3000,
    endYear: -600,
    priority: 50,
    name: (y) => (y < -1700 ? 'Indus Valley (Harappan) Civilization' : 'Vedic Civilization (Kuru & Panchala Realms)'),
    historicalName: (y) => (y > -1700 ? 'Aryavarta (Vedic Kingdoms)' : 'Meluhha (Harappan Realm)'),
    ruler: (y) => (y < -1700 ? 'Harappan Civic Guilds & Priest-Kings' : 'Vedic Rajas (King Sudas / Parikshit)'),
    capital: (y) => (y < -1700 ? 'Mohenjo-Daro / Harappa / Dholavira' : 'Hastinapura / Indraprastha'),
    populationEstimate: '2.0 – 8.0 Million',
    color: '#059669',
    description: 'From the grid-planned cities and standardized weights of Harappa and Mohenjo-Daro to the composition of the Rigveda, Upanishads, and Sanskrit epics along the Ganges.',
    keyEvents: [
      'Advanced hydraulic baths and covered brick drainage at Mohenjo-Daro (2500 BCE)',
      'Composition of the Rigveda and philosophical Upanishads (1500–600 BCE)',
      'Iron-plow expansion across the fertile Indo-Gangetic plain'
    ],
    countries: (y) => (y < -1500 ? ['Pakistan'] : ['India', 'Pakistan'])
  },
  {
    id: 'early_china_xia_shang_zhou',
    startYear: -3000,
    endYear: -222,
    priority: 52,
    name: (y) =>
      y < -2070
        ? 'Liangzhu & Longshan Neolithic Civilizations'
        : y < -1600
        ? 'Xia Dynasty (Erlitou Civilization)'
        : y < -1046
        ? 'Shang Dynasty China'
        : y < -771
        ? 'Western Zhou Dynasty'
        : y < -475
        ? 'Eastern Zhou (Spring & Autumn Period)'
        : 'Warring States China (Seven Hegemons)',
    historicalName: 'Huaxia / Zhongguo (Central States)',
    ruler: (y) =>
      y < -2070
        ? 'Jade & Pottery Priest-Chiefs'
        : y < -1600
        ? 'Yu the Great (Erlitou Kings)'
        : y < -1046
        ? 'King Tang / King Wu Ding / Lady Fu Hao'
        : y < -771
        ? 'King Wu of Zhou / Duke of Zhou'
        : y < -475
        ? 'King Jing of Zhou / Confucius Era'
        : 'Kings of Qin, Chu, Qi,趙 (Warring States)',
    capital: (y) => (y < -1600 ? 'Liangzhu / Erlitou' : y < -1046 ? 'Yin (Anyang)' : y < -771 ? 'Haojing (Xi\'an)' : 'Luoyang'),
    populationEstimate: (y) => (y < -1000 ? '4 – 8 Million' : '20 – 32 Million'),
    color: '#d97706',
    description: 'Continuous evolution of Chinese statecraft: ritual bronze vessels and oracle bone script under the Shang, the Mandate of Heaven under the Zhou, and the Hundred Schools of Thought.',
    keyEvents: [
      'Oracle bone script divination and monumental bronze ding vessels at Anyang',
      'Battle of Muye (1046 BCE) establishing the Zhou Mandate of Heaven',
      'Philosophical golden age of Confucius, Laozi, Mencius, and Sun Tzu'
    ],
    countries: ['China']
  },

  // =========================================================================
  // II. IRON AGE & CLASSICAL ANTIQUITY (-911 BCE to 476 CE)
  // =========================================================================
  {
    id: 'neo_assyrian_babylonian',
    startYear: -911,
    endYear: -540,
    priority: 60,
    name: (y) => (y < -609 ? 'Neo-Assyrian Empire' : 'Neo-Babylonian (Chaldean) Empire'),
    historicalName: 'Mat Ashur / Bab-ili',
    ruler: (y) =>
      y < -705
        ? 'Tiglath-Pileser III / Sargon II'
        : y < -609
        ? 'Sennacherib / Ashurbanipal'
        : 'Nebuchadnezzar II / Nabonidus',
    capital: (y) => (y < -609 ? 'Nineveh / Nimrud' : 'Babylon (Ishtar Gate)'),
    populationEstimate: '8 – 12 Million',
    color: '#1e3a8a',
    description: 'Iron-equipped military superpower of the Ancient Near East, renowned for the Library of Ashurbanipal at Nineveh and Nebuchadnezzar\'s Ishtar Gate in Babylon.',
    keyEvents: [
      'Creation of the Royal Library of Ashurbanipal preserving 30,000 cuneiform tablets',
      'Assyrian conquest of Egypt under Esarhaddon and Ashurbanipal (671–655 BCE)',
      'Reconstruction of Babylon and the Ishtar Gate under Nebuchadnezzar II'
    ],
    countries: (y) =>
      y >= -671 && y <= -655
        ? ['Iraq', 'Syria', 'Lebanon', 'Israel', 'Palestine', 'Jordan', 'Kuwait', 'Bahrain', 'Egypt']
        : ['Iraq', 'Syria', 'Lebanon', 'Israel', 'Palestine', 'Jordan', 'Kuwait', 'Bahrain']
  },
  {
    id: 'median_empire',
    startYear: -678,
    endYear: -551,
    priority: 58,
    name: 'Median Empire',
    historicalName: 'Mada (First Iranian Empire)',
    ruler: 'Cyaxares / Astyages',
    capital: 'Ecbatana (Hamadan)',
    populationEstimate: '6 Million',
    color: '#065f46',
    description: 'Confederation of Iranian tribes that allied with Babylon to overthrow Nineveh in 612 BCE and unified the Iranian plateau prior to Cyrus the Great.',
    keyEvents: [
      'Destruction of Nineveh in alliance with Nabopolassar of Babylon (612 BCE)',
      'Battle of the Eclipse (585 BCE) fixing the Halys River border with Lydia'
    ],
    countries: ['Iran']
  },
  {
    id: 'achaemenid_persian_empire',
    startYear: -550,
    endYear: -330,
    priority: 65,
    name: 'Achaemenid Persian Empire',
    historicalName: 'Khshassa (First Persian Empire)',
    ruler: (y) =>
      y < -530
        ? 'Cyrus II the Great'
        : y < -486
        ? 'Cambyses II / Darius I the Great'
        : y < -465
        ? 'Xerxes I'
        : y < -358
        ? 'Artaxerxes I / Artaxerxes II'
        : 'Artaxerxes III / Darius III',
    capital: 'Persepolis / Susa / Babylon',
    populationEstimate: '35 – 45 Million',
    color: '#047857',
    description: 'The largest empire of ancient history up to its era, spanning from the Indus to the Aegean and Nile, governed via satrapies, the Royal Road, and the Cyrus Cylinder.',
    keyEvents: [
      'Conquest of Babylon and proclamation of the Cyrus Cylinder (539 BCE)',
      'Construction of the ceremonial capital at Persepolis and the 2,700 km Royal Road',
      'Greco-Persian Wars at Marathon (490 BCE), Thermopylae, and Salamis (480 BCE)'
    ],
    countries: (y) =>
      y <= -525 && ((y >= -525 && y <= -404) || y >= -343)
        ? ['Iran', 'Iraq', 'Bahrain', 'Kuwait', 'Turkey', 'Syria', 'Lebanon', 'Israel', 'Palestine', 'Jordan', 'Egypt', 'Afghanistan', 'Pakistan', 'Turkmenistan', 'Uzbekistan', 'Azerbaijan', 'Armenia', 'Georgia']
        : ['Iran', 'Iraq', 'Bahrain', 'Kuwait', 'Turkey', 'Syria', 'Lebanon', 'Israel', 'Palestine', 'Jordan', 'Afghanistan', 'Pakistan', 'Turkmenistan', 'Uzbekistan', 'Azerbaijan', 'Armenia', 'Georgia']
  },
  {
    id: 'classical_greece',
    startYear: -800,
    endYear: -337,
    priority: 60,
    name: (y) => (y < -508 ? 'Archaic Greek City-States (Poleis)' : 'Classical Greek City-States (Athens, Sparta, Thebes)'),
    historicalName: 'Hellas (The Hellenic Poleis)',
    ruler: (y) =>
      y < -508
        ? 'Solon / Lycurgus / Peisistratos'
        : y < -429
        ? 'Cleisthenes / Themistocles / Pericles of Athens & Leonidas of Sparta'
        : 'Agesilaus II / Epaminondas of Thebes',
    capital: 'Athens / Sparta / Thebes / Corinth',
    populationEstimate: '3.5 Million',
    color: '#1d4ed8',
    description: 'Cradle of Athenian democracy, Classical philosophy (Socrates, Plato, Aristotle), Parthenon architecture, dramatic tragedy, and the hoplite phalanx.',
    keyEvents: [
      'Establishment of Athenian democracy under Cleisthenes (508 BCE)',
      'Defeat of the Persian invasions at Marathon (490 BCE) and Salamis (480 BCE)',
      'Golden Age of Pericles, construction of the Parthenon, and Peloponnesian War (431–404 BCE)'
    ],
    countries: ['Greece']
  },
  {
    id: 'macedonian_alexander_empire',
    startYear: -336,
    endYear: -312,
    priority: 80,
    name: 'Macedonian Empire of Alexander the Great',
    historicalName: 'Makedonike Autokratoria',
    ruler: (y) => (y <= -323 ? 'Alexander III the Great' : 'Philip III Arrhidaeus & Diadochi Regents'),
    capital: 'Babylon / Pella / Alexandria',
    populationEstimate: '45 Million',
    color: '#7c3aed',
    description: 'In a twelve-year campaign without a single battlefield defeat, Alexander the Great toppled the Achaemenid Empire and forged the Hellenistic world from Greece to the Indus.',
    keyEvents: [
      'Decisive victories over Persia at Granicus (334 BCE), Issus (333 BCE), and Gaugamela (331 BCE)',
      'Founding of Alexandria in Egypt and over twenty cities across Asia',
      'Death of Alexander in Babylon (323 BCE) sparking the Wars of the Diadochi'
    ],
    countries: [
      'Greece', 'North Macedonia', 'Bulgaria', 'Albania', 'Turkey', 'Syria', 'Lebanon',
      'Israel', 'Palestine', 'Jordan', 'Egypt', 'Iraq', 'Kuwait', 'Bahrain', 'Iran', 'Afghanistan',
      'Pakistan', 'Uzbekistan', 'Tajikistan', 'Turkmenistan'
    ]
  },
  {
    id: 'seleucid_empire',
    startYear: -311,
    endYear: -64,
    priority: 62,
    name: 'Seleucid Empire (Hellenistic Near East)',
    historicalName: 'Basileia ton Seleukidon',
    ruler: (y) => (y < -281 ? 'Seleucus I Nicator' : y < -187 ? 'Antiochus III the Great' : 'Antiochus IV Epiphanes / Late Seleucids'),
    capital: 'Antioch / Seleucia-on-the-Tigris',
    populationEstimate: '25 Million (Early) / 8 Million (Late)',
    color: '#6d28d9',
    description: 'The largest Hellenistic successor state of Alexander\'s empire, blending Greek polis urbanism with Mesopotamian and Persian traditions.',
    keyEvents: [
      'Founding of Seleucia-on-the-Tigris and Antioch as Hellenistic metropolises',
      'Treaty of 303 BCE with Chandragupta Maurya exchanging 500 war elephants',
      'Gradual contraction before Parthian expansion and Pompey\'s annexation (64 BCE)'
    ],
    countries: (y) =>
      y < -141
        ? ['Syria', 'Lebanon', 'Iraq', 'Kuwait', 'Bahrain', 'Iran', 'Israel', 'Palestine', 'Jordan']
        : ['Syria', 'Lebanon']
  },
  {
    id: 'ptolemaic_egypt',
    startYear: -311,
    endYear: -30,
    priority: 65,
    name: 'Ptolemaic Kingdom of Egypt',
    historicalName: 'Ptolemaike Basileia',
    ruler: (y) =>
      y < -246
        ? 'Ptolemy I Soter / Ptolemy II Philadelphus'
        : y < -51
        ? 'Ptolemy III Euergetes / Ptolemy V (Rosetta Stone)'
        : 'Queen Cleopatra VII Philopator',
    capital: 'Alexandria',
    populationEstimate: '7.5 Million',
    color: '#0284c7',
    description: 'Hellenistic kingdom ruled by the Macedonian Ptolemaic dynasty, making Alexandria the intellectual capital of the world with the Great Library and Pharos Lighthouse.',
    keyEvents: [
      'Construction of the Great Library of Alexandria and Lighthouse of Pharos',
      'Carving of the trilingual Rosetta Stone decree under Ptolemy V (196 BCE)',
      'Reign of Cleopatra VII ending after the Battle of Actium (30 BCE)'
    ],
    countries: ['Egypt']
  },
  {
    id: 'carthaginian_empire',
    startYear: -814,
    endYear: -146,
    priority: 64,
    name: 'Carthaginian Empire (Qart-Hadasht)',
    historicalName: 'Punic Maritime Republic',
    ruler: (y) => (y < -247 ? 'Suffetes & Council of 104' : 'Hamilcar Barca / Hannibal Barca'),
    capital: 'Carthage (Tunis)',
    populationEstimate: '4.0 Million',
    color: '#9333ea',
    description: 'Phoenician maritime commercial superpower dominating the western Mediterranean and fighting Rome across three Punic Wars under general Hannibal Barca.',
    keyEvents: [
      'Founding of Carthage by Phoenician settlers from Tyre (814 BCE)',
      'Hannibal\'s crossing of the Alps with war elephants and victory at Cannae (216 BCE)',
      'Siege and destruction of Carthage in the Third Punic War (146 BCE)'
    ],
    countries: (y) => (y <= -218 ? ['Tunisia', 'Malta'] : ['Tunisia'])
  },
  {
    id: 'maurya_shunga_india',
    startYear: -599,
    endYear: 29,
    priority: 64,
    name: (y) =>
      y < -322
        ? 'Magadha & the Sixteen Mahajanapadas'
        : y <= -185
        ? 'Maurya Empire (Imperial Unified India)'
        : 'Shunga & Early Satavahana Realms',
    historicalName: 'Jambudvipa / Maurya Samrajya',
    ruler: (y) =>
      y < -322
        ? 'King Bimbisara / Ajatashatru / Nanda Dynasty'
        : y < -268
        ? 'Emperor Chandragupta Maurya / Bindusara'
        : y <= -232
        ? 'Emperor Ashoka the Great (Devanampriya)'
        : 'Pushyamitra Shunga / Satakarni',
    capital: 'Pataliputra (Patna)',
    populationEstimate: '50 Million (One-third of world population)',
    color: '#059669',
    description: 'First pan-Indian imperial unification under Chandragupta Maurya and Kautilya\'s Arthashastra, reaching moral and territorial peak under Emperor Ashoka\'s Edicts.',
    keyEvents: [
      'Unification of the Indian subcontinent by Chandragupta Maurya (322 BCE)',
      'Ashoka\'s conversion to non-violence (Ahimsa) after the Kalinga War (261 BCE)',
      'Carving of the Lion Capital and Rock Edicts of Ashoka across South Asia'
    ],
    countries: (y) =>
      y >= -322 && y <= -185
        ? ['India', 'Pakistan', 'Bangladesh', 'Afghanistan', 'Nepal']
        : ['India', 'Bangladesh', 'Nepal']
  },
  {
    id: 'qin_han_three_kingdoms_china',
    startYear: -221,
    endYear: 580,
    priority: 66,
    name: (y) =>
      y <= -206
        ? 'Qin Dynasty (First Imperial Unification)'
        : y <= 9
        ? 'Western Han Dynasty'
        : y <= 23
        ? 'Xin Dynasty (Wang Mang Interregnum)'
        : y <= 220
        ? 'Eastern Han Dynasty'
        : y <= 280
        ? 'Three Kingdoms China (Wei, Shu & Wu)'
        : y <= 420
        ? 'Jin Dynasty China'
        : 'Northern & Southern Dynasties China',
    historicalName: 'Da Qin / Da Han (Imperial China)',
    ruler: (y) =>
      y <= -206
        ? 'Qin Shi Huang (First Emperor)'
        : y < -141
        ? 'Emperor Gaozu (Liu Bang) / Emperor Wen'
        : y <= -87
        ? 'Emperor Wu of Han (Han Wudi)'
        : y <= 25
        ? 'Emperor Xuan / Wang Mang'
        : y <= 220
        ? 'Emperor Guangwu / Emperor Ming'
        : y <= 280
        ? 'Cao Cao (Wei) / Liu Bei (Shu) / Sun Quan (Wu)'
        : 'Emperor Wu of Jin / Emperor Xiaowen of Northern Wei',
    capital: (y) => (y <= -206 ? 'Xianyang' : y <= 23 ? 'Chang\'an (Xi\'an)' : y <= 316 ? 'Luoyang' : 'Jiankang (Nanjing) / Luoyang'),
    populationEstimate: '58 Million (2 CE Census)',
    color: '#b91c1c',
    description: 'From Qin Shi Huang\'s standardization of script, weights, and the Terracotta Army to the 400-year Han Dynasty golden age that opened the Silk Road and invented paper.',
    keyEvents: [
      'Unification of China under Qin Shi Huang and standardization of Chinese characters (221 BCE)',
      'Zhang Qian\'s embassy to Central Asia opening the overland Silk Road (138 BCE)',
      'Invention of papermaking by Cai Lun (105 CE) and Zhang Heng\'s seismoscope'
    ],
    countries: (y) => (y >= -111 && y <= 220 ? ['China', 'Vietnam', 'North Korea'] : ['China'])
  },
  {
    id: 'xiongnu_rouran_steppe',
    startYear: -209,
    endYear: 551,
    priority: 55,
    name: (y) => (y < 150 ? 'Xiongnu Nomadic Confederation' : 'Xianbei & Rouran Khaganate'),
    historicalName: 'Xiongnu Steppe Empire',
    ruler: (y) => (y < -174 ? 'Modu Chanyu' : 'Chanyu & Khagans of the Steppe'),
    capital: 'Longcheng (Orkhon Valley)',
    populationEstimate: '1.5 Million',
    color: '#92400e',
    description: 'The first great nomadic horse-archer empire of the Eurasian steppe, prompting the construction of the Qin and Han Great Walls.',
    keyEvents: [
      'Unification of the steppe tribes by Modu Chanyu (209 BCE)',
      'Han-Xiongnu Wars for control of the Hexi Corridor and Tarim Basin oases'
    ],
    countries: ['Mongolia']
  },
  {
    id: 'parthian_sassanid_persia',
    startYear: -247,
    endYear: 651,
    priority: 68,
    name: (y) => (y < 224 ? 'Parthian Empire (Arsacid Dynasty)' : 'Sasanian Persian Empire (Eranshahr)'),
    historicalName: 'Ashkanian / Eranshahr (Empire of the Iranians)',
    ruler: (y) =>
      y < -53
        ? 'Mithridates I / Mithridates II the Great'
        : y < 224
        ? 'Orodes II / Phraates IV / Artabanus IV'
        : y < 309
        ? 'Ardashir I / Shapur I'
        : y < 531
        ? 'Shapur II / Bahram V'
        : 'Khosrow I Anushirvan / Khosrow II Parviz',
    capital: 'Ctesiphon (Tigris)',
    populationEstimate: '18 – 25 Million',
    color: '#0d9488',
    description: 'Formidable Iranian empires of heavy cataphract cavalry and composite archers that controlled the central Silk Road and rivaled Rome and Byzantium for nine centuries.',
    keyEvents: [
      'Annihilation of Crassus\'s Roman legions at the Battle of Carrhae (53 BCE)',
      'Rise of the Sasanian Dynasty under Ardashir I (224 CE) and capture of Emperor Valerian (260 CE)',
      'Golden age of Persian architecture (Taq Kasra at Ctesiphon) and academy of Gondishapur'
    ],
    countries: (y) =>
      y < -141
        ? ['Iran', 'Turkmenistan']
        : ['Iran', 'Iraq', 'Kuwait', 'Bahrain', 'Azerbaijan', 'Armenia', 'Afghanistan', 'Turkmenistan']
  },
  {
    id: 'kushan_gupta_india',
    startYear: 30,
    endYear: 550,
    priority: 64,
    name: (y) => (y < 320 ? 'Kushan Empire & Satavahana Dynasty' : 'Gupta Empire (Golden Age of India)'),
    historicalName: 'Kushano-Shahr / Gupta Samrajya',
    ruler: (y) =>
      y < 320
        ? 'Emperor Kanishka the Great / Gautamiputra Satakarni'
        : y < 380
        ? 'Chandra Gupta I / Samudragupta'
        : 'Chandra Gupta II Vikramaditya / Kumaragupta I',
    capital: (y) => (y < 320 ? 'Purushapura (Peshawar) & Mathura' : 'Pataliputra (Patna) & Ujjain'),
    populationEstimate: '45 – 55 Million',
    color: '#059669',
    description: 'From the Greco-Buddhist Silk Road crossroads of Kanishka\'s Kushan Empire to the classical Gupta Golden Age where Aryabhata formulated the decimal system, zero, and heliocentric astronomy.',
    keyEvents: [
      'Fourth Buddhist Council in Kashmir under Emperor Kanishka (c. 127 CE)',
      'Mathematical breakthroughs of Aryabhata (concept of zero, pi, and earth\'s rotation)',
      'Creation of the Ajanta Cave frescoes, Iron Pillar of Delhi, and Kalidasa\'s Sanskrit poetry'
    ],
    countries: (y) =>
      y < 320
        ? ['India', 'Pakistan', 'Afghanistan', 'Uzbekistan', 'Tajikistan']
        : ['India', 'Bangladesh', 'Pakistan', 'Nepal']
  },
  {
    id: 'roman_republic_and_empire',
    startYear: -753,
    endYear: 394,
    priority: 75,
    name: (y) =>
      y < -509
        ? 'Roman Kingdom'
        : y < -27
        ? 'Roman Republic (SPQR)'
        : 'Roman Empire (Imperium Romanum)',
    historicalName: 'Senatus Populusque Romanus / Imperium Romanum',
    ruler: getRomanRulerByYear,
    capital: (y) => (y >= 330 ? 'Rome & Constantinople' : 'Rome'),
    populationEstimate: (y) => (y < -200 ? '4 Million' : y < -27 ? '35 Million' : '60 – 70 Million'),
    color: '#dc2626',
    description: 'The monumental Mediterranean civilization whose legions, civil law codes, concrete domes, road networks, and Latin language unified Europe, North Africa, and the Near East.',
    keyEvents: [
      'Victory over Carthage in the Punic Wars (264–146 BCE) establishing Mediterranean hegemony',
      'Augustus inaugurates the Pax Romana Principate (27 BCE)',
      'Peak territorial expansion from Scotland to Mesopotamia under Emperor Trajan (117 CE)'
    ],
    // Dynamic year-by-year Roman territorial expansion!
    countries: (y) => {
      const lands = ['Italy', 'Vatican'];
      if (y < 301) lands.push('San Marino');
      if (y >= -218) lands.push('Malta');
      if (y >= -206) lands.push('Spain', 'Portugal', 'Andorra');
      if (y >= -146) lands.push('Tunisia', 'Greece', 'North Macedonia', 'Albania');
      if (y >= -133) lands.push('Turkey');
      if (y >= -64) lands.push('Syria', 'Lebanon', 'Israel', 'Palestine', 'Cyprus');
      if (y >= -51) lands.push('France', 'Monaco', 'Belgium', 'Luxembourg', 'Switzerland', 'Liechtenstein');
      if (y >= -30) lands.push('Egypt', 'Croatia', 'Slovenia', 'Bosnia and Herz.', 'Serbia', 'Montenegro', 'Bulgaria');
      if (y >= -15) lands.push('Austria', 'Netherlands');
      if (y >= 40) lands.push('Morocco', 'Jordan');
      if (y >= 43) lands.push('United Kingdom');
      if (y >= 106 && y <= 271) lands.push('Romania');
      if (y >= 114 && y <= 117) lands.push('Iraq', 'Armenia');
      return lands;
    }
  },
  {
    id: 'western_roman_empire',
    startYear: 395,
    endYear: 476,
    priority: 75,
    name: 'Western Roman Empire',
    historicalName: 'Imperium Romanum Pars Occidentalis',
    ruler: (y) => (y < 423 ? 'Emperor Honorius / Stilicho' : y < 455 ? 'Emperor Valentinian III / Aetius' : 'Emperor Majorian / Romulus Augustulus'),
    capital: 'Ravenna / Mediolanum (Milan) / Rome',
    populationEstimate: '25 Million',
    color: '#b91c1c',
    description: 'The western half of the partitioned Roman Empire following the death of Theodosius I in 395 CE, defending Gaul and Italy before the deposition of Romulus Augustulus in 476 CE.',
    keyEvents: [
      'Permanent administrative division of the Roman Empire into West and East (395 CE)',
      'Coalition victory under Flavius Aetius against Attila the Hun at the Catalaunian Plains (451 CE)',
      'Deposition of Emperor Romulus Augustulus by Odoacer in Ravenna (476 CE)'
    ],
    countries: (y) =>
      y < 410
        ? ['Italy', 'Vatican', 'Malta', 'France', 'Monaco', 'Spain', 'Portugal', 'Andorra', 'Belgium', 'Switzerland', 'Liechtenstein', 'Austria', 'Tunisia', 'United Kingdom']
        : y < 439
        ? ['Italy', 'Vatican', 'Malta', 'France', 'Monaco', 'Spain', 'Portugal', 'Andorra', 'Belgium', 'Switzerland', 'Liechtenstein', 'Austria']
        : ['Italy', 'Vatican', 'Malta', 'France', 'Monaco', 'Spain', 'Portugal', 'Andorra', 'Switzerland', 'Liechtenstein', 'Austria']
  },
  {
    id: 'hunnic_empire_attila',
    startYear: 420,
    endYear: 454,
    priority: 78,
    name: 'Hunnic Empire',
    historicalName: 'Realm of the Huns',
    ruler: 'Attila the Hun & Bleda',
    capital: 'Pannonian Royal Encampment (Tisza Plain)',
    populationEstimate: '4 Million',
    color: '#78350f',
    description: 'Confederation of nomadic warriors and subject Germanic tribes united under Attila across the Danubian plains, exacting heavy gold tribute from Constantinople and invading Gaul.',
    keyEvents: [
      'Unification of the Hunnic confederation under Attila (434–453 CE)',
      'Climactic Battle of the Catalaunian Plains in Gaul (451 CE)'
    ],
    countries: ['Hungary', 'Romania', 'Ukraine', 'Slovakia', 'Germany', 'Poland']
  },
  {
    id: 'aksumite_ethiopian_empire',
    startYear: 100,
    endYear: 1974,
    priority: 55,
    name: (y) => (y < 940 ? 'Kingdom of Aksum' : y < 1270 ? 'Zagwe Kingdom of Ethiopia' : 'Ethiopian Empire (Solomonic Abyssinia)'),
    historicalName: 'Mangista Ityopp\'ya (Abyssinia)',
    ruler: (y) =>
      y < 940
        ? 'King Ezana of Aksum / King Kaleb'
        : y < 1270
        ? 'King Gebre Mesqel Lalibela'
        : y < 1632
        ? 'Emperor Amda Seyon / Zara Yaqob / Susenyos'
        : y < 1889
        ? 'Emperor Fasilides / Tewodros II / Yohannes IV'
        : y < 1913
        ? 'Emperor Menelik II'
        : 'Emperor Haile Selassie I',
    capital: (y) => (y < 940 ? 'Aksum' : y < 1270 ? 'Lalibela' : y < 1886 ? 'Gondar / Debre Berhan' : 'Addis Ababa'),
    populationEstimate: '4 – 22 Million',
    color: '#9e8e52',
    description: 'Ancient Red Sea and Highland African civilization that minted gold coins in antiquity, carved the monolithic churches of Lalibela, and defeated European colonial invasion at Adwa (1896).',
    keyEvents: [
      'King Ezana adopts Christianity and erects the monumental Aksumite Obelisks (c. 330 CE)',
      'Excavation of the eleven rock-hewn monolithic churches of Lalibela (12th century)',
      'Decisive victory over Italy at the Battle of Adwa under Emperor Menelik II (1896)'
    ],
    countries: (y) => (y < 1890 ? ['Ethiopia', 'Eritrea'] : ['Ethiopia'])
  },
  {
    id: 'classic_maya_mesoamerica',
    startYear: -800,
    endYear: 1427,
    priority: 55,
    name: (y) => (y < 200 ? 'Olmec & Preclassic Maya Realms' : y <= 900 ? 'Classic Maya City-States & Teotihuacan' : 'Toltec & Postclassic Maya League of Mayapan'),
    historicalName: 'Mayab & Tollan (Mesoamerica)',
    ruler: (y) => (y <= 900 ? 'K\'inich Janaab\' Pakal of Palenque / Jasaw Chan K\'awiil of Tikal' : 'Topiltzin Ce Acatl Quetzalcoatl / Halach Uinik'),
    capital: (y) => (y <= 900 ? 'Tikal / Palenque / Calakmul / Teotihuacan' : 'Chichen Itza / Mayapan / Tula'),
    populationEstimate: '8 – 12 Million',
    color: '#15803d',
    description: 'Advanced Mesoamerican civilizations that independently developed hieroglyphic writing, the concept of zero, the Long Count astronomical calendar, and stepped limestone pyramids.',
    keyEvents: [
      'Construction of the Pyramid of the Sun at Teotihuacan and Temple I at Tikal',
      'Reign of Pakal the Great at Palenque (615–683 CE)',
      'Precision Long Count calendar and Venus astronomical tables'
    ],
    countries: ['Mexico', 'Guatemala', 'Belize', 'Honduras', 'El Salvador']
  },

  // =========================================================================
  // III. POST-CLASSICAL & MEDIEVAL ERAS (395 CE to 1453 CE)
  // =========================================================================
  {
    id: 'byzantine_empire',
    startYear: 395,
    endYear: 1453,
    priority: 72,
    name: 'Byzantine Empire (Eastern Roman Empire)',
    historicalName: 'Basileia ton Rhomaion',
    ruler: (y) =>
      y < 527
        ? 'Emperor Theodosius II / Anastasius I'
        : y <= 565
        ? 'Emperor Justinian I & Empress Theodora'
        : y <= 641
        ? 'Emperor Heraclius'
        : y <= 867
        ? 'Emperor Leo III / Empress Irene'
        : y <= 1025
        ? 'Emperor Basil II (Macedonian Renaissance)'
        : y <= 1185
        ? 'Emperor Alexios I / Manuel I Komnenos'
        : 'Palaiologos Dynasty (Constantine XI)',
    capital: 'Constantinople',
    populationEstimate: (y) => (y < 600 ? '26 Million' : y < 1050 ? '12 – 18 Million' : '4 – 8 Million'),
    color: '#7c3aed',
    description: 'The direct Eastern continuation of the Roman Empire for over a millennium, codifying the Corpus Juris Civilis, building Hagia Sophia, and defending Constantinople until 1453.',
    keyEvents: [
      'Justinian I codifies Roman law (Corpus Juris Civilis) and builds Hagia Sophia (537 CE)',
      'Defense of Constantinople using Greek Fire against Arab and Rus\' fleets',
      'Final heroic stand of Emperor Constantine XI during the Ottoman siege of 1453'
    ],
    countries: (y) => {
      if (y <= 532) return ['Greece', 'Turkey', 'Bulgaria', 'North Macedonia', 'Albania', 'Syria', 'Lebanon', 'Israel', 'Palestine', 'Jordan', 'Egypt', 'Cyprus'];
      if (y <= 568) return ['Greece', 'Turkey', 'Bulgaria', 'North Macedonia', 'Albania', 'Syria', 'Lebanon', 'Israel', 'Palestine', 'Jordan', 'Egypt', 'Cyprus', 'Italy', 'Malta', 'Tunisia'];
      if (y <= 635) return ['Greece', 'Turkey', 'Bulgaria', 'North Macedonia', 'Albania', 'Syria', 'Lebanon', 'Israel', 'Palestine', 'Egypt', 'Cyprus', 'Malta', 'Tunisia'];
      if (y <= 870) return ['Greece', 'Turkey', 'Bulgaria', 'North Macedonia', 'Albania', 'Cyprus', 'Malta'];
      if (y <= 1071) return ['Greece', 'Turkey', 'Bulgaria', 'North Macedonia', 'Albania', 'Cyprus'];
      if (y <= 1204) return ['Greece', 'Cyprus'];
      return ['Greece'];
    }
  },
  {
    id: 'visigothic_ostrogothic_merovingian',
    startYear: 477,
    endYear: 750,
    priority: 62,
    name: 'Frankish (Merovingian) & Visigothic Kingdoms',
    historicalName: 'Regnum Francorum & Regnum Visigothorum',
    ruler: (y) => (y < 511 ? 'King Clovis I / Theodoric the Great' : y < 711 ? 'King Dagobert I / King Recceswinth' : 'Charles Martel (Mayor of the Palace)'),
    capital: 'Paris / Toledo / Ravenna',
    populationEstimate: '14 Million',
    color: '#3b82f6',
    description: 'Successor Germanic-Roman kingdoms of Western Europe following the fall of Western Rome, preserving Latin legal codes and halting Umayyad expansion at the Battle of Tours (732 CE).',
    keyEvents: [
      'Baptism of Clovis I uniting the Frankish tribes (c. 496 CE)',
      'Promulgation of the Visigothic Code (Liber Iudiciorum) in Hispania (654 CE)',
      'Victory of Charles Martel at the Battle of Tours / Poitiers (732 CE)'
    ],
    countries: (y) =>
      y < 711
        ? ['France', 'Monaco', 'Belgium', 'Spain', 'Portugal', 'Andorra', 'Italy', 'Vatican', 'Malta', 'Liechtenstein']
        : ['France', 'Monaco', 'Belgium', 'Italy', 'Vatican', 'Liechtenstein']
  },
  {
    id: 'rashidun_umayyad_abbasid_caliphate',
    startYear: 632,
    endYear: 1258,
    priority: 74,
    name: (y) =>
      y <= 661
        ? 'Rashidun Caliphate'
        : y <= 750
        ? 'Umayyad Caliphate'
        : 'Abbasid Caliphate (Islamic Golden Age)',
    historicalName: 'Al-Khilafah al-Islamiyyah',
    ruler: (y) =>
      y <= 661
        ? 'Caliphs Abu Bakr, Umar, Uthman & Ali'
        : y <= 750
        ? 'Caliph Mu\'awiya I / Abd al-Malik / Hisham'
        : y <= 833
        ? 'Caliph al-Mansur / Harun al-Rashid / al-Ma\'mun'
        : 'Abbasid Caliphs of Baghdad & Regional Sultanates',
    capital: (y) => (y <= 661 ? 'Medina & Kufa' : y <= 750 ? 'Damascus' : 'Baghdad (Round City)'),
    populationEstimate: '35 – 50 Million',
    color: '#047857',
    description: 'Transcontinental Islamic civilization stretching from the Atlantic to the Indus, pioneering algebra, optics, clinical medicine, and astronomy at the House of Wisdom in Baghdad.',
    keyEvents: [
      'Construction of the Dome of the Rock in Jerusalem and Great Mosque of Damascus',
      'Founding of the Round City of Baghdad (762 CE) and the House of Wisdom (Bayt al-Hikma)',
      'Scientific breakthroughs of al-Khwarizmi (algebra), Ibn Sina (Avicenna), and Ibn al-Haytham (optics)'
    ],
    countries: (y) => {
      if (y <= 661) return ['Saudi Arabia', 'Yemen', 'Oman', 'United Arab Emirates', 'Bahrain', 'Qatar', 'Iraq', 'Kuwait', 'Syria', 'Jordan', 'Lebanon', 'Israel', 'Palestine', 'Egypt', 'Iran'];
      if (y <= 750) return ['Saudi Arabia', 'Yemen', 'Oman', 'United Arab Emirates', 'Bahrain', 'Qatar', 'Iraq', 'Kuwait', 'Syria', 'Jordan', 'Lebanon', 'Israel', 'Palestine', 'Egypt', 'Tunisia', 'Morocco', 'Spain', 'Portugal', 'Iran', 'Afghanistan', 'Pakistan', 'Uzbekistan', 'Turkmenistan', 'Azerbaijan'];
      if (y <= 909) return ['Saudi Arabia', 'Yemen', 'Oman', 'United Arab Emirates', 'Bahrain', 'Qatar', 'Iraq', 'Kuwait', 'Syria', 'Jordan', 'Lebanon', 'Israel', 'Palestine', 'Egypt', 'Tunisia', 'Malta', 'Iran', 'Afghanistan', 'Uzbekistan', 'Turkmenistan', 'Azerbaijan'];
      return ['Iraq', 'Kuwait', 'Bahrain', 'Qatar', 'Syria', 'Yemen', 'Oman', 'United Arab Emirates', 'Iran'];
    }
  },
  {
    id: 'al_andalus_cordoba',
    startYear: 756,
    endYear: 1238,
    priority: 75,
    name: (y) => (y < 929 ? 'Umayyad Emirate of Córdoba (Al-Andalus)' : y <= 1031 ? 'Caliphate of Córdoba (Al-Andalus)' : 'Almoravid & Almohad Al-Andalus'),
    historicalName: 'Al-Andalus',
    ruler: (y) => (y < 912 ? 'Abd al-Rahman I / II' : y <= 1031 ? 'Caliph Abd al-Rahman III / Al-Hakam II' : 'Yusuf ibn Tashfin / Yaqub al-Mansur'),
    capital: 'Córdoba / Seville',
    populationEstimate: '7 – 9 Million',
    color: '#10b981',
    description: 'Europe\'s most populous and literate urban center in the 10th century, celebrated for the Great Mosque of Córdoba, libraries of 400,000 volumes, and philosophy of Averroes (Ibn Rushd) and Maimonides.',
    keyEvents: [
      'Construction of the Mezquita of Córdoba and palace-city of Medina Azahara',
      'Philosophical commentaries of Ibn Rushd (Averroes) and Moses Maimonides'
    ],
    countries: (y) => (y < 1139 ? ['Spain', 'Portugal', 'Morocco'] : ['Spain', 'Morocco'])
  },
  {
    id: 'fatimid_ayyubid_mamluk_egypt',
    startYear: 909,
    endYear: 1516,
    priority: 76,
    name: (y) => (y < 1171 ? 'Fatimid Caliphate' : y < 1250 ? 'Ayyubid Sultanate' : 'Mamluk Sultanate of Cairo'),
    historicalName: 'Al-Dawlah al-Fatimiyyah / Al-Ayyubiyyah / Al-Mamalik',
    ruler: (y) =>
      y < 1171
        ? 'Caliph al-Mu\'izz / al-Aziz'
        : y < 1193
        ? 'Sultan Salah ad-Din (Saladin)'
        : y < 1250
        ? 'Sultan al-Adil I / al-Kamil'
        : 'Sultan Baibars / Qalawun / Qaitbay',
    capital: 'Cairo (Al-Qahirah)',
    populationEstimate: '8 – 12 Million',
    color: '#059669',
    description: 'From the Fatimid founding of Cairo and Al-Azhar University (970 CE) to Saladin\'s Ayyubid reunification of Egypt and Syria, and the Mamluk victory halting the Mongols at Ain Jalut (1260 CE).',
    keyEvents: [
      'Founding of Cairo and Al-Azhar University (969–970 CE)',
      'Saladin unifies Egypt and Syria and recaptures Jerusalem (1187 CE)',
      'Mamluk Sultan Baibars defeats the Mongol army at the Battle of Ain Jalut (1260 CE)'
    ],
    countries: (y) =>
      y < 1171
        ? ['Egypt', 'Tunisia', 'Israel', 'Palestine', 'Lebanon']
        : ['Egypt', 'Syria', 'Lebanon', 'Israel', 'Palestine', 'Jordan']
  },
  {
    id: 'sui_tang_song_china',
    startYear: 581,
    endYear: 1278,
    priority: 70,
    name: (y) => (y < 618 ? 'Sui Dynasty China' : y <= 907 ? 'Tang Dynasty China (Cosmopolitan Golden Age)' : y <= 960 ? 'Five Dynasties & Ten Kingdoms' : 'Song Dynasty China (Northern & Southern Song)'),
    historicalName: 'Da Sui / Da Tang / Da Song',
    ruler: (y) =>
      y < 618
        ? 'Emperor Wen of Sui'
        : y < 684
        ? 'Emperor Taizong of Tang'
        : y <= 705
        ? 'Empress Wu Zetian'
        : y <= 756
        ? 'Emperor Xuanzong of Tang'
        : y < 960
        ? 'Emperor Dezong / Late Tang Rulers'
        : y < 1127
        ? 'Emperor Taizu / Emperor Shenzong (Northern Song)'
        : 'Emperor Gaozong / Ningzong (Southern Song)',
    capital: (y) => (y < 907 ? 'Chang\'an (Xi\'an) & Luoyang' : y < 1127 ? 'Bianjing (Kaifeng)' : 'Lin\'an (Hangzhou)'),
    populationEstimate: (y) => (y < 960 ? '55 – 80 Million' : '100 – 120 Million'),
    color: '#ca8a04',
    description: 'Constructed the 1,776 km Grand Canal under the Sui, achieved the pinnacle of classical poetry and cosmopolitan trade under the Tang, and pioneered gunpowder, movable-type printing, the magnetic compass, and paper money under the Song.',
    keyEvents: [
      'Completion of the Grand Canal linking the Yellow and Yangtze Rivers',
      'Golden Age of Tang poetry (Li Bai, Du Fu) and woodblock printing of the Diamond Sutra (868 CE)',
      'Song Dynasty invention of movable-type printing (Bi Sheng), paper currency, and maritime compass'
    ],
    countries: ['China']
  },
  {
    id: 'carolingian_empire',
    startYear: 751,
    endYear: 842,
    priority: 75,
    name: 'Carolingian Empire (Frankish Empire)',
    historicalName: 'Imperium Romanum (Carolingian Realm)',
    ruler: (y) => (y < 768 ? 'King Pepin the Short' : y <= 814 ? 'Emperor Charlemagne (Charles the Great)' : 'Emperor Louis the Pious'),
    capital: 'Aachen',
    populationEstimate: '16 Million',
    color: '#1e40af',
    description: 'United Western and Central Europe for the first time since the fall of Rome; Charlemagne\'s coronation on Christmas Day 800 CE launched the Carolingian Renaissance.',
    keyEvents: [
      'Coronation of Charlemagne as Emperor of the Romans in Rome (December 25, 800 CE)',
      'Standardization of Carolingian minuscule script and cathedral schools under Alcuin of York'
    ],
    countries: ['France', 'Germany', 'Belgium', 'Netherlands', 'Luxembourg', 'Switzerland', 'Austria', 'Italy']
  },
  {
    id: 'holy_roman_empire',
    startYear: 843,
    endYear: 1806,
    priority: 70,
    name: (y) => (y < 962 ? 'Kingdom of East Francia' : 'Holy Roman Empire'),
    historicalName: 'Sacrum Romanum Imperium',
    ruler: (y) =>
      y < 962
        ? 'Louis the German / Henry the Fowler'
        : y < 1024
        ? 'Emperor Otto I the Great / Otto III'
        : y < 1152
        ? 'Emperor Henry IV (Salic Dynasty)'
        : y < 1250
        ? 'Emperor Frederick I Barbarossa / Frederick II (Hohenstaufen)'
        : y < 1519
        ? 'Emperor Charles IV (Golden Bull) / Maximilian I (Habsburg)'
        : y <= 1556
        ? 'Emperor Charles V (Habsburg Global Realm)'
        : y < 1740
        ? 'Emperor Ferdinand II / Leopold I (House of Habsburg)'
        : 'Empress Maria Theresa / Emperor Joseph II / Francis II',
    capital: (y) => (y < 1346 ? 'Aachen / Frankfurt' : y < 1438 ? 'Prague' : 'Vienna & Regensburg'),
    populationEstimate: (y) => (y < 1500 ? '14 – 18 Million' : '24 – 29 Million'),
    color: '#d97706',
    description: 'Central European imperial federation of kingdoms, duchies, prince-bishoprics, and free imperial cities governed by the Prince-Electors under the Golden Bull of 1356.',
    keyEvents: [
      'Imperial coronation of Otto I in 962 CE establishing the Holy Roman Empire',
      'Promulgation of the Golden Bull of 1356 codifying the seven Prince-Electors',
      'Johannes Gutenberg invents the movable-type printing press in Mainz (c. 1450)',
      'Peace of Westphalia (1648) ending the Thirty Years\' War and establishing modern state sovereignty'
    ],
    countries: (y) =>
      y < 1648
        ? ['Germany', 'Austria', 'Czechia', 'Slovenia', 'Switzerland', 'Liechtenstein', 'Netherlands', 'Belgium', 'Luxembourg']
        : y < 1719
        ? ['Germany', 'Austria', 'Czechia', 'Slovenia', 'Luxembourg', 'Liechtenstein']
        : ['Germany', 'Austria', 'Czechia', 'Slovenia', 'Luxembourg']
  },
  {
    id: 'kingdom_of_france',
    startYear: 843,
    endYear: 1788,
    priority: 72,
    name: (y) => (y < 987 ? 'West Francia' : 'Kingdom of France (Ancien Régime)'),
    historicalName: 'Royaume de France',
    ruler: (y) =>
      y < 987
        ? 'Charles the Bald'
        : y < 1180
        ? 'Hugh Capet / Louis VII'
        : y < 1328
        ? 'King Philip II Augustus / Louis IX (Saint Louis) / Philip IV'
        : y < 1461
        ? 'King Charles V / Charles VII & Joan of Arc (House of Valois)'
        : y < 1589
        ? 'King Francis I (French Renaissance) / Henry II'
        : y < 1643
        ? 'King Henry IV (House of Bourbon) / Louis XIII & Cardinal Richelieu'
        : y <= 1715
        ? 'King Louis XIV (The Sun King)'
        : 'King Louis XV / King Louis XVI',
    capital: (y) => (y >= 1682 && y <= 1789 ? 'Versailles & Paris' : 'Paris'),
    populationEstimate: (y) => (y < 1500 ? '14 – 16 Million' : '20 – 28 Million'),
    color: '#2563eb',
    description: 'Europe\'s most populous medieval and early modern monarchy, evolving from Capetian Gothic cathedral builders to the absolutist Enlightenment court of Versailles under Louis XIV.',
    keyEvents: [
      'Construction of Notre-Dame de Paris and Chartres Gothic cathedrals (12th–13th centuries)',
      'Joan of Arc lifts the Siege of Orléans (1429) turning the Hundred Years\' War',
      'Reign of Louis XIV (1643–1715), construction of Versailles, and French Enlightenment'
    ],
    countries: (y) => {
      const lands = ['France'];
      if (y >= 1608 && y <= 1803) lands.push('Haiti');
      if (y >= 1635 && y <= 1762) lands.push('Dominica');
      if (y >= 1649 && y <= 1762) lands.push('Grenada');
      if (y >= 1660 && y <= 1788) lands.push('Saint Lucia');
      if (y >= 1715 && y <= 1788) lands.push('Mauritius');
      if (y >= 1756 && y <= 1788) lands.push('Seychelles');
      return lands;
    }
  },
  {
    id: 'viking_nordic_kalmar',
    startYear: 793,
    endYear: 1522,
    priority: 65,
    name: (y) => (y < 1066 ? 'Viking Age Norse Kingdoms & North Sea Realm' : y < 1397 ? 'Medieval Kingdoms of Denmark, Norway & Sweden' : 'Kalmar Union (Unified Nordic Crown)'),
    historicalName: 'Norrœaveldi / Kalmarunionen',
    ruler: (y) =>
      y < 1066
        ? 'Harald Fairhair / Sweyn Forkbeard / Cnut the Great'
        : y < 1397
        ? 'Valdemar II the Victorious / Haakon IV'
        : 'Queen Margaret I of Denmark, Norway & Sweden',
    capital: 'Roskilde / Copenhagen / Nidaros / Uppsala',
    populationEstimate: '2.0 – 3.5 Million',
    color: '#903a4b',
    description: 'From Viking longship expeditions that settled Iceland, Greenland, and Vinland to Queen Margaret I\'s Kalmar Union uniting all of Scandinavia under a single crown (1397–1523).',
    keyEvents: [
      'Founding of the Icelandic Althing parliament at Thingvellir (930 CE)',
      'Leif Erikson reaches Vinland in North America (c. 1000 CE)',
      'Treaty of Kalmar (1397) uniting Denmark, Norway, Sweden, Iceland, and Finland'
    ],
    countries: ['Denmark', 'Norway', 'Sweden', 'Iceland', 'Greenland', 'Finland']
  },
  {
    id: 'kievan_rus_muscovy',
    startYear: 882,
    endYear: 1546,
    priority: 66,
    name: (y) => (y < 1240 ? 'Kievan Rus\'' : 'Grand Duchy of Moscow & Novgorod Republic'),
    historicalName: 'Rus\'kaya Zemlya / Velikoye Knyazhestvo Moskovskoye',
    ruler: (y) =>
      y < 1015
        ? 'Prince Oleg / Sviatoslav I / Vladimir the Great'
        : y < 1240
        ? 'Grand Prince Yaroslav the Wise / Vladimir Monomakh'
        : y < 1462
        ? 'Alexander Nevsky / Dmitry Donskoy'
        : 'Grand Prince Ivan III the Great / Vasily III',
    capital: (y) => (y < 1240 ? 'Kyiv & Novgorod' : 'Moscow'),
    populationEstimate: '5 – 9 Million',
    color: '#15803d',
    description: 'Federation of East Slavic principalities along the Dnieper-Volga trade route from the Varangians to the Greeks, adopting Eastern Orthodoxy in 988 CE and later consolidating around Moscow.',
    keyEvents: [
      'Christianization of Kievan Rus\' under Vladimir the Great (988 CE) and Russkaya Pravda law code',
      'Victory of Dmitry Donskoy at Kulikovo (1380) and Ivan III\'s Stand on the Ugra River (1480)'
    ],
    countries: (y) => (y < 1240 ? ['Ukraine', 'Belarus'] : [])
  },
  {
    id: 'khmer_empire_angkor',
    startYear: 802,
    endYear: 1431,
    priority: 65,
    name: 'Khmer Empire (Angkor)',
    historicalName: 'Kambujadesa',
    ruler: (y) => (y < 1113 ? 'Jayavarman II / Suryavarman I' : y < 1181 ? 'Suryavarman II (Builder of Angkor Wat)' : 'Jayavarman VII (Builder of Angkor Thom)'),
    capital: 'Angkor (Yasodharapura)',
    populationEstimate: '4 – 6 Million (Angkor largest pre-industrial city on Earth)',
    color: '#0d9488',
    description: 'Monumental hydraulic civilization of Southeast Asia whose baray reservoirs supported nearly a million inhabitants around the sandstone temple-mountain of Angkor Wat.',
    keyEvents: [
      'Construction of Angkor Wat under King Suryavarman II (early 12th century)',
      'Construction of the Bayon temple at Angkor Thom and 102 public hospitals under Jayavarman VII'
    ],
    countries: ['Cambodia', 'Thailand', 'Laos']
  },
  {
    id: 'srivijaya_majapahit_maritime',
    startYear: 650,
    endYear: 1527,
    priority: 64,
    name: (y) => (y < 1293 ? 'Srivijaya Maritime Empire' : 'Majapahit Maritime Empire'),
    historicalName: (y) => (y < 1293 ? 'Kedatuan Sriwijaya' : 'Kemaharajaan Majapahit (Nusantara)'),
    ruler: (y) =>
      y < 1293
        ? 'Dapunta Hyang Sri Jayanasa / Balaputradewa (Sailendra Dynasty)'
        : 'Raden Wijaya / Hayam Wuruk & Mahapatih Gajah Mada',
    capital: (y) => (y < 1293 ? 'Palembang' : 'Trowulan'),
    populationEstimate: '12 – 18 Million',
    color: '#0f766e',
    description: 'Maritime thalassocracies of the Indonesian archipelago and Malay Peninsula that controlled the Strait of Malacca and Spice Islands trade routes and erected Borobudur and Prambanan.',
    keyEvents: [
      'Construction of the monumental Buddhist mandala of Borobudur in Central Java (9th century)',
      'Gajah Mada proclaims the Palapa Oath uniting Nusantara under Majapahit (1336 CE)'
    ],
    countries: (y) =>
      y < 1299
        ? ['Indonesia', 'Malaysia', 'Singapore', 'Brunei']
        : y < 1368
        ? ['Indonesia', 'Malaysia', 'Brunei']
        : y < 1400
        ? ['Indonesia', 'Malaysia']
        : ['Indonesia']
  },
  {
    id: 'malacca_and_johor_sultanates',
    startYear: 1299,
    endYear: 1823,
    priority: 73,
    name: (y) =>
      y < 1400
        ? 'Kingdom of Singapura (Temasek) & Malay Realms'
        : y <= 1511
        ? 'Sultanate of Malacca (Kesultanan Melayu Melaka)'
        : 'Sultanate of Johor-Riau & Malay Sultanates',
    historicalName: (y) =>
      y < 1400
        ? 'Kerajaan Singapura (Temasek)'
        : y <= 1511
        ? 'Kesultanan Melayu Melaka'
        : 'Kesultanan Johor-Riau-Lingga',
    ruler: (y) =>
      y < 1400
        ? 'Sang Nila Utama (Sri Tri Buana) — Founder of Singapura (1299)'
        : y < 1445
        ? 'Parameswara (Iskandar Shah) — Founder of Malacca'
        : y <= 1511
        ? 'Sultan Mansur Shah / Sultan Mahmud Shah & Admiral Hang Tuah'
        : 'Sultan Alauddin Riayat Shah II / Sultan Hussein Shah of Johor',
    capital: (y) => (y < 1400 ? 'Singapura' : y <= 1511 ? 'Malacca' : 'Kuala Lumpur'),
    populationEstimate: '1.5 – 2.5 Million',
    color: '#0d9488',
    description: 'From Sang Nila Utama’s 1299 founding of the Kingdom of Singapura (Temasek) to the golden age of the Malacca Sultanate (1400–1511) as the world’s premier spice-trade entrepôt and its continuation as the Johor-Riau Sultanate until the 1819 Raffles Treaty and 1824 Anglo-Dutch Treaty.',
    keyEvents: [
      '1299 CE: Sang Nila Utama establishes the Kingdom of Singapura at Temasek (Fort Canning Hill)',
      '1400–1511 CE: Golden Age of the Malacca Sultanate codifying the Undang-Undang Laut Melaka maritime law',
      '1528–1819 CE: Johor-Riau Sultanate governs the southern Malay Peninsula and Singapore Island'
    ],
    countries: (y) => (y < 1819 ? ['Malaysia', 'Singapore'] : ['Malaysia'])
  },
  {
    id: 'sultanate_of_brunei',
    startYear: 1368,
    endYear: 1887,
    priority: 75,
    name: (y) => (y <= 1650 ? 'Bruneian Empire (Sultanate of Brunei)' : 'Sultanate of Brunei (Kesultanan Brunei)'),
    historicalName: 'Kesultanan Brunei Darussalam',
    ruler: (y) =>
      y < 1402
        ? 'Sultan Muhammad Shah (Awang Alak Betatar)'
        : y < 1485
        ? 'Sultan Ahmad / Sultan Sharif Ali (Barkat)'
        : y <= 1524
        ? 'Sultan Bolkiah (Nakhoda Ragam — Golden Age of Brunei)'
        : y < 1700
        ? 'Sultan Saiful Rijal / Sultan Muhyiddin'
        : 'Sultan Omar Ali Saifuddien II / Sultan Abdul Momin',
    capital: 'Bandar Seri Begawan',
    populationEstimate: '350,000 – 700,000',
    color: '#0d9488',
    description: 'Sovereign Malay Islamic sultanate on northern Borneo founded in 1368 by Sultan Muhammad Shah, reaching its imperial zenith under Sultan Bolkiah (1485–1524) across all of northern Borneo and Sulu before signing the 1888 British Protectorate Treaty.',
    keyEvents: [
      '1368 CE: Awang Alak Betatar embraces Islam as Sultan Muhammad Shah, founding the Sultanate of Brunei',
      '1485–1524 CE: Golden Age under Sultan Bolkiah controlling coastal Borneo and Sulu',
      '1521 CE: Antonio Pigafetta of the Magellan expedition chronicles the splendor of Brunei’s royal court and Kampong Ayer'
    ],
    countries: ['Brunei']
  },
  {
    id: 'maldives_buddhist_and_sultanate',
    startYear: -300,
    endYear: 1886,
    priority: 75,
    name: (y) =>
      y < 1153
        ? 'Ancient Buddhist Kingdom of the Maldives (Dheeva Maari)'
        : y >= 1558 && y <= 1573
        ? 'Portuguese Malé & Maldivian Liberation (Muhammad Thakurufaanu)'
        : 'Sultanate of the Maldives (Dhivehi Raajje)',
    historicalName: 'Mahaldib / Dhivehi Raajje',
    ruler: (y) =>
      y < 1153
        ? 'Solar & Lunar Dynasty Kings (Koimala)'
        : y < 1340
        ? 'Sultan Muhammad al-Adil (Theemuge Dynasty)'
        : y < 1558
        ? 'Sultana Khadijah / Hilaalee Dynasty Sultans'
        : y <= 1585
        ? 'Sultan Muhammad Thakurufaanu al-Auzam (Utheemu Dynasty)'
        : 'Sultan Ibrahim Iskandar I / Huraage Dynasty Sultans',
    capital: 'Malé',
    populationEstimate: '60,000 – 150,000',
    color: '#0284c7',
    description:
      'Strategic Indian Ocean coral archipelago of 26 atolls that supplied cowrie-shell currency across Afro-Eurasia, transitioned from a 1,400-year Buddhist kingdom to an Islamic Sultanate in 1153 CE, expelled Portuguese rule in 1573 under national hero Muhammad Thakurufaanu, and preserved self-governance until becoming a British protectorate in 1887.',
    keyEvents: [
      'c. 300 BCE – 1153 CE: Buddhist Kingdom of Dheeva Maari; coral-stone stupas and cowrie shell maritime trade',
      '1153 CE: King Dhovemi embraces Islam as Sultan Muhammad al-Adil, founding the Sultanate of the Maldives',
      '1343–1344 CE: Moroccan traveler Ibn Battuta serves as Chief Qadi (Judge) in Malé under Sultana Khadijah',
      '1573 CE: Muhammad Thakurufaanu al-Auzam liberates Malé from 15-year Portuguese occupation'
    ],
    countries: ['Maldives']
  },
  {
    id: 'bahrain_medieval_and_al_khalifa',
    startYear: 1259,
    endYear: 1860,
    priority: 75,
    name: (y) =>
      y < 1521
        ? 'Usfurid & Jabrid Dynasty of Bahrain (Awal)'
        : y < 1602
        ? 'Portuguese Hormuz & Bahrain'
        : y < 1783
        ? 'Safavid & Zand Persian Governorate of Bahrain'
        : 'Hakimship of Bahrain (House of Al Khalifa)',
    historicalName: 'Awal / Mamlakat al-Bahrayn',
    ruler: (y) =>
      y < 1521
        ? 'Jabrid Sultan Ajwad ibn Zamil'
        : y < 1602
        ? 'Portuguese Captains of Hormuz & Bahrain (Qal\'at al-Bahrain)'
        : y < 1783
        ? 'Safavid & Al-Madhkur Governors of Bahrain'
        : 'Hakim Ahmed al-Fateh (Founder of Al Khalifa Rule, 1783)',
    capital: 'Manama',
    populationEstimate: '70,000 – 120,000',
    color: '#0d9488',
    description:
      'Renowned since Bronze Age Dilmun for the world’s finest natural pearl banks and freshwater submarine springs, Bahrain was ruled by the Arab Jabrid dynasty, fortified by the Portuguese (1521–1602), governed by Persia (1602–1783), and liberated in 1783 by Ahmed al-Fateh of the House of Al Khalifa prior to the 1861 British Protectorate treaties.',
    keyEvents: [
      '1521–1602 CE: Portuguese expansion of Qal\'at al-Bahrain (Bahrain Fort) overlooking the pearl banks',
      '1783 CE: Ahmed al-Fateh leads the Bani Utbah coalition to establish Al Khalifa rule in Bahrain'
    ],
    countries: ['Bahrain']
  },
  {
    id: 'malta_medieval_and_knights_hospitaller',
    startYear: 1091,
    endYear: 1799,
    priority: 77,
    name: (y) =>
      y < 1530
        ? 'County of Malta (Norman & Aragonese Crown of Sicily)'
        : y <= 1797
        ? 'Sovereign Hospitaller Malta (Knights of Saint John)'
        : 'French Occupation & Maltese National Congress Siege',
    historicalName: 'Melita / Ordine di San Giovanni di Gerusalemme a Malta',
    ruler: (y) =>
      y < 1530
        ? 'Count Roger I of Sicily / Crown of Aragon'
        : y <= 1568
        ? 'Grand Master Philippe Villiers de L\'Isle-Adam / Jean Parisot de Valette'
        : y <= 1797
        ? 'Grand Master Manoel de Vilhena / Emmanuel de Rohan-Polduc'
        : 'Napoleon Bonaparte / Maltese National Assembly',
    capital: (y) => (y < 1571 ? 'Mdina' : 'Valletta'),
    populationEstimate: '40,000 – 100,000',
    color: '#e11d48',
    description:
      'Granted to the Sovereign Military Order of Saint John (Knights Hospitaller) by Emperor Charles V in 1530, Malta withstood the epic Great Siege of 1565 under Grand Master Jean de Valette and constructed the fortified Baroque city of Valletta before entering British administration in 1800.',
    keyEvents: [
      '1091 CE: Count Roger I of Sicily brings Malta into the Norman-Sicilian Christian realm',
      '1530 CE: Emperor Charles V grants Malta to the Knights Hospitaller for an annual tribute of one Maltese Falcon',
      '1565 CE: Great Siege of Malta — Grand Master Jean de Valette and Maltese defenders repel a four-month Ottoman armada siege and found Valletta (1566)'
    ],
    countries: ['Malta']
  },
  {
    id: 'polynesian_tonga_samoa_realms',
    startYear: 950,
    endYear: 1899,
    priority: 72,
    name: (y) =>
      y < 1845
        ? 'Tuʻi Tonga Maritime Empire & Samoan Malietoa Paramountcy'
        : 'Kingdom of Tonga (House of Tupou) & Kingdom of Samoa',
    historicalName: 'Puleʻanga Fakatuʻi ʻo Tonga & Malo Saʻoloto Tutoʻatasi o Samoa',
    ruler: (y) =>
      y < 1200
        ? 'Tuʻi Tonga ʻAhoʻeitu & Tui Manuʻa'
        : y < 1845
        ? 'Tuʻi Tonga Momo / Tuʻi Kanokupolu & Queen Salamasina of Samoa'
        : 'King George Tupou I of Tonga & Malietoa Laupepa of Samoa',
    capital: 'Nuku\'alofa / Apia',
    populationEstimate: '80,000 – 140,000',
    color: '#0284c7',
    description:
      'From the 10th-century Tuʻi Tonga maritime empire—which erected the megalithic Haʻamonga ʻa Maui trilithon on Tongatapu and linked Samoa, Fiji, and Niue via double-hulled kalia canoes—to King George Tupou I’s 1845 unification and 1875 Constitution of the Kingdom of Tonga.',
    keyEvents: [
      'c. 950–1250 CE: Expansion of the Tuʻi Tonga Empire across Polynesia and construction of the Haʻamonga ʻa Maui coral trilithon',
      '1845 & 1875 CE: King George Tupou I unifies Tonga and promulgates the 1875 Constitution of Tonga'
    ],
    countries: ['Tonga', 'Samoa']
  },
  {
    id: 'comoros_swahili_sultanates',
    startYear: 900,
    endYear: 1885,
    priority: 72,
    name: 'Swahili-Shirazi Sultanates of the Comoros (Ngazidja, Ndzuwani & Mwali)',
    historicalName: 'Juzur al-Qamar (Moon Islands)',
    ruler: 'Sultans (Mfaume) of Bambao, Iconi, Mutsamudu & Fomboni',
    capital: 'Moroni',
    populationEstimate: '75,000 – 140,000',
    color: '#0d9488',
    description:
      'Crossroads of Swahili, Arab, Shirazi, and Austronesian Malagasy maritime trade in the Mozambique Channel, governed by rival island sultans (Ntibe) until the establishment of the French Protectorate in 1886.',
    keyEvents: [
      '10th–15th centuries: Integration of Grande Comore, Anjouan, and Mohéli into the Indian Ocean Swahili-Shirazi trade network',
      '16th–19th centuries: Port of Mutsamudu on Anjouan serves as a major provisioning stop for East Indiamen rounding the Cape'
    ],
    countries: ['Comoros']
  },
  {
    id: 'micronesia_nan_madol_yap',
    startYear: 1100,
    endYear: 1685,
    priority: 71,
    name: 'Saudeleur Dynasty of Nan Madol & Yapese Maritime Network',
    historicalName: 'Mwehin Sau Deleur (Pohnpei) & Wa\'ab',
    ruler: 'Saudeleur Monarchs of Nan Madol & Nahnmwarki Paramount Chiefs',
    capital: 'Palikir',
    populationEstimate: '50,000 – 90,000',
    color: '#0891b2',
    description:
      'Engineered the monumental basalt city of Nan Madol ("Venice of the Pacific") atop 92 artificial lagoon islets off Pohnpei and maintained the Yapese sawei inter-island navigation and stone-money (Rai) network across the Caroline Islands.',
    keyEvents: [
      'c. 1180–1628 CE: Construction of the megalithic columnar basalt canals and royal tombs of Nan Madol on Pohnpei',
      'Flourishing of traditional Micronesian star-compass navigation and Rai stone currency quarries between Palau and Yap'
    ],
    countries: ['Micronesia', 'Palau']
  },
  {
    id: 'ghana_mali_songhai_west_africa',
    startYear: 700,
    endYear: 1591,
    priority: 66,
    name: (y) => (y < 1235 ? 'Ghana Empire (Wagadou)' : y < 1464 ? 'Mali Empire (Manden Kurufaba)' : 'Songhai Empire'),
    historicalName: 'Wagadou / Manden Kurufaba / Songhai',
    ruler: (y) =>
      y < 1235
        ? 'Ghana (Kaya Magan) of Koumbi Saleh'
        : y < 1312
        ? 'Mansa Sundiata Keita (The Lion King)'
        : y < 1464
        ? 'Mansa Musa I (Richest Monarch in History)'
        : 'Sonni Ali / Askia Muhammad I the Great',
    capital: (y) => (y < 1235 ? 'Koumbi Saleh' : y < 1464 ? 'Niani & Timbuktu' : 'Gao & Timbuktu'),
    populationEstimate: '10 – 20 Million',
    color: '#d97706',
    description: 'West African gold-and-salt empires controlling trans-Saharan trade and turning the Sankore Madrasah in Timbuktu into a world center of astronomy, law, and manuscript scholarship.',
    keyEvents: [
      'Sundiata Keita proclaims the Kouroukan Fouga charter of human rights (1235 CE)',
      'Mansa Musa\'s legendary 1324 pilgrimage to Mecca distributing tons of pure gold',
      'Flourishing of the University of Sankore and Djinguereber Mosque in Timbuktu'
    ],
    countries: ['Mali', 'Senegal', 'Gambia', 'Guinea', 'Mauritania', 'Niger', 'Burkina Faso']
  },
  {
    id: 'mongol_empire_and_khanates',
    startYear: 1206,
    endYear: 1368,
    priority: 82,
    name: (y) => (y < 1271 ? 'Mongol Empire (Unified Steppe Imperium)' : 'Yuan Dynasty & Mongol Four Khanates (Golden Horde, Ilkhanate, Chagatai)'),
    historicalName: 'Yeke Monggol Ulus / Da Yuan',
    ruler: (y) =>
      y <= 1227
        ? 'Genghis Khan (Temüjin)'
        : y <= 1259
        ? 'Ögedei Khan / Güyük Khan / Möngke Khan'
        : y <= 1294
        ? 'Kublai Khan (First Yuan Emperor)'
        : 'Temür Khan / Özbeg Khan / Ghazan Khan',
    capital: (y) => (y < 1264 ? 'Karakorum' : 'Khanbaliq (Beijing) / Sarai / Tabriz'),
    populationEstimate: '110 Million',
    color: '#b45309',
    description: 'The largest contiguous land empire in human history, uniting Eurasia from the Sea of Japan to the Danube under the Yassa code, Yam postal relay stations, and the Pax Mongolica.',
    keyEvents: [
      'Proclamation of Temüjin as Genghis Khan at the Kurultai of 1206',
      'Establishment of the Yam horse-messenger network and diplomatic passports (Paiza)',
      'Kublai Khan establishes the Yuan Dynasty in Beijing and hosts Marco Polo (1275–1292)'
    ],
    countries: (y) => {
      if (y < 1220) return ['Mongolia', 'Kazakhstan', 'Kyrgyzstan'];
      if (y < 1240) return ['Mongolia', 'Kazakhstan', 'Kyrgyzstan', 'Uzbekistan', 'Turkmenistan', 'Tajikistan', 'Afghanistan', 'Iran'];
      if (y < 1279) return ['Mongolia', 'Kazakhstan', 'Kyrgyzstan', 'Uzbekistan', 'Turkmenistan', 'Tajikistan', 'Afghanistan', 'Iran', 'Iraq', 'Azerbaijan', 'Armenia', 'Georgia', 'Russia', 'Ukraine', 'Belarus', 'North Korea', 'South Korea'];
      return ['China', 'Mongolia', 'Kazakhstan', 'Kyrgyzstan', 'Uzbekistan', 'Turkmenistan', 'Tajikistan', 'Afghanistan', 'Iran', 'Iraq', 'Azerbaijan', 'Armenia', 'Georgia', 'Russia', 'Ukraine', 'Belarus', 'North Korea', 'South Korea'];
    }
  },
  {
    id: 'delhi_sultanate_vijayanagara',
    startYear: 1206,
    endYear: 1525,
    priority: 68,
    name: 'Delhi Sultanate & Vijayanagara Empire',
    historicalName: 'Saltanat-e-Dehli & Karnata Samrajya',
    ruler: (y) =>
      y < 1290
        ? 'Qutb al-Din Aibak / Iltutmish / Sultana Razia'
        : y < 1320
        ? 'Alauddin Khalji'
        : y < 1414
        ? 'Muhammad bin Tughluq / Harihara & Bukka of Vijayanagara'
        : 'Ibrahim Lodi / Krishnadevaraya of Vijayanagara',
    capital: 'Delhi & Vijayanagara (Hampi)',
    populationEstimate: '85 – 105 Million',
    color: '#059669',
    description: 'Indo-Islamic Sultanate in the north that successfully repelled multiple Mongol invasions and built the Qutb Minar, alongside the prosperous Vijayanagara Empire centered at Hampi in the south.',
    keyEvents: [
      'Construction of the Qutb Minar in Delhi and rule of Sultana Razia (1236–1240)',
      'Alauddin Khalji successfully defends India against Chagatai Mongol invasions',
      'Flourishing of Vijayanagara under Emperor Krishnadevaraya'
    ],
    countries: ['India', 'Pakistan', 'Bangladesh']
  },
  {
    id: 'timurid_empire',
    startYear: 1370,
    endYear: 1500,
    priority: 75,
    name: 'Timurid Empire (Tamerlane\'s Realm)',
    historicalName: 'Gurkhaani (Turan)',
    ruler: (y) => (y <= 1405 ? 'Amir Timur (Tamerlane)' : 'Shah Rukh / Ulugh Beg (Astronomer-Sultan)'),
    capital: 'Samarkand & Herat',
    populationEstimate: '20 Million',
    color: '#0f766e',
    description: 'Turco-Mongol empire founded by Timur that transformed Samarkand and Herat into the architectural and astronomical jewels of the Timurid Renaissance (Registan Square & Ulugh Beg Observatory).',
    keyEvents: [
      'Construction of the Registan madrasas and Gur-e-Amir mausoleum in Samarkand',
      'Ulugh Beg builds the great astronomical observatory of Samarkand (1420s)'
    ],
    countries: ['Uzbekistan', 'Turkmenistan', 'Tajikistan', 'Afghanistan', 'Iran']
  },
  {
    id: 'aztec_empire',
    startYear: 1428,
    endYear: 1520,
    priority: 76,
    name: 'Aztec Empire (Mexica Triple Alliance)',
    historicalName: 'Excan Tlahtoloyan',
    ruler: (y) => (y < 1469 ? 'Itzcoatl / Moctezuma I' : y < 1502 ? 'Axayacatl / Ahuitzotl' : 'Moctezuma II Xocoyotzin'),
    capital: 'Tenochtitlan (Lake Texcoco)',
    populationEstimate: '6 Million',
    color: '#ea580c',
    description: 'Mesoamerican empire of Tenochtitlan, Texcoco, and Tlacopan, engineered around an island metropolis of 200,000 people with causeways, aqueducts, and floating chinampa agriculture.',
    keyEvents: [
      'Formation of the Aztec Triple Alliance (1428 CE)',
      'Expansion of the Templo Mayor and floating chinampa agricultural gardens'
    ],
    countries: ['Mexico']
  },
  {
    id: 'inca_empire_tawantinsuyu',
    startYear: 1438,
    endYear: 1532,
    priority: 76,
    name: 'Inca Empire (Tawantinsuyu)',
    historicalName: 'Tawantinsuyu (Realm of the Four Parts)',
    ruler: (y) => (y < 1471 ? 'Sapa Inca Pachacuti' : y < 1493 ? 'Topa Inca Yupanqui' : y < 1527 ? 'Huayna Capac' : 'Atahualpa & Huáscar'),
    capital: 'Cusco',
    populationEstimate: '12 Million',
    color: '#16a34a',
    description: 'The largest empire in pre-Columbian America, stretching 4,000 km along the Andes cordillera and united by the 40,000 km Qhapaq Ñan stone road network, Machu Picchu, and quipu record-keeping.',
    keyEvents: [
      'Imperial expansion launched by Sapa Inca Pachacuti (1438) and construction of Machu Picchu',
      'Integration of the Andes via the Qhapaq Ñan highway and suspension bridges'
    ],
    countries: ['Peru', 'Ecuador', 'Bolivia', 'Chile']
  },

  // =========================================================================
  // IV. EARLY MODERN & GUNPOWDER EMPIRES (1368 CE to 1800 CE)
  // =========================================================================
  {
    id: 'ming_dynasty_china',
    startYear: 1368,
    endYear: 1643,
    priority: 74,
    name: 'Ming Dynasty China',
    historicalName: 'Da Ming (Great Ming Empire)',
    ruler: (y) =>
      y < 1398
        ? 'Hongwu Emperor (Zhu Yuanzhang)'
        : y <= 1424
        ? 'Yongle Emperor (Zhu Di)'
        : y < 1521
        ? 'Xuande / Hongzhi Emperor'
        : 'Jiajing / Wanli Emperor',
    capital: (y) => (y < 1420 ? 'Nanjing' : 'Beijing (Forbidden City)'),
    populationEstimate: '110 – 160 Million',
    color: '#eab308',
    description: 'Constructed the Forbidden City in Beijing, rebuilt the Great Wall in stone and brick, dispatched Admiral Zheng He\'s treasure fleets across the Indian Ocean, and produced blue-and-white porcelain.',
    keyEvents: [
      'Seven maritime treasure voyages of Admiral Zheng He (1405–1433) reaching East Africa',
      'Construction of the Forbidden City in Beijing (1420) and stone Great Wall fortifications',
      'Compilation of the Yongle Encyclopedia and Compendium of Materia Medica'
    ],
    countries: ['China']
  },
  {
    id: 'qing_dynasty_china',
    startYear: 1644,
    endYear: 1911,
    priority: 74,
    name: 'Qing Dynasty China (Great Qing Empire)',
    historicalName: 'Da Qing Guo',
    ruler: (y) =>
      y < 1661
        ? 'Shunzhi Emperor'
        : y <= 1722
        ? 'Kangxi Emperor'
        : y <= 1735
        ? 'Yongzheng Emperor'
        : y <= 1796
        ? 'Qianlong Emperor (High Qing Zenith)'
        : y <= 1850
        ? 'Jiaqing / Daoguang Emperor'
        : y <= 1908
        ? 'Empress Dowager Cixi / Guangxu Emperor'
        : 'Puyi (Xuantong Emperor)',
    capital: 'Beijing (Peking)',
    populationEstimate: (y) => (y < 1750 ? '180 Million' : y < 1850 ? '360 Million' : '430 Million'),
    color: '#d4af37',
    description: 'The final imperial dynasty of China, doubling the empire\'s territory to encompass Mongolia, Xinjiang, Tibet, and Taiwan during the High Qing era and accounting for a third of global GDP in 1800.',
    keyEvents: [
      'High Qing golden age under the Kangxi, Yongzheng, and Qianlong Emperors (1661–1796)',
      'Compilation of the Complete Library of the Four Treasuries (Siku Quanshu)',
      'Late Qing Self-Strengthening Movement and 1911 Xinhai Revolution'
    ],
    countries: (y) => (y < 1895 ? ['China', 'Mongolia', 'Taiwan'] : ['China', 'Mongolia'])
  },
  {
    id: 'ottoman_empire_dynamic',
    startYear: 1300,
    endYear: 1922,
    priority: 78,
    name: (y) => (y >= 1890 && y <= 1918 ? 'Osmanisches Reich (Ottoman Empire)' : 'Ottoman Empire (Sublime Ottoman State)'),
    historicalName: 'Devlet-i Aliyye-i Osmaniyye',
    ruler: getOttomanRulerByYear,
    capital: (y) => (y < 1365 ? 'Bursa' : y < 1453 ? 'Edirne (Adrianople)' : 'Constantinople (Kostantiniyye / Istanbul)'),
    populationEstimate: (y) => (y < 1517 ? '11 Million' : y < 1800 ? '28 – 35 Million' : '24 Million'),
    color: '#d9534f',
    description: 'Tricontinental superpower spanning Southeast Europe, Western Asia, and North Africa for six centuries following Sultan Mehmed II\'s conquest of Constantinople in 1453.',
    keyEvents: [
      'Conquest of Constantinople by Sultan Mehmed II on May 29, 1453',
      'Golden Age of Sultan Suleiman the Magnificent and architect Mimar Sinan (1520–1566)',
      'Tanzimat constitutional and administrative modernization reforms (1839–1876)'
    ],
    // Dynamic year-by-year Ottoman borders!
    countries: (y) => {
      if (y < 1453) return ['Turkey', 'Bulgaria'];
      if (y < 1517) return ['Turkey', 'Greece', 'Bulgaria', 'North Macedonia', 'Albania', 'Serbia', 'Bosnia and Herz.'];
      if (y < 1699) return ['Turkey', 'Greece', 'Bulgaria', 'North Macedonia', 'Albania', 'Serbia', 'Bosnia and Herz.', 'Montenegro', 'Hungary', 'Syria', 'Lebanon', 'Israel', 'Palestine', 'Jordan', 'Iraq', 'Kuwait', 'Egypt', 'Tunisia', 'Yemen', 'Cyprus'];
      if (y < 1830) return ['Turkey', 'Greece', 'Bulgaria', 'North Macedonia', 'Albania', 'Serbia', 'Bosnia and Herz.', 'Montenegro', 'Syria', 'Lebanon', 'Israel', 'Palestine', 'Jordan', 'Iraq', 'Kuwait', 'Egypt', 'Tunisia', 'Yemen', 'Cyprus'];
      if (y < 1878) return ['Turkey', 'Bulgaria', 'North Macedonia', 'Albania', 'Serbia', 'Bosnia and Herz.', 'Montenegro', 'Syria', 'Lebanon', 'Israel', 'Palestine', 'Jordan', 'Iraq', 'Kuwait', 'Egypt', 'Tunisia', 'Yemen', 'Cyprus'];
      if (y <= 1912) return ['Turkey', 'Albania', 'North Macedonia', 'Syria', 'Lebanon', 'Israel', 'Palestine', 'Jordan', 'Iraq', 'Kuwait', 'Yemen'];
      return ['Turkey', 'Syria', 'Lebanon', 'Israel', 'Palestine', 'Jordan', 'Iraq', 'Yemen'];
    }
  },
  {
    id: 'wallachia_moldavia_romania',
    startYear: 1330,
    endYear: 1947,
    priority: 81,
    name: (y) =>
      y < 1599
        ? 'Principality of Wallachia & Moldavia (Țara Românească)'
        : y <= 1601
        ? 'Union of Wallachia, Transylvania & Moldavia (Michael the Brave)'
        : y < 1859
        ? 'Danubian Principalities of Wallachia & Moldavia'
        : y < 1881
        ? 'United Principalities of Moldavia and Wallachia (Romania)'
        : 'Kingdom of Romania (Regatul României)',
    historicalName: (y) =>
      y < 1859
        ? 'Țara Românească (Valahia) & Moldova'
        : y < 1881
        ? 'Principatele Unite ale Moldovei și Țării Românești'
        : 'Regatul României',
    ruler: (y) =>
      y < 1386
        ? 'Voivode Basarab I the Founder (House of Basarab)'
        : y <= 1418
        ? 'Voivode Mircea I the Elder (Mircea cel Bătrân)'
        : y < 1448
        ? 'Voivode Dan II / Vlad II Dracul (Order of the Dragon)'
        : y === 1448 || (y >= 1456 && y <= 1462) || y === 1476
        ? 'Voivode Vlad III the Impaler (Vlad Țepeș / Dracula)'
        : y <= 1504
        ? 'Voivode Stephen the Great (Ștefan cel Mare) & Radu the Handsome'
        : y < 1593
        ? 'Voivode Neagoe Basarab / Petru Rareș'
        : y <= 1601
        ? 'Voivode Michael the Brave (Mihai Viteazul)'
        : y < 1688
        ? 'Voivode Matei Basarab & Vasile Lupu'
        : y <= 1714
        ? 'Prince Constantin Brâncoveanu & Dimitrie Cantemir'
        : y < 1821
        ? 'Phanariot Princes of Wallachia & Moldavia'
        : y < 1859
        ? 'Tudor Vladimirescu (1821 Uprising) / Organic Statute Princes'
        : y <= 1866
        ? 'Domnitor Alexandru Ioan Cuza'
        : y <= 1914
        ? 'King Carol I of Romania'
        : y <= 1927
        ? 'King Ferdinand I the Unifier & Queen Marie'
        : y <= 1940
        ? 'King Carol II'
        : 'King Michael I of Romania',
    capital: (y) =>
      y < 1386
        ? 'Câmpulung & Curtea de Argeș'
        : y < 1659
        ? 'Târgoviște (Wallachia) & Suceava (Moldavia)'
        : 'Bucharest (București) & Iași',
    populationEstimate: (y) =>
      y < 1600
        ? '1.5 – 2.2 Million'
        : y < 1859
        ? '3.5 – 4.5 Million'
        : y < 1918
        ? '7.2 Million'
        : '18.0 Million (Greater Romania)',
    color: '#9f1239',
    description:
      'Founded in 1330 by Voivode Basarab I at the Battle of Posada, the Principality of Wallachia (Țara Românească) and neighboring Moldavia defended the Carpathian-Danubian frontier under Voivodes Mircea the Elder, Vlad III the Impaler (Vlad Țepeș, who waged the famous 1462 campaign against Sultan Mehmed II from Târgoviște), Stephen the Great, and Michael the Brave (who first united Wallachia, Transylvania, and Moldavia in 1600), before uniting in 1859 to form modern Romania.',
    keyEvents: [
      '1330 CE: Voivode Basarab I defeats King Charles I of Hungary at the Battle of Posada, establishing the independent Principality of Wallachia',
      '1456–1462 CE: Reign of Voivode Vlad III the Impaler (Vlad Țepeș), culminating in the June 17, 1462 Night Attack at Târgoviște against Ottoman Sultan Mehmed II',
      '1599–1600 CE: Voivode Michael the Brave (Mihai Viteazul) achieves the first political union of Wallachia, Transylvania, and Moldavia',
      '1859 & 1877–1878 CE: Union of Moldavia and Wallachia under Alexandru Ioan Cuza and full sovereign recognition after the Romanian War of Independence',
      'December 1, 1918: Great Union at Alba Iulia uniting Transylvania, Bessarabia, and Bukovina with the Kingdom of Romania'
    ],
    countries: (y) => (y < 1812 || (y >= 1918 && y < 1940) ? ['Romania', 'Moldova'] : ['Romania'])
  },
  {
    id: 'safavid_afsharid_qajar_persia',
    startYear: 1501,
    endYear: 1925,
    priority: 74,
    name: (y) =>
      y < 1736
        ? 'Safavid Persian Empire'
        : y < 1796
        ? 'Afsharid & Zand Persian Empire'
        : 'Sublime State of Persia (Qajar Empire)',
    historicalName: 'Mamalek-e Mahruseh-ye Iran',
    ruler: (y) =>
      y < 1587
        ? 'Shah Ismail I / Shah Tahmasp I'
        : y < 1736
        ? 'Shah Abbas I the Great'
        : y < 1796
        ? 'Nader Shah Afshar / Karim Khan Zand'
        : y < 1896
        ? 'Fath-Ali Shah / Naser al-Din Shah Qajar'
        : 'Mozaffar ad-Din Shah / Ahmad Shah Qajar & Majlis',
    capital: (y) => (y < 1598 ? 'Tabriz & Qazvin' : y < 1736 ? 'Isfahan (Naqsh-e Jahan)' : y < 1795 ? 'Mashhad & Shiraz' : 'Tehran'),
    populationEstimate: '9 – 11 Million',
    color: '#6d8e74',
    description: 'Established Twelver Shia Islam as the state religion of Iran under the Safavids, adorned Isfahan ("Half the World") under Shah Abbas I, and enacted the 1906 Persian Constitutional Revolution.',
    keyEvents: [
      'Shah Abbas I transforms Isfahan with Naqsh-e Jahan Square and Sheikh Lotfollah Mosque',
      'Persian Constitutional Revolution (1905–1911) establishing the National Consultative Assembly (Majlis)'
    ],
    countries: (y) => (y < 1828 ? ['Iran', 'Azerbaijan', 'Armenia'] : ['Iran'])
  },
  {
    id: 'mughal_empire_maratha',
    startYear: 1526,
    endYear: 1857,
    priority: 74,
    name: (y) => (y < 1740 ? 'Mughal Empire (Hindustan)' : 'Late Mughal Empire & Maratha Confederacy'),
    historicalName: 'Gurkani / Hindustan',
    ruler: (y) =>
      y < 1556
        ? 'Emperor Babur / Humayun'
        : y <= 1605
        ? 'Emperor Akbar the Great'
        : y <= 1658
        ? 'Emperor Jahangir / Shah Jahan (Builder of the Taj Mahal)'
        : y <= 1707
        ? 'Emperor Aurangzeb Alamgir'
        : 'Late Mughal Emperors (Bahadur Shah Zafar) & Maratha Peshwas',
    capital: 'Agra / Fatehpur Sikri / Shahjahanabad (Old Delhi)',
    populationEstimate: '150 – 175 Million (25% of world GDP in 1700)',
    color: '#16a34a',
    description: 'Early modern South Asian economic and architectural colossus that generated a quarter of global manufacturing output and built the Taj Mahal, Red Fort, and Fatehpur Sikri.',
    keyEvents: [
      'Reign of Akbar the Great (1556–1605) instituting Sulh-i-Kul religious harmony and Todar Mal revenue system',
      'Completion of the Taj Mahal in Agra and Red Fort in Delhi under Shah Jahan (1648)',
      'Peak territorial reach under Aurangzeb (1700) followed by rise of the Maratha Confederacy'
    ],
    countries: (y) =>
      y < 1757
        ? ['India', 'Pakistan', 'Bangladesh', 'Afghanistan']
        : ['India', 'Pakistan']
  },
  {
    id: 'polish_lithuanian_commonwealth',
    startYear: 1386,
    endYear: 1795,
    priority: 74,
    name: (y) => (y < 1569 ? 'Polish-Lithuanian Union (Jagiellonian Realm)' : 'Polish-Lithuanian Commonwealth'),
    historicalName: 'Rzeczpospolita Obojga Narodów',
    ruler: (y) =>
      y < 1572
        ? 'Władysław II Jagiełło / Sigismund II Augustus'
        : y < 1696
        ? 'Stephen Báthory / King John III Sobieski'
        : 'Stanisław August Poniatowski (Constitution of May 3, 1791)',
    capital: (y) => (y < 1596 ? 'Kraków & Vilnius' : 'Warsaw & Vilnius'),
    populationEstimate: '11 – 14 Million',
    color: '#db2777',
    description: 'One of Europe\'s largest and most populous states for four centuries, renowned for elective parliamentary monarchy (Sejm), Warsaw Confederation religious tolerance (1573), the Winged Hussars, and Europe\'s first modern written constitution (May 3, 1791).',
    keyEvents: [
      'Victory over the Teutonic Knights at the Battle of Grunwald (1410)',
      'Union of Lublin (1569) and King John III Sobieski\'s cavalry charge saving Vienna (1683)',
      'Adoption of the Constitution of May 3, 1791 before the Third Partition (1795)'
    ],
    countries: (y) => (y < 1667 ? ['Poland', 'Lithuania', 'Belarus', 'Ukraine', 'Latvia'] : ['Poland', 'Lithuania', 'Belarus'])
  },
  {
    id: 'tokugawa_medieval_japan',
    startYear: 794,
    endYear: 1867,
    priority: 72,
    name: (y) => (y < 1185 ? 'Heian Imperial Japan' : y < 1603 ? 'Kamakura / Ashikaga Shogunate & Sengoku Japan' : 'Tokugawa Shogunate (Edo Period Japan)'),
    historicalName: 'Nihon-koku (Bakufu)',
    ruler: (y) =>
      y < 1185
        ? 'Emperor Kanmu & Fujiwara Regency'
        : y < 1568
        ? 'Minamoto no Yoritomo / Ashikaga Shoguns'
        : y < 1603
        ? 'Oda Nobunaga & Toyotomi Hideyoshi (Unifiers)'
        : 'Shogun Tokugawa Ieyasu & Tokugawa Shoguns',
    capital: (y) => (y < 1603 ? 'Heian-kyō (Kyoto) & Kamakura' : 'Edo (Tokyo) & Kyoto'),
    populationEstimate: (y) => (y < 1600 ? '12 – 18 Million' : '30 Million'),
    color: '#c2410c',
    description: 'From the classical literary court of Heian Kyoto (Tale of Genji) and samurai unification to the 260-year Pax Tokugawa centered at Edo, one of the world\'s largest cities by 1720.',
    keyEvents: [
      'Murasaki Shikibu writes The Tale of Genji in Heian Kyoto (c. 1008 CE)',
      'Repulsion of the Mongol Armada (Kamikaze typhoons of 1274 and 1281)',
      'Tokugawa Ieyasu establishes the Edo Shogunate after the Battle of Sekigahara (1600–1603)'
    ],
    countries: ['Japan']
  },
  {
    id: 'joseon_goryeo_korea',
    startYear: 918,
    endYear: 1909,
    priority: 72,
    name: (y) => (y < 1392 ? 'Goryeo Dynasty Korea' : y < 1897 ? 'Joseon Dynasty Korea' : 'Korean Empire (Daehan Jeguk)'),
    historicalName: 'Goryeo / Joseon / Daehan Jeguk',
    ruler: (y) =>
      y < 1392
        ? 'King Taejo Wang Geon'
        : y < 1450
        ? 'King Taejo Yi Seong-gye / King Sejong the Great'
        : y < 1864
        ? 'King Seonjo & Admiral Yi Sun-sin / King Jeongjo'
        : 'Emperor Gojong',
    capital: (y) => (y < 1394 ? 'Gaegyeong (Kaesong)' : 'Hanyang (Seoul)'),
    populationEstimate: '10 – 16 Million',
    color: '#7c3aed',
    description: 'Five-century Confucian kingdom celebrated for King Sejong the Great\'s creation of the Hangul phonetic alphabet (1443), the Jikji metal movable type (1377), and Admiral Yi Sun-sin\'s Geobukseon (Turtle Ships).',
    keyEvents: [
      'Printing of Jikji (1377), the world\'s oldest extant book printed with movable metal type',
      'Promulgation of the Hangul alphabet by King Sejong the Great (1443–1446)',
      'Naval victories of Admiral Yi Sun-sin during the Imjin War (1592–1598)'
    ],
    countries: ['North Korea', 'South Korea']
  },
  {
    id: 'spanish_global_empire',
    startYear: 1479,
    endYear: 1994,
    priority: 75,
    name: (y) =>
      y < 1516
        ? 'Catholic Monarchs of Spain (Castile & Aragon)'
        : y <= 1824
        ? 'Spanish Empire (Monarquía Hispánica & Viceroyalties)'
        : y < 1931
        ? 'Kingdom of Spain'
        : y <= 1939
        ? 'Second Spanish Republic'
        : y <= 1975
        ? 'Spanish State (España)'
        : 'Kingdom of Spain (Constitutional Monarchy)',
    historicalName: 'Imperio Español / Reino de España',
    ruler: (y) =>
      y < 1516
        ? 'Queen Isabella I & King Ferdinand II'
        : y <= 1556
        ? 'Emperor Charles V (Carlos I of Spain)'
        : y <= 1598
        ? 'King Philip II (Spanish Golden Age)'
        : y < 1700
        ? 'King Philip IV (House of Habsburg)'
        : y < 1808
        ? 'King Philip V / King Charles III (House of Bourbon)'
        : y < 1833
        ? 'King Ferdinand VII'
        : y < 1931
        ? 'Queen Isabella II / King Alfonso XII / Alfonso XIII'
        : y <= 1939
        ? 'President Manuel Azaña (Second Spanish Republic)'
        : y <= 1975
        ? 'Francisco Franco'
        : 'King Juan Carlos I & Cortes Generales',
    capital: (y) => (y < 1561 ? 'Toledo & Valladolid' : 'Madrid'),
    populationEstimate: (y) => (y <= 1821 ? '11M (Spain) + 18M (Viceroyalties)' : '18.5 – 39 Million'),
    color: '#bd9e42',
    description: 'The first global empire in history on which "the sun never set," linking the Americas, Europe, and Asia via the Manila-Acapulco Galleons and founding the first universities in the Americas (Lima & Mexico City, 1551).',
    keyEvents: [
      'Completion of the Reconquista and first transatlantic voyage of Christopher Columbus (1492)',
      'First circumnavigation of the Earth by the Magellan-Elcano expedition (1519–1522)',
      'Spanish Golden Age (Siglo de Oro) of Cervantes, Velázquez, and Calderón de la Barca'
    ],
    // Dynamic Spanish Empire borders before and after the Latin American Wars of Independence!
    countries: (y) => {
      const list = ['Spain'];
      if (y <= 1898) list.push('Cuba', 'Puerto Rico');
      if (y >= 1565 && y <= 1898) list.push('Philippines');
      if (y >= 1686 && y <= 1898) list.push('Micronesia', 'Palau');
      if (y >= 1686 && y <= 1884) list.push('Marshall Is.');
      if (y < 1822) list.push('Dominican Rep.');
      if (y >= 1498 && y < 1623) list.push('St. Kitts and Nevis');
      if (y >= 1498 && y < 1627) list.push('Barbados');
      if (y >= 1498 && y < 1632) list.push('Antigua and Barb.');
      if (y >= 1498 && y < 1635) list.push('Dominica', 'Saint Lucia', 'St. Vin. and Gren.');
      if (y >= 1498 && y < 1649) list.push('Grenada');
      if (y >= 1519 && y < 1821) {
        list.push('Mexico', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panama');
      }
      if (y >= 1532 && y < 1819) list.push('Colombia', 'Venezuela', 'Ecuador');
      if (y >= 1532 && y < 1821) list.push('Peru');
      if (y >= 1532 && y < 1825) list.push('Bolivia');
      if (y >= 1533 && y < 1818) list.push('Chile');
      if (y >= 1536 && y < 1811) list.push('Paraguay');
      if (y >= 1536 && y < 1816) list.push('Uruguay');
      if (y >= 1778 && y < 1968) list.push('Eq. Guinea');
      if (y >= 1884 && y < 1976) list.push('W. Sahara');
      return list;
    }
  },
  {
    id: 'portuguese_empire',
    startYear: 1139,
    endYear: 1974,
    priority: 74,
    name: (y) => (y < 1500 ? 'Kingdom of Portugal (Age of Discovery)' : y < 1910 ? 'Portuguese Empire (Reino de Portugal)' : 'Portuguese Republic & Overseas Provinces'),
    historicalName: 'Império Português',
    ruler: (y) =>
      y < 1495
        ? 'King Afonso Henriques / King John I & Prince Henry the Navigator'
        : y < 1580
        ? 'King Manuel I (Vasco da Gama Era) / John III'
        : y < 1822
        ? 'House of Braganza (King John IV / John VI)'
        : y < 1910
        ? 'King Carlos I / King Manuel II'
        : 'Portuguese Republic',
    capital: (y) => (y >= 1808 && y <= 1820 ? 'Rio de Janeiro (Royal Court in Brazil) & Lisbon' : 'Lisbon'),
    populationEstimate: '5.5 – 9.5 Million (Metropole) + Overseas Realm',
    color: '#589868',
    description: 'Pioneered the Age of Discovery by rounding the Cape of Good Hope to India (Vasco da Gama, 1498), reaching Brazil (Pedro Álvares Cabral, 1500), and maintaining a six-century maritime empire.',
    keyEvents: [
      'Vasco da Gama opens the sea route to India (1498) and Cabral lands in Brazil (1500)',
      'Treaty of Tordesillas (1494) and publication of Camões\' epic Os Lusíadas (1572)',
      'Peaceful Independence of Brazil (1822) and Carnation Revolution (1974) ending African colonial rule'
    ],
    countries: (y) => {
      const lands = ['Portugal'];
      if (y >= 1462 && y <= 1974) lands.push('Cabo Verde');
      if (y >= 1470 && y <= 1974) lands.push('São Tomé and Príncipe');
      if (y >= 1500 && y <= 1974) lands.push('Angola', 'Mozambique', 'Guinea-Bissau');
      if (y >= 1751 && y < 1822) lands.push('Brazil');
      return lands;
    }
  },
  {
    id: 'dutch_republic_kingdom',
    startYear: 1581,
    endYear: 1994,
    priority: 74,
    name: (y) => (y < 1815 ? 'Dutch Republic (United Provinces & VOC)' : y < 1949 ? 'Kingdom of the Netherlands & Dutch East Indies' : 'Kingdom of the Netherlands'),
    historicalName: 'Republiek der Zeven Verenigde Nederlanden / Koninkrijk der Nederlanden',
    ruler: (y) =>
      y < 1795
        ? 'William the Silent / Johan de Witt / William III of Orange'
        : y < 1890
        ? 'King William I / II / III (House of Orange-Nassau)'
        : y < 1948
        ? 'Queen Wilhelmina'
        : y < 1980
        ? 'Queen Juliana'
        : 'Queen Beatrix',
    capital: 'Amsterdam / The Hague',
    populationEstimate: '2.5 – 15 Million (Metropole) + Overseas Realm',
    color: '#c2783f',
    description: 'Pioneered modern stock markets, central banking, and optical science during the 17th-century Dutch Golden Age (VOC, Rembrandt, Vermeer, Spinoza, Huygens) and governed the Dutch East Indies and Suriname.',
    keyEvents: [
      'Founding of the Dutch East India Company (VOC) and Amsterdam Stock Exchange (1602)',
      'Dutch Golden Age of science (Antonie van Leeuwenhoek, Christiaan Huygens) and painting (Rembrandt)',
      'Host of the Hague Peace Conferences (1899 & 1907)'
    ],
    countries: (y) => {
      const lands = ['Netherlands'];
      if (y >= 1619 && y < 1949) lands.push('Indonesia');
      if (y >= 1619 && y < 1975) lands.push('Suriname');
      if (y >= 1638 && y <= 1710) lands.push('Mauritius');
      if (y >= 1815 && y < 1830) lands.push('Belgium', 'Luxembourg');
      return lands;
    }
  },
  {
    id: 'tsardom_and_russian_empire',
    startYear: 1547,
    endYear: 1917,
    priority: 76,
    name: (y) => (y < 1721 ? 'Tsardom of Russia' : y >= 1890 ? 'Kaiserreich Russland (Russian Empire)' : 'Russian Empire'),
    historicalName: 'Rossiyskoye Tsarstvo / Rossiyskaya Imperiya',
    ruler: getRussianRulerByYear,
    capital: (y) => (y < 1712 ? 'Moscow' : 'Saint Petersburg (Petrograd)'),
    populationEstimate: (y) => (y < 1700 ? '14 Million' : y < 1820 ? '42 Million' : y < 1897 ? '95 Million' : '160.7 Million'),
    color: '#4a6646',
    description: 'Eurasian empire stretching from the Baltic and Black Seas across Siberia to the Pacific Ocean, founded as an empire by Peter the Great in 1721 and defeating Napoleon\'s invasion in 1812.',
    keyEvents: [
      'Peter the Great founds Saint Petersburg (1703) and proclaims the Russian Empire (1721)',
      'Patriotic War of 1812 defeating Napoleon\'s Grande Armée and advancing to Paris (1814)',
      'Emancipation of the Serfs by Tsar Alexander II (1861) and completion of the Trans-Siberian Railway'
    ],
    countries: (y) => {
      if (y < 1582) return [];
      if (y < 1667) return ['Russia'];
      if (y < 1795) return ['Russia', 'Ukraine', 'Belarus', 'Estonia', 'Latvia'];
      if (y < 1809) return ['Russia', 'Ukraine', 'Belarus', 'Estonia', 'Latvia', 'Lithuania', 'Georgia'];
      if (y < 1865) return ['Russia', 'Ukraine', 'Belarus', 'Estonia', 'Latvia', 'Lithuania', 'Finland', 'Moldova', 'Georgia', 'Armenia', 'Azerbaijan', 'Kazakhstan'];
      return ['Russia', 'Ukraine', 'Belarus', 'Estonia', 'Latvia', 'Lithuania', 'Finland', 'Moldova', 'Georgia', 'Armenia', 'Azerbaijan', 'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan'];
    }
  },
  {
    id: 'british_kingdom_and_empire',
    startYear: 1066,
    endYear: 1994,
    priority: 76,
    name: (y) =>
      y < 1707
        ? 'Kingdom of England & Crown of Scotland'
        : y < 1801
        ? 'Kingdom of Great Britain & Colonial Empire'
        : y >= 1890 && y <= 1920
        ? 'Kgr. Großbritannien und Irland (British Empire)'
        : 'United Kingdom & British Empire',
    historicalName: 'British Empire',
    ruler: getBritishMonarchByYear,
    capital: 'London',
    populationEstimate: (y) => (y < 1750 ? '9.5 Million' : y < 1850 ? '26M (UK) + 150M (Empire)' : '45M (UK) + 412M (Empire)'),
    color: '#c46c6c',
    description: 'Constitutional parliamentary monarchy that spearheaded the Scientific Revolution (Isaac Newton) and Industrial Revolution (James Watt), building the largest maritime empire in world history.',
    keyEvents: [
      'Signing of Magna Carta (1215), Glorious Revolution Bill of Rights (1689), and Acts of Union (1707)',
      'Industrial Revolution steam power, railway engineering, and Royal Navy global supremacy after Trafalgar (1805)',
      'Allied bastion during World War I and the Battle of Britain in World War II (1940)'
    ],
    // Dynamic British Empire territorial reach by year (releasing Dominions and colonies in their exact independence years)
    countries: (y) => {
      const lands = ['United Kingdom'];
      if (y < 1922) lands.push('Ireland');
      if (y >= 1763 && y < 1867) lands.push('Canada');
      if (y >= 1829 && y < 1901) lands.push('Australia');
      if (y >= 1840 && y < 1907) lands.push('New Zealand');
      if (y >= 1765 && y < 1858) lands.push('Bangladesh');
      if (y >= 1818 && y < 1947) lands.push('India', 'Pakistan', 'Bangladesh');
      if (y >= 1815 && y < 1948) lands.push('Sri Lanka');
      if (y >= 1824 && y < 1948) lands.push('Myanmar');
      if (y >= 1824 && y < 1957) lands.push('Malaysia');
      if (y >= 1819 && y < 1963) lands.push('Singapore');
      if (y >= 1888 && y < 1984) lands.push('Brunei');
      if (y >= 1884 && y < 1975) lands.push('Papua New Guinea');
      if (y >= 1902 && y < 1910) lands.push('South Africa');
      if (y >= 1882 && y < 1922) lands.push('Egypt');
      if (y >= 1899 && y < 1956) lands.push('Sudan', 'South Sudan');
      if (y >= 1874 && y < 1957) lands.push('Ghana');
      if (y >= 1878 && y < 1960) lands.push('Cyprus');
      if (y >= 1885 && y < 1960) lands.push('Nigeria', 'Somalia', 'Somaliland');
      if (y >= 1885 && y < 1961) lands.push('Sierra Leone', 'Kuwait');
      if (y >= 1919 && y < 1961) lands.push('Tanzania');
      if (y >= 1894 && y < 1962) lands.push('Uganda');
      if (y >= 1655 && y < 1962) lands.push('Jamaica', 'Trinidad and Tobago');
      if (y >= 1895 && y < 1963) lands.push('Kenya');
      if (y >= 1891 && y < 1964) lands.push('Malawi', 'Zambia');
      if (y >= 1888 && y < 1965) lands.push('Gambia');
      if (y >= 1885 && y < 1966) lands.push('Botswana', 'Lesotho', 'Guyana');
      if (y >= 1902 && y < 1968) lands.push('eSwatini');
      if (y >= 1874 && y < 1970) lands.push('Fiji');
      if (y >= 1892 && y < 1971) lands.push('United Arab Emirates', 'Qatar');
      if (y >= 1718 && y < 1973) lands.push('Bahamas');
      if (y >= 1893 && y < 1978) lands.push('Solomon Is.');
      if (y >= 1887 && y < 1980) lands.push('Vanuatu');
      if (y >= 1890 && y < 1980) lands.push('Zimbabwe');
      if (y >= 1862 && y < 1981) lands.push('Belize');
      if (y >= 1623 && y < 1983) lands.push('St. Kitts and Nevis');
      if (y >= 1627 && y < 1966) lands.push('Barbados');
      if (y >= 1632 && y < 1981) lands.push('Antigua and Barb.');
      if (y >= 1763 && y < 1974) lands.push('Grenada');
      if (y >= 1763 && y < 1978) lands.push('Dominica');
      if (y >= 1763 && y < 1979) lands.push('St. Vin. and Gren.');
      if (y >= 1803 && y < 1979) lands.push('Saint Lucia');
      if (y >= 1800 && y < 1964) lands.push('Malta');
      if (y >= 1810 && y < 1968) lands.push('Mauritius');
      if (y >= 1811 && y < 1976) lands.push('Seychelles');
      if (y >= 1887 && y < 1965) lands.push('Maldives');
      if (y >= 1861 && y < 1971) lands.push('Bahrain');
      if (y >= 1892 && y < 1978) lands.push('Tuvalu');
      if (y >= 1892 && y < 1979) lands.push('Kiribati');
      if (y >= 1900 && y < 1970) lands.push('Tonga');
      if (y >= 1914 && y < 1962) lands.push('Samoa');
      if (y >= 1914 && y < 1968) lands.push('Nauru');
      if (y >= 1833) lands.push('Falkland Is.');
      if (y >= 1919 && y < 1946) lands.push('Jordan');
      if (y >= 1919 && y < 1948) lands.push('Israel', 'Palestine');
      if (y >= 1919 && y < 1932) lands.push('Iraq');
      if (y >= 1942 && y < 1952) lands.push('Eritrea');
      if (y >= 1944 && y < 1951) lands.push('Libya');
      return lands;
    }
  },
  {
    id: 'federation_of_malaya_1957_1962',
    startYear: 1957,
    endYear: 1962,
    priority: 83,
    name: 'Federation of Malaya (Peninsular Malaya)',
    historicalName: 'Persekutuan Tanah Melayu (Independent 1957–1963)',
    ruler: 'Yang di-Pertuan Agong Tuanku Abdul Rahman & PM Tunku Abdul Rahman',
    capital: 'Kuala Lumpur',
    populationEstimate: '6.3 – 7.4 Million (Peninsular Malaya)',
    color: '#f6c992',
    description: 'Peninsular Malaya achieved independence (Merdeka) from the United Kingdom on August 31, 1957 as the Federation of Malaya under Prime Minister Tunku Abdul Rahman. Meanwhile, Sarawak and North Borneo (Sabah) on Borneo Island as well as Singapore remained under British control until September 16, 1963, when they united with the Federation of Malaya to form Malaysia.',
    keyEvents: [
      'August 31, 1957: Proclamation of Merdeka (Independence) of the Federation of Malaya in Kuala Lumpur by Tunku Abdul Rahman',
      '1957–1963: Sarawak and North Borneo (Sabah) on Borneo Island remain British Crown Colonies prior to the 1963 Malaysia Agreement',
      'September 16, 1963: Unification of Malaya, North Borneo (Sabah), Sarawak, and Singapore to form Malaysia'
    ],
    countries: ['Malaysia']
  },

  // =========================================================================
  // V. REVOLUTIONS, NAPOLEON, UNIFICATIONS & MODERN ERA (1776 CE to 2026 CE)
  // =========================================================================
  {
    id: 'united_states_continuous',
    startYear: 1848,
    endYear: 2026,
    priority: 85,
    name: 'United States of America',
    historicalName: (y) => (y > 1945 ? 'United States of America (Global Superpower)' : 'United States of America'),
    ruler: getUSPresidentByYear,
    capital: (y) => (y < 1790 ? 'Philadelphia & New York' : y < 1800 ? 'Philadelphia' : 'Washington, D.C.'),
    populationEstimate: (y) =>
      y < 1800
        ? '3.9 Million (1790 Census)'
        : y < 1860
        ? '23.2 Million (1850 Census)'
        : y < 1900
        ? '62.9 Million (1890 Census)'
        : y < 1940
        ? '106 – 132 Million'
        : y < 1980
        ? '180 – 226 Million'
        : y < 2010
        ? '281 Million'
        : '336 Million',
    color: (y) => (y > 1994 ? '#a6dba0' : '#385a8a'),
    description: 'Constitutional federal republic founded on the 1776 Declaration of Independence and 1787 Constitution, expanding across North America and emerging in the 20th century as the world\'s leading economic, scientific, and military power.',
    keyEvents: [
      'Declaration of Independence (July 4, 1776) and ratification of the US Constitution (1788)',
      'Louisiana Purchase (1803), Preservation of the Union & Emancipation Proclamation (1863)',
      'Allied Victory in WWII (1945), Apollo 11 Moon Landing (1969), and the Digital Revolution'
    ],
    countries: (y) => {
      const list = ['United States of America', 'Puerto Rico'];
      if (y >= 1898 && y < 1946) list.push('Philippines');
      if (y >= 1899 && y < 1902) list.push('Cuba');
      if (y >= 1944 && y < 1986) list.push('Marshall Is.');
      if (y >= 1945 && y < 1986) list.push('Micronesia');
      if (y >= 1945 && y < 1994) list.push('Palau');
      return list;
    }
  },
  {
    id: 'french_revolutionary_napoleonic_empire',
    startYear: 1789,
    endYear: 1814,
    priority: 86,
    name: (y) => (y < 1799 ? 'French First Republic' : y < 1804 ? 'French Consulate' : 'First French Empire (Napoleonic Empire)'),
    historicalName: 'République Française / Empire Français',
    ruler: (y) => (y < 1799 ? 'National Convention / Directory' : 'Napoléon I Bonaparte (Emperor of the French)'),
    capital: 'Paris',
    populationEstimate: '44 Million (Imperial Core) + 40M Satellite States',
    color: '#3b82f6',
    description: 'From the 1789 Declaration of the Rights of Man and of the Citizen to Emperor Napoleon I\'s continental hegemony, spreading the Napoleonic Civil Code and metric system across Europe.',
    keyEvents: [
      'French Revolution & Declaration of the Rights of Man and of the Citizen (1789)',
      'Promulgation of the Napoleonic Civil Code (1804) and victory at Austerlitz (1805)',
      'Russian Campaign of 1812 and Congress of Vienna (1814–1815)'
    ],
    countries: (y) => {
      const lands = ['France'];
      if (y <= 1802) lands.push('Saint Lucia');
      if (y <= 1803) lands.push('Haiti');
      if (y <= 1809) lands.push('Mauritius');
      if (y <= 1810) lands.push('Seychelles');
      if (y >= 1795 && y < 1805) lands.push('Belgium', 'Netherlands', 'Luxembourg', 'Switzerland');
      if (y >= 1805 && y <= 1813) lands.push('Belgium', 'Netherlands', 'Luxembourg', 'Switzerland', 'Italy', 'Spain', 'Germany', 'Poland', 'Croatia', 'Slovenia');
      return lands;
    }
  },
  {
    id: 'modern_france_1815_1994',
    startYear: 1815,
    endYear: 1994,
    priority: 76,
    name: (y) =>
      y < 1848
        ? 'Kingdom of France (Restoration & July Monarchy)'
        : y < 1852
        ? 'French Second Republic'
        : y < 1870
        ? 'Second French Empire'
        : y < 1940
        ? 'Rep. Frankreich (French Third Republic & Colonial Empire)'
        : y <= 1944
        ? 'Free France & Occupied France (WWII)'
        : y < 1958
        ? 'French Fourth Republic'
        : 'French Fifth Republic',
    historicalName: 'République Française',
    ruler: (y) =>
      y < 1848
        ? 'King Louis XVIII / Louis-Philippe I'
        : y < 1870
        ? 'Emperor Napoleon III'
        : y < 1914
        ? 'Third Republic (President Armand Fallières / PM Georges Clemenceau)'
        : y < 1940
        ? 'President Raymond Poincaré / Albert Lebrun'
        : y < 1969
        ? 'General Charles de Gaulle'
        : 'President Georges Pompidou / Valéry Giscard d\'Estaing / François Mitterrand',
    capital: 'Paris',
    populationEstimate: (y) => (y < 1920 ? '39.5 Million (Metropole) + Colonial Empire' : '42 – 58 Million'),
    color: '#506cb5',
    description: 'Major European cultural, industrial, and colonial power that rebuilt Paris under Baron Haussmann, triumphed at the Marne and Verdun in WWI, and co-founded the European Union.',
    keyEvents: [
      'Haussmann\'s renovation of Paris and 1889 Exposition Universelle (Eiffel Tower)',
      'Heroic defense at the Marne (1914) and Verdun (1916) during World War I',
      'Charles de Gaulle establishes the Fifth Republic (1958) and Franco-German Reconciliation'
    ],
    countries: (y) => {
      const lands = ['France'];
      if (y >= 1871 && y < 1962) lands.push('Algeria');
      if (y >= 1881 && y < 1956) lands.push('Tunisia');
      if (y >= 1912 && y < 1956) lands.push('Morocco');
      if (y >= 1885 && y < 1954) lands.push('Vietnam', 'Cambodia', 'Laos');
      if (y >= 1890 && y < 1960) {
        lands.push(
          'Senegal', 'Mali', 'Niger', 'Chad', 'Mauritania', 'Guinea', 'Côte d\'Ivoire',
          'Burkina Faso', 'Benin', 'Central African Rep.', 'Congo', 'Gabon', 'Madagascar'
        );
      }
      if (y >= 1920 && y < 1946) lands.push('Syria', 'Lebanon');
      if (y >= 1919 && y < 1960) lands.push('Cameroon', 'Togo');
      if (y >= 1884 && y < 1977) lands.push('Djibouti');
      if (y >= 1886 && y < 1975) lands.push('Comoros');
      if (y >= 1853) lands.push('New Caledonia', 'Fr. S. Antarctic Lands');
      return lands;
    }
  },
  {
    id: 'gran_colombia_bolivar',
    startYear: 1819,
    endYear: 1830,
    priority: 82,
    name: 'Gran Colombia (Republic of Colombia)',
    historicalName: 'República de Colombia (Gran Colombia)',
    ruler: 'Libertador President Simón Bolívar & Vice President Francisco de Paula Santander',
    capital: 'Bogotá',
    populationEstimate: '2.5 Million',
    color: '#eab308',
    description: 'The unified South American republic forged by Simón Bolívar following the decisive liberation victories of Boyacá (1819), Carabobo (1821), and Pichincha (1822).',
    keyEvents: [
      'Congress of Angostura (1819) and Congress of Cúcuta (1821) uniting New Granada, Venezuela, and Quito',
      'Liberation campaigns of Simón Bolívar and Antonio José de Sucre'
    ],
    countries: ['Colombia', 'Venezuela', 'Ecuador', 'Panama']
  },
  {
    id: 'austrian_and_austro_hungarian_empire',
    startYear: 1804,
    endYear: 1918,
    priority: 80,
    name: (y) => (y < 1867 ? 'Austrian Empire (Kaisertum Österreich)' : 'K. u. K. Doppelmonarchie (Austro-Hungarian Empire)'),
    historicalName: 'Kaisertum Österreich / Österreichisch-Ungarische Monarchie',
    ruler: (y) => (y < 1835 ? 'Emperor Francis I & Chancellor Metternich' : y < 1848 ? 'Emperor Ferdinand I' : y <= 1916 ? 'Emperor Franz Joseph I' : 'Emperor Karl I'),
    capital: (y) => (y < 1867 ? 'Vienna' : 'Vienna & Budapest'),
    populationEstimate: (y) => (y < 1867 ? '32 Million' : '51.3 Million (1910)'),
    color: '#d6d4b8',
    description: 'Central European Habsburg realm that hosted the Congress of Vienna (1814–15) and reorganized in the 1867 Ausgleich into the Dual Monarchy of Austria-Hungary until the end of WWI in 1918.',
    keyEvents: [
      'Congress of Vienna (1814–1815) designing the Concert of Europe diplomatic system',
      'Austro-Hungarian Compromise (Ausgleich) of 1867 creating the Dual Monarchy',
      'Dissolution in November 1918 into Austria, Hungary, Czechoslovakia, and Yugoslavia'
    ],
    countries: (y) =>
      y < 1866
        ? ['Austria', 'Hungary', 'Czechia', 'Slovakia', 'Croatia', 'Slovenia', 'Bosnia and Herz.']
        : ['Austria', 'Hungary', 'Czechia', 'Slovakia', 'Croatia', 'Slovenia', 'Bosnia and Herz.']
  },
  {
    id: 'prussia_german_confederation_empire_weimar',
    startYear: 1807,
    endYear: 1932,
    priority: 80,
    name: (y) =>
      y < 1866
        ? 'Kingdom of Prussia & German Confederation'
        : y < 1871
        ? 'North German Confederation (Prussia)'
        : y <= 1918
        ? 'Deutsches Reich (German Empire)'
        : 'Weimar Republic (Deutsches Reich)',
    historicalName: 'Königreich Preußen / Deutsches Kaiserreich / Weimarer Republik',
    ruler: (y) =>
      y < 1840
        ? 'King Frederick William III'
        : y < 1861
        ? 'King Frederick William IV'
        : y < 1888
        ? 'Kaiser Wilhelm I & Chancellor Otto von Bismarck'
        : y <= 1918
        ? 'Kaiser Wilhelm II'
        : 'President Friedrich Ebert / Paul von Hindenburg',
    capital: 'Berlin',
    populationEstimate: (y) => (y < 1871 ? '38 Million' : '64.9 Million (1910)'),
    color: '#2c4251',
    description: 'Unified in 1871 at Versailles by Chancellor Otto von Bismarck into Europe\'s leading industrial, chemical, and scientific power, transitioning in 1919 into the parliamentary Weimar Republic.',
    keyEvents: [
      'Zollverein customs union (1834) and Proclamation of the German Empire (January 18, 1871)',
      'Bismarck\'s pioneering social insurance legislation (health, accident, and old-age pensions, 1883–1889)',
      'Weimar Constitution of 1919 and Locarno Treaties (1925)'
    ],
    countries: (y) => {
      const lands = ['Germany'];
      if (y >= 1884 && y <= 1918) {
        lands.push('Tanzania', 'Rwanda', 'Burundi', 'Namibia', 'Cameroon', 'Togo', 'Papua New Guinea');
      }
      if (y >= 1885 && y <= 1913) lands.push('Marshall Is.');
      if (y >= 1888 && y <= 1913) lands.push('Nauru');
      if (y >= 1899 && y <= 1913) lands.push('Micronesia', 'Palau');
      if (y >= 1900 && y <= 1913) lands.push('Samoa');
      return lands;
    }
  },
  {
    id: 'nazi_germany_axis_wwii',
    startYear: 1933,
    endYear: 1945,
    priority: 90,
    name: (y) => (y < 1939 ? 'German Reich (Third Reich)' : 'Axis Powers / Greater German Reich (WWII)'),
    historicalName: 'Deutsches Reich (1933–1945)',
    ruler: 'Adolf Hitler',
    capital: 'Berlin',
    populationEstimate: '80 Million (Greater Reich)',
    color: '#2b394a',
    description: 'Totalitarian dictatorship that annexed Austria and the Sudetenland in 1938 and ignited World War II in Europe on September 1, 1939 before unconditional Allied defeat in May 1945.',
    keyEvents: [
      'Anschluss of Austria and Munich Agreement (1938)',
      'Invasion of Poland (September 1, 1939) igniting World War II in Europe',
      'Defeat at Stalingrad (1943), Normandy D-Day (1944), and Allied capture of Berlin (May 1945)'
    ],
    countries: (y) => {
      if (y < 1938) return ['Germany'];
      if (y === 1938) return ['Germany', 'Austria'];
      if (y === 1939) return ['Germany', 'Austria', 'Czechia', 'Poland'];
      if (y >= 1940 && y <= 1943) return ['Germany', 'Austria', 'Czechia', 'Poland', 'Denmark', 'Norway', 'Netherlands', 'Belgium', 'Luxembourg', 'France', 'Greece', 'Serbia'];
      if (y === 1944) return ['Germany', 'Austria', 'Czechia', 'Poland', 'Denmark', 'Norway'];
      return ['Germany', 'Austria'];
    }
  },
  {
    id: 'kingdom_of_italy_and_republic',
    startYear: 1861,
    endYear: 1994,
    priority: 79,
    name: (y) => (y <= 1946 ? 'Kgr. Italien (Kingdom of Italy)' : 'Italian Republic (Repubblica Italiana)'),
    historicalName: 'Regno d\'Italia / Repubblica Italiana',
    ruler: (y) =>
      y < 1878
        ? 'King Victor Emmanuel II / Count Cavour & Giuseppe Garibaldi'
        : y < 1900
        ? 'King Umberto I'
        : y <= 1922
        ? 'King Victor Emmanuel III / PM Giovanni Giolitti'
        : y <= 1943
        ? 'King Victor Emmanuel III / Benito Mussolini'
        : 'Prime Minister Alcide De Gasperi & Italian Parliament',
    capital: (y) => (y < 1865 ? 'Turin' : y < 1871 ? 'Florence' : 'Rome'),
    populationEstimate: (y) => (y < 1920 ? '34.4 Million (1910)' : '45 – 56 Million'),
    color: '#639c67',
    description: 'Unified during the Risorgimento in 1861 under King Victor Emmanuel II, Cavour, and Garibaldi, transitioning by the 1946 referendum into the modern democratic Italian Republic and co-founder of the EEC (Treaty of Rome, 1957).',
    keyEvents: [
      'Proclamation of the unified Kingdom of Italy (1861) and capture of Rome as capital (1870)',
      '1946 Constitutional Referendum establishing the Italian Republic',
      'Signing of the Treaty of Rome (1957) founding the European Economic Community'
    ],
    countries: (y) => {
      const lands = ['Italy'];
      if (y >= 1890 && y <= 1941) lands.push('Eritrea', 'Somalia');
      if (y >= 1912 && y <= 1943) lands.push('Libya');
      if (y >= 1936 && y <= 1941) lands.push('Ethiopia');
      if (y >= 1939 && y <= 1943) lands.push('Albania');
      return lands;
    }
  },
  {
    id: 'soviet_union_ussr',
    startYear: 1918,
    endYear: 1991,
    priority: 88,
    name: (y) => (y < 1922 ? 'Russian Soviet Federative Socialist Republic (RSFSR)' : 'Union of Soviet Socialist Republics (USSR)'),
    historicalName: 'Soyuz Sovetskikh Sotsialisticheskikh Respublik',
    ruler: getRussianRulerByYear,
    capital: 'Moscow',
    populationEstimate: (y) => (y < 1940 ? '170 Million' : y < 1970 ? '220 Million' : '286 Million (1989 Census)'),
    color: '#8b2635',
    description: 'Federal socialist superpower spanning eleven time zones across Eurasia, playing a decisive role on the Eastern Front in World War II, launching the first artificial satellite (Sputnik, 1957) and human in space (Yuri Gagarin, 1961), before dissolving in December 1991.',
    keyEvents: [
      'Formation of the USSR by treaty on December 30, 1922',
      'Victory in the Great Patriotic War at Stalingrad (1943), Kursk (1943), and Berlin (1945)',
      'Launch of Sputnik 1 (1957) and Yuri Gagarin\'s orbital spaceflight (1961)',
      'Perestroika reforms and dissolution into 15 sovereign republics (December 1991)'
    ],
    countries: (y) =>
      y < 1940
        ? ['Russia', 'Ukraine', 'Belarus', 'Georgia', 'Armenia', 'Azerbaijan', 'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan']
        : ['Russia', 'Ukraine', 'Belarus', 'Estonia', 'Latvia', 'Lithuania', 'Moldova', 'Georgia', 'Armenia', 'Azerbaijan', 'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan']
  },
  {
    id: 'empire_of_japan_modern',
    startYear: 1868,
    endYear: 1945,
    priority: 85,
    name: 'Empire of Japan (Dai Nippon Teikoku)',
    historicalName: 'Dai Nippon Teikoku (Meiji, Taishō & Early Shōwa)',
    ruler: (y) => (y <= 1912 ? 'Emperor Meiji (Mutsuhito)' : y <= 1926 ? 'Emperor Taishō' : 'Emperor Shōwa (Hirohito)'),
    capital: 'Tokyo',
    populationEstimate: (y) => (y < 1915 ? '50.9 Million (Home Islands)' : '73 Million (Home Islands) + Imperial Territories'),
    color: '#c2410c',
    description: 'Rapidly industrialized following the 1868 Meiji Restoration into a constitutional monarchy and naval power, expanding across East Asia before Allied defeat and post-1945 pacifist democratization.',
    keyEvents: [
      'Meiji Restoration (1868) and Meiji Constitution (1889) modernizing industry, railways, and education',
      'First Sino-Japanese War (1894–95) and Russo-Japanese War (1904–05)',
      'Pacific War (1941–1945) ending with the Potsdam Declaration and Instrument of Surrender'
    ],
    countries: (y) => {
      if (y < 1895) return ['Japan'];
      if (y < 1910) return ['Japan', 'Taiwan'];
      if (y < 1914) return ['Japan', 'Taiwan', 'North Korea', 'South Korea'];
      if (y < 1942) return ['Japan', 'Taiwan', 'North Korea', 'South Korea', 'Micronesia', 'Marshall Is.', 'Palau'];
      if (y <= 1944) return ['Japan', 'Taiwan', 'North Korea', 'South Korea', 'Micronesia', 'Marshall Is.', 'Palau', 'Kiribati', 'Nauru', 'Philippines', 'Indonesia', 'Vietnam', 'Cambodia', 'Laos', 'Thailand', 'Myanmar', 'Malaysia', 'Singapore', 'Brunei'];
      return ['Japan', 'Taiwan', 'North Korea', 'South Korea'];
    }
  },
  {
    id: 'republic_and_prc_china',
    startYear: 1912,
    endYear: 1994,
    priority: 84,
    name: (y) => (y < 1949 ? 'Republic of China' : 'People\'s Republic of China'),
    historicalName: (y) => (y < 1949 ? 'Zhonghua Minguo' : 'Zhonghua Renmin Gongheguo'),
    ruler: (y) =>
      y < 1925
        ? 'Sun Yat-sen / Yuan Shikai'
        : y < 1949
        ? 'Generalissimo Chiang Kai-shek (Nationalist Government)'
        : y <= 1976
        ? 'Chairman Mao Zedong & Premier Zhou Enlai'
        : 'Deng Xiaoping (Reform and Opening-Up) / Jiang Zemin',
    capital: (y) => (y < 1928 ? 'Beijing' : y < 1937 ? 'Nanjing' : y <= 1945 ? 'Chongqing (Wartime Capital)' : y < 1949 ? 'Nanjing' : 'Beijing'),
    populationEstimate: (y) => (y < 1949 ? '450 – 540 Million' : y < 1970 ? '670 Million' : '1.15 Billion'),
    color: (y) => (y < 1949 ? '#d97706' : '#b91c1c'),
    description: 'From the 1911–1912 Xinhai Revolution founding Asia\'s first republic and fighting the eight-year War of Resistance in WWII to the 1949 proclamation of the People\'s Republic of China and post-1978 economic reforms.',
    keyEvents: [
      'Establishment of the Republic of China on January 1, 1912 by Sun Yat-sen',
      'Allied Big Four power during World War II and founding permanent member of the UN Security Council (1945)',
      'Proclamation of the People\'s Republic of China (1949) and Reform and Opening-Up (1978)'
    ],
    countries: (y) => (y >= 1945 && y < 1949 ? ['China', 'Taiwan'] : ['China'])
  },
  {
    id: 'belgian_kingdom_and_congo',
    startYear: 1830,
    endYear: 1994,
    priority: 78,
    name: (y) => (y >= 1885 && y <= 1961 ? 'Kgr. Belgien (Kingdom of Belgium & Belgian Africa)' : 'Kingdom of Belgium'),
    historicalName: 'Royaume de Belgique / Koninkrijk België',
    ruler: (y) => (y < 1865 ? 'King Leopold I' : y < 1909 ? 'King Leopold II' : y < 1934 ? 'King Albert I' : 'King Leopold III / King Baudouin'),
    capital: 'Brussels',
    populationEstimate: '7.4 – 10.0 Million (Metropole)',
    color: '#a37e40',
    description: 'Heavily industrialized constitutional monarchy that achieved independence in 1830 and administered the Belgian Congo until 1960 and Ruanda-Urundi until 1962.',
    keyEvents: [
      'Belgian Revolution of 1830 and Treaty of London (1839) guaranteeing neutrality',
      'First continental European passenger railway (Brussels–Mechelen, 1835)',
      'Independence of the Democratic Republic of the Congo (1960) and Rwanda & Burundi (1962)'
    ],
    countries: (y) => {
      const lands = ['Belgium'];
      if (y >= 1885 && y < 1960) lands.push('Dem. Rep. Congo');
      if (y >= 1919 && y < 1962) lands.push('Rwanda', 'Burundi');
      return lands;
    }
  },
  {
    id: 'yugoslavia_1918_1991',
    startYear: 1918,
    endYear: 1991,
    priority: 82,
    name: (y) => (y < 1945 ? 'Kingdom of Yugoslavia' : 'Socialist Federal Republic of Yugoslavia'),
    historicalName: 'Jugoslavija',
    ruler: (y) => (y < 1934 ? 'King Alexander I' : y < 1945 ? 'King Peter II' : y <= 1980 ? 'President Josip Broz Tito' : 'Collective Presidency of Yugoslavia'),
    capital: 'Belgrade',
    populationEstimate: '15 – 23.5 Million',
    color: '#4f46e5',
    description: 'Federation of South Slavic nations formed after World War I, becoming a founding leader of the Non-Aligned Movement during the Cold War under Marshal Josip Broz Tito.',
    keyEvents: [
      'Creation of the Kingdom of Serbs, Croats and Slovenes in December 1918',
      'Co-founding of the Non-Aligned Movement at the 1961 Belgrade Conference'
    ],
    countries: ['Serbia', 'Croatia', 'Slovenia', 'Bosnia and Herz.', 'Montenegro', 'North Macedonia']
  },
  {
    id: 'czechoslovakia_1918_1992',
    startYear: 1918,
    endYear: 1992,
    priority: 82,
    name: 'Czechoslovakia',
    historicalName: 'Československo',
    ruler: (y) => (y < 1935 ? 'President Tomáš Garrigue Masaryk' : y < 1948 ? 'President Edvard Beneš' : y < 1989 ? 'Alexander Dubček (1968 Prague Spring) / Husák' : 'President Václav Havel (Velvet Revolution)'),
    capital: 'Prague',
    populationEstimate: '13.5 – 15.6 Million',
    color: '#0284c7',
    description: 'Democratic Central European republic founded by Tomáš Masaryk in 1918, transitioning peacefully via the 1989 Velvet Revolution and dividing amicably on January 1, 1993 into Czechia and Slovakia.',
    keyEvents: [
      'Declaration of Czechoslovak Independence in Prague (October 28, 1918)',
      '1968 Prague Spring reform movement and 1989 Velvet Revolution led by Václav Havel',
      'Peaceful Velvet Divorce into the Czech Republic and Slovakia (January 1, 1993)'
    ],
    countries: ['Czechia', 'Slovakia']
  }
];

// ----------------------------------------------------
// CONTINUOUS YEAR-BY-YEAR LOOKUP CACHE & RESOLVER
// ----------------------------------------------------
const PROFILE_CACHE = new Map<string, CountryEraProfile>();

/**
 * Normalizes Natural Earth names (such as "S. Sudan" and "Macedonia") and merges
 * territories that were united prior to their historical independence year so they
 * share the exact same color, ruler, and entityId (dissolving any internal border).
 */
function resolveHistoricalTerritoryName(rawName: string, year: number): string {
  // Normalize Natural Earth 110m abbreviated names
  let name = rawName;
  if (name === 'S. Sudan') name = 'South Sudan';
  if (name === 'Macedonia') name = 'North Macedonia';

  // South Sudan gained independence from Sudan on July 9, 2011; before 2011 it was part of Sudan
  if (name === 'South Sudan' && year < 2011) return 'Sudan';

  // Kosovo declared independence in 2008; prior to 2008 it was part of Serbia / Yugoslavia
  if (name === 'Kosovo' && year < 2008) return 'Serbia';

  // Montenegro was united with Serbia (Yugoslavia / Serbia and Montenegro) from 1918 to 2006
  if (name === 'Montenegro' && year >= 1918 && year < 2006) return 'Serbia';

  // Timor-Leste gained independence in 2002 (Indonesian administration 1975–2001, Portuguese prior)
  if (name === 'Timor-Leste') {
    if (year >= 1975 && year < 2002) return 'Indonesia';
    if (year >= 1520 && year < 1975) return 'Portugal';
  }

  // Eritrea gained independence in 1993 (federated/united with Ethiopia 1952–1992)
  if (name === 'Eritrea' && year >= 1952 && year < 1993) return 'Ethiopia';

  // Namibia gained independence in 1990 (administered by South Africa as South West Africa 1915–1989)
  if (name === 'Namibia' && year >= 1915 && year < 1990) return 'South Africa';

  // Bangladesh was East Pakistan (part of Pakistan) from 1947 to 1971, and part of India prior to 1947
  if (name === 'Bangladesh') {
    if (year >= 1947 && year < 1971) return 'Pakistan';
    if (year < 1947) return 'India';
  }

  // Northern Cyprus before 1974 was united with Cyprus
  if (name === 'N. Cyprus' && year < 1974) return 'Cyprus';

  // Somaliland is internationally recognized as part of Somalia
  if (name === 'Somaliland' && year >= 1960) return 'Somalia';

  // Singapore was a constituent state of Malaysia from September 16, 1963 until August 9, 1965
  if (name === 'Singapore' && year >= 1963 && year < 1965) return 'Malaysia';

  // Panama was part of Gran Colombia and the Republic of Colombia from 1819 until November 1903
  if (name === 'Panama' && year >= 1819 && year < 1903) return 'Colombia';

  // Dominican Republic was united with Haiti (Unification of Hispaniola) from 1822 to 1844
  if (name === 'Dominican Rep.' && year >= 1822 && year < 1844) return 'Haiti';

  // Uruguay (Cisplatina) was under Portuguese/Brazilian administration from 1816 until the 1828 Treaty of Montevideo
  if (name === 'Uruguay' && year >= 1816 && year < 1828) return 'Brazil';

  // Iceland was under the Norwegian / Danish Crown (Kalmar Union & Kingdom of Denmark) from 1262 until 1944
  if (name === 'Iceland' && year >= 1262 && year < 1944) return 'Denmark';

  // Finland was an integral part of the Kingdom of Sweden from c. 1249 until the 1809 Treaty of Fredrikshamn
  if (name === 'Finland' && year >= 1249 && year < 1809) return 'Sweden';

  // Slovakia (Upper Hungary) was part of the Kingdom of Hungary prior to the Austrian Empire (1804)
  if (name === 'Slovakia' && year >= 1000 && year < 1804) return 'Hungary';

  // North Macedonia (Vardar Macedonia) was part of the Kingdom of Serbia from 1913 to 1918
  if (name === 'North Macedonia' && year >= 1913 && year < 1918) return 'Serbia';

  return name;
}

export function getCountryEraData(countryName: string, rawYear: number): CountryEraProfile {
  const year = Math.round(rawYear);
  const lookupCountry = resolveHistoricalTerritoryName(countryName, year);
  const cacheKey = `${lookupCountry}_${year}`;
  if (PROFILE_CACHE.has(cacheKey)) {
    return PROFILE_CACHE.get(cacheKey)!;
  }

  let result: CountryEraProfile | null = null;

  // 1. Dedicated Historical & Modern Constitutional Profile for Greenland (Part of the Kingdom of Denmark)
  if (lookupCountry === 'Greenland') {
    if (year >= 1979) {
      result = {
        entityId: 'greenland_kingdom_of_denmark',
        entityName: 'Greenland (Kingdom of Denmark)',
        historicalName:
          year >= 2009
            ? 'Kalaallit Nunaat — Autonomous Territory of the Kingdom of Denmark'
            : 'Greenland — Home Rule Territory of the Kingdom of Denmark',
        ruler:
          year >= 2024
            ? 'King Frederik X of Denmark / PM of Greenland (Naalakkersuisut)'
            : 'Queen Margrethe II of Denmark / Greenland Home Rule Government',
        capital: 'Nuuk (Sovereign Realm Capital: Copenhagen, Denmark)',
        populationEstimate: '~56,900 (89% Kalaallit Inuit · Part of Kingdom of Denmark)',
        description:
          'Greenland (Kalaallit Nunaat) is not an independent sovereign state, but an autonomous constituent territory within the Kingdom of Denmark (Rigsfællesskabet). Under the 1979 Home Rule Act and 2009 Self-Government Act, Greenland’s elected parliament (Inatsisartut) and executive (Naalakkersuisut) in Nuuk administer domestic policy, education, health, and natural resources, while the Danish Crown and government in Copenhagen retain sovereignty over foreign affairs, defense, currency (Danish krone), constitutional law, and NATO Arctic security.',
        keyEvents: [
          '1380 & 1814: United under the Danish Crown; Treaty of Kiel (1814) confirms Greenland as part of the Kingdom of Denmark',
          '1953: Colonial status abolished under the Danish Constitution; integrated into the Kingdom of Denmark with two seats in the Danish Folketing',
          '1979: Home Rule Act (Hjemmestyre) establishes Greenland’s own parliament (Inatsisartut) and government in Nuuk within the Danish Realm',
          '2009: Self-Government Act (Selvstyre) recognizes the Kalaallit Inuit as a people under international law and expands domestic autonomy within Denmark',
          'Modern Strategic Role: World’s largest island (2.16M km²), hosting NATO/US Pituffik Space Base (Thule) and critical Arctic rare-earth mineral deposits'
        ],
        color: getModernCountryColor('Greenland', 'Greenland'),
        isOpenSpace: false
      };
    } else if (year >= 1721) {
      result = {
        entityId: 'greenland_danish_realm',
        entityName:
          year >= 1953
            ? 'Greenland (County of the Kingdom of Denmark)'
            : 'Greenland (Colony of the Kingdom of Denmark)',
        historicalName:
          year < 1814 ? 'Dano-Norwegian Greenland' : 'Danish Greenland (Grønland)',
        ruler:
          year >= 1972
            ? 'Queen Margrethe II of Denmark'
            : year >= 1947
            ? 'King Frederick IX of Denmark'
            : year >= 1912
            ? 'King Christian X of Denmark'
            : 'Monarch of the Kingdom of Denmark (Copenhagen)',
        capital: 'Nuuk / Godthåb (Sovereign Capital: Copenhagen, Denmark)',
        populationEstimate: year >= 1950 ? '~23,000–49,000' : '~10,000–18,000',
        description:
          year >= 1953
            ? 'Under the 1953 Constitution of the Kingdom of Denmark, Greenland’s colonial status ended and the island became an integral constituent county (Amt) of the Kingdom of Denmark, represented directly in the Danish Parliament (Folketing) in Copenhagen.'
            : 'Following Dano-Norwegian missionary Hans Egede’s 1721 settlement at Godthåb (Nuuk) and the 1814 Treaty of Kiel, Greenland was governed as a territory and trade monopoly of the Kingdom of Denmark.',
        keyEvents: [
          '1721: Hans Egede establishes Godthåb (modern Nuuk) under the Dano-Norwegian Crown',
          '1814: Treaty of Kiel dissolves Denmark-Norway; Greenland remains a territory of the Kingdom of Denmark',
          '1933: Permanent Court of International Justice confirms Danish sovereignty over all of Greenland',
          '1941–1953: WWII US-Danish defense agreement establishes Thule Air Base; 1953 Danish Constitution integrates Greenland as a county of Denmark'
        ],
        color: '#92c5de',
        isOpenSpace: false
      };
    } else if (year >= 982) {
      result = {
        entityId: 'greenland_norse_inuit',
        entityName:
          year >= 1380
            ? 'Greenland (Crown of Denmark-Norway & Inuit Lands)'
            : 'Norse Greenland & Thule Inuit Territory',
        historicalName: 'Grœnland / Kalaallit Nunaat',
        ruler:
          year >= 1380
            ? 'Crown of Denmark-Norway & Autonomous Kalaallit Inuit'
            : 'Norse Chieftains (Brattahlíð) & Thule Inuit Communities',
        capital: 'Brattahlíð / Garðar & Inuit Coastal Settlements',
        populationEstimate: '~4,000–10,000',
        description:
          'Settled by Norse colonists led by Erik the Red around 982 CE in southwestern fjords alongside Thule Inuit ancestors of the modern Kalaallit people. In 1261 the Norse settlements pledged allegiance to Norway, which united with the Kingdom of Denmark in 1380 and the Kalmar Union in 1397.',
        keyEvents: [
          '982–985 CE: Erik the Red establishes Norse settlements in southwestern Greenland',
          'c. 1200 CE: Thule Inuit (ancestors of modern Greenlanders) expand across Greenland’s coasts',
          '1261 & 1380 CE: Greenland enters union with Norway and subsequently the Crown of Denmark-Norway'
        ],
        color: '#92c5de',
        isOpenSpace: false
      };
    }
  }

  // 2. Check all historical polities active in `year` that include `lookupCountry`
  let bestRule: HistoricalPolityRule | null = null;
  if (!result) {
    for (const rule of HISTORICAL_POLITIES) {
      if (year >= rule.startYear && year <= rule.endYear) {
        const ruleCountries = typeof rule.countries === 'function' ? rule.countries(year) : rule.countries;
        if (ruleCountries.includes(lookupCountry)) {
          if (!bestRule || rule.priority > bestRule.priority) {
            bestRule = rule;
          }
        }
      }
    }
  }

  if (bestRule) {
    const entityName = typeof bestRule.name === 'function' ? bestRule.name(year) : bestRule.name;
    const historicalName = typeof bestRule.historicalName === 'function' ? bestRule.historicalName(year) : bestRule.historicalName;
    const ruler = typeof bestRule.ruler === 'function' ? bestRule.ruler(year) : bestRule.ruler;
    const capital = typeof bestRule.capital === 'function' ? bestRule.capital(year) : bestRule.capital;
    const pop = typeof bestRule.populationEstimate === 'function' ? bestRule.populationEstimate(year) : bestRule.populationEstimate;
    const ruleColor = typeof bestRule.color === 'function' ? bestRule.color(year) : bestRule.color;

    // In modern era (>= 1995), use the clean pastel political map palette so adjacent countries contrast clearly
    const color = year >= 1995 ? getModernCountryColor(lookupCountry, lookupCountry) : ruleColor;

    result = {
      entityId: `${bestRule.id}_${year >= 1995 ? lookupCountry : bestRule.id}`,
      entityName,
      historicalName,
      ruler,
      capital,
      populationEstimate: pop,
      description: bestRule.description,
      keyEvents: bestRule.keyEvents,
      color,
      isOpenSpace: false
    };
  }

  // 3. If no empire rule matched, check if `lookupCountry` is an independent sovereign nation in `year`
  if (!result) {
    const meta = MODERN_COUNTRY_META[lookupCountry];
    if (meta && year >= meta.independenceYear) {
      const color = getModernCountryColor(lookupCountry, lookupCountry);
      const yearLabel = year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
      const activeCapital = resolveCountryCapitalByYear(lookupCountry, year);
      result = {
        entityId: `sovereign_${lookupCountry}`,
        entityName: lookupCountry,
        historicalName: `${lookupCountry} (${yearLabel})`,
        ruler: year >= 2000 ? meta.modernRuler2026 : `Sovereign Government of ${lookupCountry} (${yearLabel})`,
        capital: activeCapital,
        populationEstimate: estimateModernStatePop(lookupCountry, year),
        description: `${lookupCountry} as an independent sovereign state in ${yearLabel} (sovereign statehood established in ${meta.independenceYear} CE), governed from ${activeCapital}.`,
        keyEvents: [
          `Establishment of sovereign constitutional borders (${meta.independenceYear} CE)`,
          `National governance and diplomatic relations in ${yearLabel}`,
          `Socio-economic and institutional development centered in ${activeCapital}`
        ],
        color,
        isOpenSpace: false
      };
    }
  }

  // 4. Historically Uncolonized Interiors & Divided Sub-Regional Territories
  if (!result) {
    const yearLabel = year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
    const isSubRegionalInterior =
      (lookupCountry === 'Saudi Arabia' && year < 1932) ||
      (lookupCountry === 'United States of America' && year < 1848) ||
      (lookupCountry === 'Canada' && year < 1867) ||
      (lookupCountry === 'Brazil' && year <= 1750) ||
      (lookupCountry === 'Argentina' && year < 1880) ||
      (lookupCountry === 'Algeria' && year <= 1870) ||
      (lookupCountry === 'Libya' && year <= 1911) ||
      (lookupCountry === 'Russia' && year < 1582) ||
      (lookupCountry === 'South Africa' && year <= 1902) ||
      (lookupCountry === 'Australia' && year <= 1828) ||
      (lookupCountry === 'New Zealand' && year < 1840);

    if (isSubRegionalInterior) {
      const interiorTitles: Record<string, { name: string; ruler: string; desc: string }> = {
        'Saudi Arabia': {
          name: 'Autonomous Arabian Interior (Najd & Bedouin Tribes)',
          ruler: 'Independent Bedouin Confederations & Najd Oasis Emirs',
          desc: `In ${yearLabel}, the vast interior of the Arabian Peninsula (Najd, Rub' al Khali, and Al-udhn) remained free, uncolonized indigenous Arab territory outside Ottoman or foreign imperial rule.`
        },
        'United States of America': {
          name: 'Indigenous North American Nations (Great Plains & Interior)',
          ruler: 'Lakota, Comanche, Haudenosaunee, Cherokee, Pueblo & Sovereign Nations',
          desc: `In ${yearLabel}, the North American interior remained sovereign Indigenous territory, while coastal and riverine zones were contested among British, French, and Spanish colonial claims.`
        },
        'Canada': {
          name: 'Indigenous First Nations & Inuit Territories',
          ruler: 'Cree, Blackfoot, Haudenosaunee, Anishinaabe, Dene & Inuit Nations',
          desc: `In ${yearLabel}, the northern and western expanse of Canada remained sovereign Indigenous territory outside European colonial settlement.`
        },
        'Brazil': {
          name: 'Uncolonized Indigenous Amazonia',
          ruler: 'Autonomous Amazonian & Tupi-Guarani Peoples',
          desc: `In ${yearLabel}, while Portugal colonized the Atlantic coast east of the Tordesillas line, the vast Amazon Basin remained uncolonized Indigenous territory.`
        },
        'Argentina': {
          name: 'Autonomous Mapuche & Tehuelche Patagonia (Wallmapu)',
          ruler: 'Mapuche Lonkos & Tehuelche Caciques',
          desc: `In ${yearLabel}, Patagonia and the southern Pampas south of the Río Salado/Negro frontier remained independent Indigenous territory.`
        },
        'Algeria': {
          name: 'Free Saharan Berber & Tuareg Interior',
          ruler: "Kel Ahaggar Tuareg & M'zab Confederations",
          desc: `In ${yearLabel}, imperial control (Roman/Ottoman/early French) was restricted to the Mediterranean Tell Atlas coast, while the Saharan interior remained free Berber and Tuareg land.`
        },
        'Libya': {
          name: 'Free Saharan & Fezzan Interior',
          ruler: 'Garamantes / Toubou / Senussi & Tuareg Oasis Confederations',
          desc: `In ${yearLabel}, only coastal Tripolitania and Cyrenaica were under Mediterranean imperial rule, while the Fezzan and Libyan Desert remained autonomous.`
        },
        'Russia': {
          name: 'Indigenous Siberian & Steppe Peoples',
          ruler: 'Yakut, Evenk, Buryat, Nenets & Siberian Khanates',
          desc: `In ${yearLabel}, East Slavic rule (Kievan Rus' / Muscovy) lay west of the Ural Mountains, while Siberia was inhabited by autonomous indigenous peoples and steppe khanates.`
        },
        'South Africa': {
          name: 'Autonomous Khoisan, Xhosa, Sotho & Zulu Interior',
          ruler: 'Indigenous Southern African Kingdoms & Chieftaincies',
          desc: `In ${yearLabel}, European colonial control was confined to the southwestern Cape, while the interior Highveld and eastern coast were ruled by sovereign African kingdoms.`
        },
        'Australia': {
          name: 'Sovereign Aboriginal Australian Lands',
          ruler: 'Over 250 Indigenous Aboriginal Nations & Clans',
          desc: `In ${yearLabel}, the Australian continent was home to over 250 autonomous Aboriginal nations practicing ancient land stewardship.`
        }
      };

      const info = interiorTitles[lookupCountry] || {
        name: 'Uncolonized Indigenous Territory',
        ruler: 'Autonomous Indigenous Peoples',
        desc: `In ${yearLabel}, this interior territory remained outside centralized imperial borders.`
      };

      result = {
        entityId: `open_space_interior_${lookupCountry}_${Math.floor(year / 50)}`,
        entityName: info.name,
        historicalName: info.name,
        ruler: info.ruler,
        capital: 'None (Decentralized)',
        populationEstimate: 'Indigenous populations',
        description: info.desc,
        keyEvents: ['Autonomous indigenous governance, trade networks, and ancestral territory'],
        color: '#d8ccb8',
        isOpenSpace: true
      };
    }
  }

  // 5. Authentic Early Modern & 19th Century Kingdoms (1500 to 1959)
  if (!result && year >= 1500) {
    const earlyModernKingdoms = [
      'Morocco', 'Tunisia', 'Ethiopia', 'Madagascar', 'Cambodia', 'Laos', 'Vietnam',
      'Myanmar', 'Thailand', 'Sri Lanka', 'Nepal', 'Bhutan', 'Afghanistan', 'Oman',
      'Yemen', 'Georgia', 'Armenia', 'Azerbaijan', 'Hungary', 'Poland', 'Lithuania',
      'Switzerland', 'Sweden', 'Denmark', 'Norway', 'Portugal', 'Spain', 'France',
      'United Kingdom', 'Ireland', 'Netherlands', 'Belgium', 'Luxembourg', 'Italy',
      'Germany', 'Austria', 'Czechia', 'Serbia', 'Croatia', 'Romania', 'Bulgaria',
      'Greece', 'Japan', 'South Korea', 'North Korea', 'China', 'India', 'Iran',
      'Iraq', 'Syria', 'Egypt', 'Turkey', 'Russia', 'Ukraine', 'Uzbekistan',
      'Indonesia', 'Malaysia', 'Singapore', 'Brunei', 'Kazakhstan', 'Turkmenistan',
      'Tajikistan', 'Kyrgyzstan', 'Mongolia', 'Rwanda', 'Burundi',
      'Maldives', 'Bahrain', 'Malta', 'Comoros', 'Samoa', 'Tonga', 'Micronesia',
      'Palau', 'Andorra', 'Monaco', 'Liechtenstein', 'San Marino', 'Vatican',
      'Saint Lucia', 'Grenada', 'Dominica', 'St. Vin. and Gren.', 'Mauritius', 'Seychelles'
    ];

    if (earlyModernKingdoms.includes(lookupCountry)) {
      const color = getModernCountryColor(lookupCountry, lookupCountry);
      const activeCapital = resolveCountryCapitalByYear(lookupCountry, year);
      result = {
        entityId: `regional_polity_${lookupCountry}_${Math.floor(year / 25)}`,
        entityName: `${lookupCountry} (Historical Polity)`,
        historicalName: `${lookupCountry} (${year} CE)`,
        ruler: `Regional Monarch / Traditional Administration (${year} CE)`,
        capital: activeCapital,
        populationEstimate: estimateModernStatePop(lookupCountry, year),
        description: `Historical kingdom and regional administration of ${lookupCountry} during the year ${year} CE, governed from ${activeCapital}.`,
        keyEvents: [`Regional sovereignty, trade, and diplomacy in ${year} CE`],
        color,
        isOpenSpace: false
      };
    }
  }

  // 6. Medieval European & Asian Kingdoms (500 CE to 1499 CE)
  if (!result && year >= 500 && year < 1500) {
    const medievalPolities = [
      'Ireland', 'Portugal', 'Spain', 'Poland', 'Hungary', 'Croatia', 'Serbia', 'Bulgaria',
      'Romania', 'Georgia', 'Armenia', 'Thailand', 'Myanmar', 'Vietnam', 'Sri Lanka', 'Nepal',
      'Indonesia', 'Malaysia', 'Singapore', 'Brunei', 'Cambodia', 'Laos', 'Italy', 'France',
      'Germany', 'United Kingdom', 'Denmark', 'Norway', 'Sweden', 'Morocco', 'Tunisia',
      'Egypt', 'Syria', 'Jordan', 'Lebanon', 'Israel', 'Palestine', 'Iraq', 'Kuwait',
      'Iran', 'Turkey', 'Greece', 'Albania', 'North Macedonia', 'Cyprus', 'Yemen', 'Oman',
      'United Arab Emirates', 'Azerbaijan', 'Uzbekistan', 'Turkmenistan', 'Tajikistan',
      'Kyrgyzstan', 'Kazakhstan', 'Afghanistan', 'Pakistan', 'India', 'Bangladesh',
      'China', 'Mongolia', 'Japan', 'North Korea', 'South Korea', 'Ukraine', 'Belarus', 'Lithuania',
      'Maldives', 'Bahrain', 'Malta', 'Comoros', 'Samoa', 'Tonga', 'Andorra', 'Monaco',
      'Liechtenstein', 'San Marino', 'Vatican'
    ];
    if (medievalPolities.includes(lookupCountry)) {
      const color = getModernCountryColor(lookupCountry, lookupCountry);
      const activeCapital = resolveCountryCapitalByYear(lookupCountry, year);
      result = {
        entityId: `medieval_${lookupCountry}`,
        entityName: `Medieval Kingdom of ${lookupCountry}`,
        historicalName: `${lookupCountry} (${year} CE)`,
        ruler: `Medieval Monarch / Dynasty (${year} CE)`,
        capital: activeCapital,
        populationEstimate: `Historical Population (${year} CE)`,
        description: `Medieval kingdom and cultural realm in the territory of ${lookupCountry} during the year ${year} CE, governed from ${activeCapital}.`,
        keyEvents: [`Feudal statecraft, religious architecture, and regional trade in ${year} CE`],
        color,
        isOpenSpace: false
      };
    }
  }

  // 7. Antarctica & Modern Sovereign Nations fallback (Restores Antarctica to its original non-indigenous appearance)
  if (!result && lookupCountry === 'Antarctica') {
    const color = getModernCountryColor('Antarctica', 'Antarctica');
    const yearLabel = year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
    result = {
      entityId: 'modern_Antarctica',
      entityName: 'Antarctica',
      historicalName: `Antarctica (${yearLabel})`,
      ruler:
        year >= 1959
          ? 'Antarctic Treaty System (International Scientific Preserve)'
          : 'Uninhabited Polar Continent',
      capital: 'None',
      populationEstimate:
        year >= 1959 ? '1,000 – 5,000 (Research Stations)' : 'Uninhabited',
      description: `Southern polar continent of Antarctica in ${yearLabel}.`,
      keyEvents: [
        year >= 1959
          ? 'Protected as an international scientific preserve under the Antarctic Treaty (1959)'
          : 'Uninhabited southern polar continent and ice sheet'
      ],
      color,
      isOpenSpace: false
    };
  }

  if (!result && year >= 1995) {
    const color = getModernCountryColor(lookupCountry, lookupCountry);
    result = {
      entityId: `modern_${lookupCountry}`,
      entityName: lookupCountry,
      historicalName: `${lookupCountry} (${year} CE)`,
      ruler: `Government of ${lookupCountry}`,
      capital: MODERN_COUNTRY_META[lookupCountry]?.capital || 'None',
      populationEstimate: 'Modern Population',
      description: `Sovereign state of ${lookupCountry} in ${year} CE.`,
      keyEvents: [`Modern nation-state governance in ${year} CE`],
      color,
      isOpenSpace: false
    };
  }

  // 8. All remaining lands in Antiquity & Early History -> OPEN SPACE WILDERNESS (No artificial modern borders!)
  if (!result) {
    const yearLabel = year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
    result = {
      entityId: `open_space_${year}`,
      entityName: 'Uncolonized / Indigenous Territory',
      historicalName: `Borderless Pre-State Territory (${yearLabel})`,
      ruler: 'Autonomous Indigenous Tribes & Nomadic Bands',
      capital: 'None',
      populationEstimate: 'Nomadic & tribal inhabitants',
      description: `In ${yearLabel}, this territory had no centralized imperial borders or formal state apparatus, remaining open natural land inhabited by autonomous indigenous peoples.`,
      keyEvents: [
        'Absence of centralized state borders or imperial bureaucracy',
        'Autonomous indigenous hunter-gatherer, pastoral, and early agrarian communities'
      ],
      color: '#d8ccb8',
      isOpenSpace: true
    };
  }

  if (PROFILE_CACHE.size > 40000) {
    PROFILE_CACHE.clear();
  }
  PROFILE_CACHE.set(cacheKey, result);
  return result;
}

// ----------------------------------------------------
// DYNAMIC YEAR-BY-YEAR MESH GENERATION
// Computes the exact border mesh for ANY chosen integer year (-3000 to 2026)
// Dissolves internal empire borders & hides artificial modern borders
// ----------------------------------------------------
const MESH_CACHE = new Map<number, string>();

export function getEraBordersMesh(rawYear: number): string {
  const year = Math.round(rawYear);
  if (MESH_CACHE.has(year)) {
    return MESH_CACHE.get(year)!;
  }

  // From 2011 onwards, all modern international borders are active
  if (year >= 2011) {
    const modernMesh = topojson.mesh(atlas, atlas.objects.countries, (a: any, b: any) => a !== b);
    const path = generateCleanMeshPath(modernMesh);
    MESH_CACHE.set(year, path);
    return path;
  }

  // For any historical year (-3000 to 2010):
  // 1. Dissolve artificial modern straight-line borders that did not exist in `year`
  // 2. If both adjacent countries are OPEN SPACE -> NO BORDER
  // 3. If both adjacent countries belong to the SAME empire/polity in `year` -> NO BORDER!
  const eraMesh = topojson.mesh(atlas, atlas.objects.countries, (a: any, b: any) => {
    if (a === b) return false;
    const nameA = a.properties?.name || '';
    const nameB = b.properties?.name || '';

    const pair = [nameA, nameB].sort().join('|');

    // Dissolve modern US-Canada 49th parallel & Alaska border before Oregon Treaty (1846) / 1867
    if (pair === 'Canada|United States of America' && year < 1846) {
      return false;
    }
    // Dissolve modern US-Mexico Rio Grande/Gadsden border before Treaty of Guadalupe Hidalgo (1848)
    if (pair === 'Mexico|United States of America' && year < 1848) {
      return false;
    }
    // Dissolve modern straight-line Arabian desert borders before 1922 (Uqair Protocol)
    if ((nameA === 'Saudi Arabia' || nameB === 'Saudi Arabia') && year < 1922) {
      return false;
    }
    // Dissolve modern Saharan straight-line borders before Scramble for Africa (1885)
    if (
      (nameA === 'Algeria' || nameB === 'Algeria' || nameA === 'Libya' || nameB === 'Libya') &&
      year < 1885
    ) {
      return false;
    }
    // Dissolve modern Patagonian border between Argentina and Chile before 1881 Boundary Treaty
    if (pair === 'Argentina|Chile' && year < 1881) {
      return false;
    }

    const profA = getCountryEraData(nameA, year);
    const profB = getCountryEraData(nameB, year);

    if (profA.isOpenSpace && profB.isOpenSpace) {
      return false;
    }

    if (profA.entityId === profB.entityId) {
      return false;
    }

    return true;
  });

  const path = generateCleanMeshPath(eraMesh);
  if (MESH_CACHE.size > 600) {
    const firstKey = MESH_CACHE.keys().next().value;
    if (firstKey !== undefined) MESH_CACHE.delete(firstKey);
  }
  MESH_CACHE.set(year, path);
  return path;
}
