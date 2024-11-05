import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const visitantesData = [
  { month: "Ene", virtuales: 400, presenciales: 380 },
  { month: "Feb", virtuales: 300, presenciales: 320 },
  { month: "Mar", virtuales: 500, presenciales: 450 },
  { month: "Abr", virtuales: 450, presenciales: 420 },
  { month: "May", virtuales: 600, presenciales: 550 },
  { month: "Jun", virtuales: 550, presenciales: 580 },
  { month: "Jul", virtuales: 700, presenciales: 650 },
  { month: "Ago", virtuales: 750, presenciales: 670 },
  { month: "Sep", virtuales: 600, presenciales: 630 },
  { month: "Oct", virtuales: 800, presenciales: 720 },
  { month: "Nov", virtuales: 650, presenciales: 600 },
  { month: "Dic", virtuales: 900, presenciales: 750 },
];

const VisitantesChart = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");

  return (
    <motion.div
      className="bg-white backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-300 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6 ">
        <h2 className="text-xl font-semibold text-[#282424]">
          Visitantes Virtuales vs Visitantes Presenciales
        </h2>
        <select
          className="bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
        >
          <option>Este año</option>
          <option>Este mes</option>
          <option>Esta semana</option>
        </select>
      </div>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <AreaChart data={visitantesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis
              stroke="#9CA3AF"
              domain={[0, 800]}
              ticks={[200, 400, 600, 800]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="virtuales"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.3}
            />
            <Area
              type="monotone"
              dataKey="presenciales"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default VisitantesChart;
