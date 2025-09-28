import { useState, useEffect } from 'react';
import areaService from '../services/areaService';

export const useArea = () => {
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [allAreas, setAllAreas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load all states
    const loadStates = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await areaService.getStates();
            setStates(data);
        } catch (err) {
            setError(err.message || 'Failed to load states');
        } finally {
            setLoading(false);
        }
    };

    // Load cities by state
    const loadCities = async (stateId = null) => {
        setLoading(true);
        setError(null);
        try {
            const data = await areaService.getCities(stateId);
            setCities(data);
        } catch (err) {
            setError(err.message || 'Failed to load cities');
        } finally {
            setLoading(false);
        }
    };

    // Load districts by city
    const loadDistricts = async (cityId = null) => {
        setLoading(true);
        setError(null);
        try {
            const data = await areaService.getDistricts(cityId);
            setDistricts(data);
        } catch (err) {
            setError(err.message || 'Failed to load districts');
        } finally {
            setLoading(false);
        }
    };

    // Load all areas with hierarchy
    const loadAllAreas = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await areaService.getAllAreas();
            setAllAreas(data);
        } catch (err) {
            setError(err.message || 'Failed to load areas');
        } finally {
            setLoading(false);
        }
    };

    // State CRUD operations
    const createState = async (stateData) => {
        setLoading(true);
        setError(null);
        try {
            const newState = await areaService.createState(stateData);
            await loadStates();
            await loadAllAreas();
            return newState;
        } catch (err) {
            setError(err.message || 'Failed to create state');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateState = async (id, stateData) => {
        setLoading(true);
        setError(null);
        try {
            const updatedState = await areaService.updateState(id, stateData);
            await loadStates();
            await loadAllAreas();
            return updatedState;
        } catch (err) {
            setError(err.message || 'Failed to update state');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteState = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await areaService.deleteState(id);
            await loadStates();
            await loadAllAreas();
        } catch (err) {
            setError(err.message || 'Failed to delete state');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // City CRUD operations
    const createCity = async (cityData) => {
        setLoading(true);
        setError(null);
        try {
            const newCity = await areaService.createCity(cityData);
            await loadCities();
            await loadAllAreas();
            return newCity;
        } catch (err) {
            setError(err.message || 'Failed to create city');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateCity = async (id, cityData) => {
        setLoading(true);
        setError(null);
        try {
            const updatedCity = await areaService.updateCity(id, cityData);
            await loadCities();
            await loadAllAreas();
            return updatedCity;
        } catch (err) {
            setError(err.message || 'Failed to update city');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteCity = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await areaService.deleteCity(id);
            await loadCities();
            await loadAllAreas();
        } catch (err) {
            setError(err.message || 'Failed to delete city');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // District CRUD operations
    const createDistrict = async (districtData) => {
        setLoading(true);
        setError(null);
        try {
            const newDistrict = await areaService.createDistrict(districtData);
            await loadDistricts();
            await loadAllAreas();
            return newDistrict;
        } catch (err) {
            setError(err.message || 'Failed to create district');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateDistrict = async (id, districtData) => {
        setLoading(true);
        setError(null);
        try {
            const updatedDistrict = await areaService.updateDistrict(id, districtData);
            await loadDistricts();
            await loadAllAreas();
            return updatedDistrict;
        } catch (err) {
            setError(err.message || 'Failed to update district');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteDistrict = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await areaService.deleteDistrict(id);
            await loadDistricts();
            await loadAllAreas();
        } catch (err) {
            setError(err.message || 'Failed to delete district');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Load initial data on mount
    useEffect(() => {
        loadStates();
        loadCities(); // Load all cities without state filter
        loadDistricts(); // Load all districts without city filter
        loadAllAreas();
    }, []);

    return {
        // Data
        states,
        cities,
        districts,
        allAreas,
        loading,
        error,
        
        // Load functions
        loadStates,
        loadCities,
        loadDistricts,
        loadAllAreas,
        
        // State operations
        createState,
        updateState,
        deleteState,
        
        // City operations
        createCity,
        updateCity,
        deleteCity,
        
        // District operations
        createDistrict,
        updateDistrict,
        deleteDistrict,
        
        // Refresh functions
        refreshStates: loadStates,
        refreshCities: loadCities,
        refreshDistricts: loadDistricts,
        refreshAllAreas: loadAllAreas
    };
};
