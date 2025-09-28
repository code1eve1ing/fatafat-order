import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    MoreVertical,
    Plus,
    Search,
    Trash2,
    Edit,
    MapPin,
    Building,
    Globe,
    ChevronRight,
} from "lucide-react";
import { StateModal } from "./StateModal";
import { CityModal } from "./CityModal";
import { DistrictModal } from "./DistrictModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from '@/module/shopkeeper/_common/Sidebar';
import { useArea } from '@/hooks/useArea';

export function AreaPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("hierarchy");
    
    // Modal states
    const [isStateModalOpen, setIsStateModalOpen] = useState(false);
    const [isCityModalOpen, setIsCityModalOpen] = useState(false);
    const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
    
    // Editing states
    const [editingState, setEditingState] = useState(null);
    const [editingCity, setEditingCity] = useState(null);
    const [editingDistrict, setEditingDistrict] = useState(null);

    const {
        states,
        cities,
        districts,
        allAreas,
        loading,
        error,
        loadCities,
        createState,
        updateState,
        deleteState,
        createCity,
        updateCity,
        deleteCity,
        createDistrict,
        updateDistrict,
        deleteDistrict,
    } = useArea();

    // Filter functions
    const filteredStates = states.filter(state =>
        state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        state.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredCities = cities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (city.stateId?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredDistricts = districts.filter(district =>
        district.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (district.cityId?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (district.cityId?.stateId?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredAreas = allAreas.filter(area =>
        area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (area.cityId?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (area.cityId?.stateId?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    // State handlers
    const handleCreateState = async (data) => {
        await createState(data);
    };

    const handleUpdateState = async (data) => {
        if (editingState?._id) {
            await updateState(editingState._id, data);
        }
    };

    const handleDeleteState = async (id) => {
        if (window.confirm('Are you sure you want to delete this state? This will also delete all associated cities and districts.')) {
            await deleteState(id);
        }
    };

    const openEditStateModal = (state) => {
        setEditingState(state);
        setIsStateModalOpen(true);
    };

    const closeStateModal = () => {
        setIsStateModalOpen(false);
        setEditingState(null);
    };

    // City handlers
    const handleCreateCity = async (data) => {
        await createCity(data);
        await loadCities(); // Refresh cities list
    };

    const handleUpdateCity = async (data) => {
        if (editingCity?._id) {
            await updateCity(editingCity._id, data);
            await loadCities(); // Refresh cities list
        }
    };

    const handleDeleteCity = async (id) => {
        if (window.confirm('Are you sure you want to delete this city? This will also delete all associated districts.')) {
            await deleteCity(id);
            await loadCities(); // Refresh cities list
        }
    };

    const openEditCityModal = (city) => {
        setEditingCity(city);
        setIsCityModalOpen(true);
    };

    const closeCityModal = () => {
        setIsCityModalOpen(false);
        setEditingCity(null);
    };

    // District handlers
    const handleCreateDistrict = async (data) => {
        await createDistrict(data);
    };

    const handleUpdateDistrict = async (data) => {
        if (editingDistrict?._id) {
            await updateDistrict(editingDistrict._id, data);
        }
    };

    const handleDeleteDistrict = async (id) => {
        if (window.confirm('Are you sure you want to delete this district?')) {
            await deleteDistrict(id);
        }
    };

    const openEditDistrictModal = (district) => {
        setEditingDistrict(district);
        setIsDistrictModalOpen(true);
    };

    const closeDistrictModal = () => {
        setIsDistrictModalOpen(false);
        setEditingDistrict(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            {/* Main Content */}
            <div className="md:ml-64">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 p-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold ml-13">Area Management</h1>
                        <div className="flex items-center space-x-4">
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search areas..."
                                    className="pl-10 w-[200px] md:w-[300px]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <div className="mt-4 md:hidden">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search areas..."
                                className="pl-10 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                {/* Area Content */}
                <main className="p-4 md:p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total States</CardTitle>
                                <Globe className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{states.length}</div>
                                <p className="text-xs text-muted-foreground">All states</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Cities</CardTitle>
                                <Building className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{cities.length}</div>
                                <p className="text-xs text-muted-foreground">All cities</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Districts</CardTitle>
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{districts.length}</div>
                                <p className="text-xs text-muted-foreground">All districts</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Areas</CardTitle>
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{allAreas.length}</div>
                                <p className="text-xs text-muted-foreground">Complete hierarchy</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs for different views */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="hierarchy">Hierarchy View</TabsTrigger>
                            <TabsTrigger value="states">States</TabsTrigger>
                            <TabsTrigger value="cities">Cities</TabsTrigger>
                            <TabsTrigger value="districts">Districts</TabsTrigger>
                        </TabsList>

                        {/* Hierarchy View */}
                        <TabsContent value="hierarchy" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Area Hierarchy</CardTitle>
                                    <CardDescription>
                                        {loading ? 'Loading...' : `${filteredAreas.length} areas found`}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {error && (
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                            {error}
                                        </div>
                                    )}

                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>District</TableHead>
                                                    <TableHead>City</TableHead>
                                                    <TableHead>State</TableHead>
                                                    <TableHead>Hierarchy</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {loading ? (
                                                    Array.from({ length: 5 }).map((_, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                                            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : filteredAreas.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                            {searchQuery ? 'No areas found matching your search' : 'No areas found. Create your first area!'}
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredAreas.map((area) => (
                                                        <TableRow key={area._id}>
                                                            <TableCell className="font-medium">
                                                                {area.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {area.cityId?.name || 'N/A'}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline">
                                                                    {area.cityId?.stateId?.code || 'N/A'}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center text-sm text-muted-foreground">
                                                                    <span>{area.name}</span>
                                                                    <ChevronRight className="h-3 w-3 mx-1" />
                                                                    <span>{area.cityId?.name}</span>
                                                                    <ChevronRight className="h-3 w-3 mx-1" />
                                                                    <span>{area.cityId?.stateId?.name}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                                            <MoreVertical className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem
                                                                            className="gap-2"
                                                                            onClick={() => openEditDistrictModal(area)}
                                                                        >
                                                                            <Edit className="h-4 w-4" /> Edit
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            className="gap-2 text-red-600"
                                                                            onClick={() => area._id && handleDeleteDistrict(area._id)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" /> Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* States Tab */}
                        <TabsContent value="states" className="space-y-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>States</CardTitle>
                                        <CardDescription>
                                            {loading ? 'Loading...' : `${filteredStates.length} states found`}
                                        </CardDescription>
                                    </div>
                                    <Button onClick={() => setIsStateModalOpen(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add State
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>State Name</TableHead>
                                                    <TableHead>Code</TableHead>
                                                    <TableHead>ID</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {loading ? (
                                                    Array.from({ length: 5 }).map((_, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : filteredStates.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                            {searchQuery ? 'No states found matching your search' : 'No states found. Create your first state!'}
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredStates.map((state) => (
                                                        <TableRow key={state._id}>
                                                            <TableCell className="font-medium">
                                                                {state.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline">{state.code}</Badge>
                                                            </TableCell>
                                                            <TableCell className="text-muted-foreground text-sm">
                                                                {state._id?.substring(0, 8)}...
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                                            <MoreVertical className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem
                                                                            className="gap-2"
                                                                            onClick={() => openEditStateModal(state)}
                                                                        >
                                                                            <Edit className="h-4 w-4" /> Edit
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            className="gap-2 text-red-600"
                                                                            onClick={() => state._id && handleDeleteState(state._id)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" /> Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Cities Tab */}
                        <TabsContent value="cities" className="space-y-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Cities</CardTitle>
                                        <CardDescription>
                                            {loading ? 'Loading...' : `${filteredCities.length} cities found`}
                                        </CardDescription>
                                    </div>
                                    <Button onClick={() => setIsCityModalOpen(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add City
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>City Name</TableHead>
                                                    <TableHead>State</TableHead>
                                                    <TableHead>ID</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {loading ? (
                                                    Array.from({ length: 5 }).map((_, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : filteredCities.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                            {searchQuery ? 'No cities found matching your search' : 'No cities found. Create your first city!'}
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredCities.map((city) => (
                                                        <TableRow key={city._id}>
                                                            <TableCell className="font-medium">
                                                                {city.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline">
                                                                    {city.stateId?.name} ({city.stateId?.code})
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-muted-foreground text-sm">
                                                                {city._id?.substring(0, 8)}...
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                                            <MoreVertical className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem
                                                                            className="gap-2"
                                                                            onClick={() => openEditCityModal(city)}
                                                                        >
                                                                            <Edit className="h-4 w-4" /> Edit
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            className="gap-2 text-red-600"
                                                                            onClick={() => city._id && handleDeleteCity(city._id)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" /> Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Districts Tab */}
                        <TabsContent value="districts" className="space-y-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Districts</CardTitle>
                                        <CardDescription>
                                            {loading ? 'Loading...' : `${filteredDistricts.length} districts found`}
                                        </CardDescription>
                                    </div>
                                    <Button onClick={() => setIsDistrictModalOpen(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add District
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>District Name</TableHead>
                                                    <TableHead>City</TableHead>
                                                    <TableHead>State</TableHead>
                                                    <TableHead>ID</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {loading ? (
                                                    Array.from({ length: 5 }).map((_, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : filteredDistricts.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                            {searchQuery ? 'No districts found matching your search' : 'No districts found. Create your first district!'}
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredDistricts.map((district) => (
                                                        <TableRow key={district._id}>
                                                            <TableCell className="font-medium">
                                                                {district.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {district.cityId?.name || 'N/A'}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline">
                                                                    {district.cityId?.stateId?.code || 'N/A'}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-muted-foreground text-sm">
                                                                {district._id?.substring(0, 8)}...
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                                            <MoreVertical className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem
                                                                            className="gap-2"
                                                                            onClick={() => openEditDistrictModal(district)}
                                                                        >
                                                                            <Edit className="h-4 w-4" /> Edit
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            className="gap-2 text-red-600"
                                                                            onClick={() => district._id && handleDeleteDistrict(district._id)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" /> Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>

            {/* Modals */}
            <StateModal
                isOpen={isStateModalOpen}
                onClose={closeStateModal}
                onSubmit={editingState ? handleUpdateState : handleCreateState}
                initialData={editingState}
                loading={loading}
            />

            <CityModal
                isOpen={isCityModalOpen}
                onClose={closeCityModal}
                onSubmit={editingCity ? handleUpdateCity : handleCreateCity}
                initialData={editingCity}
                states={states}
                loading={loading}
            />

            <DistrictModal
                isOpen={isDistrictModalOpen}
                onClose={closeDistrictModal}
                onSubmit={editingDistrict ? handleUpdateDistrict : handleCreateDistrict}
                initialData={editingDistrict}
                cities={cities}
                loading={loading}
            />
        </div>
    );
}
