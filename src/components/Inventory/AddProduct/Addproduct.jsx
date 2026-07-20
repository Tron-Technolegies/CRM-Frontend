import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import useProducts from "../../hooks/useProducts";
import ProductInfo from "./ProductInfo";
import PriceInfo from "./PriceInfo";
import StockInfo from "./StockInfo";
import ProductHeader from "./ProductHeader";


const AddProduct = () => {

    const {
        formData,
        handleChange,
        saveProduct,
        loadProduct,
        editId
    } = useProducts();


    const [searchParams] = useSearchParams();

    useEffect(() => {

        const id = searchParams.get("id");

        if (id) {
            loadProduct(id);
        }

    }, [searchParams]);


    return (
        <>
            <ProductHeader
                saveProduct={saveProduct}
                editId={editId}
            />

            <ProductInfo
                formData={formData}
                handleChange={handleChange}
            />

            <PriceInfo
                formData={formData}
                handleChange={handleChange}
            />

            <StockInfo
                formData={formData}
                handleChange={handleChange}
            />
        </>
    );
};

export default AddProduct;