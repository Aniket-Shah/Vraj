import { slugify } from "@/lib/utils";

export type CategorySlug =
  | "solvents"
  | "acids"
  | "industrial"
  | "specialty"
  | "pigments"
  | "additives"
  | "cleaning";

export interface Chemical {
  id: string;
  name: string;
  category: CategorySlug;
  casNumber?: string;
  formula?: string;
  origin: string;
  packaging: string;
  industry: string[];
  purity?: string;
  availability: "In Stock" | "On Order";
  description: string;
}

const rawProducts: Omit<Chemical, "id" | "description">[] = [
  { name: "2-Ethylhexyl Acrylate (2EHA)", category: "specialty", casNumber: "103-11-7", formula: "C11H20O2", origin: "Korea", packaging: "190kgs Drum", industry: ["TEXTILE"], availability: "In Stock" },
  { name: "Acetic Acid 99%", category: "acids", casNumber: "64-19-7", formula: "CH3COOH", origin: "GNFC/India", packaging: "35kgs Carboy", industry: ["TEXTILE"], purity: "99%", availability: "In Stock" },
  { name: "Acetone", category: "solvents", casNumber: "67-64-1", formula: "C3H6O", origin: "India", packaging: "160kgs Drum", industry: ["COSMETICS"], availability: "In Stock" },
  { name: "Acetonitrile", category: "solvents", casNumber: "75-05-8", formula: "C2H3N", origin: "Imported", packaging: "200kgs Drum", industry: ["AUXILIARIES"], availability: "In Stock" },
  { name: "Acrylamide", category: "specialty", casNumber: "79-06-1", formula: "C3H5NO", origin: "China", packaging: "25kgs Bag", industry: ["SIZING"], availability: "In Stock" },
  { name: "Acrylic Acid", category: "acids", casNumber: "79-10-7", formula: "C3H4O2", origin: "China", packaging: "200kgs Drum", industry: ["TEXTILE"], availability: "In Stock" },
  { name: "Acrylonitrile (ACN)", category: "specialty", casNumber: "107-13-1", formula: "C3H3N", origin: "Korea", packaging: "180kgs Drum", industry: ["BINDER"], availability: "In Stock" },
  { name: "Adipic Acid", category: "acids", casNumber: "124-04-9", formula: "C6H10O4", origin: "Japan", packaging: "25kgs Bag", industry: ["RESIN"], availability: "In Stock" },
  { name: "Ammonium Bicarbonate", category: "industrial", casNumber: "1066-33-7", formula: "NH4HCO3", origin: "India", packaging: "50kgs Bag", industry: ["COSMETICS"], availability: "In Stock" },
  { name: "Ammonium Persulphate", category: "industrial", casNumber: "7727-54-0", formula: "(NH4)2S2O8", origin: "Caliber", packaging: "25kgs Bag", industry: ["CATALYST"], availability: "In Stock" },
  { name: "Aminoethyl Ethanolamine", category: "additives", casNumber: "111-41-1", formula: "C4H12N2O", origin: "BASF", packaging: "210kgs Drum", industry: ["OIL & PETROL"], availability: "In Stock" },
  { name: "Aniline Oil", category: "pigments", casNumber: "62-53-3", formula: "C6H7N", origin: "On Request", packaging: "Bulk Pack", industry: ["DYES"], availability: "On Order" },
  { name: "Benzaldehyde", category: "industrial", casNumber: "100-52-7", formula: "C7H6O", origin: "On Request", packaging: "Bulk Pack", industry: ["PLASTICS", "COSMETICS"], availability: "On Order" },
  { name: "Benzene", category: "solvents", casNumber: "71-43-2", formula: "C6H6", origin: "Refill", packaging: "170kgs Drum", industry: ["RUBBER", "PLASTICS"], availability: "In Stock" },
  { name: "Borax Deca", category: "industrial", casNumber: "1303-96-4", formula: "Na2B4O7.10H2O", origin: "Intake", packaging: "50kgs Bag", industry: ["COSMETICS"], availability: "In Stock" },
  { name: "Benzoic Acid", category: "acids", casNumber: "65-85-0", formula: "C7H6O2", origin: "On Request", packaging: "25kgs Bag", industry: ["FOOD"], availability: "In Stock" },
  { name: "Bisphenol", category: "industrial", casNumber: "80-05-7", formula: "C15H16O2", origin: "Imported", packaging: "25kg", industry: ["RESIN"], availability: "In Stock" },
  { name: "Boric Acid", category: "acids", casNumber: "10043-35-3", formula: "H3BO3", origin: "India", packaging: "50kgs Bag", industry: ["FOOD"], availability: "In Stock" },
  { name: "Butyl Acrylate Monomer", category: "specialty", casNumber: "141-32-2", formula: "C7H12O2", origin: "Korea", packaging: "190/200kgs Drum", industry: ["BINDER"], availability: "In Stock" },
  { name: "Butyl Cellosolve", category: "solvents", casNumber: "111-76-2", formula: "C6H14O2", origin: "Korea", packaging: "180kgs Drum", industry: ["PLASTICS"], availability: "In Stock" },
  { name: "Calcium Carbonate", category: "industrial", casNumber: "471-34-1", formula: "CaCO3", origin: "India", packaging: "50kgs Bag", industry: ["PHARMA"], availability: "In Stock" },
  { name: "Caustic Soda Flakes", category: "industrial", casNumber: "1310-73-2", formula: "NaOH", origin: "India", packaging: "50kgs Bag", industry: ["PAPER"], availability: "In Stock" },
  { name: "Chloroform", category: "solvents", casNumber: "67-66-3", formula: "CHCl3", origin: "GNFC/Imported", packaging: "290kgs Drum", industry: ["RUBBER"], availability: "In Stock" },
  { name: "Citric Acid", category: "acids", casNumber: "77-92-9", formula: "C6H8O7", origin: "China", packaging: "25kgs Bag", industry: ["FOOD"], availability: "In Stock" },
  { name: "Copper Sulphate", category: "industrial", casNumber: "7758-98-7", formula: "CuSO4", origin: "Local", packaging: "50kgs Bag", industry: ["PAINT"], availability: "In Stock" },
  { name: "Cyclohexanone", category: "solvents", casNumber: "108-94-1", formula: "C6H10O", origin: "Korea", packaging: "190kgs Drum", industry: ["PAINT", "INK"], availability: "In Stock" },
  { name: "Diethanolamine", category: "additives", casNumber: "111-42-2", formula: "C4H11NO2", origin: "On Request", packaging: "200kgs Drum", industry: ["COSMETICS"], availability: "On Order" },
  { name: "Diethylamide HCL", category: "industrial", origin: "On Request", packaging: "Bulk Pack", industry: ["RUBBER"], availability: "On Order" },
  { name: "Diethylene Glycol (DEG)", category: "specialty", casNumber: "111-46-6", formula: "C4H10O3", origin: "India", packaging: "230kgs Drum", industry: ["PLASTICS"], availability: "In Stock" },
  { name: "Diethylenetriamine (DETA)", category: "industrial", casNumber: "111-40-0", formula: "C4H13N3", origin: "On Request", packaging: "Bulk Pack", industry: ["PLASTICS"], availability: "On Order" },
  { name: "Dimethylformamide (DMF)", category: "solvents", casNumber: "68-12-2", formula: "C3H7NO", origin: "Imported", packaging: "Bulk Pack", industry: ["PLASTICS"], availability: "In Stock" },
  { name: "Dicyandiamide (DCDA)", category: "industrial", casNumber: "461-58-5", formula: "C2H4N4", origin: "China", packaging: "25kgs Bag", industry: ["PAPER"], availability: "In Stock" },
  { name: "Emulsifier", category: "additives", origin: "India", packaging: "210kgs Drum", industry: ["SOAP"], availability: "In Stock" },
  { name: "Ethyl Acrylate Monomer", category: "specialty", casNumber: "140-88-5", formula: "C5H8O2", origin: "Korea", packaging: "200kgs Drum/Refill", industry: ["PLASTICS", "RUBBER"], availability: "In Stock" },
  { name: "Formic Acid 85-99%", category: "acids", casNumber: "64-18-6", formula: "CH2O2", origin: "GNFC/India", packaging: "35kgs Carboys", industry: ["PLASTICS"], purity: "85-99%", availability: "In Stock" },
  { name: "Glycerin", category: "specialty", casNumber: "56-81-5", formula: "C3H8O3", origin: "Malaysia/Indonesia", packaging: "250kgs Drum", industry: ["COSMETICS"], availability: "In Stock" },
  { name: "Hydrogen Peroxide 50%", category: "industrial", casNumber: "7722-84-1", formula: "H2O2", origin: "Imported", packaging: "50kgs Carboys", industry: ["TEXTILE"], purity: "50%", availability: "In Stock" },
  { name: "Isopropyl Alcohol (IPA)", category: "solvents", casNumber: "67-63-0", formula: "C3H8O", origin: "Imported", packaging: "160kgs Drum", industry: ["COSMETICS"], availability: "In Stock" },
  { name: "Lauric Acid", category: "acids", casNumber: "143-07-7", formula: "C12H24O2", origin: "Imported", packaging: "25kgs Bag", industry: ["SOAP"], availability: "In Stock" },
  { name: "MAA Methacrylate", category: "specialty", casNumber: "79-41-4", formula: "C4H6O2", origin: "Imported", packaging: "200kgs Drum", industry: ["PLASTICS"], availability: "In Stock" },
  { name: "Magnesium Chloride", category: "industrial", casNumber: "7786-30-3", formula: "MgCl2", origin: "Local", packaging: "50kgs Bag", industry: ["PHARMA"], availability: "In Stock" },
  { name: "Magnesium Sulphate", category: "industrial", casNumber: "7487-88-9", formula: "MgSO4", origin: "Indian", packaging: "50kgs Bag", industry: ["PHARMA"], availability: "In Stock" },
  { name: "Maleic Anhydride", category: "acids", casNumber: "108-31-6", formula: "C4H2O3", origin: "Imported", packaging: "25kgs Bag", industry: ["PLASTICS"], availability: "In Stock" },
  { name: "Methyl Ethyl Ketone (MEK)", category: "solvents", casNumber: "78-93-3", formula: "C4H8O", origin: "Imported", packaging: "190kgs Drum", industry: ["INK"], availability: "In Stock" },
  { name: "MIBK", category: "solvents", casNumber: "108-10-1", formula: "C6H12O", origin: "Imported", packaging: "190kgs Drum", industry: ["INK", "RUBBER"], availability: "In Stock" },
  { name: "MMA (Monomethyl Acrylate)", category: "specialty", casNumber: "80-62-6", formula: "C5H8O2", origin: "Imported", packaging: "200kgs Drum", industry: ["COSMETICS"], availability: "In Stock" },
  { name: "Monoethylene Glycol (MEG)", category: "specialty", casNumber: "107-21-1", formula: "C2H6O2", origin: "Refill", packaging: "230kgs Drum", industry: ["BINDER"], availability: "In Stock" },
  { name: "N-Butanol", category: "solvents", casNumber: "71-36-3", formula: "C4H10O", origin: "Imported", packaging: "190kgs Drum", industry: ["PAINT"], availability: "In Stock" },
  { name: "NPG (Neopentyl Glycol)", category: "specialty", casNumber: "126-30-7", formula: "C5H12O2", origin: "Imported", packaging: "Bulk Pack", industry: ["COATING", "TEXTILE"], availability: "In Stock" },
  { name: "Oleic Acid", category: "acids", casNumber: "112-80-1", formula: "C18H34O2", origin: "Local", packaging: "90kgs Carboys", industry: ["SOAP"], availability: "In Stock" },
  { name: "Ortho Xylene", category: "solvents", casNumber: "95-47-6", formula: "C8H10", origin: "Local", packaging: "170kgs Drum", industry: ["PLASTICS"], availability: "In Stock" },
  { name: "Oxalic Acid 94 & 99%", category: "acids", casNumber: "144-62-7", formula: "C2H2O4", origin: "Local", packaging: "50kgs Bag", industry: ["TEXTILE"], purity: "94 & 99%", availability: "In Stock" },
  { name: "Phenol", category: "industrial", casNumber: "108-95-2", formula: "C6H6O", origin: "Imported", packaging: "215kgs Drum", industry: ["PLYWOOD"], availability: "In Stock" },
  { name: "Phosphoric Acid 85%", category: "acids", casNumber: "7664-38-2", formula: "H3PO4", origin: "Imported", packaging: "35kgs Carboy", industry: ["PHARMA"], purity: "85%", availability: "In Stock" },
  { name: "Polyethylene Glycol (PEG)", category: "specialty", casNumber: "25322-68-3", origin: "Local", packaging: "240kgs Drum", industry: ["TEXTILE", "OIL"], availability: "In Stock" },
  { name: "Polyvinyl Alcohol (PVA)", category: "specialty", casNumber: "9002-89-5", origin: "Imported", packaging: "20kgs Bag", industry: ["RUBBER", "PLASTICS"], availability: "In Stock" },
  { name: "Potassium Carbonate", category: "industrial", casNumber: "584-08-7", formula: "K2CO3", origin: "Imported", packaging: "50kgs Bag", industry: ["SOAP"], availability: "In Stock" },
  { name: "Propionic Acid", category: "acids", casNumber: "79-09-4", formula: "C3H6O2", origin: "Imported", packaging: "Bulk Pack", industry: ["FOOD"], availability: "In Stock" },
  { name: "Propylene Glycol (USP-Technical)", category: "specialty", casNumber: "57-55-6", formula: "C3H8O2", origin: "Imported", packaging: "215kgs Drum", industry: ["COSMETICS"], availability: "In Stock" },
  { name: "Resist Salts", category: "pigments", origin: "Local", packaging: "50kgs Bag", industry: ["PRINTING"], availability: "In Stock" },
  { name: "Silicon Oils", category: "additives", origin: "Imported", packaging: "250kgs Drum", industry: ["PLASTICS", "RUBBER"], availability: "In Stock" },
  { name: "Soda Ash Technical", category: "industrial", casNumber: "497-19-8", formula: "Na2CO3", origin: "TATA/China", packaging: "50kgs Bag", industry: ["TEXTILE", "SOAP"], availability: "In Stock" },
  { name: "Sodium Bicarbonate 99%", category: "industrial", casNumber: "144-55-8", formula: "NaHCO3", origin: "TATA", packaging: "50kgs Bag", industry: ["FOOD"], purity: "99%", availability: "In Stock" },
  { name: "Sodium Chlorite 50% & 80%", category: "cleaning", casNumber: "7758-19-2", formula: "NaClO2", origin: "Local", packaging: "50kgs Drum", industry: ["FOOD"], purity: "50% & 80%", availability: "In Stock" },
  { name: "Sodium Hexametaphosphate", category: "cleaning", casNumber: "10124-56-8", formula: "(NaPO3)6", origin: "Local", packaging: "50kgs Bag", industry: ["FOOD"], availability: "In Stock" },
  { name: "Sodium Hypochlorite", category: "cleaning", casNumber: "7681-52-9", formula: "NaOCl", origin: "Local", packaging: "60kgs Carboys", industry: ["COSMETICS"], availability: "In Stock" },
  { name: "Sodium Metabisulphite", category: "cleaning", casNumber: "7681-57-4", formula: "Na2S2O5", origin: "Local", packaging: "50kgs Bag", industry: ["FOOD"], availability: "In Stock" },
  { name: "Sodium Thiosulphate", category: "cleaning", casNumber: "7772-98-7", formula: "Na2S2O3", origin: "Local", packaging: "50kgs Bag", industry: ["PHARMA"], availability: "In Stock" },
  { name: "Sorbitol", category: "additives", casNumber: "50-70-4", formula: "C6H14O6", origin: "Local", packaging: "250kgs Drum", industry: ["PHARMA"], availability: "In Stock" },
  { name: "Sulphur Powder", category: "additives", casNumber: "7704-34-9", formula: "S", origin: "Imported", packaging: "50kgs Bag", industry: ["RUBBER", "COSMETICS"], availability: "In Stock" },
  { name: "Titanium Dioxide (Rutile/Anatase)", category: "pigments", casNumber: "13463-67-7", formula: "TiO2", origin: "Imported/Local", packaging: "25kgs Bag", industry: ["PAINT", "PLASTICS", "INK", "RUBBER"], availability: "In Stock" },
  { name: "Triethanolamine 99%", category: "additives", casNumber: "102-71-6", formula: "C6H15NO3", origin: "Local", packaging: "230kgs Drum", industry: ["COSMETICS"], purity: "99%", availability: "In Stock" },
  { name: "Triethylamine", category: "industrial", casNumber: "121-44-8", formula: "C6H15N", origin: "Imported", packaging: "Bulk Pack", industry: ["TEXTILE", "PHARMA"], availability: "In Stock" },
  { name: "Triethylenetetramine (TETA)", category: "industrial", casNumber: "112-24-3", formula: "C6H18N4", origin: "Imported", packaging: "Bulk Pack", industry: ["PHARMA"], availability: "In Stock" },
  { name: "Zinc Oxide", category: "pigments", casNumber: "1314-13-2", formula: "ZnO", origin: "Local", packaging: "25kgs Bag", industry: ["PAINT"], availability: "In Stock" },
  { name: "Zinc Sulphate", category: "industrial", casNumber: "7733-02-0", formula: "ZnSO4", origin: "Local", packaging: "25kgs Bag", industry: ["PHARMA"], availability: "In Stock" }
];

export const products: Chemical[] = rawProducts.map((product) => ({
  ...product,
  id: slugify(product.name.replace(/\((.*?)\)/g, "$1")),
  description: `${product.name} is supplied by Vraj Chem Impex LLP for ${product.industry.join(", ").toLowerCase()} applications with reliable sourcing, documented quality, and bulk packaging support.`
}));

export function getProduct(category: string, product: string) {
  return products.find((item) => item.category === category && item.id === product);
}

export function getProductsByCategory(category: string) {
  return products.filter((item) => item.category === category);
}
