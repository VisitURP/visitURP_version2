import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaInfoCircle, FaPlus } from "react-icons/fa";

export default function Semesters() {
  const [semesters, setSemesters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [semesterYear, setSemesterYear] = useState(new Date().getFullYear());
  const [semesterSuffix, setSemesterSuffix] = useState(1);
  const [semesterTo, setSemesterTo] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [semesterToEdit, setSemesterToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [semesterToDelete, setSemesterToDelete] = useState(null);
  const [availableYears, setAvailableYears] = useState([
    new Date().getFullYear(),
  ]);
  const [errorMessage, setErrorMessage] = useState("");
  const [latestSemester, setLatestSemester] = useState(null);

  const API_BASE_URL = "http://localhost/visitURP_Backend/public/index.php/api";

  const fetchSemesters = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/list-semester`);
      const data = response.data;
      setSemesters(data);
      updateAvailableYears(data);
      autoSetNextSemester(data);

      const sortedSemesters = [...data].sort((a, b) => {
        const [yearA, suffixA] = a.semesterName.split("-").map(Number);
        const [yearB, suffixB] = b.semesterName.split("-").map(Number);
        return yearB - yearA || suffixB - suffixA;
      });
      setLatestSemester(sortedSemesters[0]);
    } catch (error) {
      console.error("Error al obtener los semestres:", error);
    }
  };

  const updateAvailableYears = (semestersData) => {
    const years = new Set(availableYears);
    semestersData.forEach((semester) => {
      const year = parseInt(semester.semesterName.split("-")[0]);
      if (!isNaN(year)) {
        years.add(year);
      }
    });
    setAvailableYears(Array.from(years).sort());
  };

  const autoSetNextSemester = (semestersData) => {
    const latestSemester = semestersData.reduce((latest, current) => {
      const [currentYear, currentSuffix] = current.semesterName
        .split("-")
        .map(Number);
      if (
        currentYear > (latest.year || 0) ||
        (currentYear === latest.year && currentSuffix > latest.suffix)
      ) {
        return { year: currentYear, suffix: currentSuffix };
      }
      return latest;
    }, {});

    if (latestSemester.suffix === 2) {
      setSemesterYear(latestSemester.year + 1);
      setSemesterSuffix(1);
    } else {
      setSemesterYear(latestSemester.year);
      setSemesterSuffix(2);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  const handleAddSemester = async () => {
    const semesterName = `${semesterYear}-${semesterSuffix}`;
    const semesterFrom = new Date().toISOString();

    if (!semesterTo) {
      setErrorMessage("Por favor ingrese la Fecha de Terminación.");
      return;
    }

    if (semesters.some((s) => s.semesterName === semesterName)) {
      setErrorMessage("El semestre ya existe.");
      return;
    }

    const newSemester = {
      semesterName,
      semesterFrom,
      semesterTo,
      created_at: semesterFrom,
    };

    try {
      await axios.post(`${API_BASE_URL}/register-semester`, newSemester);
      fetchSemesters();
      setIsModalOpen(false);
      setSemesterSuffix(1);
      setSemesterTo("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error al registrar el semestre:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMessage("");
  };

  const handleUpdateSemester = async () => {
    try {
      const updated_at = new Date().toISOString();
      const { semesterName, semesterTo } = semesterToEdit;
      await axios.put(`${API_BASE_URL}/update-semester/${semesterName}`, {
        semesterName,
        semesterTo,
        updated_at,
      });
      fetchSemesters();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error al actualizar el semestre:", error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const { semesterName } = semesterToDelete;
      await axios.delete(`${API_BASE_URL}/delete-semester/${semesterName}`);
      fetchSemesters();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar el semestre:", error);
    }
  };

  const filteredSemesters = selectedSemester
    ? semesters.filter(
        (semester) =>
          semester.semesterName.startsWith(selectedSemester) &&
          semester.deleted_at === null
      )
    : semesters.filter((semester) => semester.deleted_at === null);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-[#282424] text-center mb-6 bg-white border border-gray-300 rounded-lg py-5">
        Gestionar Semestres Académicos
      </h1>
      <p className="text-lg text-gray-500 mb-12 text-center">
        Puedes agregar nuevos semestres académicos, eliminar o modificar los
        existentes.
      </p>
      <div className="flex items-center space-x-4 mb-8">
        <select
          className="px-10 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-0"
          onChange={(e) => setSelectedSemester(e.target.value)}
        >
          <option value="">-- Todos los años --</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="inline mr-2" />
          Registrar Semestre
        </button>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              Registrar Nuevo Semestre
            </h2>
            {errorMessage && (
              <p className="text-red-500 text-center mb-4">{errorMessage}</p>
            )}
            <label className="block text-gray-700 font-semibold mb-2">
              Nombre del Semestre
            </label>
            <div className="flex items-center space-x-4 mb-4">
              <input
                type="number"
                value={semesterYear}
                readOnly
                className="w-2/3 px-4 py-2 border rounded-lg bg-gray-200"
              />
              <select
                value={semesterSuffix}
                onChange={(e) => setSemesterSuffix(e.target.value)}
                className="w-1/3 px-4 py-2 border rounded-lg"
              >
                {[1, 2].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <label className="block text-gray-700 font-semibold mb-2">
              Fecha de Terminación
              <FaInfoCircle
                className="inline ml-2 text-blue-500"
                title="Preferentemente ingrese la fecha de examen de admisión del semestre que se desea registrar"
              />
            </label>
            <input
              type="date"
              value={semesterTo}
              onChange={(e) => setSemesterTo(e.target.value)}
              className="block w-full px-4 py-2 border rounded-lg mb-6"
              min={new Date().toISOString().split("T")[0]}
            />
            <div className="flex justify-between space-x-4">
              <button
                onClick={handleAddSemester}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg w-1/2"
              >
                Agregar Semestre
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg w-1/2"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Editar Semestre</h2>
            <label className="block text-gray-700 font-semibold mb-2">
              Año y Ciclo:
            </label>
            <div className="flex items-center space-x-4 mb-4">
              <input
                type="text"
                value={semesterToEdit?.semesterName || ""}
                readOnly
                className="w-full px-4 py-2 border rounded-lg bg-gray-200"
              />
            </div>
            <label className="block text-gray-700 font-semibold mb-2">
              Fecha Hasta:
            </label>
            <input
              type="date"
              value={
                semesterToEdit?.until
                  ? new Date(semesterToEdit.until).toISOString().split("T")[0]
                  : ""
              }
              min={today}
              onChange={(e) =>
                setSemesterToEdit({ ...semesterToEdit, until: e.target.value })
              }
              className="block w-full px-4 py-2 border rounded-lg mb-6"
            />
            <div className="flex justify-between">
              <button
                onClick={handleUpdateSemester}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg w-1/2 mr-2"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg w-1/2"
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
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4">
              Confirmar Eliminación
            </h2>
            <p className="text-gray-700 text-center mb-6">
              ¿Está seguro de que desea eliminar el semestre{" "}
              <strong>{semesterToDelete?.semesterName}</strong>? Esta acción no
              se puede deshacer.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmDelete}
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

      {/* Tabla de Semestres */}
      <table className="min-w-full border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
            <th className="py-3 px-6 text-center">Semestre Académico</th>
            <th className="py-3 px-6 text-center">Fecha de terminación</th>
            <th className="py-3 px-6 text-center">Última Actualización</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredSemesters.map((semester) => {
            const isEditable =
              semester.semesterName === latestSemester?.semesterName;
            return (
              <tr
                key={semester.id_semester}
                className="text-center bg-white border-b"
              >
                <td className="py-4">{semester.semesterName}</td>
                <td className="py-4">
                  {new Date(semester.semesterTo).toLocaleDateString()}
                </td>
                <td className="py-4">
                  {new Date(semester.updated_at).toLocaleDateString()}
                </td>
                <td className="flex items-center justify-center space-x-4 py-4">
                  <button
                    className={`text-blue-500 hover:text-blue-700 ${
                      !isEditable && "opacity-50 pointer-events-none"
                    }`}
                    onClick={() => {
                      setSemesterToEdit(semester);
                      setIsEditModalOpen(true);
                    }}
                    disabled={!isEditable}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className={`text-red-500 hover:text-red-700 ${
                      !isEditable && "opacity-50 pointer-events-none"
                    }`}
                    onClick={() => {
                      setSemesterToDelete(semester);
                      setIsDeleteModalOpen(true);
                    }}
                    disabled={!isEditable}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
