import React, { useEffect, useState } from 'react';
import './Semesters.css';

export default function Semesters() {
  const [semesters, setSemesters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [semesterName, setSemesterName] = useState('');
  const [until, setUntil] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/semesters`)
      .then((response) => response.json())
      .then((data) => setSemesters(data))
      .catch((error) => console.error('Error al obtener los semestres:', error));
  }, []);

  const handleAddSemester = () => {
    const newSemester = {
      semesterName,
      until,
      created_at: new Date().toISOString(),
    };

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/semesters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSemester),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Error al registrar el nuevo semestre');
      })
      .then((data) => {
        setSemesters([...semesters, data]);
        setIsModalOpen(false);
        setSemesterName('');
        setUntil('');
      })
      .catch((error) => console.error('Error:', error));
  };

  const filteredSemesters = selectedSemester
    ? semesters.filter((semester) => semester.semesterName === selectedSemester)
    : semesters;

  return (
    <div className="semesters-container">
      <h1 className="semesters-title">Gestionar Semestres Académicos</h1>
      <p className="semesters-description">
        Puedes agregar nuevos semestres académicos, eliminar o modificar los existentes.
      </p>
      <div className="semesters-select">
        <select id="semester-select" onChange={(e) => setSelectedSemester(e.target.value)}>
          <option value="">Seleccione un semestre</option>
          <option value="2024-2">2024-2</option>
          <option value="2024-1">2024-1</option>
          <option value="2023-2">2023-2</option>
          <option value="2023-1">2023-1</option>
          <option value="2022-2">2022-2</option>
          <option value="2022-1">2022-1</option>
        </select>
        <button 
          className="semesters-button" 
          onClick={() => setIsModalOpen(true)} 
        >
          Registrar nuevo semestre
        </button>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="modal-title">Registrar Nuevo Semestre</h2>
            <label className="modal-label1">
              Nombre del Semestre:
              <input
                className="modal-input1" // Clase para el input
                type="text"
                value={semesterName}
                onChange={(e) => setSemesterName(e.target.value)} 
              />
            </label>
            <label className="modal-label2">
              Fecha Hasta:
              <input
                className="modal-input2"
                type="datetime-local"
                value={until}
                onChange={(e) => setUntil(e.target.value)}
              />
            </label>
            <button className="modal-btn1" onClick={handleAddSemester}>Agregar Semestre</button>
            <button className="modal-btn2" onClick={() => setIsModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}
      <table className="semesters-table">
        <thead>
          <tr>
            <th>ID Semestre</th>
            <th>Nombre del Semestre</th>
            <th>Hasta</th>
            <th>Creado En</th>
            <th>Actualizado En</th>
            <th>Eliminado En</th>
          </tr>
        </thead>
        <tbody>
          {filteredSemesters.map((semester) => (
            <tr key={semester.id_semester}>
              <td>{semester.id_semester}</td>
              <td>{semester.semesterName}</td>
              <td>{semester.until}</td>
              <td>{semester.created_at}</td>
              <td>{semester.updated_at}</td>
              <td>{semester.deleted_at || 'No Eliminado'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}