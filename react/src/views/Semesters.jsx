import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function Semesters() {
  const [semesters, setSemesters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [semesterYear, setSemesterYear] = useState(new Date().getFullYear());
  const [semesterSuffix, setSemesterSuffix] = useState(0);
  const [until, setUntil] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [semesterToEdit, setSemesterToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [semesterToDelete, setSemesterToDelete] = useState(null);

  const fetchSemesters = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/semesters`)
      .then((response) => response.json())
      .then((data) => setSemesters(data))
      .catch((error) =>
        console.error("Error al obtener los semestres:", error)
      );
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  const handleAddSemester = () => {
    const semesterName = `${semesterYear}-${semesterSuffix}`;
    const newSemester = {
      semesterName,
      until,
      created_at: new Date().toISOString(),
    };

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/semesters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSemester),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Error al registrar el nuevo semestre");
      })
      .then(() => {
        fetchSemesters();
        setIsModalOpen(false);
        setSemesterSuffix(0);
        setUntil("");
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleUpdateSemester = () => {
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/semesters/${
        semesterToEdit.id_semester
      }`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          semesterName: semesterToEdit.semesterName,
          until: semesterToEdit.until,
        }),
      }
    )
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Error al actualizar el semestre");
      })
      .then(() => {
        fetchSemesters();
        setIsEditModalOpen(false);
      })
      .catch((error) =>
        console.error("Error al actualizar el semestre:", error)
      );
  };

  const handleConfirmDelete = () => {
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/semesters/${
        semesterToDelete.id_semester
      }`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (response.ok) {
          fetchSemesters();
          setIsDeleteModalOpen(false);
        } else {
          throw new Error("Error al eliminar el semestre");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const filteredSemesters = selectedSemester
    ? semesters.filter(
        (semester) =>
          semester.semesterName === selectedSemester &&
          semester.deleted_at === null
      )
    : semesters.filter((semester) => semester.deleted_at === null);

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-6 bg-white border border-black rounded-lg py-5">
        Gestionar Semestres Académicos
      </h1>
      <p className="text-lg text-gray-700 mb-12 text-center">
        Puedes agregar nuevos semestres académicos, eliminar o modificar los
        existentes.
      </p>
      <div className="flex items-center space-x-4 mb-8">
        <select
          className="px-10 py-3 border rounded-lg text-gray-700"
          onChange={(e) => setSelectedSemester(e.target.value)}
        >
          <option value="">Seleccione un semestre</option>
          <option value="2024-2">2024-2</option>
          <option value="2024-1">2024-1</option>
          <option value="2023-2">2024-0</option>
        </select>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-10 py-3 rounded-lg"
          onClick={() => setIsModalOpen(true)}
        >
          Registrar nuevo semestre
        </button>
      </div>

      {/*Add modal*/}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              Registrar Nuevo Semestre
            </h2>
            <label className="block text-gray-700 font-semibold mb-2">
              Nombre del Semestre:
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
                {[0, 1, 2].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <label className="block text-gray-700 font-semibold mb-2">
              Fecha Hasta:
            </label>
            <input
              type="datetime-local"
              value={until}
              onChange={(e) => setUntil(e.target.value)}
              className="block w-full px-4 py-2 border rounded-lg mb-6"
            />
            <div className="flex justify-between">
              <button
                onClick={handleAddSemester}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Agregar Semestre
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
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
              Nombre del Semestre:
            </label>
            <div className="flex items-center space-x-4 mb-4">
              <input
                type="number"
                value={
                  semesterToEdit?.semesterName?.split("-")[0] || semesterYear
                }
                readOnly
                className="w-2/3 px-4 py-2 border rounded-lg bg-gray-200"
              />
              <select
                value={
                  semesterToEdit?.semesterName?.split("-")[1] || semesterSuffix
                }
                onChange={(e) =>
                  setSemesterToEdit({
                    ...semesterToEdit,
                    semesterName: `${
                      semesterToEdit.semesterName.split("-")[0] || semesterYear
                    }-${e.target.value}`,
                  })
                }
                className="w-1/3 px-4 py-2 border rounded-lg"
              >
                {[0, 1, 2].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <label className="block text-gray-700 font-semibold mb-2">
              Fecha Hasta:
            </label>
            <input
              type="datetime-local"
              value={semesterToEdit?.until || ""}
              onChange={(e) =>
                setSemesterToEdit({ ...semesterToEdit, until: e.target.value })
              }
              className="block w-full px-4 py-2 border rounded-lg mb-6"
            />
            <div className="flex justify-between">
              <button
                onClick={handleUpdateSemester}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
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
            <h2 className="text-2xl font-bold mb-6">Confirmar Eliminación</h2>
            <p className="text-gray-700 mb-8">
              ¿Está seguro de que desea eliminar el semestre{" "}
              <strong>{semesterToDelete?.semesterName}</strong>?
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg"
              >
                Eliminar
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg"
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
            <th className="py-3 px-6 text-center">ID_Semestre</th>
            <th className="py-3 px-6 text-center">Semestre Académico</th>
            <th className="py-3 px-6 text-center">Fecha de terminación</th>
            <th className="py-3 px-6 text-center">Última Actualización</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredSemesters.map((semester) => (
            <tr
              key={semester.id_semester}
              className="text-center bg-white border-b"
            >
              <td className="py-4">{semester.id_semester}</td>
              <td className="py-4">{semester.semesterName}</td>
              <td className="py-4">
                {new Date(semester.until).toLocaleDateString()}
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
