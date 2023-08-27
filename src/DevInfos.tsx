import { useState } from 'react';
import './DevInfos.css';

export function DevInfos(props: { bookingInfos: any; startDate: string }) {
  const { bookingInfos, startDate } = props;

  const [show, setShow] = useState(false);
  return (
    <div className={`dev-infos ${show ? 'show' : ''}`} onClick={() => setShow(!show)}>
      <div className="title">
        <h4>Information developpeur</h4>
        <div>
          {show ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width="20"
              height="20"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
            </svg>
          )}
        </div>
      </div>
      <>
        <h5>Resumé</h5>
        <div>
          https://www.doctolib.fr/availabilities.json?visit_motive_ids={bookingInfos.motiveId}&agenda_ids=
          {bookingInfos.agenda}&practice_ids={bookingInfos.practice}&telehealth=false&limit=5&start_date={startDate}
        </div>
        <a
          target="blank"
          href={`https://www.doctolib.fr/availabilities.json?visit_motive_ids=${bookingInfos.motiveId}&agenda_ids=
            ${bookingInfos.agenda}&practice_ids=${bookingInfos.practice}&telehealth=false&limit=5&start_date=${startDate}`}
        >
          Check it here
        </a>
        <table>
          <thead>
            <tr>
              <th>Practice ID</th>
              <th>Motive ID</th>
              <th>Agenda ID</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{bookingInfos.practice}</td>
              <td>{bookingInfos.motiveId}</td>
              <td>{bookingInfos.agenda}</td>
            </tr>
          </tbody>
        </table>
      </>
    </div>
  );
}
