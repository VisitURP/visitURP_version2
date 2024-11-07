import React, { useState, useEffect } from 'react';
import { FaUser, FaCheckCircle, FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios';
import PageComponent from "../components/PageComponent";

export default function VisitorsP() {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [filteredVisitor, setFilteredVisitor] = useState(null);
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 

  const handleRegisterClick = () => {
    navigate('/register-visit');
  };

  const fetchVisitors = async () => {
    try {
      const response = await axiosClient.get('/visit');
      setVisitors(response.data);
      console.log("Datos recibidos:", response.data);
    } catch (error) {
      console.error("Error fetching visitors:", error);
    }
  };

  const handleDeleteClick = (visitor) => {
    setSelectedVisitor(visitor);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVisitor) {
      console.error("No hay visitante seleccionado para eliminar.");
      return;
    }
  
    console.log("Marcando como eliminado el visitante con ID:", selectedVisitor.id_visitorP);
  
    try {
      const response = await axiosClient.put(`/visit/${selectedVisitor.id_visitorP}/soft-delete`, {
        deleted_at: new Date().toLocaleString(),  // Se pasa la fecha y hora actual
      });
  
      setVisitors((prevVisitors) =>
        prevVisitors.filter((visitor) => visitor.id_visitorP !== selectedVisitor.id_visitorP)
      );
  
      setShowDeleteModal(false);
      setShowSuccessModal(true);
  
    } catch (error) {
      console.error("Error al eliminar visitante:", error);
    }
  };
  
  const handleEditClick = (visitData) => {
    navigate("/edit-visit", { state: { visitData } });
  };

  const handleSearchClick = () => {
    const visitor = visitors.find(v => v.id_visitorP === parseInt(searchId));
    if (visitor) {
      setFilteredVisitor([visitor]);
    } else {
      setShowNotFoundModal(true);
    }
  };

  const handleClearSearch = () => {
    setSearchId('');
    setFilteredVisitor(null);
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const closeModal = () => {
    setShowDeleteModal(false);
    setSelectedVisitor(null);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const closeNotFoundModal = () => {
    setShowNotFoundModal(false);
  };

  return (
    <PageComponent title="Gestión de Visitas Presenciales">
      <div className="bg-white p-6 shadow sm:rounded-md w-full">
  <p className="text-gray-600 mb-6">
    Puedes agregar nuevos visitantes, eliminar o cambiar información existente.
  </p>
  <div className="flex justify-between items-center mb-4 w-full">
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
  <div className="overflow-x-auto w-full">
  <table className="min-w-full bg-white border rounded-md text-sm w-full">
  <thead>
    <tr>
      <th className="py-3 px-4 border-b text-center">ID Visitante</th>
      <th className="py-3 px-4 border-b text-center">Nombre</th>
      <th className="py-3 px-4 border-b text-center">Apellido</th>
      <th className="py-3 px-4 border-b text-center">Email</th>
      <th className="py-3 px-4 border-b text-center">Documento</th>
      <th className="py-3 px-4 border-b text-center">Celular</th>
      <th className="py-3 px-4 border-b text-center">Código Ubigeo</th>
      <th className="py-3 px-4 border-b text-center">Instituto Educación</th>
      <th className="py-3 px-4 border-b text-center">Fecha Nacimiento</th>
      <th className="py-3 px-4 border-b text-center">Género</th>
      <th className="py-3 px-4 border-b text-center">Creado</th>
      <th className="py-3 px-4 border-b text-center">Actualizado</th>
      <th className="py-3 px-4 border-b text-center">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {(filteredVisitor || visitors).map((visitor, index) => (
      <tr key={index} className="text-center bg-white hover:bg-gray-50">
        <td className="py-3 px-4 border-b">{visitor.id_visitorP}</td>
        <td className="py-3 px-4 border-b">{visitor.name}</td>
        <td className="py-3 px-4 border-b">{visitor.lastName}</td>
        <td className="py-3 px-4 border-b">{visitor.email}</td>
        <td className="py-3 px-4 border-b">{visitor.docNumber}</td>
        <td className="py-3 px-4 border-b">{visitor.phone}</td>
        <td className="py-3 px-4 border-b">{visitor.cod_Ubigeo}</td>
        <td className="py-3 px-4 border-b">{visitor.educationalInstitution}</td>
        <td className="py-3 px-4 border-b">{visitor.birthDate}</td>
        <td className="py-3 px-4 border-b">{visitor.gender}</td>
        <td className="py-3 px-4 border-b">{visitor.created_at}</td>
        <td className="py-3 px-4 border-b">{visitor.updated_at}</td>
        <td className="py-3 px-4 border-b text-center">
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={() => handleEditClick(visitor)} 
            className="text-blue-500 hover:text-blue-700" >
            ✏️
          </button>
          <button 
            onClick={() => handleDeleteClick(visitor)} 
            className="text-red-500 hover:text-red-700" >
            🗑️
          </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
</div>
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
            <h2 className="text-lg font-bold mt-4">Confirmar eliminación</h2>
            <p className="text-gray-600 mt-2">¿Está seguro de que desea eliminar este registro?</p>
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Eliminar
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
            <h2 className="text-lg font-bold mt-4">Eliminado con éxito</h2>
            <p className="text-gray-600 mt-2">El registro ha sido eliminado correctamente.</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={closeSuccessModal}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </PageComponent>
  );
}
