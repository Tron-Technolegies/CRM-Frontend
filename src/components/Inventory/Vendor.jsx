import { useState } from "react";
import VendorList from "./Vendor_main/Vendorlist";
import AddVendor from "./Vendor_main/Addvendor";
import VendorViewModal from "./Vendor_main/Vendorviewmodal";

// mode: "list" | "add" | "edit"
export default function Vendor() {
  const [mode, setMode] = useState("list");
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [viewingVendorId, setViewingVendorId] = useState(null);

  const goToList = () => {
    setMode("list");
    setSelectedVendorId(null);
  };

  const handleAdd = () => {
    setSelectedVendorId(null);
    setMode("add");
  };

  const handleEdit = (id) => {
    setViewingVendorId(null); // close modal if open
    setSelectedVendorId(id);
    setMode("edit");
  };

  const handleView = (id) => {
    setViewingVendorId(id);
  };

  const handleSaved = () => {
    goToList();
  };

  if (mode === "add" || mode === "edit") {
    return (
      <AddVendor
        vendorId={selectedVendorId}
        onCancel={goToList}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <>
      <VendorList onAdd={handleAdd} onEdit={handleEdit} onView={handleView} />

      {viewingVendorId && (
        <VendorViewModal
          vendorId={viewingVendorId}
          onClose={() => setViewingVendorId(null)}
          onEdit={handleEdit}
        />
      )}
    </>
  );
}