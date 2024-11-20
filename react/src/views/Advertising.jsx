import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import axios from "axios";

export default function Publicities() {
  const [publicities, setPublicities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPublicity, setSelectedPublicity] = useState(null);
  const [formData, setFormData] = useState({ title: "", url: "" });

  // Obtener los datos de publicidades al montar el componente
  useEffect(() => {
    fetchPublicities();
  }, []);

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

  const handleAddPublicity = async () => {
    try {
      await axios.post(
        "https://localhost/visitURP_Backend/public/index.php/api/register-publicity",
        formData
      );
      fetchPublicities();
      setIsModalOpen(false);
      setFormData({ title: "", url: "" });
    } catch (error) {
      console.error("Error al registrar la publicidad:", error);
    }
  };

  const handleEditPublicity = async () => {
    try {
      await axios.put(
        `http://localhost/visitURP_Backend/public/index.php/api/update-publicity/${selectedPublicity.id}`,
        formData
      );
      fetchPublicities();
      setIsEditModalOpen(false);
      setFormData({ title: "", url: "" });
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
        Puedes agregar nueva publicidad, eliminar o modificar la existente.
      </p>

      <button
        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg mb-6"
        onClick={() => setIsModalOpen(true)}
      >
        <FaPlus className="inline mr-2" />
        Registrar Publicidad
      </button>

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
          {publicities.length > 0 ? (
            publicities.map((publicity) => (
              <tr key={publicity.id} className="text-center bg-white border-b">
                <td className="py-4">{publicity.id}</td>
                <td className="py-4">{publicity.title}</td>
                <td className="py-4">
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
          ) : (
            <tr>
              <td colSpan="4" className="py-4 text-center text-gray-500">
                No hay publicidades registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Registrar Modal */}
      {isModalOpen && (
        <Modal
          title="Registrar Publicidad"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddPublicity}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Editar Modal */}
      {isEditModalOpen && (
        <Modal
          title="Editar Publicidad"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditPublicity}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Eliminar Modal */}
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

function Modal({ title, formData, setFormData, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
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
        <div className="flex justify-between">
          <button
            onClick={onSubmit}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg"
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
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
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg"
          >
            Eliminar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
