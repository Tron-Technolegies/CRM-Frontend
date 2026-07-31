import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import PurchaseOrdersTable from "./purchaseOrder_main/PurchaseOrdersTable";
import PurchaseOrderViewModal from "./purchaseOrder_main/PurchaseOrderViewModal";
import usePurchaseOrders from "../../hooks/usePurchaseOrders";

const PurchaseOrders = () => {
  const navigate = useNavigate();
  const { purchaseOrders, loading, fetchPurchaseOrders, removePurchaseOrder } =
    usePurchaseOrders();

  const [viewOpen, setViewOpen] = useState(false);
  const [viewOrderId, setViewOrderId] = useState(null);

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const handleAdd = () => navigate("/inventory/purchase/add");
  const handleEdit = (id) => navigate(`/inventory/purchase/edit/${id}`);
  const handleView = (id) => {
    setViewOrderId(id);
    setViewOpen(true);
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this purchase order?",
    );
    if (!confirmDelete) return;
    await removePurchaseOrder(id);
  };

  return (
    <div className="mt-5 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-[#111827]">
          Purchase Orders
        </h1>
        <button
          type="button"
          onClick={handleAdd}
          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          Create Purchase Order
        </button>
      </div>

      <PurchaseOrdersTable
        orders={purchaseOrders}
        loading={loading}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />

      <PurchaseOrderViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        orderId={viewOrderId}
        onEdit={(order) => {
          setViewOpen(false);
          handleEdit(order.id);
        }}
      />
    </div>
  );
};

export default PurchaseOrders;
