export interface DossierPrioritaire {
  id: number;
  numero_dossier: string;
  montant_demande: number;
  date_soumission: string | null;
  user?: { id: number; name: string };
  type_subvention?: { id: number; nom_fr: string };
}

export interface StatsAgent {
  aujourd_hui: number;
  a_traiter: number;
  validees: number;
  rejetees: number;
  par_statut: { statut: string; total: number }[];
  evolution_7_jours: { date: string; total: number }[];
  delai_moyen_jours: number;
  dossiers_prioritaires: DossierPrioritaire[];
}

export interface StatsAdmin {
  total_demandes: number;
  total_validees: number;
  total_refusees: number;
  taux_acceptation: number;
  montant_total_accorde: number;
  delai_moyen_jours: number;
  par_region: { region: string; total: number }[];
  par_type: { nom_fr: string; total: number }[];
  par_mois: { mois: string; total: number }[];
}