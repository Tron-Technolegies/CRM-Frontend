import { useState } from "react";
import ServiceList from "./Service_main/Servicelist";
import AddService from "./Service_main/Addservice";
import ServiceViewModal from "./Service_main/Serviceviewmodal";

// mode: "list" | "add" | "edit"
export default function Service() {
  const [mode, setMode] = useState("list");
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [viewingServiceId, setViewingServiceId] = useState(null);

  const goToList = () => {
    setMode("list");
    setSelectedServiceId(null);
  };

  const handleAdd = () => {
    setSelectedServiceId(null);
    setMode("add");
  };

  const handleEdit = (id) => {
    setViewingServiceId(null); // close modal if open
    setSelectedServiceId(id);
    setMode("edit");
  };

  const handleView = (id) => {
    setViewingServiceId(id);
  };

  const handleSaved = () => {
    goToList();
  };

  if (mode === "add" || mode === "edit") {
    return (
      <AddService
        serviceId={selectedServiceId}
        onCancel={goToList}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <>
      <ServiceList onAdd={handleAdd} onEdit={handleEdit} onView={handleView} />

      {viewingServiceId && (
        <ServiceViewModal
          serviceId={viewingServiceId}
          onClose={() => setViewingServiceId(null)}
          onEdit={handleEdit}
        />
      )}
    </>
  );
}