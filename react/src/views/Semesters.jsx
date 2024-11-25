import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaInfoCircle, FaPlus } from "react-icons/fa";

export default function Semesters() {
  const [semesters, setSemesters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [semesterYear, setSemesterYear] = useState(new Date().getFullYear());
  const [semesterSuffix, setSemesterSuffix] = useState(1);
  const [semesterFrom, setSemesterFrom] = useState(
    new Date().toISOString().split("T")[0]
  );
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

  const formatDate = (date) => {
    const d = new Date(date);
    // Ajustar a la zona horaria de Perú (UTC-5)
    const peruOffset = -5 * 60; // UTC-5 en minutos
    const localOffset = d.getTimezoneOffset(); // Zona horaria local en minutos
    const adjustedDate = new Date(
      d.getTime() + (localOffset - peruOffset) * 60000
    );

    const yyyy = adjustedDate.getFullYear();
    const MM = String(adjustedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(adjustedDate.getDate()).padStart(2, "0");
    const HH = String(adjustedDate.getHours()).padStart(2, "0");
    const mm = String(adjustedDate.getMinutes()).padStart(2, "0");
    const ss = String(adjustedDate.getSeconds()).padStart(2, "0");

    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
  };

  const fetchSemesters = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/list-semester`);
      const data = response.data;

      // Ordenar por fecha de creación (de más antiguo a más reciente)
      //const sortedSemesters = [...data].sort(
      //  (a, b) => new Date(a.created_at) - new Date(b.created_at)
      //);

      const sortedSemesters = [...data].sort((a, b) => {
        const [yearA, suffixA] = a.semesterName.split("-").map(Number);
        const [yearB, suffixB] = b.semesterName.split("-").map(Number);
        return yearA - yearB || suffixA - suffixB;
      });

      setSemesters(sortedSemesters);

      // Actualizar los años disponibles en el desplegable
      updateAvailableYears(sortedSemesters);

      // Establecer el último semestre
      if (sortedSemesters.length > 0) {
        setLatestSemester(sortedSemesters[sortedSemesters.length - 1]);
      }

      autoSetNextSemester(sortedSemesters);
    } catch (error) {
      console.error("Error al obtener los semestres:", error);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  const createSemesterObject = (name, from, to) => ({
    semesterName: name,
    semesterFrom: from,
    semesterTo: to,
    created_at: from,
  });

  const handleAddSemester = async () => {
    const semesterName = `${semesterYear}-${semesterSuffix}`;

    if (!semesterFrom || !semesterTo) {
      setErrorMessage(
        !semesterFrom
          ? "Por favor ingrese la Fecha de Inicio."
          : "Por favor ingrese la Fecha de Terminación."
      );
      return;
    }

    if (isNaN(new Date(semesterFrom)) || isNaN(new Date(semesterTo))) {
      setErrorMessage("Las fechas ingresadas no son válidas.");
      return;
    }

    const semesterFromFormatted = formatDate(semesterFrom);
    const semesterToFormatted = formatDate(semesterTo);

    if (semesters.some((s) => s.semesterName === semesterName)) {
      setErrorMessage("El semestre ya existe.");
      return;
    }

    if (new Date(semesterFrom) >= new Date(semesterTo)) {
      setErrorMessage(
        "La Fecha de Inicio debe ser menor que la Fecha de Terminación."
      );
      return;
    }

    const newSemester = createSemesterObject(
      semesterName,
      semesterFromFormatted,
      semesterToFormatted
    );

    try {
      await axios.post(`${API_BASE_URL}/register-semester`, newSemester);
      fetchSemesters();

      const semesterToDate = new Date(semesterToFormatted);
      if (new Date() > semesterToDate) {
        const nextSemesterName = getNextSemester(semesterName);
        const nextSemesterFrom = formatDate(semesterToDate);
        const nextSemesterTo = formatDate(
          new Date(semesterToDate.getTime()).setMonth(
            semesterToDate.getMonth() + 6
          )
        );

        if (!semesters.some((s) => s.semesterName === nextSemesterName)) {
          const nextSemester = createSemesterObject(
            nextSemesterName,
            nextSemesterFrom,
            nextSemesterTo
          );
          await axios.post(`${API_BASE_URL}/register-semester`, nextSemester);
        }
      }

      setSemesterTo("");
      setIsModalOpen(false);
      setErrorMessage("");
    } catch (error) {
      console.error(
        "Error al registrar el semestre:",
        error.response?.data || error.message
      );
      setErrorMessage(
        error.response?.data?.message ||
          "Error al registrar el semestre. Intente de nuevo."
      );
    }
  };

  const updateAvailableYears = (semestersData) => {
    // Extraer los años de los nombres de los semestres
    const years = new Set(
      semestersData.map((semester) =>
        parseInt(semester.semesterName.split("-")[0])
      )
    );
    setAvailableYears(Array.from(years).sort());
  };

  const autoSetNextSemester = (semestersData) => {
    const today = formatDate(new Date()); // Fecha actual en formato YYYY-MM-DD
    const [semesterFrom, setSemesterFrom] = useState(today);
    const [semesterTo, setSemesterTo] = useState(today); // Puedes establecer otra fecha base aquí si es necesario.

    if (semestersData.length > 0) {
      const latest = semestersData[semestersData.length - 1]; // Cambia de [0] al último elemento
      const [year, suffix] = latest.semesterName.split("-").map(Number);
      const semesterEnd = new Date(latest.semesterTo);

      // Determinar el próximo semestre
      let nextYear = suffix === 2 ? year + 1 : year;
      let nextSuffix = suffix === 1 ? 2 : 1;

      // Validar si el próximo semestre ya existe
      const nextSemesterName = `${nextYear}-${nextSuffix}`;
      const semesterExists = semestersData.some(
        (semester) => semester.semesterName === nextSemesterName
      );

      if (!semesterExists) {
        setSemesterYear(nextYear);
        setSemesterSuffix(nextSuffix);
      } else {
        setSemesterYear(year);
        setSemesterSuffix(suffix);
      }
    } else {
      const currentYear = today.getFullYear();
      setSemesterYear(currentYear);
      setSemesterSuffix(1);
    }
  };

  const getNextSemester = (currentSemester) => {
    const [year, suffix] = currentSemester.split("-").map(Number);
    const nextYear = suffix === 2 ? year + 1 : year;
    const nextSuffix = suffix === 1 ? 2 : 1;
    return `${nextYear}-${nextSuffix}`;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMessage("");
    setSemesterTo("");
    setSemesterFrom(new Date().toISOString().split("T")[0]);
  };

  const handleUpdateSemester = async () => {
    try {
      const updated_at = formatDate(new Date());
      const { semesterName, semesterTo } = semesterToEdit;
      const semesterToFormatted = formatDate(semesterTo);

      await axios.put(`${API_BASE_URL}/update-semester/${semesterName}`, {
        semesterName,
        semesterTo: semesterToFormatted,
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
              Fecha de Inicio
            </label>
            <input
              type="date"
              value={semesterFrom}
              onChange={(e) => setSemesterFrom(e.target.value)} // El valor viene directamente del input
              className="block w-full px-4 py-2 border rounded-lg mb-4"
            />
            <label className="block text-gray-700 font-semibold mb-2">
              Fecha de Terminación
            </label>
            <input
              type="date"
              value={semesterTo}
              min={today}
              onChange={(e) => setSemesterTo(e.target.value)}
              className="block w-full px-4 py-2 border rounded-lg mb-6"
            />
            <div className="flex justify-between">
              <button
                onClick={handleAddSemester}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg w-1/2"
              >
                Agregar
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
            <th className="py-3 px-6 text-center">Fecha de Inicio</th>
            <th className="py-3 px-6 text-center">Fecha de Terminación</th>
            <th className="py-3 px-6 text-center">Última Actualización</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredSemesters.map((semester, index) => {
            // Determinar si es el último elemento
            const isLast = index === filteredSemesters.length - 1;
            return (
              <tr
                key={semester.id_semester}
                className="text-center bg-white border-b"
              >
                <td className="py-4">{semester.semesterName}</td>
                <td className="py-4">
                  {new Date(semester.semesterFrom).toLocaleDateString()}
                </td>
                <td className="py-4">
                  {new Date(semester.semesterTo).toLocaleDateString()}
                </td>
                <td className="py-4">
                  {new Date(semester.updated_at).toLocaleDateString()}
                </td>
                <td className="flex items-center justify-center space-x-4 py-4">
                  <button
                    className={`text-blue-500 hover:text-blue-700 ${
                      !isLast && "opacity-50 pointer-events-none"
                    }`}
                    onClick={() => {
                      setSemesterToEdit(semester);
                      setIsEditModalOpen(true);
                    }}
                    disabled={!isLast}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className={`text-red-500 hover:text-red-700 ${
                      !isLast && "opacity-50 pointer-events-none"
                    }`}
                    onClick={() => {
                      setSemesterToDelete(semester);
                      setIsDeleteModalOpen(true);
                    }}
                    disabled={!isLast}
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
