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
            value: inquiriesToAnswer.data || "0", // Ajusta según la respuesta de la API
            change: 2.5,
            icon: MessageSquare,
          },
          {
            name: "Consultas atendidas",
            value: answeredInquiries.data || "0", // Ajusta según la respuesta de la API
            change: 5.2,
            icon: MessageSquare,
          },
        ]);
      } catch (error) {
        console.error("Error al obtener los datos de las API:", error);
      }
    };

    fetchData();
  }, []);

  return (
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
  );
};

export default QuerysCards;
