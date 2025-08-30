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
    MoreVertical,
    Plus,
    Search,
    Trash2,
    Edit,
    Folder,
    ChevronDown,
} from "lucide-react";
import { CategoryModal } from "./CategoryModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from '@/module/shopkeeper/_common/Sidebar';
import { useCategory } from '@/hooks/useCategory';

export function CategoriesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategory();

    const filteredCategories = categories.filter(
        (category) =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreate = async (data) => {
        await createCategory(data);
    };

    const handleUpdate = async (data) => {
        if (editingCategory?._id) {
            await updateCategory(editingCategory._id, data);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            await deleteCategory(id);
        }
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            {/* Main Content */}
            <div className="md:ml-64">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 p-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold ml-13">Categories</h1>
                        <div className="flex items-center space-x-4">
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search categories..."
                                    className="pl-10 w-[200px] md:w-[300px]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button onClick={() => setIsModalOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Category
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    <div className="mt-4 md:hidden">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search categories..."
                                className="pl-10 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                {/* Categories Content */}
                <main className="p-4 md:p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                                <Folder className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{categories.length}</div>
                                <p className="text-xs text-muted-foreground">All product categories</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
                                <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{categories.length}</div>
                                <p className="text-xs text-muted-foreground">Currently in use</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Filter Options</CardTitle>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full">
                                    Filter Categories
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Categories Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Categories</CardTitle>
                            <CardDescription>
                                {loading ? 'Loading...' : `${filteredCategories.length} categories found`}
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
                                            <TableHead>Category Name</TableHead>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            // Loading skeletons
                                            Array.from({ length: 5 }).map((_, index) => (
                                                <TableRow key={index}>
                                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : filteredCategories.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                    {searchQuery ? 'No categories found matching your search' : 'No categories found. Create your first category!'}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredCategories.map((category) => (
                                                <TableRow key={category._id}>
                                                    <TableCell className="font-medium">
                                                        {category.name}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {category._id?.substring(0, 8)}...
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="bg-green-100 text-green-800">
                                                            Active
                                                        </Badge>
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
                                                                    onClick={() => openEditModal(category)}
                                                                >
                                                                    <Edit className="h-4 w-4" /> Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="gap-2 text-red-600"
                                                                    onClick={() => category._id && handleDelete(category._id)}
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
                        <CardFooter className="flex justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing {filteredCategories.length} of {categories.length} categories
                            </div>
                            <div className="space-x-2">
                                <Button variant="outline" size="sm" disabled>
                                    Previous
                                </Button>
                                <Button variant="outline" size="sm" disabled>
                                    Next
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </main>
            </div>

            {/* Category Modal */}
            <CategoryModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={editingCategory ? handleUpdate : handleCreate}
                initialData={editingCategory}
                loading={loading}
            />
        </div>
    );
}