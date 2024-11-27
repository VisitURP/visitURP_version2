import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPlus, FaSearch } from "react-icons/fa";
import axios from "axios";

export default function QuerysP() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    fk_category_id: "", // Incluye este campo
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const normalizeText = (text) =>
      text
        ?.toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    if (searchQuery.trim()) {
      setFilteredQuestions(
        questions.filter((question) => {
          const normalizedQuery = normalizeText(searchQuery);
          const matchesId =
            question.id_QA &&
            question.id_QA.toString().includes(searchQuery.trim());
          const matchesQuestion =
            question.question &&
            normalizeText(question.question).includes(normalizedQuery);
          return matchesId || matchesQuestion;
        })
      );
    } else {
      setFilteredQuestions([]);
    }
  }, [searchQuery, questions]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 7000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "http://localhost/visitURP_version2/public/index.php/api/list-qa"
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Error al obtener las preguntas predefinidas:", error);
    }
  };

  const validateFields = () => {
    if (!formData.question) {
      setErrorMessage("Por favor, ingrese la pregunta.");
      return false;
    }
    if (!formData.answer) {
      setErrorMessage("Por favor, ingrese la respuesta.");
      return false;
    }
    if (!formData.fk_category_id) {
      setErrorMessage("Por favor, seleccione una categoría.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleAddQuestion = async () => {
    if (!validateFields()) return;

    try {
      await axios.post(
        "http://localhost/visitURP_version2/public/index.php/api/register-qa",
        formData
      );
      fetchQuestions();
      setIsModalOpen(false);
      setFormData({ question: "", answer: "", fk_category_id: "" });
      setSuccessMessage("Pregunta registrada con éxito.");
    } catch (error) {
      console.error("Error al registrar la pregunta:", error);
    }
  };

  const handleEditQuestion = async () => {
    if (!validateFields()) return;

    // Validar si no se realizaron cambios
    if (
      selectedQuestion.question === formData.question &&
      selectedQuestion.answer === formData.answer &&
      selectedQuestion.fk_category_id == formData.fk_category_id
    ) {
      setErrorMessage("No se realizaron modificaciones.");
      return;
    }

    try {
      await axios.put(
        `http://localhost/visitURP_version2/public/index.php/api/update-qa/${selectedQuestion.id_QA}`,
        formData
      );
      fetchQuestions();
      setIsEditModalOpen(false);
      setFormData({ question: "", answer: "" });
      setSuccessMessage("Pregunta editada con éxito.");
    } catch (error) {
      console.error("Error al actualizar la pregunta:", error);
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      await axios.delete(
        `http://localhost/visitURP_version2/public/index.php/api/delete-qa/${selectedQuestion.id_QA}`
      );
      fetchQuestions();
      setIsDeleteModalOpen(false);
      setSuccessMessage("Pregunta eliminada con éxito.");
    } catch (error) {
      console.error("Error al eliminar la pregunta:", error);
    }
  };

  const getCategoryName = (id) => {
    const categories = {
      1: "Postulación",
      2: "Información",
      3: "Asesoramiento Académico",
      4: "Reglamento y Normas Universitarias",
    };
    return categories[id] || "Sin Categoría";
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-[#282424] text-center mb-6 bg-white border border-gray-300 rounded-lg py-5">
        Gestionar Preguntas Predefinidas
      </h1>
      <p className="text-lg text-gray-500 mb-12 text-center">
        Puedes agregar nuevas preguntas, modificar o eliminar las existentes.
      </p>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por ID o pregunta"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg flex items-center"
          onClick={() => {
            setErrorMessage("");
            setFormData({ question: "", answer: "", fk_category_id: "" }); // Reinicia los campos
            setIsModalOpen(true);
          }}
        >
          <FaPlus className="mr-2" />
          Registrar Pregunta
        </button>
      </div>

      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
            <th className="py-3 px-6 text-center">ID</th>
            <th className="py-3 px-6 text-center">Categoría</th>
            <th className="py-3 px-6 text-center">Pregunta</th>
            <th className="py-3 px-6 text-center">Respuesta</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {searchQuery.trim() ? (
            filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <tr key={question.id} className="text-center bg-white border-b">
                  <td className="py-4">{question.id_QA}</td>
                  <td className="py-4">
                    {getCategoryName(question.fk_category_id)}
                  </td>
                  <td className="py-4">{question.question}</td>
                  <td className="py-4">{question.answer}</td>
                  <td className="flex items-center justify-center space-x-4 py-4">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => {
                        setErrorMessage("");
                        setSelectedQuestion(question);
                        setFormData({
                          question: question.question,
                          answer: question.answer,
                        });
                        setIsEditModalOpen(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setSelectedQuestion(question);
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
                  No hay resultados para tu búsqueda.
                </td>
              </tr>
            )
          ) : questions.length > 0 ? (
            questions.map((question) => (
              <tr key={question.id} className="text-center bg-white border-b">
                <td className="py-4">{question.id_QA}</td>
                <td className="py-4">
                  {getCategoryName(question.fk_category_id)}
                </td>
                <td className="py-4">{question.question}</td>
                <td className="py-4">{question.answer}</td>
                <td className="flex items-center justify-center space-x-4 py-4">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      setErrorMessage("");
                      setSelectedQuestion(question);
                      setFormData({
                        question: question.question,
                        answer: question.answer,
                        fk_category_id: question.fk_category_id, // Incluye la categoría al editar
                      });
                      setIsEditModalOpen(true);
                    }}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {
                      setSelectedQuestion(question);
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
                No hay preguntas predefinidas registradas.
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

      {isModalOpen && (
        <Modal
          title="Registrar Nueva Pregunta"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddQuestion}
          onClose={() => {
            setFormData({});
            setIsModalOpen(false);
          }}
          errorMessage={errorMessage}
          isEditModalOpen={false}
        />
      )}

      {isEditModalOpen && (
        <Modal
          title="Editar Pregunta"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditQuestion}
          onClose={() => setIsEditModalOpen(false)}
          errorMessage={errorMessage}
          isEditModalOpen={isEditModalOpen}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          onConfirm={handleDeleteQuestion}
          onClose={() => setIsDeleteModalOpen(false)}
          message={`¿Está seguro de que desea eliminar la pregunta "${selectedQuestion?.question}"?`}
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
  isEditModalOpen, // Recibimos el estado
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        {/* Pregunta */}
        <label className="block text-gray-700 font-semibold mb-2">
          Pregunta
        </label>
        <textarea
          value={formData.question}
          onChange={(e) =>
            setFormData({ ...formData, question: e.target.value })
          }
          rows="4" // Aumenta el número de filas
          className="block w-full px-4 py-2 border rounded-lg mb-4 resize-none" // 'resize-none' evita que se redimensione
        />
        {/* Respuesta */}
        <label className="block text-gray-700 font-semibold mb-2">
          Respuesta
        </label>
        <textarea
          value={formData.answer}
          onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
          rows="4" // Aumenta el número de filas
          className="block w-full px-4 py-2 border rounded-lg mb-6 resize-none"
        />
        {/* Categoría */}
        <label className="block text-gray-700 font-semibold mb-2">
          Categoría
        </label>
        <select
          value={formData.fk_category_id}
          onChange={(e) =>
            setFormData({ ...formData, fk_category_id: e.target.value })
          }
          className="block w-full px-4 py-2 border rounded-lg mb-4"
        >
          {!isEditModalOpen && ( // Mostrar solo si no estás editando
            <option value="">Seleccione una categoría</option>
          )}
          <option value="1">Postulación</option>
          <option value="2">Información</option>
          <option value="3">Asesoramiento Académico</option>
          <option value="4">Reglamento y Normas Universitarias</option>
        </select>

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
