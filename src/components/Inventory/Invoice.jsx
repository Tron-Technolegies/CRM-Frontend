import { useState } from "react";
import InvoiceList from "./Invoice_main/Invoicelist";
import AddInvoice from "./Invoice_main/Addinvoice";
import InvoiceViewModal from "./Invoice_main/Invoiceviewmodal";

// mode: "list" | "add" | "edit"
export default function Invoice() {
  const [mode, setMode] = useState("list");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [viewingInvoiceId, setViewingInvoiceId] = useState(null);

  const goToList = () => {
    setMode("list");
    setSelectedInvoiceId(null);
  };

  const handleAdd = () => {
    setSelectedInvoiceId(null);
    setMode("add");
  };

  const handleEdit = (id) => {
    setViewingInvoiceId(null);
    setSelectedInvoiceId(id);
    setMode("edit");
  };

  const handleView = (id) => {
    setViewingInvoiceId(id);
  };

  const handleSaved = () => {
    goToList();
  };

  if (mode === "add" || mode === "edit") {
    return (
      <AddInvoice
        invoiceId={selectedInvoiceId}
        onCancel={goToList}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <>
      <InvoiceList onAdd={handleAdd} onEdit={handleEdit} onView={handleView} />

      {viewingInvoiceId && (
        <InvoiceViewModal
          invoiceId={viewingInvoiceId}
          onClose={() => setViewingInvoiceId(null)}
          onEdit={handleEdit}
        />
      )}
    </>
  );
}