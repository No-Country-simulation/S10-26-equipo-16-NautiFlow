import BoatRequestFilters from "../components/adminPanel/BoatRequestFilters";
import PageContainer from "../components/PageContainer";
import type { BoatRequestFiltersState } from "../components/adminPanel/types";
import { useState } from "react";
import VerificationCard from "../components/adminPanel/VerificationCard";
import EmptyReturnModal from "../components/adminPanel/EmptyReturnModal";
import { getBoats } from "../components/boatAdmin/boatCatalog";
import { Link } from "react-router-dom";
import EmptyReturnColumn from "../components/adminPanel/EmptyReturnColumn";
import CreateService from "../components/adminPanel/CreateService";
import type {
  BoatRequest,
  VerificationStatus,
} from "../components/adminPanel/types";
import { screenSize } from "../hooks/screenSize";

// Datos temporales

const INITIAL_FILTERS: BoatRequestFiltersState = {
  query: "",
  date: "",
  time: "",
  capacity: "",
  zone: "",
};

export default function AdminPanel() {
  const [isEmptyReturnOpen, setIsEmptyReturnOpen] = useState(false);
  const [emptyReturnMessage, setEmptyReturnMessage] = useState("");
  const [filters, setFilters] =
    useState<BoatRequestFiltersState>(INITIAL_FILTERS);
  const [requests, setRequests] = useState<BoatRequest[]>(getBoats);
  const {isMobile, isTablet} = screenSize()

  // Actualizar status
  async function handleStatusChange(id: string, status: VerificationStatus) {
    try {
      // api req.
      // await boatService.updateStatus(id, status);

      const updatedBoats = requests.map((boat) =>
        boat.id === id ? { ...boat, status } : boat,
      );
      localStorage.setItem("nautiflow.boats", JSON.stringify(updatedBoats));
      // Actualiza la interfaz.
      setRequests((previous) =>
        previous.map((boat) => (boat.id === id ? { ...boat, status } : boat)),
      );
    } catch (error) {
      console.error("Error al actualizar solicitud:", error);
    }
  }

  function handleViewDocuments(boat: BoatRequest) {
    console.log("Ver documentos:", boat.id);

    // Aquí puedes abrir un modal de documentos.
  }

  function handleAssignTrip(boat: BoatRequest) {
    console.log("Asignar viaje:", boat.id);

    // Aquí puedes abrir el formulario de asignación.
  }
  return (
    <PageContainer>
      <div className={`${(!isMobile && !isTablet) ? "flex flex-row" : " "}`}>
        <div className="xl:pr-[22rem] pr-1">
          <h1 className="py-2">Administración </h1>
          {emptyReturnMessage && (
            <div role="status" className="mb-5 rounded-xl bg-base-100 p-4">
              <p className="font-medium">Aviso preparado localmente:</p>
              <p className="break-words">{emptyReturnMessage}</p>
            </div>
          )}

          <Link
            to="/all-services"
            className="btn btn-outline mb-4 rounded-full"
          >
            Todos los servicios
          </Link>
          <CreateService boats={requests} />
          <BoatRequestFilters filters={filters} onChange={setFilters} />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {requests.map((boat) => (
              <VerificationCard
                key={boat.id}
                boat={boat}
                onStatusChange={handleStatusChange}
                onViewDocuments={handleViewDocuments}
                onAssignTrip={handleAssignTrip}
              />
            ))}
          </div>
        </div>

        {/* ----------------- empty return ----------- */}
        <div className="mb-6 xl:fixed xl:top-20 xl:right-4 xl:z-30 xl:w-80 p-3 bg-tertiary rounded-xl mt-2">
          <button
            type="button"
            className="btn btn-primary rounded-full mb-3 w-full"
            aria-haspopup="dialog"
            onClick={() => setIsEmptyReturnOpen(true)}
          >
            Anunciar regreso vacío
          </button>
          <EmptyReturnColumn />
        </div>
        {isEmptyReturnOpen && (
          <EmptyReturnModal
            onClose={() => setIsEmptyReturnOpen(false)}
            onSend={(message) => {
              setEmptyReturnMessage(message);
              setIsEmptyReturnOpen(false);
            }}
          />
        )}
      </div>
    </PageContainer>
  );
}
