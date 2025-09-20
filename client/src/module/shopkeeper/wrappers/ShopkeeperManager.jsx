import { FREE_TRIAL } from '@/lib/constants/user';
import useShopStore from '@/store/shop'
import React, { useEffect, useState } from 'react'
import CategorySelectionModal from '../_common/CategorySelectionModal';
import PremiumFeatureCover from '../_common/PremiumFeatureCover';
import useShopkeeper from '@/hooks/useShopkeeper';

const ShopkeeperManager = ({ children }) => {

    const [showCategorySelectionModal, setShowCategorySelectionModal] = useState(false)
    const { loadProducts, loadSections, loadOrders } = useShopkeeper()
    const shopDetails = useShopStore(state => state.shopDetails);

    const categories = useShopStore((state) => state.categories);

    useEffect(() => {
        if (categories?.length > 0 && localStorage.getItem('accountType') === FREE_TRIAL && !localStorage.getItem('shopType')) {
            setShowCategorySelectionModal(true)
        }

    }, [categories])

    const handleCategorySelect = (category) => {
        localStorage.setItem('shopType', category)
        setShowCategorySelectionModal(false)
    }

    useEffect(() => {
        if (shopDetails) {
            loadProducts()
            loadSections()
            loadOrders()
        }
    }, [shopDetails])

    // TODO: is it better to place navigate to home page here
    return (
        <>
            {children}
            <CategorySelectionModal
                isOpen={showCategorySelectionModal}
                onClose={() => setShowCategorySelectionModal(false)}
                categories={categories}
                onCategorySelect={handleCategorySelect}
            />
            {/* Opens subcription modal automatically on redirect from register/login */}
            <PremiumFeatureCover autoShowSubscriptonModal={true} />
        </>
    )
}

export default ShopkeeperManager