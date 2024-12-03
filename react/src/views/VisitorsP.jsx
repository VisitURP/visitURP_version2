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
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchVisitors();
  }, []);

  useEffect(() => {
    const normalizeText = (text) => {
      return text
        .toString()
        .normalize("NFD") // Descompone caracteres con tildes
        .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos
        .toLowerCase(); // Convierte a minúsculas
    };

    if (searchQuery.trim()) {
      setFilteredVisitors(
        visitors.filter((visitor) => {
          const normalizedQuery = normalizeText(searchQuery);
          const matchesName = normalizeText(visitor.name).includes(
            normalizedQuery
          );
          const matchesId = normalizeText(visitor.id.toString()).includes(
            normalizedQuery
          );
          return matchesName || matchesId;
        })
      );
    } else {
      setFilteredVisitors([]);
    }
  }, [searchQuery, visitors]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchVisitors = async () => {
    try {
      const response = await axios.get(
        "http://localhost/visitURP_version2/public/index.php/api/details-visitorsP"
      );
      setVisitors(response.data);
    } catch (error) {
      console.error("Error al obtener los visitantes:", error);
    }
  };

  const searchVisitor = () => {
    const query = searchQuery.trim().toLowerCase();
    const results = visitors.filter(
      (visitor) =>
        visitor.id_visitorP.toString().includes(query) ||
        visitor.name.toLowerCase().includes(query) ||
        visitor.lastName.toLowerCase().includes(query)
    );
    setFilteredVisitors(results);
  };

  const validateFields = () => {
    if (!formData.name) {
      setErrorMessage("Por favor, ingrese el nombre del visitante.");
      return false;
    }
    if (!formData.email) {
      setErrorMessage(
        "Por favor, ingrese el correo electrónico del visitante."
      );
      return false;
    }
    if (!formData.phone) {
      setErrorMessage("Por favor, ingrese el teléfono del visitante.");
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
       fk_docType_id: 1, // Supón que el tipo de documento es 1 por defecto
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

    if (
      selectedVisitor.name === formData.name &&
      selectedVisitor.email === formData.email &&
      selectedVisitor.phone === formData.phone
    ) {
      setErrorMessage("No se realizaron modificaciones.");
      return;
    }

    try {
      const updatedVisitorData = {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        // Asegúrate de incluir todos los campos necesarios
      };

      await axios.put(
        `http://localhost/visitURP_version2/public/index.php/api/update-visitorP/${selectedVisitor.id_visitorP}`,
        updatedVisitorData
      );
      fetchVisitors();
      setIsEditModalOpen(false);
      setFormData({ name: "", lastName: "", email: "", phone: "" });
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
            <th className="py-3 px-6 text-center">Nombre</th>
            <th className="py-3 px-6 text-center">Correo</th>
            <th className="py-3 px-6 text-center">Teléfono</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {searchQuery.trim() ? (
            filteredVisitors.length > 0 ? (
              filteredVisitors.map((visitor) => (
                <tr key={visitor.id} className="text-center bg-white border-b">
                  <td className="py-4">{visitor.id}</td>
                  <td className="py-4">{visitor.name}</td>
                  <td className="py-4">{visitor.email}</td>
                  <td className="py-4">{visitor.phone}</td>
                  <td className="flex items-center justify-center space-x-4 py-4">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => {
                        setErrorMessage("");
                        setSelectedVisitor(visitor);
                        setFormData({
                          name: visitor.name,
                          email: visitor.email,
                          phone: visitor.phone,
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
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No hay resultados para tu búsqueda.
                </td>
              </tr>
            )
          ) : visitors.length > 0 ? (
            visitors.map((visitor) => (
              <tr key={visitor.id} className="text-center bg-white border-b">
                <td className="py-4">{visitor.id}</td>
                <td className="py-4">{visitor.name}</td>
                <td className="py-4">{visitor.email}</td>
                <td className="py-4">{visitor.phone}</td>
                <td className="flex items-center justify-center space-x-4 py-4">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      setErrorMessage("");
                      setSelectedVisitor(visitor);
                      setFormData({
                        name: visitor.name,
                        email: visitor.email,
                        phone: visitor.phone,
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
              <td colSpan="5" className="py-4 text-center text-gray-500">
                No hay visitantes registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Add */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Registrar Visitante</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Correo"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <button onClick={handleAddVisitor}>Registrar</button>
            <button onClick={() => setIsModalOpen(false)}>Cerrar</button>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Visitante</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Correo"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <button onClick={handleEditVisitor}>Guardar Cambios</button>
            <button onClick={() => setIsEditModalOpen(false)}>Cerrar</button>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {isDeleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>¿Seguro que quieres eliminar este visitante?</p>
            <button onClick={handleDeleteVisitor}>Eliminar</button>
            <button onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </button>
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
