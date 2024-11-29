import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";

const COLORS = ["#0088FE", "#FFBB28", "#FF8042"];

const Preferences = () => {
  const [apiData, setApiData] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [dataMode, setDataMode] = useState("total"); // 'total' o 'applicants'

  useEffect(() => {
    // Consumir la API al montar el componente
    axios
      .get(
        "http://localhost/visitURP_version2/public/index.php/api/total-visitorsAdmittedByDistrict"
      )
      .then((response) => {
        const data = response.data;
        setApiData(data);
        setSelectedDistrict(data[0]?.name); // Seleccionar el primer distrito por defecto
      })
      .catch((error) => {
        console.error("Error al consumir la API:", error);
      });
  }, []);

  if (!apiData.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700">Cargando datos...</p>
      </div>
    );
  }

  const selectedData = apiData.find(
    (district) => district.name === selectedDistrict
  );

  const chartData =
    dataMode === "total"
      ? [
          { name: "Visitantes", value: selectedData.count },
          { name: "Postulantes", value: selectedData.applicants },
        ]
      : [
          { name: "Postulantes", value: selectedData.applicants },
          { name: "Admitidos", value: selectedData.admitted },
        ];

  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 border border-gray-300 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Panel izquierdo: Gráfico de torta */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Análisis de Visitantes y Postulantes por Distrito
        </h2>
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">
            Selecciona un distrito:
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="block w-full mt-2 p-2 border border-gray-300 rounded-md"
          >
            {apiData.map((district) => (
              <option key={district.cod_Ubigeo} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center mb-4 space-x-2">
          <button
            onClick={() => setDataMode("total")}
            className={`px-4 py-2 rounded-lg ${
              dataMode === "total"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Total
          </button>
          <button
            onClick={() => setDataMode("applicants")}
            className={`px-4 py-2 rounded-lg ${
              dataMode === "applicants"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Postulantes
          </button>
        </div>

        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Panel derecho: Detalle */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">Detalle:</h3>
        <p className="text-sm text-gray-700">
          En el distrito de{" "}
          <span className="font-medium">{selectedDistrict}</span>:
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-700 mt-2">
          <li>Total de visitantes: {selectedData.count}</li>
          <li>Total de postulantes: {selectedData.applicants}</li>
          <li>Total de admitidos: {selectedData.admitted}</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default Preferences;
