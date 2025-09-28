import Logo from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Package,
    ShoppingCart,
    Users,
    LineChart,
    Menu,
    X,
    LogOut,
    Folder,
    MapPin,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useAuthStore from "@/store/auth";
import { useState } from "react";

export function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const { isAuthenticated } = useAuthStore();

    // Check if current route is admin
    const isAdminRoute = location.pathname.includes('/admin');
    console.log("isAdminRoute", isAdminRoute)

    return (<>
        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
            <div
                className="fixed inset-0 bg-white/10 backdrop-blur-sm bg-opacity-50 z-30 md:hidden"
                onClick={() => setSidebarOpen(false)}
            />
        )}
        {/* Mobile Navigation Button */}
        <button
            className="md:hidden fixed top-[12px] left-4 z-50 p-2 rounded-md bg-white shadow-md"
            onClick={() => setSidebarOpen(!sidebarOpen)}
        >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Navigation Sidebar */}
        <div className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transform
                 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 transition-transform duration-200 ease-in-out z-40`}
        >
            <Logo className="absolute bottom-2 left-2" />
            <div className="p-5 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold ml-12">
                        {isAdminRoute ? 'Admin Panel' : 'My Shop'}
                    </span>
                </div>
            </div>
            <nav className="p-4 space-y-1">
                {isAdminRoute ? (
                    // Admin Navigation
                    <>
                        <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate("/admin/categories")}>
                            <Folder className="h-4 w-4" /> Categories
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate("/admin/area")}>
                            <MapPin className="h-4 w-4" /> Area Management
                        </Button>
                    </>
                ) : (
                    // Shop Navigation
                    <>
                        <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate("/shop/dashboard")}>
                            <LineChart className="h-4 w-4" /> Dashboard
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate("/shop/products")}>
                            <Package className="h-4 w-4" /> Products
                        </Button>
                        <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate("/shop/orders")}>
                            <ShoppingCart className="h-4 w-4" /> Orders
                        </Button>
                    </>
                )}
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 mt-4 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                        logout();
                        navigate('/');
                    }}
                >
                    <LogOut className="h-4 w-4" /> {isAuthenticated ? 'Logout' : 'Back to Home'}
                </Button>
            </nav>
        </div>
    </>)
}