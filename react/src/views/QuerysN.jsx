import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaInfoCircle, FaSearch } from "react-icons/fa";
import emailjs from "emailjs-com";

export default function QuerysN() {
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [visitorNames, setVisitorNames] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [inquiryToReply, setInquiryToReply] = useState(null);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchInquiriesAndVisitors();
  }, []);

  const fetchInquiriesAndVisitors = async () => {
    try {
      const inquiriesResponse = await axios.get(
        "http://localhost/visitURP_version2/public/index.php/api/list-inquiry"
      );
      const inquiriesData = inquiriesResponse.data;
      setInquiries(inquiriesData);

      // Obtener los nombres de los visitantes usando Promise.all
      const namesPromises = inquiriesData.map(async (inquiry) => {
        try {
          const visitorResponse = await axios.get(
            `http://localhost/visitURP_version2/public/index.php/api/find-visitorV/${inquiry.fk_visitorV_id}`
          );
          const visitorData = visitorResponse.data;
          return {
            id: inquiry.fk_visitorV_id,
            name: visitorData.name || "Desconocido",
          };
        } catch {
          return { id: inquiry.fk_visitorV_id, name: "Desconocido" };
        }
      });

      // Esperar a que todas las solicitudes terminen
      const names = await Promise.all(namesPromises);

      // Crear un mapa de nombres de visitantes
      const visitorNamesMap = names.reduce((acc, curr) => {
        acc[curr.id] = curr.name;
        return acc;
      }, {});

      // Actualizar estados
      setVisitorNames(visitorNamesMap);
      setFilteredInquiries(inquiriesData);
    } catch (error) {
      console.error(
        "Error al obtener las consultas o nombres de visitantes:",
        error
      );
    }
  };

  // Filtrar preguntas basadas en el input del buscador
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setFilteredInquiries(inquiries);
      return;
    }

    const filtered = inquiries.filter(
      (inquiry) =>
        inquiry.id_inquiry.toString().includes(query) ||
        (visitorNames[inquiry.fk_visitorV_id] || "")
          .toLowerCase()
          .includes(query)
    );
    setFilteredInquiries(filtered);
  }, [searchQuery, inquiries, visitorNames]);

  const handleReply = (inquiry) => {
    setInquiryToReply(inquiry);
    setIsReplyModalOpen(true);
  };

  const handleDelete = (inquiryId) => {
    setInquiryToDelete(inquiryId);
    setIsDeleteModalOpen(true);
  };

const confirmReply = async () => {
  if (!responseText.trim()) {
    setErrorMessage("Por favor ingrese una respuesta.");
    return;
  }

  try {
    // Mantener los detalles originales de la consulta, solo actualizar el estado y la fecha de actualización
    const updatedInquiry = {
      ...inquiryToReply, // Mantiene todos los datos originales
      state: "Answered", // Cambiar el estado a 'Answered'
      updated_at: new Date().toISOString(), // Actualiza la fecha con la fecha actual
      response: responseText, // Agregar la respuesta proporcionada
    };

    // Enviar solicitud PUT para actualizar la consulta en el backend
    const response = await axios.put(
      `http://localhost/visitURP_version2/public/index.php/api/update-inquiry/${inquiryToReply.id_inquiry}`,
      updatedInquiry
    );

    if (response.status === 200) {
      // Actualizar el estado de la consulta en el frontend solo si la respuesta fue exitosa
      setInquiries(
        inquiries.map((inquiry) =>
          inquiry.id_inquiry === inquiryToReply.id_inquiry
            ? {
                ...inquiry,
                state: "Answered",
                updated_at: updatedInquiry.updated_at,
                response: responseText,
              }
            : inquiry
        )
      );

      setSuccessMessage("La consulta fue respondida exitosamente.");
      setTimeout(() => setSuccessMessage(""), 3000); // Ocultar mensaje después de 3 segundos

      // Limpiar el modal y los campos
      setResponseText("");
      setIsReplyModalOpen(false);
      setErrorMessage("");
    } else {
      setErrorMessage("Hubo un error al actualizar el estado de la consulta.");
    }
  } catch (error) {
    console.error("Error al responder la consulta:", error);
    setErrorMessage("Hubo un error al procesar la respuesta.");
  }
};

  const confirmDelete = async () => {
    try {
      // Usar DELETE en lugar de PUT para eliminar la consulta
      await axios.delete(
        `http://localhost/visitURP_version2/public/index.php/api/delete-inquiry/${inquiryToDelete}`
      );

      // Eliminar la consulta de las listas de 'inquiries' y 'filteredInquiries'
      setInquiries((prevInquiries) =>
        prevInquiries.filter(
          (inquiry) => inquiry.id_inquiry !== inquiryToDelete
        )
      );
      setFilteredInquiries((prevFilteredInquiries) =>
        prevFilteredInquiries.filter(
          (inquiry) => inquiry.id_inquiry !== inquiryToDelete
        )
      );

      // Mostrar mensaje de éxito
      setSuccessMessage("Consulta eliminada exitosamente.");
      setTimeout(() => setSuccessMessage(""), 3000); // Ocultar mensaje después de 3 segundos

      // Cerrar el modal de eliminación
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar la consulta:", error);
      setErrorMessage("Hubo un error al eliminar la consulta.");
    }
  };

  const handleCloseModals = () => {
    setIsReplyModalOpen(false);
    setIsDeleteModalOpen(false);
    setErrorMessage("");
    setResponseText("");
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-[#282424] text-center mb-6 bg-white border border-gray-300 rounded-lg py-5">
        Gestión de Preguntas No Predefinidas
      </h1>
      <p className="text-lg text-gray-500 mb-12 text-center">
        Puedes responder o eliminar aquellas preguntas realizadas por los
        visitantes virtuales.
      </p>

      {/* Barra de búsqueda */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por ID o nombre del visitante"
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
            <th className="py-3 px-6 text-center">Nombre del Visitante</th>
            <th className="py-3 px-6 text-center">Detalle</th>
            <th className="py-3 px-6 text-center">Estado</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredInquiries.map((inquiry) => (
            <tr
              key={inquiry.id_inquiry}
              className="text-center bg-white border-b"
            >
              <td className="py-4">{inquiry.id_inquiry}</td>
              <td className="py-4">{visitorNames[inquiry.fk_visitorV_id]}</td>
              <td className="py-4">{inquiry.detail}</td>
              <td className="py-4">
                <span
                  className={`px-2 py-1 font-semibold rounded-full text-xs ${
                    inquiry.state === "Answered"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {inquiry.state === "Answered" ? "Respondido" : "Pendiente"}
                </span>
              </td>
              <td className="flex items-center justify-center space-x-4 py-4">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleReply(inquiry)}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(inquiry.id_inquiry)}
                >
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
          {filteredInquiries.length === 0 && (
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-500">
                No hay resultados para tu búsqueda.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Reply Modal */}
      {isReplyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Responder Consulta</h2>
            <p className="mb-4">
              <strong>Detalles:</strong> {inquiryToReply?.detail}
            </p>
            {errorMessage && (
              <p className="text-red-500 mb-4">{errorMessage}</p>
            )}
            <textarea
              className="w-full p-2 border rounded mb-4"
              rows="4"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Escribe la respuesta aquí..."
            />
            <div className="flex justify-between">
              <button
                onClick={confirmReply}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Responder
              </button>
              <button
                onClick={handleCloseModals}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Eliminar Consulta</h2>
            <p className="mb-8">
              ¿Estás seguro de que deseas eliminar la consulta con ID{" "}
              <strong>{inquiryToDelete}</strong>?
            </p>
            <div className="flex justify-between">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Eliminar
              </button>
              <button
                onClick={handleCloseModals}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
          {successMessage}
        </div>
      )}
    </div>
  );
}
