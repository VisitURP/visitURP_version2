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
import { useState, useEffect } from "react";
import axios from "axios";

// Mapeo de nombres completos a abreviaciones
const abbreviations = {
  "Universidad Ricardo Palma": "URP",
  "Facultad de Ingeniería": "Fac. Ing.",
  "Facultad de Arquitectura y Urbanismo": "FAU",
  "Facultad de Medicina Humana": "FMH",
  "Facultad de Ciencias Económicas y Empresariales": "FACEE",
  "Facultad de Humanidades y Lenguas Modernas": "FHLM",
  "Facultad de Ciencias Biológicas": "FCB",
  "Facultad de Derecho y Ciencia Política": "FDC",
  "Facultad de Psicología": "FP",
  // Añade más abreviaciones según sea necesario
};

// Color para las barras
const COLORS = "#4CAF50";

const VisitorDistribution = () => {
  const [visitorData, setVisitorData] = useState([]);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const response = await axios.get(
          "http://localhost/visitURP_Backend/public/index.php/api/academic-interests/count"
        );
        const apiData = response.data.academic_interests;

        // Transformar los datos de la API al formato esperado por el gráfico
        const formattedData = apiData.map((item) => ({
          name: abbreviations[item.career_name] || item.career_name, // Usa la abreviatura si existe
          fullName: item.career_name, // Nombre completo de la carrera/facultad
          visitantes: item.count, // Número de visitantes
        }));

        setVisitorData(formattedData);
      } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
      }
    };

    fetchVisitorData();
  }, []);

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
      <div style={{ width: "100%", height: 430 }}>
        <ResponsiveContainer>
          <BarChart
            data={visitorData}
            layout="vertical"
            margin={{ top: 40, right: 60 }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis type="number" />
            <YAxis
              dataKey="name"
              type="category"
              width={100} // Ajuste de ancho para más espacio horizontal
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value, name, props) => [
                `${value} visitantes`,
                props.payload.fullName, // Muestra el nombre completo en el tooltip
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
              wrapperStyle={{ paddingTop: 20, textAlign:"center", paddingLeft:70  }}
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
