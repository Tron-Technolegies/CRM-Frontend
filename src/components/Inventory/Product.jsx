import { useState } from "react";
import ProductList from "./Product_main/Productlist";
import AddProduct from "./Product_main/Addproduct";
import ProductViewModal from "./Product_main/Productviewmodal";

// mode: "list" | "add" | "edit"
export default function Product() {
  const [mode, setMode] = useState("list");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [viewingProductId, setViewingProductId] = useState(null);

  const goToList = () => {
    setMode("list");
    setSelectedProductId(null);
  };

  const handleAdd = () => {
    setSelectedProductId(null);
    setMode("add");
  };

  const handleEdit = (id) => {
    setViewingProductId(null); // close modal if open
    setSelectedProductId(id);
    setMode("edit");
  };

  const handleView = (id) => {
    setViewingProductId(id);
  };

  const handleSaved = () => {
    goToList();
  };

  if (mode === "add" || mode === "edit") {
    return (
      <AddProduct
        productId={selectedProductId}
        onCancel={goToList}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <>
      <ProductList onAdd={handleAdd} onEdit={handleEdit} onView={handleView} />

      {viewingProductId && (
        <ProductViewModal
          productId={viewingProductId}
          onClose={() => setViewingProductId(null)}
          onEdit={handleEdit}
        />
      )}
    </>
  );
}