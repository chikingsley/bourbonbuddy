// Seed data with popular bourbons

export interface BourbonSeed {
  name: string;
  distillery: string;
  type: 'bourbon' | 'rye' | 'wheat' | 'malt' | 'blend';
  proof: number;
  age_statement?: string;
  msrp?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'allocated';
  description: string;
  image_url: string;
}

export const bourbonSeeds: BourbonSeed[] = [
  {
    name: "Buffalo Trace",
    distillery: "Buffalo Trace Distillery",
    type: "bourbon",
    proof: 90,
    age_statement: "8 years",
    msrp: 25.99,
    rarity: "common",
    description: "A smooth, complex bourbon with notes of vanilla, toffee, and dark fruit. One of the most popular everyday bourbons.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  },
  {
    name: "Maker's Mark",
    distillery: "Maker's Mark Distillery",
    type: "bourbon",
    proof: 90,
    age_statement: "6 years",
    msrp: 27.99,
    rarity: "common",
    description: "A wheated bourbon with a signature red wax seal. Sweet and approachable with caramel and vanilla notes.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  },
  {
    name: "Woodford Reserve",
    distillery: "Woodford Reserve Distillery",
    type: "bourbon",
    proof: 90.4,
    age_statement: "7 years",
    msrp: 32.99,
    rarity: "common",
    description: "Rich, full-bodied bourbon with notes of dried fruit, vanilla, and oak. A premium everyday sipper.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  },
  {
    name: "Eagle Rare 10 Year",
    distillery: "Buffalo Trace Distillery",
    type: "bourbon",
    proof: 90,
    age_statement: "10 years",
    msrp: 35.99,
    rarity: "uncommon",
    description: "Complex and rich with notes of toffee, orange peel, and oak. A highly sought-after single barrel bourbon.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  },
  {
    name: "Blanton's Single Barrel",
    distillery: "Buffalo Trace Distillery",
    type: "bourbon",
    proof: 93,
    age_statement: "6-8 years",
    msrp: 64.99,
    rarity: "allocated",
    description: "The original single barrel bourbon with a distinctive bottle design. Rich caramel, vanilla, and spice notes.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  },
  {
    name: "Elijah Craig Small Batch",
    distillery: "Heaven Hill Distillery",
    type: "bourbon",
    proof: 94,
    age_statement: "12 years",
    msrp: 29.99,
    rarity: "common",
    description: "A bold, full-flavored bourbon with notes of caramel, vanilla, and oak. Excellent value for the age statement.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  },
  {
    name: "Wild Turkey 101",
    distillery: "Wild Turkey Distillery",
    type: "bourbon",
    proof: 101,
    age_statement: "6-8 years",
    msrp: 23.99,
    rarity: "common",
    description: "A high-proof workhorse bourbon with bold flavors of caramel, vanilla, and baking spices.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  },
  {
    name: "Knob Creek Small Batch",
    distillery: "Jim Beam Distillery",
    type: "bourbon",
    proof: 100,
    age_statement: "9 years",
    msrp: 34.99,
    rarity: "common",
    description: "A full-bodied bourbon with rich vanilla, caramel, and oak flavors. Part of the Small Batch Collection.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  },
  {
    name: "Four Roses Single Barrel",
    distillery: "Four Roses Distillery",
    type: "bourbon",
    proof: 100,
    age_statement: "7-9 years",
    msrp: 42.99,
    rarity: "uncommon",
    description: "Elegant and complex with floral notes, vanilla, and spice. Each barrel is hand-selected.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  },
  {
    name: "Angel's Envy",
    distillery: "Angel's Envy Distillery",
    type: "bourbon",
    proof: 86.6,
    age_statement: "4-6 years",
    msrp: 49.99,
    rarity: "uncommon",
    description: "Finished in port wine barrels, giving it unique fruity and sweet characteristics.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  },
  {
    name: "Old Forester 1920 Prohibition Style",
    distillery: "Old Forester Distillery",
    type: "bourbon",
    proof: 115,
    age_statement: "4 years",
    msrp: 59.99,
    rarity: "uncommon",
    description: "High-proof bourbon with intense flavors of chocolate, caramel, and baking spices.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  },
  {
    name: "Bulleit Bourbon",
    distillery: "Bulleit Distillery",
    type: "bourbon",
    proof: 90,
    age_statement: "6 years",
    msrp: 27.99,
    rarity: "common",
    description: "High-rye bourbon with a distinctive spicy finish. Bold and smooth with maple and oak notes.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  },
  {
    name: "Basil Hayden's",
    distillery: "Jim Beam Distillery",
    type: "bourbon",
    proof: 80,
    age_statement: "8 years",
    msrp: 39.99,
    rarity: "common",
    description: "High-rye mash bill creates a lighter, spicier bourbon. Approachable with notes of pepper and tea.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  },
  {
    name: "Russell's Reserve 10 Year",
    distillery: "Wild Turkey Distillery",
    type: "bourbon",
    proof: 90,
    age_statement: "10 years",
    msrp: 39.99,
    rarity: "uncommon",
    description: "Complex and rich with honey, vanilla, and oak. Created by master distillers Jimmy and Eddie Russell.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  },
  {
    name: "Weller Special Reserve",
    distillery: "Buffalo Trace Distillery",
    type: "bourbon",
    proof: 90,
    age_statement: "7 years",
    msrp: 29.99,
    rarity: "allocated",
    description: "Wheated bourbon with a smooth, sweet profile. Same mash bill as Pappy Van Winkle.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  },
  {
    name: "Larceny Small Batch",
    distillery: "Heaven Hill Distillery",
    type: "bourbon",
    proof: 92,
    age_statement: "6-12 years",
    msrp: 24.99,
    rarity: "common",
    description: "Wheated bourbon with butterscotch, caramel, and honey notes. Smooth and approachable.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  },
  {
    name: "Michter's US*1 Small Batch",
    distillery: "Michter's Distillery",
    type: "bourbon",
    proof: 91.4,
    age_statement: "8-10 years",
    msrp: 44.99,
    rarity: "uncommon",
    description: "Premium small batch bourbon with rich vanilla, caramel, and spice notes.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  },
  {
    name: "High West Campfire",
    distillery: "High West Distillery",
    type: "blend",
    proof: 92,
    msrp: 74.99,
    rarity: "rare",
    description: "Unique blend of bourbon, rye, and peated scotch. Smoky, sweet, and complex.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  },
  {
    name: "Booker's Bourbon",
    distillery: "Jim Beam Distillery",
    type: "bourbon",
    proof: 126,
    age_statement: "6-7 years",
    msrp: 89.99,
    rarity: "rare",
    description: "Uncut, unfiltered barrel-proof bourbon. Intense flavors of vanilla, oak, and leather.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  },
  {
    name: "1792 Small Batch",
    distillery: "Barton 1792 Distillery",
    type: "bourbon",
    proof: 93.7,
    age_statement: "8 years",
    msrp: 29.99,
    rarity: "common",
    description: "Complex and well-balanced with notes of vanilla, caramel, and spice.",
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400"
  }
];

export const getSeedSQL = (): string => {
  const values = bourbonSeeds.map(bourbon =>
    `('${bourbon.name.replace(/'/g, "''")}', '${bourbon.distillery.replace(/'/g, "''")}', '${bourbon.type}', ${bourbon.proof}, ${bourbon.age_statement ? `'${bourbon.age_statement}'` : 'NULL'}, ${bourbon.msrp || 'NULL'}, '${bourbon.rarity}', '${bourbon.description.replace(/'/g, "''")}', '${bourbon.image_url}')`
  ).join(',\n');

  return `INSERT OR IGNORE INTO bourbons (name, distillery, type, proof, age_statement, msrp, rarity, description, image_url) VALUES\n${values};`;
};
