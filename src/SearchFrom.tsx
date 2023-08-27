import { useState } from 'react';
import './SearchForm.css';

export function SearchForm(props: { handleSearch: any; resetForm: any }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const { handleSearch, resetForm } = props;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch(name, location);
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
  );
}
