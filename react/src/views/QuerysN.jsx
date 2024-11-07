import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit2, Trash2 } from "lucide-react";

export default function QuerysN() {
  const [inquiries, setInquiries] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);
  const [inquiryToReply, setInquiryToReply] = useState(null);
  const [responseText, setResponseText] = useState("");

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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleReply = (inquiry) => {
    setInquiryToReply(inquiry);
    setIsReplyModalOpen(true);
  };

  const handleDelete = (id) => {
    setInquiryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.put(
        `http://localhost/visitURP_Backend/public/index.php/api/delete-inquiry/${inquiryToDelete}`
      );
      setInquiries(
        inquiries.filter((inquiry) => inquiry.id_inquiry !== inquiryToDelete)
      );
    } catch (error) {
      console.error("Error al eliminar la consulta:", error);
    }
    setIsDeleteModalOpen(false);
  };

  const confirmReply = async () => {
    try {
      await axios.post(
        `http://localhost/visitURP_Backend/public/index.php/api/reply-inquiry/${inquiryToReply.id_inquiry}`,
        { response: responseText }
      );
      // Aquí podrías incluir lógica para enviar el correo al visitante con la respuesta.
      setInquiries(
        inquiries.map((inquiry) =>
          inquiry.id_inquiry === inquiryToReply.id_inquiry
            ? { ...inquiry, state: "Answered" }
            : inquiry
        )
      );
    } catch (error) {
      console.error("Error al responder la consulta:", error);
    }
    setIsReplyModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-6 bg-white border border-black rounded-lg py-5">
        Gestión de Preguntas No Predefinidas
      </h1>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Eliminar Consulta</h2>
            <p className="text-gray-700 mb-8">
              ¿Está seguro de que desea eliminar la consulta ID{" "}
              <strong>{inquiryToDelete}</strong>?
            </p>
            <div className="flex justify-between">
              <button
                onClick={confirmDelete}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Sí
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {isReplyModalOpen && inquiryToReply && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Responder Consulta</h2>
            <p className="text-gray-700 mb-4">
              <strong>Detalles:</strong> {inquiryToReply.detail}
            </p>
            <textarea
              className="w-full p-2 mb-4 border rounded"
              rows="4"
              placeholder="Escribe la respuesta aquí..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                onClick={confirmReply}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Responder
              </button>
              <button
                onClick={() => setIsReplyModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
            <th className="py-3 px-6 text-center">Consulta ID</th>
            <th className="py-3 px-6 text-center">Nombre de Visitante</th>
            <th className="py-3 px-6 text-center">Detalles</th>
            <th className="py-3 px-6 text-center">Creado</th>
            <th className="py-3 px-6 text-center">Actualizado</th>
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
              <td className="py-4">{formatDate(inquiry.created_at)}</td>
              <td className="py-4">{formatDate(inquiry.updated_at)}</td>
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
                  title="Responder"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(inquiry.id_inquiry)}
                  title="Eliminar"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
