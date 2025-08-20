import { Button } from "@/components/ui/button";
import {
    Calendar,
    Package,
    ShoppingCart,
    Users,
    LineChart,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Sidebar() {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

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
            className="md:hidden fixed top-[15px] left-4 z-50 p-2 rounded-md bg-white shadow-md"
            onClick={() => setSidebarOpen(!sidebarOpen)}
        >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Navigation Sidebar */}
        <div className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transform
                 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 transition-transform duration-200 ease-in-out z-40`}
        >
            <div className="absolute bottom-2 left-2 w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
                FO
            </div>
            <div className="p-5 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold ml-12">My Shop</span>
                </div>
            </div>
            <nav className="p-4 space-y-1">
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate("/shop/dashboard")}>
                    <LineChart className="h-4 w-4" /> Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate("/shop/products")}>
                    <Package className="h-4 w-4" /> Products
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate("/shop/orders")}>
                    <ShoppingCart className="h-4 w-4" /> Orders
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2 bg-gray-800">
                    <Users className="h-4 w-4" /> Customers
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2 bg-gray-800">
                    <Calendar className="h-4 w-4" /> Analytics
                </Button>
            </nav>
        </div>
    </>)
}