import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productsApi } from '@/services/api';
import useCustomerStore from '@/store/customer';
import toast from 'react-hot-toast';

export function ShopDataWrapper({ children }) {
    const { shopId } = useParams();
    const {
        shop,
        setShop,
        setProducts,
        setMenuSections,
        setLoading,
        setError,
        getShop
    } = useCustomerStore();

    useEffect(() => {
        const loadShopData = async () => {
            if (!shopId) return;

            setLoading(true);
            setError(null);

            try {
                // If no shop data in store, fetch it first using the shopId
                if (!shop) {
                    console.log('No shop data in store, fetching shop details by ID...');
                    const shopResponse = await productsApi.get(`/shops/by-code/${shopId}`);
                    const { shop: shopData } = shopResponse.data;
                    setShop(shopData);
                }

                // Load products for the shop
                const productsResponse = await productsApi.get(`/products/shop/${shopId}`);
                const { products } = productsResponse.data;
                setProducts(products);

                // Load menu sections for the shop (if needed)
                try {
                    const menuSectionsResponse = await productsApi.get(`/menu-sections/shop/${shopId}`);
                    const { menuSections } = menuSectionsResponse.data;
                    setMenuSections(menuSections);
                } catch (menuError) {
                    console.warn('Could not load menu sections:', menuError);
                    // Don't show error for menu sections as it's optional
                }

            } catch (error) {
                console.error('Error loading shop data:', error);
                const errorMessage = error.response?.data?.message || 'Failed to load shop data';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        // Load shop data if we have a shopId
        if (shopId) {
            loadShopData();
        }
    }, [shopId, shop, setShop, setProducts, setMenuSections, setLoading, setError]);

    // If no shop data is available, show a message
    if (!shop && !getShop()) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    {/* // ToDO: get shop details by id in this case  */}
                    <h2 className="text-xl font-semibold mb-2">Shop not found</h2>
                    <p className="text-muted-foreground">Please enter a valid shop code to continue.</p>
                </div>
            </div>
        );
    }

    return children;
}
