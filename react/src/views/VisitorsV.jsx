import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaSearch, FaEye } from "react-icons/fa";
import axios from "axios";

export default function VirtualVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [districts, setDistricts] = useState({});
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [visitDetails, setVisitDetails] = useState([]);
  const [isVisitsModalOpen, setIsVisitsModalOpen] = useState(false);
  const [isVisitDetailsModalOpen, setIsVisitDetailsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [districtNames, setVisitorNames] = useState({});

  // Obtener visitantes al montar el componente
  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      // Obtener la lista de visitantes
      const response = await axios.get(
        "http://localhost/visitURP_version2/public/index.php/api/list-visitorVs"
      );
      const visitorsData = response.data;

      // Obtener los códigos únicos de Ubigeo
      const codUbigeos = [...new Set(visitorsData.map((v) => v.cod_Ubigeo))];

      // Obtener los nombres de distritos para cada código único de Ubigeo
      const districtPromises = codUbigeos.map(async (codUbigeo) => {
        try {
          const districtResponse = await axios.get(
            `http://localhost/visitURP_version2/public/index.php/api/getdistrictS/${codUbigeo}`
          );
          const districtData = districtResponse.data;
          return {
            codUbigeo,
            UbigeoName: districtData?.UbigeoName || "Desconocido", // Validación segura
          };
        } catch (error) {
          console.warn(
            `No se pudo obtener el distrito para cod_Ubigeo ${codUbigeo}:`,
            error
          );
          return { codUbigeo, UbigeoName: "Desconocido" };
        }
      });

      // Esperar a que todas las solicitudes terminen
      const districts = await Promise.all(districtPromises);

      // Crear un mapa de códigos de Ubigeo a nombres de distritos
      const districtMap = districts.reduce((acc, curr) => {
        acc[curr.codUbigeo] = curr.UbigeoName;
        return acc;
      }, {});

      // Agregar el nombre del distrito correspondiente a cada visitante
      const visitorsWithDistricts = visitorsData.map((visitor) => ({
        ...visitor,
        UbigeoName: districtMap[visitor.cod_Ubigeo] || "Desconocido",
      }));

      // Actualizar el estado con los visitantes enriquecidos
      setVisitors(visitorsWithDistricts);
    } catch (error) {
      console.error("Error al obtener los visitantes virtuales:", error);
    }
  };


  // Filtrar visitantes según la búsqueda
  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredVisitors(
        visitors.filter(
          (visitor) =>
            visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            visitor.id_visitorV.toString().includes(searchQuery)
        )
      );
    } else {
      setFilteredVisitors(visitors);
    }
  }, [searchQuery, visitors]);

  // Manejar actualización de visitante
 const fetchVisitsByVisitor = async (visitorId) => {
   try {
     const response = await axios.get(
       `http://localhost/visitURP_version2/public/index.php/api/total-visitsByvisitorV/${visitorId}`
     );
     setVisitDetails(response.data.data); // Asegúrate de usar `data.data` si es el formato del JSON
     setIsVisitsModalOpen(true); // Abre el modal
   } catch (error) {
     console.error("Error al obtener las visitas:", error);
   }
 };

const fetchVisitDetails = async (visitId) => {
  try {
    const response = await axios.get(
      `http://localhost/visitURP_version2/public/index.php/api/filter-visitDetailsByVisit/${visitId}`
    );

    if (
      response.data &&
      response.data.success &&
      response.data.data.length > 0
    ) {
      setVisitDetails(response.data.data); // Pasar solo la propiedad 'data'
    } else {
      setVisitDetails([]); // Si no hay datos
    }

    setIsVisitDetailsModalOpen(true); // Abrir el modal
  } catch (error) {
    console.error("Error al obtener los detalles de la visita:", error);
    alert("Ocurrió un error al intentar obtener los detalles de la visita.");
  }
};

  // Manejar edición de visitante
  const handleUpdateVisitor = async () => {
    // Preparar los datos actualizados comparando con el visitante seleccionado
    const updatedData = Object.keys(formData).reduce((acc, key) => {
      // Si el campo es diferente o si está definido en `formData`, lo añadimos
      if (formData[key] !== selectedVisitor[key]) {
        acc[key] = formData[key];
      }
      return acc;
    }, {});

    // Verificar si hay datos para actualizar
    if (Object.keys(updatedData).length > 0) {
      try {
        await axios.put(
          `http://localhost/visitURP_version2/public/index.php/api/update-visitorV/${selectedVisitor.id_visitorV}`,
          updatedData
        );
        setSuccessMessage("Visitante actualizado exitosamente.");
        fetchVisitors(); // Refrescar la lista
        setIsEditModalOpen(false); // Cerrar el modal
      } catch (error) {
        console.error("Error actualizando el visitante:", error);
      }
    } else {
      setSuccessMessage("No hay cambios para actualizar.");
    }
  };

  // Ejemplo de cómo se maneja la apertura del modal y configuración inicial
  const openEditModal = (visitor) => {
    setSelectedVisitor(visitor);
    setFormData({
      name: visitor.name || "",
      lastName: visitor.lastName || "",
      email: visitor.email || "",
      phone: visitor.phone || "",
      educationalInstitution: visitor.educationalInstitution || "",
      birthDate: visitor.birthDate
        ? new Date(visitor.birthDate).toISOString().split("T")[0]
        : "",
    });
    setIsEditModalOpen(true);
  };

  // Manejar eliminación de visitante
  const handleDeleteVisitor = async () => {
    try {
      await axios.delete(
        `http://localhost/visitURP_version2/public/index.php/api/delete-visitorV/${selectedVisitor.id_visitorV}`
      );
      fetchVisitors();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar el visitante:", error);
    }
  };

  // Validar datos del formulario de edición
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres.";
    }
    if (!formData.lastName || formData.lastName.trim().length < 2) {
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres.";
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Debe ingresar un correo válido.";
    }
    if (!formData.phone || !/^\d{9}$/.test(formData.phone)) {
      newErrors.phone = "El teléfono debe tener 9 dígitos.";
    }
    if (!formData.educationalInstitution) {
      newErrors.educationalInstitution =
        "Debe ingresar la institución educativa.";
    }
    if (!formData.birthDate || isNaN(new Date(formData.birthDate).getTime())) {
      newErrors.birthDate = "Debe ingresar una fecha válida.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar el envío del formulario
  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Formulario válido, enviando datos...");
      onSubmit(); // Llama a la función pasada desde el padre
    } else {
      console.log("Errores en el formulario:", errors);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-[#282424] text-center mb-6 bg-white border border-gray-300 rounded-lg py-5">
        Gestionar Visitantes Virtuales
      </h1>
      <p className="text-lg text-gray-500 mb-12 text-center">
        A continuación se muestra la información de los visitantes virtuales
        registrados.
      </p>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por ID o nombre"
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
            <th className="py-3 px-6 text-center">Visitante</th>
            <th className="py-3 px-6 text-center">Correo</th>
            <th className="py-3 px-6 text-center">Doc. de Identidad</th>
            <th className="py-3 px-6 text-center">Teléfono</th>
            {/* <th className="py-3 px-6 text-center">Distrito</th> */}
            <th className="py-3 px-6 text-center">Institución Educativa</th>
            <th className="py-3 px-6 text-center">Fecha de Nacimiento</th>
            <th className="py-3 px-6 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredVisitors.length > 0 ? (
            filteredVisitors.map((visitor) => (
              <tr
                key={visitor.id_visitorV}
                className="text-center bg-white border-b"
              >
                <td className="py-4">{visitor.id_visitorV}</td>
                <td className="py-4">{`${visitor.name} ${visitor.lastName}`}</td>
                <td className="py-4">{visitor.email}</td>
                <td className="py-4">{visitor.documentNumber}</td>
                <td className="py-4">{visitor.phone}</td>
                {/* <td className="py-4">{visitor.UbigeoName}</td> */}
                <td className="py-4">{visitor.educationalInstitution}</td>
                <td className="py-4">
                  {new Date(visitor.birthDate).toLocaleDateString()}
                </td>

                <td className="flex items-center justify-center space-x-4 py-4">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      setFormData({
                        name: visitor.name || "",
                        lastName: visitor.lastName || "",
                        email: visitor.email || "",
                        phone: visitor.phone || "",
                        educationalInstitution:
                          visitor.educationalInstitution || "",
                        birthDate: visitor.birthDate
                          ? new Date(visitor.birthDate)
                              .toISOString()
                              .split("T")[0]
                          : "",
                      });
                      setIsEditModalOpen(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-green-500 hover:text-green-700"
                    onClick={() => {
                      fetchVisitsByVisitor(visitor.id_visitorV);
                    }}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => {
                      setSelectedVisitor(visitor);
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
              <td colSpan="10" className="py-4 text-center text-gray-500">
                No hay visitantes virtuales registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isVisitsModalOpen && (
        <VisitsModal
          visits={visitDetails}
          onVisitClick={fetchVisitDetails}
          onClose={() =>
            setIsVisitsModalOpen(false)} // Cierra el modal principal
        />
      )}
      {isVisitDetailsModalOpen && (
        <VisitDetailsModal
          details={visitDetails}
          onClose={() => setIsVisitDetailsModalOpen(false)} // Solo cierra el modal de detalles
        />
      )}
      {isEditModalOpen && (
        <EditModal
          formData={formData}
          setFormData={setFormData}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateVisitor} // Verifica esta función
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          onConfirm={handleDeleteVisitor}
          onClose={() => setIsDeleteModalOpen(false)}
          message={`¿Está seguro de que desea eliminar a "${selectedVisitor?.name}"?`}
        />
      )}
    </div>
  );
}

function VisitsModal({ visits, onVisitClick, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl relative">
        <button
          className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-2xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Visitas Realizadas</h2>
        <table className="min-w-full border rounded-lg overflow-hidden mb-4">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
              <th className="py-3 px-6">ID Visita</th>
              <th className="py-3 px-6">Tipo de Visita</th>
              <th className="py-3 px-6">Semestre de Visita</th>
              <th className="py-3 px-6">Fecha de Visita</th>
              <th className="py-3 px-6">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visits.length > 0 ? (
              visits.map((visit) => (
                <tr key={visit.id_visitV} className="border-b">
                  <td className="py-4 text-center">{visit.id_visitV}</td>
                  <td className="py-4 text-center">{visit.visitor_type}</td>
                  <td className="py-4 text-center">{visit.fk_id_semester}</td>
                  <td className="py-4 text-center">
                    {new Date(visit.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 text-center">
                    <button
                      className="text-blue-500 hover:text-blue-700 underline"
                      onClick={() => onVisitClick(visit.id_visitV)}
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  No hay visitas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function VisitDetailsModal({ details, onVisitClick, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">Detalles de la Visita</h2>
        {details.length > 0 ? (
          <div className="overflow-x-auto mb-4">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-center">
                  <th className="border border-gray-300 px-4 py-2">
                    ID Detalle
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Área Construida
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Tipo de Evento
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Ingreso/Salida
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Fecha y Hora
                  </th>
                </tr>
              </thead>
              <tbody>
                {details.map((detail) => (
                  <tr key={detail.id_visitVDetail} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">
                      {detail.id_visitVDetail}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {detail.fk_id_builtArea}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {detail.kindOfEvent}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {detail.get}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {detail.DateTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No existen detalles para esta visita.
          </p>
        )}
      </div>
    </div>
  );
}


function EditModal({ formData, setFormData, onClose, onSubmit }) {
  const [errors, setErrors] = useState({});

  // Validar datos del formulario
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres.";
    }
    if (!formData.lastName || formData.lastName.trim().length < 2) {
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres.";
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Debe ingresar un correo válido.";
    }
    if (!formData.documentNumber || formData.documentNumber.trim() === "") {
      newErrors.documentNumber = "Debe ingresar el número de documento.";
    }
    if (!formData.phone || !/^\d{9}$/.test(formData.phone)) {
      newErrors.phone = "El teléfono debe tener 9 dígitos.";
    }
    if (!formData.birthDate || isNaN(new Date(formData.birthDate).getTime())) {
      newErrors.birthDate = "Debe ingresar una fecha válida.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar el envío del formulario
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData); // Enviar los datos al método que maneja la actualización
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 overflow-hidden">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Editar Visitante
        </h2>
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          {/* Nombre */}
          <label className="block text-gray-700 font-semibold mb-2">
            Nombre
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg mb-2"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          {/* Apellido */}
          <label className="block text-gray-700 font-semibold mb-2">
            Apellido
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg mb-2"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          )}

          {/* Correo */}
          <label className="block text-gray-700 font-semibold mb-2">
            Correo
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg mb-2"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          {/* Teléfono */}
          <label className="block text-gray-700 font-semibold mb-2">
            Teléfono
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg mb-2"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}

          {/* Fecha de Nacimiento */}
          <label className="block text-gray-700 font-semibold mb-2">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) =>
              setFormData({ ...formData, birthDate: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg mb-2"
          />
          {errors.birthDate && (
            <p className="text-red-500 text-sm">{errors.birthDate}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-between gap-4 mt-4">
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
