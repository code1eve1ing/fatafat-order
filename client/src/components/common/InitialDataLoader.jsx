import { useCategory } from '@/hooks/useCategory'
import { useEffect } from 'react'
import useShopStore from '@/store/shop'

const InitialDataLoader = () => {

    const { categories } = useCategory();
    const setCategories = useShopStore((state) => state.setCategories);

    useEffect(() => {
        if (categories.length > 0) {
            setCategories(categories);
        }
    }, [categories])

    return (
        null
    )
}

export default InitialDataLoader