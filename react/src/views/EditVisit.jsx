import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import axiosClient from "../axios";
import TButton from "../components/core/TButton";
import PageComponent from "../components/PageComponent";

export default function EditVisit() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    id_visitorP: "",
    name: "",
    lastName: "",
    email: "",
    docNumber: "",
    phone: "",
    cod_Ubigeo: "",
    educationalInstitution: "",
    birthDate: "",
    gender: "",
  });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  if (location.state && location.state.visitData) {
    console.log("Datos recibidos:", location.state.visitData);
    setFormData(location.state.visitData);
  }
}, [location.state]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      updated_at: new Date().toLocaleString(), 
    };

    try {
      const response = await axiosClient.put(`/visit/${formData.id_visitorP}`, updatedFormData);

      if (response.status === 200) {
        setShowModal(true);
        setError("");
      } else {
        setError("Error al actualizar la visita");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error en la solicitud de actualización:", error.response.data);
        setError(`Error en la solicitud: ${error.response.data.message || 'Error desconocido'}`);
      } else if (error.request) {
        console.error("Error en la solicitud:", error.request);
        setError("Error en la solicitud, sin respuesta del servidor");
      } else {
        console.error("Error:", error.message);
        setError("Error en la solicitud: " + error.message);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/visitorsp"); 
  };

  const handleBackClick = () => {
    navigate("/visitorsp");
  };

  return (
    <PageComponent title="Editar Información de Visitante">
      <form className="shadow sm:overflow-hidden sm:rounded-md bg-white p-6" onSubmit={handleSubmit}>
        <div className="mb-4 text-gray-600">
          Edita los datos del visitante y guarda los cambios.
        </div>
        {error && <div className="bg-red-500 text-white py-3 px-3">{error}</div>}

        {[ 
          { label: "ID Visitante", name: "id_visitorP", readOnly: true }, 
          { label: "Nombre", name: "name" }, 
          { label: "Apellido", name: "lastName" }, 
          { label: "Email", name: "email", type: "email" },
          { label: "Documento", name: "docNumber" },
          { label: "Celular", name: "phone" },
          { label: "Código Ubigeo", name: "cod_Ubigeo" },
          { label: "Instituto de Educación", name: "educationalInstitution" },
          { label: "Fecha de Nacimiento", name: "birthDate", type: "date" },
          { label: "Género", name: "gender" },
        ].map(({ label, name, type = "text", readOnly = false }) => (
          <div key={name} className="mb-4 flex items-center space-x-2">
            <label className="block text-sm font-medium text-gray-700 w-1/3" htmlFor={name}>
              {label}
            </label>
            <input
              type={type}
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              readOnly={readOnly}
              className={`mt-1 block w-2/3 rounded-md border-2 ${readOnly ? 'bg-gray-200' : 'bg-green-50'} border-green-300 focus:border-green-500 focus:ring-green-500 sm:text-sm`}
              required
            />
          </div>
        ))}

        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 flex justify-end space-x-2">
          <TButton
            type="button"
            onClick={handleBackClick}
            className="bg-gray-500 text-white px-8 py-2 rounded-md hover:bg-gray-600 transition duration-200"
          >
            Volver
          </TButton>
          <TButton
            type="submit"
            className="bg-green-700 text-white px-8 py-2 rounded-md hover:bg-green-800 transition duration-200"
          >
            Guardar cambios
          </TButton>
        </div>
      </form>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[400px]">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-4">
              <FaCheckCircle className="text-4xl text-green-600" />
            </div>
            <h2 className="text-lg font-bold mt-4">Cambios guardados</h2>
            <p className="text-gray-600 mt-2">El registro del visitante ha sido actualizado correctamente.</p>
            <button
              onClick={closeModal}
              className="mt-6 bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition duration-200"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </PageComponent>
  );
}
