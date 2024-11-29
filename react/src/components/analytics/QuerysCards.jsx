import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { MessageSquare, ArrowDownRight, ArrowUpRight } from "lucide-react";

const QuerysCards = () => {
  const [overviewData, setOverviewData] = useState([
    {
      name: "Consultas por atender",
      value: "0",
      change: 0,
      icon: MessageSquare,
    },
    { name: "Consultas atendidas", value: "0", change: 0, icon: MessageSquare },
  ]);

  const [builtAreaData, setBuiltAreaData] = useState([]);
  const [selectedVisitors, setSelectedVisitors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inquiriesToAnswer, answeredInquiries] = await Promise.all([
          axios.get(
            "http://localhost/visitURP_version2/public/index.php/api/inquiries-ToAnswer"
          ),
          axios.get(
            "http://localhost/visitURP_version2/public/index.php/api/inquiries-Answered"
          ),
        ]);

        setOverviewData([
          {
            name: "Consultas por atender",
            value: inquiriesToAnswer.data || "0",
            change: 2.5,
            icon: MessageSquare,
          },
          {
            name: "Consultas atendidas",
            value: answeredInquiries.data || "0",
            change: 5.2,
            icon: MessageSquare,
          },
        ]);
      } catch (error) {
        console.error("Error al obtener los datos de las consultas:", error);
      }
    };

    const fetchBuiltAreaData = async () => {
      try {
        const response = await axios.get(
          "http://localhost/visitURP_version2/public/index.php/api/total-VisitsWithDetailsByBuiltArea"
        );
        setBuiltAreaData(Object.values(response.data));
      } catch (error) {
        console.error(
          "Error al obtener los datos de las áreas construidas:",
          error
        );
      }
    };

    fetchData();
    fetchBuiltAreaData();
  }, []);

  const handleCardClick = (visitors) => {
    setSelectedVisitors(visitors);
  };

  return (
    <div>
      {/* Consultas */}
      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Resumen de Consultas
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8">
        {overviewData.map((item, index) => (
          <motion.div
            key={item.name}
            className={`bg-white backdrop-filter backdrop-blur-lg shadow-lg
              rounded-xl p-6 border border-gray-300 ${
                item.name === "Consultas por atender" ? "border-red-500" : ""
              }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className={`text-sm font-medium ${
                    item.name === "Consultas por atender"
                      ? "text-red-500"
                      : "text-[#282424]"
                  }`}
                >
                  {item.name}
                </h3>
                <p
                  className={`mt-1 text-xl font-semibold ${
                    item.name === "Consultas por atender"
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {item.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-full bg-opacity-30 ${
                  item.name === "Consultas por atender"
                    ? "bg-red-500"
                    : item.change >= 0
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              >
                <item.icon
                  className={`h-6 w-6 ${
                    item.name === "Consultas por atender"
                      ? "text-red-500"
                      : item.change >= 0
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                />
              </div>
            </div>
            <div
              className={`mt-4 flex items-center ${
                item.name === "Consultas por atender"
                  ? "text-red-500"
                  : item.change >= 0
                  ? "text-green-500"
                  : "text-gray-500"
              }`}
            >
              {item.change >= 0 ? (
                <ArrowUpRight size="20" />
              ) : (
                <ArrowDownRight size="20" />
              )}
              <span className="ml-1 text-sm font-medium">
                {Math.abs(item.change)}%
              </span>
              <span className="ml-2 text-sm text-gray-400">vs último mes</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Áreas construidas */}
      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Información de visitantes por lugar de visita
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8">
        {builtAreaData
          .filter((area) => area.visit_count > 0)
          .map((area, index) => (
            <motion.div
              key={area.name}
              className="bg-green-50 shadow-lg rounded-xl p-6 hover:bg-green-100 cursor-pointer border border-green-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleCardClick(area.visitors)}
            >
              <h3 className="text-sm font-medium text-green-700">
                {area.name}
              </h3>
              <p className="mt-1 text-xl font-semibold text-green-800">
                Visitantes: {area.visit_count}
              </p>
              <p className="mt-4 text-sm text-blue-600">
                Haz clic para ver el detalle de los estudiantes en el área.
              </p>
            </motion.div>
          ))}
      </div>

      {/* Detalle de visitantes */}
      {selectedVisitors.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Detalle de visitantes
          </h3>
          <table className="min-w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
              <tr>
                {["Nombre", "Apellido", "Email", "Teléfono"].map((header) => (
                  <th key={header} className="py-3 px-6 text-center">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedVisitors.map((visitor, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 text-gray-700 text-sm"
                >
                  <td className="text-center bg-white border-b">
                    {visitor.name || "N/A"}
                  </td>
                  <td className="text-center bg-white border-b">
                    {visitor.lastName || "N/A"}
                  </td>
                  <td className="text-center bg-white border-b">
                    {visitor.email || "N/A"}
                  </td>
                  <td className="text-center bg-white border-b">
                    {visitor.phone || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuerysCards;
