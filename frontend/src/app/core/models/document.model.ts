export type TypeDocument =
  | 'cin' | 'titre_foncier' | 'devis' | 'facture'
  | 'attestation' | 'photo' | 'releve_bancaire' | 'autre';

export type StatutVerification = 'en_attente' | 'valide' | 'refuse';

export interface Document {
  id: number;
  dossier_id: number;
  type_document: TypeDocument;
  nom_original: string;
  chemin_fichier: string;
  mime_type: string;
  taille: number;
  version: number;
  statut_verification: StatutVerification;
  commentaire_agent: string | null;
  verifie_par?: { id: number; name: string } | null;
  date_verification: string | null;
  created_at: string;
}

export const TYPES_DOCUMENTS_LABELS: Record<TypeDocument, string> = {
  cin: 'Carte d\'identité nationale',
  titre_foncier: 'Titre foncier',
  devis: 'Devis',
  facture: 'Facture',
  attestation: 'Attestation',
  photo: 'Photo de l\'exploitation',
  releve_bancaire: 'Relevé bancaire',
  autre: 'Autre document',
};