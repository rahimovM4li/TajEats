import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Pages
import Landing from "./pages/Landing.tsx";
import Restaurants from "./pages/Restaurants.tsx";
import RestaurantDetail from "./pages/RestaurantDetail.tsx";
import Cart from "./pages/Cart.tsx";
import Checkout from "./pages/Checkout.tsx";
import OrderStatus from "./pages/OrderStatus.tsx";
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import BecomeRider from "./pages/BecomeRider.tsx";

// Restaurant Portal
import RestaurantLogin from "./pages/restaurant/RestaurantLogin.tsx";
import RestaurantDashboard from "./pages/restaurant/RestaurantDashboard.tsx";

// Admin Portal
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";

import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <AuthProvider>
                <DataProvider>
                    <CartProvider>
                        <Toaster />
                        <Sonner />
                        <BrowserRouter>
                            <Header />
                            <Routes>
                                {/* Customer Routes */}
                                <Route path="/" element={<Landing />} />
                                <Route path="/restaurants" element={<Restaurants />} />
                                <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/checkout" element={<Checkout />} />
                                <Route path="/order-status/:orderId" element={<OrderStatus />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/become-rider" element={<BecomeRider />} />

                                {/* Restaurant Portal */}
                                <Route path="/restaurant" element={<RestaurantLogin />} />
                                <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />

                                {/* Admin Portal */}
                                <Route path="/admin" element={<AdminLogin />} />
                                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                                {/* 404 - Keep this last */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                            <Footer />
                        </BrowserRouter>
                    </CartProvider>
                </DataProvider>
            </AuthProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;