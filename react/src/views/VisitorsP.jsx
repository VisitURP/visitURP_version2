import React, { useState, useEffect } from 'react';
import { FaUser, FaCheckCircle, FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios';
import PageComponent from "../components/PageComponent";

export default function VisitorsP() {
  const [visits, setVisits] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [filteredVisit, setFilteredVisit] = useState(null);
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register-visit');
  };

  const fetchVisits = async () => {
    try {
      const response = await axiosClient.get('/visit');
      setVisits(response.data);
      console.log("Datos recibidos:", response.data);
    } catch (error) {
      console.error("Error fetching visit:", error);
    }
  };

  const handleDeleteClick = (visit) => {
    setSelectedVisit(visit);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVisit) return; 
    console.log("Eliminando visitante con ID:", selectedVisit.ID_Visitante); 

    try {
      await axiosClient.delete(`/visit/${selectedVisit.ID_Visitante}`);
      
      setVisits((prevVisits) => 
        prevVisits.filter((visit) => visit.ID_Visitante !== selectedVisit.ID_Visitante)
      );

      setShowDeleteModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error al eliminar visitante:", error);
    }
  };

  const handleEditClick = (visit) => {
    navigate('/edit-visit', { state: { visitData: visit } });
  };

  const handleSearchClick = () => {
    const visit = visits.find(v => v.ID_Visitante === searchId);
    if (visit) {
      setFilteredVisit([visit]);
    } else {
      setShowNotFoundModal(true);
    }
  };

  const handleClearSearch = () => {
    setSearchId('');
    setFilteredVisit(null);
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const closeModal = () => {
    setShowDeleteModal(false);
    setSelectedVisit(null);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const closeNotFoundModal = () => {
    setShowNotFoundModal(false);
  };

  return (
    <PageComponent title="Gestión de Visitas Presenciales">
      <div className="bg-white p-6 shadow sm:rounded-md">
        <p className="text-gray-600 mb-6">
          Puedes agregar nuevos visitantes, eliminar o cambiar información existente.
        </p>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center border rounded-md">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Buscar por ID"
              className="p-2 pl-4 text-sm w-[200px] border-none outline-none"
            />
            {searchId && (
              <button onClick={handleClearSearch} className="p-2">
                <FaTimes className="text-gray-500" />
              </button>
            )}
            <button onClick={handleSearchClick} className="p-2 bg-gray-200">
              <FaSearch className="text-gray-500" />
            </button>
          </div>
          <button 
            onClick={handleRegisterClick} 
            className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
          >
            Registrar nueva visita
          </button>
        </div>
        
        <table className="min-w-full bg-white border rounded-md text-sm">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-center whitespace-nowrap w-[150px]">Identificación del visitante</th>
              <th className="py-2 px-4 border-b text-center whitespace-nowrap w-[130px]">Fecha de visita</th>
              <th className="py-2 px-4 border-b text-center whitespace-nowrap w-[100px]">Hora de visita</th>
              <th className="py-2 px-4 border-b text-center whitespace-nowrap w-[150px]">Semestre académico</th>
              <th className="py-2 px-4 border-b text-center whitespace-nowrap w-[150px]">Provincia de origen</th>
              <th className="py-2 px-4 border-b text-center whitespace-nowrap w-[100px]">Estado</th>
              <th className="py-2 px-4 border-b text-center whitespace-nowrap w-[100px]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(filteredVisit || visits).map((visit, index) => (
              <tr key={index} className="text-center">
                <td className="py-2 px-4 border-b flex items-center justify-center whitespace-nowrap w-[150px] text-sm">
                  <FaUser className="mr-2 text-gray-500" /> {visit.ID_Visitante}
                </td>
                <td className="py-2 px-4 border-b text-center whitespace-nowrap w-[130px] text-sm">{visit.Fecha_Visita}</td>
                <td className="py-2 px-4 border-b text-center whitespace-nowrap w-[100px] text-sm">{visit.Hora_Visita}</td>
                <td className="py-2 px-4 border-b text-center whitespace-nowrap w-[150px] text-sm">{visit.Semestre}</td>
                <td className="py-2 px-4 border-b text-center whitespace-nowrap w-[150px] text-sm">{visit.Provincia_O}</td>
                <td className="py-2 px-4 border-b text-center whitespace-nowrap w-[100px] text-sm">{visit.Estado}</td>
                <td className="py-2 px-4 border-b flex space-x-2 justify-center whitespace-nowrap w-[100px] text-sm">
                  <button 
                    onClick={() => handleEditClick(visit)} 
                    className="p-2 text-blue-500 hover:underline">
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(visit)} 
                    className="p-2 text-red-500 hover:underline">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNotFoundModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[400px]">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-4">
              <FaTimes className="text-4xl text-red-600" />
            </div>
            <h2 className="text-lg font-bold mt-4">Registro no encontrado</h2>
            <p className="text-gray-600 mt-2">No se ha encontrado ningún visitante con el ID ingresado.</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={closeNotFoundModal}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[400px]">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-4">
              <div className="text-4xl">🗑️</div> 
            </div>
            <h2 className="text-lg font-bold mt-4">Confirmar Eliminación</h2>
            <p className="text-gray-600 mt-2">¿Estás seguro de que deseas eliminar este visitante?</p>
            <div className="flex justify-around mt-4">
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[400px]">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-4">
              <FaCheckCircle className="text-4xl text-green-600" /> 
            </div>
            <h2 className="text-lg font-bold mt-4">Visitante eliminado</h2>
            <p className="text-gray-600 mt-2">El registro del visitante ha sido eliminado correctamente.</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={closeSuccessModal}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </PageComponent>
  );
}
