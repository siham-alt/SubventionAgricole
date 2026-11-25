export interface Exploitation {
  id: number;
  nom_exploitation: string;
  type_exploitation: string;
  superficie_hectares: number;
  titre_foncier?: string;
  region: string;
  province: string;
  commune: string;
  douar?: string;
  description?: string;
}

export interface TypeSubvention {
  id: number;
  nom_fr: string;
  nom_ar?: string;
  description_fr?: string;
  montant_max?: number;
  taux_subvention?: number;
  documents_requis: string[];
}

export interface DocumentDossier {
  id: number;
  dossier_id: number;
  type_document: string;
  nom_original: string;
  chemin_fichier: string;
  url?: string;
  mime_type: string;
  taille: number;
  version: number;
  statut_verification: 'en_attente' | 'valide' | 'refuse';
  commentaire_agent: string | null;
  verifie_par_id: number | null;
  verifie_par?: { id: number; name: string } | null;
  date_verification: string | null;
  created_at: string;
  updated_at?: string;
}

export interface HistoriqueItem {
  id: number;
  action: string;
  statut_avant?: string;
  statut_apres?: string;
  commentaire?: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
  };
}

export interface Dossier {
  id: number;
  numero_dossier: string;
  statut: string;
  montant_demande: number;
  montant_accorde?: number;
  description_projet?: string;
  motif_refus?: string;
  exploitation?: Exploitation;
  type_subvention?: TypeSubvention;
  documents?: DocumentDossier[];
  historique?: HistoriqueItem[];
    agent_traitant?: { id: number; name: string };  // ← renommé, snake_case

  date_soumission?: string;
  date_validation?: string;
  created_at: string;
  updated_at?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };

  // ===== Identité juridique =====
  statut_juridique?: 'physique' | 'cooperative' | 'gie' | 'societe';
  numero_immatriculation?: string;
  numero_cnss?: string;
  nom_representant_legal?: string;

  // ===== Statut foncier =====
  mode_tenure?: 'proprietaire' | 'locataire' | 'melk' | 'collectif' | 'domaine_etat';
  numero_titre_foncier?: string;

  // ===== Détails techniques du projet =====
  nombre_unites?: number;
  type_equipement?: string;
  cout_total_projet?: number;
  apport_personnel?: number;
  date_debut_prevue?: string;
  date_fin_prevue?: string;

  // ===== Bancaire =====
  rib?: string;
  nom_banque?: string;
  agence_bancaire?: string;

  // ===== Antécédents =====
  a_deja_beneficie?: boolean;
  reference_subvention_precedente?: string;

  // ===== Contact projet =====
  telephone_contact_projet?: string;
  email_contact_projet?: string;
}

export interface NotificationInterne {
  id: number;
  titre: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  lu: boolean;
  dossier_id?: number;
  created_at: string;
}

export interface DocumentsVerification {
  complet: boolean;
  manquants: string[];
}

export interface DossierDetailResponse {
  dossier: Dossier;
  documents_verification: DocumentsVerification;
}
// dossier.model.ts
export const STATUTS_LABELS: Record<string, string> = {
  brouillon: 'Brouillon',
  soumis: 'Soumis',
  en_cours_verification: 'En cours de vérification',
  complement_demande: 'Complément demandé',
  en_attente_agent: 'Document renvoyé — à revérifier',  // ← nouveau
  en_validation_agent: 'En validation (agent)',
  en_validation_responsable: 'En validation finale',
  approuve: 'Approuvé',
  refuse: 'Refusé',
  paye: 'Payé',
};

export const STATUTS_COULEURS: Record<string, string> = {
  brouillon: '#90a4ae',
  soumis: '#2E7D32',
  en_cours_verification: '#D4A72C',
  complement_demande: '#f57c00',
  en_attente_agent: '#1565C0',  // ← bleu vif, bien distinct, attire l'œil
  en_validation_agent: '#2E7D32',
  en_validation_responsable: '#1B5E20',
  approuve: '#2E7D32',
  refuse: '#d32f2f',
  paye: '#1B5E20',
};

export const TYPES_DOCUMENTS_LABELS: Record<string, string> = {
  cin: 'Carte d\'identité nationale',
  titre_foncier: 'Titre foncier',
  devis: 'Devis',
  facture: 'Facture',
  attestation: 'Attestation',
  photo: 'Photo de l\'exploitation',
  releve_bancaire: 'Relevé bancaire',
  autre: 'Autre document',
};

export const STATUT_JURIDIQUE_LABELS: Record<string, string> = {
  physique: 'Personne physique',
  cooperative: 'Coopérative',
  gie: 'GIE',
  societe: 'Société agricole',
};

export const MODE_TENURE_LABELS: Record<string, string> = {
  proprietaire: 'Propriétaire',
  locataire: 'Locataire',
  melk: 'Melk',
  collectif: 'Terrain collectif',
  domaine_etat: "Domaine de l'État",
};
