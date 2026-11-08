import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  AlertTriangle,
  MapPin,
  Globe,
  ShieldAlert,
  Compass,
  Layers,
  Mountain,
  Route,
  Landmark,
  ChevronDown,
  ChevronUp,
  Waves,
  X,
  Eye,
  Palette,
  Crosshair,
  Navigation,
  Tag
} from 'lucide-react';
import { ConflictZone, getConflictsForEra } from '../data/conflictZones';
import { WORLD_COUNTRIES, GeoCountry, projectCoordinates } from '../data/geoService';
import { getCountryEraData, getEraBordersMesh, WORLD_COASTLINES_PATH } from '../data/historicalAtlasEngine';
import {
  getSubRegionsForCountry,
  SUB_REGION_CLIPPED_COUNTRIES,
  HistoricalSubRegionResolved
} from '../data/historicalSubRegions';
import { GeopoliticalEra } from '../data/historicalErasGeo';
import { MapRegion } from '../data/worldMapData';
import { HistoricalSearchItem } from '../data/historicalSearchIndex';
import { getCredibleIndigenousOrAntarcticRecord } from '../data/yearlyChronicleEngine';
import {
  getCountryPhysicalProfile,
  MOUNTAIN_RANGES,
  MAJOR_RIVERS,
  PHYSIOGRAPHIC_REGIONS,
  OCEANIC_FEATURES,
  NATURAL_BIOME_POLYGONS,
  PHYSICAL_BIOME_LEGEND_ITEMS,
  getTradeRoutesForYear,
  CULTURAL_HUBS,
  TradeRouteFeature,
  CulturalHubFeature,
  MountainRangeFeature,
  RiverSystemFeature,
  PhysiographicFeature,
  OceanicFeature,
  SelectedPhysicalFeature,
  SelectedTradeFeature
} from '../data/mapLayersData';
import {
  ArchaeologicalSite,
  getArchaeologicalSitesForEra
} from '../data/archaeologicalSitesData';

interface WorldMapProps {
  currentEra: GeopoliticalEra;
  currentYear: number;
  onSelectRegion: (region: MapRegion) => void;
  onSelectConflict: (conflict: ConflictZone) => void;
  onSelectArchSite?: (site: ArchaeologicalSite) => void;
  onSelectPhysicalFeature?: (feature: SelectedPhysicalFeature) => void;
  onSelectTradeFeature?: (feature: SelectedTradeFeature) => void;
  onClearRegionSelection?: () => void;
  selectedRegionId?: string;
  selectedConflictId?: string;
  selectedArchSiteId?: string;
  selectedPhysicalFeatureId?: string;
  selectedTradeFeatureId?: string;
  focusedSearchTarget?: HistoricalSearchItem | null;
  onClearSearchTarget?: () => void;
}

// 5 continuous world cycles so panning west/east wraps seamlessly around the globe
const WORLD_OFFSETS = [-2, -1, 0, 1, 2];

// Major countries whose centroids serve as primary label/capital anchors for empires/states
const MAJOR_LABEL_ANCHOR_COUNTRIES = new Set([
  'United States of America',
  'Canada',
  'Mexico',
  'Brazil',
  'Argentina',
  'Peru',
  'Colombia',
  'United Kingdom',
  'France',
  'Spain',
  'Germany',
  'Italy',
  'Poland',
  'Ukraine',
  'Russia',
  'Sweden',
  'Turkey',
  'Egypt',
  'Algeria',
  'Morocco',
  'Nigeria',
  'Ethiopia',
  'South Africa',
  'Dem. Rep. Congo',
  'Sudan',
  'Saudi Arabia',
  'Iran',
  'Iraq',
  'Kazakhstan',
  'India',
  'Pakistan',
  'China',
  'Mongolia',
  'Japan',
  'South Korea',
  'Indonesia',
  'Thailand',
  'Vietnam',
  'Australia',
  'Greece'
]);

// Custom label centroid overrides for countries whose overseas islands/territories shift d3.centroid
const COUNTRY_LABEL_CENTROID_OVERRIDES: Record<string, [number, number]> = {
  'United States of America': projectCoordinates(-98.58, 39.83),
  Canada: projectCoordinates(-102.0, 58.0),
  Russia: projectCoordinates(90.0, 61.5),
  France: projectCoordinates(2.4, 46.6),
  Norway: projectCoordinates(9.5, 61.5),
  'United Kingdom': projectCoordinates(-1.8, 53.5),
  Denmark: projectCoordinates(9.5, 56.1),
  Netherlands: projectCoordinates(5.3, 52.2),
  Indonesia: projectCoordinates(117.0, -2.5),
  Malaysia: projectCoordinates(102.2, 4.2),
  Japan: projectCoordinates(138.2, 36.5),
  Chile: projectCoordinates(-71.0, -35.0),
  'New Zealand': projectCoordinates(172.5, -41.5),
  Portugal: projectCoordinates(-8.2, 39.6),
  Spain: projectCoordinates(-3.7, 40.2),
  Italy: projectCoordinates(12.6, 42.5),
  Greece: projectCoordinates(21.8, 39.2),
  Romania: projectCoordinates(25.0, 45.9),
  Croatia: projectCoordinates(16.0, 45.2),
  Philippines: projectCoordinates(122.0, 12.2),
  Vietnam: projectCoordinates(108.0, 16.0),
  Thailand: projectCoordinates(101.0, 15.5)
};

// Exact real-world geographic coordinates [longitude, latitude] for the capital of every country in WORLD_COUNTRIES
const COUNTRY_CAPITAL_COORDINATES: Record<string, { name: string; coords: [number, number] }> = {
  Afghanistan: { name: 'Kabul', coords: projectCoordinates(69.17, 34.53) },
  Albania: { name: 'Tirana', coords: projectCoordinates(19.82, 41.33) },
  Algeria: { name: 'Algiers', coords: projectCoordinates(3.06, 36.75) },
  Angola: { name: 'Luanda', coords: projectCoordinates(13.23, -8.84) },
  Argentina: { name: 'Buenos Aires', coords: projectCoordinates(-58.38, -34.60) },
  Armenia: { name: 'Yerevan', coords: projectCoordinates(44.51, 40.18) },
  Australia: { name: 'Canberra', coords: projectCoordinates(149.13, -35.28) },
  Austria: { name: 'Vienna', coords: projectCoordinates(16.37, 48.21) },
  Azerbaijan: { name: 'Baku', coords: projectCoordinates(49.87, 40.41) },
  Bahamas: { name: 'Nassau', coords: projectCoordinates(-77.35, 25.05) },
  Bangladesh: { name: 'Dhaka', coords: projectCoordinates(90.41, 23.81) },
  Belarus: { name: 'Minsk', coords: projectCoordinates(27.56, 53.90) },
  Belgium: { name: 'Brussels', coords: projectCoordinates(4.35, 50.85) },
  Belize: { name: 'Belmopan', coords: projectCoordinates(-88.77, 17.25) },
  Benin: { name: 'Porto-Novo', coords: projectCoordinates(2.63, 6.50) },
  Bhutan: { name: 'Thimphu', coords: projectCoordinates(89.64, 27.47) },
  Bolivia: { name: 'La Paz', coords: projectCoordinates(-68.15, -16.50) },
  'Bosnia and Herz.': { name: 'Sarajevo', coords: projectCoordinates(18.41, 43.86) },
  Botswana: { name: 'Gaborone', coords: projectCoordinates(25.91, -24.63) },
  Brazil: { name: 'Brasília', coords: projectCoordinates(-47.88, -15.79) },
  Brunei: { name: 'Bandar Seri Begawan', coords: projectCoordinates(114.95, 4.89) },
  Bulgaria: { name: 'Sofia', coords: projectCoordinates(23.32, 42.70) },
  'Burkina Faso': { name: 'Ouagadougou', coords: projectCoordinates(-1.52, 12.37) },
  Burundi: { name: 'Gitega', coords: projectCoordinates(29.93, -3.43) },
  Cambodia: { name: 'Phnom Penh', coords: projectCoordinates(104.92, 11.56) },
  Cameroon: { name: 'Yaoundé', coords: projectCoordinates(11.52, 3.85) },
  Canada: { name: 'Ottawa', coords: projectCoordinates(-75.70, 45.42) },
  'Central African Rep.': { name: 'Bangui', coords: projectCoordinates(18.56, 4.39) },
  Chad: { name: "N'Djamena", coords: projectCoordinates(15.05, 12.13) },
  Chile: { name: 'Santiago', coords: projectCoordinates(-70.67, -33.45) },
  China: { name: 'Beijing', coords: projectCoordinates(116.41, 39.90) },
  Colombia: { name: 'Bogotá', coords: projectCoordinates(-74.07, 4.71) },
  Congo: { name: 'Brazzaville', coords: projectCoordinates(15.28, -4.27) },
  'Costa Rica': { name: 'San José', coords: projectCoordinates(-84.09, 9.93) },
  Croatia: { name: 'Zagreb', coords: projectCoordinates(15.98, 45.81) },
  Cuba: { name: 'Havana', coords: projectCoordinates(-82.37, 23.11) },
  Cyprus: { name: 'Nicosia', coords: projectCoordinates(33.38, 35.19) },
  Czechia: { name: 'Prague', coords: projectCoordinates(14.44, 50.08) },
  "Côte d'Ivoire": { name: 'Yamoussoukro', coords: projectCoordinates(-5.28, 6.82) },
  'Dem. Rep. Congo': { name: 'Kinshasa', coords: projectCoordinates(15.32, -4.32) },
  Denmark: { name: 'Copenhagen', coords: projectCoordinates(12.57, 55.68) },
  Djibouti: { name: 'Djibouti', coords: projectCoordinates(43.15, 11.59) },
  'Dominican Rep.': { name: 'Santo Domingo', coords: projectCoordinates(-69.93, 18.49) },
  Ecuador: { name: 'Quito', coords: projectCoordinates(-78.47, -0.18) },
  Egypt: { name: 'Cairo', coords: projectCoordinates(31.24, 30.04) },
  'El Salvador': { name: 'San Salvador', coords: projectCoordinates(-89.22, 13.69) },
  'Eq. Guinea': { name: 'Malabo', coords: projectCoordinates(10.27, 1.60) },
  Eritrea: { name: 'Asmara', coords: projectCoordinates(38.93, 15.32) },
  Estonia: { name: 'Tallinn', coords: projectCoordinates(24.75, 59.44) },
  Ethiopia: { name: 'Addis Ababa', coords: projectCoordinates(38.76, 9.03) },
  'Falkland Is.': { name: 'Stanley', coords: projectCoordinates(-57.85, -51.70) },
  Fiji: { name: 'Suva', coords: projectCoordinates(178.44, -18.14) },
  Finland: { name: 'Helsinki', coords: projectCoordinates(24.94, 60.17) },
  'Fr. S. Antarctic Lands': { name: 'Port-aux-Français', coords: projectCoordinates(70.22, -49.35) },
  France: { name: 'Paris', coords: projectCoordinates(2.35, 48.86) },
  Gabon: { name: 'Libreville', coords: projectCoordinates(9.45, 0.42) },
  Gambia: { name: 'Banjul', coords: projectCoordinates(-16.58, 13.45) },
  Georgia: { name: 'Tbilisi', coords: projectCoordinates(44.79, 41.72) },
  Germany: { name: 'Berlin', coords: projectCoordinates(13.41, 52.52) },
  Ghana: { name: 'Accra', coords: projectCoordinates(-0.19, 5.60) },
  Greece: { name: 'Athens', coords: projectCoordinates(23.73, 37.98) },
  Greenland: { name: 'Nuuk', coords: projectCoordinates(-51.72, 64.18) },
  Guatemala: { name: 'Guatemala City', coords: projectCoordinates(-90.51, 14.63) },
  Guinea: { name: 'Conakry', coords: projectCoordinates(-13.58, 9.64) },
  'Guinea-Bissau': { name: 'Bissau', coords: projectCoordinates(-15.60, 11.86) },
  Guyana: { name: 'Georgetown', coords: projectCoordinates(-58.16, 6.80) },
  Haiti: { name: 'Port-au-Prince', coords: projectCoordinates(-72.31, 18.59) },
  Honduras: { name: 'Tegucigalpa', coords: projectCoordinates(-87.21, 14.07) },
  Hungary: { name: 'Budapest', coords: projectCoordinates(19.04, 47.50) },
  Iceland: { name: 'Reykjavík', coords: projectCoordinates(-21.94, 64.15) },
  India: { name: 'New Delhi', coords: projectCoordinates(77.21, 28.61) },
  Indonesia: { name: 'Jakarta', coords: projectCoordinates(106.85, -6.21) },
  Iran: { name: 'Tehran', coords: projectCoordinates(51.39, 35.69) },
  Iraq: { name: 'Baghdad', coords: projectCoordinates(44.37, 33.31) },
  Ireland: { name: 'Dublin', coords: projectCoordinates(-6.26, 53.35) },
  Israel: { name: 'Jerusalem', coords: projectCoordinates(35.21, 31.77) },
  Italy: { name: 'Rome', coords: projectCoordinates(12.50, 41.90) },
  Jamaica: { name: 'Kingston', coords: projectCoordinates(-76.79, 18.01) },
  Japan: { name: 'Tokyo', coords: projectCoordinates(139.69, 35.69) },
  Jordan: { name: 'Amman', coords: projectCoordinates(35.93, 31.95) },
  Kazakhstan: { name: 'Astana', coords: projectCoordinates(71.47, 51.16) },
  Kenya: { name: 'Nairobi', coords: projectCoordinates(36.82, -1.29) },
  Kosovo: { name: 'Pristina', coords: projectCoordinates(21.17, 42.66) },
  Kuwait: { name: 'Kuwait City', coords: projectCoordinates(47.98, 29.38) },
  Kyrgyzstan: { name: 'Bishkek', coords: projectCoordinates(74.59, 42.87) },
  Laos: { name: 'Vientiane', coords: projectCoordinates(102.63, 17.98) },
  Latvia: { name: 'Riga', coords: projectCoordinates(24.11, 56.95) },
  Lebanon: { name: 'Beirut', coords: projectCoordinates(35.50, 33.89) },
  Lesotho: { name: 'Maseru', coords: projectCoordinates(27.48, -29.32) },
  Liberia: { name: 'Monrovia', coords: projectCoordinates(-10.80, 6.30) },
  Libya: { name: 'Tripoli', coords: projectCoordinates(13.19, 32.89) },
  Lithuania: { name: 'Vilnius', coords: projectCoordinates(25.28, 54.69) },
  Luxembourg: { name: 'Luxembourg', coords: projectCoordinates(6.13, 49.61) },
  Macedonia: { name: 'Skopje', coords: projectCoordinates(21.43, 42.00) },
  Madagascar: { name: 'Antananarivo', coords: projectCoordinates(47.51, -18.88) },
  Malawi: { name: 'Lilongwe', coords: projectCoordinates(33.77, -13.96) },
  Malaysia: { name: 'Kuala Lumpur', coords: projectCoordinates(101.69, 3.14) },
  Mali: { name: 'Bamako', coords: projectCoordinates(-8.00, 12.64) },
  Mauritania: { name: 'Nouakchott', coords: projectCoordinates(-15.96, 18.07) },
  Mexico: { name: 'Mexico City', coords: projectCoordinates(-99.13, 19.43) },
  Moldova: { name: 'Chișinău', coords: projectCoordinates(28.86, 47.01) },
  Mongolia: { name: 'Ulaanbaatar', coords: projectCoordinates(106.91, 47.92) },
  Montenegro: { name: 'Podgorica', coords: projectCoordinates(19.26, 42.44) },
  Morocco: { name: 'Rabat', coords: projectCoordinates(-6.85, 34.02) },
  Mozambique: { name: 'Maputo', coords: projectCoordinates(32.57, -25.97) },
  Myanmar: { name: 'Naypyidaw', coords: projectCoordinates(96.07, 19.76) },
  'N. Cyprus': { name: 'North Nicosia', coords: projectCoordinates(33.36, 35.19) },
  Namibia: { name: 'Windhoek', coords: projectCoordinates(17.08, -22.56) },
  Nepal: { name: 'Kathmandu', coords: projectCoordinates(85.32, 27.72) },
  Netherlands: { name: 'Amsterdam', coords: projectCoordinates(4.90, 52.37) },
  'New Caledonia': { name: 'Nouméa', coords: projectCoordinates(166.46, -22.28) },
  'New Zealand': { name: 'Wellington', coords: projectCoordinates(174.78, -41.29) },
  Nicaragua: { name: 'Managua', coords: projectCoordinates(-86.24, 12.11) },
  Niger: { name: 'Niamey', coords: projectCoordinates(2.13, 13.51) },
  Nigeria: { name: 'Abuja', coords: projectCoordinates(7.49, 9.08) },
  'North Korea': { name: 'Pyongyang', coords: projectCoordinates(125.76, 39.02) },
  Norway: { name: 'Oslo', coords: projectCoordinates(10.75, 59.91) },
  Oman: { name: 'Muscat', coords: projectCoordinates(58.38, 23.59) },
  Pakistan: { name: 'Islamabad', coords: projectCoordinates(73.05, 33.68) },
  Palestine: { name: 'Ramallah', coords: projectCoordinates(35.20, 31.90) },
  Panama: { name: 'Panama City', coords: projectCoordinates(-79.52, 8.98) },
  'Papua New Guinea': { name: 'Port Moresby', coords: projectCoordinates(147.18, -9.44) },
  Paraguay: { name: 'Asunción', coords: projectCoordinates(-57.58, -25.26) },
  Peru: { name: 'Lima', coords: projectCoordinates(-77.04, -12.05) },
  Philippines: { name: 'Manila', coords: projectCoordinates(120.98, 14.60) },
  Poland: { name: 'Warsaw', coords: projectCoordinates(21.01, 52.23) },
  Portugal: { name: 'Lisbon', coords: projectCoordinates(-9.14, 38.72) },
  'Puerto Rico': { name: 'San Juan', coords: projectCoordinates(-66.11, 18.47) },
  Qatar: { name: 'Doha', coords: projectCoordinates(51.53, 25.29) },
  Romania: { name: 'Bucharest', coords: projectCoordinates(26.10, 44.43) },
  Russia: { name: 'Moscow', coords: projectCoordinates(37.62, 55.75) },
  Rwanda: { name: 'Kigali', coords: projectCoordinates(30.06, -1.94) },
  'S. Sudan': { name: 'Juba', coords: projectCoordinates(31.58, 4.86) },
  'Saudi Arabia': { name: 'Riyadh', coords: projectCoordinates(46.72, 24.71) },
  Senegal: { name: 'Dakar', coords: projectCoordinates(-17.47, 14.72) },
  Serbia: { name: 'Belgrade', coords: projectCoordinates(20.45, 44.79) },
  'Sierra Leone': { name: 'Freetown', coords: projectCoordinates(-13.23, 8.48) },
  Singapore: { name: 'Singapore', coords: projectCoordinates(103.84, 1.28) },
  Slovakia: { name: 'Bratislava', coords: projectCoordinates(17.11, 48.15) },
  Slovenia: { name: 'Ljubljana', coords: projectCoordinates(14.51, 46.06) },
  'Solomon Is.': { name: 'Honiara', coords: projectCoordinates(159.97, -9.43) },
  Somalia: { name: 'Mogadishu', coords: projectCoordinates(45.32, 2.05) },
  Somaliland: { name: 'Hargeisa', coords: projectCoordinates(44.06, 9.56) },
  'South Africa': { name: 'Pretoria', coords: projectCoordinates(28.19, -25.75) },
  'South Korea': { name: 'Seoul', coords: projectCoordinates(126.98, 37.57) },
  Spain: { name: 'Madrid', coords: projectCoordinates(-3.70, 40.42) },
  'Sri Lanka': { name: 'Colombo', coords: projectCoordinates(79.86, 6.93) },
  Sudan: { name: 'Khartoum', coords: projectCoordinates(32.56, 15.50) },
  Suriname: { name: 'Paramaribo', coords: projectCoordinates(-55.20, 5.85) },
  Sweden: { name: 'Stockholm', coords: projectCoordinates(18.07, 59.33) },
  Switzerland: { name: 'Bern', coords: projectCoordinates(7.45, 46.95) },
  Syria: { name: 'Damascus', coords: projectCoordinates(36.28, 33.51) },
  Taiwan: { name: 'Taipei', coords: projectCoordinates(121.57, 25.03) },
  Tajikistan: { name: 'Dushanbe', coords: projectCoordinates(68.79, 38.56) },
  Tanzania: { name: 'Dodoma', coords: projectCoordinates(35.75, -6.16) },
  Thailand: { name: 'Bangkok', coords: projectCoordinates(100.50, 13.76) },
  'Timor-Leste': { name: 'Dili', coords: projectCoordinates(125.57, -8.56) },
  Togo: { name: 'Lomé', coords: projectCoordinates(1.23, 6.13) },
  'Trinidad and Tobago': { name: 'Port of Spain', coords: projectCoordinates(-61.52, 10.65) },
  Tunisia: { name: 'Tunis', coords: projectCoordinates(10.18, 36.81) },
  Turkey: { name: 'Ankara', coords: projectCoordinates(32.86, 39.93) },
  Turkmenistan: { name: 'Ashgabat', coords: projectCoordinates(58.38, 37.96) },
  Uganda: { name: 'Kampala', coords: projectCoordinates(32.58, 0.35) },
  Ukraine: { name: 'Kyiv', coords: projectCoordinates(30.52, 50.45) },
  'United Arab Emirates': { name: 'Abu Dhabi', coords: projectCoordinates(54.38, 24.45) },
  'United Kingdom': { name: 'London', coords: projectCoordinates(-0.13, 51.51) },
  'United States of America': { name: 'Washington, D.C.', coords: projectCoordinates(-77.04, 38.91) },
  Uruguay: { name: 'Montevideo', coords: projectCoordinates(-56.16, -34.90) },
  Uzbekistan: { name: 'Tashkent', coords: projectCoordinates(69.24, 41.30) },
  Vanuatu: { name: 'Port Vila', coords: projectCoordinates(168.33, -17.73) },
  Venezuela: { name: 'Caracas', coords: projectCoordinates(-66.90, 10.48) },
  Vietnam: { name: 'Hanoi', coords: projectCoordinates(105.83, 21.03) },
  'W. Sahara': { name: 'Laayoune', coords: projectCoordinates(-13.20, 27.15) },
  Yemen: { name: "Sana'a", coords: projectCoordinates(44.20, 15.37) },
  Zambia: { name: 'Lusaka', coords: projectCoordinates(28.28, -15.39) },
  Zimbabwe: { name: 'Harare', coords: projectCoordinates(31.05, -17.83) },
  eSwatini: { name: 'Mbabane', coords: projectCoordinates(31.13, -26.32) },
  Maldives: { name: 'Malé', coords: projectCoordinates(73.51, 4.18) },
  Bahrain: { name: 'Manama', coords: projectCoordinates(50.58, 26.22) },
  Grenada: { name: "St. George's", coords: projectCoordinates(-61.75, 12.05) },
  Barbados: { name: 'Bridgetown', coords: projectCoordinates(-59.62, 13.10) },
  'Saint Lucia': { name: 'Castries', coords: projectCoordinates(-60.99, 14.01) },
  'St. Vin. and Gren.': { name: 'Kingstown', coords: projectCoordinates(-61.22, 13.16) },
  Dominica: { name: 'Roseau', coords: projectCoordinates(-61.39, 15.30) },
  'Antigua and Barb.': { name: "St. John's", coords: projectCoordinates(-61.85, 17.12) },
  'St. Kitts and Nevis': { name: 'Basseterre', coords: projectCoordinates(-62.72, 17.30) },
  Malta: { name: 'Valletta', coords: projectCoordinates(14.51, 35.90) },
  Mauritius: { name: 'Port Louis', coords: projectCoordinates(57.50, -20.16) },
  Seychelles: { name: 'Victoria', coords: projectCoordinates(55.45, -4.62) },
  Comoros: { name: 'Moroni', coords: projectCoordinates(43.26, -11.70) },
  'Cabo Verde': { name: 'Praia', coords: projectCoordinates(-23.51, 14.92) },
  'São Tomé and Príncipe': { name: 'São Tomé', coords: projectCoordinates(6.73, 0.34) },
  Samoa: { name: 'Apia', coords: projectCoordinates(-171.76, -13.83) },
  Tonga: { name: "Nuku'alofa", coords: projectCoordinates(-175.20, -21.14) },
  Kiribati: { name: 'South Tarawa', coords: projectCoordinates(172.98, 1.33) },
  Micronesia: { name: 'Palikir', coords: projectCoordinates(158.16, 6.92) },
  'Marshall Is.': { name: 'Majuro', coords: projectCoordinates(171.38, 7.09) },
  Palau: { name: 'Ngerulmud', coords: projectCoordinates(134.62, 7.50) },
  Tuvalu: { name: 'Funafuti', coords: projectCoordinates(179.19, -8.52) },
  Nauru: { name: 'Yaren', coords: projectCoordinates(166.92, -0.55) },
  Andorra: { name: 'Andorra la Vella', coords: projectCoordinates(1.52, 42.51) },
  Monaco: { name: 'Monaco', coords: projectCoordinates(7.42, 43.73) },
  Liechtenstein: { name: 'Vaduz', coords: projectCoordinates(9.52, 47.14) },
  'San Marino': { name: 'San Marino', coords: projectCoordinates(12.45, 43.94) },
  Vatican: { name: 'Vatican City', coords: projectCoordinates(12.45, 41.90) }
};

const COMPACT_SOVEREIGN_STATES = new Set<string>([
  'Singapore', 'Maldives', 'Bahrain', 'Grenada', 'Barbados', 'Saint Lucia',
  'St. Vin. and Gren.', 'Dominica', 'Antigua and Barb.', 'St. Kitts and Nevis',
  'Malta', 'Mauritius', 'Seychelles', 'Comoros', 'Cabo Verde', 'São Tomé and Príncipe',
  'Samoa', 'Tonga', 'Kiribati', 'Micronesia', 'Marshall Is.', 'Palau', 'Tuvalu', 'Nauru',
  'Andorra', 'Monaco', 'Liechtenstein', 'San Marino', 'Vatican'
]);

// Exact real-world [lon, lat] coordinates for historical & relocated capitals across all eras (3000 BCE – 2026 CE)
const HISTORICAL_CAPITAL_CITY_COORDS: Record<string, [number, number]> = {
  // South Asia
  Karachi: projectCoordinates(67.00, 24.86),
  Islamabad: projectCoordinates(73.05, 33.68),
  'Mohenjo-Daro': projectCoordinates(68.14, 27.32),
  Dholavira: projectCoordinates(70.21, 23.89),
  Hastinapura: projectCoordinates(78.02, 29.16),
  Pataliputra: projectCoordinates(85.14, 25.61),
  'Pataliputra (Patna)': projectCoordinates(85.14, 25.61),
  'Purushapura (Peshawar)': projectCoordinates(71.52, 34.02),
  Kannauj: projectCoordinates(79.92, 27.06),
  Delhi: projectCoordinates(77.23, 28.66),
  Agra: projectCoordinates(78.01, 27.18),
  Pune: projectCoordinates(73.86, 18.52),
  Thanjavur: projectCoordinates(79.13, 10.79),
  'Vijayanagara (Hampi)': projectCoordinates(76.46, 15.34),
  Vijayanagara: projectCoordinates(76.46, 15.34),
  'Calcutta (Kolkata)': projectCoordinates(88.36, 22.57),
  Calcutta: projectCoordinates(88.36, 22.57),
  'New Delhi': projectCoordinates(77.21, 28.61),
  Anuradhapura: projectCoordinates(80.40, 8.31),
  Polonnaruwa: projectCoordinates(81.00, 7.94),
  Kandy: projectCoordinates(80.63, 7.29),
  Colombo: projectCoordinates(79.86, 6.93),
  'Sri Jayawardenepura Kotte': projectCoordinates(79.90, 6.89),
  Punakha: projectCoordinates(89.86, 27.59),
  Thimphu: projectCoordinates(89.64, 27.47),
  Dhaka: projectCoordinates(90.41, 23.81),
  Kathmandu: projectCoordinates(85.32, 27.72),

  // East & Inner Asia
  'Erlitou (Luoyang)': projectCoordinates(112.69, 34.69),
  'Yin (Anyang)': projectCoordinates(114.35, 36.10),
  "Haojing (Xi'an)": projectCoordinates(108.82, 34.23),
  Luoyang: projectCoordinates(112.45, 34.62),
  'Xianyang (Xi\'an)': projectCoordinates(108.71, 34.33),
  Xianyang: projectCoordinates(108.71, 34.33),
  "Chang'an (Xi'an)": projectCoordinates(108.94, 34.26),
  "Chang'an": projectCoordinates(108.94, 34.26),
  'Kaifeng (Bianjing)': projectCoordinates(114.30, 34.80),
  Kaifeng: projectCoordinates(114.30, 34.80),
  "Lin'an (Hangzhou)": projectCoordinates(120.15, 30.27),
  Hangzhou: projectCoordinates(120.15, 30.27),
  'Khanbaliq (Beijing)': projectCoordinates(116.41, 39.90),
  Nanjing: projectCoordinates(118.79, 32.06),
  'Chongqing (Wartime Capital)': projectCoordinates(106.55, 29.56),
  Chongqing: projectCoordinates(106.55, 29.56),
  'Beijing (Peking)': projectCoordinates(116.41, 39.90),
  Beijing: projectCoordinates(116.41, 39.90),
  'Lhasa (Potala Palace)': projectCoordinates(91.10, 29.65),
  Lhasa: projectCoordinates(91.10, 29.65),
  'Longcheng (Orkhon Valley)': projectCoordinates(102.84, 47.46),
  'Ordu-Baliq (Orkhon Valley)': projectCoordinates(102.66, 47.43),
  Karakorum: projectCoordinates(102.85, 47.20),
  Ulaanbaatar: projectCoordinates(106.91, 47.89),
  'Nara (Heijō-kyō)': projectCoordinates(135.80, 34.69),
  Nara: projectCoordinates(135.80, 34.69),
  'Heian-kyō (Kyoto)': projectCoordinates(135.77, 35.01),
  Kyoto: projectCoordinates(135.77, 35.01),
  Kamakura: projectCoordinates(139.55, 35.32),
  'Edo (Tokyo)': projectCoordinates(139.69, 35.69),
  'Tokyo (Edo)': projectCoordinates(139.69, 35.69),
  Tokyo: projectCoordinates(139.69, 35.69),
  Gyeongju: projectCoordinates(129.22, 35.86),
  'Gaegyeong (Kaesong)': projectCoordinates(126.55, 37.97),
  Kaesong: projectCoordinates(126.55, 37.97),
  'Hanseong (Seoul)': projectCoordinates(126.98, 37.57),
  Seoul: projectCoordinates(126.98, 37.57),
  Pyongyang: projectCoordinates(125.76, 39.02),
  Taipei: projectCoordinates(121.56, 25.03),

  // Southeast Asia
  'Angkor (Yasodharapura)': projectCoordinates(103.86, 13.44),
  Angkor: projectCoordinates(103.86, 13.44),
  Oudong: projectCoordinates(104.75, 11.82),
  'Phnom Penh': projectCoordinates(104.92, 11.55),
  'Bagan (Pagan)': projectCoordinates(94.86, 21.17),
  Bagan: projectCoordinates(94.86, 21.17),
  'Inwa (Ava)': projectCoordinates(95.98, 21.85),
  Mandalay: projectCoordinates(96.08, 21.98),
  'Yangon (Rangoon)': projectCoordinates(96.20, 16.84),
  Yangon: projectCoordinates(96.20, 16.84),
  Naypyidaw: projectCoordinates(96.07, 19.76),
  Sukhothai: projectCoordinates(99.70, 17.02),
  Ayutthaya: projectCoordinates(100.57, 14.35),
  'Bangkok (Rattanakosin)': projectCoordinates(100.50, 13.76),
  Bangkok: projectCoordinates(100.50, 13.76),
  'Thăng Long (Hanoi)': projectCoordinates(105.83, 21.03),
  Hanoi: projectCoordinates(105.83, 21.03),
  Huế: projectCoordinates(107.58, 16.46),
  'Luang Prabang': projectCoordinates(102.13, 19.89),
  Vientiane: projectCoordinates(102.63, 17.98),
  Palembang: projectCoordinates(104.76, -2.99),
  Trowulan: projectCoordinates(112.38, -7.55),
  'Batavia (Jakarta)': projectCoordinates(106.85, -6.21),
  Jakarta: projectCoordinates(106.85, -6.21),
  Malacca: projectCoordinates(102.25, 2.19),
  'Kuala Lumpur': projectCoordinates(101.69, 3.14),
  Singapore: projectCoordinates(103.84, 1.28),
  Singapura: projectCoordinates(103.84, 1.28),
  'Bandar Seri Begawan': projectCoordinates(114.95, 4.89),
  'Kota Batu / Brunei Town': projectCoordinates(114.95, 4.89),
  'Kuching (Sarawak) & Sandakan / Jesselton (North Borneo)': projectCoordinates(110.36, 1.55),
  'Kuching & Jesselton (Kota Kinabalu)': projectCoordinates(110.36, 1.55),
  Kuching: projectCoordinates(110.36, 1.55),

  // Middle East, Central Asia & North Africa
  'Memphis (Ineb-Hedj)': projectCoordinates(31.25, 29.85),
  Memphis: projectCoordinates(31.25, 29.85),
  'Thebes (Waset / Luxor)': projectCoordinates(32.64, 25.70),
  Thebes: projectCoordinates(32.64, 25.70),
  Alexandria: projectCoordinates(29.92, 31.20),
  Fustat: projectCoordinates(31.23, 30.00),
  'Cairo (Al-Qahirah)': projectCoordinates(31.24, 30.04),
  Cairo: projectCoordinates(31.24, 30.04),
  Uruk: projectCoordinates(45.64, 31.32),
  Ur: projectCoordinates(46.10, 30.96),
  Babylon: projectCoordinates(44.42, 32.54),
  Nineveh: projectCoordinates(43.15, 36.36),
  Hattusa: projectCoordinates(34.61, 40.02),
  Ecbatana: projectCoordinates(48.52, 34.80),
  Persepolis: projectCoordinates(52.89, 29.93),
  Antioch: projectCoordinates(36.16, 36.20),
  'Ctesiphon (Madain)': projectCoordinates(44.58, 33.09),
  Ctesiphon: projectCoordinates(44.58, 33.09),
  Medina: projectCoordinates(39.61, 24.47),
  Damascus: projectCoordinates(36.28, 33.51),
  Baghdad: projectCoordinates(44.37, 33.31),
  Isfahan: projectCoordinates(51.67, 32.65),
  Tabriz: projectCoordinates(46.29, 38.08),
  Qazvin: projectCoordinates(50.00, 36.27),
  Mashhad: projectCoordinates(59.61, 36.26),
  Shiraz: projectCoordinates(52.53, 29.59),
  Tehran: projectCoordinates(51.39, 35.69),
  Samarkand: projectCoordinates(66.96, 39.65),
  Bukhara: projectCoordinates(64.42, 39.77),
  Almaty: projectCoordinates(76.85, 43.22),
  Astana: projectCoordinates(71.47, 51.16),
  Bursa: projectCoordinates(29.06, 40.18),
  Edirne: projectCoordinates(26.56, 41.68),
  'Constantinople (Istanbul)': projectCoordinates(28.98, 41.01),
  'Constantinople (New Rome)': projectCoordinates(28.98, 41.01),
  Constantinople: projectCoordinates(28.98, 41.01),
  Ankara: projectCoordinates(32.86, 39.93),
  Diriyah: projectCoordinates(46.57, 24.73),
  Riyadh: projectCoordinates(46.72, 24.71),
  Mecca: projectCoordinates(39.83, 21.42),
  Petra: projectCoordinates(35.44, 30.33),
  'Al-Hofuf': projectCoordinates(49.59, 25.38),
  'Carthage (Tunis)': projectCoordinates(10.32, 36.85),
  Carthage: projectCoordinates(10.32, 36.85),
  Marrakesh: projectCoordinates(-7.98, 31.63),
  Tlemcen: projectCoordinates(-1.31, 34.88),
  Algiers: projectCoordinates(3.06, 36.75),
  Tripoli: projectCoordinates(13.19, 32.89),

  // Sub-Saharan Africa
  Meroë: projectCoordinates(33.71, 16.94),
  Aksum: projectCoordinates(38.72, 14.13),
  Lalibela: projectCoordinates(39.04, 12.03),
  Gondar: projectCoordinates(37.47, 12.60),
  'Addis Ababa': projectCoordinates(38.76, 9.03),
  'Koumbi Saleh': projectCoordinates(-7.98, 15.77),
  Timbuktu: projectCoordinates(-3.01, 16.77),
  Gao: projectCoordinates(-0.04, 16.27),
  Lagos: projectCoordinates(3.38, 6.52),
  Abuja: projectCoordinates(7.49, 9.08),
  Abidjan: projectCoordinates(-4.01, 5.36),
  Yamoussoukro: projectCoordinates(-5.28, 6.82),
  'Dar es Salaam': projectCoordinates(39.21, -6.79),
  Dodoma: projectCoordinates(35.75, -6.16),
  Bujumbura: projectCoordinates(29.36, -3.38),
  Gitega: projectCoordinates(29.93, -3.43),
  Zomba: projectCoordinates(35.32, -15.39),
  Lilongwe: projectCoordinates(33.79, -13.96),
  'Cape Town': projectCoordinates(18.42, -33.92),
  Pretoria: projectCoordinates(28.19, -25.75),

  // Europe & Russia
  Knossos: projectCoordinates(25.16, 35.30),
  Mycenae: projectCoordinates(22.76, 37.73),
  Athens: projectCoordinates(23.73, 37.98),
  Pella: projectCoordinates(22.52, 40.76),
  Rome: projectCoordinates(12.50, 41.90),
  Milan: projectCoordinates(9.19, 45.46),
  Ravenna: projectCoordinates(12.20, 44.42),
  Turin: projectCoordinates(7.69, 45.07),
  Florence: projectCoordinates(11.26, 43.77),
  Córdoba: projectCoordinates(-4.78, 37.89),
  Toledo: projectCoordinates(-4.03, 39.86),
  Madrid: projectCoordinates(-3.70, 40.42),
  Lisbon: projectCoordinates(-9.14, 38.72),
  Paris: projectCoordinates(2.35, 48.86),
  Aachen: projectCoordinates(6.08, 50.78),
  Frankfurt: projectCoordinates(8.68, 50.11),
  Bonn: projectCoordinates(7.10, 50.73),
  Berlin: projectCoordinates(13.40, 52.52),
  Vienna: projectCoordinates(16.37, 48.21),
  Prague: projectCoordinates(14.44, 50.08),
  Budapest: projectCoordinates(19.04, 47.50),
  Kraków: projectCoordinates(19.94, 50.06),
  Warsaw: projectCoordinates(21.01, 52.23),
  Kaunas: projectCoordinates(23.90, 54.90),
  Vilnius: projectCoordinates(25.28, 54.69),
  Kyiv: projectCoordinates(30.52, 50.45),
  Moscow: projectCoordinates(37.62, 55.75),
  'Saint Petersburg (Petrograd)': projectCoordinates(30.34, 59.93),
  'Saint Petersburg': projectCoordinates(30.34, 59.93),
  Roskilde: projectCoordinates(12.08, 55.64),
  Copenhagen: projectCoordinates(12.57, 55.68),
  Trondheim: projectCoordinates(10.40, 63.43),
  Bergen: projectCoordinates(5.32, 60.39),
  Oslo: projectCoordinates(10.75, 59.91),
  Turku: projectCoordinates(22.27, 60.45),
  Helsinki: projectCoordinates(24.94, 60.17),
  'Curtea de Argeș': projectCoordinates(24.67, 45.14),
  Târgoviște: projectCoordinates(25.46, 44.93),
  Bucharest: projectCoordinates(26.10, 44.43),
  Kutaisi: projectCoordinates(42.70, 42.27),
  Tbilisi: projectCoordinates(44.79, 41.72),
  Winchester: projectCoordinates(-1.31, 51.06),
  London: projectCoordinates(-0.13, 51.51),
  'The Hague': projectCoordinates(4.30, 52.08),
  Amsterdam: projectCoordinates(4.90, 52.37),
  Brussels: projectCoordinates(4.35, 50.85),
  Belgrade: projectCoordinates(20.46, 44.82),

  // Americas & Oceania
  Teotihuacan: projectCoordinates(-98.84, 19.69),
  'Tenochtitlan (Mexico City)': projectCoordinates(-99.13, 19.43),
  Tenochtitlan: projectCoordinates(-99.13, 19.43),
  'Mexico City': projectCoordinates(-99.13, 19.43),
  Cusco: projectCoordinates(-71.97, -13.53),
  'St. Augustine': projectCoordinates(-81.31, 29.90),
  Philadelphia: projectCoordinates(-75.16, 39.95),
  'New York': projectCoordinates(-74.01, 40.71),
  'Washington, D.C.': projectCoordinates(-77.04, 38.91),
  Richmond: projectCoordinates(-77.44, 37.54),
  'New Orleans': projectCoordinates(-90.07, 29.95),
  'Santa Fe': projectCoordinates(-105.94, 35.69),
  Austin: projectCoordinates(-97.74, 30.27),
  'Oregon City': projectCoordinates(-122.61, 45.36),
  Sitka: projectCoordinates(-135.33, 57.05),
  'Quebec City': projectCoordinates(-71.21, 46.81),
  Montreal: projectCoordinates(-73.57, 45.50),
  Ottawa: projectCoordinates(-75.70, 45.42),
  "St. John's": projectCoordinates(-52.71, 47.56),
  Brattahlíð: projectCoordinates(-45.52, 61.15),
  'Belize City': projectCoordinates(-88.19, 17.50),
  Belmopan: projectCoordinates(-88.77, 17.25),
  Salvador: projectCoordinates(-38.50, -12.97),
  'Rio de Janeiro': projectCoordinates(-43.17, -22.91),
  Brasília: projectCoordinates(-47.88, -15.79),
  'Buenos Aires': projectCoordinates(-58.38, -34.60),
  Bogotá: projectCoordinates(-74.07, 4.71),
  Sucre: projectCoordinates(-65.26, -19.04),
  'La Paz (Sucre)': projectCoordinates(-68.15, -16.50),
  'Sydney (Port Jackson)': projectCoordinates(151.21, -33.87),
  Sydney: projectCoordinates(151.21, -33.87),
  Melbourne: projectCoordinates(144.96, -37.81),
  Canberra: projectCoordinates(149.13, -35.28),
  Auckland: projectCoordinates(174.76, -36.85),
  Wellington: projectCoordinates(174.78, -41.29),
  'San Juan': projectCoordinates(-66.11, 18.47),
  Nuuk: projectCoordinates(-51.72, 64.18),
  'Akhetaten (Amarna)': projectCoordinates(30.90, 27.65),
  Sais: projectCoordinates(30.77, 30.97),
  Akkad: projectCoordinates(44.40, 33.10),
  'Tikal (Petén)': projectCoordinates(-89.62, 17.22),
  'Chichen Itza': projectCoordinates(-88.57, 20.68),
  'Tisza Encampment': projectCoordinates(20.15, 46.25),
  Malé: projectCoordinates(73.51, 4.18),
  Manama: projectCoordinates(50.58, 26.22),
  "St. George's": projectCoordinates(-61.75, 12.05),
  Bridgetown: projectCoordinates(-59.62, 13.10),
  Castries: projectCoordinates(-60.99, 14.01),
  Kingstown: projectCoordinates(-61.22, 13.16),
  Roseau: projectCoordinates(-61.39, 15.30),
  Basseterre: projectCoordinates(-62.72, 17.30),
  Valletta: projectCoordinates(14.51, 35.90),
  Mdina: projectCoordinates(14.40, 35.89),
  'Port Louis': projectCoordinates(57.50, -20.16),
  Victoria: projectCoordinates(55.45, -4.62),
  Moroni: projectCoordinates(43.26, -11.70),
  Praia: projectCoordinates(-23.51, 14.92),
  'Ribeira Grande (Cidade Velha)': projectCoordinates(-23.60, 14.92),
  'São Tomé': projectCoordinates(6.73, 0.34),
  Apia: projectCoordinates(-171.76, -13.83),
  "Nuku'alofa": projectCoordinates(-175.20, -21.14),
  "Nuku'alofa / Apia": projectCoordinates(-175.20, -21.14),
  'South Tarawa': projectCoordinates(172.98, 1.33),
  Palikir: projectCoordinates(158.16, 6.92),
  Majuro: projectCoordinates(171.38, 7.09),
  Ngerulmud: projectCoordinates(134.62, 7.50),
  Koror: projectCoordinates(134.48, 7.34),
  Funafuti: projectCoordinates(179.19, -8.52),
  Yaren: projectCoordinates(166.92, -0.55),
  'Andorra la Vella': projectCoordinates(1.52, 42.51),
  Monaco: projectCoordinates(7.42, 43.73),
  Vaduz: projectCoordinates(9.52, 47.14),
  'San Marino': projectCoordinates(12.45, 43.94),
  'Vatican City': projectCoordinates(12.45, 41.90)
};

function resolveCapitalDisplayAndCoords(
  rawCapital: string,
  countryName: string,
  year: number
): { name: string; coords: [number, number] } | null {
  if (!rawCapital || rawCapital === 'None' || rawCapital === 'None (Decentralized)') return null;

  // Special case for Puerto Rico Commonwealth/Territory in modern era
  if (countryName === 'Puerto Rico' && year >= 1952) {
    return { name: 'San Juan', coords: HISTORICAL_CAPITAL_CITY_COORDS['San Juan'] };
  }
  if (countryName === 'Antigua and Barb.' && rawCapital === "St. John's") {
    return { name: "St. John's", coords: COUNTRY_CAPITAL_COORDINATES['Antigua and Barb.'].coords };
  }
  if (countryName === 'Samoa' && rawCapital === "Nuku'alofa / Apia") {
    return { name: 'Apia', coords: HISTORICAL_CAPITAL_CITY_COORDS['Apia'] };
  }
  if (countryName === 'Tonga' && rawCapital === "Nuku'alofa / Apia") {
    return { name: "Nuku'alofa", coords: HISTORICAL_CAPITAL_CITY_COORDS["Nuku'alofa"] };
  }

  // 1. Direct match in HISTORICAL_CAPITAL_CITY_COORDS
  if (HISTORICAL_CAPITAL_CITY_COORDS[rawCapital]) {
    return { name: rawCapital, coords: HISTORICAL_CAPITAL_CITY_COORDS[rawCapital] };
  }

  // 2. Year-sensitive composite historical capital strings from rules & sub-regions
  switch (rawCapital) {
    case 'Mohenjo-Daro & Harappa':
    case 'Mohenjo-Daro / Harappa / Dholavira':
      return { name: 'Mohenjo-Daro', coords: HISTORICAL_CAPITAL_CITY_COORDS['Mohenjo-Daro'] };
    case 'Dholavira, Lothal & Rakhigarhi':
      return { name: 'Dholavira', coords: HISTORICAL_CAPITAL_CITY_COORDS['Dholavira'] };
    case 'Hastinapura, Indraprastha & Pataliputra':
    case 'Hastinapura / Indraprastha':
      return { name: 'Hastinapura', coords: HISTORICAL_CAPITAL_CITY_COORDS['Hastinapura'] };
    case 'Purushapura (Peshawar), Mathura & Taxila':
    case 'Purushapura (Peshawar) & Mathura':
      return { name: 'Purushapura (Peshawar)', coords: HISTORICAL_CAPITAL_CITY_COORDS['Purushapura (Peshawar)'] };
    case 'Pataliputra (Patna) & Ujjain':
      return { name: 'Pataliputra (Patna)', coords: HISTORICAL_CAPITAL_CITY_COORDS['Pataliputra (Patna)'] };
    case 'Kannauj, Ujjain & Pataliputra':
      return { name: 'Kannauj', coords: HISTORICAL_CAPITAL_CITY_COORDS['Kannauj'] };
    case 'Delhi (Agra & Fatehpur Sikri in 16th c.)':
    case 'Delhi & Vijayanagara (Hampi)':
      return { name: 'Delhi', coords: HISTORICAL_CAPITAL_CITY_COORDS['Delhi'] };
    case 'Agra, Fatehpur Sikri & Shahjahanabad (Delhi)':
    case 'Agra / Fatehpur Sikri / Shahjahanabad (Old Delhi)':
      return year < 1648
        ? { name: 'Agra', coords: HISTORICAL_CAPITAL_CITY_COORDS['Agra'] }
        : { name: 'Delhi', coords: HISTORICAL_CAPITAL_CITY_COORDS['Delhi'] };
    case 'Raigad, Satara & Pune':
      return { name: 'Pune', coords: HISTORICAL_CAPITAL_CITY_COORDS['Pune'] };
    case 'Thanjavur & Gangaikonda Cholapuram':
      return { name: 'Thanjavur', coords: HISTORICAL_CAPITAL_CITY_COORDS['Thanjavur'] };
    case 'Calcutta (Kolkata) & Madras (Chennai)':
      return { name: 'Calcutta (Kolkata)', coords: HISTORICAL_CAPITAL_CITY_COORDS['Calcutta (Kolkata)'] };
    case 'Liangzhu / Erlitou':
      return { name: 'Erlitou (Luoyang)', coords: HISTORICAL_CAPITAL_CITY_COORDS['Erlitou (Luoyang)'] };
    case 'Jiankang (Nanjing) / Luoyang':
      return { name: 'Jiankang (Nanjing)', coords: HISTORICAL_CAPITAL_CITY_COORDS['Nanjing'] };
    case "Chang'an (Xi'an) & Luoyang":
      return year < 25 || (year >= 581 && year < 907)
        ? { name: "Chang'an (Xi'an)", coords: HISTORICAL_CAPITAL_CITY_COORDS["Chang'an (Xi'an)"] }
        : { name: 'Luoyang', coords: HISTORICAL_CAPITAL_CITY_COORDS['Luoyang'] };
    case 'Bianjing (Kaifeng)':
      return { name: 'Kaifeng (Bianjing)', coords: HISTORICAL_CAPITAL_CITY_COORDS['Kaifeng'] };
    case 'Shangjing / Zhongdu (Beijing) & Kaifeng (after 1127)':
      return year < 1214
        ? { name: 'Zhongdu (Beijing)', coords: HISTORICAL_CAPITAL_CITY_COORDS['Beijing'] }
        : { name: 'Kaifeng', coords: HISTORICAL_CAPITAL_CITY_COORDS['Kaifeng'] };
    case 'Khanbaliq (Beijing) & Karakorum':
    case 'Khanbaliq (Beijing) / Sarai / Tabriz':
      return year < 1264
        ? { name: 'Karakorum', coords: HISTORICAL_CAPITAL_CITY_COORDS['Karakorum'] }
        : { name: 'Khanbaliq (Beijing)', coords: HISTORICAL_CAPITAL_CITY_COORDS['Beijing'] };
    case 'Nanjing & Beijing':
      return year < 1421
        ? { name: 'Nanjing', coords: HISTORICAL_CAPITAL_CITY_COORDS['Nanjing'] }
        : { name: 'Beijing', coords: HISTORICAL_CAPITAL_CITY_COORDS['Beijing'] };
    case 'Beijing (Forbidden City)':
      return { name: 'Beijing', coords: HISTORICAL_CAPITAL_CITY_COORDS['Beijing'] };
    case 'Asuka & Nara (Heijō-kyō)':
      return { name: 'Nara (Heijō-kyō)', coords: HISTORICAL_CAPITAL_CITY_COORDS['Nara'] };
    case 'Heian-kyō (Kyoto) & Kamakura':
      return { name: 'Heian-kyō (Kyoto)', coords: HISTORICAL_CAPITAL_CITY_COORDS['Kyoto'] };
    case 'Edo (Tokyo) & Kyoto (Imperial Seat)':
    case 'Edo (Tokyo) & Kyoto':
      return { name: 'Edo (Tokyo)', coords: HISTORICAL_CAPITAL_CITY_COORDS['Tokyo'] };
    case 'Gyeongju, Pyongyang & Gaegyeong (Kaesong)':
      return year < 918
        ? { name: 'Gyeongju', coords: HISTORICAL_CAPITAL_CITY_COORDS['Gyeongju'] }
        : { name: 'Gaegyeong (Kaesong)', coords: HISTORICAL_CAPITAL_CITY_COORDS['Kaesong'] };
    case 'Hanyang (Seoul)':
      return { name: 'Hanseong (Seoul)', coords: HISTORICAL_CAPITAL_CITY_COORDS['Seoul'] };
    case 'Thăng Long (Hanoi) & Huế':
      return year >= 1802 && year <= 1945
        ? { name: 'Huế', coords: HISTORICAL_CAPITAL_CITY_COORDS['Huế'] }
        : { name: 'Thăng Long (Hanoi)', coords: HISTORICAL_CAPITAL_CITY_COORDS['Hanoi'] };
    case 'Palembang & Trowulan (East Java)':
      return year < 1293
        ? { name: 'Palembang', coords: HISTORICAL_CAPITAL_CITY_COORDS['Palembang'] }
        : { name: 'Trowulan', coords: HISTORICAL_CAPITAL_CITY_COORDS['Trowulan'] };
    case 'Memphis, Thebes (Luxor) & Pi-Ramesses':
      return year < -2055
        ? { name: 'Memphis', coords: HISTORICAL_CAPITAL_CITY_COORDS['Memphis'] }
        : { name: 'Thebes (Luxor)', coords: HISTORICAL_CAPITAL_CITY_COORDS['Thebes'] };
    case 'Thebes (Waset) / Itjtawy':
    case 'Thebes (Luxor) & Pi-Ramesses':
      return { name: 'Thebes (Luxor)', coords: HISTORICAL_CAPITAL_CITY_COORDS['Thebes'] };
    case 'Sais / Napata / Memphis':
      return { name: 'Sais', coords: HISTORICAL_CAPITAL_CITY_COORDS['Sais'] };
    case 'Uruk, Ur, Akkad & Babylon':
      return year < -2334
        ? { name: 'Uruk', coords: HISTORICAL_CAPITAL_CITY_COORDS['Uruk'] }
        : year < -1894
        ? { name: 'Ur', coords: HISTORICAL_CAPITAL_CITY_COORDS['Ur'] }
        : { name: 'Babylon', coords: HISTORICAL_CAPITAL_CITY_COORDS['Babylon'] };
    case 'Uruk / Ur':
      return { name: 'Uruk', coords: HISTORICAL_CAPITAL_CITY_COORDS['Uruk'] };
    case 'Babylon / Assur':
    case 'Babylon (Ishtar Gate)':
      return { name: 'Babylon', coords: HISTORICAL_CAPITAL_CITY_COORDS['Babylon'] };
    case 'Assur, Nimrud, Nineveh & Babylon':
      return year < -612
        ? { name: 'Nineveh', coords: HISTORICAL_CAPITAL_CITY_COORDS['Nineveh'] }
        : { name: 'Babylon', coords: HISTORICAL_CAPITAL_CITY_COORDS['Babylon'] };
    case 'Nineveh / Nimrud':
      return { name: 'Nineveh', coords: HISTORICAL_CAPITAL_CITY_COORDS['Nineveh'] };
    case 'Hattusa, Jerusalem, Tyre & Damascus':
    case 'Hattusa (Boğazkale)':
      return { name: 'Hattusa', coords: HISTORICAL_CAPITAL_CITY_COORDS['Hattusa'] };
    case 'Ecbatana (Hamadan)':
      return { name: 'Ecbatana', coords: HISTORICAL_CAPITAL_CITY_COORDS['Ecbatana'] };
    case 'Persepolis, Susa, Babylon & Ecbatana':
    case 'Persepolis / Susa / Babylon':
      return { name: 'Persepolis', coords: HISTORICAL_CAPITAL_CITY_COORDS['Persepolis'] };
    case 'Babylon, Seleucia & Antioch':
    case 'Antioch / Seleucia-on-the-Tigris':
      return { name: 'Antioch', coords: HISTORICAL_CAPITAL_CITY_COORDS['Antioch'] };
    case 'Ctesiphon & Ecbatana':
    case 'Ctesiphon (Tigris)':
      return { name: 'Ctesiphon', coords: HISTORICAL_CAPITAL_CITY_COORDS['Ctesiphon'] };
    case 'Medina & Kufa':
      return { name: 'Medina', coords: HISTORICAL_CAPITAL_CITY_COORDS['Medina'] };
    case 'Baghdad (and Cordoba in Al-Andalus)':
    case 'Baghdad (Round City)':
      return { name: 'Baghdad', coords: HISTORICAL_CAPITAL_CITY_COORDS['Baghdad'] };
    case 'Isfahan, Rayy, Nishapur & Konya':
    case 'Isfahan (Naqsh-e Jahan)':
      return { name: 'Isfahan', coords: HISTORICAL_CAPITAL_CITY_COORDS['Isfahan'] };
    case 'Tabriz & Qazvin':
      return year < 1555
        ? { name: 'Tabriz', coords: HISTORICAL_CAPITAL_CITY_COORDS['Tabriz'] }
        : { name: 'Qazvin', coords: HISTORICAL_CAPITAL_CITY_COORDS['Qazvin'] };
    case 'Mashhad & Shiraz':
      return year < 1750
        ? { name: 'Mashhad', coords: HISTORICAL_CAPITAL_CITY_COORDS['Mashhad'] }
        : { name: 'Shiraz', coords: HISTORICAL_CAPITAL_CITY_COORDS['Shiraz'] };
    case 'Samarkand & Herat':
      return { name: 'Samarkand', coords: HISTORICAL_CAPITAL_CITY_COORDS['Samarkand'] };
    case "Petra & Hegra (Al-Ula / Mada'in Salih)":
      return { name: 'Petra', coords: HISTORICAL_CAPITAL_CITY_COORDS['Petra'] };
    case 'Mecca & Medina':
    case 'Mecca, Medina & Jeddah':
      return { name: 'Mecca', coords: HISTORICAL_CAPITAL_CITY_COORDS['Mecca'] };
    case 'Al-Hofuf & Qatif':
      return { name: 'Al-Hofuf', coords: HISTORICAL_CAPITAL_CITY_COORDS['Al-Hofuf'] };
    case "Riyadh & Ha'il":
      return { name: 'Riyadh', coords: HISTORICAL_CAPITAL_CITY_COORDS['Riyadh'] };
    case 'Marrakesh, Fez & Tlemcen':
      return { name: 'Marrakesh', coords: HISTORICAL_CAPITAL_CITY_COORDS['Marrakesh'] };
    case 'Cirta (Constantine), Tlemcen & Algiers':
      return { name: 'Algiers', coords: HISTORICAL_CAPITAL_CITY_COORDS['Algiers'] };
    case 'Tripoli (Oea), Leptis Magna & Cyrene (Benghazi)':
      return { name: 'Tripoli', coords: HISTORICAL_CAPITAL_CITY_COORDS['Tripoli'] };
    case 'Kerma, Napata & Meroë':
      return { name: 'Meroë', coords: HISTORICAL_CAPITAL_CITY_COORDS['Meroë'] };
    case 'Aksum, Lalibela, Gondar & Addis Ababa':
      return year < 960
        ? { name: 'Aksum', coords: HISTORICAL_CAPITAL_CITY_COORDS['Aksum'] }
        : year < 1632
        ? { name: 'Lalibela', coords: HISTORICAL_CAPITAL_CITY_COORDS['Lalibela'] }
        : year < 1886
        ? { name: 'Gondar', coords: HISTORICAL_CAPITAL_CITY_COORDS['Gondar'] }
        : { name: 'Addis Ababa', coords: HISTORICAL_CAPITAL_CITY_COORDS['Addis Ababa'] };
    case 'Gondar / Debre Berhan':
      return { name: 'Gondar', coords: HISTORICAL_CAPITAL_CITY_COORDS['Gondar'] };
    case 'Koumbi Saleh, Niani, Timbuktu & Gao':
      return year < 1235
        ? { name: 'Koumbi Saleh', coords: HISTORICAL_CAPITAL_CITY_COORDS['Koumbi Saleh'] }
        : year < 1464
        ? { name: 'Timbuktu', coords: HISTORICAL_CAPITAL_CITY_COORDS['Timbuktu'] }
        : { name: 'Gao', coords: HISTORICAL_CAPITAL_CITY_COORDS['Gao'] };
    case 'Niani & Timbuktu':
      return { name: 'Timbuktu', coords: HISTORICAL_CAPITAL_CITY_COORDS['Timbuktu'] };
    case 'Gao & Timbuktu':
      return { name: 'Gao', coords: HISTORICAL_CAPITAL_CITY_COORDS['Gao'] };
    case 'Pretoria & Bloemfontein':
      return { name: 'Pretoria', coords: HISTORICAL_CAPITAL_CITY_COORDS['Pretoria'] };
    case 'Knossos (Crete)':
      return { name: 'Knossos', coords: HISTORICAL_CAPITAL_CITY_COORDS['Knossos'] };
    case 'Athens / Sparta / Thebes / Corinth':
      return { name: 'Athens', coords: HISTORICAL_CAPITAL_CITY_COORDS['Athens'] };
    case 'Babylon / Pella / Alexandria':
      return { name: 'Pella', coords: HISTORICAL_CAPITAL_CITY_COORDS['Pella'] };
    case 'Knossos, Mycenae, Athens, Sparta & Pella':
      return year < -1450
        ? { name: 'Knossos', coords: HISTORICAL_CAPITAL_CITY_COORDS['Knossos'] }
        : year < -1100
        ? { name: 'Mycenae', coords: HISTORICAL_CAPITAL_CITY_COORDS['Mycenae'] }
        : year < -336
        ? { name: 'Athens', coords: HISTORICAL_CAPITAL_CITY_COORDS['Athens'] }
        : { name: 'Pella', coords: HISTORICAL_CAPITAL_CITY_COORDS['Pella'] };
    case 'Rome & Constantinople':
    case 'Rome (Later Milan, Ravenna & Constantinople)':
      return year < 286
        ? { name: 'Rome', coords: HISTORICAL_CAPITAL_CITY_COORDS['Rome'] }
        : year < 330
        ? { name: 'Milan', coords: HISTORICAL_CAPITAL_CITY_COORDS['Milan'] }
        : { name: 'Constantinople', coords: HISTORICAL_CAPITAL_CITY_COORDS['Constantinople'] };
    case 'Ravenna & Milan':
    case 'Ravenna / Mediolanum (Milan) / Rome':
      return year < 402
        ? { name: 'Milan', coords: HISTORICAL_CAPITAL_CITY_COORDS['Milan'] }
        : { name: 'Ravenna', coords: HISTORICAL_CAPITAL_CITY_COORDS['Ravenna'] };
    case 'Pannonian Royal Encampment (Tisza Plain)':
      return { name: 'Tisza Encampment', coords: HISTORICAL_CAPITAL_CITY_COORDS['Tisza Encampment'] };
    case 'Toledo, Ravenna, Toulouse & Paris':
    case 'Paris / Toledo / Ravenna':
    case 'Toledo & Valladolid':
      return { name: 'Toledo', coords: HISTORICAL_CAPITAL_CITY_COORDS['Toledo'] };
    case 'Córdoba (and Granada)':
    case 'Córdoba / Seville':
      return { name: 'Córdoba', coords: HISTORICAL_CAPITAL_CITY_COORDS['Córdoba'] };
    case 'Madrid (Toledo prior to 1561)':
      return year < 1561
        ? { name: 'Toledo', coords: HISTORICAL_CAPITAL_CITY_COORDS['Toledo'] }
        : { name: 'Madrid', coords: HISTORICAL_CAPITAL_CITY_COORDS['Madrid'] };
    case 'Rio de Janeiro (Royal Court in Brazil) & Lisbon':
      return { name: 'Rio de Janeiro', coords: HISTORICAL_CAPITAL_CITY_COORDS['Rio de Janeiro'] };
    case 'Amsterdam / The Hague':
      return { name: 'Amsterdam', coords: HISTORICAL_CAPITAL_CITY_COORDS['Amsterdam'] };
    case 'Paris (and Versailles)':
    case 'Versailles & Paris':
      return { name: 'Paris', coords: HISTORICAL_CAPITAL_CITY_COORDS['Paris'] };
    case 'Aachen / Frankfurt':
      return year < 936
        ? { name: 'Aachen', coords: HISTORICAL_CAPITAL_CITY_COORDS['Aachen'] }
        : { name: 'Frankfurt', coords: HISTORICAL_CAPITAL_CITY_COORDS['Frankfurt'] };
    case 'Vienna & Regensburg':
      return { name: 'Vienna', coords: HISTORICAL_CAPITAL_CITY_COORDS['Vienna'] };
    case 'Aachen, Frankfurt, Prague & Vienna':
    case 'Aachen, Regensburg, Prague & Vienna':
      return year < 936
        ? { name: 'Aachen', coords: HISTORICAL_CAPITAL_CITY_COORDS['Aachen'] }
        : year < 1346
        ? { name: 'Frankfurt', coords: HISTORICAL_CAPITAL_CITY_COORDS['Frankfurt'] }
        : year < 1438
        ? { name: 'Prague', coords: HISTORICAL_CAPITAL_CITY_COORDS['Prague'] }
        : { name: 'Vienna', coords: HISTORICAL_CAPITAL_CITY_COORDS['Vienna'] };
    case 'Frankfurt & Berlin':
      return { name: 'Frankfurt', coords: HISTORICAL_CAPITAL_CITY_COORDS['Frankfurt'] };
    case 'Bonn (West) / East Berlin (East)':
      return { name: 'Bonn', coords: HISTORICAL_CAPITAL_CITY_COORDS['Bonn'] };
    case 'Vienna & Budapest':
      return { name: 'Vienna', coords: HISTORICAL_CAPITAL_CITY_COORDS['Vienna'] };
    case 'Kraków & Vilnius':
      return { name: 'Kraków', coords: HISTORICAL_CAPITAL_CITY_COORDS['Kraków'] };
    case 'Warsaw & Vilnius':
      return { name: 'Warsaw', coords: HISTORICAL_CAPITAL_CITY_COORDS['Warsaw'] };
    case 'Kraków & Warsaw (and Vilnius)':
      return year < 1596
        ? { name: 'Kraków', coords: HISTORICAL_CAPITAL_CITY_COORDS['Kraków'] }
        : { name: 'Warsaw', coords: HISTORICAL_CAPITAL_CITY_COORDS['Warsaw'] };
    case 'Kyiv, Vladimir & Moscow':
    case 'Kyiv & Veliky Novgorod':
    case 'Kyiv & Novgorod':
      return year < 1240
        ? { name: 'Kyiv', coords: HISTORICAL_CAPITAL_CITY_COORDS['Kyiv'] }
        : { name: 'Moscow', coords: HISTORICAL_CAPITAL_CITY_COORDS['Moscow'] };
    case 'Moscow & Saint Petersburg':
      return year >= 1712
        ? { name: 'Saint Petersburg', coords: HISTORICAL_CAPITAL_CITY_COORDS['Saint Petersburg'] }
        : { name: 'Moscow', coords: HISTORICAL_CAPITAL_CITY_COORDS['Moscow'] };
    case 'Roskilde, Uppsala & Nidaros':
    case 'Roskilde / Copenhagen / Nidaros / Uppsala':
      return year < 1417
        ? { name: 'Roskilde', coords: HISTORICAL_CAPITAL_CITY_COORDS['Roskilde'] }
        : { name: 'Copenhagen', coords: HISTORICAL_CAPITAL_CITY_COORDS['Copenhagen'] };
    case 'Copenhagen, Stockholm & Kalmar':
      return { name: 'Copenhagen', coords: HISTORICAL_CAPITAL_CITY_COORDS['Copenhagen'] };
    case 'Edirne (Adrianople)':
      return { name: 'Edirne', coords: HISTORICAL_CAPITAL_CITY_COORDS['Edirne'] };
    case 'Constantinople (Kostantiniyye / Istanbul)':
      return { name: 'Constantinople (Istanbul)', coords: HISTORICAL_CAPITAL_CITY_COORDS['Constantinople (Istanbul)'] };
    case 'Câmpulung & Curtea de Argeș':
      return { name: 'Curtea de Argeș', coords: HISTORICAL_CAPITAL_CITY_COORDS['Curtea de Argeș'] };
    case 'Târgoviște (Wallachia) & Suceava (Moldavia)':
      return { name: 'Târgoviște', coords: HISTORICAL_CAPITAL_CITY_COORDS['Târgoviște'] };
    case 'Bucharest (București) & Iași':
      return { name: 'Bucharest', coords: HISTORICAL_CAPITAL_CITY_COORDS['Bucharest'] };
    case 'Florence, Venice, Milan, Naples & Rome':
      return { name: 'Florence', coords: HISTORICAL_CAPITAL_CITY_COORDS['Florence'] };
    case 'London (Winchester prior to 1066)':
      return year < 1066
        ? { name: 'Winchester', coords: HISTORICAL_CAPITAL_CITY_COORDS['Winchester'] }
        : { name: 'London', coords: HISTORICAL_CAPITAL_CITY_COORDS['London'] };
    case 'Tikal / Palenque / Calakmul / Teotihuacan':
      return { name: 'Tikal (Petén)', coords: HISTORICAL_CAPITAL_CITY_COORDS['Tikal (Petén)'] };
    case 'Chichen Itza / Mayapan / Tula':
      return { name: 'Chichen Itza', coords: HISTORICAL_CAPITAL_CITY_COORDS['Chichen Itza'] };
    case 'San Lorenzo, La Venta, Monte Albán, Tikal & Teotihuacan':
      return { name: 'Teotihuacan', coords: HISTORICAL_CAPITAL_CITY_COORDS['Teotihuacan'] };
    case 'Chichen Itza, Tula & Tenochtitlan':
    case 'Tenochtitlan (Lake Texcoco)':
      return { name: 'Tenochtitlan', coords: HISTORICAL_CAPITAL_CITY_COORDS['Tenochtitlan'] };
    case 'Caral, Chavín de Huántar, Tiwanaku, Chan Chan & Cusco':
      return { name: 'Cusco', coords: HISTORICAL_CAPITAL_CITY_COORDS['Cusco'] };
    case 'St. Augustine (Founded 1565) & Santa Fe':
      return { name: 'St. Augustine', coords: HISTORICAL_CAPITAL_CITY_COORDS['St. Augustine'] };
    case 'Boston, Philadelphia, Williamsburg & New York':
    case 'Philadelphia, Boston, New York & Charleston':
      return { name: 'Philadelphia', coords: HISTORICAL_CAPITAL_CITY_COORDS['Philadelphia'] };
    case 'Philadelphia & New York':
      return { name: 'New York', coords: HISTORICAL_CAPITAL_CITY_COORDS['New York'] };
    case 'Washington, D.C. (Philadelphia 1790–1800)':
      return year < 1800
        ? { name: 'Philadelphia', coords: HISTORICAL_CAPITAL_CITY_COORDS['Philadelphia'] }
        : { name: 'Washington, D.C.', coords: HISTORICAL_CAPITAL_CITY_COORDS['Washington, D.C.'] };
    case 'Richmond, Virginia (Montgomery 1861)':
      return { name: 'Richmond', coords: HISTORICAL_CAPITAL_CITY_COORDS['Richmond'] };
    case 'New Orleans (La Nouvelle-Orléans) & Mobile':
      return { name: 'New Orleans', coords: HISTORICAL_CAPITAL_CITY_COORDS['New Orleans'] };
    case 'Santa Fe, San Antonio & St. Augustine':
    case 'New Orleans, Santa Fe, Monterey & San Antonio':
    case 'Mexico City, Santa Fe, Monterey & St. Augustine':
    case 'Mexico City (Provincial seats in Monterey & Santa Fe)':
      return { name: 'Santa Fe', coords: HISTORICAL_CAPITAL_CITY_COORDS['Santa Fe'] };
    case 'Austin / Houston':
      return { name: 'Austin', coords: HISTORICAL_CAPITAL_CITY_COORDS['Austin'] };
    case 'Fort Vancouver & Oregon City':
      return { name: 'Oregon City', coords: HISTORICAL_CAPITAL_CITY_COORDS['Oregon City'] };
    case 'New Archangel (Sitka)':
      return { name: 'Sitka', coords: HISTORICAL_CAPITAL_CITY_COORDS['Sitka'] };
    case 'Quebec City (Québec) & Montreal':
    case 'Quebec City, Kingston, Toronto & Ottawa':
      return year >= 1857
        ? { name: 'Ottawa', coords: HISTORICAL_CAPITAL_CITY_COORDS['Ottawa'] }
        : { name: 'Quebec City', coords: HISTORICAL_CAPITAL_CITY_COORDS['Quebec City'] };
    case "York Factory & St. John's":
      return { name: "St. John's", coords: HISTORICAL_CAPITAL_CITY_COORDS["St. John's"] };
    case 'Nuuk (Sovereign Realm Capital: Copenhagen, Denmark)':
    case 'Nuuk / Godthåb (Sovereign Capital: Copenhagen, Denmark)':
      return { name: 'Nuuk', coords: HISTORICAL_CAPITAL_CITY_COORDS['Nuuk'] };
    case 'Brattahlíð / Garðar & Inuit Coastal Settlements':
      return { name: 'Brattahlíð', coords: HISTORICAL_CAPITAL_CITY_COORDS['Brattahlíð'] };
    case 'Salvador da Bahia (Rio de Janeiro after 1763)':
      return year < 1763
        ? { name: 'Salvador', coords: HISTORICAL_CAPITAL_CITY_COORDS['Salvador'] }
        : { name: 'Rio de Janeiro', coords: HISTORICAL_CAPITAL_CITY_COORDS['Rio de Janeiro'] };
    case 'Rio de Janeiro (Salvador pre-1763, Brasília from 1960)':
      return year < 1763
        ? { name: 'Salvador', coords: HISTORICAL_CAPITAL_CITY_COORDS['Salvador'] }
        : year < 1960
        ? { name: 'Rio de Janeiro', coords: HISTORICAL_CAPITAL_CITY_COORDS['Rio de Janeiro'] }
        : { name: 'Brasília', coords: HISTORICAL_CAPITAL_CITY_COORDS['Brasília'] };
    case 'Buenos Aires & Córdoba':
      return { name: 'Buenos Aires', coords: HISTORICAL_CAPITAL_CITY_COORDS['Buenos Aires'] };
    default:
      break;
  }

  // 3. Fallback to modern country's capital coordinates (with dynamic capital name)
  const fallback = COUNTRY_CAPITAL_COORDINATES[countryName];
  if (fallback) {
    return { name: rawCapital, coords: fallback.coords };
  }
  return null;
}

function formatCountryDisplayName(rawName: string): string {
  const cleanMap: Record<string, string> = {
    'United States of America': 'United States',
    'Dem. Rep. Congo': 'DR Congo',
    'Central African Rep.': 'Central African Rep.',
    'Bosnia and Herz.': 'Bosnia & Herz.',
    'Dominican Rep.': 'Dominican Rep.',
    'S. Sudan': 'South Sudan',
    'Eq. Guinea': 'Eq. Guinea',
    'Solomon Is.': 'Solomon Is.',
    'Falkland Is.': 'Falkland Is.',
    'W. Sahara': 'Western Sahara',
    'N. Cyprus': 'N. Cyprus'
  };
  return cleanMap[rawName] || rawName;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  currentEra,
  currentYear,
  onSelectRegion,
  onSelectConflict,
  onSelectArchSite,
  onSelectPhysicalFeature,
  onSelectTradeFeature,
  onClearRegionSelection,
  selectedRegionId,
  selectedConflictId,
  selectedArchSiteId,
  selectedPhysicalFeatureId,
  selectedTradeFeatureId,
  focusedSearchTarget,
  onClearSearchTarget
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const pinchDistRef = useRef<number | null>(null);

  // Mobile/Tablet Slide-Over Control Drawer state (< 1024px)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // =================================================================
  // LEFT SIDEBAR TOGGLES (Map Layers, View Options & Legend)
  // =================================================================
  const [showPoliticalBorders, setShowPoliticalBorders] = useState<boolean>(true);
  const [showArchaeologicalSites, setShowArchaeologicalSites] = useState<boolean>(false);
  const [showPhysicalTerrain, setShowPhysicalTerrain] = useState<boolean>(false);
  const [showCultureTradeOverlay, setShowCultureTradeOverlay] = useState<boolean>(false);
  const [showConflicts, setShowConflicts] = useState<boolean>(true);

  // View Options toggles (One unified switch for all country names)
  const [showCountryNames, setShowCountryNames] = useState<boolean>(true);
  const [showConflictNameTags, setShowConflictNameTags] = useState<boolean>(true);
  const [showArchSiteNameTags, setShowArchSiteNameTags] = useState<boolean>(true);
  const [showHistoricalCapitals, setShowHistoricalCapitals] = useState<boolean>(false);
  const [mapStyle, setMapStyle] = useState<'classic' | 'parchment' | 'dark'>('classic');

  // Collapsible Sidebar Sections
  const [isLayersSectionOpen, setIsLayersSectionOpen] = useState<boolean>(true);
  const [isViewOptionsOpen, setIsViewOptionsOpen] = useState<boolean>(true);
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(true);

  // Hover states
  const [hoveredCountry, setHoveredCountry] = useState<GeoCountry | null>(null);
  const [hoveredSubRegion, setHoveredSubRegion] = useState<HistoricalSubRegionResolved | null>(null);
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null);
  const [hoveredConflict, setHoveredConflict] = useState<ConflictZone | null>(null);
  const [hoveredArchSite, setHoveredArchSite] = useState<ArchaeologicalSite | null>(null);
  const [hoveredTradeRoute, setHoveredTradeRoute] = useState<TradeRouteFeature | null>(null);
  const [hoveredCulturalHub, setHoveredCulturalHub] = useState<CulturalHubFeature | null>(null);
  const [hoveredMountain, setHoveredMountain] = useState<MountainRangeFeature | null>(null);
  const [hoveredRiver, setHoveredRiver] = useState<RiverSystemFeature | null>(null);
  const [hoveredPhysiographic, setHoveredPhysiographic] = useState<PhysiographicFeature | null>(null);
  const [hoveredOceanic, setHoveredOceanic] = useState<OceanicFeature | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const mapContainerRef = useRef<HTMLDivElement>(null);

  const yearString = currentYear < 0 ? `${Math.abs(currentYear)} BCE` : `${currentYear} CE`;

  const activeConflicts = useMemo(() => {
    return getConflictsForEra(currentYear);
  }, [currentYear]);

  const activeArchaeologicalSites = useMemo(() => {
    return getArchaeologicalSitesForEra(currentYear);
  }, [currentYear]);

  const activeTradeRoutes = useMemo(() => {
    return getTradeRoutesForYear(currentYear);
  }, [currentYear]);

  const activeCulturalHubs = useMemo(() => {
    return CULTURAL_HUBS.filter(
      (h) => currentYear >= h.activeStartYear && currentYear <= h.activeEndYear
    );
  }, [currentYear]);

  // Compute borders mesh path for current era (dissolving internal borders & open-space borders)
  const currentBordersPath = useMemo(() => {
    return getEraBordersMesh(currentYear);
  }, [currentYear]);

  // Dynamic Era-Aware Capitals Layer (Changes with currentYear, relocates historical capitals, and hides non-existent states)
  const allCountryCapitals = useMemo(() => {
    const items: {
      id: string;
      rawCountryName: string;
      capital: string;
      coords: [number, number];
      isMajor: boolean;
    }[] = [];

    const seenEntities = new Set<string>();
    const seenCapitalNames = new Set<string>();

    // 1. Evaluate all countries for currentYear
    for (const country of WORLD_COUNTRIES) {
      if (country.name === 'Antarctica') continue;

      const eraProfile = getCountryEraData(country.name, currentYear);
      if (!eraProfile.isOpenSpace && eraProfile.capital && eraProfile.capital !== 'None') {
        const entityKey =
          country.name === 'Puerto Rico' && currentYear >= 1952
            ? 'territory_Puerto_Rico'
            : eraProfile.entityId;

        if (!seenEntities.has(entityKey)) {
          const resolved = resolveCapitalDisplayAndCoords(
            eraProfile.capital,
            country.name,
            currentYear
          );
          if (resolved && !seenCapitalNames.has(resolved.name)) {
            seenEntities.add(entityKey);
            seenCapitalNames.add(resolved.name);
            items.push({
              id: `${entityKey}_${country.id}`,
              rawCountryName: country.name,
              capital: resolved.name,
              coords: resolved.coords,
              isMajor:
                MAJOR_LABEL_ANCHOR_COUNTRIES.has(country.name) ||
                !eraProfile.entityId.startsWith('sovereign_')
            });
          }
        }
      }

      // 2. Also include active historical sub-regions (e.g. British 13 Colonies, Confederacy, Chola/Vijayanagara, Jin, Hejaz/Najd)
      const activeSubRegions = getSubRegionsForCountry(country.name, currentYear);
      for (const sub of activeSubRegions) {
        if (sub.isOpenSpace || !sub.capital || sub.capital === 'None') continue;
        const resolvedSub = resolveCapitalDisplayAndCoords(
          sub.capital,
          country.name,
          currentYear
        );
        if (resolvedSub && !seenCapitalNames.has(resolvedSub.name)) {
          seenCapitalNames.add(resolvedSub.name);
          items.push({
            id: `sub_${sub.id}`,
            rawCountryName: country.name,
            capital: resolvedSub.name,
            coords: resolvedSub.coords,
            isMajor: MAJOR_LABEL_ANCHOR_COUNTRIES.has(country.name)
          });
        }
      }
    }

    return items;
  }, [currentYear]);

  // Dynamic Era-Aware Country & Polity Names Layer (Hides countries that do not exist in currentYear)
  const allCountryLabelItems = useMemo(() => {
    const PREFERRED_HEARTLANDS: Record<string, string | ((y: number) => string)> = {
      soviet_union_ussr: 'Russia',
      tsardom_and_russian_empire: 'Russia',
      kievan_rus_muscovy: (y) => (y < 1240 ? 'Ukraine' : 'Russia'),
      yugoslavia_1918_1991: 'Serbia',
      czechoslovakia_1918_1992: 'Czechia',
      austrian_and_austro_hungarian_empire: 'Austria',
      ottoman_empire_dynamic: 'Turkey',
      byzantine_empire: 'Turkey',
      hittite_empire: 'Turkey',
      roman_republic_and_empire: 'Italy',
      western_roman_empire: 'Italy',
      kingdom_of_italy_and_republic: 'Italy',
      british_kingdom_and_empire: 'United Kingdom',
      spanish_global_empire: 'Spain',
      al_andalus_cordoba: 'Spain',
      portuguese_empire: 'Portugal',
      modern_france_1815_1994: 'France',
      french_revolutionary_napoleonic_empire: 'France',
      kingdom_of_france: 'France',
      visigothic_ostrogothic_merovingian: 'France',
      dutch_republic_kingdom: 'Netherlands',
      belgian_kingdom_and_congo: 'Belgium',
      holy_roman_empire: 'Germany',
      prussia_german_confederation_empire_weimar: 'Germany',
      nazi_germany_axis_wwii: 'Germany',
      polish_lithuanian_commonwealth: 'Poland',
      wallachia_moldavia_romania: 'Romania',
      viking_nordic_kalmar: 'Denmark',
      qing_dynasty_china: 'China',
      qin_han_three_kingdoms_china: 'China',
      tang_song_yuan_ming_china: 'China',
      republic_and_prc_china: 'China',
      mongol_empire_and_khanates: 'Mongolia',
      timurid_empire: 'Uzbekistan',
      empire_of_japan_modern: 'Japan',
      tokugawa_medieval_japan: 'Japan',
      joseon_goryeo_korea: 'South Korea',
      mughal_empire_maratha: 'India',
      delhi_sultanate_vijayanagara: 'India',
      kushan_gupta_india: 'India',
      maurya_shunga_india: 'India',
      indus_vedic_india: 'India',
      achaemenid_persian_empire: 'Iran',
      parthian_sassanid_persia: 'Iran',
      safavid_afsharid_qajar_persia: 'Iran',
      sumer_akkad_babylon: 'Iraq',
      seleucid_empire: 'Iraq',
      rashidun_umayyad_abbasid_caliphate: (y) => (y >= 661 && y < 750 ? 'Syria' : 'Iraq'),
      egypt_new_kingdom: 'Egypt',
      fatimid_ayyubid_mamluk_egypt: 'Egypt',
      carthaginian_empire: 'Tunisia',
      aksumite_ethiopian_empire: 'Ethiopia',
      ghana_mali_songhai_west_africa: 'Mali',
      khmer_empire_angkor: 'Cambodia',
      srivijaya_majapahit_maritime: 'Indonesia',
      malacca_and_johor_sultanates: 'Malaysia',
      federation_of_malaya_1957_1962: 'Malaysia',
      united_states_continuous: 'United States of America',
      gran_colombia_bolivar: 'Colombia',
      classic_maya_mesoamerica: 'Mexico',
      inca_empire_tawantinsuyu: 'Peru',
      polynesian_tonga_samoa_realms: 'Tonga',
      micronesia_nan_madol_yap: 'Micronesia'
    };

    const resolvePolityLabelName = (
      rulePrefix: string,
      anchorRawName: string,
      entityName: string,
      y: number
    ): string => {
      if (
        y >= 1995 ||
        rulePrefix.startsWith('sovereign_') ||
        rulePrefix.startsWith('regional_polity_') ||
        rulePrefix.startsWith('medieval_') ||
        rulePrefix.startsWith('greenland_') ||
        rulePrefix === 'territory_Puerto_Rico'
      ) {
        return formatCountryDisplayName(anchorRawName);
      }

      switch (rulePrefix) {
        case 'united_states_continuous':
          return 'United States';
        case 'british_kingdom_and_empire':
          return y < 1707 ? 'England & Scotland' : y < 1801 ? 'Great Britain' : 'United Kingdom';
        case 'spanish_global_empire':
          return y <= 1824 ? 'Spanish Empire' : 'Spain';
        case 'portuguese_empire':
          return y <= 1822 ? 'Portuguese Empire' : 'Portugal';
        case 'modern_france_1815_1994':
        case 'kingdom_of_france':
          return 'France';
        case 'french_revolutionary_napoleonic_empire':
          return y >= 1804 ? 'French Empire' : 'France';
        case 'dutch_republic_kingdom':
          return y < 1815 ? 'Dutch Republic' : 'Netherlands';
        case 'belgian_kingdom_and_congo':
          return 'Belgium';
        case 'kingdom_of_italy_and_republic':
          return 'Italy';
        case 'prussia_german_confederation_empire_weimar':
          return y < 1871 ? 'Prussia' : y <= 1918 ? 'German Empire' : 'Germany';
        case 'nazi_germany_axis_wwii':
          return 'German Reich';
        case 'soviet_union_ussr':
          return 'Soviet Union';
        case 'tsardom_and_russian_empire':
          return y < 1721 ? 'Tsardom of Russia' : 'Russian Empire';
        case 'yugoslavia_1918_1991':
          return 'Yugoslavia';
        case 'czechoslovakia_1918_1992':
          return 'Czechoslovakia';
        case 'austrian_and_austro_hungarian_empire':
          return y >= 1867 ? 'Austria-Hungary' : 'Austrian Empire';
        case 'ottoman_empire_dynamic':
          return 'Ottoman Empire';
        case 'polish_lithuanian_commonwealth':
          return 'Poland-Lithuania';
        case 'wallachia_moldavia_romania':
          return y < 1859 ? 'Wallachia & Moldavia' : 'Romania';
        case 'gran_colombia_bolivar':
          return 'Gran Colombia';
        case 'federation_of_malaya_1957_1962':
          return 'Malaya';
        case 'republic_and_prc_china':
          return 'China';
        case 'qing_dynasty_china':
          return 'Qing Empire';
        case 'empire_of_japan_modern':
        case 'tokugawa_medieval_japan':
          return 'Japan';
        case 'joseon_goryeo_korea':
          return y < 1392 ? 'Goryeo Korea' : 'Joseon Korea';
        case 'sultanate_of_brunei':
          return 'Brunei';
        case 'maldives_buddhist_and_sultanate':
          return 'Maldives';
        case 'bahrain_medieval_and_al_khalifa':
          return 'Bahrain';
        default: {
          const cleaned = entityName.split(' (')[0].split(' & ')[0].trim();
          return cleaned || formatCountryDisplayName(anchorRawName);
        }
      }
    };

    const groups = new Map<
      string,
      { country: GeoCountry; eraProfile: ReturnType<typeof getCountryEraData> }[]
    >();

    for (const country of WORLD_COUNTRIES) {
      if (country.name === 'Antarctica') continue;
      const eraProfile = getCountryEraData(country.name, currentYear);
      if (eraProfile.isOpenSpace) continue;

      const entityKey =
        country.name === 'Puerto Rico' && currentYear >= 1952
          ? 'territory_Puerto_Rico'
          : eraProfile.entityId;

      const list = groups.get(entityKey) || [];
      list.push({ country, eraProfile });
      groups.set(entityKey, list);
    }

    const items: {
      id: string;
      rawName: string;
      displayName: string;
      centroid: [number, number];
      isMajor: boolean;
    }[] = [];

    const labeledEntities = new Set<string>();

    for (const [entityKey, members] of groups.entries()) {
      let chosen = members[0];

      if (members.length > 1) {
        // 1. Check if entityKey corresponds to a specific sovereign/regional/medieval country name
        const targetSovereignName = entityKey
          .replace(/^sovereign_/, '')
          .replace(/^medieval_/, '')
          .replace(/^regional_polity_/, '')
          .replace(/_\d+$/, '');

        const directMatch = members.find((m) => {
          const norm =
            m.country.name === 'S. Sudan'
              ? 'South Sudan'
              : m.country.name === 'Macedonia'
              ? 'North Macedonia'
              : m.country.name;
          return norm === targetSovereignName || m.country.name === targetSovereignName;
        });

        if (directMatch) {
          chosen = directMatch;
        } else {
          // 2. Check preferred heartland country for multi-country historical empires
          const rulePrefix = Object.keys(PREFERRED_HEARTLANDS).find((prefix) =>
            entityKey.startsWith(prefix)
          );
          if (rulePrefix) {
            const prefEntry = PREFERRED_HEARTLANDS[rulePrefix];
            const prefCountry =
              typeof prefEntry === 'function' ? prefEntry(currentYear) : prefEntry;
            const heartlandMatch = members.find((m) => m.country.name === prefCountry);
            if (heartlandMatch) {
              chosen = heartlandMatch;
            }
          }
        }
      }

      const rulePrefix =
        Object.keys(PREFERRED_HEARTLANDS).find((prefix) => entityKey.startsWith(prefix)) ||
        entityKey;

      const displayName = resolvePolityLabelName(
        rulePrefix,
        chosen.country.name,
        chosen.eraProfile.entityName,
        currentYear
      );

      labeledEntities.add(entityKey);
      items.push({
        id: `${entityKey}_${chosen.country.id}`,
        rawName: chosen.country.name,
        displayName,
        centroid:
          COUNTRY_LABEL_CENTROID_OVERRIDES[chosen.country.name] || chosen.country.centroid,
        isMajor:
          MAJOR_LABEL_ANCHOR_COUNTRIES.has(chosen.country.name) || members.length > 1
      });
    }

    // Also include active non-open-space historical sub-regions whose parent country is open space or divided
    // (e.g., Early United States 1776–1847, Confederate States 1861–1865, Kievan Rus'/Muscovy pre-1582, Chola/Vijayanagara, Zulu Kingdom)
    for (const country of WORLD_COUNTRIES) {
      if (!SUB_REGION_CLIPPED_COUNTRIES.has(country.name)) continue;
      const parentProfile = getCountryEraData(country.name, currentYear);
      const activeSubRegions = getSubRegionsForCountry(country.name, currentYear);

      for (const sub of activeSubRegions) {
        if (sub.isOpenSpace) continue;
        // Skip colonial sub-regions whose European metropole is already labeled unless parent country is open space and it's an indigenous/national state
        if (
          labeledEntities.has(sub.entityId) ||
          sub.entityId.includes('british_') ||
          sub.entityId.includes('french_') ||
          sub.entityId.includes('spanish_') ||
          sub.entityId.includes('portuguese_') ||
          sub.entityId.includes('dutch_') ||
          sub.entityId.includes('ottoman_') ||
          sub.entityId.includes('russian_alaska')
        ) {
          if (!parentProfile.isOpenSpace) continue;
          // Even if parent is open space, only label primary national/indigenous polities (like Early USA, Kievan Rus', Muscovy, Argentina, Zulu)
          if (
            !sub.id.startsWith('usa_early_') &&
            !sub.id.startsWith('usa_revolutionary_') &&
            !sub.id.startsWith('russia_') &&
            !sub.id.startsWith('argentina_') &&
            !sub.id.startsWith('saudi_') &&
            !sub.id.startsWith('south_africa_zulu')
          ) {
            continue;
          }
        }

        labeledEntities.add(sub.entityId);
        const subDisplayName = sub.entityName.split(' (')[0].split(' / ')[0].trim();
        items.push({
          id: `sub_lbl_${sub.id}`,
          rawName: country.name,
          displayName: subDisplayName,
          centroid: sub.labelPos,
          isMajor: MAJOR_LABEL_ANCHOR_COUNTRIES.has(country.name)
        });
      }
    }

    return items;
  }, [currentYear]);

  // Calculate the pixel width of one complete 360° world cycle inside the current container
  const getCycleWidthPx = (customScale = scale) => {
    if (!mapContainerRef.current) return 1000 * customScale;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const svgAspect = 1000 / 520;
    const containerAspect = rect.width / (rect.height || 1);
    const baseWidth = containerAspect > svgAspect ? rect.height * svgAspect : rect.width;
    return baseWidth * customScale;
  };

  // Automatically pan and zoom the map when a user selects a Country, City, or Historical Figure from the Header Search Bar
  useEffect(() => {
    if (!focusedSearchTarget) return;

    const targetScale = focusedSearchTarget.zoomScale || 2.4;
    const [targetSvgX, targetSvgY] = focusedSearchTarget.svgCoords;

    let pxPerSvgUnit = 1;
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      const svgAspect = 1000 / 520;
      const containerAspect = rect.width / (rect.height || 1);
      const baseWidth = containerAspect > svgAspect ? rect.height * svgAspect : rect.width;
      pxPerSvgUnit = baseWidth / 1000;
    }

    const dxSvg = targetSvgX - 500;
    const dySvg = targetSvgY - 260;

    const newX = -dxSvg * pxPerSvgUnit * targetScale;
    const maxPanY = 240 * targetScale;
    const rawY = -dySvg * pxPerSvgUnit * targetScale;
    const newY = Math.max(-maxPanY, Math.min(maxPanY, rawY));

    setScale(targetScale);
    setPosition({ x: newX, y: newY });
  }, [focusedSearchTarget]);

  // Pan dragging with infinite spherical horizontal wrapping (Google Maps style)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    if (isDragging) {
      const cyclePx = getCycleWidthPx();
      let rawX = e.clientX - dragStartRef.current.x;

      // When dragging past the Americas to the west or past Asia to the east, wrap seamlessly
      while (rawX > cyclePx / 2) {
        rawX -= cyclePx;
        dragStartRef.current.x += cyclePx;
      }
      while (rawX < -cyclePx / 2) {
        rawX += cyclePx;
        dragStartRef.current.x -= cyclePx;
      }

      // Vertical movement is bounded by the poles (Earth sphere geometry)
      const maxPanY = 240 * scale;
      const rawY = e.clientY - dragStartRef.current.y;
      const newY = Math.max(-maxPanY, Math.min(maxPanY, rawY));

      setPosition({
        x: rawX,
        y: newY
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for Mobile & Tablet (1-finger pan with globe wrap + 2-finger pinch-to-zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      dragStartRef.current = { x: touch.clientX - position.x, y: touch.clientY - position.y };
      pinchDistRef.current = null;
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchDistRef.current = Math.hypot(dx, dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const cyclePx = getCycleWidthPx();
      let rawX = touch.clientX - dragStartRef.current.x;

      while (rawX > cyclePx / 2) {
        rawX -= cyclePx;
        dragStartRef.current.x += cyclePx;
      }
      while (rawX < -cyclePx / 2) {
        rawX += cyclePx;
        dragStartRef.current.x -= cyclePx;
      }

      const maxPanY = 240 * scale;
      const rawY = touch.clientY - dragStartRef.current.y;
      const newY = Math.max(-maxPanY, Math.min(maxPanY, rawY));

      setPosition({ x: rawX, y: newY });
    } else if (e.touches.length === 2 && pinchDistRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.hypot(dx, dy);
      const delta = newDist - pinchDistRef.current;

      if (Math.abs(delta) > 4) {
        const zoomStep = delta * 0.008;
        setScale((prev) => Math.max(0.9, Math.min(5.5, prev + zoomStep)));
        pinchDistRef.current = newDist;
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    pinchDistRef.current = null;
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.4, 5.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.4, 0.9));
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomFactor = e.deltaY < 0 ? 0.15 : -0.15;
    setScale((prev) => Math.max(0.9, Math.min(5.5, prev + zoomFactor)));
  };

  // Territory click handler (opens dossier for the corresponding sovereign country/empire)
  const handleTerritoryClick = (country: GeoCountry) => {
    const eraProfile = getCountryEraData(country.name, currentYear);
    const regionData: MapRegion = {
      id: eraProfile.entityId,
      name: eraProfile.entityName,
      modernCountry: country.name,
      capital: eraProfile.capital,
      ruler: eraProfile.ruler,
      populationEstimate: eraProfile.populationEstimate,
      color: eraProfile.color,
      path: country.path,
      center: country.centroid,
      description: eraProfile.description,
      keyEvents: eraProfile.keyEvents,
      isOpenSpace: eraProfile.isOpenSpace
    };
    onSelectRegion(regionData);
  };

  // Sub-region click handler (opens dossier for the specific colonial/imperial sub-region)
  const handleSubRegionClick = (sub: HistoricalSubRegionResolved, country: GeoCountry) => {
    const regionData: MapRegion = {
      id: sub.id,
      name: sub.entityName,
      modernCountry: `${sub.historicalName} (${country.name})`,
      capital: sub.capital,
      ruler: sub.ruler,
      populationEstimate: sub.populationEstimate,
      color: sub.color,
      path: sub.svgPolygonPath,
      center: sub.labelPos,
      description: sub.description,
      keyEvents: sub.keyEvents,
      isOpenSpace: sub.isOpenSpace
    };
    onSelectRegion(regionData);
  };

  // Currently hovered profile (prioritizes sub-regional historical territory when hovered)
  const hoveredProfile = useMemo(() => {
    if (hoveredSubRegion && hoveredCountry) {
      const physicalData = getCountryPhysicalProfile(hoveredCountry.name);
      return {
        entityId: hoveredSubRegion.id,
        entityName: hoveredSubRegion.entityName,
        historicalName: hoveredSubRegion.historicalName,
        ruler: hoveredSubRegion.ruler,
        capital: hoveredSubRegion.capital,
        populationEstimate: hoveredSubRegion.populationEstimate,
        description: hoveredSubRegion.description,
        keyEvents: hoveredSubRegion.keyEvents,
        color: hoveredSubRegion.color,
        isOpenSpace: hoveredSubRegion.isOpenSpace,
        subRegionLabel: hoveredSubRegion.historicalName,
        physical: physicalData
      };
    }
    if (!hoveredCountry) return null;
    const eraData = getCountryEraData(hoveredCountry.name, currentYear);
    const physicalData = getCountryPhysicalProfile(hoveredCountry.name);
    return {
      ...eraData,
      subRegionLabel: undefined,
      physical: physicalData
    };
  }, [hoveredCountry, hoveredSubRegion, currentYear]);

  // Ocean colors based on selected Map Style & Physical Geography
  const oceanStops = useMemo(() => {
    if (mapStyle === 'dark') {
      return ['#081426', '#0c1d36', '#071120'];
    }
    if (mapStyle === 'parchment') {
      return ['#cad8d8', '#d5e1df', '#c2d2d2'];
    }
    if (showPhysicalTerrain) {
      return ['#b9dff2', '#c7e6f7', '#b2daf0'];
    }
    return ['#d2ebf7', '#d9eefb', '#cce5f5'];
  }, [mapStyle, showPhysicalTerrain]);

  // Reusable Toggle Switch UI Component matching the reference dashboard
  const renderToggleSwitch = (checked: boolean) => (
    <div
      className={`w-9 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 shrink-0 ${
        checked ? 'bg-blue-500' : 'bg-slate-700'
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </div>
  );

  return (
    <div className="relative flex w-full h-full min-h-0 gap-0 lg:gap-3 select-none overflow-hidden">
      {/* Mobile / Tablet Backdrop when Left Control Panel Drawer is open */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* ================================================================= */}
      {/* LEFT SIDEBAR: MAP LAYERS, VIEW OPTIONS & LEGEND                   */}
      {/* Docked on desktop (lg+), slide-over drawer on mobile/tablet (<lg) */}
      {/* ================================================================= */}
      <aside
        className={`${
          isMobileSidebarOpen
            ? 'fixed inset-y-0 left-0 z-40 flex w-72 max-w-[85vw]'
            : 'hidden lg:flex lg:w-64 xl:w-68'
        } shrink-0 h-full bg-slate-900/98 lg:bg-slate-900/95 border-r lg:border border-slate-800/90 lg:rounded-xl flex-col overflow-y-auto shadow-2xl text-slate-100 transition-transform duration-200`}
      >
        {/* Mobile Drawer Header with Close Button */}
        <div className="flex lg:hidden items-center justify-between px-3.5 py-3 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Map Layers & Controls</span>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
            title="Close Controls"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. MAP LAYERS SECTION */}
        <div className="p-3 border-b border-slate-800/90">
          <button
            onClick={() => setIsLayersSectionOpen((prev) => !prev)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-white mb-2.5 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Map Layers</span>
            </span>
            {isLayersSectionOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {isLayersSectionOpen && (
            <div className="space-y-1.5">
              {/* Political Borders Toggle */}
              <button
                onClick={() => setShowPoliticalBorders((prev) => !prev)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  showPoliticalBorders
                    ? 'bg-blue-600/25 border border-blue-500/60 text-white shadow-sm'
                    : 'hover:bg-slate-800/70 text-slate-300 border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Landmark className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="truncate">Political Borders</span>
                </span>
                {renderToggleSwitch(showPoliticalBorders)}
              </button>

              {/* Archaeological Sites Toggle (alongside Political Borders) */}
              <button
                onClick={() => setShowArchaeologicalSites((prev) => !prev)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  showArchaeologicalSites
                    ? 'bg-blue-600/25 border border-blue-500/60 text-white shadow-sm'
                    : 'hover:bg-slate-800/70 text-slate-300 border border-transparent'
                }`}
                title="Plot and inspect significant archaeological sites and historical ruins relevant to the selected era"
              >
                <span className="flex items-center gap-2 truncate">
                  <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Archaeological Sites</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {activeArchaeologicalSites.length}
                  </span>
                </span>
                {renderToggleSwitch(showArchaeologicalSites)}
              </button>

              {/* Physical Geography Toggle */}
              <button
                onClick={() => {
                  const nextState = !showPhysicalTerrain;
                  setShowPhysicalTerrain(nextState);
                  if (nextState) {
                    // When switching into Physical Geography mode, disable country selection & clear active country dossier
                    setHoveredCountry(null);
                    setHoveredSubRegion(null);
                    setHoveredEntityId(null);
                    onClearRegionSelection?.();
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  showPhysicalTerrain
                    ? 'bg-blue-600/25 border border-blue-500/60 text-white shadow-sm'
                    : 'hover:bg-slate-800/70 text-slate-300 border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Mountain className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Physical Geography</span>
                </span>
                {renderToggleSwitch(showPhysicalTerrain)}
              </button>

              {/* Trade Routes & Culture Toggle */}
              <button
                onClick={() => setShowCultureTradeOverlay((prev) => !prev)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  showCultureTradeOverlay
                    ? 'bg-blue-600/25 border border-blue-500/60 text-white shadow-sm'
                    : 'hover:bg-slate-800/70 text-slate-300 border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Route className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Trade Routes & Culture</span>
                </span>
                {renderToggleSwitch(showCultureTradeOverlay)}
              </button>

              {/* War Zones & Disputes Toggle */}
              <button
                onClick={() => setShowConflicts((prev) => !prev)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  showConflicts
                    ? 'bg-blue-600/25 border border-blue-500/60 text-white shadow-sm'
                    : 'hover:bg-slate-800/70 text-slate-300 border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <Crosshair className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="truncate">War Zones & Disputes</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/40">
                    {activeConflicts.length}
                  </span>
                </span>
                {renderToggleSwitch(showConflicts)}
              </button>
            </div>
          )}
        </div>

        {/* 2. VIEW OPTIONS SECTION */}
        <div className="p-3 border-b border-slate-800/90">
          <button
            onClick={() => setIsViewOptionsOpen((prev) => !prev)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-white mb-2.5 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span>View Options</span>
            </span>
            {isViewOptionsOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {isViewOptionsOpen && (
            <div className="space-y-2.5">
              {/* Single Unified Switch for All Country Names */}
              <button
                onClick={() => setShowCountryNames((prev) => !prev)}
                className="w-full flex items-center justify-between px-1 py-1 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Toggle all country names on and off"
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Show Country Names</span>
                </span>
                {renderToggleSwitch(showCountryNames)}
              </button>

              {/* Toggle for Conflict / War Zone Name Tags */}
              <button
                onClick={() => setShowConflictNameTags((prev) => !prev)}
                className="w-full flex items-center justify-between px-1 py-1 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Show or hide the name tags below each war zone and disputed territory on the map"
              >
                <span className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Conflict Name Tags</span>
                </span>
                {renderToggleSwitch(showConflictNameTags)}
              </button>

              {/* Toggle for Archaeological Site Name Tags */}
              <button
                onClick={() => setShowArchSiteNameTags((prev) => !prev)}
                className="w-full flex items-center justify-between px-1 py-1 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Show or hide the name tags above each archaeological site and historical ruin on the map"
              >
                <span className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Archaeological Site Tags</span>
                </span>
                {renderToggleSwitch(showArchSiteNameTags)}
              </button>

              {/* Toggle for Country Capitals */}
              <button
                onClick={() => setShowHistoricalCapitals((prev) => !prev)}
                className="w-full flex items-center justify-between px-1 py-1 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Show or hide the capital city of every country at its actual geographic location on the map"
              >
                <span>Show Capitals</span>
                {renderToggleSwitch(showHistoricalCapitals)}
              </button>

              {/* Map Style Selector */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="flex items-center gap-1.5 text-xs text-slate-300">
                  <Palette className="w-3.5 h-3.5 text-slate-400" />
                  <span>Map Style</span>
                </span>
                <select
                  value={mapStyle}
                  onChange={(e) =>
                    setMapStyle(e.target.value as 'classic' | 'parchment' | 'dark')
                  }
                  className="bg-slate-950 border border-slate-700/90 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="classic">Classic Atlas</option>
                  <option value="parchment">Vintage Parchment</option>
                  <option value="dark">Dark Tactical</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 3. LEGEND SECTION (Switches to Physical Geography Legend when Physical Geography layer is active) */}
        <div className="p-3 flex-1">
          <button
            onClick={() => setIsLegendOpen((prev) => !prev)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-white mb-2.5 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {showPhysicalTerrain ? (
                <Mountain className="w-4 h-4 text-emerald-400" />
              ) : (
                <Globe className="w-4 h-4 text-blue-400" />
              )}
              <span>{showPhysicalTerrain ? 'Physical Geography Legend' : 'Legend'}</span>
            </span>
            {isLegendOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {isLegendOpen && (
            <div className="space-y-2 text-xs text-slate-300">
              {showPhysicalTerrain ? (
                <>
                  <div className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">
                    Natural Land Biomes & Extents
                  </div>
                  {PHYSICAL_BIOME_LEGEND_ITEMS.map((item) => (
                    <div key={item.terrainType} className="flex items-start gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded border border-white/25 shrink-0 mt-0.5 shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="min-w-0 leading-tight">
                        <div className="text-[11px] font-medium text-slate-200">{item.label}</div>
                        <div className="text-[9.5px] text-slate-400">{item.detail}</div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 mt-2 border-t border-slate-800 space-y-1.5">
                    <div className="text-[10px] font-mono uppercase text-sky-400 tracking-wider">
                      Interactive Relief & Ocean Features
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded bg-[#6b4423] border border-amber-200/60 shrink-0 flex items-center justify-center text-[8px] font-bold text-amber-200">
                        ▲
                      </span>
                      <span className="text-[11px]">Mountain Cordillera (Clickable)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-0.5 bg-sky-400 shrink-0" />
                      <span className="text-[11px]">Major River Basin (Clickable)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-teal-500/30 border border-teal-300 shrink-0 flex items-center justify-center text-[8px] font-bold text-teal-200">
                        ❖
                      </span>
                      <span className="text-[11px]">Coral Reef System (Clickable)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded bg-indigo-950 border border-indigo-400 shrink-0 flex items-center justify-center text-[8px] font-bold text-indigo-200">
                        ▼
                      </span>
                      <span className="text-[11px]">Deep Oceanic Trench (Clickable)</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded bg-[#d8ccb8] border border-white/20 shrink-0" />
                    <span>Uncolonized / Indigenous</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded bg-red-600/80 border border-red-400 shrink-0 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                    <span>Active War Zone</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded border border-amber-400 shrink-0"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(45deg, rgba(220,38,38,0.65) 0px, rgba(220,38,38,0.65) 2px, rgba(217,119,6,0.25) 2px, rgba(217,119,6,0.25) 4px)'
                      }}
                    />
                    <span>Disputed Territory</span>
                  </div>
                  {showArchaeologicalSites && (
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-500/90 border border-amber-200 shrink-0 flex items-center justify-center text-[8px] font-bold text-slate-950">
                        ▲
                      </span>
                      <span>Archaeological Site / Ruin</span>
                    </div>
                  )}
                </>
              )}

              {showCultureTradeOverlay && (
                <div className="pt-2 mt-2 border-t border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-sky-400">
                    Trade & Culture
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-0.5 bg-amber-400 shrink-0" />
                    <span>Overland Caravan Route</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-0.5 bg-sky-400 shrink-0" />
                    <span>Maritime Spice Route</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rotate-45 bg-amber-400 border border-white shrink-0 ml-0.5" />
                    <span>Cultural & Merchant Hub</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Active Year Summary Footer inside Left Sidebar */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800/90 text-[11px] text-slate-400">
          <div className="font-semibold text-amber-400 truncate">
            {yearString} · {currentEra.epochName}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Drag horizontally to wrap continuously around the globe.
          </div>
        </div>
      </aside>

      {/* ================================================================= */}
      {/* INTERACTIVE WORLD MAP CANVAS                                      */}
      {/* ================================================================= */}
      <div
        ref={mapContainerRef}
        className="relative flex-1 h-full min-h-0 overflow-hidden bg-slate-900 border border-slate-700/80 rounded-xl cursor-grab active:cursor-grabbing shadow-2xl touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* Top-Left Compact Map Navigation, Zoom Bar & Mobile/Tablet Layers Button */}
        <div
          className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-20 flex items-center gap-1.5"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Mobile & Tablet Button to Open Left Control Sidebar (< 1024px) */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-2.5 py-2 bg-slate-900/95 hover:bg-slate-800 backdrop-blur-md border border-slate-700/90 rounded-lg text-xs font-semibold text-slate-100 shadow-xl cursor-pointer"
            title="Open Map Layers, View Options & Legend"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Layers</span>
          </button>

          <div className="flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-700/90 rounded-lg overflow-hidden shadow-xl">
            <button
              onClick={handleResetZoom}
              className="p-2 hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
              title="Center Globe"
            >
              <Navigation className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-slate-800" />
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-slate-800" />
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-slate-800" />
            <button
              onClick={handleResetZoom}
              className="p-2 hover:bg-slate-800 text-slate-200 hover:text-white transition-colors cursor-pointer"
              title="Reset Globe View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SVG Canvas with Academic Projection & Infinite Wrapping */}
        <svg
          viewBox="0 0 1000 520"
          className={`w-full h-full select-none ${
            isDragging ? 'transition-none' : 'transition-transform duration-75 ease-out'
          }`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '50% 50%',
            overflow: 'visible'
          }}
        >
          <defs>
            <linearGradient id="academicOcean" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={oceanStops[0]} />
              <stop offset="50%" stopColor={oceanStops[1]} />
              <stop offset="100%" stopColor={oceanStops[2]} />
            </linearGradient>

            {/* Tactical Conflict Glows & Hatched Zone Patterns */}
            <radialGradient id="conflictGlowCritical">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#ef4444" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="conflictGlowHigh">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            <pattern
              id="conflictHatchRed"
              width="4"
              height="4"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="4"
                stroke="#dc2626"
                strokeWidth="1.1"
                strokeOpacity="0.55"
              />
            </pattern>
            <pattern
              id="conflictHatchAmber"
              width="4"
              height="4"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="4"
                stroke="#d97706"
                strokeWidth="1.1"
                strokeOpacity="0.55"
              />
            </pattern>

            {/* Clip paths for countries with sub-regional historical divisions (USA, Saudi Arabia, Algeria, Russia, etc.) */}
            {WORLD_COUNTRIES.filter((c) => SUB_REGION_CLIPPED_COUNTRIES.has(c.name)).map(
              (c, idx) => (
                <clipPath key={`clip_def_${c.id}_${idx}`} id={`clip_country_${c.id}`}>
                  <path d={c.path} />
                </clipPath>
              )
            )}

            {/* Global Landmass Clip Path so Physical Geography Biome Extents follow natural ecological limits while respecting exact coastlines */}
            <clipPath id="clip_global_landmass">
              {WORLD_COUNTRIES.map((c, idx) => (
                <path key={`global_land_clip_${c.id}_${idx}`} d={c.path} />
              ))}
            </clipPath>
          </defs>

          {/* Ocean Background Canvas (Extended across all 5 world cycles for seamless ocean) */}
          <rect x="-2500" y="0" width="6000" height="520" fill="url(#academicOcean)" />

          {/* Parallels & Meridians (Cartographic Graticule continuous across the globe) */}
          <g
            stroke={mapStyle === 'dark' ? '#1e3a5f' : '#a4d4ee'}
            strokeWidth="0.5"
            strokeDasharray="3 3"
          >
            <line
              x1="-2500"
              y1="260"
              x2="3500"
              y2="260"
              stroke={mapStyle === 'dark' ? '#2563eb' : '#7ebfe3'}
              strokeWidth="0.9"
              strokeDasharray="none"
            />
            <line x1="-2500" y1="175" x2="3500" y2="175" />
            <line x1="-2500" y1="345" x2="3500" y2="345" />
            <line x1="-2500" y1="90" x2="3500" y2="90" />
            <line x1="-2500" y1="430" x2="3500" y2="430" />
            {WORLD_OFFSETS.map((offset) => (
              <g key={`meridians_${offset}`}>
                <line
                  x1={offset * 1000 + 500}
                  y1="0"
                  x2={offset * 1000 + 500}
                  y2="520"
                  stroke={mapStyle === 'dark' ? '#2563eb' : '#7ebfe3'}
                  strokeWidth="0.9"
                  strokeDasharray="none"
                />
                <line x1={offset * 1000 + 250} y1="0" x2={offset * 1000 + 250} y2="520" />
                <line x1={offset * 1000 + 750} y1="0" x2={offset * 1000 + 750} y2="520" />
                <line x1={offset * 1000 + 125} y1="0" x2={offset * 1000 + 125} y2="520" />
                <line x1={offset * 1000 + 375} y1="0" x2={offset * 1000 + 375} y2="520" />
                <line x1={offset * 1000 + 625} y1="0" x2={offset * 1000 + 625} y2="520" />
                <line x1={offset * 1000 + 875} y1="0" x2={offset * 1000 + 875} y2="520" />
              </g>
            ))}
          </g>

          {/* ---------------------------------------------------- */}
          {/* REPEATED HORIZONTAL WORLD CYCLES (INFINITE GLOBE)    */}
          {/* ---------------------------------------------------- */}
          {WORLD_OFFSETS.map((offset) => (
            <g key={`world_realm_${offset}`} transform={`translate(${offset * 1000}, 0)`}>
              {/* 1. Landmass & Empire / Natural Topographic Biome Fills */}
              <g id={`territories_${offset}`}>
                {WORLD_COUNTRIES.map((country, idx) => {
                  const eraProfile = getCountryEraData(country.name, currentYear);
                  const isEntitySelected =
                    !showPhysicalTerrain &&
                    (selectedRegionId === eraProfile.entityId ||
                      selectedRegionId?.includes(country.name));
                  const isEntityHovered =
                    !showPhysicalTerrain && hoveredEntityId === eraProfile.entityId;

                  // When in Physical Geography mode, base landmass uses seamless Temperate Lowlands (#93bd8b)
                  // except polar ice sheets (Antarctica & Sub-Antarctic islands) which use Polar Ice Sheet (#dce8f2),
                  // and NATURAL_BIOME_POLYGONS are drawn over it clipped to the continental coastline
                  const isPolarBaseLandmass =
                    country.name === 'Antarctica' ||
                    country.name === 'Fr. S. Antarctic Lands' ||
                    country.name === 'Heard I. and McDonald Is.' ||
                    country.name === 'S. Geo. and the Is.';
                  const physicalBaseColor = isPolarBaseLandmass ? '#dce8f2' : '#93bd8b';
                  const fillColor = showPhysicalTerrain ? physicalBaseColor : eraProfile.color;
                  let fillOpacity = 1;

                  if (isEntitySelected) {
                    fillOpacity = 0.95;
                  } else if (isEntityHovered) {
                    fillOpacity = 0.86;
                  }

                  const activeSubRegions = SUB_REGION_CLIPPED_COUNTRIES.has(country.name)
                    ? getSubRegionsForCountry(country.name, currentYear)
                    : [];

                  const isCompactState = COMPACT_SOVEREIGN_STATES.has(country.name);

                  return (
                    <React.Fragment key={`country_frag_${country.id}_${idx}_${offset}`}>
                      {isCompactState && !showPhysicalTerrain && (
                        <path
                          d={country.path}
                          fill="transparent"
                          stroke="transparent"
                          strokeWidth={3.2}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTerritoryClick(country);
                          }}
                          onMouseEnter={() => {
                            setHoveredCountry(country);
                            setHoveredSubRegion(null);
                            setHoveredEntityId(eraProfile.entityId);
                          }}
                          onMouseLeave={() => {
                            setHoveredCountry(null);
                            setHoveredEntityId(null);
                          }}
                        />
                      )}
                      <path
                        d={country.path}
                        fill={fillColor}
                        fillOpacity={fillOpacity}
                        paintOrder={isCompactState ? 'stroke' : undefined}
                        stroke={
                          showPhysicalTerrain
                            ? physicalBaseColor
                            : isEntitySelected
                            ? '#0284c7'
                            : isEntityHovered
                            ? '#3b82f6'
                            : isCompactState
                            ? '#1e293b'
                            : 'transparent'
                        }
                        strokeWidth={
                          showPhysicalTerrain
                            ? isCompactState
                              ? 0.22
                              : 0.55
                            : isEntitySelected
                            ? isCompactState
                              ? 0.95
                              : 1.5
                            : isEntityHovered
                            ? isCompactState
                              ? 0.65
                              : 0.9
                            : isCompactState
                            ? 0.24
                            : 0
                        }
                        className={
                          showPhysicalTerrain
                            ? 'transition-colors duration-100 pointer-events-none'
                            : 'transition-colors duration-100 cursor-pointer'
                        }
                        onClick={(e) => {
                          if (showPhysicalTerrain) return;
                          e.stopPropagation();
                          handleTerritoryClick(country);
                        }}
                        onMouseEnter={() => {
                          if (showPhysicalTerrain) return;
                          setHoveredCountry(country);
                          setHoveredSubRegion(null);
                          setHoveredEntityId(eraProfile.entityId);
                        }}
                        onMouseLeave={() => {
                          if (showPhysicalTerrain) return;
                          setHoveredCountry(null);
                          setHoveredEntityId(null);
                        }}
                      />

                      {/* Clipped Historical Sub-Regions (e.g., Ottoman Hejaz vs Free Najd; British 13 Colonies vs French Louisiana vs Spanish SW) */}
                      {!showPhysicalTerrain && activeSubRegions.length > 0 && (
                        <g clipPath={`url(#clip_country_${country.id})`}>
                          {activeSubRegions.map((sub) => {
                            const isSubSelected = selectedRegionId === sub.id;
                            const isSubHovered = hoveredSubRegion?.id === sub.id;
                            return (
                              <g key={`sub_${sub.id}_${offset}`}>
                                <path
                                  d={sub.svgPolygonPath}
                                  fill={sub.color}
                                  fillOpacity={isSubSelected ? 0.96 : isSubHovered ? 0.9 : 0.98}
                                  stroke={
                                    isSubSelected
                                      ? '#0284c7'
                                      : isSubHovered
                                      ? '#f8fafc'
                                      : 'transparent'
                                  }
                                  strokeWidth={isSubSelected ? 1.4 : isSubHovered ? 0.9 : 0}
                                  className="transition-colors duration-100 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSubRegionClick(sub, country);
                                  }}
                                  onMouseEnter={() => {
                                    setHoveredCountry(country);
                                    setHoveredSubRegion(sub);
                                    setHoveredEntityId(sub.id);
                                  }}
                                  onMouseLeave={() => {
                                    setHoveredSubRegion(null);
                                    setHoveredEntityId(null);
                                  }}
                                />
                                {showPoliticalBorders && sub.svgFrontierPath && (
                                  <path
                                    d={sub.svgFrontierPath}
                                    fill="none"
                                    stroke="#334155"
                                    strokeWidth="0.65"
                                    strokeDasharray="2.2 1.2"
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    className="pointer-events-none opacity-85"
                                  />
                                )}
                              </g>
                            );
                          })}
                        </g>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* 1B. Natural Physiographic Biome Extents (Clipped to Continental Coastlines, Independent of Political Borders) */}
                {showPhysicalTerrain && (
                  <g clipPath="url(#clip_global_landmass)" className="pointer-events-none">
                    {NATURAL_BIOME_POLYGONS.map((zone) => (
                      <path
                        key={`biome_zone_${zone.id}_${offset}`}
                        d={zone.svgPolygonPath}
                        fill={zone.color}
                        stroke={zone.color}
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        opacity="0.96"
                      />
                    ))}
                  </g>
                )}
              </g>

              {/* 2. Dynamic Political / Historical Borders Mesh (Hidden in Physical Geography mode so biomes follow natural limits) */}
              {!showPhysicalTerrain && showPoliticalBorders && (
                <path
                  d={currentBordersPath}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="0.65"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="pointer-events-none opacity-85"
                />
              )}

              {/* 3. Outer Continental Shorelines & Island Contours */}
              <path
                d={WORLD_COASTLINES_PATH}
                fill="none"
                stroke="#1e293b"
                strokeWidth="0.75"
                strokeLinejoin="round"
                strokeLinecap="round"
                className="pointer-events-none opacity-90"
              />

              {/* 4. PHYSICAL GEOGRAPHY LAYER (Clickable Rivers, Deserts/Basins, Mountain Cordilleras) */}
              {showPhysicalTerrain && (
                <g id={`physical_geography_${offset}`}>
                  {MAJOR_RIVERS.map((river) => {
                    const isHovered = hoveredRiver?.id === river.id;
                    const isSelected = selectedPhysicalFeatureId === river.id;
                    return (
                      <g
                        key={`river_${river.id}_${offset}`}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPhysicalFeature?.({ kind: 'river', data: river });
                        }}
                        onMouseEnter={() => setHoveredRiver(river)}
                        onMouseLeave={() => setHoveredRiver(null)}
                      >
                        {/* Wide Invisible Hit Target for Easy River Clicking */}
                        <path
                          d={river.svgPath}
                          fill="none"
                          stroke="transparent"
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {(isHovered || isSelected) && (
                          <path
                            d={river.svgPath}
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth={isSelected ? '4.2' : '3.4'}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.75"
                          />
                        )}
                        <path
                          d={river.svgPath}
                          fill="none"
                          stroke={isSelected ? '#0284c7' : isHovered ? '#0369a1' : '#0284c7'}
                          strokeWidth={isSelected ? '2.2' : isHovered ? '1.9' : '1.35'}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <text
                          x={river.labelPos[0]}
                          y={river.labelPos[1] - 3}
                          textAnchor="middle"
                          fill={isSelected || isHovered ? '#082f49' : '#0c4a6e'}
                          fontSize={isSelected || isHovered ? '5.2' : '4.6'}
                          fontStyle="italic"
                          fontWeight="bold"
                          stroke={isSelected || isHovered ? '#bae6fd' : '#e0f2fe'}
                          strokeWidth="1.3"
                          paintOrder="stroke"
                        >
                          ≈ {river.name}
                        </text>
                      </g>
                    );
                  })}

                  {PHYSIOGRAPHIC_REGIONS.map((phys) => {
                    const isHovered = hoveredPhysiographic?.id === phys.id;
                    const isSelected = selectedPhysicalFeatureId === phys.id;
                    const badgeWidth = Math.max(46, phys.name.length * 2.9 + 12);
                    const isDesert = phys.type === 'desert';
                    const isPlateau = phys.type === 'plateau';
                    const isTundra = phys.type === 'tundra';
                    const accentStroke = isDesert
                      ? '#d97706'
                      : isPlateau
                      ? '#78350f'
                      : isTundra
                      ? '#0284c7'
                      : '#15803d';

                    return (
                      <g
                        key={`phys_${phys.id}_${offset}`}
                        transform={`translate(${phys.projectedPos[0]}, ${phys.projectedPos[1]})`}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPhysicalFeature?.({ kind: 'physiographic', data: phys });
                        }}
                        onMouseEnter={() => setHoveredPhysiographic(phys)}
                        onMouseLeave={() => setHoveredPhysiographic(null)}
                      >
                        {/* Subtle Topographic Zone Perimeter */}
                        <ellipse
                          cx="0"
                          cy="-1.5"
                          rx={badgeWidth * 0.58}
                          ry={isSelected || isHovered ? 11 : 9}
                          fill={
                            isDesert
                              ? '#f59e0b'
                              : isPlateau
                              ? '#a16207'
                              : isTundra
                              ? '#38bdf8'
                              : '#16a34a'
                          }
                          fillOpacity={isSelected ? 0.34 : isHovered ? 0.26 : 0.14}
                          stroke={accentStroke}
                          strokeWidth={isSelected || isHovered ? '1.1' : '0.6'}
                          strokeDasharray="2.5 1.8"
                        />

                        {/* Clickable Label Pill */}
                        <rect
                          x={-badgeWidth / 2}
                          y="-5.8"
                          width={badgeWidth}
                          height="8.2"
                          rx="2.2"
                          fill={
                            isSelected || isHovered
                              ? '#0f172a'
                              : isDesert
                              ? '#fef3c7'
                              : isTundra
                              ? '#f0f9ff'
                              : '#f8fafc'
                          }
                          fillOpacity={isSelected || isHovered ? '0.92' : '0.84'}
                          stroke={isSelected || isHovered ? '#fbbf24' : accentStroke}
                          strokeWidth={isSelected || isHovered ? '0.85' : '0.5'}
                        />
                        <text
                          x="0"
                          y="-0.3"
                          textAnchor="middle"
                          fill={
                            isSelected || isHovered
                              ? '#fde68a'
                              : isDesert
                              ? '#78350f'
                              : isPlateau
                              ? '#3f2e21'
                              : isTundra
                              ? '#0c4a6e'
                              : '#14532d'
                          }
                          fontSize={isSelected || isHovered ? '4.6' : '4.1'}
                          fontStyle="italic"
                          fontWeight="bold"
                          letterSpacing="0.6"
                        >
                          {phys.name.toUpperCase()}
                        </text>
                      </g>
                    );
                  })}

                  {MOUNTAIN_RANGES.map((mtn) => {
                    const isHovered = hoveredMountain?.id === mtn.id;
                    const isSelected = selectedPhysicalFeatureId === mtn.id;
                    return (
                      <g
                        key={`mountain_${mtn.id}_${offset}`}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPhysicalFeature?.({ kind: 'mountain', data: mtn });
                        }}
                        onMouseEnter={() => setHoveredMountain(mtn)}
                        onMouseLeave={() => setHoveredMountain(null)}
                      >
                        {/* Wide Invisible Hit Target for Easy Mountain Range Clicking */}
                        <path
                          d={mtn.svgPath}
                          fill="none"
                          stroke="transparent"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {(isHovered || isSelected) && (
                          <path
                            d={mtn.svgPath}
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="5.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.55"
                          />
                        )}
                        <path
                          d={mtn.svgPath}
                          fill="none"
                          stroke={isSelected || isHovered ? '#451a03' : '#5c4033'}
                          strokeWidth={isSelected || isHovered ? '3.4' : '2.3'}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="3 1.5"
                          opacity="0.9"
                        />
                        {mtn.projectedPoints.map((pt, pIdx) => (
                          <polygon
                            key={`peak_${mtn.id}_${pIdx}_${offset}`}
                            points={`${pt[0]},${pt[1] - 4.5} ${pt[0] - 3.6},${pt[1] + 2.3} ${pt[0] + 3.6},${pt[1] + 2.3}`}
                            fill={isSelected || isHovered ? '#b45309' : '#6b4423'}
                            stroke={isSelected || isHovered ? '#fef08a' : '#fef3c7'}
                            strokeWidth={isSelected || isHovered ? '0.85' : '0.6'}
                          />
                        ))}
                        <g transform={`translate(${mtn.labelPos[0]}, ${mtn.labelPos[1] - 6})`}>
                          <text
                            x="0"
                            y="0"
                            textAnchor="middle"
                            fill={isSelected || isHovered ? '#451a03' : '#291507'}
                            fontSize={isSelected || isHovered ? '5.7' : '5.2'}
                            fontWeight="bold"
                            letterSpacing="0.5"
                            stroke={isSelected || isHovered ? '#fef08a' : '#fef3c7'}
                            strokeWidth="1.5"
                            paintOrder="stroke"
                          >
                            ▲ {mtn.name} ({mtn.elevation})
                          </text>
                        </g>
                      </g>
                    );
                  })}

                  {/* Famous Coral Reefs & Deep Oceanic Trenches in the Oceans */}
                  {OCEANIC_FEATURES.map((oceanic) => {
                    const isHovered = hoveredOceanic?.id === oceanic.id;
                    const isSelected = selectedPhysicalFeatureId === oceanic.id;
                    const isTrench = oceanic.type === 'trench';
                    const badgeWidth = Math.max(54, oceanic.name.length * 2.45 + 14);

                    return (
                      <g
                        key={`oceanic_${oceanic.id}_${offset}`}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPhysicalFeature?.({ kind: 'oceanic', data: oceanic });
                        }}
                        onMouseEnter={() => setHoveredOceanic(oceanic)}
                        onMouseLeave={() => setHoveredOceanic(null)}
                      >
                        {/* Wide Invisible Hit Target for Easy Ocean Clicking */}
                        <path
                          d={oceanic.svgPath}
                          fill="none"
                          stroke="transparent"
                          strokeWidth="13"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Bathymetric Trench Depression or Coral Reef Lagoon Glow */}
                        <path
                          d={oceanic.svgPath}
                          fill="none"
                          stroke={
                            isTrench
                              ? isSelected || isHovered
                                ? '#6366f1'
                                : '#1e1b4b'
                              : isSelected || isHovered
                              ? '#2dd4bf'
                              : '#06b6d4'
                          }
                          strokeWidth={isSelected || isHovered ? '6.2' : '4.6'}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity={isTrench ? (isSelected || isHovered ? 0.65 : 0.5) : 0.42}
                        />

                        {/* Core Trench Subduction Axis or Coral Reef Barrier Line */}
                        <path
                          d={oceanic.svgPath}
                          fill="none"
                          stroke={
                            isTrench
                              ? isSelected || isHovered
                                ? '#a5b4fc'
                                : '#312e81'
                              : isSelected || isHovered
                              ? '#99f6e4'
                              : '#0d9488'
                          }
                          strokeWidth={isSelected || isHovered ? '2.4' : '1.8'}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray={isTrench ? '3.5 1.5' : '1.6 1.6'}
                        />

                        {/* Bathymetric Trench Triangles (▼) or Coral Reef Atoll Nodes (●) */}
                        {oceanic.projectedPoints.map((pt, pIdx) =>
                          isTrench ? (
                            <polygon
                              key={`oceanic_pt_${oceanic.id}_${pIdx}_${offset}`}
                              points={`${pt[0]},${pt[1] + 2.7} ${pt[0] - 2.3},${pt[1] - 1.8} ${pt[0] + 2.3},${pt[1] - 1.8}`}
                              fill={isSelected || isHovered ? '#818cf8' : '#312e81'}
                              stroke={isSelected || isHovered ? '#e0e7ff' : '#a5b4fc'}
                              strokeWidth="0.55"
                            />
                          ) : (
                            <circle
                              key={`oceanic_pt_${oceanic.id}_${pIdx}_${offset}`}
                              cx={pt[0]}
                              cy={pt[1]}
                              r={isSelected || isHovered ? '2.3' : '1.8'}
                              fill={isSelected || isHovered ? '#5eead4' : '#14b8a6'}
                              stroke="#f0fdfa"
                              strokeWidth="0.55"
                            />
                          )
                        )}

                        {/* Clickable Oceanic Label Pill */}
                        <g
                          transform={`translate(${oceanic.labelPos[0]}, ${
                            oceanic.labelPos[1] + (isTrench ? 8.5 : -7.5)
                          })`}
                        >
                          <rect
                            x={-badgeWidth / 2}
                            y="-5.6"
                            width={badgeWidth}
                            height="8.0"
                            rx="2.3"
                            fill={
                              isTrench
                                ? isSelected || isHovered
                                  ? '#1e1b4b'
                                  : '#0f172a'
                                : isSelected || isHovered
                                ? '#042f2e'
                                : '#0f172a'
                            }
                            fillOpacity="0.9"
                            stroke={
                              isTrench
                                ? isSelected || isHovered
                                  ? '#a5b4fc'
                                  : '#6366f1'
                                : isSelected || isHovered
                                ? '#5eead4'
                                : '#14b8a6'
                            }
                            strokeWidth={isSelected || isHovered ? '0.85' : '0.55'}
                          />
                          <text
                            x="0"
                            y="-0.3"
                            textAnchor="middle"
                            fill={isTrench ? '#e0e7ff' : '#99f6e4'}
                            fontSize={isSelected || isHovered ? '4.4' : '3.9'}
                            fontWeight="bold"
                            letterSpacing="0.35"
                          >
                            {isTrench ? `▼ ${oceanic.name}` : `❖ ${oceanic.name}`}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* 5. HISTORICAL CULTURE & TRADE ROUTES OVERLAY (Clickable Routes & Merchant Hubs) */}
              {showCultureTradeOverlay && (
                <g id={`culture_trade_${offset}`}>
                  {activeTradeRoutes.map((route) => {
                    const isHovered = hoveredTradeRoute?.id === route.id;
                    const isSelected = selectedTradeFeatureId === route.id;
                    const isMaritime = route.type === 'maritime';

                    return (
                      <g
                        key={`trade_route_${route.id}_${offset}`}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTradeFeature?.({ kind: 'route', data: route });
                        }}
                        onMouseEnter={() => setHoveredTradeRoute(route)}
                        onMouseLeave={() => setHoveredTradeRoute(null)}
                      >
                        {/* Wide Invisible Hit Target for Easy Trade Route Clicking */}
                        <path
                          d={route.svgPath}
                          fill="none"
                          stroke="transparent"
                          strokeWidth="11"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {(isHovered || isSelected) && (
                          <path
                            d={route.svgPath}
                            fill="none"
                            stroke={route.color}
                            strokeWidth="5.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.4"
                          />
                        )}
                        <path
                          d={route.svgPath}
                          fill="none"
                          stroke="#0f172a"
                          strokeWidth={isSelected || isHovered ? '3.8' : '2.4'}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.75"
                        />
                        <path
                          d={route.svgPath}
                          fill="none"
                          stroke={route.color}
                          strokeWidth={isSelected || isHovered ? '2.6' : '1.6'}
                          strokeDasharray={isMaritime ? '4 2.5' : '6 2'}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {route.projectedPoints.map((pt, wIdx) => (
                          <circle
                            key={`wp_${route.id}_${wIdx}_${offset}`}
                            cx={pt[0]}
                            cy={pt[1]}
                            r={isSelected || isHovered ? 2.5 : 1.6}
                            fill="#ffffff"
                            stroke={route.color}
                            strokeWidth="1"
                          />
                        ))}
                        <g transform={`translate(${route.labelPos[0]}, ${route.labelPos[1] - 5})`}>
                          <rect
                            x="-48"
                            y="-6.8"
                            width="96"
                            height="10.5"
                            rx="2.5"
                            fill="#0f172a"
                            fillOpacity={isSelected || isHovered ? '0.96' : '0.88'}
                            stroke={isSelected || isHovered ? '#fef08a' : route.color}
                            strokeWidth={isSelected || isHovered ? '1.0' : '0.7'}
                          />
                          <text
                            x="0"
                            y="0.5"
                            textAnchor="middle"
                            fill={isSelected || isHovered ? '#fef08a' : '#f8fafc'}
                            fontSize={isSelected || isHovered ? '4.9' : '4.6'}
                            fontWeight="bold"
                            letterSpacing="0.3"
                          >
                            {route.name.split(' (')[0]}
                          </text>
                        </g>
                      </g>
                    );
                  })}

                  {activeCulturalHubs.map((hub) => {
                    const isHovered = hoveredCulturalHub?.id === hub.id;
                    const isSelected = selectedTradeFeatureId === hub.id;
                    return (
                      <g
                        key={`cultural_hub_${hub.id}_${offset}`}
                        transform={`translate(${hub.projectedPos[0]}, ${hub.projectedPos[1]})`}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTradeFeature?.({ kind: 'hub', data: hub });
                        }}
                        onMouseEnter={() => setHoveredCulturalHub(hub)}
                        onMouseLeave={() => setHoveredCulturalHub(null)}
                      >
                        <circle
                          cx="0"
                          cy="0"
                          r={isSelected || isHovered ? 13 : 8}
                          fill={hub.sphereColor}
                          fillOpacity={isSelected || isHovered ? '0.35' : '0.22'}
                          stroke={isSelected || isHovered ? '#fef08a' : hub.sphereColor}
                          strokeWidth={isSelected || isHovered ? '1.0' : '0.7'}
                          strokeDasharray="1.5 1.5"
                        />
                        <polygon
                          points="0,-4.2 4.2,0 0,4.2 -4.2,0"
                          fill={hub.sphereColor}
                          stroke="#ffffff"
                          strokeWidth="0.9"
                        />
                        <text
                          x="0"
                          y="8.5"
                          textAnchor="middle"
                          fill="#0f172a"
                          fontSize={isSelected || isHovered ? '5.2' : '4.8'}
                          fontWeight="bold"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                          paintOrder="stroke"
                        >
                          {hub.name}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* 6. UNIFIED COUNTRY NAMES & CAPITALS */}
              {(showCountryNames || showHistoricalCapitals) && (
                <g id={`labels_capitals_${offset}`} pointerEvents="none">
                  {/* 6A. All Country Capitals at Exact Real-World Coordinates */}
                  {showHistoricalCapitals &&
                    allCountryCapitals.map((item) => {
                      const baseFontSize = item.isMajor ? 2.85 : 1.95;
                      const scaledFontSize = Math.max(
                        0.95,
                        baseFontSize / Math.pow(Math.max(1, scale), 0.35)
                      );
                      const outerRadius = Math.max(
                        0.65,
                        (item.isMajor ? 1.65 : 1.15) / Math.pow(Math.max(1, scale), 0.32)
                      );
                      const innerRadius = outerRadius * 0.42;
                      const strokeW = Math.max(0.35, scaledFontSize * 0.28);

                      return (
                        <g
                          key={`country_cap_${item.id}_${offset}`}
                          transform={`translate(${item.coords[0]}, ${item.coords[1]})`}
                        >
                          <circle
                            cx="0"
                            cy="0"
                            r={outerRadius}
                            fill="#0f172a"
                            stroke="#fbbf24"
                            strokeWidth={Math.max(0.28, outerRadius * 0.34)}
                          />
                          <circle cx="0" cy="0" r={innerRadius} fill="#fbbf24" />
                          <text
                            x={outerRadius + scaledFontSize * 0.42}
                            y={scaledFontSize * 0.32}
                            textAnchor="start"
                            fill="#fef08a"
                            fontSize={scaledFontSize}
                            fontWeight="bold"
                            stroke="#0f172a"
                            strokeWidth={strokeW}
                            paintOrder="stroke"
                          >
                            {item.capital}
                          </text>
                        </g>
                      );
                    })}

                  {/* 6B. All 177 Country Names Controlled by the Single Switch */}
                  {showCountryNames &&
                    allCountryLabelItems.map((c) => {
                      const baseFontSize = c.isMajor ? 3.5 : 2.25;
                      const scaledFontSize = Math.max(
                        1.1,
                        baseFontSize / Math.pow(Math.max(1, scale), 0.35)
                      );
                      const strokeW = Math.max(0.45, scaledFontSize * 0.28);
                      const isCloseToCapital =
                        showHistoricalCapitals &&
                        allCountryCapitals.some(
                          (cap) =>
                            Math.abs(cap.coords[0] - c.centroid[0]) < 8 &&
                            Math.abs(cap.coords[1] - c.centroid[1]) < 3.5
                        );
                      const labelY = isCloseToCapital
                        ? c.centroid[1] - scaledFontSize * 1.05
                        : c.centroid[1];

                      return (
                        <text
                          key={`all_country_lbl_${c.id}_${offset}`}
                          x={c.centroid[0]}
                          y={labelY}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={mapStyle === 'dark' ? '#f8fafc' : '#0f172a'}
                          fontSize={scaledFontSize}
                          fontWeight={c.isMajor ? '700' : '600'}
                          letterSpacing="0.15"
                          stroke={mapStyle === 'dark' ? '#0f172a' : '#ffffff'}
                          strokeWidth={strokeW}
                          paintOrder="stroke"
                          opacity={c.isMajor ? '0.94' : '0.86'}
                        >
                          {c.displayName}
                        </text>
                      );
                    })}
                </g>
              )}

              {/* 7. WAR ZONES & DISPUTED HOTSPOTS HIGHLIGHTED DIRECTLY ON MAP */}
              {showConflicts && (
                <g id={`conflicts_${offset}`}>
                  {activeConflicts.map((conflict) => {
                    const isActiveWar = conflict.type === 'active_war';
                    const isCritical = conflict.severity === 'critical';
                    const isSelected = selectedConflictId === conflict.id;
                    const isHovered = hoveredConflict?.id === conflict.id;
                    const glowColor =
                      isActiveWar || isCritical
                        ? 'url(#conflictGlowCritical)'
                        : 'url(#conflictGlowHigh)';
                    const hatchFill =
                      isActiveWar || isCritical
                        ? 'url(#conflictHatchRed)'
                        : 'url(#conflictHatchAmber)';
                    const primaryColor = isActiveWar || isCritical ? '#dc2626' : '#d97706';
                    const areaRadius = conflict.zoneRadius || 14;
                    const labelText = conflict.shortLabel || conflict.name.split(' (')[0];
                    const labelWidth = Math.max(46, Math.min(110, labelText.length * 3.1 + 10));

                    return (
                      <g
                        key={`conflict_${conflict.id}_${offset}`}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectConflict(conflict);
                        }}
                        onMouseEnter={() => setHoveredConflict(conflict)}
                        onMouseLeave={() => setHoveredConflict(null)}
                      >
                        {/* Shaded & Hatched War / Disputed Territorial Zone Perimeter */}
                        <ellipse
                          cx={conflict.center[0]}
                          cy={conflict.center[1]}
                          rx={isSelected || isHovered ? areaRadius * 1.25 : areaRadius}
                          ry={isSelected || isHovered ? areaRadius * 0.85 : areaRadius * 0.68}
                          fill={hatchFill}
                          stroke={primaryColor}
                          strokeWidth={isSelected || isHovered ? '1.3' : '0.85'}
                          strokeDasharray={isActiveWar ? '3 1.5' : '2 2'}
                          opacity={isSelected || isHovered ? '0.95' : '0.78'}
                        />

                        {/* Radar Pulse Halo */}
                        <circle
                          cx={conflict.center[0]}
                          cy={conflict.center[1]}
                          r={isSelected ? 20 : isHovered ? 16 : 12}
                          fill={glowColor}
                          className="animate-pulse opacity-90"
                        />

                        {/* Outer Dashed Tactical Ring */}
                        <circle
                          cx={conflict.center[0]}
                          cy={conflict.center[1]}
                          r={isSelected ? 9.5 : 6.2}
                          fill="none"
                          stroke={primaryColor}
                          strokeWidth="1.1"
                          strokeDasharray="2 1.8"
                        />

                        {/* Center Beacon */}
                        <circle
                          cx={conflict.center[0]}
                          cy={conflict.center[1]}
                          r={isSelected ? 3.6 : 2.5}
                          fill={primaryColor}
                          stroke="#ffffff"
                          strokeWidth="0.9"
                        />

                        {/* Tactical Reticle Crosshairs */}
                        <line
                          x1={conflict.center[0] - 4.5}
                          y1={conflict.center[1]}
                          x2={conflict.center[0] + 4.5}
                          y2={conflict.center[1]}
                          stroke="#ffffff"
                          strokeWidth="0.7"
                        />
                        <line
                          x1={conflict.center[0]}
                          y1={conflict.center[1] - 4.5}
                          x2={conflict.center[0]}
                          y2={conflict.center[1] + 4.5}
                          stroke="#ffffff"
                          strokeWidth="0.7"
                        />

                        {/* Toggleable On-Map Name Tag Below Each War Zone / Disputed Territory */}
                        {(showConflictNameTags || isHovered || isSelected) && (
                          <g pointerEvents="none">
                            <rect
                              x={conflict.center[0] - labelWidth / 2}
                              y={conflict.center[1] + (isSelected || isHovered ? 6.5 : 5)}
                              width={labelWidth}
                              height={isSelected || isHovered ? 13 : 8.5}
                              rx="2.2"
                              fill="#0f172a"
                              stroke={primaryColor}
                              strokeWidth={isSelected || isHovered ? '0.95' : '0.65'}
                              fillOpacity={isSelected || isHovered ? '0.96' : '0.84'}
                            />
                            <text
                              x={conflict.center[0]}
                              y={conflict.center[1] + (isSelected || isHovered ? 12.2 : 10.7)}
                              textAnchor="middle"
                              fill={isActiveWar ? '#fecaca' : '#fef08a'}
                              fontSize={isSelected || isHovered ? '4.8' : '4.2'}
                              fontWeight="bold"
                              letterSpacing="0.2"
                            >
                              {labelText}
                            </text>
                            {(isHovered || isSelected) && (
                              <text
                                x={conflict.center[0]}
                                y={conflict.center[1] + 17.5}
                                textAnchor="middle"
                                fill="#f8fafc"
                                fontSize="3.6"
                                fontWeight="bold"
                                letterSpacing="0.4"
                              >
                                {isActiveWar ? '▲ ACTIVE WAR ZONE' : '◆ DISPUTED TERRITORY'}
                              </text>
                            )}
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              )}

              {/* 7B. ARCHAEOLOGICAL SITES & HISTORICAL RUINS LAYER */}
              {showArchaeologicalSites && (
                <g id={`arch_sites_${offset}`}>
                  {activeArchaeologicalSites.map((site) => {
                    const isSelected = selectedArchSiteId === site.id;
                    const isHovered = hoveredArchSite?.id === site.id;
                    const isActiveMonumentInEra = currentYear <= site.peakEndYear;
                    const accentColor = isActiveMonumentInEra ? '#f59e0b' : '#d97706';
                    const badgeWidth = Math.max(
                      38,
                      Math.min(92, site.shortLabel.length * 2.75 + 10)
                    );

                    return (
                      <g
                        key={`arch_site_${site.id}_${offset}`}
                        transform={`translate(${site.svgCoords[0]}, ${site.svgCoords[1]})`}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectArchSite) {
                            onSelectArchSite(site);
                          }
                        }}
                        onMouseEnter={() => setHoveredArchSite(site)}
                        onMouseLeave={() => setHoveredArchSite(null)}
                      >
                        {/* Outer Selection / Hover Aura */}
                        {(isSelected || isHovered) && (
                          <circle
                            cx="0"
                            cy="0"
                            r={isSelected ? 10.5 : 8}
                            fill={accentColor}
                            fillOpacity="0.28"
                            stroke="#fef08a"
                            strokeWidth="0.8"
                            strokeDasharray="1.8 1.2"
                          />
                        )}

                        {/* Archaeological Medallion Base */}
                        <circle
                          cx="0"
                          cy="0"
                          r={isSelected || isHovered ? 4.4 : 3.3}
                          fill="#0f172a"
                          fillOpacity="0.92"
                          stroke={isSelected || isHovered ? '#fef08a' : accentColor}
                          strokeWidth={isSelected || isHovered ? '1.1' : '0.85'}
                        />

                        {/* Stepped Pyramid / Monumental Ruin Icon Inside Medallion */}
                        <polygon
                          points="0,-2.1 2.1,1.5 -2.1,1.5"
                          fill={isSelected || isHovered ? '#fef08a' : '#fbbf24'}
                        />
                        <line
                          x1="-1.5"
                          y1="1.9"
                          x2="1.5"
                          y2="1.9"
                          stroke="#fef08a"
                          strokeWidth="0.55"
                        />

                        {/* Site Name Tag (Toggled via Archaeological Site Tags switch, or shown on hover/select) */}
                        {(showArchSiteNameTags || isHovered || isSelected) && (
                          <g
                            transform={`translate(0, ${isSelected || isHovered ? -7.2 : -5.8})`}
                            pointerEvents="none"
                          >
                            <rect
                              x={-badgeWidth / 2}
                              y="-4.6"
                              width={badgeWidth}
                              height="6.4"
                              rx="1.8"
                              fill="#0f172a"
                              fillOpacity={isSelected || isHovered ? '0.95' : '0.82'}
                              stroke={isSelected || isHovered ? '#fef08a' : accentColor}
                              strokeWidth={isSelected || isHovered ? '0.75' : '0.5'}
                            />
                            <text
                              x="0"
                              y="-0.3"
                              textAnchor="middle"
                              fill={isSelected || isHovered ? '#fef08a' : '#fde68a'}
                              fontSize={isSelected || isHovered ? '3.5' : '3.0'}
                              fontWeight="bold"
                              letterSpacing="0.15"
                            >
                              {site.shortLabel}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              )}

              {/* 8. Focused Search Target Pin (Country, City, or Historical Figure Seat) */}
              {focusedSearchTarget && (
                <g
                  transform={`translate(${focusedSearchTarget.svgCoords[0]}, ${focusedSearchTarget.svgCoords[1]})`}
                >
                  <circle
                    cx="0"
                    cy="0"
                    r="14"
                    fill="#f59e0b"
                    fillOpacity="0.28"
                    className="animate-ping"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="9"
                    fill="#f59e0b"
                    fillOpacity="0.35"
                    stroke="#fbbf24"
                    strokeWidth="1"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="3.4"
                    fill="#f59e0b"
                    stroke="#0f172a"
                    strokeWidth="1.1"
                  />

                  <g transform="translate(0, -11)" pointerEvents="none">
                    <rect
                      x="-58"
                      y="-12"
                      width="116"
                      height="13.5"
                      rx="3"
                      fill="#0f172a"
                      fillOpacity="0.94"
                      stroke="#f59e0b"
                      strokeWidth="0.9"
                    />
                    <text
                      x="0"
                      y="-3.3"
                      textAnchor="middle"
                      fill="#fef08a"
                      fontSize="5.2"
                      fontWeight="bold"
                    >
                      {focusedSearchTarget.title} ({focusedSearchTarget.yearDisplay})
                    </text>
                  </g>
                </g>
              )}
            </g>
          ))}
        </svg>

        {/* Active Search Target Floating Banner */}
        {focusedSearchTarget && (
          <div
            className="absolute top-3.5 left-1/2 -translate-x-1/2 z-30 bg-slate-900/95 backdrop-blur-md border border-amber-500/70 rounded-xl px-3.5 py-2 shadow-2xl flex items-center gap-3 text-xs text-slate-100 max-w-md"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="min-w-0">
              <div className="font-bold text-amber-300 truncate">
                {focusedSearchTarget.title}{' '}
                <span className="text-[10px] font-mono text-sky-300 ml-1">
                  [{focusedSearchTarget.yearDisplay}]
                </span>
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {focusedSearchTarget.subtitle}
              </div>
            </div>
            {onClearSearchTarget && (
              <button
                onClick={onClearSearchTarget}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0 cursor-pointer"
                title="Dismiss Pin"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* FLOATING HOVER TOOLTIP FOR ALL LAYERS */}
        {(hoveredArchSite ||
          hoveredConflict ||
          hoveredTradeRoute ||
          hoveredCulturalHub ||
          hoveredMountain ||
          hoveredRiver ||
          hoveredPhysiographic ||
          hoveredOceanic ||
          (!showPhysicalTerrain && hoveredProfile)) && (
          <div
            className="absolute z-30 pointer-events-none bg-slate-900/95 backdrop-blur-md border border-slate-700/90 rounded-lg px-3.5 py-2.5 text-xs shadow-2xl max-w-sm transition-opacity duration-150 text-slate-100"
            style={{
              left: `${Math.min(
                mousePos.x + 18,
                (mapContainerRef.current?.clientWidth || 800) - 280
              )}px`,
              top: `${Math.min(
                mousePos.y + 18,
                (mapContainerRef.current?.clientHeight || 500) - 140
              )}px`
            }}
          >
            {hoveredArchSite ? (
              <div>
                <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-0.5 text-[13px]">
                  <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{hoveredArchSite.name}</span>
                </div>
                <div className="text-[10px] font-mono text-sky-300 mb-1">
                  {hoveredArchSite.siteType.toUpperCase()} · {hoveredArchSite.foundedDisplay}
                </div>
                <div className="text-[11px] text-slate-200 font-medium mb-1">
                  {hoveredArchSite.civilization} ({hoveredArchSite.modernCountry})
                </div>
                <p className="text-slate-300 text-[11px] leading-snug line-clamp-2 mb-1.5">
                  {hoveredArchSite.architecturalFeatures[0]}
                </p>
                <div className="pt-1 border-t border-slate-800 text-[10px] text-amber-400 flex items-center justify-between">
                  <span>
                    {currentYear <= hoveredArchSite.peakEndYear
                      ? 'Active Monument in Era'
                      : 'Historical Ruin / Site'}
                  </span>
                  <span className="font-semibold">Click for full site dossier →</span>
                </div>
              </div>
            ) : hoveredConflict ? (
              <div>
                <div className="flex items-center gap-1.5 text-red-400 font-semibold mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{hoveredConflict.name}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-tight mb-1">
                  {hoveredConflict.status}
                </p>
                <div className="text-[10px] text-slate-400">
                  <span>{hoveredConflict.region}</span> ·{' '}
                  <span className="text-red-400 font-medium uppercase">
                    {hoveredConflict.severity} SEVERITY
                  </span>
                </div>
              </div>
            ) : hoveredTradeRoute ? (
              <div>
                <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-0.5 text-[13px]">
                  <Route className="w-3.5 h-3.5 text-sky-400" />
                  <span>{hoveredTradeRoute.name}</span>
                </div>
                <div className="text-[10px] font-mono text-sky-300 mb-1">
                  {hoveredTradeRoute.type === 'maritime'
                    ? 'MARITIME SEA LANE'
                    : 'OVERLAND CARAVAN CORRIDOR'}{' '}
                  · {hoveredTradeRoute.eraLabel}
                </div>
                <p className="text-[11px] text-slate-300 leading-snug mb-1.5">
                  {hoveredTradeRoute.description}
                </p>
                <div className="text-[10px] text-slate-400 mb-1.5">
                  <strong className="text-amber-300">Key Goods:</strong>{' '}
                  {hoveredTradeRoute.commodities.slice(0, 5).join(', ')}
                </div>
                <div className="pt-1 border-t border-slate-800 text-[10px] text-amber-400 font-semibold">
                  Click for full trade route dossier →
                </div>
              </div>
            ) : hoveredCulturalHub ? (
              <div>
                <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-0.5 text-[13px]">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>{hoveredCulturalHub.name}</span>
                </div>
                <div className="text-[10px] font-mono text-emerald-300 mb-1">
                  {hoveredCulturalHub.culturalSphere} · {hoveredCulturalHub.role}
                </div>
                <p className="text-[11px] text-slate-300 leading-snug mb-1">
                  {hoveredCulturalHub.description}
                </p>
                <div className="text-[10px] text-slate-400 mb-1.5">
                  <strong className="text-amber-300">Exports & Legacy:</strong>{' '}
                  {hoveredCulturalHub.traditionsAndExports}
                </div>
                <div className="pt-1 border-t border-slate-800 text-[10px] text-amber-400 font-semibold">
                  Click for commercial hub dossier →
                </div>
              </div>
            ) : hoveredMountain ? (
              <div>
                <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-0.5 text-[13px]">
                  <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{hoveredMountain.name}</span>
                </div>
                <div className="text-[10px] font-mono text-emerald-300 mb-1">
                  Highest Peak: {hoveredMountain.highestPeak} · {hoveredMountain.lengthKm}
                </div>
                <p className="text-[11px] text-slate-300 leading-snug mb-1.5">
                  {hoveredMountain.historicalSignificance}
                </p>
                <div className="pt-1 border-t border-slate-800 text-[10px] text-emerald-400 font-semibold">
                  Click for general mountain range dossier →
                </div>
              </div>
            ) : hoveredRiver ? (
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sky-300 mb-0.5 text-[13px]">
                  <Waves className="w-3.5 h-3.5 text-sky-400" />
                  <span>{hoveredRiver.name}</span>
                </div>
                <div className="text-[10px] font-mono text-sky-400 mb-1">
                  Length: {hoveredRiver.lengthKm} · Outflow: {hoveredRiver.outflow}
                </div>
                <p className="text-[11px] text-slate-300 leading-snug mb-1.5">
                  {hoveredRiver.civilizationRole}
                </p>
                <div className="pt-1 border-t border-slate-800 text-[10px] text-sky-400 font-semibold">
                  Click for general river basin dossier →
                </div>
              </div>
            ) : hoveredPhysiographic ? (
              <div>
                <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-0.5 text-[13px]">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>{hoveredPhysiographic.name}</span>
                </div>
                <div className="text-[10px] font-mono text-amber-200 mb-1">
                  {hoveredPhysiographic.elevationOrClimate} · {hoveredPhysiographic.areaSqKm}
                </div>
                <p className="text-[11px] text-slate-300 leading-snug mb-1.5">
                  {hoveredPhysiographic.description}
                </p>
                <div className="pt-1 border-t border-slate-800 text-[10px] text-amber-400 font-semibold">
                  Click for general geographic dossier →
                </div>
              </div>
            ) : hoveredOceanic ? (
              <div>
                <div className="flex items-center gap-1.5 font-bold text-teal-300 mb-0.5 text-[13px]">
                  <Waves className="w-3.5 h-3.5 text-teal-400" />
                  <span>{hoveredOceanic.name}</span>
                </div>
                <div className="text-[10px] font-mono text-sky-300 mb-1">
                  {hoveredOceanic.type === 'trench'
                    ? 'DEEP OCEANIC HADAL TRENCH'
                    : 'MARINE CORAL REEF SYSTEM'}{' '}
                  · {hoveredOceanic.oceanBasin}
                </div>
                <div className="text-[10px] text-amber-200 font-medium mb-1">
                  {hoveredOceanic.maxDepthOrLength} · {hoveredOceanic.areaOrSpan}
                </div>
                <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 mb-1.5">
                  {hoveredOceanic.generalOverview}
                </p>
                <div className="pt-1 border-t border-slate-800 text-[10px] text-teal-400 font-semibold">
                  Click for general marine & bathymetric dossier →
                </div>
              </div>
            ) : !showPhysicalTerrain && hoveredProfile ? (
              <div>
                <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-0.5 text-[13px]">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>{hoveredProfile.entityName}</span>
                </div>
                {hoveredProfile.subRegionLabel ? (
                  <div className="text-[10px] text-amber-200/90 mb-1">
                    Historical Sub-Region:{' '}
                    <span className="font-semibold text-white">
                      {hoveredProfile.subRegionLabel}
                    </span>
                  </div>
                ) : (
                  hoveredCountry &&
                  hoveredCountry.name !== hoveredProfile.entityName && (
                    <div className="text-[10px] text-slate-400 mb-1">
                      Modern Geography:{' '}
                      <span className="text-slate-200">{hoveredCountry.name}</span>
                    </div>
                  )
                )}
                <div className="flex items-center gap-2 text-[10px] text-slate-300 mb-1">
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-sky-300 font-mono">
                    {yearString}
                  </span>
                  {hoveredProfile.isOpenSpace && (
                    <span className="text-emerald-400 font-medium">Indigenous Territory</span>
                  )}
                </div>
                {hoveredProfile.isOpenSpace || hoveredCountry?.name === 'Antarctica' ? (
                  (() => {
                    const credibleRecord = getCredibleIndigenousOrAntarcticRecord(
                      hoveredCountry?.name || '',
                      currentYear
                    );
                    return credibleRecord ? (
                      <p className="text-emerald-300 text-[10.5px] leading-snug mb-1">
                        <span className="font-semibold">Documented Record ({yearString}):</span>{' '}
                        {credibleRecord.headline}
                      </p>
                    ) : (
                      <p className="text-slate-400 italic text-[10.5px] leading-snug mb-1">
                        Not enough credible historical information to show for {yearString}.
                      </p>
                    );
                  })()
                ) : (
                  <>
                    {hoveredProfile.ruler && hoveredProfile.ruler !== 'None' && (
                      <p className="text-slate-300 text-[11px] leading-tight mb-0.5">
                        <span className="text-slate-400">Ruler:</span> {hoveredProfile.ruler}
                      </p>
                    )}
                    {hoveredProfile.capital && hoveredProfile.capital !== 'None' && (
                      <p className="text-slate-400 text-[10px]">
                        Capital: <span className="text-slate-200">{hoveredProfile.capital}</span>
                        {hoveredProfile.populationEstimate &&
                          ` · Pop: ${hoveredProfile.populationEstimate}`}
                      </p>
                    )}
                  </>
                )}
                <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-[10px] text-amber-400 flex items-center justify-between">
                  <span>Click to inspect territory details</span>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
