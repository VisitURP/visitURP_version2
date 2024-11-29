import { useEffect } from "react";
import QuerysCards from "../components/analytics/QuerysCards";

export default function Statistics() {
  useEffect(() => {
    // Llamada a la API al cargar el componente
    const syncVisitorInfo = async () => {
      try {
        const response = await fetch(
          "http://localhost/visitURP_Backend/public/index.php/api/sync-visitorInfoXapplicants",
          {
            method: "GET",
          }
        );
        if (!response.ok) {
          throw new Error("Error en la sincronización de datos.");
        }
        console.log("Sincronización exitosa.");
      } catch (error) {
        console.error("Error al sincronizar datos:", error);
      }
    };

    syncVisitorInfo();
  }, []); // El array vacío asegura que se ejecute solo al montar el componente

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Tarjetas de vista general */}
        <QuerysCards />
      </main>
    </div>
  );
}
