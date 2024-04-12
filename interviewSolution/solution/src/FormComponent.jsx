// FormComponent.js
import React, { useState, useEffect, useCallback } from 'react';
import { isNameValid, getLocations } from './mock-api/apis'; // Adjust this path as necessary
import './FormComponent.css'; // This is your CSS file for styles

// Define the debounce function
const debounce = (func, delay) => {
    let inDebounce;
    return function(...args) {
      const context = this;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
  };
  
const FormComponent = () => {
  const [name, setName] = useState(''); // State for the name input
  const [nameError, setNameError] = useState(''); // State for the name validation error
  const [locations, setLocations] = useState([]); // State for the locations array
  const [selectedLocation, setSelectedLocation] = useState(''); // State for the selected location
  const [isNameChecking, setIsNameChecking] = useState(false);
  const [isLocationsLoading, setIsLocationsLoading] = useState(true);
  const [entries, setEntries] = useState([]); // Add this line to define 'entries'


  // Fetch locations from the mock API on component mount
  useEffect(() => {
   setIsLocationsLoading(true);
    getLocations()
      .then(locations => {
        setLocations(locations);
        setIsLocationsLoading(false);
      });
  }, []);

  const validateName = useCallback(debounce((name) => {
    isNameValid(name).then((isValid) => {
      setIsNameChecking(false);
      setNameError(isValid ? '' : 'This name has already been taken');
    });
  }, 500), []);

  // Effect for name input change
  useEffect(() => {
    if (name.trim() === '') {
      setNameError('');
      setIsNameChecking(false);
      return;
    }

    setIsNameChecking(true);
    validateName(name);
  }, [name, validateName]);


  const renderEmptyRows = (rowCount) => {
    return Array.from({ length: rowCount }, (_, index) => (
        <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
    ));
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!nameError && name) {
      console.log('Form submitted with:', { name, location: selectedLocation });
      // Implement form submission logic here, such as sending data to a server
    // Add the new entry to the list of entries
    setEntries(entries => [...entries, { name, location: selectedLocation }]);
    // Clear the input fields
    setName('');
    setSelectedLocation('');
    }
  };

  const handleClear = () => {
    setName('');
    setSelectedLocation('');
    setNameError('');
  };


  return (
    <div className="form-container">
      {/* ... */}
      {isNameChecking && <div className="checking">Checking name availability...</div>}
      {isLocationsLoading ? (
        <div>Loading locations...</div>
      ) : (
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={handleNameChange}
            className={nameError ? 'input-error' : ''}
            autoComplete="off"
          />
          {nameError && <div className="error">{nameError}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <select
            id="location"
            value={selectedLocation}
            onChange={handleLocationChange}
          >
            <option value="">Select a location</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button type="button" onClick={handleClear}>
            Clear
          </button>
          <button type="submit" disabled={nameError || !name}>
            Add
          </button>
        </div>
      </form>
      )}

<div className="entries-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {entries.length > 0 ? (
              entries.map((entry, index) => (
                <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td>{entry.name}</td>
                  <td>{entry.location}</td>
                </tr>
              ))
            ) : (
              renderEmptyRows(5)
            )}
          </tbody>
        </table>
      </div>    
    </div>
  );
};

export default FormComponent;
