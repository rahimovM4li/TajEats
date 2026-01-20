import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';

const Header: React.FC = () => {
    const location = useLocation();
    const { getTotalItems } = useCart();
    const totalItems = getTotalItems();

    // Don't show header on admin or restaurant portals
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/restaurant')) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full glass border-b border-border/40">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">T</span>
                        </div>
                        <span className="text-2xl font-bold gradient-text">TajEats</span>
                    </Link>

                    {/* Search Bar - Hidden on mobile */}
                    <div className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search restaurants or dishes..."
                                className="pl-10 glass border-border/20"
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-4">
                        <Link to="/restaurants">
                            <Button variant="ghost" className="text-foreground hover:text-primary">
                                Restaurants
                            </Button>
                        </Link>

                        {/* Cart */}
                        <Link to="/cart" className="relative">
                            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                                <ShoppingCart className="w-5 h-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                                )}
                            </Button>
                        </Link>

                        {/* User Account */}
                        <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                            <User className="w-5 h-5" />
                        </Button>
                    </nav>
                </div>

                {/* Mobile Search Bar */}
                <div className="md:hidden mt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search restaurants or dishes..."
                            className="pl-10 glass border-border/20"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;