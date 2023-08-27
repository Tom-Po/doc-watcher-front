import { AgendaType } from './types';

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
