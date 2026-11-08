/**
 * High-precision simplified SVG paths for world landmasses and sovereign regions.
 * Coordinate space: 1000 x 520 (Equirectangular projection)
 */

export interface LandmassPath {
  id: string;
  name: string;
  d: string;
  defaultRegion?: string;
}

export const WORLD_BASE_LANDMASSES: LandmassPath[] = [
  // North America
  {
    id: 'north_america_main',
    name: 'North America',
    d: 'M 140,80 C 180,65 240,70 270,100 C 290,120 280,160 270,180 C 265,210 240,240 215,260 C 200,275 190,290 195,305 C 185,315 175,300 170,285 C 160,265 140,240 135,210 C 130,175 110,130 140,80 Z',
    defaultRegion: 'Americas'
  },
  // Alaska
  {
    id: 'alaska',
    name: 'Alaska',
    d: 'M 90,75 C 115,70 140,80 140,105 C 120,115 105,125 90,110 C 80,100 80,85 90,75 Z',
    defaultRegion: 'Americas'
  },
  // Greenland
  {
    id: 'greenland',
    name: 'Greenland',
    d: 'M 350,45 C 380,40 405,60 395,95 C 380,115 355,120 340,95 C 335,75 340,55 350,45 Z',
    defaultRegion: 'Americas / Arctic'
  },
  // South America
  {
    id: 'south_america',
    name: 'South America',
    d: 'M 255,275 C 285,270 320,290 350,320 C 370,350 365,390 340,430 C 315,465 295,495 285,490 C 270,470 270,430 265,380 C 260,340 240,305 255,275 Z',
    defaultRegion: 'Americas'
  },
  // Europe
  {
    id: 'europe',
    name: 'Europe',
    d: 'M 470,140 C 510,125 550,130 560,155 C 555,185 520,200 480,205 C 465,195 460,165 470,140 Z',
    defaultRegion: 'Eurasia'
  },
  // Scandinavia
  {
    id: 'scandinavia',
    name: 'Scandinavia',
    d: 'M 505,80 C 525,75 540,95 535,130 C 520,135 505,120 500,100 C 495,90 500,85 505,80 Z',
    defaultRegion: 'Europe'
  },
  // British Isles
  {
    id: 'british_isles',
    name: 'British Isles',
    d: 'M 475,145 C 488,140 495,150 490,165 C 480,172 472,165 475,145 Z M 462,150 C 470,148 472,158 468,165 C 460,168 458,158 462,150 Z',
    defaultRegion: 'Europe'
  },
  // Iberian Peninsula
  {
    id: 'iberia',
    name: 'Iberian Peninsula',
    d: 'M 455,200 C 480,195 490,210 485,230 C 465,235 450,225 455,200 Z',
    defaultRegion: 'Europe'
  },
  // Africa
  {
    id: 'africa',
    name: 'Africa',
    d: 'M 465,240 C 520,225 580,240 600,280 C 610,320 595,370 560,420 C 535,450 515,440 500,400 C 475,340 445,280 465,240 Z',
    defaultRegion: 'Africa'
  },
  // Madagascar
  {
    id: 'madagascar',
    name: 'Madagascar',
    d: 'M 625,380 C 632,375 638,390 635,415 C 628,425 620,410 625,380 Z',
    defaultRegion: 'Africa'
  },
  // Middle East / Arabia
  {
    id: 'arabia',
    name: 'Arabian Peninsula',
    d: 'M 590,245 C 615,240 635,260 630,290 C 615,305 595,300 585,280 C 580,265 585,250 590,245 Z',
    defaultRegion: 'Asia / Middle East'
  },
  // Northern Eurasia / Russia
  {
    id: 'russia_siberia',
    name: 'Northern Eurasia / Siberia',
    d: 'M 560,110 C 650,85 780,95 860,105 C 890,120 870,160 820,165 C 740,165 650,160 560,150 Z',
    defaultRegion: 'Eurasia'
  },
  // Central Asia
  {
    id: 'central_asia',
    name: 'Central Asia & Iranian Plateau',
    d: 'M 605,175 C 665,170 710,185 700,220 C 660,230 615,225 605,175 Z',
    defaultRegion: 'Asia'
  },
  // South Asia / Indian Subcontinent
  {
    id: 'india_subcontinent',
    name: 'Indian Subcontinent',
    d: 'M 680,225 C 720,220 740,245 735,280 C 720,310 700,320 685,290 C 675,265 675,245 680,225 Z',
    defaultRegion: 'Asia'
  },
  // East Asia / China
  {
    id: 'china_mainland',
    name: 'East Asia',
    d: 'M 740,175 C 810,170 855,190 850,240 C 825,270 780,270 745,240 C 735,210 735,190 740,175 Z',
    defaultRegion: 'Asia'
  },
  // Southeast Asia & Indochina
  {
    id: 'southeast_asia',
    name: 'Southeast Asia',
    d: 'M 755,255 C 785,255 795,285 780,315 C 765,335 750,305 755,255 Z',
    defaultRegion: 'Asia'
  },
  // Japan
  {
    id: 'japan',
    name: 'Japanese Archipelago',
    d: 'M 875,195 C 885,195 892,215 885,235 C 878,245 870,230 872,210 Z',
    defaultRegion: 'Asia'
  },
  // Maritime Southeast Asia / Indonesia / Philippines
  {
    id: 'indonesia_maritime',
    name: 'Maritime Southeast Asia',
    d: 'M 760,335 C 800,330 840,340 850,360 C 830,375 780,370 760,350 Z M 815,260 C 825,260 830,280 825,300 C 815,300 812,280 815,260 Z',
    defaultRegion: 'Oceania'
  },
  // Australia
  {
    id: 'australia',
    name: 'Australia',
    d: 'M 810,380 C 870,365 920,385 915,440 C 885,470 830,465 795,435 C 785,410 795,390 810,380 Z',
    defaultRegion: 'Oceania'
  },
  // New Zealand
  {
    id: 'new_zealand',
    name: 'New Zealand',
    d: 'M 935,455 C 945,450 950,470 942,490 C 935,490 930,475 935,455 Z',
    defaultRegion: 'Oceania'
  }
];
