import { getCountryEraData, CountryEraProfile } from './historicalAtlasEngine';
import { getCountryProfile } from './modernCountriesData';
import { getGeopoliticalEra } from './historicalErasGeo';
import { CONFLICT_ZONES, ConflictZone } from './conflictZones';
import {
  getCountryPhysicalProfile,
  getTradeRoutesForYear,
  CULTURAL_HUBS,
  getCreditedSourcesForRegion,
  getCreditedSourcesForConflict,
  CreditedSource
} from './mapLayersData';
import { MapRegion } from './worldMapData';
import { HISTORICAL_SEARCH_INDEX } from './historicalSearchIndex';

export interface ComprehensivePlaceDossier {
  // Identity
  entityName: string;
  modernCountry: string;
  year: number;
  yearDisplay: string;
  epochName: string;
  color: string;
  rulerInYear: string;
  capitalInYear: string;
  populationInYear: string;
  governmentTypeInYear: string;

  // Part 1: General Information about the Place / Empire / Country
  generalOverview: string;
  civilizationalTimeline: string;
  geographyAndStrategicLocation: string;
  economyTradeAndResources: string;
  militaryAndDefenseTradition: string;
  cultureSocietyAndHeritage: string;
  disputedTerritories: string[];

  // Part 2: Full Detail of What Happened in This Specific Year
  hasCredibleYearRecord: boolean;
  isIndigenousOrAntarctica: boolean;
  yearHeadline: string;
  yearDetailedNarrative: string;
  yearMajorEvents: string[];
  yearPoliticalAndDiplomaticState: string;
  yearEconomicAndSocialDevelopments: string;
  yearActiveConflictsAndSecurity: string[];

  // Reference Sources
  sources: CreditedSource[];
}

export interface ComprehensiveConflictDossier {
  id: string;
  name: string;
  region: string;
  type: ConflictZone['type'];
  severity: ConflictZone['severity'];
  status: string;
  startDate: string;
  combatantsOrClaimants: string[];
  casualtiesOrImpact: string;
  year: number;
  yearDisplay: string;
  epochName: string;

  // Part 1: General Overview of the Conflict / Disputed Zone
  generalOverview: string;
  historicalRootCauses: string;
  strategicTheaterAndGeography: string;
  geopoliticalStakesAndAlliances: string;

  // Part 2: Full Detail of What Happened in This Conflict Zone in This Specific Year
  yearHeadline: string;
  yearDetailedNarrative: string;
  yearMajorEvents: string[];
  yearFrontlineAndDiplomaticStatus: string;

  sources: CreditedSource[];
}

interface SpecificYearRecord {
  headline: string;
  ruler?: string;
  capital?: string;
  governmentType?: string;
  narrative: string;
  events: string[];
  politicalAndDiplomatic?: string;
  economicAndSocial?: string;
}

/**
 * Curated Exact-Year & Range-Specific Historical Records for Major Countries & Empires
 */
const EXACT_COUNTRY_YEAR_RECORDS: Record<string, Record<number, SpecificYearRecord>> = {
  Pakistan: {
    1947: {
      headline: 'Creation of Pakistan, Partition of British India & Independence (1947 CE)',
      ruler: 'Governor-General Muhammad Ali Jinnah & PM Liaquat Ali Khan',
      capital: 'Karachi',
      governmentType: 'Federal Dominion / Parliamentary State',
      narrative:
        'On August 14, 1947, Pakistan emerged as an independent sovereign state following the Partition of British India under the Indian Independence Act 1947. Founded under the leadership of Quaid-e-Azam Muhammad Ali Jinnah and the All-India Muslim League, the new nation comprised West Pakistan (West Punjab, Sindh, NWFP, Balochistan) and East Pakistan (East Bengal). The year 1947 was defined by the largest mass migration in human history (~14–15 million people crossing the Radcliffe Line), urgent state-building from scratch in the new capital of Karachi, the accession of princely states (Kalat, Bahawalpur, Swat, Chitral), and the outbreak of the First Kashmir War in October 1947.',
      events: [
        'August 14, 1947: Transfer of power in Karachi; Muhammad Ali Jinnah is sworn in as Pakistan’s first Governor-General and Liaquat Ali Khan becomes the first Prime Minister.',
        'August 17, 1947: Publication of the Radcliffe Boundary Award demarcating Punjab and Bengal, triggering massive cross-border refugee movements and communal upheaval.',
        'September 30, 1947: Pakistan is formally admitted as a member state of the United Nations.',
        'October 22–27, 1947: Outbreak of the First Indo-Pakistani War over Jammu and Kashmir following tribal lashkar mobilization and Maharaja Hari Singh’s disputed instrument of accession.',
        'November–December 1947: Establishment of Pakistan’s central civil service, armed forces headquarters in Rawalpindi, and emergency refugee resettlement camps across Punjab and Sindh.'
      ]
    },
    1948: {
      headline: 'State Bank Founding, Kashmir Frontlines & Passing of Muhammad Ali Jinnah (1948 CE)',
      ruler: 'Governor-General Muhammad Ali Jinnah (until Sept) / Khawaja Nazimuddin & PM Liaquat Ali Khan',
      capital: 'Karachi',
      governmentType: 'Constitutional Dominion',
      narrative:
        'In 1948, Pakistan consolidated its financial and administrative sovereignty despite severe post-Partition resource shortages. On July 1, 1948, Muhammad Ali Jinnah inaugurated the State Bank of Pakistan to establish monetary independence from the Reserve Bank of India. Fighting continued along the mountainous frontlines of Jammu and Kashmir until a UN-brokered ceasefire was agreed at the end of the year. On September 11, 1948, the nation mourned the passing of founding father Muhammad Ali Jinnah in Karachi.',
      events: [
        'March 1948: Princely states of Makran, Kharan, Las Bela, and Kalat complete accession into Balochistan within Pakistan.',
        'April 1948: Temporary dispute with India over canal water supplies in the Indus basin is resolved via the Inter-Dominion Accord.',
        'July 1, 1948: Founding of the State Bank of Pakistan in Karachi, issuing Pakistan’s own sovereign currency notes.',
        'September 11, 1948: Death of Quaid-e-Azam Muhammad Ali Jinnah in Karachi; Khawaja Nazimuddin succeeds him as Governor-General.',
        'May–December 1948: Regular Pakistan Army units deploy to hold Azad Kashmir and Gilgit-Baltistan ahead of the UN-brokered ceasefire line.'
      ]
    },
    1956: {
      headline: 'Proclamation of the First Constitution & Islamic Republic of Pakistan (1956 CE)',
      ruler: 'President Iskander Mirza & PM Chaudhry Muhammad Ali / Huseyn Shaheed Suhrawardy',
      capital: 'Karachi',
      governmentType: 'Parliamentary Islamic Republic',
      narrative:
        'On March 23, 1956, Pakistan adopted its first indigenous Constitution, formally transitioning from a British Dominion into the world’s first Islamic Republic (the Islamic Republic of Pakistan). Governor-General Iskander Mirza was sworn in as the country’s first President under a unicameral parliamentary system based on parity between West Pakistan (unified under the One Unit scheme) and East Pakistan.',
      events: [
        'March 23, 1956: Enforcement of the 1956 Constitution; Pakistan officially becomes the Islamic Republic of Pakistan (commemorated annually as Republic/Pakistan Day).',
        'September 12, 1956: Awami League leader Huseyn Shaheed Suhrawardy becomes Prime Minister at the head of a coalition cabinet.',
        '1956: Completion of the First Five-Year Plan framework focusing on textile mills, jute processing, and the PIDC (Pakistan Industrial Development Corporation).'
      ]
    },
    1958: {
      headline: 'Gwadar Purchase from Oman & October 1958 Martial Law (1958 CE)',
      ruler: 'President Iskander Mirza (until Oct) / General Ayub Khan',
      capital: 'Karachi',
      governmentType: 'Presidential Military Administration',
      narrative:
        '1958 was a pivotal turning point in Pakistan’s territorial and political history. In September 1958, under Prime Minister Feroz Khan Noon, Pakistan purchased the strategic port enclave of Gwadar on the Arabian Sea from the Sultanate of Muscat and Oman. In October 1958, President Iskander Mirza abrogated the 1956 Constitution and declared martial law; twenty days later, Commander-in-Chief General Ayub Khan assumed the presidency, launching sweeping land, administrative, and industrial reforms.',
      events: [
        'September 8, 1958: Pakistan formally acquires the strategic deep-water port of Gwadar from Oman after over a century of Omani rule.',
        'October 7, 1958: President Iskander Mirza abrogates the 1956 Constitution, dissolves assemblies, and appoints General Ayub Khan as Chief Martial Law Administrator.',
        'October 27, 1958: General Ayub Khan assumes the Presidency of Pakistan, initiating an era of centralized modernization and economic planning.'
      ]
    },
    1960: {
      headline: 'The Historic Indus Waters Treaty, Foundation of Islamabad & Second Five-Year Plan (1960 CE)',
      ruler: 'President Field Marshal Muhammad Ayub Khan',
      capital: 'Rawalpindi (Interim Capital) / Karachi — Islamabad Formally Named & Founded',
      governmentType: 'Presidential Republic (Basic Democracies System)',
      narrative:
        '1960 was one of the most consequential and transformative years in Pakistan’s modern history. Under President Field Marshal Ayub Khan, Pakistan resolved its most dangerous existential resource dispute with India by signing the landmark Indus Waters Treaty in Karachi on September 19, 1960. That same year, the federal cabinet officially named the new purpose-built national capital "Islamabad" at the foot of the Margalla Hills while Rawalpindi served as the interim administrative seat. Economically, 1960 marked the launch of Pakistan’s celebrated Second Five-Year Plan (1960–1965), which propelled rapid industrialization, the Green Revolution in agriculture, and the construction of the Mangla and Tarbela mega-dams.',
      events: [
        'February 14, 1960: Field Marshal Ayub Khan wins a 95.6% vote of confidence from the 80,000 elected "Basic Democrats" and is sworn in as the first elected President on February 17, appointing an 11-member Constitutional Commission.',
        'February 24, 1960: The Presidential Cabinet officially names the new planned federal capital of Pakistan "Islamabad"; Greek architect Constantinos Apostolou Doxiadis finalizes the grid master plan as construction begins in October 1960.',
        'May 1, 1960: Cold War diplomatic crisis erupts when a US U-2 reconnaissance plane flown by Francis Gary Powers—having taken off from the Badaber airbase near Peshawar—is shot down over the Soviet Union, prompting Soviet Premier Khrushchev to threaten Peshawar.',
        'July 1, 1960: Launch of the Second Five-Year Plan (1960–1965), ushering in record industrial manufacturing growth (averaging over 15% annually in large-scale industry), private banking expansion, and high-yield agricultural modernization.',
        'August–September 1960: At the 1960 Rome Summer Olympics, Pakistan’s Men’s Field Hockey Team defeats India 1–0 in the final to win Pakistan’s first-ever Olympic Gold Medal, ending India’s 32-year unbeaten Olympic streak.',
        'September 19, 1960: Signing of the historic Indus Waters Treaty in Karachi by President Ayub Khan, Indian Prime Minister Jawaharlal Nehru, and World Bank Vice President W.A.B. Iliff—allocating the three western rivers (Indus, Jhelum, Chenab) to Pakistan and launching the $1+ billion Indus Basin Replacement Works (Mangla & Tarbela Dams, barrages, and link canals).'
      ],
      politicalAndDiplomatic:
        'Pakistan served as a key Western ally in both CENTO and SEATO while opening early diplomatic contacts with Beijing. Domestically, the Basic Democracies local governance system and the Muslim Family Laws Ordinance preparation reshaped administrative and social law.',
      economicAndSocial:
        'Rapid industrial expansion in Karachi, Faisalabad (Lyallpur), and Dhaka; founding of major financial and engineering institutions; GDP growth accelerated above 6% annually, making Pakistan a development model studied across East Asia.'
    },
    1965: {
      headline: '1965 Presidential Election & The 17-Day Indo-Pakistani War of September 1965',
      ruler: 'President Field Marshal Muhammad Ayub Khan',
      capital: 'Rawalpindi / Islamabad',
      governmentType: 'Presidential Republic (1962 Constitution)',
      narrative:
        '1965 was dominated by the hotly contested January presidential election between President Ayub Khan and Madar-e-Millat Fatima Jinnah (leader of the Combined Opposition Parties), followed by military clashes in the Rann of Kutch in April and the full-scale 17-day Indo-Pakistani War in September 1965 across Kashmir, Lahore, and Sialkot.',
      events: [
        'January 2, 1965: Presidential election between Field Marshal Ayub Khan and Fatima Jinnah; Ayub Khan retains the presidency through the Electoral College of Basic Democrats.',
        'April 1965: Border skirmishes between Pakistani and Indian forces in the Rann of Kutch, resolved by British mediation.',
        'August–September 1965: Operation Gibraltar in Kashmir escalates into the full-scale 1965 Indo-Pakistani War on September 6 when Indian forces cross the international border toward Lahore.',
        'September 8–22, 1965: Major tank battles at Chawinda (Sialkot sector)—one of the largest armored engagements since World War II—and air combat before a UN Security Council ceasefire takes effect on September 23, 1965.'
      ]
    },
    1971: {
      headline: 'East Pakistan Crisis, 1971 War & Secession of Bangladesh (1971 CE)',
      ruler: 'President General Yahya Khan (until Dec 20) / President Zulfikar Ali Bhutto',
      capital: 'Islamabad',
      governmentType: 'Federal Republic',
      narrative:
        'Following the aftermath of the December 1970 general elections—in which Sheikh Mujibur Rahman’s Awami League won a majority in East Pakistan and Zulfikar Ali Bhutto’s PPP won a majority in West Pakistan—constitutional deadlock triggered civil war in East Pakistan in March 1971 and full-scale war with India in December 1971, resulting in the secession of East Pakistan as independent Bangladesh and the transfer of power to Zulfikar Ali Bhutto in Islamabad.',
      events: [
        'March 1971: Breakdown of constitutional talks in Dhaka between Yahya Khan, Sheikh Mujibur Rahman, and Zulfikar Ali Bhutto; launch of Operation Searchlight on March 25.',
        'July 1971: Pakistan facilitates US National Security Advisor Henry Kissinger’s secret flight from Chaklala Airbase (Rawalpindi) to Beijing, opening US-China diplomatic relations.',
        'December 3–16, 1971: Full-scale war between India and Pakistan on both eastern and western fronts; fall of Dhaka on December 16 leads to the creation of Bangladesh.',
        'December 20, 1971: General Yahya Khan steps down; Zulfikar Ali Bhutto assumes office as President and civilian Chief Martial Law Administrator to rebuild a truncated Pakistan.'
      ]
    },
    1973: {
      headline: 'Unanimous Adoption of the 1973 Constitution of Pakistan (1973 CE)',
      ruler: 'Prime Minister Zulfikar Ali Bhutto & President Fazal Ilahi Chaudhry',
      capital: 'Islamabad',
      governmentType: 'Federal Parliamentary Constitutional Republic',
      narrative:
        'In 1973, Pakistan achieved a historic constitutional consensus with the unanimous passage of the 1973 Constitution on April 10, establishing a bicameral federal parliamentary system (National Assembly and Senate) that remains Pakistan’s supreme law today. Following the 1972 Simla Agreement, over 90,000 Pakistani prisoners of war were repatriated.',
      events: [
        'April 10, 1973: The National Assembly passes the 1973 Constitution of Pakistan with consensus across government and opposition parties.',
        'August 14, 1973: The 1973 Constitution formally takes effect; Zulfikar Ali Bhutto is sworn in as Prime Minister and Fazal Ilahi Chaudhry as President.',
        'August 28, 1973: Signing of the Delhi Agreement providing for the repatriation of Pakistani POWs held since the 1971 war.'
      ]
    },
    1998: {
      headline: 'Chagai-I & Chagai-II Nuclear Tests — Pakistan Becomes the 7th Nuclear Power (1998 CE)',
      ruler: 'Prime Minister Nawaz Sharif & President Muhammad Rafiq Tarar',
      capital: 'Islamabad',
      governmentType: 'Federal Parliamentary Republic',
      narrative:
        'On May 28 and May 30, 1998, in direct response to India’s Pokhran-II nuclear tests earlier that month, Pakistan conducted six underground nuclear tests (codenamed Chagai-I and Chagai-II) in the Ras Koh Hills and Kharan Desert of Balochistan. Led by scientists from the Pakistan Atomic Energy Commission (PAEC) and Kahuta Research Laboratories (KRL), Pakistan became the world’s seventh declared nuclear-armed state and the first in the Muslim world.',
      events: [
        'April 6, 1998: Successful test launch of the Ghauri (Hatf-V) medium-range ballistic missile.',
        'May 28, 1998 (Youm-e-Takbir): Pakistan successfully detonates five underground nuclear devices at Ras Koh Hills in Chagai District, Balochistan.',
        'May 30, 1998: A sixth nuclear test (Chagai-II) is conducted in the Kharan Desert, establishing overt strategic nuclear deterrence in South Asia.'
      ]
    },
    2022: {
      headline: 'Constitutional Vote of No Confidence, Historic Monsoon Floods & Political Transition (2022 CE)',
      ruler: 'PM Imran Khan (until April) / PM Shehbaz Sharif & President Arif Alvi',
      capital: 'Islamabad',
      governmentType: 'Federal Parliamentary Constitutional Republic',
      narrative:
        'In April 2022, Prime Minister Imran Khan became the first Prime Minister in Pakistan’s history to be removed via a constitutional parliamentary vote of no confidence, succeeded by PDM coalition leader Shehbaz Sharif. During the summer of 2022, catastrophic climate-induced monsoon floods submerged nearly one-third of the country across Sindh and Balochistan, causing over $30 billion in economic damages.',
      events: [
        'April 10–11, 2022: The National Assembly passes a vote of no confidence against PM Imran Khan; Shehbaz Sharif is elected Prime Minister.',
        'June–September 2022: Unprecedented monsoon floods and glacial lake outbursts affect 33 million citizens and cause $30B+ in infrastructure and agricultural damage.',
        'November 29, 2022: General Asim Munir assumes command as Chief of Army Staff (COAS) in Rawalpindi.'
      ]
    },
    2024: {
      headline: 'February 2024 General Elections, Coalition Government & Constitutional Amendment (2024 CE)',
      ruler: 'President Asif Ali Zardari & Prime Minister Shehbaz Sharif',
      capital: 'Islamabad',
      governmentType: 'Federal Parliamentary Constitutional Republic',
      narrative:
        'On February 8, 2024, Pakistan held nationwide general elections for the 16th National Assembly and four provincial assemblies. Following post-election coalition negotiations between the PML-N, PPP, and allied parties, Shehbaz Sharif returned as Prime Minister in March 2024 and Asif Ali Zardari was elected President for a second time. In October 2024, Pakistan hosted the Shanghai Cooperation Organisation (SCO) Council of Heads of Government summit in Islamabad and passed the 26th Constitutional Amendment reforming judicial appointments.',
      events: [
        'February 8, 2024: Nationwide general elections held across Pakistan with over 60 million votes cast; independent PTI-backed candidates, PML-N, and PPP emerge as the three largest parliamentary blocs.',
        'March 4–10, 2024: Shehbaz Sharif is sworn in for a second term as Prime Minister and Asif Ali Zardari is elected the 14th President of Pakistan.',
        'September 2024: The IMF Executive Board approves a 37-month, $7 billion Extended Fund Facility (EFF) program to anchor Pakistan’s macroeconomic stability and foreign exchange reserves.',
        'October 15–16, 2024: Islamabad hosts the 23rd SCO Council of Heads of Government Summit attended by Chinese Premier Li Qiang, Russian PM Mikhail Mishustin, and regional leaders.',
        'October 21, 2024: Parliament passes the 26th Constitutional Amendment establishing Constitutional Benches in the Supreme Court; Justice Yahya Afridi becomes Chief Justice of Pakistan.'
      ]
    },
    2025: {
      headline: 'Macroeconomic Stabilization, Sharp Inflation Decline, CPEC Phase-II & Border Counter-Terrorism (2025 CE)',
      ruler: 'President Asif Ali Zardari, Prime Minister Shehbaz Sharif & COAS Gen. Asim Munir',
      capital: 'Islamabad',
      governmentType: 'Federal Parliamentary Constitutional Republic',
      narrative:
        'In 2025, Pakistan experienced a marked macroeconomic turnaround alongside intense internal security and regional diplomatic developments. Headline inflation—which had peaked near 38% in 2023—dropped dramatically into low single digits in early 2025, allowing the State Bank of Pakistan to cut its policy interest rate significantly while foreign exchange reserves stabilized under the $7 billion IMF Extended Fund Facility and the new "Uraan Pakistan" (2024–2029) five-year economic transformation plan. In infrastructure and aviation, New Gwadar International Airport began commercial operations in January 2025 under CPEC Phase-II, and Pakistan International Airlines (PIA) resumed direct flights to European Union capitals after a four-year ban was lifted. On the security front, Pakistan’s armed forces conducted intensified intelligence-based counter-terrorism operations in Khyber Pakhtunkhwa and Balochistan—including the March 2025 Jaffar Express hostage rescue operation in the Bolan Pass—amid heightened border friction with the Afghan Taliban administration over TTP sanctuaries. In February–March 2025, Pakistan also hosted the ICC Champions Trophy—its first major ICC global cricket tournament on home soil in 29 years.',
      events: [
        'January 2025: Launch of the "Uraan Pakistan" (5Es National Economic Transformation Plan 2024–2029) targeting exports, digital IT growth, energy reform, and climate resilience; PIA resumes direct flights from Islamabad to Paris following the lifting of the EASA ban.',
        'January 20, 2025: The China-aided New Gwadar International Airport (Pakistan’s largest airport by area) officially commences commercial flight operations in Balochistan as a flagship CPEC Phase-II milestone.',
        'February–March 2025: Pakistan hosts the 2025 ICC Champions Trophy across upgraded stadiums in Karachi, Lahore, and Rawalpindi—the first ICC global tournament hosted in Pakistan since the 1996 Cricket World Cup.',
        'Early–Mid 2025: Headline CPI inflation falls sharply to multi-year lows (~1.5%–3%), enabling the State Bank of Pakistan to lower benchmark interest rates from 22% down to 12%, while Pakistan secures a $1.3B IMF Resilience and Sustainability Facility (RSF) for climate adaptation alongside its $7B EFF review.',
        'March 11–12, 2025: Pakistan Army Special Services Group (SSG) and security forces execute a high-risk counter-terrorism operation in the Bolan Pass (Balochistan) after BLA militants hijack the Peshawar-bound Jaffar Express passenger train, rescuing over 300 hostages.',
        '2025 Strategic & Foreign Policy: Expansion of the Special Investment Facilitation Council (SIFC) attracting Gulf and Chinese mining/energy investments (including the Reko Diq copper-gold project in Balochistan), alongside heightened diplomatic and military pressure on Kabul over cross-border TTP militancy along the Durand Line.'
      ],
      politicalAndDiplomatic:
        'Federal governing coalition led by PM Shehbaz Sharif (PML-N) and President Asif Ali Zardari (PPP) maintained parliamentary stability while navigating judicial reforms under the 26th Constitutional Amendment, ongoing political contestation with opposition PTI, and deeper strategic economic ties with China, Saudi Arabia, the UAE, and Turkey.',
      economicAndSocial:
        'IT and software exports reached record highs ($3.5B+ annualized), remittances from overseas Pakistanis surged past $35B, sovereign credit ratings were upgraded as default risk receded, and large-scale solar energy adoption transformed residential and industrial electricity generation across Punjab and Sindh.'
    },
    2026: {
      headline: 'Continued Economic Recovery, Reko Diq Strategic Mining & Regional Geopolitics (2026 CE)',
      ruler: 'President Asif Ali Zardari & Prime Minister Shehbaz Sharif',
      capital: 'Islamabad',
      governmentType: 'Federal Parliamentary Constitutional Republic',
      narrative:
        'In 2026, Pakistan continues implementing structural fiscal, tax, and energy-sector reforms under the "Uraan Pakistan" framework and IMF partnership, while advancing CPEC Phase-II industrial special economic zones, digital banking infrastructure, and strategic mineral extraction at Reko Diq.',
      events: [
        '2026: Expansion of Special Economic Zones (SEZs) under CPEC Phase-II and accelerated rail/port infrastructure linking Gwadar and Karachi with northern industrial hubs.',
        '2026: Continued growth in Pakistan’s technology outsourcing sector, freelance digital economy, and utility-scale solar and hydel power generation (including progress on Diamer-Bhasha and Dasu hydropower projects).',
        '2026: Ongoing frontier security operations in Khyber Pakhtunkhwa and Balochistan paired with diplomatic engagement across the Middle East, Central Asia, and China.'
      ]
    }
  },
  'United States of America': {
    1776: {
      headline: 'Declaration of Independence & American Revolutionary War (1776 CE)',
      ruler: 'Second Continental Congress & Gen. George Washington',
      capital: 'Philadelphia',
      governmentType: 'Revolutionary Confederation of Thirteen States',
      narrative:
        'On July 4, 1776, the Second Continental Congress meeting in Philadelphia unanimously adopted the Declaration of Independence, severing the Thirteen Colonies from Great Britain. General George Washington commanded the Continental Army through the New York campaign and crossed the icy Delaware River on Christmas night to defeat Hessian forces at Trenton.',
      events: [
        'January 1776: Thomas Paine publishes "Common Sense", galvanizing popular support for complete independence from Britain.',
        'March 17, 1776: British forces evacuate Boston following Henry Knox’s placement of Ticonderoga artillery on Dorchester Heights.',
        'July 4, 1776: Adoption of the United States Declaration of Independence, drafted primarily by Thomas Jefferson.',
        'August–November 1776: British General William Howe captures New York City after the Battle of Long Island.',
        'December 25–26, 1776: George Washington crosses the Delaware River and wins a crucial victory at the Battle of Trenton, saving the Continental cause.'
      ]
    },
    1863: {
      headline: 'Emancipation Proclamation, Battles of Gettysburg & Vicksburg (1863 CE)',
      ruler: 'President Abraham Lincoln',
      capital: 'Washington, D.C. (Richmond for Confederacy)',
      governmentType: 'Federal Constitutional Republic (in Civil War)',
      narrative:
        '1863 was the decisive turning point of the American Civil War. On January 1, 1863, President Abraham Lincoln issued the Emancipation Proclamation transforming the war into a struggle to abolish slavery. In July 1863, Union victories at Gettysburg in Pennsylvania and Vicksburg on the Mississippi River broke the strategic momentum of the Confederacy.',
      events: [
        'January 1, 1863: President Abraham Lincoln issues the Emancipation Proclamation freeing enslaved persons in rebellious Confederate states.',
        'July 1–3, 1863: Battle of Gettysburg — Union Army of the Potomac under Gen. George Meade defeats Gen. Robert E. Lee’s invasion of the North.',
        'July 4, 1863: Surrender of Vicksburg to Gen. Ulysses S. Grant, giving the Union total control of the Mississippi River and splitting the Confederacy in two.',
        'November 19, 1863: Lincoln delivers the Gettysburg Address dedicating the Soldiers’ National Cemetery.'
      ]
    },
    1960: {
      headline: '1960 Kennedy-Nixon Election, Civil Rights Sit-Ins & Cold War Escalation (1960 CE)',
      ruler: 'President Dwight D. Eisenhower (John F. Kennedy elected Nov 1960)',
      capital: 'Washington, D.C.',
      governmentType: 'Federal Constitutional Republic',
      narrative:
        'In 1960, the United States stood at the height of post-WWII industrial prosperity and Cold War competition with the Soviet Union. The Greensboro sit-ins sparked a nationwide youth-led Civil Rights surge, the U-2 spy plane incident derailed the Paris Summit with Nikita Khrushchev, and Senator John F. Kennedy narrowly defeated Vice President Richard Nixon in November 1960 following the first-ever televised presidential debates.',
      events: [
        'February 1, 1960: Four African American students initiate the Greensboro lunch counter sit-in in North Carolina, igniting the SNCC student civil rights movement across the South.',
        'May 1, 1960: An American U-2 reconnaissance aircraft piloted by Francis Gary Powers is shot down over the USSR, collapsing the Paris Summit.',
        'May 6, 1960: President Eisenhower signs the Civil Rights Act of 1960 establishing federal inspection of local voter registration polls.',
        'September 26, 1960: Over 70 million Americans watch the first televised presidential debate between John F. Kennedy and Richard Nixon.',
        'November 8, 1960: John F. Kennedy is elected the 35th President of the United States in one of the closest elections in American history.'
      ]
    },
    2025: {
      headline: 'Second Trump Administration Inauguration, AI Infrastructure Boom & Tariff Realignment (2025 CE)',
      ruler: 'President Donald J. Trump (Inaugurated Jan 20, 2025)',
      capital: 'Washington, D.C.',
      governmentType: 'Federal Constitutional Republic',
      narrative:
        'In 2025, following the November 2024 presidential election, Donald Trump was inaugurated as the 47th President of the United States on January 20, 2025. The year saw sweeping executive actions on trade tariffs, border enforcement, energy deregulation, and federal restructuring, alongside massive private-sector capital expenditure ($500B+ Stargate and hyperscaler initiatives) in artificial intelligence data centers and domestic semiconductor fabrication.',
      events: [
        'January 20, 2025: Donald J. Trump is inaugurated in Washington, D.C. as the 47th President of the United States.',
        'Early 2025: Announcement of major AI supercomputing infrastructure investments and expansion of domestic semiconductor fabrication plants in Arizona, Ohio, and Texas.',
        '2025: Implementation of comprehensive tariff realignments with major global trading partners and intensified diplomatic negotiations regarding the Russia-Ukraine and Middle East conflicts.'
      ]
    }
  },
  India: {
    1947: {
      headline: 'Indian Independence, Partition & Integration of Princely States (1947 CE)',
      ruler: 'PM Jawaharlal Nehru & Governor-General Lord Mountbatten',
      capital: 'New Delhi',
      governmentType: 'Independent Constitutional Dominion',
      narrative:
        'At the stroke of midnight on August 15, 1947, India achieved independence from nearly two centuries of British rule, with Jawaharlal Nehru delivering his iconic "Tryst with Destiny" address to the Constituent Assembly in New Delhi. Deputy Prime Minister Sardar Vallabhbhai Patel and V.P. Menon spearheaded the political integration of over 560 princely states into the Indian Union.',
      events: [
        'August 15, 1947: Independence of India; Jawaharlal Nehru is sworn in as India’s first Prime Minister at the Red Fort and Parliament House in New Delhi.',
        '1947: Sardar Vallabhbhai Patel integrates hundreds of princely states into the Union of India.',
        'October 1947: Outbreak of the First Kashmir War following the disputed accession of Maharaja Hari Singh.'
      ]
    },
    1960: {
      headline: 'Indus Waters Treaty, Linguistic Reorganization of Bombay State & Third Five-Year Plan Prep (1960 CE)',
      ruler: 'Prime Minister Jawaharlal Nehru & President Rajendra Prasad',
      capital: 'New Delhi',
      governmentType: 'Federal Parliamentary Republic',
      narrative:
        'In 1960, under Prime Minister Jawaharlal Nehru, India reshaped its western federal map by bifurcating the bilingual Bombay State into the states of Maharashtra and Gujarat on May 1, 1960. In September 1960, Nehru traveled to Karachi to sign the Indus Waters Treaty with Pakistani President Ayub Khan, while tensions began rising with China along the Himalayan Line of Actual Control in Aksai Chin and NEFA.',
      events: [
        'April 1960: Chinese Premier Zhou Enlai visits New Delhi for border talks with PM Jawaharlal Nehru over Aksai Chin and the McMahon Line, which end in deadlock.',
        'May 1, 1960: The Bombay Reorganization Act takes effect, creating the modern states of Maharashtra (capital Mumbai) and Gujarat (temporary capital Ahmedabad).',
        'September 19, 1960: PM Jawaharlal Nehru and President Ayub Khan sign the Indus Waters Treaty in Karachi, allocating the eastern rivers (Ravi, Beas, Sutlej) to India.'
      ]
    },
    2025: {
      headline: 'World’s Fastest-Growing Major Economy, Maha Kumbh Mela & Space/Semiconductor Expansion (2025 CE)',
      ruler: 'Prime Minister Narendra Modi & President Droupadi Murmu',
      capital: 'New Delhi',
      governmentType: 'Federal Parliamentary Constitutional Republic',
      narrative:
        'In 2025, India consolidated its position as the world’s fifth-largest (and fastest-growing major) economy on track toward fourth place, following the 2024 general election that inaugurated Prime Minister Narendra Modi’s third consecutive term. In January–February 2025, Prayagraj hosted the historic 2025 Maha Kumbh Mela—the largest peaceful human gathering in history with over 600 million pilgrims—while ISRO advanced its Gaganyaan human spaceflight program and domestic semiconductor plants progressed in Gujarat and Assam.',
      events: [
        'January–February 2025: Over 600 million devotees attend the 2025 Prayagraj Maha Kumbh Mela at the Triveni Sangam in Uttar Pradesh.',
        'January 2025: ISRO successfully executes the SpaDeX (Space Docking Experiment), making India the fourth country in history to achieve autonomous orbital spacecraft docking.',
        'February 2025: Union Budget 2025–26 introduces sweeping middle-class income tax relief (raising the tax-free threshold to ₹12 lakh) and expands domestic electronics, EV, and defence manufacturing.'
      ]
    }
  },
  Romania: {
    1330: {
      headline: 'Battle of Posada & Foundation of the Independent Principality of Wallachia (1330 CE)',
      ruler: 'Voivode Basarab I the Founder (House of Basarab)',
      capital: 'Câmpulung & Curtea de Argeș (Wallachia)',
      governmentType: 'Sovereign Voivodeship (Principality of Wallachia / Țara Românească)',
      narrative:
        'In November 1330, Voivode Basarab I of Wallachia decisively ambushed and defeated the invading royal army of King Charles I Robert of Hungary at the four-day Battle of Posada in the southern Carpathian gorges. This victory secured the full sovereign independence of the Principality of Wallachia (Țara Românească), establishing the House of Basarab from which Mircea the Elder and Vlad III the Impaler descended.',
      events: [
        'November 9–12, 1330: Battle of Posada — Wallachian forces under Voivode Basarab I trap the Hungarian royal army in a narrow Carpathian mountain defile, winning Wallachian independence.',
        'Consolidation of the Wallachian princely court at Câmpulung and Curtea de Argeș between the Southern Carpathians and the Danube River.',
        'Control of strategic commercial customs routes linking Transylvania and Central Europe to the lower Danube and Black Sea ports.'
      ]
    },
    1456: {
      headline: 'Vlad III the Impaler (Vlad Țepeș) Ascends the Throne of Wallachia at Târgoviște (1456 CE)',
      ruler: 'Voivode Vlad III the Impaler (Vlad Țepeș / Dracula)',
      capital: 'Târgoviște (Principality of Wallachia)',
      governmentType: 'Sovereign Voivodeship (Principality of Wallachia)',
      narrative:
        'In August 1456, following the Siege of Belgrade, Vlad III Dracula (Vlad Țepeș, son of Vlad II Dracul of the Order of the Dragon) marched into Wallachia, defeated rival claimant Vladislav II in hand-to-hand combat, and ascended the princely throne at Târgoviște. Immediately upon taking power, Vlad III purged corrupt boyar factions, centralized royal authority, strengthened the Danube and Carpathian fortresses (including Poenari Castle), and enforced strict law and order across Wallachia.',
      events: [
        'August 20, 1456: Vlad III defeats Voivode Vladislav II near Târgoviște and is crowned Voivode of Wallachia.',
        ' September 1456: Vlad III signs a treaty of mutual defense and commercial privilege with the Saxon burghers of Brașov in Transylvania.',
        '1456–1457: Rebuilding of the Princely Court (Curtea Domnească) and Chindia Watchtower at Târgoviște and fortification of Poenari Citadel on the Argeș River.'
      ]
    },
    1462: {
      headline: 'Vlad the Impaler’s Danube Campaign & The Famous Night Attack at Târgoviște (1462 CE)',
      ruler: 'Voivode Vlad III the Impaler (Vlad Țepeș / Dracula)',
      capital: 'Târgoviște (Principality of Wallachia / Țara Românească)',
      governmentType: 'Sovereign Voivodeship (Principality of Wallachia)',
      narrative:
        '1462 was the defining military climax of Voivode Vlad III the Impaler’s reign in the Principality of Wallachia. After refusing to pay the jizya tribute or supply boyar sons to the Ottoman Janissary corps, Vlad crossed the frozen Danube in the winter of 1461–1462 and destroyed Ottoman garrisons from Zimnicea to Rahova, reporting over 23,884 Ottoman troops killed in his celebrated February 11, 1462 letter to King Matthias Corvinus of Hungary. In response, Ottoman Sultan Mehmed II (the Conqueror of Constantinople) invaded Wallachia in June 1462 with an army of over 90,000–150,000 men. Using scorched-earth tactics and guerrilla cavalry strikes, Vlad launched the daring Night Attack at Târgoviște on June 17, 1462, storming the Ottoman imperial camp by torchlight in an attempt to slay Mehmed II himself, before confronting the Sultan with the psychological terror of the "Forest of the Impaled" outside Târgoviște.',
      events: [
        'Winter–February 1462: Vlad III crosses the frozen Danube into Ottoman-held Bulgaria, capturing Giurgiu fortress and clearing Ottoman outposts along the Danube; on February 11, 1462, he dispatches his famous Latin campaign report from Giurgiu to King Matthias Corvinus.',
        'May–June 1462: Sultan Mehmed II launches a massive land and river invasion of Wallachia; Vlad III conducts a scorched-earth retreat, poisoning wells and ambushing Ottoman vanguard columns.',
        'June 17, 1462 (The Night Attack at Târgoviște): Disguised in Ottoman dress, Vlad III leads 7,000–10,000 Wallachian horsemen into Mehmed II’s camp near Târgoviște at midnight, routing the Asian cavalry wing and nearly reaching the Sultan’s imperial tent.',
        'Late June 1462: Advancing on Târgoviște, Sultan Mehmed II’s army encounters a three-kilometer-wide "Forest of the Impaled" (~20,000 impaled Ottoman captives); demoralized and short of supplies, Mehmed II withdraws across the Danube while leaving Vlad’s younger brother Radu the Handsome to contest the boyars.',
        'June 29, 1462: Voivode Stephen the Great of neighboring Moldavia attacks the fortress of Chilia on the Danube delta; late in 1462 Vlad III retreats into Transylvania where Matthias Corvinus detains him at Visegrád.'
      ],
      politicalAndDiplomatic:
        'Wallachia stood at the frontline of the anti-Ottoman Christian crusade proposed by Pope Pius II at the Congress of Mantua, allied nominally with Hungary while fiercely defending Wallachian princely sovereignty against both Ottoman annexation and Hungarian suzerainty.',
      economicAndSocial:
        'Vlad III enforced strict customs regulations ("cumplita dreptate") protecting native Wallachian merchants against Transylvanian Saxon trade monopolies, minted silver ducats/ban coins, and endowed Orthodox monasteries including Snagov and Comana.'
    },
    1475: {
      headline: 'Battle of Vaslui — Stephen the Great’s Crushing Victory for Moldavia (1475 CE)',
      ruler: 'Voivode Stephen the Great (Ștefan cel Mare)',
      capital: 'Suceava (Principality of Moldavia) & Târgoviște (Wallachia)',
      governmentType: 'Sovereign Voivodeships of Moldavia & Wallachia',
      narrative:
        'On January 10, 1475, Voivode Stephen the Great of Moldavia (cousin and ally of Vlad III the Impaler) won one of medieval Europe’s greatest tactical victories at the Battle of Vaslui (Podul Înalt), routing a 120,000-strong Ottoman army under Hadân Suleiman Pasha in dense winter fog and marshland. Pope Sixtus IV hailed Stephen the Great as "Athleta Christi" (Champion of Christ).',
      events: [
        'January 10, 1475: Battle of Vaslui — Stephen the Great lures the Ottoman army of Rumelia into the misty Bârlad River valley using buglers in the woods and destroys the invading force.',
        'January 25, 1475: Stephen the Great sends his famous circular letter from Suceava to the Christian monarchs of Europe warning that Moldavia is the "Gateway of Christendom."',
        '1476: Stephen the Great and Vlad III the Impaler join forces to restore Vlad III to the throne of Wallachia for his third and final reign in November–December 1476.'
      ]
    },
    1600: {
      headline: 'Michael the Brave Achieves the First Union of Wallachia, Transylvania & Moldavia (1600 CE)',
      ruler: 'Voivode Michael the Brave (Mihai Viteazul)',
      capital: 'Alba Iulia, Târgoviște & Iași',
      governmentType: 'United Voivodeship of Wallachia, Transylvania & Moldavia',
      narrative:
        'In May 1600, Voivode Michael the Brave of Wallachia—already victorious over the Ottomans at the Battle of Călugăreni (1595) and ruler of Transylvania after the Battle of Șelimbăr (1599)—marched into Suceava and Iași, uniting the three historic Romanian principalities of Wallachia, Transylvania, and Moldavia under a single crown for the first time in history.',
      events: [
        'May 1600: Michael the Brave enters Iași and Suceava, proclaiming himself "By the grace of God, Ruler of Wallachia, of Transylvania, and of all Moldavia."',
        'Establishment of Orthodox Metropolitan privileges and Romanian administrative representation at Alba Iulia.'
      ]
    },
    1859: {
      headline: 'Union of the Principalities of Moldavia and Wallachia — Birth of Modern Romania (1859 CE)',
      ruler: 'Domnitor Alexandru Ioan Cuza',
      capital: 'Bucharest & Iași',
      governmentType: 'Constitutional United Principalities',
      narrative:
        'In January 1859, circumventing Great Power restrictions after the Treaty of Paris (1856), the electoral assemblies of both Moldavia (January 5) and Wallachia (January 24) elected the same ruler—Alexandru Ioan Cuza—achieving the de facto political unification of Wallachia and Moldavia into the modern Romanian nation-state.',
      events: [
        'January 5, 1859: Alexandru Ioan Cuza is unanimously elected Prince of Moldavia in Iași.',
        'January 24, 1859: The elective assembly in Bucharest also elects Alexandru Ioan Cuza as Prince of Wallachia, sealing the Union of the Principalities (Unirea Principatelor).'
      ]
    },
    1918: {
      headline: 'The Great Union (Marea Unire) at Alba Iulia — Creation of Greater Romania (1918 CE)',
      ruler: 'King Ferdinand I the Unifier & Queen Marie of Romania',
      capital: 'Bucharest',
      governmentType: 'Constitutional Monarchy (Kingdom of Romania)',
      narrative:
        'At the conclusion of World War I in 1918, representative assemblies in Bessarabia (March 27), Bukovina (November 28), and Transylvania (December 1, 1918 at the Great National Assembly of Alba Iulia attended by 100,000 delegates) voted to unite with the Kingdom of Romania under King Ferdinand I, fulfilling the centuries-old ideal of Romanian national unity.',
      events: [
        'March 27, 1918: Sfatul Țării in Chișinău votes for the union of Bessarabia with Romania.',
        'November 28, 1918: The General Congress of Bukovina in Cernăuți votes for unconditional union with Romania.',
        'December 1, 1918: The Great National Assembly at Alba Iulia proclaims the union of Transylvania, Banat, Crișana, and Maramureș with the Kingdom of Romania (celebrated today as Romania’s National Day).'
      ]
    }
  },
  Singapore: {
    1299: {
      headline: 'Sang Nila Utama Founds the Kingdom of Singapura on Temasek (1299 CE)',
      ruler: 'Sri Tri Buana (Sang Nila Utama)',
      capital: 'Singapura (Fort Canning Hill / Bukit Larangan)',
      governmentType: 'Malay-Srivijayan Maritime Kingdom',
      narrative:
        'According to the Malay Annals (Sejarah Melayu), the Srivijayan prince Sang Nila Utama landed on the island of Temasek in 1299 CE and founded the Kingdom of Singapura ("Lion City"). For the next century, Singapura flourished as a fortified entrepôt between the Indian Ocean and the South China Sea until the rise of the Malacca Sultanate in 1400.',
      events: [
        '1299 CE: Sang Nila Utama establishes his royal court on Bukit Larangan (modern Fort Canning Hill), renaming Temasek as Singapura.',
        'Development of a thriving 14th-century maritime port trading Chinese porcelain, Indian textiles, and Southeast Asian spices.'
      ]
    },
    1819: {
      headline: 'Treaty of Singapore — Sir Stamford Raffles Establishes the British Free Port (1819 CE)',
      ruler: 'Sultan Hussein Shah of Johor & Sir Stamford Raffles (British EIC)',
      capital: 'Singapore',
      governmentType: 'British East India Company Trading Residency',
      narrative:
        'On February 6, 1819, Sir Thomas Stamford Raffles signed a landmark treaty with Sultan Hussein Shah of Johor and Temenggong Abdul Rahman, establishing a British East India Company trading post in Singapore. Declared a duty-free port, Singapore rapidly attracted Malay, Chinese, Indian, Peranakan, Bugis, and Arab merchants, becoming the premier hub of the Straits Settlements (1826).',
      events: [
        'January 29, 1819: Sir Stamford Raffles and William Farquhar land along the banks of the Singapore River.',
        'February 6, 1819: Signing of the formal Treaty of Singapore with Sultan Hussein Shah and Temenggong Abdul Rahman.'
      ]
    },
    1942: {
      headline: 'Fall of Singapore & Japanese Occupation as "Syonan-to" (1942 CE)',
      ruler: 'Japanese 25th Army Military Administration (Gen. Tomoyuki Yamashita)',
      capital: 'Syonan-to (Singapore)',
      governmentType: 'Imperial Japanese Military Occupation',
      narrative:
        'Following a rapid Japanese campaign down the Malay Peninsula, British Lieutenant-General Arthur Percival surrendered the "Gibraltar of the East" on February 15, 1942. Renamed Syonan-to ("Light of the South"), Singapore endured three and a half years of harsh Japanese military occupation until September 1945.',
      events: [
        'February 8–15, 1942: Battle of Singapore culminates in the British surrender at the Ford Motor Factory in Bukit Timah.',
        'February–March 1942: Operation Sook Ching targets the local Chinese population in Singapore.'
      ]
    },
    1963: {
      headline: 'Singapore Joins the Federation of Malaysia (September 16, 1963)',
      ruler: 'Yang di-Pertuan Negara Yusof Ishak & PM Lee Kuan Yew (State of Singapore in Malaysia)',
      capital: 'Kuala Lumpur (Federal) / Singapore (State)',
      governmentType: 'Autonomous Constituent State within the Federation of Malaysia',
      narrative:
        'On September 16, 1963, following the 1962 integration referendum, Singapore merged with the Federation of Malaya, Sarawak, and North Borneo (Sabah) to form the Federation of Malaysia, officially ending 144 years of British colonial rule.',
      events: [
        'August 31, 1963: Prime Minister Lee Kuan Yew declares de facto self-governance ahead of the Malaysia merger.',
        'September 16, 1963: Proclamation of Malaysia uniting Malaya, Singapore, Sarawak, and Sabah.'
      ]
    },
    1965: {
      headline: 'Separation from Malaysia — Birth of the Independent Republic of Singapore (August 9, 1965)',
      ruler: 'President Yusof Ishak & Prime Minister Lee Kuan Yew',
      capital: 'Singapore',
      governmentType: 'Unitary Parliamentary Constitutional Republic',
      narrative:
        'Following deep political, economic, and constitutional tensions between the federal government in Kuala Lumpur and the state government in Singapore, the Malaysian Parliament voted on August 9, 1965 to separate Singapore from the Federation. Prime Minister Lee Kuan Yew proclaimed Singapore an independent and sovereign republic, launching an era of rapid industrialization, public housing (HDB), and global financial integration.',
      events: [
        'August 9, 1965: Proclamation of Singapore establishes the sovereign Republic of Singapore; Yusof Ishak becomes First President.',
        'September 21, 1965: Singapore is admitted as the 117th member state of the United Nations.'
      ]
    }
  },
  Malaysia: {
    1957: {
      headline: 'Merdeka! Independence of the Federation of Malaya (August 31, 1957)',
      ruler: 'Tuanku Abdul Rahman (1st Yang di-Pertuan Agong) & PM Tunku Abdul Rahman',
      capital: 'Kuala Lumpur',
      governmentType: 'Federal Parliamentary Constitutional Elective Monarchy',
      narrative:
        'At midnight on August 31, 1957, the Union Jack was lowered in Kuala Lumpur and Prime Minister Tunku Abdul Rahman chanted "Merdeka!" seven times at Stadium Merdeka, proclaiming the independence of the Federation of Malaya (Peninsular Malaysia). Meanwhile, on Borneo Island, Sarawak and North Borneo (Sabah) remained British Crown Colonies until 1963.',
      events: [
        'August 31, 1957: Proclamation of Independence of the Federation of Malaya at Stadium Merdeka in Kuala Lumpur.',
        'British Crown Colonies of Sarawak and North Borneo (Sabah) on Borneo Island continue under direct British colonial administration until 1963.'
      ]
    },
    1963: {
      headline: 'Formation of Malaysia — Unification with British Borneo (Sarawak & Sabah) and Singapore (1963 CE)',
      ruler: 'Tuanku Syed Putra (Yang di-Pertuan Agong) & PM Tunku Abdul Rahman',
      capital: 'Kuala Lumpur',
      governmentType: 'Federal Parliamentary Constitutional Monarchy',
      narrative:
        'Pursuant to the Malaysia Agreement signed in London on July 9, 1963, the independent Federation of Malaya united with the former British Borneo Crown Colonies of Sarawak and North Borneo (renamed Sabah), alongside Singapore, on September 16, 1963 to form the modern Federation of Malaysia.',
      events: [
        'July 9, 1963: Signing of the Malaysia Agreement (MA63) in London by Britain, Malaya, Singapore, Sarawak, and North Borneo.',
        'September 16, 1963 (Malaysia Day): Formal proclamation of the Federation of Malaysia, ending British colonial rule in Sarawak and Sabah on Borneo Island.'
      ]
    }
  },
  Brunei: {
    1888: {
      headline: 'Treaty of Protection — Brunei Becomes a British Protectorate (1888 CE)',
      ruler: 'Sultan Hashim Jalilul Alam Aqamaddin (under British Protection)',
      capital: 'Brunei Town (Kota Batu / Kampong Ayer)',
      governmentType: 'Malay Islamic Sultanate under British Protectorate',
      narrative:
        'To halt further territorial losses to the White Rajahs of Sarawak and the British North Borneo Company, Sultan Hashim Jalilul Alam Aqamaddin signed the Treaty of Protection with Great Britain on September 17, 1888. In 1906, a Supplementary Treaty introduced a British Resident while preserving the House of Bolkiah monarchy.',
      events: [
        'September 17, 1888: Signing of the British-Brunei Treaty of Protection placing Brunei’s foreign relations under British control.'
      ]
    },
    1984: {
      headline: 'Full Independence of Brunei Darussalam from British Protection (January 1, 1984)',
      ruler: 'Sultan Hassanal Bolkiah',
      capital: 'Bandar Seri Begawan',
      governmentType: 'Unitary Islamic Absolute Monarchy (Sultanate)',
      narrative:
        'Following the 1979 Anglo-Brunei Treaty of Friendship and Cooperation, Brunei Darussalam peacefully resumed full sovereign independence from the United Kingdom at midnight on January 1, 1984 under Sultan Hassanal Bolkiah, immediately joining ASEAN and the United Nations.',
      events: [
        'January 1, 1984: Sultan Hassanal Bolkiah reads the Proclamation of Independence of Brunei Darussalam at Bandar Seri Begawan, ending 95 years of British protectorate status.',
        'January 7, 1984: Brunei Darussalam becomes the sixth member state of ASEAN.'
      ]
    }
  }
};

/**
 * Period-Specific Historical Chronicles for Romania / Principality of Wallachia & Moldavia
 */
function getRomaniaWallachiaYearChronicle(
  year: number,
  eraProfile: CountryEraProfile
): SpecificYearRecord | null {
  if (EXACT_COUNTRY_YEAR_RECORDS.Romania && EXACT_COUNTRY_YEAR_RECORDS.Romania[year]) {
    return EXACT_COUNTRY_YEAR_RECORDS.Romania[year];
  }
  const yStr = year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
  if (year >= 1330 && year <= 1714) {
    return {
      headline: `Principality of Wallachia (Țara Românească) & Moldavia in ${yStr}`,
      ruler: eraProfile.ruler,
      capital: eraProfile.capital,
      governmentType: 'Sovereign Christian Voivodeships (Wallachia & Moldavia)',
      narrative: `In ${yStr}, the Carpathian-Danubian region was governed by the autonomous Principalities of Wallachia (Țara Românească, founded 1330 by Basarab I) and Moldavia (founded 1359 by Bogdan I), alongside the Voivodeship/Principality of Transylvania. Ruled by native Voivodes (Princes) elected from the Basarab (Dănești and Drăculești branches) and Mușatin dynasties—most famously Mircea the Elder, Vlad III the Impaler (Vlad Țepeș, r. 1448, 1456–1462, 1476), Stephen the Great, and Michael the Brave—Wallachia and Moldavia preserved their own Christian courts at Târgoviște, Curtea de Argeș, Bucharest, and Suceava, defending the lower Danube against Ottoman and Hungarian expansion.`,
      events: [
        `Princely governance at ${eraProfile.capital} under ${eraProfile.ruler} in ${yStr}.`,
        'Defense of the fortified Danube crossings (Giurgiu, Turnu, Brăila, Chilia) and Carpathian mountain passes (Bran, Posada, Red Tower Pass).',
        'Flourishing of Wallachian and Moldavian Orthodox monastic architecture (Curtea de Argeș, Cozia, Snagov, Putna, and Voroneț) and early Slavonic/Romanian printing.'
      ]
    };
  }
  return null;
}

/**
 * Period-Specific Historical Chronicles for Pakistan (Pre-1947 to 2026)
 * Ensures that clicking Pakistan in ANY year (-3000 to 2026) gives a rich, accurate year-specific chronicle!
 */
function getPakistanYearChronicle(year: number, eraProfile: CountryEraProfile): SpecificYearRecord {
  if (EXACT_COUNTRY_YEAR_RECORDS.Pakistan[year]) {
    return EXACT_COUNTRY_YEAR_RECORDS.Pakistan[year];
  }

  const yStr = year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;

  if (year < -1300) {
    return {
      headline: `Indus Valley Civilization (Harappa & Mohenjo-daro) in ${yStr}`,
      ruler: 'Urban Civic & Merchant-Priest Councils of Mohenjo-daro & Harappa',
      capital: 'Mohenjo-daro (Sindh) & Harappa (Punjab)',
      governmentType: 'Bronze Age Urban Civilization',
      narrative: `In ${yStr}, the territory of modern-day Pakistan formed the heartland of the Indus Valley (Harappan) Civilization—one of the world’s three earliest urban cradles alongside Mesopotamia and Egypt. Centered along the Indus and Ghaggar-Hakra river plains at Mohenjo-daro, Harappa, Kot Diji, and Mehrgarh, this society pioneered baked-brick grid city planning, covered municipal drainage systems, standardized weights and measures, and maritime trade from the Makran coast to Sumerian ports in the Persian Gulf.`,
      events: [
        `Active urban administration and granary storage in Mohenjo-daro and Harappa during ${yStr}.`,
        'Maritime commerce in carnelian beads, cotton textiles, ivory, and copper between the Indus delta/Makran ports (Sutkagen Dor) and Mesopotamia (Meluhha trade).',
        'Use of the undeciphered Indus Script on steatite seals and standardized chert weight cubes across the Indus basin.'
      ]
    };
  }
  if (year >= -1300 && year < -326) {
    return {
      headline: `Vedic Gandhara, Taxila & Achaemenid Indus Satrapies in ${yStr}`,
      ruler: year <= -530 ? 'Indo-Aryan Janapada Kings of Gandhara & Sindh' : 'Achaemenid Persian Satraps & Taxila Rulers',
      capital: 'Taxila (Takshashila) & Pushkalavati (Charsadda)',
      governmentType: year <= -530 ? 'Early Iron Age Kingdoms (Mahajanapadas)' : 'Imperial Satrapies (Hindush & Gandhara)',
      narrative: `In ${yStr}, the Indus basin and Gandhara (northern Pakistan) served as a vital civilizational crossroads between South Asia, Persia, and Central Asia. The ancient university city of Taxila (near modern Islamabad/Rawalpindi) flourished as a premier seat of philosophy, grammar (Panini), medicine, and statecraft, while after 530 BCE the Achaemenid Persian Empire incorporated Gandhara and Hindush (Sindh/Punjab) as its wealthiest eastern satrapies.`,
      events: [
        `Flourishing of Taxila (Takshashila) as an international center of scholarship and trade in ${yStr}.`,
        year > -530
          ? 'Integration of the Indus Valley (Hindush) and Gandhara into the Achaemenid Royal Road and tribute network.'
          : 'Development of Iron Age agrarian settlements and fortified cities across the Peshawar valley and Punjab plains.'
      ]
    };
  }
  if (year >= -326 && year < 711) {
    return {
      headline: `Gandhara, Maurya, Indo-Greek & Kushan Imperium in ${yStr}`,
      ruler:
        year < -180
          ? 'Mauryan Emperors (Chandragupta / Ashoka) & Provincial Viceroys at Taxila'
          : year < 30
          ? 'Indo-Greek (Menander I) & Indo-Scythian Kings'
          : year < 320
          ? 'Kushan Emperors (Kanishka the Great) at Purushapura (Peshawar)'
          : 'Kidarite, White Hun (Hephthalite) & Rai Dynasty Rulers',
      capital: year >= 30 && year < 320 ? 'Purushapura (Peshawar) & Taxila' : 'Taxila / Multan / Aror',
      governmentType: 'Classical Imperial Monarchy',
      narrative: `In ${yStr}, the lands of Pakistan stood at the center of Silk Road geopolitics. Following Alexander the Great’s Indus campaign (326 BCE), the region became the northern anchor of the Maurya Empire, the Greco-Bactrian/Indo-Greek kingdoms, and the Kushan Empire (which ruled from Peshawar/Purushapura). During this era, Greco-Buddhist Gandharan art reached its zenith across Swat, Taxila, and Takht-i-Bahi, transmitting Buddhism along the Karakoram routes to China and East Asia.`,
      events: [
        `Active Silk Road caravan trade connecting Peshawar, Swat, and Taxila through the Khyber and Karakoram passes in ${yStr}.`,
        'Patronage of Gandharan sculpture, Buddhist monastic universities (Takht-i-Bahi, Dharmarajika Stupa at Taxila), and multicultural coinage.'
      ]
    };
  }
  if (year >= 711 && year < 1526) {
    return {
      headline: `Islamic Conquest of Sindh, Ghaznavid Punjab & Delhi Sultanate Frontier in ${yStr}`,
      ruler:
        year < 997
          ? 'Umayyad/Abbasid Governors of Sindh (Mansura & Multan) & Hindu Shahi Kings'
          : year < 1206
          ? 'Ghaznavid & Ghurid Sultans (Mahmud of Ghazni / Muhammad of Ghor)'
          : 'Delhi Sultanate (Mamluk, Khalji, Tughlaq & Langah/Samma Dynasties in Multan & Thatta)',
      capital: year < 1000 ? 'Mansura (Sindh), Multan & Hund' : 'Lahore, Multan & Thatta',
      governmentType: 'Medieval Sultanate & Regional Dynasties',
      narrative: `In ${yStr}, the Indus region underwent a profound cultural and religious transformation. Beginning with Muhammad bin Qasim’s conquest of Sindh and Multan in 711–712 CE and followed by the Ghaznavids and Ghurids making Lahore their eastern capital, the region became the cradle of Indo-Islamic civilization. Great Sufi saints—including Data Ganj Bakhsh Ali Hujwiri in Lahore, Bahauddin Zakariya in Multan, Lal Shahbaz Qalandar in Sehwan, and Baba Farid in Pakpattan—shaped the spiritual and linguistic fabric of Punjab and Sindh.`,
      events: [
        `In ${yStr}, Lahore, Multan, and Thatta served as major fortified administrative, scholarly, and commercial centers.`,
        'Defense of the Indus and Punjab frontier passes against Mongol Ilkhanate and Chagatai raids from Central Asia.',
        'Flourishing of Sufi shrines (*khanqahs*), Persian court literature, and glazed tile architecture in Multan, Uch Sharif, and Thatta.'
      ]
    };
  }
  if (year >= 1526 && year < 1799) {
    return {
      headline: `Mughal Imperial Heartland (Lahore, Multan, Thatta & Kabul Corridor) in ${yStr}`,
      ruler: eraProfile.ruler,
      capital: 'Lahore (Imperial Mughal Capital 1584–1598) & Provincial Seats at Multan, Thatta, and Peshawar',
      governmentType: 'Mughal Imperial Subahs (Provinces of Lahore, Multan, Thatta & Kabul)',
      narrative: `In ${yStr}, the territories of modern Pakistan formed the strategic northwestern heartland of the Mughal Empire. Lahore served as the imperial residence under Emperor Akbar (1584–1598) and a premier cultural capital under Jahangir, Shah Jahan, and Aurangzeb, witnessing the construction of the Lahore Fort, Badshahi Mosque (1673), Shalimar Gardens (1642), Wazir Khan Mosque, and the Grand Trunk Road linking Peshawar and Attock to Delhi and Bengal.`,
      events: [
        `Mughal provincial administration (*Subahs* of Lahore, Multan, and Thatta) governing agrarian revenue, textiles, and frontier security in ${yStr}.`,
        'Caravan trade along the Grand Trunk Road (*Sadak-e-Azam*) through the Khyber Pass, Peshawar, Attock Fort, Rohtas Fort, and Lahore.',
        year > 1707
          ? `Rising autonomy of the Kalhora/Talpur Mirs in Sindh, the Khanate of Kalat in Balochistan, and Durrani Afghan campaigns across the Indus during ${yStr}.`
          : `Peak Mughal architectural patronage and imperial craftsmanship across Lahore and Thatta in ${yStr}.`
      ]
    };
  }
  if (year >= 1799 && year < 1849) {
    return {
      headline: `Sikh Empire in Punjab, Talpur Mirs in Sindh & Khanate of Kalat in ${yStr}`,
      ruler: year <= 1839 ? 'Maharaja Ranjit Singh (Punjab), Talpur Mirs (Sindh) & Khan of Kalat' : 'Sikh Durbar (Lahore) & British East India Company (Sindh conquered 1843)',
      capital: 'Lahore (Punjab), Hyderabad (Sindh) & Kalat (Balochistan)',
      governmentType: 'Regional Sovereign Kingdoms & Early British Annexation',
      narrative: `In ${yStr}, Punjab, Kashmir, and Peshawar were governed from Lahore by the Sikh Empire founded by Maharaja Ranjit Singh, while Sindh was ruled by the Talpur Mirs from Hyderabad and Khairpur (until British General Charles Napier’s conquest of Sindh at the Battle of Miani in 1843), and Balochistan was ruled by the Khanate of Kalat.`,
      events: [
        year === 1843
          ? 'February 1843: Battle of Miani — British East India Company forces under Charles Napier defeat the Talpur Mirs and annex Sindh.'
          : year >= 1845
          ? `First and Second Anglo-Sikh Wars (${yStr}) culminating in the British annexation of the Punjab in 1849.`
          : `Modernization of the Khalsa army along European lines in Lahore and consolidation of Peshawar and Multan in ${yStr}.`
      ]
    };
  }
  if (year >= 1849 && year < 1947) {
    return {
      headline: `British Raj Administrative Provinces (Punjab, Sindh, NWFP & Balochistan) & Pakistan Movement in ${yStr}`,
      ruler: eraProfile.ruler,
      capital: 'Lahore, Karachi, Peshawar & Quetta (under British Indian Viceroyalty)',
      governmentType: 'British Colonial Provinces & Princely States',
      narrative: `In ${yStr}, the provinces of modern Pakistan—Punjab, Sindh, the North-West Frontier Province (created 1901), and Balochistan, alongside princely states such as Bahawalpur, Kalat, Swat, and Chitral—were under the British Raj. The British engineered the world’s largest perennial canal irrigation network across the Punjab ("Canal Colonies"), expanded the North Western Railway and the port of Karachi, and garrisoned the Durand Line (demarcated 1893). In the 20th century, under Allama Muhammad Iqbal (1930 Allahabad Address) and Quaid-e-Azam Muhammad Ali Jinnah (1940 Lahore Resolution), the All-India Muslim League mobilized millions for the creation of an independent Pakistan.`,
      events: [
        year === 1857
          ? '1857 War of Independence: Uprisings in Jhelum, Rawalpindi, Mardan, and Sahiwal (led by Rai Ahmad Khan Kharal).'
          : year === 1893
          ? 'November 1893: Signing of the Durand Line Agreement in Kabul demarcating the frontier between British India and Afghanistan.'
          : year === 1906
          ? 'December 30, 1906: Founding of the All-India Muslim League in Dhaka to safeguard Muslim political rights in South Asia.'
          : year === 1930
          ? 'December 1930: Allama Muhammad Iqbal delivers the historic Allahabad Presidential Address envisioning an autonomous Muslim state in northwestern India.'
          : year === 1936
          ? 'April 1, 1936: Sindh is formally separated from the Bombay Presidency and constituted as an autonomous province with Karachi as its capital.'
          : year === 1940
          ? 'March 23, 1940: The All-India Muslim League under Muhammad Ali Jinnah adopts the historic Lahore Resolution (Pakistan Resolution) at Minto Park, Lahore, demanding independent Muslim-majority states.'
          : year >= 1945
          ? `1945–1946 Provincial Elections: The Muslim League wins a landslide victory across Muslim constituencies, paving the way for the creation of Pakistan in August 1947.`
          : `Expansion of the Indus basin canal irrigation network, North Western Railway lines, and constitutional politics across Lahore, Karachi, and Peshawar in ${yStr}.`
      ]
    };
  }

  // Post-1947 dynamic decade/year synthesis for Pakistan when not an exact key in EXACT_COUNTRY_YEAR_RECORDS
  if (year >= 1947 && year <= 1957) {
    return {
      headline: `Early Post-Independence State Building & Constitutional Debates in Pakistan (${yStr})`,
      ruler:
        year <= 1951
          ? 'PM Liaquat Ali Khan & Gov.-Gen. Khawaja Nazimuddin'
          : year <= 1955
          ? 'Gov.-Gen. Ghulam Muhammad & PM Muhammad Ali Bogra'
          : 'President Iskander Mirza & Federal Cabinet',
      capital: 'Karachi',
      governmentType: 'Federal Parliamentary State',
      narrative: `In ${yStr}, Pakistan focused on post-Partition economic stabilization, refugee rehabilitation, industrialization through the Pakistan Industrial Development Corporation (PIDC), and drafting a permanent constitution in Karachi. In foreign policy, Pakistan signed the 1954 Mutual Defense Assistance Agreement with the United States and joined SEATO (1954) and the Baghdad Pact/CENTO (1955).`,
      events: [
        year === 1949
          ? 'March 12, 1949: The Constituent Assembly passes the historic Objectives Resolution moved by PM Liaquat Ali Khan.'
          : year === 1951
          ? 'October 16, 1951: Prime Minister Liaquat Ali Khan is assassinated at Company Bagh (Liaquat Bagh) in Rawalpindi.'
          : year === 1955
          ? 'October 1955: Implementation of the "One Unit" scheme merging the four western provinces into West Pakistan with Lahore as provincial capital.'
          : `Continued expansion of Karachi port, textile mills, defense forces, and constitutional drafting in ${yStr}.`
      ]
    };
  }
  if (year >= 1959 && year <= 1969) {
    return {
      headline: `The Ayub Khan Era — Industrialization, Green Revolution & Construction of Islamabad (${yStr})`,
      ruler: year < 1969 ? 'President Field Marshal Muhammad Ayub Khan' : 'President General Agha Muhammad Yahya Khan',
      capital: year < 1967 ? 'Rawalpindi (Interim Capital) / Islamabad (Under Construction)' : 'Islamabad',
      governmentType: 'Presidential Republic (1962 Constitution)',
      narrative: `During ${yStr}, Pakistan was governed under President Ayub Khan’s developmental state model. The 1960s ("Decade of Development") saw rapid private-sector industrialization, construction of the Mangla Dam (completed 1967) and Tarbela Dam under the 1960 Indus Waters Treaty, the relocation of the federal government to the newly built capital of Islamabad, and the adoption of the 1962 Presidential Constitution, before popular protests in 1968–1969 led to Ayub Khan handing power to General Yahya Khan in March 1969.`,
      events: [
        year === 1959
          ? '1959: Promulgation of the Basic Democracies Order, Land Reforms Regulations, and the decision to shift the federal capital from Karachi to the Potohar Plateau (Rawalpindi/Islamabad).'
          : year === 1962
          ? 'March 1, 1962: President Ayub Khan promulgates the 1962 Constitution introducing a presidential system; martial law is lifted in June 1962.'
          : year === 1963
          ? 'March 2, 1963: Signing of the Sino-Pakistan Boundary Agreement demarcating the border between northern areas and China’s Xinjiang region.'
          : year === 1966
          ? 'January 10, 1966: Signing of the Tashkent Declaration by President Ayub Khan and Indian PM Lal Bahadur Shastri mediated by Soviet Premier Alexei Kosygin.'
          : year === 1967
          ? 'November 1967: Formal completion and inauguration of the massive Mangla Dam on the Jhelum River and relocation of federal ministries to Islamabad.'
          : year === 1969
          ? 'March 25, 1969: Following nationwide student and labor protests, President Ayub Khan resigns and hands over power to General Yahya Khan, who promises general elections on a one-person, one-vote basis.'
          : `Sustained industrial manufacturing expansion, Green Revolution high-yield wheat/rice adoption, and construction of Islamabad sectors in ${yStr}.`
      ]
    };
  }
  if (year >= 1970 && year <= 1977) {
    return {
      headline: `Parliamentary Reconstruction, Nationalization & Strategic Programs in Pakistan (${yStr})`,
      ruler: year === 1970 ? 'President Gen. Yahya Khan' : year < 1977 ? 'Prime Minister Zulfikar Ali Bhutto' : 'PM Zulfikar Ali Bhutto / Gen. Muhammad Zia-ul-Haq (from July 1977)',
      capital: 'Islamabad',
      governmentType: 'Federal Parliamentary Republic (1973 Constitution)',
      narrative: `In ${yStr}, under Zulfikar Ali Bhutto, Pakistan rebuilt its institutions after the 1971 war, enacted the consensus 1973 Constitution, launched the country’s nuclear deterrence program (after 1972/1974), hosted the historic 1974 Organization of the Islamic Conference (OIC) Summit in Lahore, established Pakistan Steel Mills and Port Qasim, and completed the Tarbela Dam.`,
      events: [
        year === 1970
          ? 'December 7, 1970: Pakistan holds its first nationwide direct general elections.'
          : year === 1972
          ? 'July 2, 1972: Signing of the Simla Agreement establishing the Line of Control in Kashmir; inauguration of the Karachi Nuclear Power Plant (KANUPP).'
          : year === 1974
          ? 'February 1974: Lahore hosts the historic 2nd Islamic Summit Conference of the OIC attended by King Faisal of Saudi Arabia, Yasser Arafat, and leaders of 37 Muslim nations.'
          : year === 1976
          ? '1976: Completion of the Tarbela Dam on the Indus River (the world’s largest earth-filled dam) and establishment of Dr. A.Q. Khan’s uranium enrichment research laboratories at Kahuta.'
          : year === 1977
          ? 'July 5, 1977: Following disputed March 1977 general elections and PNA protests, Chief of Army Staff General Muhammad Zia-ul-Haq executes Operation Fair Play and declares martial law.'
          : `Implementation of labor, land, and industrial policies alongside defense and nuclear research development in ${yStr}.`
      ]
    };
  }
  if (year >= 1978 && year <= 1988) {
    return {
      headline: `The Zia-ul-Haq Era, Frontline State in the Soviet-Afghan War & Islamization Policies (${yStr})`,
      ruler: 'President General Muhammad Zia-ul-Haq (PM Muhammad Khan Junejo 1985–1988; PM Benazir Bhutto elected Dec 1988)',
      capital: 'Islamabad',
      governmentType: 'Presidential Military Rule / Partyless Parliamentary System (1985–1988)',
      narrative: `During ${yStr}, following the December 1979 Soviet invasion of Afghanistan, Pakistan became the pivotal frontline state supporting the Afghan Mujahideen in partnership with the United States and Saudi Arabia while hosting over 3 million Afghan refugees. Domestically, General Zia-ul-Haq introduced legal and financial Islamization measures, held partyless elections in 1985 appointing Muhammad Khan Junejo as Prime Minister, and advanced Pakistan’s nuclear program until Zia’s death in a C-130 crash near Bahawalpur in August 1988.`,
      events: [
        year === 1979
          ? 'December 1979: Soviet invasion of neighboring Afghanistan transforms Pakistan into a frontline strategic state.'
          : year === 1985
          ? 'March 1985: Non-party general elections held; Muhammad Khan Junejo becomes Prime Minister and the Eighth Constitutional Amendment is passed lifting martial law in December.'
          : year === 1988
          ? 'August 17, 1988: President Zia-ul-Haq dies in a plane crash near Bahawalpur; in November–December 1988, Benazir Bhutto wins general elections and becomes the first female Prime Minister of a Muslim-majority nation.'
          : `Strategic coordination along the Afghan frontier, 6%+ annual GDP growth fueled by Gulf remittances and foreign aid, and completion of the Karakoram Highway in ${yStr}.`
      ]
    };
  }
  if (year >= 1989 && year <= 1999) {
    return {
      headline: `1990s Democratic Alternation (Benazir Bhutto & Nawaz Sharif), Motorway Era & Nuclear Deterrence (${yStr})`,
      ruler:
        year <= 1990 || (year >= 1993 && year <= 1996)
          ? 'Prime Minister Benazir Bhutto (PPP)'
          : year === 1999
          ? 'PM Nawaz Sharif (until Oct 12, 1999) / Gen. Pervez Musharraf'
          : 'Prime Minister Nawaz Sharif (PML-N)',
      capital: 'Islamabad',
      governmentType: 'Federal Parliamentary Republic',
      narrative: `In ${yStr}, Pakistan experienced alternating parliamentary governments led by Prime Minister Benazir Bhutto (PPP) and Prime Minister Nawaz Sharif (PML-N). Key developments of the decade included economic privatization and currency liberalization, the construction of South Asia’s first 6-lane motorway (M-2 Lahore–Islamabad, opened 1997), Pakistan’s victory in the 1992 Cricket World Cup under Imran Khan, the May 1998 Chagai nuclear tests, and the 1999 Kargil conflict followed by General Pervez Musharraf’s October 1999 takeover.`,
      events: [
        year === 1992
          ? 'March 25, 1992: Pakistan wins the 1992 Cricket World Cup in Melbourne under captain Imran Khan; launch of economic deregulation and cellular telecom services.'
          : year === 1997
          ? '1997: Golden Jubilee of Pakistan’s independence; inauguration of the M-2 Lahore-Islamabad Motorway and passage of the 13th and 14th Constitutional Amendments.'
          : year === 1999
          ? 'February 1999: Lahore Declaration summit between PM Nawaz Sharif and Indian PM Atal Bihari Vajpayee; May–July 1999 Kargil conflict; October 12, 1999 military takeover by Gen. Pervez Musharraf.'
          : `Parliamentary governance, private media and telecom expansion, and strategic missile/defense development in ${yStr}.`
      ]
    };
  }
  if (year >= 2000 && year <= 2008) {
    return {
      headline: `The Musharraf Era — Telecom/Banking Boom, Post-9/11 Geopolitics & 2007–2008 Democratic Restoration (${yStr})`,
      ruler:
        year < 2008
          ? 'President Gen. Pervez Musharraf (PM Zafarullah Khan Jamali / Shaukat Aziz)'
          : 'President Asif Ali Zardari & PM Yousaf Raza Gillani (elected 2008)',
      capital: 'Islamabad',
      governmentType: 'Presidential-Parliamentary Hybrid / Federal Republic',
      narrative: `During ${yStr}, Pakistan navigated the post-9/11 War on Terror as a frontline coalition partner while experiencing rapid consumer banking, telecommunications, and private television media growth under President Pervez Musharraf and PM Shaukat Aziz. In October 2005, a devastating 7.6-magnitude earthquake struck Azad Kashmir and northern Pakistan. In 2007–2008, the Lawyers’ Movement for judicial independence, the tragic assassination of Benazir Bhutto in Rawalpindi (Dec 27, 2007), and the February 2008 general elections restored full civilian parliamentary democracy.`,
      events: [
        year === 2001
          ? 'September 2001: Following the 9/11 attacks, Pakistan becomes a key logistical and intelligence partner in the US-led campaign in Afghanistan.'
          : year === 2004
          ? 'January 2004: Islamabad hosts the 12th SAARC Summit launching a composite peace dialogue between Pakistan and India.'
          : year === 2005
          ? 'October 8, 2005: A catastrophic 7.6-magnitude earthquake strikes Muzaffarabad (Azad Kashmir) and Khyber Pakhtunkhwa, claiming over 73,000 lives and prompting massive international relief.'
          : year === 2007
          ? '2007: The Lawyers’ Movement rallies nationwide for the restoration of Chief Justice Iftikhar Muhammad Chaudhry; on December 27, 2007, former PM Benazir Bhutto is assassinated at Liaquat Bagh, Rawalpindi.'
          : year === 2008
          ? 'February 18, 2008: General elections return a civilian democratic coalition; Pervez Musharraf resigns in August 2008 and Asif Ali Zardari is elected President.'
          : `Expansion of mobile telecommunications, private news networks, higher education (HEC reforms), and Gwadar Deep Sea Port Phase-I construction in ${yStr}.`
      ]
    };
  }
  // 2009 to 2023
  return {
    headline: `Democratic Transitions, 18th Constitutional Amendment, Zarb-e-Azb & CPEC Infrastructure (${yStr})`,
    ruler:
      year <= 2013
        ? 'President Asif Ali Zardari & PM Yousaf Raza Gillani / Raja Pervaiz Ashraf'
        : year <= 2018
        ? 'Prime Minister Nawaz Sharif / Shahid Khaqan Abbasi'
        : 'Prime Minister Imran Khan (2018–April 2022) / PM Shehbaz Sharif',
    capital: 'Islamabad',
    governmentType: 'Federal Parliamentary Constitutional Republic',
    narrative: `In ${yStr}, Pakistan strengthened federal provincial autonomy through the historic 18th Constitutional Amendment (2010), achieved its first-ever peaceful democratic transfer of power between elected civilian governments in 2013, launched the China-Pakistan Economic Corridor (CPEC, $60B+ energy and transport investment launched in 2015), and decisively degraded militant strongholds in the northwest through Operations Rah-e-Rast (Swat, 2009), Zarb-e-Azb (North Waziristan, 2014–2016), and Radd-ul-Fasaad (2017) before merging FATA into Khyber Pakhtunkhwa in 2018.`,
    events: [
      year === 2009
        ? 'May–July 2009: Pakistan Army executes Operation Rah-e-Rast, successfully clearing the Swat Valley of TTP militants and returning 2 million displaced residents.'
        : year === 2010
        ? 'April 19, 2010: Enactment of the landmark 18th Constitutional Amendment devolving extensive powers and fiscal resources (7th NFC Award) to the provinces and renaming NWFP as Khyber Pakhtunkhwa.'
        : year === 2013
        ? 'May 11, 2013: Historic general elections mark the first time in Pakistan’s history that one democratically elected civilian government completes its full 5-year term and transfers power via the ballot box to another (Nawaz Sharif’s PML-N).'
        : year === 2014
        ? 'June 15, 2014: Launch of Operation Zarb-e-Azb in North Waziristan to eliminate militant sanctuaries; Malala Yousafzai becomes the youngest-ever Nobel Peace Prize laureate.'
        : year === 2015
        ? 'April 20, 2015: Chinese President Xi Jinping visits Islamabad to formally launch the $46B+ (later $62B) China-Pakistan Economic Corridor (CPEC), building power plants, motorways, and Gwadar Port.'
        : year === 2018
        ? 'May 2018: Passage of the 25th Constitutional Amendment merging the Federally Administered Tribal Areas (FATA) into Khyber Pakhtunkhwa; July 25, 2018 general elections bring Imran Khan (PTI) to office as Prime Minister.'
        : year === 2019
        ? 'February 2019: Aerial confrontation ("Operation Swift Retort") between the Pakistan Air Force and Indian Air Force over Kashmir; November 2019 inauguration of the visa-free Kartarpur Corridor for Sikh pilgrims.'
        : year === 2020
        ? '2020: Pakistan implements a data-driven "smart lockdown" strategy and the Ehsaas Emergency Cash program during the COVID-19 pandemic, preserving livelihoods and industrial output.'
        : year === 2023
        ? '2023: Completion of the 2023 Digital Population Census recording Pakistan’s population at 241.5 million; signing of a $3B IMF Stand-By Arrangement in July 2023 to stabilize foreign reserves.'
        : `Ongoing CPEC energy/motorway infrastructure development, counter-terrorism stabilization, and parliamentary politics in ${yStr}.`
    ]
  };
}

/**
 * Returns a verified, credible historical record for Antarctica or an Indigenous / Uncolonized
 * territory ONLY if a documented historical event actually occurred in that specific year.
 * Returns null when there is not enough credible year-specific information.
 */
export function getCredibleIndigenousOrAntarcticRecord(
  lookupCountry: string,
  year: number
): SpecificYearRecord | null {
  const yStr = year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;

  // 1. ANTARCTICA — Only specific years with documented polar expeditions, discoveries, or treaty milestones
  if (lookupCountry === 'Antarctica') {
    switch (year) {
      case 1773:
        return {
          headline: 'Captain James Cook Makes First Documented Crossing of the Antarctic Circle (1773 CE)',
          ruler: 'Royal Navy Expedition (HMS Resolution & HMS Adventure)',
          capital: 'None',
          governmentType: 'Uninhabited Polar Continent',
          narrative:
            'On **January 17, 1773**, British explorer **Captain James Cook** and the crews of *HMS Resolution* and *HMS Adventure* became the first documented mariners in history to cross south of the **Antarctic Circle** ($66^\\circ 33\'\\text{ S}$). Although dense pack ice prevented Cook from sighting the continental landmass itself, his circumnavigation proved that any southern continent lay locked within polar ice.',
          events: [
            'January 17, 1773: HMS Resolution and HMS Adventure cross the Antarctic Circle for the first time in recorded history.',
            '1773–1774: Cook charts the sub-Antarctic Southern Ocean and reaches 71°10′ S latitude before pack ice forces his ships northward.'
          ]
        };
      case 1820:
        return {
          headline: 'First Confirmed Human Sightings of the Antarctic Continent (1820 CE)',
          ruler: 'Russian, British & American Maritime Expeditions',
          capital: 'None',
          governmentType: 'Uninhabited Polar Continent',
          narrative:
            'In **1820 CE**, three separate maritime expeditions made the first documented sightings of **Antarctica**. On **January 27, 1820**, the Russian Imperial Navy expedition led by **Fabian Gottlieb von Bellingshausen** and **Mikhail Lazarev** (*Vostok* and *Mirny*) sighted the Fimbul Ice Shelf on the Princess Martha Coast. Three days later, on **January 30, 1820**, British Royal Navy officer **Edward Bransfield** sighted Trinity Peninsula on the Antarctic Peninsula, followed in **November 1820** by American sealer **Nathaniel Palmer**.',
          events: [
            'January 27, 1820: Bellingshausen and Lazarev sight the continental ice shelf of East Antarctica at 69°21′ S, 2°14′ W.',
            'January 30, 1820: Edward Bransfield and William Smith sight the northern tip of the Antarctic Peninsula (Trinity Peninsula).',
            'November 17, 1820: American sealing captain Nathaniel Palmer sights the Antarctic Peninsula aboard the sloop Hero.'
          ]
        };
      case 1821:
        return {
          headline: 'First Documented Landing on Antarctica & Discovery of Peter I and Alexander Islands (1821 CE)',
          ruler: 'Maritime Sealing & Naval Expeditions',
          capital: 'None',
          governmentType: 'Uninhabited Polar Continent',
          narrative:
            'In **January 1821**, **Fabian Gottlieb von Bellingshausen** discovered **Peter I Island** and **Alexander Island** south of the Antarctic Circle. On **February 7, 1821**, American sealing captain **John Davis** (commanding the *Cecilia*) made the first documented human landing claim on the Antarctic Peninsula at **Hughes Bay**, recording in his ship’s log: *"I think this Southern Land to be a Continent."*',
          events: [
            'January 1821: Bellingshausen discovers and charts Peter I Island and Alexander I Land.',
            'February 7, 1821: Crew of the American sealing vessel Cecilia under Captain John Davis lands at Hughes Bay on the Antarctic Peninsula.'
          ]
        };
      case 1840:
        return {
          headline: "Wilkes & Dumont d'Urville Expeditions Prove Antarctica’s Continental Scale (1840 CE)",
          ruler: 'French & United States Exploring Expeditions',
          capital: 'None',
          governmentType: 'Uninhabited Polar Continent',
          narrative:
            'In **January 1840**, French explorer **Jules Dumont d’Urville** (*Astrolabe* and *Zélée*) landed on a rocky islet off **Adélie Land**, while US Navy Lieutenant **Charles Wilkes** (leading the **United States Exploring Expedition**) charted more than 2,400 km (1,500 miles) of the East Antarctic coastline (Wilkes Land), providing the first definitive cartographic proof that Antarctica is a continent-sized landmass.',
          events: [
            'January 20, 1840: Jules Dumont d’Urville lands on Rocher du Débarquement off Adélie Land and collects geological specimens.',
            'January–February 1840: Charles Wilkes charts 2,400 km of the Antarctic coast along the Indian Ocean sector, establishing Antarctica as a continent.'
          ]
        };
      case 1841:
        return {
          headline: 'Sir James Clark Ross Discovers the Ross Sea, Ross Ice Shelf & Mount Erebus (1841 CE)',
          ruler: 'British Royal Navy Expedition (HMS Erebus & HMS Terror)',
          capital: 'None',
          governmentType: 'Uninhabited Polar Continent',
          narrative:
            'In **January 1841**, British polar explorer **Sir James Clark Ross**, commanding the strengthened bomb vessels *HMS Erebus* and *HMS Terror*, broke through the dense pack ice into the **Ross Sea**. His expedition discovered **Victoria Land**, the towering ice cliff of the **Ross Ice Shelf** ("The Great Ice Barrier"), and the active volcano **Mount Erebus** alongside **Mount Terror**.',
          events: [
            'January 1841: HMS Erebus and HMS Terror enter the Ross Sea and chart the coast of Victoria Land.',
            'January 28, 1841: Discovery of the active polar volcano Mount Erebus (3,794 m) and the Ross Ice Shelf.'
          ]
        };
      case 1895:
        return {
          headline: 'First Confirmed Landing on the Main Continental Landmass at Cape Adare (1895 CE)',
          ruler: 'Antarctic Whaling Expedition (Henrik Bull & Carsten Borchgrevink)',
          capital: 'None',
          governmentType: 'Uninhabited Polar Continent',
          narrative:
            'On **January 24, 1895**, a party from the Norwegian whaling vessel *Antarctic*—including **Carsten Borchgrevink**, **Henrik Johan Bull**, Captain **Leonard Kristensen**, and **Alexander von Tunzelmann**—came ashore at **Cape Adare** in northern Victoria Land, marking the first undisputed landing on the main continental landmass of Antarctica and collecting the first lichens found south of the Antarctic Circle.',
          events: [
            'January 24, 1895: Landing at Cape Adare; Carsten Borchgrevink collects the first botanical specimens (lichens) south of the Antarctic Circle.',
            'Summer 1895: The Sixth International Geographical Congress in London calls for the scientific exploration of Antarctica, launching the Heroic Age of Antarctic Exploration.'
          ]
        };
      case 1898:
      case 1899:
        return {
          headline: `First Overwintering Expeditions in Antarctica — Belgica & Southern Cross (${yStr})`,
          ruler: 'Adrien de Gerlache (Belgica) & Carsten Borchgrevink (Southern Cross)',
          capital: 'None',
          governmentType: 'Uninhabited Polar Continent',
          narrative:
            year === 1898
              ? 'In **March 1898**, the **Belgian Antarctic Expedition** aboard *RV Belgica*—commanded by **Adrien de Gerlache** with **Roald Amundsen** as first mate and **Dr. Frederick Cook** as ship’s surgeon—became trapped in the Bellingshausen Sea pack ice and became the **first expedition in history to overwinter inside the Antarctic Circle**.'
              : 'In **1899**, the British **Southern Cross Expedition** led by Anglo-Norwegian explorer **Carsten Borchgrevink** built two prefabricated wooden huts at **Cape Adare** and became the **first expedition to overwinter on the Antarctic mainland**, pioneering the use of sledge dogs in Antarctica.',
          events: [
            year === 1898
              ? 'March 1898 – March 1899: RV Belgica drifts locked in Bellingshausen Sea pack ice through the entire polar night; crew records the first full year of Antarctic meteorological observations.'
              : 'February 1899 – January 1900: Carsten Borchgrevink’s 10-man party overwinters on shore at Cape Adare and sledges onto the Ross Ice Shelf to 78°50′ S.'
          ]
        };
      case 1902:
      case 1903:
        return {
          headline: `Robert Falcon Scott’s Discovery Expedition Explores McMurdo Sound & Polar Plateau (${yStr})`,
          ruler: 'British National Antarctic (Discovery) Expedition',
          capital: 'Hut Point (McMurdo Sound)',
          governmentType: 'Scientific Polar Expedition Base',
          narrative:
            `During **${yStr}**, the **British National Antarctic (*Discovery*) Expedition** led by **Robert Falcon Scott** operated from Hut Point on Ross Island. In **November–December 1902**, Scott, **Ernest Shackleton**, and **Dr. Edward Wilson** sledged across the Ross Ice Shelf to a new Furthest South of $82^\\circ 17\'\\text{ S}$, and in **late 1903** Scott led the first party up the Ferrar Glacier onto the **East Antarctic Polar Plateau**.`,
          events: [
            year === 1902
              ? 'February 1902: RRS Discovery establishes winter quarters at Hut Point, Ross Island; Scott makes the first Antarctic tethered hydrogen balloon ascent.'
              : 'October–December 1903: Scott leads the Western Party up the Ferrar Glacier, becoming the first explorers to travel across the high Polar Plateau of East Antarctica.'
          ]
        };
      case 1908:
      case 1909:
        return {
          headline: `Shackleton’s Nimrod Expedition Reaches 88°23′ S & Attains the South Magnetic Pole (${yStr})`,
          ruler: 'British Antarctic (Nimrod) Expedition — Ernest Shackleton',
          capital: 'Cape Royds (Ross Island)',
          governmentType: 'Scientific Polar Expedition Base',
          narrative:
            `During the **British Antarctic (*Nimrod*) Expedition (${yStr})** led by **Ernest Shackleton**, **Edgeworth David** led the first ascent of the active volcano **Mount Erebus** (March 1908). On **January 9, 1909**, Shackleton, Frank Wild, Eric Marshall, and Jameson Adams pioneered the **Beardmore Glacier** route onto the Polar Plateau and reached **$88^\\circ 23\'\\text{ S}$**—just 97 geographical miles (180 km) from the South Pole—before turning back to save his men’s lives. One week later (**January 16, 1909**), **Edgeworth David**, **Douglas Mawson**, and **Alistair Mackay** reached the **South Magnetic Pole**.`,
          events: [
            'March 10, 1908: Edgeworth David, Douglas Mawson, and Alistair Mackay complete the first ascent of Mount Erebus (3,794 m).',
            'January 9, 1909: Ernest Shackleton’s Southern Party reaches 88°23′ S on the Polar Plateau after discovering the Beardmore Glacier highway.',
            'January 16, 1909: Edgeworth David, Douglas Mawson, and Alistair Mackay reach the South Magnetic Pole in Victoria Land.'
          ]
        };
      case 1911:
        return {
          headline: 'Roald Amundsen Reaches the Geographic South Pole for the First Time in History (Dec 14, 1911)',
          ruler: 'Norwegian Antarctic Expedition (Roald Amundsen) & British Terra Nova Expedition (R.F. Scott)',
          capital: 'Framheim (Bay of Whales) & Cape Evans',
          governmentType: 'Polar Exploration Expeditions',
          narrative:
            'On **December 14, 1911**, Norwegian explorer **Roald Amundsen** and four companions (**Olav Bjaaland**, **Helmer Hanssen**, **Sverre Hassel**, and **Oscar Wisting**), using dog teams and skis from their base at **Framheim** on the Bay of Whales and ascending the previously uncharted **Axel Heiberg Glacier**, became the **first human beings in history to reach the Geographic South Pole ($90^\\circ\\text{ S}$)**, planting the Norwegian flag at *Polheim* 34 days ahead of **Robert Falcon Scott’s** British *Terra Nova* party.',
          events: [
            'October 20, 1911: Roald Amundsen’s 5-man dog-sledging team departs Framheim on the Bay of Whales heading south.',
            'November 1911: Amundsen pioneers the steep climb up the Axel Heiberg Glacier onto the 3,000-meter Antarctic Plateau.',
            'December 14, 1911: Roald Amundsen, Bjaaland, Hanssen, Hassel, and Wisting reach the Geographic South Pole (90° S), erecting the tent Polheim.'
          ]
        };
      case 1912:
        return {
          headline: 'Scott’s Terra Nova Party Reaches the South Pole & Perishes on the Return March (1912 CE)',
          ruler: 'British Terra Nova Expedition (Capt. Robert Falcon Scott) & Australasian Expedition (Douglas Mawson)',
          capital: 'Cape Evans & Cape Denison',
          governmentType: 'Polar Exploration Expeditions',
          narrative:
            'On **January 17, 1912**, British Royal Navy Captain **Robert Falcon Scott** and his four companions (**Edward Wilson**, **Henry "Birdie" Bowers**, **Lawrence "Titus" Oates**, and **Edgar Evans**) reached the **Geographic South Pole**, only to find Roald Amundsen’s tent *Polheim* waiting for them. On the 800-mile man-hauling return journey across the Polar Plateau and Ross Ice Shelf, all five men perished amidst extreme blizzards and frostbite in **March 1912**. That same year, Australian geologist **Douglas Mawson** established base at **Cape Denison** (Commonwealth Bay) and survived a harrowing solo trek across George V Land.',
          events: [
            'January 17, 1912: Robert Falcon Scott, Wilson, Bowers, Oates, and Evans reach the South Pole, 34 days after Amundsen.',
            'February–March 1912: Edgar Evans and Capt. Lawrence Oates perish on the return march; Scott, Wilson, and Bowers die in their tent on the Ross Ice Shelf around March 29, 1912, just 11 miles south of One Ton Depot.',
            'November 12, 1912: Search party led by Edward Atkinson discovers the tent containing the bodies, journals, and 35 lbs of *Glossopteris* fossil specimens carried by Scott’s party.'
          ]
        };
      case 1914:
      case 1915:
      case 1916:
        return {
          headline: `Sir Ernest Shackleton’s Imperial Trans-Antarctic (Endurance) Expedition & Open-Boat Rescue (${yStr})`,
          ruler: 'Imperial Trans-Antarctic Expedition — Sir Ernest Shackleton',
          capital: 'Weddell Sea Pack Ice / Elephant Island',
          governmentType: 'Polar Expedition',
          narrative:
            `During the **Imperial Trans-Antarctic Expedition (${yStr})**, **Sir Ernest Shackleton’s** ship *Endurance* became beset in heavy pack ice in the **Weddell Sea** in January 1915, was crushed and sank on **November 21, 1915**, stranding all 28 men on drifting ice floes. In **April 1916**, the crew rowed three lifeboats to uninhabited **Elephant Island**, from where Shackleton, **Frank Worsley**, **Tom Crean**, and three companions sailed the 22-foot lifeboat ***James Caird*** 800 nautical miles across the stormy Southern Ocean to **South Georgia** (May 1916), rescuing all 28 men from Elephant Island on **August 30, 1916** without a single loss of life.`,
          events: [
            year === 1914
              ? 'December 5, 1914: Endurance departs Grytviken, South Georgia, entering the Weddell Sea pack ice toward Vahsel Bay.'
              : year === 1915
              ? 'January–November 1915: Endurance is trapped in the Weddell Sea pack ice for 10 months before being crushed and sinking on November 21, 1915.'
              : 'April–August 1916: Shackleton’s crew reaches Elephant Island; voyage of the James Caird to South Georgia (April 24 – May 10, 1916) and rescue of all 22 men on Elephant Island aboard the Chilean tug Yelcho on August 30, 1916.'
          ]
        };
      case 1928:
      case 1929:
        return {
          headline: `First Antarctic Aviation & Admiral Richard E. Byrd’s First Flight Over the South Pole (${yStr})`,
          ruler: 'Sir Hubert Wilkins & US Rear Admiral Richard E. Byrd',
          capital: 'Little America I (Bay of Whales)',
          governmentType: 'Polar Aviation Expeditions',
          narrative:
            year === 1928
              ? 'On **November 16, 1928**, Australian aviator **Sir Hubert Wilkins** and pilot **Carl Ben Eielson** made the **first powered aircraft flight in Antarctica** from Deception Island in a Lockheed Vega monoplane, charting the Antarctic Peninsula from the air.'
              : 'On **November 29, 1929**, US Navy Commander (later Rear Admiral) **Richard E. Byrd**, along with pilot **Bernt Balchen**, co-pilot/radioman **Harold June**, and photographer **Ashley McKinley**, flew the Ford Trimotor aircraft *Floyd Bennett* from **Little America** on the Ross Ice Shelf over the Liv Glacier to complete the **first flight over the Geographic South Pole**.',
          events: [
            year === 1928
              ? 'November 16, 1928: Hubert Wilkins and Carl Ben Eielson complete the first airplane flight in Antarctica.'
              : 'November 28–29, 1929: Richard E. Byrd and Bernt Balchen fly the Ford Trimotor Floyd Bennett from Little America over the South Pole and back in 18 hours 41 minutes.'
          ]
        };
      case 1946:
      case 1947:
        return {
          headline: `US Navy Operation Highjump — Largest Antarctic Expedition in History (${yStr})`,
          ruler: 'US Navy Task Force 68 (Rear Admiral Richard E. Byrd & Rear Admiral Richard H. Cruzen)',
          capital: 'Little America IV (Ross Ice Shelf)',
          governmentType: 'Naval & Aerial Mapping Expedition',
          narrative:
            `From **August 1946 to February 1947**, the United States Navy conducted **Operation Highjump** (Task Force 68), deploying **4,700 personnel, 13 ships (including the aircraft carrier *USS Philippine Sea* and icebreakers), and 33 aircraft** under **Rear Admiral Richard E. Byrd** and **Rear Admiral Richard H. Cruzen**. The expedition established **Little America IV** and captured over 70,000 aerial mapping photographs across the Antarctic coastline and interior.`,
          events: [
            'December 1946 – February 1947: Task Force 68 operates in three naval groups around the perimeter of Antarctica, discovering the Bunger Hills ice-free oasis and mapping vast stretches of coastline by air.'
          ]
        };
      case 1957:
      case 1958:
        return {
          headline: `International Geophysical Year (IGY) & First Overland Crossing of Antarctica (${yStr})`,
          ruler: '12 International Geophysical Year (IGY) Participating Nations',
          capital: 'McMurdo / Amundsen–Scott South Pole / Vostok Stations',
          governmentType: 'International Scientific Research Network',
          narrative:
            `During the **International Geophysical Year (1957–1958)**, twelve nations established over 50 scientific observatories across Antarctica, including the permanent US **Amundsen–Scott South Pole Station** (established Jan 1957) and the Soviet **Vostok Station** at the Southern Pole of Inaccessibility/Cold (Dec 1957). Between **November 1957 and March 2, 1958**, the **Commonwealth Trans-Antarctic Expedition** led by **Dr. Vivian Fuchs** and **Sir Edmund Hillary** completed the **first overland mechanized crossing of the Antarctic continent** via the South Pole.`,
          events: [
            year === 1957
              ? 'January–December 1957: Opening of the permanent US Amundsen–Scott South Pole Station and Soviet Vostok Station during the International Geophysical Year.'
              : 'March 2, 1958: Sir Vivian Fuchs and Sir Edmund Hillary complete the 2,158-mile first overland crossing of Antarctica from the Weddell Sea to Scott Base on the Ross Sea in 99 days.'
          ]
        };
      case 1959:
        return {
          headline: 'Signing of the Historic Antarctic Treaty in Washington, D.C. (December 1, 1959)',
          ruler: '12 Original Signatory Nations of the Antarctic Treaty',
          capital: 'None (International Treaty Preserve)',
          governmentType: 'Antarctic Treaty System (Demilitarized Scientific Preserve)',
          narrative:
            'On **December 1, 1959**, in Washington, D.C., the twelve nations that had been active in Antarctica during the International Geophysical Year (Argentina, Australia, Belgium, Chile, France, Japan, New Zealand, Norway, South Africa, the Soviet Union, the United Kingdom, and the United States) signed the landmark **Antarctic Treaty**. The treaty designated all land and ice shelves south of **$60^\\circ\\text{ S}$ latitude** as a demilitarized scientific preserve, banned nuclear testing and military fortifications, guaranteed freedom of scientific investigation, and froze all territorial sovereignty claims.',
          events: [
            'October 15 – December 1, 1959: Washington Conference on Antarctica convenes among the 12 IGY nations.',
            'December 1, 1959: Signing of the Antarctic Treaty, establishing Antarctica as an international preserve dedicated exclusively to peace and science.'
          ]
        };
      case 1961:
        return {
          headline: 'Entry into Force of the Antarctic Treaty System (June 23, 1961)',
          ruler: 'Antarctic Treaty Consultative Parties',
          capital: 'None',
          governmentType: 'Antarctic Treaty System',
          narrative:
            'On **June 23, 1961**, following ratification by all twelve original signatory states, the **Antarctic Treaty** officially entered into force, and the First Antarctic Treaty Consultative Meeting (ATCM) convened in Canberra, Australia in July 1961.',
          events: [
            'June 23, 1961: The Antarctic Treaty formally enters into force across all territories south of 60° S latitude.',
            'July 10–24, 1961: First Antarctic Treaty Consultative Meeting (ATCM I) is held in Canberra.'
          ]
        };
      case 1985:
        return {
          headline: 'Discovery of the Antarctic Ozone Hole Published by British Antarctic Survey (1985 CE)',
          ruler: 'Antarctic Treaty System / International Scientific Stations',
          capital: 'None',
          governmentType: 'Antarctic Treaty System',
          narrative:
            'In **May 1985**, British Antarctic Survey atmospheric scientists **Joe Farman**, **Brian Gardiner**, and **Jonathan Shanklin** published their landmark paper in *Nature* documenting severe springtime depletion of stratospheric ozone (**the Antarctic Ozone Hole**) measured by spectrophotometers at **Halley** and **Faraday** research stations—a discovery that catalyzed the 1987 **Montreal Protocol** banning chlorofluorocarbons (CFCs).',
          events: [
            'May 16, 1985: Publication in Nature of ground-based measurements from Halley Bay revealing the Antarctic stratospheric ozone hole.'
          ]
        };
      case 1991:
        return {
          headline: 'Signing of the Madrid Protocol Banning Mining & Mineral Extraction in Antarctica (1991 CE)',
          ruler: 'Antarctic Treaty Consultative Parties',
          capital: 'None',
          governmentType: 'Antarctic Treaty System',
          narrative:
            'On **October 4, 1991**, in Madrid, Spain, the Antarctic Treaty nations signed the **Protocol on Environmental Protection to the Antarctic Treaty (the Madrid Protocol)**, designating Antarctica as a *"natural reserve, devoted to peace and science"* and enacting an indefinite ban on all commercial mineral and oil extraction on the continent.',
          events: [
            'October 4, 1991: Signing of the Madrid Protocol establishing comprehensive environmental protection and prohibiting commercial mining in Antarctica.'
          ]
        };
      case 1996:
        return {
          headline: 'Confirmation of Giant Subglacial Lake Vostok Beneath 4,000 Meters of Ice (1996 CE)',
          ruler: 'Antarctic Treaty System',
          capital: 'None',
          governmentType: 'Antarctic Treaty System',
          narrative:
            'In **1996**, a joint team of Russian and British scientists led by **Andrey Kapitsa** and **Gordon Robin** combined satellite radar altimetry (ERS-1) and seismic soundings at Vostok Station to confirm the existence and scale of **Lake Vostok**—a 250-km-long liquid freshwater lake sealed beneath nearly 4,000 meters of the East Antarctic Ice Sheet.',
          events: [
            'June 1996: Publication in Nature confirming the vast dimensions of subglacial Lake Vostok beneath Vostok Station.'
          ]
        };
      case 2012:
        return {
          headline: 'Vostok Ice Core Drilling Reaches Subglacial Lake Vostok at 3,769 Meters Depth (2012 CE)',
          ruler: 'Antarctic Treaty System',
          capital: 'None',
          governmentType: 'Antarctic Treaty System',
          narrative:
            'On **February 5, 2012**, Russian scientists and engineers at **Vostok Station** completed over two decades of deep ice-core drilling through **3,769 meters (12,366 feet)** of the East Antarctic Ice Sheet, breaking through to the surface of subglacial **Lake Vostok**.',
          events: [
            'February 5, 2012: Deep borehole at Vostok Station reaches the water surface of subglacial Lake Vostok 3,769 meters beneath the ice sheet.'
          ]
        };
      case 2022:
        return {
          headline: 'Discovery of Ernest Shackleton’s Shipwreck Endurance in the Weddell Sea (2022 CE)',
          ruler: 'Antarctic Treaty System (Endurance22 Expedition)',
          capital: 'None',
          governmentType: 'Antarctic Treaty System',
          narrative:
            'On **March 5, 2022**—107 years after it was crushed by pack ice and sank in 1915—the **Endurance22** expedition aboard the South African polar research vessel *S.A. Agulhas II* (led by **John Shears** and Director of Exploration **Mensun Bound**) located the remarkably preserved wooden wreck of **Sir Ernest Shackleton’s *Endurance*** using autonomous underwater vehicles at a depth of **3,008 meters (9,869 feet)** in the Weddell Sea.',
          events: [
            'March 5, 2022: Endurance22 subsea robotic survey locates the intact hull and brass "ENDURANCE" stern lettering of Shackleton’s ship at 3,008 m depth in the Weddell Sea.'
          ]
        };
      default:
        return null;
    }
  }

  // 2. INDIGENOUS & PRE-STATE TERRITORIES — Only specific years where credible historical/archaeological records exist
  if (lookupCountry === 'United States of America') {
    switch (year) {
      case 1050:
      case 1100:
      case 1150:
      case 1200:
        return {
          headline: `Urban Peak of Mississippian Cahokia & Monks Mound (${yStr})`,
          ruler: 'Mississippian Paramount Chiefdom of Cahokia',
          capital: 'Cahokia (American Bottom, near modern St. Louis)',
          governmentType: 'Mississippian Chiefdom',
          narrative:
            `Around **${yStr}**, the **Mississippian urban center of Cahokia** near the confluence of the Mississippi, Missouri, and Illinois rivers reached its demographic and architectural zenith, with **Monks Mound** (the largest pre-Columbian earthen structure north of Mexico), solar woodhenges, and an urban population of 15,000–20,000 connected by continent-wide copper and marine shell trade.`,
          events: [
            `Construction and expansion of Monks Mound, the Grand Plaza, and the Woodhenge solar calendar at Cahokia (${yStr}).`
          ]
        };
      case 1142:
      case 1451:
        return {
          headline: `Founding of the Haudenosaunee (Iroquois) Confederacy Under the Great Law of Peace (${yStr})`,
          ruler: 'Haudenosaunee Grand Council (50 Hoyaneh Sachems)',
          capital: 'Onondaga (Central Council Fire)',
          governmentType: 'Indigenous Federal Confederacy (Kaianere’kó:wa)',
          narrative:
            `In **${yStr}** (associated with a total solar eclipse visible across Upstate New York in oral and astronomical tradition), the **Great Peacemaker (Dekanawida)**, **Hiawatha (Ayenwatha)**, and **Jigonhsasee** united the **Mohawk, Oneida, Onondaga, Cayuga, and Seneca** nations under the **Great Law of Peace (*Kaianere’kó:wa*)**, establishing one of the world’s oldest participatory confederacies.`,
          events: [
            `Ratification of the Great Law of Peace at Onondaga Lake uniting the Five Nations of the Haudenosaunee Confederacy (${yStr}).`
          ]
        };
      case 1540:
      case 1541:
        return {
          headline: `Documented Expeditions of Hernando de Soto & Francisco Vázquez de Coronado (${yStr})`,
          ruler: 'Mississippian Chiefdoms (Coosa, Tuskaloosa) & Zuni/Tiguex Pueblo Leaders',
          capital: 'Decentralized Pueblo & Mississippian Towns',
          governmentType: 'Indigenous Chiefdoms & Pueblo Councils',
          narrative:
            `In **${yStr}**, Spanish chronicles recorded two major inland expeditions across North America: **Hernando de Soto’s** march through the Mississippian chiefdoms of the Southeast (fighting the Battle of Mabila with Chief **Tuskaloosa** in Oct 1540 and crossing the Mississippi River in May 1541) and **Francisco Vázquez de Coronado’s** expedition through the **Zuni and Rio Grande Pueblos**, the Grand Canyon, and onto the Great Plains to encounter the **Wichita (Quivira)**.`,
          events: [
            year === 1540
              ? 'July–October 1540: Coronado reaches the Zuni Pueblo of Hawikuh and the Grand Canyon; De Soto fights the fierce Battle of Mabila against Chief Tuskaloosa in Alabama.'
              : 'May 1541: Hernando de Soto’s party makes the first documented European crossing of the Mississippi River while Coronado marches across the Great Plains to Quivira (Kansas).'
          ]
        };
      case 1607:
        return {
          headline: 'Powhatan Confederacy (Tsenacommacah) & Founding of Jamestown (1607 CE)',
          ruler: 'Paramount Chief Wahunsenacawh (Powhatan) & English Virginia Company',
          capital: 'Werowocomoco & Jamestown',
          governmentType: 'Algonquian Paramount Chiefdom & Colonial Outpost',
          narrative:
            'In **May 1607**, English colonists established **Jamestown** along the James River within **Tsenacommacah**, the confederacy of over 30 Algonquian-speaking tribes governed by Paramount Chief **Wahunsenacawh (Powhatan)** from his seat at **Werowocomoco**.',
          events: [
            'May 14, 1607: Establishment of Fort James (Jamestown) in Virginia; December 1607 diplomatic encounter between Captain John Smith, Chief Powhatan, and Pocahontas at Werowocomoco.'
          ]
        };
      case 1620:
      case 1621:
        return {
          headline: `Wampanoag Confederacy Diplomacy & Plymouth Treaty with Sachem Massasoit (${yStr})`,
          ruler: 'Wampanoag Great Sachem Ousamequin (Massasoit)',
          capital: 'Pokanoket (Mount Hope) & Patuxet (Plymouth)',
          governmentType: 'Indigenous Confederacy & Colonial Settlement',
          narrative:
            `Following the arrival of the *Mayflower* at **Patuxet (Plymouth)** in late 1620, Wampanoag Great Sachem **Ousamequin (Massasoit)** and Patuxet interpreter **Tisquantum (Squanto)** negotiated a formal **six-article mutual defense and peace treaty** with the Plymouth colonists in **March 1621** that lasted for over fifty years.`,
          events: [
            year === 1620
              ? 'November–December 1620: Arrival of the Mayflower at Cape Cod and Patuxet (Plymouth) in Wampanoag territory.'
              : 'March 22, 1621: Wampanoag Sachem Ousamequin (Massasoit) and Plymouth Governor John Carver sign the historic Wampanoag–Plymouth Peace Treaty.'
          ]
        };
      case 1675:
      case 1676:
        return {
          headline: `King Philip’s War (Metacom’s Rebellion) in New England (${yStr})`,
          ruler: 'Wampanoag Sachem Metacom (King Philip)',
          capital: 'Mount Hope (Montaup)',
          governmentType: 'Indigenous Coalition',
          narrative:
            `In **${yStr}**, Wampanoag Sachem **Metacom (King Philip)** led a pan-indigenous coalition of Wampanoag, Nipmuc, Podunk, and Narragansett warriors in **King Philip’s War (1675–1676)**—the deadliest conflict per capita in North American colonial history—attacking over half of New England’s colonial towns before Metacom’s death at Mount Hope in August 1676.`,
          events: [
            year === 1675
              ? 'June–December 1675: Outbreak of King Philip’s War across Massachusetts, Rhode Island, and Connecticut; Great Swamp Fight in Narragansett territory (Dec 19, 1675).'
              : 'August 12, 1676: Wampanoag Sachem Metacom is killed at Mount Hope, Rhode Island, concluding the main theater of King Philip’s War.'
          ]
        };
      case 1680:
        return {
          headline: 'The Pueblo Revolt of 1680 — Po’pay Expels Spanish Rule from Nuevo México (1680 CE)',
          ruler: 'Tewa Religious Leader Po’pay (Ohkay Owingeh)',
          capital: 'Taos & Santa Fe (Ogapoge)',
          governmentType: 'United Pueblo Confederacy',
          narrative:
            'In **August 1680**, Tewa leader **Po’pay** of **Ohkay Owingeh** coordinated using knotted deerskin cords across more than 24 **Pueblo**, **Hopi**, **Zuni**, and **Apache** communities to launch the **Pueblo Revolt of 1680**, besieging **Santa Fe**, expelling Spanish colonial authorities from New Mexico, and restoring full Pueblo self-governance for twelve years.',
          events: [
            'August 10–21, 1680: Coordinated Pueblo uprising across the Rio Grande valley; siege of Santa Fe forces Spanish Governor Antonio de Otermín to retreat south to El Paso del Norte.'
          ]
        };
      case 1763:
        return {
          headline: 'Pontiac’s War & British Royal Proclamation of 1763 Recognizing Indigenous Lands (1763 CE)',
          ruler: 'Odawa Leader Pontiac & Great Lakes Indigenous Confederacy',
          capital: 'Fort Detroit & Ohio Country',
          governmentType: 'Pan-Indigenous Confederacy',
          narrative:
            'In **May 1763**, following the French defeat in the Seven Years’ War, Odawa war chief **Pontiac** united Odawa, Ojibwe, Potawatomi, Wyandot, Shawnee, Lenape, and Seneca warriors in **Pontiac’s War**, capturing eight British forts across the Great Lakes and besieging Fort Detroit and Fort Pitt. In response, King George III issued the **Royal Proclamation of October 7, 1763**, legally reserving all lands west of the Appalachian Mountains as Indigenous territory.',
          events: [
            'May 1763: Pontiac’s Confederacy launches coordinated attacks on British frontier forts across the Great Lakes and Ohio Country.',
            'October 7, 1763: Issuance of the British Royal Proclamation of 1763 establishing the Proclamation Line along the Appalachians.'
          ]
        };
      case 1804:
      case 1805:
      case 1806:
        return {
          headline: `Lewis & Clark Expedition Across the Great Plains, Rockies & Pacific Northwest (${yStr})`,
          ruler: 'Mandan, Hidatsa, Lakota, Shoshone, Nez Perce & Chinook Leaders',
          capital: 'Mandan Villages (Knife River) / Fort Clatsop',
          governmentType: 'Sovereign Indigenous Nations',
          narrative:
            `During **${yStr}**, the **Lewis and Clark Expedition (Corps of Discovery)**, accompanied by Lemhi Shoshone interpreter **Sacagawea**, traveled across the Missouri and Columbia River basins, recording detailed ethnographic, cartographic, and diplomatic accounts of the **Mandan**, **Hidatsa**, **Lakota**, **Blackfeet**, **Shoshone**, **Nez Perce (Nimiipuu)**, and **Chinook** nations.`,
          events: [
            year === 1804
              ? 'October–Winter 1804: Lewis and Clark establish Fort Mandan in North Dakota alongside the Mandan and Hidatsa earth-lodge villages and meet Sacagawea.'
              : year === 1805
              ? 'August–November 1805: Assisted by Sacagawea’s brother Chief Cameahwait (Shoshone) and the Nez Perce, the expedition crosses the Bitterroot Mountains and reaches the Pacific Ocean.'
              : 'September 23, 1806: Return of the Corps of Discovery to St. Louis after mapping the western interior.'
          ]
        };
      default:
        break;
    }
  }

  if (lookupCountry === 'Canada') {
    switch (year) {
      case 1000:
      case 1001:
        return {
          headline: `Norse Settlement at L’Anse aux Meadows (Vinland) & First Indigenous Encounters (${yStr})`,
          ruler: 'Leif Erikson & Indigenous Beothuk / Algonquian Peoples',
          capital: 'L’Anse aux Meadows (Northern Newfoundland)',
          governmentType: 'Norse Expedition Camp & Indigenous Territory',
          narrative:
            `Around **${yStr}**, Greenland Norse explorer **Leif Erikson** established a timber-framed sod longhouse settlement at **L’Anse aux Meadows** on the northern tip of **Newfoundland (Vinland)**—archaeologically radiocarbon-dated to **1021 CE** and chronicled in the *Saga of the Greenlanders*—marking the first documented European presence in North America and first encounters with Indigenous peoples.`,
          events: [
            `Norse exploration of Helluland (Baffin Island), Markland (Labrador), and Vinland (L’Anse aux Meadows, Newfoundland) around ${yStr}.`
          ]
        };
      case 1534:
      case 1535:
        return {
          headline: `Jacques Cartier’s Voyages to St. Lawrence Iroquoian Towns of Stadacona & Hochelaga (${yStr})`,
          ruler: 'St. Lawrence Iroquoian Chief Donnacona & Jacques Cartier',
          capital: 'Stadacona (Quebec) & Hochelaga (Montreal)',
          governmentType: 'St. Lawrence Iroquoian Chiefdoms',
          narrative:
            `In **${yStr}**, French navigator **Jacques Cartier** sailed into the Gulf of St. Lawrence and up the St. Lawrence River, recording the St. Lawrence Iroquoian word ***kanata*** ("village/settlement", origin of the name **Canada**) and visiting Chief **Donnacona** at **Stadacona** (modern Quebec City) and the fortified town of **Hochelaga** at Mount Royal (modern Montreal).`,
          events: [
            year === 1534
              ? 'July 1534: Jacques Cartier encounters Mi’kmaq and St. Lawrence Iroquoian Chief Donnacona at Gaspé Bay.'
              : 'October 2, 1535: Cartier visits the fortified palisaded Iroquoian town of Hochelaga at the foot of Mount Royal.'
          ]
        };
      case 1701:
        return {
          headline: 'The Great Peace of Montreal (1701) Signed by 39 First Nations & New France (1701 CE)',
          ruler: 'Kondiaronk (Wendat Chief), Haudenosaunee Envoy & Gov. Hector de Callière',
          capital: 'Montreal (Tiohtià:ke)',
          governmentType: 'Indigenous Diplomatic Treaty Council',
          narrative:
            'On **August 4, 1701**, following negotiations led by the celebrated Wendat (Huron) statesman **Kondiaronk**, representatives of **39 Indigenous First Nations** (including the Haudenosaunee Confederacy, Wendat, Algonquin, Odawa, Ojibwe, and Miami) and New France signed the **Great Peace of Montreal**, ending decades of the Beaver Wars across the Great Lakes and St. Lawrence basin.',
          events: [
            'August 4, 1701: 1,300 Indigenous delegates from 39 First Nations affix their clan pictographs to the Great Peace of Montreal treaty.'
          ]
        };
      default:
        break;
    }
  }

  if (lookupCountry === 'Australia') {
    switch (year) {
      case 1606:
        return {
          headline: 'Willem Janszoon’s Duyfken Makes First Documented European Landfall in Australia (1606 CE)',
          ruler: 'Wik Aboriginal Nation (Cape York) & Dutch VOC Navigator Willem Janszoon',
          capital: 'None (Autonomous Aboriginal Country)',
          governmentType: 'Sovereign Aboriginal Clan Governance',
          narrative:
            'In **February–March 1606**, Dutch navigator **Willem Janszoon** commanding the VOC jacht ***Duyfken*** charted 320 km of the western coast of **Cape York Peninsula** in Queensland and made the **first documented European landfall on the Australian continent** at the Pennefather River, encountering the indigenous **Wik** people.',
          events: [
            'February 26, 1606: Crew of the Dutch ship Duyfken under Willem Janszoon lands at the Pennefather River on western Cape York Peninsula.'
          ]
        };
      case 1642:
        return {
          headline: 'Abel Tasman Charts Van Diemen’s Land (Tasmania) (1642 CE)',
          ruler: 'Palawa (Tasmanian Aboriginal) Nations & Dutch Explorer Abel Tasman',
          capital: 'None (Autonomous Aboriginal Country)',
          governmentType: 'Sovereign Aboriginal Clan Governance',
          narrative:
            'On **November 24, 1642**, Dutch explorer **Abel Janszoon Tasman** (*Heemskerck* and *Zeehaen*) sighted the west coast of **Lutruwita (Tasmania)**, naming it Van Diemen’s Land and noting smoke and notched trees made by the indigenous **Palawa** people before sailing east to New Zealand.',
          events: [
            'November 24 – December 3, 1642: Abel Tasman charts the southern and eastern coast of Tasmania (Blackman Bay).'
          ]
        };
      case 1770:
        return {
          headline: 'James Cook’s HMS Endeavour Charts Eastern Australia & Lands at Botany Bay (1770 CE)',
          ruler: 'Gweagal (Dharawal) & Guugu Yimithirr Peoples / Lt. James Cook',
          capital: 'None (Autonomous Aboriginal Country)',
          governmentType: 'Sovereign Aboriginal Nations',
          narrative:
            'On **April 29, 1770**, British Royal Navy Lieutenant **James Cook** and botanist **Joseph Banks** aboard ***HMS Endeavour*** made landfall at **Kamay (Botany Bay)**, where two **Gweagal** warriors of the Dharawal nation opposed their landing. Later in **June–August 1770**, while repairing *Endeavour* at **Waalumbaal Birri (Endeavour River)** in Queensland, Cook’s crew interacted for seven weeks with the **Guugu Yimithirr** people and recorded the word *"gangurru"* (**kangaroo**).',
          events: [
            'April 29, 1770: HMS Endeavour lands at Kamay (Botany Bay), encountering the Gweagal clan of the Dharawal nation.',
            'June–August 1770: Seven-week repair stay at Endeavour River (Cooktown) on Guugu Yimithirr country.'
          ]
        };
      case 1788:
        return {
          headline: 'Arrival of the British First Fleet at Warrane (Sydney Cove) on Gadigal Country (1788 CE)',
          ruler: 'Eora Nation (Gadigal Clan, Bennelong & Pemulwuy) / Gov. Arthur Phillip',
          capital: 'Sydney Cove (Warrane)',
          governmentType: 'Aboriginal Nations & British Penal Colony of New South Wales',
          narrative:
            'On **January 18–26, 1788**, the eleven ships of the British **First Fleet** commanded by Captain **Arthur Phillip** arrived at Botany Bay and relocated to **Warrane (Sydney Cove)** in Port Jackson on the ancestral country of the **Gadigal** clan of the **Eora Nation**, establishing the British colony of New South Wales.',
          events: [
            'January 26, 1788: Arthur Phillip raises the British flag at Sydney Cove (Warrane) on Gadigal land, initiating British colonization of Australia.'
          ]
        };
      default:
        break;
    }
  }

  if (lookupCountry === 'New Zealand') {
    switch (year) {
      case 1300:
        return {
          headline: 'Polynesian Waka Settlement & Establishment of Māori Iwi Across Aotearoa (c. 1300 CE)',
          ruler: 'Founding Polynesian Navigators & Māori Rangatira',
          capital: 'Decentralized Iwi Pā Settlements',
          governmentType: 'Māori Iwi & Hapū Chieftaincies',
          narrative:
            'Around **1280–1300 CE**, East Polynesian ocean navigators sailing double-hulled voyaging canoes (*waka hourua*) settled **Aotearoa (New Zealand)**, establishing permanent **Māori** settlements, cultivating *kūmara* (sweet potato), and hunting the giant flightless **moa**.',
          events: [
            'c. 1300 CE: Archaeological horizon of early Māori settlement sites (such as Wairau Bar) across North and South Islands.'
          ]
        };
      case 1642:
        return {
          headline: 'First Documented Encounter Between Māori (Ngāti Tūmatakōkiri) & Abel Tasman (1642 CE)',
          ruler: 'Ngāti Tūmatakōkiri Rangatira & Dutch Explorer Abel Tasman',
          capital: 'Mohua (Golden Bay)',
          governmentType: 'Sovereign Māori Iwi',
          narrative:
            'On **December 13–19, 1642**, Dutch navigator **Abel Tasman** became the first European to sight **New Zealand (Aotearoa)** and anchored at **Mohua (Golden Bay)** at the northern tip of the South Island, where warriors of **Ngāti Tūmatakōkiri** in double-hulled *waka* clashed with a cockboat between Tasman’s ships.',
          events: [
            'December 18–19, 1642: Maritime clash at Golden Bay between Ngāti Tūmatakōkiri Māori waka crews and Abel Tasman’s expedition.'
          ]
        };
      case 1769:
        return {
          headline: 'James Cook & Tahitian Navigator Tupaia Circumnavigate Aotearoa (1769 CE)',
          ruler: 'Sovereign Māori Iwi Rangatira',
          capital: 'Decentralized Fortified Pā',
          governmentType: 'Sovereign Māori Iwi',
          narrative:
            'Beginning in **October 1769**, **James Cook** aboard *HMS Endeavour* circumnavigated and mapped New Zealand’s North and South Islands. Crucially, the Ra’iatean (Tahitian) high priest and master navigator **Tupaia** aboard *Endeavour* was able to converse directly with **Māori** leaders in their shared Eastern Polynesian language, enabling diplomatic and cultural exchanges across Tolaga Bay, Mercury Bay, and Queen Charlotte Sound.',
          events: [
            'October 1769 – March 1770: Tupaia and James Cook conduct the first complete charting of New Zealand’s coastline and engage in direct Polynesian linguistic exchange with Māori iwi.'
          ]
        };
      case 1835:
        return {
          headline: 'He Whakaputanga — Declaration of the Independence of New Zealand by Māori Chiefs (1835 CE)',
          ruler: 'Te Wakaminenga o Nga Hapu o Nu Tireni (United Tribes of New Zealand)',
          capital: 'Waitangi (Bay of Islands)',
          governmentType: 'Confederation of Sovereign Māori Rangatira',
          narrative:
            'On **October 28, 1835**, at Waitangi, 34 northern Māori *rangatira* (later joined by 18 more chiefs, including **Te Wherowhero** and **Te Hāpuku**) signed ***He Whakaputanga o te Rangatiratanga o Nu Tireni*** (**Declaration of the Independence of New Zealand**), proclaiming New Zealand an independent sovereign Māori state under the **United Tribes of New Zealand** and recognized by the British Crown in 1836.',
          events: [
            'October 28, 1835: Signing of He Whakaputanga at Waitangi by northern Māori rangatira alongside British Resident James Busby.'
          ]
        };
      default:
        break;
    }
  }

  if (lookupCountry === 'Brazil') {
    switch (year) {
      case 1500:
        return {
          headline: 'Arrival of Pedro Álvares Cabral’s Fleet & Encounter with the Tupiniquim (1500 CE)',
          ruler: 'Indigenous Tupiniquim Caciques & Portuguese Commander Pedro Álvares Cabral',
          capital: 'Porto Seguro (Bahia)',
          governmentType: 'Indigenous Tupi-Guarani Villages & Portuguese Claim',
          narrative:
            'On **April 22, 1500**, the Portuguese fleet commanded by **Pedro Álvares Cabral** sighted Monte Pascoal and anchored at **Porto Seguro** in Bahia. Fleet scribe **Pero Vaz de Caminha** wrote his famous chronicle to King Manuel I describing the first peaceful meetings and barter with the indigenous **Tupiniquim** people.',
          events: [
            'April 22 – May 2, 1500: Cabral’s fleet lands at Porto Seguro, Bahia; Pero Vaz de Caminha records the earliest written ethnographic account of Brazil’s indigenous Tupi peoples.'
          ]
        };
      case 1541:
      case 1542:
        return {
          headline: `Francisco de Orellana’s First Navigation of the Amazon River & Omagua Chiefdoms (${yStr})`,
          ruler: 'Indigenous Omagua (Cambeba) & Tapajós Riverine Polities',
          capital: 'Amazon River Basin Settlements',
          governmentType: 'Indigenous Amazonian Chiefdoms',
          narrative:
            `In **1541–1542**, **Francisco de Orellana** and Dominican chronicler **Gaspar de Carvajal** completed the first documented navigation of the entire length of the **Amazon River** from the Andes to the Atlantic Ocean, recording large, densely populated indigenous **Omagua (Cambeba)** and **Tapajós** riverine towns, raised causeways, and polychrome ceramic cultures along the riverbanks.`,
          events: [
            `Gaspar de Carvajal chronicles dense indigenous riverine polities and female warriors along the Amazon River (${yStr}).`
          ]
        };
      default:
        break;
    }
  }

  if (lookupCountry === 'Argentina' || lookupCountry === 'Chile') {
    switch (year) {
      case 1520:
        return {
          headline: 'Magellan’s Expedition Overwinters in Patagonia & Encounters the Tehuelche (1520 CE)',
          ruler: 'Indigenous Tehuelche (Aónikenk) Caciques & Ferdinand Magellan',
          capital: 'Puerto San Julián (Patagonia)',
          governmentType: 'Autonomous Tehuelche Bands',
          narrative:
            'From **March to August 1520**, **Ferdinand Magellan’s** Spanish armada overwintered at **Puerto San Julián** on the Patagonian coast, where chronicler **Antonio Pigafetta** recorded the first documented encounter with the tall, guanaco-cloak-wearing indigenous **Tehuelche (Aónikenk)** people, whom Magellan called *Patagones*—giving **Patagonia** its name—before discovering the **Strait of Magellan** in October–November 1520.',
          events: [
            'May–July 1520: First documented meetings between Magellan’s crew and the indigenous Tehuelche people at Puerto San Julián.',
            'October 21 – November 28, 1520: Magellan navigates the Strait of Magellan between mainland Patagonia and Tierra del Fuego.'
          ]
        };
      case 1553:
        return {
          headline: 'Battle of Tucapel — Mapuche Toqui Lautaro Defeats Pedro de Valdivia (1553 CE)',
          ruler: 'Mapuche Toquis Lautaro (Leftraru) & Caupolicán',
          capital: 'Wallmapu (Araucanía)',
          governmentType: 'Sovereign Mapuche Confederacy',
          narrative:
            'On **December 25, 1553**, during the **Arauco War**, the young Mapuche military strategist (*Toqui*) **Lautaro (Leftraru)** and **Caupolicán** employed disciplined tactical squadrons and terrain mastery to defeat and capture Spanish conquistador **Pedro de Valdivia** at the **Battle of Tucapel**, preserving Mapuche independence south of the Biobío River.',
          events: [
            'December 25, 1553: Mapuche forces under Lautaro win a decisive victory at the Battle of Tucapel in Wallmapu.'
          ]
        };
      case 1598:
        return {
          headline: 'Battle of Curalaba — Mapuche Uprising Restores Full Sovereignty South of the Biobío (1598 CE)',
          ruler: 'Mapuche Toqui Pelantaro',
          capital: 'Wallmapu (South of the Biobío River)',
          governmentType: 'Sovereign Mapuche Confederacy',
          narrative:
            'On **December 23, 1598**, Mapuche *Toqui* **Pelantaro** ambushed and defeated Spanish Governor Martín García Óñez de Loyola at the **Battle of Curalaba**, triggering a general uprising that destroyed all seven Spanish settlements south of the **Biobío River** and established an independent Mapuche frontier later recognized by Spain in the **1641 Treaty of Quilín**.',
          events: [
            'December 23, 1598: Mapuche victory at Curalaba expels Spanish colonial rule south of the Biobío River for nearly three centuries.'
          ]
        };
      default:
        break;
    }
  }

  if (lookupCountry === 'South Africa') {
    switch (year) {
      case 1488:
        return {
          headline: 'Bartolomeu Dias Rounds the Cape of Good Hope & Lands at Mossel Bay (1488 CE)',
          ruler: 'Indigenous Khoikhoi Pastoralist Clans',
          capital: 'None (Autonomous Khoisan Territory)',
          governmentType: 'Khoikhoi Pastoralist Chieftaincies',
          narrative:
            'In **February 1488**, Portuguese navigator **Bartolomeu Dias** rounded the southern tip of Africa and made the **first documented European landfall in Southern Africa** at **Mossel Bay** (*Aguada de São Brás*), where his crew encountered indigenous **Khoikhoi** cattle-herders.',
          events: [
            'February 3, 1488: Bartolomeu Dias lands at Mossel Bay and records the first European encounter with Khoikhoi pastoralists.'
          ]
        };
      case 1510:
        return {
          headline: 'Battle of Salt River — Khoikhoi Warriors Defeat Portuguese Viceroy Almeida (1510 CE)',
          ruler: 'Gorachoqua Khoikhoi Clan',
          capital: 'Table Bay (Camissa)',
          governmentType: 'Khoikhoi Chieftaincy',
          narrative:
            'On **March 1, 1510**, at **Table Bay** (*Camissa*), indigenous **Khoikhoi** warriors using trained war oxen and spears decisively defeated a raiding party led by the first Viceroy of Portuguese India, **Dom Francisco de Almeida**, killing Almeida and 64 of his men and deterring permanent European settlement at the Cape for over 140 years.',
          events: [
            'March 1, 1510: Khoikhoi victory at the Battle of Salt River on the shores of Table Bay.'
          ]
        };
      case 1818:
      case 1819:
        return {
          headline: `Rise of the Zulu Kingdom Under King Shaka & Battle of Gqokli Hill (${yStr})`,
          ruler: 'King Shaka kaSenzangakhona (Zulu Kingdom) & King Nxele (Xhosa)',
          capital: 'kwaBulawayo (Zululand)',
          governmentType: 'Centralized Zulu Military Monarchy',
          narrative:
            `In **${yStr}**, **King Shaka kaSenzangakhona** consolidated the **Zulu Kingdom** in KwaZulu-Natal, introducing the short stabbing spear (*iklwa*), enveloping "buffalo horns" (*impondo zankomo*) tactical formation, and age-grade regiments (*amabutho*), defeating the rival Ndwandwe under Zwide at the **Battle of Gqokli Hill (1818)** and the **Mhlatuze River (1819)**.`,
          events: [
            year === 1818
              ? '1818: King Shaka defeats the Ndwandwe army of King Zwide at the Battle of Gqokli Hill.'
              : '1819: Decisive Zulu victory at the Battle of the Mhlatuze River; Xhosa prophet Makhanda (Nxele) leads the attack on Grahamstown during the Fifth Xhosa War.'
          ]
        };
      case 1879:
        return {
          headline: 'Anglo-Zulu War & Zulu Victory at the Battle of Isandlwana (January 22, 1879)',
          ruler: 'King Cetshwayo kaMpande (Zulu Kingdom)',
          capital: 'Ulundi (oNdini)',
          governmentType: 'Sovereign Zulu Kingdom',
          narrative:
            'On **January 22, 1879**, during the **Anglo-Zulu War**, a 20,000-strong **Zulu army (*impi*)** commanded by **Ntshingwayo kaMahole** and **Mavumengwana kaNdlela** under **King Cetshwayo** outmaneuvered and annihilated the British center column at the **Battle of Isandlwana**—inflicting the heaviest defeat ever suffered by a modern British army at the hands of an indigenous force—followed that evening by the Battle of Rorke’s Drift and the July 1879 Battle of Ulundi.',
          events: [
            'January 22, 1879: Decisive Zulu triumph over British forces under Lord Chelmsford and Col. Anthony Durnford at the Battle of Isandlwana.',
            'January 22–23, 1879: Defense of Rorke’s Drift; July 4, 1879 Battle of Ulundi.'
          ]
        };
      default:
        break;
    }
  }

  if (lookupCountry === 'Russia') {
    if (year === 1581 || year === 1582) {
      return {
        headline: `Yermak’s Expedition & Battle of Chuvash Cape Against the Khanate of Sibir (${yStr})`,
        ruler: 'Khan Kuchum (Khanate of Sibir) & Cossack Ataman Yermak Timofeyevich',
        capital: 'Qashliq (Isker, on the Irtysh River)',
        governmentType: 'Siberian Tatar Khanate & Indigenous Khanty/Mansi Principalities',
        narrative:
          `In **${yStr}**, Cossack Ataman **Yermak Timofeyevich** crossed the Ural Mountains along the Chusovaya, Tagil, and Tura rivers into **Siberia**, defeating **Khan Kuchum** of the **Khanate of Sibir** at the **Battle of Chuvash Cape (October 1582)** and capturing the Siberian capital of **Qashliq (Isker)** on the Irtysh River.`,
        events: [
          'October 23–26, 1582: Battle of Chuvash Cape and capture of Qashliq (Isker) on the Irtysh River.'
        ]
      };
    }
  }

  if (lookupCountry === 'Bahamas' && year === 1492) {
    return {
      headline: 'Christopher Columbus Makes Landfall at Guanahani & Encounters the Lucayan Taíno (1492 CE)',
      ruler: 'Lucayan (Taíno) Caciques',
      capital: 'Guanahani (San Salvador)',
      governmentType: 'Indigenous Taíno Chiefdoms (Cacicazgos)',
      narrative:
        'On **October 12, 1492**, **Christopher Columbus** and the crews of the *Santa María*, *Pinta*, and *Niña* made landfall on the island of **Guanahani** (San Salvador in the Bahamas), where they were met by the indigenous **Lucayan (Taíno)** people—initiating the first sustained contact between the Old World and the Americas (the Columbian Exchange).',
      events: [
        'October 12, 1492: First documented landfall of Columbus’s expedition at Guanahani in the Lucayan Archipelago (Bahamas).'
      ]
    };
  }

  // 3. Check if an exact-year entry in HISTORICAL_SEARCH_INDEX matches this country and exact year
  const exactIndexMatches = HISTORICAL_SEARCH_INDEX.filter(
    (item) =>
      item.modernCountry.toLowerCase() === lookupCountry.toLowerCase() &&
      item.category !== 'country' &&
      item.year === year
  );
  if (exactIndexMatches.length > 0) {
    const primary = exactIndexMatches[0];
    return {
      headline: `${primary.title} (${primary.yearDisplay})`,
      narrative: exactIndexMatches.map((m) => `**${m.title} (${m.yearDisplay})**: ${m.summary}`).join('\n\n'),
      events: exactIndexMatches.map((m) => `${m.title} (${m.yearDisplay}): ${m.summary}`)
    };
  }

  return null;
}

/**
 * Generates a comprehensive, two-part historical dossier for ANY Country or Empire in ANY Year (-3000 to 2026):
 * 1. General Information about the place/empire
 * 2. Full Detail of What Happened in that place in that Specific Year (or honest notice when no credible record exists for Indigenous lands / Antarctica)
 */
export function generatePlaceYearDossier(
  region: MapRegion,
  year: number
): ComprehensivePlaceDossier {
  const yearDisplay = year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
  const lookupCountry = region.modernCountry
    ? region.modernCountry.replace(/.*\((.*)\)/, '$1').trim()
    : region.name;

  const eraProfile = getCountryEraData(lookupCountry, year);
  const modernProfile = getCountryProfile(lookupCountry) || getCountryProfile(region.name);
  const physicalProfile = getCountryPhysicalProfile(lookupCountry);
  const globalEra = getGeopoliticalEra(year);
  const activeTradeRoutes = getTradeRoutesForYear(year);

  const entityName = region.name || eraProfile.entityName;

  // Determine whether this territory in `year` is an Indigenous / Uncolonized Pre-State Area or Antarctica
  const isIndigenousArea =
    Boolean(region.isOpenSpace) ||
    eraProfile.isOpenSpace ||
    region.id.startsWith('open_space') ||
    entityName.toLowerCase().includes('indigenous') ||
    entityName.toLowerCase().includes('uncolonized') ||
    entityName.toLowerCase().includes('aboriginal');
  const isAntarctica = lookupCountry === 'Antarctica' || entityName === 'Antarctica';
  const isIndigenousOrAntarctica = isIndigenousArea || isAntarctica;

  // Check if we have a rich curated year chronicle
  let specificRecord: SpecificYearRecord | null = null;
  if (isIndigenousOrAntarctica) {
    specificRecord = getCredibleIndigenousOrAntarcticRecord(lookupCountry, year);
  } else if (lookupCountry === 'Pakistan' || region.name.includes('Pakistan')) {
    specificRecord = getPakistanYearChronicle(year, eraProfile);
  } else if (
    lookupCountry === 'Romania' ||
    region.name.toLowerCase().includes('wallachia') ||
    region.name.toLowerCase().includes('romania')
  ) {
    specificRecord = getRomaniaWallachiaYearChronicle(year, eraProfile);
  } else if (
    EXACT_COUNTRY_YEAR_RECORDS[lookupCountry] &&
    EXACT_COUNTRY_YEAR_RECORDS[lookupCountry][year]
  ) {
    specificRecord = EXACT_COUNTRY_YEAR_RECORDS[lookupCountry][year];
  }

  // Find any conflicts active in or near this country during `year`
  const activeWarsInYear = CONFLICT_ZONES.filter(
    (c) =>
      year >= c.startYear &&
      year <= c.endYear &&
      (c.name.toLowerCase().includes(lookupCountry.toLowerCase()) ||
        c.region.toLowerCase().includes(lookupCountry.toLowerCase()) ||
        c.combatantsOrClaimants.some(
          (party) =>
            party.toLowerCase().includes(lookupCountry.toLowerCase()) ||
            party.toLowerCase().includes(eraProfile.entityName.toLowerCase().split(' ')[0])
        ))
  );

  // Find historical search index events/figures associated with this country around this era
  const relatedIndexItems = HISTORICAL_SEARCH_INDEX.filter(
    (item) =>
      item.modernCountry.toLowerCase() === lookupCountry.toLowerCase() &&
      item.category !== 'country' &&
      Math.abs(item.year - year) <= 150
  );

  // For Indigenous Areas and Antarctica, only claim a year-specific record when a credible documented record actually exists
  const hasCredibleYearRecord = isIndigenousOrAntarctica ? Boolean(specificRecord) : true;

  const rulerInYear =
    specificRecord?.ruler ||
    (isIndigenousOrAntarctica && !hasCredibleYearRecord
      ? isAntarctica
        ? year >= 1959
          ? 'Antarctic Treaty System (International Preserve)'
          : 'Uninhabited Polar Continent'
        : 'Not Enough Recorded Information for Specific Year'
      : region.ruler || eraProfile.ruler || 'Sovereign Leadership');

  const capitalInYear =
    specificRecord?.capital ||
    (isIndigenousOrAntarctica ? 'None' : region.capital || eraProfile.capital || 'National Capital');

  const populationInYear =
    isIndigenousOrAntarctica && !hasCredibleYearRecord
      ? isAntarctica
        ? year >= 1959
          ? '1,000 – 5,000 (Seasonal Research Personnel)'
          : 'Uninhabited'
        : 'No Verified Census Record'
      : region.populationEstimate || eraProfile.populationEstimate || 'Historical Population';

  const governmentTypeInYear =
    specificRecord?.governmentType ||
    (isAntarctica
      ? year >= 1959
        ? 'Antarctic Treaty System (Demilitarized Scientific Preserve)'
        : 'Uninhabited Polar Continent'
      : isIndigenousArea
      ? 'Decentralized Indigenous / Pre-State Territory'
      : year >= 1945 && modernProfile
      ? modernProfile.governmentType
      : 'Sovereign State / Imperial Administration');

  // --- PART 1: GENERAL INFORMATION ABOUT THE PLACE / EMPIRE ---
  const generalOverview = isAntarctica
    ? `**Antarctica** is Earth’s southernmost continent, encompassing approximately 14.2 million square kilometers around the Geographic South Pole. Covered by the **Antarctic Ice Sheet** (averaging 1.9 km in thickness and holding ~70% of the world’s fresh water), Antarctica had no indigenous human population in antiquity or the medieval era. Sighted for the first time by maritime expeditions in **1820 CE** and explored during the Heroic Age of Antarctic Exploration (1895–1922), it is governed today under the **1959 Antarctic Treaty System** as a demilitarized international scientific preserve.`
    : isIndigenousArea
    ? `**${entityName}** (modern geographic region: **${lookupCountry}**) represents an indigenous or pre-state territory outside centralized imperial borders during this era. Because indigenous communities in this period relied primarily on oral traditions and archaeological material culture rather than dated written state chronicles, year-by-year political records are generally unavailable except when specific documented historical encounters or dated archaeological milestones occurred.`
    : lookupCountry === 'Pakistan'
    ? `**Pakistan** (officially the **Islamic Republic of Pakistan** since 1956) occupies a pivotal geopolitical crossroads in South Asia, connecting the Middle East, Central Asia, China, and the Indian subcontinent along the Arabian Sea. Home to over 240 million people, its territory encompasses the fertile Indus River plains of Punjab and Sindh, the rugged Karakoram, Hindu Kush, and Himalayan mountain ranges in the north (including K2), and the strategic Balochistan plateau and Makran coast in the southwest. Across five millennia, this land has been the cradle of the **Indus Valley Civilization** (Mohenjo-daro and Harappa, c. 3300–1300 BCE), the Buddhist heartland of **Gandhara** and **Taxila**, a core province of the **Ghaznavid**, **Delhi Sultanate**, **Mughal**, and **Sikh** empires, and—following the **Pakistan Movement** led by **Quaid-e-Azam Muhammad Ali Jinnah**—achieved independence on **August 14, 1947** as a sovereign homeland for the Muslims of South Asia.`
    : lookupCountry === 'Romania'
    ? `**${entityName}** (historic principalities of **Wallachia / Țara Românească**, **Moldavia**, and **Transylvania**; modern-day **Romania**) occupies the Carpathian-Danubian-Pontic basin of Southeastern Europe. In antiquity it was the heartland of the **Kingdom of Dacia** under King Decebalus before becoming the Roman province of **Dacia Traiana** (106 CE). In the Middle Ages, the sovereign Christian Voivodeship of **Wallachia** (founded 1330 by Basarab I between the Southern Carpathians and the Danube, with capitals at Curtea de Argeș, Târgoviște, and Bucharest) and **Moldavia** (founded 1359) stood as fortified bulwarks of Europe under celebrated rulers including **Mircea the Elder**, **Vlad III the Impaler (Vlad Țepeș / Dracula)**, **Stephen the Great**, and **Michael the Brave** (who first united Wallachia, Transylvania, and Moldavia in 1600). In 1859 Wallachia and Moldavia united under Alexandru Ioan Cuza to form modern **Romania**, achieving the Great Union with Transylvania in 1918. ${region.description || ''}`
    : modernProfile
    ? `**${entityName}** (modern geographic territory: **${lookupCountry}**) is a major sovereign territory with deep civilizational and geopolitical roots. ${region.description && region.description !== modernProfile.recentHistory ? `${region.description} ` : ''}${modernProfile.recentHistory}`
    : `**${entityName}** occupies the geographic basin of modern-day **${lookupCountry}**. Across world history, its strategic position, river valleys, mountain passes, and maritime approaches have shaped regional empires, trade corridors, and sovereign state formation. ${region.description || eraProfile.description}`;

  const ancientEra = getCountryEraData(lookupCountry, -500);
  const medievalEra = getCountryEraData(lookupCountry, 1200);
  const earlyModernEra = getCountryEraData(lookupCountry, 1700);
  const modernEra = getCountryEraData(lookupCountry, 2026);

  const civilizationalTimeline = isAntarctica
    ? [
        '• Prior to 1820 CE: Uncharted and uninhabited southern polar continent',
        '• 1820 – 1922 CE: First confirmed sightings (1820) & Heroic Age of Antarctic Exploration (South Pole reached Dec 14, 1911)',
        '• 1957 – 1959 CE: International Geophysical Year (IGY) & signing of the Antarctic Treaty (Dec 1, 1959)',
        '• 1961 – 2026 CE: International scientific preserve under the Antarctic Treaty System & Madrid Protocol (1991)'
      ].join('\n')
    : [
        `• Antiquity (c. 500 BCE): ${ancientEra.entityName} (${ancientEra.capital})`,
        `• Medieval Era (c. 1200 CE): ${medievalEra.entityName} (${medievalEra.capital})`,
        `• Early Modern Era (c. 1700 CE): ${earlyModernEra.entityName} (${earlyModernEra.capital})`,
        `• Contemporary Era (2026 CE): ${modernEra.entityName} (${modernEra.capital})`
      ].join('\n');

  const geographyAndStrategicLocation = `${physicalProfile.biomeName} (${physicalProfile.elevationSummary}). Situated in ${lookupCountry}, its terrain, climate, and natural geography shaped regional habitation and movement.`;

  const economyTradeAndResources = isAntarctica
    ? 'No commercial resource extraction (prohibited under the 1991 Madrid Protocol); human activity is dedicated to glaciology, climate core drilling, astronomy, and marine biology.'
    : isIndigenousArea
    ? 'Traditional indigenous economies based on regional ecology, seasonal stewardship, hunting, fishing, pastoralism, or localized agriculture and inter-tribal trade networks.'
    : year >= 1950 && modernProfile
    ? `${modernProfile.economicOverview} Historically integrated into regional and global trade corridors, the territory’s economic power rests on its demographic scale, strategic transit routes, agricultural basins, and industrial infrastructure.`
    : `During the era of ${entityName}, state wealth was anchored in agrarian taxation, artisanal manufacturing, metallurgy, and customs duties along major commercial arteries${
        activeTradeRoutes.length > 0
          ? ` including the ${activeTradeRoutes
              .slice(0, 2)
              .map((r) => r.name)
              .join(' and ')}`
          : ''
      }.`;

  const militaryAndDefenseTradition =
    year >= 1945 && !isAntarctica
      ? `Maintains professional national armed forces, border defense commands, and strategic deterrence doctrines tailored to regional security dynamics and international alliances.`
      : `Forces of ${entityName} relied on fortified citadel networks around ${capitalInYear}, provincial levies, cavalry/infantry formations, and strategic control of mountain passes and river crossings.`;

  const cultureSocietyAndHeritage = `Centered around historic urban and administrative hubs such as ${capitalInYear}, the society of ${entityName} developed enduring legal, architectural, linguistic, and scholarly traditions that linked ${lookupCountry} with neighboring cultural spheres.`;

  // --- PART 2: FULL DETAIL OF WHAT HAPPENED IN THIS SPECIFIC YEAR ---
  if (isIndigenousOrAntarctica && !hasCredibleYearRecord) {
    const noInfoHeadline = isAntarctica
      ? `Not Enough Credible Information for Antarctica in ${yearDisplay}`
      : `Not Enough Information to Show for ${yearDisplay}`;

    const noInfoNarrative = isAntarctica
      ? `There is **not enough credible historical information** to show for **Antarctica** in the specific year **${yearDisplay}**. Because Antarctica had no indigenous population and no verified expedition, discovery, or treaty event is recorded for this exact year, year-specific details are not displayed.\n\n*(Tip: Credible historical records for Antarctica are shown in documented milestone years such as **1773**, **1820**, **1821**, **1840**, **1841**, **1895**, **1898–1899**, **1902–1903**, **1908–1909**, **1911**, **1912**, **1914–1916**, **1928–1929**, **1946–1947**, **1957–1959**, **1961**, **1985**, **1991**, **1996**, **2012**, and **2022**).*`
      : `There is **not enough credible historical information** to show for **${entityName}** (${lookupCountry}) in the specific year **${yearDisplay}**. Because this territory was an indigenous / pre-state land without dated written chronicles for ${yearDisplay}, no fabricated year-specific events are shown.\n\n*(If you select a year in which a documented historical encounter, treaty, or dated archaeological milestone occurred in this region, that verified record will be displayed here).*`;

    return {
      entityName,
      modernCountry: lookupCountry,
      year,
      yearDisplay,
      epochName: `${globalEra.epochName} (${globalEra.timeRange})`,
      color: region.color || eraProfile.color,
      rulerInYear,
      capitalInYear,
      populationInYear,
      governmentTypeInYear,
      generalOverview,
      civilizationalTimeline,
      geographyAndStrategicLocation,
      economyTradeAndResources,
      militaryAndDefenseTradition,
      cultureSocietyAndHeritage,
      disputedTerritories: [],
      hasCredibleYearRecord: false,
      isIndigenousOrAntarctica: true,
      yearHeadline: noInfoHeadline,
      yearDetailedNarrative: noInfoNarrative,
      yearMajorEvents: [],
      yearPoliticalAndDiplomaticState: '',
      yearEconomicAndSocialDevelopments: '',
      yearActiveConflictsAndSecurity: [],
      sources: []
    };
  }

  const yearHeadline =
    specificRecord?.headline ||
    `What Happened in ${entityName} (${lookupCountry}) in ${yearDisplay}`;

  const yearDetailedNarrative =
    specificRecord?.narrative ||
    [
      `In the exact year **${yearDisplay}**, the territory of **${lookupCountry}** operated as **${entityName}**, governed from **${capitalInYear}** under **${rulerInYear}** (Estimated Population: ${populationInYear}). ${region.description || eraProfile.description}`,
      activeWarsInYear.length > 0
        ? `Geopolitically, **${yearDisplay}** was marked by active military and territorial tension involving **${activeWarsInYear
            .map((w) => w.name)
            .join(', ')}**, directly shaping state mobilization, treasury expenditures, and border security.`
        : `Within the broader **${globalEra.epochName} (${globalEra.timeRange})**, ${entityName} focused on consolidating sovereignty, managing diplomatic relations with neighboring powers, and administering domestic governance and trade across its provinces.`,
      relatedIndexItems.length > 0
        ? `Key historical figures and focal centers active in this era include **${relatedIndexItems
            .map((i) => `${i.title} (${i.yearDisplay})`)
            .join(', ')}**.`
        : ''
    ]
      .filter(Boolean)
      .join('\n\n');

  const baseEvents =
    specificRecord?.events && specificRecord.events.length > 0
      ? specificRecord.events
      : [
          ...(region.keyEvents && region.keyEvents.length > 0
            ? region.keyEvents
            : eraProfile.keyEvents),
          ...(year >= 1990 && modernProfile?.keyRecentMilestones
            ? modernProfile.keyRecentMilestones
            : []),
          ...activeWarsInYear.map(
            (w) => `${w.name} (${w.startDate}): ${w.summary} — Status in ${yearDisplay}: ${w.status}`
          ),
          ...relatedIndexItems.map((item) => `${item.title} (${item.yearDisplay}): ${item.summary}`)
        ];

  // Ensure at least 4 rich, year-contextualized bullet points for sovereign states/empires, or exact documented events for indigenous/Antarctic records
  const yearMajorEvents =
    isIndigenousOrAntarctica || baseEvents.length >= 4
      ? baseEvents
      : [
          ...baseEvents,
          `${yearDisplay} Sovereign Administration: Governance of ${entityName} centered at ${capitalInYear} under ${rulerInYear}, maintaining territorial jurisdiction over ${lookupCountry}.`,
          `${yearDisplay} Economic & Trade Activity: Regional commerce, agricultural taxation, and infrastructure integration within the ${globalEra.epochName}.`,
          `${yearDisplay} Geopolitical Alignment: Diplomatic treaties, border demarcation, and defense posture in response to shifting regional balances of power.`
        ];

  const yearPoliticalAndDiplomaticState =
    specificRecord?.politicalAndDiplomatic ||
    (isIndigenousOrAntarctica
      ? ''
      : `In ${yearDisplay}, political authority in ${entityName} was exercised from ${capitalInYear} by ${rulerInYear} (${governmentTypeInYear}). Foreign relations centered on maintaining border security, regional trade treaties, and strategic equilibrium during the ${globalEra.epochName}.`);

  const yearEconomicAndSocialDevelopments =
    specificRecord?.economicAndSocial ||
    (isIndigenousOrAntarctica
      ? ''
      : `With an estimated population of ${populationInYear} in ${yearDisplay}, economic life in ${entityName} revolved around ${
          year >= 1900
            ? 'industrial production, energy infrastructure, urban services, agricultural output, and international trade'
            : 'agrarian harvests, craft guilds, urban markets, and overland/maritime caravan exchanges'
        }.`);

  const yearActiveConflictsAndSecurity =
    activeWarsInYear.length > 0
      ? activeWarsInYear.map(
          (w) => `${w.name} (${w.region} · ${w.startDate}): ${w.summary}`
        )
      : modernProfile?.disputedTerritories && year >= 1947 && !isIndigenousOrAntarctica
      ? modernProfile.disputedTerritories
      : [`Active frontier garrisoning and border defense along the perimeter of ${entityName} in ${yearDisplay}.`];

  return {
    entityName,
    modernCountry: lookupCountry,
    year,
    yearDisplay,
    epochName: `${globalEra.epochName} (${globalEra.timeRange})`,
    color: region.color || eraProfile.color,
    rulerInYear,
    capitalInYear,
    populationInYear,
    governmentTypeInYear,
    generalOverview,
    civilizationalTimeline,
    geographyAndStrategicLocation,
    economyTradeAndResources,
    militaryAndDefenseTradition,
    cultureSocietyAndHeritage,
    disputedTerritories: isIndigenousOrAntarctica ? [] : modernProfile?.disputedTerritories || [],
    hasCredibleYearRecord: true,
    isIndigenousOrAntarctica,
    yearHeadline,
    yearDetailedNarrative,
    yearMajorEvents,
    yearPoliticalAndDiplomaticState,
    yearEconomicAndSocialDevelopments,
    yearActiveConflictsAndSecurity,
    sources: getCreditedSourcesForRegion(entityName, lookupCountry, year)
  };
}

/**
 * Generates a comprehensive, two-part historical dossier for ANY Conflict Zone / Disputed Territory in ANY Year (-3000 to 2026)
 */
export function generateConflictYearDossier(
  conflict: ConflictZone,
  year: number
): ComprehensiveConflictDossier {
  const yearDisplay = year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
  const globalEra = getGeopoliticalEra(year);

  const isWithinConflictSpan = year >= conflict.startYear && year <= conflict.endYear;

  const yearHeadline = isWithinConflictSpan
    ? `What Happened in ${conflict.name} in ${yearDisplay}`
    : year < conflict.startYear
    ? `Pre-Conflict Historical Context in ${conflict.region} (${yearDisplay})`
    : `Post-Conflict Legacy & Geopolitical Aftermath of ${conflict.name} (${yearDisplay})`;

  const yearDetailedNarrative = isWithinConflictSpan
    ? `During the year **${yearDisplay}**, **${conflict.name}** in **${conflict.region}** was an active geopolitical flashpoint involving **${conflict.combatantsOrClaimants.join(', ')}** (Status: *${conflict.status}*). ${conflict.summary}\n\n${conflict.recentDevelopments}`
    : year < conflict.startYear
    ? `In **${yearDisplay}** (prior to the formal outbreak of **${conflict.name}** in ${conflict.startDate}), the strategic theater of **${conflict.region}** was shaped by the underlying territorial, dynastic, and demographic fault lines that later gave rise to the conflict: ${conflict.historicalRoot}`
    : `By **${yearDisplay}**, following the primary phase of **${conflict.name}** (${conflict.startDate}), the region of **${conflict.region}** continued to experience the territorial, demographic, and diplomatic consequences of the conflict. ${conflict.recentDevelopments}`;

  const yearMajorEvents = [
    `Active Theater & Belligerents (${yearDisplay}): Confrontation and territorial claims involving ${conflict.combatantsOrClaimants.join(' vs. ')} across ${conflict.region}.`,
    `Operational & Strategic Developments: ${conflict.recentDevelopments}`,
    `Underlying Historical Fault Line: ${conflict.historicalRoot}`,
    `Humanitarian & Geopolitical Impact: ${conflict.casualtiesOrImpact}`
  ];

  return {
    id: conflict.id,
    name: conflict.name,
    region: conflict.region,
    type: conflict.type,
    severity: conflict.severity,
    status: conflict.status,
    startDate: conflict.startDate,
    combatantsOrClaimants: conflict.combatantsOrClaimants,
    casualtiesOrImpact: conflict.casualtiesOrImpact,
    year,
    yearDisplay,
    epochName: `${globalEra.epochName} (${globalEra.timeRange})`,
    generalOverview: conflict.summary,
    historicalRootCauses: conflict.historicalRoot,
    strategicTheaterAndGeography: `Located in the strategic basin of ${conflict.region}, controlling critical land corridors, border crossings, or maritime choke points contested by ${conflict.combatantsOrClaimants.join(' and ')}.`,
    geopoliticalStakesAndAlliances: `Severity: ${conflict.severity.toUpperCase()} · Status: ${conflict.status}. Outcomes in ${conflict.name} directly affect regional sovereignty, international treaty law, and the balance of power in ${conflict.region}.`,
    yearHeadline,
    yearDetailedNarrative,
    yearMajorEvents,
    yearFrontlineAndDiplomaticStatus: conflict.recentDevelopments,
    sources: getCreditedSourcesForConflict(conflict.name, conflict.region)
  };
}
