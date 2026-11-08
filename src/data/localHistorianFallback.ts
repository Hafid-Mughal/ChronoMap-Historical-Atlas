import { getGeopoliticalEra } from './historicalErasGeo';
import { CONFLICT_ZONES, ConflictZone } from './conflictZones';
import { getCountryEraData } from './historicalAtlasEngine';
import { getCountryProfile } from './modernCountriesData';
import {
  searchHistoricalAtlas,
  isFictionalOrNonHistoricalQuery
} from './historicalSearchIndex';
import {
  CreditedSource,
  TRADE_ROUTES,
  getCreditedSourcesForRegion,
  getCreditedSourcesForConflict
} from './mapLayersData';
import { MapRegion } from './worldMapData';
import { YearSnapshotData } from '../components/YearSnapshotModal';
import { WORLD_COUNTRIES } from './geoService';

export interface LocalChatParams {
  message: string;
  year: number;
  activeContext?:
    | { type: 'country'; data: MapRegion }
    | { type: 'conflict'; data: ConflictZone }
    | null;
  conversationHistory?: Array<{ role: string; content: string }>;
}

export interface LocalChatResult {
  reply: string;
  isWhatIf: boolean;
  sources: CreditedSource[];
}

const KNOWN_COUNTRIES = WORLD_COUNTRIES.map((c) => c.name);

interface HistoricalTopicEntry {
  id: string;
  patterns: RegExp[];
  eraYear: number;
  countryFocus: string;
  title: string;
  response: string;
}

/**
 * High-Capacity Curated Deep Historical Causal Explanations for major world history questions
 * (Used when running in static/offline mode without a live LLM backend)
 */
const HISTORICAL_QA_KNOWLEDGE_BASE: HistoricalTopicEntry[] = [
  {
    id: 'mughal_vs_british',
    patterns: [
      /mughal.*(british|east india|england|uk|lose|lost|fall|fell|defeat|collapse|decline|conquer)/i,
      /(british|east india).*(mughal|india|conquer|defeat|coloniz|take over|took over)/i,
      /why did the mughal/i
    ],
    eraYear: 1764,
    countryFocus: 'India',
    title: 'Why the Mughal Empire Lost to the British Empire (East India Company)',
    response: [
      '**Why the Mughal Empire Lost Against the British Empire (1707–1857 CE)**',
      'The defeat and eventual abolition of the **Mughal Empire** by the **British East India Company (EIC)** and the British Crown was not the result of a single war, but a century-long process driven by internal Mughal fragmentation, fiscal collapse, military asymmetry, and astute British diplomatic manipulation.',
      '**1. Post-Aurangzeb Internal Fragmentation & Succession Wars (After 1707)**\n- Emperor **Aurangzeb’s** decades-long Deccan campaigns (1680–1707) exhausted the imperial treasury and overextended administrative lines.\n- Following his death in 1707, the Mughal court in Delhi was paralyzed by bitter wars of succession (producing six emperors in twelve years). Provincial governors (*Nawabs* and *Nizams* in **Bengal, Awadh, and Hyderabad**) broke away to form de facto independent dynasties, while the **Maratha Confederacy**, Sikhs, and Jats carved out vast territories.',
      '**2. Devastating Foreign Invasions (1739–1761)**\n- In **1739**, Persian ruler **Nadir Shah** invaded northern India, defeated the Mughal army at the Battle of Karnal, sacked Delhi, and carried off the Peacock Throne and massive bullion reserves.\n- Repeated Afghan invasions under **Ahmad Shah Durrani (Abdali)** culminating in 1761 shattered what remained of central Mughal military authority, leaving the Emperor in Delhi a symbolic figurehead without an imperial army.',
      '**3. Military, Naval & Technological Asymmetry**\n- **Disciplined Infantry & Artillery:** The British East India Company deployed European-drilled sepoy regiments armed with standardized flintlock muskets, socket bayonets, and mobile field artillery using rapid canister shot, which consistently outmaneuvered larger, decentralized Mughal cavalry armies.\n- **Total Naval Supremacy:** The Royal Navy and EIC fleets controlled the Indian Ocean and Bengal river deltas, allowing Britain to reinforce Calcutta, Bombay, and Madras at will while cutting off rival supply lines.',
      '**4. Financial Power, Industrial Backing & "Divide and Rule" Diplomacy**\n- **Corporate & Banking Finance:** Backed by the Bank of England, global maritime trade, and Indian banking houses (such as the **Jagat Seths** of Bengal), the British paid soldiers regularly and bought the defection of rival commanders (most famously **Mir Jafar** at the **Battle of Plassey in 1757**).\n- **Subsidiary Alliances:** Through the **Battle of Buxar (1764)**, the EIC defeated the combined forces of Mughal Emperor **Shah Alam II**, the Nawab of Awadh, and the Nawab of Bengal. The resulting **Treaty of Allahabad (1765)** granted the British the *Diwani* (right to collect taxes) over Bengal, Bihar, and Orissa—using India’s richest tax base to fund the conquest of the rest of the subcontinent.',
      '**5. Final Abolition (1857–1858)**\n- During the **Indian Rebellion of 1857**, mutinying sepoys proclaimed the aged **Bahadur Shah Zafar** Emperor of Hindustan. After the British recaptured Delhi in September 1857, Bahadur Shah Zafar was exiled to Rangoon, the Mughal dynasty was formally abolished, and the **Government of India Act 1858** transferred rule directly to the British Crown (the British Raj).'
    ].join('\n\n')
  },
  {
    id: 'fall_of_rome',
    patterns: [
      /(fall|collapse|decline|lose|lost|end).*(roman empire|rome|western rome)/i,
      /why did (rome|the roman empire) (fall|collapse|lose|decline)/i
    ],
    eraYear: 476,
    countryFocus: 'Italy',
    title: 'Why the Western Roman Empire Fell (376–476 CE)',
    response: [
      '**Why the Western Roman Empire Collapsed (376–476 CE)**',
      'The fall of the **Western Roman Empire** (traditionally dated to **476 CE** when the Germanic commander Odoacer deposed Emperor Romulus Augustulus) resulted from a convergence of structural economic decay, military overextension, political instability, and large-scale Eurasian migrations.',
      '**1. Administrative Division & Fiscal Asymmetry**\n- After Emperor **Diocletian** and later **Theodosius I (395 CE)** permanently divided the empire into Western and Eastern halves, the **Eastern Roman (Byzantine) Empire** retained the wealthiest urban centers (Constantinople, Alexandria, Antioch) and tax revenues, while the West was left with a vast, expensive Rhine-Danube frontier and shrinking agrarian tax receipts.',
      '**2. Currency Debasement, Taxation & Economic Contraction**\n- Chronic silver and gold shortages led emperors to debase the *denarius*, triggering hyperinflation. Heavy taxation drove small landowners onto the fortified estates (*latifundia*) of tax-exempt senatorial elites, hollowing out the state’s fiscal base and laying the foundations of medieval serfdom.',
      '**3. Reliance on Foederati Mercenaries & Civil Wars**\n- Chronic civil wars among rival Roman usurpers depleted the professional legions. Rome increasingly relied on Germanic *foederati* (Visigoths, Vandals, Franks, Burgundians) who fought under their own kings and eventually carved out independent kingdoms within Roman provinces.',
      '**4. The Hunnic Domino Effect & Loss of the North African Breadbasket**\n- The westward push of the **Huns** under Attila drove Germanic confederations across the Rhine and Danube (leading to the Roman defeat at **Adrianople in 378 CE** and the Visigothic sack of Rome in **410 CE**).\n- The decisive blow came in **439 CE** when the **Vandals** captured **Carthage and North Africa**, severing Rome’s grain supply and Mediterranean naval revenues, making Western imperial recovery impossible.'
    ].join('\n\n')
  },
  {
    id: 'byzantine_vs_ottoman',
    patterns: [
      /(byzantine|constantinople).*(ottoman|turk|fall|fell|lose|lost|1453|mehmed)/i,
      /(ottoman|mehmed).*(byzantine|constantinople|conquer|capture|1453)/i
    ],
    eraYear: 1453,
    countryFocus: 'Turkey',
    title: 'Why the Byzantine Empire Fell to the Ottoman Empire (1453 CE)',
    response: [
      '**Why the Byzantine Empire Lost to the Ottoman Empire (1204–1453 CE)**',
      'The fall of **Constantinople** on **May 29, 1453**, to Ottoman Sultan **Mehmed II** marked the end of the thousand-year **Eastern Roman (Byzantine) Empire**.',
      '**1. The Fatal Wound of the Fourth Crusade (1204)**\n- The sack of Constantinople by Western Crusaders and Venice in 1204 fragmented the Byzantine state for half a century. Although the **Palaiologos dynasty** recaptured the city in 1261, the empire was reduced to a bankrupt city-state surrounded by hostile neighbors, with its maritime trade monopolized by Genoa and Venice.',
      '**2. Byzantine Civil Wars & Demographic Collapse**\n- Destructive 14th-century dynastic civil wars (1321–1354)—during which Byzantine factions invited Ottoman troops into Europe as mercenaries—combined with the **Black Death (1347)** reduced Constantinople’s population from over 500,000 in its prime to barely 50,000 by 1453.',
      '**3. Ottoman Military Innovation & Gunpowder Siege Artillery**\n- The **Ottoman Empire** built a centralized fiscal-military state around the elite **Janissary** infantry corps and provincial *Timariot* cavalry.\n- In 1453, **Mehmed II** assembled an army of 80,000+ men, built the *Rumeli Hisarı* fortress to choke off the Bosphorus, portaged warships overland into the Golden Horn, and deployed **Orban’s giant gunpowder bombards** to shatter the ancient **Theodosian Walls** against Emperor **Constantine XI’s** 7,000 defenders.'
    ].join('\n\n')
  },
  {
    id: 'ottoman_decline_ww1',
    patterns: [
      /why did the ottoman.*(fall|collapse|lose|lost|decline|end|dissolve)/i,
      /ottoman.*(hejaz|arabia|saudi|british|ww1|world war|collapse)/i
    ],
    eraYear: 1914,
    countryFocus: 'Turkey',
    title: 'Decline and Collapse of the Ottoman Empire & Control in Arabia',
    response: [
      '**Why the Ottoman Empire Declined and Collapsed (1683–1922 CE)**',
      'The **Ottoman Empire** endured for over six centuries before dissolving in the aftermath of **World War I (1914–1918)**.',
      '**1. Geopolitical Reach & Limits in Arabia (Hejaz vs. Interior Najd)**\n- Even at its height, Ottoman rule in the Arabian Peninsula was concentrated along the Red Sea coast (**the Hejaz**, including Mecca, Medina, and Jeddah) and parts of the Persian Gulf coast, while the vast interior desert plateau (**Najd** and central Arabia) remained under autonomous indigenous Arab tribes and emirates.',
      '**2. Maritime Bypassing & European Industrialization**\n- Once Portuguese, Dutch, and British oceanic fleets bypassed Ottoman Middle Eastern land routes to Asia, Ottoman customs revenues declined. European industrial capitalism and the **Capitulations** (extraterritorial trade privileges) turned the Ottoman economy into an exporter of raw materials indebted to European banks (leading to the Ottoman Public Debt Administration in 1881).',
      '**3. Balkan Nationalism & The Final Blow in World War I**\n- 19th-century nationalist movements in Greece, Serbia, Romania, and Bulgaria stripped away Ottoman Europe.\n- Entering **World War I** alongside the Central Powers exposed the empire to multi-front warfare against the British and Russian Empires (Mesopotamia, Gallipoli, the Caucasus, Palestine) and the **1916 Arab Revolt** launched from the Hejaz, culminating in the post-war partition of its Arab provinces and the creation of the Republic of Turkey in 1923.'
    ].join('\n\n')
  },
  {
    id: 'colonial_north_america',
    patterns: [
      /(british|french|spanish).*(coloniz|split|divide|north america|usa|united states|seven years|french and indian)/i,
      /(france|spanish|spain|britain).*(lose|lost).*(america|canada|louisiana|new france)/i
    ],
    eraYear: 1754,
    countryFocus: 'United States of America',
    title: 'British, French, and Spanish Partition & Struggle for North America',
    response: [
      '**How North America Was Split Between British, French, and Spanish Colonizers (1600–1783 CE)**',
      'Before the formation of the modern United States, North America was divided among three competing European colonial empires alongside sovereign Indigenous confederations:',
      '**1. The Three Colonial Zones**\n- **British Thirteen Colonies (Atlantic Seaboard):** Stretching along the eastern coast from New England to Georgia, characterized by dense settler populations (~1.5 million by 1755), commercial agriculture, and maritime trade.\n- **French New France & Louisiana (Interior River Basin):** Stretching from the St. Lawrence River (Quebec) through the Great Lakes and down the entire Mississippi River basin to New Orleans, reliant on fur trade networks and alliances with Algonquian and Huron nations.\n- **Spanish Empire (Florida, Texas, Southwest & California):** Controlling the Viceroyalty of New Spain, stretching across Mexico, Texas, New Mexico, Arizona, California, and Florida, while vast interior plains remained sovereign Indigenous territory (Comanche, Sioux, Apache, Iroquois).',
      '**2. Why France & Spain Lost Dominance in North America**\n- **Demographic & Naval Disparity:** British America had over 20 times the settler population of New France (~70,000 French settlers), and the British Royal Navy blockaded French Atlantic reinforcements during the **Seven Years’ War / French and Indian War (1754–1763)**.\n- **Treaty of Paris (1763) & Louisiana Purchase (1803):** Following Britain’s capture of Quebec (1759), France ceded Canada and all territory east of the Mississippi to Britain and transferred western Louisiana to Spain. Later, Napoleon briefly recovered Louisiana only to sell it to the United States in **1803** to finance his European wars.'
    ].join('\n\n')
  },
  {
    id: 'qing_opium_wars',
    patterns: [
      /(qing|china|chinese).*(british|opium|lose|lost|century of humiliation|decline|fall)/i,
      /why did (china|the qing) (lose|fall)/i
    ],
    eraYear: 1842,
    countryFocus: 'China',
    title: 'Why the Qing Dynasty Lost the Opium Wars and Declined (1839–1912 CE)',
    response: [
      '**Why the Qing Empire Lost Against Britain & Foreign Powers (1839–1912 CE)**',
      'During the 18th century, the **Qing Dynasty** accounted for nearly a third of global economic output, yet between 1839 and 1912 it suffered devastating military defeats and internal collapse:',
      '**1. The Industrial-Military Gap (First & Second Opium Wars, 1839–1860)**\n- To reverse a massive silver trade deficit caused by British demand for Chinese tea, silk, and porcelain, the British East India Company flooded China with Bengal-grown opium.\n- When Qing Commissioner **Lin Zexu** seized opium stocks at Canton in 1839, Britain deployed steam-powered iron gunboats (such as the *Nemesis*) and long-range naval artillery that easily outranged Qing coastal forts and wooden war junks, forcing the **Treaty of Nanking (1842)** and the cession of Hong Kong.',
      '**2. Internal Demographic & Fiscal Crisis (Taiping Rebellion, 1850–1864)**\n- Rapid population growth (surpassing 400 million), silver scarcity, and administrative corruption sparked the **Taiping Rebellion**, a devastating civil war that cost 20–30 million lives and forced Beijing to devolve military power to regional Han Chinese warlords and governors.',
      '**3. Conservative Court Resistance to Modernization**\n- Unlike **Meiji Japan**, which rapidly industrialized after 1868, the Qing court’s **Self-Strengthening Movement** was hampered by bureaucratic conservatism and regional fragmentation, leading to defeat in the **First Sino-Japanese War (1894–1895)**, the **Boxer Rebellion (1900)**, and the **1911 Xinhai Revolution**.'
    ].join('\n\n')
  },
  {
    id: 'napoleon_defeat',
    patterns: [
      /why did napoleon (lose|fail|fall)/i,
      /napoleon.*(russia|waterloo|british|coalition|defeat|lose|lost)/i
    ],
    eraYear: 1812,
    countryFocus: 'France',
    title: 'Why Napoleon Bonaparte and the First French Empire Were Defeated (1812–1815 CE)',
    response: [
      '**Why Napoleon Bonaparte Lost Against the Allied Coalitions (1812–1815 CE)**',
      '**1. British Naval Supremacy & Failure of the Continental System**\n- After Admiral Nelson’s victory at **Trafalgar (1805)** destroyed Franco-Spanish naval power, Napoleon could not invade Britain. His economic blockade (**the Continental System**) hurt European allies more than Britain, provoking resistance in Portugal, Spain, and Russia.',
      '**2. The "Spanish Ulcer" (Peninsular War, 1808–1814)**\n- Invading Spain and installing his brother Joseph on the Spanish throne ignited relentless Spanish guerrilla warfare supported by the British army under the **Duke of Wellington**, tying down 300,000 veteran French troops.',
      '**3. The Catastrophic 1812 Invasion of Russia**\n- Napoleon marched **600,000 men** (the *Grande Armée*) into Russia. Russian General **Kutuzov** used scorched-earth retreats to stretch French supply lines 600 miles to Moscow. Typhus, starvation, Cossack raids, and the brutal Russian winter destroyed over 85% of Napoleon’s army.',
      '**4. United Sixth & Seventh Coalitions (Leipzig 1813 & Waterloo 1815)**\n- For the first time, Britain, Russia, Prussia, and Austria united simultaneously and adopted Napoleon’s own corps system, defeating him at the **Battle of Leipzig (1813)** and finally at **Waterloo (June 18, 1815)** under Wellington and Prussian Marshal Blücher.'
    ].join('\n\n')
  },
  {
    id: 'aztec_inca_spanish',
    patterns: [
      /(aztec|inca|maya|native).*(spanish|spain|cortes|pizarro|conquistador|lose|lost|fall|conquer)/i,
      /why did the (aztec|inca).*(lose|fall)/i
    ],
    eraYear: 1521,
    countryFocus: 'Mexico',
    title: 'Why the Aztec and Inca Empires Fell to the Spanish Conquistadors (1519–1533 CE)',
    response: [
      '**Why the Aztec and Inca Empires Lost to the Spanish Conquistadors (1519–1533 CE)**',
      '**1. Old World Epidemics (Smallpox & Measles)**\n- Indigenous populations of the Americas had zero acquired immunity to Afro-Eurasian pathogens. Smallpox swept through **Tenochtitlan (1520)** and across the **Andes (late 1520s)** before Pizarro even arrived, killing 50–80% of the population—including Aztec Emperor Cuitláhuac and Inca Emperor **Huayna Capac**.',
      '**2. Indigenous Coalitions & Internal Civil Wars**\n- **Hernán Cortés** did not conquer the Aztecs with 500 Spaniards alone: he allied with **tens of thousands of Tlaxcalan and Totonac warriors** who sought to overthrow oppressive Aztec tribute rule.\n- In Peru, **Francisco Pizarro** arrived in 1532 immediately after a devastating Inca civil war between brothers **Atahualpa** and **Huáscar**, allowing the Spanish to exploit deep factional divisions.',
      '**3. Steel, Cavalry, Gunpowder & Tactical Shock**\n- Toledo steel swords, plate armor, warhorses (unknown in the Americas), brigantine ships on Lake Texcoco, and arquebuses gave small Spanish detachments decisive shock power against obsidian and bronze weaponry in pitched engagements.'
    ].join('\n\n')
  },
  {
    id: 'soviet_collapse_cold_war',
    patterns: [
      /(soviet|ussr).*(collapse|fall|lose|lost|cold war|dissolve|break up)/i,
      /why did the (soviet union|ussr) (collapse|fall|lose)/i
    ],
    eraYear: 1989,
    countryFocus: 'Russia',
    title: 'Why the Soviet Union Collapsed in the Cold War (1985–1991 CE)',
    response: [
      '**Why the Soviet Union Lost the Cold War and Dissolved (1985–1991 CE)**',
      '**1. Structural Stagnation of the Command Economy**\n- While the Soviet central planning system excelled at heavy steel and industrial mobilization in the mid-20th century, it lacked price signals, consumer incentives, and flexibility during the 1970s–1980s information and microchip revolution.',
      '**2. Military Overextension & Oil Price Collapse**\n- Spending 15–25% of GDP on the military arms race with the United States, combined with the costly **Soviet-Afghan War (1979–1989)** and the **1986 collapse in global oil prices**, bankrupted Soviet hard-currency reserves.',
      '**3. Gorbachev’s Reforms (Glasnost & Perestroika) and National Awakening**\n- **Mikhail Gorbachev’s** policies of *Glasnost* (political openness) and *Perestroika* (economic restructuring) loosened Communist Party censorship and abandoned the Brezhnev Doctrine (refusing to use force when Eastern European states toppled communist regimes in **1989**).\n- Within the USSR, Baltic, Ukrainian, Caucasian, and Russian republics asserted sovereignty, culminating in the failed **August 1991 hardliner coup** and the formal dissolution of the USSR in **December 1991**.'
    ].join('\n\n')
  },
  {
    id: 'mongol_conquests',
    patterns: [
      /how did the mongol.*(conquer|win|defeat|build|expand)/i,
      /mongol.*(genghis|empire|china|persia|russia|lose|lost|collapse|baghdad|ain jalut)/i
    ],
    eraYear: 1227,
    countryFocus: 'Mongolia',
    title: 'How the Mongol Empire Conquered Eurasia & Why It Fragmented (1206–1368 CE)',
    response: [
      '**The Rise and Fragmentation of the Mongol Empire (1206–1368 CE)**',
      '**1. How the Mongols Conquered Eurasia**\n- **Composite Bow & Steppe Mobility:** Under **Genghis Khan (Temüjin)**, Mongol cavalrymen rode multiple hardy steppe horses, covering up to 60–80 miles a day and wielding recurve composite bows capable of piercing armor at 300 yards.\n- **Meritocratic Organization & Psychological Warfare:** Genghis Khan abolished tribal aristocracy in favor of decimal military units (*tumen* of 10,000) promoted by merit, integrated Chinese and Persian siege engineers (trebuchets, gunpowder bombs), and used calculated psychological terror to induce cities to surrender.',
      '**2. Why the Unified Mongol Empire Stopped and Fragmented**\n- **Defeat at Ain Jalut (1260) & Failed Invasions of Japan/Java:** The Egyptian **Mamluks** under Sultan Qutuz and Baibars defeated the Mongols at **Ain Jalut (1260)** in Palestine, while typhoons (*kamikaze*) and fierce samurai resistance thwarted Kublai Khan’s invasions of Japan (1274, 1281).\n- **Succession Civil Wars (After 1259):** Disputes among Genghis Khan’s grandsons (**Kublai Khan, Hulagu, Berke, and Ariq Böke**) split the empire into four rival khanates: the **Yuan Dynasty** in China, the **Ilkhanate** in Persia, the **Chagatai Khanate** in Central Asia, and the **Golden Horde** in Russia, which eventually assimilated or were overthrown (such as by the **Ming Dynasty in 1368**).'
    ].join('\n\n')
  },
  {
    id: 'alexander_persia',
    patterns: [
      /alexander.*(persia|achaemenid|darius|conquer|win|defeat)/i,
      /why did (persia|the persian empire|darius) lose.*alexander/i
    ],
    eraYear: -331,
    countryFocus: 'Iran',
    title: 'How Alexander the Great Defeated the Achaemenid Persian Empire (334–330 BCE)',
    response: [
      '**Why the Achaemenid Persian Empire Lost to Alexander the Great (334–330 BCE)**',
      '**1. The Macedonian Combined-Arms Military Revolution**\n- Inherited from **Philip II of Macedon**, Alexander’s army combined the 18-foot *sarissa* pike phalanx (which pinned enemy formations in place) with the elite **Companion Cavalry** (*Hetairoi*) and *Hypaspists* operating as a decisive hammer-and-anvil strike force.',
      '**2. Decisive Battlefield Tactics (Granicus, Issus, and Gaugamela)**\n- At **Issus (333 BCE)** and **Gaugamela (331 BCE)**, despite being heavily outnumbered by **Darius III’s** imperial levy, Alexander personally led wedge-formation cavalry charges directly at Darius’s command center, causing the Persian king to flee and collapsing Persian morale.',
      '**3. Persian Satrapal Autonomy & Political Fragility**\n- Because Achaemenid rule relied on regional satraps and subject peoples (such as Egypt and Babylon) who resented heavy tribute, many provinces welcomed Alexander as a liberator once Persian field armies were broken.'
    ].join('\n\n')
  },
  {
    id: 'rome_vs_carthage',
    patterns: [
      /(carthage|hannibal|punic).*(rome|roman|lose|lost|defeat|scipio)/i,
      /why did (carthage|hannibal) lose/i
    ],
    eraYear: -202,
    countryFocus: 'Tunisia',
    title: 'Why Carthage and Hannibal Lost the Punic Wars Against Rome (264–146 BCE)',
    response: [
      '**Why Carthage Lost the Punic Wars to the Roman Republic (264–146 BCE)**',
      '**1. Citizen Manpower vs. Mercenary Armies**\n- While **Carthage** relied primarily on hired Iberian, Numidian, and Celtic mercenaries commanded by a Carthaginian elite, the **Roman Republic** possessed a vast pool of citizen-soldiers and Italian allies (*socii*). Even after **Hannibal Barca** annihilated Roman armies at **Trebia, Lake Trasimene, and Cannae (216 BCE)**, Rome raised new legions and refused to negotiate.',
      '**2. Fabian Strategy & Lack of Siege Reinforcement**\n- Under **Fabius Maximus**, Rome avoided pitched battles against Hannibal in Italy while cutting off his supplies. Carthage’s oligarchic Senate prioritized Spain and Sardinia over sending siege equipment or reinforcements to Hannibal in Italy.',
      '**3. Scipio Africanus’s Counter-Invasion (Zama, 202 BCE)**\n- Roman general **Scipio Africanus** conquered Carthaginian Spain, forged an alliance with Numidian cavalry king **Masinissa**, and invaded North Africa, forcing Hannibal to return home where Scipio defeated him at the **Battle of Zama (202 BCE)**.'
    ].join('\n\n')
  },
  {
    id: 'world_war_one',
    patterns: [
      /(world war 1|world war i|\bww1\b|\bwwi\b|first world war|central powers).*(start|cause|lose|lost|germany|austria)/i,
      /why did (germany|the central powers) lose (ww1|world war 1|world war i)/i
    ],
    eraYear: 1914,
    countryFocus: 'Germany',
    title: 'Causes of World War I & Why the Central Powers Lost (1914–1918 CE)',
    response: [
      '**World War I: Causes & Why the Central Powers Lost (1914–1918 CE)**',
      '**1. How World War I Started (July Crisis of 1914)**\n- Triggered on **June 28, 1914**, by the assassination of Austro-Hungarian Archduke **Franz Ferdinand** in Sarajevo, interlocking alliance blocs (**Triple Entente**: France, Russia, Britain vs. **Central Powers**: Germany, Austria-Hungary, Ottoman Empire) turned a Balkan crisis into global industrial war.',
      '**2. Why Germany and the Central Powers Lost**\n- **Failure of the Schlieffen Plan & Two-Front Attrition:** Stopped at the **First Battle of the Marne (1914)**, Germany was trapped in a grueling war of attrition on both the Western and Eastern Fronts.\n- **The British Royal Navy Blockade:** Britain’s naval blockade cut off German imports of food, nitrates, and oil, causing severe domestic malnutrition and industrial shortages by 1917–1918.\n- **American Entry (1917) & Collapse of Allies:** Germany’s resumption of unrestricted submarine warfare brought the **United States** into the war, providing fresh troops and financial credit that defeated Germany’s **1918 Spring Offensive** and triggered the collapse of Bulgaria, the Ottoman Empire, Austria-Hungary, and the German monarchy in November 1918.'
    ].join('\n\n')
  },
  {
    id: 'world_war_two',
    patterns: [
      /(world war 2|world war ii|\bww2\b|\bwwii\b|second world war|axis|hitler|nazi).*(start|cause|lose|lost|germany|japan)/i,
      /why did (germany|hitler|japan|the axis) lose (ww2|world war 2|world war ii)/i
    ],
    eraYear: 1942,
    countryFocus: 'Germany',
    title: 'Why the Axis Powers (Germany, Japan, Italy) Lost World War II (1939–1945 CE)',
    response: [
      '**Why the Axis Powers Lost World War II (1939–1945 CE)**',
      '**1. Strategic Overextension on Multiple Fronts**\n- Nazi Germany failed to defeat Britain in the **Battle of Britain (1940)**, then invaded the **Soviet Union (Operation Barbarossa, June 1941)** while simultaneously declaring war on the **United States (December 1941)** after Japan’s attack on Pearl Harbor.',
      '**2. Allied Industrial & Resource Supremacy**\n- The Grand Alliance (**United States, Soviet Union, and British Empire**) outproduced the Axis powers by more than 3-to-1 in aircraft, tanks, artillery, naval vessels, and oil. The U.S. **Lend-Lease** program supplied Allied armies globally while the Soviet Union relocated factories east of the Urals.',
      '**3. Decisive Turning Points (1942–1944)**\n- **Eastern Front:** The Soviet victories at **Stalingrad (1942–1943)** and **Kursk (1943)** shattered the Wehrmacht’s offensive capacity.\n- **Pacific Theater:** The U.S. Navy broke Imperial Japanese naval airpower at **Midway (June 1942)** and **Guadalcanal**, followed by island-hopping campaigns, submarine blockade of Japanese shipping, and the **August 1945** atomic bombings and Soviet invasion of Manchuria.'
    ].join('\n\n')
  },
  {
    id: 'american_revolution',
    patterns: [
      /(american revolution|revolutionary war|thirteen colonies).*(britain|british|win|lose|lost|independence)/i,
      /why did (britain|the british) lose.*(america|colonies|revolutionary war)/i
    ],
    eraYear: 1781,
    countryFocus: 'United States of America',
    title: 'Why Britain Lost the American Revolutionary War (1775–1783 CE)',
    response: [
      '**Why the British Empire Lost the American War of Independence (1775–1783 CE)**',
      '**1. Asymmetric Geography & Washington’s Fabian Strategy**\n- To win, Britain had to pacify a continent stretching 1,000 miles across 3,000 miles of Atlantic Ocean; **George Washington** only needed to keep the **Continental Army** intact, avoiding total destruction while exhausting British political will.',
      '**2. Decisive Intervention of France, Spain, and the Netherlands (After Saratoga, 1777)**\n- After the American victory at **Saratoga (1777)**, **France** (joined by Spain and the Dutch Republic) entered the war, turning a colonial rebellion into a global naval war that forced Britain to defend the Caribbean, Gibraltar, and the English Channel.',
      '**3. French Naval Blockade at Yorktown (1781)**\n- In October 1781, French Admiral **de Grasse** defeated the Royal Navy at the Battle of the Chesapeake, trapping British General **Cornwallis** at **Yorktown** against Franco-American land forces under Washington and Rochambeau, leading to the **Treaty of Paris (1783)**.'
    ].join('\n\n')
  },
  {
    id: 'abbasid_islamic_golden_age',
    patterns: [
      /(abbasid|umayyad|rashidun|islamic golden age|baghdad|caliphate).*(fall|collapse|lose|lost|mongol|1258|rise|conquer)/i,
      /why did the (abbasid|umayyad|caliphate) (fall|collapse|lose|decline)/i
    ],
    eraYear: 1258,
    countryFocus: 'Iraq',
    title: 'Rise and Fall of the Umayyad & Abbasid Caliphates and the Siege of Baghdad (632–1258 CE)',
    response: [
      '**The Rise and Fall of the Umayyad & Abbasid Caliphates (632–1258 CE)**',
      '**1. Rapid Early Conquests (Rashidun & Umayyad Era, 632–750 CE)**\n- Decades of exhausting war between the **Byzantine** and **Sasanian Persian** empires left both states militarily and fiscally depleted. Unified Arab armies under commanders like **Khalid ibn al-Walid** won decisive victories at **Yarmouk (636 CE)** and **al-Qadisiyyah (636 CE)**, creating an empire stretching from Spain (*Al-Andalus*) to the Indus River.',
      '**2. The Abbasid Golden Age & Gradual Political Decentralization (750–1100 CE)**\n- Centered in **Baghdad** (founded 762 CE), the **Abbasid Caliphate** fostered the *House of Wisdom* (*Bayt al-Hikma*), advancing algebra, optics, medicine, and astronomy.\n- Over time, reliance on Turkic slave-soldiers (*ghilman/mamluks*) and the rise of autonomous regional dynasties (**Fatimids** in Egypt, **Buyids** and **Seljuk Turks** in Persia/Iraq) reduced the Abbasid Caliphs’ direct territorial control.',
      '**3. The Mongol Sack of Baghdad (1258 CE)**\n- In **February 1258**, Mongol forces under **Hulagu Khan** (grandson of Genghis Khan) besieged Baghdad after Caliph **al-Musta’sim** refused submission. The Mongols breached the city walls and dikes, destroying Baghdad’s irrigation networks and libraries, and executing the Caliph—ending the classical Abbasid Caliphate in Iraq.'
    ].join('\n\n')
  },
  {
    id: 'crusades_saladin',
    patterns: [
      /\b(crusade|crusades|crusader|saladin|jerusalem|hattin|richard the lionheart)\b/i
    ],
    eraYear: 1187,
    countryFocus: 'Israel',
    title: 'The Crusades, Saladin, and Why the Crusader States Fell (1095–1291 CE)',
    response: [
      '**The Crusades & Why the Crusader States Ultimately Fell (1095–1291 CE)**',
      '**1. Why the First Crusade Succeeded (1096–1099 CE)**\n- Launched by **Pope Urban II** in 1095, the First Crusade arrived in the Levant at a moment of deep division between the **Sunni Seljuk Turks** in Syria and the **Shia Fatimid Caliphate** in Egypt, enabling the capture of **Jerusalem in 1099** and the creation of four Crusader states (Jerusalem, Antioch, Edessa, Tripoli).',
      '**2. Unification Under Zengi, Nur ad-Din, and Saladin (Battle of Hattin, 1187)**\n- Once Muslim Syria and Egypt were unified under **Saladin (Salah ad-Din)**, founder of the **Ayyubid Dynasty**, the outnumbered Crusader states were strategically encircled.\n- At the **Battle of Hattin (July 4, 1187)**, Saladin cut the Crusader army off from water near Lake Tiberias, annihilating their field force and recapturing Jerusalem.',
      '**3. Final Expulsion by the Mamluk Sultanate (1291 CE)**\n- Although the **Third Crusade** (led by **Richard the Lionheart** and Philip II) preserved a coastal strip around **Acre**, the **Mamluk Sultans** of Egypt (**Baibars** and **al-Ashraf Khalil**) systematically reduced the remaining Crusader fortresses, capturing Acre in **1291**.'
    ].join('\n\n')
  },
  {
    id: 'french_revolution',
    patterns: [
      /(french revolution|louis xvi|bastille|reign of terror|robespierre|1789)/i
    ],
    eraYear: 1789,
    countryFocus: 'France',
    title: 'Causes and Impact of the French Revolution (1789–1799 CE)',
    response: [
      '**Why the French Revolution Happened & How It Transformed Europe (1789–1799 CE)**',
      '**1. Sovereign Debt & Fiscal Bankruptcy**\n- France’s costly intervention in the **Seven Years’ War** and the **American Revolutionary War** left King **Louis XVI’s** treasury bankrupt, while the First Estate (clergy) and Second Estate (nobility) resisted taxation.',
      '**2. Social Inequality (The Three Estates) & Harvest Failures**\n- The **Third Estate** (98% of the population, from bourgeois professionals to peasants) bore almost the entire tax burden. Severe hailstorms and grain shortages in **1788–1789** doubled bread prices, sparking the convocation of the **Estates-General**, the **Storming of the Bastille (July 14, 1789)**, and the *Declaration of the Rights of Man and of the Citizen*.',
      '**3. Radicalization, Revolutionary Wars & Rise of Napoleon**\n- Foreign invasion by Austria and Prussia (1792) triggered the abolition of the monarchy, the execution of Louis XVI, the Jacobin **Reign of Terror** under **Robespierre**, and mass conscription (*levée en masse*), ultimately paving the way for **Napoleon Bonaparte’s** coup of **18 Brumaire (1799)**.'
    ].join('\n\n')
  },
  {
    id: 'industrial_revolution_british_empire',
    patterns: [
      /(industrial revolution|why did britain industrialize|how did britain become so powerful|how did the british empire)/i
    ],
    eraYear: 1850,
    countryFocus: 'United Kingdom',
    title: 'The Industrial Revolution & Why the British Empire Became the Dominant Global Power (1760–1914 CE)',
    response: [
      '**Why the Industrial Revolution Began in Britain & Powered the British Empire (1760–1914 CE)**',
      '**1. Geography, Coal & Navigable Waterways**\n- Britain possessed abundant, easily accessible **coal and iron ore** deposits close to navigable rivers and ports, alongside an island geography protected from continental land invasions.',
      '**2. Institutional Framework, Finance & Scientific Innovation**\n- After the **Glorious Revolution (1688)**, parliamentary checks on royal power, secure property rights, patent laws, and the **Bank of England (1694)** created deep capital markets.\n- Innovations like **James Watt’s steam engine**, mechanized textile spinning, the **Bessemer steel process**, and steam railways gave Britain an early manufacturing monopoly ("the workshop of the world").',
      '**3. Royal Navy Supremacy & Global Mercantile Network**\n- Controlling strategic maritime choke points (**Gibraltar, Suez, Cape Town, Aden, Malacca, Singapore, Hong Kong**) allowed Britain to project naval and financial power across a quarter of the Earth’s landmass by 1900.'
    ].join('\n\n')
  },
  {
    id: 'american_civil_war',
    patterns: [
      /(american civil war|confederacy|confederate|union win|south lose|abraham lincoln|gettysburg|1861)/i
    ],
    eraYear: 1863,
    countryFocus: 'United States of America',
    title: 'Causes of the American Civil War & Why the Confederacy Lost (1861–1865 CE)',
    response: [
      '**The American Civil War: Causes & Why the Union Defeated the Confederacy (1861–1865 CE)**',
      '**1. Root Cause: Slavery & Western Territorial Expansion**\n- The war was caused by the irreconcilable conflict over the expansion of **chattel slavery** into western territories following the election of **Abraham Lincoln** in November 1860, prompting eleven Southern states to secede and form the **Confederate States of America**.',
      '**2. Overwhelming Union Demographic, Industrial & Rail Superiority**\n- The **Union (North)** held a **22 million to 9 million** population advantage (including 3.5 million enslaved people in the South), **90% of U.S. industrial manufacturing**, **70% of railway mileage**, and complete naval control (**Operation Anaconda** blockade of Southern cotton exports).',
      '**3. Emancipation Proclamation & Decisive Campaigns (1862–1865)**\n- Lincoln’s **Emancipation Proclamation (1863)** prevented British or French recognition of the Confederacy and brought nearly **200,000 Black soldiers** into the Union Army.\n- Twin Union victories at **Gettysburg** and **Vicksburg (July 1863)**, followed by **Ulysses S. Grant’s** Overland Campaign and **William Tecumseh Sherman’s** March to the Sea, forced **Robert E. Lee’s** surrender at **Appomattox (April 1865)**.'
    ].join('\n\n')
  },
  {
    id: 'meiji_russo_japanese',
    patterns: [
      /(meiji restoration|russo-japanese|how did japan modernize|why did russia lose to japan)/i
    ],
    eraYear: 1905,
    countryFocus: 'Japan',
    title: 'The Meiji Restoration & How Japan Defeated the Russian Empire (1868–1905 CE)',
    response: [
      '**How Meiji Japan Modernized and Defeated the Russian Empire (1868–1905 CE)**',
      '**1. The Meiji Restoration (1868)**\n- Recognizing the threat of Western gunboat diplomacy after Commodore **Matthew Perry’s** 1853 arrival, reformist samurai overthrew the **Tokugawa Shogunate** and restored **Emperor Meiji** in 1868.\n- Japan abolished feudal domains, established universal education, adopted a Prussian-style constitution and conscript army, built a British-modeled navy, and industrialized rapidly (*Fukoku Kyōhei* — "Enrich the Country, Strengthen the Armed Forces").',
      '**2. Victory in the Russo-Japanese War (1904–1905)**\n- Competing over Manchuria and Korea, Japan launched a surprise naval attack on **Port Arthur (1904)**.\n- Because Russian reinforcements had to travel 5,500 miles along a single-track **Trans-Siberian Railway** or sail 18,000 miles around Africa, Japanese forces captured Port Arthur, won the massive land **Battle of Mukden**, and under **Admiral Tōgō Heihachirō** annihilated the Russian Baltic Fleet at the **Battle of Tsushima (May 1905)**.'
    ].join('\n\n')
  },
  {
    id: 'scramble_for_africa_adwa',
    patterns: [
      /(scramble for africa|berlin conference|colonization of africa|ethiopia.*italy|battle of adwa|menelik)/i
    ],
    eraYear: 1885,
    countryFocus: 'Ethiopia',
    title: 'The Scramble for Africa & How Ethiopia Defeated Italy at Adwa (1884–1914 CE)',
    response: [
      '**The Scramble for Africa (1884–1914) & Ethiopia’s Victory at Adwa (1896)**',
      '**1. Why Europe Partitioned Africa So Rapidly After 1880**\n- Prior to the 1870s, European presence in Africa was mostly coastal due to **malaria** and strong interior kingdoms. Three breakthroughs enabled rapid conquest: **quinine prophylaxis** against malaria, **steam-powered riverboats**, and **rapid-fire Maxim machine guns and breech-loading rifles**.\n- At the **Berlin Conference (1884–1885)**, European powers established rules for "effective occupation," carving Africa into colonial possessions without African representation.',
      '**2. How Ethiopia Preserved Independence (Battle of Adwa, 1896)**\n- **Emperor Menelik II of Ethiopia** skillfully played European powers against each other to import over 100,000 modern French and Russian rifles and artillery pieces.\n- When Italy invaded to enforce a disputed treaty (Treaty of Wuchale), Menelik mobilized a united national army of 100,000 troops and decisively defeated the Italian army at the **Battle of Adwa (March 1, 1896)**, securing formal recognition of Ethiopian sovereignty.'
    ].join('\n\n')
  },
  {
    id: 'thirty_years_war_westphalia',
    patterns: [
      /(thirty years'? war|peace of westphalia|1648|protestant reformation|martin luther|habsburg)/i
    ],
    eraYear: 1648,
    countryFocus: 'Germany',
    title: 'The Protestant Reformation, Thirty Years’ War & Peace of Westphalia (1517–1648 CE)',
    response: [
      '**The Reformation, the Thirty Years’ War & the Peace of Westphalia (1517–1648 CE)**',
      '**1. Religious & Geopolitical Fracture**\n- Following **Martin Luther’s** 1517 Reformation, the **Holy Roman Empire** fractured between Catholic **Habsburg** emperors and Protestant German princes.\n- In **1618**, the **Defenestration of Prague** ignited the **Thirty Years’ War (1618–1648)**, which escalated from a Bohemian religious revolt into a continental struggle involving Spain, Austria, Sweden (under **Gustavus Adolphus**), Denmark, the Dutch Republic, and Catholic **France** (under **Cardinal Richelieu**, who allied with Protestants to break Habsburg encirclement).',
      '**2. The Peace of Westphalia (1648) & Modern State Sovereignty**\n- After devastating up to a third of Germany’s population, the **Peace of Westphalia (1648)** recognized Dutch and Swiss independence, decentralized the Holy Roman Empire, and established the modern principle of **Westphalian sovereignty** (non-interference in the domestic affairs of sovereign states).'
    ].join('\n\n')
  },
  {
    id: 'hundred_years_war',
    patterns: [
      /(hundred years'? war|agincourt|joan of arc|crecy|plantagenet|valois)/i
    ],
    eraYear: 1429,
    countryFocus: 'France',
    title: 'The Hundred Years’ War & Why France Ultimately Defeated England (1337–1453 CE)',
    response: [
      '**The Hundred Years’ War: English Longbow Victories & Ultimate French Triumph (1337–1453 CE)**',
      '**1. Why England Dominated Early On (Crécy, Poitiers, Agincourt)**\n- English kings claimed the French throne while holding rich feudal fiefs in Aquitaine. Deployed in defensive positions, **English and Welsh longbowmen** decimated charges of heavily armored French feudal knights at **Crécy (1346)**, **Poitiers (1356)**, and **Agincourt (1415)** under **Henry V**.',
      '**2. Why France Ultimately Won (1429–1453)**\n- **Demographic & Resource Scale:** France had nearly four times the population and tax base of England.\n- **Joan of Arc & National Awakening (1429):** **Joan of Arc’s** relief of the **Siege of Orléans (1429)** and the coronation of **Charles VII** at Reims rallied French national legitimacy.\n- **Bureaucratic Artillery Revolution:** Charles VII created Europe’s first permanent standing taxation (*taille*), a professional standing army (*Compagnies d’Ordonnance*), and the **Bureau brothers’ siege artillery**, which blasted English castles and defeated English longbowmen at **Formigny (1450)** and **Castillon (1453)**.'
    ].join('\n\n')
  },
  {
    id: 'greek_persian_peloponnesian',
    patterns: [
      /(thermopylae|marathon|salamis|greco-persian|peloponnesian war|sparta.*athens|athens.*sparta|xerxes|leonidas)/i
    ],
    eraYear: -480,
    countryFocus: 'Greece',
    title: 'The Greco-Persian Wars & the Peloponnesian War (499–404 BCE)',
    response: [
      '**Classical Greece: The Greco-Persian Wars (499–449 BCE) & Peloponnesian War (431–404 BCE)**',
      '**1. How the Greek City-States Repelled the Persian Empire**\n- Despite the vast scale of the **Achaemenid Persian Empire** under **Darius I** and **Xerxes I**, Greek *poleis* leveraged heavy bronze **hoplite phalanx** armor in narrow terrain (**Marathon 490 BCE**, **Thermopylae 480 BCE**) and **Themistocles’** agile Athenian trireme fleet in the narrow straits of **Salamis (480 BCE)**, severing Xerxes’ maritime supply lines before winning at **Plataea (479 BCE)**.',
      '**2. Why Athens Lost the Peloponnesian War Against Sparta (431–404 BCE)**\n- Following the Persian defeat, Athens turned the **Delian League** into an maritime empire, provoking land-based **Sparta** and the **Peloponnesian League**.\n- **Plague of Athens (430 BCE):** Killed a third of Athens’ population, including **Pericles**.\n- **Disastrous Sicilian Expedition (415–413 BCE):** Athens lost two entire fleets and 40,000 men trying to conquer Syracuse.\n- **Persian Gold & Lysander’s Fleet:** Sparta allied with **Persia**, using Persian subsidies to build a navy under **Lysander** that destroyed the last Athenian fleet at **Aegospotami (405 BCE)**.'
    ].join('\n\n')
  },
  {
    id: 'bronze_age_collapse',
    patterns: [
      /(bronze age collapse|sea peoples|1177 bce|hittite.*collapse|mycenaean)/i
    ],
    eraYear: -1177,
    countryFocus: 'Egypt',
    title: 'Why the Late Bronze Age Civilizations Collapsed (~1200–1150 BCE)',
    response: [
      '**Why the Late Bronze Age Collapse Happened (~1200–1150 BCE)**',
      'Around **1177 BCE**, the interconnected palace civilizations of the Eastern Mediterranean—the **Mycenaean Greeks**, the **Hittite Empire** in Anatolia, **Ugarit** in Syria, and the **Egyptian New Kingdom**—experienced a catastrophic systemic collapse.',
      '**1. Systems Collapse & Tin-Copper Trade Fragility**\n- Bronze required **copper** (mainly from Cyprus) and **tin** (imported across thousands of miles from Afghanistan or Cornwall). Once diplomatic and maritime networks were disrupted, states could no longer alloy bronze for weapons and tools.',
      '**2. Mega-Drought, Famine & Earthquakes**\n- Paleoclimatic pollen and core samples confirm a **centuries-long mega-drought** across Anatolia and the Levant around 1200 BCE, triggering severe grain famines alongside a "seismic storm" of earthquakes along tectonic fault lines.',
      '**3. Invasions of the "Sea Peoples" & Internal Rebellions**\n- Displaced maritime coalitions known in Egyptian inscriptions of **Ramesses III** (at **Medinet Habu, 1177 BCE**) as the **Sea Peoples** razed coastal cities from Mycenae and Hattusa to Ugarit. Only Egypt barely survived, though exhausted and shorn of its Levantine empire, ushering in the **Iron Age**.'
    ].join('\n\n')
  },
  {
    id: 'partition_of_india_1947',
    patterns: [
      /(partition of india|1947.*india|india.*pakistan.*split|british leave india|indian independence)/i
    ],
    eraYear: 1947,
    countryFocus: 'India',
    title: 'Why Britain Left India & the 1947 Partition of India and Pakistan',
    response: [
      '**Indian Independence & the Partition of 1947**',
      '**1. Why Britain Granted Independence After World War II (1945–1947)**\n- Decades of mass civil disobedience led by **Mahatma Gandhi** and the **Indian National Congress** (**Jawaharlal Nehru, Sardar Patel**) eroded the legitimacy of the British Raj.\n- **World War II** left Britain fiscally bankrupt, while the **1946 Royal Indian Navy Mutiny** and the **Indian National Army (INA)** trials convinced Prime Minister **Clement Attlee’s** government that Britain could no longer rely on Indian armed forces to maintain colonial rule.',
      '**2. Why Partition Occurred**\n- The **All-India Muslim League** under **Muhammad Ali Jinnah** advocated the *Two-Nation Theory*, fearing permanent Hindu-majority domination in a unitary state and calling for a sovereign **Pakistan**.\n- Following communal violence in 1946, Viceroy **Lord Mountbatten** accelerated the British withdrawal to **August 1947**, and the **Radcliffe Line** partitioned Punjab and Bengal in just five weeks, triggering the largest mass migration in human history (~15 million displaced).'
    ].join('\n\n')
  },
  {
    id: 'battle_of_plassey_buxar',
    patterns: [
      /\b(battle of plassey|plassey|siraj[- ]ud[- ]daulah|mir jafar|battle of buxar)\b/i
    ],
    eraYear: 1757,
    countryFocus: 'India',
    title: 'The Battles of Plassey (1757) & Buxar (1764): British Conquest of Bengal',
    response: [
      '**The Battle of Plassey (June 23, 1757) & Battle of Buxar (1764)**',
      'The **British East India Company (EIC)**, commanded by **Colonel Robert Clive**, won the **Battle of Plassey** on **June 23, 1757**, defeating **Nawab Siraj-ud-Daulah** of Bengal and his French artillery allies.',
      '**1. How the British Won at Plassey (1757)**\n- **Political Conspiracy & Defection:** Outnumbered (~3,000 EIC troops vs. ~50,000 Bengal troops), Robert Clive forged a secret pact with **Mir Jafar** (the Nawab’s commander-in-chief) and the **Jagat Seth** banking family. During the battle, Mir Jafar held back the majority of the Bengal army and defected.\n- **Monsoon Rain & Artillery Advantage:** A heavy monsoon downpour soaked the Bengal army’s uncovered gunpowder, while British gunners protected their powder with tarpaulins and shattered the Nawab’s advancing cavalry.',
      '**2. Geopolitical Consequences (Plassey 1757 to Buxar 1764)**\n- Mir Jafar was installed as a puppet Nawab, transferring massive bullion reserves from the Bengal treasury to the EIC.\n- Seven years later, at the **Battle of Buxar (October 22, 1764)**, EIC forces under **Hector Munro** defeated the combined armies of Mughal Emperor **Shah Alam II**, the Nawab of Awadh (**Shuja-ud-Daula**), and **Mir Qasim**, leading to the **Treaty of Allahabad (1765)** which granted Britain tax collection rights (*Diwani*) over Bengal, Bihar, and Orissa.'
    ].join('\n\n')
  },
  {
    id: 'greenland_denmark_status',
    patterns: [
      /\bgreenland\b/i
    ],
    eraYear: 2026,
    countryFocus: 'Greenland',
    title: 'Greenland (Kalaallit Nunaat) — Autonomous Territory of the Kingdom of Denmark',
    response: [
      '**Greenland (Kalaallit Nunaat) & Its Status Within the Kingdom of Denmark**',
      '**Greenland** is the world’s largest island (2.16 million km²) and is **not an independent sovereign nation**—it is an **autonomous constituent territory of the Kingdom of Denmark** (*Rigsfællesskabet* / the Unity of the Realm), alongside metropolitan Denmark and the Faroe Islands.',
      '**1. Constitutional Status & Governance**\n- **Sovereign Realm:** The **Kingdom of Denmark** (Capital: **Copenhagen**; Head of State: **King Frederik X**). Denmark retains constitutional authority over foreign policy, defense, security, currency (**Danish krone**), and citizenship.\n- **Local Self-Rule in Nuuk:** Under the **1979 Home Rule Act** and the **2009 Self-Government Act** (*Selvstyre*), Greenland’s own elected parliament (**Inatsisartut**) and government (**Naalakkersuisut**, led by the Prime Minister of Greenland in the capital **Nuuk**) exercise domestic authority over taxation, education, healthcare, fisheries, and mineral resources.',
      '**2. Historical Tie to Denmark (982 CE – Present)**\n- **Norse & Inuit Roots:** Settled by Norse Icelanders under **Erik the Red (982 CE)** and **Thule Inuit** ancestors of the modern **Kalaallit** people (~89% of today’s ~56,900 population). Greenland entered union with Norway in 1261 and with the **Danish Crown in 1380 (Kalmar Union 1397)**.\n- **1721 & 1814 Treaty of Kiel:** Following Hans Egede’s 1721 mission at Godthåb (**Nuuk**), the **1814 Treaty of Kiel** transferred Norway to Sweden while explicitly keeping Greenland under the **Kingdom of Denmark**.\n- **1953 Integration:** The 1953 Danish Constitution ended Greenland’s colonial status, integrating it into the Kingdom of Denmark with two seats in the Danish Parliament (*Folketing*).'
    ].join('\n\n')
  },
  {
    id: 'first_us_president_washington',
    patterns: [
      /(first president.*(united states|usa|america)|who was george washington)/i
    ],
    eraYear: 1789,
    countryFocus: 'United States of America',
    title: 'George Washington — First President of the United States (1789–1797)',
    response: [
      '**George Washington: First President of the United States (1789–1797)**',
      'The first President of the United States was **George Washington (1732–1799)**, who was unanimously elected by the Electoral College and inaugurated on **April 30, 1789** in New York City (then the temporary federal capital before Philadelphia and Washington, D.C.).',
      '**1. Revolutionary War Command & Constitutional Convention**\n- As Commander-in-Chief of the **Continental Army (1775–1783)**, Washington led American forces to victory over Great Britain in the **American Revolutionary War** (culminating at the **Siege of Yorktown, 1781**) and presided over the **1787 Constitutional Convention** in Philadelphia.',
      '**2. Defining Precedents of the Presidency (1789–1797)**\n- Established the inaugural presidential Cabinet (including **Alexander Hamilton** at Treasury and **Thomas Jefferson** at State), signed the **Judiciary Act of 1789** and the **Bill of Rights (1791)**, maintained US neutrality during the French Revolutionary Wars, and voluntarily stepped down after **two terms** in 1797—setting the foundational democratic precedent for the peaceful transfer of power.'
    ].join('\n\n')
  },
  {
    id: 'norman_conquest_1066',
    patterns: [
      /\b(1066|battle of hastings|norman conquest|william the conqueror|harold godwinson)\b/i
    ],
    eraYear: 1066,
    countryFocus: 'United Kingdom',
    title: '1066 CE: The Battle of Hastings & the Norman Conquest of England',
    response: [
      '**What Happened in 1066 CE: The Norman Conquest of England**',
      'The year **1066 CE** was one of the most decisive turning points in European history, transforming the Kingdom of England through three major battles following the death of Anglo-Saxon King **Edward the Confessor** in January 1066:',
      '**1. Battle of Stamford Bridge (September 25, 1066)**\n- Newly crowned Anglo-Saxon King **Harold Godwinson (Harold II)** marched north and defeated the invading Norwegian army of **King Harald Hardrada** and Tostig at Stamford Bridge in Yorkshire—often cited as the end of the **Viking Age**.',
      '**2. Battle of Hastings (October 14, 1066)**\n- Days later, **William, Duke of Normandy (William the Conqueror)** landed in southern England. Harold force-marched his exhausted army south to Senlac Hill near Hastings. After a day-long battle against the Anglo-Saxon shield wall, Norman feigned-retreat cavalry tactics broke the English line, Harold was killed, and William was crowned King of England at Westminster Abbey on **Christmas Day 1066**.',
      '**3. Long-Term Impact**\n- Replaced the Anglo-Saxon aristocracy with a Franco-Norman feudal elite, commissioned the **Domesday Book (1086)**, merged Old English with Norman French to create **Middle/Modern English**, and linked England politically to continental France for centuries.'
    ].join('\n\n')
  }
];

interface EntityAliasMapping {
  regex: RegExp;
  countryName: string;
  historicalEntityLabel: string;
  defaultEraYear: number;
}

const HISTORICAL_ENTITY_MAPPINGS: EntityAliasMapping[] = [
  { regex: /\bmughal(s| empire)?\b/i, countryName: 'India', historicalEntityLabel: 'Mughal Empire', defaultEraYear: 1700 },
  { regex: /\bmaurya(n| empire)?\b/i, countryName: 'India', historicalEntityLabel: 'Maurya Empire', defaultEraYear: -250 },
  { regex: /\bgupta( empire)?\b/i, countryName: 'India', historicalEntityLabel: 'Gupta Empire', defaultEraYear: 400 },
  { regex: /\bmaratha(s| confederacy| empire)?\b/i, countryName: 'India', historicalEntityLabel: 'Maratha Confederacy', defaultEraYear: 1760 },
  { regex: /\bchola(s| dynasty| empire)?\b/i, countryName: 'India', historicalEntityLabel: 'Chola Empire', defaultEraYear: 1025 },
  { regex: /\bdelhi sultanate\b/i, countryName: 'India', historicalEntityLabel: 'Delhi Sultanate', defaultEraYear: 1320 },
  { regex: /\bsikh empire\b/i, countryName: 'Pakistan', historicalEntityLabel: 'Sikh Empire', defaultEraYear: 1830 },
  { regex: /\beast india company\b/i, countryName: 'United Kingdom', historicalEntityLabel: 'British East India Company', defaultEraYear: 1765 },
  { regex: /\bbritish empire\b/i, countryName: 'United Kingdom', historicalEntityLabel: 'British Empire', defaultEraYear: 1880 },
  { regex: /\b(britain|british|england|english|united kingdom|\buk\b)\b/i, countryName: 'United Kingdom', historicalEntityLabel: 'United Kingdom / British Empire', defaultEraYear: 1850 },
  { regex: /\b(roman empire|ancient rome|\brome\b|\bromans\b)\b/i, countryName: 'Italy', historicalEntityLabel: 'Roman Empire', defaultEraYear: 117 },
  { regex: /\b(byzantine(s| empire)?|constantinople|eastern roman)\b/i, countryName: 'Turkey', historicalEntityLabel: 'Byzantine Empire', defaultEraYear: 1000 },
  { regex: /\bottoman(s| empire)?\b/i, countryName: 'Turkey', historicalEntityLabel: 'Ottoman Empire', defaultEraYear: 1683 },
  { regex: /\bseljuk(s| empire)?\b/i, countryName: 'Turkey', historicalEntityLabel: 'Seljuk Empire', defaultEraYear: 1071 },
  { regex: /\bhittite(s| empire)?\b/i, countryName: 'Turkey', historicalEntityLabel: 'Hittite Empire', defaultEraYear: -1274 },
  { regex: /\b(achaemenid|persian empire|ancient persia|\bpersia\b|\bsafavid\b|\bsasanian|\bsassanid|\bparthia)\b/i, countryName: 'Iran', historicalEntityLabel: 'Persian Empire', defaultEraYear: -480 },
  { regex: /\b(abbasid(s| caliphate)?|umayyad|rashidun|caliphate)\b/i, countryName: 'Iraq', historicalEntityLabel: 'Abbasid / Umayyad Caliphate', defaultEraYear: 850 },
  { regex: /\b(babylon(ia)?|mesopotamia|assyria(n)?|sumer(ian)?|akkad(ian)?)\b/i, countryName: 'Iraq', historicalEntityLabel: 'Mesopotamian Empires', defaultEraYear: -1750 },
  { regex: /\b(mongol(s| empire)?|genghis khan|kublai khan|golden horde|ilkhanate|timurid|tamerlane)\b/i, countryName: 'Mongolia', historicalEntityLabel: 'Mongol Empire', defaultEraYear: 1260 },
  { regex: /\bqing( dynasty)?\b/i, countryName: 'China', historicalEntityLabel: 'Qing Dynasty', defaultEraYear: 1840 },
  { regex: /\bming( dynasty)?\b/i, countryName: 'China', historicalEntityLabel: 'Ming Dynasty', defaultEraYear: 1450 },
  { regex: /\bsong( dynasty)?\b/i, countryName: 'China', historicalEntityLabel: 'Song Dynasty', defaultEraYear: 1100 },
  { regex: /\btang( dynasty)?\b/i, countryName: 'China', historicalEntityLabel: 'Tang Dynasty', defaultEraYear: 750 },
  { regex: /\bhan( dynasty)?\b/i, countryName: 'China', historicalEntityLabel: 'Han Dynasty', defaultEraYear: 100 },
  { regex: /\bqin( dynasty)?\b/i, countryName: 'China', historicalEntityLabel: 'Qin Dynasty', defaultEraYear: -221 },
  { regex: /\b(tokugawa|shogunate|edo period|meiji|samurai|imperial japan)\b/i, countryName: 'Japan', historicalEntityLabel: 'Tokugawa Shogunate / Imperial Japan', defaultEraYear: 1700 },
  { regex: /\b(soviet union|\bussr\b|bolshevik|red army)\b/i, countryName: 'Russia', historicalEntityLabel: 'Soviet Union (USSR)', defaultEraYear: 1962 },
  { regex: /\b(russian empire|tsarist|peter the great|catherine the great)\b/i, countryName: 'Russia', historicalEntityLabel: 'Russian Empire', defaultEraYear: 1812 },
  { regex: /\b(napoleon(ic)?|french empire|new france|frankish|charlemagne|carolingian)\b/i, countryName: 'France', historicalEntityLabel: 'French Empire', defaultEraYear: 1812 },
  { regex: /\b(spanish empire|new spain|conquistador|castile|aragon)\b/i, countryName: 'Spain', historicalEntityLabel: 'Spanish Empire', defaultEraYear: 1580 },
  { regex: /\b(portuguese empire|vasco da gama)\b/i, countryName: 'Portugal', historicalEntityLabel: 'Portuguese Empire', defaultEraYear: 1550 },
  { regex: /\b(dutch republic|dutch empire|\bvoc\b|dutch east india)\b/i, countryName: 'Netherlands', historicalEntityLabel: 'Dutch Empire', defaultEraYear: 1650 },
  { regex: /\b(aztec(s| empire)?|tenochtitlan|moctezuma)\b/i, countryName: 'Mexico', historicalEntityLabel: 'Aztec Empire', defaultEraYear: 1519 },
  { regex: /\bmaya(n| civilization)?\b/i, countryName: 'Guatemala', historicalEntityLabel: 'Maya Civilization', defaultEraYear: 600 },
  { regex: /\b(inca(s| empire)?|tawantinsuyu|atahualpa|cusco)\b/i, countryName: 'Peru', historicalEntityLabel: 'Inca Empire', defaultEraYear: 1525 },
  { regex: /\b(prussia(n)?|german empire|holy roman empire|weimar|bismarck|third reich|nazi)\b/i, countryName: 'Germany', historicalEntityLabel: 'Prussia / German Empire', defaultEraYear: 1871 },
  { regex: /\b(habsburg|austro-hungarian|austria-hungary)\b/i, countryName: 'Austria', historicalEntityLabel: 'Habsburg / Austro-Hungarian Empire', defaultEraYear: 1910 },
  { regex: /\b(polish-lithuanian|commonwealth)\b/i, countryName: 'Poland', historicalEntityLabel: 'Polish-Lithuanian Commonwealth', defaultEraYear: 1650 },
  { regex: /\b(hejaz|najd|saudi|arabia)\b/i, countryName: 'Saudi Arabia', historicalEntityLabel: 'Arabia (Hejaz & Najd)', defaultEraYear: 1800 },
  { regex: /\b(carthage|carthaginian|hannibal|punic)\b/i, countryName: 'Tunisia', historicalEntityLabel: 'Carthaginian Empire', defaultEraYear: -218 },
  { regex: /\b(ptolemaic|pharaoh|ancient egypt|mamluk|ayyubid|fatimid|cleopatra|ramesses)\b/i, countryName: 'Egypt', historicalEntityLabel: 'Egypt', defaultEraYear: -1274 },
  { regex: /\b(mali empire|mansa musa|songhai|timbuktu)\b/i, countryName: 'Mali', historicalEntityLabel: 'Mali / Songhai Empire', defaultEraYear: 1324 },
  { regex: /\b(axum|aksum|abyssinia|menelik)\b/i, countryName: 'Ethiopia', historicalEntityLabel: 'Ethiopian Empire', defaultEraYear: 1896 },
  { regex: /\bzulu(s| kingdom)?\b/i, countryName: 'South Africa', historicalEntityLabel: 'Zulu Kingdom', defaultEraYear: 1879 },
  { regex: /\b(alexander the great|macedon(ia|ian)?|sparta(n)?|athens|athenian)\b/i, countryName: 'Greece', historicalEntityLabel: 'Ancient Greece / Macedon', defaultEraYear: -331 },
  { regex: /\b(khmer empire|angkor)\b/i, countryName: 'Cambodia', historicalEntityLabel: 'Khmer Empire', defaultEraYear: 1150 },
  { regex: /\b(majapahit|sriwijaya)\b/i, countryName: 'Indonesia', historicalEntityLabel: 'Majapahit / Srivijaya', defaultEraYear: 1350 },
  { regex: /\b(joseon|goryeo|goguryeo)\b/i, countryName: 'South Korea', historicalEntityLabel: 'Joseon / Goryeo Korea', defaultEraYear: 1592 },
  { regex: /\b(wal+achia|val+achia|tara romaneasca|vlad( the impaler| iii| tepes| dracula)?|dracula|impaler|targoviste)\b/i, countryName: 'Romania', historicalEntityLabel: 'Principality of Wallachia', defaultEraYear: 1462 },
  { regex: /\b(moldavia|stephen the great|stefan cel mare|suceava)\b/i, countryName: 'Romania', historicalEntityLabel: 'Principality of Moldavia', defaultEraYear: 1475 },
  { regex: /\b(transylvania|michael the brave|mihai viteazul|alba iulia|bran castle)\b/i, countryName: 'Romania', historicalEntityLabel: 'Principality of Transylvania', defaultEraYear: 1600 },
  { regex: /\b(dacia(n)?|decebalus|burebista)\b/i, countryName: 'Romania', historicalEntityLabel: 'Kingdom of Dacia', defaultEraYear: 100 },
  { regex: /\b(kievan rus|kyivan rus|yaroslav the wise|vladimir the great)\b/i, countryName: 'Ukraine', historicalEntityLabel: 'Kievan Rus’', defaultEraYear: 1050 },
  { regex: /\b(bohemia(n)?|charles iv|hussite|jan zizka)\b/i, countryName: 'Czechia', historicalEntityLabel: 'Kingdom of Bohemia', defaultEraYear: 1355 },
  { regex: /\b(skanderbeg|kastrioti|league of lezhe)\b/i, countryName: 'Albania', historicalEntityLabel: 'League of Lezhë (Albania)', defaultEraYear: 1450 },
  { regex: /\b(viking(s)?|norse|kalmar union|swedish empire)\b/i, countryName: 'Sweden', historicalEntityLabel: 'Viking Age / Swedish Empire', defaultEraYear: 950 },
  { regex: /\b(united states|\busa\b|american revolution|thirteen colonies|confederacy)\b/i, countryName: 'United States of America', historicalEntityLabel: 'United States of America', defaultEraYear: 1783 }
];

/**
 * Extract all historical entities / countries mentioned in the user's message,
 * in the order they appear in the user's question!
 */
function findMentionedEntitiesInOrder(message: string): Array<{
  countryName: string;
  label: string;
  inferredYear: number | null;
  position: number;
}> {
  const results: Array<{
    countryName: string;
    label: string;
    inferredYear: number | null;
    position: number;
  }> = [];

  for (const mapping of HISTORICAL_ENTITY_MAPPINGS) {
    const match = mapping.regex.exec(message);
    if (match && match.index !== undefined) {
      if (!results.some((r) => r.countryName === mapping.countryName)) {
        results.push({
          countryName: mapping.countryName,
          label: mapping.historicalEntityLabel,
          inferredYear: mapping.defaultEraYear,
          position: match.index
        });
      }
    }
  }

  const lower = message.toLowerCase();
  for (const country of KNOWN_COUNTRIES) {
    const idx = lower.indexOf(country.toLowerCase());
    if (idx !== -1 && !results.some((r) => r.countryName === country)) {
      results.push({
        countryName: country,
        label: country,
        inferredYear: null,
        position: idx
      });
    }
  }

  return results.sort((a, b) => a.position - b.position);
}

/**
 * Extract a year mentioned in the user's message (e.g. "in 1750", "48 BCE", "1914"),
 * or infer it from historical empire names if none is explicitly typed.
 */
function extractTargetYear(
  message: string,
  fallbackYear: number,
  inferredEntityYear: number | null
): number {
  const bceMatch = message.match(/\b(\d{1,4})\s*(?:bce|bc)\b/i);
  if (bceMatch) {
    return -Math.abs(parseInt(bceMatch[1], 10));
  }
  const ceMatch = message.match(/\b(\d{1,4})\s*(?:ce|ad)\b/i);
  if (ceMatch) {
    return parseInt(ceMatch[1], 10);
  }
  const yearMatch = message.match(/\b(1\d{3}|20[0-2]\d|[3-9]\d{2})\b/);
  if (yearMatch) {
    const parsed = parseInt(yearMatch[1], 10);
    if (parsed >= 300 && parsed <= 2026) {
      return parsed;
    }
  }
  if (inferredEntityYear !== null) {
    return inferredEntityYear;
  }
  return fallbackYear;
}

/**
 * Synthesizes a comprehensive, historically grounded response using ChronoMap's
 * built-in historical atlas engine when the backend API is unreachable (e.g., on static hosting).
 */
export function generateLocalHistorianReply({
  message,
  year,
  activeContext,
  conversationHistory = []
}: LocalChatParams): LocalChatResult {
  const cleanMsg = message.trim();

  const isWhatIf =
    /what if|what-if|counterfactual|alternate|would have happened|suppose|had never|if .* had|instead of/i.test(
      cleanMsg
    );

  // 0. Check Curated Deep Historical Q&A Knowledge Base first (when not a counterfactual)
  if (!isWhatIf) {
    for (const qa of HISTORICAL_QA_KNOWLEDGE_BASE) {
      if (qa.patterns.some((p) => p.test(cleanMsg))) {
        return {
          reply: qa.response,
          isWhatIf: false,
          sources: getCreditedSourcesForRegion(qa.title, qa.countryFocus, qa.eraYear)
        };
      }
    }
  }

  // Extract all mentioned historical entities in order of appearance in the prompt
  let mentionedEntities = findMentionedEntitiesInOrder(cleanMsg);

  // Multi-turn follow-up resolution: if current question has no explicit entities (e.g. "Why did they lose?" or "Who ruled them then?"),
  // scan recent conversation history from newest to oldest to inherit the active historical entities!
  if (mentionedEntities.length === 0 && conversationHistory.length > 0) {
    for (let i = conversationHistory.length - 1; i >= 0; i--) {
      const priorEntities = findMentionedEntitiesInOrder(conversationHistory[i].content || '');
      if (priorEntities.length > 0) {
        mentionedEntities = priorEntities;
        break;
      }
    }
  }

  const primaryInferredYear =
    mentionedEntities.find((e) => e.inferredYear !== null)?.inferredYear ?? null;

  const targetYear = extractTargetYear(cleanMsg, year, primaryInferredYear);
  const yearDisplay = targetYear < 0 ? `${Math.abs(targetYear)} BCE` : `${targetYear} CE`;
  const era = getGeopoliticalEra(targetYear);

  // Check if query matches a search index item (historical figure, city, empire, conflict)
  // For figures and cities, require that the user's message actually mentions the figure/city name (not just its modern country)
  const searchMatches = searchHistoricalAtlas(cleanMsg, 5).filter((item) => {
    if (item.category === 'figure' || item.category === 'city') {
      const baseTitle = item.title.toLowerCase().split(' (')[0].split(' / ')[0];
      const msgLower = cleanMsg.toLowerCase();
      return (
        msgLower.includes(baseTitle) ||
        item.keywords.some(
          (kw) =>
            kw.length >= 4 &&
            kw !== item.modernCountry.toLowerCase() &&
            !['country', 'modern', 'war', 'conflict', 'dispute', 'usa', 'india', 'china', 'france', 'italy', 'egypt', 'russia', 'turkey', 'greece', 'japan', 'spain', 'mexico', 'peru', 'iran', 'iraq', 'united kingdom', 'united states of america'].includes(kw) &&
            msgLower.includes(kw)
        )
      );
    }
    return true;
  });
  const topSearchMatch = searchMatches.length > 0 ? searchMatches[0] : null;

  const isFollowUpPronounQuery =
    /\b(it|its|they|them|their|this country|this empire|this region|here|there|who ruled|what was the capital)\b/i.test(
      cleanMsg
    );

  // Check if query matches a specific conflict zone
  const matchedConflict =
    CONFLICT_ZONES.find(
      (c) =>
        cleanMsg.toLowerCase().includes(c.name.toLowerCase()) ||
        cleanMsg.toLowerCase().includes(c.shortLabel.toLowerCase()) ||
        (mentionedEntities.length >= 2 &&
          c.combatantsOrClaimants.some(
            (comb) =>
              comb.toLowerCase().includes(mentionedEntities[0].countryName.toLowerCase()) ||
              comb.toLowerCase().includes(mentionedEntities[0].label.toLowerCase().split(' ')[0])
          ) &&
          c.combatantsOrClaimants.some(
            (comb) =>
              comb.toLowerCase().includes(mentionedEntities[1].countryName.toLowerCase()) ||
              comb.toLowerCase().includes(mentionedEntities[1].label.toLowerCase().split(' ')[0])
          ))
    ) ||
    (activeContext?.type === 'conflict' &&
    (isFollowUpPronounQuery ||
      cleanMsg.toLowerCase().includes(activeContext.data.name.toLowerCase()))
      ? activeContext.data
      : null);

  const primaryCountryName =
    mentionedEntities[0]?.countryName ||
    (activeContext?.type === 'country' &&
    mentionedEntities.length === 0 &&
    !topSearchMatch &&
    (isFollowUpPronounQuery ||
      cleanMsg.toLowerCase().includes(activeContext.data.name.toLowerCase()) ||
      (activeContext.data.modernCountry &&
        cleanMsg.toLowerCase().includes(activeContext.data.modernCountry.toLowerCase())))
      ? activeContext.data.modernCountry || activeContext.data.name
      : null) ||
    topSearchMatch?.modernCountry ||
    null;

  const effectiveTargetYear =
    mentionedEntities.length === 0 &&
    topSearchMatch &&
    (topSearchMatch.category === 'figure' ||
      topSearchMatch.category === 'city' ||
      topSearchMatch.category === 'empire')
      ? topSearchMatch.year
      : targetYear;
  const effectiveYearDisplay =
    effectiveTargetYear < 0
      ? `${Math.abs(effectiveTargetYear)} BCE`
      : `${effectiveTargetYear} CE`;

  const countryEra = primaryCountryName
    ? getCountryEraData(primaryCountryName, effectiveTargetYear)
    : null;
  const modernProfile = primaryCountryName
    ? getCountryProfile(primaryCountryName)
    : null;

  const activeConflictsInYear = CONFLICT_ZONES.filter(
    (c) => effectiveTargetYear >= c.startYear && effectiveTargetYear <= c.endYear
  );

  const activeTradeRoutes = TRADE_ROUTES.filter(
    (r) => effectiveTargetYear >= r.activeStartYear && effectiveTargetYear <= r.activeEndYear
  );

  // 1. Handle Counterfactual / "What-If" Simulation
  if (isWhatIf) {
    const focalSubject =
      mentionedEntities.length >= 2
        ? `${mentionedEntities[0].label} vs. ${mentionedEntities[1].label}`
        : topSearchMatch?.title ||
          matchedConflict?.name ||
          countryEra?.entityName ||
          era.epochName;

    const focalContext = matchedConflict
      ? `${matchedConflict.name} (${matchedConflict.startDate}) in ${matchedConflict.region}, involving ${matchedConflict.combatantsOrClaimants.join(' vs. ')}. Historically, ${matchedConflict.summary}`
      : topSearchMatch &&
        (topSearchMatch.category === 'figure' || topSearchMatch.category === 'city')
      ? `${topSearchMatch.title} (${topSearchMatch.yearDisplay}): ${topSearchMatch.summary}`
      : countryEra
      ? `${countryEra.entityName} (${effectiveYearDisplay}), governed from ${countryEra.capital} under ${countryEra.ruler}. Historically: ${countryEra.description}`
      : `the ${era.epochName} (${era.timeRange}), when ${era.summary}`;

    const reply = [
      `**Counterfactual Historical Simulation — "${cleanMsg}"**`,
      `**1. Point of Divergence & Historical Baseline (${effectiveYearDisplay})**\nYour scenario introduces a pivotal divergence centered on **${focalSubject}**. In the documented historical timeline, this period is defined by ${focalContext}`,
      `**2. Immediate Geopolitical & Military Domino Effect (1–15 Years Post-Divergence)**\n- **Balance of Power Shift:** Altering the outcome around **${focalSubject}** immediately disrupts the command hierarchy, alliance treaties, and military logistics across ${matchedConflict?.region || primaryCountryName || 'the primary theater'}.\n- **Territorial & Administrative Realignment:** State treasuries, garrison deployments, and dynastic succession lines would be forced to adapt, preventing the historical consolidation that followed in our timeline.${countryEra ? ` Control over key nodes like **${countryEra.capital}** would shift decisively.` : ''}`,
      `**3. Medium-Term Economic, Colonial & Cultural Ripples (25–75 Years)**\n- **Trade & Maritime Networks:** ${
        activeTradeRoutes.length > 0
          ? `Major commercial arteries—including the **${activeTradeRoutes
              .slice(0, 2)
              .map((r) => r.name)
              .join('** and **')}**—would experience new tariff regimes and hegemonic protection.`
          : 'Continental and maritime trade corridors would re-route around the new dominant polity.'
      }\n- **Institutional & Technological Diffusion:** State patronage of military engineering, navigation, and legal codification would follow the victorious faction's institutional model rather than the historical trajectory.`,
      `**4. Long-Term Global Map Impact & Plausibility Assessment**\nOver centuries, this divergence reshapes regional borders, linguistic spheres, and sovereign state formation well into the modern era. **Historical Plausibility:** *Moderate-to-High* — while structural geography and demographic scale still constrain total conquest, single battlefield, diplomatic, or succession reversals at critical junctures have repeatedly redrawn the world map.`
    ].join('\n\n');

    return {
      reply,
      isWhatIf: true,
      sources: getCreditedSourcesForRegion(
        focalSubject,
        primaryCountryName || undefined,
        effectiveTargetYear
      )
    };
  }

  // 2. Multi-Polity Comparative / Conflict / "Why Did A Lose Against B" Analysis
  if (mentionedEntities.length >= 2) {
    const first = mentionedEntities[0];
    const second = mentionedEntities[1];
    const firstEra = getCountryEraData(first.countryName, targetYear);
    const secondEra = getCountryEraData(second.countryName, targetYear);

    const sharedConflicts = CONFLICT_ZONES.filter(
      (c) =>
        c.name.toLowerCase().includes(first.countryName.toLowerCase()) ||
        c.name.toLowerCase().includes(second.countryName.toLowerCase()) ||
        c.combatantsOrClaimants.some(
          (b) =>
            b.toLowerCase().includes(firstEra.entityName.toLowerCase()) ||
            b.toLowerCase().includes(secondEra.entityName.toLowerCase())
        )
    ).slice(0, 3);

    const reply = [
      `**Historical & Strategic Comparison: ${firstEra.entityName} vs. ${secondEra.entityName} (${yearDisplay})**`,
      `**1. Strategic Balance of Power**\n- **${firstEra.entityName} (${first.countryName}):** Governed from **${firstEra.capital}** under **${firstEra.ruler}** (Est. Population: ${firstEra.populationEstimate}). ${firstEra.description}\n- **${secondEra.entityName} (${second.countryName}):** Governed from **${secondEra.capital}** under **${secondEra.ruler}** (Est. Population: ${secondEra.populationEstimate}). ${secondEra.description}`,
      `**2. Key Factors in the Geopolitical & Military Outcome**\n- **State Centralization & Fiscal Capacity:** Outcomes between **${firstEra.entityName}** and **${secondEra.entityName}** were determined by treasury mobilization, tax collection efficiency, and internal political cohesion during **${yearDisplay}**.\n- **Military Technology, Logistics & Alliances:** Naval control of supply lines, gunpowder/industrial artillery standardization, and diplomatic coalitions with regional rivals shifted the strategic balance.\n- **Key Turning Points for ${firstEra.entityName}:** ${firstEra.keyEvents.join('; ')}.\n- **Key Turning Points for ${secondEra.entityName}:** ${secondEra.keyEvents.join('; ')}.`,
      sharedConflicts.length > 0
        ? `**3. Documented Wars & Flashpoints Involving These Powers**\n${sharedConflicts
            .map(
              (c) =>
                `- **${c.name}** (${c.startDate} — *${c.combatantsOrClaimants.join(' vs. ')}*): ${c.summary} **Root Cause:** ${c.historicalRoot}`
            )
            .join('\n')}`
        : `**3. Era Geopolitical Context (${era.epochName})**\n${era.summary} ${era.globalDynamics}`
    ].join('\n\n');

    return {
      reply,
      isWhatIf: false,
      sources: getCreditedSourcesForRegion(
        `${firstEra.entityName} and ${secondEra.entityName}`,
        first.countryName,
        targetYear
      )
    };
  }

  // 3. If query specifically matches a Conflict Zone / War / Dispute
  if (
    matchedConflict &&
    /war|conflict|battle|siege|dispute|crisis|front|invasion|casualt|fight|belligerent|why|how|what/i.test(
      cleanMsg + (activeContext?.type === 'conflict' ? ' conflict' : '')
    )
  ) {
    const reply = [
      `**${matchedConflict.name} (${matchedConflict.startDate})**`,
      `**Strategic Overview & Theater**\nLocated in **${matchedConflict.region}** (${matchedConflict.status} — Severity: ${matchedConflict.severity.toUpperCase()}), this flashpoint involves **${matchedConflict.combatantsOrClaimants.join('** vs. **')}**.\n\n${matchedConflict.summary}`,
      `**Historical Context & Root Causes**\n${matchedConflict.historicalRoot}`,
      `**Key Developments & Operational Dynamics**\n${matchedConflict.recentDevelopments}`,
      `**Human & Geopolitical Impact**\n- **Estimated Casualties / Impact:** ${matchedConflict.casualtiesOrImpact}`
    ].join('\n\n');

    return {
      reply,
      isWhatIf: false,
      sources: getCreditedSourcesForConflict(matchedConflict.name, matchedConflict.region)
    };
  }

  // 4. If query specifically asks about a historical figure or historic city in the Search Index
  if (
    topSearchMatch &&
    (topSearchMatch.category === 'figure' || topSearchMatch.category === 'city')
  ) {
    const matchEra = getGeopoliticalEra(topSearchMatch.year);
    const matchCountryData = getCountryEraData(
      topSearchMatch.modernCountry,
      topSearchMatch.year
    );

    const reply = [
      `**${topSearchMatch.title} — ${topSearchMatch.subtitle} (${topSearchMatch.yearDisplay})**`,
      `**1. Historical Significance & Legacy**\n${topSearchMatch.summary}`,
      `**2. Geopolitical & Imperial Setting (${matchCountryData.entityName})**\nDuring **${topSearchMatch.yearDisplay}**, the territory of modern-day **${topSearchMatch.modernCountry}** formed the core of **${matchCountryData.entityName}**, governed from **${matchCountryData.capital}** under **${matchCountryData.ruler}** (Est. Population: ${matchCountryData.populationEstimate}).\n\n${matchCountryData.description}`,
      `**3. Key Historical Milestones & Era Developments (${matchEra.epochName})**\n${matchCountryData.keyEvents
        .map((ev: string) => `- ${ev}`)
        .join('\n')}`
    ].join('\n\n');

    return {
      reply,
      isWhatIf: false,
      sources: getCreditedSourcesForRegion(
        topSearchMatch.title,
        topSearchMatch.modernCountry,
        topSearchMatch.year
      )
    };
  }

  // 5. If query matches a specific country / empire / territory
  if (countryEra && primaryCountryName) {
    const isCausalQuestion = /\b(why|how|cause|reason|decline|fall|fell|collapse|lose|lost|rise|conquer)\b/i.test(
      cleanMsg
    );

    const modernSection =
      effectiveTargetYear >= 1995 && modernProfile && !isCausalQuestion
        ? `**Modern Geopolitical & Economic Profile (${effectiveYearDisplay})**\n- **Government:** ${modernProfile.governmentType} (${modernProfile.leader})\n- **Capital:** ${countryEra.capital} | **Population:** ${modernProfile.population}\n- **Economic Overview:** ${modernProfile.economicOverview}\n- **Recent History:** ${modernProfile.recentHistory}`
        : `**Sovereignty, Leadership & Strategic Position (${effectiveYearDisplay})**\n- **Historical Polity:** ${countryEra.entityName}\n- **Capital / Administrative Center:** ${countryEra.capital}\n- **Ruler / Leadership:** ${countryEra.ruler}\n- **Estimated Population:** ${countryEra.populationEstimate}`;

    const regionalConflicts = CONFLICT_ZONES.filter(
      (c) =>
        (c.name.toLowerCase().includes(primaryCountryName.toLowerCase()) ||
          c.region.toLowerCase().includes(primaryCountryName.toLowerCase()) ||
          c.combatantsOrClaimants.some((b: string) =>
            b.toLowerCase().includes(countryEra.entityName.toLowerCase())
          )) &&
        Math.abs(c.startYear - effectiveTargetYear) <= 250
    );

    const reply = [
      `**Historical Analysis: ${countryEra.entityName} (${primaryCountryName} — ${effectiveYearDisplay})**`,
      `**1. Historical Overview & Geopolitical Trajectory**\n${countryEra.description}`,
      `**2. ${modernSection.split('\n')[0].replace(/\*\*/g, '')}**\n${modernSection
        .split('\n')
        .slice(1)
        .join('\n')}`,
      `**3. Defining Historical Milestones, Turning Points & Causes**\n${countryEra.keyEvents
        .map((ev: string) => `- ${ev}`)
        .join('\n')}`,
      regionalConflicts.length > 0
        ? `**4. Major Wars, Sieges & Territorial Conflicts**\n${regionalConflicts
            .slice(0, 3)
            .map(
              (c) =>
                `- **${c.name}** (${c.startDate}): ${c.summary} (*Root Cause: ${c.historicalRoot}*)`
            )
            .join('\n')}`
        : `**4. Broader Era Context (${era.epochName} — ${era.timeRange})**\n${era.summary} ${era.globalDynamics}`
    ].join('\n\n');

    return {
      reply,
      isWhatIf: false,
      sources: getCreditedSourcesForRegion(
        countryEra.entityName,
        primaryCountryName,
        effectiveTargetYear
      )
    };
  }

  // 6. General World History / Era / Global Geopolitics Synthesis for targetYear
  const samplePowers = [
    'United States of America',
    'United Kingdom',
    'France',
    'China',
    'India',
    'Turkey',
    'Russia',
    'Egypt'
  ]
    .map((c) => getCountryEraData(c, targetYear))
    .filter((d, idx, arr) => arr.findIndex((x) => x.entityName === d.entityName) === idx)
    .slice(0, 5);

  const reply = [
    `**Global Historical Analysis — ${yearDisplay} (${era.epochName})**`,
    `**Overview of the World Order (${era.timeRange})**\n${era.summary}\n\n${era.globalDynamics}`,
    `**Dominant Polities & Regional Powers in ${yearDisplay}**\n${samplePowers
      .map(
        (p) =>
          `- **${p.entityName}** (*Capital: ${p.capital}* | *Leadership: ${p.ruler}*): ${p.description}`
      )
      .join('\n')}`,
    activeConflictsInYear.length > 0
      ? `**Major Active Wars & Disputed Flashpoints (${yearDisplay})**\n${activeConflictsInYear
          .slice(0, 4)
          .map((c) => `- **${c.name}** (${c.region}, ${c.startDate}): ${c.summary}`)
          .join('\n')}`
      : `**Trade & Cultural Exchange Networks**\n${
          activeTradeRoutes.length > 0
            ? activeTradeRoutes
                .slice(0, 3)
                .map((r) => `- **${r.name}** (${r.type}): ${r.description}`)
                .join('\n')
            : 'Long-distance overland and maritime exchange connected regional capitals across Eurasia, Africa, and the Americas.'
        }`
  ].join('\n\n');

  return {
    reply,
    isWhatIf: false,
    sources: getCreditedSourcesForRegion(era.epochName, undefined, targetYear)
  };
}

/**
 * Cleans a natural-language historical question into a focused encyclopedia search query
 */
function buildEncyclopediaSearchQuery(rawQuestion: string): string {
  return rawQuestion
    .trim()
    .replace(/[?!.]+$/g, '')
    .replace(
      /^(can you |could you |please )?(tell me about|explain|describe|who won the|who won|who lost the|who lost|who was the|who were the|who was|who were|what happened in the|what happened at the|what happened during the|what happened in|what was the|what were the|what caused the|what caused|why did the|how did the|when did the|when was the)\s+/i,
      ''
    )
    .trim();
}

/**
 * Live Historical Encyclopedia Retriever (Wikipedia MediaWiki API with CORS origin=*)
 * Works in both Node/Serverless (Netlify Functions) and Browser (Static Hosting) with zero API keys!
 */
export async function fetchEncyclopediaHistoricalAnswer(
  question: string,
  year: number
): Promise<LocalChatResult | null> {
  try {
    const searchQuery = buildEncyclopediaSearchQuery(question) || question.trim();
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      searchQuery
    )}&utf8=&format=json&origin=*&srlimit=3`;

    const searchRes = await fetch(searchUrl, {
      headers: { Accept: 'application/json' }
    });
    if (!searchRes.ok) return null;

    const searchData = await searchRes.json();
    const hits: Array<{ title: string; snippet: string }> = searchData?.query?.search || [];
    if (hits.length === 0) return null;

    const primaryTitle = hits[0].title;
    const secondaryTitle = hits[1]?.title;

    const titlesParam = secondaryTitle
      ? `${primaryTitle}|${secondaryTitle}`
      : primaryTitle;

    const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&redirects=1&titles=${encodeURIComponent(
      titlesParam
    )}&format=json&origin=*`;

    const extractRes = await fetch(extractUrl, {
      headers: { Accept: 'application/json' }
    });
    if (!extractRes.ok) return null;

    const extractData = await extractRes.json();
    const pages = extractData?.query?.pages || {};
    const pageList = Object.values(pages) as Array<{
      title?: string;
      extract?: string;
    }>;

    const primaryPage =
      pageList.find((p) => p.title?.toLowerCase() === primaryTitle.toLowerCase()) ||
      pageList[0];

    const rawExtract = primaryPage?.extract?.trim();
    if (!rawExtract || rawExtract.length < 80) return null;

    const paragraphs = rawExtract
      .split(/\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 30)
      .slice(0, 4);

    if (paragraphs.length === 0) return null;

    const secondaryPage = pageList.find((p) => p !== primaryPage && p.extract && p.extract.length > 80);
    const secondarySummary = secondaryPage?.extract
      ?.split(/\n+/)
      .map((p) => p.trim())
      .find((p) => p.length > 40);

    const formattedBlocks: string[] = [
      `**Historical Archive: ${primaryPage?.title || primaryTitle}**`,
      ...paragraphs
    ];

    if (secondaryPage?.title && secondarySummary) {
      formattedBlocks.push(
        `**Related Historical Context — ${secondaryPage.title}**\n${secondarySummary}`
      );
    }

    const sources: CreditedSource[] = [
      {
        title: `Wikipedia Historical Archive — ${primaryPage?.title || primaryTitle}`,
        organization: 'Wikimedia Foundation',
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(
          (primaryPage?.title || primaryTitle).replace(/\s+/g, '_')
        )}`,
        category: 'History & Encyclopedia'
      },
      ...getCreditedSourcesForRegion(primaryPage?.title || primaryTitle, undefined, year).slice(0, 2)
    ];

    return {
      reply: formattedBlocks.join('\n\n'),
      isWhatIf: false,
      sources
    };
  } catch {
    return null;
  }
}

/**
 * Async High-Accuracy Historian Resolver:
 * 1. Checks curated causal knowledge base first (for deep multi-factor historical explanations)
 * 2. Queries live Wikipedia Historical Encyclopedia API for any open-ended factual/historical question
 * 3. Falls back to ChronoMap's built-in 177-country historical atlas engine
 */
export async function generateAsyncHistorianReply(
  params: LocalChatParams
): Promise<LocalChatResult> {
  const cleanMsg = params.message.trim();
  const isWhatIf =
    /what if|what-if|counterfactual|alternate|would have happened|suppose|had never|if .* had|instead of/i.test(
      cleanMsg
    );

  // 1. Check Curated Causal Knowledge Base first
  if (!isWhatIf) {
    for (const qa of HISTORICAL_QA_KNOWLEDGE_BASE) {
      if (qa.patterns.some((p) => p.test(cleanMsg))) {
        return {
          reply: qa.response,
          isWhatIf: false,
          sources: getCreditedSourcesForRegion(qa.title, qa.countryFocus, qa.eraYear)
        };
      }
    }

    // 2. Live Wikipedia Historical Encyclopedia Retrieval for any specific battle, ruler, event, year, or question
    const wikiResult = await fetchEncyclopediaHistoricalAnswer(cleanMsg, params.year);
    if (wikiResult) {
      return wikiResult;
    }
  }

  // 3. Built-in ChronoMap Atlas & Counterfactual Synthesis
  return generateLocalHistorianReply(params);
}

/**
 * Generates a complete YearSnapshotData locally if /api/history/year-snapshot is unreachable on static hosts
 */
export function generateLocalYearSnapshot(year: number): YearSnapshotData {
  const yearDisplay = year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
  const era = getGeopoliticalEra(year);

  const keyCountries = [
    'Italy',
    'China',
    'India',
    'Turkey',
    'United Kingdom',
    'France',
    'Russia',
    'Egypt',
    'United States of America',
    'Iran'
  ];

  const seenEntities = new Set<string>();
  const dominantEmpires: YearSnapshotData['dominantEmpires'] = [];

  for (const cName of keyCountries) {
    const profile = getCountryEraData(cName, year);
    if (!seenEntities.has(profile.entityName) && dominantEmpires.length < 4) {
      seenEntities.add(profile.entityName);
      dominantEmpires.push({
        name: profile.entityName,
        region: cName,
        capital: profile.capital,
        ruler: profile.ruler,
        description: profile.description
      });
    }
  }

  const activeWars = CONFLICT_ZONES.filter(
    (c) => year >= c.startYear && year <= c.endYear
  ).slice(0, 4);

  return {
    year,
    yearDisplay,
    eraName: `${era.epochName} (${era.timeRange})`,
    summary: `${era.summary} ${era.globalDynamics}`,
    dominantEmpires,
    activeConflicts:
      activeWars.length > 0
        ? activeWars.map((w) => ({
            name: w.name,
            region: w.region,
            severity: w.severity,
            isDisputed: w.type === 'territorial_dispute' || w.type === 'maritime_tension',
            description: w.summary
          }))
        : [
            {
              name: `Regional Frontier Contests of ${yearDisplay}`,
              region: 'Eurasian & Maritime Borderlands',
              severity: 'medium',
              isDisputed: true,
              description:
                'Border fortifications, tributary diplomacy, and seasonal campaigns shaped territorial boundaries.'
            }
          ],
    keyDevelopments: dominantEmpires
      .flatMap((e) => {
        const cData = getCountryEraData(e.region || 'Italy', year);
        return cData.keyEvents;
      })
      .slice(0, 5)
  };
}

export interface DeepSearchResolution {
  notFound?: boolean;
  message?: string;
  title: string;
  subtitle: string;
  category: 'figure' | 'empire' | 'city' | 'country' | 'conflict';
  year: number;
  longitude: number;
  latitude: number;
  modernCountry: string;
  summary: string;
}

function buildNotFoundResolution(query: string): DeepSearchResolution {
  return {
    notFound: true,
    message: `We could not find "${query.trim()}" anywhere. Please search for a real historical person, place, empire, or conflict.`,
    title: query.trim(),
    subtitle: 'Not Found',
    category: 'figure',
    year: 2026,
    longitude: 0,
    latitude: 0,
    modernCountry: '',
    summary: ''
  };
}

/**
 * Resolves a universal search query locally if /api/history/search is unreachable on static hosts
 */
export function resolveLocalDeepSearch(query: string): DeepSearchResolution {
  const cleanQuery = query.trim();
  if (!cleanQuery || isFictionalOrNonHistoricalQuery(cleanQuery)) {
    return buildNotFoundResolution(cleanQuery);
  }

  const matches = searchHistoricalAtlas(cleanQuery, 1);
  if (matches.length > 0) {
    const m = matches[0];
    return {
      notFound: false,
      title: m.title,
      subtitle: m.subtitle,
      category: m.category,
      year: m.year,
      longitude: (m.svgCoords[0] / 1000) * 360 - 180,
      latitude: ((260 - m.svgCoords[1]) / 255) * 90,
      modernCountry: m.modernCountry,
      summary: m.summary
    };
  }

  const mentionedEntities = findMentionedEntitiesInOrder(cleanQuery);
  const primaryEntity = mentionedEntities[0];
  const targetYear = extractTargetYear(
    cleanQuery,
    2026,
    primaryEntity?.inferredYear ?? null
  );
  const yearDisp = targetYear < 0 ? `${Math.abs(targetYear)} BCE` : `${targetYear} CE`;

  if (primaryEntity) {
    const geo = WORLD_COUNTRIES.find(
      (c) => c.name.toLowerCase() === primaryEntity.countryName.toLowerCase()
    );
    const eraData = getCountryEraData(primaryEntity.countryName, targetYear);
    return {
      notFound: false,
      title: primaryEntity.label || eraData.entityName,
      subtitle: `${eraData.entityName} (${primaryEntity.countryName} · ${yearDisp})`,
      category: 'empire',
      year: targetYear,
      longitude: geo ? (geo.centroid[0] / 1000) * 360 - 180 : 25.45,
      latitude: geo ? ((260 - geo.centroid[1]) / 255) * 90 : 44.92,
      modernCountry: primaryEntity.countryName,
      summary: eraData.description
    };
  }

  return buildNotFoundResolution(cleanQuery);
}

const WIKIPEDIA_FICTIONAL_OR_IRRELEVANT_REGEX =
  /\b(fictional|superhero|supervillain|comic book|dc comics|marvel comics|manga|anime|video game|pokemon|pokémon|star wars|harry potter|middle-earth|tolkien|narnia|westeros|game of thrones|spongebob|disney|pixar|dreamworks|animated|cartoon|sitcom|television series|tv series|film series|movie character|fantasy novel|science fiction|mythological|mythology|folklore|legendary creature|urban legend|creepypasta|internet meme|is a dish|is a food|is a beverage|is a smartphone|is a software|is a website|is a mobile app|is a rock band|is a pop group|is a song by|is a studio album|is a species of|is a genus of|is a chemical|is a programming language|is a cryptocurrency|is a board game|is a card game|is a sport)\b/i;

const WIKIPEDIA_HISTORICAL_OR_GEOGRAPHIC_REGEX =
  /\b(born|died|reigned|ruled|king|queen|emperor|empress|pharaoh|sultan|caliph|shah|tsar|czar|voivode|prince|princess|duke|khan|shogun|general|admiral|commander|statesman|politician|president|prime minister|chancellor|monarch|philosopher|historian|explorer|conquistador|dynasty|empire|kingdom|principality|sultanate|caliphate|khanate|republic|civilization|confederacy|battle of|siege of|war of|treaty of|revolution|rebellion|ancient city|capital of|city in|town in|municipality in|province of|region in|country in|sovereign state|island in|peninsula in)\b/i;

/**
 * Live Wikipedia + Geographic Deep Search Resolver (works in browser & server with zero API keys!)
 * Finds any real historical figure, principality, kingdom, battle, or city on Earth and rejects fictional/non-relevant queries.
 */
export async function resolveWikipediaDeepSearch(query: string): Promise<DeepSearchResolution> {
  const cleanQuery = query.trim();
  if (!cleanQuery || isFictionalOrNonHistoricalQuery(cleanQuery)) {
    return buildNotFoundResolution(cleanQuery);
  }

  // 1. Check fuzzy local index first
  const localMatches = searchHistoricalAtlas(cleanQuery, 1);
  if (localMatches.length > 0) {
    const m = localMatches[0];
    return {
      notFound: false,
      title: m.title,
      subtitle: m.subtitle,
      category: m.category,
      year: m.year,
      longitude: (m.svgCoords[0] / 1000) * 360 - 180,
      latitude: ((260 - m.svgCoords[1]) / 255) * 90,
      modernCountry: m.modernCountry,
      summary: m.summary
    };
  }

  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      cleanQuery
    )}&utf8=&format=json&origin=*&srlimit=1`;
    const searchRes = await fetch(searchUrl, { headers: { Accept: 'application/json' } });
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const firstHit = searchData?.query?.search?.[0];
      if (!firstHit?.title) {
        return buildNotFoundResolution(cleanQuery);
      }

      const pageTitle: string = firstHit.title;
      const detailUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=coordinates|extracts&exintro=1&explaintext=1&redirects=1&titles=${encodeURIComponent(
        pageTitle
      )}&format=json&origin=*`;
      const detailRes = await fetch(detailUrl, { headers: { Accept: 'application/json' } });
      if (detailRes.ok) {
        const detailData = await detailRes.json();
        const pages = detailData?.query?.pages || {};
        const pageObj = Object.values(pages)[0] as any;
        const extract: string = (pageObj?.extract || '').trim();
        const coords = pageObj?.coordinates?.[0];

        if (!extract) {
          return buildNotFoundResolution(cleanQuery);
        }

        const firstThreeSentences = extract
          .split(/(?<=[.!?])\s+/)
          .slice(0, 3)
          .join(' ')
          .trim();

        // Reject fictional characters, fictional worlds, entertainment, food, tech, or non-relevant pages
        if (
          isFictionalOrNonHistoricalQuery(pageTitle) ||
          WIKIPEDIA_FICTIONAL_OR_IRRELEVANT_REGEX.test(firstThreeSentences)
        ) {
          return buildNotFoundResolution(cleanQuery);
        }

        const hasRealCoords =
          coords && typeof coords.lon === 'number' && typeof coords.lat === 'number';
        const isHistoricalOrGeographic =
          hasRealCoords || WIKIPEDIA_HISTORICAL_OR_GEOGRAPHIC_REGEX.test(firstThreeSentences);

        if (!isHistoricalOrGeographic) {
          return buildNotFoundResolution(cleanQuery);
        }

        const combinedText = `${pageTitle} ${extract}`;
        const mentioned = findMentionedEntitiesInOrder(combinedText);
        const primaryMention = mentioned[0];

        // Must have either real geographic coordinates or a known historical/modern country association
        if (!hasRealCoords && !primaryMention) {
          return buildNotFoundResolution(cleanQuery);
        }

        const inferredYear = extractTargetYear(
          combinedText,
          primaryMention?.inferredYear ?? 2026,
          primaryMention?.inferredYear ?? null
        );

        let lon = 0;
        let lat = 0;
        let modernCountry = primaryMention?.countryName || '';

        if (hasRealCoords) {
          lon = coords.lon;
          lat = coords.lat;
          if (!modernCountry) {
            const svgX = ((lon + 180) / 360) * 1000;
            const svgY = 260 - (lat / 90) * 255;
            let bestDist = Infinity;
            for (const c of WORLD_COUNTRIES) {
              const dx = c.centroid[0] - svgX;
              const dy = c.centroid[1] - svgY;
              const d = dx * dx + dy * dy;
              if (d < bestDist) {
                bestDist = d;
                modernCountry = c.name;
              }
            }
          }
        } else if (primaryMention) {
          modernCountry = primaryMention.countryName;
          const geo = WORLD_COUNTRIES.find(
            (c) => c.name.toLowerCase() === primaryMention.countryName.toLowerCase()
          );
          if (geo) {
            lon = (geo.centroid[0] / 1000) * 360 - 180;
            lat = ((260 - geo.centroid[1]) / 255) * 90;
          } else {
            return buildNotFoundResolution(cleanQuery);
          }
        }

        const firstTwoSentences =
          extract
            .split(/(?<=[.!?])\s+/)
            .slice(0, 2)
            .join(' ')
            .trim() || `Historical reference for ${pageTitle}.`;

        const isPerson = /\b(born|died|king|queen|emperor|prince|voivode|sultan|general|leader|ruler|statesman|philosopher|explorer)\b/i.test(
          firstTwoSentences
        );
        const isEmpire = /\b(empire|kingdom|principality|dynasty|sultanate|caliphate|republic|realm)\b/i.test(
          firstTwoSentences
        );
        const yearDisp =
          inferredYear < 0 ? `${Math.abs(inferredYear)} BCE` : `${inferredYear} CE`;

        return {
          notFound: false,
          title: pageObj?.title || pageTitle,
          subtitle: `${isPerson ? 'Historical Figure' : isEmpire ? 'Historical Polity' : 'Historical Location'} · ${modernCountry} (${yearDisp})`,
          category: isPerson ? 'figure' : isEmpire ? 'empire' : 'city',
          year: inferredYear,
          longitude: lon,
          latitude: lat,
          modernCountry,
          summary: firstTwoSentences
        };
      }
    }
  } catch {
    // Ignore network errors and use local resolver
  }

  return resolveLocalDeepSearch(cleanQuery);
}


