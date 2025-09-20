// components/shop-access-modal.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Smartphone, Store, Search, ShoppingCart } from "lucide-react";
import { productsApi } from "@/services/api";
import useCustomerStore from "@/store/customer";
import toast from "react-hot-toast";

export function ShopAccessModal() {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState("options");
    const [shopCode, setShopCode] = useState("");
    const [loading, setLoading] = useState(false);
    const { setShop, setLoading: setStoreLoading, setError } = useCustomerStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!shopCode.trim()) {
            toast.error("Please enter a shop code");
            return;
        }

        setLoading(true);
        setStoreLoading(true);
        setError(null);

        try {
            const response = await productsApi.get(`/shops/by-code/${shopCode.trim()}`);
            const { shop } = response.data;

            // Save shop details to customer store
            setShop(shop);

            toast.success("Shop found! Redirecting...");

            // Navigate to shop page with shop ID
            navigate(`/customer/shop/${shop._id}`);
        } catch (error) {
            console.error('Error fetching shop:', error);
            const errorMessage = error.response?.data?.message || 'Failed to find shop with this code';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
            setStoreLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto gap-2 hover:bg-primary/5"
                >
                    <ShoppingCart className="h-4 w-4" />
                    I'm a Customer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {activeView === "options"
                            ? "Find a Shop"
                            : activeView === "code"
                                ? "Enter Shop Code"
                                : activeView === "qr"
                                    ? "Scan QR Code"
                                    : "Nearby Shops"}
                    </DialogTitle>
                </DialogHeader>

                {activeView === "options" ? (
                    <div className="grid gap-4 py-4">
                        {/* Shop Code Card */}
                        <div
                            className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                            onClick={() => setActiveView("code")}
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Smartphone className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Enter Shop Code</h3>
                                    <ul className="text-sm text-muted-foreground list-disc list-inside mt-1 space-y-1">
                                        <li>Quick access with shop's unique code</li>
                                        <li>Get code from shop owner</li>
                                        <li>Case-sensitive alphanumeric</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* QR Code Card */}
                        <div
                            className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                            onClick={() => setActiveView("qr")}
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <QrCode className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Scan QR Code</h3>
                                    <ul className="text-sm text-muted-foreground list-disc list-inside mt-1 space-y-1">
                                        <li>Scan shop's displayed QR code</li>
                                        <li>Fastest way to access</li>
                                        <li>Camera permission required</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Nearby Shops Card */}
                        <div
                            className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                            onClick={() => setActiveView("nearby")}
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Store className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Find Nearby Shops</h3>
                                    <ul className="text-sm text-muted-foreground list-disc list-inside mt-1 space-y-1">
                                        <li>Discover local businesses</li>
                                        <li>Location permission required</li>
                                        <li>Browse by category</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : activeView === "code" ? (
                    <div className="mt-4 space-y-4">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Shop Code</label>
                                <div className="relative">
                                    <Input
                                        placeholder="Enter shop code (e.g. SHOP-1234)"
                                        value={shopCode}
                                        onChange={(e) => setShopCode(e.target.value)}
                                    />
                                    <Store className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                            <Button type="submit" className="w-full mt-4" disabled={loading}>
                                {loading ? "Finding Shop..." : "Continue to Shop"}
                            </Button>
                        </form>
                        <div className="text-center text-sm text-muted-foreground">
                            <button
                                type="button"
                                className="text-primary hover:underline"
                                onClick={() => setActiveView("options")}
                            >
                                ← Back to options
                            </button>
                        </div>
                    </div>
                ) : activeView === "qr" ? (
                    <div className="mt-4 space-y-4">
                        <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center aspect-square">
                            <QrCode className="h-16 w-16 text-gray-400 mb-4" />
                            <p className="text-center text-muted-foreground">
                                QR Scanner will activate here
                            </p>
                            <Button variant="outline" className="mt-4">
                                Open Camera
                            </Button>
                        </div>
                        <div className="text-center text-sm text-muted-foreground">
                            <button
                                type="button"
                                className="text-primary hover:underline"
                                onClick={() => setActiveView("options")}
                            >
                                ← Back to options
                            </button>
                        </div>
                    </div>
                ) : (
                    // Nearby Shops View
                    <div className="mt-4 space-y-4">
                        <div className="relative">
                            <Input placeholder="Search nearby shops..." />
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>

                        <div className="border rounded-lg p-4 text-center">
                            <p className="text-muted-foreground mb-4">
                                For the best experience, explore all nearby shops in our full directory
                            </p>
                            <Button
                                className="w-full gap-2"
                                onClick={() => navigate('/customer/nearby-shops')}
                            >
                                <Store className="h-4 w-4" />
                                Explore Nearby Shops
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            <button
                                type="button"
                                className="text-primary hover:underline"
                                onClick={() => setActiveView("options")}
                            >
                                ← Back to options
                            </button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}