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
  const [successMessage, setSuccessMessage] = useState("");

  const API_BASE_URL =
    "http://localhost/visitURP_version2/public/index.php/api";

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

  const validateDates = (start, end, prevEnd, nextStart) => {
    if (new Date(start) >= new Date(end)) {
      return "La fecha de inicio debe ser menor que la de terminación.";
    }
    if (prevEnd && new Date(start) <= new Date(prevEnd)) {
      return "La fecha de inicio debe ser mayor a la terminación del semestre anterior.";
    }
    if (nextStart && new Date(end) >= new Date(nextStart)) {
      return "La fecha de terminación debe ser menor a la de inicio del semestre siguiente.";
    }
    return null;
  };

  const createSemesterObject = (name, from, to) => ({
    semesterName: name,
    semesterFrom: from,
    semesterTo: to,
    created_at: from,
  });

  // Actualiza la función handleAddSemester
  const handleAddSemester = async () => {
    const semesterName = `${semesterYear}-${semesterSuffix}`;
    const prevSemester = semesters[semesters.length - 1];

    // Validaciones iniciales
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

    const error = validateDates(
      semesterFrom,
      semesterTo,
      prevSemester?.semesterTo
    );
    if (error) {
      setErrorMessage(error);
      return;
    }

    const semesterFromFormatted = formatDate(semesterFrom);
    const semesterToFormatted = semesterTo ? formatDate(semesterTo) : null;

    if (new Date(semesterFrom) >= new Date(semesterTo)) {
      setErrorMessage(
        "La Fecha de Inicio debe ser menor que la Fecha de Terminación."
      );
      return;
    }

    if (
      latestSemester &&
      new Date(semesterFrom) <= new Date(latestSemester.semesterTo)
    ) {
      setErrorMessage(
        "La Fecha de Inicio debe ser mayor a la Fecha de Terminación del último semestre."
      );
      return;
    }

    // Crear nuevo semestre
    const newSemester = createSemesterObject(
      `${semesterYear}-${semesterSuffix}`,
      semesterFromFormatted,
      semesterToFormatted
    );

    try {
      await axios.post(`${API_BASE_URL}/register-semester`, {
        semesterName,
        semesterFrom,
        semesterTo,
      });
      fetchSemesters();
      setIsModalOpen(false);
      setSemesterTo("");
      setErrorMessage("");
      setSuccessMessage("Semestre registrado con éxito.");
    } catch (error) {
      console.error("Error al registrar semestre:", error);
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
    if (semestersData.length > 0) {
      const latest = semestersData[semestersData.length - 1];
      const [year, suffix] = latest.semesterName.split("-").map(Number);

      const nextYear = suffix === 2 ? year + 1 : year;
      const nextSuffix = suffix === 1 ? 2 : 1;

      setSemesterYear(nextYear);
      setSemesterSuffix(nextSuffix);

      // Ajustar fechas automáticas
      const nextFromDate = new Date(latest.semesterTo);
      nextFromDate.setDate(nextFromDate.getDate() + 1); // Día siguiente al fin del último semestre

      const nextToDate = new Date(nextFromDate);
      nextToDate.setMonth(nextToDate.getMonth() + 6); // Semestre de 6 meses

      setSemesterFrom(nextFromDate.toISOString().split("T")[0]);
      setSemesterTo(nextToDate.toISOString().split("T")[0]);
    } else {
      // Lógica para el primer semestre si no hay datos
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;

      setSemesterYear(month > 8 ? year + 1 : year);
      setSemesterSuffix(month > 3 && month <= 8 ? 2 : 1);

      const semesterFromDate = new Date();
      const semesterToDate = new Date(semesterFromDate);
      semesterToDate.setMonth(semesterToDate.getMonth() + 6);

      setSemesterFrom(semesterFromDate.toISOString().split("T")[0]);
      setSemesterTo(semesterToDate.toISOString().split("T")[0]);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSemesterFrom(new Date().toISOString().split("T")[0]); // Fecha actual
    setSemesterTo(""); // Fecha de terminación vacía
    setErrorMessage(""); // Reiniciar mensaje de error
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMessage("");
    setSemesterTo("");
    setSemesterFrom(new Date().toISOString().split("T")[0]);
  };

  // Actualiza la función handleUpdateSemester para mantener la lógica de validación
  const handleUpdateSemester = async () => {
    // Ordenar los semestres por fecha de creación o por nombre de semestre
    const sortedSemesters = [...semesters].sort((a, b) => {
      // Comparar primero por fecha de creación, si son iguales, por nombre de semestre
      const dateComparison =
        new Date(a.creationDate) - new Date(b.creationDate);
      return dateComparison !== 0
        ? dateComparison
        : a.semesterName.localeCompare(b.semesterName);
    });

    // Encontrar el índice del semestre que se está editando
    const currentIndex = sortedSemesters.findIndex(
      (s) => s.semesterName === semesterToEdit.semesterName
    );

    if (currentIndex === -1) {
      console.error("El semestre a editar no se encuentra en la lista.");
      setErrorMessage("El semestre que intenta editar no existe.");
      return;
    }

    // Determinar los semestres anterior y posterior
    const prevSemester =
      currentIndex > 0 ? sortedSemesters[currentIndex - 1] : null;
    const nextSemester =
      currentIndex < sortedSemesters.length - 1
        ? sortedSemesters[currentIndex + 1]
        : null;

    console.log("Semestre anterior:", prevSemester);
    console.log("Semestre actual:", sortedSemesters[currentIndex]);
    console.log("Semestre siguiente:", nextSemester);

    // Validar fechas ingresadas
    if (
      isNaN(new Date(semesterToEdit.semesterFrom)) ||
      isNaN(new Date(semesterToEdit.semesterTo))
    ) {
      setErrorMessage("Las fechas ingresadas no son válidas.");
      return;
    }

    // Validar que la Fecha de Inicio sea menor que la Fecha de Terminación
    if (
      new Date(semesterToEdit.semesterFrom) >=
      new Date(semesterToEdit.semesterTo)
    ) {
      setErrorMessage(
        "La Fecha de Inicio debe ser menor que la Fecha de Terminación."
      );
      return;
    }

    // Validar con el semestre anterior (si existe)
    if (
      prevSemester &&
      new Date(semesterToEdit.semesterFrom) <= new Date(prevSemester.semesterTo)
    ) {
      setErrorMessage(
        `La Fecha de Inicio debe ser mayor a la Fecha de Terminación del semestre anterior (${prevSemester.semesterName}).`
      );
      return;
    }

    // Validar con el semestre posterior (si existe)
    if (
      nextSemester &&
      new Date(semesterToEdit.semesterTo) >= new Date(nextSemester.semesterFrom)
    ) {
      setErrorMessage(
        `La Fecha de Terminación debe ser menor a la Fecha de Inicio del semestre posterior (${nextSemester.semesterName}).`
      );
      return;
    }

    try {
      // Realizar la actualización en el servidor
      await axios.put(
        `${API_BASE_URL}/update-semester/${semesterToEdit.semesterName}`,
        semesterToEdit
      );

      // Refrescar la lista de semestres
      fetchSemesters();
      setIsEditModalOpen(false);
      setErrorMessage("");
      setSuccessMessage("Semestre actualizado con éxito.");
    } catch (error) {
      console.error("Error al actualizar semestre:", error);
      setErrorMessage("Ocurrió un error al actualizar el semestre.");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const { semesterName } = semesterToDelete;
      await axios.delete(`${API_BASE_URL}/delete-semester/${semesterName}`);
      fetchSemesters();
      setIsDeleteModalOpen(false);
      setSuccessMessage("Semestre eliminado con éxito.");
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

  const isRegisterButtonDisabled = () => {
    false;
  };

  function formatDateForInput(date) {
    // Convertir a un objeto Date y asegurarse de manejar zonas horarias
    const adjustedDate = new Date(date);
    console.log("Fecha original:", date);
    console.log("Fecha ajustada:", adjustedDate);

    const year = adjustedDate.getUTCFullYear(); // Usar UTC para evitar desajustes
    const month = String(adjustedDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(adjustedDate.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    fetchSemesters();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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
          onClick={() => handleOpenModal()}
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
              onChange={(e) => setSemesterFrom(e.target.value)}
              className="block w-full px-4 py-2 border rounded-lg mb-4"
            />
            <label className="block text-gray-700 font-semibold mb-2">
              Fecha de Terminación
            </label>
            <input
              type="date"
              value={semesterTo}
              onChange={(e) => setSemesterTo(e.target.value)}
              className="block w-full px-4 py-2 border rounded-lg mb-6"
            />
            <div className="flex justify-center space-x-4">
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
            {errorMessage && (
              <p className="text-red-500 text-center mb-4">{errorMessage}</p>
            )}
            <label className="block text-gray-700 font-semibold mb-2">
              Nombre del Semestre:
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
              Fecha de Inicio:
            </label>
            <input
              type="date"
              value={
                semesterToEdit?.semesterFrom
                  ? formatDateForInput(semesterToEdit.semesterFrom)
                  : ""
              }
              onChange={(e) =>
                setSemesterToEdit({
                  ...semesterToEdit,
                  semesterFrom: e.target.value,
                })
              }
              className="block w-full px-4 py-2 border rounded-lg mb-4"
            />
            <label className="block text-gray-700 font-semibold mb-2">
              Fecha de Terminación:
            </label>
            <input
              type="date"
              value={
                semesterToEdit?.semesterTo
                  ? formatDateForInput(semesterToEdit.semesterTo)
                  : ""
              }
              onChange={(e) =>
                setSemesterToEdit({
                  ...semesterToEdit,
                  semesterTo: e.target.value,
                })
              }
              className="block w-full px-4 py-2 border rounded-lg mb-6"
            />
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleUpdateSemester}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg w-1/2"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg w-1/2"
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
          {semesters.length === 0 ? (
            // Caso 1: No hay semestres registrados
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-500">
                No hay Semestres Académicos registrados.
              </td>
            </tr>
          ) : filteredSemesters.length === 0 ? (
            // Caso 2: No hay resultados para la búsqueda
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-500">
                No hay resultados para tu búsqueda.
              </td>
            </tr>
          ) : (
            // Caso 3: Mostrar los semestres filtrados
            filteredSemesters.map((semester, index) => {
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
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => {
                        setSemesterToEdit(semester);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setSemesterToDelete(semester);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              );
            })
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
