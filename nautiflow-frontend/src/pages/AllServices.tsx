import { useState } from "react";
import PageContainer from "../components/PageContainer";
import BoatHistoryRow from "../components/boatAdmin/BoatHistoryRow";
import { useTrips } from "../components/boatAdmin/useTrips";
import ServiceFilters from "../components/allServices/ServiceFilters";
import type { ServiceFilter } from "../components/allServices/types";
import BackToAdminBtn from "../components/adminPanel/BackToAdminBtn";

export default function AllServices() {
  const [filter, setFilter] = useState<ServiceFilter>("all");
  const trips = useTrips();
  const visible = trips.filter((trip) => filter === "all" || (filter === "empty" ? trip.emptyReturn : trip.status === filter))
    .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));

  return (
    <PageContainer>
      <BackToAdminBtn/>
      <h1 className="mb-4">Todos los servicios</h1>
      <ServiceFilters value={filter} onChange={setFilter} />
      <div className="space-y-4">
        {visible.map((trip) => <BoatHistoryRow key={trip.id} trip={trip} />)}
        {!visible.length && <p role="status">No hay servicios para este filtro.</p>}
      </div>
    </PageContainer>
  );
}
