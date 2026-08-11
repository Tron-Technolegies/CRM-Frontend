import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import QuotesTable from "../components/quotes/QuotesTable";
import QuoteViewModal from "../components/quotes/QuoteViewModal";
import QuotesKpis from "../components/quotes/QuotesKpis";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import useQuotes from "../hooks/useQuotes";

const Quotes = () => {
  const navigate = useNavigate();
  const { quotes, loading, fetchQuotes, removeQuote } = useQuotes();

  const [viewOpen, setViewOpen] = useState(false);
  const [viewQuoteId, setViewQuoteId] = useState(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleAdd = () => navigate("/quotes/add");
  const handleEdit = (id) => navigate(`/quotes/edit/${id}`);
  const handleView = (id) => {
    setViewQuoteId(id);
    setViewOpen(true);
  };

  const requestDelete = (id) => {
    setDeleteTargetId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;

    setDeleteLoading(true);

    try {
      await removeQuote(deleteTargetId);
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="mt-5 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-[#111827]">Quotes</h1>
        <button
          type="button"
          onClick={handleAdd}
          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          Add Quote
        </button>
      </div>

      <QuotesKpis quotes={quotes} />

      <QuotesTable
        quotes={quotes}
        loading={loading}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={requestDelete}
      />

      <QuoteViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        quoteId={viewQuoteId}
        onEdit={(quote) => {
          setViewOpen(false);
          handleEdit(quote.id);
        }}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete quote?"
        description="This action cannot be undone."
        confirmText="Delete"
        danger
        loading={deleteLoading}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Quotes;