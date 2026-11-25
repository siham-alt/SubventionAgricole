export interface Programme {
  id: number;
  nom_fr: string;
  nom_ar?: string;
  description_fr?: string;
  montant_max?: number;
  taux_subvention?: number;
  date_debut?: string;
  date_fin?: string;
  conditions?: string;
  documents_requis: string[];
  actif: boolean;
}