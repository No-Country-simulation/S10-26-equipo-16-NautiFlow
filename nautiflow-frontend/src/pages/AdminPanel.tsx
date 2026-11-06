import BoatRequestFilters from "../components/adminPanel/BoatRequestFilters";
import PageContainer from "../components/PageContainer";
import type { BoatRequestFiltersState } from "../components/adminPanel/types";
import { useState } from "react";
import VerificationCard from "../components/adminPanel/VerificationCard";
import EmptyReturnModal from "../components/adminPanel/EmptyReturnModal";
import DocumentsModal from "../components/adminPanel/DocumentsModal";
import { getBoats } from "../components/boatAdmin/boatCatalog";
import { Link } from "react-router-dom";
import EmptyReturnColumn from "../components/adminPanel/EmptyReturnColumn";
import CreateService from "../components/adminPanel/CreateService";
import type {
  BoatRequest,
  VerificationStatus,
} from "../components/adminPanel/types";

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
  const [selectedBoatForDocuments, setSelectedBoatForDocuments] =
    useState<BoatRequest | null>(null);
  const [emptyReturnMessage, setEmptyReturnMessage] = useState("");
  const [filters, setFilters] =
    useState<BoatRequestFiltersState>(INITIAL_FILTERS);
  const [requests, setRequests] = useState<BoatRequest[]>(getBoats);

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
    setSelectedBoatForDocuments(boat);
  }

  function handleAssignTrip(boat: BoatRequest) {
    console.log("Asignar viaje:", boat.id);

    // Aquí puedes abrir el formulario de asignación.
  }
  return (
    <PageContainer>
      <div className="w-full min-w-0 lg:pr-80">
        <div className="min-w-0 lg:pr-6">
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
        <div className="mt-6 flex min-h-0 flex-col gap-3 rounded-xl bg-tertiary p-3 lg:fixed lg:inset-y-0 lg:top-16 lg:right-0 lg:z-30 lg:mt-0 lg:w-80 lg:rounded-none lg:border-l lg:border-base-300 lg:shadow-lg">
          <button
            type="button"
            className="btn btn-primary w-full shrink-0 rounded-full"
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
        {selectedBoatForDocuments && (
          <DocumentsModal
            boat={selectedBoatForDocuments}
            onClose={() => setSelectedBoatForDocuments(null)}
          />
        )}
      </div>
    </PageContainer>
  );
}
