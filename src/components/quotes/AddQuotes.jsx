import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useQuotes from "../../hooks/useQuotes";
import QuoteInformation from "./Addquotes/QuoteInformation.jsx";
import AddressSection from "./Addquotes/AddressSection";
import QuoteHeader from "./Addquotes/QuoteHeader";
import NotesSection from "./Addquotes/NotesSection.jsx";
import QuotedItems from "./Addquotes/QuotedItems.jsx";
import useProducts from "../../hooks/useProducts.js";

const AddQuotes = () => {
    const navigate = useNavigate();


    const {
        formData,
        handleChange,
        saveQuote,
        loadQuote,
        editId
    } = useQuotes();

    const handleSaveQuote = async () => {

        try {
            await saveQuote();
            // after success go to quotes page
            navigate("/quotes");
        } catch (error) {
            console.log(error);
        }
    };

    const { products, fetchProducts } = useProducts();

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <>

            <QuoteHeader
                saveQuote={handleSaveQuote}
                editId={editId} />
            <QuoteInformation
                formData={formData}
                handleChange={handleChange} />
            <AddressSection
                formData={formData}
                handleChange={handleChange} />
            <QuotedItems
                formData={formData}
                handleChange={handleChange}
                productsList={products}
            />

            <NotesSection
                formData={formData}
                handleChange={handleChange}
            />
        </>
    );
};


export default AddQuotes;