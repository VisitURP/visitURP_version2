import React, { useEffect, useState } from 'react';
import './Semesters.css';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

export default function Semesters() {
  const [semesters, setSemesters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [semesterName, setSemesterName] = useState('');
  const [until, setUntil] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [semesterToEdit, setSemesterToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [semesterToDelete, setSemesterToDelete] = useState(null);

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
        console.log(data); // Verifica la respuesta aquí
        setSemesters([...semesters, data]);
        setIsModalOpen(false);
        setSemesterName('');
        setUntil('');
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleUpdateSemester = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/semesters/${semesterToEdit.id_semester}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        semesterName: semesterToEdit.semesterName,
        until: semesterToEdit.until,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Error al actualizar el semestre');
      })
      .then((updatedSemester) => {
        // Actualiza la lista de semestres en el estado
        setSemesters((prevSemesters) =>
          prevSemesters.map((semester) =>
            semester.id_semester === updatedSemester.id_semester ? updatedSemester : semester
          )
        );
        setIsEditModalOpen(false);
      })
      .catch((error) => console.error('Error al actualizar el semestre:', error));
  };

  const handleEditClick = (semester) => {
    setSemesterToEdit(semester);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (semester) => {
    setSemesterToDelete(semester);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/semesters/${semesterToDelete.id_semester}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setSemesters((prevSemesters) =>
            prevSemesters.filter((semester) => semester.id_semester !== semesterToDelete.id_semester)
          );
          setIsDeleteModalOpen(false);
        } else {
          throw new Error('Error al eliminar el semestre');
        }
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
      <th>Última Modificación</th>
      <th>Otras Opciones</th> {/* Nuevo encabezado */}
    </tr>
  </thead>
  <tbody>
          {filteredSemesters.map((semester) => (
            <tr key={semester.id_semester}>
              <td>{semester.id_semester}</td>
              <td>{semester.semesterName}</td>
              <td>{semester.until}</td>
              <td>{semester.updated_at}</td>
              <td className="icon-buttons">
                <button
                  className="edit-button"
                  onClick={() => handleEditClick(semester)}
                >
                  <FaEdit />
                </button>
                {isEditModalOpen && (
                  <div className="modale">
                    <div className="modale-content">
                      <h2 className="modale-title">Editar Semestre</h2>
                      <label className="modale-label1">
                        Nombre del Semestre:
                        <input
                          className="modale-input1"
                          type="text"
                          value={semesterToEdit?.semesterName || ''}
                          onChange={(e) =>
                            setSemesterToEdit((prev) => ({
                              ...prev,
                              semesterName: e.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className="modale-label2">
                        Fecha Hasta:
                        <input
                          className="modale-input2"
                          type="datetime-local"
                          value={semesterToEdit?.until || ''}
                          onChange={(e) =>
                            setSemesterToEdit((prev) => ({
                              ...prev,
                              until: e.target.value,
                            }))
                          }
                        />
                      </label>
                      <button className="modale-btn1" onClick={handleUpdateSemester}>
                        Guardar Cambios
                      </button>
                      <button className="modale-btn2" onClick={() => setIsEditModalOpen(false)}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
                <button className="delete-button" onClick={() => handleDeleteClick(semester)}>
                   <FaTrashAlt />
                    </button>
                {isDeleteModalOpen && (
       <div className="modal-delete">
        <div className="modal-content-delete">
         <h2 className="modal-title-delete">Eliminar Semestre</h2>
         <p className="modal-p-delete">¿Estás seguro de que deseas eliminar el semestre "{semesterToDelete?.semesterName}"?</p>
         <button className="modal-btn-confirm" onClick={handleConfirmDelete}>Confirmar</button>
         <button className="modal-btn-cancel-delete" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
        </div>
       </div>
   )}
              </td>
            </tr>
          ))}
        </tbody>
    </table>
    </div>
  );
}
