import { useState } from "react";
import {
    addQuote,
    getQuotes,
    getSingleQuote,
    updateQuote,
    deleteQuote as deleteQuoteApi,
} from "../api/quotes";


const initialState = {
    subject: "",
    quote_stage: "draft",
    valid_until: "",
    assigned_to: "",
    deal_id: "",
    contact_name: "",
    account_id: "",

    carrier: "",
    team: "",

    terms_conditions: "",
    description: "",

    products: []
};


const useQuotes = () => {

    const [formData, setFormData] = useState(initialState);

    const [quotes, setQuotes] = useState([]);
    const [quote, setQuote] = useState(null);

    const [editId, setEditId] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);



    // Common input handler
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    const removeQuote = async (id) => {
        try {
            setLoading(true);

            await deleteQuoteApi(id);

            // Refresh list
            await fetchQuotes();

        } catch (err) {
            setError(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };



    // Save Quote
    const saveQuote = async () => {

        try {

            setLoading(true);

            let response;

            if (editId) {
                response = await updateQuote(editId, formData);
            }
            else {
                response = await addQuote(formData);
            }

            return response.data;
        } catch (err) {

            setError(err.response?.data || err.message);
            throw err;

        } finally {

            setLoading(false);
        }

    };

    // Load quote for edit
    const loadQuote = async (id) => {

        try {

            const response = await getSingleQuote(id);

            setFormData(response.data);
            setEditId(id);

        }
        catch (err) {

            setError(err.response?.data || err.message);

        }

    };



    // Get all quotes
    const fetchQuotes = async () => {
        try {
            const response = await getQuotes();
            setQuotes(response.data);
        }
        catch (err) {
            setError(err.response?.data || err.message);
        }
    };
    return {
        formData,
        handleChange,
        quotes,
        quote,
        loading,
        error,
        saveQuote,
        loadQuote,
        editId,
        fetchQuotes,
        removeQuote,
    };
};


export default useQuotes;