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

export function AgendaCard(props: { agenda: AgendaType; selected: boolean; callback: any }) {
  const { agenda, selected, callback } = props;
  return (
    <div className={`card ${selected ? 'selected' : ''}`} onClick={() => callback(agenda)}>
      {selected && (
        <div className="icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="green">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      )}
      <div>{agenda.id}</div>
    </div>
  );
}
