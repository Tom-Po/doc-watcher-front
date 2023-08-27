import { MotiveType } from './types';

export function MotiveCard(props: { callback: any; motive: MotiveType; selected: boolean }) {
  const { callback, selected, motive } = props;
  return (
    <div
      key={motive.id + motive.name}
      className={`card ${selected ? 'selected' : ''}`}
      onClick={() => {
        callback(selected ? '' : motive.id);
      }}
    >
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
      <div>{motive.name}</div>
    </div>
  );
}
