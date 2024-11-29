import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  User,
  UserPlus,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

const OverviewCards = () => {
  const [overviewData, setOverviewData] = useState([
    { name: "Visitantes Totales", value: "0", change: 0, icon: Users },
    { name: "Visitantes Masculinos", value: "0", change: 0, icon: User },
    { name: "Visitantes Femeninos", value: "0", change: 0, icon: UserPlus },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [totalVisitors, maleVisitors, femaleVisitors] = await Promise.all(
          [
            axios.get(
              "http://localhost/visitURP_version2/public/index.php/api/total-visitors"
            ),
            axios.get(
              "http://localhost/visitURP_version2/public/index.php/api/visitors/gender/M"
            ),
            axios.get(
              "http://localhost/visitURP_version2/public/index.php/api/visitors/gender/F"
            ),
          ]
        );

        setOverviewData([
          {
            name: "Visitantes Totales",
            value: totalVisitors.data || "0",
            change: 8.3,
            icon: Users,
          },
          {
            name: "Visitantes Masculinos",
            value: maleVisitors.data.total_visitors || "0",
            change: -2.1,
            icon: User,
          },
          {
            name: "Visitantes Femeninos",
            value: femaleVisitors.data.total_visitors || "0",
            change: 3.7,
            icon: UserPlus,
          },
        ]);
      } catch (error) {
        console.error("Error al obtener los datos de las API:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className={`grid gap-5 
        grid-cols-1 sm:grid-cols-2 
        ${overviewData.length > 2 ? "lg:grid-cols-3" : "lg:grid-cols-2"}
        xl:grid-cols-3`}
    >
      {overviewData.map((item, index) => (
        <motion.div
          key={item.name}
          className="bg-white backdrop-filter backdrop-blur-lg shadow-lg
            rounded-xl p-6 border border-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#282424]">
                {item.name}
              </h3>
              <p className="mt-1 text-xl font-semibold text-gray-500">
                {item.value}
              </p>
            </div>
            <div
              className={`p-3 rounded-full bg-opacity-30 ${
                item.change >= 0 ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <item.icon
                className={`h-6 w-6 ${
                  item.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              />
            </div>
          </div>
          <div
            className={`mt-4 flex items-center ${
              item.change >= 0 ? "text-green-500" : "text-red-500"
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

export default OverviewCards;
