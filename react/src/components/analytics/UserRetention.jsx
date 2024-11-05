
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

// Datos de visitantes por interés académico
const visitorData = [
  { name: "URP", visitantes: 200 },
  { name: "Informática", visitantes: 90 },
  { name: "Industrial", visitantes: 100 },
  { name: "Civil", visitantes: 120 },
  { name: "Mecatrónica", visitantes: 85 },
  { name: "Electrónica", visitantes: 80 },
  { name: "Fac. Ing.", visitantes: 150 },
  { name: "FAU", visitantes: 110 }, // Facultad de Arquitectura y Urbanismo
  { name: "FMH", visitantes: 130 }, // Facultad de Medicina Humana
  { name: "FACEE", visitantes: 95 }, // Facultad de Ciencias Económicas y Empresariales
  { name: "FHLM", visitantes: 40 }, // Facultad de Humanidades y Lenguas Modernas
  { name: "FCB", visitantes: 50 }, // Facultad de Ciencias Biológicas
  { name: "FDC", visitantes: 90 }, // Facultad de Derecho y Ciencia Política
  { name: "FP", visitantes: 80 }, // Facultad de Psicología
];

// Color para las barras
const COLORS = "#4CAF50";

const VisitorDistribution = () => {
  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 border border-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-[#282424] mb-4">
        Distribución de Visitantes por Intereses Académicos
      </h2>
      <div style={{ width: "100%", height: 500 }}>
        {" "}
        {/* Altura reducida */}
        <ResponsiveContainer>
          <BarChart
            data={visitorData}
            layout="vertical"
            margin={{ top: 20, right: 40, left: 20, bottom: 40 }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis type="number" />
            <YAxis
              dataKey="name"
              type="category"
              width={90} // Ajuste de ancho para espacio de nombres
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value, name, props) => [
                `${value} visitantes`,
                props.payload.name,
              ]}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderColor: "#E0E0E0",
              }}
              itemStyle={{ color: "#333" }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: 20 }}
            />
            <Bar
              dataKey="visitantes"
              fill={COLORS}
              label={{ position: "insideRight", fill: "#000", fontSize: 12 }}
              background={{ fill: "#F1F8E9" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default VisitorDistribution;


