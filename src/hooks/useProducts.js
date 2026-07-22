import { useEffect, useState } from "react";
import {
    addProduct,
    getProducts,
    deleteProduct,
    updateProduct,
    getSingleProduct
} from "../api/products"
import { useNavigate } from "react-router-dom";

const initialState = {
    name: "",
    product_code: "",
    sku: "",
    product_type: "goods",
    category: "",
    manufacturer: "",
    vendor_id: "",
    unit_price: "",
    cost_price: "",
    tax_percentage: "",
    quantity_in_stock: "",
    reorder_level: "",
    unit: "Nos",
    description: "",
    status: "active",
};


const useProducts = () => {

    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);


    useEffect(() => {
        fetchProducts();
    }, []);


    const fetchProducts = async () => {
        try {
            setLoading(true);

            const res = await getProducts();
            console.log(res.data);

            if (Array.isArray(res.data)) {
                setProducts(res.data);
            } else {
                setProducts([]);
            }

        } catch (error) {
            console.log(error);
            setProducts([]);
        }
        finally {
            setLoading(false);
        }
    };


    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };


    const saveProduct = async () => {

        console.log("Current Edit ID:", editId);
        console.log("Submitting Data:", formData);

        try {
            setLoading(true);

            if (editId) {
                await updateProduct(editId, formData);
            } else {
                await addProduct(formData);
            }

            setFormData(initialState);
            setEditId(null);

            await fetchProducts();

            navigate("/inventory/products");

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }
    };
    const removeProduct = async (id) => {
        try {
            setLoading(true);

            await deleteProduct(id);

            // refresh list after delete
            fetchProducts();

        } catch (error) {
            console.log("Delete Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadProduct = async (id) => {
        try {

            const res = await getSingleProduct(id);

            const product = res.data;

            setFormData({
                name: product.name || "",
                product_code: product.productCode || "",
                sku: product.sku || "",
                product_type: product.productType || "goods",
                category: product.category || "",
                manufacturer: product.manufacturer || "",
                vendor_id: product.vendorId || "",
                unit_price: product.unitPrice || "",
                cost_price: product.costPrice || "",
                tax_percentage: product.taxPercentage || "",
                quantity_in_stock: product.quantityInStock || "",
                reorder_level: product.reorderLevel || "",
                unit: product.unit || "Nos",
                description: product.description || "",
                status: product.status || "active",
            });

            setEditId(Number(id));

        } catch (error) {
            console.log("Load Product Error:", error);
        }
    };
    return {
        products,
        formData,
        loading,
        handleChange,
        saveProduct,
        fetchProducts,
        removeProduct,
        loadProduct,
        editId
    };
};


export default useProducts;