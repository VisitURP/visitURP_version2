import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
} from "recharts";

// Datos de visitas a objetos interactivos de Ingeniería
const engineeringData = [
  { name: "Biblioteca Central", visitas: 130 },
  { name: "Esc. Informática", visitas: 110 },
  { name: "Esc. Industrial", visitas: 95 },
  { name: "Esc. Mecatrónica", visitas: 100 },
  { name: "Esc. Electrónica", visitas: 90 },
  { name: "Esc. Civil", visitas: 105 },
  { name: "Lab. Hidráulica", visitas: 85 },
  { name: "Lab. CIM", visitas: 70 },
  { name: "Lab. Electrónica", visitas: 80 },
  { name: "Lab. Física", visitas: 75 },
  { name: "Lab. Física 2", visitas: 65 },
  { name: "Lab. Mec. Suelos", visitas: 60 },
  { name: "Lab. Resistencia", visitas: 55 },
  { name: "Lab. Topografía", visitas: 50 },
  { name: "Lab. Mecatrónica", visitas: 45 },
  { name: "Lab. Info. 201-A", visitas: 100 },
  { name: "Lab. Info. 201-B", visitas: 95 },
  { name: "Lab. Info. 202-A", visitas: 90 },
  { name: "Lab. Info. 203-A", visitas: 85 },
  { name: "Lab. Info. 204-A", visitas: 75 },
  { name: "Lab. Info. 210-C", visitas: 70 },
  { name: "Lab. Info. 213-B", visitas: 60 },
];

const EngineeringObjectsRadarChart = () => {
  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 border border-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Distribución de Visitas a Objetos de Ingeniería
      </h2>
      <div style={{ width: "100%", height: 450 }}>
        <ResponsiveContainer>
          <RadarChart
            cx="50%"
            cy="45%"
            outerRadius="70%" // Radio ajustado para equilibrar espacio y legibilidad
            data={engineeringData}
          >
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis
              dataKey="name"
              stroke="#4B5563"
              tick={{ fontSize: 11 }} // Fuente ligeramente reducida para ajuste
            />
            <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#9CA3AF" />
            <Radar
              name="visitantes"
              dataKey="visitas"
              stroke="#4CAF50"
              fill="#4CAF50"
              fillOpacity={0.6}
            />
            <Tooltip
              formatter={(value) => [`${value} visitas`]}
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend wrapperStyle={{ top: 395, left: 0, paddingTop: 10 }} />{" "}
            {/* Ajuste aquí */}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default EngineeringObjectsRadarChart;
