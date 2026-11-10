import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BoatRequestFilters from "../components/adminPanel/BoatRequestFilters";
import CreateService from "../components/adminPanel/CreateService";
import DocumentsModal from "../components/adminPanel/DocumentsModal";
import EmptyReturnColumn from "../components/adminPanel/EmptyReturnColumn";
import EmptyReturnModal from "../components/adminPanel/EmptyReturnModal";
import type {
  BoatRequest,
  BoatRequestFiltersState,
  VerificationStatus,
} from "../components/adminPanel/types";
import VerificationCard from "../components/adminPanel/VerificationCard";
import WhatsAppContact from "../components/adminPanel/WhatsAppContact";
import { isAvailable } from "../components/boatAdmin/availability";
import type { BoatTrip } from "../components/boatAdmin/types";
import PageContainer from "../components/PageContainer";
import { Api } from "../services/Api";
import { clearAuthToken } from "../services/auth";
import { getApiTrips } from "../services/Trips.Service";

type PendingOperator = {
  id: string;
  nombre: string;
  telefono: string;
  licenciaUrl?: string | null;
  antecedentesPenalesUrl?: string | null;
  estadoVerificacion: "PENDING" | "VERIFIED" | "REJECTED";
  boats?: Array<{
    id: string;
    nombreEmbarcacion: string;
    capacidad: number;
    zonaCobertura: string[] | string;
    activa?: boolean;
    seguroUrl?: string | null;
  }>;
};

function toUiVerificationStatus(
  status: PendingOperator["estadoVerificacion"],
): VerificationStatus {
  switch (status) {
    case "PENDING":
      return "pending";
    case "VERIFIED":
      return "verified";
    case "REJECTED":
      return "rejected";
  }
}

function normalizeCoverageZones(
  value: string[] | string | null | undefined,
): string[] {
  if (Array.isArray(value)) return value;
  return value
    ? value
        .split(",")
        .map((zone) => zone.trim())
        .filter(Boolean)
    : [];
}

function mapOperatorBoats(
  operator: PendingOperator,
  includePlaceholder = false,
): BoatRequest[] {
  const hasBoats = Boolean(operator.boats?.length);
  const boats = hasBoats
    ? operator.boats!
    : includePlaceholder
      ? [
          {
            id: operator.id,
            nombreEmbarcacion: "Embarcación sin nombre",
            capacidad: 0,
            zonaCobertura: [],
          },
        ]
      : [];

  return boats.map((boat) => ({
    id: hasBoats ? boat.id : operator.id,
    verificationId: operator.id,
    name: boat.nombreEmbarcacion,
    captain: operator.nombre,
    phone: operator.telefono,
    zone: normalizeCoverageZones(boat.zonaCobertura),
    capacity: boat.capacidad,
    active: "activa" in boat ? boat.activa : true,
    status: toUiVerificationStatus(operator.estadoVerificacion),
    documents: [
      ...(operator.licenciaUrl
        ? [{ name: "Licencia", url: operator.licenciaUrl }]
        : []),
      ...(operator.antecedentesPenalesUrl
        ? [
            {
              name: "Antecedentes penales",
              url: operator.antecedentesPenalesUrl,
            },
          ]
        : []),
      ...(hasBoats && "seguroUrl" in boat && boat.seguroUrl
        ? [{ name: "Seguro", url: boat.seguroUrl }]
        : []),
    ],
  }));
}

const INITIAL_FILTERS: BoatRequestFiltersState = {
  query: "",
  date: "",
  time: "",
  capacity: "",
  zone: "",
  verification: "verified",
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [isEmptyReturnOpen, setIsEmptyReturnOpen] = useState(false);
  const [emptyReturnsRefreshKey, setEmptyReturnsRefreshKey] = useState(0);
  const [selectedBoatForDocuments, setSelectedBoatForDocuments] =
    useState<BoatRequest | null>(null);
  const [filters, setFilters] =
    useState<BoatRequestFiltersState>(INITIAL_FILTERS);
  const [requests, setRequests] = useState<BoatRequest[]>([]);
  const [fleet, setFleet] = useState<BoatRequest[]>([]);
  const [trips, setTrips] = useState<BoatTrip[]>([]);
  const [isLoadingVerifications, setIsLoadingVerifications] = useState(true);
  const [verificationError, setVerificationError] = useState("");
  const [isLoadingFleet, setIsLoadingFleet] = useState(true);
  const [fleetError, setFleetError] = useState("");
  const [updatingVerificationIds, setUpdatingVerificationIds] = useState<
    string[]
  >([]);

  useEffect(() => {
    let isActive = true;

    async function loadVerifications() {
      setIsLoadingVerifications(true);
      setVerificationError("");
      try {
        const { data } = await Api.get<PendingOperator[]>(
          "/admin/verifications",
        );
        if (!isActive) return;
        const operators = Array.isArray(data) ? data : [];
        setRequests(
          operators.flatMap((operator) => {
            const boats = operator.boats?.length
              ? operator.boats
              : [
                  {
                    id: operator.id,
                    nombreEmbarcacion: "Embarcación sin nombre",
                    capacidad: 0,
                    zonaCobertura: [],
                  },
                ];
            return boats.map((boat) => ({
              id: operator.boats?.length ? boat.id : operator.id,
              verificationId: operator.id,
              name: boat.nombreEmbarcacion,
              captain: operator.nombre,
              phone: operator.telefono,
              zone: normalizeCoverageZones(boat.zonaCobertura),
              capacity: boat.capacidad,
              status: toUiVerificationStatus(operator.estadoVerificacion),
              documents: [
                ...(operator.licenciaUrl
                  ? [{ name: "Licencia", url: operator.licenciaUrl }]
                  : []),
                ...(operator.antecedentesPenalesUrl
                  ? [
                      {
                        name: "Antecedentes penales",
                        url: operator.antecedentesPenalesUrl,
                      },
                    ]
                  : []),
                ...(boat.seguroUrl
                  ? [{ name: "Seguro", url: boat.seguroUrl }]
                  : []),
              ],
            }));
          }),
        );
      } catch {
        if (isActive)
          setVerificationError(
            "No fue posible cargar la cola de verificaciones. Intenta recargar la página.",
          );
      } finally {
        if (isActive) setIsLoadingVerifications(false);
      }
    }

    async function loadFleetAndTrips() {
      setIsLoadingFleet(true);
      setFleetError("");
      try {
        const [operatorsResponse, loadedTrips] = await Promise.all([
          Api.get<PendingOperator[]>("/boat-operators"),
          getApiTrips(),
        ]);
        if (!isActive) return;
        const operators = Array.isArray(operatorsResponse.data)
          ? operatorsResponse.data
          : [];
        setFleet(operators.flatMap((operator) => mapOperatorBoats(operator)));
        setTrips(loadedTrips);
      } catch {
        if (isActive)
          setFleetError("No fue posible cargar la flota para la búsqueda.");
      } finally {
        if (isActive) setIsLoadingFleet(false);
      }
    }

    void loadVerifications();
    void loadFleetAndTrips();
    return () => {
      isActive = false;
    };
  }, []);

  const hasCompleteSchedule = Boolean(filters.date && filters.time);
  const hasPartialSchedule = Boolean(filters.date) !== Boolean(filters.time);
  const matchingFleet = fleet.filter((boat) => {
    const query = filters.query.trim().toLocaleLowerCase();
    const zone = filters.zone.trim().toLocaleLowerCase();
    const minimumCapacity = Number(filters.capacity);

    if (boat.active === false) return false;
    if (filters.verification !== "all" && boat.status !== filters.verification)
      return false;
    if (
      query &&
      !`${boat.name} ${boat.captain}`.toLocaleLowerCase().includes(query)
    )
      return false;
    if (
      zone &&
      !boat.zone.some((item) => item.toLocaleLowerCase().includes(zone))
    )
      return false;
    if (filters.capacity && boat.capacity < minimumCapacity) return false;
    if (
      hasCompleteSchedule &&
      !isAvailable(
        boat,
        trips,
        filters.date,
        filters.time,
        minimumCapacity > 0 ? minimumCapacity : 1,
      )
    )
      return false;
    return true;
  });

  async function handleStatusChange(id: string, status: VerificationStatus) {
    const request = requests.find((boat) => boat.id === id);
    const verificationId = request?.verificationId ?? id;
    const estadoVerificacion = status === "verified" ? "VERIFIED" : "REJECTED";
    setVerificationError("");
    setUpdatingVerificationIds((current) => [...current, verificationId]);
    try {
      await Api.patch(`/admin/verifications/${verificationId}`, {
        estadoVerificacion,
      });
      setFleet((previous) =>
        previous.map((boat) =>
          boat.verificationId === verificationId ? { ...boat, status } : boat,
        ),
      );
      // El endpoint devuelve únicamente pendientes; al resolver uno, se retiran
      // todas las embarcaciones asociadas a ese operador de esta cola.
      setRequests((previous) =>
        previous.filter(
          (boat) => (boat.verificationId ?? boat.id) !== verificationId,
        ),
      );
    } catch {
      setVerificationError(
        "No fue posible actualizar la verificación. Intenta de nuevo.",
      );
    } finally {
      setUpdatingVerificationIds((current) =>
        current.filter((currentId) => currentId !== verificationId),
      );
    }
  }

  function handleViewDocuments(boat: BoatRequest) {
    setSelectedBoatForDocuments(boat);
  }

  function handleAssignTrip(boat: BoatRequest) {
    console.log("Asignar viaje:", boat.id);
  }

  function handleLogout() {
    clearAuthToken();
    navigate("/admin-login", { replace: true });
  }

  return (
    <PageContainer>
      <div className="w-full min-w-0 lg:pr-80">
        <div className="min-w-0 lg:pr-6">
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
          <Link
            to="/all-services"
            className="btn btn-outline mb-4 rounded-full"
          >
            Todos los servicios
          </Link>
          <CreateService />
          <BoatRequestFilters filters={filters} onChange={setFilters} />
          <section aria-labelledby="fleet-search-results" className="mb-8">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 id="fleet-search-results" className="text-xl font-semibold">
                Resultados de búsqueda
              </h2>
              {!isLoadingFleet && !fleetError && (
                <span className="text-sm text-base-content/60">
                  {matchingFleet.length} embarcaciones
                </span>
              )}
            </div>
            {hasPartialSchedule && (
              <p role="status" className="mb-3 text-sm text-base-content/70">
                Completa tanto la fecha como la hora para filtrar
                disponibilidad.
              </p>
            )}
            {isLoadingFleet && (
              <p role="status" className="mb-3">
                Cargando flota y disponibilidad…
              </p>
            )}
            {fleetError && (
              <p role="alert" className="mb-3 text-error">
                {fleetError}
              </p>
            )}
            {!isLoadingFleet && !fleetError && matchingFleet.length === 0 && (
              <p className="mb-4 rounded-xl bg-base-100 p-4">
                No hay embarcaciones que coincidan con los filtros.
              </p>
            )}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {matchingFleet.map((boat) => (
                <article
                  key={boat.id}
                  className="rounded-xl border border-base-300 bg-base-100 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{boat.name}</h3>
                      <p className="text-sm text-base-content/70">
                        {boat.captain} · {boat.phone}
                      </p>
                    </div>
                    <span
                      className={`badge ${boat.status === "verified" ? "badge-success" : boat.status === "pending" ? "badge-warning" : "badge-error"}`}
                    >
                      {boat.status === "verified"
                        ? "Verificada"
                        : boat.status === "pending"
                          ? "Pendiente"
                          : "Rechazada"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm">
                    {boat.zone.join(", ")} · {boat.capacity} pasajeros
                  </p>
                  <WhatsAppContact
                    phone={boat.phone}
                    boatName={boat.name}
                    className="mt-3 w-full"
                  />
                  {hasCompleteSchedule && boat.status === "verified" && (
                    <p className="mt-2 text-xs text-success">
                      Disponible para la fecha y hora seleccionadas.
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
          <section aria-labelledby="pending-verifications-title">
            <h2
              id="pending-verifications-title"
              className="mb-3 text-xl font-semibold"
            >
              Solicitudes pendientes de verificación
            </h2>
            {isLoadingVerifications && (
              <p role="status" className="mb-4">
                Cargando verificaciones pendientes…
              </p>
            )}
            {verificationError && (
              <p role="alert" className="mb-4 text-error">
                {verificationError}
              </p>
            )}
            {!isLoadingVerifications &&
              !verificationError &&
              requests.length === 0 && (
                <p className="mb-4">
                  No hay operadores pendientes de verificación.
                </p>
              )}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {requests.map((boat) => (
                <VerificationCard
                  key={boat.id}
                  boat={boat}
                  onStatusChange={handleStatusChange}
                  isUpdating={updatingVerificationIds.includes(
                    boat.verificationId ?? boat.id,
                  )}
                  onViewDocuments={handleViewDocuments}
                  onAssignTrip={handleAssignTrip}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="mt-6 flex min-h-0 flex-col gap-3 rounded-xl bg-tertiary p-3 lg:fixed lg:inset-y-0 lg:top-16 lg:right-0 lg:z-30 lg:mt-0 lg:w-80 lg:rounded-none lg:border-l lg:border-base-300 lg:shadow-lg">
          <button
            type="button"
            className="btn btn-primary w-full shrink-0 rounded-full"
            aria-haspopup="dialog"
            onClick={() => setIsEmptyReturnOpen(true)}
          >
            Anunciar regreso vacío
          </button>
          <EmptyReturnColumn refreshKey={emptyReturnsRefreshKey} />
        </div>
        {isEmptyReturnOpen && (
          <EmptyReturnModal
            onClose={() => setIsEmptyReturnOpen(false)}
            onCreated={() => {
              setEmptyReturnsRefreshKey((key) => key + 1);
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
