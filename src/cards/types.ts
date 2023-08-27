export interface AgendaType {
  id: string;
  booking_disabled: boolean;
  booking_temporary_disabled: boolean;
  landline_number: null;
  anonymous: boolean;
  hide_practitioner: boolean;
  organization_id: number;
  visit_motive_ids_by_practice_id: string[];
  visit_motive_ids: any[];
  visit_motive_ids_only_for_doctors: null;
  practice_id: number;
  speciality_id: number;
  practitioner_id: number;
  patient_base_id: number;
  insurance_sector_enabled: boolean;
  equipment_agendas_required: boolean;
}

export interface MotiveType {
  id: string;
  name: string;
  visit_motive_category_id: number;
  organization_id: number;
  speciality_id: number;
  ref_visit_motive_id: number;
  position: number;
  telehealth: boolean;
  vaccination_motive: boolean;
  vaccination_days_range: number;
  new_patient_restrictions: any[];
  age_referral_restrictions: any[];
  configurations: null;
}
