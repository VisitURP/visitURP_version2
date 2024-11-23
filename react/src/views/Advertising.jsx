import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import axios from "axios";

export default function Publicities() {
  const [publicities, setPublicities] = useState([]);
  const [filteredPublicities, setFilteredPublicities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPublicity, setSelectedPublicity] = useState(null);
  const [formData, setFormData] = useState({ title: "", url: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchPublicities();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchPublicities = async () => {
    try {
      const response = await axios.get(
        "http://localhost/visitURP_Backend/public/index.php/api/list-publicities"
      );
      setPublicities(response.data);
    } catch (error) {
      console.error("Error al obtener las publicidades:", error);
    }
  };

  const searchPublicity = () => {
    const query = searchQuery.toLowerCase();
    const results = publicities.filter(
      (publicity) =>
        publicity.id.toString().includes(query) ||
        publicity.title.toLowerCase().includes(query)
    );
    setFilteredPublicities(results);
  };

  const validateFields = () => {
    if (!formData.title) {
      setErrorMessage("Por favor, ingrese el título de la publicidad.");
      return false;
    }
    const urlRegex =
      /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!urlRegex.test(formData.url)) {
      setErrorMessage("Por favor, ingrese un URL válido (http:// o https://).");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleAddPublicity = async () => {
    if (!validateFields()) return;
    try {
      await axios.post(
        "http://localhost/visitURP_Backend/public/index.php/api/register-publicity",
        formData
      );
      fetchPublicities();
      setIsModalOpen(false);
      setFormData({ title: "", url: "" });
      setSuccessMessage("Publicidad registrada con éxito.");
    } catch (error) {
      console.error("Error al registrar la publicidad:", error);
    }
  };

  const handleEditPublicity = async () => {
    if (!validateFields()) return;
    try {
      await axios.put(
        `http://localhost/visitURP_Backend/public/index.php/api/update-publicity/${selectedPublicity.id}`,
        formData
      );
      fetchPublicities();
      setIsEditModalOpen(false);
      setFormData({ title: "", url: "" });
      setSuccessMessage("Publicidad editada con éxito.");
    } catch (error) {
      console.error("Error al actualizar la publicidad:", error);
    }
  };

  const handleDeletePublicity = async () => {
    try {
      await axios.delete(
        `http://localhost/visitURP_Backend/public/index.php/api/delete-publicity/${selectedPublicity.id}`
      );
      fetchPublicities();
      setIsDeleteModalOpen(false);
      setSuccessMessage("Publicidad eliminada con éxito.");
    } catch (error) {
      console.error("Error al eliminar la publicidad:", error);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-[#282424] text-center mb-6 bg-white border border-gray-300 rounded-lg py-5">
        Gestionar Publicidad
      </h1>
      <p className="text-lg text-gray-500 mb-12 text-center">
        Puedes agregar nueva publicidad, modificar o eliminar la existente.
      </p>

      <div className="mb-6 flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar por ID o título"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg"
          onClick={searchPublicity}
        >
          Buscar
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg"
          onClick={() => {
            setErrorMessage("");
            setIsModalOpen(true);
          }}
        >
          <FaPlus className="inline mr-2" />
          Registrar Publicidad
        </button>
      </div>

      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
            <th className="py-3 px-6 text-center">ID</th>
            <th className="py-3 px-6 text-center">Título</th>
            <th className="py-3 px-6 text-center">URL</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredPublicities.length > 0 ? (
            filteredPublicities.map((publicity) => (
              <tr key={publicity.id} className="text-center bg-white border-b">
                <td className="py-4">{publicity.id}</td>
                <td className="py-4">{publicity.title}</td>
                <td
                  className="py-4 break-words"
                  style={{ wordBreak: "break-word" }}
                >
                  <a
                    href={publicity.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {publicity.url}
                  </a>
                </td>
                <td className="flex items-center justify-center space-x-4 py-4">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      setErrorMessage("");
                      setSelectedPublicity(publicity);
                      setFormData({
                        title: publicity.title,
                        url: publicity.url,
                      });
                      setIsEditModalOpen(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {
                      setSelectedPublicity(publicity);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : publicities.length > 0 ? (
            <tr>
              <td colSpan="4" className="py-4 text-center text-gray-500">
                No hay resultados para tu búsqueda.
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan="4" className="py-4 text-center text-gray-500">
                No hay publicidades registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {successMessage}
          <button
            onClick={() => setSuccessMessage("")}
            className="ml-4 text-lg font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Modales para agregar, editar y eliminar */}
      {isModalOpen && (
        <Modal
          title="Registrar Nueva Publicidad"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddPublicity}
          onClose={() => {
            setFormData({}); // Restablecer los campos a blanco
            setIsModalOpen(false);
          }}
          errorMessage={errorMessage}
        />
      )}

      {isEditModalOpen && (
        <Modal
          title="Editar Publicidad"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditPublicity}
          onClose={() => setIsEditModalOpen(false)}
          errorMessage={errorMessage}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          onConfirm={handleDeletePublicity}
          onClose={() => setIsDeleteModalOpen(false)}
          message={`¿Está seguro de que desea eliminar la publicidad "${selectedPublicity?.title}"?`}
        />
      )}
    </div>
  );
}

function Modal({
  title,
  formData,
  setFormData,
  onSubmit,
  onClose,
  errorMessage,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <label className="block text-gray-700 font-semibold mb-2">Título</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="block w-full px-4 py-2 border rounded-lg mb-4"
        />
        <label className="block text-gray-700 font-semibold mb-2">URL</label>
        <input
          type="text"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="block w-full px-4 py-2 border rounded-lg mb-6"
        />
        <div className="flex justify-between gap-4">
          <button
            onClick={onSubmit}
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
