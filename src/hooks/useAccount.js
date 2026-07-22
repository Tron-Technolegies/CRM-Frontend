import { useEffect, useState, useMemo } from "react";
import { useToast } from "../components/ui/toastContext"

import {
    getAccounts,
    getStaff,
    deleteAccount as removeAccount,
    createAccount,
    updateAccount,
} from "../api/account"


const useAccount = () => {
    const { pushToast } = useToast();
    const [accounts, setAccounts] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addLoading, setAddLoading] = useState(false);
    const [editAccount, setEditAccount] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchAccounts = async () => {
        try {
            const res = await getAccounts();
            setAccounts(
                Array.isArray(res.data)
                    ? res.data
                    : []
            );

        } catch (error) {
            console.error(error);
            pushToast({
                title: "Failed to load accounts",
                variant: "error"
            });

        }
        finally {

            setLoading(false);

        }

    };
    const fetchStaff = async () => {
        try {

            const res = await getStaff();
            setStaff(
                Array.isArray(res.data)
                    ? res.data
                    : []
            );
        }
        catch (error) {

            console.error(error);

        }

    };
    useEffect(() => {

        fetchAccounts();
        fetchStaff();

    }, []);

    const addAccount = async (data) => {
        setAddLoading(true);
        try {
            await createAccount(data);
            fetchAccounts();
            pushToast({
                title: "Account created",
                variant: "success"
            });
        }
        catch (error) {
            console.error(error);
            pushToast({
                title: "Failed to create account",
                variant: "error"
            });
        }
        finally {
            setAddLoading(false);
        }
    };

    const editAccountData = async (id, data) => {
        setAddLoading(true);
        try {
            await updateAccount(id, data);
            fetchAccounts();
            pushToast({
                title: "Account updated",
                variant: "success"
            });
        }
        catch (error) {

            console.error(error);
            pushToast({
                title: "Failed to update account",
                variant: "error"
            });

        }
        finally {

            setAddLoading(false);

        }

    };
    const removeAccountData = async (id) => {
        setDeleteLoading(true);
        try {
            await removeAccount(id);
            setAccounts(prev =>
                prev.filter(
                    account => account.id !== id
                )
            );
            pushToast({
                title: "Account deleted",
                variant: "success"
            });
        }
        catch (error) {
            console.error(error);
            pushToast({
                title: "Failed to delete account",
                variant: "error"
            });

        }
        finally {
            setDeleteLoading(false);
        }
    };

    return {

        accounts,
        staff,
        loading,
        addLoading,
        deleteLoading,
        editAccount,
        setEditAccount,
        fetchAccounts,
        addAccount,
        updateAccount: editAccountData,
        deleteAccount: removeAccountData,
    };
};


export default useAccount;