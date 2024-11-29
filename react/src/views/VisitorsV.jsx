import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function VirtualVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Obtener visitantes al montar el componente
  useEffect(() => {
    fetchVisitors();
  }, []);

  // Obtener los datos de visitantes al montar el componente
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await axios.get(
          "http://localhost/visitURP_version2/public/index.php/api/details-visitorsV"
        );
        setVisitors(response.data);
      } catch (error) {
        console.error("Error al obtener los visitantes virtuales:", error);
      }
    };

    fetchVisitors();
  }, []);

  // Filtrar visitantes según la búsqueda
  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredVisitors(
        visitors.filter(
          (visitor) =>
            visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            visitor.id_visitorV.toString().includes(searchQuery)
        )
      );
    } else {
      setFilteredVisitors([]);
    }
  }, [searchQuery, visitors]);

  const fetchVisitors = async () => {
    try {
      const response = await axios.get(
        "http://localhost/visitURP_version2/public/index.php/api/list-visitorVs"
      );
      setVisitors(response.data);
    } catch (error) {
      console.error("Error al obtener los visitantes virtuales:", error);
    }
  };

  const handleUpdateVisitor = async () => {
    try {
      // Reemplazar campos vacíos con null para cumplir con el backend
      const updatedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value || null])
      );

      await axios.put(
        `http://localhost/visitURP_version2/public/index.php/api/update-visitorV/${selectedVisitor.id_visitorV}`,
        updatedData
      );

      fetchVisitors(); // Recarga la lista actualizada
      setIsEditModalOpen(false);
      setSuccessMessage("Visitante actualizado con éxito.");
    } catch (error) {
      console.error("Error al actualizar el visitante:", error);
    }
  };

  const handleDeleteVisitor = async () => {
    try {
      await axios.delete(
        `http://localhost/visitURP_version2/public/index.php/api/delete-visitorV/${selectedVisitor.id_visitorV}`
      );
      fetchVisitors();
      setIsDeleteModalOpen(false);
      setSuccessMessage("Visitante eliminado con éxito.");
    } catch (error) {
      console.error("Error al eliminar el visitante:", error);
    }
  };

  // Validar los datos del formulario
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres.";
    }
    if (!formData.lastName || formData.lastName.trim().length < 2) {
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres.";
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Debe ingresar un correo válido.";
    }
    if (!formData.phone || !/^\d{9}$/.test(formData.phone)) {
      newErrors.phone = "El teléfono debe tener 9 dígitos.";
    }
    if (!formData.educationalInstitution) {
      newErrors.educationalInstitution =
        "Debe ingresar la institución educativa.";
    }
    if (!formData.birthDate || isNaN(new Date(formData.birthDate).getTime())) {
      newErrors.birthDate = "Debe ingresar una fecha válida.";
    }
    if (!formData.gender || !["M", "F"].includes(formData.gender)) {
      newErrors.gender = "Debe seleccionar un género válido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar el envío del formulario
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };


  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-[#282424] text-center mb-6 bg-white border border-gray-300 rounded-lg py-5">
        Gestionar Visitantes Virtuales
      </h1>
      <p className="text-lg text-gray-500 mb-12 text-center">
        A continuación se muestra la información de los visitantes virtuales
        registrados.
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
      </div>

      <table className="min-w-full border rounded-lg overflow-hidden mb-8">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
            <th className="py-3 px-6 text-center">ID</th>
            <th className="py-3 px-6 text-center">Nombre</th>
            <th className="py-3 px-6 text-center">Apellido</th>
            <th className="py-3 px-6 text-center">Correo</th>
            <th className="py-3 px-6 text-center">Teléfono</th>
            <th className="py-3 px-6 text-center">Institución Educativa</th>
            <th className="py-3 px-6 text-center">Fecha de Nacimiento</th>
            <th className="py-3 px-6 text-center">Género</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {visitors.length > 0 ? (
            visitors.map((visitor) => (
              <tr
                key={visitor.id_visitorV}
                className="text-center bg-white border-b"
              >
                <td className="py-4">{visitor.id_visitorV}</td>
                <td className="py-4">{visitor.name}</td>
                <td className="py-4">{visitor.lastName}</td>
                <td className="py-4">{visitor.email}</td>
                <td className="py-4">{visitor.phone}</td>
                <td className="py-4">{visitor.educationalInstitution}</td>
                <td className="py-4">
                  {new Date(visitor.birthDate).toLocaleDateString()}
                </td>
                <td className="py-4">
                  {visitor.gender === "F" ? "Femenino" : "Masculino"}
                </td>
                <td className="flex items-center justify-center space-x-4 py-4">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      setSelectedVisitor(visitor);
                      setFormData({
                        name: visitor.name || "",
                        lastName: visitor.lastName || "",
                        email: visitor.email || "",
                        phone: visitor.phone || "",
                        educationalInstitution:
                          visitor.educationalInstitution || "",
                        birthDate: visitor.birthDate
                          ? new Date(visitor.birthDate)
                              .toISOString()
                              .split("T")[0]
                          : "",
                        gender: visitor.gender || "",
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
              <td colSpan="8" className="py-4 text-center text-gray-500">
                No hay visitantes virtuales registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isEditModalOpen && (
        <EditModal
          formData={formData}
          setFormData={setFormData}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateVisitor}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          onConfirm={handleDeleteVisitor}
          onClose={() => setIsDeleteModalOpen(false)}
          message={`¿Está seguro de que desea eliminar a "${selectedVisitor?.name}"?`}
        />
      )}
    </div>
  );
}

function EditModal({ formData, setFormData, onClose, onSubmit }) {
  const [errors, setErrors] = useState({});

  // Validar los datos del formulario
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres.";
    }
    if (formData.lastName && formData.lastName.trim().length < 2) {
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres.";
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Debe ingresar un correo válido.";
    }
    if (!formData.phone || !/^\d{9}$/.test(formData.phone)) {
      newErrors.phone = "El teléfono debe tener 9 dígitos.";
    }
    if (
      formData.educationalInstitution &&
      formData.educationalInstitution.trim() === ""
    ) {
      newErrors.educationalInstitution =
        "Debe ingresar la institución educativa.";
    }
    if (!formData.birthDate || isNaN(new Date(formData.birthDate).getTime())) {
      newErrors.birthDate = "Debe ingresar una fecha válida.";
    }
    if (!formData.gender || !["M", "F"].includes(formData.gender)) {
      newErrors.gender = "Debe seleccionar un género válido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar el envío del formulario
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 overflow-hidden">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Editar Visitante
        </h2>
        <div
          className="max-h-[70vh] overflow-y-auto pr-2" // Contenedor desplazable
        >
          {/* Nombre */}
          <label className="block text-gray-700 font-semibold mb-2">
            Nombre
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg mb-2"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          {/* Apellido */}
          <label className="block text-gray-700 font-semibold mb-2">
            Apellido
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg mb-2"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          )}
          {/* Correo */}
          <label className="block text-gray-700 font-semibold mb-2">
            Correo
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg mb-2"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
          {/* Teléfono */}
          <label className="block text-gray-700 font-semibold mb-2">
            Teléfono
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg mb-2"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
          {/* Institución Educativa */}
          <label className="block text-gray-700 font-semibold mb-2">
            Institución Educativa
          </label>
          <input
            type="text"
            value={formData.educationalInstitution}
            onChange={(e) =>
              setFormData({
                ...formData,
                educationalInstitution: e.target.value,
              })
            }
            className="w-full px-4 py-2 border rounded-lg mb-2"
          />
          {errors.educationalInstitution && (
            <p className="text-red-500 text-sm">
              {errors.educationalInstitution}
            </p>
          )}
          {/* Fecha de Nacimiento */}
          <label className="block text-gray-700 font-semibold mb-2">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) =>
              setFormData({ ...formData, birthDate: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg mb-2"
          />
          {errors.birthDate && (
            <p className="text-red-500 text-sm">{errors.birthDate}</p>
          )}
          {/* Género */}
          <label className="block text-gray-700 font-semibold mb-2">
            Género
          </label>
          <select
            value={formData.gender || ""}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value || null })
            }
            className="w-full px-4 py-2 border rounded-lg mb-6"
          >
            <option value="">Seleccionar...</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm">{errors.gender}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-between gap-4 mt-4">
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg flex-1"
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg flex-1"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}




function DeleteModal({ onConfirm, onClose, message }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">
          Confirmar Eliminación
        </h2>
        <p className="text-gray-700 text-center mb-6">{message}</p>
        <div className="flex justify-between gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg flex-1"
          >
            Eliminar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg flex-1"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
