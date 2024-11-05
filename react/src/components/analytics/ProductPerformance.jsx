import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

// Datos de visitantes por colegio
const schoolData = [
  { name: "Saco Oliveros", visitantes: 300 },
  { name: "Horacio Patiño", visitantes: 200 },
  { name: "Fermín Tanguis", visitantes: 150 },
  { name: "Colegio A", visitantes: 100 },
  { name: "Colegio B", visitantes: 80 },
  { name: "Colegio C", visitantes: 60 },
  { name: "Colegio D", visitantes: 40 },
];

// Filtrar los colegios principales y agrupar los demás como "Otros"
const mainSchools = schoolData.slice(0, 3);
const otherSchools = schoolData.slice(3);
const totalOthers = otherSchools.reduce(
  (acc, school) => acc + school.visitantes,
  0
);

// Datos con los principales colegios y una barra para "Otros"
const chartData = [...mainSchools, { name: "Otros", visitantes: totalOthers }];

// Colores en tonos de verde
const GREEN_COLORS = ["#006400", "#008000", "#32CD32", "#66CDAA", "#8FBC8F"];

const ProductPerformance = () => {
  const [showOthers, setShowOthers] = useState(false);

  // Alternar la visualización de los colegios "Otros"
  const toggleOthers = () => {
    setShowOthers((prev) => !prev);
  };

  return (
    <motion.div
      className="bg-white backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-lg font-semibold text-[#282424] mb-4">
        visitantes por Colegio
      </h2>
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <BarChart
            data={showOthers ? schoolData : chartData}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
            <XAxis dataKey="name" stroke="#374151" />
            <YAxis stroke="#374151" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Bar dataKey="visitantes" fill={GREEN_COLORS[2]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Botón para alternar la vista de "Otros" */}
      <div className="mt-4 text-center">
        <button
          onClick={toggleOthers}
          className="bg-green-700 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 focus:outline-none"
        >
          {showOthers ? "Ocultar Otros" : "Mostrar Otros"}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductPerformance;
