import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaSearch } from "react-icons/fa";

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [visitorNames, setVisitorNames] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null); // Feedback que se va a eliminar
  const [visitors, setVisitors] = useState([]);
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(
        "http://localhost/visitURP_version2/public/index.php/api/list-interactiveFeedbacks"
      );
      const feedbacksData = response.data;
      setFeedbacks(feedbacksData);

      // Obtener los nombres de los visitantes
      const namesPromises = feedbacksData.map(async (feedback) => {
        const visitorResponse = await axios.get(
          `http://localhost/visitURP_version2/public/index.php/api/find-visitorV/${feedback.fk_id_visitorV}`
        );
        return { id: feedback.fk_id_visitorV, name: visitorResponse.data.name };
      });

      const names = await Promise.all(namesPromises);
      const namesMap = names.reduce((acc, curr) => {
        acc[curr.id] = curr.name;
        return acc;
      }, {});

      setVisitorNames(namesMap);
    } catch (error) {
      console.error("Error al obtener los feedbacks:", error);
    }
  };

  const confirmDeleteFeedback = (id) => {
    setFeedbackToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const deleteFeedback = async () => {
    try {
      await axios.delete(
        `http://localhost/visitURP_version2/public/index.php/api/delete-interactiveFeedbacks/${feedbackToDelete}`
      );
      setSuccessMessage(`Feedback eliminado con éxito.`);
      setIsDeleteModalOpen(false); // Cierra el modal
      setFeedbackToDelete(null); // Limpia el estado
      fetchFeedbacks(); // Actualiza la lista
    } catch (error) {
      console.error("Error al eliminar el feedback:", error);
      setErrorMessage("Ocurrió un error al eliminar el feedback.");
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`inline ${
          index < rating ? "text-yellow-500" : "text-gray-300"
        }`}
      />
    ));
  };

  // Filtrar visitantes en base al término de búsqueda
  useEffect(() => {
    const normalizeText = (text) => {
      return text
        .toString()
        .normalize("NFD") // Normaliza tildes
        .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos
        .toLowerCase();
    };

    if (searchQuery.trim()) {
      setFilteredVisitors(
        visitors.filter((visitor) => {
          const normalizedQuery = normalizeText(searchQuery);
          const matchesId = normalizeText(visitor.id).includes(normalizedQuery);
          const matchesName = normalizeText(visitor.name).includes(
            normalizedQuery
          );
          return matchesId || matchesName;
        })
      );
    } else {
      setFilteredVisitors([]);
    }
  }, [searchQuery, visitors]);

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const normalizeText = (text) =>
      text
        ?.toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const searchLower = normalizeText(searchQuery); // Término de búsqueda normalizado
    const visitorName = normalizeText(
      visitorNames[feedback.fk_id_visitorV] || ""
    );
    const feedbackId = normalizeText(feedback.id_interactiveFeedbacks);

    return (
      feedbackId.includes(searchLower) || visitorName.includes(searchLower)
    );
  });

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-[#282424] text-center mb-6 bg-white border border-gray-300 rounded-lg py-5">
        Visualizar Feedback
      </h1>
      <p className="text-lg text-gray-500 mb-12 text-center">
        Puedes consultar y eliminar la retroalimentación realizada por los
        visitantes virtuales.
      </p>

      {errorMessage && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4">
          {errorMessage}
        </div>
      )}

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

      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
            <th className="py-3 px-6 text-center">ID</th>
            <th className="py-3 px-6 text-center">Visitante</th>
            <th className="py-3 px-6 text-center">Calificación</th>
            <th className="py-3 px-6 text-center">Comentario</th>
            <th className="py-3 px-6 text-center">Creado</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {searchQuery.trim() ? (
            filteredFeedbacks.length > 0 ? (
              filteredFeedbacks.map((feedback) => (
                <tr
                  key={feedback.id_interactiveFeedbacks}
                  className="text-center bg-white border-b"
                >
                  <td className="py-4">{feedback.id_interactiveFeedbacks}</td>
                  <td className="py-4">
                    {visitorNames[feedback.fk_id_visitorV] || "Cargando..."}
                  </td>
                  <td className="py-4">{renderStars(feedback.rating)}</td>
                  <td className="py-4 break-words">
                    {feedback.comment || "Sin comentario"}
                  </td>
                  <td className="py-4">
                    {new Date(feedback.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() =>
                        confirmDeleteFeedback(feedback.id_interactiveFeedbacks)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No hay resultados para tu búsqueda.
                </td>
              </tr>
            )
          ) : feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <tr
                key={feedback.id_interactiveFeedbacks}
                className="text-center bg-white border-b"
              >
                <td className="py-4">{feedback.id_interactiveFeedbacks}</td>
                <td className="py-4">
                  {visitorNames[feedback.fk_id_visitorV] || "Cargando..."}
                </td>
                <td className="py-4">{renderStars(feedback.rating)}</td>
                <td className="py-4 break-words">
                  {feedback.comment || "Sin comentario"}
                </td>
                <td className="py-4">
                  {new Date(feedback.created_at).toLocaleDateString()}
                </td>
                <td className="py-4">
                  <button
                    onClick={() =>
                      confirmDeleteFeedback(feedback.id_interactiveFeedbacks)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-4 text-center text-gray-500">
                No hay feedbacks registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal de confirmación para eliminar */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4">
              Confirmar Eliminación
            </h2>
            <p className="text-gray-700 text-center mb-6">
              ¿Estás seguro de que deseas eliminar el feedback con ID{" "}
              <strong>{feedbackToDelete}</strong>? Esta acción no se puede
              deshacer.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={deleteFeedback}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg"
              >
                Eliminar
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
