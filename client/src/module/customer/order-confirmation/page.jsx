import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Package, ArrowLeft, Home } from "lucide-react";
import { useEffect, useState } from "react";
import useCustomerStore from "../../../store/customer";

export function OrderConfirmationPage() {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [orderData, setOrderData] = useState(null);
    const { shop } = useCustomerStore();

    useEffect(() => {
        // Get order data from navigation state
        if (location.state?.orderData) {
            setOrderData(location.state.orderData);
        } else {
            // If no order data, redirect to shop page
            navigate(`/customer/shop/${shopId}`);
        }
    }, [location.state, navigate, shopId]);

    if (!orderData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading order details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/customer/shop/${shopId}`)}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Shop
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/')}
                    >
                        <Home className="h-4 w-4 mr-2" />
                        Home
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Success Message */}
                    <Card className="text-center">
                        <CardContent className="pt-6">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-green-700 mb-2">
                                Order Placed Successfully!
                            </h1>
                            <p className="text-muted-foreground">
                                Thank you for your order. We'll prepare it with care.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Order Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Order Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Order ID</p>
                                    <p className="font-medium">{orderData.order_id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-orange-500" />
                                        <span className="font-medium text-orange-600 capitalize">
                                            {orderData.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <p className="text-sm text-muted-foreground">Shop</p>
                                <p className="font-medium">{shop?.shop_name || 'Shop Name'}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Total Amount</p>
                                <p className="text-2xl font-bold text-green-600">
                                    ₹{orderData.total_amount?.toFixed(2)}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Order Time</p>
                                <p className="font-medium">
                                    {new Date(orderData.created_at).toLocaleString('en-IN', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short'
                                    })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Next Steps */}
                    <Card>
                        <CardHeader>
                            <CardTitle>What's Next?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                                        1
                                    </div>
                                    <div>
                                        <p className="font-medium">Order Confirmation</p>
                                        <p className="text-sm text-muted-foreground">
                                            The shop will confirm your order shortly
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm font-medium">
                                        2
                                    </div>
                                    <div>
                                        <p className="font-medium">Preparation</p>
                                        <p className="text-sm text-muted-foreground">
                                            Your order will be prepared with care
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm font-medium">
                                        3
                                    </div>
                                    <div>
                                        <p className="font-medium">Ready for Pickup</p>
                                        <p className="text-sm text-muted-foreground">
                                            We'll notify you when your order is ready
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Button
                            onClick={() => navigate(`/customer/shop/${shopId}`)}
                            className="flex-1"
                        >
                            Continue Shopping
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/')}
                            className="flex-1"
                        >
                            Go Home
                        </Button>
                    </div>

                    {/* Contact Info */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center text-sm text-muted-foreground">
                                <p>Need help with your order?</p>
                                <p>Contact the shop directly or use our support chat.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
