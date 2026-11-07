// All business content lives here. Edit this file to change prices, towns, services.
const W = 'https://static.wixstatic.com/media/';

const business = {
  name: 'Dumpster Dawgs LLC',
  short: 'Dumpster Dawgs',
  tagline: 'Big or small, we haul it all.',
  slogan: 'Dump it. We haul it.',
  phone: '774-297-3341',
  phoneHref: '+17742973341',
  email: 'info@dumpsterdawgsLLC.net',
  street: '2 Summer St',
  city: 'Wareham',
  state: 'MA',
  zip: '02571',
  url: process.env.SITE_URL || 'https://www.dumpsterdawgsllc.net',
  facebook: 'https://www.facebook.com/profile.php?id=61571004483587',
  dogs: ['Bernie', 'Pete'],
};

// Images are currently hotlinked from the old Wix media library.
// To self-host: save each into /public/img and swap the URL for '/img/<file>'.
const img = {
  logo: W + '70183d_18a70efc5fa4458f96d562346da40fe6~mv2.jpg',
  truck: W + '70183d_313e521087cc4993a970feadf334d340~mv2.jpeg',
  military: W + '70183d_0fac103454994171bc38db53bd8a5613~mv2.png',
  priceSheet: W + '70183d_fd1302f40759475fb3111400f77e79f5~mv2.png',
  sizeChart: W + '70183d_b39084d8b6df4971af5ec08b62acac09~mv2.png',
  gallery: [
    W + '70183d_210121c4b97d44408dfe7f0435019009~mv2.jpg',
    W + '70183d_a68c0980c7a5483f8127f9a8b4c573ae~mv2.jpg',
    W + '70183d_237d9bdb80d644efa91ce2b321824d70~mv2.jpg',
    W + '70183d_10b0fe80e00e43198452cd35a6ddb036~mv2.jpg',
    W + '70183d_313e521087cc4993a970feadf334d340~mv2.jpeg',
  ],
};

const sizes = [
  {
    slug: '10-yard-dumpster',
    yards: 10,
    price: 495,
    days: 7,
    tons: '1 ton',
    lbs: '2,000 lbs',
    dims: { l: "12'", w: "8'", h: "3.5'" },
    pickups: 4,
    bags: '50–70',
    bestFor: 'Small projects & cleanouts',
    examples: ['Yard waste — branches, leaves, grass', 'Household cleanouts — furniture, boxes, misc. junk', 'Small renovation debris — drywall, flooring, tile'],
    perfectFor: ['DIY projects', 'Small remodels', 'Garage & basement cleanouts', 'Landscaping'],
  },
  {
    slug: '15-yard-dumpster',
    yards: 15,
    price: 595,
    days: 7,
    tons: '1.5 tons',
    lbs: '3,000 lbs',
    dims: { l: "12'", w: "8'", h: "4.5'" },
    pickups: 6,
    bags: '80–100',
    bestFor: 'Medium projects & larger cleanups',
    examples: ['Large renovation projects — drywall, wood, flooring, cabinets', 'Furniture & mattress cleanouts', 'Heavy yard waste — tree limbs, brush, shrubs'],
    perfectFor: ['Home renovations', 'Roofing projects', 'Estate cleanouts', 'Landscaping', 'Small construction'],
  },
];

const overage = '$65 per 500 lbs over the included weight';

const extras = [
  { item: 'Mattress / box spring', fee: '$50 each' },
  { item: 'Tires', fee: '$35 each' },
  { item: 'Propane tanks, AC units, refrigerators, dehumidifiers, TVs, monitors', fee: '$25 each' },
];

const services = [
  {
    slug: 'home-cleanouts',
    name: 'Home Cleanouts',
    short: 'Clearing out a house, attic, or a lifetime of stuff.',
    size: 15,
    icon: 'home',
    body: [
      'Whether you are moving, downsizing, or finally tackling the rooms nobody goes in, a dumpster in the driveway turns a month of dump runs into one weekend.',
      'Furniture, boxes, old clothes, broken toys, junk from the shed — toss it in, we haul it out. Mattresses, TVs and appliances can go too for a small per-item fee.',
    ],
    items: ['Furniture & couches', 'Boxes & household junk', 'Toys, clothes & décor', 'Shed & attic contents'],
  },
  {
    slug: 'renovation-debris',
    name: 'Renovation & Remodel Debris',
    short: 'Kitchens, baths, flooring, drywall — rip it out and toss it.',
    size: 15,
    icon: 'hammer',
    body: [
      'Remodels make a mess fast. Drywall, old cabinets, flooring, tile and lumber pile up by the hour. Keep the job site clean and safe with a dumpster dropped right where you need it.',
      'Contractors and homeowners both use us — book in advance for a scheduled demo day or call for same-day or next-day delivery.',
    ],
    items: ['Drywall & plaster', 'Cabinets & countertops', 'Flooring, carpet & tile', 'Lumber & trim'],
  },
  {
    slug: 'roofing-dumpsters',
    name: 'Roofing Projects',
    short: 'Shingle tear-offs and re-roofs. Heavy stuff, handled.',
    size: 15,
    icon: 'roof',
    body: [
      'Roofing debris is heavy, so size and weight matter. Our 15 yard includes 1.5 tons and is the go-to for re-roofs; smaller jobs and sheds fit fine in a 10 yard.',
      'Tell us the square footage and number of layers when you call and we will help you pick the right box so you are not paying overweight fees you did not plan for.',
    ],
    items: ['Asphalt shingles', 'Underlayment & felt', 'Old sheathing & plywood', 'Gutters & flashing'],
  },
  {
    slug: 'yard-waste',
    name: 'Yard Waste & Landscaping',
    short: 'Brush, limbs, leaves and storm cleanup.',
    size: 10,
    icon: 'tree',
    body: [
      'Spring cleanups, fall leaves, overgrown lots and storm damage — yard waste takes up a lot of room in a pickup but drops right into a dumpster.',
      'Light stuff like leaves and grass fits great in a 10 yard. Heavy limbs, stumps, brush and shrub removal usually call for the 15.',
    ],
    items: ['Branches & tree limbs', 'Brush & shrubs', 'Leaves & grass clippings', 'Old fencing & landscape timbers'],
  },
  {
    slug: 'estate-cleanouts',
    name: 'Estate Cleanouts',
    short: 'Respectful, no-fuss help when a family home needs clearing.',
    size: 15,
    icon: 'key',
    body: [
      'Clearing out a loved one’s home is hard enough. We make the hauling part easy — one call, a dumpster on site when you need it, and gone when you are done.',
      'Need a little extra time? Just ask. Flexible options are how we do business.',
    ],
    items: ['Furniture & beds', 'Household contents', 'Basement & garage items', 'Old appliances (per-item fee)'],
  },
  {
    slug: 'garage-basement-cleanouts',
    name: 'Garage & Basement Cleanouts',
    short: 'Get your car back in the garage.',
    size: 10,
    icon: 'garage',
    body: [
      'Years of storage add up. A 10 yard holds about four pickup loads — usually plenty for a garage or basement purge.',
      'Old shelving, broken tools, boxes, bikes and junk furniture all go. Ask us about propane tanks and appliances before you toss them.',
    ],
    items: ['Shelving & storage', 'Old furniture', 'Boxes & bins', 'Bikes, tools & sports gear'],
  },
  {
    slug: 'contractor-dumpsters',
    name: 'Contractor Rentals',
    short: 'Reliable drop-offs and swaps for the trades.',
    size: 15,
    icon: 'hardhat',
    body: [
      'Builders, roofers, landscapers and remodelers — we know your schedule does not wait. Same-day or next-day delivery when we can, booked drops when you plan ahead.',
      'Straight pricing, no hidden fees, and a local crew you can actually reach on the phone. Call or text to set up your next drop.',
    ],
    items: ['Small construction', 'Demo & tear-outs', 'Roofing & siding', 'Landscape jobs'],
  },
];

// Service area. region drives copy on town pages.
const regions = {
  home: { name: 'Wareham & Plymouth County', blurb: 'our home turf — we are based right on Summer Street in Wareham' },
  cape: { name: 'Cape Cod', blurb: 'over the bridges and down the Cape' },
  south_shore: { name: 'South Shore', blurb: 'up Route 3 through the South Shore' },
  south_coast: { name: 'South Coast', blurb: 'west along Buzzards Bay on the South Coast' },
};

const towns = [
  // Home base
  ['Wareham', 'home', ['Onset', 'West Wareham', 'Swifts Beach', 'Parkwood Beach']],
  ['Onset', 'home', ['Onset Bay', 'Point Independence', 'East Wareham']],
  ['Marion', 'home', ['Marion Village', 'Sippican', 'Converse Point']],
  ['Rochester', 'home', ['North Rochester', 'Rochester Center']],
  ['Carver', 'home', ['North Carver', 'South Carver']],
  ['Middleborough', 'home', ['Middleborough Center', 'North Middleborough', 'Rock Village']],
  ['Lakeville', 'home', ['Lakeville Center', 'Long Pond area']],
  ['Plymouth', 'home', ['Manomet', 'Cedarville', 'North Plymouth', 'The Pinehills']],
  ['Kingston', 'home', ['Kingston Center', 'Rocky Nook']],
  ['Plympton', 'home', ['Plympton Center']],
  ['Halifax', 'home', ['Halifax Center', 'Monponsett']],
  // Cape
  ['Bourne', 'cape', ['Buzzards Bay', 'Sagamore', 'Pocasset', 'Cataumet', 'Monument Beach']],
  ['Buzzards Bay', 'cape', ['Main Street', 'Gray Gables', 'Bournedale']],
  ['Sandwich', 'cape', ['East Sandwich', 'Forestdale', 'Sandwich Village']],
  ['Falmouth', 'cape', ['East Falmouth', 'North Falmouth', 'West Falmouth', 'Teaticket', 'Woods Hole']],
  ['Mashpee', 'cape', ['New Seabury', 'Popponesset', 'Mashpee Commons']],
  ['Barnstable', 'cape', ['Centerville', 'Osterville', 'Cotuit', 'Marstons Mills', 'West Barnstable']],
  ['Hyannis', 'cape', ['Hyannis Port', 'West Hyannisport', 'Downtown Hyannis']],
  ['Yarmouth', 'cape', ['South Yarmouth', 'West Yarmouth', 'Yarmouth Port']],
  ['Dennis', 'cape', ['Dennis Port', 'East Dennis', 'South Dennis', 'West Dennis']],
  ['Brewster', 'cape', ['East Brewster', 'West Brewster']],
  ['Harwich', 'cape', ['Harwich Port', 'East Harwich', 'West Harwich']],
  ['Chatham', 'cape', ['North Chatham', 'West Chatham', 'South Chatham']],
  ['Orleans', 'cape', ['East Orleans', 'South Orleans']],
  // South Coast
  ['Mattapoisett', 'south_coast', ['Mattapoisett Village', 'Mattapoisett Neck', 'Brandt Island']],
  ['Fairhaven', 'south_coast', ['Sconticut Neck', 'West Island', 'Fairhaven Center']],
  ['Acushnet', 'south_coast', ['Acushnet Center', 'Long Plain']],
  ['New Bedford', 'south_coast', ['North End', 'South End', 'West End', 'Downtown']],
  ['Dartmouth', 'south_coast', ['North Dartmouth', 'South Dartmouth', 'Padanaram']],
  ['Westport', 'south_coast', ['Central Village', 'Westport Point', 'North Westport']],
  ['Freetown', 'south_coast', ['Assonet', 'East Freetown']],
  // South Shore
  ['Duxbury', 'south_shore', ['Duxbury Village', 'Ashdod', 'Tinkertown']],
  ['Marshfield', 'south_shore', ['Green Harbor', 'Brant Rock', 'Marshfield Hills']],
  ['Pembroke', 'south_shore', ['North Pembroke', 'Bryantville']],
  ['Hanson', 'south_shore', ['South Hanson', 'Hanson Center']],
  ['Bridgewater', 'south_shore', ['Bridgewater Center', 'Scotland']],
  ['East Bridgewater', 'south_shore', ['Elmwood', 'East Bridgewater Center']],
  ['West Bridgewater', 'south_shore', ['Cochesett', 'West Bridgewater Center']],
  ['Raynham', 'south_shore', ['Raynham Center', 'North Raynham']],
].map(([name, region, areas]) => ({
  name,
  region,
  areas,
  slug: 'dumpster-rental-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-ma',
}));

const faqs = [
  ['How fast can you deliver?', 'Same-day or next-day delivery is often available — call or text and we will tell you exactly when we can drop. You can also book in advance.'],
  ['How long can I keep the dumpster?', 'Every rental includes 7 days. Need it longer? Just ask — we are flexible.'],
  ['How much weight is included?', 'The 10 yard includes 1 ton (2,000 lbs). The 15 yard includes 1.5 tons (3,000 lbs). Anything over is $65 per 500 lbs.'],
  ['Which size do I need?', 'A 10 yard holds about 4 pickup truck loads — great for garages, basements and small remodels. A 15 yard holds about 6 pickup loads — better for renovations, roofing and estate cleanouts. Not sure? Send us a photo and we will tell you.'],
  ['Can I throw away mattresses, tires or appliances?', 'Yes, for a small per-item fee: mattresses/box springs $50 each, tires $35 each, and propane tanks, AC units, refrigerators, dehumidifiers, TVs and monitors $25 each.'],
  ['What can’t go in the dumpster?', 'Hazardous materials — liquid paint, chemicals, solvents, oil, asbestos, batteries and medical waste — can’t go in. If you are unsure about something, call or text before you toss it.'],
  ['Do you have a military discount?', 'Yes. We are veteran owned and offer Veteran & Active Military discounts. Mention it when you book. Thank you for your service.'],
  ['Are there hidden fees?', 'No. Fair, transparent pricing with no hidden fees. Every rental includes 7 days and the included weight; extras only apply for overweight loads or the specific items listed on our price sheet.'],
];

module.exports = { business, img, sizes, overage, extras, services, regions, towns, faqs };
