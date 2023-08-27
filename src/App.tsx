import axios from 'axios';
import { FormEvent, useState } from 'react';
import { AgendaCard, AgendaType } from './AgendaCard';
import './App.css';
import './cards.css';
import { DoctorCard, ProfileType } from './DoctorCard';
import { MotiveCard, MotiveType } from './MotiveCard';

const bookingInfosDefault = {
  practice: '',
  motiveId: '',
  agenda: '',
};

type GenericErrorType = {
  [key: string]: string;
};
function App() {
  const [errors, setErrors] = useState<GenericErrorType>({});
  const [doctorChosen, setDoctorChosen] = useState('');

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const [doctorList, setDoctorList] = useState([]);

  const [motiveIds, setMotiveIds] = useState<MotiveType[]>([]);
  const [agendaId, setAgendaIds] = useState([]);
  const [bookingInfos, setBookingInfos] = useState(bookingInfosDefault);
  const [availabilities, setAvailabilities] = useState<any>();
  const [searchMotives, setSearchMotives] = useState('');

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBookingInfos(bookingInfosDefault);
    setDoctorChosen('');
    const result = await axios.get(`http://localhost:4201/search/${(name + ' ' + location).split(' ').join('+')}`);

    if (result.data.profiles.length) {
      // setPracticeId(result.data.profile.id)
      setDoctorList(result.data.profiles);
      if (errors.doctorList) {
        delete errors.doctorList;
      }
    } else {
      setDoctorList([]);
      setErrors({ ...errors, doctorList: 'Aucun médecin correspondant' });
    }
  };

  const handleDetails = async (r: any) => {
    setBookingInfos({
      ...bookingInfos,
      practice: r.value,
    });
    const params = r.link.split('/').filter((param: string) => param.length > 0);
    if (!params) return;
    const locationName = params[1] ?? '';
    const response = await axios.get(
      `http://localhost:4201/detail?location=${locationName.toLowerCase()}&doctor_id=${r.value}`
    );
    if (response) {
      const { profile, visit_motives, agendas } = response.data.data;
      // console.log(profile, visit_motives, ag);

      const doctorName = profile.name_with_title;
      const defaultVisitMotive = visit_motives.length > 0 ? visit_motives[0].id : '';
      const defaultAgenda = agendas.length > 0 ? agendas[0].id : '';
      const practiceId = agendas.length > 0 ? agendas[0].practice_id : profile[0].id;

      setDoctorChosen(doctorName);
      visit_motives.length > 0
        ? setMotiveIds(visit_motives)
        : setErrors({ ...errors, motiveIds: 'Aucun motif de visite disponible' });
      agendas.length > 0 ? setAgendaIds(agendas) : setErrors({ ...errors, agendaIds: 'Aucun agenda de disponible' });
      setBookingInfos({
        agenda: defaultAgenda,
        motiveId: defaultVisitMotive,
        practice: practiceId,
      });
    } else {
      console.log('Error getting doc infos');
    }
  };

  const resetForm = () => {
    setDoctorChosen('');
    setSearchMotives('');
    setDoctorList([]);
  };

  const handleAvailabilities = async () => {
    const result = await axios.get(
      `http://localhost:4201/availabilities?visit_motive_ids=${bookingInfos.motiveId}&agenda_ids=${
        bookingInfos.agenda
      }&practice_ids=${bookingInfos.practice}&start_date=${new Date().toISOString().split('T')[0]}`
    );
    setAvailabilities(result.data);
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <h3>Rechercher un médecin, un cabinet médical ou une pharmacie</h3>
        <div className="form-content">
          <div className="form-group icon-form-group">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <input
              placeholder="Nom du docteur"
              value={name}
              onChange={(e) => {
                resetForm();
                setName(e.target.value);
              }}
              name="name"
              type="text"
            />
          </div>
          <div className="form-group icon-form-group">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
            </div>
            <input
              placeholder="Ville"
              value={location}
              onChange={(e) => {
                resetForm();
                setLocation(e.target.value);
              }}
              name="location"
              type="text"
            />
            <input className="submitButton" type="submit" value="Rechercher " />
          </div>
        </div>
      </form>
      {doctorList.length > 0 && (
        <>
          <h3>Médecins / emplacements trouvés</h3>
          <div className="cards doctors">
            {doctorList.map((doctor: ProfileType) => (
              <DoctorCard
                key={doctor.name + doctor.value}
                doctor={doctor}
                selected={doctorChosen === doctor.name}
                callback={(doc: ProfileType) => handleDetails(doc)}
              />
            ))}
          </div>
        </>
      )}
      {errors.doctorList && <div className="error-message">{errors.doctorList}</div>}
      {doctorChosen.length > 0 && (
        <>
          <div className="form-header">
            <div>
              <h3>Raison de la visite</h3>
            </div>
            {motiveIds
              .filter((m) => m.id === bookingInfos.motiveId)
              .map((m) => (
                <MotiveCard
                  key={'selected' + m.id}
                  motive={m}
                  selected={bookingInfos.motiveId === m.id}
                  callback={() =>
                    setBookingInfos({
                      ...bookingInfos,
                      motiveId: '',
                    })
                  }
                />
              ))}
            <div className="form-header-search">
              <input
                placeholder="Rechercher un motif ..."
                value={searchMotives}
                onChange={(e) => {
                  setSearchMotives(e.target.value);
                }}
                name="name"
                type="text"
              />
            </div>
          </div>
          <div className="cards">
            {motiveIds
              .filter((m) => m.name.toLowerCase().indexOf(searchMotives.toLowerCase()) > -1)
              .map((m) => (
                <MotiveCard
                  key={m.id + m.name}
                  motive={m}
                  selected={bookingInfos.motiveId === m.id}
                  callback={(motive: string) =>
                    setBookingInfos({
                      ...bookingInfos,
                      motiveId: motive,
                    })
                  }
                />
              ))}
          </div>
          {errors.motiveIds && <div className="error-message">{errors.motiveIds}</div>}
          <h3>Numéro d'agenda</h3>
          <div className="cards">
            {agendaId.map(
              (a: AgendaType) =>
                !a.booking_disabled && (
                  <AgendaCard
                    key={a.id}
                    agenda={a}
                    selected={a.id === bookingInfos.agenda}
                    callback={(a: AgendaType) => {
                      setBookingInfos({
                        ...bookingInfos,
                        agenda: a.id,
                      });
                    }}
                  />
                )
            )}
          </div>
          <h3>Date</h3>
          <div>
            <div className="form-group">
              <input
                value={startDate}
                onChange={(e) => {
                  console.log(e.target.value);
                  setStartDate(e.target.value);
                }}
                name="appointmentDate"
                type="date"
              />
            </div>
          </div>
          <h5>Resumé</h5>
          <div>
            https://www.doctolib.fr/availabilities.json?visit_motive_ids={bookingInfos.motiveId}&agenda_ids=
            {bookingInfos.agenda}&practice_ids={bookingInfos.practice}&telehealth=false&limit=5&start_date={startDate}
          </div>
          <a
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
          {availabilities && <div>{availabilities.message}</div>}
          <input type={'submit'} value="Check this doc" onClick={() => handleAvailabilities()} />
        </>
      )}
    </>
  );
}

export default App;
