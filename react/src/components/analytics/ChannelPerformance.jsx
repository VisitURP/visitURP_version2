import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

// Datos agrupados por zonas y distritos con sus respectivos porcentajes
const zoneData = [
  {
    name: "Lima Norte",
    value: 16,
    districts: [
      { name: "Los Olivos", value: 5 },
      { name: "Comas", value: 4 },
      { name: "Independencia", value: 3 },
      { name: "San Martín de Porres", value: 4 },
    ],
  },
  {
    name: "Lima Este",
    value: 15,
    districts: [
      { name: "Ate", value: 5 },
      { name: "Santa Anita", value: 3 },
      { name: "El Agustino", value: 2 },
      { name: "San Juan de Lurigancho", value: 5 },
    ],
  },
  {
    name: "Lima Centro",
    value: 12,
    districts: [
      { name: "Lima Cercado", value: 6 },
      { name: "Breña", value: 3 },
      { name: "La Victoria", value: 3 },
    ],
  },
  {
    name: "Lima Sur",
    value: 37,
    districts: [
      { name: "Villa María del Triunfo", value: 12 },
      { name: "Villa El Salvador", value: 8 },
      { name: "San Juan de Miraflores", value: 7 },
      { name: "Chorrillos", value: 10 },
    ],
  },
  {
    name: "Lima Moderna",
    value: 10,
    districts: [
      { name: "Miraflores", value: 3 },
      { name: "San Isidro", value: 2 },
      { name: "San Borja", value: 2 },
      { name: "Surquillo", value: 3 },
    ],
  },
];

// Colores para cada zona
const COLORS = ["#8884d8", "#FF8042", "#00C49F", "#FFBB28", "#FF5A36"];

// Función personalizada para mostrar etiquetas
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{ fontSize: "12px", fontWeight: "500" }}
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ChannelPerformance = () => {
  const [hoveredZone, setHoveredZone] = useState(null);

  return (
    <motion.div
      className="bg-white backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Porcentaje de Visitantes según Zonas de Lima
      </h2>
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={zoneData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={130} // Ajuste del radio para que los nombres no sobresalgan
              fill="#8884d8"
              dataKey="value"
              label={renderCustomLabel} // Etiqueta personalizada
              onMouseEnter={(data) => setHoveredZone(data.name)}
              onMouseLeave={() => setHoveredZone(null)}
            >
              {zoneData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="none" // Asegura que no haya borde
                  style={{ outline: "none" }} // Remueve cualquier borde por defecto al enfocarse
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563", // Color del borde del tooltip
                boxShadow: "none", // Elimina la sombra del borde del tooltip
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{
                maxHeight: 80,
                overflowY: "auto",
              }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {hoveredZone && (
        <div className="bg-gray-700 text-white p-4 rounded-lg mt-4 shadow-lg">
          <h3 className="text-lg font-semibold">Distritos en {hoveredZone}</h3>
          <ul className="mt-2 space-y-1">
            {zoneData
              .find((zone) => zone.name === hoveredZone)
              .districts.map((district, index) => (
                <li key={index} className="text-sm">
                  {district.name}: {district.value}% de visitantes
                </li>
              ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default ChannelPerformance;
