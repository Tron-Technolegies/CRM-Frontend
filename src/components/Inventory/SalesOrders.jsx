import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import SalesOrdersTable from "./SalesOrder_main/SalesOrdersTable";
import SalesOrderViewModal from "./SalesOrder_main/SalesOrderViewModal";
import ConfirmDialog from "../ui/ConfirmDialog";
import { useToast } from "../ui/toastContext";
import useSalesOrders from "../../hooks/useSalesOrders";
import usePermissions from "../../permissions/usePermissions";

const SalesOrders = () => {
  const { pushToast } = useToast();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const { salesOrders, loading, fetchSalesOrders, removeSalesOrder } =
    useSalesOrders();

  const [viewOpen, setViewOpen] = useState(false);
  const [viewOrderId, setViewOrderId] = useState(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchSalesOrders();
  }, []);

  const handleAdd = () => navigate("/inventory/salesOrder/add");
  const handleEdit = (id) => navigate(`/inventory/salesOrder/edit/${id}`);
  const handleView = (id) => {
    setViewOrderId(id);
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
      await removeSalesOrder(deleteTargetId);
      pushToast({
        title: "Sales order deleted",
        variant: "success",
      });
    } catch (err) {
      console.error("Delete sales order failed:", err);
      pushToast({
        title: "Failed to delete sales order",
        variant: "error",
      });
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="mt-5 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-[#111827]">Sales Orders</h1>
        {hasPermission("salesorder.create") && (
          <button
            type="button"
            onClick={handleAdd}
            className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium flex items-center gap-2 cursor-pointer"
          >
            <Plus size={18} />
            Add Sales Order
          </button>
        )}
      </div>

      <SalesOrdersTable
        orders={salesOrders}
        loading={loading}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={requestDelete}
      />

      <SalesOrderViewModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        orderId={viewOrderId}
        onEdit={hasPermission("salesorder.edit") ? (order) => {
          setViewOpen(false);
          handleEdit(order.id);
        } : undefined}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Delete sales order?"
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

export default SalesOrders;