import React, { useState, useEffect } from "react"; 
import { FaEdit, FaTrashAlt, FaPlus, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    docNumber: "",
    cod_Ubigeo: "",
    educationalInstitution: "",
    birthDate: "",
    gender: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchVisitors();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredVisitors(
        visitors.filter((visitor) => {
          const normalizedQuery = searchQuery.toLowerCase();
          return (
            visitor.id_visitorP.toString().includes(normalizedQuery) ||
            visitor.name.toLowerCase().includes(normalizedQuery) ||
            visitor.lastName.toLowerCase().includes(normalizedQuery)
          );
        })
      );
    } else {
      setFilteredVisitors(visitors);
    }
  }, [searchQuery, visitors]);

  const fetchVisitors = async () => {
    try {
      const response = await axios.get(
        "http://localhost/visitURP_version2/public/index.php/api/list-visitorPs"
      );
      setVisitors(response.data);
    } catch (error) {
      console.error("Error al obtener los visitantes:", error);
    }
  };

  const validateFields = () => {
    if (!formData.name || !formData.lastName || !formData.email || !formData.phone) {
      setErrorMessage("Por favor, complete todos los campos.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleAddVisitor = async () => {
    if (!validateFields()) return;
    try {
      const newVisitorData = {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        fk_docType_id: 1, // Definido por defecto, ajusta si es necesario
        docNumber: formData.docNumber,
        phone: formData.phone,
        cod_Ubigeo: formData.cod_Ubigeo,
        educationalInstitution: formData.educationalInstitution,
        birthDate: formData.birthDate,
        gender: formData.gender,
      };
      await axios.post(
        "http://localhost/visitURP_version2/public/index.php/api/register-visitorP",
        newVisitorData
      );
      fetchVisitors();
      setIsModalOpen(false);
      setFormData({
        name: "",
        lastName: "",
        email: "",
        phone: "",
        docNumber: "",
        cod_Ubigeo: "",
        educationalInstitution: "",
        birthDate: "",
        gender: "",
      });
      setSuccessMessage("Visitante registrado con éxito.");
    } catch (error) {
      console.error("Error al registrar el visitante:", error);
    }
  };

  const handleEditVisitor = async () => {
    if (!validateFields()) return;

    try {
      const updatedVisitorData = {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        docNumber: formData.docNumber,
        cod_Ubigeo: formData.cod_Ubigeo,
        educationalInstitution: formData.educationalInstitution,
        birthDate: formData.birthDate,
        gender: formData.gender,
      };

      await axios.put(
        `http://localhost/visitURP_version2/public/index.php/api/update-visitorP/${selectedVisitor.id_visitorP}`,
        updatedVisitorData
      );
      fetchVisitors();
      setIsEditModalOpen(false);
      setFormData({
        name: "",
        lastName: "",
        email: "",
        phone: "",
        docNumber: "",
        cod_Ubigeo: "",
        educationalInstitution: "",
        birthDate: "",
        gender: "",
      });
      setSuccessMessage("Visitante editado con éxito.");
    } catch (error) {
      console.error("Error al actualizar el visitante:", error);
    }
  };

  const handleDeleteVisitor = async () => {
    try {
      await axios.delete(
        `http://localhost/visitURP_version2/public/index.php/api/delete-visitorInfo/${selectedVisitor.id_visitorP}`
      );
      fetchVisitors();
      setIsDeleteModalOpen(false);
      setSuccessMessage("Visitante eliminado con éxito.");
    } catch (error) {
      console.error("Error al eliminar el visitante:", error);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-[#282424] text-center mb-6 bg-white border border-gray-300 rounded-lg py-5">
        Gestionar Visitantes Presenciales
      </h1>
      <p className="text-lg text-gray-500 mb-12 text-center">
        Puedes agregar nuevo visitante, modificar o eliminar el existente.
      </p>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por ID o nombre"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg flex items-center"
          onClick={() => {
            setErrorMessage("");
            setIsModalOpen(true);
          }}
        >
          <FaPlus className="mr-2" />
          Registrar Visitante
        </button>
      </div>

      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
            <th className="py-3 px-6 text-center">ID</th>
            <th className="py-3 px-6 text-center">Nombre Completo</th>
            <th className="py-3 px-6 text-center">Correo</th>
            <th className="py-3 px-6 text-center">Teléfono</th>
            <th className="py-3 px-6 text-center">Institución Educativa</th>
            <th className="py-3 px-6 text-center">Fecha de Nacimiento</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredVisitors.length > 0 ? (
            filteredVisitors.map((visitor) => (
              <tr
                key={visitor.id_visitorP}
                className="text-center bg-white border-b"
              >
                <td className="py-4">{visitor.id_visitorP}</td>
                <td className="py-4">
                  {visitor.name} {visitor.lastName}
                </td>
                <td className="py-4">{visitor.email}</td>
                <td className="py-4">{visitor.phone}</td>
                <td className="py-4">{visitor.educationalInstitution}</td>
                <td className="py-4">
                  {new Date(visitor.birthDate).toLocaleDateString()}
                </td>
                <td className="flex items-center justify-center space-x-4 py-4">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      setSelectedVisitor(visitor);
                      setFormData({
                        name: visitor.name,
                        lastName: visitor.lastName,
                        email: visitor.email,
                        phone: visitor.phone,
                        docNumber: visitor.docNumber,
                        cod_Ubigeo: visitor.cod_Ubigeo,
                        educationalInstitution: visitor.educationalInstitution,
                        birthDate: visitor.birthDate,
                        gender: visitor.gender,
                      });
                      setIsEditModalOpen(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {
                      setSelectedVisitor(visitor);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-4 text-center text-gray-500">
                No hay visitantes registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Add */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Registrar Visitante</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <input
              type="email"
              placeholder="Correo"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <div className="flex justify-between">
              <button
                onClick={handleAddVisitor}
                className="bg-green-500 text-white px-6 py-2 rounded"
              >
                Registrar
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded"
              >
                Cerrar
              </button>
            </div>
            {errorMessage && (
              <p className="text-red-500 mt-4">{errorMessage}</p>
            )}
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Editar Visitante</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <input
              type="email"
              placeholder="Correo"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <div className="flex justify-between">
              <button
                onClick={handleEditVisitor}
                className="bg-blue-500 text-white px-6 py-2 rounded"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded"
              >
                Cerrar
              </button>
            </div>
            {errorMessage && (
              <p className="text-red-500 mt-4">{errorMessage}</p>
            )}
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-center">
            <p className="text-lg mb-4">
              ¿Seguro que quieres eliminar este visitante?
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleDeleteVisitor}
                className="bg-red-500 text-white px-6 py-2 rounded"
              >
                Eliminar
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500 text-white p-3 rounded mt-4">
          {successMessage}
        </div>
      )}
    </div>
  );
}
