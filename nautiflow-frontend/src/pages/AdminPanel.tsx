import BoatRequestFilters from "../components/adminPanel/BoatRequestFilters";
import PageContainer from "../components/PageContainer";
import type { BoatRequestFiltersState } from "../components/adminPanel/types";
import { useState } from "react";
import VerificationCard from "../components/adminPanel/VerificationCard";
import EmptyReturnModal from "../components/adminPanel/EmptyReturnModal";
import DocumentsModal from "../components/adminPanel/DocumentsModal";
import { getBoats } from "../components/boatAdmin/boatCatalog";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthToken } from "../services/auth";
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
  const navigate = useNavigate();
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

  function handleLogout() {
    clearAuthToken();
    navigate("/admin-login", { replace: true });
  }

  return (
    <PageContainer>
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
      <div className="pt-16">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="py-2">Administración</h1>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
        <button
          type="button"
          className="btn btn-error mb-4"
          aria-haspopup="dialog"
          onClick={() => setIsEmptyReturnOpen(true)}
        >
          Anunciar regreso vacío
        </button>
        {emptyReturnMessage && (
          <div role="status" className="mb-5 rounded-xl bg-base-100 p-4">
            <p className="font-medium">Aviso preparado localmente:</p>
            <p className="wrap-break-word">{emptyReturnMessage}</p>
          </div>
        )}

        <Link to="/all-services" className="btn btn-outline mb-4 rounded-full">
          Todos los servicios
        </Link>
        <CreateService boats={requests} />
        <BoatRequestFilters filters={filters} onChange={setFilters} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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
    </PageContainer>
  );
}
