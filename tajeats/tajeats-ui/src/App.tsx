import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedRoutes from "@/AnimatedRoutes";

const queryClient = new QueryClient();

const App = () => (
    <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <AuthProvider>
                    <DataProvider>
                        <CartProvider>
                            <Toaster />
                            <Sonner />
                            <BrowserRouter>
                                <Header />
                                <AnimatedRoutes />
                                <Footer />
                            </BrowserRouter>
                        </CartProvider>
                    </DataProvider>
                </AuthProvider>
            </TooltipProvider>
        </QueryClientProvider>
    </ErrorBoundary>
);

export default App;