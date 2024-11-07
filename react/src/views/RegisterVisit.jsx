import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import TButton from "../components/core/TButton";
import PageComponent from "../components/PageComponent";

export default function RegisterVisit() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    docNumber: "",
    phone: "",
    cod_Ubigeo: "",
    educationalInstitution: "",
    gender: "M",
    birthDate: "",
    created_at: "",
    updated_at: ""
  });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false); // Modal para datos duplicados
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      fk_docType_id: name === "docNumber" ? (/^\d+$/.test(value) ? 1 : 2) : prevData.fk_docType_id,
      created_at: new Date().toLocaleString(),
      updated_at: new Date().toLocaleString()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setShowModal(true);
        setShowErrorModal(false);
        setShowDuplicateModal(false);
        setError("");
        setFormData({
          name: "",
          lastName: "",
          email: "",
          docNumber: "",
          phone: "",
          cod_Ubigeo: "",
          educationalInstitution: "",
          gender: "M",
          birthDate: "",
          created_at: "",
          updated_at: ""
        });
      } else if (response.status === 422) {
        if (responseData.errors) {
          setError(responseData.errors[Object.keys(responseData.errors)[0]][0]);
        }
        setShowErrorModal(true);
        setShowModal(false);
      } else if (response.status === 409 && responseData.message.includes("name and lastName")) {
        setShowDuplicateModal(true);
        setShowErrorModal(false);
        setShowModal(false);
      }
    } catch (error) {
      setShowErrorModal(true);
      setShowModal(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  const closeDuplicateModal = () => {
    setShowDuplicateModal(false);
  };

  const handleBackClick = () => {
    navigate("/visitorsp");
  };

  return (
    <PageComponent title="Registrar una nueva visita presencial">
      <form className="shadow sm:overflow-hidden sm:rounded-md bg-white p-6" onSubmit={handleSubmit}>
        <div className="mb-4 text-gray-600">
          Complete la información del visitante para registrarlo en el sistema.
        </div>
        {error && <div className="bg-red-500 text-white py-3 px-3">{error}</div>}

        {[
          { label: "Nombre", name: "name" },
          { label: "Apellido", name: "lastName" },
          { label: "Email", name: "email", type: "email" },
          { label: "Documento", name: "docNumber" },
          { label: "Celular", name: "phone" },
          { label: "Código Ubigeo", name: "cod_Ubigeo" },
          { label: "Instituto Educación", name: "educationalInstitution" },
          { label: "Fecha Nacimiento", name: "birthDate", type: "date" }
        ].map(({ label, name, type = "text" }) => (
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
              className="mt-1 block w-2/3 rounded-md border-2 border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-500 sm:text-sm"
              required
            />
          </div>
        ))}

        <div className="mb-4 flex items-center space-x-2">
          <label className="block text-sm font-medium text-gray-700 w-1/3">Género</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-2/3 rounded-md border-2 border-green-300 bg-green-50 focus:border-green-500 focus:ring-green-500 sm:text-sm"
            required
          >
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>

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
            Guardar
          </TButton>
        </div>
      </form>

      {showModal && (
        <Modal icon={<FaCheckCircle className="text-4xl text-green-600" />} title="Visitante agregado" onClose={closeModal} message="El visitante ha sido agregado exitosamente." />
      )}

      {showErrorModal && (
        <Modal icon={<FaTimesCircle className="text-4xl text-red-600" />} title="Error en la solicitud" onClose={closeErrorModal} message="Ha ocurrido un error con la información ingresada." />
      )}

      {showDuplicateModal && (
        <Modal icon={<FaExclamationTriangle className="text-4xl text-yellow-600" />} title="Error: Datos ya registrados" onClose={closeDuplicateModal} message="El visitante ya está registrado en el sistema." />
      )}
    </PageComponent>
  );
}

function Modal({ icon, title, message, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[400px]">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-4">
          {icon}
        </div>
        <h2 className="text-lg font-bold mt-4">{title}</h2>
        <p className="text-gray-600 mt-2">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition duration-200"
        >
          OK
        </button>
      </div>
    </div>
  );
}
