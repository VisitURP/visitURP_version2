import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaInfoCircle } from "react-icons/fa";

export default function QuerysN() {
  const [inquiries, setInquiries] = useState([]);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [inquiryToReply, setInquiryToReply] = useState(null);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get(
          "http://localhost/visitURP_Backend/public/index.php/api/list-inquiry"
        );
        setInquiries(response.data);
      } catch (error) {
        console.error("Error al obtener las consultas:", error);
      }
    };

    fetchInquiries();
  }, []);

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
      await axios.post(
        `http://localhost/visitURP_Backend/public/index.php/api/reply-inquiry/${inquiryToReply.id_inquiry}`,
        { response: responseText }
      );
      setInquiries(
        inquiries.map((inquiry) =>
          inquiry.id_inquiry === inquiryToReply.id_inquiry
            ? { ...inquiry, state: "Answered" }
            : inquiry
        )
      );
      setResponseText("");
      setIsReplyModalOpen(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error al responder la consulta:", error);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.put(
        `http://localhost/visitURP_Backend/public/index.php/api/delete-inquiry/${inquiryToDelete}`
      );
      setInquiries(
        inquiries.filter((inquiry) => inquiry.id_inquiry !== inquiryToDelete)
      );
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar la consulta:", error);
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
        Puedes responder o eliminar aquellas preguntas realizadas por los visitantes virtuales.
      </p>

      <table className="min-w-full border rounded-lg overflow-hidden mb-8">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
            <th className="py-3 px-6 text-center">ID</th>
            <th className="py-3 px-6 text-center">Visitante</th>
            <th className="py-3 px-6 text-center">Detalles</th>
            <th className="py-3 px-6 text-center">Estado</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <tr
              key={inquiry.id_inquiry}
              className="text-center bg-white border-b"
            >
              <td className="py-4">{inquiry.id_inquiry}</td>
              <td className="py-4">{inquiry.visitor_name}</td>
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
    </div>
  );
}
