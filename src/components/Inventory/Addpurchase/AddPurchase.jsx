import React from 'react'
import PurchaseHeader from './PurchaseHeader'
import PurchaseInfo from './PurchaseInfo'
import AddressInfo from './AddressInfo'
import OrderedItems from './OrderedItems'

const AddPurchase = () => {
    return (
        <>
            <PurchaseHeader />
            <PurchaseInfo />
            <AddressInfo />
            <OrderedItems />
        </>
    )
}

export default AddPurchase