// Cameroon geographical & administrative reference data

export interface CameroonRegion {
  id: string;
  name: string;
  capital: string;
  divisions: {
    name: string;
    subdivisions: string[];
    popularNeighborhoods: string[];
  }[];
}

export const CAMEROON_REGIONS: CameroonRegion[] = [
  {
    id: 'centre',
    name: 'Centre',
    capital: 'Yaoundé',
    divisions: [
      {
        name: 'Mfoundi',
        subdivisions: ['Yaoundé I', 'Yaoundé II', 'Yaoundé III', 'Yaoundé IV', 'Yaoundé V', 'Yaoundé VI', 'Yaoundé VII'],
        popularNeighborhoods: ['Bastos', 'Odza', 'Mbankolo', 'Santa Barbara', 'Biyem-Assi', 'Etoudi', 'Nkolbisson', 'Mendong', 'Ngousso'],
      },
      {
        name: 'Méfou-et-Afamba',
        subdivisions: ['Mfou', 'Awaé', 'Esse', 'Soa'],
        popularNeighborhoods: ['Soa Ville', 'Nkoabang', 'Mfou Centre'],
      },
      {
        name: 'Méfou-et-Akono',
        subdivisions: ['Ngoumou', 'Akono', 'Bikok'],
        popularNeighborhoods: ['Bikok', 'Ngoumou'],
      },
      {
        name: 'Lekié',
        subdivisions: ['Monatélé', 'Obala', 'Okola', 'Sa\'a'],
        popularNeighborhoods: ['Obala Centre', 'Okola'],
      },
    ],
  },
  {
    id: 'littoral',
    name: 'Littoral',
    capital: 'Douala',
    divisions: [
      {
        name: 'Wouri',
        subdivisions: ['Douala I', 'Douala II', 'Douala III', 'Douala IV', 'Douala V', 'Douala VI (Manoka)'],
        popularNeighborhoods: ['Bonapriso', 'Bonanjo', 'Akwa', 'Kotto', 'Makepe', 'Logpom', 'Logbessou', 'Bonamoussadi', 'Yassa', 'Japoma'],
      },
      {
        name: 'Sanaga-Maritime',
        subdivisions: ['Edéa I', 'Edéa II', 'Dizangué', 'Mouanko'],
        popularNeighborhoods: ['Edéa Centre', 'Mouanko Plage'],
      },
    ],
  },
  {
    id: 'sud',
    name: 'Sud',
    capital: 'Ebolowa',
    divisions: [
      {
        name: 'Océan',
        subdivisions: ['Kribi I', 'Kribi II', 'Campo', 'Lolodorf', 'Akom II'],
        popularNeighborhoods: ['Kribi Plage', 'Mboamanga', 'Dombè', 'Grand Batanga', 'Londji'],
      },
      {
        name: 'Mvila',
        subdivisions: ['Ebolowa I', 'Ebolowa II', 'Mengong'],
        popularNeighborhoods: ['Ebolowa Centre', 'Nko\'ovos'],
      },
    ],
  },
  {
    id: 'sud-ouest',
    name: 'Sud-Ouest',
    capital: 'Buea',
    divisions: [
      {
        name: 'Fako',
        subdivisions: ['Buea', 'Limbe I', 'Limbe II', 'Limbe III', 'Tiko'],
        popularNeighborhoods: ['Limbe Down Beach', 'Bota', 'Mile 4', 'Buea Town', 'Molyko', 'Clerks Quarters', 'Tiko Road'],
      },
    ],
  },
  {
    id: 'ouest',
    name: 'Ouest',
    capital: 'Bafoussam',
    divisions: [
      {
        name: 'Mifi',
        subdivisions: ['Bafoussam I', 'Bafoussam II', 'Bafoussam III'],
        popularNeighborhoods: ['Djeleng', 'Tougang', 'Famla', 'Kamkop'],
      },
      {
        name: 'Noun',
        subdivisions: ['Foumban', 'Foumbot', 'Koutaba'],
        popularNeighborhoods: ['Foumban Palais', 'Foumbot Marché'],
      },
    ],
  },
  {
    id: 'nord-ouest',
    name: 'Nord-Ouest',
    capital: 'Bamenda',
    divisions: [
      {
        name: 'Mezam',
        subdivisions: ['Bamenda I', 'Bamenda II', 'Bamenda III', 'Santa', 'Tubah'],
        popularNeighborhoods: ['Commercial Avenue', 'Up Station', 'Mile 2', 'Mile 4', 'Bambili'],
      },
    ],
  },
];

export const LAND_TYPES = [
  { label: 'Residential (Résidentiel)', value: 'residential' },
  { label: 'Commercial (Commercial)', value: 'commercial' },
  { label: 'Agricultural (Agricole)', value: 'agricultural' },
  { label: 'Industrial (Industriel)', value: 'industrial' },
  { label: 'Mixed Use (Mixte)', value: 'mixed_use' },
];

export const TOPOGRAPHY_TYPES = [
  { label: 'Flat (Plat)', value: 'flat' },
  { label: 'Gentle Slope (Pente douce)', value: 'gentle_slope' },
  { label: 'Elevated / Hillside (Colline)', value: 'elevated' },
  { label: 'Waterfront (Bord d\'eau / Plage)', value: 'waterfront' },
];

export const ACCESS_ROADS = [
  { label: 'Paved / Tarred Road (Goudronné)', value: 'paved' },
  { label: 'Graded Dirt Road (Piste aménagée)', value: 'dirt_road' },
  { label: 'Secondary Street (Voie secondaire)', value: 'secondary' },
  { label: 'Right of Way Needed (Servitude de passage)', value: 'servitude' },
];

// Helper to format currency in FCFA consistently
export function formatFCFA(amount: number): string {
  return amount.toLocaleString('fr-FR') + ' FCFA';
}

// Helper to format land area
export function formatArea(m2: number): string {
  if (m2 >= 10000) {
    const ha = (m2 / 10000).toFixed(1);
    return `${m2.toLocaleString('fr-FR')} m² (${ha} ha)`;
  }
  return `${m2.toLocaleString('fr-FR')} m²`;
}
