import axios from 'axios';
import { useState } from 'react';
import './App.css';
import { AgendaCard, DoctorCard, MotiveCard } from './cards';
import { ProfileType } from './cards/DoctorCard';
import { AgendaType, MotiveType } from './cards/types';
import { DateField } from './DateField';
import { DevInfos } from './DevInfos';
import { SearchForm } from './SearchFrom';

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

  const [doctorList, setDoctorList] = useState([]);

  const [motiveIds, setMotiveIds] = useState<MotiveType[]>([]);
  const [agendaId, setAgendaIds] = useState([]);

  const [bookingInfos, setBookingInfos] = useState(bookingInfosDefault);
  const [availabilities, setAvailabilities] = useState<any>();
  const [searchMotives, setSearchMotives] = useState('');

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const resetForm = () => {
    setDoctorChosen('');
    setSearchMotives('');
    setDoctorList([]);
  };

  const handleSearch = async (name: string, location: string) => {
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

  const handleDetails = async (r: ProfileType) => {
    const params = r.link.split('/').filter((param: string) => param.length > 0);
    if (!params) return;
    const locationName = params[1] ?? '';
    const response = await axios.get(
      `http://localhost:4201/detail?location=${locationName.toLowerCase()}&doctor_id=${r.value}`
    );
    if (!response) return;

    const { profile, visit_motives, agendas } = response.data.data;

    const doctorName = profile.name_with_title;
    const defaultVisitMotive = visit_motives.length > 0 ? visit_motives[0].id : '';
    const defaultAgenda = agendas.length > 0 ? agendas[0].id : '';
    const practiceId = agendas.length > 0 ? agendas[0].practice_id : profile[0].id;

    visit_motives.length > 0
      ? setMotiveIds(visit_motives)
      : setErrors({ ...errors, motiveIds: 'Aucun motif de visite disponible' });
    agendas.length > 0 ? setAgendaIds(agendas) : setErrors({ ...errors, agendaIds: 'Aucun agenda de disponible' });
    setDoctorChosen(doctorName);
    setBookingInfos({
      agenda: defaultAgenda,
      motiveId: defaultVisitMotive,
      practice: practiceId,
    });
  };

  const handleAvailabilities = async () => {
    if (bookingInfos.motiveId.length < 1) {
      setErrors({ ...errors, motiveIds: 'Veuillez séléctionner un motif de visite' });
      return;
    }
    const result = await axios.get(
      `http://localhost:4201/availabilities?visit_motive_ids=${bookingInfos.motiveId}&agenda_ids=${
        bookingInfos.agenda
      }&practice_ids=${bookingInfos.practice}&start_date=${new Date().toISOString().split('T')[0]}`
    );
    setAvailabilities(result.data);
  };

  return (
    <>
      <SearchForm handleSearch={handleSearch} resetForm={resetForm} />
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
                  callback={() => {
                    setErrors({ ...errors, motiveIds: '' });
                    setBookingInfos({
                      ...bookingInfos,
                      motiveId: '',
                    });
                  }}
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
          {errors.motiveIds && <div className="error-message">{errors.motiveIds}</div>}
          <div className="cards">
            {motiveIds
              .filter((m) => m.name.toLowerCase().indexOf(searchMotives.toLowerCase()) > -1)
              .map((m) => (
                <MotiveCard
                  key={m.id + m.name}
                  motive={m}
                  selected={bookingInfos.motiveId === m.id}
                  callback={(motive: string) => {
                    setErrors({ ...errors, motiveIds: '' });
                    setBookingInfos({
                      ...bookingInfos,
                      motiveId: motive,
                    });
                  }}
                />
              ))}
          </div>
          <h3>Numéro d'agenda</h3>
          <div className="cards">
            {agendaId.map(
              (a: AgendaType) =>
                !a.booking_disabled && (
                  <AgendaCard
                    key={a.id}
                    agenda={a}
                    selected={a.id === bookingInfos.agenda}
                    callback={() => {
                      setBookingInfos({
                        ...bookingInfos,
                        agenda: a.id,
                      });
                    }}
                  />
                )
            )}
          </div>
          <DateField startDate={startDate} setStartDate={setStartDate} />
          {availabilities && <div>{availabilities.message}</div>}
          <input type={'submit'} value="Surveiller ce médecin" onClick={() => handleAvailabilities()} />
        </>
      )}
      <DevInfos bookingInfos={bookingInfos} startDate={startDate} />
    </>
  );
}

export default App;
