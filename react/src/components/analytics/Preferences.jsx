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

// Colores representativos de la universidad
const COLORS = ["#10B981", "#6251b5", "#E5E7EB"]; // Azul, amarillo, rojo

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
        setSelectedDistrict(data[0]?.name || null); // Seleccionar el primer distrito si existe
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

  const chartData = selectedData
    ? dataMode === "total"
      ? [
          { name: "Visitantes", value: selectedData.count || 0 },
          { name: "Postulantes", value: selectedData.applicants || 0 },
        ]
      : [
          { name: "Postulantes", value: selectedData.applicants || 0 },
          { name: "Admitidos", value: selectedData.admitted || 0 },
        ]
    : [];

  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-8 border border-gray-300 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Título centrado */}
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
        Análisis de Visitantes y Postulantes por Distrito
      </h2>

      <div className="flex flex-col md:flex-row items-center md:items-stretch space-y-8 md:space-y-0 md:space-x-8">
        {/* Panel izquierdo: Gráfico de torta */}
        <div className="flex-1 flex flex-col items-center">
          <div className="mb-6 w-full">
            <label className="text-sm font-medium text-gray-700 block">
              Selecciona un distrito:
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="block w-full mt-2 p-3 border border-gray-300 rounded-md"
            >
              {apiData.map((district) => (
                <option key={district.cod_Ubigeo} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center mb-6 space-x-4">
            <button
              onClick={() => setDataMode("total")}
              className={`px-5 py-2 rounded-lg ${
                dataMode === "total"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Total
            </button>
            <button
              onClick={() => setDataMode("applicants")}
              className={`px-5 py-2 rounded-lg ${
                dataMode === "applicants"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Postulantes
            </button>
          </div>

          <div style={{ width: "100%", height: 400 }}>
            {chartData.every((item) => item.value === 0) ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No hay datos para mostrar.</p>
              </div>
            ) : (
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
            )}
          </div>
        </div>

        {/* Panel derecho: Detalle */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gray-50 rounded-md shadow-inner">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Detalle del Distrito
          </h3>
          {selectedData ? (
            <ul className="list-disc text-gray-700 space-y-4 text-lg">
              <li>
                <span className="font-semibold">Distrito:</span>{" "}
                {selectedDistrict}
              </li>
              <li>
                <span className="font-semibold">Visitantes:</span>{" "}
                {selectedData.count}
              </li>
              <li>
                <span className="font-semibold">Postulantes:</span>{" "}
                {selectedData.applicants}
              </li>
              <li>
                <span className="font-semibold">Admitidos:</span>{" "}
                {selectedData.admitted}
              </li>
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">
              No hay datos para este distrito.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Preferences;
