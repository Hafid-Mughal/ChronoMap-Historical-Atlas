/**
 * Comprehensive Recent History & Intelligence Profiles for Modern Countries
 */

export interface CountryProfile {
  name: string;
  aliases: string[];
  capital: string;
  leader: string;
  population: string;
  governmentType: string;
  recentHistory: string;
  economicOverview: string;
  disputedTerritories: string[];
  keyRecentMilestones: string[];
}

export const MODERN_COUNTRY_PROFILES: Record<string, CountryProfile> = {
  "United States of America": {
    name: "United States of America",
    aliases: ["USA", "United States", "US"],
    capital: "Washington, D.C.",
    leader: "President of the United States",
    population: "~340 Million",
    governmentType: "Federal Constitutional Republic",
    recentHistory: "Following the end of the Cold War in 1991, the United States emerged as the sole global superpower. The post-9/11 era brought protracted military engagements in Afghanistan and Iraq, domestic polarization, the 2008 financial crisis, and major technological leadership in computing and AI. Recent decades have centered on intense strategic competition with China, revitalized NATO alliances following the invasion of Ukraine, and major industrial re-shoring initiatives like the CHIPS and Science Act.",
    economicOverview: "World's largest nominal economy ($28T+ GDP), issuer of the global reserve currency, and leader in technology, aerospace, energy, and biomedical innovation.",
    disputedTerritories: ["Maritime boundaries in Beaufort Sea with Canada", "Guantánamo Bay lease status with Cuba"],
    keyRecentMilestones: [
      "2001: 9/11 attacks and launch of the Global War on Terrorism",
      "2008: Great Recession and subsequent economic restructuring",
      "2020: COVID-19 pandemic response and rapid vaccine deployment",
      "2022-2024: Major security assistance to Ukraine and strengthening of Indo-Pacific Quad and AUKUS partnerships"
    ]
  },
  "Ukraine": {
    name: "Ukraine",
    aliases: ["Ukrayina"],
    capital: "Kyiv",
    leader: "President Volodymyr Zelenskyy",
    population: "~38 Million",
    governmentType: "Unitary Semi-Presidential Republic",
    recentHistory: "Gained independence following the 1991 Soviet collapse and relinquished the world's third-largest nuclear arsenal under the 1994 Budapest Memorandum. The 2004 Orange Revolution and 2014 Euromaidan Revolution marked decisive pivots toward European integration, prompting Russia's illegal annexation of Crimea and invasion of the Donbas in 2014. In February 2022, Ukraine resisted Russia's full-scale invasion, defending Kyiv and liberating Kharkiv and Kherson while becoming a recognized EU candidate state.",
    economicOverview: "Historically a leading agricultural breadbasket ('granary of Europe') and metallurgical center, undergoing total war-mobilized economic restructuring with extensive Western financial support.",
    disputedTerritories: ["Crimean Peninsula (illegally occupied by Russia)", "Donetsk, Luhansk, Zaporizhzhia, and Kherson administrative regions (partially occupied)"],
    keyRecentMilestones: [
      "1991: Independence referendum approved by 92% of voters",
      "2014: Revolution of Dignity (Euromaidan) and Russian invasion of Crimea & Donbas",
      "2022: Defense of Kyiv and repelling of Russian full-scale invasion",
      "2022-2024: Black Sea maritime corridor reopened and EU accession talks opened"
    ]
  },
  "Russian Federation": {
    name: "Russian Federation",
    aliases: ["Russia", "Rossiya"],
    capital: "Moscow",
    leader: "President Vladimir Putin",
    population: "~144 Million",
    governmentType: "Federal Semi-Presidential Republic",
    recentHistory: "Emerged in 1991 after the dissolution of the USSR under Boris Yeltsin, experiencing turbulent economic privatization and the Chechen wars. Vladimir Putin took office in 1999, centralizing state authority, leveraging oil and natural gas export revenues, and pursuing assertive regional revanchism (2008 Georgia war, 2014 Crimea annexation). The 2022 full-scale invasion of Ukraine led to unprecedented Western sanctions, severed European energy ties, and an accelerating economic and military alignment with China and Iran.",
    economicOverview: "Extractive resource economy heavily driven by oil, gas, fertilizer, and minerals, increasingly reoriented towards Asian markets under heavy international sanctions.",
    disputedTerritories: ["Crimea and occupied southern/eastern Ukraine", "Kuril Islands / Northern Territories (claimed by Japan)", "Abkhazia and South Ossetia military presence in Georgia"],
    keyRecentMilestones: [
      "1999: Rise of Vladimir Putin and stabilization of federal authority",
      "2014: Unilateral annexation of Crimea and triggering of Donbas insurgency",
      "2022: Launch of full-scale war in Ukraine and subsequent Western sanctions",
      "2023: Wagner Group rebellion and intensified BRICS+ geopolitical expansion"
    ]
  },
  "China": {
    name: "People's Republic of China",
    aliases: ["PRC", "China"],
    capital: "Beijing",
    leader: "President Xi Jinping",
    population: "~1.41 Billion",
    governmentType: "Single-Party Socialist Republic",
    recentHistory: "Following Deng Xiaoping's economic opening and WTO accession in 2001, China achieved unprecedented economic growth, lifting over 800 million citizens out of poverty and becoming the 'world's factory'. Under Xi Jinping (General Secretary since 2012), Beijing launched the global Belt and Road infrastructure initiative, consolidated state control over Hong Kong, modernized the People's Liberation Army, and asserted expansive maritime claims in the South China Sea and across the Taiwan Strait.",
    economicOverview: "Second largest global economy, manufacturing powerhouse, global leader in electric vehicles, green energy components, high-speed rail, and telecommunications.",
    disputedTerritories: ["Taiwan and surrounding maritime zones", "South China Sea (Nine-Dash Line contested by Philippines, Vietnam, Malaysia)", "Arunachal Pradesh & Aksai Chin (contested with India)", "Senkaku/Diaoyu Islands (contested with Japan)"],
    keyRecentMilestones: [
      "2001: Accession to the World Trade Organization (WTO)",
      "2008: Beijing Summer Olympic Games showcasing rising global stature",
      "2013: Launch of the Belt and Road Global Infrastructure Initiative",
      "2020: Implementation of Hong Kong National Security Law and intensified cross-strait military maneuvers"
    ]
  },
  "India": {
    name: "Republic of India",
    aliases: ["India", "Bharat"],
    capital: "New Delhi",
    leader: "Prime Minister of India",
    population: "~1.43 Billion (World's Most Populous)",
    governmentType: "Federal Parliamentary Constitutional Republic",
    recentHistory: "Economic liberalization in 1991 unleashed rapid technological and services growth, turning Bengaluru and Hyderabad into global IT centers. Declared an overt nuclear power in 1998, India fought the 1999 Kargil conflict with Pakistan. Under Narendra Modi since 2014, India has pursued massive digital public infrastructure (UPI, Aadhaar), manufacturing initiatives, the historic Chandrayaan-3 Moon landing, and non-aligned multi-alignment diplomacy between the West and the Global South.",
    economicOverview: "World's fastest-growing major economy, prominent in software engineering, pharmaceuticals ('pharmacy of the world'), textiles, and expanding renewable energy.",
    disputedTerritories: ["Line of Control in Jammu & Kashmir (with Pakistan)", "Aksai Chin & Line of Actual Control (with China)", "Sir Creek maritime border (with Pakistan)"],
    keyRecentMilestones: [
      "1991: Economic liberalization and opening of domestic markets",
      "1998: Pokhran-II nuclear tests and subsequent strategic recognition",
      "2023: Became the world's most populous nation, hosted G20 summit, and achieved lunar south pole landing with Chandrayaan-3"
    ]
  },
  "United Kingdom": {
    name: "United Kingdom of Great Britain and Northern Ireland",
    aliases: ["UK", "Britain", "Great Britain"],
    capital: "London",
    leader: "Prime Minister of the United Kingdom",
    population: "~68 Million",
    governmentType: "Parliamentary Constitutional Monarchy",
    recentHistory: "The 1998 Good Friday Agreement brought peace to Northern Ireland after decades of the Troubles. Tony Blair's New Labour era saw devolution and participation in the post-9/11 wars. The historic 2016 referendum to leave the European Union ('Brexit') led to major constitutional and trade renegotiations formally executed in 2020. The UK remains a nuclear-armed permanent member of the UN Security Council and a principal military backer of European defense.",
    economicOverview: "Advanced services economy centered on London as a premier global financial capital, higher education, life sciences, and aerospace.",
    disputedTerritories: ["Falkland Islands / Islas Malvinas (sovereignty claimed by Argentina)", "Gibraltar (sovereignty contested by Spain)", "Chagos Archipelago sovereignty transfer"],
    keyRecentMilestones: [
      "1998: Good Friday Agreement bringing peace to Northern Ireland",
      "2016: Brexit referendum voting to exit the European Union",
      "2022: Death of Queen Elizabeth II after 70-year reign; accession of King Charles III"
    ]
  },
  "France": {
    name: "French Republic",
    aliases: ["France"],
    capital: "Paris",
    leader: "President Emmanuel Macron",
    population: "~68 Million",
    governmentType: "Semi-Presidential Republic",
    recentHistory: "A core founder and driver of the European Union, France championed the creation of the Eurozone and the 2015 Paris Climate Agreement. France has balanced internal social debates, pension reforms, and counter-terrorism operations with an independent foreign policy advocating 'European strategic autonomy'. Paris remains a global diplomatic, cultural, and nuclear-powered military anchor.",
    economicOverview: "Major world economy renowned for aerospace (Airbus), luxury goods, nuclear energy independence, agriculture, and high-speed rail.",
    disputedTerritories: ["Mayotte sovereignty claimed by Comoros", "Scattered islands in the Indian Ocean claimed by Madagascar"],
    keyRecentMilestones: [
      "1992: Ratification of the Maastricht Treaty establishing the EU",
      "2015: Paris Climate Agreement adopted during COP21",
      "2024: Successful hosting of the Paris Summer Olympic and Paralympic Games"
    ]
  },
  "Germany": {
    name: "Federal Republic of Germany",
    aliases: ["Germany", "Deutschland"],
    capital: "Berlin",
    leader: "Federal Chancellor of Germany",
    population: "~84 Million",
    governmentType: "Federal Parliamentary Republic",
    recentHistory: "The fall of the Berlin Wall in 1989 and formal reunification in October 1990 reestablished Germany as Europe's central economic engine. Under Chancellor Angela Merkel (2005-2021), Germany navigated the Eurozone financial crisis, the 2015 European refugee crisis, and industrial export dominance. Russia's 2022 invasion of Ukraine prompted Germany's historic 'Zeitenwende' (turning point)—investing €100B in defense and rapidly cutting reliance on Russian energy.",
    economicOverview: "Largest economy in Europe and 3rd largest in the world, famed for automotive engineering, advanced machinery (Mittelstand), chemicals, and green technologies.",
    disputedTerritories: ["No active territorial disputes with European neighbors"],
    keyRecentMilestones: [
      "1990: German reunification under the Two Plus Four Treaty",
      "2002: Introduction of the physical Euro currency banknotes",
      "2022: Declaration of the 'Zeitenwende' defense and strategic energy policy overhaul"
    ]
  },
  "Israel": {
    name: "State of Israel",
    aliases: ["Israel"],
    capital: "Jerusalem",
    leader: "Prime Minister Benjamin Netanyahu",
    population: "~9.8 Million",
    governmentType: "Parliamentary Republic",
    recentHistory: "The 1990s saw the Oslo Peace Accords and Jordan peace treaty, followed by the Second Intifada in 2000 and the 2005 withdrawal from the Gaza Strip. Known as the 'Startup Nation', Israel pioneered world-leading cybersecurity, water desalinization, and Iron Dome missile defense. The 2020 Abraham Accords established diplomatic ties with the UAE, Bahrain, and Morocco. The October 7, 2023 Hamas attacks triggered the most destructive regional war in decades across Gaza and southern Lebanon.",
    economicOverview: "High-tech innovation economy, global leader in cybersecurity, defense systems, semiconductors, and agricultural water technology.",
    disputedTerritories: ["Golan Heights (annexed, contested by Syria)", "West Bank military administration and settlements", "East Jerusalem status", "Gaza Strip borders and maritime access"],
    keyRecentMilestones: [
      "1993: Oslo Peace Accords signed in Washington",
      "2020: Abraham Accords normalizing relations with Arab nations",
      "2023-2024: War in Gaza following the October 7 assault and multi-front regional escalation"
    ]
  },
  "Sudan": {
    name: "Republic of the Sudan",
    aliases: ["Sudan"],
    capital: "Khartoum",
    leader: "Gen. Abdel Fattah al-Burhan",
    population: "~48 Million",
    governmentType: "Transitional Military Regime (Contested)",
    recentHistory: "Governed for three decades by Omar al-Bashir, enduring protracted civil wars that culminated in the 2011 independence of South Sudan and devastating conflict in Darfur. Mass popular protests in 2019 toppled Bashir, establishing a joint civilian-military council. A military coup in 2021 derailed democracy, leading in April 2023 to catastrophic open warfare between the national military (SAF) and the paramilitary Rapid Support Forces (RSF), creating the world's largest internal displacement crisis.",
    economicOverview: "Rich agricultural potential and gold reserves severely crippled by hyperinflation, infrastructure destruction, and total civil conflict.",
    disputedTerritories: ["Abyei region (contested with South Sudan)", "Hala'ib Triangle (administered by Egypt, claimed by Sudan)", "Kafia Kingi enclave"],
    keyRecentMilestones: [
      "2011: South Sudan successfully secedes following a landmark referendum",
      "2019: Popular revolution overthrows Omar al-Bashir after 30 years in power",
      "2023: Outbreak of full-scale civil war between SAF and RSF paramilitaries"
    ]
  },
  "Japan": {
    name: "Japan",
    aliases: ["Japan", "Nippon"],
    capital: "Tokyo",
    leader: "Prime Minister of Japan",
    population: "~124 Million",
    governmentType: "Parliamentary Constitutional Monarchy",
    recentHistory: "Following the asset bubble burst of the 1990s ('Lost Decades'), Japan maintained status as a top global innovator and stable democracy. The 2011 Great East Japan Earthquake, tsunami, and Fukushima nuclear disaster presented immense recovery challenges. Under Shinzo Abe, 'Abenomics' revitalized the economy while Japan reinterpreted its pacifist Article 9 constitution to permit collective self-defense, strengthening Indo-Pacific deterrence against Chinese and North Korean threats.",
    economicOverview: "4th largest global economy, titan in automobile manufacturing (Toyota, Honda), robotics, semiconductors, and precision optics.",
    disputedTerritories: ["Northern Territories / Kuril Islands (controlled by Russia)", "Takeshima / Dokdo (administered by South Korea)", "Senkaku Islands (claimed by China)"],
    keyRecentMilestones: [
      "2011: 9.0 magnitude Tohoku earthquake and Fukushima nuclear accident",
      "2015: Security legislation reinterpreting pacifist defense constraints",
      "2022: Assassination of former Prime Minister Shinzo Abe; defense budget doubled"
    ]
  },
  "Brazil": {
    name: "Federative Republic of Brazil",
    aliases: ["Brazil", "Brasil"],
    capital: "Brasília",
    leader: "President Luiz Inácio Lula da Silva",
    population: "~215 Million",
    governmentType: "Federal Presidential Republic",
    recentHistory: "Transitioned from military rule to democracy in 1985. The 1994 Plano Real stabilized hyperinflation, followed by rapid social welfare expansion under Lula in the 2000s that lifted millions into the middle class. The 2010s saw deep political turmoil, the 'Operation Car Wash' anti-corruption probe, the presidency of Jair Bolsonaro, and Lula's return to the presidency in 2023 with a renewed focus on environmental protection of the Amazon rainforest.",
    economicOverview: "Dominant economy in Latin America, agricultural superpower (soybeans, beef, sugar, coffee), civil aviation (Embraer), and offshore pre-salt oil producer.",
    disputedTerritories: ["Ilha Brasileira border dispute with Uruguay"],
    keyRecentMilestones: [
      "1994: Plano Real brings an end to decades of runaway hyperinflation",
      "2014 & 2016: Hosted FIFA World Cup and Rio Summer Olympics",
      "2023: Re-election of Lula da Silva and aggressive crackdown on illegal Amazon deforestation"
    ]
  },
  "Canada": {
    name: "Canada",
    aliases: ["Canada"],
    capital: "Ottawa",
    leader: "Prime Minister of Canada",
    population: "~40 Million",
    governmentType: "Federal Parliamentary Constitutional Monarchy",
    recentHistory: "Narrowly averted the 1995 Quebec independence referendum. Canada strengthened North American trade integration through NAFTA (and subsequent USMCA/CUSMA), expanded immigration to address demographic growth, and advanced national Truth and Reconciliation commissions with Indigenous peoples. A founding NATO member and Arctic nation, Canada actively defends northern sovereignty and multilateral environmental accords.",
    economicOverview: "Abundant natural resources (oil sands, timber, critical minerals), financial services, aerospace, and advanced artificial intelligence research.",
    disputedTerritories: ["Northwest Passage international status dispute with the US", "Beaufort Sea maritime boundary with US"],
    keyRecentMilestones: [
      "1995: Quebec sovereignty referendum defeated by 50.58% to 49.42%",
      "1999: Creation of the self-governing northern territory of Nunavut",
      "2020: USMCA (CUSMA) trade agreement replaces NAFTA"
    ]
  },
  "Australia": {
    name: "Commonwealth of Australia",
    aliases: ["Australia"],
    capital: "Canberra",
    leader: "Prime Minister of Australia",
    population: "~27 Million",
    governmentType: "Federal Parliamentary Constitutional Monarchy",
    recentHistory: "Maintained nearly three decades of uninterrupted economic growth driven by resource exports (iron ore, coal, LNG) to Asian markets. Australia has played a leading security role in the South Pacific (East Timor peacekeeping 1999), enacted strict national gun reforms following the 1996 Port Arthur massacre, and formed the landmark 2021 AUKUS defense pact with the US and UK to acquire nuclear-powered submarines for Indo-Pacific stability.",
    economicOverview: "Resource-rich exporter of iron ore, lithium, gold, LNG, and agricultural commodities, with a major international higher education sector.",
    disputedTerritories: ["Australian Antarctic Territory claims held in abeyance under Antarctic Treaty"],
    keyRecentMilestones: [
      "1996: Nationwide gun buyback and strict firearms laws enacted",
      "2008: Formal national apology to Australia's Indigenous Stolen Generations",
      "2021: AUKUS security partnership signed with the US and UK"
    ]
  },
  "Saudi Arabia": {
    name: "Kingdom of Saudi Arabia",
    aliases: ["Saudi Arabia", "KSA"],
    capital: "Riyadh",
    leader: "Crown Prince Mohammed bin Salman (de facto) / King Salman",
    population: "~36 Million",
    governmentType: "Absolute Monarchy",
    recentHistory: "The world's premier oil exporter and custodian of Islam's two holiest sites (Mecca and Medina). Following the 1991 Gulf War where US forces deployed to protect the kingdom, Saudi Arabia modernized its military. In 2016, Crown Prince Mohammed bin Salman launched 'Vision 2030'—a dramatic social and economic overhaul granting women driver rights, opening international tourism, developing the mega-city NEOM, and diversifying away from oil.",
    economicOverview: "Leading oil producer (Aramco), pursuing massive sovereign wealth investments via the Public Investment Fund (PIF) into tech, clean hydrogen, and entertainment.",
    disputedTerritories: ["Border demarcation finalized with Yemen, contested maritime approaches"],
    keyRecentMilestones: [
      "2016: Vision 2030 national economic diversification roadmap announced",
      "2018: Lifting of the ban on women driving motor vehicles",
      "2023: Diplomatic rapprochement with Iran brokered by China"
    ]
  },
  "Iran": {
    name: "Islamic Republic of Iran",
    aliases: ["Iran", "Persia"],
    capital: "Tehran",
    leader: "Supreme Leader Ayatollah Ali Khamenei",
    population: "~88 Million",
    governmentType: "Theocratic Republic",
    recentHistory: "Established after the 1979 Islamic Revolution and the bloody 1980-88 Iran-Iraq War. The 2000s were dominated by international standoff over Iran's nuclear enrichment program, culminating in the 2015 JCPOA nuclear deal, from which the US withdrew in 2018. Iran developed the 'Axis of Resistance'—arming regional proxy networks across Lebanon, Yemen, Iraq, and Gaza—while facing intense domestic protest movements like the 2022 'Woman, Life, Freedom' protests.",
    economicOverview: "Major petroleum and petrochemical reserves constrained by sweeping US secondary sanctions; expanding barter trade with Russia and China.",
    disputedTerritories: ["Abu Musa and Greater/Lesser Tunbs islands (disputed by the UAE)", "Shatt al-Arab waterway border with Iraq"],
    keyRecentMilestones: [
      "2015: Joint Comprehensive Plan of Action (JCPOA) nuclear agreement signed",
      "2018: US unilateral withdrawal from JCPOA and maximum pressure sanctions",
      "2022: Nationwide 'Woman, Life, Freedom' protests following the death of Mahsa Amini"
    ]
  },
  "Pakistan": {
    name: "Islamic Republic of Pakistan",
    aliases: ["Pakistan"],
    capital: "Islamabad",
    leader: "Prime Minister of Pakistan",
    population: "~240 Million (5th Most Populous)",
    governmentType: "Federal Parliamentary Republic",
    recentHistory: "Created in the 1947 partition of British India; tested nuclear weapons in 1998 following India's tests. In 1999, Gen. Pervez Musharraf took power in a coup, aligning Pakistan as a frontline ally in the US war in Afghanistan while dealing with domestic extremism. Over the past decade, Pakistan partnered with China on the $60B+ China-Pakistan Economic Corridor (CPEC) through Gwadar port while managing volatile civil-military political crises and catastrophic 2022 climate floods.",
    economicOverview: "Major textile and agricultural exporter, navigating recurring IMF macroeconomic stabilization programs and expanding regional trade.",
    disputedTerritories: ["Kashmir Line of Control & Gilgit-Baltistan (contested with India)", "Sir Creek estuary boundary dispute", "Durand Line border friction with Afghanistan"],
    keyRecentMilestones: [
      "1998: Conducted Chagai-I nuclear tests, becoming the Muslim world's first nuclear power",
      "2015: Launch of the China-Pakistan Economic Corridor (CPEC)",
      "2022: Catastrophic monsoon floods submerging one-third of the country"
    ]
  },
  "South Africa": {
    name: "Republic of South Africa",
    aliases: ["South Africa"],
    capital: "Pretoria (Executive) / Cape Town (Legislative) / Bloemfontein (Judicial)",
    leader: "President Cyril Ramaphosa",
    population: "~62 Million",
    governmentType: "Parliamentary Republic",
    recentHistory: "Overthrew the institutional apartheid racial regime in 1994, inaugurating Nelson Mandela as first democratically elected president in the 'Rainbow Nation'. South Africa adopted one of the world's most progressive constitutions in 1996 and hosted the 2010 FIFA World Cup. Decades under the African National Congress (ANC) have confronted high unemployment, energy crises (load shedding), and in 2024, the formation of an unprecedented Government of National Unity.",
    economicOverview: "Most industrialized economy in Africa, world's leading producer of platinum, chromium, and manganese, with advanced banking and wine export sectors.",
    disputedTerritories: ["No active territorial disputes with neighbors"],
    keyRecentMilestones: [
      "1994: First non-racial democratic elections; Nelson Mandela inaugurated",
      "2010: First African nation to host the FIFA World Cup",
      "2024: Historic national election resulting in first Government of National Unity"
    ]
  },
  "Greenland": {
    name: "Greenland (Autonomous Territory of the Kingdom of Denmark)",
    aliases: ["Greenland", "Greenland (Kingdom of Denmark)", "Kalaallit Nunaat", "Grønland"],
    capital: "Nuuk (Sovereign Realm Capital: Copenhagen, Denmark)",
    leader: "King Frederik X of Denmark / Prime Minister of Greenland (Naalakkersuisut)",
    population: "~56,900 (89% Kalaallit Inuit · Part of Kingdom of Denmark)",
    governmentType: "Autonomous Parliamentary Constituent Territory within the Kingdom of Denmark",
    recentHistory: "Greenland (Kalaallit Nunaat) is the world's largest island and an autonomous constituent territory of the Kingdom of Denmark (Rigsfællesskabet), not an independent sovereign state. After ending colonial status in 1953 to become a Danish county, Greenland gained Home Rule in 1979 (withdrawing from the EEC in 1985 over fishing rights) and expanded autonomy under the 2009 Self-Government Act. While Greenland's parliament (Inatsisartut) and executive (Naalakkersuisut) in Nuuk govern domestic policy and natural resources, the Kingdom of Denmark retains constitutional authority over foreign policy, defense, currency (Danish krone), and NATO Arctic security.",
    economicOverview: "Economy centered on commercial Arctic fisheries (over 90% of exports, particularly shrimp and halibut), Danish state block grants (Bloktilskud), polar scientific research, and vast untapped rare-earth and critical mineral reserves.",
    disputedTerritories: ["Hans Island (Tartupaluk) border with Canada peacefully resolved in 2022", "Strategic Arctic continental shelf claims (Lomonosov Ridge) submitted by the Kingdom of Denmark"],
    keyRecentMilestones: [
      "1953: Integrated into the Kingdom of Denmark under the Danish Constitution, ending colonial status",
      "1979: Home Rule Act establishes Greenland's parliament (Inatsisartut) and government in Nuuk",
      "2009: Self-Government Act expands autonomy within the Kingdom of Denmark and makes Greenlandic (Kalaallisut) the official language",
      "2022: Kingdom of Denmark and Canada sign historic treaty peacefully dividing Hans Island (Tartupaluk)"
    ]
  },
  "Denmark": {
    name: "Kingdom of Denmark (Rigsfællesskabet)",
    aliases: ["Denmark", "Danmark", "Kingdom of Denmark"],
    capital: "Copenhagen",
    leader: "King Frederik X / Prime Minister of Denmark",
    population: "~6.0 Million (Plus Greenland ~56.9k & Faroe Islands ~54.5k)",
    governmentType: "Unitary Parliamentary Constitutional Monarchy (Unity of the Realm)",
    recentHistory: "One of the world's oldest continuous monarchies, the Kingdom of Denmark forms a constitutional realm (Rigsfællesskabet) encompassing metropolitan Denmark in Northern Europe alongside two autonomous constituent territories in the North Atlantic and Arctic: Greenland and the Faroe Islands. A founding NATO member and European Union member state, Denmark is a global leader in wind energy, pharmaceuticals, maritime shipping, and Arctic diplomacy.",
    economicOverview: "High-income Nordic welfare and innovation economy leading globally in pharmaceuticals (Novo Nordisk), container shipping (Maersk), and offshore wind energy (Ørsted & Vestas).",
    disputedTerritories: ["Arctic continental shelf demarcation in the high North Pole basin (via Greenland)"],
    keyRecentMilestones: [
      "1973: Accession of Denmark to the European Economic Community (EU)",
      "2009: Enactment of the Greenland Self-Government Act within the Danish Realm",
      "2024: Abdication of Queen Margrethe II after 52 years; accession of King Frederik X"
    ]
  },
  "Singapore": {
    name: "Republic of Singapore",
    aliases: ["Singapore", "Singapura", "Lion City"],
    capital: "Singapore",
    leader: "Prime Minister Lawrence Wong & President Tharman Shanmugaratnam",
    population: "~5.9 Million",
    governmentType: "Unitary Parliamentary Constitutional Republic",
    recentHistory: "Founded as the medieval Kingdom of Singapura (Temasek) in 1299 and established as a British free port by Sir Stamford Raffles in 1819, Singapore served as the capital of the British Straits Settlements and a Crown Colony before merging with Malaya, Sabah, and Sarawak to form Malaysia in September 1963. Following separation on August 9, 1965, founding Prime Minister Lee Kuan Yew led Singapore's transformation from a resource-scarce island port into a first-world global financial, maritime, semiconductor, and aviation hub.",
    economicOverview: "One of the world's highest GDP-per-capita economies, serving as a premier global banking and wealth management hub, home to the Port of Singapore and Changi Airport, and a leader in semiconductor fabrication, biotechnology, and petrochemicals.",
    disputedTerritories: ["Pedra Branca sovereignty confirmed by ICJ in 2008; ongoing maritime delimitation talks in the Singapore Strait"],
    keyRecentMilestones: [
      "1819: Sir Stamford Raffles signs treaty establishing British free port on Singapore Island",
      "1963–1965: Joins the Federation of Malaysia (Sept 16, 1963) before becoming an independent sovereign republic on August 9, 1965",
      "1965–1990: Economic miracle under founding Prime Minister Lee Kuan Yew (HDB housing, Jurong Industrial Estate, Changi Airport)",
      "2024: Lawrence Wong succeeds Lee Hsien Loong as fourth Prime Minister of Singapore"
    ]
  },
  "Malaysia": {
    name: "Malaysia",
    aliases: ["Malaysia", "Federation of Malaya", "Malaya", "Sabah and Sarawak"],
    capital: "Kuala Lumpur (Administrative Center: Putrajaya)",
    leader: "Yang di-Pertuan Agong Sultan Ibrahim & Prime Minister Anwar Ibrahim",
    population: "~34.3 Million",
    governmentType: "Federal Parliamentary Constitutional Elective Monarchy",
    recentHistory: "Heir to the 15th-century Malacca Sultanate, Peninsular Malaya achieved independence (Merdeka) from British rule on August 31, 1957 as the Federation of Malaya under Tunku Abdul Rahman. Meanwhile, Sarawak and North Borneo (Sabah) on Borneo Island remained British Crown Colonies until September 16, 1963, when they united with Malaya and Singapore (which separated in 1965) under the Malaysia Agreement to form modern Malaysia. In the late 20th and 21st centuries, Malaysia industrialized rapidly into a major electronics, palm oil, and LNG exporter.",
    economicOverview: "Upper-middle-income industrialized economy in Southeast Asia, a leading global hub for semiconductor packaging and testing (especially in Penang), palm oil, PETRONAS liquefied natural gas, and Islamic finance.",
    disputedTerritories: ["Overlapping South China Sea Spratly Islands claims", "Sabah historical claim by the Philippines"],
    keyRecentMilestones: [
      "1957 (Aug 31): Federation of Malaya (Peninsular Malaysia) gains independence from Britain",
      "1963 (Sept 16): British Borneo colonies of Sarawak and North Borneo (Sabah) plus Singapore unite with Malaya to form Malaysia",
      "1965 (Aug 9): Singapore separates to become an independent republic",
      "1998: Completion of the Petronas Twin Towers in Kuala Lumpur and Multimedia Super Corridor"
    ]
  },
  "Brunei": {
    name: "Brunei Darussalam (Nation of Brunei, the Abode of Peace)",
    aliases: ["Brunei", "Brunei Darussalam", "Sultanate of Brunei"],
    capital: "Bandar Seri Begawan",
    leader: "Sultan Hassanal Bolkiah",
    population: "~450,000",
    governmentType: "Unitary Islamic Absolute Monarchy (Sultanate)",
    recentHistory: "Founded in 1368 CE when Awang Alak Betatar became Sultan Muhammad Shah, the Sultanate of Brunei reached its imperial golden age in the 15th–16th centuries under Sultan Bolkiah, ruling all of northern Borneo and Sulu. After ceding Sarawak to James Brooke (1841) and North Borneo in the late 19th century, Brunei became a British Protectorate in 1888 (with a British Resident from 1906). Following the 1929 Seria oil discovery and the decision not to join Malaysia in 1963, Brunei remained under British protection until regaining full sovereign independence on January 1, 1984.",
    economicOverview: "High-income hydrocarbon economy driven by offshore crude oil and liquefied natural gas (LNG) exports from Seria and the South China Sea, funding universal tax-free healthcare, education, and housing.",
    disputedTerritories: ["Louisa Reef in the southern Spratly Islands (South China Sea)"],
    keyRecentMilestones: [
      "1368: Establishment of the Islamic Sultanate of Brunei",
      "1888–1983: Governed as a British Protectorate under the 1888 Treaty of Protection and 1959 Constitution",
      "1929: Discovery of the giant Seria oilfield transforming Brunei's economy",
      "1984 (Jan 1): Full sovereign independence restored from the United Kingdom under Sultan Hassanal Bolkiah"
    ]
  },
  "Maldives": {
    name: "Republic of Maldives",
    aliases: ["Maldives", "Maldive Islands", "Dhivehi Raajje"],
    capital: "Malé",
    leader: "President Mohamed Muizzu",
    population: "~525,000",
    governmentType: "Unitary Presidential Constitutional Republic",
    recentHistory: "Inhabited for over 2,500 years across 26 natural coral atolls in the Indian Ocean, the Maldives transitioned from a Buddhist kingdom to an Islamic Sultanate in 1153 CE under Sultan Muhammad al-Adil. After expelling a 15-year Portuguese occupation in 1573 under national hero Muhammad Thakurufaanu, the Sultanate became a British protectorate in 1887 while retaining internal self-rule. The Maldives regained full independence on July 26, 1965 and declared a republic in 1968.",
    economicOverview: "Upper-middle-income economy driven by luxury island resort tourism, pelagic skipjack and yellowfin tuna fisheries, and Indian Ocean shipping lanes.",
    disputedTerritories: ["Southern Exclusive Economic Zone (EEZ) delimitation with Mauritius/Chagos resolved by ITLOS in 2023"],
    keyRecentMilestones: [
      "1153: Conversion to Islam and founding of the Sultanate of the Maldives",
      "1573: Muhammad Thakurufaanu liberates Malé from Portuguese rule",
      "1887–1965: British Protectorate status; full independence achieved on July 26, 1965",
      "1968 & 2008: Proclamation of the Republic (1968) and multi-party democratic constitution (2008)"
    ]
  },
  "Bahrain": {
    name: "Kingdom of Bahrain",
    aliases: ["Bahrain", "Dilmun", "Tylos", "Awal"],
    capital: "Manama",
    leader: "King Hamad bin Isa Al Khalifa & Crown Prince/PM Salman bin Hamad Al Khalifa",
    population: "~1.58 Million",
    governmentType: "Unitary Parliamentary Constitutional Monarchy",
    recentHistory: "Ancient center of the Bronze Age Dilmun civilization (3000–600 BCE) and renowned for millennia for its Persian Gulf pearl banks, Bahrain was ruled by successive Arab dynasties, Portugal (1521–1602), and Persia (1602–1783) before Ahmed al-Fateh established House of Al Khalifa rule in 1783. A British protectorate from 1861 to 1971—and the first Gulf state on the Arabian side to discover oil in 1932—Bahrain declared independence on August 15, 1971 and became a Kingdom in 2002.",
    economicOverview: "Diversified Gulf financial and industrial hub centered on Islamic and offshore banking, Aluminum Bahrain (Alba) smelting, petroleum refining, and the King Fahd Causeway trade corridor.",
    disputedTerritories: ["Hawar Islands dispute with Qatar resolved by ICJ ruling in 2001 in Bahrain's favor"],
    keyRecentMilestones: [
      "c. 2500 BCE: Zenith of the Bronze Age Dilmun maritime trading civilization at Qal'at al-Bahrain",
      "1783: Ahmed al-Fateh establishes House of Al Khalifa rule",
      "1932: Discovery of oil at Jabal al-Dukhan (Well No. 1), the first commercial oil strike on the Arabian side of the Gulf",
      "1971 (Aug 15): Full independence from British protection; 2002 National Action Charter establishes the Kingdom of Bahrain"
    ]
  },
  "Grenada": {
    name: "Grenada (The Spice Isle)",
    aliases: ["Grenada", "Carriacou and Petite Martinique", "Isle of Spice"],
    capital: "St. George's",
    leader: "King Charles III / Prime Minister Dickon Mitchell",
    population: "~125,000",
    governmentType: "Unitary Parliamentary Constitutional Monarchy",
    recentHistory: "Originally inhabited by Arawak and Kalinago peoples, Grenada was colonized by France in 1649 (La Grenade) and ceded to Great Britain under the 1763 Treaty of Paris. Known globally as the 'Island of Spice' for its nutmeg and mace production, Grenada gained independence on February 7, 1974. Following the 1979 New Jewel Movement revolution under Maurice Bishop and the October 1983 US-Caribbean intervention (Operation Urgent Fury), constitutional parliamentary democracy was restored in 1984.",
    economicOverview: "Tourism, yachting, offshore medical education (St. George's University), and exports of nutmeg, mace, cinnamon, and organic cocoa.",
    disputedTerritories: [],
    keyRecentMilestones: [
      "1649–1763: French colony of La Grenade before cession to Britain in the Treaty of Paris (1763)",
      "1974 (Feb 7): Independence of Grenada from the United Kingdom",
      "1983 (Oct): Operation Urgent Fury and subsequent restoration of parliamentary elections (1984)"
    ]
  },
  "Barbados": {
    name: "Barbados",
    aliases: ["Barbados"],
    capital: "Bridgetown",
    leader: "President Sandra Mason & Prime Minister Mia Mottley",
    population: "~282,000",
    governmentType: "Unitary Parliamentary Republic",
    recentHistory: "Inhabited by Kalinago and Lokono peoples prior to English settlement at Holetown in 1627, Barbados established the third-oldest parliament in the Americas in 1639. After more than three centuries as a British colony and hub of the Caribbean sugar trade, Barbados achieved independence on November 30, 1966 under Errol Barrow and transitioned to a parliamentary republic on November 30, 2021.",
    economicOverview: "High-income Eastern Caribbean service economy driven by tourism, international business and financial services, rum distillation, and renewable energy initiatives (Bridgetown Initiative).",
    disputedTerritories: [],
    keyRecentMilestones: [
      "1627 & 1639: English settlement and establishment of the Barbados House of Assembly",
      "1966 (Nov 30): Independence from the United Kingdom under Prime Minister Errol Barrow",
      "2021 (Nov 30): Transition from Commonwealth realm to a Parliamentary Republic with Dame Sandra Mason as first President"
    ]
  },
  "Saint Lucia": {
    name: "Saint Lucia",
    aliases: ["Saint Lucia", "St. Lucia", "Hewanorra"],
    capital: "Castries",
    leader: "King Charles III / Prime Minister Philip J. Pierre",
    population: "~180,000",
    governmentType: "Unitary Parliamentary Constitutional Monarchy",
    recentHistory: "Known as the 'Helen of the West Indies' because control of the island alternated fourteen times between France and Great Britain during the 17th and 18th centuries before Britain secured permanent rule in 1814. Crowned by the volcanic twin Pitons, Saint Lucia achieved independence on February 22, 1979 and produced two Nobel Laureates (Sir Arthur Lewis and Derek Walcott).",
    economicOverview: "Tourism, banana and tropical fruit cultivation, light manufacturing, and geothermal/renewable energy development.",
    disputedTerritories: [],
    keyRecentMilestones: [
      "1660–1814: Fourteen Anglo-French wars over Saint Lucia before the 1814 Treaty of Paris confirms British sovereignty",
      "1979 (Feb 22): Independence of Saint Lucia from the United Kingdom"
    ]
  },
  "St. Vin. and Gren.": {
    name: "Saint Vincent and the Grenadines",
    aliases: ["St. Vin. and Gren.", "Saint Vincent and the Grenadines", "St. Vincent", "Hairouna"],
    capital: "Kingstown",
    leader: "King Charles III / Prime Minister Ralph Gonsalves",
    population: "~104,000",
    governmentType: "Unitary Parliamentary Constitutional Monarchy",
    recentHistory: "For over a century, indigenous Kalinago and Garifuna (Black Carib) defenders led by Paramount Chief Joseph Chatoyer resisted European colonization until the Second Carib War (1795–1797) and British rule. Saint Vincent and the Grenadines achieved full independence from the United Kingdom on October 27, 1979.",
    economicOverview: "Agriculture (arrowroot starch, bananas, root crops), yacht tourism across the Grenadine cays (Bequia, Mustique, Canouan, Tobago Cays), and maritime shipping registries.",
    disputedTerritories: [],
    keyRecentMilestones: [
      "1763–1797: Carib Wars led by National Hero Chief Joseph Chatoyer against British colonial forces",
      "1979 (Oct 27): Independence of Saint Vincent and the Grenadines from the United Kingdom"
    ]
  },
  "Dominica": {
    name: "Commonwealth of Dominica",
    aliases: ["Dominica", "Waitukubuli", "Nature Island of the Caribbean"],
    capital: "Roseau",
    leader: "President Sylvanie Burton & Prime Minister Roosevelt Skerrit",
    population: "~73,000",
    governmentType: "Unitary Parliamentary Republic",
    recentHistory: "Named by Christopher Columbus on Sunday, November 3, 1493, rugged mountainous Dominica (Waitukubuli) remained a stronghold of the Kalinago people before French settlement and cession to Britain in 1763. Dominica gained independence as a parliamentary republic on November 3, 1978 and is home to the Kalinago Territory.",
    economicOverview: "Eco-tourism (Boiling Lake, Morne Trois Pitons National Park), geothermal power development, and tropical agriculture.",
    disputedTerritories: [],
    keyRecentMilestones: [
      "1763: Ceded by France to Great Britain under the Treaty of Paris",
      "1978 (Nov 3): Independence of the Commonwealth of Dominica as a parliamentary republic"
    ]
  },
  "Antigua and Barb.": {
    name: "Antigua and Barbuda",
    aliases: ["Antigua and Barb.", "Antigua and Barbuda", "Antigua", "Wadadli"],
    capital: "St. John's",
    leader: "King Charles III / Prime Minister Gaston Browne",
    population: "~94,000",
    governmentType: "Unitary Parliamentary Constitutional Monarchy",
    recentHistory: "Colonized by the English in 1632, Antigua served as the strategic headquarters of the British Royal Navy's Leeward Islands Station at Nelson's Dockyard (English Harbour) in the 18th century. Led by Sir Vere Cornwall Bird, Antigua and Barbuda achieved independence on November 1, 1981.",
    economicOverview: "Tourism ('365 Beaches'), yachting (Antigua Sailing Week), financial services, and regional aviation hub for the Leeward Islands.",
    disputedTerritories: [],
    keyRecentMilestones: [
      "1632 & 1725: English settlement and construction of Nelson's Dockyard at English Harbour",
      "1981 (Nov 1): Independence of Antigua and Barbuda under First Prime Minister Vere Bird"
    ]
  },
  "St. Kitts and Nevis": {
    name: "Federation of Saint Christopher and Nevis",
    aliases: ["St. Kitts and Nevis", "Saint Kitts and Nevis", "Saint Christopher and Nevis"],
    capital: "Basseterre",
    leader: "King Charles III / Prime Minister Terrance Drew",
    population: "~48,000",
    governmentType: "Federal Parliamentary Constitutional Monarchy",
    recentHistory: "Site of the first permanent British (1623) and French (1625) colonies in the Caribbean, Saint Kitts was defended by the massive Brimstone Hill Fortress ('Gibraltar of the West Indies') and was the birthplace of Alexander Hamilton (on Nevis). The twin-island federation gained independence on September 19, 1983—the smallest sovereign state in the Western Hemisphere.",
    economicOverview: "Luxury hospitality, financial services, citizenship-by-investment programs, and light electronics assembly.",
    disputedTerritories: [],
    keyRecentMilestones: [
      "1623: Sir Thomas Warner establishes the first English Caribbean colony on Saint Kitts",
      "1983 (Sept 19): Independence of the Federation of Saint Kitts and Nevis"
    ]
  },
  "Malta": {
    name: "Republic of Malta",
    aliases: ["Malta", "Melita", "Knights of Malta"],
    capital: "Valletta",
    leader: "President Myriam Spiteri Debono & Prime Minister Robert Abela",
    population: "~540,000",
    governmentType: "Unitary Parliamentary Republic (EU Member State)",
    recentHistory: "Home to some of the world's oldest free-standing megalithic temples (Ġgantija, c. 3600 BCE), Malta was ruled by Phoenicians, Carthaginians, Romans, Byzantines, Arabs, and Normans before Emperor Charles V granted the islands to the Knights Hospitaller of Saint John in 1530. After withstanding the Ottoman Great Siege of 1565 and the Axis air siege in WWII (earning the George Cross in 1942), Malta gained independence from Britain on September 21, 1964, became a republic in 1974, and joined the European Union in 2004.",
    economicOverview: "Advanced Eurozone economy anchored by transshipment ports (Malta Freeport), aviation maintenance, financial technology, semiconductor packaging, and cultural tourism.",
    disputedTerritories: [],
    keyRecentMilestones: [
      "1530–1798: Rule of the Knights of Saint John; victory in the Great Siege of Malta (1565) and founding of Valletta",
      "1800–1964: British Crown Colony and Mediterranean Fleet headquarters",
      "1964 (Sept 21): Independence from the UK; Republic declared in 1974; EU accession in 2004"
    ]
  },
  "Mauritius": {
    name: "Republic of Mauritius",
    aliases: ["Mauritius", "Isle de France", "Rodrigues"],
    capital: "Port Louis",
    leader: "Prime Minister Navin Ramgoolam & President Dharam Gokhool",
    population: "~1.30 Million",
    governmentType: "Unitary Parliamentary Republic",
    recentHistory: "Known to Arab and Portuguese mariners, the uninhabited island was colonized by the Dutch (1638–1710, who named it after Prince Maurice of Nassau), France (1715–1810 as Isle de France), and Great Britain (1810–1968). Under Sir Seewoosagur Ramgoolam, Mauritius gained independence on March 12, 1968 and became a republic in 1992, transforming from a monocrop sugar island into one of Africa's most prosperous democracies.",
    economicOverview: "Diversified Indian Ocean economy combining offshore financial services, information technology, textile manufacturing, hospitality, and sugarcane refining.",
    disputedTerritories: ["Chagos Archipelago (2024 UK-Mauritius agreement recognizing Mauritian sovereignty while maintaining joint US-UK base on Diego Garcia)", "Tromelin Island dispute with France"],
    keyRecentMilestones: [
      "1638–1810: Dutch Mauritius (1638–1710) and French Isle de France (1715–1810)",
      "1810–1968: British Crown Colony; abolition of slavery (1835) and arrival of Indian indentured workers at Aapravasi Ghat",
      "1968 (Mar 12): Independence of Mauritius; 2024 historic agreement with the UK on the Chagos Archipelago"
    ]
  },
  "Seychelles": {
    name: "Republic of Seychelles",
    aliases: ["Seychelles", "Mahé"],
    capital: "Victoria",
    leader: "President Wavel Ramkalawan",
    population: "~108,000",
    governmentType: "Unitary Presidential Republic",
    recentHistory: "An archipelago of 115 granitic and coral islands in the western Indian Ocean, Seychelles was claimed by France in 1756 and ceded to Great Britain under the 1814 Treaty of Paris. Administered separately from Mauritius as a British Crown Colony from 1903, Seychelles achieved independence on June 29, 1976.",
    economicOverview: "Boasts the highest nominal GDP per capita in Africa, driven by sustainable high-end eco-tourism, Indian Ocean tuna canning and transshipment at Port Victoria, and blue-economy marine conservation.",
    disputedTerritories: [],
    keyRecentMilestones: [
      "1756–1810: French colonization named after Controller-General Jean Moreau de Séchelles",
      "1811–1976: British administration; separate Crown Colony established in 1903",
      "1976 (June 29): Independence of the Republic of Seychelles"
    ]
  },
  "Comoros": {
    name: "Union of the Comoros",
    aliases: ["Comoros", "Juzur al-Qamar", "Grande Comore, Anjouan, Mohéli"],
    capital: "Moroni",
    leader: "President Azali Assoumani",
    population: "~850,000",
    governmentType: "Federal Presidential Republic",
    recentHistory: "Situated at the northern mouth of the Mozambique Channel between Madagascar and East Africa, the volcanic Comoro Islands were ruled for centuries by Swahili-Shirazi sultans before French protectorate treaties (1886) and colonial integration. Grande Comore, Anjouan, and Mohéli declared independence on July 6, 1975.",
    economicOverview: "World's leading producer of ylang-ylang essential oil (used in fine perfumes) and a major exporter of vanilla and cloves.",
    disputedTerritories: ["Claims the island of Mayotte (Maore), which voted to remain under French administration and became a French overseas department in 2011"],
    keyRecentMilestones: [
      "900–1886: Rule of the Swahili-Shirazi Sultanates across Ngazidja, Ndzuwani, and Mwali",
      "1975 (July 6): Declaration of independence from France"
    ]
  },
  "Cabo Verde": {
    name: "Republic of Cabo Verde (Cape Verde)",
    aliases: ["Cabo Verde", "Cape Verde"],
    capital: "Praia",
    leader: "President José Maria Neves & Prime Minister Ulisses Correia e Silva",
    population: "~590,000",
    governmentType: "Unitary Semi-Presidential Republic",
    recentHistory: "Uninhabited until Portuguese navigators arrived in 1456 and founded Ribeira Grande (now Cidade Velha) on Santiago in 1462—the first permanent European settlement in the tropics. Following the liberation movement led by Amílcar Cabral's PAIGC, Cabo Verde achieved independence from Portugal on July 5, 1975 and became a model of stable multi-party democracy in West Africa.",
    economicOverview: "Service-oriented economy centered on Atlantic tourism (Sal and Boa Vista), maritime transshipment at Mindelo, renewable wind/solar energy, and diaspora remittances.",
    disputedTerritories: [],
    keyRecentMilestones: [
      "1462: Founding of Ribeira Grande (Cidade Velha) by Portuguese settlers",
      "1975 (July 5): Independence of Cabo Verde from Portugal"
    ]
  },
  "São Tomé and Príncipe": {
    name: "Democratic Republic of São Tomé and Príncipe",
    aliases: ["São Tomé and Príncipe", "Sao Tome and Principe"],
    capital: "São Tomé",
    leader: "President Carlos Vila Nova & Prime Minister Patrice Trovoada",
    population: "~230,000",
    governmentType: "Unitary Semi-Presidential Republic",
    recentHistory: "Reached by Portuguese navigators João de Santarém and Pêro Escobar around 1470 in the equatorial Gulf of Guinea, the volcanic islands became the world's largest sugar producer in the 16th century and largest cocoa producer in the early 1900s (where Arthur Eddington photographed the 1919 solar eclipse confirming Einstein's General Relativity). São Tomé and Príncipe gained independence from Portugal on July 12, 1975.",
    economicOverview: "Organic fine-flavor cocoa and coffee exports, eco-tourism in Obô National Park, and offshore Gulf of Guinea petroleum exploration.",
    disputedTerritories: [],
    keyRecentMilestones: [
      "1470–1493: Portuguese settlement in the Gulf of Guinea",
      "1919 (May 29): Sir Arthur Eddington observes total solar eclipse on Príncipe, proving Einstein's theory of General Relativity",
      "1975 (July 12): Independence from Portugal"
    ]
  },
  "Samoa": {
    name: "Independent State of Samoa",
    aliases: ["Samoa", "Western Samoa"],
    capital: "Apia",
    leader: "O le Ao o le Malo Tuimalealiʻifano Vaʻaletoʻa Sualauvi II & PM Fiamē Naomi Mataʻafa",
    population: "~225,000",
    governmentType: "Unitary Parliamentary Republic with Traditional Matai System",
    recentHistory: "Cradle of Polynesian navigation and Faʻa Sāmoa culture for 3,000 years, Western Samoa was colonized by Imperial Germany (1900–1914) and administered by New Zealand under League of Nations and UN mandates (1914–1961), during which the non-violent Mau movement championed self-rule. On January 1, 1962, Samoa became the first Pacific island nation to regain independence.",
    economicOverview: "Agriculture (taro, coconut oil, nonu), Pacific fisheries, tourism, and remittances.",
    disputedTerritories: [],
    keyRecentMilestones: [
      "1900–1914: German Samoa administration at Apia",
      "1914–1961: New Zealand mandate/trusteeship and the Mau independence movement",
      "1962 (Jan 1): First Pacific Island nation to achieve modern independence"
    ]
  },
  "Tonga": {
    name: "Kingdom of Tonga",
    aliases: ["Tonga", "Friendly Islands"],
    capital: "Nukuʻalofa",
    leader: "King Tupou VI & Prime Minister Siaosi Sovaleni",
    population: "~107,000",
    governmentType: "Unitary Parliamentary Constitutional Monarchy",
    recentHistory: "Seat of the medieval Tuʻi Tonga maritime empire from 950 CE, Tonga was unified into a modern Christian constitutional monarchy by King George Tupou I in 1845 (1875 Constitution). Notably, Tonga never lost its indigenous monarchy to foreign colonization: it served as a self-governing British Protected State under the 1900 Treaty of Friendship until resuming full sovereign independence on June 4, 1970.",
    economicOverview: "Agriculture (squash, vanilla, kava, root crops), fisheries, tourism (whale watching in Vavaʻu), and remittances.",
    disputedTerritories: ["Minerva Reefs maritime claim with Fiji"],
    keyRecentMilestones: [
      "c. 950 CE: Rise of the Tuʻi Tonga Empire across the South Pacific",
      "1845 & 1875: King George Tupou I unifies Tonga and promulgates the 1875 Constitution",
      "1900–1970: British Protected State status under Queen Sālote Tupou III and King Tāufaʻāhau Tupou IV; full sovereignty restored June 4, 1970"
    ]
  },
  "Kiribati": {
    name: "Republic of Kiribati",
    aliases: ["Kiribati", "Gilbert Islands", "Tarawa", "Kiritimati"],
    capital: "South Tarawa",
    leader: "President Taneti Maamau",
    population: "~133,000",
    governmentType: "Unitary Parliamentary Republic with Executive President",
    recentHistory: "Comprising 32 coral atolls and Banaba across the Gilbert, Phoenix, and Line island groups straddling both the Equator and the 180th meridian, the Gilbert Islands became a British protectorate in 1892, witnessed the fierce WWII Battle of Tarawa (November 1943), and gained independence as the Republic of Kiribati on July 12, 1979.",
    economicOverview: "Commands a vast 3.5-million-km² Pacific Exclusive Economic Zone rich in skipjack tuna fishing licenses, alongside copra production and sovereign wealth returns (Revenue Equalization Reserve Fund).",
    disputedTerritories: [],
    keyRecentMilestones: [
      "1892–1979: British Gilbert and Ellice Islands Protectorate and Colony",
      "1943 (Nov): WWII Battle of Tarawa between US Marines and Imperial Japanese forces",
      "1979 (July 12): Independence of the Republic of Kiribati"
    ]
  },
  "Micronesia": {
    name: "Federated States of Micronesia",
    aliases: ["Micronesia", "FSM", "Federated States of Micronesia", "Caroline Islands"],
    capital: "Palikir (Pohnpei)",
    leader: "President Wesley Simina",
    population: "~115,000",
    governmentType: "Federal Non-Partisan Republic (Compact of Free Association with US)",
    recentHistory: "Comprising the four island states of Yap, Chuuk, Pohnpei (site of the ancient megalithic basalt city of Nan Madol), and Kosrae across the Caroline Islands, Micronesia was successively claimed by Spain (1686–1899), purchased by Germany (1899–1914), occupied by Japan (1914–1945, including the wartime naval base at Chuuk Lagoon), and administered by the United States under UN Trusteeship (1947–1986) before achieving independence under a Compact of Free Association on November 3, 1986.",
    economicOverview: "Pelagic tuna fishing licensing across a 2.6-million-km² EEZ, Compact of Free Association infrastructure grants, agriculture, and wreck-diving tourism in Chuuk Lagoon.",
    disputedTerritories: [],
    keyRecentMilestones: [
      "c. 1180–1628: Saudeleur Dynasty builds the megalithic lagoon city of Nan Madol on Pohnpei",
      "1899–1945: German New Guinea (1899–1914) and Japanese South Seas Mandate (1914–1945)",
      "1986 (Nov 3): Independence of the Federated States of Micronesia under Compact of Free Association with the United States"
    ]
  },
  "Marshall Is.": {
    name: "Republic of the Marshall Islands",
    aliases: ["Marshall Is.", "Marshall Islands", "Majuro", "Kwajalein", "Bikini Atoll"],
    capital: "Majuro",
    leader: "President Hilda Heine",
    population: "~42,000",
    governmentType: "Unitary Parliamentary Republic (Compact of Free Association with US)",
    recentHistory: "Famous for traditional Micronesian stick-chart wave navigation across the Ratak and Ralik coral atoll chains, the Marshall Islands were a German protectorate (1885–1914), part of the Japanese South Seas Mandate (1914–1944 until the WWII Battles of Kwajalein and Eniwetok), and part of the US-administered UN Trust Territory (1947–1986, including Cold War nuclear testing at Bikini and Enewetak atolls) before achieving sovereign independence on October 21, 1986.",
    economicOverview: "World's second-largest maritime ship registry, tuna processing and transshipment at Majuro, Ronald Reagan Ballistic Missile Defense Test Site lease at Kwajalein Atoll, and US Compact assistance.",
    disputedTerritories: ["Claims Wake Island (Enenkio), administered by the United States"],
    keyRecentMilestones: [
      "1885–1944: German protectorate (1885–1914) and Japanese Mandate (1914–1944)",
      "1986 (Oct 21): Sovereign independence under the Compact of Free Association with the United States"
    ]
  },
  "Palau": {
    name: "Republic of Palau (Belau)",
    aliases: ["Palau", "Belau", "Peleliu", "Koror"],
    capital: "Ngerulmud (Melekeok State)",
    leader: "President Surangel Whipps Jr.",
    population: "~18,000",
    governmentType: "Unitary Presidential Republic (Compact of Free Association with US)",
    recentHistory: "Renowned for its limestone Rock Islands and matrilineal clan governance, Palau was part of the Spanish East Indies until 1899, sold to Germany (1899–1914), served as the administrative capital of Japan's South Seas Mandate at Koror (1914–1944, site of the WWII Battle of Peleliu), and formed part of the US-administered UN Trust Territory until becoming a sovereign republic on October 1, 1994.",
    economicOverview: "High-value marine eco-tourism (Rock Islands Southern Lagoon & Palau National Marine Sanctuary covering 80% of its EEZ), fisheries, and US Compact cooperation.",
    disputedTerritories: [],
    keyRecentMilestones: [
      "1914–1944: Koror serves as capital of the Japanese South Seas Mandate; 1944 Battle of Peleliu",
      "1979: Palau adopts the world's first nuclear-free constitution",
      "1994 (Oct 1): Full sovereign independence under the Compact of Free Association; capital moved from Koror to Ngerulmud in 2006"
    ]
  },
  "Tuvalu": {
    name: "Tuvalu",
    aliases: ["Tuvalu", "Ellice Islands", "Funafuti"],
    capital: "Funafuti",
    leader: "King Charles III / Prime Minister Feleti Teo",
    population: "~11,400",
    governmentType: "Unitary Parliamentary Non-Partisan Constitutional Monarchy",
    recentHistory: "Settled by Polynesian navigators from Samoa and Tonga, the nine low-lying coral atolls (formerly the Ellice Islands) became a British protectorate in 1892 and were administered with the Gilbert Islands from 1916 until Tuvaluans voted for separate status in 1974, achieving full independence on October 1, 1978.",
    economicOverview: "Fisheries licensing revenues, leasing of the '.tv' internet top-level domain, Tuvalu Trust Fund returns, and climate resilience partnerships (2023 Falepili Union with Australia).",
    disputedTerritories: [],
    keyRecentMilestones: [
      "1892–1975: British Ellice Islands Protectorate and Gilbert and Ellice Islands Colony",
      "1978 (Oct 1): Independence of Tuvalu from the United Kingdom"
    ]
  },
  "Nauru": {
    name: "Republic of Nauru",
    aliases: ["Nauru", "Pleasant Island"],
    capital: "Yaren (De facto)",
    leader: "President David Adeang",
    population: "~12,800",
    governmentType: "Unitary Parliamentary Republic with Executive President",
    recentHistory: "The world's smallest island republic (21 km²), Nauru was annexed by Germany in 1888 following the discovery of rich phosphate rock deposits, captured by Australia in 1914, occupied by Japan during WWII (1942–1945), and placed under joint UN Trusteeship (Australia, UK, New Zealand) until achieving independence on January 31, 1968 under Hammer DeRoburt.",
    economicOverview: "Secondary phosphate mining, EEZ tuna fishing licenses, and regional processing services.",
    disputedTerritories: [],
    keyRecentMilestones: [
      "1888–1914: Part of the German Empire; phosphate mining begins in 1906",
      "1968 (Jan 31): Independence of the Republic of Nauru"
    ]
  },
  "Andorra": {
    name: "Principality of Andorra",
    aliases: ["Andorra"],
    capital: "Andorra la Vella",
    leader: "Co-Princes Joan Enric Vives Sicília & Emmanuel Macron / PM Xavier Espot Zamora",
    population: "~80,000",
    governmentType: "Unitary Parliamentary Diarchic Co-Principality",
    recentHistory: "Chartered by Charlemagne to buffer Christian Europe against Moorish raids, Andorra's unique diarchy was codified by the Paréage of 1278 between the Bishop of Urgell and the Count of Foix (whose title passed to the French Crown and later the President of France). In 1993, Andorra adopted its first written constitution and joined the United Nations.",
    economicOverview: "Pyrenean alpine tourism (skiing and duty-free retail), private banking, and hydroelectric energy.",
    disputedTerritories: [],
    keyRecentMilestones: [
      "1278 (Sept 8): Signing of the first Paréage of Andorra establishing the Co-Principality",
      "1419: Creation of the Consell de la Terra (General Council), one of Europe's oldest parliaments",
      "1993: Adoption of the modern Constitution of Andorra and admission to the UN"
    ]
  },
  "Monaco": {
    name: "Principality of Monaco",
    aliases: ["Monaco", "Monte Carlo"],
    capital: "Monaco",
    leader: "Sovereign Prince Albert II & Minister of State Didier Guillaume",
    population: "~39,000",
    governmentType: "Unitary Parliamentary Constitutional Monarchy",
    recentHistory: "Ruled continuously by the House of Grimaldi since François Grimaldi ('Il Malizia') seized the Rock of Monaco disguised as a Franciscan monk on January 8, 1297, Monaco's sovereignty was recognized by the 1861 Franco-Monegasque Treaty and modernized under Prince Rainier III and Prince Albert II.",
    economicOverview: "Global wealth management, luxury hospitality (Monte Carlo), marine research, high-value real estate, and international sporting events (Monaco Grand Prix).",
    disputedTerritories: [],
    keyRecentMilestones: [
      "1297 (Jan 8): François Grimaldi captures the fortress of Monaco, founding Grimaldi rule",
      "1861 & 1863: Franco-Monegasque Treaty and opening of the Monte Carlo Casino",
      "1993: Admission of Monaco as a full member state of the United Nations"
    ]
  },
  "Liechtenstein": {
    name: "Principality of Liechtenstein",
    aliases: ["Liechtenstein", "Vaduz"],
    capital: "Vaduz",
    leader: "Prince Hans-Adam II (Regent: Hereditary Prince Alois) & PM Daniel Risch",
    population: "~40,000",
    governmentType: "Unitary Parliamentary Semi-Constitutional Monarchy",
    recentHistory: "Formed within the Holy Roman Empire when Emperor Charles VI united the Lordship of Schellenberg and the County of Vaduz into an Imperial Principality on January 23, 1719 for the House of Liechtenstein. Achieving full sovereignty upon the dissolution of the Holy Roman Empire in 1806, Liechtenstein abolished its standing army in 1868 and entered a customs and monetary union with Switzerland in 1923–1924.",
    economicOverview: "One of the world's highest GDP-per-capita economies, led by precision high-tech manufacturing (Hilti, Ivoclar, ThyssenKrupp Presta) and financial services.",
    disputedTerritories: [],
    keyRecentMilestones: [
      "1719 (Jan 23): Emperor Charles VI elevates Vaduz and Schellenberg to the Imperial Principality of Liechtenstein",
      "1806: Gains full sovereignty upon dissolution of the Holy Roman Empire",
      "1923–1924: Customs union and adoption of the Swiss Franc with Switzerland"
    ]
  },
  "San Marino": {
    name: "Republic of San Marino (Most Serene Republic of San Marino)",
    aliases: ["San Marino"],
    capital: "San Marino",
    leader: "Captains Regent (Capitani Reggenti)",
    population: "~34,000",
    governmentType: "Unitary Parliamentary Diarchic Directorial Republic",
    recentHistory: "Founded according to tradition on September 3, 301 CE by the Christian stonemason Saint Marinus on Mount Titano, San Marino is the world's oldest surviving sovereign state and constitutional republic (governed by its 1600 Statutes). Having sheltered Giuseppe Garibaldi in 1849, San Marino's independence was respected during the 1861 unification of Italy.",
    economicOverview: "Tourism, precision manufacturing, ceramics, philatelic/numismatic issues, and banking.",
    disputedTerritories: [],
    keyRecentMilestones: [
      "301 CE: Traditional founding of the monastic community on Mount Titano by Saint Marinus",
      "1600: Promulgation of the Leges Statutae Republicae Sancti Marini, the world's oldest written governing constitution still in effect",
      "1862: Treaty of Friendship with the unified Kingdom of Italy guaranteeing Sammarinese independence"
    ]
  },
  "Vatican": {
    name: "Vatican City State (The Holy See)",
    aliases: ["Vatican", "Vatican City", "Holy See", "Papal States"],
    capital: "Vatican City",
    leader: "Sovereign of the Vatican City State (The Pope)",
    population: "~800",
    governmentType: "Unitary Ecclesiastical Elective Theocracy",
    recentHistory: "Spiritual and administrative center of the Roman Catholic Church since the martyrdom of Saint Peter and construction of Old St. Peter's Basilica under Emperor Constantine (c. 326 CE). From 754 to 1870, the Popes ruled the Papal States across central Italy; following the 1870 capture of Rome, the 'Roman Question' was resolved by the Lateran Treaty of February 11, 1929, establishing the independent State of Vatican City.",
    economicOverview: "Supported by worldwide Peter's Pence contributions, the Vatican Museums, St. Peter's Basilica pilgrim visits, and Vatican publishing/numismatics.",
    disputedTerritories: [],
    keyRecentMilestones: [
      "754–1870: Donation of Pepin establishes the Papal States across Central Italy",
      "1506–1626: Construction of the Renaissance St. Peter's Basilica and Michelangelo's Sistine Chapel ceiling",
      "1929 (Feb 11): Lateran Treaty with Italy establishes the sovereign Vatican City State"
    ]
  }
};

// Fuzzy finder for country profiles
export function getCountryProfile(countryName: string): CountryProfile | null {
  if (MODERN_COUNTRY_PROFILES[countryName]) {
    return MODERN_COUNTRY_PROFILES[countryName];
  }

  // Check aliases and partial names
  const lower = countryName.toLowerCase();
  for (const profile of Object.values(MODERN_COUNTRY_PROFILES)) {
    if (
      profile.name.toLowerCase().includes(lower) ||
      profile.aliases.some((a) => a.toLowerCase() === lower || lower.includes(a.toLowerCase()))
    ) {
      return profile;
    }
  }

  return null;
}
