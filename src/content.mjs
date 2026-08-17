/* Kaktus Espressobar - content.
   Icelandic is the source language; English is the translation.
   Every fact here is either read off the live site on 2026-08-16 or transcribed from the
   café's own photographs. Nothing is invented. Where a fact is missing (owner names, the
   full food menu, the roaster) the page says nothing rather than guessing. */

export const STUDIO = {
  name: 'SNDR Studio',
  url: 'https://sndr-studio.pages.dev',
  /* the studio's own mark, from sndr-studio/public/favicon.svg */
  markPath: 'M50 14 Q54.7 45.3 86 50 Q54.7 54.7 50 86 Q45.3 54.7 14 50 Q45.3 45.3 50 14 Z',
  markColor: '#ff4b1a',
};

export const SITE = {
  brand: 'Kaktus',
  brandFull: 'Kaktus Espressobar',
  origin: 'https://kaktusespressobar.com',
  email: 'kaktusespressobar@gmail.com',
  instagram: 'https://www.instagram.com/kaktusespressobar/',
  instagramHandle: '@kaktusespressobar',
  rooms: [
    {
      id: 'vitastigur',
      name: 'Vitastígur 12',
      area: '101 Reykjavík',
      phone: '869 3030',
      phoneTel: '+3548693030',
      lat: 64.1435,
      lon: -21.9223,
      hours: [
        { days: 'Mo,Tu,We,Th,Fr', opens: '07:30', closes: '17:00' },
        { days: 'Sa,Su', opens: '09:00', closes: '17:00' },
      ],
    },
    {
      id: 'listasafn',
      name: 'Fríkirkjuvegur 7',
      area: '101 Reykjavík',
      phone: '869 3035',
      phoneTel: '+3548693035',
      lat: 64.1444,
      lon: -21.9337,
      hours: [{ days: 'Mo,Tu,We,Th,Fr,Sa,Su', opens: '10:00', closes: '17:00' }],
    },
  ],
};

/* Drinks: names and prices transcribed from the café's own chalkboard photograph
   (_assets/chalkboard.jpg). The photo is undated, so the page carries a note. */
export const DRINKS = [
  { is: 'Cappuccino', en: 'Cappuccino', price: '750 / 790' },
  { is: 'Flat white', en: 'Flat white', price: '750 / 790' },
  { is: 'Americano', en: 'Americano', price: '660 / 700' },
  { is: 'Latte', en: 'Latte', price: '820' },
  { is: 'Cortado', en: 'Cortado', price: '720' },
  { is: 'Te', en: 'Tea', price: '690' },
  { is: 'Matcha latte', en: 'Matcha latte', price: '920' },
  { is: 'Chai latte', en: 'Chai latte', price: '860' },
  { is: 'Turmeric latte', en: 'Turmeric latte', price: '920' },
  { is: 'Heitt súkkulaði', en: 'Hot chocolate', price: '790' },
  { is: 'Swiss mokka', en: 'Swiss mocha', price: '920' },
];

export const EXTRAS = [
  { is: 'Síróp', en: 'Syrup', price: '110' },
  { is: 'Aukaskot', en: 'Extra shot', price: '150' },
];

/* The two breakfast items are the only real, priced food on the live site today. */
export const BREAKFAST = [
  {
    is: 'Hafragrautur',
    en: 'Oat porridge',
    price: '1090',
    isDesc: 'Yfir nótt hafrar með heimagerðu eplamauki, möndlusmjöri, bönunum og möndluflögum.',
    enDesc: 'Overnight oats with house apple compote, almond butter, banana and almond flakes.',
  },
  {
    is: 'Chiagrautur',
    en: 'Chia pudding',
    price: '1090',
    isDesc: 'Með heimagerðu berjamauki, kókosflögum og bláberjum.',
    enDesc: 'With house berry compote, coconut flakes and blueberries.',
  },
];

/* Described, not priced: these are dishes visible in the café's own photographs.
   Prices come from the owners at handover. */
export const KITCHEN = [
  {
    is: 'Focaccia',
    en: 'Focaccia',
    isDesc: 'Bökuð focaccia með hráskinku, mozzarella, tómat og klettasalati.',
    enDesc: 'Baked focaccia with prosciutto, mozzarella, tomato and rocket.',
    img: 'focaccia',
  },
  {
    is: 'Súpa dagsins',
    en: 'Soup of the day',
    isDesc: 'Borin fram með súrdeigsbrauði og smjöri.',
    enDesc: 'Served with sourdough and butter.',
    img: 'supa',
  },
  {
    is: 'Súrdeigssamloka',
    en: 'Sourdough sandwich',
    isDesc: 'Súrdeig, mozzarella, tómatur og fersk basilíka.',
    enDesc: 'Sourdough, mozzarella, tomato and fresh basil.',
    img: 'samloka',
  },
  {
    is: 'Kaka dagsins',
    en: 'Cake of the day',
    isDesc: 'Bakað á staðnum, breytist eftir dögum.',
    enDesc: 'Baked in house, changes daily.',
    img: 'kaka',
  },
];

/* Aperture reels. Each chapter's aperture cuts through its own set of frames.
   Order is the cut order; the swap is a hard cut, one frame per scroll beat. */
export const REELS = {
  hero: [
    { img: 'uti', is: 'Borð úti á Vitastíg með latte, súrdeigsbrauði og blómum', en: 'An outdoor table on Vitastígur with a latte, sourdough and flowers' },
    { img: 'latte', is: 'Latte með laufmynstri í svörtum bolla á viðarborði', en: 'A latte with leaf art in a black cup on a wooden table' },
    { img: 'kaffi-hond', is: 'Hönd heldur á lattebolla yfir viðarborði', en: 'A hand holding a latte cup above a wooden table' },
    { img: 'focaccia', is: 'Focaccia með hráskinku og mozzarella á diski', en: 'Focaccia with prosciutto and mozzarella on a plate' },
    { img: 'samloka', is: 'Súrdeigssamloka með tómat og mozzarella', en: 'A sourdough sandwich with tomato and mozzarella' },
  ],
  vitastigur: [
    { img: 'americano', is: 'Americano í rauðum bolla við hlið dagblaðs', en: 'An americano in a red cup beside a newspaper' },
    { img: 'supa', is: 'Tómatsúpa með brauði og smjöri', en: 'Tomato soup with bread and butter' },
    { img: 'tvo-kaffi', is: 'Tveir kaffibollar á borði við pottaplöntu', en: 'Two coffee cups on a table beside a house plant' },
    { img: 'kaka', is: 'Bleikt rauðrófulatte og kökusneið á blómamynstruðum diski', en: 'A pink beetroot latte and a slice of cake on a patterned plate' },
  ],
  listasafn: [
    { img: 'listo-krit', is: 'Krítartaflan með drykkjunum í Listasafni Íslands', en: 'The chalkboard drinks list at the National Gallery of Iceland' },
    { img: 'listo-bar', is: 'Barinn og bakkelsisborðið í Listasafni Íslands', en: 'The counter and pastry case at the National Gallery of Iceland' },
    { img: 'listo-salur', is: 'Gestir við borð í bjarta salnum í Listasafni Íslands', en: 'Guests at tables in the bright room at the National Gallery of Iceland' },
  ],
};

export const GALLERY = [
  { img: 'latte', is: 'Latte, Vitastígur', en: 'Latte, Vitastígur' },
  { img: 'uti', is: 'Úti á Vitastíg', en: 'Outside on Vitastígur' },
  { img: 'listo-salur', is: 'Salurinn í Listasafninu', en: 'The room at the National Gallery' },
  { img: 'samloka', is: 'Súrdeigssamloka', en: 'Sourdough sandwich' },
  { img: 'kaktus', is: 'Kaktusar á barnum', en: 'Cacti on the counter' },
  { img: 'listo-bar', is: 'Barinn í Listasafninu', en: 'The counter at the National Gallery' },
  { img: 'tvo-kaffi', is: 'Tveir bollar', en: 'Two cups' },
];

const shared = {
  drinks: DRINKS,
  extras: EXTRAS,
  breakfast: BREAKFAST,
  kitchen: KITCHEN,
  gallery: GALLERY,
};

export const COPY = {
  is: {
    ...shared,
    lang: 'is',
    other: { code: 'en', label: 'EN', href: 'en/' },
    self: { code: 'is', label: 'IS' },
    langLabel: 'Tungumál',
    title: 'Kaktus Espressobar, kaffihús á Vitastíg og í Listasafni Íslands',
    description:
      'Kaktus Espressobar er kaffihús í miðbæ Reykjavíkur. Tveir staðir: Vitastígur 12 og Fríkirkjuvegur 7 í Listasafni Íslands. Matseðill, opnunartímar og leiðin að okkur.',
    nav: [
      { href: '#matsedill', label: 'Matseðill' },
      { href: '#filman', label: 'Filman' },
      { href: '#stadir', label: 'Staðirnir' },
      { href: '#um-okkur', label: 'Um okkur' },
    ],
    skip: 'Beint í efni',
    hero: {
      wordmark: 'Kaktus',
      over: 'Espressobar',
      leftLabel: 'Vitastígur', leftValue: '12',
      rightLabel: 'Fríkirkjuvegur', rightValue: '7',
      under: '101 Reykjavík',
      title: 'Kaffi og súrdeig',
      meta: ['Vitastígur 12', 'Fríkirkjuvegur 7', 'Listasafn Íslands'],
      sub: 'Kaffihús á tveimur stöðum í miðbæ Reykjavíkur. Espressó, súrdeig og pláss til að sitja.',
      ctaMenu: 'Matseðill',
      ctaVisit: 'Finna okkur',
      imgAlt: 'Salurinn í Kaktus Espressobar í Listasafni Íslands, gestir við borð undir verkum á veggjunum',
    },
    marquee: ['Opið alla daga', 'Vitastígur 12', 'Fríkirkjuvegur 7', 'Espressó frá hálf átta'],
    statement: {
      lines: ['Lagað af fólki', 'sem drekkur það sjálft'],
      body:
        'Hér flýtir sér enginn. Espressóinn er dreginn þegar hann er pantaður, brauðið skorið þegar það er borðað, og enginn er rekinn úr sætinu sínu.',
    },
    call: {
      heading: 'Ertu að leita að matseðlinum?',
      cta: 'Sjá matseðil',
      imgAlt: 'Focaccia með hráskinku og mozzarella á diski',
    },
    film: {
      heading: 'Dagur á Kaktus',
      body:
        'Venjulegur morgunn á sex sekúndum: hurðin, könnurnar, brauðið og bollinn sem réttur er yfir barinn. Ekkert sviðsett, bara staðirnir okkar tveir.',
      credits: [
        { k: 'Staðir', v: 'Vitastígur 12 og Fríkirkjuvegur 7' },
        { k: 'Lengd', v: '6 sekúndur' },
        { k: 'Myndir', v: 'Kaktus Espressobar' },
        { k: 'Klipping', v: '27 klippur' },
      ],
      videoLabel: 'Stutt kvikmynd frá Kaktus Espressobar, hljóðlaus og í lykkju',
    },
    menu: {
      heading: 'Matseðill',
      drinksTitle: 'Á könnunni',
      extrasTitle: 'Aukalega',
      breakfastTitle: 'Morgunmatur',
      kitchenTitle: 'Úr eldhúsinu',
      priceNote:
        'Verð á drykkjum eru tekin af krítartöflunni okkar og verða staðfest fyrir opnun. Réttir úr eldhúsinu fá verð þegar matseðill dagsins liggur fyrir.',
      kr: 'kr',
    },
    coffee: {
      heading: 'Kaffið',
      body:
        'Espresso, hægt kaffi og latte sem má fá með matcha, chai eða turmerik. Allt lagað í bollann sem þú færð hann í.',
      frames: [
        { img: 'americano', is: 'Americano og morgunblaðið', alt: 'Americano í rauðum bolla við hlið dagblaðs' },
        { img: 'kaffi-hond', is: 'Latte, borinn fram', alt: 'Hönd heldur á lattebolla yfir viðarborði' },
        { img: 'tvo-kaffi', is: 'Tveir bollar, eitt borð', alt: 'Tveir kaffibollar á borði við pottaplöntu' },
        { img: 'kaka', is: 'Bleikt latte og kaka dagsins', alt: 'Bleikt rauðrófulatte og kökusneið á blómamynstruðum diski' },
      ],
    },
    rooms: {
      heading: 'Staðirnir',
      vitastigur: {
        name: 'Vitastígur 12',
        blurb:
          'Upprunalegi staðurinn, steinsnar frá Laugavegi og þrjár mínútur frá Hlemmi. Lítið rými, hlýtt og fullt af plöntum. Hér byrjar dagurinn klukkan hálf átta.',
        hours: [
          { d: 'Mánudaga til föstudaga', t: '07:30 til 17:00' },
          { d: 'Laugardaga og sunnudaga', t: '09:00 til 17:00' },
        ],
        alt: 'Barinn á Vitastíg 12 í svarthvítu',
      },
      listasafn: {
        name: 'Fríkirkjuvegur 7',
        sub: 'Í Listasafni Íslands',
        blurb:
          'Bjartari salurinn. Hvítir veggir, verk allan hringinn og gluggar út að Tjörninni. Opið alla daga, eins og safnið.',
        hours: [{ d: 'Alla daga', t: '10:00 til 17:00' }],
        alt: 'Bjarti salurinn í Listasafni Íslands með gestum við borð',
      },
      phoneLabel: 'Sími',
    },
    gallery: { heading: 'Myndir' },
    about: {
      heading: 'Um okkur',
      body1:
        'Kaktus er lítið kaffihús sem varð að tveimur. Fyrst á Vitastíg, þar sem rýmið er þröngt og sama fólkið kemur aftur, og síðan í Listasafni Íslands, þar sem salurinn er bjartur og gestirnir á leið inn á sýningu.',
      body2:
        'Sama kaffi á báðum stöðum, sama brauð, sama fólk á bak við barinn. Það eina sem breytist er birtan.',
      alt: 'Eigendur Kaktus Espressobar við barinn',
      note: 'Nöfn og saga eigenda koma inn þegar þau berast.',
    },
    footer: {
      heading: 'Komdu við',
      hoursLabel: 'Opnunartímar',
      emailLabel: 'Netfang',
      socialLabel: 'Instagram',
      colophon: 'Frumgerð að nýrri vefsíðu fyrir Kaktus Espressobar',
      builtBy: 'Hönnun og smíði',
      credit: 'SNDR Studio',
    },
    a11y: {
      apertureLabel: 'Myndir frá Kaktus, skipta um mynd við skrun',
      toTop: 'Upp',
    },
  },

  en: {
    ...shared,
    lang: 'en',
    other: { code: 'is', label: 'IS', href: '../' },
    self: { code: 'en', label: 'EN' },
    langLabel: 'Language',
    title: 'Kaktus Espressobar, coffee on Vitastígur and at the National Gallery',
    description:
      'Kaktus Espressobar is a coffee house in central Reykjavík. Two rooms: Vitastígur 12 and Fríkirkjuvegur 7 inside the National Gallery of Iceland. Menu, opening hours and how to find us.',
    nav: [
      { href: '#matsedill', label: 'Menu' },
      { href: '#filman', label: 'The film' },
      { href: '#stadir', label: 'Rooms' },
      { href: '#um-okkur', label: 'About' },
    ],
    skip: 'Skip to content',
    hero: {
      wordmark: 'Kaktus',
      over: 'Espressobar',
      leftLabel: 'Vitastígur', leftValue: '12',
      rightLabel: 'Fríkirkjuvegur', rightValue: '7',
      under: '101 Reykjavík',
      title: 'Coffee and sourdough',
      meta: ['Vitastígur 12', 'Fríkirkjuvegur 7', 'National Gallery'],
      sub: 'A coffee house in two rooms in central Reykjavík. Espresso, sourdough and somewhere to sit.',
      ctaMenu: 'Menu',
      ctaVisit: 'Find us',
      imgAlt: 'The room at Kaktus Espressobar inside the National Gallery of Iceland, guests at tables beneath artworks',
    },
    marquee: ['Open every day', 'Vitastígur 12', 'Fríkirkjuvegur 7', 'Espresso from half seven'],
    statement: {
      lines: ['Made by people', 'who drink it themselves'],
      body:
        'Nobody here is in a hurry. The espresso is pulled when it is ordered, the bread is cut when it is eaten, and nobody is moved out of their seat.',
    },
    call: {
      heading: 'Looking for the menu?',
      cta: 'See the menu',
      imgAlt: 'Focaccia with prosciutto and mozzarella on a plate',
    },
    film: {
      heading: 'A day at Kaktus',
      body:
        'An ordinary morning in six seconds: the door, the jugs, the bread and the cup handed across the bar. Nothing staged, just our two rooms.',
      credits: [
        { k: 'Rooms', v: 'Vitastígur 12 and Fríkirkjuvegur 7' },
        { k: 'Length', v: '6 seconds' },
        { k: 'Pictures', v: 'Kaktus Espressobar' },
        { k: 'Cuts', v: '27 cuts' },
      ],
      videoLabel: 'A short film from Kaktus Espressobar, silent and looping',
    },
    menu: {
      heading: 'Menu',
      drinksTitle: 'From the bar',
      extrasTitle: 'Add',
      breakfastTitle: 'Breakfast',
      kitchenTitle: 'From the kitchen',
      priceNote:
        'Drink prices are taken from our own chalkboard and will be confirmed before launch. Kitchen dishes get their prices once the daily menu is set.',
      kr: 'ISK',
    },
    coffee: {
      heading: 'The coffee',
      body:
        'Espresso, slow coffee, and lattes that can be had with matcha, chai or turmeric. All of it made into the cup you get it in.',
      frames: [
        { img: 'americano', is: 'Americano and the morning paper', alt: 'An americano in a red cup beside a newspaper' },
        { img: 'kaffi-hond', is: 'A latte, handed over', alt: 'A hand holding a latte cup above a wooden table' },
        { img: 'tvo-kaffi', is: 'Two cups, one table', alt: 'Two coffee cups on a table beside a house plant' },
        { img: 'kaka', is: 'Beetroot latte and cake of the day', alt: 'A pink beetroot latte and a slice of cake on a patterned plate' },
      ],
    },
    rooms: {
      heading: 'The rooms',
      vitastigur: {
        name: 'Vitastígur 12',
        blurb:
          'The original room, a step off Laugavegur and three minutes from Hlemmur. Small, warm and full of plants. The day starts here at half seven.',
        hours: [
          { d: 'Monday to Friday', t: '07:30 to 17:00' },
          { d: 'Saturday and Sunday', t: '09:00 to 17:00' },
        ],
        alt: 'The counter at Vitastígur 12 in black and white',
      },
      listasafn: {
        name: 'Fríkirkjuvegur 7',
        sub: 'Inside the National Gallery of Iceland',
        blurb:
          'The brighter room. White walls, art the whole way round and windows onto the pond. Open every day the gallery is.',
        hours: [{ d: 'Every day', t: '10:00 to 17:00' }],
        alt: 'The bright room at the National Gallery of Iceland with guests at tables',
      },
      phoneLabel: 'Phone',
    },
    gallery: { heading: 'Pictures' },
    about: {
      heading: 'About',
      body1:
        'Kaktus is a small coffee house that became two. First on Vitastígur, where the room is tight and the same people keep coming back, then inside the National Gallery, where the hall is bright and the guests are on their way to an exhibition.',
      body2:
        'Same coffee in both rooms, same bread, same people behind the bar. The only thing that changes is the light.',
      alt: 'The owners of Kaktus Espressobar at the counter',
      note: 'Owner names and the founding story go in once we have them.',
    },
    footer: {
      heading: 'Come by',
      hoursLabel: 'Opening hours',
      emailLabel: 'Email',
      socialLabel: 'Instagram',
      colophon: 'Prototype for a new Kaktus Espressobar website',
      builtBy: 'Designed and built by',
      credit: 'SNDR Studio',
    },
    a11y: {
      apertureLabel: 'Pictures from Kaktus, changing as you scroll',
      toTop: 'Top',
    },
  },
};
