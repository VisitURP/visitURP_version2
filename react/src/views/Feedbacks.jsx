import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [url, setUrl] = useState(""); // Estado para la URL
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(
        "http://localhost/visitURP_Backend/public/index.php/api/list-interactiveFeedbacks"
      );
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error al obtener los feedbacks:", error);
    }
  };

  const validateURL = (url) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)" + // Protocolo
        "((([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,})|" + // Dominio
        "localhost|" + // Localhost
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // IPv4
        "(\\:\\d+)?(\\/[-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?$" // Puerto y path
    );
    return urlPattern.test(url);
  };

  const handleRegisterOrUpdate = async () => {
    if (!validateURL(url)) {
      setErrorMessage("La URL ingresada no es válida.");
      return;
    }

    try {
      // Aquí se envía la URL validada al backend
      const response = await axios.post(
        "http://localhost/visitURP_Backend/public/index.php/api/save-feedback",
        { url } // Cambia la URL según sea necesario
      );
      setSuccessMessage("Feedback registrado/actualizado con éxito.");
      fetchFeedbacks(); // Refresca la lista
    } catch (error) {
      console.error("Error al registrar/actualizar:", error);
      setErrorMessage("Ocurrió un error al registrar/actualizar el feedback.");
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

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-[#282424] text-center mb-6 bg-white border border-gray-300 rounded-lg py-5">
        Visualizar Feedback
      </h1>

      <div className="mb-6 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Ingrese la URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg"
          onClick={handleRegisterOrUpdate}
        >
          Registrar/Actualizar
        </button>
      </div>

      {errorMessage && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4">
          {errorMessage}
        </div>
      )}

      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
            <th className="py-3 px-6 text-center">ID</th>
            <th className="py-3 px-6 text-center">Visitante</th>
            <th className="py-3 px-6 text-center">Calificación</th>
            <th className="py-3 px-6 text-center">Comentario</th>
            <th className="py-3 px-6 text-center">Creado</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <tr
                key={feedback.id_interactiveFeedbacks}
                className="text-center bg-white border-b"
              >
                <td className="py-4">{feedback.id_interactiveFeedbacks}</td>
                <td className="py-4">{feedback.fk_id_visitorV}</td>
                <td className="py-4">{renderStars(feedback.rating)}</td>
                <td className="py-4 break-words">
                  {feedback.comment || "Sin comentario"}
                </td>
                <td className="py-4">
                  {new Date(feedback.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-500">
                No hay feedbacks registrados.
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
    </div>
  );
}
