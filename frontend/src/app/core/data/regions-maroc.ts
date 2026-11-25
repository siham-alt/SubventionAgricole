export interface Province {
  nom: string;
  communes: string[];
}

export interface Region {
  nom: string;
  provinces: Province[];
}

export const REGIONS_MAROC: Region[] = [
  {
    nom: 'Tanger-Tétouan-Al Hoceïma',
    provinces: [
      { nom: 'Tanger-Assilah', communes: [] },
      { nom: 'Fahs-Anjra', communes: [] },
      { nom: 'Tétouan', communes: [] },
      { nom: "M'diq-Fnideq", communes: [] },
      { nom: 'Chefchaouen', communes: [] },
      { nom: 'Larache', communes: [] },
      { nom: 'Al Hoceïma', communes: [] },
      { nom: 'Ouezzane', communes: [] },
    ],
  },
  {
    nom: "L'Oriental",
    provinces: [
      { nom: 'Oujda-Angad', communes: [] },
      { nom: 'Nador', communes: [] },
      { nom: 'Driouch', communes: [] },
      { nom: 'Jerada', communes: [] },
      { nom: 'Berkane', communes: [] },
      { nom: 'Taourirt', communes: [] },
      { nom: 'Guercif', communes: [] },
      { nom: 'Figuig', communes: [] },
    ],
  },
  {
    nom: 'Fès-Meknès',
    provinces: [
      { nom: 'Fès', communes: ['Fès', 'Sidi Harazem', 'Oulad Tayeb'] },
      { nom: 'Meknès', communes: ['Toulal', 'Ouislane', 'Mejjat', 'Ain Karma'] },
      { nom: 'El Hajeb', communes: [] },
      { nom: 'Ifrane', communes: [] },
      { nom: 'Moulay Yacoub', communes: [] },
      { nom: 'Séfrou', communes: ['Séfrou', 'Bhalil', 'Ribate El Kheir'] },
      { nom: 'Boulemane', communes: [] },
      { nom: 'Taza', communes: [] },
      { nom: 'Taounate', communes: [] },
    ],
  },
  {
    nom: 'Rabat-Salé-Kénitra',
    provinces: [
      { nom: 'Rabat', communes: ['Rabat', 'Yacoub El Mansour', 'Souissi'] },
      { nom: 'Salé', communes: [] },
      { nom: 'Skhirate-Témara', communes: [] },
      { nom: 'Kénitra', communes: ['Kénitra', 'Mehdia', 'Sidi Taibi'] },
      { nom: 'Khémisset', communes: [] },
      { nom: 'Sidi Kacem', communes: [] },
      { nom: 'Sidi Slimane', communes: [] },
    ],
  },
  {
    nom: 'Béni Mellal-Khénifra',
    provinces: [
      { nom: 'Béni Mellal', communes: [] },
      { nom: 'Azilal', communes: [] },
      { nom: 'Fquih Ben Salah', communes: [] },
      { nom: 'Khénifra', communes: [] },
      { nom: 'Khouribga', communes: [] },
    ],
  },
  {
    nom: 'Casablanca-Settat',
    provinces: [
      { nom: 'Casablanca', communes: [] },
      { nom: 'Mohammédia', communes: [] },
      { nom: 'Nouaceur', communes: [] },
      { nom: 'Médiouna', communes: [] },
      { nom: 'Settat', communes: [] },
      { nom: 'Berrechid', communes: [] },
      { nom: 'El Jadida', communes: [] },
      { nom: 'Sidi Bennour', communes: [] },
    ],
  },
  {
    nom: 'Marrakech-Safi',
    provinces: [
      { nom: 'Marrakech', communes: [] },
      { nom: 'Chichaoua', communes: [] },
      { nom: 'Al Haouz', communes: [] },
      { nom: 'Rehamna', communes: [] },
      { nom: 'El Kelâa des Sraghna', communes: [] },
      { nom: 'Essaouira', communes: [] },
      { nom: 'Safi', communes: [] },
      { nom: 'Youssoufia', communes: [] },
    ],
  },
  {
    nom: 'Drâa-Tafilalet',
    provinces: [
      { nom: 'Errachidia', communes: [] },
      { nom: 'Ouarzazate', communes: [] },
      { nom: 'Zagora', communes: [] },
      { nom: 'Tinghir', communes: [] },
      { nom: 'Midelt', communes: [] },
    ],
  },
  {
    nom: 'Souss-Massa',
    provinces: [
      { nom: 'Agadir Ida-Outanane', communes: [] },
      { nom: 'Inezgane-Aït Melloul', communes: [] },
      { nom: 'Chtouka-Aït Baha', communes: [] },
      { nom: 'Taroudant', communes: [] },
      { nom: 'Tiznit', communes: [] },
      { nom: 'Tata', communes: [] },
    ],
  },
  {
    nom: 'Guelmim-Oued Noun',
    provinces: [
      { nom: 'Guelmim', communes: [] },
      { nom: 'Assa-Zag', communes: [] },
      { nom: 'Tan-Tan', communes: [] },
      { nom: 'Sidi Ifni', communes: [] },
    ],
  },
  {
    nom: 'Laâyoune-Sakia El Hamra',
    provinces: [
      { nom: 'Laâyoune', communes: [] },
      { nom: 'Boujdour', communes: [] },
      { nom: 'Tarfaya', communes: [] },
      { nom: 'Es-Semara', communes: [] },
    ],
  },
  {
    nom: 'Dakhla-Oued Ed-Dahab',
    provinces: [
      { nom: 'Oued Ed-Dahab (Dakhla)', communes: [] },
      { nom: 'Aousserd', communes: [] },
    ],
  },
];