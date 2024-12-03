import React, { useState, useEffect } from "react";
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

const EngineeringObjectsRadarChart = () => {
  const [engineeringData, setEngineeringData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mapeo de abreviaturas
 const abbreviations = {
   "Biblioteca Central": "Bib. Central",
   "Escuela Informatica": "Esc. Informática",
   "Escuela Industrial": "Esc. Industrial",
   "Escuela Mecatronica": "Esc. Mecatrónica",
   "Escuela Electronica": "Esc. Electrónica",
   "Escuela Civil": "Esc. Civil",
   "Laboratorio de Hidr\u00e1ulica": "Lab. Hidráulica",
   "Laboratorio CIM": "Lab. CIM",
   "Laboratorio de Electr\u00f3nica": "Lab. Electrónica",
   "Laboratorio de Fisica": "Lab. Física",
   "Segundo Laboratorio de Fisica": "Lab. Física 2",
   "Laboratorio de Mec\u00e1nica de Suelos": "Lab. Mec. Suelos",
   "Laboratorio de Resistencia de Materiales": "Lab. Resistencia",
   "Laboratorio de Topograf\u00eda": "Lab. Topografía",
   "Laboratorio de Mecatr\u00f3nica": "Lab. Mecatrónica",
   "Laboratorio de Inform\u00e1tica 201-A": "Lab. Info. 201-A",
   "Laboratorio de Inform\u00e1tica 201-B": "Lab. Info. 201-B",
   "Laboratorio de Inform\u00e1tica 202-A": "Lab. Info. 202-A",
   "Laboratorio de Inform\u00e1tica 203-A": "Lab. Info. 203-A",
   "Laboratorio de Inform\u00e1tica 204-A": "Lab. Info. 204-A",
   "Laboratorio de Inform\u00e1tica 210-C": "Lab. Info. 210-C",
   "Laboratorio de Inform\u00e1tica 213-B": "Lab. Info. 213-B",
   "Biblioteca Central Segundo Piso": "Bib. 2do Piso",
   "Laboratorio de Quimica": "Lab. Química",
   "Laboratorio de Telecomunicaciones": "Lab. Telecom.",
   "Auditorio Ollantaytambo": "Aud. Ollant.",
 };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost/visitURP_version2/public/index.php/api/total-visitorsVByArea"
        );
        if (!response.ok) {
          throw new Error("Error al obtener los datos de la API");
        }
        const data = await response.json();

        // Transformar y filtrar los datos
        const formattedData = Object.values(data)
          .filter((item) => item.visit_count > 0)
          .map((item) => ({
            name: abbreviations[item.name] || item.name, // Usar abreviatura si existe
            visitas: item.visit_count,
          }));

        setEngineeringData(formattedData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      {loading ? (
        <p className="text-gray-600">Cargando datos...</p>
      ) : engineeringData.length === 0 ? (
        <p className="text-gray-600">No hay datos para mostrar.</p>
      ) : (
        <div style={{ width: "100%", height: 450 }}>
          <ResponsiveContainer>
            <RadarChart
              cx="50%"
              cy="45%"
              outerRadius="70%"
              data={engineeringData}
            >
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis
                dataKey="name"
                stroke="#4B5563"
                tick={{ fontSize: 11 }}
              />
              <PolarRadiusAxis angle={30} stroke="#9CA3AF" />
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
              <Legend wrapperStyle={{ top: 395, left: 0, paddingTop: 10 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

export default EngineeringObjectsRadarChart;
