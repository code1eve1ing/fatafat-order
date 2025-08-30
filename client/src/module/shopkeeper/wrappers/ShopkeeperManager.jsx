import { FREE_TRIAL } from '@/lib/constants/user';
import useShopStore from '@/store/shop'
import React, { useEffect, useState } from 'react'
import CategorySelectionModal from '../_common/CategorySelectionModal';

const ShopkeeperManager = ({ children }) => {

    const [showCategorySelectionModal, setShowCategorySelectionModal] = useState(false)

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
        </>
    )
}

export default ShopkeeperManager