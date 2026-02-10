import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ProtectedRoute } from "@/components/ProtectedRoute";
import PageTransition from "@/components/PageTransition";

// Pages
import Landing from "./pages/Landing";
import Restaurants from "./pages/Restaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderStatus from "./pages/OrderStatus";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BecomeRider from "./pages/BecomeRider";
import CustomerRegister from "./pages/CustomerRegister";

// Restaurant Portal
import RestaurantLogin from "./pages/restaurant/RestaurantLogin";
import RestaurantRegister from "./pages/restaurant/RestaurantRegister";
import RestaurantDashboard from "./pages/restaurant/RestaurantDashboard";
import RestaurantSetup from "./pages/restaurant/RestaurantSetup";

// Admin Portal
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

import NotFound from "./pages/NotFound";

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Customer Routes */}
                <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
                <Route path="/restaurants" element={<PageTransition><Restaurants /></PageTransition>} />
                <Route path="/restaurant/:id" element={<PageTransition><RestaurantDetail /></PageTransition>} />
                <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
                <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
                <Route path="/order-status/:orderId" element={<PageTransition><OrderStatus /></PageTransition>} />
                <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                <Route path="/become-rider" element={<PageTransition><BecomeRider /></PageTransition>} />
                <Route path="/register" element={<PageTransition><CustomerRegister /></PageTransition>} />

                {/* Restaurant Portal */}
                <Route path="/restaurant" element={<PageTransition><RestaurantLogin /></PageTransition>} />
                <Route path="/restaurant/register" element={<PageTransition><RestaurantRegister /></PageTransition>} />
                <Route path="/restaurant/setup" element={
                    <ProtectedRoute requiredRole="restaurant">
                        <PageTransition><RestaurantSetup /></PageTransition>
                    </ProtectedRoute>
                } />
                <Route path="/restaurant/dashboard" element={
                    <ProtectedRoute requiredRole="restaurant">
                        <PageTransition><RestaurantDashboard /></PageTransition>
                    </ProtectedRoute>
                } />

                {/* Admin Portal */}
                <Route path="/admin" element={<PageTransition><AdminLogin /></PageTransition>} />
                <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute requiredRole="admin">
                        <PageTransition><AdminDashboard /></PageTransition>
                    </ProtectedRoute>
                } />

                {/* 404 - Keep this last */}
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;
