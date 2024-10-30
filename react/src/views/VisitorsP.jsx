import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios';
import PageComponent from "../components/PageComponent";

export default function VisitorsP() {
  const [visits, setVisits] = useState([]);
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register-visit');
  };

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const response = await axiosClient.get('/visit');
        setVisits(response.data);
        console.log("Datos recibidos:", response.data);
      } catch (error) {
        console.error("Error fetching visit:", error);
      }
    };

    fetchVisit();
  }, []);

  return (
    <PageComponent title="Gestión de Visitas Presenciales">
      <div className="bg-white p-6 shadow sm:rounded-md">
        <p className="text-gray-600 mb-6">
          Puedes agregar nuevos visitantes, eliminar o cambiar información existente.
        </p>
        <div className="flex justify-between mb-4">
          <select className="p-2 border rounded-md">
            <option>Todos los visitantes</option>
          </select>
          <button 
            onClick={handleRegisterClick} 
            className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Registrar nueva visita
          </button>
        </div>
        <table className="min-w-full bg-white border rounded-md">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-center">Identificación del visitante</th>
              <th className="py-2 px-4 border-b text-center">Fecha de visita</th>
              <th className="py-2 px-4 border-b text-center">Hora de visita</th>
              <th className="py-2 px-4 border-b text-center">Semestre académico</th>
              <th className="py-2 px-4 border-b text-center">Provincia de origen</th>
              <th className="py-2 px-4 border-b text-center">Estado</th>
              <th className="py-2 px-4 border-b text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit, index) => (
              <tr key={index} className="text-center">
                <td className="py-2 px-4 border-b flex items-center justify-center">
                  <FaUser className="mr-2 text-gray-500" /> {visit.ID_Visitante}
                </td>
                <td className="py-2 px-4 border-b text-center">{visit.Fecha_Visita}</td>
                <td className="py-2 px-4 border-b text-center">{visit.Hora_Visita}</td>
                <td className="py-2 px-4 border-b text-center">{visit.Semestre}</td>
                <td className="py-2 px-4 border-b text-center">{visit.Provincia_O}</td>
                <td className="py-2 px-4 border-b text-center">{visit.Estado}</td>
                <td className="py-2 px-4 border-b flex space-x-2 justify-center">
                  <button className="p-2 text-blue-500 hover:underline">✏️</button>
                  <button className="p-2 text-red-500 hover:underline">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageComponent>
  );
}
