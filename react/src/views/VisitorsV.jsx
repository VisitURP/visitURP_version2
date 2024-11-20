import React, { useState, useEffect } from "react";
import axios from "axios";

export default function VirtualVisitors() {
  const [visitors, setVisitors] = useState([]);

  // Obtener los datos de visitantes al montar el componente
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await axios.get(
          "http://localhost/visitURP_Backend/public/index.php/api/list-visitorVs"
        );
        setVisitors(response.data);
      } catch (error) {
        console.error("Error al obtener los visitantes virtuales:", error);
      }
    };

    fetchVisitors();
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-[#282424] text-center mb-6 bg-white border border-gray-300 rounded-lg py-5">
        Gestionar Visitantes Virtuales
      </h1>
      <p className="text-lg text-gray-500 mb-12 text-center">
        A continuación se muestra la información de los visitantes virtuales
        registrados.
      </p>

      <table className="min-w-full border rounded-lg overflow-hidden mb-8">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
            <th className="py-3 px-6 text-center">ID</th>
            <th className="py-3 px-6 text-center">Nombre</th>
            <th className="py-3 px-6 text-center">Apellido</th>
            <th className="py-3 px-6 text-center">Correo</th>
            <th className="py-3 px-6 text-center">Teléfono</th>
            <th className="py-3 px-6 text-center">Institución Educativa</th>
            <th className="py-3 px-6 text-center">Fecha de Nacimiento</th>
            <th className="py-3 px-6 text-center">Género</th>
          </tr>
        </thead>
        <tbody>
          {visitors.length > 0 ? (
            visitors.map((visitor) => (
              <tr
                key={visitor.id_visitorV}
                className="text-center bg-white border-b"
              >
                <td className="py-4">{visitor.id_visitorV}</td>
                <td className="py-4">{visitor.name}</td>
                <td className="py-4">{visitor.lastName}</td>
                <td className="py-4">{visitor.email}</td>
                <td className="py-4">{visitor.phone}</td>
                <td className="py-4">{visitor.educationalInstitution}</td>
                <td className="py-4">
                  {new Date(visitor.birthDate).toLocaleDateString()}
                </td>
                <td className="py-4">
                  {visitor.gender === "F" ? "Femenino" : "Masculino"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="py-4 text-center text-gray-500">
                No hay visitantes virtuales registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
