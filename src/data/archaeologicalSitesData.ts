import { projectCoordinates } from './geoService';
import { getGeopoliticalEra } from './historicalErasGeo';

export interface ArchaeologicalSite {
  id: string;
  name: string;
  shortLabel: string;
  modernCountry: string;
  region: string;
  civilization: string;
  siteType:
    | 'Monumental Necropolis'
    | 'Ancient Metropolis'
    | 'Sacred Temple Complex'
    | 'Imperial Citadel & Palace'
    | 'Rock-Cut Sanctuary'
    | 'Prehistoric Megalith';
  foundedYear: number;
  foundedDisplay: string;
  peakStartYear: number;
  peakEndYear: number;
  rediscoveryOrExcavationYear: number;
  coordinates: [number, number]; // [lon, lat]
  svgCoords: [number, number];
  unescoStatus: string;
  architecturalFeatures: string[];
  keyArtifacts: string[];
  generalOverview: string;
  excavationAndDiscoveryHistory: string;
}

export interface ArchaeologicalSiteYearDossier {
  site: ArchaeologicalSite;
  year: number;
  yearDisplay: string;
  epochName: string;
  statusInYear: 'Active Era Monument' | 'Ancient Historical Ruin' | 'Excavated Archaeological Site';
  yearHeadline: string;
  yearDetailedNarrative: string;
  yearMajorEvents: string[];
  preservationAndCulturalState: string;
}

interface RawArchaeologicalSite {
  id: string;
  name: string;
  shortLabel: string;
  modernCountry: string;
  region: string;
  civilization: string;
  siteType: ArchaeologicalSite['siteType'];
  foundedYear: number;
  foundedDisplay: string;
  peakStartYear: number;
  peakEndYear: number;
  rediscoveryOrExcavationYear: number;
  coordinates: [number, number];
  unescoStatus: string;
  architecturalFeatures: string[];
  keyArtifacts: string[];
  generalOverview: string;
  excavationAndDiscoveryHistory: string;
}

const RAW_ARCHAEOLOGICAL_SITES: RawArchaeologicalSite[] = [
  {
    id: 'arch_gobekli_tepe',
    name: 'Göbekli Tepe & Karahan Tepe Sanctuary',
    shortLabel: 'Göbekli Tepe',
    modernCountry: 'Turkey',
    region: 'Southeastern Anatolia (Upper Mesopotamia)',
    civilization: 'Pre-Pottery Neolithic Anatolia',
    siteType: 'Prehistoric Megalith',
    foundedYear: -3000, // Built c. 9500 BCE; present across the entire 3000 BCE – 2026 CE timeline
    foundedDisplay: 'c. 9500 BCE',
    peakStartYear: -3000,
    peakEndYear: -2500,
    rediscoveryOrExcavationYear: 1994,
    coordinates: [38.922, 37.223],
    unescoStatus: 'UNESCO World Heritage Site (Inscribed 2018)',
    architecturalFeatures: [
      'Circular megalithic enclosures (Enclosures A–D) built from T-shaped limestone pillars up to 5.5 meters tall',
      'High-relief carvings of wild boars, foxes, vultures, scorpions, and abstract human anthropomorphic arms',
      'Deliberately backfilled prehistoric ritual chambers predating pottery, metallurgy, and settled agriculture'
    ],
    keyArtifacts: [
      'Pillars 18 and 43 ("Vulture Stone") with complex astronomical and mythological reliefs',
      'Life-sized limestone human statue ("The Urfa Man") and carved stone masks',
      'Thousands of knapped obsidian and flint arrowheads and animal bone feasting deposits'
    ],
    generalOverview:
      'Located in the Germuş Mountains of southeastern Anatolia near Şanlıurfa, **Göbekli Tepe** is the world’s oldest known monumental megalithic sanctuary (constructed c. 9500–8000 BCE). Built by hunter-gatherer communities more than 6,000 years before Stonehenge and the Great Pyramids of Giza, its massive T-shaped limestone pillars overturned conventional archaeological models by proving that organized monumental religion and communal engineering preceded the invention of agriculture and permanent cities.',
    excavationAndDiscoveryHistory:
      'First noted in a 1963 archaeological survey by Istanbul University and the University of Chicago, the site’s true prehistoric antiquity was recognized in **1994** by German archaeologist **Klaus Schmidt** of the German Archaeological Institute (DAI).Ongoing excavations since 1995 using ground-penetrating radar have revealed over 20 megalithic rings, of which only a fraction have been uncovered.'
  },
  {
    id: 'arch_giza_pyramids',
    name: 'Pyramids of Giza, Great Sphinx & Memphis Necropolis',
    shortLabel: 'Pyramids of Giza',
    modernCountry: 'Egypt',
    region: 'Lower Egypt (Nile Delta Apex)',
    civilization: 'Old Kingdom Ancient Egypt (Fourth Dynasty)',
    siteType: 'Monumental Necropolis',
    foundedYear: -2580,
    foundedDisplay: 'c. 2580–2510 BCE',
    peakStartYear: -2580,
    peakEndYear: -1070,
    rediscoveryOrExcavationYear: 1880,
    coordinates: [31.134, 29.979],
    unescoStatus: 'UNESCO World Heritage Site (Inscribed 1979)',
    architecturalFeatures: [
      'Great Pyramid of Khufu (146.6m original height, 2.3 million limestone and granite blocks)',
      'Pyramids of Khafre and Menkaure aligned with cardinal astronomical precision',
      'Monolithic Great Sphinx of Giza carved from the bedrock of the Giza Plateau',
      'Valley Temples, causeways, and rock-cut solar barque pits'
    ],
    keyArtifacts: [
      'Khufu Cedarwood Solar Barque (43.6-meter intact ritual vessel discovered in 1954)',
      'Diorite Statue of Pharaoh Khafre enthroned with the Falcon God Horus',
      'Diary of Merer (4,500-year-old papyrus logbook detailing Tura limestone transport to Giza)',
      'Inventory Stela and Dream Stela of Thutmose IV between the paws of the Sphinx'
    ],
    generalOverview:
      'Towering over the western bank of the Nile near ancient Memphis and modern Cairo, the **Giza Pyramid Complex** represents the pinnacle of Old Kingdom Egyptian statecraft, geometry, and logistics. Constructed during the Fourth Dynasty under Pharaohs **Khufu, Khafre, and Menkaure** (c. 2580–2510 BCE), the Great Pyramid remained the tallest human-made structure on Earth for over 3,800 years and is the only surviving monument of the Seven Wonders of the Ancient World.',
    excavationAndDiscoveryHistory:
      'Revered and studied even in antiquity by New Kingdom pharaohs (such as Thutmose IV, who cleared sand from the Sphinx in c. 1400 BCE) and described by Herodotus in 450 BCE, modern scientific surveying began with **Flinders Petrie** in 1880, followed by **George Reisner**, **Selim Hassan**, and **Zahi Hawass**, uncovering the Pyramid Builders’ Workmen’s Village and proving the monuments were built by skilled, state-fed Egyptian labor corps rather than slaves.'
  },
  {
    id: 'arch_ur_ziggurat',
    name: 'Royal Tombs & Great Ziggurat of Ur (Tell el-Muqayyar)',
    shortLabel: 'Ziggurat of Ur',
    modernCountry: 'Iraq',
    region: 'Lower Mesopotamia (Euphrates Plain)',
    civilization: 'Sumerian & Neo-Sumerian (Ur III) Empire',
    siteType: 'Sacred Temple Complex',
    foundedYear: -2900,
    foundedDisplay: 'c. 2900–2100 BCE',
    peakStartYear: -2900,
    peakEndYear: -1750,
    rediscoveryOrExcavationYear: 1922,
    coordinates: [46.103, 30.962],
    unescoStatus: 'UNESCO World Heritage Site (The Ahwar of Southern Iraq, 2016)',
    architecturalFeatures: [
      'Great Ziggurat of Ur (Etemenniguru) built by King Ur-Nammu and Shulgi in honor of the moon god Nanna',
      'Royal Cemetery of Ur containing 16 monumental Early Dynastic royal shaft graves',
      'Mudbrick vaulted chambers, monumental triple-staircase facade, and baked-brick bitumen waterproofing'
    ],
    keyArtifacts: [
      'Standard of Ur (lapis lazuli and shell mosaic depicting "War" and "Peace" panels)',
      'Golden Lyre of Ur (Bull-headed ceremonial harp) and Queen Puabi’s Golden Headdress',
      'Ram in a Thicket statuette (gold leaf, copper, lapis lazuli, and shell)',
      'Tens of thousands of cuneiform administrative, legal, and literary clay tablets'
    ],
    generalOverview:
      'Once a bustling coastal metropolis near the ancient mouth of the Euphrates on the Persian Gulf, **Ur** was one of the most powerful Sumerian city-states of Mesopotamia. Reaching its imperial zenith during the **Third Dynasty of Ur (c. 2112–2004 BCE)** under **Ur-Nammu** (author of the world’s oldest surviving law code), the city was dominated by the stepped **Great Ziggurat of Ur** before gradual shifts in the Euphrates river course and Elamite invasions led to its abandonment by the 4th century BCE.',
    excavationAndDiscoveryHistory:
      'First identified from inscribed bricks by British consul J.E. Taylor in 1854, Ur was famously excavated between **1922 and 1934** by a joint expedition of the British Museum and the University of Pennsylvania led by **Sir Leonard Woolley**, whose discovery of the intact Royal Tombs of Ur stunned the world.'
  },
  {
    id: 'arch_mohenjo_daro',
    name: 'Mohenjo-daro & Harappa (Indus Valley Metropolis)',
    shortLabel: 'Mohenjo-daro',
    modernCountry: 'Pakistan',
    region: 'Sindh & Punjab (Indus River Basin)',
    civilization: 'Indus Valley (Harappan) Civilization',
    siteType: 'Ancient Metropolis',
    foundedYear: -2600,
    foundedDisplay: 'c. 2600 BCE',
    peakStartYear: -2600,
    peakEndYear: -1900,
    rediscoveryOrExcavationYear: 1922,
    coordinates: [68.138, 27.324],
    unescoStatus: 'UNESCO World Heritage Site (Inscribed 1980)',
    architecturalFeatures: [
      'The Great Bath (earliest public waterproofed brick water tank in the ancient world)',
      'Rectilinear grid street network with covered subterranean brick sewers and private indoor wells/bathrooms',
      'Raised Western Citadel Mound, Great Granary, Pillared Assembly Hall, and standardized kiln-fired brick architecture'
    ],
    keyArtifacts: [
      'The "Priest-King" steatite sculpture wearing a trefoil-patterned robe and headband',
      'The "Dancing Girl" of Mohenjo-daro (lost-wax cast bronze statuette)',
      'Over 4,000 carved steatite stamp seals bearing the undeciphered Indus script and unicorn/bull motifs',
      'Standardized cubical chert weights and carnelian bead jewelry traded to Mesopotamia'
    ],
    generalOverview:
      '**Mohenjo-daro** ("Mound of the Dead Men") in Sindh, Pakistan, alongside **Harappa** in Punjab, was the largest urban metropolis of the Bronze Age **Indus Valley Civilization** (c. 2600–1900 BCE), housing an estimated 40,000 residents. Unlike contemporaneous Mesopotamian and Egyptian cities dominated by royal palaces and temples, Mohenjo-daro was an egalitarian triumph of civic engineering—featuring world-first municipal sanitation, covered drainage systems, and standardized weights across a million square kilometers.',
    excavationAndDiscoveryHistory:
      'Abandoned around 1900 BCE following hydrological shifts in the Indus and Ghaggar-Hakra river systems, the ruins lay forgotten until **R. D. Banerji** of the Archaeological Survey of India recognized their pre-Buddhist antiquity in **1922**, followed by major excavations under **Sir John Marshall**, **Ernest Mackay**, and **Mortimer Wheeler**.'
  },
  {
    id: 'arch_stonehenge',
    name: 'Stonehenge & Avebury Megalithic Landscape',
    shortLabel: 'Stonehenge',
    modernCountry: 'United Kingdom',
    region: 'Salisbury Plain, Wiltshire (Southern England)',
    civilization: 'Neolithic & Bronze Age Britain',
    siteType: 'Prehistoric Megalith',
    foundedYear: -3000,
    foundedDisplay: 'c. 3000–2500 BCE',
    peakStartYear: -3000,
    peakEndYear: -1500,
    rediscoveryOrExcavationYear: 1666,
    coordinates: [-1.826, 51.178],
    unescoStatus: 'UNESCO World Heritage Site (Inscribed 1986)',
    architecturalFeatures: [
      'Concentric ring of 25-ton Sarsen sandstones capped by mortise-and-tenon horizontal lintels',
      'Inner horseshoe of Welsh Preseli Bluestones transported over 240 km from Pembrokeshire',
      'Solstice-aligned Avenue, Heel Stone, Aubrey Holes, and surrounding Bronze Age round barrow cemetery'
    ],
    keyArtifacts: [
      'The Amesbury Archer burial & Bush Barrow Gold Lozenge breastplate and bronze daggers',
      '6-ton Scottish Sandstone Altar Stone (recently traced via geochemical fingerprinting to northeastern Scotland)',
      'Neolithic antler picks, Grooved Ware pottery from Durrington Walls, and cremated elite remains'
    ],
    generalOverview:
      'Rising on Salisbury Plain in Wiltshire, **Stonehenge** is the most sophisticated prehistoric stone circle in the world, constructed in multiple stages between **3000 BCE** (initial circular ditch and Aubrey Holes) and **2500 BCE** (erection of the giant sarsen trilithons). Engineered using woodworking-style mortise-and-tenon and tongue-and-groove joints carved in solid stone, the monument aligns precisely with the sunrise of the summer solstice and sunset of the winter solstice.',
    excavationAndDiscoveryHistory:
      'Studied by antiquarians **John Aubrey (1666)** and **William Stukeley (1740)**, scientific excavations in the 20th and 21st centuries—including the Stonehenge Riverside Project led by **Mike Parker Pearson**—revealed the nearby settlement of Durrington Walls where the builders lived and feasted.'
  },
  {
    id: 'arch_knossos_mycenae',
    name: 'Palace of Knossos & Citadel of Mycenae',
    shortLabel: 'Knossos & Mycenae',
    modernCountry: 'Greece',
    region: 'Crete & the Peloponnese (Aegean Basin)',
    civilization: 'Minoan & Mycenaean Bronze Age Greece',
    siteType: 'Imperial Citadel & Palace',
    foundedYear: -1950,
    foundedDisplay: 'c. 1950–1250 BCE',
    peakStartYear: -1950,
    peakEndYear: -1180,
    rediscoveryOrExcavationYear: 1876,
    coordinates: [25.163, 35.298],
    unescoStatus: 'UNESCO World Heritage Site (Minoan Palatial Centres & Mycenae)',
    architecturalFeatures: [
      'Labyrinthine 1,300-room Minoan Palace of Knossos with multi-story lightwells, frescoed halls, and terracotta plumbing',
      'Cyclopean stone walls, Lion Gate relief, and subterranean beehive Tholos Tombs ("Treasury of Atreus") at Mycenae',
      'Central ceremonial courtyard for Minoan bull-leaping rituals and royal throne room'
    ],
    keyArtifacts: [
      'Golden "Mask of Agamemnon" from Shaft Grave V at Mycenae',
      'Bull-Leaping Fresco, Prince of the Lilies, and Faience Snake Goddess figurines from Knossos',
      'Thousands of Linear A and Linear B clay administrative tablets (deciphered by Michael Ventris in 1952 as earliest Greek)'
    ],
    generalOverview:
      '**Knossos** on Crete and **Mycenae** on the Greek mainland were the twin capitals of Europe’s first Bronze Age civilizations (c. 2000–1180 BCE). Knossos served as the ceremonial and administrative heart of the maritime **Minoan thalassocracy** (remembered in Greek myth as the labyrinth of King Minos), while fortified Mycenae led the warrior kingdoms of Late Bronze Age Greece before the Late Bronze Age Collapse around 1180 BCE.',
    excavationAndDiscoveryHistory:
      '**Heinrich Schliemann** excavated the royal Shaft Graves of Mycenae in **1876**, while British archaeologist **Sir Arthur Evans** purchased and excavated the site of Knossos starting in **1900**, uncovering the sprawling Minoan palace complex and Linear B archives.'
  },
  {
    id: 'arch_luxor_karnak',
    name: 'Karnak, Luxor & Valley of the Kings (Ancient Thebes)',
    shortLabel: 'Karnak & Valley of Kings',
    modernCountry: 'Egypt',
    region: 'Upper Egypt (Nile Valley)',
    civilization: 'Middle & New Kingdom Ancient Egypt',
    siteType: 'Sacred Temple Complex',
    foundedYear: -2000,
    foundedDisplay: 'c. 2000–1070 BCE',
    peakStartYear: -1550,
    peakEndYear: -664,
    rediscoveryOrExcavationYear: 1922,
    coordinates: [32.657, 25.718],
    unescoStatus: 'UNESCO World Heritage Site (Ancient Thebes with its Necropolis, 1979)',
    architecturalFeatures: [
      'Great Hypostyle Hall of Karnak with 134 massive sandstone papyrus columns up to 21 meters tall',
      '62 rock-cut royal tombs in the Valley of the Kings (including KV62 of Tutankhamun and KV17 of Seti I)',
      'Terraced Mortuary Temple of Queen Hatshepsut at Deir el-Bahari and Colossi of Memnon'
    ],
    keyArtifacts: [
      'Solid gold funerary mask and nested coffins of Pharaoh Tutankhamun (11 kg of burnished gold inlaid with lapis lazuli)',
      'Karnak Royal Annals of Thutmose III and Battle of Kadesh reliefs of Ramesses II',
      'Granite obelisks of Hatshepsut and Thutmose I and Avenue of Sphinxes'
    ],
    generalOverview:
      'Known to the ancient Egyptians as *Waset* and to the Greeks as **hundred-gated Thebes**, the monumental complex of **Karnak, Luxor, and the Valley of the Kings** served as the religious and imperial capital of Egypt during the Middle and New Kingdoms (c. 2055–1070 BCE). Across 1,500 years, over thirty pharaohs expanded the Temple of Amun-Ra at Karnak into the largest religious complex ever constructed in antiquity.',
    excavationAndDiscoveryHistory:
      'Systematically documented during the 1798–1801 French scientific expedition and by Jean-François Champollion, the Theban necropolis yielded the most famous archaeological discovery of the 20th century on **November 4, 1922**, when **Howard Carter** and Lord Carnarvon uncovered the nearly intact tomb of **Pharaoh Tutankhamun (KV62)** containing over 5,000 artifacts.'
  },
  {
    id: 'arch_babylon_nineveh',
    name: 'Babylon (Ishtar Gate) & Nineveh Royal Library',
    shortLabel: 'Babylon & Ishtar Gate',
    modernCountry: 'Iraq',
    region: 'Central & Upper Mesopotamia',
    civilization: 'Babylonian & Neo-Assyrian Empires',
    siteType: 'Ancient Metropolis',
    foundedYear: -1894,
    foundedDisplay: 'c. 1894–539 BCE',
    peakStartYear: -1792,
    peakEndYear: -331,
    rediscoveryOrExcavationYear: 1899,
    coordinates: [44.421, 32.542],
    unescoStatus: 'UNESCO World Heritage Site (Inscribed 2019)',
    architecturalFeatures: [
      'Glazed cobalt-blue brick Ishtar Gate and Processional Way adorned with reliefs of dragons (mushhushshu) and bulls (aurochs)',
      'Etemenanki Ziggurat (the 91-meter-tall stepped tower of Marduk associated with the biblical Tower of Babel)',
      'Southern Palace of Nebuchadnezzar II where Alexander the Great died in 323 BCE'
    ],
    keyArtifacts: [
      'Basalt Stele of the Code of Hammurabi (282 laws inscribed in Akkadian cuneiform, c. 1750 BCE)',
      'The Cyrus Cylinder (539 BCE clay proclamation by Cyrus the Great discovered in the Esagila temple of Babylon)',
      'Library of Ashurbanipal at Nineveh (30,000+ cuneiform tablets including the Epic of Gilgamesh)'
    ],
    generalOverview:
      'Situated on the Euphrates River south of modern Baghdad, **Babylon** rose to global prominence twice: first under **King Hammurabi (r. 1792–1750 BCE)** of the Old Babylonian Empire, and again under **Nebuchadnezzar II (r. 605–562 BCE)** of the Neo-Babylonian Empire, when it became the largest walled city on Earth (~200,000 inhabitants). Together with the Assyrian metropolis of **Nineveh** in northern Iraq, its ruins preserved the literary, astronomical, and legal foundations of Mesopotamian civilization.',
    excavationAndDiscoveryHistory:
      'Nineveh was excavated by **Austen Henry Layard** and **Hormuzd Rassam** in the 1840s–1850s (uncovering the Royal Library of Ashurbanipal and the Cyrus Cylinder in 1879), while Babylon was systematically excavated from **1899 to 1917** by German archaeologist **Robert Koldewey**, who reconstructed the glazed Ishtar Gate.'
  },
  {
    id: 'arch_persepolis',
    name: 'Persepolis (Takht-e Jamshid) & Naqsh-e Rostam',
    shortLabel: 'Persepolis',
    modernCountry: 'Iran',
    region: 'Fars Province (Zagros Plateau)',
    civilization: 'Achaemenid Persian Empire',
    siteType: 'Imperial Citadel & Palace',
    foundedYear: -518,
    foundedDisplay: '518 BCE',
    peakStartYear: -518,
    peakEndYear: -330,
    rediscoveryOrExcavationYear: 1931,
    coordinates: [52.891, 29.935],
    unescoStatus: 'UNESCO World Heritage Site (Inscribed 1979)',
    architecturalFeatures: [
      'The Apadana Palace (Audience Hall of Darius I and Xerxes I with 72 colossal fluted stone columns)',
      'Gate of All Nations guarded by monolithic winged human-headed bulls (Lamassu)',
      'Eastern Staircase friezes depicting delegates of 23 subject nations bearing tribute to the King of Kings',
      'Rock-cut cruciform royal tombs of Darius I, Xerxes I, Artaxerxes I, and Darius II at Naqsh-e Rostam'
    ],
    keyArtifacts: [
      'Persepolis Fortification and Treasury Archive (30,000+ Elamite and Aramaic clay tablets detailing royal rations and worker wages)',
      'Gold and silver Foundation Tablets of Darius the Great in Old Persian, Elamite, and Babylonian',
      'Monumental double-bull and griffin column capitals'
    ],
    generalOverview:
      'Founded in **518 BCE** by **Darius the Great** and expanded by **Xerxes I** and **Artaxerxes I**, **Persepolis** (*Parsa* / *Takht-e Jamshid*) was the ceremonial capital and treasury of the **Achaemenid Persian Empire**. Built atop a massive artificial limestone terrace at the foot of Mount Rahmat, the palace complex showcased cosmopolitan imperial harmony until **330 BCE**, when **Alexander the Great** captured and burned the wooden cedar roofs of the palaces—paradoxically baking and preserving thousands of clay administrative tablets in the ashes.',
    excavationAndDiscoveryHistory:
      'Scientific excavation of Persepolis was launched in **1931** by the Oriental Institute of the University of Chicago under **Ernst Herzfeld** and **Erich Schmidt**, uncovering the pristine Apadana staircase reliefs (buried beneath protective ash and rubble for 2,200 years) and the Persepolis Fortification Archive.'
  },
  {
    id: 'arch_athens_acropolis',
    name: 'The Acropolis of Athens',
    shortLabel: 'Acropolis',
    modernCountry: 'Greece',
    region: 'Athens, Attica',
    civilization: 'Classical Athens & Ancient Greece',
    siteType: 'Sacred Temple Complex',
    foundedYear: -500,
    foundedDisplay: '447–406 BCE (Periclean Golden Age; Mycenaean Citadel c. 1300 BCE)',
    peakStartYear: -500,
    peakEndYear: 395,
    rediscoveryOrExcavationYear: 1834,
    coordinates: [23.726, 37.971],
    unescoStatus: 'UNESCO World Heritage Site (Inscribed 1987)',
    architecturalFeatures: [
      'The Parthenon (Pentelic marble Doric temple dedicated to Athena Parthenos, designed by Ictinus and Callicrates with sculptures by Phidias)',
      'The Erechtheion with its iconic Porch of the Caryatids (six sculpted maiden columns overlooking the sacred olive tree of Athena)',
      'Monumental Propylaea marble gateway, Temple of Athena Nike, and the Theater of Dionysus & Odeon of Herodes Atticus on the southern slope'
    ],
    keyArtifacts: [
      'Parthenon Marbles & Panathenaic Procession Frieze (160-meter-long sculpted Pentelic marble relief)',
      'Caryatid marble statues and Archaic painted Korai and Kouroi sculptures from the Perserschutt deposit (buried after 480 BCE)',
      'Athena Nike parapet reliefs ("Nike Adjusting Her Sandal") and the Moschophoros (Calf-Bearer) statue housed in the Acropolis Museum'
    ],
    generalOverview:
      'Crowning a flat-topped limestone citadel 150 meters above **Athens**, the **Acropolis** was fortified during the Mycenaean Bronze Age and rebuilt in monumental Pentelic marble during the 5th-century BCE Golden Age of **Pericles** after the Persian sack of 480 BCE. Combining Doric and Ionic architectural orders with subtle optical refinements (*entasis*), the **Parthenon**, **Erechtheion**, **Propylaea**, and **Temple of Athena Nike** stand as the supreme architectural monument of Classical Greek democracy, philosophy, drama, and civic identity.',
    excavationAndDiscoveryHistory:
      'Converted sequentially into a Byzantine Christian cathedral (Cathedral of Our Lady of Athens), a Frankish ducal cathedral, and an Ottoman mosque before suffering a catastrophic gunpowder explosion during the Venetian siege of 1687, systematic archaeological conservation and excavation of the Acropolis began in **1834** under Leo von Klenze and Panagiotis Kavvadias, continuing today under the Acropolis Restoration Service (YSMA).'
  },
  {
    id: 'arch_great_wall_china',
    name: 'The Great Wall of China (Wanli Changcheng)',
    shortLabel: 'The Great Wall',
    modernCountry: 'China',
    region: 'Northern China (Badaling, Mutianyu, Shanhaiguan & Jiayuguan)',
    civilization: 'Warring States, Qin, Han & Ming Dynasties',
    siteType: 'Imperial Citadel & Palace',
    foundedYear: -500,
    foundedDisplay: 'c. 7th Century BCE – 221 BCE (Qin) & 1368–1644 CE (Ming)',
    peakStartYear: -221,
    peakEndYear: 1644,
    rediscoveryOrExcavationYear: 1957,
    coordinates: [116.57, 40.432],
    unescoStatus: 'UNESCO World Heritage Site (Inscribed 1987)',
    architecturalFeatures: [
      'Over 21,196 kilometers of integrated frontier walls, rammed-earth ramparts, kiln-fired brick battlements, and mountain ridge fortifications',
      'Thousands of crenellated watchtowers, smoke-and-fire beacon towers (Fengsui), garrison fortresses, and fortified mountain passes',
      'Strategic command passes from Shanhaiguan ("First Pass Under Heaven" on the Bohai Sea) and Badaling/Mutianyu north of Beijing to Jiayuguan Fort in the Gobi Desert'
    ],
    keyArtifacts: [
      'Qin and Han Dynasty bamboo and wooden military dispatch slips (Jian) unearthed at Dunhuang and Juyan frontier beacon towers',
      'Ming Dynasty inscribed kiln bricks stamped with artisan names, military garrison units, and production years (15th–17th centuries)',
      'Cast-iron and bronze Folangji (breech-loading swivel cannons), crossbows, iron caltrops, and stone tablets commemorating Imperial General Qi Jiguang'
    ],
    generalOverview:
      'Known in Chinese as **Wanli Changcheng** ("The Ten-Thousand-Li Long Wall"), **The Great Wall of China** is the largest military engineering work in human history. Originating as regional rammed-earth border walls during the **Spring and Autumn and Warring States periods (7th–3rd centuries BCE)**, the fortifications were linked into a unified northern defensive barrier by China’s First Emperor, **Qin Shi Huang**, in **221–210 BCE** under General **Meng Tian**, extended across the Hexi Corridor by the **Han Dynasty** to protect the Silk Road, and reconstructed in monumental stone and brick with thousands of watchtowers by the **Ming Dynasty (1368–1644 CE)**.',
    excavationAndDiscoveryHistory:
      'Following centuries of frontier warfare and natural erosion, modern scientific archaeological conservation and restoration began in **1957** at **Badaling** and **Mutianyu**, followed by a comprehensive nationwide radar, GPS, and archaeological survey by China’s State Administration of Cultural Heritage (2007–2012) that mapped 21,196 kilometers of Qin, Han, and Ming wall sections.'
  },
  {
    id: 'arch_terracotta_army',
    name: 'Mausoleum of Qin Shi Huang & The Terracotta Army',
    shortLabel: 'Terracotta Army',
    modernCountry: 'China',
    region: 'Xi’an (Chang’an), Shaanxi Province',
    civilization: 'Qin Dynasty (First Imperial Unification of China)',
    siteType: 'Monumental Necropolis',
    foundedYear: -246,
    foundedDisplay: '246–208 BCE',
    peakStartYear: -246,
    peakEndYear: -206,
    rediscoveryOrExcavationYear: 1974,
    coordinates: [109.278, 34.384],
    unescoStatus: 'UNESCO World Heritage Site (Inscribed 1987)',
    architecturalFeatures: [
      '56-square-kilometer subterranean imperial necropolis modeled on the Qin capital of Xianyang',
      'Four massive subterranean vaulted pits housing over 8,000 life-sized terracotta soldiers, chariots, and warhorses',
      'Unexcavated central pyramidal burial mound of China’s First Emperor, recorded by Sima Qian as containing liquid mercury rivers'
    ],
    keyArtifacts: [
      'Over 8,000 individually sculpted life-sized terracotta infantrymen, archers, generals, and cavalry steeds',
      'Two half-life-sized painted bronze quadriga chariots composed of 3,400+ precision cast parts',
      '40,000+ real bronze crossbows, triggers, swords, and halberds preserved with chromium-oxide anti-rust treatment'
    ],
    generalOverview:
      'Constructed over 38 years by more than 700,000 conscripted artisans for **Qin Shi Huang (259–210 BCE)**—the First Emperor who unified China in **221 BCE**—this vast subterranean necropolis near Xi’an was designed to guard the emperor in the afterlife. Every single terracotta warrior features unique facial features, hairstyles, and rank insignia reflecting the real standing army that unified the Warring States.',
    excavationAndDiscoveryHistory:
      'Completely forgotten above ground for over two millennia, the Terracotta Army was discovered on **March 29, 1974**, by local farmers digging a well near Mount Li in Lintong District, Shaanxi, launching one of the greatest archaeological excavations of the modern era.'
  },
  {
    id: 'arch_petra',
    name: 'Petra (Raqmu) — Nabataean Rock-Cut Capital',
    shortLabel: 'Petra',
    modernCountry: 'Jordan',
    region: 'Wadi Araba & Southern Levant',
    civilization: 'Nabataean Kingdom & Roman Arabia Petraea',
    siteType: 'Rock-Cut Sanctuary',
    foundedYear: -312,
    foundedDisplay: 'c. 312 BCE – 106 CE',
    peakStartYear: -312,
    peakEndYear: 363,
    rediscoveryOrExcavationYear: 1812,
    coordinates: [35.444, 30.328],
    unescoStatus: 'UNESCO World Heritage Site (Inscribed 1985)',
    architecturalFeatures: [
      'Al-Khazneh ("The Treasury") and Ad-Deir ("The Monastery") carved directly into rose-red sandstone cliffs',
      '1.2-kilometer narrow Siq gorge lined with terracotta water conduits, flash-flood dams, and rock-cut cisterns',
      'Roman-Nabataean Colonnaded Street, Great Temple, Qasr al-Bint, and 7,000-seat rock-hewn theater'
    ],
    keyArtifacts: [
      'Nabataean Aramaic inscriptions, royal silver coinage of Kings Aretas IV and Rabbel II, and Hellenistic-Arabian capitals',
      'Petra Papyri (6th-century CE carbonized Byzantine Greek papyrus scrolls discovered in the Petra Church in 1993)',
      'Finely painted eggshell-thin Nabataean ceramic vessels and incense burners'
    ],
    generalOverview:
      'Known to its builders as **Raqmu**, **Petra** was the wealthy desert capital of the **Nabataean Kingdom**, an Arab caravan empire that controlled the lucrative frankincense, myrrh, and spice routes linking southern Arabia and the Indian Ocean to Gaza, Damascus, and the Mediterranean. Through ingenious hydraulic engineering—dams, cisterns, and pressurized ceramic pipelines—the Nabataeans sustained a lush metropolis of 30,000 people in the arid canyons of southern Jordan.',
    excavationAndDiscoveryHistory:
      'After the Roman annexation of 106 CE and a devastating earthquake in 363 CE, Petra’s trade routes shifted and the city was unknown to the Western world until Swiss explorer **Johann Ludwig Burckhardt** entered the Siq in disguise in **1812**. Modern archaeological excavations beginning in 1929 and satellite surveys in 2016 continue to reveal hidden monumental platforms.'
  },
  {
    id: 'arch_carthage',
    name: 'Ruins of Carthage (Byrsa Hill, Tophet & Punic Ports)',
    shortLabel: 'Ancient Carthage',
    modernCountry: 'Tunisia',
    region: 'Gulf of Tunis (Central Mediterranean)',
    civilization: 'Phoenician-Punic Empire & Roman Africa Proconsularis',
    siteType: 'Ancient Metropolis',
    foundedYear: -814,
    foundedDisplay: '814 BCE',
    peakStartYear: -814,
    peakEndYear: 698,
    rediscoveryOrExcavationYear: 1875,
    coordinates: [10.323, 36.853],
    unescoStatus: 'UNESCO World Heritage Site (Inscribed 1979)',
    architecturalFeatures: [
      'Circular naval Cothon (military harbor built to house 220 quinquereme warships) and rectangular merchant port',
      'Byrsa Hill Punic residential quarter and monumental Roman Antonine Baths on the Mediterranean shore',
      'Sanctuary of Tanit and Baal Hammon (Tophet) with thousands of carved limestone stelae'
    ],
    keyArtifacts: [
      'Punic limestone stelae bearing the symbol of the Goddess Tanit and Phoenician inscriptions',
      'Carthaginian terracotta grinning masks, glass bead amulets, and electrum/silver shekel coins from the Punic Wars',
      'Monumental Roman mosaics from the villas of Roman Carthage'
    ],
    generalOverview:
      'Founded in **814 BCE** by Phoenician settlers from Tyre (traditionally led by **Queen Dido / Elissa**), **Carthage** (*Qart-Hadasht*, "New City") grew into the supreme maritime and mercantile empire of the western Mediterranean. After fighting three existential **Punic Wars** against Rome (264–146 BCE) under **Hamilcar** and **Hannibal Barca**, the Punic city was razed by Scipio Aemilianus in **146 BCE**, then rebuilt by **Julius Caesar and Augustus** as the second largest city in the Western Roman Empire.',
    excavationAndDiscoveryHistory:
      'Systematic excavations began in the late 19th century and culminated in the **1972–1992 UNESCO International "Save Carthage" Campaign**, in which teams from 12 nations excavated the Punic naval harbors, Byrsa Hill, and Roman monuments.'
  },
  {
    id: 'arch_rome_forum_colosseum',
    name: 'Roman Forum, Palatine Hill & Colosseum (Flavian Amphitheatre)',
    shortLabel: 'Roman Forum & Colosseum',
    modernCountry: 'Italy',
    region: 'Latium / Central Italy (Tiber Valley)',
    civilization: 'Roman Republic & Roman Empire',
    siteType: 'Ancient Metropolis',
    foundedYear: -753,
    foundedDisplay: 'c. 753 BCE – 80 CE',
    peakStartYear: -509,
    peakEndYear: 476,
    rediscoveryOrExcavationYear: 1803,
    coordinates: [12.492, 41.89],
    unescoStatus: 'UNESCO World Heritage Site (Historic Centre of Rome, 1980)',
    architecturalFeatures: [
      'The Colosseum (Flavian Amphitheatre, completed 80 CE under Titus, seating 50,000–80,000 spectators with underground hypogeum)',
      'Roman Forum (Curia Julia Senate House, Arch of Titus, Arch of Septimius Severus, Temple of Saturn)',
      'Pantheon (Hadrian’s unreinforced concrete dome, 125 CE), Trajan’s Column, and Imperial Palaces of the Palatine Hill'
    ],
    keyArtifacts: [
      'Lapis Niger (oldest known Latin inscription in the Forum, 6th century BCE)',
      'Spoils of Jerusalem relief inside the Arch of Titus and spiral Dacian War reliefs on Trajan’s Column',
      'Colossal bronze equestrian statue of Marcus Aurelius and marble statues of the Vestal Virgins'
    ],
    generalOverview:
      'For over a millennium, the **Roman Forum**, **Palatine Hill**, and **Colosseum** stood at the political, religious, and architectural heart of the **Roman Republic and Roman Empire** (*Caput Mundi*). Here the Roman Senate debated war and law, triumphal processions marched along the *Via Sacra*, Julius Caesar was cremated, and imperial concrete, arches, and domes revolutionized global architecture.',
    excavationAndDiscoveryHistory:
      'Partially buried under meters of alluvial silt and medieval pastureland (when the Forum was known as the *Campo Vaccino* or "Cow Field"), scientific stratigraphical excavation began under **Carlo Fea** in **1803**, **Rodolfo Lanciani**, and **Giacomo Boni** at the turn of the 20th century.'
  },
  {
    id: 'arch_pompeii',
    name: 'Pompeii & Herculaneum (Vesuvian Roman Cities)',
    shortLabel: 'Pompeii',
    modernCountry: 'Italy',
    region: 'Campania (Bay of Naples)',
    civilization: 'Roman Empire (First Century CE)',
    siteType: 'Ancient Metropolis',
    foundedYear: -600,
    foundedDisplay: 'c. 600 BCE (Buried 79 CE)',
    peakStartYear: -200,
    peakEndYear: 79,
    rediscoveryOrExcavationYear: 1748,
    coordinates: [14.486, 40.75],
    unescoStatus: 'UNESCO World Heritage Site (Inscribed 1997)',
    architecturalFeatures: [
      'Intact Roman urban grid with paved basalt streets, stepping stones, lead water pipes, and public fountains',
      'Villa of the Mysteries, House of the Faun, Amphitheatre of Pompeii (oldest surviving stone Roman amphitheatre, 70 BCE), and Forum Baths',
      ' Over 150 preserved thermopolia (hot-food street counters), bakeries with carbonized loaves of bread, and electoral graffiti'
    ],
    keyArtifacts: [
      'Alexander Mosaic from the House of the Faun (depicting Alexander the Great vs. Darius III at Issus)',
      'Villa of the Papyri library at Herculaneum (1,800+ carbonized Epicurean philosophical scrolls now being read via AI X-ray tomography)',
      'Plaster casts of victims created by Giuseppe Fiorelli by pouring plaster into volcanic ash voids'
    ],
    generalOverview:
      'When **Mount Vesuvius** erupted catastrophically in **79 CE**, the prosperous Roman cities of **Pompeii** and **Herculaneum** were buried beneath 4 to 20 meters of pumice and pyroclastic surges within 24 hours. Frozen at a single moment in time, Pompeii provides an unparalleled, intimate snapshot of daily Roman urban life—from frescoed patrician villas and political campaign slogans painted on street walls to bakeries, taverns, and baths.',
    excavationAndDiscoveryHistory:
      'Rediscovered in **1748** under the Bourbon King of Naples Charles III, Pompeii became the birthplace of modern systematic archaeology in the 1860s under **Giuseppe Fiorelli**, who introduced numbered regional grids (*Regiones* and *Insulae*) and the famous void-casting technique.'
  },
  {
    id: 'arch_taxila_gandhara',
    name: 'Taxila & Takht-i-Bahi (Gandhara University & Monastic Complex)',
    shortLabel: 'Taxila (Gandhara)',
    modernCountry: 'Pakistan',
    region: 'Pothohar Plateau & Khyber Pakhtunkhwa',
    civilization: 'Gandhara, Mauryan, Indo-Greek & Kushan Empires',
    siteType: 'Ancient Metropolis',
    foundedYear: -600,
    foundedDisplay: 'c. 600 BCE – 500 CE',
    peakStartYear: -500,
    peakEndYear: 460,
    rediscoveryOrExcavationYear: 1913,
    coordinates: [72.787, 33.746],
    unescoStatus: 'UNESCO World Heritage Site (Inscribed 1980)',
    architecturalFeatures: [
      'Three successive ancient walled cities: Bhir Mound (Achaemenid/Mauryan), Sirkap (Hellenistic grid city), and Sirsukh (Kushan)',
      'Dharmarajika Stupa (founded by Emperor Ashoka in the 3rd century BCE) and Jaulian Buddhist Monastery & University',
      'Double-Headed Eagle Shrine blending Corinthian Greek columns with Indian torana gateways'
    ],
    keyArtifacts: [
      'Greco-Buddhist Gandharan schist and stucco sculptures depicting the Buddha in classical Apollo-inspired drapery',
      'Silver and gold coin hoards of Alexander the Great, Indo-Greek King Menander I (Milinda), and Kushan Emperor Kanishka',
      'Reliquary caskets of gold and rock crystal inscribed in Kharoshthi script'
    ],
    generalOverview:
      'Situated at the strategic crossroads linking the Indian subcontinent, Central Asia, and Persia near the Indus and Haro rivers in modern Pakistan, **Taxila (Takshashila)** was one of the ancient world’s foremost centers of higher learning, philosophy, medicine, and Greco-Buddhist art. Visited by **Alexander the Great in 326 BCE**, governed by **Ashoka the Great**, and flourishing under the **Indo-Greek** and **Kushan Empires**, Taxila’s monasteries helped transmit Buddhism along the Silk Road to China and East Asia.',
    excavationAndDiscoveryHistory:
      'Identified in the 1860s by Sir Alexander Cunningham and extensively excavated between **1913 and 1934** by **Sir John Marshall**, who uncovered the Hellenistic street grid of Sirkap and dozens of Buddhist stupas and monastic academies.'
  },
  {
    id: 'arch_sarmizegetusa_regia',
    name: 'Sarmizegetusa Regia — Dacian Royal Sanctuary & Fortress',
    shortLabel: 'Sarmizegetusa Regia',
    modernCountry: 'Romania',
    region: 'Orăștie Mountains, Transylvania (Southern Carpathians)',
    civilization: 'Kingdom of Dacia (Burebista & Decebalus)',
    siteType: 'Imperial Citadel & Palace',
    foundedYear: -82,
    foundedDisplay: 'c. 1st Century BCE – 106 CE',
    peakStartYear: -82,
    peakEndYear: 106,
    rediscoveryOrExcavationYear: 1924,
    coordinates: [23.303, 45.622],
    unescoStatus: 'UNESCO World Heritage Site (Dacian Fortresses of the Orăștie Mountains, 1999)',
    architecturalFeatures: [
      'Sacred Zone featuring circular Andesite Sun Sanctuaries and astronomical calendar rings',
      'Murus Dacicus (unique Dacian dry-stone ashlar fortification walls reinforced with oak timber ties)',
      'Paved ceremonial via sacra, monumental stone drainage channels, and ironworking metallurgic workshops'
    ],
    keyArtifacts: [
      'Solid gold Dacian spiral royal bracelets (weighing up to 1.2 kg each, crafted from Carpathian gold)',
      '2,500+ Koson gold staters, Dacian curved falx blades, and ceremonial bronze shields embossed with griffins and wolves',
      'Painted Dacian ceramic vessels inscribed with "DECEBALVS PER SCORILO"'
    ],
    generalOverview:
      'Perched atop a 1,200-meter mountain ridge in the Orăștie Mountains of Transylvania, **Sarmizegetusa Regia** was the capital, military citadel, and supreme religious center of the **Kingdom of Dacia**. Ringed by a defensive network of mountain fortresses (Costești, Blidaru, Piatra Roșie), it served as the seat of King **Burebista** and King **Decebalus** until Roman Emperor **Trajan** besieged and captured the capital in **106 CE** at the conclusion of the Second Dacian War.',
    excavationAndDiscoveryHistory:
      'Systematic archaeological excavations led by Romanian historians **Constantin Daicoviciu** and **Hadrian Daicoviciu** from **1924** onward uncovered the Sacred Precinct’s circular solar temples,metallurgical furnaces, and water supply networks.'
  },
  {
    id: 'arch_teotihuacan',
    name: 'Teotihuacan — Pyramids of the Sun, Moon & Feathered Serpent',
    shortLabel: 'Teotihuacan',
    modernCountry: 'Mexico',
    region: 'Basin of Mexico (Central Mexican Highlands)',
    civilization: 'Classic Mesoamerican Teotihuacan Empire',
    siteType: 'Ancient Metropolis',
    foundedYear: -100,
    foundedDisplay: 'c. 100 BCE – 550 CE',
    peakStartYear: 1,
    peakEndYear: 550,
    rediscoveryOrExcavationYear: 1905,
    coordinates: [-98.843, 19.692],
    unescoStatus: 'UNESCO World Heritage Site (Inscribed 1987)',
    architecturalFeatures: [
      'Pyramid of the Sun (65 meters high, third-largest ancient pyramid on Earth by volume)',
      'Pyramid of the Moon and 2.5-kilometer-long Avenue of the Dead flanked by talud-tablero platforms',
      'Temple of the Feathered Serpent (Quetzalcoatl) with sculpted stone serpent heads and subterranean mercury-lined ritual tunnel'
    ],
    keyArtifacts: [
      'Over 100,000 ritual offerings discovered in the tunnel beneath the Temple of the Feathered Serpent (jade, amber, rubber balls, and liquid mercury)',
      'Polychrome Teotihuacan apartment murals depicting Tlaloc, the Great Goddess, and jaguar warriors',
      'Green Pachuca obsidian blades and Teotihuacan stone funerary masks'
    ],
    generalOverview:
      'Long before the rise of the Aztecs (who named the abandoned ruins **Teotihuacan**, "Place Where the Gods Were Created"), this monumental city in the Basin of Mexico was the largest metropolis in the Western Hemisphere during the Classic Period (c. 100–550 CE), home to **125,000–200,000 inhabitants** living in over 2,000 multi-family stuccoed apartment compounds. Its military and trade influence extended over 1,000 kilometers to Mayan cities like Tikal and Copán.',
    excavationAndDiscoveryHistory:
      'Revered as a sacred pilgrimage site by Aztec emperors including Moctezuma II, large-scale modern archaeological excavation began in **1905** under Leopoldo Batres, René Millon’s 1960s mapping project, and Sergio Gómez Chávez’s 2003–2017 excavation of the sealed tunnel beneath the Ciudadela.'
  },
  {
    id: 'arch_tikal_chichen_itza',
    name: 'Tikal & Chichen Itza — Mayan Pyramid Metropolises',
    shortLabel: 'Tikal & Chichen Itza',
    modernCountry: 'Guatemala',
    region: 'Petén Rainforest & Yucatán Peninsula (Mesoamerica)',
    civilization: 'Classic & Postclassic Maya Civilization',
    siteType: 'Sacred Temple Complex',
    foundedYear: -400,
    foundedDisplay: 'c. 400 BCE – 1200 CE',
    peakStartYear: 200,
    peakEndYear: 1200,
    rediscoveryOrExcavationYear: 1848,
    coordinates: [-89.623, 20.684],
    unescoStatus: 'UNESCO World Heritage Sites (Tikal 1979 · Chichen Itza 1988)',
    architecturalFeatures: [
      'Towering steep-sided limestone roof-comb temples of Tikal (Temples I–V, rising up to 70 meters above the jungle canopy)',
      'El Castillo (Temple of Kukulcán) at Chichen Itza, engineered with 365 steps and equinox serpent-shadow astronomical alignments',
      'El Caracol astronomical observatory, Great Ballcourt, and Sacred Cenote'
    ],
    keyArtifacts: [
      'Jade Mosaic Death Mask and Tomb of King Jasaw Chan K’awiil I beneath Tikal Temple I',
      'Carved Maya hieroglyphic stelae recording exact Long Count calendar dates, eclipses, and dynastic wars',
      'Gold disks, jadeite beads, and copal incense dredged from the Sacred Cenote of Chichen Itza'
    ],
    generalOverview:
      'Spanning the rainforests of Guatemala’s Petén basin (**Tikal / Yax Mutal**) and the northern Yucatán Peninsula (**Chichen Itza**), these monumental cities showcase the mathematical, astronomical, and architectural genius of the **Maya Civilization**. Using positional mathematics with the concept of zero and the only fully developed phonetic-logographic writing system in the pre-Columbian Americas, Maya astronomer-priests tracked Venus and solar eclipses with sub-day accuracy.',
    excavationAndDiscoveryHistory:
      'Following 19th-century expeditions by Modesto Méndez, John Lloyd Stephens, and Frederick Catherwood (**1841–1848**), major 20th-century excavations by the University of Pennsylvania and the Carnegie Institution—coupled with the decipherment of Maya hieroglyphs by Yuri Knorozov, Tatiana Proskouriakoff, and David Stuart—restored the dynastic history of the Maya kings.'
  },
  {
    id: 'arch_angkor_wat',
    name: 'Angkor Wat & Angkor Thom — Khmer Hydraulic Megacity',
    shortLabel: 'Angkor Wat',
    modernCountry: 'Cambodia',
    region: 'Siem Reap Plain (Tonlé Sap Basin)',
    civilization: 'Khmer Empire (Kambujadesa)',
    siteType: 'Sacred Temple Complex',
    foundedYear: 889,
    foundedDisplay: '889–1220 CE (Angkor Wat built c. 1113–1150 CE)',
    peakStartYear: 889,
    peakEndYear: 1431,
    rediscoveryOrExcavationYear: 1860,
    coordinates: [103.867, 13.412],
    unescoStatus: 'UNESCO World Heritage Site (Inscribed 1992)',
    architecturalFeatures: [
      'Angkor Wat (world’s largest religious monument by land area, 162.6 hectares, surrounded by a 190-meter-wide moat)',
      'Five lotus-bud central towers representing Mount Meru and 800 meters of continuous sandstone bas-relief galleries',
      'Bayon Temple at Angkor Thom featuring 216 serene smiling stone faces of Avalokiteshvara / King Jayavarman VII',
      'Massive Baray reservoirs (West Baray: 8 km × 2.1 km) and hydraulic canal network supporting ~750,000–1,000,000 inhabitants'
    ],
    keyArtifacts: [
      '"Churning of the Ocean of Milk" (Samudra Manthan) 49-meter sandstone bas-relief gallery',
      'Monumental Sanskrit and Old Khmer temple foundation stelae detailing hospital networks and royal endowments',
      'Gilded bronze statues of Vishnu, Shiva, and Prajnaparamita'
    ],
    generalOverview:
      'Built in the early 12th century by **King Suryavarman II (r. 1113–1150 CE)** as a state temple dedicated to Vishnu and later transformed into a Buddhist monument, **Angkor Wat** and the surrounding walled capital of **Angkor Thom** (built by **Jayavarman VII**) formed the heart of the **Khmer Empire**. Recent airborne LiDAR surveys have proven that Greater Angkor was the largest pre-industrial urban complex on Earth by area, spanning over 1,000 square kilometers.',
    excavationAndDiscoveryHistory:
      'Never completely forgotten by local Khmer Buddhist monks after the royal court moved south to Phnom Penh in the 15th century, global archaeological restoration began after French naturalist **Henri Mouhot** published his accounts in **1860**, followed by the École française d’Extrême-Orient (EFEO) and 21st-century LiDAR surveys.'
  },
  {
    id: 'arch_great_zimbabwe',
    name: 'Great Zimbabwe — Stone Royal Capital of Southern Africa',
    shortLabel: 'Great Zimbabwe',
    modernCountry: 'Zimbabwe',
    region: 'Masvingo Plateau (Between the Zambezi & Limpopo Rivers)',
    civilization: 'Kingdom of Zimbabwe (Shona Civilization)',
    siteType: 'Imperial Citadel & Palace',
    foundedYear: 1050,
    foundedDisplay: 'c. 1050–1450 CE',
    peakStartYear: 1100,
    peakEndYear: 1450,
    rediscoveryOrExcavationYear: 1905,
    coordinates: [30.933, -20.267],
    unescoStatus: 'UNESCO World Heritage Site (Inscribed 1986)',
    architecturalFeatures: [
      'The Great Enclosure (255-meter circumference dry-stone granite walls rising 11 meters high, built without mortar from 900,000+ dressed granite blocks)',
      '10-meter-high solid Conical Tower and chevron-patterned outer wall frieze',
      'Hill Complex royal acropolis perched atop a 90-meter granite kopje'
    ],
    keyArtifacts: [
      'Eight carved soapstone Zimbabwe Birds (the national emblem of modern Zimbabwe)',
      'Imported Chinese Celadon porcelain, Persian glazed faience, Arabian glass beads, and Kilwa coins proving Indian Ocean trade',
      'Gold wire jewelry, soapstone ingot molds, and iron gongs'
    ],
    generalOverview:
      'Constructed between the 11th and 15th centuries by ancestral **Shona (*Karanga*)** rulers, **Great Zimbabwe** (*Dzimba-dza-mabwe*, "Houses of Stone") was the capital of a wealthy southern African kingdom that controlled the gold and ivory trade between the interior plateau and Swahili Indian Ocean ports like **Kilwa and Sofala**. At its 14th-century height, the dry-stone metropolis housed up to 18,000 residents and represents the largest ancient stone structure in sub-Saharan Africa south of the Nile and Ethiopia.',
    excavationAndDiscoveryHistory:
      'In **1905**, British archaeologist **David Randall-MacIver**—and later **Gertrude Caton-Thompson** in **1929**—conducted rigorous stratigraphic excavations that definitively proved the monument was built entirely by indigenous African (Shona) engineers in the medieval period.'
  },
  {
    id: 'arch_lalibela_aksum',
    name: 'Obelisks of Aksum & Rock-Hewn Churches of Lalibela',
    shortLabel: 'Aksum & Lalibela',
    modernCountry: 'Ethiopia',
    region: 'Tigray & Amhara Highlands (Ethiopian Plateau)',
    civilization: 'Kingdom of Aksum & Zagwe Ethiopian Empire',
    siteType: 'Rock-Cut Sanctuary',
    foundedYear: 100,
    foundedDisplay: 'c. 100–1220 CE',
    peakStartYear: 100,
    peakEndYear: 1500,
    rediscoveryOrExcavationYear: 1906,
    coordinates: [39.041, 12.031],
    unescoStatus: 'UNESCO World Heritage Sites (Lalibela 1978 · Aksum 1980)',
    architecturalFeatures: [
      'Eleven monolithic churches at Lalibela (including the cruciform Church of St. George / Bete Giyorgis) carved top-down from single blocks of red volcanic tuff',
      'Towering carved granite stelae (obelisks) of Aksum up to 33 meters tall, sculpted to resemble multi-story towers',
      'Subterranean rock trenches, drainage tunnels, and ceremonial baptismal courtyards'
    ],
    keyArtifacts: [
      'The Ezana Stone (trilingual stela inscribed in Ge’ez, Sabaean, and Greek recording King Ezana’s 4th-century conversion to Christianity)',
      'Aksumite gold, silver, and bronze coinage (the only ancient sub-Saharan African state to mint its own international currency)',
      'Processional brass and gold crosses of King Gebre Mesqel Lalibela'
    ],
    generalOverview:
      'In the northern Ethiopian highlands, the granite stelae of **Aksum** (1st–7th centuries CE) and the monolithic rock-hewn churches of **Lalibela** (carved under **King Lalibela** of the Zagwe dynasty in the late 12th and early 13th centuries as a "New Jerusalem") stand among the greatest engineering marvels of the ancient and medieval world. Rather than being assembled from cut stone blocks, Lalibela’s eleven churches were excavated downward into living volcanic bedrock and hollowed out inside and out.',
    excavationAndDiscoveryHistory:
      'Described by Portuguese priest Francisco Álvares in 1520, the archaeological monuments of Aksum and Lalibela were systematically surveyed by the **1906 Deutsche Aksum-Expedition** led by Enno Littmann and conserved under UNESCO.'
  },
  {
    id: 'arch_machu_picchu_cusco',
    name: 'Machu Picchu & Sacsayhuamán (Inca Imperial Citadels)',
    shortLabel: 'Machu Picchu',
    modernCountry: 'Peru',
    region: 'Sacred Valley of the Urubamba & Cusco (Andes Cordillera)',
    civilization: 'Inca Empire (Tawantinsuyu)',
    siteType: 'Imperial Citadel & Palace',
    foundedYear: 1450,
    foundedDisplay: 'c. 1450 CE (Reign of Emperor Pachacuti)',
    peakStartYear: 1450,
    peakEndYear: 1572,
    rediscoveryOrExcavationYear: 1911,
    coordinates: [-72.545, -13.163],
    unescoStatus: 'UNESCO World Heritage Site (Inscribed 1983)',
    architecturalFeatures: [
      'Earthquake-resistant ashlar dry-stone granite masonry fitted so tightly without mortar that a knife blade cannot pass between stones',
      'Intihuatana ("Hitching Post of the Sun") astronomical stone, Temple of the Sun (Torreón), and Room of the Three Windows',
      'Over 700 agricultural and anti-erosion mountain terraces fed by 16 stone spring-water fountains'
    ],
    keyArtifacts: [
      'Inca knotted-string Quipu accounting devices, bronze tumi ceremonial knives, and silver/gold llama offerings',
      'Polychrome aryballos (urpu) ceramic vessels and finely woven alpaca textiles',
      'Precision stone plumb bobs and hammerstones used to shape polygonal granite blocks'
    ],
    generalOverview:
      'Constructed around **1450 CE** as a royal mountain estate and sacred sanctuary for the Ninth Sapa Inca **Pachacuti Inca Yupanqui**, **Machu Picchu** sits on a dramatic 2,430-meter granite saddle between the peaks of Machu Picchu and Huayna Picchu above the Urubamba River. Because the Spanish conquistadors never discovered the cloud-forest citadel during the 16th-century conquest of Peru, its temples, astronomical shrines, and hydraulic terraces survived intact.',
    excavationAndDiscoveryHistory:
      'Known to local Quechua farming families, Machu Picchu was brought to international scholarly attention on **July 24, 1911**, when Yale historian **Hiram Bingham III**, guided by local resident Melchor Arteaga and an 11-year-old Quechua boy named Pablito Alvarez, climbed to the overgrown granite ridge.'
  }
];

export const ARCHAEOLOGICAL_SITES: ArchaeologicalSite[] = RAW_ARCHAEOLOGICAL_SITES.map((s) => ({
  ...s,
  svgCoords: projectCoordinates(s.coordinates[0], s.coordinates[1])
}));

/**
 * Returns all archaeological sites & historical ruins relevant to the selected year.
 * - Sites built on or before `currentYear` are plotted (either as active monumental sites of that era or as enduring historical ruins).
 * - For very early prehistoric/Bronze Age years, also includes contemporaneous cradle-of-civilization sites within the current era window.
 */
export function getArchaeologicalSitesForEra(currentYear: number): ArchaeologicalSite[] {
  return ARCHAEOLOGICAL_SITES.filter((site) => {
    // Allow sites constructed up to or during the current era (with a small buffer so era presets like -500 show 5th-century BCE classical monuments)
    return currentYear >= site.foundedYear - 75;
  });
}

/**
 * Generates a comprehensive Two-Part Dossier for any clicked Archaeological Site / Historical Ruin in the selected year.
 */
export function generateArchaeologicalSiteYearDossier(
  site: ArchaeologicalSite,
  year: number
): ArchaeologicalSiteYearDossier {
  const yearDisplay = year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
  const era = getGeopoliticalEra(year);

  let statusInYear: ArchaeologicalSiteYearDossier['statusInYear'] =
    'Excavated Archaeological Site';
  let yearHeadline = '';
  let yearDetailedNarrative = '';
  let yearMajorEvents: string[] = [];
  let preservationAndCulturalState = '';

  if (year <= site.peakEndYear) {
    statusInYear = 'Active Era Monument';
    yearHeadline = `${site.name} in ${yearDisplay} — Active Monumental Center of ${site.civilization}`;
    yearDetailedNarrative = [
      `In **${yearDisplay}** (during the **${era.epochName}**), **${site.name}** in **${site.region}** was not yet a ruin—it stood as an **active, living monumental complex** of **${site.civilization}** (founded ${site.foundedDisplay}).`,
      `Architects, priests, artisans, and rulers actively maintained its primary structures—including ${site.architecturalFeatures[0].toLowerCase()}—while ceremonial rituals, state administration, and regional trade flowed through the site.`
    ].join('\n\n');
    yearMajorEvents = [
      `Active monumental phase of ${site.name} under ${site.civilization} (${site.foundedDisplay} – ${site.peakEndYear < 0 ? `${Math.abs(site.peakEndYear)} BCE` : `${site.peakEndYear} CE`}).`,
      `Construction and maintenance of ${site.architecturalFeatures[0]}.`,
      `Creation and ritual use of key material culture: ${site.keyArtifacts[0]}.`
    ];
    preservationAndCulturalState = `In ${yearDisplay}, the monument’s painted reliefs, timber roofs, ceremonial courtyards, and hydraulic/structural systems were intact and actively used by ${site.civilization}.`;
  } else if (year < site.rediscoveryOrExcavationYear) {
    statusInYear = 'Ancient Historical Ruin';
    yearHeadline = `${site.name} in ${yearDisplay} — Historical Ruin & Unexcavated Monument`;
    yearDetailedNarrative = [
      `By **${yearDisplay}**, following the decline or transformation of **${site.civilization}** after ${site.peakEndYear < 0 ? `${Math.abs(site.peakEndYear)} BCE` : `${site.peakEndYear} CE`}, **${site.name}** stood as an **ancient historical ruin** in **${site.region}** (${site.modernCountry}).`,
      `Prior to modern stratigraphic excavations beginning in **${site.rediscoveryOrExcavationYear} CE**, its monumental stone foundations, buried chambers, and inscriptions remained partially covered by sediment, vegetation, or desert sand, preserved in local memory and travelers’ accounts.`
    ].join('\n\n');
    yearMajorEvents = [
      `Preserved as an ancient ruin from ${site.civilization} across the ${era.epochName} (${yearDisplay}).`,
      `Subterranean chambers and artifacts (${site.keyArtifacts[0]}) remained buried and undisturbed awaiting modern archaeological excavation in ${site.rediscoveryOrExcavationYear} CE.`,
      `Weathered stone masonry (${site.architecturalFeatures[0]}) endured as a landmark in ${site.region}.`
    ];
    preservationAndCulturalState = `In ${yearDisplay}, the site was in its post-abandonment historical ruin phase prior to formal scientific excavation in ${site.rediscoveryOrExcavationYear} CE.`;
  } else {
    statusInYear = 'Excavated Archaeological Site';
    yearHeadline = `${site.name} in ${yearDisplay} — Excavated Archaeological Site & World Heritage Monument`;
    yearDetailedNarrative = [
      `In **${yearDisplay}**, **${site.name}** in **${site.modernCountry}** (${site.region}) is an internationally protected **excavated archaeological site and historical ruin** (${site.unescoStatus}), originally constructed in **${site.foundedDisplay}** by **${site.civilization}**.`,
      `${site.excavationAndDiscoveryHistory}`
    ].join('\n\n');
    yearMajorEvents = [
      `Scientific archaeological excavation and conservation milestone (initiated in ${site.rediscoveryOrExcavationYear} CE).`,
      `Protected under ${site.unescoStatus} in ${site.modernCountry}.`,
      `Major archaeological discoveries documented at the site: ${site.keyArtifacts.join('; ')}.`
    ];
    preservationAndCulturalState = `In ${yearDisplay}, the site is actively conserved by archaeologists and heritage authorities in ${site.modernCountry}, using 3D laser scanning, stratigraphic conservation, and museum curation.`;
  }

  return {
    site,
    year,
    yearDisplay,
    epochName: era.epochName,
    statusInYear,
    yearHeadline,
    yearDetailedNarrative,
    yearMajorEvents,
    preservationAndCulturalState
  };
}
