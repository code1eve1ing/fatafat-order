import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, MapPin, Store, ChevronDown, Loader2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import shopsService from '@/services/shopsService';
import useShopStore from '@/store/shop';
import { useArea } from '@/hooks/useArea';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export function ShopsPage() {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDistrict, setSelectedDistrict] = useState('all');
    const [selectedCity, setSelectedCity] = useState('all');
    const [selectedState, setSelectedState] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const { categories } = useShopStore();
    const { states, cities, districts } = useArea();
    const navigate = useNavigate();

    // Refs for tracking previous filter values
    const prevFilters = React.useRef({
        searchQuery,
        selectedCategory,
        selectedDistrict,
        selectedCity,
        selectedState
    });

    console.log('cities', cities);
    console.log('dis', districts)

    const fetchShops = useCallback(async (pageNum = 1, reset = false) => {
        try {
            if (pageNum === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const params = {
                page: pageNum,
                limit: 20,
                ...(searchQuery.trim() && { name: searchQuery.trim() }),
                ...(selectedCategory && selectedCategory !== 'all' && { category_id: selectedCategory }),
                ...(selectedDistrict && selectedDistrict !== 'all' && { district_id: selectedDistrict }),
                ...(selectedCity && selectedCity !== 'all' && { city_id: selectedCity }),
                ...(selectedState && selectedState !== 'all' && { state_id: selectedState }),
            };

            const response = await shopsService.getShops(params);

            if (reset || pageNum === 1) {
                setShops(response.data);
            } else {
                setShops(prev => [...prev, ...response.data]);
            }

            setTotal(response.pagination.total);
            setHasMore(response.pagination.hasMore);
            setPage(pageNum);

        } catch (error) {
            console.error('Error fetching shops:', error);
            toast.error('Failed to load shops');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [searchQuery, selectedCategory, selectedDistrict, selectedCity, selectedState]);

    // Handle filter changes with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Check if filters have actually changed
            const currentFilters = { searchQuery, selectedCategory, selectedDistrict, selectedCity, selectedState };
            const filtersChanged = Object.keys(currentFilters).some(
                key => currentFilters[key] !== prevFilters.current[key]
            );

            if (filtersChanged) {
                fetchShops(1, true);
                prevFilters.current = currentFilters;
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedCategory, selectedDistrict, selectedCity, selectedState, fetchShops]);

    // Initial load
    useEffect(() => {
        fetchShops(1, true);
    }, []);

    // Handle state change - reset city and district
    useEffect(() => {
        if (selectedState === 'all') {
            setSelectedCity('all');
            setSelectedDistrict('all');
        } else {
            // Reset city and district when state changes
            const currentCities = cities?.filter(city => city.stateId?._id === selectedState);
            if (currentCities?.length === 0 || !currentCities?.find(city => city._id === selectedCity)) {
                setSelectedCity('all');
                setSelectedDistrict('all');
            }
        }
    }, [selectedState, cities]);

    // Handle city change - reset district
    useEffect(() => {
        if (selectedCity === 'all') {
            setSelectedDistrict('all');
        } else {
            // Reset district when city changes
            const currentDistricts = districts?.filter(district => district.cityId?._id === selectedCity);
            if (currentDistricts?.length === 0 || !currentDistricts?.find(district => district._id === selectedDistrict)) {
                setSelectedDistrict('all');
            }
        }
    }, [selectedCity, districts]);

    const handleLoadMore = () => {
        if (hasMore && !loadingMore) {
            fetchShops(page + 1, false);
        }
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedDistrict('all');
        setSelectedCity('all');
        setSelectedState('all');
    };

    const handleShopClick = (shop) => {
        navigate(`/customer/shop/${shop._id}`);
    };

    // Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop
                >= document.documentElement.offsetHeight - 1000
            ) {
                handleLoadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loadingMore, page]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <Store className="h-8 w-8 text-blue-600" />
                                Shops
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {total > 0 ? `${total} shops found` : 'Discover local shops'}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2"
                        >
                            <Filter className="h-4 w-4" />
                            Filters
                            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </Button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search shops by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12"
                        />
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All categories" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All categories</SelectItem>
                                            {categories?.map((category) => (
                                                <SelectItem key={category._id} value={category._id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* State Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                    <Select value={selectedState} onValueChange={setSelectedState}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All states" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All states</SelectItem>
                                            {states?.map((state) => (
                                                <SelectItem key={state._id} value={state._id}>
                                                    {state.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* City - Only show if state is selected */}
                                {selectedState && selectedState !== 'all' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All cities" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All cities</SelectItem>
                                                {cities?.filter(city => city.stateId?._id === selectedState)
                                                    .map((city) => (
                                                        <SelectItem key={city._id} value={city._id}>
                                                            {city.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* District - Only show if city is selected */}
                                {selectedCity && selectedCity !== 'all' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                                        <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All districts" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All districts</SelectItem>
                                                {districts?.filter(district => district.cityId?._id === selectedCity)
                                                    .map((district) => (
                                                        <SelectItem key={district._id} value={district._id}>
                                                            {district.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end mt-4">
                                <Button variant="outline" onClick={handleClearFilters}>
                                    Clear Filters
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Loading shops...</span>
                    </div>
                ) : shops.length === 0 ? (
                    <div className="text-center py-12">
                        <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No shops found</h3>
                        <p className="text-gray-600 mb-4">
                            {searchQuery || selectedCategory !== 'all' || selectedDistrict !== 'all' || selectedCity !== 'all' || selectedState !== 'all'
                                ? 'Try adjusting your filters or search terms'
                                : 'No shops are available at the moment'}
                        </p>
                        {(searchQuery || selectedCategory !== 'all' || selectedDistrict !== 'all' || selectedCity !== 'all' || selectedState !== 'all') && (
                            <Button variant="outline" onClick={handleClearFilters}>
                                Clear Filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Shop Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {shops.map((shop) => (
                                <Card
                                    key={shop._id}
                                    className="hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-400 h-full flex flex-col"
                                    onClick={() => handleShopClick(shop)}
                                >
                                    <CardContent className="p-4 flex-1 flex flex-col">
                                        {/* Header with name and code */}
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-medium text-gray-900 line-clamp-2 leading-tight">
                                                {shop.name}
                                            </h3>
                                            <Badge variant="outline" className="text-xs h-5 font-extralight px-2">
                                                {shop.category?.name || shop.category_id?.name || 'General Store'}

                                            </Badge>
                                        </div>

                                        {/* Category */}
                                        {/* <div className="flex items-center text-xs text-gray-600 mb-1.5">
                                            <Store className="h-3 w-3 mr-1.5 text-gray-400" />
                                            <span className="truncate">
                                                {shop.category?.name || shop.category_id?.name || 'General Store'}
                                            </span>
                                        </div> */}

                                        {/* Location */}
                                        <div className="flex items-start text-xs text-gray-500 mb-2">
                                            <MapPin className="h-3 w-3 mt-0.5 mr-1.5 flex-shrink-0 text-gray-400" />
                                            <span className="line-clamp-2">
                                                {[shop.district?.name, shop.city?.name, shop.state?.name]
                                                    .filter(Boolean)
                                                    .join(', ') || 'Location not specified'}
                                            </span>
                                        </div>

                                        {/* Status */}
                                        <div className="flex relative items-center text-xs mt-auto pt-2 border-t border-gray-100">
                                            <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                                            <span className="text-gray-600">Open • 10 AM - 10 PM</span>
                                            <ArrowRight className="h-3.5 w-3.5 absolute right-0" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Load More */}
                        {hasMore && (
                            <div className="flex justify-center mt-8">
                                <Button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="flex items-center gap-2"
                                >
                                    {loadingMore ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        'Load More'
                                    )}
                                </Button>
                            </div>
                        )}

                        {!hasMore && shops.length > 0 && (
                            <div className="text-center mt-8 text-gray-500">
                                <p>You've reached the end of the list</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
