import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit2, Trash2 } from "lucide-react";

export default function QuerysN() {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get(
          "http://localhost/visitURP_Backend/public/index.php/api/list-inquiry"
        );
        setInquiries(response.data);
      } catch (error) {
        console.error("Error al obtener las consultas:", error);
      }
    };

    fetchInquiries();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEdit = (id) => {
    // Lógica para responder a la consulta
    console.log(`Responder consulta ID: ${id}`);
  };

  const handleDelete = (id) => {
    // Lógica para eliminar la consulta
    console.log(`Eliminar consulta ID: ${id}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6">ID Consulta</th>
            <th className="py-3 px-6">ID Visitante</th>
            <th className="py-3 px-6">Detalle</th>
            <th className="py-3 px-6">Estado</th>
            <th className="py-3 px-6">Fecha de Actualización</th>
            <th className="py-3 px-6">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm font-light">
          {inquiries.map((inquiry) => (
            <tr
              key={inquiry.id_inquiry}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6">{inquiry.id_inquiry}</td>
              <td className="py-3 px-6">{inquiry.fk_visitorV_id}</td>
              <td className="py-3 px-6">{inquiry.detail}</td>
              <td className="py-3 px-6">
                <span
                  className={`px-2 py-1 font-semibold rounded-full text-xs ${
                    inquiry.state === "Answered"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {inquiry.state === "Answered" ? "Respondido" : "Pendiente"}
                </span>
              </td>
              <td className="py-3 px-6">{formatDate(inquiry.updated_at)}</td>
              <td className="py-3 px-6 flex space-x-2">
                <button
                  onClick={() => handleEdit(inquiry.id_inquiry)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Responder"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(inquiry.id_inquiry)}
                  className="text-red-500 hover:text-red-700"
                  title="Eliminar"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
